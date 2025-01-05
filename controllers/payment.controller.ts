import { Request, Response } from "express";
import PayOS from "@payos/node";
import { generateHelper } from "../helpers/generate.helper";
import { User } from "../models/user.model";
const payos = new PayOS(
  process.env.PAY_CLIENT_ID,
  process.env.PAY_API_KEY,
  process.env.PAY_CHECKSUM_KEY
);
export const index = async (req: Request, res: Response) => {
  res.render("client/pages/payment/index", {});
};
export const payment = async (req: Request, res: Response) => {
  interface Order {
    amount: number;
    description: string;
    orderCode: number;
    returnUrl: string;
    cancelUrl: string;
  }
  const order: Order = {
    amount: 13000,
    description: String(res.locals.users.id),
    orderCode: Math.floor(Math.random() * 1000),
    returnUrl: `http://localhost:3000/`,
    cancelUrl: `http://localhost:3000/`,
  };
  const paymentLink = await payos.createPaymentLink(order);
  res.redirect(303, paymentLink.checkoutUrl);
};
//https://504f-113-185-49-36.ngrok-free.app/receive-hook
export const receiveHook = async (req: Request, res: Response) => {
  // console.log(req.body);
  if (req.body.data.desc == "success") {
    await User.updateOne(
      {
        _id: req.body.data.description,
      },
      {
        type_user: "premium",
      }
    );
  }
  res.json();
};
