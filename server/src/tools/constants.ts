import { v4 } from "uuid";
import { NODE_ENV } from "./envs";
import { Department, Role } from "./types";

const isProd = NODE_ENV === "production";
const ID = v4().substring(0, 18); //id for users and products
const initUser = {
  lastName: "",
  firstName: "",
  userName: "",
  email: "",
  department: "",
  role: "" as Department,
  jobRole: "" as Role,
  password: "",
};

export { isProd, ID, initUser };
