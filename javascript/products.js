/* @author: Kulasingham Ragulan */
// open cart modal
const cart = document.querySelector('#cart');
const cartModalOverlay = document.querySelector('.cart-modal-overlay');

cart.addEventListener('click', () => {
    if (cartModalOverlay.style.transform === 'translateX(-200%)') {
        cartModalOverlay.style.transform = 'translateX(0)';
    } else {
        cartModalOverlay.style.transform = 'translateX(-200%)';
    }
})

// close cart modal
const closeBtn = document.querySelector('#close-btn');

closeBtn.addEventListener('click', () => {
    cartModalOverlay.style.transform = 'translateX(-200%)';
});

cartModalOverlay.addEventListener('click', (e) => {
    if (e.target.classList.contains('cart-modal-overlay')) {
        cartModalOverlay.style.transform = 'translateX(-200%)'
    }
})


// add products to cart
const addToCart = document.getElementsByClassName('add-to-cart');
const productRow = document.getElementsByClassName('product-row');

for (var i = 0; i < addToCart.length; i++) {
    button = addToCart[i];
    button.addEventListener('click', addToCartClicked)
}

var tempArray = []

//load cart items agin, even after page refresh
function loadCartItems() {
    var productList = localStorage.getItem("products") ? JSON.parse(localStorage.getItem("products")) : [];

    if(productList.length > 0){
        document.getElementsByClassName('cart-quantity')[0].textContent = productList.length - 1
        for (var i = 0; i < productList.length - 1; i++) {
            tempArray.push(productList[i].id)
            addItemToCart(productList[i].price, productList[i].image, productList[i].id, productList[i].name, productList[i].quantity);
        }
    }
}
loadCartItems();

//get value of added item
function addToCartClicked(event) {
    button = event.target;
    var cartItem = button.parentElement;
    var price = cartItem.getElementsByClassName('product-price')[0].innerText;
    var name = cartItem.getElementsByClassName('product-name')[0].innerText;
    var id = name + button.id;
    tempArray.push(id)
    var imageSrc = cartItem.getElementsByClassName('product-image')[0].src;
    addItemToCart(price, imageSrc, id, name);
}

//dynamically display items in the cart list ("cartModalOverlay")
function addItemToCart(price, imageSrc, id, name, quantity) {
    var qty = quantity ? quantity : 1;
    var productRow = document.createElement('div');
    productRow.classList.add('product-row');
    var productRows = document.getElementsByClassName('product-rows')[0];
    var cartImage = document.getElementsByClassName('cart-image');

    for (var i = 0; i < cartImage.length; i++) {
        if (cartImage[i].src == imageSrc) {
            alert('This item has already been added to the cart')
            return;
        }
    }

    var cartRowItems = `
        <div class="product-row" id="${id}">
            <div style="text-align: center">
                <img class="cart-image" src="${imageSrc}" alt="">
                <span class="cart-product-name">${name}</span>
            </div>
            <span class="cart-price">${price}</span>
            <input class="product-quantity" type="number" value="${qty}">
            <button class="remove-btn">Remove</button>
        </div>
        
      `
    productRow.innerHTML = cartRowItems;
    productRows.append(productRow);
    productRow.getElementsByClassName('remove-btn')[0].addEventListener('click', removeItem)
    productRow.getElementsByClassName('product-quantity')[0].addEventListener('change', changeQuantity)
    updateCartPrice()
}


// Remove products from cart
const removeBtn = document.getElementsByClassName('remove-btn');

const clearBtn = document.querySelector('.clear-btn');
var clearAll = false;
var removeItemBtn = false;
clearBtn.addEventListener('click', ClearBtnClicked)

//close cart list ("cartModalOverlay")
function ClearBtnClicked() {
    clearAll = true;
    for (var i = 0; i < tempArray.length; i++) {
        document.getElementById(tempArray[i]).parentElement.remove();
    }
    updateCartPrice();
}

//add click event for remove button
for (var i = 0; i < removeBtn.length; i++) {
    button = removeBtn[i]
    button.addEventListener('click', removeItem)
}

//remove item from cart list
function removeItem(event) {
    removeItemBtn = true;
    btnClicked = event.target
    const index = tempArray.indexOf(btnClicked.parentElement.getAttribute("id"))
    if(index > -1){
        tempArray.splice(index, 1);
    }
    btnClicked.parentElement.parentElement.remove()
    updateCartPrice()
}

// update quantity input
var quantityInput = document.getElementsByClassName('product-quantity')[0];

//add change event for quantity input field
for (var i = 0; i < quantityInput; i++) {
    input = quantityInput[i]
    input.addEventListener('change', changeQuantity)
}

//change quantity for products
function changeQuantity(event) {
    var input = event.target
    if (isNaN(input.value) || input.value <= 0) {
        input.value = 1
    }
    updateCartPrice()
}
// end of update quantity input

// update total price
function updateCartPrice() {
    if(clearAll){
        clearAll = false;
        document.getElementsByClassName('total-price')[0].innerText = '$0';

        document.getElementsByClassName('cart-quantity')[0].textContent = 0;
        tempArray = [];
        localStorage.removeItem("products");
    }
    else {
        removeItemBtn = false;
        var total = 0;
        var products = [];
        for (var i = 0; i < productRow.length; i=i+2) {
            cartRow = productRow[i]

            var nameElement = cartRow.getElementsByClassName('cart-product-name')[0]
            var priceElement = cartRow.getElementsByClassName('cart-price')[0]
            var quantityElement = cartRow.getElementsByClassName('product-quantity')[0]
            var imageElement = cartRow.getElementsByClassName('cart-image')[0]
            var idElement = cartRow.getElementsByClassName('product-row')[0]

            var price = parseFloat(priceElement.innerText.replace('$', ''))
            var quantity = quantityElement.value;
            var image = imageElement.src;
            var id = idElement.id;
            var items = {
                id: id,
                name: nameElement.innerText,
                quantity: quantity,
                price: price,
                image: image
            }
            products.push(items);
            total = total + (price * quantity)

        }
        document.getElementsByClassName('total-price')[0].innerText = '$' + total
        if(total == 0){
            localStorage.removeItem("products");
        }
        else{
            products.push(total);
            localStorage.setItem("products", JSON.stringify(products));
        }
        document.getElementsByClassName('cart-quantity')[0].textContent = i /= 2
    }
}
// end of update total price

// purchase items
const purchaseBtn = document.querySelector('.purchase-btn');
const closeCartModal = document.querySelector('.cart-modal');

purchaseBtn.addEventListener('click', purchaseBtnClicked)

function purchaseBtnClicked() {
    var cartCount = document.getElementsByClassName('cart-quantity')[0].textContent
    if(cartCount > 0){
        window.location.href = 'checkout.html';
    }
    else{
        alert('Your cart is empty!');
    }
}
// end of purchase items