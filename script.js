console.log("JavaScript is working!");
const startButton =
    document.getElementById("startButton");
const startScreen =
    document.getElementById("startScreen");
const gameScreen =
    document.getElementById("gameScreen");
const gameArea = 
    document.getElementById("gameArea");
const levelDisplay =
    document.getElementById("levelDisplay");

const scoreDisplay =
    document.getElementById("scoreDisplay");

const livesDisplay =
    document.getElementById("livesDisplay");
const gameInfo =
    document.getElementById("gameInfo");

let currentLevel = 1;
let currentRound = 1;

// Highest level the player has unlocked
let highestUnlockedLevel = 1;
let memoryData = {};
let score = 0;
let lives = 3;
let questionsAsked = 0;
let totalQuestions = 0;
let questionQueue = [];
let timerInterval = null;
let viewCount = 1;
const colors = [
    "red",
    "blue",
    "green",
    "yellow",
    "purple",
    "orange",
    "pink",
    "brown"
];

const colorValues = {
    red: "#f28b82",
    blue: "#7aa7e8",
    green: "#81c995",
    yellow: "#f6d365",
    purple: "#a78bda",
    orange: "#f5a65b",
    pink: "#e88bb5",
    brown: "#a9826d"
};
const levelData = {

    1: {
    name: "Everyday Objects",
    viewTime: 30,

    objects: [
        "APPLE",
        "CAR",
        "DOG",
        "STAR",
        "BALL",
        "PIZZA",
        "CAT",
        "BICYCLE"
    ]
},

2: {
    name: "Movies",
    viewTime: 40,

    objects: [
        "AVATAR",
        "TITANIC",
        "INCEPTION",
        "JOKER",
        "FROZEN",
        "BATMAN",
        "AVENGERS",
        "INTERSTELLAR"
    ]
},

3: {
    name: "Animals",
    viewTime: 50,

    objects: [
        "DOG",
        "CAT",
        "LION",
        "ELEPHANT",
        "TIGER",
        "PANDA",
        "GIRAFFE",
        "MONKEY"
    ]
},

4: {
    name: "Food",
    viewTime: 60,

    objects: [
        "PIZZA",
        "BURGER",
        "APPLE",
        "BANANA",
        "DONUT",
        "CAKE",
        "POPCORN",
        "WATERMELON"
    ]
},

5: {
    name: "Technology",
    viewTime: 70,

    objects: [
        "LAPTOP",
        "PHONE",
        "KEYBOARD",
        "MOUSE",
        "HEADPHONES",
        "CAMERA",
        "PRINTER",
        "SMARTWATCH"
    ]
}
};
startButton.addEventListener("click", function () {

    startScreen.classList.remove("screen-active");
    startScreen.classList.add("screen-exit");
    gameScreen.classList.add("screen-active");

    gameInfo.style.display = "flex";

    currentLevel = 1;
    currentRound = 1;

    memoryData = {};

    score = 0;

    lives = 3;

    questionsAsked = 0;

    questionQueue = [];

    updateGameInfo();

    requestAnimationFrame(function () {
        startScreen.style.display = "none";
    });

    startRound();

});

levelDisplay.addEventListener("change", function () {

    const selectedLevel = Number(this.value);

    // Safety check: never allow a locked level
    if (
        selectedLevel < 1 ||
        selectedLevel > highestUnlockedLevel
    ) {
        return;
    }

    // Change level
    currentLevel = selectedLevel;

    // Reset the round for this level
    currentRound = 1;
    memoryData = {};
    questionsAsked = 0;
    questionQueue = [];
    viewCount = 1;

    // Give the player fresh lives for the replay
    lives = 3;

    updateGameInfo();

    // Start selected level
    startRound();
});


