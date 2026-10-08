import express from "express";
import { protect, restrictTo } from "../middleware/authMiddleware.js";
import { bookAppointment, getMyAppointment, getPatientHistory } from "../controllers/patientController.js";

const router = express.Router();

router.use(protect, restrictTo("patient"));
router.post("/book", bookAppointment);
router.get("/my-appointment", getMyAppointment);
router.get("/history", getPatientHistory);

export default router;