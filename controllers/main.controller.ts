import { Request, Response } from "express";
import { Topic } from "../models/topic.model";
import { Singer } from "../models/singer.model";
import { Song } from "../models/song.model";
import { Playlist } from "../models/playlist.model";
export const index = async (req: Request, res: Response) => {
  const topics = await Topic.find({
    deleted: false,
  });
  const singers = await Singer.find({
    deleted: false,
  });
  const userId = res.locals.users ? res.locals.users.id : ""
  const playlists = await Playlist.find({
    userId: userId
  })

  const songLikes = await Song.aggregate([
    {
      $match: {
        deleted: false,
        status: "active",
      },
    },
    {
      $addFields: {
        likeCount: { $size: "$like" }, // Tính số phần tử trong mảng "like"
      },
    },
    {
      $sort: { likeCount: -1 }, // Sắp xếp theo số phần tử giảm dần
    },
    {
      $limit: 3, // Lấy 3 bài hát đầu tiên
    },
  ]);
  for (const songLike of songLikes) {
    const infoSinger = await Singer.findOne({
      _id: songLike.singerId,
      deleted: false,
    });
    songLike["singerFullName"] = infoSinger ? infoSinger.fullName : ""
  }


  res.render("client/pages/main/index", {
    pageTitle: "Trang chu",
    songLikes: songLikes,
    topics: topics,
    singers: singers,
    playlist: playlists

  });
};
