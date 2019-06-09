import bodybuilder from "bodybuilder";
import { ESclient } from "../app";
import { ITEM_INDEX } from "../constants";

export const addItem = async (req, res) => {
  try {
    const { id } = req.user;
    req.body.userId = id;
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
    const { itemName, categoryId } = req.query;
    const body = bodybuilder();
    body.andQuery("match_phrase", "itemName", itemName);

    if (categoryId.length) {
      body.andQuery("match_phrase", "categoryId", categoryId);
    }

    let item = await ESclient.search({
      index: ITEM_INDEX,
      type: "type",
      body: body.build()
    });
    item = item.hits.hits;
    res.status(201).send(item);
  } catch (err) {
    console.log(err);
  }
};

export const getMyItems = async (req, res) => {
  const { id } = req.user;

  const body = bodybuilder();
  body.andQuery("match_phrase", "userId", id);

  let itemsList = await ESclient.search({
    index: ITEM_INDEX,
    type: "type",
    body: body.build()
  });

  itemsList = itemsList.hits.hits.map(item => {
    item._source.id = item._id;
    return item._source;
  });

  res.status(201).send(itemsList);
};
