const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongodb = require("mongodb");
const { response } = require("express");
const mongoClient = mongodb.MongoClient;
const url = "mongodb+srv://admin123:qyBFHHKDf9IV0CUT@cluster0.idw4e.mongodb.net?retryWrites=true&w=majority";
const cors = require("cors");

app.use(cors({
  origin : "http://127.0.0.1:5500"
}))

app.use(bodyParser.json());

var teachers = [
  {
    name: "Teacher 1",
  },
];

app.get("/", function (req, res) {
  res.send("Hello World");
});

app.get("/students", async function (req, res) {
  try {
    let client = await mongoClient.connect(url);
    let db = client.db("b15wd");
    let studentsList = await db.collection("students").find().toArray();
    client.close();
    res.json(studentsList);
  } catch (error) {
    console.log(error)
    res.json("Something went wrong");
  }
});

app.post("/student", async function (req, res) {
  try {
    let client = await mongoClient.connect(url);
    let db = client.db("b15wd");
    let insertedStudent = await db
      .collection("students")
      .insertOne({ name: req.body.name });
    console.log(insertedStudent.insertedId);
    client.close();
    res.json({
      message: "Student Created",
      id: insertedStudent.insertedId,
    });
  } catch (error) {
    console.log(error)
    res.json("Something went wrong");
  }

  // var studentData = {
  //   id: students.length + 1,
  //   name: req.body.name,
  // };
  // students.push(studentData);
});

app.get("/student/:id", async function (req, res) {
  //  ObjectId("5f61a2b9b521d153087d3c09") == ObjectId("5f61a2b9b521d153087d3c09")
  try {
    let client = await mongoClient.connect(url);
    let db = client.db("b15wd");
    let studet = await db
      .collection("students")
      .findOne({ _id: mongodb.ObjectID(req.params.id) });
    client.close();
    if (studet) {
      res.json(studet);
    } else {
      res.json({
        message: "Not student match",
      });
    }
  } catch (error) {
    res.json("Something went wrong");
  }
});

app.put("/student/:id", async function (req, res) {
  try {
    let client = await mongoClient.connect(url);
    let db = client.db("b15wd");
    let student = await db
      .collection("students")
      .findOneAndUpdate(
        { _id: mongodb.ObjectID(req.params.id) },
        { $set: { name: req.body.name } }
      );
    client.close();
    res.json(student)
  } catch (error) {
    res.json("Something went wrong");
  }

  // if (students[req.params.id - 1]) {
  //   students[req.params.id - 1].name = req.body.name;
  //   res.json({
  //     message: "Updated",
  //     studentId: students[req.params.id].id,
  //   });
  // } else {
  //   res.json({
  //     message: "No Student Avilable",
  //   });
  // }
});

app.delete("/student/:id",async function (req, res) {
  try {
    let client = await mongoClient.connect(url);
    let db = client.db("b15wd");
    await db.collection("students").findOneAndDelete({_id:mongodb.ObjectID(req.params.id)})
    client.close();
    res.json({
      message : "Stundet deleted"
    })
  } catch (error) {
    res.json({
      message : "Something went wrong"
    })
  }

  // let studetDetail = students.find((student) => student.id == req.params.id);
  // let studentIndex = students.indexOf(studetDetail);
  // students.splice(studentIndex, 1);
  // res.json({
  //   message: "Student Deleted",
  // });
});

app.get("/teachers", function (req, res) {
  res.json(teachers);
});

app.listen(3030, function () {
  console.log("Server Started");
});
