import { Request, Response } from "express";
import { User } from "../models/user.model";
// export const index = async (req: Request, res: Response) => {
//   res.render("client/pages/auth/login");
// };
export const index = async (req: Request, res: Response) => {
  res.render("client/pages/playlists/index");
};
