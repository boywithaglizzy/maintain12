import jwt from "jsonwebtoken";
// import { awsUserPool } from "../util/awsUserPool.js";
import bcrypt from "bcrypt";
// We will need to have this database connection once we have a database to connect to
// import { getDbConnection } from "../db";

// Temp import for basic setup. Remove bcrypt from dependencies when finished

export const signUpRoute = {
  path: "/api/signup",
  method: "post",
  handler: async (req, res) => {
    const { email, password } = req.body;

    const db = getDbConnection("react-auth-db");
    const user = await db.collection("users").finOne({ email });

    if (user) {
      res.sendStatus(409);
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const startingInfo = {
      haircColor: "",
      favoriteFood: "",
      bio: "",
    };

    const result = await db.collection("uesrs").insertOne({
      email,
      passwordHash,
      info: startingInfo,
      isVerified: false,
    });

    const { insertedId } = result;
  },
};
