import { Request, Response } from "express";
import md5 from "md5";
import { User } from "../models/user.model";
import {
  generateHelper,
  generateRandomNumber,
} from "../helpers/generate.helper";
import { ForgotPassword } from "../models/forgot-password.model";
import { sendMail } from "../helpers/sendMail.helper";
// import passport from "passport";
// export const index = async (req: Request, res: Response) => {
//   res.render("client/pages/auth/login");
// };
export const login = async (req: Request, res: Response) => {
  res.render("client/pages/auth/login");
};
export const google = async (req: Request, res: Response) => {
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
  // console.log(newUser);
  res.cookie("tokenUser", newUser.token);
  req.flash("success", "Đăng ký tài khoản thành công!");
  res.redirect("/");
};

export const forgotPassword = async (req: Request, res: Response) => {
  res.render("client/pages/auth/forgot-password", {
    pageTitle: "Lấy lại mật khẩu",
  });
};
export const forgotPasswordPost = async (req: Request, res: Response) => {
  const email = req.body.email;
  const existUser = await User.findOne({
    email: email,
    status: "active",
    deleted: false,
  });
  if (!existUser) {
    req.flash("error", "Email không tồn tại!");
    res.redirect("back");
    return;
  }
  // Việc 1: Lưu email và mã OTP vào database
  const existEmailInForgotPassword = await ForgotPassword.findOne({
    email: email,
  });
  if (!existEmailInForgotPassword) {
    const otp = generateRandomNumber(6);
    const data = {
      email: email,
      otp: otp,
      expireAt: Date.now() + 5 * 60 * 1000,
    };

    const record = new ForgotPassword(data);
    await record.save();

    // Việc 2: Gửi mã OTP qua email cho user
    const subject = "Xác thực mã OTP";
    const text = `Mã xác thực của bạn là <b>${otp}</b>. Mã OTP có hiệu lực trong vòng 5 phút, vui lòng không cung cấp mã OTP cho bất kỳ ai.`;
    sendMail(email, subject, text);
  }
  res.redirect(`/auth/password/otp?email=${email}`);
};
export const otpPassword = async (req: Request, res: Response) => {
  const email = req.query.email;
  res.render("client/pages/auth/otp-password", {
    pageTitle: "Xác thực OTP",
    email: email,
  });
};
export const otpPasswordPost = async (req: Request, res: Response) => {
  const email = req.body.email;
  const otp = req.body.otp;
  const existRecord = await ForgotPassword.findOne({
    email: email,
    otp: otp,
  });
  if (!existRecord) {
    req.flash("error", "Mã OTP không hợp lệ!");
    res.redirect("back");
    return;
  }
  const user = await User.findOne({
    email: email,
  });
  res.cookie("tokenUser", user.token);
  res.redirect("/auth/password/reset");
};
export const resetPassword = async (req: Request, res: Response) => {
  res.render("client/pages/auth/reset-password", {
    pageTitle: "Đổi mật khẩu",
  });
};
export const resetPasswordPost = async (req: Request, res: Response) => {
  const password = req.body.password;
  const tokenUser = req.cookies.tokenUser;
  await User.updateOne(
    {
      token: tokenUser,
      status: "active",
      deleted: false,
    },
    {
      password: md5(password),
    }
  );
  req.flash("success", "Đổi mật khẩu thành công!");
  res.redirect("/");
};

export const profile = async (req: Request, res: Response) => {
  
    // Trả về trang profile và gửi dữ liệu người dùng
    res.render("client/pages/auth/profile", {
      pageTitle: "Thông tin tài khoản",
    });
  
};

export const profilePatch = async (req: Request, res: Response) => {
  const id = req.params.id;
  const { fullName, email } = req.body;

  try {
    const user = await User.findOne({ _id: id, deleted: false });

    if (!user) {
      req.flash("error", "Người dùng không tồn tại.");
      return res.redirect("/auth/login");
    }

    user.fullName = fullName;
    user.email = email;

    await user.save();

    req.flash("success", "Cập nhật thông tin thành công!");
    res.redirect(`/auth/profile/${id}`);  
  } catch (error) {
    console.error(error);
    req.flash("error", "Đã xảy ra lỗi khi cập nhật thông tin.");
    res.redirect(`/auth/profile/${id}`);  
  }
};
