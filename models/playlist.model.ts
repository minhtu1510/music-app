import mongoose from "mongoose";
const playlistSchema = new mongoose.Schema(
  {
    title: String,
    userId: String,
    songId: Array,
  },
  {
    timestamps: true,
  }
);
export const FavoriteSong = mongoose.model(
  "Playlist",
  playlistSchema,
  "playlists"
);
