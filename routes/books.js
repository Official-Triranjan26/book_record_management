const express=require("express");


const {books}=require("../data/books.json");
const {users}=require("../data/users.json");

const router=express.Router();
router.use(express.json());
// Route : /books
// method :GET
// description :get all the books
// access :public
// parameter :none

router.get("/",(req,res)=>{
    return res.status(200).json({
        success:true,
        message:"books fetched successfully !!",
        data:books
    })
})

// Route : /books/:id
// method :GET
// description :get a book by id
// access :public
// parameter :id

router.get("/:id",(req,res)=>{
    const {id}=req.params;
    const book=books.find((each)=>each.id===id);
    if(!book){
        return res.status(404).json({
            success:false,
            message:"Book with this id not found !!",
        })
    }
    return res.status(200).json({
        success:true,
        message:"Book got successfully",
        data:book,

    })
})

// Route : /books/issued
// method :GET
// description :get all the issued book
// access :public
// parameter :none

// ----------------------------------
// locic stepwise:

/*
1. import users.json
2.filter the users.json on the basis of 'issuedBook' field
3.store the filtered objects in "usersWithIssuedBooks" variable(only store those objects from the user.json that have  'issuedBook' field)
4.create a blank array "issuedBooks"
5.we will check, if 'issuedBook' of "usersWithIssuedBooks" is equal to the book.id....then store it(The object of book) on book.

6.add more some details:
	book.issuedBy: name of the user
	book.issuedDate = each.issuedDate;
   	book.returnDate = each.returnDate;
7.push it on the blank array-"issuedBooks"
8.finally we will get the books which are already issued in -"issuedBooks"
*/
// ------------------------------------------------------------

router.get("/issued/by-user", (req, res) => {
    const usersWithIssuedBooks = users.filter((each) => {
      if (each.issuedBook) return each;
    });
  
    const issuedBooks = [];
  
    usersWithIssuedBooks.forEach((each) => {
      const book = books.find((book) => book.id === each.issuedBook);
  
      book.issuedBy = each.name;
      book.issuedDate = each.issuedDate;
      book.returnDate = each.returnDate;
  
      issuedBooks.push(book);
    });
  
    if (issuedBooks.length === 0)
      return res.status(404).json({
        success: false,
        message: "No books issued yet",
      });
  
    return res.status(200).json({
      success: true,
      message:"issued books found successfully !!",
      data: issuedBooks,
    });
  });

  // Route : /books
  // method :POST
  // description :Add a book
  // access :public
  // parameter :none

  router.post("/",(req,res)=>{
    const { data } = req.body;
    if(!data){
      return res.status(400).json({/*Checking if we are getting the data from body or not*/
        success:false,
        message:"Data not provided by user"
      })
    }

    const book=books.find((each)=>each.id===data.id);
    if(book){  /*checking if any book with same id already exists*/
      return res.status(400).json({
        success:false,
        message:"Book with same id exists !!Use unique id"
      })
    }
    books.push(data);/*Pushing the "data "to books*/
    return res.status(200).json({
      success:true,
      message:"New book added successfully!!",
      data:books
    })
  })

   // Route : /books/:id
  // method :PUT
  // description :update a book by id
  // access :public
  // parameter :id
  //data:name,author,.....

  router.put("/:id",(req,res)=>{
    const { id }=req.params;
    const {data}=req.body;
    const book=books.find((each)=>each.id===id);
    if(!book){
      return res.status(404).json({
        success:false,
        message:"book with this id does not exist"
      })
    }
    const updatedBooks=books.map((each)=>{
      if(each.id===id){
        return{...each,...data}
      }
      return each;
    })
    return res.status(200).json({
      success:true,
      id:id,
      message:"Book whith particular id updated successfully",
      data:updatedBooks
    })

  })


  // Route : /books/subscription-details/:id
  // method :GET
  // description :Get the subscription details of a user by id
  // access :public
  // parameter :id

  router.get("/subscription-details/:id", (req, res) => {
    const { id } = req.params;
  
    const user = users.find((each) => each.id === id);
  
    if (!user)
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
  
    const getDateInDays = (data = "") => {
      let date;
      if (data === "") {
        // current date
        date = new Date();
      } else {
        // getting date on bacis of data variable
        date = new Date(data);
      }
      let days = Math.floor(date / (1000 * 60 * 60 * 24));
      return days;
    };
  
    const subscriptionType = (date) => {
      if (user.subscriptionType === "Basic") {
        date = date + 90;
      } else if (user.subscriptionType === "Standard") {
        date = date + 180;
      } else if (user.subscriptionType === "Premium") {
        date = date + 365;
      }
      return date;
    };
  
    // Subscription expiration calculation
    // January 1, 1970, UTC. // milliseconds
    let returnDate = getDateInDays(user.returnDate);
    let currentDate = getDateInDays();
    let subscriptionDate = getDateInDays(user.subscriptionDate);
    let subscriptionExpiration = subscriptionType(subscriptionDate);
  
    console.log("Return Date ", returnDate);
    console.log("Current Date ", currentDate);
    console.log("Subscription Date ", subscriptionDate);
    console.log("Subscription expiry date", subscriptionExpiration);
  
    const data = {
      ...user,
      subscriptionExpired: subscriptionExpiration < currentDate,
      daysLeftForExpiration:
        subscriptionExpiration <= currentDate
          ? 0
          : subscriptionExpiration - currentDate,
      fine:
        returnDate < currentDate
          ? subscriptionExpiration <= currentDate
            ? 200
            : 100
          : 0,
    };
  
    res.status(200).json({
      success: true,
      data,
    });
  });


// Default Export
module.exports=router;