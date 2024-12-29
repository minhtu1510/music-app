import { Express } from "express";
import { topicsRoute } from "./topic.route";
import { songsRoute } from "./song.route";
import { mainRoute } from "./main.route";
import { singersRoute } from "./singer.route";
import { authRoute } from "./auth.route";

export const routesClient = (app: Express) => {
  app.use("/", mainRoute);
  app.use("/topics", topicsRoute);

  app.use("/songs", songsRoute);
  app.use("/singers", singersRoute);
  app.use("/auth", authRoute);
};

