import { Express } from "express";
import { topicsRoute } from "./topic.route";
import { songsRoute } from "./song.route";
import { settingMiddleware } from "../../middlewares/client/setting.middleware";

export const routesClient = (app: Express) => {
  app.use(settingMiddleware);
  app.use("/topics", topicsRoute);

  app.use("/songs", songsRoute);
};

