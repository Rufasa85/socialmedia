const db =require("../models")

const sequelize = require("../config/connection")

const seedMe= async ()=>{
    await sequelize.sync({force:true});
    await db.User.bulkCreate([
        {
            username:"IhateReading",
            email:"joe@bob.com",
            password:"password"
        },
        {
            username:"BooksAreGreat",
            email:"bob@bob.com",
            password:"password1"
        },
        {
            username:"BlogBoi340",
            email:"Kevin@nets.com",
            password:"password1!"
        },
    ],{
        individualHooks:true
    })
    await db.Post.bulkCreate([
        {
            body:"Books are dumb",
            UserId:1
        },
        {
            body:"Movies are the best",
            UserId:1
        },
        {
            body:"Books are the best",
            UserId:2
        },
        {
            body:"The best movie Thunderstruck starring Kevin Durant",
            UserId:3
        },
       
    ])
    await db.Comment.bulkCreate([
        {
            body:"Why you hate books?",
            UserId:2,
            PostId:1
        },
        {
            body:"Because you have to read them",
            UserId:1,
            PostId:1
        },
        {
            body:"Books are ok, but not as sweet as a KD jump shot",
            UserId:3,
            PostId:1
        }  
    ])

    const firstUser = await db.User.findByPk(1);
    await firstUser.addFollow(3);
    process.exit(0);
}

seedMe()