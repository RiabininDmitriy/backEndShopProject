import { ESclient } from "../app";
import { USER_INDEX } from "../constants";

export const getUserInfo = async (req, res) => {
  try {
    console.log(req.user);
    const { id } = req.user;
    console.log(id);
    let userInfo = await ESclient.get({
      index: USER_INDEX,
      type: "type",
      id: id
    });
    res.status(201).send(userInfo);
  } catch (err) {
    console.log(err);
  }
};
