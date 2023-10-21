const express = require("express");
const bcrypt = require("bcryptjs");

const router = express.Router();
router.post("/signup", async (req, res) => {
  const { name, email, password, userType } = req.body;
  if ((!name || !email || !password, !userType))
    return res.status(400).json({
      error: "Please enter all the details",
    });
  const emailReg =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (name.length <= 3 || name.length >= 15)
    return res.status(400).json({
      error: "Name should be between 3 and 15",
    });
  if (!emailReg.test(email))
    return res.status(400).json({
      error: "please enter correct email",
    });
  if (password.length < 6)
    return res.status(400).json({
      error: "Password lenght should be more than 6",
    });
  try {
    const response = await fetch(
      "https://ap-south-1.aws.data.mongodb-api.com/app/data-bcudq/endpoint/data/v1/action/findOne",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apiKey:
            "FIfEglBPpwgKQl2oJjx5u2bxK0PgVWwdUQqDouhyLG0qODLOS3tTuop4Bfrcz3Wn",
        },
        body: JSON.stringify({
          dataSource: "Cluster0",
          database: "sms",
          collection: "user",
          filter: {
            email: email,
          },
        }),
      }
    );
    const data = await response.json();
    if (data.document)
      return res.status(400).json({
        error: "Email already registered",
      });
    const hashPassword = await bcrypt.hash(password, 12);
    const saveDoc = await fetch(
      "https://ap-south-1.aws.data.mongodb-api.com/app/data-bcudq/endpoint/data/v1/action/insertOne",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apiKey:
            "FIfEglBPpwgKQl2oJjx5u2bxK0PgVWwdUQqDouhyLG0qODLOS3tTuop4Bfrcz3Wn",
        },
        body: JSON.stringify({
          dataSource: "Cluster0",
          database: "sms",
          collection: "user",
          document: {
            name,
            email,
            password: hashPassword,
            userType,
          },
        }),
      }
    );
    const insertedId = await saveDoc.json();
    return res.status(200).json(insertedId.insertedId);
  } catch (error) {
    console.log(error);
  }
});

router.post("/change_password", async (req, res) => {
  const { id, old_password, new_password } = req.body;

  if (!id || !old_password || !new_password)
    return res.status(400).json({
      error: "Please enter all the details",
    });
  if (old_password.length < 6)
    return res.status(400).json({
      error: "Password lenght should be more than 6",
    });
  if (new_password.length < 6)
    return res.status(400).json({
      error: "Password lenght should be more than 6",
    });
  try {
    const response = await fetch(
      "https://ap-south-1.aws.data.mongodb-api.com/app/data-bcudq/endpoint/data/v1/action/findOne",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apiKey:
            "FIfEglBPpwgKQl2oJjx5u2bxK0PgVWwdUQqDouhyLG0qODLOS3tTuop4Bfrcz3Wn",
        },
        body: JSON.stringify({
          dataSource: "Cluster0",
          database: "sms",
          collection: "user",
          filter: {
            _id: { $oid: id },
          },
        }),
      }
    );
    const data = await response.json();
    if (!data.document)
      return res.status(400).json({
        error: "user not found",
      });
    const hashPassword = await bcrypt.hash(new_password, 12);
    if (!(await bcrypt.compare(old_password, data.document.password)))
      return res.status(400).json({
        error: "Password is incorrect",
      });
    const saveDoc = await fetch(
      "https://ap-south-1.aws.data.mongodb-api.com/app/data-bcudq/endpoint/data/v1/action/updateOne",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apiKey:
            "FIfEglBPpwgKQl2oJjx5u2bxK0PgVWwdUQqDouhyLG0qODLOS3tTuop4Bfrcz3Wn",
        },
        body: JSON.stringify({
          dataSource: "Cluster0",
          database: "sms",
          collection: "user",
          filter: { _id: { $oid: id } },
          update: {
            $set: {
              password: hashPassword,
            },
          },
        }),
      }
    );
    const result = await saveDoc.json();
    if (!result.modifiedCount)
      return res.status(400).json({
        error: "Password updation failed.",
      });
    return res.status(200).json("Password updated succefully!");
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
