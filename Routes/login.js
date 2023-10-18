const express = require("express")
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const router = express.Router()
router.post('/login', async (req, res) =>{
    const {email, password} = req.body;
    if (!email || !password)
        return res.status(400).json({
            error: "Please enter all the details"
        })
        const emailReg =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(!emailReg.test(email))
        return res.status(400).json({
            error: "please enter correct email"
    })
    if(password.length <6)
        return res.status(400).json({
            error: "Password lenght should be more than 6"
    })
    try{
        const response = await fetch(
            "https://ap-south-1.aws.data.mongodb-api.com/app/data-bcudq/endpoint/data/v1/action/findOne",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                apiKey: "FIfEglBPpwgKQl2oJjx5u2bxK0PgVWwdUQqDouhyLG0qODLOS3tTuop4Bfrcz3Wn",
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
      const data = await response.json()
      if (!data.document)
        return res.status(400).json({
            error: "User not found"
        })
        const doesPasswordMatch = await bcrypt.compare(password, data.document.password)
        if (!doesPasswordMatch)
        return res.status(400).json(
            { error: "Please enter correct password"}
            )
        const payload = {
            _id: data.document._id,
        }
        const token = jwt.sign(
            payload, 
            "675hytrhhklifghghyfhghgjhjdgtgjghkjgnb",
            { expiresIn: '1h' }
        )
        const user = {
            ...data.document, password: undefined
        }
        return res.status(200).json(
            {token, user}
        )
    }
    catch(error)
    {
        console.log(error)
    } 
})

module.exports= router;