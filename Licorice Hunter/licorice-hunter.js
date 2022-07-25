// Find the anchor for the game and initialize the canvas
var anchor = document.getElementById("canvas-anchor");
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");

// Set resolutions for the game canvas as multiples of the tile sizes
canvas.id = "gameCanvas";
canvas.width = 50 * 10;
canvas.height = 50 * 10;

// Append the canvas to the element used as anchor
anchor.appendChild(canvas, anchor);


//=====================================
// Load graphic resources
//=====================================
// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.src = "images/bg.jpg";
bgImage.onload = function () {
    bgReady = true;
};

// Finnish ball image
var finnReady = false;
var finnImage = new Image();
finnImage.src = "images/finn.png";
finnImage.onload = function () {
    finnReady = true;
};

// Licorice image
var licoriceReady = false;
var licoriceImage = new Image();
licoriceImage.src = "images/licorice.png";
licoriceImage.onload = function () {
    licoriceReady = true;
};

// Sauna image
var saunaReady = false;
var saunaImage = new Image();
saunaImage.src = "images/sauna.png";
saunaImage.onload = function () {
    saunaReady = true;
};

// Initialize the game objects
var finn = {
    x: null,
    y: null,
    speed: 300 // (pixels/second)
};
var licorice = {
    x: null,
    y: null
};
var sauna = {
    x: null,
    y: null
};
var licoricesFound = 0;
var placeSauna = false;

// =====================================
// Input capture
// =====================================

var keysDown = {}; // List to track the keys down (can be many)

// Events for key-press and key-release
addEventListener("keydown", function (event) {
    event.preventDefault();
    var key = event.key || event.keyCode;
    keysDown[key] = true;
}, false);
addEventListener("keyup", function (event) {
    event.preventDefault();
    var key = event.key || event.keyCode;
    delete keysDown[key];
}, false);


// =====================================
// Utility functions
// =====================================

// Reset the player and licorice positions when player catches a licorice
var reset = function () {
    // Reset player's position to centre of canvas
    finn.x = canvas.width / 2;
    finn.y = canvas.height / 2;

    // Place the licorice somewhere on the canvas randomly
    spawnLicorice();
};

// Spawn a licorice somewhere in the map
var spawnLicorice = function () {
    licorice.x = (Math.random() * (canvas.width - licoriceImage.width));
    licorice.y = (Math.random() * (canvas.height - licoriceImage.height));
}

// Spawn a sauna somewhere in the map
var spawnSauna = function (place) {
    // If the time is correct spawn in map
    if (place) {
        sauna.x = (Math.random() * (canvas.width - saunaImage.width));
        sauna.y = (Math.random() * (canvas.height - saunaImage.height));

        // If the time is not correct, spawn out of bounds
    } else {
        sauna.x = 500;
        sauna.y = 500;
    }
}

var checkCollisions = function () {
    function areOverlapping(objectA, objectB) {
        const tileSize = 50;

        if (objectA.x < objectB.x + tileSize &&
            objectA.x + tileSize > objectB.x &&
            objectA.y < objectB.y + tileSize &&
            tileSize + objectA.y > objectB.y) {
            return true;
        }
        return false;
    }
    // Check if player and licorice collided
    if (areOverlapping(finn, licorice)) {
        console.log("Found licorice");
        ++licoricesFound;
        spawnLicorice();
    }

    // Check if player got into the sauna
    if (areOverlapping(finn, sauna)) {
        console.log("Warmed up at the sauna");
        count += 5;
        // Hide sauna
        spawnSauna(false);
    }
}

