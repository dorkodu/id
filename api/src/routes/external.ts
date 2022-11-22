import * as express from "express";
import controller from "../controllers/external";
import { apiRoutes } from "../../../shared/src/api_routes";

const router = express.Router();

router.post(apiRoutes.getAccessToken, controller.getAccessToken);
router.post(apiRoutes.checkAccess, controller.checkAccess);
router.post(apiRoutes.getUserData, controller.getUserData);

export default router;