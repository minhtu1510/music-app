import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config();

import { connect } from "./config/database";
connect();

import { Topic } from "./models/topic.model";

const app: Express = express();
const port: number = 3000;

// serve static files from the `public` folder
app.set("views", `${__dirname}/views`);
// add view template engine
app.set("view engine", "pug");

app.get("/topics", async (req: Request, res: Response) => {
  const topics = await Topic.find({
    deleted: false,
  });
  console.log(topics);

  res.render("client/pages/topics/index");
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
