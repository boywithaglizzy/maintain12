import jwt from "jsonwebtoken";
import { getGoogleUser } from "../../util/getGoogleUser.js";
import { updateOrCreateUserFromOauth } from "../../util/updateOrCreateUserFromOauth.js";

export const googleOauthCallbackRoute = {
  path: "/api/auth/google/callback",
  method: "get",
  handler: async (req, res) => {
    const { code } = req.query;
    const oauthUser = await getGoogleUser({ code });
    const { oauthUserInfo, access_token, id_token, refresh_token } = oauthUser;
    const updatedUser = await updateOrCreateUserFromOauth({ oauthUserInfo });

    const { userID, email, is_verified, max_properties, name } = updatedUser;

    jwt.sign(
      {
        userID,
        is_verified,
        email,
        name,
        max_properties,
        access_token,
        id_token,
        refresh_token,
        oauthId: oauthUserInfo.id,
      },
      process.env.JWT_SECRET,
      (err, token) => {
        if (err) return res.sendStatus(500);
        res.redirect(`https://maintain.lol/?token=${token}`);
      }
    );
  },
};
