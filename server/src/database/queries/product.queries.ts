import {
  CANNOT_CREATE_PROD,
  CANNOT_DELETE_PROD,
  CANNOT_UPDATE_PROD,
  NO_DELETE_PARAMS_PROD,
  NO_PROD_FOUND,
  NO_SEARCH_PARAMS_PROD,
  NO_UPDATE_ISSUED,
  OP_MSG_ON_PRODUCT,
  UNDEFINED_ERR,
  WRONG_DELETE_KEY,
} from "../errors";
import { RowDataPacket } from "mysql2";
import {
  CreateParamsProduct,
  CreateProductResponse,
  DeleteParamsProduct,
  DeleteProductResponse,
  GetProductsResponse,
  IProdNoCurrencyNoID,
  IProduct,
  SearchParamsProduct,
  SearchProductResponse,
  SqlOperationResult,
  UpdateParamsProduct,
  UpdateProductResponse,
} from "../../tools/types";
import { DELETE_KEY_FOR_PRODUCTS } from "../../tools/envs";
import { initPool } from "../_sql.init";
import { evalRecordOnUpdate, opResult } from "../../tools/utils";
import {
  CREATE_PRODUCT,
  DELETE_PRODUCT,
  GET_PRODUCTS,
  SEARCH_PRODUCT,
  UPDATE_PRODUCT,
} from "./product.sql";
import { ID } from "../../tools/constants";
import { prodKeys } from "../../controllers/_inits";

const pool = initPool(); //get the connection pool
//get products
const getProducts = async (): Promise<GetProductsResponse> => {
  const rows = (await (await pool)?.query(GET_PRODUCTS)) as RowDataPacket[];
  return {
    __typename: "Success",
    products: rows[0] as IProduct[],
  };
};

//find one product by id or psNumber
const searchProduct = async (
  params: SearchParamsProduct
): Promise<SearchProductResponse> => {
  const { name, psNumber } = params;
  if (!name && !psNumber) {
    return {
      __typename: "CustomError",
      error: NO_SEARCH_PARAMS_PROD,
    };
  } else {
    const [foundProduct] = (await (
      await pool
    )?.query(SEARCH_PRODUCT, [name, psNumber])) as RowDataPacket[];

    if (foundProduct[0]) {
      return {
        __typename: "Success",
        product: foundProduct[0] as IProduct,
      };
    } else {
      return {
        __typename: "CustomError",
        error: NO_PROD_FOUND,
      };
    }
  }
};

//create a new product
const createProduct = async (
  params: CreateParamsProduct
): Promise<CreateProductResponse> => {
  const { psNumber, categoryCode, brandCode, familyCode, value, name } = params;
  const row = (await (
    await pool
  )?.query(CREATE_PRODUCT, [
    ID,
    psNumber,
    categoryCode,
    brandCode,
    familyCode,
    value,
    name,
  ])) as SqlOperationResult;

  let rowsAffected = opResult(row);
  if (rowsAffected === 1) {
    return {
      __typename: "Success",
      result: OP_MSG_ON_PRODUCT(psNumber, "CREATE"), //msg that record was created
    };
  } else {
    return {
      __typename: "CustomError",
      error: CANNOT_CREATE_PROD,
    };
  }
};

//find one product by id or psNumber
const updateProduct = async (
  params: UpdateParamsProduct
): Promise<UpdateProductResponse> => {
  //update params
  const {
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
  } = params;

  let prodToUpdate = {} as any;
  let prodFound = {} as IProdNoCurrencyNoID;
  const result = await searchProduct({ psNumber: psNOfProdToUpdate });
  if (result.__typename === "Success") {
    prodToUpdate = result.product;
    delete prodToUpdate._id; //remove _id
    delete prodToUpdate.valueCurrency; // remove remove value currency
    prodFound = prodToUpdate;

    // Constructing updatedValues array
    // Check if values are provided, else use existing values from prodFound
    const updatedValues: Partial<IProdNoCurrencyNoID> = {
      psNumber: newPsNumber ?? prodFound.psNumber,
      productType: newProductType ?? prodFound.productType,
      categoryCode: newCategoryCode ?? prodFound.categoryCode,
      brandCode: newBrandCode ?? prodFound.brandCode,
      familyCode: newFamilyCode ?? prodFound.familyCode,
      lineCode: newLineCode ?? prodFound.lineCode,
      status: newStatus ?? prodFound.status,
      value: newValue ?? prodFound.value,
      name: newName ?? prodFound.name,
      sourceLink: newSourceLink ?? prodFound.name,
    };

    // Evaluate if values have been modified
    const valuesUpdated = evalRecordOnUpdate(
      prodFound,
      prodKeys.map((key) => updatedValues[key] ?? prodToUpdate[key])
    );

    const UPDATE_VALUES = [
      updatedValues.psNumber,
      updatedValues.productType,
      updatedValues.categoryCode,
      updatedValues.brandCode,
      updatedValues.familyCode,
      updatedValues.lineCode,
      updatedValues.status,
      updatedValues.value,
      updatedValues.name,
      updatedValues.sourceLink,
      psNOfProdToUpdate,
    ];

    //only update if values are modified
    if (valuesUpdated) {
      const row = (await (
        await pool
      )?.query(UPDATE_PRODUCT, UPDATE_VALUES)) as SqlOperationResult;

      //get rows affected field
      let rowsAffected = opResult(row);
      if (rowsAffected === 1) {
        return {
          __typename: "Success",
          result: OP_MSG_ON_PRODUCT(psNOfProdToUpdate, "UPDATE"),
        }; //msg that record was updated}
      } else {
        return {
          __typename: "CustomError",
          error: CANNOT_UPDATE_PROD,
        };
      }
    } else {
      return {
        __typename: "Success",
        result: NO_UPDATE_ISSUED, //no updates, this will count as success
      };
    }
  } else {
    return {
      __typename: "CustomError",
      error: NO_PROD_FOUND,
    };
  }
};

//delete product
const deleteProduct = async (
  params: DeleteParamsProduct
): Promise<DeleteProductResponse> => {
  const { psNumber, deleteKey } = params;
  //if one of the options to delete a product is not passed
  if (!psNumber || !deleteKey) {
    return {
      __typename: "CustomError",
      error: NO_DELETE_PARAMS_PROD,
    };
  }
  if (psNumber && deleteKey) {
    const checkKey = deleteKey === DELETE_KEY_FOR_PRODUCTS; //check if correct delete key was passed
    if (checkKey) {
      const row = (await (
        await pool
      )?.query(DELETE_PRODUCT, [psNumber])) as SqlOperationResult;
      let rowsAffected = opResult(row);
      if (rowsAffected === 1) {
        return {
          __typename: "Success",
          result: OP_MSG_ON_PRODUCT(psNumber, "DELETE"),
        }; //msg that record was deleted
      } else {
        return {
          __typename: "CustomError",
          error: CANNOT_DELETE_PROD, //no record found
        };
      }
    } else {
      return {
        __typename: "CustomError",
        error: WRONG_DELETE_KEY,
      }; //if key to delete was wrong
    }
  } else {
    return { __typename: "CustomError", error: UNDEFINED_ERR };
  }
};

export {
  getProducts,
  searchProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};
