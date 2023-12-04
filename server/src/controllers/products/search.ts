import { Request, Response } from "express";
import { IProduct } from "../../tools/types";
import { searchProduct } from "../../database/queries/product.queries";
import { missingSearchParams } from "../../database/errors";

// search user controller
export const controllerSearchProd = async (req: Request, res: Response) => {
  const { psNumber, name } = req.query;
  if (!psNumber || !name) {
    return res.status(400).send(missingSearchParams("PRODUCT")); // Return here to avoid further execution
  }

  const result = await searchProduct({
    name: String(name),
    psNumber: String(psNumber),
  });
  if (result.__typename === "Success") {
    const { product } = result;
    const reducedAuth = extractProductDetails(product);
    return res.status(200).send(reducedAuth);
  } else {
    return res.status(404).send(result.error);
  }
};

// extract only necessary fields on user
const extractProductDetails = (product: IProduct) => {
  const {
    brandCode,
    categoryCode,
    familyCode,
    lineCode,
    name,
    psNumber,
    sourceLink,
    value,
  } = product;
  return {
    brandCode,
    categoryCode,
    familyCode,
    lineCode,
    name,
    psNumber,
    sourceLink,
    value,
  };
};