// =====================================
// Update game objects - change player position based on key pressed
// =====================================
var moveFinn = function (modifier) {
    if ("ArrowUp" in keysDown) { // Player is holding up key
        finn.y -= finn.speed * modifier;
    }
    if ("ArrowDown" in keysDown) { // Player is holding down key
        finn.y += finn.speed * modifier;
    }
    if ("ArrowLeft" in keysDown) { // Player is holding left key
        finn.x -= finn.speed * modifier;
    }
    if ("ArrowRight" in keysDown) { // Player is holding right key
        finn.x += finn.speed * modifier;
    }

    // Enforce movement bounds
    if (finn.x < 0) {
        finn.x = 0;
    }
    if (finn.x > canvas.width - finnImage.width) {
        finn.x = canvas.width - finnImage.width;
    }
    if (finn.y < 0) {
        finn.y = 0;
    }
    if (finn.y > canvas.height - finnImage.height) {
        finn.y = canvas.height - finnImage.height;
    }
};


// =====================================
// Render functions
// =====================================
var render = function () {
    if (bgReady) {
        ctx.drawImage(bgImage, 0, 0);
    }
    if (finnReady) {
        ctx.drawImage(finnImage, finn.x, finn.y);
    }
    if (licoriceReady) {
        ctx.drawImage(licoriceImage, licorice.x, licorice.y);
    }
    if (saunaReady) {
        ctx.drawImage(saunaImage, sauna.x, sauna.y);
    }

    if (!finished) {
        // Display score and time 
        ctx.font = "22px Helvetica";
        ctx.textAlign = "left";
        ctx.textBaseline = "top";
        ctx.fillStyle = "green";
        ctx.fillText("Licorices found: " + licoricesFound, 20, 20);
        ctx.fillStyle = "red";
        ctx.fillText("Frezing in: " + count, 20, 50);

    } else {
        // Display game over message when timer finished
        ctx.font = "38px Helvetica";
        ctx.textAlign = "center";
        ctx.fillText("You froze!", canvas.width / 2, canvas.height / 2 - 40);
        ctx.fillText("Score: " + licoricesFound, canvas.width / 2, canvas.height / 2 + 20);
        submitScore()
    }
};

//========================================
// Messages to communicate with a backend
//========================================
function saveGame() {
    let message = {
        messageType: "SAVE",
        gameState: {
            player: finn,
            score: licoricesFound,
            counter: counter,
            finished: finished
        }
    };
    parent.postMessage(message);
}

function loadGame() {
    let message = {
        messageType: "LOAD_REQUEST"
    };
    parent.postMessage(message);
}

function submitScore() {
    let message = {
        messageType: "SCORE",
        score: licoricesFound
    };
    parent.postMessage(message);
}

function settingMessage() {
    let message = {
        messageType: "SETTING",
        options: {
            "width": 540,
            "height": 540 //Integer
        }
    };
    parent.postMessage(message);
}

function receiveMessage(event) {
    if (event.data.messageType == "LOAD") {
        let data = event.data.gameState;
        finn = data.player;
        licoricesFound = data.score;
        counter = data.counter,
            finished = data.finished;
    }
}

//========================================
// Initialize timer and game end variables
//========================================
var count = 30; // how many seconds the game lasts for - default 30
var finished = false;
var counter = function () {
    if (!finished) {
        count = count - 1; // countown by 1 every second

        // Every 7 seconds trigger the sauna random aparition
        if (count % 7 == 0) {
            spawnSauna(true);
        } else {
            spawnSauna(false);
        }

        // Time ran out - game Over
        if (count <= 0) {
            // stop the timer
            clearInterval(counter);
            // set game to finished
            finished = true;
            count = 0;
            // hider licorice and finn
            licoriceReady = false;
            finnReady = false;
        }
    }
}
// Timer interval is every second (1000ms)
setInterval(counter, 1000);
// The main game loop
var main = function () {
    // Allow for movement
    moveFinn(0.02);
    // Check for collisions
    checkCollisions();
    // Render graphics
    render();

    // Request to do this again ASAP
    requestAnimationFrame(main);
};

//========================================
// Run the stuff
//========================================
var w = window;
// Cross-browser support for requestAnimationFrame
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;
reset();
main();