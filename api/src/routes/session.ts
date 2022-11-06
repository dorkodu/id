import * as express from "express";
import controller from "../controllers/session";
import { apiRoutes } from "../types/types";

const router = express.Router();

router.post(apiRoutes.getCurrentSession, controller.getCurrentSession);
router.post(apiRoutes.getSessions, controller.getSessions);
router.post(apiRoutes.terminateSession, controller.terminateSession);

export default router;