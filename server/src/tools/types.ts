import { Request } from "express";

import {
  FieldPacket,
  ProcedureCallPacket,
  ResultSetHeader,
  RowDataPacket,
} from "mysql2";

type RecordWithStringOrNumber = Record<string, string | number>;

//env type
type ConfigType = {
  [key: string]: EnvType;
};

//server config
interface EnvType {
  ssl: boolean;
  port: number;
  hostname: string;
}


//env variables used
interface EnvVars {
  NODE_ENV: "test" | "development" | "production" | "staging";
  SQL_HOST: string;
  SQL_USER: string;
  SQL_PASS: string;
  SQL_DATABASE: string;
  TABLE_1: string;
  TABLE_2: string;
  DEFAULT_VAL: string;
  DEFAULT_VAL_CURRENCY: string;
  PORT_EXPRESS: number;
  CSV_PRODS: string;
  CSV_USERS: string;

  //private, public keys, expire dates
  accessTokenExpireIn: number;
  refreshTokenExpireIn: number;
  sessionCookieExpiresIn: number;
  JWT_PRIVATE_KEY_ACCESS: string;
  JWT_PUBLIC_KEY_ACCESS: string;
  JWT_PRIVATE_KEY_REFRESH: string;
  JWT_PUBLIC_KEY_REFRESH: string;
  SESSION_KEY: string;
  /**************** */
  DELETE_KEY_FOR_PRODUCTS: string;
  DELETE_KEY_FOR_USERS: string;
  ALGORITHM: string;
}

//user or product fixed string type
type Entity = "USER" | "PRODUCT";

//login params
interface ILogin {
  username: string;
  password: string;
}

//response when login user
type UserResponse = {
  __typename: "UserResponse";
  user: IUser;
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
};

type LoginResponse = UserResponse | CustomErr; //login response

//remove body from req, so that we can define what should be passed, when login user
type modifiedRequestLogin = Omit<Request, "body"> & {
  body: ILogin;
};
type modifiedRequestCreateUser = Omit<Request, "body"> & { body: IUserNoID }; //same when creating a new user

type modifiedRequestCreateProduct = Omit<Request, "body"> & { body: IProductCreate }; //same when creating a new user

//global success result
type SuccessResult = {
  __typename: "Success";
  result: string;
};

//get users
type UsersResponse = {
  __typename: "Success";
  users: IUser[];
};

type GetUsersResponse = UsersResponse | CustomErr; //on get users
type CreateUserResponse = SuccessResult | CustomErr; //on  user create
type UpdateUserResponse = SuccessResult | CustomErr; //on user update
type DeleteUserResponse = SuccessResult | CustomErr; // on user delete

//custom error object
type CustomErr = {
  __typename: "CustomError";
  error: string;
};

//database connection config input
interface configDB {
  host: string;
  user: string;
  password: string;
  multipleStatements?: boolean;
  database?: string;
}

//when sql operation is done
type SqlOperationResult = [
  RowDataPacket[] | ResultSetHeader[] | RowDataPacket[][] | ProcedureCallPacket,
  FieldPacket[]
];

/****************************************************************************** */

//get users
type ProductsResponse = {
  __typename: "Success";
  products: IProduct[];
};


type SearchResultProduct = {
  __typename: "Success";
  product: IProduct;
};

type GetProductsResponse = ProductsResponse | CustomErr; //get products
type SearchProductResponse = SearchResultProduct | CustomErr; //search response
type CreateProductResponse = SuccessResult | CustomErr; //on product create
type UpdateProductResponse = SuccessResult | CustomErr; //on product update
type DeleteProductResponse = SuccessResult | CustomErr; // on product delete
// type CreateUserResponse = SuccessResult | CustomErr; //on  user create

// type UpdateUserResponse = SuccessResult | CustomErr; //on user update

// type DeleteUserResponse = SuccessResult | CustomErr; // on user delete











//params to search for a product
interface SearchParamsProduct {
  name?: string;
  psNumber?: string;
}

//params to delete a product
interface DeleteParamsProduct {
  psNumber: string;
  deleteKey: string;
}

//new fields for product update
interface UpdateParamsProduct {
  psNOfProdToUpdate: string; //psNumber of product to update
  newPsNumber?: string;
  newProductType?: string;
  newCategoryCode?: string;
  newBrandCode?: string;
  newFamilyCode?: string;
  newLineCode?: string;
  newStatus?: Status;
  newValue?: number;
  newName?: string;
  newSourceLink?: string;
}

//product status
enum Status {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

//create a new product
interface CreateParamsProduct {
  psNumber: string;
  categoryCode: string;
  brandCode: string;
  familyCode: string;
  value: string | number;
  name: string;
}

//all fields of product
interface IProduct extends CreateParamsProduct {
  _id: string;
  productType: string;
  lineCode: string;
  status: Status;
  valueCurrency: string;
  sourceLink: string;
}

type IProdNoCurrencyNoID = Omit<IProduct, "_id" | "valueCurrency">; // will be used in evalRecordOnUpdate function

/************************************************************************************************************** */
//enums department and role
enum Department {
  IT = "IT",
  HR = "HR",
  PR = "PR",
  QC = "QC",
  SALES = "SALES",
}

enum Role {
  ADMIN = "ADMIN",
  USER = "USER",
}

//params to search for a user
interface SearchParamsUser {
  _id?: string; //user search auth
  lastName?: string; // user search lastname
  firstName?: string;
  email?: string;
}

type SearchResultUser = {
  __typename: "Success";
  user: IUser;
};

type SearchUserResponse = SearchResultUser | CustomErr; //search response

//params to delete a user
interface DeleteParamsUser {
  _id: string;
  deleteKey: string;
}

//new fields for user update
interface UpdateParamsUser {
  emailOfUserToUpdate: string; //id of user to update
  newLastName?: string;
  newFirstName?: string;
  newUserName?: string;
  newEmail?: string;
  newDepartment?: Department;
  newRole?: Role;
  newJobRole?: string;
}

//create a new product
interface IUser {
  _id: string;
  lastName: string;
  firstName: string;
  userName: string;
  email: string;
  department: Department;
  role: Role;
  jobRole: string;
  password: string;
}

type IUserNoID = Omit<IUser, "_id">; //when creating user, id is auto generated
type IProductCreate = Omit<IProduct, "_id">; //when creating product, id is auto generated

export {
  /*custom types on body when issuing requests ****/
  modifiedRequestLogin,
  modifiedRequestCreateUser,

  /*********************** */
  configDB,
  SqlOperationResult,
  /* for product operations */
  SearchParamsProduct,
  DeleteParamsProduct,
  UpdateParamsProduct,
  CreateParamsProduct,
  IProduct,
  IProdNoCurrencyNoID,
  GetProductsResponse,
  SearchProductResponse,
  CreateProductResponse,
  UpdateProductResponse,
  DeleteProductResponse,
  IProductCreate,
  modifiedRequestCreateProduct,

  /* for user operations */
  DeleteUserResponse,
  UpdateUserResponse,
  GetUsersResponse,
  SearchParamsUser,
  DeleteParamsUser,
  UpdateParamsUser,
  LoginResponse,
  CreateUserResponse,
  SearchUserResponse,
  IUserNoID,
  IUser,
  /******************* */
  CustomErr,
  SuccessResult,
  Department,
  EnvVars,
  Status,
  ILogin,
  Role,
  Entity,
  /********/
  EnvType,
  ConfigType,
  RecordWithStringOrNumber
};
