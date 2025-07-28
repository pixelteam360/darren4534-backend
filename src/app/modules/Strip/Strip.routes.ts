import express from "express";
import auth from "../../middlewares/auth";
import { StripController } from "./Strip.controller";
import { StripService } from "./Strip.service";

const router = express.Router();

router.route("/auth").get(auth(), StripController.stripeAuth);

router.get("/callback", StripService.stripeCallback);

router.get("/success", StripController.successStatus);

export const StripRoutes = router;