function startRound() {

    const wordsForThisLevel = currentLevel + 3;

    memoryData = {};

    viewCount = 1;

    for (let i = 0; i < wordsForThisLevel; i++) {

        const color = colors[i];

        const object =
            levelData[currentLevel].objects[i];

        memoryData[color] = object;
    }

    showMemoryCards();
}
function showMemoryCards() {

    gameArea.innerHTML = "";

    const wordsForThisLevel =
        currentLevel + 3;

    const viewTime =
        levelData[currentLevel].viewTime;

    gameArea.innerHTML = `

        <h2>🧠 Remember These!</h2>

        <p>
            Level ${currentLevel} -
            ${levelData[currentLevel].name}
        </p>

        <div id="memoryCards"></div>

        <h3>
            ⏱️ Time:
            <span id="timer">${viewTime}</span>
            seconds
        </h3>

        <button id="viewAgainButton">
            🔄 View Again
        </button>

        <button id="okButton">
            ✅ I Remember
        </button>
    `;

    memoryCards.classList.add(`cards-${wordsForThisLevel}`);

    // Show all cards
    for (let i = 0; i < wordsForThisLevel; i++) {

        const color = colors[i];

        const card =
            document.createElement("div");

        card.classList.add("memory-card");

        card.style.backgroundColor = colorValues[color];

        const objectName = memoryData[color];

let textSize = "17px";

if (objectName.length > 10) {
    textSize = "13px";
} else if (objectName.length > 7) {
    textSize = "15px";
}

card.innerHTML = `
    <strong style="font-size: ${textSize}">
        ${objectName}
    </strong>
`;
        memoryCards.appendChild(card);
    }

    const viewAgainButton =
        document.getElementById("viewAgainButton");

    const okButton =
        document.getElementById("okButton");


    // View Again button
    viewAgainButton.addEventListener("click", function () {

        if (viewCount < 2) {

            viewCount++;

            showMemoryCards();

        }

    });


    // I Remember button
    okButton.addEventListener("click", function () {

        // Stop timer
        clearInterval(timerInterval);

        // Go directly to memory test
        startMemoryTest();

    });


    // Start timer
    startTimer(viewTime);
    updateGameProgress();
}
function startTimer(seconds) {

    // Stop any previous timer
    clearInterval(timerInterval);

    let timeLeft = seconds;

    const timer =
        document.getElementById("timer");

    timer.textContent = timeLeft;


    timerInterval = setInterval(function () {

        timeLeft--;

        timer.textContent = timeLeft;


        if (timeLeft <= 0) {

            clearInterval(timerInterval);

            hideMemoryCards();

        }

    }, 1000);
}
function hideMemoryCards() {

    const memoryCards =
        document.getElementById("memoryCards");

    if (memoryCards) {

        memoryCards.style.display = "none";
    }


    const viewAgainButton =
        document.getElementById("viewAgainButton");

    if (viewAgainButton) {

        viewAgainButton.style.display = "none";
    }


    const okButton =
        document.getElementById("okButton");

    if (okButton) {

        okButton.style.display = "block";
    }

}
function revealObject(card, color) {

    const object =
        levelData[currentLevel].objects[currentRound - 1];

    // Store the relationship
    memoryData[color] = object;

    // Show the object
    card.textContent = object;

    // Prevent clicking again
    card.style.pointerEvents = "none";

    // Wait 3 seconds
    setTimeout(function () {

        currentRound++;

        startRound();

    }, 3000);
}
function startMemoryTest() {

    gameArea.innerHTML = "";

    totalQuestions = Object.keys(memoryData).length;

    if (questionQueue.length === 0) {

        const learnedColors = Object.keys(memoryData);

        questionQueue = shuffleArray([...learnedColors]);
    }

    const questionColor = questionQueue.shift();

    gameArea.innerHTML = `
        <h2>🧠 Memory Test</h2>

        <p>
            What was behind
            <strong
                class="question-color"
                style="color: ${colorValues[questionColor]};"
            >
                ${questionColor.toUpperCase()}
            </strong>
            ?
        </p>

        <div id="answerContainer"></div>
    `;

    createAnswers(questionColor);
    updateGameProgress();
}
function createAnswers(questionColor) {
    const answerContainer =
        document.getElementById("answerContainer");

    if (!answerContainer) return;

    const correctAnswer =
        memoryData[questionColor];

    // Get all learned objects except the correct answer
    const wrongAnswers =
        Object.values(memoryData).filter(function (object) {
            return object !== correctAnswer;
        });

    // Shuffle wrong answers
    shuffleArray(wrongAnswers);

    // We ALWAYS want 3 wrong answers + 1 correct answer = 4 options
    const selectedWrongAnswers = wrongAnswers.slice(0, 3);

    const answers = [
        correctAnswer,
        ...selectedWrongAnswers
    ];

    // Safety check: never show fewer than 4 choices
    // when the level contains enough objects.
    if (answers.length < 4) {
        const levelObjects = levelData[currentLevel].objects
            .filter(function (object) {
                return !answers.includes(object);
            });

        shuffleArray(levelObjects);

        while (answers.length < 4 && levelObjects.length > 0) {
            answers.push(levelObjects.shift());
        }
    }

    // Randomize the position of the correct answer
    shuffleArray(answers);

    // Clear old choices before creating the new 4
    answerContainer.innerHTML = "";

    answers.slice(0, 4).forEach(function (answer) {
        const button = document.createElement("button");

        button.type = "button";
        button.textContent = answer;
        button.classList.add("answer-button");

        button.addEventListener("click", function () {
            checkAnswer(answer, questionColor);
        });

        answerContainer.appendChild(button);
    });

    // Automatically reduce text size for long answers
    fitAnswerText();
}

function fitAnswerText() {
    const buttons = document.querySelectorAll(".answer-button");

    buttons.forEach(function (button) {
        let fontSize = 15;

        button.style.fontSize = fontSize + "px";

        while (
            button.scrollWidth > button.clientWidth &&
            fontSize > 8
        ) {
            fontSize -= 0.5;
            button.style.fontSize = fontSize + "px";
        }
    });
}

