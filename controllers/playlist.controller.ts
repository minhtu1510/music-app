import { Request, Response } from "express";
import { Singer } from "../models/singer.model";
import { Playlist } from "../models/playlist.model";
import { User } from "../models/user.model";
import { Song } from "../models/song.model";
import { ppid, title } from "process";
import { FavoriteSong } from "../models/favorite-song.model";
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
    // console.log(newTitlePlaylist);
    const userId = res.locals.users.id
    const newPlaylist = new Playlist({
        title: newTitlePlaylist,
        userId: userId
    });
    await newPlaylist.save();
    console.log(newTitlePlaylist);
    console.log("tao thanh cong");

    // req.flash("success", "Tạo playlist thành công!");

    // res.redirect("/playlist");
    // window.location.href = window.location.href;
    // res.json({
    //     code: "success",
    //     newPlaylistId: newPlaylist._id
    // })
    // res.render("")
    res.json({
        code: "success",
        newPlaylistId: newPlaylist._id,
        message: "Tạo playlist thành công!",
    });

};

export const addSongPlaylist = async (req: Request, res: Response) => {

    const songId = req.params.songId;
    const playlistId = req.body.id;
    if (songId && playlistId) {
        const existSong = await Playlist.findOne({ _id: playlistId, songId: songId })
        if (!existSong) {
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
    }
};
export const deleteSongPlaylist = async (req: Request, res: Response) => {
    // const songId = req.params.songId;
    const { songId, playlistId } = req.body;
    console.log("songId:", songId);
    console.log("playlistId:", playlistId);
    if (songId && playlistId) {
        const existSong = await Playlist.findOne({ _id: playlistId, songId: { $in: [songId] } })
        // const existPlaylist = await Playlist.findOne({ _id: playlistId })
        console.log(`bai hat: ${existSong}`);
        if (existSong) {
            await Playlist.updateOne({
                _id: playlistId

            },
                {
                    $pull: {
                        songId: songId
                    }
                }
            )
            res.json({
                code: "success",
                message: "Xóa bài hát trong playlist thành công",
            });
        }
        else {
            res.json({
                code: "error",

            });
        }
    }
};

export const patchPlaylistTitle = async (req: Request, res: Response) => {
    const newTitle = req.body.newNamePlaylist;
    const playlistId = req.body.id;
    const oldSlug = req.params.slugPlaylist
    console.log(`New: ${newTitle}`);
    console.log(`Old : ${oldSlug}`);
    if (newTitle) {
        const oldNamePlaylist = await Playlist.findOne({
            slug: oldSlug,
            _id: playlistId
        })
        await Playlist.updateOne(
            { _id: oldNamePlaylist._id },
            {
                $set: {
                    title: newTitle
                }
            });
        const newPlaylist = await Playlist.findOne({ _id: playlistId })
        res.json({
            code: "success",
            message: "Chỉnh sửa playlist thành công",
            newSlug: newPlaylist.slug
        })
        // console.log("thanhcong")
        // req.flash("success", "Chỉnh sửa playlist thành công!");
        // res.redirect(`/ playlist / detail / ${ encodeURIComponent(newTitle) }`);
    } else {
        res.json({
            code: "error"
        })
        console.log("that bai")
    }
};
export const deletePlaylist = async (req: Request, res: Response) => {
    const playlistId = req.body.id;
    // const oldTitle = req.params.titlePlaylist
    if (playlistId) {
        const oldNamePlaylist = await Playlist.findOne({
            _id: playlistId
        })
        await Playlist.deleteOne(
            { _id: oldNamePlaylist._id },
        );
        res.json({
            code: "success",
            message: "Xóa playlist thành công"
        })
    } else {
        res.json({
            code: "error"
        })
        console.log("that bai")
    }
};

export const detail = async (req: Request, res: Response) => {
    const userId = res.locals.users.id
    const slugPlaylist = req.params.slugPlaylist;
    console.log(slugPlaylist);

    const playlist = await Playlist.findOne(
        {
            userId: userId,
            slug: slugPlaylist
        }
    )
    const user = await User.findOne({
        _id: userId
    })
    const songOfPlaylist = []
    const songWithTopic = [];
    let songWithMaxLikes;
    let arrayTopicId = [];
    const songLikes = [];
    if (playlist) {
        const playlistSongId = playlist.songId?.length > 0 ? new Set(playlist.songId) : new Set()


        // const playlistSongId = playlist.songId.length > 0 ? new Set(playlist.songId) : "";
        for (const songId of playlist.songId) {
            const song = await Song.findOne(
                {
                    deleted: false,
                    _id: songId
                }
            )
            const singer = await Singer.findOne({
                _id: song.singerId
            })
            const singers = await Singer.find({ _id: { $in: song.singerId } });
            song["singerFullName"] = singers.map((singer) => singer.fullName).join(", ");
            // song["singerFullName"] = singer.fullName;
            songOfPlaylist.push(song);
            arrayTopicId.push(song.topicId)


            // //bai hat theo topic
            // const songSuggests = await Song.find({
            //     topicId: song.topicId,
            //     title: { $ne: song.title }
            // }).limit(2)
            // if (songSuggests.length > 0) {
            //     for (const songSuggest of songSuggests) {
            //         const singersongSuggest = await Singer.findOne({
            //             _id: songSuggest.singerId,

            //         })
            //         songSuggest["singerFullName"] = singersongSuggest.fullName;
            //         songWithTopic.push(songSuggest);

            //         songSuggestLikes = await Song.find({
            //             title: { $ne: song.title && songSuggest.title }
            //         }).sort({ likeCount: -1 })
            //             .limit(5)
            //     }

            // } else {
            //     songSuggestLikes = await Song.find({
            //         title: { $ne: song.title }
            //     }).sort({ likeCount: -1 })
            //         .limit(8)
            // }
            // // bai hat nhieu like

            // if (songSuggests.length < 3) {
            //     for (const songSuggestLike of songSuggestLikes) {
            //         const singersongSuggest = await Singer.findOne({
            //             _id: songSuggestLike.singerId
            //         })
            //         songSuggestLike["singerFullName"] = singersongSuggest.fullName;
            //         songLikes.push(songSuggestLike);
            //     }

            // }

        }




        const songSuggests = await Song.find({
            deleted: false,
            topicId: { $in: [...arrayTopicId] },
            _id: { $nin: [...playlistSongId] }
        }).limit(5)
        if (songSuggests.length > 0) {
            for (const songSuggest of songSuggests) {
                const singerSuggest = await Singer.findOne({ _id: songSuggest.singerId });
                const singers = await Singer.find({ _id: { $in: songSuggest.singerId } });
                songSuggest["singerFullName"] = singers.map((singer) => singer.fullName).join(", ");
                // songSuggest["singerFullName"] = singerSuggest.fullName;
                if (res.locals.users) {
                    const exsitSongFavorite = await FavoriteSong.findOne({
                        songId: songSuggest.id,
                        userId: res.locals.users.id,
                    });
                    if (exsitSongFavorite) {
                        songSuggest["favorite"] = true;
                    } else {
                        songSuggest["favorite"] = false;
                    }

                    songWithTopic.push(songSuggest);


                } else songSuggest["favorite"] = false;
            }
            songWithMaxLikes = await Song.find({
                deleted: false,
                _id: { $nin: [...playlistSongId, ...songSuggests.map(s => s._id)] }
            }).sort({ likeCount: -1 })
                .limit(5)
            for (const songWithMaxLike of songWithMaxLikes) {
                const singerWithMaxLike = await Singer.findOne({ _id: songWithMaxLike.singerId });
                // songWithMaxLike["singerFullName"] = singerWithMaxLike.fullName;
                const singers = await Singer.find({ _id: { $in: songWithMaxLike.singerId } });
                songWithMaxLike["singerFullName"] = singers.map((singer) => singer.fullName).join(", ");
                if (res.locals.users) {
                    const exsitSongFavorite = await FavoriteSong.findOne({
                        songId: songWithMaxLike.id,
                        userId: res.locals.users.id,
                    });
                    if (exsitSongFavorite) {
                        songWithMaxLike["favorite"] = true;
                    } else {
                        songWithMaxLike["favorite"] = false;
                    }
                } else songWithMaxLike["favorite"] = false;

                songLikes.push(songWithMaxLike);
            }

        } else {
            songWithMaxLikes = await Song.find({
                deleted: false,
                _id: { $nin: [...playlistSongId, ...songSuggests.map(s => s._id)] }
            }).sort({ likeCount: -1 })
                .limit(10)
            for (const songWithMaxLike of songWithMaxLikes) {
                const singerWithMaxLike = await Singer.findOne({ _id: songWithMaxLike.singerId });
                const singers = await Singer.find({ _id: { $in: songWithMaxLike.singerId } });
                songWithMaxLike["singerFullName"] = singers.map((singer) => singer.fullName).join(", ");
                if (res.locals.users) {
                    const exsitSongFavorite = await FavoriteSong.findOne({
                        songId: songWithMaxLike.id,
                        userId: res.locals.users.id,
                    });
                    if (exsitSongFavorite) {
                        songWithMaxLike["favorite"] = true;
                    } else {
                        songWithMaxLike["favorite"] = false;
                    }
                } else songWithMaxLike["favorite"] = false;

                songLikes.push(songWithMaxLike);
            }
        }
    }

    res.render("client/pages/playlist/detail", {
        pageTitle: "Bài hát yêu thích",
        playlist: playlist,
        userName: user.fullName,
        songOfPlaylist: songOfPlaylist,
        songWithTopic: songWithTopic,
        songLikes: songLikes
    });
};
