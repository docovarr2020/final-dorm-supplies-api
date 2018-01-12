const bcrypt = require('bcrypt-nodejs')
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    email: { type: String, unique: true },
    hash: String,
    name: String,
    token: String,
    isAdmin: Boolean,
    address: String,
    classYear: Number,
    orders: [{
      items: [{
        itemId: String,
        quantity: Number,
        price: Number
      }],
      purchasedDate: Date,
      deliveredDate: Date,
      isPaid: Boolean
    }]
  },
  {
    toObject: { getters: true },
    timestamps: {
      createdAt: 'createdDate',
      updatedAt: 'updatedDate'
    },
  }
)

userSchema.pre('save', function(callback) {
  if (!this.email) {
    return callback(new Error("Missing email"))
  }
  if (!this.hash) {
    return callback(new Error("Missing hash"))
  }
  if (!this.name) {
    return callback(new Error("Missing name"))
  }
  if (!this.isAdmin) {
    if(!this.address) {
      return callback(new Error("Missing address"))
    }
  }
  if (this.isModified('hash')) {
    this.hash = bcrypt.hashSync(this.hash)
  }

  callback(null)
})

userSchema.methods.comparePassword = function(pw, callback) {
  bcrypt.compare(pw, this.hash, (err, isMatch) => {
    if (err) return callback(err)
    callback(null, isMatch)
  })
}

const User = mongoose.model('User', userSchema)

module.exports = User