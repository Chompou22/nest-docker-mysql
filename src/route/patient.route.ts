import express from "express";
import {
  createPatient,
  deletePatient,
  getPatient,
  getPatients,
  updatePatient,
} from "../controller/patient.controller";

const patientRoutes = express.Router();

patientRoutes.route("/").get(getPatients).post(createPatient);

patientRoutes
  .route("/:id")
  .get(getPatient)
  .put(updatePatient)
  .delete(deletePatient);

export default patientRoutes;
