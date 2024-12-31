import { Request, Response } from "express";
import { Song } from "../models/song.model";
import { Topic } from "../models/topic.model";
import { Singer } from "../models/singer.model";
import { FavoriteSong } from "../models/favorite-song.model";
import unidecode from "unidecode";
import { title } from "process";
import moment from "moment";

export const index = async (req: Request, res: Response) => {
    res.render("client/pages/playlist/index", {
        pageTitle: "Bài hát yêu thích"
    });
};