import * as express from "express";
import controller from "../controllers/user";
import { apiRoutes } from "../../../shared/src/api_routes";
import { handleErrors } from "./middlewares";

const router = express.Router();

router.post(apiRoutes.getUser, handleErrors(controller.getUser));

router.post(apiRoutes.changeUsername, handleErrors(controller.changeUsername));

router.post(apiRoutes.initiateEmailChange, handleErrors(controller.initiateEmailChange));
router.post(apiRoutes.confirmEmailChange, handleErrors(controller.confirmEmailChange));
router.post(apiRoutes.revertEmailChange, handleErrors(controller.revertEmailChange));

router.post(apiRoutes.initiatePasswordChange, handleErrors(controller.initiatePasswordChange));
router.post(apiRoutes.confirmPasswordChange, handleErrors(controller.confirmPasswordChange));

export default router;