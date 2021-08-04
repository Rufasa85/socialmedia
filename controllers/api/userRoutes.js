const express = require('express');
const router = express.Router();
const db = require('../../models');
const bcrypt = require("bcrypt");

router.get('/',(req,res)=>{
    db.User.findAll({
        include:[
            {
                model:db.Post,
                include:[{
                    model:db.Comment,
                    include:[db.User]
                }]
            }
        ]
    }).then(userData=>{
        res.json(userData)
    }).catch(err=>{
        console.log(err);
        res.status(500).json({
            message:"Uh oh!",
            error:err
        })
    })
})

router.post("/",(req,res)=>{
    db.User.create({
        email:req.body.email,
        username:req.body.username,
        password:req.body.password
    }).then(userData=>{
        req.session.user = {
            id:userData.id,
            username:userData.username,
            email:userData.email
        }
        res.json(userData)
    }).catch(err=>{
        console.log(err);
        res.status(500).json({
            message:"Uh oh!",
            error:err
        })
    })
})

router.post("/login",(req,res)=>{
    db.User.findOne({
        where:{
            email:req.body.email,
        }
    }).then(userData=>{
        if(!userData){
            res.status(403).json({
                message:"Invalid username or password"
            })
        } else {
            if(bcrypt.compareSync(req.body.password,userData.password)){
                req.session.user = {
                    id:userData.id,
                    username:userData.username,
                    email:userData.email
                }
                res.json(userData)
            } else {
                res.status(403).json({
                    message:"Invalid username or password"
                })
            }
        }
    }).catch(err=>{
        console.log(err);
        res.status(500).json({
            message:"Uh oh!",
            error:err
        })
    })
})

router.post("/follow",(req,res)=>{
    if(!req.session?.user?.id){
        res.status(401).json({
            message:"login first you knuckelhead!"
        })
    } else {
        db.User.findByPk(req.session.user.id).then(yourData=>{
            yourData.addFollow(req.body.follow).then(done=>{
                res.json({
                    message:"followed!"
                })
            })
        })
    }
})
router.post("/unfollow",(req,res)=>{
    if(!req.session?.user?.id){
        res.status(401).json({
            message:"login first you knuckelhead!"
        })
    } else {
        db.User.findByPk(req.session.user.id).then(yourData=>{
            yourData.removeFollow(req.body.unfollow).then(done=>{
                res.json({
                    message:"unfollowed!"
                })
            })
        })
    }
})

router.get("/session",(req,res)=>{
    res.json({
        sessionData:req.session
    })
})

router.get('/:id',(req,res)=>{
    db.User.findByPk(req.params.id,{
        include:[
            {
                model:db.Post,
                include:[{
                    model:db.Comment,
                    include:[db.User]
                }]
            },
           db.Comment,
           {
               model:db.User,
               as:"Followers"
           },
           {
            model:db.User,
            as:"Follows"
        }
        ]
    }).then(userData=>{
        res.json(userData)
    }).catch(err=>{
        console.log(err);
        res.status(500).json({
            message:"Uh oh!",
            error:err
        })
    })
})

module.exports = router;