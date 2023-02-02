const express = require('express');
const fetchuser = require('../middleware/fetchuser');
const router = express.Router();
const Notes = require('../models/Notes')
const { body, validationResult } = require('express-validator');

// ROUTE 1 : Get all the notes of the user : login required
router.get('/fetchnotes',fetchuser, async (req,res)=>{
    try {  
        const notes = await Notes.find({user : req.user.id})
        res.json(notes)
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error")
    }
})

// ROUTE 2 : Add a new note using post  : login required
router.post('/addnote',fetchuser,[
    body('title',"title must be at least of 2 characters!").isLength({min : 2}),
    body('description',"Description must be at least of 5 characters!").isLength({ min: 5 }),

], async (req,res)=>{
    try {
        const {title, description} = req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const note = new Notes({
            title, description,user  : req.user.id  
        })
        const saveNote = await note.save();
        res.json(saveNote)
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error")
    }
})

module.exports = router