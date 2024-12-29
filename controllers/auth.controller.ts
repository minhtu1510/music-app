import { Request, Response } from "express";
// export const index = async (req: Request, res: Response) => {
//   res.render("client/pages/auth/login");
// };
export const login = async (req: Request, res: Response) => {
    // res.render("client/pages/auth/login");
};
export const register = async (req: Request, res: Response) => {
    res.render("client/pages/auth/register");
};

