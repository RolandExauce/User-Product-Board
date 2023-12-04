import { verifyJWT } from "../tools/utils";
import { JWT_PRIVATE_KEY_ACCESS } from "../tools/envs";
import { JwtPayload } from "jsonwebtoken";
import { searchUser } from "../database/queries/user.queries";
import { modifiedRequestCreateUser } from "../tools/types";

//authenticate the user
export const getAuthUser = async ({ cookies }: modifiedRequestCreateUser) => {
  //check cookies and retrieve accesstoken
  const token = cookies["access_token"];
  if (token && token.startsWith("Bearer")) {
    //get the access token and decode user
    let access_token = token.split(" ")[1];
    const decodedUser = verifyJWT(
      access_token,
      JWT_PRIVATE_KEY_ACCESS
    ) as JwtPayload;

    const result = await searchUser({
      _id: decodedUser.userId,
    });

    if (result.__typename === "Success") {
      return result.user;
    } else {
      return undefined;
    }
  }
  return undefined;
};
