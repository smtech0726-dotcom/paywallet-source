import path from 'path';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

import runtimeErrorOverlay from '@replit/vite-plugin-runtime-error-modal';

const rawPort = process.env.FRONTEND_PORT || "3000";
const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid FRONTEND_PORT value: "${rawPort}"`);
}

const basePath = process.env.BASE_PATH || "/";

export default defineConfig({
  base: basePath,
  plugins: [
    react(),
    tailwindcss(),
    runtimeErrorOverlay(),
    ...(process.env.NODE_ENV !== 'production'
      ? [
          {
            name: 'dev-api-fallback',
            configureServer(server) {
              const sessions = new Map<string, { user: any; wallet: any }>();
              const users = new Map<string, { id: number; phone: string; name: string; createdAt: string }>();
              const wallets = new Map<number, { id: number; userId: number; balanceCents: number; createdAt: string }>();
              const transactions: Array<any> = [];
              let nextUserId = 1;
              let nextWalletId = 1;
              let nextTransactionId = 1;

              function parseJson(req: any) {
                return new Promise<any>((resolve) => {
                  let body = '';
                  req.on('data', (chunk) => (body += chunk));
                  req.on('end', () => {
                    try {
                      resolve(body ? JSON.parse(body) : {});
                    } catch {
                      resolve({});
                    }
                  });
                });
              }

              function sendJson(res: any, status: number, payload: any) {
                res.statusCode = status;
                res.setHeader('content-type', 'application/json');
                res.end(JSON.stringify(payload));
              }

              function getSessionCookie(req: any) {
                const cookie = req.headers.cookie || '';
                const match = cookie.match(/smtech_sid=([^;\s]+)/);
                return match?.[1];
              }

              server.middlewares.use(async (req, res, next) => {
                try {
                  const url = new URL(req.url || '/', 'http://127.0.0.1');
                  if (!url.pathname.startsWith('/api')) {
                    return next();
                  }

                  if (url.pathname === '/api/healthz') {
                    return sendJson(res, 200, { status: 'ok' });
                  }

                  if (url.pathname === '/api/auth/request-otp' && req.method === 'POST') {
                    const body = await parseJson(req);
                    const phone = String(body.phone || '').trim();
                    const otp = String(Math.floor(100000 + Math.random() * 900000));
                    sessions.set(phone, { user: null, wallet: null });
                    return sendJson(res, 200, { phone, otp, expiresInSeconds: 300 });
                  }

                  if (url.pathname === '/api/auth/verify-otp' && req.method === 'POST') {
                    const body = await parseJson(req);
                    const phone = String(body.phone || '').trim();
                    const otp = String(body.otp || '');
                    const stored = sessions.get(phone);
                    if (!stored) {
                      return sendJson(res, 400, { error: 'Invalid or expired code' });
                    }

                    const user = users.get(phone) || {
                      id: nextUserId++,
                      phone,
                      name: body.name || `User ${phone.slice(-4)}`,
                      createdAt: new Date().toISOString(),
                    };
                    users.set(phone, user);

                    let wallet = wallets.get(user.id);
                    if (!wallet) {
                      wallet = {
                        id: nextWalletId++,
                        userId: user.id,
                        balanceCents: 120000,
                        createdAt: new Date().toISOString(),
                      };
                      wallets.set(user.id, wallet);
                    }

                    const sessionId = `sess-${Math.random().toString(36).slice(2)}`;
                    sessions.set(sessionId, { user, wallet });
                    res.setHeader('set-cookie', `smtech_sid=${sessionId}; Path=/; HttpOnly; SameSite=Lax`);
                    return sendJson(res, 200, { user, wallet });
                  }

                  if (url.pathname === '/api/auth/me' && req.method === 'GET') {
                    const sid = getSessionCookie(req);
                    const session = sid ? sessions.get(sid) : undefined;
                    if (!session?.user || !session.wallet) {
                      return sendJson(res, 401, { error: 'Not logged in' });
                    }
                    return sendJson(res, 200, { user: session.user, wallet: session.wallet });
                  }

                  if (url.pathname === '/api/auth/logout' && req.method === 'POST') {
                    const sid = getSessionCookie(req);
                    if (sid) {
                      sessions.delete(sid);
                    }
                    res.statusCode = 204;
                    return res.end();
                  }

                  if (url.pathname === '/api/wallet' && req.method === 'GET') {
                    const sid = getSessionCookie(req);
                    const session = sid ? sessions.get(sid) : undefined;
                    if (!session?.user) {
                      return sendJson(res, 401, { error: 'Not logged in' });
                    }
                    return sendJson(res, 200, { balanceCents: session.wallet.balanceCents });
                  }

                  if (url.pathname === '/api/wallet/add-money' && req.method === 'POST') {
                    const sid = getSessionCookie(req);
                    const session = sid ? sessions.get(sid) : undefined;
                    if (!session?.user) {
                      return sendJson(res, 401, { error: 'Not logged in' });
                    }
                    const body = await parseJson(req);
                    const amountCents = Number(body.amountCents || 0);
                    if (!Number.isFinite(amountCents) || amountCents < 100) {
                      return sendJson(res, 400, { error: 'Invalid amount' });
                    }
                    session.wallet.balanceCents += amountCents;
                    transactions.unshift({
                      id: nextTransactionId++,
                      userId: session.user.id,
                      type: 'add_money',
                      amountCents,
                      status: 'success',
                      category: 'Add Money',
                      note: body.method || 'wallet',
                      createdAt: new Date().toISOString(),
                    });
                    return sendJson(res, 200, { wallet: session.wallet, transaction: transactions[0] });
                  }

                  if (url.pathname === '/api/dashboard/summary' && req.method === 'GET') {
                    const sid = getSessionCookie(req);
                    const session = sid ? sessions.get(sid) : undefined;
                    if (!session?.user) {
                      return sendJson(res, 401, { error: 'Not logged in' });
                    }
                    const userTransactions = transactions.filter((tx) => tx.userId === session.user.id);
                    return sendJson(res, 200, {
                      balanceCents: session.wallet.balanceCents,
                      totalAddedCents: userTransactions.filter((tx) => tx.type === 'add_money').reduce((sum, tx) => sum + tx.amountCents, 0),
                      totalSpentCents: userTransactions.filter((tx) => tx.type === 'transfer_out' || tx.type === 'recharge' || tx.type === 'bill_payment').reduce((sum, tx) => sum + tx.amountCents, 0),
                      recentTransactions: userTransactions.slice(0, 10),
                      spendByCategory: [],
                    });
                  }

                  if (url.pathname === '/api/transactions' && req.method === 'GET') {
                    const sid = getSessionCookie(req);
                    const session = sid ? sessions.get(sid) : undefined;
                    if (!session?.user) {
                      return sendJson(res, 401, { error: 'Not logged in' });
                    }
                    const userTransactions = transactions.filter((tx) => tx.userId === session.user.id);
                    return sendJson(res, 200, userTransactions.slice(0, 20));
                  }

                  if (url.pathname === '/api/transfers' && req.method === 'POST') {
                    const sid = getSessionCookie(req);
                    const session = sid ? sessions.get(sid) : undefined;
                    if (!session?.user) {
                      return sendJson(res, 401, { error: 'Not logged in' });
                    }
                    const body = await parseJson(req);
                    const amountCents = Number(body.amountCents || 0);
                    if (!Number.isFinite(amountCents) || amountCents <= 0) {
                      return sendJson(res, 400, { error: 'Invalid transfer' });
                    }
                    session.wallet.balanceCents -= amountCents;
                    transactions.unshift({
                      id: nextTransactionId++,
                      userId: session.user.id,
                      type: 'transfer_out',
                      amountCents,
                      status: 'success',
                      category: 'Transfers',
                      note: body.note || 'Transfer',
                      createdAt: new Date().toISOString(),
                    });
                    return sendJson(res, 200, { wallet: session.wallet, transaction: transactions[0] });
                  }

                  if (url.pathname === '/api/contacts' && req.method === 'GET') {
                    return sendJson(res, 200, []);
                  }

                  if (url.pathname === '/api/billers' && req.method === 'GET') {
                    return sendJson(res, 200, []);
                  }

                  return next();
                } catch {
                  return sendJson(res, 500, { error: 'Server error' });
                }
              });
            },
          },
        ]
      : []),
    ...(process.env.NODE_ENV !== 'production' &&
    process.env.REPL_ID !== undefined
      ? [
          await import('@replit/vite-plugin-cartographer').then((m) =>
            m.cartographer({
              root: path.resolve(import.meta.dirname, '..'),
            }),
          ),
          await import('@replit/vite-plugin-dev-banner').then((m) =>
            m.devBanner(),
          ),
        ]
      : []),
  ],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, 'src'),
      '@assets': path.resolve(
        import.meta.dirname,
        '..',
        '..',
        'attached_assets',
      ),
    },
    dedupe: ['react', 'react-dom'],
  },
  root: path.resolve(import.meta.dirname),
  build: {
    outDir: path.resolve(import.meta.dirname, 'dist/public'),
    emptyOutDir: true,
  },
  server: {
    port,
    strictPort: false,
    host: '0.0.0.0',
    allowedHosts: true,
    fs: {
      strict: true,
    },
    proxy: {
      '/api': {
        target: process.env.API_PROXY_TARGET || 'http://127.0.0.1:4000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  preview: {
    port,
    host: '0.0.0.0',
    allowedHosts: true,
  },
});
