import { ESclient } from "../app";
import { CATEGORY_INDEX } from "../constants";

export const createCategory = async (req, res) => {
  try {
    let category = await ESclient.index({
      index: CATEGORY_INDEX,
      type: "type",
      body: req.body
    });
    res.status(201).send(category);
  } catch (err) {
    console.log(err);
  }
};

export const getAllCategory = async (req, res) => {
  try {
    let allCategory = await ESclient.search({
      index: CATEGORY_INDEX,
      type: "type",
      size: 100
    });
    allCategory = allCategory.hits.hits;
    let modifyCategory = [];
    for (let item of allCategory) {
      const newItem = {};
      newItem.key = item._id;
      newItem.value = item._id;
      newItem.text = item._source.name;

      modifyCategory.push(newItem);
    }
    res.status(200).send(modifyCategory);
  } catch (err) {
    console.log(err);
  }
};
