import { Request, Response } from "express";
import { Song } from "../models/song.model";
import { Topic } from "../models/topic.model";
import { Singer } from "../models/singer.model";

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