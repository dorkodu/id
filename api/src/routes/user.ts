import * as express from "express";
import controller from "../controllers/user";
import { routes } from "./routes";

const router = express.Router();

router.post(routes.getUser, controller.getUser);

router.post(routes.changeUsername, controller.changeUsername);
router.post(routes.changeEmail, controller.changeEmail);
router.post(routes.changePassword, controller.changePassword);

export default router;