function checkAnswer(answer, questionColor) {

    const correctAnswer =
        memoryData[questionColor];

    questionsAsked++;

    if (answer === correctAnswer) {

        score += 100;

        updateGameInfo();

        gameArea.innerHTML = `
            <h2>✅ Correct!</h2>

            <p>+100 points</p>

            <p>
                Question ${questionsAsked}
                / ${totalQuestions}
            </p>
        `;

    } else {

        lives--;

        updateGameInfo();

        gameArea.innerHTML = `
            <h2>❌ Wrong!</h2>

            <p>
                Correct answer:
                ${correctAnswer}
            </p>

            <p>
                ❤️ Lives remaining:
                ${lives}
            </p>
        `;

        // Game Over
        if (lives === 0) {

            setTimeout(function () {

                showGameOver();

            }, 1500);

            return;
        }
    }

    // Check whether questions are complete
    if (questionsAsked >= totalQuestions) {

    setTimeout(function () {

        completeLevel();

    }, 1500);
    } else {

        setTimeout(function () {

            startMemoryTest();

        }, 1500);
    }
}
function completeLevel() {

    
    if (currentLevel === Object.keys(levelData).length) {
    
        showFinalResult();
        
        return;
    }

    gameArea.innerHTML = `

        <h2>🎉 Level ${currentLevel} Complete!</h2>

        <p>
            You completed
            <strong>${levelData[currentLevel].name}</strong>
        </p>

        <p>
            Score: <strong>${score}</strong>
        </p>

        <button id="nextLevelButton">
            Next Level →
        </button>
    `;

    updateGameProgress();

    const nextLevelButton =
        document.getElementById("nextLevelButton");

    nextLevelButton.addEventListener("click", function () {

       currentLevel++;

if (currentLevel > highestUnlockedLevel) {
    highestUnlockedLevel = currentLevel;
}

        currentRound = 1;

        memoryData = {};

        questionsAsked = 0;

        questionQueue = [];

        updateGameInfo();

        startRound();

    });
}
function showFinalResult() {

    gameArea.innerHTML = `

        <h2>🏆 Congratulations!</h2>

        <p>
            You completed all levels!
        </p>

        <p>
            Final Score:
            <strong>${score}</strong>
        </p>

        <p>
            ❤️ Lives Remaining:
            ${lives}
        </p>

        <button onclick="location.reload()">
            Play Again
        </button>
    `;
}
function showResult() {

    gameArea.innerHTML = `
        <h2>🎉 Memory Test Complete!</h2>

        <p>Final Score: ${score}</p>

        <p>Lives Remaining: ${lives}</p>

        <button onclick="location.reload()">
            Play Again
        </button>
    `;
}
function shuffleArray(array) {

    return array.sort(() => Math.random() - 0.5);

}

function updateGameInfo() {

    // Update score
    scoreDisplay.textContent = score;

    // Update lives
    livesDisplay.textContent =
        "❤️".repeat(lives) +
        "🖤".repeat(3 - lives);

    // Update level dropdown
    levelDisplay.innerHTML = "";

    for (let level = 1; level <= highestUnlockedLevel; level++) {

        const option = document.createElement("option");

        option.value = level;
        option.textContent = level;

        if (level === currentLevel) {
            option.selected = true;
        }

        levelDisplay.appendChild(option);
    }
}



function updateGameProgress() {
    const area = document.getElementById("gameArea");
    if (!area) return;

    const existing = document.getElementById("gameProgress");
    if (existing) existing.remove();

    const progress = document.createElement("div");
    progress.id = "gameProgress";
    progress.className = "game-progress";

    const totalLevels = Object.keys(levelData).length;
    const percent = Math.max(0, Math.min(100, ((currentLevel - 1) / totalLevels) * 100));

    progress.innerHTML = `
        <div class="progress-meta">
            <span>Journey progress</span>
            <strong>${currentLevel} / ${totalLevels}</strong>
        </div>
        <div class="progress-track">
            <span style="width: ${percent}%"></span>
        </div>
    `;

    area.prepend(progress);
}

function showGameOver() 
{


gameArea.innerHTML = `

    <h2>💔 Out of Lives!</h2>

    <p>
        Don't worry! You can try
        <strong>Level ${currentLevel}</strong>
        again.
    </p>

    <p>
        Current Score:
        <strong>${score}</strong>
    </p>

    <button id="retryLevelButton">
        🔄 Try Level Again
    </button>

`;

updateGameProgress();

const retryLevelButton =
    document.getElementById("retryLevelButton");


retryLevelButton.addEventListener("click", function () {

    // Give 3 lives again
    lives = 3;

    // Reset current level's question data
    memoryData = {};

    questionsAsked = 0;

    questionQueue = [];

    // Reset viewing session
    viewCount = 1;

    // Update the top information
    updateGameInfo();

    // Start the SAME level again
    startRound();

});

}

