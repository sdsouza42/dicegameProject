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
let tpScore = 0;
let tcScore = 0;
const baseColor = getComputedStyle(document.documentElement).getPropertyValue('--base-color').trim();

//create the dice object
function intializeRound(){
    const dice = new Dice(6);
    let total;

    try{
        total = playRound (dice, total);
    } catch (error) {
        throw error;
    }
    
    return total;
}
//get rolls, begin animation and calculate score
function playRound(dice, score){
    let diceRoll = [dice.getResult(), dice.getResult()];

    try{
        animateDice(diceRoll[0], diceRoll[1], document.getElementById('dice1'), document.getElementById('dice2'));
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
    }  else {
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
    let i = 0;
    let startTime;

    function step(timestamp) {
        if (!startTime) startTime = timestamp;
        const progress = timestamp - startTime;
        if (progress > i * 100) {
            const randomFace = Math.floor(Math.random() * 6) + 1;
            diceElement.className = `dice dice-${randomFace}`;
            i++;
        }
        if (i < 10) {
            requestAnimationFrame(step);
        } else {
            diceElement.className = `dice dice-${diceRoll}`;
        }
    }

    requestAnimationFrame(step);
}
//popup message to declare winner
function declareWinner() {
    let winnerMessage = 'It\'s a tie!';
    if (tpScore > tcScore) {
        winnerMessage = 'Congratulations! You won!';
    } else if (tpScore < tcScore) {
        winnerMessage = 'Sorry, the AI won this time.';
    }
    let playAgain = window.confirm(winnerMessage + ' Do you want to play again?');
    if (playAgain) {
        resetGame();
    }
}
//helper function for resting the game
function resetGame() {
    round = 0;
    tpScore = 0;
    tcScore = 0;
    $('#playerScore').text('Player Score: 0');
    $('#computerScore').text('AI Score: 0');
    $('#roundNumber').text('Round: 0');
    $('#rollButton').prop('disabled', false);
    $('#resetButton').prop('disabled', false);
    $('#rollButton').text('Roll Dice');
    $('#playerRoll').text('Player Roll: 0');
    $('#computerRoll').text('AI Roll: 0');
    $('body').css('background-color', baseColor);
}
//help function for changing the bcolor based on winning or losing
function updateBackgroundColor() {
    if (tpScore > tcScore) {
        $('body').css('background-color', '#cdeac0');
    } else if (tpScore < tcScore) {
        $('body').css('background-color', '#ff928b');
    } else {
        $('body').css('background-color', '#efe9ae');
    }
}
//logic for the game controlling ui elements and animations, work around for lack of async/await
function beginRound(){
    $('#resetButton').prop('disabled', true);
    $('#rollButton').prop('disabled', true); 
    $('#rollButton').text(`Roll Dice (${round + 1}/3)`);
    try {
        round++;
        $('#roundNumber').text('Round: ' + round);
        $('#playerRoll').text('Player dice is being rolled... ');
        let pScore = intializeRound();
        console.log(pScore);
        setTimeout(function() {
            $('#playerRoll').text('Player Rolled: ' + pScore);
            tpScore += pScore;
            $('#playerScore').text('Player Score: ' + tpScore);
            $('#computerRoll').text('AI dice is being rolled...');
        }, 1000);
        setTimeout(function() {
            let cScore = intializeRound();
            console.log(cScore);
            setTimeout(function() {
                $('#computerRoll').text('AI Rolled: ' + cScore);            
                tcScore += cScore;                                  
                $('#computerScore').text('AI Score: ' + tcScore);

                if (round < 3) {
                    $('#resetButton').prop('disabled', false);
                    $('#rollButton').prop('disabled', false); 
                    $('#rollButton').text(`Roll Dice (${round + 1}/3)`);
                } else {
                    $('#resetButton').prop('disabled', true);
                    $('#rollButton').prop('disabled', true);
                    $('#rollButton').text('No More Rolls'); 
                    updateBackgroundColor();
                    setTimeout(declareWinner, 1000); 
                }
                updateBackgroundColor();
            }, 1000);
        }, 2500);
    } catch (error) {
        console.error("An error occurred: ", error);
        $('#rollButton').prop('disabled', false);
        $('#resetButton').prop('disabled', false);  
    }
}
//event listeners for the buttons
$(document).ready(function () {
    $('#rollButton').click(function () {
        beginRound();
    });

    $('#resetButton').click(function () {
        resetGame();
    });
});

