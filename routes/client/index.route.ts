import { Express } from "express";
import { Request, Response } from "express";
import { topicsRoute } from "./topic.route";
import { songsRoute } from "./song.route";
import { settingMiddleware } from "../../middlewares/client/setting.middleware";
import { singersRoute } from "./singer.route";
import { authRoute } from "./auth.route";
import { mainRoute } from "./main.route";
import { infoUser } from "../../middlewares/client/user.middleware";
import { playlistRoute } from "./playlist.route";

import { paymentRoute } from "./payment.route";

export const routesClient = (app: Express) => {
  app.use(settingMiddleware);
  app.use(infoUser);
  app.use("/topics", topicsRoute);

  app.use("/playlist", infoUser, playlistRoute);

  app.use("/songs", songsRoute);
  app.use("/singers", singersRoute);
  app.use("/auth", authRoute);
  app.use("/payment", paymentRoute);
  app.use("/", mainRoute);
  // app.get("*", (req: Request, res: Response) => {
  //   res.render("client/pages/errors/404", {
  //     pageTitle: "404 Not Found",
  //   });
  // });
};

