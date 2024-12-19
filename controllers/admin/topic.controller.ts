import { Request, Response } from "express";
import { Topic } from "../../models/topic.model";
import unidecode from "unidecode";
import { systemConfig } from "../../config/system";
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
  let limitTopics = 4;
  let page = 1;
  if (req.query.page) {
    page = parseInt(`${req.query.page}`);
  }
  //   if (req.query.limit) {
  //     limitSingers = parseInt(`${req.query.limit}`);
  //   }
  const skip = (page - 1) * limitTopics;
  const totalTopic = await Topic.countDocuments(find);
  const totalPage = Math.ceil(totalTopic / limitTopics);
  // Hết Phân trang

  const topics = await Topic.find(find).limit(limitTopics).skip(skip);
  res.render("admin/pages/topics/index", {
    pageTitle: "Quản lý chủ đề",
    topics: topics,
    totalPage: totalPage,
    currentPage: page,
    limit: limitTopics,
  });
};

export const changeStatus = async (req: Request, res: Response) => {
  const id = req.body.id;
  const status = req.body.status;
  await Topic.updateOne(
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
  await Topic.updateMany(
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

  const topic = await Topic.findOne({
    _id: id,
    deleted: false,
  });

  res.render("admin/pages/topics/edit", {
    pageTitle: "Chỉnh sửa chủ đề",
    topic: topic,
  });
};

export const editPatch = async (req: Request, res: Response) => {
  const id = req.params.id;

  await Topic.updateOne(
    {
      _id: id,
    },
    req.body
  );
  req.flash("success", "Cập nhật thành công!");
  res.redirect("back");
};

export const create = async (req: Request, res: Response) => {
  res.render("admin/pages/topics/create", {
    pageTitle: "Thêm mới chủ đề",
  });
};

export const createPost = async (req: Request, res: Response) => {
  const topic = new Topic(req.body);
  await topic.save();
  req.flash("success", "Tạo thành công!");
  res.redirect(`/${systemConfig.prefixAdmin}/topics`);
};

export const deletee = async (req: Request, res: Response) => {
  await Topic.deleteOne({
    _id: req.body.id,
  });
};

export const deletePatch = async (req: Request, res: Response) => {
  await Topic.updateOne(
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

export const detail = async (req: Request, res: Response) => {
  const topic = await Topic.findOne({
    _id: req.params.id,
  });

  res.render("admin/pages/topics/detail", {
    pageTitle: "Chi tiết ca sĩ",
    topic: topic,
  });
};