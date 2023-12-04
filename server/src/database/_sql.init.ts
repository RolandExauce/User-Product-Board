import { Pool } from "mysql2/promise";
import { IProduct, IUser, configDB } from "../tools/types";
import { SQL_DATABASE, SQL_HOST, SQL_PASS, SQL_USER } from "../tools/envs";
import mysql, { RowDataPacket } from "mysql2";
import {
  ALTER_TBL_PRODS,
  ALTER_TBL_USERS,
  CREATE_DB,
  GET_TABLES_EXISTS_ON_DB_UP,
  INIT_PROD_STRUCT,
  INIT_USERS_STRUCT,
  LOAD_PRODS,
  LOAD_USERS,
} from "./_init.statements";

// Initialize the database connection pool
const initPool = async (): Promise<Pool | undefined> => {
  try {
    const config: configDB = {
      host: SQL_HOST,
      user: SQL_USER,
      password: SQL_PASS,
      multipleStatements: true, // Enable multiple SQL statements
    };
    const pool = mysql.createPool(config).promise(); // Create a pool
    await pool?.query(CREATE_DB); // Create the database if it doesn't exist

    // Create a new config with the database field added
    const newConfig = {
      ...config,
      database: SQL_DATABASE,
    };
    return mysql.createPool(newConfig).promise(); // Return a new pool instance with the specified database
  } catch (err: any) {
    // console.log(err);
  }
};

// Initialize the database and create necessary tables
const initDB = async (): Promise<void> => {
  const pool = await initPool();
  if (pool) {
    console.log("Connected to SQL Database");

    await pool?.query(INIT_PROD_STRUCT); // Initialize product structure
    await pool?.query(INIT_USERS_STRUCT); // Initialize user structure

    let users: IUser[];
    let products: IProduct[];

    // Check if tables contain records, if not, import CSV files
    const productArr = (await pool?.query(
      GET_TABLES_EXISTS_ON_DB_UP
    )) as RowDataPacket[];

    products = productArr[0][0];
    users = productArr[0][1];

    // If no records in product and user table, import data and alter tables
    if (products.length === 0 || users.length === 0) {
      await pool?.query(LOAD_PRODS); // Load products
      await pool?.query(ALTER_TBL_PRODS); // Alter product table

      /* Load users ********************************************************/
      await pool?.query(LOAD_USERS); // Load users
      await pool?.query(ALTER_TBL_USERS); // Alter user table
    } else {
      // console.log("Everything is already set up");
    }
  } else {
    console.log("Cannot connect to DB, maybe the Server is offline?");
  }
};

export { initDB, initPool };
