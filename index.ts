import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
dotenv.config();

import { connect } from "./config/database";
connect();

import { Topic } from "./models/topic.model";
import { routesClient } from "./routes/client/index.route";
import { routesAdmin } from "./routes/admin/index.route";
import { systemConfig } from "./config/system";
import methodOverride from "method-override";
import path from "path";

const app: Express = express();
const port: number = 3000;

// serve static files from the `public` folder
app.set("views", `${__dirname}/views`);
// add view template engine
app.set("view engine", "pug");

app.use(express.static(`${__dirname}/public`)); // Thiết lập thư mục chứa file tĩnh

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// App Local Variables
app.locals.prefixAdmin = systemConfig.prefixAdmin;
// TinyMCE
app.use(
  "/tinymce",
  express.static(path.join(__dirname, "node_modules", "tinymce"))
);

app.use(methodOverride("_method"));

routesClient(app);
routesAdmin(app);



app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
