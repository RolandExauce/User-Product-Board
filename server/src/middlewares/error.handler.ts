import { Request, Response, NextFunction } from "express";
import { SERVER_ERROR } from "../database/errors";

//err handler
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err.stack); // Log the error for debugging purposes
  // Handle different types of errors or respond with a generic server error
  res.status(500).send(SERVER_ERROR);
};

export default errorHandler; // Export the middleware
