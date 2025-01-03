import { Request, Response } from "express";
import { Singer } from "../models/singer.model";
import { Song } from "../models/song.model";
export const index = async (req: Request, res: Response) => {
    const slugSinger: string = req.params.slugSinger;

    const singers = await Singer.find({
        deleted: false,
    });

    res.render("client/pages/singers/index", {
        pageTitle: "Danh sách ca sĩ",
        singers: singers,
    });
};

export const detail = async (req: Request, res: Response) => {
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


    res.render("client/pages/singers/detail", {
        pageTitle: "Chi tiết bài hát",
        singer: singer,
        songs: songs
    });
};