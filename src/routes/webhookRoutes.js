import express from "express";
import { GET, POST } from "../controllers/webhookController.js";

const router = express.Router();

router.get("/", GET);
router.post("/", POST);

export default router;
