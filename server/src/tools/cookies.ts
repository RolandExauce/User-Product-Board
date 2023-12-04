import { CookieOptions } from "express";
import { isProd } from "./constants";
import { accessTokenExpireIn, refreshTokenExpireIn } from "./envs";

//cookie coptions
const cookieOptions: CookieOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: isProd ? "none" : "strict",
};

const accessTokenCookieOptions: CookieOptions = {
  ...cookieOptions,
  maxAge: 1000 * 60 * 60 * accessTokenExpireIn, //expires in: exp time in hour
  expires: new Date(Date.now() + 1000 * 60 * 60 * accessTokenExpireIn), // expires in: current time + exp time in hour
};

const refreshTokenCookieOptions: CookieOptions = {
  ...cookieOptions,
  maxAge: 1000 * 60 * 60 * 24 * refreshTokenExpireIn, //expires in: exp time in hour
  expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * refreshTokenExpireIn), // expires in: current time + exp time in days
};

export { cookieOptions, accessTokenCookieOptions, refreshTokenCookieOptions };
