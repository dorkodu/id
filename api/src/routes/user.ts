import * as express from "express";
import controller from "../controllers/user";
import { routes } from "./routes";

const router = express.Router();

router.post(routes.getUser, controller.getUser);

router.post(routes.changeUsername, controller.changeUsername);

router.post(routes.initiateEmailChange, controller.initiateEmailChange);
router.post(routes.confirmEmailChange, controller.confirmEmailChange);
router.post(routes.revertEmailChange, controller.revertEmailChange);

router.post(routes.initiatePasswordChange, controller.initiatePasswordChange);
router.post(routes.confirmPasswordChange, controller.confirmPasswordChange);

export default router;