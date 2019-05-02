import bcrypt from "bcrypt";

export const hashPassword = passwordFromUser => {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(passwordFromUser, salt);
};

export const comparePassword = (passwordFromUser, hash) => {
  return bcrypt.compare(passwordFromUser, hash);
};
