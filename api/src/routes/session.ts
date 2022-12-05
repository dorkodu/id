import * as express from "express";
import controller from "../controllers/session";
import { apiRoutes } from "../../../shared/src/api_routes";
import { handleErrors } from "./middlewares";

const router = express.Router();

router.post(apiRoutes.getCurrentSession, handleErrors(controller.getCurrentSession));
router.post(apiRoutes.getSessions, handleErrors(controller.getSessions));
router.post(apiRoutes.terminateSession, handleErrors(controller.terminateSession));

export default router;