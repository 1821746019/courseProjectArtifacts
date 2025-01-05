const express = require('express')
const app = express()
const bodyParser = require("body-parser")
const cors = require('cors')
require('dotenv').config()
const { User, Exercise, Log, createAndSaveUser, createExercise } = require("./DB_mongo")
// const req = require('express/lib/request')

app.use(cors())
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }))

// app.get("/")
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.route("/api/users").post((req, res) => {
  const { username } = req.body
  createAndSaveUser(username, (err, data) => {
    if (err) {
      res.status(404); return
    }
    const { _id, username } = data
    res.json({ _id, username })
  })
})
  .get((req, res) => {
    User.find().select(["username", "_id"]).exec((err, data) => {
      if (err) {
        res.status(400).json();
        return
      }
      res.json(data)
    })
  })
app.post("/api/users/:_id/exercises", async (req, res) => {
  let { description, duration, date } = req.body;
  if(!date){
    date=Date()
  }
  const { _id } = req.params
  const userObj = await User.findById(_id).select("username")
  if (!userObj) {
    res.status(404)
    return
  }
  const username = userObj.username
  createExercise({ user_id: _id, description, duration, date }, (err, data) => {
    if (err) {
      console.error(err);
      res.status(400).json(); return
    }
    const { description, duration, date } = data
    res.json({ username, _id, description, duration, date, })
  })
})
app.get("/api/users/:_id/logs", (req, res) => {
  const { from, to, limit:limitRaw } = req.query
  const limit=parseInt(limitRaw)
  const { _id } = req.params
  console.log(`[DEBUG] req.query `,req.query,`req.params`,req.params)
  let query={user_id:_id}
  if(from||to){
    query.date={}
    if(from){
      query.date.$gte=new Date(from)
    }
    if(to){
      query.date.$lte=new Date(to)
    }
  }
  Exercise.find(query).limit(limit).exec(async (err, data) => {
    if (err) {
      res.status(400).json(); return
    }
    const userObj = await User.findById(_id).select("username")
    if (!userObj) {
      res.status(404).json()
      return
    }
    const username = userObj.username
    res.json({
      username,
      count: data.length,
      _id,
      log: [...data.map((e) => {
        console.log(`each item is `,e)
        const { description, duration, date } = e
        const ret= { description, duration, date:new Date(date).toDateString()}
        return ret
      })]
    })
  })
})
const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
