import { Response } from "express";
import { modifiedRequestCreateUser } from "../../tools/types";
import { createUser } from "../../database/queries/user.queries";
import { VALUES_MISSING_CANNOT_CREATE } from "../../database/errors";
import { allPropsOnBody } from "../../tools/utils";
import { userSchema } from "../_inits";

// Create user controller
export const controllerCreateUser = async (
  req: modifiedRequestCreateUser,
  res: Response
) => {
  // Check if body has all fields
  const { missing, valuesMissing } = allPropsOnBody(req.body, userSchema);
  if (missing) {
    res
      .status(400) // Bad request, incomplete parameters
      .send(VALUES_MISSING_CANNOT_CREATE("USER", valuesMissing.join(", "))); // Convert items in array to a string
    return;
  }

  // Try to create user
  const result = await createUser(req.body);
  if (result.__typename === "Success") {
    res.status(200).send(result.result);
  } else {
    res.status(409).send(result.error); // HTTP status 409 => Conflict, resource already exists
  }
};
