import expressJwt from "express-jwt";

export const config = {
  secret: `JavaScript`
};

export function jwtWare(req, res) {
  const { secret } = config;
  return expressJwt({ secret }).unless({
    path: [
      "/login",
      "/registration",
      "/get-item",
      "/categories",
      "/get-item/:id"
    ]
  });
}
