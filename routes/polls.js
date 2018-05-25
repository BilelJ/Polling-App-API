var express = require('express');
var router = express.Router();

var db = require('../models');

router.get('/',(req,res)=>{
    db.Poll.find()
        .then(polls=>{res.json(polls)})
        .catch(err=>{res.status(404).send({error:"Error fetching polls from database, please try again later!"})});
});

router.get('/:pollId',(req,res)=>{
    let canSubmit = true;
    db.Log.findOne({pollId:req.params.pollId})
        .then(log=>{
            if(log.ips.findIndex(ip=>ip === req.header('x-forwarded-for'))>-1){
            canSubmit = false;
            }
        })
        .then((log)=>{
            db.Poll.findById(req.params.pollId).lean()
                .then(poll=>{
                     poll["canSubmit"] = canSubmit;
                     res.json(poll);
                })
                .catch(err=>{res.status(404).json({error:"Poll not found, check your URL!"})});
        })
        .catch(err=>{
            db.Poll.findById(req.params.pollId).lean()
                .then(poll=>{
                     poll["canSubmit"] = canSubmit;
                     res.json(poll);
                })
                .catch(err=>{res.status(404).json({error:"Poll not found, check your URL!"})});
        });
    
});

router.put('/:pollId',(req,res)=>{
    let query=Object.assign(req.body);
    let id = req.params.pollId;
    db.Poll.findById(req.params.pollId)
        .then(foundPoll=>{
            //Log the IP of the voter, create a new entry if not already available
            db.Log.findOne({pollId:req.params.pollId})
                .then(log=>{
                    if(log.ips.findIndex(ip=>ip === req.header('x-forwarded-for'))===-1){
                        log.ips.push(req.header('x-forwarded-for'));
                        db.Log.findOneAndUpdate({pollId:req.params.pollId},{ips:log.ips},{new:true})
                            .then(poll=>null);
                    } else {
                       res.status(401).json({error: "User already voted!"});
                    }
                })
                .then(()=>{
                        let elements = foundPoll.pollElements;
                        let index = elements.findIndex(element=>element.element===query.pollElements);
                        elements[index].count +=1;
                        db.Poll.findOneAndUpdate({_id:id},{pollElements:elements},{new:true})
                            .then(poll=>{res.status(201).json(poll)})
                            .catch(err=>{res.status(503).json({error:"Error occured while submitting your vote, try again later!"})});
                })
                .catch(err=>{
                    db.Log.create({pollId:req.params.pollId,ips:[req.header('x-forwarded-for')]})
                        .then(()=>{
                        let elements = foundPoll.pollElements;
                        let index = elements.findIndex(element=>element.element===query.pollElements);
                        elements[index].count +=1;
                        db.Poll.findOneAndUpdate({_id:id},{pollElements:elements},{new:true})
                            .then(poll=>{res.status(201).json(poll)})
                            .catch(err=>{res.status(503).json({error:"Error occured while submitting your vote, try again later!"})});
                        });
                });
        })
        .catch(err=>{res.status(404).json({error:"Poll not foud, check your URL!"})});
});


/*router.delete('/:pollId',(req,res)=>{
    db.Poll.remove({_id:req.params.pollId})
        .then(res.status(204).json({message: 'Poll deleted'}))
        .catch(err=>{res.status(404).json({error:"Poll not foud, check your URL!"})});
});*/
router.post('/',(req,res)=>{
    let elements = req.body.pollElements.map(pollElement=>pollElement.element);
    if (elements.every((element,i,arr)=>arr.lastIndexOf(element)===i)){
        db.Poll.create(req.body)
            .then(newPoll=>{
            res.status(201).json(newPoll);
            })
            .catch(err=>{res.status(503).json({error:"Could not publish the poll, please try again later!"})});
    } else{
        res.status(503).json({error:"Cannot publish a poll with duplicate items!"});
    }

});
module.exports = router;