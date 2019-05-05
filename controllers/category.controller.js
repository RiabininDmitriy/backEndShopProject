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
    res.status(200).send(allCategory);
  } catch (err) {
    console.log(err);
  }
};
