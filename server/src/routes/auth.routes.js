import e from "express";
import {login,signUp , logout, CheckAuth, updateProfile,} from "../controllers/auth.controller.js"
import { protectRoute } from "../middlewares/auth.middlewares.js";

const router = e.Router();

router.post("/signUp",signUp);

router.post("/login",login);

router.post("/logout",logout);

router.put("/update-profile",protectRoute,updateProfile)

router.get("/check",protectRoute,CheckAuth);


export default router;
  