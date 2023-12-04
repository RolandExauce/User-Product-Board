import { Request, Response } from "express";
import { getProducts } from "../../database/queries/product.queries";

// GET products controller
export const controllerGetProds = async (req: Request, res: Response) => {
  const result = await getProducts();
  if (result.__typename === "Success") {
    res.status(200).send(result.products);
  } else {
    res.status(400).send(result.error);
  }
};
