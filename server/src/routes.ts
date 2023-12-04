import express from "express";
import { controllerCreateProd } from "./controllers/products/create.prod";
import { controllerDeleteProd } from "./controllers/products/delete.prod";
import { controllerSearchProd } from "./controllers/products/search";
import { controllerGetProds } from "./controllers/products/get.products";
import { controllerUpdateProd } from "./controllers/products/update.product";
import { controllerCreateUser } from "./controllers/user/create.user";
import { controllerDeleteUser } from "./controllers/user/delete.user";
import { controllerGetUsers } from "./controllers/user/get.users";
import { controllerloginUser } from "./controllers/user/login";
import { controllerLogout } from "./controllers/user/logout";
import { controllerSearchUser } from "./controllers/user/search";
import { controllerUpdateUser } from "./controllers/user/update.user";
import {
  controllerValidateUser,
  restrictToAdmin,
} from "./middlewares/validate";
import errorHandler from "./middlewares/error.handler";

//handle express routers with express Router
export const initRoutes = (app: express.Application) => {
  const router = express.Router();
  router.post("/users/login", controllerloginUser);
  //order is important, first call the middleware to authorize except for login obviously

  router.use(controllerValidateUser); //authentication middleware
  // Product routes
  router.get("/products", controllerGetProds);
  router.get("/products/search", controllerSearchProd);
  router.post("/products/create", controllerCreateProd);
  router.put("/products/update/:psN", restrictToAdmin, controllerUpdateProd);
  router.delete("/products/delete/:id/:key", controllerDeleteProd);

  // User routes, add some auth middleware on delete, put, maybe patch request?
  router.get("/users", controllerGetUsers);
  router.get("/users/search", controllerSearchUser);
  router.post("/users/create", restrictToAdmin, controllerCreateUser);
  router.post("/users/logout", controllerLogout);
  router.put("/users/update/:email", restrictToAdmin, controllerUpdateUser);
  router.delete(
    "/users/delete/:id/:key",
    restrictToAdmin,
    controllerDeleteUser
  );

  router.use(errorHandler);
  app.use(router);
};
