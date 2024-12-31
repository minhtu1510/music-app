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
export const Playlist = mongoose.model(
  "Playlist",
  playlistSchema,
  "playlists"
);
