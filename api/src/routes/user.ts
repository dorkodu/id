import * as express from "express";
import controller from "../controllers/user";

const router = express.Router();

router.post("/getUser", controller.getUser);

router.post("/changeUsername", controller.changeUsername);
router.post("/changeEmail", controller.changeEmail);
router.post("/changePassword", controller.changePassword);

export default router;