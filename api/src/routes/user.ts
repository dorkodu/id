import * as express from "express";
import controller from "../controllers/user";
import { routes } from "./routes";

const router = express.Router();

router.post(routes.getUser, controller.getUser);

router.post(routes.changeUsername, controller.changeUsername);

router.post(routes.changeUsername, controller.initiateChangeEmail);
router.get(routes.changeUsername, controller.verifyNewEmailChangeEmail);
router.get(routes.changeUsername, controller.verifyOldEmailChangeEmail);

router.post(routes.changeUsername, controller.initiateChangePassword);
router.get(routes.changeUsername, controller.proceedChangePassword);
router.post(routes.changeUsername, controller.completeChangePassword);

export default router;