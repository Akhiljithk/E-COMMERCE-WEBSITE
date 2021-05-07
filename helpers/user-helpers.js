var db=require('../config/connection')
var Collections=require('../config/collections')
const bcrypt=require('bcrypt')
const collections = require('../config/collections')
var objectId=require('mongodb').ObjectID
const { CART_COLLECTIONS } = require('../config/collections')
module.exports={
    doSignup:(userData)=>{
        return new Promise(async(resolve,reject)=>{
            userData.Password=await bcrypt.hash(userData.Password,10)
            db.get().collection(Collections.USER_COLLECTIONS).insertOne(userData).then((data)=>{  //error chance line
                resolve(data.ops[0])
            })
        })
    },

    doLogin:(userData)=>{
        return new Promise(async(resolve,reject)=>{
            let userStatus=false
            let response={}
            let user = await db.get().collection(collections.USER_COLLECTIONS).findOne({Email:userData.Email})
            if(user){
                bcrypt.compare(userData.Password,user.Password).then((status)=>{
                    if(status){
                        console.log("login success");
                        response.user = user // data base datas
                        response.status=true
                        resolve(response)
                    }else{
                        console.log("login faild")
                        resolve({status:false})
                    }
                })
            }else{
                console.log("login faild")
                resolve({status:false})
            }
        })
    },

    addToCart:(proId,userId)=>{
        return new Promise(async(resolve,reject)=>{
            let userCart=await db.get().collection(collections.CART_COLLECTIONS).findOne({user:objectId(userId)}) //checking if user cart is already there by comparing id , if not then we'll create a new colletion for this user
            if(userCart){
                db.get().collection(collections.CART_COLLECTIONS)
                .updateOne({user:objectId(userId)},
                {
                    
                    $push:{products:objectId(proId)}
                    
                }).then((response)=>{
                    resolve()
                })
            }else{
                let cartObj={
                    user: objectId(userId),
                    products:[objectId(proId)]
                }
                db.get().collection(collections.CART_COLLECTIONS).insertOne(cartObj).then((response)=>{
                    resolve(response)
                })
            }
        })
    },

    getCartProduct:(userId)=>{
        return new Promise(async(resolve,reject)=>{
          let cartItems=await db.get().collection(collections.CART_COLLECTIONS).aggregate([
              {
                  $match:{user:objectId(userId)}
              },
              {
                  $lookup:{
                      from:collections.PRODUCT_COLLECTIONS,
                      let:{prodList:'$products'},
                      pipeline:[
                          {
                              $match:{
                                  $expr:{
                                      $in:['$_id','$$prodList']
                                  }
                              }
                          }
                      ],
                      as:'cartItems'
                  }
              }
          ]) .toArray()
          resolve(cartItems[0].cartItems)
        })
    },


    getCartCount:(userId)=>{
        return new Promise(async (resolve,reject)=>{
            let count=0
            let cart=await db.get().collection(Collections.CART_COLLECTIONS).findOne({user:objectId(userId)})
            if(cart){
                count=cart.products.length
            }
            resolve(count)
        })
    }


}