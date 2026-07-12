import session, { type SessionOptions } from "express-session";

declare module "express-session" {
  interface SessionData {
    userId?: number;
  }
}

const sessionSecret = process.env.SESSION_SECRET || "dev-secret";

const sessionOptions: SessionOptions = {
  name: "paywallet.sid",
  secret: sessionSecret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  },
};

export const sessionMiddleware = session(sessionOptions);
