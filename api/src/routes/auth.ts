import * as express from "express";
import controller from "../controllers/auth";
import { apiRoutes } from "../types/types";

const router = express.Router();

router.post(apiRoutes.auth, controller.auth);

router.post(apiRoutes.initiateSignup, controller.initiateSignup);
router.post(apiRoutes.confirmSignup, controller.confirmSignup);
router.post(apiRoutes.login, controller.login);
router.post(apiRoutes.logout, controller.logout);

export default router;