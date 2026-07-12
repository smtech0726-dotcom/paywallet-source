import { Router, type IRouter } from "express";
import { desc, eq } from "drizzle-orm";
import { db, transactionsTable } from "@workspace/db";
import { GetDashboardSummaryResponse } from "@workspace/api-zod";
import { getOrCreateWallet } from "../lib/wallet";
import { requireAuth } from "../middlewares/requireAuth";

const SPEND_TYPES = new Set(["transfer_out", "recharge", "bill_payment"]);
const ADD_TYPES = new Set(["add_money", "transfer_in"]);

const routerInstance: IRouter = Router();

routerInstance.get("/dashboard/summary", requireAuth, async (req, res): Promise<void> => {
  const userId = req.session.userId!;
  const wallet = await getOrCreateWallet(userId);

  const allTransactions = await db
    .select()
    .from(transactionsTable)
    .where(eq(transactionsTable.userId, userId))
    .orderBy(desc(transactionsTable.createdAt))
    .limit(500);

  let totalAddedCents = 0;
  let totalSpentCents = 0;
  const spendByCategoryMap = new Map<string, number>();

  for (const tx of allTransactions) {
    if (ADD_TYPES.has(tx.type)) {
      totalAddedCents += tx.amountCents;
    } else if (SPEND_TYPES.has(tx.type)) {
      totalSpentCents += tx.amountCents;
      const category = tx.category ?? "Other";
      spendByCategoryMap.set(
        category,
        (spendByCategoryMap.get(category) ?? 0) + tx.amountCents,
      );
    }
  }

  const spendByCategory = Array.from(spendByCategoryMap.entries()).map(
    ([category, totalCents]) => ({ category, totalCents }),
  );

  res.json(
    GetDashboardSummaryResponse.parse({
      balanceCents: wallet.balanceCents,
      totalAddedCents,
      totalSpentCents,
      recentTransactions: allTransactions.slice(0, 10),
      spendByCategory,
    }),
  );
});

export default routerInstance;
