const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
//const User= require('../../models/user');
const { check, validationResult } = require('express-validator/check');
const interviewer = require('../../models/interviewer');

router.get('/fetch', async (req, res) => {
  try {
    let interviewer = await Interviewer.find({});
    res.send(interviewer);
  } catch (err) {
    res.status(500);
  }
});

router.post('/create', async (req, res) => {
  console.log(req.body);

 
  const { name, email } = req.body;

  try {
    let interviewer = await Interviewer.find({ email });

    if (interviewer.length > 0) {
      res.status(200).send('Exists not saving');
      return;
    }
    interviewer = new Interviewer({
      name,
      email,
    });

    await interviewer.save();
    res.send('Saved');
  } catch (err) {
    console.log(err);
    res.status(500).send('Server error'); //Note Better errors
  }
});

router.post(
  '/delete',

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    console.log(req.body);

    const { email } = req.body;

    try {
      await Interviewer.deleteOne({ email });
    } catch (err) {
      console.log(err);
      res.status(500).send('Server error');
    }
  }
);

module.exports = router;
