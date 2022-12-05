import * as express from "express";
import controller from "../controllers/auth";
import { apiRoutes } from "../../../shared/src/api_routes";
import { handleErrors } from "./middlewares";

const router = express.Router();

router.post(apiRoutes.auth, handleErrors(controller.auth));

router.post(apiRoutes.initiateSignup, handleErrors(controller.initiateSignup));
router.post(apiRoutes.confirmSignup, handleErrors(controller.confirmSignup));
router.post(apiRoutes.login, handleErrors(controller.login));
router.post(apiRoutes.logout, handleErrors(controller.logout));

export default router;