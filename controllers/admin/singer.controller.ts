import { Request, Response } from "express";
import { Song } from "../../models/song.model";
import { Singer } from "../../models/singer.model";
import { Topic } from "../../models/topic.model";
import { systemConfig } from "../../config/system";
import { findSourceMap } from "module";
export const index = async (req: Request, res: Response) => {
  const find: Record<string, any> = {
    deleted: false,
  };

  //Lọc theo trạng thái
  if (req.query.status) {
    find.status = req.query.status;
  }

  //Hết lọc theo trạng thái

  const singers = await Singer.find(find);

  res.render("admin/pages/singers/index", {
    pageTitle: "Quản lý ca sĩ",
    singers: singers,
  });
};
