// Create a canvas and append it to the html
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");

// Set resolutions for the game canvas (can be made dynamic for the feature we discussed)
canvas.id = "gameCanvas";
canvas.width = 500;
canvas.height = 500;
document.body.insertBefore(canvas, document.body.firstChild);


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
    speed: 500 // (pixels/second)
};
var licorice = {
    x: null,
    y: null,
};
var sauna = {
    x: null,
    y: null,
};
var licoricesFound = 0;
var placeSauna = false;

// =====================================
// Input capture
// =====================================

var keysDown = {}; // List to track the keys down (can be many)

// Events for key-press and key-release
addEventListener("keydown", function (key) {
    key.preventDefault();
    keysDown[key.keyCode] = true;
}, false);
addEventListener("keyup", function (key) {
    key.preventDefault();
    delete keysDown[key.keyCode];
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
var spawnLicorice = function(){
    licorice.x = (Math.random() * (canvas.width - licoriceImage.width));
    licorice.y = (Math.random() * (canvas.height - licoriceImage.height));
}

// Update game objects - change player position based on key pressed
var moveFinn = function (modifier) {
    if (38 in keysDown) { // Player is holding up key
        finn.y -= finn.speed * modifier;
    }
    if (40 in keysDown) { // Player is holding down key
        finn.y += finn.speed * modifier;
    }
    if (37 in keysDown) { // Player is holding left key
        finn.x -= finn.speed * modifier;
    }
    if (39 in keysDown) { // Player is holding right key
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

var checkCollision = function (){
    // Check if player and licorice collider
    var licCenterX = licorice.x + licoriceImage.width / 2;
    var licCenterY = licorice.y + licoriceImage.height / 2;

    if (licCenterX >= finn.x && licCenterX <= finn.x + finnImage.width
        && licCenterY >= finn.y && licCenterY <= finn.y + finnImage.height) {
        console.log("Found licorice");
        ++licoricesFound;
        spawnLicorice();
    }

    // Check if player got into the sauna
    var saunaCenterX = sauna.x + saunaImage.width / 2;
    var saunaCenterY = sauna.y + saunaImage.height / 2;
    
    if (saunaCenterX >= finn.x && saunaCenterX <= finn.x + finnImage.width
        && saunaCenterY >= finn.y && saunaCenterY <= finn.y + finnImage.height) {
        console.log("Warmed up at the sauna");
        count += 5;
        // Hide sauna
        spawnSauna(false);
    }
}

// Spawn a sauna somewhere in the map
var spawnSauna = function(place){
    // If the time is correct spawn in map
    if (place) {
        sauna.x = (Math.random() * (canvas.width - saunaImage.width));
        sauna.y = (Math.random() * (canvas.height - saunaImage.height));

    // If the time is not correct, spawn out of bounds
    }else{
        sauna.x = 500;
        sauna.y = 500;
    }
}

// Draw everything on the canvas
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

    // Display score and time 
    ctx.fillStyle = "rgb(100, 100, 100)";
    ctx.font = "24px Helvetica";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText("Licorices found: " + licoricesFound, 20, 20);
    ctx.fillText("Time: " + count, 20, 50);

    // Display game over message when timer finished
    if (finished == true) {
        ctx.fillText("You froze to death", canvas.width / 2 - 30, canvas.height / 2 + 10);
        ctx.fillText("Score: " + licoricesFound, canvas.width / 2 - 30, canvas.height / 2 + 40);
        submitScore()
    }
};

// Messages to communicate with the GamePlatform
function saveGame(){
    let message = {
        messageType: "SAVE",
        gameState: {
            player: finn,
            score: licoricesFound,
            counter: counter,
            finished : finished
        }
    };
    parent.postMessage(message);
}

function loadGame(){
    let message = {
        messageType: "LOAD_REQUEST"
    };
    parent.postMessage(message);
}

function submitScore(){
    let message = {
        messageType: "SCORE",
        score: licoricesFound
    };
    parent.postMessage(message);
}

function settingMessage(){
    let message = {
        messageType: "SETTING",
        options: {
            "width": 540,
            "height": 540 //Integer
        }
    };
    parent.postMessage(message);
}

function receiveMessage(event){
    if(event.data.messageType == "LOAD"){
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
    if (!finished){
        count = count - 1; // countown by 1 every second
    
        // Every 7 seconds trigger the sauna random aparition
        if (count % 7 == 0 || count % sauna == 6) {
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
// timer interval is every second (1000ms)
setInterval(counter, 1000);
// The main game loop
var main = function () {
    // Allow for movement
    moveFinn(0.02);
    // Check for collisions
    checkCollision();
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