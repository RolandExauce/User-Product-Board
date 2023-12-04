import { TABLE_2 } from "../../tools/envs";

const GET_PRODUCTS = `SELECT * FROM ${TABLE_2};`; //get products
const SEARCH_PRODUCT = `SELECT * FROM ${TABLE_2} WHERE name = ? OR psNumber = ?;`; //search product
const CREATE_PRODUCT = `INSERT IGNORE INTO ${TABLE_2} 
(_id,psNumber,categoryCode,brandCode,familyCode,value,name)
VALUES (?,?, ?, ?, ?, ?, ?);`; //create new product
const DELETE_PRODUCT = `DELETE FROM ${TABLE_2} WHERE psNumber = ?;`; //delete product
const UPDATE_PRODUCT = `UPDATE ${TABLE_2}
SET 
psNumber = ?,
productType = ?,
categoryCode = ?,
brandCode = ?,
familyCode = ?,
lineCode = ?,
status = ?,
value = ?,
name = ?,
sourceLink = ?
WHERE psNumber = ?`; //update product

export {
  SEARCH_PRODUCT,
  GET_PRODUCTS,
  CREATE_PRODUCT,
  DELETE_PRODUCT,
  UPDATE_PRODUCT,
};
