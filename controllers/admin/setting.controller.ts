import { Request, Response } from "express";
import { Setting } from "../../models/setting.model";

export const general = async (req: Request, res: Response) => {
  const setting = await Setting.findOne({});
  res.render("admin/pages/settings/general", {
    pageTitle: "Cài đặt chung",
    setting: setting,
  });
};
export const generalPatch = async (req: Request, res: Response) => {
  const existRecord = await Setting.findOne({});
  if (existRecord) {
    await Setting.updateOne(
      {
        _id: existRecord.id,
      },
      req.body
    );
  } else {
    const record = new Setting(req.body);
    await record.save();
  }
  req.flash("success", "Cập nhật thành công!");
  res.redirect("back");
};
