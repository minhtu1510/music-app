import express, { Express, Request, Response } from "express";

const app: Express = express();
const port: number = 3000;


// serve static files from the `public` folder
app.set("views",`${__dirname}/views`)
// add view template engine
app.set('view engine', 'pug')


app.get("/topics", (req: Request, res: Response) => {
  res.render("client/pages/topics/index");
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
