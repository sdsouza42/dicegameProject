class Dice {
    #result;
    constructor(sides) {
        this.sides = sides;
        this.#result = 0;
    }

    #roll() {
        return Math.floor(Math.random() * this.sides) + 1;
    }

    getResult() {
        return this.#result = this.#roll(this.#result);
    }
}

/*------------------------------------------------------------------------------------------------Dice Game functions-------------------------------------------------------------------------------------------------------------------------------------------*/

//create the dice object
function intializeRound(dice1Element, dice2Element) {
    const dice = new Dice(6);
    let total;

    try {
        return total = playRound(dice, total, dice1Element, dice2Element);
    } catch (error) {
        throw error;
    }
}

function playRound(dice, score, dice1Element, dice2Element) {
    isAnimateRoll = false;
    let diceRoll = [dice.getResult(), dice.getResult()];    
    try {
        animateDice(diceRoll[0], diceRoll[1], dice1Element, dice2Element);
        // Define the interval check with a time gap, e.g., 100 milliseconds
        score = diceRules(diceRoll);
    } catch (error) {
        throw error;
    }
    return score;
}
//calculate score based on rules
function diceRules(roll) {
    let score = 0;
    if (roll[0] === 1 || roll[1] === 1) {
        score = 0;
    } else if (roll[0] === roll[1]) {
        score = (roll[0] + roll[1]) * 2;
    } else {
        score = roll[0] + roll[1];
    }
    return score;
}
//call the animation function for the 2 different dice
function animateDice(dice1, dice2, dice1Element, dice2Element) {
    let dice_1 = [dice1, dice1Element];
    let dice_2 = [dice2, dice2Element];
    try {
        animateDiceResults(dice_1);
        animateDiceResults(dice_2);    
    } catch (error) {
        throw error;
    }
}
let isAnimateRoll = false;
//animate the dice roll, using a sprite img for the dice to get familiar with the concept
function animateDiceRoll(diceElement) {
    let startTime;

    function step(timestamp) {
        if (!startTime) startTime = timestamp;

        // As long as isAnimate is true, keep animating
        if (isAnimateRoll) {
            const randomFace = Math.floor(Math.random() * 6) + 1;
            diceElement.className = `dice dice-${randomFace}`;
            requestAnimationFrame(step);
        }
    }

    requestAnimationFrame(step);
}

let isAnimateBlink = true;

function animateDiceResults(dice) {
    const diceElement = dice[1];
    const diceRoll = dice[0];
    $(diceElement).fadeOut(50);
    diceElement.className = `dice dice-${diceRoll}`;
    $(diceElement).fadeIn(1000);
}

/*------------------------------------------------------------------------------------------------Main Page functions-------------------------------------------------------------------------------------------------------------------------------------------*/


let round = 0;
let totalplyrScore = 0;
let totalcomScore = 0;
const baseColor = getComputedStyle(document.documentElement).getPropertyValue('--base-color').trim();
let plyrRoll = 0;
let comRoll = 0;
const plyrDice1 = document.getElementById('dice1');
const plyrDice2 = document.getElementById('dice2');
const comDice1 = document.getElementById('cdice1');
const comDice2 = document.getElementById('cdice2');

//popup message to declare winner
function declareWinner() {
    let winnerMessage = 'It\'s a tie!';
    if (totalplyrScore > totalcomScore) {
        winnerMessage = 'Congratulations! You won!';
    } else if (totalplyrScore < totalcomScore) {
        winnerMessage = 'Sorry, the COM won this time.';
    }
    let playAgain = window.confirm(winnerMessage + ' Do you want to play again?');
    if (playAgain) {
        resetGame();
    }
}
//helper function for resting the game
function resetGame() {
    plyrRoll = 0;
    comRoll = 0;
    round = 0;
    totalplyrScore = 0;
    totalcomScore = 0;
    $('#plyrScore').text('0');
    $('#comScore').text('0');
    $('#roundNumber').text('0');
    $('#plyrButton').prop('disabled', false);
    $('#comButton').prop('disabled', true);
    $('#resetButton').prop('disabled', false);
    $('#plyrButton').text('Roll PLYR Dice');
    $('#comButton').text('Roll COM Dice');
    $('#plyrRoll').text('0');
    $('#comRoll').text('0');
    $('body').css('background-color', baseColor);
}
//help function for changing the bcolor based on winning or losing
function updateBackgroundColor() {
    if (totalplyrScore > totalcomScore) {
        $('body').css('background-color', '#cdeac0');
    } else if (totalplyrScore < totalcomScore) {
        $('body').css('background-color', '#ff928b');
    } else {
        $('body').css('background-color', '#efe9ae');
    }
}

