suffle();
// Those are global variables, they stay alive and reflect the state of the game
var elPreviousCard = null;
var allowedToFlipped = true;
var timer = Date.now();
var minute = 0;
var houer = 0;
var flippedCouplesCount = 0;
var playername = localStorage.getItem('playerName');
var bestTime = bestTime();

// This is a constant that we dont change during the game (we mark those with CAPITAL letters)
var TOTAL_COUPLES_COUNT = 5;

// Load an audio file
var audioWin = new Audio('sound/win.mp3');
var audioWrong = new Audio('sound/wrong.mp3');
var audioRight = new Audio('sound/right.mp3');
//define the button- play again
var button = document.querySelector('.visibilty');
// This function is called whenever the user click a card
function cardClicked(elCard) {

    // If the user clicked an already flipped card - do nothing and return from the function
    if (elCard.classList.contains('flipped')) {
        return;
    }
    // check if been pass one second between the secound card to the third card
    if (allowedToFlipped === false){
        return;
    }
    // Flip it
    elCard.classList.add('flipped');

    // This is a first card, only keep it in the global variable
    if (elPreviousCard === null) {
        elPreviousCard = elCard;
    } else {
        // get the data-card attribute's value from both cards
        var card1 = elPreviousCard.getAttribute('data-card');
        var card2 = elCard.getAttribute('data-card');

        // No match, schedule to flip them back in 1 second
        if (card1 !== card2){
            allowedToFlipped = false;
            setTimeout(function () {
                elCard.classList.remove('flipped');
                elPreviousCard.classList.remove('flipped');
                elPreviousCard = null;
                allowedToFlipped = true;
            }, 1000)
            audioWrong.play();

        } else {
            // Yes! a match!
            flippedCouplesCount++;
            audioRight.play();
            elPreviousCard = null;

            // All cards flipped!
            if (TOTAL_COUPLES_COUNT === flippedCouplesCount) {
                audioWin.play();
                button.classList.remove('visibilty');
                button.addEventListener("click",playAgain);
                clearInterval(intervalTimer);
                checkBestTime();
            }

        }

    }


}
//flipped all the cards and make the button disapper
function playAgain(){
    var cards = document.querySelectorAll('div');
    for(var i = 0; i< cards.length; i++){
        cards[i].classList.remove('flipped');
    }
    button.classList.add('visibilty');
    flippedCouplesCount =0;
    timer = Date.now();
    minute = 0;
    houer =0;
    var intervaLTimer = setInterval(time,1000);
}
// vars for the timer.
var clock = document.getElementById('clock');
var intervalTimer = setInterval(time, 1000);
// timer method- each time that method been called it add new secound.
function time() {
    var d = Date.now();
    var seconds = Math.floor((d- timer)/1000);
    if(seconds/59 >=1){
        timer = Date.now();
        minute = minute+1; 
    }
    if(minute/59 >=1){
        minute = 0;
        houer = houer+1;
    }
    clock.innerText =  houer+ ":" + minute + ":" + seconds;
}
//set the best time in game
function bestTime(){
    var score = document.querySelector('.bestScoreTime');
    score.innerHTML = localStorage.getItem('bestTime');
    return score.innerHTML
}
//check if the the besttime score was broke
function checkBestTime(){
    var score = document.querySelector('.bestScoreTime');
    var timerScore = clock.innerText;
    if (bestTime == ""){
        localStorage.setItem('bestTime', timerScore);
        score.innerHTML = timerScore;
        return;
    }  
    var sec = bestTime.slice(4,6);
    var min = bestTime.slice(2,3); 
    if(min > timerScore.slice(2,3)){
        localStorage.setItem('bestTime', timerScore);
        score.innerHTML = timerScore;
        return;
    }
    if (min == timerScore.slice(2, 3)){
        if (sec > timerScore.slice(4,6)){
            localStorage.setItem('bestTime', timerScore);
            score.innerHTML = timerScore;
        }
    }

}

//check if the player regsiter is name, if not a prompt pops.
function PlayerNameMethod(){
    if(playername ==null){
        playername = prompt("what is your name?");
        document.querySelector('.playerName').innerText ="Hi "+playername;
        localStorage.setItem('playerName',playername);
        timer = Date.now();
    }
    else{
        document.querySelector('.playerName').innerText="Hi " + playername;
    }
}
//change the user name when the "change user" button clicked
function changeUser(){
    playername = null;
    PlayerNameMethod();
}
//this fuction make a new card by taking number
function newCard(number){
    this.cardNumber = number;
    var divCard = document.createElement("div");
    divCard.setAttribute("data-card",number);
    var imgMonster = document.createElement("img");
    imgMonster.src = "img/cards/"+number+".png";
    var imgBack = document.createElement("img");
    imgBack.src = "img/cards/back.png";
    imgBack.classList.add("back");
    divCard.appendChild(imgMonster);
    divCard.appendChild(imgBack);
    return divCard;
}
//suffle the card each time the player start a new game
function suffle(){
    var container = document.querySelector(".container");
    var arry= [];
    while(arry.length < 5){
        var number = Math.floor(Math.random()*5+1);
        if(arry.includes(number)){
            //console.log("number alredy exist")
        }
        else{
            //console.log(number);
            arry.push(number);
        }
    }
    for(var i = 0; i<5;i++){
        //console.log(arry[i]);
        div = newCard(arry[i]);
        div.addEventListener("click", function(){cardClicked(this)});
        div.classList.add("card");
        container.appendChild(div);
    }
    var number = Math.floor(Math.random() * 2);
    console.log(number);
    if(number === 1){
        arry.reverse();
    }
    else{
        arry.sort();
    }
    for (var i = 0; i < 5; i++) {
        //console.log(arry[i]);
        div = newCard(arry[i]);
        div.addEventListener("click", function () { cardClicked(this) });
        div.classList.add("card");
        container.appendChild(div);
    }
}

