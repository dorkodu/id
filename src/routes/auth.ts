import express from "express";
import controller from "../controllers/auth";

const router = express.Router();

router.post("/auth", controller.auth);
router.post("/signup", controller.signup);
router.post("/login", controller.login);
router.post("/logout", controller.logout);

export default router;