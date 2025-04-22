let Redeembtn = document.getElementById('Redeembtn');
Redeembtn.addEventListener('click', function(event) {
    let redeemdiamondValue = document.getElementById('redeemdiamondValue');
    let redeemErrorMsg = document.getElementById('error-msg');


    const diamondValues = [100, 200, 300, 400, 500, 1000];
    
    // Convert input to number if it's from a form input
    const value = Number(redeemdiamondValue.value);
    
    if (!diamondValues.includes(value)) {
        event.preventDefault();
        redeemErrorMsg.textContent = `Enter Diamond Values ${diamondValues.join(", ")}`;
        redeemErrorMsg.style.display = 'block';
    
        setTimeout(() => {
            redeemErrorMsg.style.display = 'none';
        }, 5000);
    }

})

