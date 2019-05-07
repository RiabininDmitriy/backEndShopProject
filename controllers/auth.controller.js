import bodybuilder from "bodybuilder";
import { comparePassword, hashPassword } from "../utils/bcrypt";
import { config } from "../middlewares/jwtWare";
import jwt from "jsonwebtoken";
import { ESclient } from "../app";
import { USER_INDEX } from "../constants";

export const registration = async (req, res) => {
  try {
    const { firstName, lastName, password, email, phoneNumber } = req.body;
    const body = bodybuilder();
    body.andQuery("match_phrase", "email", email);

    const userSearchResult = await ESclient.search({
      index: USER_INDEX,
      type: "type",
      body: body.build()
    });
    if (!userSearchResult.hits.hits.length) {
      let createPassword = hashPassword(password);
      req.body.password = createPassword;
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

      delete newUser._source.password;
      const token = jwt.sign({ id: newUser._id }, config.secret);
      res.status(201).send({ token, user: newUser._source });
    }
    res.status(400).send({ err: "User is exist" });
  } catch (err) {
    console.log(err);
  }
};

export const login = async (req, res) => {
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
      comparePassword(password, logUser[0]._source.password);
      delete logUser[0]._source.password;
      const token = jwt.sign({ id: logUser[0]._id }, config.secret);
      res.status(201).send({ token, user: logUser[0]._source });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("internal server error");
  }
};
