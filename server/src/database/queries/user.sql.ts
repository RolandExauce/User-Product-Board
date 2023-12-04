import { TABLE_1 } from "../../tools/envs";

const GET_USERS = `SELECT * FROM ${TABLE_1};`; //get users

//login user
const FIND_USER_LOGIN = `SELECT * FROM ${TABLE_1} WHERE username = ?`;

const SEARCH_USER = `SELECT * FROM ${TABLE_1} WHERE _id = ? OR lastName = ?
OR firstName = ? OR email = ?;`; //search user

//create a new user
const CREATE_USER = `INSERT IGNORE INTO ${TABLE_1} 
(_id, lastName, firstName, userName, email, 
department, role, jobRole, password)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`;

/*UPDATE USER START *************************** */
const GET_TO_UPDATE_USER = `SELECT * FROM ${TABLE_1} WHERE email = ?;`;

const UPDATE_USER = `UPDATE ${TABLE_1}
SET lastName = ?,
firstName = ?,
userName = ?,
email = ?,
department = ?,
role = ?,
jobRole = ?
WHERE email = ?`;
/*UPDATE USER END *********************** */

const DELETE_USER = `DELETE FROM ${TABLE_1} WHERE _id = ?;`;

export {
  GET_USERS,
  SEARCH_USER,
  CREATE_USER,
  FIND_USER_LOGIN,
  GET_TO_UPDATE_USER,
  UPDATE_USER,
  DELETE_USER,
};
