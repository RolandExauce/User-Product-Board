import { Request, Response } from "express";
import { deleteUser } from "../../database/queries/user.queries";
import { missingIdOrPsAndDelKey } from "../../database/errors";

//delete user controller
export const controllerDeleteUser = async (req: Request, res: Response) => {
  // Extracting parameters from request
  const idToDelete = req.params.id;
  const deleteKey = req.params.key;

  // Check if ID to delete or delete key is missing
  if (!idToDelete || !deleteKey) {
    res.status(400).send(missingIdOrPsAndDelKey("USER"));
    return;
  }

  // Attempt to delete user
  const result = await deleteUser({
    _id: idToDelete,
    deleteKey,
  });

  // Send response based on delete result
  if (result.__typename === "Success") {
    res.status(200).send(result.result);
  } else {
    res.status(404).send(result.error); //status 404, ressource not found
  }
};
