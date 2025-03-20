import { UserModel } from "../models/user.js";
import { loginUserValidator, registerUserValidator, UpdateUserValidator } from "../validators/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const registerUser = async (req, res, next) => {
    //Validate user information
    const {error, value} = registerUserValidator.validate(req.body);
    if (error) {
        return res.status(422).json(error);
    }
    //Check if user does not exist already
    const user = await UserModel.findOne({
        $or: [
            {username: value.username},
            {email: value.email}
        ]
    })
    if (user) {
        return res.status(409).json("User already exists");
    }
    //Hash plaintext password
    const hashedPassword = bcrypt.hashSync(value.password, 10);
    //Create user record in database
    const result = await UserModel.create({
        ...value,
        password: hashedPassword
    })
    //Optionally generate access token for user
    //Return response
    res.status(201).json("User registered successfully")
}

export const loginUser = async (req, res, next) => {
    //Validate user information
    const {error, value} = loginUserValidator.validate(req.body);
    if (error) {
        return res.status(422).json(error)
    }
    //Find matching user record in database
    const user = await UserModel.findOne({
        $or: [
            {username: value.username},
            {email: value.email}
        ]
    });
    if (!user) {
        return res.status(409).json("User does not exists");
    }
    //Compare incoming password with saved password
    const correctPassword = bcrypt.compareSync(value.password, user.password);
    if(!correctPassword) {
        return res.status(401).json("Invalid Credentials")
    }
    //Generate access token for the user
    const accessToken = jwt.sign(
        {id: user.id},
        process.env.JWT_SECRET_KEY,
        {expiresIn: "24h"}
    )
    //Return response
    res.status(200).json({ accessToken})
}

export const updateUser = async (req, res, next) => {
    //Validate the request body
    const {error, value} = UpdateUserValidator.validate(req.body)
    if (error) {
        return res.status(422).json(error)
    }
    //Update user in database
    const result = await UserModel.findByIdAndUpdate(
        req.params.id,
        value,
        {new: true}
    );
    //Return response
    res.status(200).json(result)
}