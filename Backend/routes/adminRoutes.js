import express from "express";
import { protect, restrictTo } from "../middleware/authMiddleware.js";
import { runSorting, getStats, getTodayQueueForAdmin, getStaff } from "../controllers/adminController.js";

const router = express.Router();

router.use(protect, restrictTo("admin"));
router.post("/run-sorting", runSorting);
router.get("/stats", getStats);
router.get("/queue", getTodayQueueForAdmin);
router.get("/staff", getStaff);

export default router;