import { Request, Response } from "express";
import { NO_UPDATE_WHERE_PARAM } from "../../database/errors";
import { updateUser } from "../../database/queries/user.queries";

//update controller
export const controllerUpdateUser = async (req: Request, res: Response) => {
  const emailOfUserToUpdate = req.params.email; // Extract the user ID from the URL params
  const {
    newLastName,
    newFirstName,
    newUserName,
    newEmail,
    newDepartment,
    newRole,
    newJobRole,
  } = req.body;

  // Check if at least one field is provided for the update, email of user to update must be provided
  if (!emailOfUserToUpdate) {
    res.status(400).send(NO_UPDATE_WHERE_PARAM("USER"));
    return;
  }

  const updateParams = {
    emailOfUserToUpdate: emailOfUserToUpdate,
    newLastName,
    newFirstName,
    newUserName,
    newEmail,
    newDepartment,
    newRole,
    newJobRole,
  };

  //attempt to update user credentials
  const updateResult = await updateUser(updateParams);
  if (updateResult.__typename === "Success") {
    res.status(200).send(updateResult.result);
  } else {
    res.status(404).send(updateResult.error);
  }
};
