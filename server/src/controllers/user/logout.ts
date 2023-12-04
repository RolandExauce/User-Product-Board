import { Request, Response } from "express";

//logout controller
export const controllerLogout = async (req: Request, res: Response) => {
  if (req.user) {
    //remove cookies ***************
    res.clearCookie("access_token");
    res.clearCookie("refresh_token");
    res.clearCookie("qid");
    req.session.destroy((err) => {
      res.status(200).redirect("/"); // will always fire after session is destroyed
    });
    //*****************************/
  } else {
    res.status(204).end(); // 204 => "No content" to send back
    //already logged out
  }
};
