import expressJwt from "express-jwt";

export const config = {
  secret: `JavaScript`
};

export function jwtWare(req, res) {
  console.log(`gfgfg`);
  const { secret } = config;
  return expressJwt({ secret }).unless({
    path: ["/login", "/registration"]
  });
}
