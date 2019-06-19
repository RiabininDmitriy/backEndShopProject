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

export const getItems = async (req, res) => {
  try {
    const { itemName, categoryId, lat, lon } = req.query;
    const body = bodybuilder();
    body.andQuery("match_phrase", "title", itemName);
    if (categoryId) {
      body.andQuery("match_phrase", "categoryId", categoryId);
    }
    if (lat && lon) {
      body.andFilter("geo_distance", {
        distance: `10mi`,
        location: {
          lat,
          lon
        }
      });
    }

    let items = await ESclient.search({
      index: ITEM_INDEX,
      type: "type",
      size: 100,
      body: body.build()
    });

    items = items.hits.hits.map(item => {
      item._source.id = item._id;
      return item._source;
    });
    res.status(201).send(items);
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
    size: 100,
    body: body.build()
  });

  itemsList = itemsList.hits.hits.map(item => {
    item._source.id = item._id;
    return item._source;
  });

  res.status(201).send(itemsList);
};

export const getItemById = async (req, res) => {
  const { id } = req.params;
  const { id: userId } = req.user;

  const item = await ESclient.get({
    index: ITEM_INDEX,
    type: "type",
    id: id
  });
  if (item._source.userId === userId) {
    item._source.isOwn = true;
  }

  res.status(201).send(item._source);
};

export const deleteItem = async (req, res) => {
  try {
    const { id } = req.params;

    const item = await ESclient.delete({
      id: id,
      index: ITEM_INDEX,
      type: "type"
    });

    res.status(200).send(item);
  } catch (err) {
    console.log(err);
  }
};

export const updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    await ESclient.update({
      id: id,
      index: ITEM_INDEX,
      type: "type",
      body: {
        doc: req.body
      },
      refresh: true
    });
    let itemInfo = await ESclient.get({
      index: ITEM_INDEX,
      type: "type",
      id: id
    });
    res.status(201).send(itemInfo._source);
  } catch (err) {}
};
