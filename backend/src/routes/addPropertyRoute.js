// Is this updating

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { getUserByEmail } from "../commands/users.js";
import { insertProperty, associateProperty } from "../commands/properties.js";

export const addProperty = {
  path: "/api/addProperty",
  method: "post",
  handler: async (req, res) => {
    const { user, data } = req.body;

    const propertyResult = await insertProperty(data);

    if (!propertyResult) {
      res
        .status(200)
        .json({
          message: "That property already exists.",
          addedOrExists: "Exists",
        });
    } else {
      const { insertId } = propertyResult;

      const userPropertyResult = await associateProperty({
        user: user,
        propertyId: insertId,
      });

      res.status(200).json({
        insertId,
        message: "That property was successfully added to your profile.",
        addedOrExists: "Added",
      });
    }
  },
};
