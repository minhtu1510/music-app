import { Request, Response } from "express";
import { Song } from "../../models/song.model";
import { Singer } from "../../models/singer.model";
import { Topic } from "../../models/topic.model";
import { systemConfig } from "../../config/system";
export const index = async (req: Request, res: Response) => {
  const songs = await Song.find({
    deleted: false,
  });

  res.render("admin/pages/songs/index", {
    pageTitle: "Quản lý bài hát",
    songs: songs,
  });
};
export const create = async (req: Request, res: Response) => {
  const singers = await Singer.find({
    deleted: false,
  });

  const topics = await Topic.find({
    deleted: false,
  });

  res.render("admin/pages/songs/create", {
    pageTitle: "Thêm mới bài hát",
    topics: topics,
    singers: singers,
  });
};

export const createPost = async (req: Request, res: Response) => {
  console.log(req.body);
  const song = new Song(req.body);
  await song.save();
  res.redirect(`/${systemConfig.prefixAdmin}/songs`);
};