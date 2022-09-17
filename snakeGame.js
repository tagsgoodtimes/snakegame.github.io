// Sound
const foodSound = new Audio('food.mp3');
const gameOverSound = new Audio('gameover.mp3');
const moveSound = new Audio('move.mp3');

// GAME_PIXEL_COUNT is the pixels on horizontal or vertical axis of the game board (SQUARE).
const GAME_PIXEL_COUNT = 40;
const SQUARE_OF_GAME_PIXEL_COUNT = Math.pow(GAME_PIXEL_COUNT, 2);

let changedTheDirOnce = false;
let totalFoodAte = 0;
// let hiScore = 0;
let totalDistanceTravelled = 0;

/// THE GAME BOARD:
const gameContainer = document.getElementById("gameContainer");

const createGameBoardPixels = () => {
    // Populate the [#gameContainer] div with small div's representing game pixels
    let a = ""
    for (let i = 1; i <= SQUARE_OF_GAME_PIXEL_COUNT; ++i) {
        a += `<div class="gameBoardPixel" id="pixel${i}"></div>`;
    }
    gameContainer.innerHTML = a;
};

// This variable always holds the updated array of game pixels created by createGameBoardPixels() :
const gameBoardPixels = document.getElementsByClassName("gameBoardPixel");

/// THE FOOD:
let currentFoodPostion = 0;
const createFood = () => {
    // Remove previous food;
    foodSound.play();
    gameBoardPixels[currentFoodPostion].classList.remove("food");

    // Create new food
    currentFoodPostion = Math.random();
    currentFoodPostion = Math.floor(
        currentFoodPostion * SQUARE_OF_GAME_PIXEL_COUNT
    );
    gameBoardPixels[currentFoodPostion].classList.add("food");
};

/// THE SNAKE:

// Direction codes (Keyboard key codes for arrow keys):
const LEFT_DIR = 37;
const UP_DIR = 38;
const RIGHT_DIR = 39;
const DOWN_DIR = 40;

let positionArray = []
// Set snake direction initially to right

    let snakeCurrentDirection = RIGHT_DIR;



const changeDirection = (newDirectionCode) => {
    // Change the direction of the snake
    if (newDirectionCode == snakeCurrentDirection || changedTheDirOnce) {
        moveSound.play();
            return;
        }

    if (newDirectionCode == LEFT_DIR && snakeCurrentDirection != RIGHT_DIR) {
        moveSound.play();

        snakeCurrentDirection = newDirectionCode;
    } else if (newDirectionCode == UP_DIR && snakeCurrentDirection != DOWN_DIR) {
        moveSound.play();

        snakeCurrentDirection = newDirectionCode;
    } else if (
        newDirectionCode == RIGHT_DIR &&
        snakeCurrentDirection != LEFT_DIR
    ) {
        moveSound.play();

        snakeCurrentDirection = newDirectionCode;
    } else if (newDirectionCode == DOWN_DIR && snakeCurrentDirection != UP_DIR) {
        moveSound.play();

        snakeCurrentDirection = newDirectionCode;
    }

    changedTheDirOnce = true;
};

// Let the starting position of the snake be at the middle of game board
let currentSnakeHeadPosition = SQUARE_OF_GAME_PIXEL_COUNT / 2 - 1;

