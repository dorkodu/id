import * as express from "express";
import controller from "../controllers/auth";

const router = express.Router();

router.post("/auth", controller.auth);
router.post("/temporaryAuth", controller.temporaryAuth);
router.post("/refreshAuth", controller.refreshAuth);
router.post("/login", controller.login);
router.post("/signup", controller.signup);
router.post("/logout", controller.logout);

export default router;