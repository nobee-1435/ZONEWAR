document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".prize-form-container").forEach(function (form) {
        form.addEventListener("submit", function (event) {

            let container = form.closest(".match-details-container");
            let registeredPlayer = container.querySelector("#registered-payer").textContent;
            let possiblePlayer = container.querySelector("#posible-player").textContent;
            let entryButton = form.querySelector(".entryamount-btn");

            if (parseInt(registeredPlayer) >= parseInt(possiblePlayer)) {
                entryButton.value = "Team Full";
                entryButton.style.backgroundColor = "red"; 
                event.preventDefault(); 
            } else {
                form.submit();
            }
        });
    });
});

let matchApplied_Succes_Notification_Bar = document.getElementById('matchApplied-succes-notification-bar');
let matchAppliedorcanceledValue = document.getElementById('matchAppliedorcanceledValue');
let notificationValue = matchAppliedorcanceledValue.textContent
if(notificationValue.includes("Already")){
    matchApplied_Succes_Notification_Bar.style.backgroundColor = "red";
}
if(matchApplied_Succes_Notification_Bar.style.display = 'block'){
    setTimeout(() => {
        matchApplied_Succes_Notification_Bar.style.display = 'none';
    }, 10000);
}

//prize detials container show functions
function toggleContainer(button) {
    const prizeContainer = button.nextElementSibling;
    const arrow = button.querySelector('.arrow');

    // Toggle visibility
    if (prizeContainer.style.display === 'block') {
        prizeContainer.style.display = 'none';
        arrow.textContent = '▼'; // Arrow down
    } else {
        // Close other open containers
        document.querySelectorAll('.prizeContainer').forEach(container => {
            container.style.display = 'none';
            container.previousElementSibling.querySelector('.arrow').textContent = '▼';
        });

        prizeContainer.style.display = 'block';
        arrow.textContent = '▲'; // Arrow up
    }
}
