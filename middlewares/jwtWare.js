import expressJwt from "express-jwt";

export const config = {
  secret: `JavaScript`
};

export function jwtWare() {
  const { secret } = config;
  return expressJwt({ secret }).unless({
    path: ["/login", "/registration"]
  });
}
