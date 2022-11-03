import * as express from "express";
import controller from "../controllers/session";
import { routes } from "./routes";

const router = express.Router();

router.post(routes.getCurrentSession, controller.getCurrentSession);
router.post(routes.getSessions, controller.getSessions);
router.post(routes.terminateSession, controller.terminateSession);

export default router;