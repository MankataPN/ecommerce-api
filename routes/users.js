import { Router } from "express";
import { loginUser, registerUser, updateUser } from "../controllers/user.js";

//Create user router
const userRouter = Router();

//Define routes
userRouter.post("/users/register", registerUser);

userRouter.post("/users/login", loginUser);

userRouter. patch("/users/:id", updateUser)



//Export router
export default userRouter