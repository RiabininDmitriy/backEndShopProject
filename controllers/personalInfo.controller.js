import { ESclient } from "../app";
import { USER_INDEX } from "../constants";

export const getUserInfo = async (req, res) => {
  try {
    const { id } = req.user;
    let userInfo = await ESclient.get({
      index: USER_INDEX,
      type: "type",
      id: id
    });
    res.status(201).send(userInfo._source);
  } catch (err) {
    console.log(err);
  }
};
