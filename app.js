const express = require('express');
const app = express();
const BodyParser = require('body-parser');
const mongoose = require('mongoose');
const _=require("lodash")
mongoose.connect('mongodb+srv://Rif:dolkadoz40@mflix.n3dih.mongodb.net/todolistdb',{useNewUrlParser: true, useUnifiedTopology: true});
app.use(BodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set('view engine','ejs');
app.listen(process.env.PORT || 3000,function(){
    console.log("server connected")
})
var worklist=[];
var li = "";

//database section
const itemsSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,'name must be provided']
    }
});
const item=mongoose.model('item',itemsSchema);

const listsSchema = new mongoose.Schema({
   name:String,
   items:[itemsSchema]    
});

const newlist=mongoose.model('list',listsSchema);

const item1=new item({
    name:"make project1"    
});

const item2=new item({
name:"make project2"    
});

const item3=new item({
name:"make project3"    
});

const entries=[item1,item2,item3];

//item.deleteMany(function(err){
//    if(err){
//        console.log('error is: '+err)
//    }
//})

//database section end


const date = new Date();
var dateformat="";
app.get("/",function(req,res){
//    switch(date.getDay()){
//        case 0: day="Sunday";
//        break;
//            
//        case 1: day="Monday"
//        break; 
//            
//        case 2: day="Tuesday"
//        break;    
//            
//        case 3: day="Wednesday"
//        break;    
//            
//        case 4: day="Thursday"
//        break;    
//        
//        case 5: day="Friday"
//        break;    
//            
//        case 6: day="Saturday"
//        break;
//            
//        default: day=""    
//    }
    var options={day:'numeric',month:'long',weekday:'long'}
//    var dateformat = new Intl.DateTimeFormat('en-US',options).format(date);
    dateformat = date.toLocaleDateString('en-US',options);
    
    
    item.find(function(err,items){
     if(err){
         console.log(err);
     }else{
//         console.log(items);
         if(items.length===0){
          item.insertMany(entries,function(error){
          if(error){
              console.log(error)
              }
           });     
          res.redirect("/");
         }else{
           res.render("list",{titlename:dateformat,lista:items})     
         }

     }  

     })
    
})
//app.get("/work",function(req,res){
//    res.render("list",{titlename:"Work List",lista:worklist})
//});


app.post("/:page",function(req,res){
     li = req.body.li;
     const page= req.params.page;
    
    const itemone = new item({
        name:li
    }); 
//    item.insertMany([itemone],function(err){
//        console.log(err);
//    }) ; 
    if(page==dateformat){
        itemone.save();
        res.redirect('/');
    }else{
        newlist.findOne({name:page},function(err,list){
        list.items.push(itemone);
        list.save();
    });    
    res.redirect("/"+page);
    }
    
        
    
});

app.post("/delete/:page",function(req,res){
    const checkvalue=req.body.checkbox;
    const page=req.params.page;
    if(page==dateformat){
        item.findByIdAndRemove(checkvalue,function(err){
        if(err){console.log("err in line 136: "+err)}else{
        res.redirect("/")
        }
        })}else{
        newlist.findOneAndUpdate({name:page},{$pull:{items:{_id:checkvalue}}},function(err){
        if(!err){res.redirect("/"+page)}
         })
        } 
    
    
//    
//    })
    console.log(checkvalue)
})
app.get("/:listname",function(req,res){
    const listname=_.capitalize(req.params.listname);
    newlist.findOne({name:listname},function(err,newroute){
        if(newroute){
//            console.log("list already exists");
            res.render("list",{titlename:newroute.name,lista:newroute.items})
        }else{
           
        const newroute= new newlist({
        name:listname,
        items:entries
         });
        newroute.save();
        res.redirect("/"+listname);  
        }
    });
    
    
})