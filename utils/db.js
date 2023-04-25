const mongoose=require("mongoose")
mongoose.connect('mongodb://127.0.0.1:27017/wpu',{
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useCreateIndex:true,
});


// //menambah 1 data
// const contact1=new contact({
// nama:"saraa",
// nohp:"08754522",
// email:"saran@gmail.com"
// })
// //simpan data
// contact1.save().then((contact)=>{console.log(contact)})