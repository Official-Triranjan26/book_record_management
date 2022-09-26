const express = require("express");
const app = express();
// JSON data importing
const {users}=require('./data/users.json');

const port = 8081;

app.use(express.json());
app.get("/",(req,res)=>{
    res.status(200).json({
        message : "Server is up and running ",
    });
});

// Route : /users
// method :GET
// description :get all the users
// access :public
// parameter :none

app.get('/users',(req,res)=>{
    res.status(200).json({
        success: true,
        data: users,
    })
})

// Route : /users/:id
// method :GET
// description :get single useer by id
// access :public
// parameter :id

app.get('/users/:id',(req,res)=>{
    const {id}=req.params;
    const user=users.find((each)=>each.id===id);
    if(!user){
        res.status(404).json({
            success:false,
            message:'User not found !!'
        })
    }
    res.status(200).json({
        success:true,
        data:user,
    })
})

// Route : /users
// method :POST
// description :create new user
// access :public
// parameter :none

app.post("/users",(req,res)=>{
    const {id,name,surname,email,subscriptionType,subscriptionDate}=req.body;
    const user=users.find((each)=>each.id===id);
    if(user){
        return res.status(404).json({
            success:false,
            message:"User with same id already exists !!"
        })
    }
    users.push({
        id,
        name,
        surname,
        email,
        subscriptionType,
        subscriptionDate
    })
    const createdUser=users.find((each)=>each.id===id);
    return res.status(202).json({
        success:true,
        message_1:"User created successfully",
        id:id,
        data_1:createdUser,
        message_2:'Updated userlist-->',
        data_2:users
    })
})

// Route : /users/:id
// method :PUT
// description :update a user by id
// access :public
// parameter :id

app.put("/users/:id",(req,res)=>{
    const {id}=req.params /*Getting the id form the request*/
    const {data}=req.body  /*Getting data form the request body*/

    user=users.find((each)=>each.id===id); /*Finding the user by id , we want to update*/

    if(!user){  /*If we dont find the user we return the "users" as it is*/

        return res.status(404).json({
            success:false,
            massage:"ID not found",
            message1:"Updatation failed ! returning data as it is",
            data:users
        });
    }
    const updatedUser=users.map((each)=>{/*object with the id will be updated and send,other objects are sent without changing*/
        if(each.id===id){
            return {    /*Filds of each will be overwritten by filds of data*/
                ...each,
                ...data,
            };
        }
        return each /*other objects are sent without changing*/
    })
    return res.status(201).json({
        success:true,
        id:id,
        message:"User details updated successfully",
        details:"Every field of an object is editable for as of now",
        data:updatedUser,/*Pass the updated data*/
    })


})

// Route : /users/:id
// method :DELETE
// description :delete a user by id
// access :public
// parameter :id


app.delete("/users/:id",(req,res)=>{
    const {id}=req.params;
    const user=users.find((each)=>each.id===id);
    if(!user){
        return res.status(404).json({
            success:false,
            // id:id,
            message:"User to be deleted, not found !!"
        });
    }
    const index=users.indexOf(user);
    users.splice(index,1);
    return res.status(202).json({
        success:true,
        id:id,
        message:"User deleted successfully !",
        data:users
    });
});

app.get("*",(req,res)=>{
    res.status(404).json({
        message : "This route does not exit",
    });
});

app.listen(port,()=>{
    console.log(`Server running on port ${port}`);
});
