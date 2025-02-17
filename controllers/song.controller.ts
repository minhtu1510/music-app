import { Request, Response } from "express";
import { Song } from "../models/song.model";
import { Topic } from "../models/topic.model";
import { Singer } from "../models/singer.model";
import { FavoriteSong } from "../models/favorite-song.model";
import unidecode from "unidecode";
import { title } from "process";
import moment from "moment";
import { Playlist } from "../models/playlist.model";
import { User } from "../models/user.model";
export const index = async (req: Request, res: Response) => {
  const slugTopic: string = req.params.slugTopic;
  // console.log(slugTopic);
  const topic = await Topic.findOne({
    slug: slugTopic,
    deleted: false,
    status: "active",
  });
  // console.log(topic);

  const songs = await Song.find({
    topicId: topic.id,
    deleted: false,
    status: "active",
  });

  for (const song of songs) {
    const singers = await Singer.find({ _id: { $in: song.singerId } });
    song["nameSinger"] = singers.map((singer) => singer.fullName).join(", ");
  }

  res.render("client/pages/songs/index", {
    pageTitle: "Danh sách bài hát",
    songs: songs,
    topic: topic,
  });
};

export const detail = async (req: Request, res: Response) => {
  const slugSong: string = req.params.slugSong;

  const song = await Song.findOne({
    slug: slugSong,
    deleted: false,
    status: "active",
  });

  const singers = await Singer.find({ _id: { $in: song.singerId } });
  song["nameSinger"] = singers.map((singer) => singer.fullName).join(", ");
  const sameSong = await Song.find({
    _id: { $ne: song.id },
    singerId: { $in: song.singerId },
  });
  for (const song1 of sameSong) {
    const singers = await Singer.find({ _id: { $in: song1.singerId } });
    song1["nameSinger"] = singers.map((singer) => singer.fullName).join(", ");
  }

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
  if (res.locals.users) {
    const exsitSongFavorite = await FavoriteSong.findOne({
      songId: song.id,
      userId: res.locals.users.id,
    });
    if (exsitSongFavorite) {
      song["favorite"] = true;
    } else {
      song["favorite"] = false;
    }
  } else song["favorite"] = false;
  if (res.locals.users) {
    const exsitSongLike = song.like.includes(res.locals.users.id);
    if (exsitSongLike) {
      song["liked"] = true;
    } else {
      song["liked"] = false;
    }
  } else song["liked"] = false;

  const userId = res.locals.users ? res.locals.users.id : "";
  const playlists = await Playlist.find({
    userId: userId,
  });
  res.render("client/pages/songs/detail", {
    pageTitle: "Chi tiết bài hát",
    song: song,
    sameSong: sameSong,
    topic: topic,
    singer: singer,
    playlist: playlists
  });
  // if (
  //   song.type_song == "free" ||
  //   (res.locals.users && res.locals.users.type_user == "premium")
  // ) {
  //   res.render("client/pages/songs/detail", {
  //     pageTitle: "Chi tiết bài hát",
  //     song: song,
  //     sameSong: sameSong,
  //     topic: topic,
  //     singer: singer,
  //     playlist: playlists
  //   });
  // } else {
  //   res.redirect("/");
  // }
};
// export const detailPlay = async (req: Request, res: Response) => {
//   const slugSong: string = req.params.slugSong;

//   const song = await Song.findOne({
//     slug: slugSong,
//     deleted: false,
//     status: "active",
//   });

//   const singer = await Singer.findOne({
//     _id: song.singerId,
//     deleted: false,
//     status: "active",
//   });

//   const topic = await Topic.findOne({
//     _id: song.topicId,
//     deleted: false,
//     status: "active",
//   });

//   res.render("client/partials/play", {
//     pageTitle: "Chi tiết bài hát",
//     song: song,
//     topic: topic,
//     singer: singer,
//   });
// };
export const likePatch = async (req: Request, res: Response) => {
  if (req.cookies.tokenUser) {
    const { id, status, userId } = req.body;
    const song = await Song.findOneAndUpdate(
      {
        _id: id,
        deleted: false,
        status: "active",
      },
      status === "like"
        ? { $push: { like: userId } } // Thêm userId vào mảng like
        : { $pull: { like: userId } }, // Xóa userId khỏi mảng like
      { new: true } // Trả về tài liệu sau khi cập nhật
    );

    if (song) {
      res.json({
        code: "success",
        like: song.like.length, // Trả về số lượng like ngay lập tức
      });
    } else {
      res.json({
        code: "error",
      });
    }
  }
};

