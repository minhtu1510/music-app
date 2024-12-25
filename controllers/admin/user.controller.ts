import { Request, Response } from "express";
import md5 from "md5";
import { Role } from "../../models/role.model";
import { User } from "../../models/user.model";
import { generateHelper } from "../../helpers/generate.helper";
import { systemConfig } from "../../config/system";
import { Song } from "../../models/song.model";
import { Singer } from "../../models/singer.model";
import { Topic } from "../../models/topic.model";
import { findSourceMap } from "module";
import unidecode from "unidecode";
export const index = async (req: Request, res: Response) => {
  const find: Record<string, any> = {
    deleted: false,
  };

  //Lọc theo trạng thái
  if (req.query.status) {
    find.status = req.query.status;
  }

  //Hết lọc theo trạng thái

  //Tìm kiếm
  if (req.query.keyword) {
    const keyword = `${req.query.keyword}`;
    let keywordRegex = keyword.trim();
    keywordRegex = keywordRegex.replace(/\s+/g, "-");
    keywordRegex = unidecode(keywordRegex);
    const slugRegex = new RegExp(keywordRegex, "i");

    find.slug = slugRegex;
  }

  //Hết tìm kiếm

  // Phân trang
  let limitSingers = 4;
  let page = 1;
  if (req.query.page) {
    page = parseInt(`${req.query.page}`);
  }
  //   if (req.query.limit) {
  //     limitSingers = parseInt(`${req.query.limit}`);
  //   }
  const skip = (page - 1) * limitSingers;
  const totalSinger = await User.countDocuments(find);
  const totalPage = Math.ceil(totalSinger / limitSingers);
  // Hết Phân trang
  const records = await User.find(find).limit(limitSingers).skip(skip);
  res.render("admin/pages/users/index", {
    pageTitle: "Tài khoản người dùng",
    records: records,
    totalPage: totalPage,
    currentPage: page,
    limit: limitSingers,
  });
};

export const create = async (req: Request, res: Response) => {
  res.render("admin/pages/users/create", {
    pageTitle: "Tạo tài khoản người dùng",
  });
};
export const createPost = async (req: Request, res: Response) => {
  req.body.password = md5(req.body.password);
  req.body.token = generateHelper(30);

  const account = new User(req.body);
  await account.save();
  res.redirect(`/${systemConfig.prefixAdmin}/users`);
};

export const changeStatus = async (req: Request, res: Response) => {
  const id = req.body.id;
  const status = req.body.status;
  await User.updateOne(
    {
      _id: id,
    },
    {
      status: status,
    }
  );
  req.flash("success", "Đổi trạng thái thành công!");
  res.json({
    code: "success",
    message: "Đổi trạng thái thành công",
  });
};

export const changeMulti = async (req: Request, res: Response) => {
  const ids = req.body.ids;
  const status = req.body.status;
  await User.updateMany(
    {
      _id: ids,
    },
    {
      status: status,
    }
  );
  req.flash("success", "Đổi trạng thái thành công!");
  res.json({
    code: "success",
    message: "Đổi trạng thái thành công",
  });
};

export const edit = async (req, res) => {
  const account = await User.findOne({
    _id: req.params.id,
    deleted: false,
  });
  res.render("admin/pages/users/edit", {
    pageTitle: "Chỉnh sửa tài khoản người dùng",
    account: account,
  });
};
export const editPatch = async (req, res) => {
  await User.updateOne(
    {
      _id: req.params.id,
      deleted: false,
    },
    req.body
  );
  req.flash("success", "Cập nhật thành công!");
  res.redirect(`back`);
};

export const deletee = async (req: Request, res: Response) => {
  await User.deleteOne({
    _id: req.body.id,
  });
};

export const deletePatch = async (req: Request, res: Response) => {
  await User.updateOne(
    {
      _id: req.body.id,
    },
    {
      deleted: true,
    }
  );
  req.flash("success", "Xóa thành công!");
  res.json({
    code: "success",
    message: "Xóa thành công !!!",
  });
};

export const detail = async (req, res) => {
  if (res.locals.role.permissions.includes("users_view")) {
    const account = await User.findOne({
      _id: req.params.id,
      deleted: false,
    });
    res.render("admin/pages/users/detail", {
      pageTitle: "Chi tiết tài khoản người dùng",
      account: account,
    });
  } else {
    req.flash("error", "Không có quyền truy cập");
  }
};

export const changePassword = async (req, res) => {
  const account = await User.findOne({
    _id: req.params.id,
    deleted: false,
  });
  res.render("admin/pages/accounts/change-password", {
    pageTitle: "Đổi mật khẩu",
    account: account,
  });
};
export const changePasswordPatch = async (req, res) => {
  await User.updateOne(
    {
      _id: req.params.id,
      deleted: false,
    },
    {
      password: md5(req.body.password),
    }
  );
  req.flash("success", "Cập nhật mật khẩu thành công!");
  res.redirect(`/${systemConfig.prefixAdmin}/users`);
};

export const changeType = async (req: Request, res: Response) => {
  const id = req.body.id;
  const type = req.body.type_user;
  await User.updateOne(
    {
      _id: id,
    },
    {
      type_user: type,
    }
  );
  req.flash("success", "Đổi loại thành công!");
  res.json({
    code: "success",
    message: "Đổi loại thành công",
  });
};
