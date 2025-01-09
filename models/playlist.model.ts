import mongoose from "mongoose";
const playlistSchema = new mongoose.Schema(
  {
    title: String,
    userId: String,
    songId: Array,
    slug: {
      type: String,
      slug: "title",
      unique: true,
    },
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
