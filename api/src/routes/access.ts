import * as express from "express";
import controller from "../controllers/access";
import { routes } from "./routes";

const router = express.Router();

router.post(routes.getAccesses, controller.getAccesses);
router.post(routes.checkAccess, controller.checkAccess);
router.post(routes.grantAccess, controller.grantAccess);
router.post(routes.revokeAccess, controller.revokeAccess);

export default router;