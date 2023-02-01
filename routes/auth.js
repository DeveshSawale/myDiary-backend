const express = require('express');
const User = require('../models/User');
const router = express.Router();
const { body, validationResult } = require('express-validator');

router.post('/',[
    body('email',"Enter a valid email!").isEmail(),
    body('password',"Password must be at least of 5 characters!").isLength({ min: 5 }),
], (req,res)=>{  
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    User.create({
        name: req.body.name,
        password: req.body.password, 
        email: req.body.email,  
    }).then(user => res.json(user))
    .catch(err => {console.log(err)
    res.json({error : "This email is already taken", msg : err.message})
    });
})

module.exports = router