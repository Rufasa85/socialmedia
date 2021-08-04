const express = require('express');
const router = express.Router();
const db = require('../../models');

router.get("/",(req,res)=>{
    db.Post.findAll({
        include:[db.User]
    }).then(postData=>{
        res.json(postData);
    }).catch(err=>{
        console.log(err)
        res.status(500).json({
            message:"Oh no!",
            error:err
        })
    })
})
router.get("/comments",(req,res)=>{
    db.Post.findAll({
        include:[db.User,{
            model:db.Comment,
            include:[db.User]
        }]
    }).then(postData=>{
        res.json(postData);
    }).catch(err=>{
        console.log(err)
        res.status(500).json({
            message:"Oh no!",
            error:err
        })
    })
})

router.post("/",(req,res)=>{
    if(!req.session?.user?.id){
        res.status(401).json({message:"login first jabroni"})
    } else {

        db.Post.create({
            body:req.body.body,
            UserId:req.session.user.id
        }).then(postData=>{
            res.json(postData);
        }).catch(err=>{
            console.log(err)
            res.status(500).json({
                message:"Oh no!",
                error:err
            })
        })
    }
})

router.get("/:id",(req,res)=>{
    db.Post.findByPk(req.params.id,{
        include:[db.User,{
            model:db.Comment,
            include:[db.User]
        }]
    }).then(postData=>{
        res.json(postData);
    }).catch(err=>{
        console.log(err)
        res.status(500).json({
            message:"Oh no!",
            error:err
        })
    })
})

router.delete("/:id",(req,res)=>{
    if(!req.session?.user?.id){
        res.status(401).json({message:"login first jabroni"})
    } else {
       db.Post.destroy({
           where:{
               id:req.params.id,
               UserId:req.session.user.id
           }
       }).then(delPost=>{
           if(delPost){
               res.json({
                   message:"succesful delete!"
               });
            } else {
                res.status(400).json({message:"no post deleted, it either doesnt exist or you didnt create it"})
            }
       }).catch(err=>{
        console.log(err)
        res.status(500).json({
            message:"Oh no!",
            error:err
        })
    })
    }
})

module.exports = router;