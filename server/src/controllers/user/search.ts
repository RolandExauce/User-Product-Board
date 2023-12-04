import { searchUser } from "../../database/queries/user.queries";
import { Request, Response } from "express";
import { IUser } from "../../tools/types";
import { missingSearchParams } from "../../database/errors";

// search user controller
export const controllerSearchUser = async (req: Request, res: Response) => {
  const { _id, lastName, firstName, userName } = req.query;
  if (!_id && !lastName && !firstName && !userName) {
    return res.status(400).send(missingSearchParams("USER")); // Return here to avoid further execution
  }

  // optional search params
  const searchParams = {
    _id: String(_id),
    lastName: String(lastName),
    firstName: String(firstName),
    userName: String(userName),
  };

  const result = await searchUser(searchParams);
  if (result.__typename === "Success") {
    const { user } = result;
    const reducedAuth = extractUserDetails(user);
    return res.status(200).send(reducedAuth);
  } else {
    return res.status(404).send(result.error);
  }
};

// extract only necessary fields on user
const extractUserDetails = (user: IUser) => {
  const { userName, role, email, department, lastName, firstName, jobRole } =
    user;
  return {
    userName,
    role,
    email,
    department,
    lastName,
    firstName,
    jobRole,
  };
};
