const Product = require('../models/product');
const Cart=require('../models/cart');
const Order=require('../models/order');
const User=require('../models/user');

exports.getProducts = (req, res, next) => {
  const page=+req.query.page || 1;
  Product.findAll({offset:(page-1)*ITEMS_PER_PAGE,limit:ITEMS_PER_PAGE}).then(products=>{
   res.json(products);
    })
.catch(err=>console.log(err));
};


exports.getProduct=(req,res,next)=>{
  const prodId=req.params.productId;
  Product.findAll({where:{id:prodId}})
  .then(products=>{
    res.render('shop/product-detail',{
      product: products[0],
      pageTitle:products[0].title,
      path:'/products'
  })
  })
  .catch(err=>console.log(err));
}


const ITEMS_PER_PAGE=2;
exports.getIndex = (req, res, next) => {
  const page=+req.query.page||1;
  let totalItems;
  Product.findAll()
  .then((numProducts)=>{
    totalItems=numProducts.length;
return   Product.findAll({offset:(page-1)*ITEMS_PER_PAGE,limit:ITEMS_PER_PAGE})
  }).then(products=>{
    res.render('shop/index',{
      prods: products,
      pageTitle: 'Shop',
      path: '/',
      totalProducts:totalItems,
      hasNextPage:ITEMS_PER_PAGE*page<totalItems,
      hasPreviousPage:page>1,
      nextPage:page+1,
      previousPage:page-1,
      lastPage:Math.ceil(totalItems/ITEMS_PER_PAGE)
    
    });
  })
  .catch(err=>console.log(err));
};

exports.getCart = (req, res, next) => {
  req.user.getCart()
  .then(cart=>{
    return cart.getProducts().then(products=>{
      res.json(products);
      // res.render('shop/cart', {
      //   path: '/cart',
      //   pageTitle: 'Your Cart',
      //   products:products
      // });
    }).catch(err=>console.log(err))
  })
  .catch(err=>console.log(err))
};

exports.postCart=(req,res,next)=>{

  const prodId=req.body.productId;
  let fetchCart;
  let newQuantity=1;
req.user
.getCart()
.then(cart=>{
  fetchCart=cart;
  return cart.getProducts({where:{id:prodId}})
})
.then(products=>{
  let product;
  if(products.length>0)
  {
    product=products[0];
  }
  if(product)
  {
let oldQuantity=product.cartItem.quantity;
newQuantity=oldQuantity+1;
return product;
}
  return Product.findByPk(prodId)
})
.then((product)=>{
  return fetchCart
  .addProduct(product,{through:{quantity:newQuantity}})
 
}).then(()=>{
  res.status(200).json({success:true ,message:'Successfully Added'})
})
.catch(()=>{res.status(500).json({success:false ,message:'Error Occured'})});
}


exports.deleteCartItem=(req,res,next)=>{
  const prodId=req.body.productId;
  req.user.getCart()
  .then(cart=>{
    return cart.getProducts({where :{id:prodId}});
  })
  .then((products)=>{
    const product=products[0];
    return product.cartItem.destroy(); 
  })
  .then((result)=>{res.redirect('/cart');})
  .catch(err=>{console.log(err)});
}


exports.postOrder=(req,res,next)=>{
  let fetchCart;
  req.user
  .getCart()
  .then(cart=>{
    fetchCart=cart;
    return cart.getProducts();
  }).then(products=>{
    req.user.createOrder().then(order=>{
 return order.addProduct(products.map(product=>{
    product.orderDetail={quantity:product.cartItem.quantity};
    return product;
  }))
    }).catch(err=>console.log(err))
  }).then((result)=>{
     return fetchCart.setProducts(null);
  }).then((result)=>{
    res.status(200).json({success:true ,message:'Successfully Added'})
  }).catch(()=>{res.status(500).json({success:false ,message:'Error Occured'})})
}

exports.getOrders = (req, res, next) => {
 req.user.getOrders({include:['products']})
 .then(orders=>{
  res.json(orders);
    })
.catch(err=>console.log(err));

  // req.user.getOrders().then(data=>{
  //  data[1].getProducts().then(products=>{
  //   res.json(products);
  //  })
  // })
  // .catch(err=>console.log(err))
  // res.render('shop/orders', {
  //   path: '/orders',
  //   pageTitle: 'Your Orders'
  // });
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout'
  });
};
