const checkbox = document.getElementById('togglepassword');
const passwordInput = document.getElementById('password');
const mobile_error = document.getElementById('mobile-error');

checkbox.addEventListener('change', () => {
    passwordInput.type = checkbox.checked ? 'text' : 'password';
});

if(mobile_error.style.display = 'block'){
    setTimeout(() => {
      mobile_error.style.display = 'none';
    }, 5000);
  }