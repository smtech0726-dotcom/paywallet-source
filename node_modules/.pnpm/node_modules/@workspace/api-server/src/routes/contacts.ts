import { Router, type IRouter } from "express";
import { and, eq } from "drizzle-orm";
import { db, contactsTable } from "@workspace/db";
import {
  ListContactsResponse,
  CreateContactBody,
  CreateContactResponse,
  DeleteContactParams,
} from "@workspace/api-zod";
import { requireAuth } from "../middlewares/requireAuth";

const router: IRouter = Router();

router.get("/contacts", requireAuth, async (req, res): Promise<void> => {
  const rows = await db
    .select()
    .from(contactsTable)
    .where(eq(contactsTable.userId, req.session.userId!));

  res.json(ListContactsResponse.parse(rows));
});

router.post("/contacts", requireAuth, async (req, res): Promise<void> => {
  const parsed = CreateContactBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [contact] = await db
    .insert(contactsTable)
    .values({ ...parsed.data, userId: req.session.userId! })
    .returning();

  res.status(201).json(CreateContactResponse.parse(contact));
});

router.delete("/contacts/:id", requireAuth, async (req, res): Promise<void> => {
  const params = DeleteContactParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [deleted] = await db
    .delete(contactsTable)
    .where(
      and(
        eq(contactsTable.id, params.data.id),
        eq(contactsTable.userId, req.session.userId!),
      ),
    )
    .returning();

  if (!deleted) {
    res.status(404).json({ error: "Contact not found" });
    return;
  }

  res.sendStatus(204);
});

export default router;
