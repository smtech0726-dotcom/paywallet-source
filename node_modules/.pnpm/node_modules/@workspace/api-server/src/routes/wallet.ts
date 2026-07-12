import { Router, type IRouter } from "express";
import { db, transactionsTable } from "@workspace/db";
import { AddMoneyBody, AddMoneyResponse, GetWalletResponse } from "@workspace/api-zod";
import { getOrCreateWallet, adjustWalletBalance } from "../lib/wallet";
import { requireAuth } from "../middlewares/requireAuth";

const router: IRouter = Router();

router.get("/wallet", requireAuth, async (req, res): Promise<void> => {
  const wallet = await getOrCreateWallet(req.session.userId!);
  res.json(GetWalletResponse.parse({ balanceCents: wallet.balanceCents }));
});

router.post("/wallet/add-money", requireAuth, async (req, res): Promise<void> => {
  const parsed = AddMoneyBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const userId = req.session.userId!;
  const { amountCents, method } = parsed.data;

  const wallet = await adjustWalletBalance(userId, amountCents);
  const [transaction] = await db
    .insert(transactionsTable)
    .values({
      userId,
      type: "add_money",
      amountCents,
      status: "success",
      category: "Add Money",
      note: method,
    })
    .returning();

  res.json(AddMoneyResponse.parse({ wallet, transaction }));
});

export default router;
