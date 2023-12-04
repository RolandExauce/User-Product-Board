import { Request, Response } from "express";
import { NO_UPDATE_WHERE_PARAM } from "../../database/errors";
import { updateProduct } from "../../database/queries/product.queries";
import { obIsEmpty } from "../../tools/utils";

//update product controller
export const controllerUpdateProd = async (req: Request, res: Response) => {
  const psNOfProdToUpdate = req.params.psN; //psNumber of product to update
  const {
    newPsNumber,
    newProductType,
    newCategoryCode,
    newBrandCode,
    newFamilyCode,
    newLineCode,
    newStatus,
    newValue,
    newName,
    newSourceLink,
  } = req.body;

  //  psNumber of product to update must be provided
  if (!psNOfProdToUpdate)
    res.status(400).send(NO_UPDATE_WHERE_PARAM("PRODUCT"));

  if (obIsEmpty(req.body)) {
    res.status(404); //empty content, new update parameters not provided
  }

  const updateParams = {
    psNOfProdToUpdate,
    newPsNumber,
    newProductType,
    newCategoryCode,
    newBrandCode,
    newFamilyCode,
    newLineCode,
    newStatus,
    newValue,
    newName,
    newSourceLink,
  };

  //attempt to update product
  const updateResult = await updateProduct(updateParams);
  if (updateResult.__typename === "Success") {
    res.status(200).send(updateResult.result);
  } else {
    res.status(204).send(updateResult.error);
  }
};
