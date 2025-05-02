let playernameandidcontainer = document.querySelectorAll('.playernameandid-container');
let countbox= document.querySelector('.count-box');
let matchType = document.querySelector('.matchType');
if(matchType.value === "SOLO MATCH"){
    countbox.textContent =`Players Count ${ playernameandidcontainer.length}`;
}

if(matchType.value === "SQUAD MATCH"){
    countbox.textContent =`Players Count ${ playernameandidcontainer.length*4}`;
}




