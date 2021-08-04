const User = require("./User");
const Post = require("./Post");
const Comment = require("./Comment");

User.hasMany(Post,{
    onDelete:"CASCADE"
});
Post.belongsTo(User);

User.hasMany(Comment,{
    onDelete:"CASCADE"
});
Comment.belongsTo(User);

Post.hasMany(Comment,{
    onDelete:"CASCADE"
});
Comment.belongsTo(Post);

User.belongsToMany(User,{
    through:"FollowersFollows",
    as:"Followers",
    foreignKey:"FollowerId",
    otherKey:"FollowId"
})

User.belongsToMany(User,{
    through:"FollowersFollows",
    as:"Follows",
    foreignKey:"FollowId",
    otherKey:"FollowerId"
})

module.exports = {
    User,
    Post,
    Comment
}