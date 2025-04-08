let paymentOptions = document.getElementById('selectPaymentOption');
let paymentOptionsBox = document.getElementById('payment-options');

paymentOptions.addEventListener('click', function(){
    paymentOptionsBox.style.display = 'block';
    
})

function paymentOptionsfunction(method){
    paymentOptions.value = method;
    paymentOptionsBox.style.display = 'none';
}

let payment_Form = document.getElementById('payment-Form');
let selectPaymentOption_error = document.getElementById('selectPaymentOption-error');
payment_Form.addEventListener('submit', function(event){
    if(paymentOptions.value !== "GPAY"){
        selectPaymentOption_error.style.display = 'block';
        setTimeout(() => {
           selectPaymentOption_error.style.display = 'none';
        }, 4000);
        event.preventDefault();
    }

})

// go to gpay path and function
















