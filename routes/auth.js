const express = require('express');
const User = require('../models/User');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
require("dotenv").config();

router.post('/createuser',[
    // express validation
    body('email',"Enter a valid email!").isEmail(),
    body('password',"Password must be at least of 5 characters!").isLength({ min: 5 }),
], async (req,res)=> {  
    
    // if express validator detects any error
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
        let user = await User.findOne({email : req.body.email});
        
        // entered email already exists in database
        if(user){
            return res.status(400).json({error : "This email is already registered"})
        }
        
        const salt = await bcrypt.genSalt(10);
        const passW = await bcrypt.hash(req.body.password,salt)

        user = await User.create({
            name: req.body.name,
            password: passW, 
            email: req.body.email,  
        })
        const data = {
            user : {
                id : user.id
            }
        }
        const token = jwt.sign(data,process.env.secret)
    
        res.json({token})
        
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Some Error occured")
    }

    
})

module.exports = router