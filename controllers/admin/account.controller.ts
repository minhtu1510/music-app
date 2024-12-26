import { Request, Response } from "express";
import md5 from "md5";
import { Role } from "../../models/role.model";
import { Account } from "../../models/account.model";
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
  const totalSinger = await Account.countDocuments(find);
  const totalPage = Math.ceil(totalSinger / limitSingers);
  // Hết Phân trang
  const records = await Account.find(find).limit(limitSingers).skip(skip);
  for (const item of records) {
    const role = await Role.findOne({
      _id: item.role_id,
      deleted: false,
    });
    item.role_title = role.title;
  }
  res.render("admin/pages/accounts/index", {
    pageTitle: "Tài khoản quản trị",
    records: records,
    totalPage: totalPage,
    currentPage: page,
    limit: limitSingers,
  });
};

export const create = async (req: Request, res: Response) => {
  const roles = await Role.find({
    deleted: false,
  });
  res.render("admin/pages/accounts/create", {
    pageTitle: "Tạo tài khoản quản trị",
    roles: roles,
  });
};
export const createPost = async (req: Request, res: Response) => {
  if (res.locals.role.permissions.includes("accounts_create")) {
    req.body.password = md5(req.body.password);
    req.body.token = generateHelper(30);

    const account = new Account(req.body);
    await account.save();
    res.redirect(`/${systemConfig.prefixAdmin}/accounts`);
  }
};

export const changeStatus = async (req: Request, res: Response) => {
  if (res.locals.role.permissions.includes("accounts_edit")) {
    const id = req.body.id;
    const status = req.body.status;
    await Account.updateOne(
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
  } else req.flash("error", "Không có quyền truy cập");
};

export const changeMulti = async (req: Request, res: Response) => {
  if (res.locals.role.permissions.includes("accounts_edit")) {
    const ids = req.body.ids;
    const status = req.body.status;
    await Account.updateMany(
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
  } else req.flash("error", "Không có quyền truy cập");
};

export const edit = async (req, res) => {
  const roles = await Role.find({
    deleted: false,
  });
  const account = await Account.findOne({
    _id: req.params.id,
    deleted: false,
  });
  res.render("admin/pages/accounts/edit", {
    pageTitle: "Chỉnh sửa tài khoản quản trị",
    roles: roles,
    account: account,
  });
};
export const editPatch = async (req, res) => {
  if (res.locals.role.permissions.includes("accounts_edit")) {
    await Account.updateOne(
      {
        _id: req.params.id,
        deleted: false,
      },
      req.body
    );
    req.flash("success", "Cập nhật thành công!");
    res.redirect(`back`);
  }
};

export const deletee = async (req: Request, res: Response) => {
  await Account.deleteOne({
    _id: req.body.id,
  });
};

export const deletePatch = async (req: Request, res: Response) => {
  if (res.locals.role.permissions.includes("accounts_delete")) {
    await Account.updateOne(
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
  } else req.flash("error", "Không có quyền truy cập");
};

export const detail = async (req, res) => {
  if (res.locals.role.permissions.includes("accounts_view")) {
    const account = await Account.findOne({
      _id: req.params.id,
      deleted: false,
    });
    const role = await Role.findOne({
      _id: account.role_id,
      deleted: false,
    });
    res.render("admin/pages/accounts/detail", {
      pageTitle: "Chi tiết tài khoản quản trị",
      role: role,
      account: account,
    });
  }
};

export const changePassword = async (req, res) => {
  const account = await Account.findOne({
    _id: req.params.id,
    deleted: false,
  });
  res.render("admin/pages/accounts/change-password", {
    pageTitle: "Đổi mật khẩu",
    account: account,
  });
};
export const changePasswordPatch = async (req, res) => {
  if (res.locals.role.permissions.includes("accounts_edit")) {
    await Account.updateOne(
      {
        _id: req.params.id,
        deleted: false,
      },
      {
        password: md5(req.body.password),
      }
    );
    req.flash("success", "Cập nhật mật khẩu thành công!");
    res.redirect(`/${systemConfig.prefixAdmin}/accounts`);
  }
};
