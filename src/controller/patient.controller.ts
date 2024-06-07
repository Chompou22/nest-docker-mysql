import { Response as ExpressResponse, Request } from "express";
import database from "../config/mysql.config";
import Response from "../domain/response";
import QUERY from "../query/patient.query";
import logger from "../util/logger";

interface HttpStatus {
  [key: string]: { code: number; status: string };
}

const HttpStatus: HttpStatus = {
  OK: { code: 200, status: "OK" },
  CREATED: { code: 201, status: "CREATED" },
  NO_CONTENT: { code: 204, status: "NO_CONTENT" },
  BAD_REQUEST: { code: 400, status: "BAD_REQUEST" },
  NOT_FOUND: { code: 404, status: "NOT_FOUND" },
  INTERNAL_SERVER_ERROR: { code: 500, status: "INTERNAL_SERVER_ERROR" },
};

export const getPatients = async (req: Request, res: ExpressResponse) => {
  try {
    logger.info(`${req.method} ${req.originalUrl}, fetching patients`);
    const results: any = await database.query(QUERY.SELECT_PATIENTS);
    if (!results || results.length === 0) {
      return res
        .status(HttpStatus.NO_CONTENT.code)
        .send(
          new Response(
            HttpStatus.NO_CONTENT.code,
            HttpStatus.NO_CONTENT.status,
            `No patients found`
          )
        );
    }

    return res
      .status(HttpStatus.OK.code)
      .send(
        new Response(
          HttpStatus.OK.code,
          HttpStatus.OK.status,
          `Patients retrieved`,
          { patients: results }
        )
      );
  } catch (error) {
    const err = error as Error;
    logger.error(err.message);
    return res
      .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
      .send(
        new Response(
          HttpStatus.INTERNAL_SERVER_ERROR.code,
          HttpStatus.INTERNAL_SERVER_ERROR.status,
          `Error occurred`
        )
      );
  }
};

export const createPatient = async (req: Request, res: ExpressResponse) => {
  try {
    logger.info(`${req.method} ${req.originalUrl}, creating patient`);
    const patientData = Object.values(req.body);
    const results: any = await database.query(
      QUERY.CREATE_PATIENT,
      patientData
    );
    const patientId = results.insertId;
    return res
      .status(HttpStatus.CREATED.code)
      .send(
        new Response(
          HttpStatus.CREATED.code,
          HttpStatus.CREATED.status,
          `Patient created`,
          { id: patientId, ...req.body }
        )
      );
  } catch (error) {
    const err = error as Error;
    logger.error(err.message);
    return res
      .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
      .send(
        new Response(
          HttpStatus.INTERNAL_SERVER_ERROR.code,
          HttpStatus.INTERNAL_SERVER_ERROR.status,
          `Error occurred`
        )
      );
  }
};

export const getPatient = async (req: Request, res: ExpressResponse) => {
  try {
    logger.info(`${req.method} ${req.originalUrl}, fetching patient`);
    const results = await database.query(QUERY.SELECT_PATIENT, [req.params.id]);
    if (!results[0]) {
      return res
        .status(HttpStatus.NOT_FOUND.code)
        .send(
          new Response(
            HttpStatus.NOT_FOUND.code,
            HttpStatus.NOT_FOUND.status,
            `Patient by id ${req.params.id} was not found`
          )
        );
    }
    return res
      .status(HttpStatus.OK.code)
      .send(
        new Response(
          HttpStatus.OK.code,
          HttpStatus.OK.status,
          `Patient retrieved`,
          results[0]
        )
      );
  } catch (error) {
    const err = error as Error;
    logger.error(err.message);
    return res
      .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
      .send(
        new Response(
          HttpStatus.INTERNAL_SERVER_ERROR.code,
          HttpStatus.INTERNAL_SERVER_ERROR.status,
          `Error occurred`
        )
      );
  }
};

export const updatePatient = async (req: Request, res: ExpressResponse) => {
  try {
    logger.info(`${req.method} ${req.originalUrl}, updating patient`);
    const results = await database.query(QUERY.SELECT_PATIENT, [req.params.id]);
    if (!results[0]) {
      return res
        .status(HttpStatus.NOT_FOUND.code)
        .send(
          new Response(
            HttpStatus.NOT_FOUND.code,
            HttpStatus.NOT_FOUND.status,
            `Patient by id ${req.params.id} was not found`
          )
        );
    }
    await database.query(QUERY.UPDATE_PATIENT, [
      ...Object.values(req.body),
      req.params.id,
    ]);
    return res
      .status(HttpStatus.OK.code)
      .send(
        new Response(
          HttpStatus.OK.code,
          HttpStatus.OK.status,
          `Patient updated`,
          { id: req.params.id, ...req.body }
        )
      );
  } catch (error) {
    const err = error as Error;
    logger.error(err.message);
    return res
      .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
      .send(
        new Response(
          HttpStatus.INTERNAL_SERVER_ERROR.code,
          HttpStatus.INTERNAL_SERVER_ERROR.status,
          `Error occurred`
        )
      );
  }
};

export const deletePatient = async (req: Request, res: ExpressResponse) => {
  try {
    logger.info(`${req.method} ${req.originalUrl}, deleting patient`);
    const results: any = await database.query(QUERY.DELETE_PATIENT, [
      req.params.id,
    ]);
    if (results.affectedRows === 0) {
      return res
        .status(HttpStatus.NOT_FOUND.code)
        .send(
          new Response(
            HttpStatus.NOT_FOUND.code,
            HttpStatus.NOT_FOUND.status,
            `Patient by id ${req.params.id} was not found`
          )
        );
    }
    return res
      .status(HttpStatus.OK.code)
      .send(
        new Response(
          HttpStatus.OK.code,
          HttpStatus.OK.status,
          `Patient deleted`,
          results[0]
        )
      );
  } catch (error) {
    const err = error as Error;
    logger.error(err.message);
    return res
      .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
      .send(
        new Response(
          HttpStatus.INTERNAL_SERVER_ERROR.code,
          HttpStatus.INTERNAL_SERVER_ERROR.status,
          `Error occurred`
        )
      );
  }
};

export default HttpStatus;
