import * as express from "express";
import controller from "../controllers/external";
import { apiRoutes } from "../../../shared/src/api_routes";
import { handleErrors } from "./middlewares";

const router = express.Router();

router.post(apiRoutes.getAccessToken, handleErrors(controller.getAccessToken));
router.post(apiRoutes.checkAccess, handleErrors(controller.checkAccess));
router.post(apiRoutes.getUserData, handleErrors(controller.getUserData));

export default router;