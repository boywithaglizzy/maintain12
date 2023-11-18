import mysql from "mysql";
import dotenv from "dotenv";
import AWS from "aws-sdk";
dotenv.config();

const conn = mysql.createConnection({
  host: process.env.AWS_RDS_HOST,
  user: process.env.AWS_RDS_USER,
  password: process.env.AWS_RDS_PASSWORD,
});

AWS.config.update({
  region: process.env.AWS_DEFAULT_REGION,
  accesKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

export const DocumentClient = new AWS.DynamoDB.DocumentClient();
export const TABLE_NAME = "users";

export const getAllUsers = async () => {
  return new Promise((resolve, reject) => {
    try {
      const sql = `SELECT * FROM Maintain_Database.users`;

      conn.query(sql, function (err, result) {
        if (err) {
          console.error("Error getting user: ", err);
          reject(err);
        } else {
          console.log("Successfully got all users.");
          resolve(result);
        }
      });
    } catch (error) {
      console.error("Error connecting to the database: ", error);
      reject(error);
    }
  });
};

export const deleteUser = async (userObject) => {
  const { userID } = userObject;
  return new Promise((resolve, reject) => {
    try {
      const sql = `DELETE FROM Maintain_Database.users WHERE (userID) = ?`;

      conn.query(sql, [userID], function (err, result) {
        if (err) {
          console.error("Error deleting user: ", err);
          reject(err);
        } else {
          console.log("User deleted successfully.");
          resolve(result);
        }
      });
    } catch (error) {
      console.error("Error connecting to the database: ", error);
      reject(error);
    }
  });
};

export const getUserByEmail = async (email) => {
  return new Promise((resolve, reject) => {
    try {
      const sql = "SELECT * FROM Maintain_Database.users WHERE email = ?";
      conn.query(sql, [email], function (err, result) {
        if (err) {
          console.error("Error:", err);
          reject(err);
        } else {
          console.log(result);
          if (result.length === 0) {
            resolve(null);
          } else {
            resolve(result);
          }
        }
      });
    } catch (error) {
      console.error("Error connecting to the database:", error);
      reject(error);
    }
  });
};

// Likely to be outsourced & removed.
export const forgotPasswordCode = async (email, passwordResetCode) => {
  return new Promise((resolve, reject) => {
    try {
      const sql = "SELECT * FROM Maintain_Database.users WHERE email = ?";
      conn.query(sql, [email], function (err, result) {
        if (err) {
          console.error("Error:", err);
          reject(err);
        } else {
          console.log(result);
          resolve(result);
        }
      });
    } catch (error) {
      console.error("Error connecting to the database:", error);
      reject(error);
    }
  });
};

export const insertUser = async (userObject) => {
  const { email, passwordHash, isVerified, verificationString } = userObject;
  // hard coded for now.
  const maxProperties = 3;
  return new Promise((resolve, reject) => {
    try {
      const sql =
        "INSERT INTO Maintain_Database.users (email, max_properties, is_verified, password_hash) VALUES (?,?,?,?)";
      conn.query(
        sql,
        [email, maxProperties, passwordHash, isVerified],
        function (err, result) {
          if (err) {
            console.error("Error inserting user:", err);
            reject(err);
          } else {
            console.log("User inserted successfully");
            resolve(result);
          }
        }
      );
    } catch (error) {
      console.error("Error connecting to the database:", error);
      reject(error);
    }
  });
};

export const insertNewUser = async (email) => {
  return new Promise((resolve, reject) => {
    try {
      const sql = "INSERT INTO Maintain_Database.users (email) VALUES (?)";

      conn.query(sql, [email], function (err, result) {
        if (err) {
          console.error("Error inserting user:", err);
          reject(err);
        } else {
          console.log("User inserted successfully");
          const selectSql =
            "SELECT userID FROM Maintain_Database.users WHERE email = ?";
          conn.query(selectSql, [email], function (err, selectResult) {
            if (err) {
              console.error("Error retrieving updated user data:", err);
              reject(err);
            } else {
              resolve(selectResult || []);
            }
          });
        }
      });
    } catch (error) {
      console.error("Error connecting to the database:", error);
      reject(error);
    }
  });
};

export const updateGoogleUser = async (itemObject) => {
  const { id: userID, email, name, verified_email } = itemObject.oauthUserInfo;
  const params = {
    TableName: "users",
    Item: {
      userID: parseInt(userID),
      email: email,
      name: name,
      isVerified: verified_email,
    },
    // UpdateExpression:
    //   "set #googleId = :valGoogleId, #isVerified = :valIsVerified",
    // ExpressionAttributeNames: {
    //   "#googleId": "googleId",
    //   "#isVerified": "isVerified",
    // },
    // ExpressionAttributeValues: {
    //   ":valGoogleId": updatedUserData.googleId,
    //   ":valIsVerified": updatedUserData.isVerified,
    // },
  };
  try {
    const result = await DocumentClient.put(params).promise();
    return params.Item;
  } catch (e) {
    console.error("Update user failed", e);
    throw e;
  }
};

export const getPropertiesByUser = async (userID) => {
  return new Promise((resolve, reject) => {
    try {
      const sql = "SELECT * FROM Maintain_Database.userProperty WHERE userID = ?";
      conn.query(sql, [userID], function (err, result) {
        if (err) {
          console.error("Error:", err);
          reject(err);
        } else {
          console.log(result);
          resolve(result);
        }
      });
    } catch (error) {
      console.error("Error connecting to the database:", error);
      reject(error);
    }
  });
};