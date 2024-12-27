import { Express } from "express";
import { dashboardRoute } from "./dashboard.route";
import { topicRoute } from "./topic.route";
import { songRoute } from "./song.route";
import { uploadRoute } from "./upload.route";
import { singerRoute } from "./singer.route";
import { roleRoute } from "./role.route";
import { accountRoute } from "./account.route";
import { authRoute } from "./auth.route";
import { userRoute } from "./user.route";
import { settingRoute } from "./setting.route";
import { systemConfig } from "../../config/system";
import { requireAuth } from "../../middlewares/admin/auth.middleware";
export const routesAdmin = (app: Express) => {
  const path = systemConfig.prefixAdmin;
  app.use(`/${path}/dashboard`, requireAuth, dashboardRoute);
  app.use(`/${path}/topics`, requireAuth, topicRoute);
  app.use(`/${path}/songs`, requireAuth, songRoute);
  app.use(`/${path}/singers`, requireAuth, singerRoute);
  app.use(`/${path}/roles`, requireAuth, roleRoute);
  app.use(`/${path}/accounts`, requireAuth, accountRoute);
  app.use(`/${path}/users`, requireAuth, userRoute);
  app.use(`/${path}/settings`, requireAuth, settingRoute);
  app.use(`/${path}/auth`, authRoute);
  app.use(`/${path}/upload`, uploadRoute);
};

