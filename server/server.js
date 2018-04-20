
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const {Dog} = require('./models/dog.js');
const hbs = require(`hbs`);
const path = require(`path`);
const _ = require(`lodash`);
const methodOverride = require(`method-override`);
const app = express();

//hbs set up
app.set('view engine','hbs');
app.set('views',path.join(__dirname,'../app/views'));
hbs.registerPartials(path.join(path.join(__dirname,'../app/views/partials')));
//setup
const port = process.env.PORT || 3000;
mongoose.Promise = global.Promise;
const database = process.env.MONGODB_URI || "mongodb://localhost:27017/Doglist"
mongoose.connect(database)
  .then(() => {
    console.log('connected to database');
  }).catch(() => {
    console.log('unable to connect to database');
  })
//-------------------middle ware---------------------
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride(`_method`));
app.use(express.static(path.join(__dirname,`../public`)))
app.get('/', (req, res) => {
  res.redirect(`/dogs/home`)
  // res.send("GET /");
})

//-------------------middle ware---------------------

app.get(`/dogs`,(req,res)=>{

  Dog.find()
  .then(dogs=>{
    res.send(dogs);
  })
  .catch(e=>{
    res.status(404).send();
  })
})

app.get(`/dogs/new`,(req,res)=>{
  res.render(`./dogs/new`);
});
app.get(`/dogs/home`,(req,res)=>{
  Dog.find()
  .then((dogs) => {
    res.render(`./dogs/home`,{dogs})
  })
})




app.post('/dogs', (req, res) => {
  let name = req.body.name;
  let age = req.body.age;
  let picture = req.body.picture;
  let personality = req.body.personality;
  let description = req.body.description;
  if(!req.body.name||!req.body.age){
    console.log("bad request");
    res.status(400).send();
  }else{
    const dog = new Dog({
      name: req.body.name,
      age: req.body.age,
      picture: req.body.picture,
      personality: req.body.personality,
      description: req.body.description
    })
    dog.save()
    .then(dog => {
      res.redirect('/dogs/home');
    })
    .catch(e => {
      res.status(400).send();
    })}
  })


app.delete('/dogs/:id',(req,res)=>{
  const id = req.params.id;
  Dog.findByIdAndRemove(id)
    .then(Dogs => {
      res.redirect('home')
    }).catch (e => {
      res.status(404).send(e);
    })
  })

  app.patch('dogs/:id', (req, res) => {
    const id = req.params.id;
    const body = _.pick(req.body, ['name', 'age','description','personality','picture']);

    Dog.findByIdAndUpdate(id, {$set: body}, {new: true})
      .then(Dog => {
        if (!Dog) {
          res.status(404).send()
        } else {
          res.send(Dog);
        }

      }).catch(e => {
        res.status(404).send(e);
      })
  })



app.get('/dogs/:id',(req,res)=>{
    const id= req.params.id;
    console.log(id);
    Dog.findById(id)
    .then(dog=>{
      console.log(dog);
    res.render('./dogs/show.hbs',{dog});
  }).catch(e=>{
      res.status(404).send(e);
    })
})
app.listen(port, () => {
  console.log( `Listening on port ${port}`);
})




// const express = require('express');
// const bodyParser = require('body-parser');
// const mongoose = require('mongoose');
// const hbs = require('hbs');
// const path = require('path');
// const methodOverride = require('method-override');
// // const _ = require('lodash');
// const {Dog} = require('./models/dog.js')
//
//
// const app = express();
//
// //hbs setup
// app.set('view engine', 'hbs');
// app.set('views', path.join(__dirname, '../app/views'));
// hbs.registerPartials(path.join(__dirname, '../app/views/partials'))
//
// //setup
// const port = process.env.PORT || 3000;
// mongoose.Promise = global.Promise;
// const database = process.env.MONGODB_URI || "mongodb://localhost:27017/Doglist"
// mongoose.connect(database)
//   .then(() => {
//     console.log('connected to database');
//   }).catch(() => {
//     console.log('unable to connect to database');
//   })
//
// //middleware
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({extended: true}));
// app.use(methodOverride('_method'));
// app.use(express.static(path.join(__dirname, '../public')));
//
// app.get('/', (req, res) => {
//   res.redirect('/dogs');
// })
//
// app.get('/dogs', (req, res) => {
//   // Dog.find()
//   //   .then(dogs => {
//   //     res.send(dogs);
//   //   })
//   //   .catch(e => {
//   //     res.status(404).send();
//   //   })
//   res.render('/Users/palycs/Desktop/webdev/doglist/app/views/dogs/index.hbs');
// })
//
// app.get('/dogs/new', (req, res) => {
//     res.render('./dogs/new');
// })
//
//
//
// app.post('/dogs', (req, res) => {
//   if(!req.body.name|| !req.body.age) {
//     console.log('bad request');
//     res.status(400).send();
//   }
//   const dog = new Dog({
//     name: req.body.name,
//     age: req.body.age
//   })
//   dog.save()
//     .then(dog => {
//       res.redirect('/dogs');
//     })
//     .catch(e => {
//       res.status(400).send();
//     })
// })
//
// app.delete('/dogs/:id', (req, res) => {
//     console.log('hit delete route');
// })
//
// app.listen(port, () => {
//   console.log( `Listening on port ${port}`);
// })
