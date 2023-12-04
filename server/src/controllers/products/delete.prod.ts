import { Request, Response } from "express";
import { missingIdOrPsAndDelKey } from "../../database/errors";
import { deleteProduct } from "../../database/queries/product.queries";

//delete user controller
export const controllerDeleteProd = async (req: Request, res: Response) => {
  // Extracting parameters from request
  const psNumber = req.params.psNumber;
  const deleteKey = req.params.key;

  // Check if ID or psNumber to delete is missing
  if (!psNumber || !deleteKey) {
    res.status(400).send(missingIdOrPsAndDelKey("PRODUCT"));
    return;
  }

  // Attempt to delete product
  const result = await deleteProduct({
    psNumber,
    deleteKey,
  });

  // Send response based on delete result
  if (result.__typename === "Success") {
    res.status(200).send(result.result);
  } else {
    res.status(404).send(result.error); //status 404, ressource not found
  }
};
