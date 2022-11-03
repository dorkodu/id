import * as express from "express";
import controller from "../controllers/auth";
import { routes } from "./routes";

const router = express.Router();

router.post(routes.auth, controller.auth);

router.post(routes.signup, controller.signup);
router.post(routes.login, controller.login);
router.post(routes.logout, controller.logout);

export default router;