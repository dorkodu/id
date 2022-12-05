import * as express from "express";
import controller from "../controllers/access";
import { apiRoutes } from "../../../shared/src/api_routes";
import { handleErrors } from "./middlewares";

const router = express.Router();

router.post(apiRoutes.getAccesses, handleErrors(controller.getAccesses));
router.post(apiRoutes.grantAccess, handleErrors(controller.grantAccess));
router.post(apiRoutes.revokeAccess, handleErrors(controller.revokeAccess));

export default router;