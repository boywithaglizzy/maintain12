import jwt from "jsonwebtoken";

export const updateUserInfoRoute = {
  path: "/api/users/:userId",
  method: "put",
  handler: async (req, res) => {
    const { authorization } = req.headers;
    const { userId } = req.params;

    // takes a subset of properties from req.body. Makes sure there's no extra data going into DB
    const updates = ({ favoriteFood, hairColor, bio }) =>
      ({
        favoriteFood,
        hairColor,
        bio,
      }(req.body));

    if (!authorization) {
      return res
        .status(401)
        .json({ message: "No authorization heading sent." });
    }

    const token = authorization.split(" ")[1];

    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err)
        return res.status(401).json({ message: "Unable to verify token" });

      const { id, isVerified } = decoded;

      if (id !== userId)
        return res
          .status(403)
          .json({ message: "Not allowed to update users data" });

      if (!isVerified)
        return res.status(403).json({
          message:
            "You nneed to verify your email before you can update your data.",
        });

      const db = connectToDb();
      const result = await db
        .collection("users")
        .findOneAndUpdate(
          { _id: ObjectID(id) },
          { $set: { info: updates } },
          { returnOriginal: false }
        );
      const { email, info } = result.value;

      jwt.sign(
        { id, email, isVerified, info },
        process.env.JWT_SECRET,
        { expiresIn: "2d" },
        (err, token) => {
          if (err) {
            return res.status(200).json(err);
          }
          return res.status(200).json({ token });
        }
      );
    });
  },
};
