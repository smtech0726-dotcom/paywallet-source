import { Router, type IRouter } from "express";
import { and, desc, eq, gt } from "drizzle-orm";
import { db, usersTable, otpsTable } from "@workspace/db";
import {
  RequestOtpBody,
  RequestOtpResponse,
  VerifyOtpBody,
  VerifyOtpResponse,
  GetCurrentSessionResponse,
} from "@workspace/api-zod";
import { generateOtpCode, normalizePhone, OTP_TTL_SECONDS } from "../lib/otp";
import { getOrCreateWallet } from "../lib/wallet";
import { requireAuth } from "../middlewares/requireAuth";

const router: IRouter = Router();

router.post("/auth/request-otp", async (req, res): Promise<void> => {
  const parsed = RequestOtpBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const phone = normalizePhone(parsed.data.phone);
  const code = generateOtpCode();
  const expiresAt = new Date(Date.now() + OTP_TTL_SECONDS * 1000);

  await db.insert(otpsTable).values({ phone, code, expiresAt });

  req.log.info({ phone }, "OTP requested (simulated)");

  res.json(
    RequestOtpResponse.parse({
      phone,
      otp: code,
      expiresInSeconds: OTP_TTL_SECONDS,
    }),
  );
});

router.post("/auth/verify-otp", async (req, res): Promise<void> => {
  const parsed = VerifyOtpBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const phone = normalizePhone(parsed.data.phone);
  const { otp, name } = parsed.data;

  const [otpRow] = await db
    .select()
    .from(otpsTable)
    .where(
      and(
        eq(otpsTable.phone, phone),
        eq(otpsTable.code, otp),
        eq(otpsTable.consumed, false),
        gt(otpsTable.expiresAt, new Date()),
      ),
    )
    .orderBy(desc(otpsTable.createdAt))
    .limit(1);

  if (!otpRow) {
    res.status(400).json({ error: "Invalid or expired code" });
    return;
  }

  await db
    .update(otpsTable)
    .set({ consumed: true })
    .where(eq(otpsTable.id, otpRow.id));

  let [user] = await db.select().from(usersTable).where(eq(usersTable.phone, phone));

  if (!user) {
    const [created] = await db
      .insert(usersTable)
      .values({ phone, name: name?.trim() || `User ${phone.slice(-4)}` })
      .returning();
    user = created;
  }

  const wallet = await getOrCreateWallet(user.id);

  req.session.userId = user.id;

  res.json(VerifyOtpResponse.parse({ user, wallet }));
});

router.get("/auth/me", requireAuth, async (req, res): Promise<void> => {
  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, req.session.userId!));

  if (!user) {
    req.session.destroy(() => {});
    res.status(401).json({ error: "Not logged in" });
    return;
  }

  const wallet = await getOrCreateWallet(user.id);

  res.json(GetCurrentSessionResponse.parse({ user, wallet }));
});

router.post("/auth/logout", (req, res): void => {
  req.session.destroy(() => {
    res.sendStatus(204);
  });
});

export default router;
