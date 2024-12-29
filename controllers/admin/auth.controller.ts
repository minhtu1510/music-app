import { Request, Response } from "express";
import { Account } from "../../models/account.model";
import md5 from "md5";
import { systemConfig } from "../../config/system";
export const login = (req: Request, res: Response) => {
  res.render("admin/pages/auth/login", {
    pageTitle: "Đăng nhập",
  });
};
export const loginPost = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await Account.findOne({
    email: email,
    deleted: false,
  });
  if (!user) {
    req.flash("error", "Email không tồn tại!");
    res.redirect("back");
    return;
  }
  if (md5(password) != user.password) {
    req.flash("error", "Sai mật khẩu!");
    res.redirect("back");
    return;
  }
  if (user.status != "active") {
    req.flash("error", "Tài khoản đang bị khóa!");
    res.redirect("back");
    return;
  }
  res.cookie("token", user.token);
  res.redirect(`/${systemConfig.prefixAdmin}/dashboard`);
};

export const logout = (req: Request, res: Response) => {
  res.clearCookie("token");
  res.redirect(`/${systemConfig.prefixAdmin}/auth/login`);
};
