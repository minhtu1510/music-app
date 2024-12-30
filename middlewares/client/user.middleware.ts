import { User } from "../../models/user.model";
import { NextFunction, Request, Response } from "express";
export const infoUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.cookies.tokenUser) {
    const user = await User.findOne({
      token: req.cookies.tokenUser,
      deleted: false,
      status: "active",
    });
    if (user) {
      res.locals.users = user;
    } else {
      res.redirect(`/auth/login`);
    }
  }

  next();
};
