import express from "express";
import { protect, restrictTo } from "../middleware/authMiddleware.js";
import { searchPatientForDoctor, savePrescription, getPastPrescriptions } from "../controllers/doctorController.js";

const router = express.Router();

router.use(protect, restrictTo("doctor"));
router.get("/search/:email", searchPatientForDoctor);
router.put("/prescribe/:id", savePrescription);
router.get("/past-prescriptions", getPastPrescriptions);

export default router;