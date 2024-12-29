import { NextFunction, Request, Response } from "express";
import { systemConfig } from "../../config/system";
import { Account } from "../../models/account.model";
import { Role } from "../../models/role.model";
export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.cookies.token) {
    res.redirect(`/${systemConfig.prefixAdmin}/auth/login`);
    return;
  }
  const user = await Account.findOne({
    token: req.cookies.token,
    deleted: false,
    status: "active",
  });
  if (!user) {
    res.clearCookie("token");
    res.redirect(`/${systemConfig.prefixAdmin}/auth/login`);
    return;
  }
  const role = await Role.findOne({
    _id: user.role_id,
    deleted: false,
  });
  res.locals.user = user;
  res.locals.role = role;
  next();
};
