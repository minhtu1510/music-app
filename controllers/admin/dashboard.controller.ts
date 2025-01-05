import { Request, Response } from "express";
import { Topic } from "../../models/topic.model";
import { Singer } from "../../models/singer.model";
import { Song } from "../../models/song.model";
import { Account } from "../../models/account.model";
import { User } from "../../models/user.model";
export const index = async (req: Request, res: Response) => {
  const statistic = {
    topic: {
      total: 0,
      active: 0,
      inactive: 0,
    },
    singer: {
      total: 0,
      active: 0,
      inactive: 0,
    },
    song: {
      total: 0,
      active: 0,
      inactive: 0,
      listen: 0,
    },
    user: {
      total: 0,
      active: 0,
      inactive: 0,
    },
    account: {
      total: 0,
      active: 0,
      inactive: 0,
    },
  };
  if (res.locals.role.title != "Quản trị viên") {
    const songs = await Song.find(
      { createdBy: res.locals.user.id },
      { listen: 1 }
    );

    // Truy cập giá trị tổng từ kết quả
    const totalListen = songs.reduce(
      (sum, song) => sum + (song.listen || 0),
      0
    );

    statistic.song.listen = totalListen;
    // Bài hát
    statistic.song.total = await Song.countDocuments({
      createdBy: res.locals.user.id,
      deleted: false,
    });
    statistic.song.active = await Song.countDocuments({
      createdBy: res.locals.user.id,
      status: "active",
      deleted: false,
    });
    statistic.song.inactive = await Song.countDocuments({
      createdBy: res.locals.user.id,
      status: "inactive",
      deleted: false,
    });
  }
  // Hết bài hát
  else {
    const songs = await Song.find({}, { listen: 1 });
    // console.log(songs);
    // Truy cập giá trị tổng từ kết quả
    const totalListen = songs.reduce(
      (sum, song) => sum + (song.listen || 0),
      0
    );

    statistic.song.listen = totalListen;

    // Bài hát
    statistic.song.total = await Song.countDocuments({
      deleted: false,
    });
    statistic.song.active = await Song.countDocuments({
      status: "active",
      deleted: false,
    });
    statistic.song.inactive = await Song.countDocuments({
      status: "inactive",
      deleted: false,
    });
  }
  // Hết doanh thu
  // Chủ đề
  statistic.topic.total = await Topic.countDocuments({
    deleted: false,
  });
  statistic.topic.active = await Topic.countDocuments({
    status: "active",
    deleted: false,
  });
  statistic.topic.inactive = await Topic.countDocuments({
    status: "inactive",
    deleted: false,
  });
  // Hết chủ đề
  // Ca sĩ
  statistic.singer.total = await Singer.countDocuments({
    deleted: false,
  });
  statistic.singer.active = await Singer.countDocuments({
    status: "active",
    deleted: false,
  });
  statistic.singer.inactive = await Singer.countDocuments({
    status: "inactive",
    deleted: false,
  });
  // Hết ca sĩ

  // Admin
  statistic.account.total = await Account.countDocuments({
    deleted: false,
  });
  statistic.account.active = await Account.countDocuments({
    status: "active",
    deleted: false,
  });
  statistic.account.inactive = await Account.countDocuments({
    status: "inactive",
    deleted: false,
  });
  // Hết admin
  // User
  statistic.user.total = await User.countDocuments({
    deleted: false,
  });
  statistic.user.active = await User.countDocuments({
    status: "active",
    deleted: false,
  });
  statistic.user.inactive = await User.countDocuments({
    status: "inactive",
    deleted: false,
  });
  // Hết user
  res.render("admin/pages/dashboard/index", {
    pageTitle: "Trang tổng quan",
    statistic: statistic,
  });
};
