const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {check, validationResult} = require('express-validator');
const User = require('../models/User');
const Contact = require('../models/Contact');


//@route    GET api/contacts
//@desc     Get All Users Contacts
//@access   private

router.get('/',auth, async (req,res)=>{
    try {
        const contacts = await Contact.find({user: req.user.id}).sort({date: -1});
        return res.json(contacts);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({msg: 'Server Error'});
    }
});

//@route    POST api/contacts
//@desc     Add New Contact
//@access   Private


router.post('/',[auth, check('name', 'Name is Required').not().isEmpty()], async (req,res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }
    const {name, email, phone, type} = req.body;

    try {
        const newContact = new Contact({
            name, 
            email,
            phone,
            type,
            user: req.user.id
        });
        const contact = await newContact.save();
        res.json(contact);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({msg: 'Internal Server Error'});
    }
});

//@route    PUT api/contacts
//@desc     Update New Contact
//@access   Private


router.put('/:id', auth, async (req,res)=>{

    const {name, email, phone, type} = req.body;

    //Build Contact Objects.
    const contactFields = {};
    if(name) contactFields.name = name;
    if(email) contactFields.email = email;
    if(phone) contactFields.phone = phone;
    if(type) contactFields.type = type;
    try {
        let contact = await Contact.findById(req.params.id);
        if(!contact) {
            return res.status(404).json({msg: 'Contact not found'});
        }

        //Make sure owns the contact
        if(req.user.id !== contact.user.toString()) {
            return res.status(401).json({
                msg: 'Not Authorized'
            });
        }

    contact = await Contact.findByIdAndUpdate(req.params.id,{$set: contactFields},{new: true});
    res.json(contact);

    } catch (error) {
        console.error(error.message);
        res.status(500).json({msg: 'Internal Server Error'});
    }
});


//@route    DELETE api/contacts
//@desc     DELETE New Contact
//@access   Private


router.delete('/:id',auth, async(req,res)=>{
    try {
        let contact = await Contact.findById(req.params.id);
        if(!contact) {
            return res.status(404).json({msg: 'Contact not found'});
        }
        //Make sure owns the contact
        if(req.user.id !== contact.user.toString()) {
            return res.status(401).json({
                msg: 'Not Authorized'
            });
        }

        contact = await Contact.findByIdAndRemove(req.params.id);
        res.json({msg: 'Contact Removed'});
    } catch (error) {
        console.error(error.message);
        res.status(500).json({msg: 'Internal Server Error'});
    }
});

module.exports = router;