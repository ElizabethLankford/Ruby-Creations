
const toggleBtn = document.querySelector(".toggle-btn")
const navbarLinks = document.querySelector(".navbar-links")
const navLinks = document.querySelectorAll(".navlink")
const cartIcon = document.getElementById("cart-icon")
const cartContainer = document.getElementById("Cart")
const closeCartBtn = document.querySelector(".close-cart-btn")

const removeAllBtn = document.querySelector(".action-rmv")
const addItemBtns = document.querySelectorAll(".add-btn")
const likeBtns = document.querySelectorAll(".like-item")

// NAVIGATION FUNCTIONS FOR RESPONSIVENESS 
toggleBtn.addEventListener("click", () => {
    navbarLinks.classList.toggle('active')
})
closeCartBtn.addEventListener("click", () => {
    cartContainer.style.display = "none"
})
cartIcon.addEventListener("click", () => {
    cartContainer.style.display = "inline"

})

navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      navbarLinks.classList.toggle("active");
      console.log("linked")
    });
  });

removeAllBtn.addEventListener("click",() => {
    localStorage.clear()
    renderCart()
})
// FETCH PRODUCT DATA FROM JSON FILE
  fetch("products.json")
  .then(function(response){
    return response.json()
  })
  .then(function(data){
    localStorage.setItem("products", JSON.stringify(data))
    if(!localStorage.getItem("cart")){
        localStorage.setItem("cart", "[]")
    }
})
  // SETTING GLOBAL VARIABLES DO I CAN ACCESS THEM FROM INSIDE FUNCTIONS 

  let products =JSON.parse(localStorage.getItem("products"))
  let cart = JSON.parse(localStorage.getItem("cart"))

  // ADDING THE PRODUCT TO THE CART

  function addItemToCart(productId){
    let product = products.find(function(product){
        return product.id == productId
    })
    if(cart.length == 0){
        cart.push(product)
        
    } else {
        let res = cart.find(element => element.id == productId)
        if(res === undefined){
            cart.push(product)
        }
    }
    localStorage.setItem("cart", JSON.stringify(cart))
    renderCart()
  }

  //REMOVE A PRODUCT FROM THE CART

  function removeItemFromCart(productId){
    cart = cart.filter(item => item.id != productId)
    localStorage.setItem("cart", JSON.stringify(cart))
    renderCart()

  }

  //UPDATE THE PRODUCT QUANTITY
  function updateQuantity(productId, quantity){
    for(let product of cart){
        if(product.id == productId){
            product.quantity = quantity
        }
    }
    localStorage.setItem("cart", JSON.stringify(cart))
  }

  //GET THE CART TOTAL SUM

  function getTotal(){
    let temp = cart.map(function(item){
        return parseInt(item.price)
    });
    let sum = temp.reduce(function(prev, next){
        return prev + next
    },0);
    console.log(sum)
  }

// ITERATE THROUGH PRODUCTS DATA AND RETURN ALL 

  function listProductsToPage(){
   let pageHtml =''
    for (let item of products){
        pageHtml +=  `
        <div class="item">
        <img class="item-img" width="150px" src="${item.image}"/>
        <div class="item-info">
            <h5 class="item-title">${item.name}</h5>
            <p>Price: $${item.price}</p>
            <div class="item-btn-container">
                <button data-add="${item.id}" class="add-btn">Add to cart</button>
                <button data-like="${item.id}" class="like-item">like</button>
            </div>
        </div>
    </div>
        `
    }
   return pageHtml
  }
  //LIST PRODUCTS IN CART

  function itemsInCart(){

    let cartHtml =''
    for(let item of cart){
        cartHtml += `
        <div class="cart-item">
        <div class="cart-item-img-container">
            <img class="cart-img" height="120px" src="${item.image}"/>
        </div>
        <div class="cart-item-about">
            <h4 class="cart-item-title">${item.name}</h4>
            <p class="cart-subtitle">Quantity: ${item.quantity}</p>
        </div>
        <div class="cart-item-price">
            <div class="amount">$${item.price}</div>
            <button data-remove="${item.id}" class="remove">Remove</button>
        </div>
    </div>
        `
    }
    return cartHtml;
  }
  //LOAD DATA TO DOM
function render(){
    document.getElementById("item-container").innerHTML =listProductsToPage()
}
function renderCart(){
    document.querySelector(".cart-dom").innerHTML = itemsInCart()
}
// INTERACT WITH DOM WITH EVENTS ITEM TO CART FROM ADD BTN 

 document.addEventListener("click", (e) => {

     if(e.target.dataset.add){
         addItemToCart(e.target.dataset.add)

     }
     else if(e.target.dataset.remove){
         removeItemFromCart(e.target.dataset.remove)
         console.log("remove", e.target.dataset.remove)
     }

 })

render()
renderCart()