function rollDice(nameText, roundScore, totalScore) {
    try {
        $('#'+nameText.toLowerCase()+'Roll').text(' dice is being rolled... ');
        $('#'+nameText.toLowerCase()+'Roll').text(roundScore);
        $('#'+nameText.toLowerCase()+'Score').text(totalScore);
    } catch (error) {
        throw error;
    }
}

function recordRound(){
    round++;
    $('#roundNumber').text(round);
    return round;
}

//logic for the game controlling ui elements and animations, work around for lack of async/await
function beginRound(nameText, dice1Element, dice2Element) {
    try {
        $('#resetButton').prop('disabled', true);
        let score = 0;
        score= intializeRound(dice1Element, dice2Element);
        console.log(score);
        if (nameText.toLowerCase() === 'plyr') {
            recordRound();
            plyrRoll++;
            totalplyrScore += score;
            rollDice(nameText, score, totalplyrScore);
            $('#comButton').prop('disabled', false);
        } else if (nameText.toLowerCase() === 'com') {
            comRoll++;
            totalcomScore += score;
            rollDice(nameText, score, totalcomScore);
            $('#plyrButton').prop('disabled', false);
            if (round >= 3) {
                updateBackgroundColor();
                $('#plyrButton').prop('disabled', true);
                setTimeout(declareWinner, 1200); 
            }
            //Enable to track number of rolls in the console
            // console.log('proll = ' + plyrRoll);
            // console.log('croll =' + comRoll);
        } else {
            throw new Error('Invalid player name');
        }
        updateBackgroundColor();
    } catch (error) {
        console.error("An error occurred: ", error);
        resetGame();
    } finally {
        $('#resetButton').prop('disabled', false);
    }
}

function focusDice(diceDisplay) {
    $(diceDisplay).css({
        'transform': 'scale(1.1)', // Slightly larger size for pop effect
        'transition': 'transform 0.3s ease', // Smooth transition
        'box-shadow': '0 0 0 2px #borderColor', // Simulate a border using box-shadow
        'margin': '-1px' // Adjust margin to compensate for the box-shadow border
    });
}

function unfocusDice(diceDisplay) {
    $(diceDisplay).css({
        'transform': 'scale(1)', // Reset size
        'transition': 'transform 0.3s ease' // Smooth transition
    });
}

//event listeners for the buttons
$(document).ready(function () {
    $('#comButton').prop('disabled', true);
    $('#plyrButton').on('click',function () {
        beginRound('plyr', plyrDice1, plyrDice2);
        $('#plyrButton').prop('disabled', true);
    });
    $('#comButton').on('click',function () {
        beginRound('com', comDice1, comDice2);
        $('#comButton').prop('disabled', true);   
    });
    $('#resetButton').click(function () {
        resetGame();
    });

    $('#plyrButton').on('mouseenter', function () {
        if ($('#plyrButton').prop('disabled')) {
            isAnimateRoll = false;
            return;
        }
        isAnimateRoll = true;
        animateDiceRoll(plyrDice1);
        animateDiceRoll(plyrDice2);
        $('#plyrButton').text('Roll');
        focusDice('#diceDisplay');
    });
    $('#plyrButton').on('mouseleave', function () {
        isAnimateRoll = false;
        $('#plyrButton').text('Roll PLYR Dice');
        unfocusDice('#diceDisplay');
    });

    $('#comButton').on('mouseenter', function () {
        if ($('#comButton').prop('disabled')) {
            isAnimateRoll = false;
            return;
        }
        isAnimateRoll = true;
        animateDiceRoll(comDice1);
        animateDiceRoll(comDice2);
        $('#comButton').text('Roll');
        focusDice('#cdiceDisplay');
    });
    $('#comButton').on('mouseleave', function () {
        isAnimateRoll = false;
        $('#comButton').text('Roll COM Dice');
        unfocusDice('#cdiceDisplay');
    });

});