const express = require('express');
const router = express.Router();

// object model
let Object = require('../models/object');

//user model
let User = require('../models/user');


//add route
router.get('/add', ensureAuthenticated, function(req, res){
    res.render('add_object', {
      title:'Add Object'
    });
});

//add submit POST route
router.post('/add', function(req, res){
req.checkBody('title','Title is required').noteEmpty();
//req.checkBody('author','Author is required').noteEmpty();
req.checkBody('body','Body is required').noteEmpty();

//get errors
let error=  req.validationErrors();

if(error){
  res.render('add_object', {
    title: 'Add Object',
    errors:errors
  });
}else{
  let object = new Object();
  object.title = req.body.title;
  object.author = req.user._id;
  object.body = req.body.body;

  object.save(function(err){
    if(err){
      console.log(err);
      return;
    }else{
      req.flash('succes','Object Added');
      res.redirect('/');
    }
  });
}
});

//load edit form
router.get('/edit/:id', ensureAuthenticated, function(req, res){
  Object.findById(req.params.id, function(err,object){
    if(object.author != req.user._id){
      req.flash('danger', 'not authorized');
      res.redirect('/');
    }
    res.render('edit_object', {
      title:'Edit Object',
      object:object
    });
  });
});

//update submit POST route
router.post('/edit/:id', function(req, res){
  let object = {};
  object.title = req.body.title;
  object.author = req.body.author;
  object.body = req.body.body;

  let query = {_id:req.params.id}

  Object.update(query, object, function(err){
    if(err){
      console.log(err);
      return;
    }else{
      req.flash('success', 'Object Updated');
      res.redirect('/');
    }
  })
});

//delete Object
router.delete('/:id', function(req, res){
  if(!req.user._id){
    res.status(500).send();
  }

  let query = {_id:req.params.id}

  Object.findById(req.params.id, function(err, object){
    if(object.author != req.user._id){
      res.status(500).send();
    } else{
      Object.remove(query, function(err){
        if(err){
          console.log(err);
        }
        res.send('success');
      });
    }
  });
});

//get single Objects
router.get('/:id', function(req, res){
  Object.findById(req.params.id, function(err,object){
    User.findById(object.author, function(err, user){
      res.render('object', {
        object:object,
        author: User.name
      });
    });
  });
});

//access control
function ensureAuthenticated(req, res, next){
  if(req.isAuthenticated()){
    return next();
  } else {
    req.flash('danger', 'please login');
    res.redirect('/users/login');
  }
}

module.exports = router;
