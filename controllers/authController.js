import { User } from "../models/User.js";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken"

export const userLogin = async (req, res) => {

    const { email, password } = req.body;

    if (!email || !password) return res.status(400).json({ message: "values missing" });

    try {

        const foundUser = await User.findOne({
            where: {
                email
            }
        })

        if (!foundUser) return res.status(401).json({ message: "no such user exists" })

        const hashedResult = await bcrypt.compare(password, foundUser.password)

        if (!hashedResult) return res.status(401).json({ message: "wrong auth" })

        const token = jwt.sign({
            id: foundUser.id,
            fullName: foundUser.fullName,
            role: foundUser.role,
            exp: Math.floor(Date.now() / 1000) + (60 * 60)
        },
            process.env.SECRET_KEY
        );

        res.status(200).json({ message: "login successful", token, id: foundUser.id })

    } catch (error) {
        console.log({ message: error.message })
        res.status(500).json({ message: error.message })
    }

}

export const userRegister = async (req, res) => {

    const { fullName, email, password, confirmPassword } = req.body;
    const saltRounds = 10;

    if (!fullName || !email || !password || !confirmPassword) return res.status(400).json({ message: "values missing" });

    if (password !== confirmPassword) return res.status(400).json({ message: "passwords don't match" })

    try {
        const hashedPassword = await bcrypt.hash(password, saltRounds)

        const foundUser = await User.findOne({
            where: {
                email
            }
        })

        if (foundUser) return res.status(409).json({ message: "User with this email already exists." })

        const userCreated = await User.create({
            fullName,
            email,
            password: hashedPassword
        })

        if (!userCreated) return res.status(409).json({ message: "User not created" })

        var token = jwt.sign({
            exp: 60 * 60,
            userId: userCreated.id
        },
            process.env.SECRET_KEY
        );

        res.status(201).json({ message: "Registered successfully", token, id: userCreated.id })

    } catch (error) {
        return res.status(500).json({ message: error.message })
    }

}