import { Express } from "express";
import { topicsRoute } from "./topic.route";
import { songsRoute } from "./song.route";
import { settingMiddleware } from "../../middlewares/client/setting.middleware";
import { singersRoute } from "./singer.route";
import { authRoute } from "./auth.route";
import { mainRoute } from "./main.route";

export const routesClient = (app: Express) => {
  app.use(settingMiddleware);
  app.use("/topics", topicsRoute);

  app.use("/songs", songsRoute);
  app.use("/singers", singersRoute);
  app.use("/auth", authRoute);
  app.use("/", mainRoute);
};

