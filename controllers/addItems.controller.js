import bodybuilder from "bodybuilder";
import { ESclient } from "../app";
import { ITEM_INDEX } from "../constants";

export const addItem = async (req, res) => {
  try {
    const { itemName, category, price, firstName, lastName } = req.body;
    const body = bodybuilder();
    body.andQuery("match_phrase", "itemName", itemName);
    let newItem = await ESclient.index({
      index: ITEM_INDEX,
      type: "type",
      body: req.body
    });
    res.status(201).send(newItem);
  } catch (err) {
    console.log(err);
  }
};

export const getItem = async (req, res) => {
  try {
    const body = bodybuilder();
    body.andQuery("match_phrase", "itemName", itemName);

    let item = await ESclient.search({
      index: ITEM_INDEX,
      type: "type",
      body: body.build()
    });
    item = item.hits.hits;
    res.status(201).send({ item: [] });
  } catch (err) {
    console.log(err);
  }
};
