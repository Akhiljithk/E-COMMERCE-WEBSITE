var express = require('express');
var router = express.Router();
var productHelper=require('../helpers/product-helpers');
/* GET users listing. */
router.get('/', function(req, res, next) {

  productHelper.getAllProducts().then((products)=>{

    res.render('admin/view-products', {admin:true, products});

  })
 
 
});

router.get('/add-product',function(req,res){
  res.render('admin/add-product', );
});

router.post('/add-product',(req,res)=>{

  productHelper.addProduct(req.body,(id)=>{
    let image= req.files.Image
    image.mv('./public/product-images/'+id+'.jpg',(err,done)=>{
       if(!err){
         res.render('admin/add-product')
       }
       else{
         console.log(err)
       }
    })
    res.render('admin/add-product');
 });
});

router.get('/delete-product/',(req,res)=>{
  let proId=req.query.id
  productHelper.deleteProduct(proId).then((response)=>{
    res.redirect('/admin/') // i dont know why /admin/ i thought it shd be /admin/view-product
  })
})

router.get('/edit-product/',async (req,res)=>{
  let proId=req.query.id
  let product=await productHelper.getProductDetails(proId)
  res.render('admin/edit-product',{product})
})

router.post('/edit-product/:id',(req,res)=>{
  let proId=req.params.id
  productHelper.updateProduct(proId,req.body).then(()=>{
    res.redirect('/admin') // dont understand y only /admin
    if(req.files.Image){
      let image = req.files.Image
      image.mv('./public/product-images/'+proId+'.jpg')
    }
  })
})

module.exports = router;
