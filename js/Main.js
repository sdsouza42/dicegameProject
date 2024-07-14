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

let round = 0;
let totalplyrScore = 0;
let totalcomScore = 0;
const baseColor = getComputedStyle(document.documentElement).getPropertyValue('--base-color').trim();

//create the dice object
function intializeRound(dice1Element, dice2Element) {
    const dice = new Dice(6);
    let total;

    try {
        total = playRound(dice, total, dice1Element, dice2Element);
    } catch (error) {
        throw error;
    }

    return total;
}
//get rolls, begin animation and calculate score
function playRound(dice, score, dice1Element, dice2Element) {
    let diceRoll = [dice.getResult(), dice.getResult()];

    try {
        animateDice(diceRoll[0], diceRoll[1], dice1Element, dice2Element);
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
        animateDiceRoll(dice_1);
        animateDiceRoll(dice_2);
    } catch (error) {
        throw error;
    }
}
//animate the dice roll, using a sprite img for the dice to get familiar with the concept
function animateDiceRoll(dice) {
    const diceElement = dice[1];
    const diceRoll = dice[0];
    let count = 0;

    const intervalId = setInterval(() => {
        if (count < 10) {
            const randomFace = Math.floor(Math.random() * 6) + 1;
            diceElement.className = `dice dice-${randomFace}`;
            count++;
        } else {
            clearInterval(intervalId);
            diceElement.className = `dice dice-${diceRoll}`;
            // Optional: Add an animation effect when setting the final dice face
            $(diceElement).animate({
                opacity: 0.25,
                opacity: 1
            }, 1000);
        }
    }, 100);
}
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
    round = 0;
    totalplyrScore = 0;
    totalcomScore = 0;
    $('#playerScore').text('PLYR Score: 0');
    $('#computerScore').text('COM Score: 0');
    $('#roundNumber').text('Round: 0');
    $('#rollButton').prop('disabled', false);
    $('#resetButton').prop('disabled', false);
    $('#rollButton').text('Roll Dice');
    $('#playerRoll').text('Player Roll: 0');
    $('#computerRoll').text('COM Roll: 0');
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
        $().prop('disabled', true);
        $().prop('disabled', true);
        $('#'+nameText.toLowerCase()+'Roll').text(nameText + ' dice is being rolled... ');
        $('#'+nameText.toLowerCase()+'Roll').text(nameText + 'Rolled: ' + roundScore);
        $('#'+nameText.toLowerCase()+'Score').text(nameText + 'Score: ' + totalScore);
        $().prop('disabled', false);
        $().prop('disabled', false);
    } catch (error) {
        $().prop('disabled', false);
        $().prop('disabled', false);
        throw error;
    }
}



//rewrite to make it modular, it needs to disbale the ply but and com button according to turn
//logic for the game controlling ui elements and animations, work around for lack of async/await
function beginRound(nameText, dice1Element, dice2Element) {
    $('#resetButton').prop('disabled', true);
    $('#rollButton').prop('disabled', true);
    $('#rollButton').text(`Roll Dice (${round + 1}/3)`);
    try {
        round++;
        $('#roundNumber').text('Round: ' + round);
        let score = intializeRound(dice1Element, dice2Element);
        console.log(score);
        setTimeout(function () {
            if (nameText.toLowerCase() === 'plyr') {
                plyrScore += score;
                rollDice(nameText, score, totalplyrScore);
            } else if (nameText.toLowerCase() === 'com') {
                comScore += score;
                rollDice(nameText, score, totalcomScore);
            } else {
                throw new Error('Invalid player name');
            }
        }, 1200);
        if (round < 3) {
            $('#resetButton').prop('disabled', false);
            $('#rollButton').prop('disabled', false);
            $('#rollButton').text(`Roll Dice (${round + 1}/3)`);
        } else {
            $('#rollButton').text('No More Rolls');
            updateBackgroundColor();
            setTimeout(declareWinner, 1200);
        }
        updateBackgroundColor();
    } catch (error) {
        console.error("An error occurred: ", error);
    } finally {
        $('#rollButton').prop('disabled', false);
        $('#resetButton').prop('disabled', false);
    }
}
//event listeners for the buttons
$(document).ready(function () {
    $('#plyrButton').click(function () {
        beginRound('plyr', $('#dice1'), $('#dice2'));
    });
    $('#comButton').click(function () {
        beginRound('com', $('#cdice1'), $('#cdice2'));
    });
    $('#resetButton').click(function () {
        resetGame();
    });
});

