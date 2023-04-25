const express= require("express")
const expresslayout=require("express-ejs-layouts")
require("./utils/db")
const Contact =require("./model/Contact")
const session = require("express-session")
const cookieParser =require("cookie-parser")
const flash =require("connect-flash")
const { body, validationResult,check } = require('express-validator');
var methodOverride = require('method-override')
const ObjectID= require('mongodb').ObjectID


//panggil expres
const app= express()
const port=3000
//setupmetod override
app.use(methodOverride('_method'))
//setup ejs
app.set('view engine','ejs',"views")
app.use(express.static("public",))
app.use(expresslayout)
app.use(express.urlencoded({extended:true}))


//msg flash
app.use(cookieParser('secret'))
app.use(session({
  cookie:{maxAge:6000},
  secret:"secret",
  resave:true,
  saveUninitialized:true
}))
app.use(flash())

//halaman home
app.get('/', (req, res) => {
    const mhs =[
      {
        nama:"rivan",
        email:"rivanaldy831@gmail.com"
      },
      {
        nama:"rivanaldy",
        email:"rivanaldy831@gmail.com"
      },
      ]
    res.render("index",{nama:"Bebas",title:"ayo main",mhs,layout:"layout/main-layout"});
  
  
  })
  //halman about
  app.get('/about', (req, res) => {
    res.render("about",
        
    {layout:"layout/main-layout",title:"ini halaman about"});
  })
//halaman contact
app.get('/contact', async(req, res) => {
  
    // contact.find().then((contact)=>{res.send(contact)})
     const contacts= await Contact.find();
    res.render("contact",{layout:"layout/main-layout",title:"ini halaman contact",contacts,msg:req.flash("msg")});
  })

  //form tambah contact
app.get("/contact/add",(req,res)=>{
  res.render("add-contact",{title:"ini halaman tambah contact",layout:"layout/main-layout"})
})
//proses kirim tambah data ke halaman contact
app.post("/contact",[
  body("nama").custom(async(value)=>{
    const duplikat =await Contact.findOne({nama:value})
    if (duplikat) {
      throw new Error("nama kontak sudah digunakan")
    }
    return true
  }),
  check("nohp","no tidak valid").isMobilePhone('id-ID'),
  check('email',"email tidak valid").isEmail()],(req,res)=>{
 
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
  res.render("add-contact",{title:"ini halaman contact",layout:"layout/main-layout",errors:errors.array()})
  }else{
 Contact.insertMany(req.body,(error,result)=>{
   //kirimkan flash msg
   req.flash("msg"," kontak berhasil ditambahkan")
   res.redirect("/contact")
 })

  }
 
})
//proses delete contact
// app.get('/contact/delete/:nama', async(req,res)=>{
//   const contact = await Contact.findOne({ nama: req.params.nama})
//   //jika kontak tidak ada
//   if (!contact) {
//   res.status(404);
//    res.send(" <h1> 404 </h1>")
//   } else{
// Contact.deleteOne({nama:req.params.nama}).then((result)=>{
//   req.flash("msg"," kontak berhasil dihapus")
// res.redirect('/contact')
// })
//   }})
app.delete("/contact",(req,res)=>{
  Contact.deleteOne({nama:req.body.nama}).then((result)=>{
      req.flash("msg"," kontak berhasil dihapus")
    res.redirect('/contact')
    })
})

//form ubah kontak
app.get("/contact/edit/:nama",async(req,res)=>{
  const contact = await Contact.findOne({nama:req.params.nama})
  res.render("edit-contact",{title:"ini halaman edit contact",layout:"layout/main-layout",contact})
})
//proses update kontak
app.put("/contact",[
  body("nama").custom(async(value,{req})=>{
    const duplikat = await Contact.findOne({nama:value})
    if (value !==req.body.oldname && duplikat) {
      throw new Error("nama kontak sudah digunakan")
    }
    return true
  }),
  check("nohp","no tidak valid").isMobilePhone('id-ID'),
  check('email',"email tidak valid").isEmail()],(req,res)=>{
 
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
  res.render("edit-contact",{title:"ini hedit contact",layout:"layout/main-layout",errors:errors.array(),contact:req.body})
  }else{
    
  Contact.updateOne(
    {ObjectID:req.body._id},
    {
      $set:{
        nama:req.body.nama,
        email:req.body.email,
        nohp:req.body.nohp
      }
    }
    ).then((result)=>{

      //kirimkan flash msg
      req.flash("msg"," kontak berhasil diubah")
      res.redirect("/contact")
    })
 }
 
})

  //form detailcontact
app.get('/contact/:nama', async(req, res) => {
    const contact=await Contact.findOne({nama:req.params.nama})
    res.render("detail",{layout:"layout/main-layout",title:"ini halaman detail",contact});
   })


app.listen(port,()=>{
console.log(`mongo contact app| listening at http://localhost:${port}`)
})