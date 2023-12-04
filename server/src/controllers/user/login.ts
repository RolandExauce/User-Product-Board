import { Response } from "express";
import { modifiedRequestLogin } from "../../tools/types";
import { findToLoginUser } from "../../database/queries/user.queries";
import { MISSING_CREDENTIALS } from "../../database/errors";
import {
  accessTokenCookieOptions,
  refreshTokenCookieOptions,
} from "../../tools/cookies";

//login controller
export const controllerloginUser = async (
  { body, session }: modifiedRequestLogin,
  res: Response
) => {
  const { username, password } = body;
  if (!username || !password) {
    res.status(400).send(MISSING_CREDENTIALS);
    return;
  }

  //attempt to find user and add cookies
  const result = await findToLoginUser({ username, password });
  if (result.__typename === "UserResponse") {
    const {
      user,
      tokens: { accessToken, refreshToken },
    } = result;

    //bind userId to session
    if (session) {
      session.userId = user._id;
      session.save(); // Ensure awaiting the session save
    }

    //add cookies
    res.cookie(
      "refresh_token",
      `Bearer ${refreshToken}`,
      refreshTokenCookieOptions
    );
    res.cookie(
      "access_token",
      `Bearer ${accessToken}`,
      accessTokenCookieOptions
    );

    //when we log user, we only need username, role and email to display
    const { userName, role, email } = result.user;
    const reducedAuth = { userName, role, email };
    res.status(200).send(reducedAuth);
  } else {
    res.status(401).send(result.error); //401, Unauthorized, invalid credentials
  }
};
