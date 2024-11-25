import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
dotenv.config();

import { connect } from "./config/database";
connect();

import { Topic } from "./models/topic.model";
import { routesClient } from "./routes/client/index.route";

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
routesClient(app);



app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
