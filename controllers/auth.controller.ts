import { Request, Response } from "express";
import md5 from "md5";
import { User } from "../models/user.model";
import { generateHelper } from "../helpers/generate.helper";
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
  req.flash("success", "Đăng nhập thành công!");

  res.redirect("/");
};

export const logout = async (req, res) => {
  res.clearCookie("tokenUser");
  req.flash("success", "Đã đăng xuất!");
  res.redirect("/");
};
export const registerPost = async (req: Request, res: Response) => {
  const user = req.body;
  const existUser = await User.findOne({
    email: user.email,
    deleted: false,
  });
  if (existUser) {
    req.flash("error", "Email đã tồn tại trong hệ thống!");
    res.redirect("back");
    return;
  }
  const dataUser = {
    fullName: user.fullName,
    email: user.email,
    password: md5(user.password),
    token: generateHelper(30),
    status: "active",
    type_user: "basic",
  };
  const newUser = new User(dataUser);
  await newUser.save();
  res.cookie("tokenUser", newUser.token);
  req.flash("success", "Đăng ký tài khoản thành công!");
  res.redirect("/");
};