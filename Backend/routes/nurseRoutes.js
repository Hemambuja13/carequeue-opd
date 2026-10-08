import express from "express";
import { protect, restrictTo } from "../middleware/authMiddleware.js";
import { searchPatientByMobile, saveVitals, getTodayQueue } from "../controllers/nurseController.js";

const router = express.Router();

router.use(protect, restrictTo("nurse"));
router.get("/search/:email", searchPatientByMobile);
router.put("/vitals/:id", saveVitals);
router.get("/today-queue", getTodayQueue);

export default router;