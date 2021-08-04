const express = require('express');
const router = express.Router();
const db = require('../models');

router.get("/",(req,res)=>{
    db.Post.findAll({
        include:[db.User,{
            model:db.Comment,
            include:[db.User]
        }]
    }).then(posts=>{
        const hbsPosts = posts.map(post=>{
           let result =  post.get({plain:true})
           return {
               ...result,
               formattedDate: result.createdAt.toLocaleDateString(),
               formattedTime:result.createdAt.toLocaleTimeString(),
           }
        })
        console.log(hbsPosts)
        res.render("home",{posts:hbsPosts,loggedInUser:req.session.user})
    })
})
router.get("/profile/:id",(req,res)=>{
    db.User.findByPk(req.params.id,{
        include:[{
            model:db.Post,
            include:[{
                model:db.Comment,
                include:[db.User]
            }]
        }]
    }).then( async user=>{
        const formatted = user.get({plain:true})
        const postsWithDates = formatted.Posts.map(post=>{
            return {
                ...post,
                formattedDate:post.createdAt.toLocaleDateString(),
                formattedTime:post.createdAt.toLocaleTimeString(),
            }
        })
       const hbsUser = {
           ...formatted,
           Posts:postsWithDates,
           loggedInUser:req.session.user,
           isMyPage:req.params.id == req.session.user?.id,
           isFollowing: await user.hasFollower(req.session.user?.id)
       }

       console.log(hbsUser);
        res.render("userpage",hbsUser)
    })
})

router.get("/auth",(req,res)=>{
    if(req.session.user?.id){
        res.redirect("/")
    } else {
        res.render("auth",{loggedInUser:req.session.user});
    }
})

router.get("/logout",(req,res)=>{
    req.session.destroy(()=>{
        res.redirect("/")
    })
})

module.exports = router;