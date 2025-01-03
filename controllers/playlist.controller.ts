import { Request, Response } from "express";
import { Singer } from "../models/singer.model";
import { Playlist } from "../models/playlist.model";
import { User } from "../models/user.model";
export const index = async (req: Request, res: Response) => {
    const userId = res.locals.users.id
    const playlists = await Playlist.find(
        {
            userId: userId
        }
    )
    const user = await User.findOne({
        _id: userId
    })
    res.render("client/pages/playlist/index", {
        pageTitle: "Bài hát yêu thích",
        playlists: playlists,
        userName: user.fullName
    });
};

export const createPlaylist = async (req: Request, res: Response) => {
    const newTitlePlaylist = req.body.namePlaylist;
    console.log(newTitlePlaylist);
    const userId = res.locals.users.id
    const newPlaylist = new Playlist({
        title: newTitlePlaylist,
        userId: userId
    });
    await newPlaylist.save();
    req.flash("success", "Tạo playlist thành công!");
    res.redirect("/");
};

export const addSongPlaylist = async (req: Request, res: Response) => {
    try {

    } catch (error) {

    }
    const songId = req.params.songId;
    const playlistId = req.body.id;
    console.log(playlistId)
    const exsitSong = await Playlist.findOne({ _id: playlistId, songId: songId })
    if (!exsitSong) {
        await Playlist.updateOne({
            _id: playlistId
        },
            {
                $push: {
                    songId: songId
                }
            }
        )
        res.json({
            code: "success",
            message: "Thêm vào playlist thành công",
        });
    }
    else {
        res.json({
            code: "error",

        });
    }

};

export const detail = async (req: Request, res: Response) => {
    const userId = res.locals.users.id
    const playlists = await Playlist.find(
        {
            userId: userId
        }
    )
    const user = await User.findOne({
        _id: userId
    })
    res.render("client/pages/playlist/detail", {
        pageTitle: "Bài hát yêu thích",
        playlists: playlists,
        userName: user.fullName
    });
};
