import { Request, Response } from "express";
import md5 from "md5";
import { User } from "../models/user.model";
// export const index = async (req: Request, res: Response) => {
//   res.render("client/pages/auth/login");
// };
export const login = async (req: Request, res: Response) => {
  res.render("client/pages/auth/login");
};
export const register = async (req: Request, res: Response) => {
  res.render("client/pages/auth/register");
};

export const loginPost = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const existUser = await User.findOne({
    email: email,
    deleted: false,
  });
  if (!existUser) {
    req.flash("error", "Email không tồn tại trong hệ thống!");
    res.redirect("back");
    return;
  }
  if (md5(password) != existUser.password) {
    req.flash("error", "Sai mật khẩu!");
    res.redirect("back");
    return;
  }
  if (existUser.status != "active") {
    req.flash("error", "Tài khoản đang bị khóa!");
    res.redirect("back");
    return;
  }
  res.cookie("tokenUser", existUser.token);
  res.locals.users = existUser;
  req.flash("success", "Đăng nhập thành công!");

  res.redirect("/");
};

export const logout = async (req, res) => {
  res.clearCookie("tokenUser");
  req.flash("success", "Đã đăng xuất!");
  res.redirect("/");
};
