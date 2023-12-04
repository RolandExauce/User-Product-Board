import {
  CSV_PRODS,
  CSV_USERS,
  DEFAULT_VAL,
  DEFAULT_VAL_CURRENCY,
  SQL_DATABASE,
  TABLE_1,
  TABLE_2,
} from "../tools/envs";

//instead of manuelly creating the database
const CREATE_DB = `CREATE DATABASE IF NOT EXISTS ${SQL_DATABASE};`;

const GET_TABLES_EXISTS_ON_DB_UP = `SELECT * FROM ${TABLE_2}; SELECT * FROM ${TABLE_1};`; //get all records in both tables

//loading product csv in table
const LOAD_PRODS = `LOAD DATA INFILE '${CSV_PRODS}'
INTO TABLE ${TABLE_2}
FIELDS TERMINATED BY ','
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS;`;

//create product table if not exist, based on products csv fields
const INIT_PROD_STRUCT = `CREATE TABLE IF NOT EXISTS ${TABLE_2}(
  _id VARCHAR(250) NOT NULL UNIQUE,
  psNumber VARCHAR(100) NOT NULL UNIQUE,
  productType VARCHAR(200) DEFAULT '${DEFAULT_VAL}' NOT NULL,
  categoryCode VARCHAR(200) NOT NULL,
  brandCode VARCHAR(200) DEFAULT '${DEFAULT_VAL}' NOT NULL,
  familyCode VARCHAR(200) DEFAULT '${DEFAULT_VAL}' NOT NULL,
  lineCode VARCHAR(200) DEFAULT '${DEFAULT_VAL}' NOT NULL,
  status ENUM('ACTIVE','INACTIVE') DEFAULT 'INACTIVE' NOT NULL,
  value DECIMAL(10,4),
  valueCurrency VARCHAR(100) DEFAULT '${DEFAULT_VAL_CURRENCY}' NOT NULL,
  name VARCHAR(200) NOT NULL UNIQUE,
  sourceLink VARCHAR(200) DEFAULT '${DEFAULT_VAL}' UNIQUE,
  PRIMARY KEY (_id,psNumber,name,sourceLink)
    );`;

//remove some columns, set correct encoding
const ALTER_TBL_PRODS = `ALTER TABLE ${TABLE_2}
    CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;`;

//########################################################################################

const LOAD_USERS = `LOAD DATA INFILE '${CSV_USERS}'
INTO TABLE ${TABLE_1}
FIELDS TERMINATED BY ','
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS;`;

//create user table if not exists, based on user csv fields
const INIT_USERS_STRUCT = `CREATE TABLE IF NOT EXISTS ${TABLE_1}(
  _id VARCHAR(250) NOT NULL UNIQUE,
  lastName VARCHAR(30) NOT NULL UNIQUE,
  firstName VARCHAR(30) NOT NULL UNIQUE,
  userName VARCHAR(30) NOT NULL UNIQUE,
  email VARCHAR(70) NOT NULL UNIQUE,
  department ENUM('IT','HR','SALES','PR','QC') NOT NULL,
  role ENUM('ADMIN','USER') DEFAULT 'USER' NOT NULL,
  jobRole VARCHAR(70) NOT NULL,
  PRIMARY KEY (_id,lastName,firstName,userName,email)
  );`;

//add password column, set correct encoding
const ALTER_TBL_USERS = `ALTER TABLE ${TABLE_1} 
  ADD password VARCHAR(70) DEFAULT '${DEFAULT_VAL}' NOT NULL,
  CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;`;

export {
  GET_TABLES_EXISTS_ON_DB_UP,
  INIT_PROD_STRUCT,
  INIT_USERS_STRUCT,
  LOAD_PRODS,
  ALTER_TBL_PRODS,
  ALTER_TBL_USERS,
  LOAD_USERS,
  CREATE_DB,
};