export const favoritePatch = async (req: Request, res: Response) => {
  if (req.cookies.tokenUser) {
    const id = req.body.songId;
    const userId = req.body.userId;
    const song = await Song.findOne({
      _id: id,
      deleted: false,
      status: "active",
    });
    if (song) {
      const existSong = await FavoriteSong.findOne({
        songId: id,
        userId: userId,
      });
      if (existSong) {
        await FavoriteSong.deleteOne({
          songId: id,
          userId: userId,
        });
        req.flash("success", "Đã xóa bài hát yêu thích");
      } else {
        const record = new FavoriteSong({
          songId: id,
          userId: userId,
        });
        await record.save();
        req.flash("success", "Đã thêm bài hát yêu thích");
        res.json({
          code: "success",
        });
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
  }
};

export const favorite = async (req: Request, res: Response) => {
  const songs = await FavoriteSong.find({ userId: res.locals.users.id });
  for (const song of songs) {
    const infoSong = await Song.findOne({
      _id: song.songId,
    });
    const infoSinger = await Singer.findOne({
      _id: infoSong.singerId,
    });
    song["title"] = infoSong.title;
    song["avatar"] = infoSong.avatar;
    const singers = await Singer.find({ _id: { $in: infoSong.singerId } });
    song["nameSinger"] = singers.map((singer) => singer.fullName).join(", ");

    song["slug"] = infoSong.slug;
    song["type_song"] = infoSong.type_song;
    song["createdAtFormat"] = moment("2024-12-28T16:34:52.981+00:00").format(
      "DD/MM/YYYY"
    );
    song["favorite"] = true;
  }
  res.render("client/pages/songs/favorite", {
    pageTitle: "Bài hát yêu thích",
    songs: songs,
  });
};

export const search = async (req: Request, res: Response) => {
  const type = req.params.type;
  const keyword = `${req.query.keyword}`;
  let keywordRegex = keyword.trim();
  keywordRegex = keywordRegex.replace(/\s+/g, "-");
  keywordRegex = unidecode(keywordRegex);
  const slugRegex = new RegExp(keywordRegex, "i");


  const songsFinal = [];

  const songs = await Song.find({
    slug: slugRegex,
  }).select("slug avatar title like singerId type_song");

  for (const song of songs) {
    const infoSinger = await Singer.findOne({
      _id: song.singerId,
      deleted: false,
    });
    song["singerFullName"] = infoSinger ? infoSinger.fullName : "";

    songsFinal.push({
      id: song.id,
      slug: song.slug,
      avatar: song.avatar,
      title: song.title,
      like: song.like,
      singerId: song.singerId,
      type_song: song.type_song,
      singerFullName: song["singerFullName"],
    });
  }

  if (type == "result") {
    res.render("client/pages/partials/search", {
      pageTitle: `Kết quả tìm kiếm :${keyword}`,
      keyword: keyword,
      songs: songs,
    });
  } else if (type == "suggest") {
    res.json({
      songs: songsFinal,
    });
  }
};

export const listenPatch = async (req: Request, res: Response) => {
  const id = req.params.id;

  const song = await Song.findOne({
    _id: id,
    deleted: false,
    status: "active",
  });

  await Song.updateOne(
    {
      _id: id,
      deleted: false,
      status: "active",
    },
    {
      listen: song.listen + 1,
    }
  );

  res.json({
    code: "success",
    listen: song.listen + 1,
  });
};

// export const getSong = async (req: Request, res: Response) => {
//   const slugSong: string = req.params.slugSong;

//   const song = await Song.findOne({
//     slug: slugSong,
//     deleted: false,
//     status: "active",
//   });

//   const singer = await Singer.findOne({
//     _id: song.singerId,
//     deleted: false,
//     status: "active",
//   });

//   const topic = await Topic.findOne({
//     _id: song.topicId,
//     deleted: false,
//     status: "active",
//   });

//   res.render("client/partials/play", {
//     pageTitle: "Play bài hát",
//     song: song,
//     topic: topic,
//     singer: singer,
//   });
// };

export const checkPremium = async (req: Request, res: Response) => {
  // Giả sử user không phải premium
  if (res.locals.users && res.locals.users.type_user == "premium") {
    res.json({ isAllowed: true });
  } else {
    res.json({ isAllowed: false });
  }
};