import { Request, Response, NextFunction } from "express";
import { getAuthUser } from "./auth";
import { FORBIDDEN_REQUEST, NO_AUTH } from "../database/errors";

//validate user
export const controllerValidateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Perform user existence and validation logic here
  const loggedInUser = await getAuthUser(req);
  if (!loggedInUser) {
    res.status(401).send(NO_AUTH); // User not authenticated
    return;
  }
  req.user = loggedInUser; 
  next(); // Allow request to proceed
};

//only for admins
export const restrictToAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Check if user exists and is an admin
  if (req.user && req.user.role === "ADMIN") {
    next(); // Allow request to proceed
  } else {
    res.status(403).send(FORBIDDEN_REQUEST); // User not authorized to perform the action
  }
};
