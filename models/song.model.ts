import mongoose from "mongoose";
import slug from "mongoose-slug-updater";
mongoose.plugin(slug);
const songSchema = new mongoose.Schema(
  {
    title: String,
    avatar: String,
    description: String,
    singerId: Array,
    topicId: String,
    createdBy: String,
    createdAt: Date,
    createdByFullName: String,
    createdAtFormat: String,
    updatedBy: String,
    updatedAt: Date,
    updatedByFullName: String,
    updatedAtFormat: String,
    deletedBy: String,
    deletedAt: Date,
    deletedByFullName: String,
    deletedAtFormat: String,
    type_song: String,
    countSinger: Number,
    like: {
      type: Array,
    },
    listen: {
      type: Number,
      default: 0,
    },
    lyrics: String,
    audio: String,
    status: String,
    slug: {
      type: String,
      slug: "title",
      unique: true,
    },
    deleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);
export const Song = mongoose.model("Song", songSchema, "songs");
