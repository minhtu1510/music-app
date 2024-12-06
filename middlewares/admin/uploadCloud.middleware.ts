import { NextFunction, Request, Response } from "express";
import { streamUpload } from "../../helpers/streamUpload.helper";
export const uploadSingle = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req["file"]) {
    async function upload(req: Request) {
      let result = await streamUpload(req["file"].buffer);
      req.body[req["file"].fieldname] = result["url"];
      next();
    }
    upload(req);
  } else {
    next();
  }
};
