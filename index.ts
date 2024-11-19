import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
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

routesClient(app);



app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
