import express, { json, urlencoded, Request, Response } from "express";
import cookieParser from "cookie-parser";
import { initDB } from "./database/_sql.init";
import { createServer as createHTTPServer, ServerOptions } from "http";
import { createServer as createHTTPSServer } from "https";
import fs from "fs";
import path from "path";
import {
  PORT_EXPRESS,
  SESSION_KEY,
  sessionCookieExpiresIn,
} from "./tools/envs";
import { initRoutes } from "./routes";
import cors, { CorsOptions } from "cors";
import session, { SessionOptions } from "express-session";
import { cookieOptions } from "./tools/cookies";
import { ConfigType, IUser, Role } from "./tools/types";
import { isProd } from "./tools/constants";
import { handleInvalidRoute } from "./database/errors";

//add userId to session, for some reason adding custom types for TS results in Transpile error,
//unless you specify "-T" flag in exec of ts-node, still does not resolve it though???
declare module "express-session" {
  export interface SessionData {
    userId: string;
  }
}

// Extend the Request interface to include user custom field
declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

// ###################################################################################################################################################

// Configuration for creating servers
const configurations: ConfigType = {
  production: {
    ssl: true,
    port: PORT_EXPRESS,
    hostname: "lancingserver",
  },
  development: {
    ssl: false,
    port: PORT_EXPRESS,
    hostname: "localhost",
  },
};

// SSL certificate paths
const crtPath = path.join(__dirname, "../cert/server.crt");
const keyPath = path.join(__dirname, "../cert/server.key");

// Options for SSL server
const serverOptions = {
  key: fs.readFileSync(require.resolve(crtPath), { encoding: "utf8" }),
  cert: fs.readFileSync(require.resolve(keyPath), { encoding: "utf8" }),
};

// CORS configuration
const corsOpts: CorsOptions = {
  origin: ["http://localhost:3000"],
  credentials: true,
};

// Options for express session middleware
const sessionMiddleware: SessionOptions = {
  name: "qid",
  secret: SESSION_KEY,
  cookie: {
    ...cookieOptions,
    maxAge: 1000 * 60 * 60 * 24 * sessionCookieExpiresIn,
  },
  resave: false,
  saveUninitialized: false,
};

// Initialize database and create table structures
initDB().catch((error) => {
  console.error("Error initializing database:", error);
});

// Create express app, use middlewares
const app = express();
app.use(
  "/",
  session(sessionMiddleware),
  cors(corsOpts),
  json(),
  cookieParser(),
  urlencoded({ extended: true })
);

// Define a basic route
app.get("/", (req, res) => {
  res.send("App is online");
});

// Initialize API routes
initRoutes(app);
app.use(handleInvalidRoute); //handle invalid routes

// Create server based on environment
(async () => {
  const { ssl, port, hostname } =
    configurations[isProd ? "production" : "development"];
  const httpServer = ssl
    ? createHTTPSServer(serverOptions, app)
    : createHTTPServer(app);

  try {
    await new Promise<void>((resolve) => httpServer.listen({ port }, resolve));
    console.log(
      `Express app running at http${ssl ? "s" : ""}://${hostname}:${port} 🔥🔥`
    );
  } catch (error) {
    console.error("Error starting server:", error);
  }
})();
