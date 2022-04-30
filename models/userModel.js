const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
    myBooks:{
      type:Array.prototype,
      required:false,
      default:[]
    }
  },
  {
    timestamps: true,
  }
);


userSchema.pre('save',async function(next){
    if(!this.isModified('password'))
    {
        next();
    }
    const salt=await bcrypt.genSalt(10);
    this.password=await bcrypt.hash(this.password,salt);
})

userSchema.methods.matchPassword=async function(passKey){
    return await bcrypt.compare(passKey,this.password)
}

const user = mongoose.model("User", userSchema);
module.exports = user;
