import { Request, Response } from "express";
import { Singer } from "../models/singer.model";
import { Song } from "../models/song.model";
export const index = async (req: Request, res: Response) => {
  const singers = await Singer.find({
    deleted: false,
    status: "active",
  });

  res.render("client/pages/singers/index", {
    pageTitle: "Danh sách ca sĩ",
    singers: singers,
  });
};

export const detail = async (req: Request, res: Response) => {
  try {
    const slugSinger: string = req.params.slugSinger;

    const singer = await Singer.findOne({
      slug: slugSinger,
      deleted: false,
      status: "active",
    });

    const songs = await Song.find({
      singerId: singer.id,
      deleted: false,
      status: "active",
    });
    for (const song of songs) {
      const singers = await Singer.find({ _id: { $in: song.singerId } });
      song["nameSinger"] = singers.map((singer) => singer.fullName).join(", ");
      song["favorite"] = true;
    }
    

    res.render("client/pages/singers/detail", {
      pageTitle: "Chi tiết bài hát",
      singer: singer,
      songs: songs,
    });
  } catch {
    res.redirect("/singers");
  }
};
