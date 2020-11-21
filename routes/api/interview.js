const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
//const User= require('../../models/user');
const { check, validationResult } = require('express-validator/check');
const interview = require('../../models/Interview');
const nodemailer = require('nodemailer');

//@route GET api/interview
//@desc Testing
//@access Public

router.get('/fetch', async (req, res) => {
  try {
    let interview = await Interview.find({});
    res.send(interview);
  } catch (err) {
    res.status(500);
  }
});


function timeClash(interview_start_time,interview_end_time,start_time ,end_time)
{
          if (
            start_time <= interview_start_time &&
            end_time >= interview_end_time
          ) {
            return true;
          } else if (
            start_time >= interview_start_time &&
            end_time <= interview_end_time
          ) {
            return true;
          } else if (
            start_time <= interview_start_time &&
            end_time <= interview_end_time &&
            end_time >= interview_start_time
          ) {
            return true;
          } else if (
            start_time >= interview_start_time &&
            start_time <= interview_end_time &&
            end_time >= interview_end_time
          ) {
            return true;
          }
          else
          return false;
        
      }


router.post(
  '/create',
 
  async (req, res) => {
    

    const {
      date,
      timeStart,
      timeEnd,
      candidate,
      candidateName,
      interviewer,
      interviewerName,
    } = req.body;

    try {
      //if candidate has an interview already
      let interview = await Interview.find({ candidate: candidate, date:date } );
      let newInterviewerList = interviewer.split(',');
      newInterviewerList = newInterviewerList.filter((i) => i != '');

      if (interview.length > 0) {
        console.log(interview);
        for (let x in interview) {
        //  if (interview[x].date == date) {
            let interview_start_time = parseInt(interview[x].timeStart);
            let interview_end_time = parseInt(interview[x].timeEnd);
            let start_time = parseInt(timeStart);
            let end_time = parseInt(timeEnd);
           if(timeClash(interview_start_time,interview_end_time,start_time ,end_time))
           {
            return res.status(503).json({
              response: 'Error',
              msg: 'Candidate is Busy',
            });
           }
        }
      }
      interview = await Interview.find({ date });
      if (interview.length > 0) {
        for (let x in interview) {
          let interviwerList = interview[x].interviewer.split(',');
          interviwerList = interviwerList.filter((i) => i != '');

          for (let y in interviwerList) {
            for (let z in newInterviewerList) {
              //  console.log("A"+interviwerList[y]+"B"+newInterviewerList[z]);
              if (interviwerList[y] == newInterviewerList[z]) {
                let interview_start_time = parseInt(interview[x].timeStart);
                let interview_end_time = parseInt(interview[x].timeEnd);
                let start_time = parseInt(timeStart);
                let end_time = parseInt(timeEnd);
                if(timeClash(interview_start_time,interview_end_time,start_time ,end_time))
                {
                  return res.status(503).json({
                    response: 'Error',
                    msg: interviwerList[y] + ' is Busy',
                  });
                }
              }
            }
          }
        }
      }

      interview = new Interview({
        date,
        timeStart,
        timeEnd,
        candidate,
        candidateName,
        interviewer,
        interviewerName,
      });

      await interview.save();

      var transport = nodemailer.createTransport({
        host: 'mail.cloudaccess.net',
        port: 587,
        auth: {
          user: 'app@zagpoint.com',
          pass: '12872561287256',
        },
      });
      const message = {
        from: 'app@zagpoint.com', // Sender address
        to: candidate, // List of recipients
        subject: 'Interview Schedule', // Subject line
        text: 'You have an interview on ' + date, // Plain text body
      };
      transport.sendMail(message, function (err, info) {
        if (err) {
          console.log(err);
        } else {
          console.log(info);
        }
      });

      res.send('Saved');
    } catch (err) {
      return res.status(503).json({
        response: 'Error',
        msg: 'Server Error',
      });
    }
  }
);

router.post(
  '/update',

  async (req, res) => {

    console.log(req.body);

    const {
      id,
      date,
      timeStart,
      timeEnd,
      candidate,
      candidateName,
      interviewer,
      interviewerName,
    } = req.body;

    try {
      
      let interview = await Interview.findOne({ _id: id });
      let newInterviewerList = interviewer.split(',');
      newInterviewerList = newInterviewerList.filter((i) => i != '');

      if (interview) {
        let interview = await Interview.find({ candidate , date:date , _id:{$ne:id} });
        if (interview.length > 0) {
          for (let x in interview) {
              let interview_start_time = parseInt(interview[x].timeStart);
              let interview_end_time = parseInt(interview[x].timeEnd);
              let start_time = parseInt(timeStart);
              let end_time = parseInt(timeEnd);
              if(timeClash(interview_start_time,interview_end_time,start_time ,end_time))
              {
                return res.status(503).json({
                  response: 'Error',
                  msg: 'Candidate is Busy',
                });
              }
              
            }
          }
        

        interview = await Interview.find({ date: date , _id:{$ne:id} });
        if (interview.length > 0) {
          for (let x in interview) {
            console.log(interview[x]._id + ' ' + id);
            //if (!(String(interview[x].id) == String(id))) {
              console.log('IN');
              let interviwerList = interview[x].interviewer.split(',');
              interviwerList = interviwerList.filter((i) => i != '');
              for (let y in interviwerList) {
                for (let z in newInterviewerList) {
                  if (interviwerList[y] == newInterviewerList[z]) {
                    if (interviwerList[y] == newInterviewerList[z]) {
                      let interview_start_time = parseInt(
                        interview[x].timeStart
                      );
                      let interview_end_time = parseInt(interview[x].timeEnd);
                      let start_time = parseInt(timeStart);
                      let end_time = parseInt(timeEnd);
                      if(timeClash(interview_start_time,interview_end_time,start_time ,end_time))
                        {
                              return res.status(503).json({
                              response: 'Error',
                              msg: interviwerList[y] + ' is Busy',
                                    });
                        }
                    }
                  }
                }
              }
            
          }
        }

        await Interview.updateOne({ _id: id }, [
          {
            $set: {
              date: date,
              timeStart: timeStart,
              timeEnd: timeEnd,
              candidate: candidate,
              candidateName: candidateName,
              interviewer: interviewer,
              interviewerName: interviewerName,
            },
          },
        ]);

        return res.send('Updated');
      } else {
        res.send('Interview Id invalid');
      }
    } catch (err) {
      console.log(err);
      return res.status(503).json({
        response: 'Error',
        msg: 'Server Error',
      });
    }
  }
);

router.post(
  '/delete',
  [check('id', 'id is req').not().isEmpty()],

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    console.log(req.body);

    const { id } = req.body;

    try {
      await Interview.deleteOne({ _id: id });
      res.json({ status: 'ok' });
    } catch (err) {
      console.log(err);
      res.status(500).json({ err: 'custom' });
    }
  }
);

module.exports = router;
