// const { Db } = require("mongodb");
var db=require('../config/connection')
var productCollections=require('../config/collections')
var objectId=require('mongodb').ObjectID
module.exports={

    addProduct:(product,callback)=>{

        db.get().collection('product').insertOne(product).then((data)=>{
            
            callback(data.ops[0]._id)
        })
    },

    getAllProducts:()=>{
        return new Promise(async(resolve,reject)=>{
           let products=await db.get().collection(productCollections.PRODUCT_COLLECTIONS).find().toArray()
           resolve(products)
        });
    },

    deleteProduct:(proId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(productCollections.PRODUCT_COLLECTIONS).removeOne({_id:objectId(proId)}).then((response)=>{// for take this _id we need a new module of mongodb (require(mongodb).ObjectId)
                resolve(response)// if we need _id of deleted item that will come inside function of then and can be passed to resolve and get that in anywhere
            })
        })
    },

    getProductDetails:(proId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(productCollections.PRODUCT_COLLECTIONS).findOne({_id:objectId(proId)}).then((product)=>{
                resolve(product)
            })
        })
    },

    updateProduct:(proId,proDetails)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(productCollections.PRODUCT_COLLECTIONS)
            .updateOne({_id:objectId(proId)},{
                $set:{
                    Name:proDetails.Name,
                    Category: proDetails.Category,
                    Price:proDetails.Price,
                    Description: proDetails.Description
                }
            }).then((response)=>{
                resolve()
            })
        })
    }



}