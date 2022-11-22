import * as express from "express";
import controller from "../controllers/access";
import { apiRoutes } from "../../../shared/src/api_routes";

const router = express.Router();

router.post(apiRoutes.getAccesses, controller.getAccesses);
router.post(apiRoutes.grantAccess, controller.grantAccess);
router.post(apiRoutes.revokeAccess, controller.revokeAccess);

export default router;