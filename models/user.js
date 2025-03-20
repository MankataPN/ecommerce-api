import { json } from "express";
import mongoose, { Schema, model } from "mongoose";
import normalize from "normalize-mongoose";


const userSchema = new Schema({
    username: {type: String, required: true, unique: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    role: {type: String, default: "staff", enum: ["staff", "manager", "admin", "superadmin"]}
}, {
    timestamps: true
})

// userSchema.plugin(normalize)


userSchema.set("toJSON", {
    transform: (document, returned0bject) => {
        returned0bject.id = returned0bject._id.toString()
        delete returned0bject._id
        delete returned0bject.__v
    }
})

export const UserModel = model("User", userSchema)