import { Express } from "express";
import { dashboardRoute } from "./dashboard.route";
import { topicRoute } from "./topic.route";
import { songRoute } from "./song.route";
import { uploadRoute } from "./upload.route";
import { systemConfig } from "../../config/system";
export const routesAdmin = (app: Express) => {
  const path = systemConfig.prefixAdmin;
  app.use(`/${path}/dashboard`, dashboardRoute);
  app.use(`/${path}/topics`, topicRoute);
  app.use(`/${path}/songs`, songRoute);
  app.use(`/${path}/upload`, uploadRoute);
};

