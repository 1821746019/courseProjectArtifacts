const mongoose = require("mongoose")

console.log(`MONGO_URI`, process.env.MONGO_URI)
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
const UserSchema = new mongoose.Schema({
    username: {
        type: String
    }
})

const ExerciseSchema = new mongoose.Schema({
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    description: {
        type: String,
        required:true
    },
    duration: {
        type: Number,
        required:true
    },
    date: {
        type: Date,
    },
})
const User = mongoose.model("User", UserSchema)
const Exercise = mongoose.model("Exercise", ExerciseSchema)

User.syncIndexes()
Exercise.syncIndexes()
User.deleteMany({},(err,data)=>{
    if(err){
        console.error("failed to delete User doc")
    }
})
Exercise.deleteMany({},(err,data)=>{
    if(err){
        console.error("failed to delete Exercise doc")
    }
})
const createAndSaveUser = (username, done) => {
    let user = new User({ username })
    user.save((err, data) => {
        if (err) {
            done(err); return
        }
        done(null, data)
    })
}
const createExercise=(exercise,done)=>{
    
    let exerciseDoc=new Exercise(exercise)
    exerciseDoc.save((err,data)=>{
        if(err){
            done(err);return
        }
        done(null,data)
    })
}
exports.User = User
exports.Exercise = Exercise

exports.createAndSaveUser = createAndSaveUser
exports.createExercise = createExercise
