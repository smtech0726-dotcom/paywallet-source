import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import walletRouter from "./wallet";
import transactionsRouter from "./transactions";
import transfersRouter from "./transfers";
import contactsRouter from "./contacts";
import billersRouter from "./billers";
import dashboardRouter from "./dashboard";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(walletRouter);
router.use(transactionsRouter);
router.use(transfersRouter);
router.use(contactsRouter);
router.use(billersRouter);
router.use(dashboardRouter);

export default router;
