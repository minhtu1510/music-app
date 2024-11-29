import { Request, Response } from "express";
import { Song } from "../models/song.model";
import { Topic } from "../models/topic.model";
import { Singer } from "../models/singer.model";
import { FavoriteSong } from "../models/favorite-song.model";
import { existsSync } from "fs";

export const index = async (req: Request, res: Response) => {
  const slugTopic: string = req.params.slugTopic;

  const topic = await Topic.findOne({
    slug: slugTopic,
    deleted: false,
    status: "active",
  });

  const songs = await Song.find({
    topicId: topic.id,
    deleted: false,
    status: "active",
  });

  for (const song of songs) {
    const infoSinger = await Singer.findOne({
      _id: song.singerId,
      deleted: false,
    });

    song["singerFullName"] = infoSinger ? infoSinger.fullName : "";
  }

  res.render("client/pages/songs/index", {
    pageTitle: "Danh sách bài hát",
    songs: songs,
  });
};

export const detail = async (req: Request, res: Response) => {
  const slugSong: string = req.params.slugSong;

  const song = await Song.findOne({
    slug: slugSong,
    deleted: false,
    status: "active",
  });

  const singer = await Singer.findOne({
    _id: song.singerId,
    deleted: false,
    status: "active",
  });

  const topic = await Topic.findOne({
    _id: song.topicId,
    deleted: false,
    status: "active",
  });

  const exsitSongFavorite = await FavoriteSong.findOne({
    songId: song.id,
    //user:res.locals.user.id
  });
  if (exsitSongFavorite) {
    song["favorite"] = true;
  } else {
    song["favorite"] = false;
  }

  res.render("client/pages/songs/detail", {
    pageTitle: "Chi tiết bài hát",
    song: song,
    topic: topic,
    singer: singer,
  });
};

export const likePatch = async (req: Request, res: Response) => {
  const { id, status } = req.body;
  const song = await Song.findOne({
    _id: id,
    deleted: false,
    status: "active",
  });
  if (song) {
    let updateLike = song.like;
    switch (status) {
      case "like":
        updateLike++;
        break;
      case "dislike":
        updateLike--;
        break;

      default:
        break;
    }
    await Song.updateOne(
      {
        _id: id,
        deleted: false,
        status: "active",
      },
      {
        like: updateLike,
      }
    );

    res.json({
      code: "success",
      like: updateLike,
    });
  } else {
    res.json({
      code: "error",
    });
  }
};

export const favoritePatch = async (req: Request, res: Response) => {
  const { id } = req.body;
  const song = await Song.findOne({
    _id: id,
    deleted: false,
    status: "active",
  });
  if (song) {
    const existSong = await FavoriteSong.findOne({
      songId: id,
    });
    if (existSong) {
      await FavoriteSong.deleteOne({
        songId: id,
      });
    } else {
      const record = new FavoriteSong({
        songId: id,
      });
      await record.save();
    }
    //   await Song.updateOne(
    //     {
    //       _id: id,
    //       deleted: false,
    //       status: "active",
    //     },
    //     {
    //       like: updateLike,
    //     }
    //   );

    //   res.json({
    //     code: "success",
    //     like: updateLike,
    //   });
    // } else {
    //   res.json({
    //     code: "error",
    //   });
    // }
  }
};

export const favorite = async (req: Request, res: Response) => {
  const songs = await FavoriteSong.find({});
  for (const song of songs) {
    const infoSong = await Song.findOne({
      _id: song.songId,
    });
    const infoSinger = await Singer.findOne({
      _id: infoSong.singerId,
    });
    song["title"] = infoSong.title;
    song["avatar"] = infoSong.avatar;
    song["singerFullName"] = infoSinger.fullName;
    song["slug"] = infoSong.slug;
  }
  res.render("client/pages/songs/favorite", {
    pageTitle: "Bài hát yêu thích",
    songs: songs,
  });
};