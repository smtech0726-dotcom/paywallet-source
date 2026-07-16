import express from "express";
import { scanQR } from "../
  controllers/qr.controller";

const router = express.Router();

router.post("/scan", scanQR);

export default router;