// Initial snake length
let snakeLength = 100;
// Move snake continously by calling this function repeatedly :
const moveSnake = () => {
    switch (snakeCurrentDirection) {
        
        case LEFT_DIR:
            --currentSnakeHeadPosition;
            const isSnakeHeadAtLastGameBoardPixelTowardsLeft =
                currentSnakeHeadPosition % GAME_PIXEL_COUNT == GAME_PIXEL_COUNT - 1 ||
                currentSnakeHeadPosition < 0;
            if (isSnakeHeadAtLastGameBoardPixelTowardsLeft) {
                currentSnakeHeadPosition = currentSnakeHeadPosition + GAME_PIXEL_COUNT;
            }
            break;
        case UP_DIR:
            currentSnakeHeadPosition = currentSnakeHeadPosition - GAME_PIXEL_COUNT;
            const isSnakeHeadAtLastGameBoardPixelTowardsUp =
                currentSnakeHeadPosition < 0;
            if (isSnakeHeadAtLastGameBoardPixelTowardsUp) {
                currentSnakeHeadPosition =
                    currentSnakeHeadPosition + SQUARE_OF_GAME_PIXEL_COUNT;
            }
            break;
        case RIGHT_DIR:
            ++currentSnakeHeadPosition;
            const isSnakeHeadAtLastGameBoardPixelTowardsRight =
                currentSnakeHeadPosition % GAME_PIXEL_COUNT == 0;
            if (isSnakeHeadAtLastGameBoardPixelTowardsRight) {
                currentSnakeHeadPosition = currentSnakeHeadPosition - GAME_PIXEL_COUNT;
            }
            break;
        case DOWN_DIR:
            currentSnakeHeadPosition = currentSnakeHeadPosition + GAME_PIXEL_COUNT;
            const isSnakeHeadAtLastGameBoardPixelTowardsDown =
                currentSnakeHeadPosition > SQUARE_OF_GAME_PIXEL_COUNT - 1;
            if (isSnakeHeadAtLastGameBoardPixelTowardsDown) {
                currentSnakeHeadPosition =
                    currentSnakeHeadPosition - SQUARE_OF_GAME_PIXEL_COUNT;
            }
            break;
        default:
            break;
    }

    let nextSnakeHeadPixel = gameBoardPixels[currentSnakeHeadPosition];

    // Kill snake if it bites itself:
    if (nextSnakeHeadPixel.classList.contains("snakeBodyPixel")) {
        // Stop moving the snake
        gameOverSound.play();
        clearInterval(moveSnakeInterval);
        if (
            !alert(
                `Your Score is ${totalFoodAte}.`
            )
        )
        window.location.reload();
    }


    nextSnakeHeadPixel.classList.add("snakeBodyPixel");
    if (positionArray.length > (totalFoodAte)) {

        let removeMe = positionArray[0]
        positionArray.shift(1)
        // console.log('removing ', removeMe)
        removeMe.classList.remove("snakeBodyPixel");
    }
    positionArray.push(nextSnakeHeadPixel)
    // console.log('adding ', nextSnakeHeadPixel)

    changedTheDirOnce = false;
    if (currentSnakeHeadPosition == currentFoodPostion) {
        // Update total food ate
        totalFoodAte++;
        if(totalFoodAte>hiscoreval){
            hiscoreval = totalFoodAte;
            localStorage.setItem("hiscore", JSON.stringify(hiscoreval));
            hiscoreBox.innerHTML = hiscoreval;
        }
        // hiscoreBox.innerHTML = hiScore;
        // Update in UI:
        document.getElementById("pointsEarned").innerHTML = totalFoodAte;

        // Increase Snake length:
        snakeLength = snakeLength + 100;
        createFood();
    }
};

let hiscore = localStorage.getItem("hiscore");
if(hiscore === null){
    hiscoreval = 0;
    localStorage.setItem("hiscore", JSON.stringify(hiscoreval))
}
else{
    hiscoreval = JSON.parse(hiscore);
    hiscoreBox.innerHTML = hiscore;
}

/// CALL THE FOLLOWING FUNCTIONS TO RUN THE GAME:

// Create game board pixels:
createGameBoardPixels();

// Create initial food:
createFood();

// Move snake:
var moveSnakeInterval = setInterval(moveSnake, 100);

// Call change direction function on keyboard key-down event:
addEventListener("keydown", (e) => changeDirection(e.keyCode));

// ON SCREEN CONTROLLERS:
const leftButton = document.getElementById("leftButton");
const rightButton = document.getElementById("rightButton");
const upButton = document.getElementById("upButton");
const downButton = document.getElementById("downButton");

leftButton.onclick = () => changeDirection(LEFT_DIR);
rightButton.onclick = () => changeDirection(RIGHT_DIR);
upButton.onclick = () => changeDirection(UP_DIR);
downButton.onclick = () => changeDirection(DOWN_DIR);