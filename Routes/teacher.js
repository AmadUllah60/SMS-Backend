const express = require("express");

const router = express.Router();
router.post("/add-teacher", async (req, res) => {
  const {
    tea_cnic,
    tea_name,
    tea_education,
    tea_address,
    tea_phone_no,
    tea_salary,
    tea_gender,
    tea_designation,
    tea_doj,
    tea_email,
  } = req.body;
  if (
    !tea_cnic ||
    !tea_name ||
    !tea_education ||
    !tea_address ||
    !tea_phone_no ||
    !tea_salary ||
    !tea_gender ||
    !tea_designation ||
    !tea_doj ||
    !tea_email
  )
    return res.status(400).json({
      error: "Please enter all the details",
    });

  if (tea_name.length <= 3 || tea_name.length >= 15)
    return res.status(400).json({
      error: "Name should be between 3 and 15",
    });
  if (tea_phone_no.length !== 11)
    return res.status(400).json({
      error: "Please enter correct phone number",
    });
  const emailReg =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (!emailReg.test(tea_email))
    return res.status(400).json({
      error: "please enter correct email",
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
          collection: "teacher",
          filter: {
            tea_cnic,
          },
        }),
      }
    );
    const data = await response.json();
    if (data.document)
      return res.status(400).json({
        error: "Teacher already exist",
      });
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
          collection: "teacher",
          document: {
            tea_cnic,
            tea_name,
            tea_education,
            tea_address,
            tea_phone_no,
            tea_salary,
            tea_gender,
            tea_designation,
            tea_doj,
            tea_email,
          },
        }),
      }
    );
    const data_inserted = await saveDoc.json();
    return res.status(200).json(data_inserted.insertedId);
  } catch (error) {
    console.log(error);
  }
});

router.put("/update-teacher", async (req, res) => {
  const {
    tea_cnic,
    tea_name,
    tea_education,
    tea_address,
    tea_phone_no,
    tea_salary,
    tea_gender,
    tea_designation,
    tea_doj,
    tea_email,
  } = req.body;

  if (
    !tea_cnic ||
    !tea_name ||
    !tea_education ||
    !tea_address ||
    !tea_phone_no ||
    !tea_salary ||
    !tea_gender ||
    !tea_designation ||
    !tea_doj ||
    !tea_email
  )
    return res.send("All fields are required");
  if (tea_name.length <= 3 || tea_name.length >= 15)
    return res.status(400).json({
      error: "Name should be between 3 and 15",
    });
  if (tea_phone_no.length !== 11)
    return res.status(400).json({
      error: "Please enter correct phone number",
    });
  const emailReg =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (!emailReg.test(tea_email))
    return res.status(400).json({
      error: "please enter correct email",
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
          collection: "teacher",
          filter: {
            tea_cnic,
          },
        }),
      }
    );
    const data = await response.json();
    if (!data.document)
      return res.status(400).json({
        error: "Teacher CNIC not found",
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
          collection: "teacher",
          filter: { tea_cnic },
          update: {
            $set: {
              tea_cnic,
              tea_name,
              tea_education,
              tea_address,
              tea_phone_no,
              tea_salary,
              tea_gender,
              tea_designation,
              tea_doj,
              tea_email,
            },
          },
        }),
      }
    );
    const result = await saveDoc.json();
    if (!result.modifiedCount)
      return res.status(400).json({
        error: "Error in updating the Teacher",
      });
    return res.status(200).json("Data updated succefully!");
  } catch (error) {
    console.log(error);
  }
});

router.post("/delete-teacher", async (req, res) => {
  const { tea_cnic } = req.body;

  if (!tea_cnic) return res.send("Teacher CNIC required");
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
          collection: "teacher",
          filter: {
            tea_cnic,
          },
        }),
      }
    );
    const data = await response.json();
    if (!data.document)
      return res.status(400).json({
        error: "CNIC not found",
      });

    const saveDoc = await fetch(
      "https://ap-south-1.aws.data.mongodb-api.com/app/data-bcudq/endpoint/data/v1/action/deleteOne",
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
          collection: "teacher",
          filter: { tea_cnic },
        }),
      }
    );
    const result = await saveDoc.json();
    console.log(result);
    if (!result.deletedCount)
      return res.status(400).json({
        error: "Error in deleting Teacher",
      });
    return res.status(200).json("Teacher Deleted Succefully!");
  } catch (error) {
    console.log(error);
  }
});

router.post("/delete-teachers", async (req, res) => {
  const { tea_cnic } = req.body;

  if (!tea_cnic) return res.send("Teacher CNIC required");
  try {
    const response = await fetch(
      "https://ap-south-1.aws.data.mongodb-api.com/app/data-bcudq/endpoint/data/v1/action/find",
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
          collection: "teacher",
          filter: {
            tea_cnic: {
              $in: tea_cnic,
            },
          },
        }),
      }
    );
    const data = await response.json();
    if (!data.documents)
      return res.status(400).json({
        error: "CNIC not found",
      });

    const saveDoc = await fetch(
      "https://ap-south-1.aws.data.mongodb-api.com/app/data-bcudq/endpoint/data/v1/action/deleteMany",
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
          collection: "teacher",
          filter: {
            tea_cnic: {
              $in: tea_cnic,
            },
          },
        }),
      }
    );
    const result = await saveDoc.json();
    console.log(result);
    if (!result.deletedCount)
      return res.status(400).json({
        error: "Error in deleting Teacher",
      });
    return res.status(200).json("Teachers Deleted Succefully!");
  } catch (error) {
    console.log(error);
  }
});

router.post("/get-teacher", async (req, res) => {
  const { tea_cnic } = req.body;

  if (!tea_cnic) return res.send("Teacher CNIC required");
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
          collection: "teacher",
          filter: {
            tea_cnic,
          },
        }),
      }
    );
    const data = await response.json();
    if (!data.document)
      return res.status(400).json({
        error: "CNIC not found",
      });
    return res.status(200).json(data.document);
  } catch (error) {
    console.log(error);
  }
});

router.get("/get-teachers", async (req, res) => {
  try {
    const response = await fetch(
      "https://ap-south-1.aws.data.mongodb-api.com/app/data-bcudq/endpoint/data/v1/action/find",
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
          collection: "teacher",
        }),
      }
    );
    const data = await response.json();
    if (!data.documents)
      return res.status(400).json({
        error: "No data in database",
      });
    return res.status(200).json(data.documents);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
