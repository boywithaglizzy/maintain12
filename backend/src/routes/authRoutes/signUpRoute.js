import jwt from "jsonwebtoken";
import { CognitoUserAttribute } from "amazon-cognito-identity-js";
import { awsUserPool } from "../../util/awsUserPool.js";
import { insertNewUser, verifyUser } from "../../commands/users.js";

export const signUpRoute = {
  path: "/api/signup",
  method: "post",
  handler: async (req, res) => {
    const { email, password } = req.body;

    const attributes = [
      // Can add more attributes later. Must also be set up in Cognito
      new CognitoUserAttribute({ Name: "email", Value: email }),
    ];

    awsUserPool.signUp(
      email,
      password,
      attributes,
      null,
      async (err, awsResult) => {
        if (err) {
          console.log(err);
          if (err.code === "UsernameExistsException") {
            const error = err.code;
            return res
              .status(500)
              .json({ error, message: "Username Already Exists" });
          } else {
            return res.status(500).json({ message: "Unable to sign up user" });
          }
        }

        const max_properties = 3;

        const is_verified = false;
        try {
          const result = await insertNewUser({
            email,
            is_verified,
            max_properties,
          });
          const { userID } = result[0];

          jwt.sign(
            {
              userID,
              is_verified,
              email,
              max_properties,
            },
            process.env.JWT_SECRET,
            {
              expiresIn: "2d",
            },
            (err, token) => {
              if (err) return res.sendStatus(500);
              res.status(200).json({ token });
            }
          );
        } catch (error) {
          console.error("Error: ", error);
        }
      }
    );
  },
};
