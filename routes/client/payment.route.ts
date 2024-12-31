import express from "express";
const router = express.Router();

import * as controller from "../../controllers/payment.controller";

router.get("/", controller.index);
router.post("/", controller.payment);
router.post("/receive-hook", controller.receiveHook);

export const paymentRoute = router;
