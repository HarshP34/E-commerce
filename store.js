if(document.readyState=='loading')
{
  document.addEventListener('DOMContentLoaded',ready)
}
else{
  ready();
}


function ready()
{
const container=document.getElementById('container');
const AddToCartButtons=document.getElementsByClassName(' shop-item-button');
for(var i=0;i<AddToCartButtons.length;i++)
{
  var button=AddToCartButtons[i];
button.addEventListener('click',addToCartClicked);
}

const removebtn=document.getElementsByClassName('btn-danger');
for(var i=0;i<removebtn.length;i++)
{
  var button=removebtn[i];
  button.addEventListener('click',removeCartItem)
}

const purchasebtn=document.getElementsByClassName('btn-purchase')[0];
purchasebtn.addEventListener('click',purchaseClicked);

const quantityInputs=document.getElementsByClassName('cart-quantity-input');
 for(var i=0;i<quantityInputs.length;i++)
 {
  var input=quantityInputs[i];
  input.addEventListener('change',quantityChanged);
 }

 const openCartbtn=document.getElementById('open');
 openCartbtn.addEventListener('click',openCart);
 const cartbtn=document.getElementById('cart-button');
 cartbtn.addEventListener('click',openCart);
 
 const closeCartbtn=document.getElementById('close');
 closeCartbtn.addEventListener('click',closeCart);
const popup=document.getElementById('popup-container')
 function openCart()
 {
    popup.classList.add('active');
 }

 function closeCart()
 {
  popup.classList.remove('active');
 }

function removeCartItem(event)
{
  var buttonclicked=event.target
  buttonclicked.parentElement.parentElement.remove();
  updateCartTotal();
}

function addToCartClicked(e)
{
  var button=e.target;
  var shopItem=button.parentElement.parentElement;
  var title=shopItem.getElementsByClassName('shop-item-title')[0].innerText;
  var price=shopItem.getElementsByClassName('shop-item-price')[0].innerText;
  var imageSrc=shopItem.getElementsByClassName('shop-item-image')[0].src;
  addItemToCart(title,price,imageSrc);
  updateCartTotal();
  var notifi=document.createElement('div');
  notifi.innerText=`${title} is added to cart`;
  container.appendChild(notifi);
  notifi.classList.add('toast');
  setTimeout(()=>{
   notifi.remove();
  },5000)

}

function quantityChanged(event)
{
  var input=event.target;
  if(isNaN(input.value) || input.value<=0)
  {
    input.value=1;
  }
  updateCartTotal();
}

function updateCartTotal()
{
  var cartItemContainer=document.getElementsByClassName('cart-items')[0]
 
  var cartRows=cartItemContainer.getElementsByClassName('cart-row')
   var total=0;
  for(var i=0;i<cartRows.length;i++)
  {
    var cartRow=cartRows[i];
    var priceElement=cartRow.getElementsByClassName('cart-price')[0]
    var quantityElement=cartRow.getElementsByClassName('cart-quantity-input')[0];
    var price=parseFloat(priceElement.innerText.replace('$',''));
    var quantity=quantityElement.value;
    total=total+(price*quantity);
  }
  total=Math.round(total*100)/100;
  document.getElementsByClassName('cart-total-price')[0].innerText=`$${total}`;
}

function addItemToCart(title,price,imageSrc)
{
  var cartRow=document.createElement('div');
  cartRow.classList.add('cart-row');
  var cartItems=document.getElementsByClassName('cart-items')[0];
  var cartItemNames=cartItems.getElementsByClassName('cart-item-title');
  for(var i=0;i<cartItemNames.length;i++)
  {
    if(cartItemNames[i].innerText == title)
    {
      alert(`${title} is already added to the cart`);
      return
    }
  }
  var cartRowContent=` <div class="cart-item cart-column">
      <img class="cart-item-image" src=${imageSrc} width="100" height="100">
      <span class="cart-item-title">${title}</span>
  </div>
  <span class="cart-price cart-column">${price}</span>
  <div class="cart-quantity cart-column">
      <input class="cart-quantity-input" type="number" value="1">
      <button class="btn btn-danger" type="button">REMOVE</button>
  </div>
</div>`

  cartRow.innerHTML=cartRowContent;
  cartItems.append(cartRow);
  cartRow.getElementsByClassName('btn-danger')[0].addEventListener('click',removeCartItem);
  cartRow.getElementsByClassName('cart-quantity-input')[0].addEventListener('change',quantityChanged);
}

function purchaseClicked()
{
  alert('Thank You For Your Purchase');
 var cartItems=document.getElementsByClassName('cart-items')[0];
 while(cartItems.hasChildNodes())
 {
  cartItems.removeChild(cartItems.firstChild);
 }
 updateCartTotal();
}

}


