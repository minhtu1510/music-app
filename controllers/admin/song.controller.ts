import { Request, Response } from "express";
import { Song } from "../../models/song.model";
import { Singer } from "../../models/singer.model";
import { Topic } from "../../models/topic.model";
import { systemConfig } from "../../config/system";
import unidecode from "unidecode";
import moment from "moment";
import { Account } from "../../models/account.model";
import { Role } from "../../models/role.model";
export const index = async (req: Request, res: Response) => {
  const find: Record<string, any> = {
    deleted: false,
  };
  const role = await Role.findOne({
    _id: res.locals.user.role_id,
  });
  if (role.title != "Quản trị viên") {
    find.createdBy = res.locals.user.id;
  }

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
  let limitSongs = 4;
  let page = 1;
  if (req.query.page) {
    page = parseInt(`${req.query.page}`);
  }
  //   if (req.query.limit) {
  //     limitSingers = parseInt(`${req.query.limit}`);
  //   }
  const skip = (page - 1) * limitSongs;
  const totalSong = await Song.countDocuments(find);
  const totalPage = Math.ceil(totalSong / limitSongs);
  // Hết Phân trang

  const songs = await Song.find(find).limit(limitSongs).skip(skip);
  for (const item of songs) {
    //Tao boi
    const infoCreated = await Account.findOne({
      _id: item.createdBy,
    });
    if (infoCreated) {
      item.createdByFullName = infoCreated.fullName;
    } else {
      item.createdByFullName = "";
    }
    if (item.createdAt) {
      item.createdAtFormat = moment(item.createdAt).format("HH:mm - DD/MM/YY");
    }
    //Cap nhat boi
    const infoUpdated = await Account.findOne({
      _id: item.updatedBy,
    });
    if (infoUpdated) {
      item.updatedByFullName = infoUpdated.fullName;
    } else {
      item.updatedByFullName = "";
    }
    if (item.updatedAt) {
      item.updatedAtFormat = moment(item.updatedAt).format("HH:mm - DD/MM/YY");
    }
  }

  res.render("admin/pages/songs/index", {
    pageTitle: "Quản lý bài hát",
    songs: songs,
    totalPage: totalPage,
    currentPage: page,
    limit: limitSongs,
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
  try {
    if (res.locals.role.permissions.includes("songs_create")) {
      req.body.avatar = req.body.avatar[0];
      req.body.audio = req.body.audio[0];
      req.body.createdBy = res.locals.user.id;
      req.body.createdAt = new Date();
      const song = new Song(req.body);
      await song.save();
      req.flash("success", "Tạo thành công!");
      res.redirect(`/${systemConfig.prefixAdmin}/songs`);
    }
  } catch (error) {
    req.flash("error", error);
  }
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
  if (res.locals.role.permissions.includes("songs_edit")) {
    (req.body.updatedBy = res.locals.user.id),
      (req.body.updatedAt = new Date());
    const id = req.params.id;
    if (req.body.avatar) {
      req.body.avatar = req.body.avatar[0];
    }

    if (req.body.audio) {
      req.body.audio = req.body.audio[0];
    }
    req.body.countSinger = Number(req.body.countSinger);
    await Song.updateOne(
      {
        _id: id,
      },
      req.body
    );
    req.flash("success", "Cập nhật thành công!");
    res.redirect("back");
  }
};

export const changeStatus = async (req: Request, res: Response) => {
  if (res.locals.role.permissions.includes("songs_edit")) {
    const id = req.body.id;
    const status = req.body.status;
    await Song.updateOne(
      {
        _id: id,
      },
      {
        status: status,
        updatedBy: res.locals.user.id,
        updatedAt: new Date(),
      }
    );
    req.flash("success", "Đổi trạng thái thành công!");
    res.json({
      code: "success",
      message: "Đổi trạng thái thành công",
    });
  } else req.flash("error", "Không có quyền truy cập");
};

export const changeMulti = async (req: Request, res: Response) => {
  if (res.locals.role.permissions.includes("songs_edit")) {
    const ids = req.body.ids;
    const status = req.body.status;
    await Song.updateMany(
      {
        _id: ids,
      },
      {
        status: status,
        updatedBy: res.locals.user.id,
        updatedAt: new Date(),
      }
    );
    req.flash("success", "Đổi trạng thái thành công!");
    res.json({
      code: "success",
      message: "Đổi trạng thái thành công",
    });
  } else req.flash("error", "Không có quyền truy cập");
};

export const deletee = async (req: Request, res: Response) => {
  await Song.deleteOne({
    _id: req.body.id,
  });
};

export const deletePatch = async (req: Request, res: Response) => {
  if (res.locals.role.permissions.includes("songs_delete")) {
    await Song.updateOne(
      {
        _id: req.body.id,
      },
      {
        deleted: true,
        deletedBy: res.locals.user.id,
        deletedAt: new Date(),
      }
    );
    req.flash("success", "Xóa thành công!");
    res.json({
      code: "success",
      message: "Xóa thành công !!!",
    });
  } else req.flash("error", "Không có quyền này");
};

export const detail = async (req: Request, res: Response) => {
  if (res.locals.role.permissions.includes("songs_view")) {
    const song = await Song.findOne({
      _id: req.params.id,
    });
    const singers = await Singer.find({
      deleted: false,
    });
    const topic = await Topic.findOne({
      _id: song.topicId,
    });

    res.render("admin/pages/songs/detail", {
      pageTitle: "Chi tiết bài hát",
      song: song,
      topic: topic,
      singers: singers,
    });
  }
};

export const changeType = async (req: Request, res: Response) => {
  if (res.locals.role.permissions.includes("songs_edit")) {
    const id = req.body.id;
    const type = req.body.type_song;
    await Song.updateOne(
      {
        _id: id,
      },
      {
        type_song: type,
        updatedBy: res.locals.user.id,
        updatedAt: new Date(),
      }
    );
    req.flash("success", "Đổi trạng thái thành công!");
    res.json({
      code: "success",
      message: "Đổi trạng thái thành công",
    });
  } else req.flash("error", "Không có quyền truy cập");
};