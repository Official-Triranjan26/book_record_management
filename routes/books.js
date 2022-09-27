const express=require("express");

const {books}=require("../data/books.json");
const {users}=require("../data/users.json");

const router=express.Router();

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

// Default Export
module.exports=router;