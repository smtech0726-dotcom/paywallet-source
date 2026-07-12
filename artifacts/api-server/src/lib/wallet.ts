import { eq } from "drizzle-orm";
import { db, walletsTable, type Wallet } from "@workspace/db";

export async function getOrCreateWallet(userId: number): Promise<Wallet> {
  const [existing] = await db
    .select()
    .from(walletsTable)
    .where(eq(walletsTable.userId, userId));

  if (existing) {
    return existing;
  }

  const [created] = await db
    .insert(walletsTable)
    .values({ userId, balanceCents: 0 })
    .returning();

  return created;
}

export async function adjustWalletBalance(
  userId: number,
  deltaCents: number,
): Promise<Wallet> {
  const wallet = await getOrCreateWallet(userId);
  const [updated] = await db
    .update(walletsTable)
    .set({ balanceCents: wallet.balanceCents + deltaCents })
    .where(eq(walletsTable.userId, userId))
    .returning();

  return updated;
}
