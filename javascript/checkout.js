//variable declaration
var owner = $('#cname');
var ccnum = $('#ccnum');
var cvv = $('#cvv');
var fname = $('#fname');
var email = $('#email');
var adr = $('#adr');
var zip = $('#zip');
var expmonth = $('#expmonth');
var expyear = $('#expyear');
var totalAmount = 0;
var totalByItem = 0;
var sameAsBilling = $('#billing');
var shippingAddress = ` <h3>Shipping Address</h3>
                        <div class="col-50">
                            <div class="required">
                                <label for="shipadr"><i class="fa fa-address-card-o"></i> Address</label>
                                <input type="text" id="shipadr" placeholder="542 W. 15th Street" required>
                                <label for="shipzip">Zip</label>
                                <input type="text" id="shipzip" placeholder="10001" required>
                            </div>
                        </div>
                        <div class="col-50">
                            <label for="shipcity"><i class="fa fa-institution"></i> City</label>
                            <input type="text" id="shipcity" placeholder="New York">
                            <label for="shipstate">State</label>
                            <input type="text" id="shipstate" placeholder="NY">
                        </div>`;
var shippingAddressState = false;

// Once UI is ready
$(document).ready(function () {

    var products = localStorage.getItem('products'); //getting products from local storage
    var totalPrice = localStorage.getItem('total');

    //validate credit card number & cvv through payform library
    ccnum.payform('formatCardNumber');
    cvv.payform('formatCardCVC');

    //display total no of items in the cart
    if(products){
        var data = JSON.parse(products);

        document.getElementsByClassName('cart-quantity')[0].textContent = data.length - 1;

        data.forEach(function (item, index) {
            if(index !== data.length - 1){
                listCartItems(item, index);
            }
        })
    }
    else{
        window.location.href = 'products.html';
    }

    //dynamically create element to display products in the cart 
    function listCartItems(data, id){
        var productSummary = document.getElementsByClassName('products-summary')[0];
        totalByItem = data.quantity * data.price;
        totalAmount = totalAmount + totalByItem;
        var cartRowItems = `
                <p id="${id}" class="cart-qty"><a href="#">${data.name}</a> <a>Q: ${data.quantity}</a> <span class="price">$${totalByItem}</span></p>
            `
        var node = document.createElement("div"); 
        node.innerHTML = cartRowItems
        productSummary.appendChild(node);
        document.getElementsByClassName('total-amount')[0].textContent = "$" + totalAmount;
    }

    $('#billing').click(function(){
        var rootShipping = document.getElementById("shipping");
        if($(this).is(':checked')){
            console.log('checked')
            shippingAddressState = false;
            if (rootShipping.hasChildNodes()) {
                rootShipping.removeChild(rootShipping.children[0]);
            }
        } else {
            var node = document.createElement("div");
            node.className = "row";
            node.className = "custom-shipping";
            node.innerHTML = shippingAddress
            rootShipping.appendChild(node);
            console.log('not checked')
            shippingAddressState = true;
        }
    });
});

//Email validation
function ValidateEmail(inputText) {
    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (inputText.match(mailformat)) {
        return true;
    }
    else {
        alert("You have entered an invalid email address!");
        return false;
    }
}

function fieldValidation(isCardValid, isCvvValid, isValidateExpiry) {
    if(fname.val() !== "" && email.val() !== "" && adr.val() !== "" && zip.val() !== "" ){
        if(ValidateEmail(email.val())){
            if(owner.val().length < 5){ // validate name on card
                alert("Please enter valid name on card!");
                return false
            } else if (!isCardValid) { // validate credit card number
                alert("Wrong card number");
                return false
            } else if (!isCvvValid) { // validate cvv value
                alert("Wrong CVV");
                return false
            } else if (!isValidateExpiry){ //Validate expiry year & month
                alert("Wrong Expiary");
                return false
            } else {
                //Reset everything after success
                localStorage.removeItem('products')
                totalAmount = 0;
                totalByItem = 0;
                alert("Thanks for your order!");
                window.location.href = window.location.origin;
                return true
            }
        }
    }
    else {
        alert("Please fill all mandatory fields!");
        return false
    }
}

//onclick event for "continue to checkout" button
function checkout(){
    event.preventDefault();
    var isCardValid = $.payform.validateCardNumber(ccnum.val());
    var isCvvValid = $.payform.validateCardCVC(cvv.val());
    var isValidateExpiry = $.payform.validateCardExpiry(expmonth.val(), expyear.val()); 

    if(totalAmount == 0){
        alert("The cart is empty!");
    }
    else {
        if(!shippingAddressState){
            fieldValidation(isCardValid, isCvvValid, isValidateExpiry);
        }
        else{
            var shipAdr = $('#shipadr');
            var shipZip = $('#shipzip');
            if(shipAdr.val() !== "" && shipZip.val() !== ""){
                fieldValidation(isCardValid, isCvvValid, isValidateExpiry);
            }
            else {
                alert("Please fill all mandatory fields!");
                return false
            }
        }
    }
}