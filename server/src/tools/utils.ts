import jwt from "jsonwebtoken";
import {
  RecordWithStringOrNumber,
  SqlOperationResult,
} from "./types";
import {
  ALGORITHM,
  JWT_PRIVATE_KEY_ACCESS,
  JWT_PRIVATE_KEY_REFRESH,
  accessTokenExpireIn,
  refreshTokenExpireIn,
} from "./envs";

// Signing token
const signJWT = (
  payload: Object,
  privateKey: string,
  options: jwt.SignOptions | undefined
) => {
  return jwt.sign(payload, privateKey, {
    ...(options && options),
    algorithm: ALGORITHM,
  });
};

// Verifying token
const verifyJWT = (token: string, publicKey: string) => {
  try {
    const decoded = jwt.verify(token, publicKey);
    return decoded;
  } catch (error) {
    console.log(error);
  }
};

// Sign the access and refresh tokens
const signTokens = async (userId: string): Promise<[string, string]> => {
  const accessToken = signJWT({ userId }, JWT_PRIVATE_KEY_ACCESS, {
    expiresIn: 60 * 60 * accessTokenExpireIn, // Will expire in 2 hours
  });
  const refreshToken = signJWT({ userId }, JWT_PRIVATE_KEY_REFRESH, {
    expiresIn: 60 * 60 * 24 * refreshTokenExpireIn, // Will expire in 1 week
  });
  return Promise.all([accessToken, refreshToken]);
};
// ##################################################################################################################################################################

// When a record gets updated or deleted, get the result fields, e.g., rowsAffected
const opResult = (passRow: SqlOperationResult): number => {
  let iterArr = []; // Will get the values from the iterator
  const mp = passRow.map(function (val) {
    return val;
  });
  const iter = mp.entries();
  const newArr = [...iter];
  const iterator = newArr[0].values();
  for (let element of iterator) {
    iterArr.push(element);
  }
  return Object(iterArr[1]).affectedRows as number;
};

//check wether ressource has been modified or not 
const evalRecordOnUpdate = <T extends RecordWithStringOrNumber>(
  record: T,
  initArr: readonly Exclude<keyof T, symbol>[] // Exclude symbol type
): boolean => {
  const initVals = initArr.slice(0, -1);
  const ogVals = Object.values(record) as (string | number)[];
  const checker = (arr: (string | number)[], target: (string | number)[]) =>
    target.every((v) => arr.includes(v));
  const evalValuesUpdated = checker(ogVals, initVals);
  return !(ogVals.toString() === initVals.toString() || evalValuesUpdated);
};

// Will keep track of whether we pass all the fields when creating a user or product,
//we can use this function for other interfaces/types as well, Optimized version for all
const allPropsOnBody = <T>(
  input: any,
  schema: Record<keyof T, string>
): { missing: boolean; valuesMissing: (keyof T)[] } => {
  const missingProps = Object.keys(schema)
    .filter((key) => input[key] === undefined)
    .map((key) => key as keyof T);
  return {
    missing: missingProps.length !== 0,
    valuesMissing: missingProps,
  };
};
// #######################################################################################################################################################################

const obIsEmpty = (obj: Object) => {
  return Object.keys(obj).length === 0;
};

export {
  signTokens,
  verifyJWT,
  opResult,
  obIsEmpty,
  evalRecordOnUpdate,
  allPropsOnBody,
};
