const db = require("../config/database")

const Category = require("./Category")
const Post = require("./Post")
const User = require("./User")
const Comment = require("./Comment")

Category.hasMany(Post, {
  foreignKey: 'category_id'
})

Post.belongsTo(Category, {
  foreignKey: 'category_id'
})

User.hasMany(Post, {
  foreignKey: 'user_id'
})

Post.belongsTo(User, {
  foreignKey: 'user_id'
})

Post.hasMany(Comment, {
  foreignKey: 'post_id'
})

Comment.belongsTo(Post, {
  foreignKey: 'post_id'
})

User.hasMany(Comment, {
  foreignKey: 'user_id'
})

Comment.belongsTo(User, {
  foreignKey: 'user_id'
})

const check = async () => {
  try {
    await db.sync()
    console.log('Connection has been established successfully.')
  } catch (error) {
    console.error('Unable to connect to the database.', error)
  }
}

check()