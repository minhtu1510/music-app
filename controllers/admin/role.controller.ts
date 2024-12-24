import { Request, Response } from "express";
import { Role } from "../../models/role.model";
import { systemConfig } from "../../config/system";
export const index = async (req: Request, res: Response) => {
  const records = await Role.find({
    deleted: false,
  });
  res.render("admin/pages/roles/index", {
    pageTitle: "Nhóm quyền",
    records: records,
  });
};

export const create = async (req, res) => {
  res.render("admin/pages/roles/create", {
    pageTitle: "Tạo nhóm quyền",
  });
};
export const createPost = async (req, res) => {
  const role = new Role(req.body);
  await role.save();
  res.redirect(`/${systemConfig.prefixAdmin}/roles`);
};

export const edit = async (req, res) => {
  const id = req.params.id;
  const role = await Role.findOne({
    _id: id,
    deleted: false,
  });
  res.render("admin/pages/roles/edit", {
    pageTitle: "Chỉnh sửa nhóm quyền",
    role: role,
  });
};
export const editPatch = async (req, res) => {
  const id = req.params.id;
  await Role.updateOne(
    {
      _id: id,
    },
    req.body
  );
  req.flash("success", "Cập nhật thành công");
  res.redirect(`/${systemConfig.prefixAdmin}/roles`);
};

export const deletee = async (req: Request, res: Response) => {
  await Role.deleteOne({
    _id: req.body.id,
  });
};

export const deletePatch = async (req: Request, res: Response) => {
  await Role.updateOne(
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
  });
};

export const permissions = async (req, res) => {
  const records = await Role.find({
    deleted: false,
  });
  res.render("admin/pages/roles/permissions", {
    pageTitle: "Phân quyền",
    records: records,
  });
};
export const permissionsPatch = async (req, res) => {
  for (const item of req.body) {
    await Role.updateOne(
      {
        _id: item.id,
        deleted: false,
      },
      {
        permissions: item.permissions,
      }
    );
  }
  req.flash("success", "Cập nhật thành công!");
  res.json({
    code: "success",
  });
};
