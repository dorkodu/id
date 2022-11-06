import * as express from "express";
import controller from "../controllers/auth";
import { apiRoutes } from "../types/types";

const router = express.Router();

router.post(apiRoutes.auth, controller.auth);

router.post(apiRoutes.signup, controller.signup);
router.post(apiRoutes.login, controller.login);
router.post(apiRoutes.logout, controller.logout);

export default router;