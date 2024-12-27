import { NextFunction, Request, Response } from "express";
import { Setting } from "../../models/setting.model";
export const settingMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const settingGeneral = await Setting.findOne({});
  res.locals.settingGeneral = settingGeneral;
  next();
};
