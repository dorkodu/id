import * as express from "express";
import controller from "../controllers/access";

const router = express.Router();

router.post("/check", controller.check);

router.post("/grant", controller.grant);
router.post("/revoke", controller.revoke);

export default router;