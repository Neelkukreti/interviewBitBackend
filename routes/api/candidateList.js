const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
//const User= require('../../models/user');
const { check, validationResult } = require('express-validator/check');
const candidate = require('../../models/candidate');

router.get('/fetch', async (req, res) => {
  try {
    let candidate = await Candidate.find({});
    res.send(candidate);
  } catch (err) {
    res.status(500);
  }
});

router.post('/create', async (req, res) => {
  console.log(req.body);


  const { name, email } = req.body;

  try {
    //if candidate has an interview already
    let candidate = await Candidate.find({ email });

    if (candidate.length > 0) {
      console.log('exists');
      return res.status(200).send('Exists');
    }
    candidate = new Candidate({
      name,
      email,
    });

    await candidate.save();
    res.send('Saved');
  } catch (err) {
    console.log(err);
    return res.status(503).json({
      response: 'Error',
      msg:'Server Error',
    });
  }
});

router.post(
  '/delete',

  async (req, res) => {
    

    console.log(req.body);

    const { email } = req.body;

    try {
      //if candidate has an interview already
      await Candidate.deleteOne({ email });
    } catch (err) {
      console.log(err);
      return res.status(503).json({
        response: 'Error',
        msg: 'Server Error'
      });
    }
  }
);

module.exports = router;
