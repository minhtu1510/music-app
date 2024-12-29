import { Request, Response } from "express";
import { Topic } from "../models/topic.model";
import { Singer } from "../models/singer.model";
import { Song } from "../models/song.model";
export const index = async (req: Request, res: Response) => {
    const topics = await Topic.find({
        deleted: false,
    });
    const singers = await Singer.find({
        deleted: false,
    });
    const songLikes = await Song.find({
        deleted: false,
        status: "active",
    }).sort({ like: -1 })
        .limit(3);
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
        singers: singers
    });
};
