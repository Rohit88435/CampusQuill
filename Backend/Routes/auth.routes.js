import express from "express";
import { login, logout, signup } from "../Controller/auth.controllers.js";
import isAuth from "../MiddleWares/isAuth.js";

// instance of router form express
export let authRouter = express.Router();

// signup post
authRouter.post("/signup", isAuth, signup);

authRouter.post("/login", isAuth, login);

authRouter.get("/logout", isAuth, logout);
