const formContainers = document.querySelectorAll('.form-container');

formContainers.forEach(form => {
    const selectBtn = form.querySelector('#selectbtn');
    if (selectBtn.value === 'Selected') {
        form.style.display = 'none';
    }
});