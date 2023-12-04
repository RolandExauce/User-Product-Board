require("dotenv").config({ path: require("find-config")("../.env") });
import { cleanEnv, port, str, num } from "envalid";
import { EnvVars } from "./types";
import { Algorithm } from "jsonwebtoken";

//validate env vars
const validateEnv = (): Readonly<EnvVars> => {
  const envs = cleanEnv(process.env, {
    accessTokenExpireIn: num(),
    refreshTokenExpireIn: num(),
    sessionCookieExpiresIn: num(),
    JWT_PRIVATE_KEY_ACCESS: str(),
    JWT_PUBLIC_KEY_ACCESS: str(),
    JWT_PRIVATE_KEY_REFRESH: str(),
    JWT_PUBLIC_KEY_REFRESH: str(),
    SESSION_KEY: str(),
    /**************************** */
    PORT_EXPRESS: port(),
    SQL_HOST: str(),
    SQL_USER: str(),
    SQL_PASS: str(),
    SQL_DATABASE: str(),
    TABLE_1: str(),
    TABLE_2: str(),
    DEFAULT_VAL: str(),
    DEFAULT_VAL_CURRENCY: str(),
    ALGORITHM: str(),
    /********************** */
    CSV_PRODS: str(),
    CSV_USERS: str(),
    DELETE_KEY_FOR_PRODUCTS: str(),
    DELETE_KEY_FOR_USERS: str(),
    NODE_ENV: str({
      choices: ["development", "test", "production", "staging"],
    }),
  });
  return envs;
};
/*********************************************************************** */

const SQL_HOST = validateEnv().SQL_HOST;
const SQL_USER = validateEnv().SQL_USER;
const SQL_PASS = validateEnv().SQL_PASS;
const SQL_DATABASE = validateEnv().SQL_DATABASE;
const TABLE_1 = validateEnv().TABLE_1;
const TABLE_2 = validateEnv().TABLE_2;
const DEFAULT_VAL = validateEnv().DEFAULT_VAL;
const DEFAULT_VAL_CURRENCY = validateEnv().DEFAULT_VAL_CURRENCY;
const DELETE_KEY_FOR_PRODUCTS = validateEnv().DELETE_KEY_FOR_PRODUCTS;
const DELETE_KEY_FOR_USERS = validateEnv().DELETE_KEY_FOR_USERS;

/********************************** */
const CSV_PRODS = validateEnv().CSV_PRODS;
const CSV_USERS = validateEnv().CSV_USERS;
const PORT_EXPRESS = validateEnv().PORT_EXPRESS;
const NODE_ENV = validateEnv().NODE_ENV;

/***************************************************** */
const ALGORITHM = validateEnv().ALGORITHM as Algorithm;
const accessTokenExpireIn = validateEnv().accessTokenExpireIn;
const refreshTokenExpireIn = validateEnv().refreshTokenExpireIn;
const sessionCookieExpiresIn = validateEnv().sessionCookieExpiresIn;
const JWT_PRIVATE_KEY_ACCESS = validateEnv().JWT_PRIVATE_KEY_ACCESS;
const JWT_PUBLIC_KEY_ACCESS = validateEnv().JWT_PUBLIC_KEY_ACCESS;
const JWT_PRIVATE_KEY_REFRESH = validateEnv().JWT_PRIVATE_KEY_REFRESH;
const JWT_PUBLIC_KEY_REFRESH = validateEnv().JWT_PUBLIC_KEY_REFRESH;
const SESSION_KEY = validateEnv().SESSION_KEY;

//export env vars
export {
  SQL_HOST,
  SQL_USER,
  SQL_PASS,
  SQL_DATABASE,
  TABLE_1,
  TABLE_2,
  DEFAULT_VAL,
  DEFAULT_VAL_CURRENCY,
  DELETE_KEY_FOR_PRODUCTS,
  DELETE_KEY_FOR_USERS,
  /****************** */
  accessTokenExpireIn,
  refreshTokenExpireIn,
  sessionCookieExpiresIn,
  JWT_PRIVATE_KEY_ACCESS,
  JWT_PUBLIC_KEY_ACCESS,
  JWT_PRIVATE_KEY_REFRESH,
  JWT_PUBLIC_KEY_REFRESH,
  SESSION_KEY,
  /*************** */
  CSV_PRODS,
  CSV_USERS,
  PORT_EXPRESS,
  ALGORITHM,
  NODE_ENV,
};
