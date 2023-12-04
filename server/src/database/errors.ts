import { Response, Request } from "express";
import { Entity } from "../tools/types";

//Error messages
const SERVER_ERROR = "AN ERROR OCCURRED WHILE PROCESSING YOUR REQUEST.";
/* FOR PRODUCTS QUERIES ******************************************************************************/
const NO_AUTH = "YOU ARE NOT AUTHORIZED!";
const UNDEFINED_ERR = `AN UNKNOWN ERRROR OCCURED, PLEASE CONTACT THE ADMIN`; //just to handle undefined function ending

//where to update, other fields are actually optional, a user is not obliged to update all fields of another user or product
const NO_UPDATE_WHERE_PARAM = (updateType: Entity) =>
  `${
    updateType === "USER" ? "EMAIL" : "PSNUMBER"
  } IS MISSING, REQUIRED TO UPDATE ${
    updateType === "USER" ? "USER" : "PRODUCT"
  }`;

//err msg when deleting user or product, if key, id or psNumber missing
const missingIdOrPsAndDelKey = (deleteType: Entity) =>
  `BOTH ${
    deleteType === "PRODUCT" ? "PS-NUMBER" : "ID"
  } AND DELETE KEY HAS TO BE PROVIDED TO DELETE A ${deleteType}!`;

const NO_SEARCH_PARAMS_PROD = `NO SEARCH PARAMETERS PROVIDED, YOU SHOULD ATLEAST PROVIDE THE PRODUCT'S NAME!`;
const NO_DELETE_PARAMS_PROD = `TO DELETE A PRODUCT, YOU MUST PASS THE PS NUMBER AND THE DELETE KEY`;
const WRONG_DELETE_KEY = `WRONG DELETE KEY, CANNOT CARRY OUT THIS OPERATION!`;
const NO_PROD_FOUND = `CANNOT UPDATE PRODUCT, IT WAS NOT FOUND!`;
const CANNOT_DELETE_PROD = `RECORD WAS NOT FOUND, CANNOT DELETE PRODUCT`;
const CANNOT_UPDATE_PROD = `ERROR, CANNOT UPDATE PRODUCT`;
const NO_UPDATE_ISSUED = `NO NEED FOR UPDATE BECAUSE VALUES REMAIN THE SAME`;
const CANNOT_CREATE_PROD = `ERROR, DUPLICATES FOUND FOR FIELDS: PS NUMBER, NAME AND SOURCELINK `;
const NO_VALUES_UPDATED = `NO VALUES HAS BEEN UPDATED!`;

const OP_MSG_ON_PRODUCT = (psNumber: string, op: string) => {
  if (op === "DELETE")
    return `PRODUCT WITH PS NUMBER: ${psNumber} WAS DELETED SUCCESSFULLY`;
  if (op === "UPDATE")
    return `PRODUCT WITH PS NUMBER: ${psNumber} WAS UPDATED SUCCESSFULLY`;
  if (op === "CREATE")
    return `PRODUCT WITH PS NUMBER: ${psNumber} WAS CREATED SUCCESSFULLY`;
  else return "NO OPERATION DETECTED"; //if everything else fails
};

const OP_MSG_ON_USER = (op: string, email: string) => {
  if (op === "DELETE")
    return `USER WITH THE ID: ${email} WAS DELETED SUCCESSFULLY`;
  if (op === "UPDATE")
    return `USER WITH THE EMAIL: ${email} WAS UPDATED SUCCESSFULLY`;
  if (op === "CREATE")
    return `USER WITH THE EMAIL: "${email}" WAS CREATED SUCCESSFULLY`;
  else return "NO OPERATION DETECTED"; //if everything else fails
};

/*FOR USERS QUERIES *****************************************************************************************/
const ALREADY_LOGGED_OUT = `TOKEN EXPIRED OR USER IS LOGGED OUT`;
const MISSING_CREDENTIALS = `MISSING CREDENTIALS, CHECK IF BOTH USERNAME AND PASSWORD WERE PROVIDED`;
const USER_NOT_FOUND_ON_LOGIN = "SORRY, BUT THIS USER DOESN'T EXIST";
const WRONG_PASSWORD_ON_LOGIN = "NO USER WITH THIS PASSWORD EXISTS";

//when searching user or product
const missingSearchParams = (searchType: Entity) =>
  `NO SEARCH PARAMETERS, PROVIDE ATLEAST THE ${
    searchType === "PRODUCT" ? "PRODUCT'S NAME" : "USER'S ID"
  } OR THE  ${searchType === "PRODUCT" ? "PS-NUMBER" : " USER'S LASTNAME"}`;

const NO_USER_FOUND = `ERROR, USER WAS NOT FOUND!`;
const NO_DELETE_PARAMS_USER = `TO DELETE A USER, YOU MUST PASS THE ID AND THE DELETE KEY`;
const CANNOT_DELETE_USER = `RECORD WAS NOT FOUND, CANNOT DELETE USER`;
const CANNOT_UPDATE_USER = `ERROR, CANNOT UPDATE USER`;
const CANNOT_CREATE_USER = `DUPLICATE USER FOUND, PLEASE EDIT: "LASTNAME, FIRSTNAME AND USERNAME"`;
const FORBIDDEN_REQUEST = `YOU ARE NOT AUTHORIZED TO MAKE THIS REQUEST!`;

const VALUES_MISSING_CANNOT_CREATE = (
  createdType: Entity,
  ...args: (string | number)[]
) =>
  //when creating user or products and if arguments are missing
  `CREATING ${createdType} FAILED, MISSING: ${args.toString()}`; //missing arguments comes as array, convert them

// Define an error handler for unmatched routes
const handleInvalidRoute = (req: Request, res: Response) => {
  res
    .status(404)
    .send(
      "Either your endpoint is wrong, or you didn't provide params for your request"
    );
};
/*******************************************************************************/

export {
  SERVER_ERROR,
  UNDEFINED_ERR,
  /* products messages */
  NO_UPDATE_ISSUED,
  NO_SEARCH_PARAMS_PROD,
  NO_DELETE_PARAMS_PROD,
  NO_PROD_FOUND,
  WRONG_DELETE_KEY,
  CANNOT_DELETE_PROD,
  CANNOT_UPDATE_PROD,
  CANNOT_CREATE_PROD,
  NO_VALUES_UPDATED,

  /* user mesages */
  USER_NOT_FOUND_ON_LOGIN,
  WRONG_PASSWORD_ON_LOGIN,
  NO_DELETE_PARAMS_USER,
  CANNOT_DELETE_USER,
  CANNOT_UPDATE_USER,
  CANNOT_CREATE_USER,
  MISSING_CREDENTIALS,
  NO_USER_FOUND,
  FORBIDDEN_REQUEST,
  ALREADY_LOGGED_OUT,
  NO_AUTH,

  /************** */
  VALUES_MISSING_CANNOT_CREATE,
  NO_UPDATE_WHERE_PARAM,
  missingIdOrPsAndDelKey,
  missingSearchParams,
  handleInvalidRoute,
  OP_MSG_ON_PRODUCT,
  OP_MSG_ON_USER,
};
