import mongoose from "mongoose";
const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        //   minlength: 6,
        required: true,
    },
    type_user: String,
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
    createAt: Date,
    updateAt: Date,
}
)