import express from "express";
const router = express.Router();

import {
    userLogin,
    userRegister
} from "../controllers/authController.js";

router.post('/login', userLogin)
router.post('/register', userRegister)

export default router;
