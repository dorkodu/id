import * as express from "express";
import controller from "../controllers/user";
import { apiRoutes } from "../types/types";

const router = express.Router();

router.post(apiRoutes.getUser, controller.getUser);

router.post(apiRoutes.changeUsername, controller.changeUsername);

router.post(apiRoutes.initiateEmailChange, controller.initiateEmailChange);
router.post(apiRoutes.confirmEmailChange, controller.confirmEmailChange);
router.post(apiRoutes.revertEmailChange, controller.revertEmailChange);

router.post(apiRoutes.initiatePasswordChange, controller.initiatePasswordChange);
router.post(apiRoutes.confirmPasswordChange, controller.confirmPasswordChange);

export default router;