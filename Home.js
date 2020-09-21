const express = require('express');
const app = express();
const port = 8900;
const mongo = require('mongodb');
const MongoClint = mongo.MongoClient;
const mongourl = "mongodb://localhost:27017";
let db;
let coll_name = "restaurant"  //This contain data of restaurantdata.
const cors = require('cors');
const bodyParser = require('body-Parser');
app.use(cors());


//Sample output
app.get('/',(req,res) =>{
    res.status(200).send("This is homepage")
    
})

//bodyParser...
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())


//All the Restaurants available in db
app.get('/allrestaurants',(req,res) => {
    db.collection('restaurant').find().toArray((err,result) =>{
        if(err) throw err;
        res.send(result)
    })
})

app.get('/restauranthome',(req,res) => {
    var query = {}
    if(req.query.city && req.query.mealtype){
        query={city:req.query.city,"type.mealtype": req.query.mealtype}
    }
    else if(req.query.city){
        query = {city:req.query.city} 
    }else if(req.query.mealtype){
        query={"type.mealtype": req.query.mealtype}
    }
    db.collection('restaurant').find(query).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})

app.get('/restaurantdetails/:id',(req,res) => {
    console.log(req.params.id)
    var query = {_id:req.params.id}
    db.collection('restaurant').find(query).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})

app.get('/restaurantlist/:city/:mealtype',(req,res) => {
    var query = {}
    var sort = {cost:1}
    if(req.query.cuisine&&req.query.hcost && req.query.lcost&&req.query.sort){
        query = {city:req.params.city,"type.mealtype": req.params.mealtype,"Cuisine.cuisine":req.query.cuisine,cost:{$gt:parseInt(req.query.lcost),$lt:parseInt(req.query.hcost)}}
        sort={cost:parseInt(req.query.sort)} 
    }
    else if(req.query.cuisine&&req.query.lcost && req.query.hcost){
        query = {city:req.params.city,"type.mealtype": req.params.mealtype,"Cuisine.cuisine":req.query.cuisine,cost:{$gt:parseInt(req.query.lcost),$lt:parseInt(req.query.hcost)}}
    }
    else if(req.query.cuisine&&req.query.sort){
        query = {city:req.params.city,"type.mealtype": req.params.mealtype,"Cuisine.cuisine":req.query.cuisine}
        sort={cost:parseInt(req.query.sort)} 
    }
    else if(req.query.lcost && req.query.hcost&&req.query.sort){
        query = {city:req.params.city,"type.mealtype": req.params.mealtype,cost:{$gt:parseInt(req.query.lcost),$lt:parseInt(req.query.hcost)}}
        sort={cost:parseInt(req.query.sort)} 
    }
    else if(req.query.cuisine){
        query = {city:req.params.city,"type.mealtype": req.params.mealtype,"Cuisine.cuisine":req.query.cuisine} 
    }else if(req.query.lcost && req.query.hcost){
        query={city:req.params.city,"type.mealtype": req.params.mealtype,cost:{$gt:parseInt(req.query.lcost),$lt:parseInt(req.query.hcost)}}
    }else if(req.query.sort){
        query={city:req.params.city,"type.mealtype": req.params.mealtype}
        sort={cost:parseInt(req.query.sort)}
    }else{
        query = {city:req.params.city,"type.mealtype": req.params.mealtype}
        sort = {cost:1}
    }
    db.collection('restaurant').find(query).sort(sort).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})

//***********Filtering restaurant data on the basis of city name************//
app.get('/Pune',(req,res) => {
    query={"city_name":"Pune"}
    db.collection(coll_name).find(query).toArray((err,result) =>{
        if(err) throw err;
        res.send(result)
    })
})

//city data
app.get('/location',(req,res) => {
    db.collection('city').find().toArray((err,result) =>{
        if(err) throw err;
        res.send(result)
    })
})

// Cuisine data
app.get('/cuisines',(req,res) => {
    db.collection('cuisine').find().toArray((err,result) =>{
        if(err) throw err;
        res.send(result)
    })
})

//mealtype
app.get('/mealtype',(req,res) => {
    db.collection('mealtype').find().toArray((err,result) =>{
        if(err) throw err;
        res.send(result)
    })
})


//Place order POST call
app.post('/placeOrder',(req,res)=>{
    console.log(req.body);
    var userData = {
        _id: req.body.order_id,
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        address: req.body.address,
        rest_id: req.body.rest_id,
        person: req.body.person
        
    }
    db.collection('orders').insert(userData,(err,result) => {
        if(err){
            throw err
        }else{
            res.send('Order Placed')
        }
    });
});

//Order list
app.get('/orderlist',(req,res) => {
    db.collection('orders').find().toArray((err,result) =>{
        if(err) throw err;
        res.send(result)
    })
})


//Database connectivity
MongoClint.connect(mongourl,(err,client) => {
    if(err) console.log(err);
    db = client.db('project')             //collection name and db name is same.
    app.listen(port,(err) => {
        if(err) throw err;
        console.log(`Server is running on port ${port}`)
    })
})


