const express = require("express");
const app = express();
// JSON data importing
const {users}=require('./data/users.json');

const port = 8081;


const usersRouter=require("./routes/users");
const booksRouter=require("./routes/books");

// app.use(express.json());

app.get("/",(req,res)=>{
    res.status(200).json({
        message : "Server is up and running ",
    });
});

app.use("/users",usersRouter);
app.use("/books",booksRouter);

app.get("*",(req,res)=>{
    res.status(404).json({
        message : "This route does not exit",
    });
});

app.listen(port,()=>{
    console.log(`Server running on port ${port}`);
});
