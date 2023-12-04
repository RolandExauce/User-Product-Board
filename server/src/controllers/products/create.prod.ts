import { Response } from "express";
import { modifiedRequestCreateProduct } from "../../tools/types";
import { VALUES_MISSING_CANNOT_CREATE } from "../../database/errors";
import { allPropsOnBody } from "../../tools/utils";
import { productSchema } from "../_inits";
import { createProduct } from "../../database/queries/product.queries";

// Create product controller
export const controllerCreateProd = async (
  req: modifiedRequestCreateProduct,
  res: Response
) => {
  // Check if body has all fields
  const { missing, valuesMissing } = allPropsOnBody(req.body, productSchema);
  if (missing) {
    res
      .status(400) // Bad request, incomplete parameters
      .send(VALUES_MISSING_CANNOT_CREATE("PRODUCT", valuesMissing.join(", "))); // Convert items in array to a string
    return;
  }

  // Try to create a product
  const result = await createProduct(req.body);
  if (result.__typename === "Success") {
    res.status(200).send(result.result);
  } else {
    res.status(409).send(result.error); // HTTP status 409 => Conflict, resource already exists
  }
};
