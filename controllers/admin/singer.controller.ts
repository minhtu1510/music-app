import { Request, Response } from "express";
import { Song } from "../../models/song.model";
import { Singer } from "../../models/singer.model";
import { Topic } from "../../models/topic.model";
import { systemConfig } from "../../config/system";
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
  const totalSinger = await Singer.countDocuments(find);
  const totalPage = Math.ceil(totalSinger / limitSingers);
  // Hết Phân trang
  const singers = await Singer.find(find).limit(limitSingers).skip(skip);

  res.render("admin/pages/singers/index", {
    pageTitle: "Quản lý ca sĩ",
    singers: singers,
    totalPage: totalPage,
    currentPage: page,
    limit: limitSingers,
  });
};

export const changeStatus = async (req: Request, res: Response) => {
  const id = req.body.id;
  const status = req.body.status;
  await Singer.updateOne(
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
  await Singer.updateMany(
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

export const edit = async (req: Request, res: Response) => {
  const id = req.params.id;

  const singer = await Singer.findOne({
    _id: id,
    deleted: false,
  });

  res.render("admin/pages/singers/edit", {
    pageTitle: "Chỉnh sửa ca sĩ",
    singer: singer,
  });
};

export const editPatch = async (req: Request, res: Response) => {
  const id = req.params.id;

  await Singer.updateOne(
    {
      _id: id,
    },
    req.body
  );
  req.flash("success", "Cập nhật thành công!");
  res.redirect("back");
};

export const create = async (req: Request, res: Response) => {
  res.render("admin/pages/singers/create", {
    pageTitle: "Thêm mới ca sĩ",
  });
};

export const createPost = async (req: Request, res: Response) => {
  const singer = new Singer(req.body);
  await singer.save();
  req.flash("success", "Tạo thành công!");
  res.redirect(`/${systemConfig.prefixAdmin}/singers`);
};

export const deletee = async (req: Request, res: Response) => {
  await Singer.deleteOne({
    _id: req.body.id,
  });
};

export const deletePatch = async (req: Request, res: Response) => {
  await Singer.updateOne(
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

export const detail = async (req: Request, res: Response) => {
  const singer = await Singer.findOne({
    _id: req.params.id,
  });

  res.render("admin/pages/singers/detail", {
    pageTitle: "Chi tiết ca sĩ",
    singer: singer,
  });
};