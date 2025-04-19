const formContainers = document.querySelectorAll('.form-container');
const entryAmountInputs = document.querySelectorAll('.entryAmount');

// Loop through the NodeList and log each value
entryAmountInputs.forEach(input => {
  console.log(input.value);
});



formContainers.forEach(form => {
    const selectBtn = form.querySelector('#selectbtn');
    if (selectBtn.value === 'Selected') {
        form.style.display = 'none';
    }
});