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
  if (res.locals.role.permissions.includes("songs_create")) {
    req.body.avatar = req.body.avatar[0];
    req.body.audio = req.body.audio[0];
    const song = new Song(req.body);
    await song.save();
    req.flash("success", "Tạo thành công!");
    res.redirect(`/${systemConfig.prefixAdmin}/songs`);
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
  const singer = await Singer.findOne({
    _id: song.singerId,
  });
  const topic = await Topic.findOne({
    _id: song.topicId,
  });

  res.render("admin/pages/songs/detail", {
    pageTitle: "Chi tiết bài hát",
    song: song,
    topic: topic,
    singer: singer,
  });
};}