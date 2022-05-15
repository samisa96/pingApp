import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import util from "util";
import child_process from "child_process";
import http from "http";
import PostPing from "./models/PostPing.js";

const app = express();

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

const CONNECTION_URL = process.env.MONGODB_URI;
const PORT = process.env.PORT || 5000;
mongoose
  .connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() =>
    app.listen(PORT, () =>
      console.log(`Server Running on Port: http://localhost:${PORT}`)
    )
  )
  .catch((error) => console.log(`${error} did not connect`));

app.get("/pings", async (req, res) => {
  PostPing.find()
    .sort({ pingCount: -1 })
    .then((pings) => res.status(200).json({ pings: pings.slice(0, 5) }));
});

app.post("/ping", async (req, res) => {
  console.log("hello");
  console.log(req.body.host);
  try {
    const exec = util.promisify(child_process.exec);
    const { host } = req.body;
    const { stdout, stderr } = await exec(
      `ping -c ${req.body.count} ${req.body.host}`
    );
    var postPing = await PostPing.findOne({ host });

    if (postPing != null) {
      console.log("*" + postPing.pingCount + 1);

      PostPing.findOneAndUpdate(
        { host: host },
        { pingCount: postPing.pingCount + 1 },
        {
          new: true,
        },
        (err, doc) => {
          if (err) {
            console.log("Something wrong when updating data!");
          }

          console.log(doc);
        }
      );
    } else {
      new PostPing({ host: host, pingCount: 1 }).save().then(() => {
        console.log(stdout);
      });
    }
    res.status(200).json({ output: stdout });
  } catch (error) {
    res.status(404).json(error);
  }
});
var server = http.createServer(app);
server.listen(PORT, () => console.log(`server started on port ${PORT}`));
