import {
  IProdNoCurrencyNoID,
  IProductCreate,
  IUser,
  IUserNoID,
} from "../tools/types";

//when creating a new user
const userSchema: Record<keyof IUserNoID, string> = {
  lastName: "",
  firstName: "",
  userName: "",
  email: "",
  department: "",
  role: "",
  jobRole: "",
  password: "",
};

//when creating a new product
const productSchema: Record<keyof IProductCreate, string> = {
  productType: "",
  lineCode: "",
  status: "",
  valueCurrency: "",
  sourceLink: "",
  psNumber: "",
  categoryCode: "",
  brandCode: "",
  familyCode: "",
  value: "",
  name: "",
};

//product keys, will be mapped to evaluate changes on update product
const prodKeys: (keyof IProdNoCurrencyNoID)[] = [
  "psNumber",
  "productType",
  "categoryCode",
  "brandCode",
  "familyCode",
  "lineCode",
  "status",
  "value",
  "name",
  "sourceLink",
];

const userKeys: (keyof IUserNoID)[] = [
  "department",
  "email",
  "firstName",
  "lastName",
  "userName",
  "jobRole",
  "role",
];

export { userSchema, productSchema, prodKeys, userKeys };
