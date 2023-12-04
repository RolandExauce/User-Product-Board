import { Request, Response } from "express";
import { getUsers } from "../../database/queries/user.queries";

// GET users controller
export const controllerGetUsers = async (req: Request, res: Response) => {
  const result = await getUsers();
  if (result.__typename === "Success") {
    res.status(200).send(result.users);
  } else {
    res.status(400).send(result.error);
  }
};