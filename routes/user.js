var express = require('express');
const session = require('express-session');
var router = express.Router();
var productHelper=require('../helpers/product-helpers');
var userHelper=require('../helpers/user-helpers');

const verifyLogin=(req,res,next)=>{
  if(req.session.loggedIn){
    next()
  }
  else{
   res.render('user/login') 
  }};
  
/* GET home page. */
router.get('/', async function(req, res, next) {
  let user=req.session.user
  let cartCount=null
  if(req.session.user){
    cartCount=await userHelper.getCartCount(user._id)
    console.log("???????????!!!!!!!!@@@@@@@ user.js",cartCount)// error cart count not get
  }
  productHelper.getAllProducts().then((products)=>{
    res.render('user/view-products', { products,user, admin:false,cartCount});
  })

  
});

router.get('/login', (req,res)=>{
  if(req.session.loggedIn){
    res.redirect('/')// back didnt work
  }else{
    res.render('user/login',{'loginErr':req.session.loginErr})
  }
});

router.post('/login',(req,res)=>{
  userHelper.doLogin(req.body).then((response)=>{
    if(response.status){
      req.session.loggedIn=true
      req.session.user=response.user    
      res.redirect('/')
    }else{
      req.session.loginErr=true 
      res.redirect('/login')
    }
  })
});

router.get('/signup', (req,res)=>{
  res.render('user/signup')
});

router.post('/signup', (req,res)=>{
  userHelper.doSignup(req.body).then((response)=>{
    // console.log(response) //data after hashing and storing in database it will be at data.ops[0], that ops will come in this then function
      req.session.loggedIn=true
      req.session.user=response.user    
      res.redirect('/')
  })
  res.render('user/login')
}); 

router.get('/logout',(req,res)=>{
 req.session.destroy()
 res.redirect('/')
})

router.get('/cart',verifyLogin, async (req,res)=>{
  let products= await userHelper.getCartProduct(req.session.user._id)
 res.render('user/cart',{products,user:req.session.user})
})

router.get('/add-to-cart/:id',verifyLogin,(req,res)=>{
  userHelper.addToCart(req.params.id,req.session.user._id).then(()=>{
    res.json({status:true})
    // res.redirect('/') ajax used so dont redirect
  })
})

module.exports = router;
