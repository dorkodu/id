import * as express from "express";
import controller from "../controllers/session";

const router = express.Router();

router.post("/getCurrentSession", controller.getCurrentSession);
router.post("/getSessions", controller.getSessions);
router.post("/terminateSession", controller.terminateSession);

export default router;