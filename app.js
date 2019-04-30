import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import jwt from "jsonwebtoken";
import elasticsearch from "elasticsearch";
import { USER_INDEX, ITEM_INDEX } from "./constants";
import { jwtWare, config } from "./middlewares/jwtWare";
import bodybuilder from "bodybuilder";

const app = express();

const ESclient = new elasticsearch.Client({
  host: "localhost:9200",
  log: "trace"
});

app.use(cors());
app.use(bodyParser.json());
app.use(jwtWare());

const createIndex = index => {
  try {
    return ESclient.indices.create({
      index,
      body: {
        mappings: {
          type: {}
        }
      }
    });
  } catch (err) {
    // Known elastic search behavior, official suggestion to skip this error.
  }
};

createIndex(USER_INDEX);
createIndex(ITEM_INDEX);

app.post("/registration", async (req, res) => {
  try {
    const { firstName, lastName, password, email, phoneNumber } = req.body;
    const body = bodybuilder();
    body.andQuery("match_phrase", "email", email);

    const userSearchResult = await ESclient.search({
      index: USER_INDEX,
      type: "type",
      body: body.build()
    });
    console.log(userSearchResult);
    if (!userSearchResult.hits.hits.length) {
      let newUser = await ESclient.index({
        index: USER_INDEX,
        type: "type",
        body: req.body
      });
      newUser = await ESclient.get({
        index: USER_INDEX,
        type: "type",
        id: newUser._id
      });

      console.log(newUser);
      delete newUser._source.password;
      const token = jwt.sign({ sub: newUser._id }, config.secret);
      res.status(201).send({ token, user: newUser._source });
    }
    res.status(400).send({ err: "User is exist" });
  } catch (err) {
    console.log(err);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { password, email } = req.body;
    const body = bodybuilder();
    body.andQuery("match_phrase", "email", email);
    //   body.andQuery("match_phrase", "password", password);
    let logUser = await ESclient.search({
      index: USER_INDEX,
      type: "type",
      body: body.build()
    });
    logUser = logUser.hits.hits;
    if (!logUser.length) {
      res.status(404).send("user not found");
    } else {
      delete logUser[0]._source.password;
      const token = jwt.sign({ sub: logUser[0]._id }, config.secret);
      res.status(201).send({ token, user: logUser[0]._source });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("internal server error");
  }
});

app.listen(3003, function() {
  console.log("Example app listening on port 3003!");
});
