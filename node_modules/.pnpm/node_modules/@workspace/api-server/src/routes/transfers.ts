import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, usersTable, walletsTable, transactionsTable } from "@workspace/db";
import {
  CreateTransferBody,
  CreateTransferResponse,
  LookupUserQueryParams,
  LookupUserResponse,
} from "@workspace/api-zod";
import { normalizePhone } from "../lib/otp";
import { getOrCreateWallet } from "../lib/wallet";
import { requireAuth } from "../middlewares/requireAuth";

const router: IRouter = Router();

router.get("/users/lookup", requireAuth, async (req, res): Promise<void> => {
  const query = LookupUserQueryParams.safeParse(req.query);
  if (!query.success) {
    res.status(400).json({ error: query.error.message });
    return;
  }

  const phone = normalizePhone(query.data.phone);
  const [user] = await db.select().from(usersTable).where(eq(usersTable.phone, phone));

  if (!user) {
    res.status(404).json({ error: "No user with that phone number" });
    return;
  }

  res.json(LookupUserResponse.parse({ name: user.name, phone: user.phone }));
});

router.post("/transfers", requireAuth, async (req, res): Promise<void> => {
  const parsed = CreateTransferBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const senderId = req.session.userId!;
  const { amountCents, note } = parsed.data;
  const toPhone = normalizePhone(parsed.data.toPhone);

  const [sender] = await db.select().from(usersTable).where(eq(usersTable.id, senderId));
  const [recipient] = await db.select().from(usersTable).where(eq(usersTable.phone, toPhone));

  if (!recipient) {
    res.status(400).json({ error: "No user found with that phone number" });
    return;
  }

  if (recipient.id === senderId) {
    res.status(400).json({ error: "You cannot send money to yourself" });
    return;
  }

  const senderWallet = await getOrCreateWallet(senderId);
  if (senderWallet.balanceCents < amountCents) {
    res.status(400).json({ error: "Insufficient balance" });
    return;
  }

  await getOrCreateWallet(recipient.id);

  const result = await db.transaction(async (tx) => {
    const [updatedSenderWallet] = await tx
      .update(walletsTable)
      .set({ balanceCents: senderWallet.balanceCents - amountCents })
      .where(eq(walletsTable.userId, senderId))
      .returning();

    const [recipientWallet] = await tx
      .select()
      .from(walletsTable)
      .where(eq(walletsTable.userId, recipient.id));

    await tx
      .update(walletsTable)
      .set({ balanceCents: recipientWallet.balanceCents + amountCents })
      .where(eq(walletsTable.userId, recipient.id));

    const [senderTransaction] = await tx
      .insert(transactionsTable)
      .values({
        userId: senderId,
        type: "transfer_out",
        amountCents,
        status: "success",
        counterpartyName: recipient.name,
        counterpartyPhone: recipient.phone,
        category: "Sent to " + recipient.name,
        note: note ?? null,
      })
      .returning();

    await tx.insert(transactionsTable).values({
      userId: recipient.id,
      type: "transfer_in",
      amountCents,
      status: "success",
      counterpartyName: sender?.name ?? "Unknown",
      counterpartyPhone: sender?.phone ?? null,
      category: "Received from " + (sender?.name ?? "Unknown"),
      note: note ?? null,
    });

    return { wallet: updatedSenderWallet, transaction: senderTransaction };
  });

  res.json(CreateTransferResponse.parse(result));
});

export default router;
