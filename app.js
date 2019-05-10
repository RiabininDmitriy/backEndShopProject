import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import elasticsearch from "elasticsearch";
import { USER_INDEX, CATEGORY_INDEX, ITEM_INDEX } from "./constants";
import router from "./routes";
import { jwtWare } from "../back/middlewares/jwtWare";

const app = express();

export const ESclient = new elasticsearch.Client({
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

const createIndexItem = ITEM_INDEX => {
  try {
    return ESclient.indices.create({
      index: ITEM_INDEX,
      type: "type",
      body: {
        mappings: {
          type: {
            properties: {
              location: { type: "geo_point" }
            }
          }
        }
      }
    });
  } catch (err) {
    console.log(err);
  }
};

createIndex(USER_INDEX);
createIndex(CATEGORY_INDEX);

router(app);

app.listen(3003, function() {
  console.log("Example app listening on port 3003!");
});
