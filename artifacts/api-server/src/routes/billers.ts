import { Router, type IRouter } from "express";
import { db, transactionsTable } from "@workspace/db";
import {
  ListBillersQueryParams,
  ListBillersResponse,
  CreateRechargeBody,
  CreateRechargeResponse,
} from "@workspace/api-zod";
import { BILLERS, findBiller, categoryLabel } from "../lib/billers";
import { adjustWalletBalance, getOrCreateWallet } from "../lib/wallet";
import { requireAuth } from "../middlewares/requireAuth";

const router: IRouter = Router();

router.get("/billers", async (req, res): Promise<void> => {
  const query = ListBillersQueryParams.safeParse(req.query);
  if (!query.success) {
    res.status(400).json({ error: query.error.message });
    return;
  }

  const billers = query.data.category
    ? BILLERS.filter((b) => b.category === query.data.category)
    : BILLERS;

  res.json(ListBillersResponse.parse(billers));
});

router.post("/recharge", requireAuth, async (req, res): Promise<void> => {
  const parsed = CreateRechargeBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const userId = req.session.userId!;
  const { billerId, accountNumber, amountCents } = parsed.data;

  const biller = findBiller(billerId);
  if (!biller) {
    res.status(400).json({ error: "Unknown biller" });
    return;
  }

  const wallet = await getOrCreateWallet(userId);
  if (wallet.balanceCents < amountCents) {
    res.status(400).json({ error: "Insufficient balance" });
    return;
  }

  const updatedWallet = await adjustWalletBalance(userId, -amountCents);
  const [transaction] = await db
    .insert(transactionsTable)
    .values({
      userId,
      type: biller.category === "mobile_recharge" ? "recharge" : "bill_payment",
      amountCents,
      status: "success",
      counterpartyName: biller.name,
      category: categoryLabel(biller.category),
      note: accountNumber,
    })
    .returning();

  res.json(CreateRechargeResponse.parse({ wallet: updatedWallet, transaction }));
});

export default router;
