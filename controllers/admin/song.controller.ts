import { Request, Response } from "express";
import { Song } from "../../models/song.model";
import { Singer } from "../../models/singer.model";
import { Topic } from "../../models/topic.model";
import { systemConfig } from "../../config/system";
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

  const songs = await Song.find(find);

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
  req.body.avatar = req.body.avatar[0];
  req.body.audio = req.body.audio[0];
  const song = new Song(req.body);
  await song.save();
  res.redirect(`/${systemConfig.prefixAdmin}/songs`);
};

export const edit = async (req: Request, res: Response) => {
  const id = req.params.id;
  const song = await Song.findOne({
    _id: id,
    deleted: false,
  });
  const singers = await Singer.find({
    deleted: false,
  });

  const topics = await Topic.find({
    deleted: false,
  });

  res.render("admin/pages/songs/edit", {
    pageTitle: "Chỉnh sửa bài hát",
    song: song,
    topics: topics,
    singers: singers,
  });
};

export const editPatch = async (req: Request, res: Response) => {
  const id = req.params.id;
  if (req.body.avatar) {
    req.body.avatar = req.body.avatar[0];
  }

  if (req.body.audio) {
    req.body.audio = req.body.audio[0];
  }
  await Song.updateOne(
    {
      _id: id,
    },
    req.body
  );
  res.redirect("back");
};

