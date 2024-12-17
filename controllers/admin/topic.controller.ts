import { Request, Response } from "express";
import { Topic } from "../../models/topic.model";
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

  res.json({
    code: "success",
    message: "Đổi trạng thái thành công",
  });
};
