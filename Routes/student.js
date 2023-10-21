const express = require("express");

const router = express.Router();
router.post("/add-student", async (req, res) => {
  const {
    std_name,
    std_class,
    std_section,
    std_admission_number,
    std_gender,
    std_dob,
    std_address,
    std_phone_no,
    std_guardian_phone_no,
    std_subjects,
  } = req.body;
  if (
    !std_name ||
    !std_class ||
    !std_section ||
    !std_admission_number ||
    !std_gender ||
    !std_dob ||
    !std_address ||
    !std_phone_no ||
    !std_guardian_phone_no ||
    !std_subjects
  )
    return res.status(400).json({
      error: "Please enter all the details",
    });

  if (std_name.length <= 3 || std_name.length >= 15)
    return res.status(400).json({
      error: "Name should be between 3 and 15",
    });
  if (std_phone_no.length !== 11)
    return res.status(400).json({
      error: "Please enter correct phone number",
    });
  if (std_guardian_phone_no.length != 11)
    return res.status(400).json({
      error: "Please enter correct phone number",
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
          collection: "students",
          filter: {
            std_admission_number,
          },
        }),
      }
    );
    const data = await response.json();
    if (data.document)
      return res.status(400).json({
        error: "student already exist",
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
          collection: "students",
          document: {
            std_name,
            std_class,
            std_section,
            std_admission_number,
            std_gender,
            std_dob,
            std_address,
            std_phone_no,
            std_guardian_phone_no,
            std_subjects,
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

router.put("/update_student", async (req, res) => {
  const {
    std_name,
    std_class,
    std_section,
    std_admission_number,
    std_gender,
    std_dob,
    std_address,
    std_phone_no,
    std_guardian_phone_no,
    std_subjects,
  } = req.body;

  if (
    !std_name ||
    !std_class ||
    !std_section ||
    !std_admission_number ||
    !std_gender ||
    !std_dob ||
    !std_address ||
    !std_phone_no ||
    !std_guardian_phone_no ||
    !std_subjects
  )
    return res.send("All fields are required");
  if (std_phone_no.length !== 11)
    return res.status(400).json({
      error: "Please enter correct phone number",
    });
  if (std_guardian_phone_no.length !== 11)
    return res.status(400).json({
      error: "Please enter correct phone number",
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
          collection: "students",
          filter: {
            std_admission_number,
          },
        }),
      }
    );
    const data = await response.json();
    if (!data.document)
      return res.status(400).json({
        error: "Admission Number not found",
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
          collection: "students",
          filter: { std_admission_number },
          update: {
            $set: {
              std_name,
              std_class,
              std_section,
              std_admission_number,
              std_gender,
              std_dob,
              std_address,
              std_phone_no,
              std_guardian_phone_no,
              std_subjects,
            },
          },
        }),
      }
    );
    const result = await saveDoc.json();
    if (!result.modifiedCount)
      return res.status(400).json({
        error: "Error in updating the Student",
      });
    return res.status(200).json("Data updated succefully!");
  } catch (error) {
    console.log(error);
  }
});

router.delete("/delete-student", async (req, res) => {
  const { std_admission_number } = req.body;

  if (!std_admission_number)
    return res.send("Student admission number required");
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
          collection: "students",
          filter: {
            std_admission_number,
          },
        }),
      }
    );
    const data = await response.json();
    if (!data.document)
      return res.status(400).json({
        error: "Admission Number not found",
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
          collection: "students",
          filter: { std_admission_number },
        }),
      }
    );
    const result = await saveDoc.json();
    console.log(result);
    if (!result.deletedCount)
      return res.status(400).json({
        error: "Error in deleting Student",
      });
    return res.status(200).json("Student Deleted Succefully!");
  } catch (error) {
    console.log(error);
  }
});

router.post("/delete-students", async (req, res) => {
  const { std_admission_number } = req.body;

  if (!std_admission_number)
    return res.send("Student admission number required");
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
          collection: "students",
          filter: {
            std_admission_number: {
              $in: std_admission_number,
            },
          },
        }),
      }
    );
    const data = await response.json();
    if (!data.documents)
      return res.status(400).json({
        error: "Admission Number not found",
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
          collection: "students",
          filter: {
            std_admission_number: {
              $in: std_admission_number,
            },
          },
        }),
      }
    );
    const result = await saveDoc.json();
    console.log(result);
    if (!result.deletedCount)
      return res.status(400).json({
        error: "Error in deleting Student",
      });
    return res.status(200).json("Students Deleted Succefully!");
  } catch (error) {
    console.log(error);
  }
});

router.post("/get_student", async (req, res) => {
  const { std_admission_number } = req.body;

  if (!std_admission_number)
    return res.send("Student admission number required");
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
          collection: "students",
          filter: {
            std_admission_number,
          },
        }),
      }
    );
    const data = await response.json();
    if (!data.document)
      return res.status(400).json({
        error: "Admission Number not found",
      });
    return res.status(200).json(data.document);
  } catch (error) {
    console.log(error);
  }
});

router.get("/get_students", async (req, res) => {
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
          collection: "students",
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
