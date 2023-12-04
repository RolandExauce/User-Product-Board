import {
  CANNOT_CREATE_USER,
  CANNOT_DELETE_USER,
  CANNOT_UPDATE_USER,
  NO_DELETE_PARAMS_USER,
  NO_UPDATE_ISSUED,
  NO_USER_FOUND,
  OP_MSG_ON_USER,
  UNDEFINED_ERR,
  USER_NOT_FOUND_ON_LOGIN,
  WRONG_DELETE_KEY,
  WRONG_PASSWORD_ON_LOGIN,
} from "../errors";
import { RowDataPacket } from "mysql2";
import {
  IUser,
  DeleteParamsUser,
  ILogin,
  SearchParamsUser,
  SqlOperationResult,
  UpdateParamsUser,
  LoginResponse,
  CreateUserResponse,
  SearchUserResponse,
  GetUsersResponse,
  UpdateUserResponse,
  DeleteUserResponse,
  IUserNoID,
} from "../../tools/types";
import { DELETE_KEY_FOR_USERS } from "../../tools/envs";
import { initPool } from "../_sql.init";
import { evalRecordOnUpdate, opResult, signTokens } from "../../tools/utils";
import bcrypt from "bcrypt";
import {
  CREATE_USER,
  DELETE_USER,
  FIND_USER_LOGIN,
  GET_USERS,
  SEARCH_USER,
  UPDATE_USER,
} from "./user.sql";
import { ID } from "../../tools/constants";
import { userKeys } from "../../controllers/_inits";

const pool = initPool();

//get users
const getUsers = async (): Promise<GetUsersResponse> => {
  const rows = (await (await pool)?.query(GET_USERS)) as RowDataPacket[];
  return {
    __typename: "Success",
    users: rows[0] as IUser[],
  };
};

//login user
const findToLoginUser = async ({
  username,
  password,
}: ILogin): Promise<LoginResponse> => {
  const [foundUser] = (await (
    await pool
  )?.query(FIND_USER_LOGIN, [username])) as RowDataPacket[];
  const user = foundUser[0] as IUser;
  if (user) {
    //check and decrypt pw match stored pw
    const decryptedPassword = await bcrypt.compare(password, user.password);

    //pass correct, sign tokens
    if (decryptedPassword) {
      const [accessToken, refreshToken] = await signTokens(user._id);
      return {
        __typename: "UserResponse",
        user: user as IUser,
        tokens: {
          accessToken,
          refreshToken,
        },
      };
    } else {
      return {
        __typename: "CustomError",
        error: WRONG_PASSWORD_ON_LOGIN, //user found but password is not correct
      };
    }
  } else {
    return {
      __typename: "CustomError",
      error: USER_NOT_FOUND_ON_LOGIN, //user not found
    };
  }
};

//find a user by _id, lastname, firstname or username
const searchUser = async (
  params: SearchParamsUser
): Promise<SearchUserResponse> => {
  const { _id, lastName, firstName, email } = params;
  const arrSearchParams = [_id, lastName, firstName, email];

  const [foundUser] = (await (
    await pool
  )?.query(SEARCH_USER, arrSearchParams)) as RowDataPacket[];

  //return found user or error msg
  if (foundUser[0]) {
    return {
      __typename: "Success",
      user: foundUser[0] as IUser,
    };
  } else {
    return {
      __typename: "CustomError",
      error: NO_USER_FOUND,
    };
  }
};

//create a new user
const createUser = async (params: IUserNoID): Promise<CreateUserResponse> => {
  const {
    lastName,
    firstName,
    userName,
    email,
    department,
    role,
    jobRole,
    password,
  } = params;

  const row = (await (
    await pool
  )?.query(CREATE_USER, [
    ID,
    lastName,
    firstName,
    userName,
    email,
    department,
    role,
    jobRole,
    await bcrypt.hash(password, 10), // hash password
  ])) as SqlOperationResult;

  let rowsAffected = opResult(row);
  if (rowsAffected === 1) {
    return {
      __typename: "Success",
      result: OP_MSG_ON_USER("CREATE", email), //msg that record was created
    };
  } else {
    return {
      __typename: "CustomError",
      error: CANNOT_CREATE_USER,
    };
  }
};

//find one product by id or psNumber
const updateUser = async (
  params: UpdateParamsUser
): Promise<UpdateUserResponse> => {
  //update params
  const {
    emailOfUserToUpdate,
    newLastName,
    newFirstName,
    newUserName,
    newEmail,
    newDepartment,
    newRole,
    newJobRole,
  } = params;

  let userToUpdate = {} as any;
  let userFound = {} as IUserNoID;
  //first let's find the user to udpate
  const result = await searchUser({ email: emailOfUserToUpdate });
  //if user was found
  if (result.__typename === "Success") {
    userToUpdate = result.user;
    userFound = userToUpdate;

    // Constructing updatedValues array
    // Check if values are provided, else use existing values from prodFound
    const updatedValues: Partial<IUserNoID> = {
      email: newEmail ?? userFound.email,
      lastName: newLastName ?? userFound.lastName,
      firstName: newFirstName ?? userFound.firstName,
      userName: newUserName ?? userFound.userName,
      department: newDepartment ?? userFound.department,
      role: newRole ?? userFound.role,
      jobRole: newJobRole ?? userFound.jobRole,
    };

    const valuesUpdated = evalRecordOnUpdate(
      userFound,
      userKeys.map((key) => updatedValues[key] ?? userToUpdate[key])
    );

    const UPDATE_VALUES = [
      updatedValues.email,
      updatedValues.lastName,
      updatedValues.firstName,
      updatedValues.userName,
      updatedValues.department,
      updatedValues.role,
      updatedValues.jobRole,
    ];

    //only update if values are modified
    if (valuesUpdated) {
      const row = (await (
        await pool
      )?.query(UPDATE_USER, UPDATE_VALUES)) as SqlOperationResult;

      //get rows affected field
      let rowsAffected = opResult(row);
      if (rowsAffected === 1) {
        return {
          __typename: "Success",
          result: OP_MSG_ON_USER("UPDATE", emailOfUserToUpdate), //msg that record was updated
        };
      } else {
        return {
          __typename: "CustomError",
          error: CANNOT_UPDATE_USER,
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
      error: NO_USER_FOUND,
    };
  }
};

//delete user
const deleteUser = async (
  params: DeleteParamsUser
): Promise<DeleteUserResponse> => {
  const { _id, deleteKey } = params;
  //if one of the options to delete a product is not passed
  if (!_id || !deleteKey) {
    return { __typename: "CustomError", error: NO_DELETE_PARAMS_USER };
  } else if (_id && deleteKey) {
    const checkKey = deleteKey === DELETE_KEY_FOR_USERS; //check if correct delete key was passed
    if (checkKey) {
      const row = (await (
        await pool
      )?.query(DELETE_USER, [_id])) as SqlOperationResult;
      let rowsAffected = opResult(row);
      if (rowsAffected === 1) {
        return {
          __typename: "Success",
          result: OP_MSG_ON_USER("DELETE", _id),
        }; //msg that record was deleted}
      } else {
        return {
          __typename: "CustomError",
          error: CANNOT_DELETE_USER, //no record found
        };
      }
    } else {
      return {
        __typename: "CustomError",
        error: WRONG_DELETE_KEY,
      }; //if key to delete was wrong
    }
  } else {
    return {
      __typename: "CustomError",
      error: UNDEFINED_ERR,
    };
  }
};

export {
  getUsers,
  searchUser,
  createUser,
  updateUser,
  deleteUser,
  findToLoginUser,
};
