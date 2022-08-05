// Find the anchor for the game and initialize the canvas
var anchor = document.getElementById("canvas-anchor");
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");

// Set resolutions for the game canvas (can be made dynamic for the feature we discussed)
canvas.id = "gameCanvas";
canvas.width = 25 * 50;     // 25 tiles or 1/4th of the total leghth
canvas.height = 15 * 50;    // Full height

// Append the canvas to the element used as anchor
anchor.appendChild(canvas, anchor);

//=====================================
// Load graphic resources
//=====================================
// Background image
var bgImage = {
    closed: new Image(),
    closedReady: false,
    station: new Image(),
    stationReady: false,
    missed: new Image(),
    missedReady: false,
}
bgImage.closed.src = "images/bgClosedBig.png";
bgImage.station.src = "images/bgOpenBig.png";
bgImage.missed.src = "images/bgMissedBig.png";
bgImage.closed.onload = function () {
    bgImage.closedReady = true;
};
bgImage.station.onload = function () {
    bgImage.stationReady = true;
};
bgImage.missed.onload = function () {
    bgImage.missedReady = true;
};

// Finnish ball image
var finnReady = false;
var finnImage = new Image();
finnImage.src = "images/finn.png";
finnImage.onload = function () {
    finnReady = true;
};

// HSL Agent ball image
var agentReady = false;
var agentImage = new Image();
agentImage.src = "images/hslAgent.png";
agentImage.onload = function () {
    agentReady = true;
};

// Initialize the gamemap masks
// 0 = free, 1 = blocked, 2 = sit, 3 = traveller, 4 = player
var mapMoving = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 2, 0, 0, 0, 0, 2, 0, 2, 2, 0, 2, 2, 0, 2, 0, 0, 0, 0, 2, 0, 2, 2, 0, 2, 2, 0, 2, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 2, 0, 2, 2, 0, 2, 2, 0, 2, 0, 0, 0, 0, 2, 0, 2, 2, 0, 2, 2, 0, 2, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 2, 0, 2, 2, 0, 2, 2, 0, 2, 0, 0, 0, 0, 2, 0, 2, 2, 0, 2, 2, 0, 2, 0, 0, 0, 0, 0, 1],
    [1, 2, 0, 0, 0, 0, 2, 0, 2, 2, 0, 2, 2, 0, 2, 0, 0, 0, 0, 2, 0, 2, 2, 0, 2, 2, 0, 2, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 2, 0, 2, 2, 0, 2, 2, 0, 2, 0, 0, 0, 0, 2, 0, 2, 2, 0, 2, 2, 0, 2, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 2, 0, 2, 2, 0, 2, 2, 0, 2, 0, 0, 0, 0, 2, 0, 2, 2, 0, 2, 2, 0, 2, 0, 0, 0, 0, 0, 1],
    [1, 2, 0, 0, 0, 0, 2, 0, 2, 2, 0, 2, 2, 0, 2, 0, 0, 0, 0, 2, 0, 2, 2, 0, 2, 2, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 2, 2, 0, 2, 2, 0, 2, 0, 0, 0, 0, 2, 0, 2, 2, 0, 2, 2, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 2, 2, 0, 2, 2, 0, 2, 0, 0, 0, 0, 2, 0, 2, 2, 0, 2, 2, 0, 2, 0, 0, 0, 0, 0, 1],
    [1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 2, 0, 0, 0, 0, 2, 0, 2, 2, 0, 2, 2, 0, 2, 0, 0, 0, 0, 2, 0, 2, 2, 0, 2, 2, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 2, 2, 0, 2, 2, 0, 2, 0, 0, 0, 0, 2, 0, 2, 2, 0, 2, 2, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 2, 2, 0, 2, 2, 0, 2, 0, 0, 0, 0, 2, 0, 2, 2, 0, 2, 2, 0, 2, 0, 0, 0, 0, 0, 1],
    [1, 2, 0, 0, 0, 0, 2, 0, 2, 2, 0, 2, 2, 0, 2, 0, 0, 0, 0, 2, 0, 2, 2, 0, 2, 2, 0, 2, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 2, 0, 2, 2, 0, 2, 2, 0, 2, 0, 0, 0, 0, 2, 0, 2, 2, 0, 2, 2, 0, 2, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 2, 0, 2, 2, 0, 2, 2, 0, 2, 0, 0, 0, 0, 2, 0, 2, 2, 0, 2, 2, 0, 2, 0, 0, 0, 0, 0, 1],
    [1, 2, 0, 0, 0, 0, 2, 0, 2, 2, 0, 2, 2, 0, 2, 0, 0, 0, 0, 2, 0, 2, 2, 0, 2, 2, 0, 2, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 2, 0, 2, 2, 0, 2, 2, 0, 2, 0, 0, 0, 0, 2, 0, 2, 2, 0, 2, 2, 0, 2, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 2, 0, 2, 2, 0, 2, 2, 0, 2, 0, 0, 0, 0, 2, 0, 2, 2, 0, 2, 2, 0, 2, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];

var mapStation = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 2, 0, 0, 0, 0, 2, 0, 2, 2, 0, 2, 2, 0, 2, 0, 0, 0, 0, 2, 0, 2, 2, 0, 2, 2, 0, 2, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 2, 0, 2, 2, 0, 2, 2, 0, 2, 0, 0, 0, 0, 2, 0, 2, 2, 0, 2, 2, 0, 2, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 2, 0, 2, 2, 0, 2, 2, 0, 2, 0, 0, 0, 0, 2, 0, 2, 2, 0, 2, 2, 0, 2, 0, 0, 0, 0, 0, 1],
    [1, 2, 0, 0, 0, 0, 2, 0, 2, 2, 0, 2, 2, 0, 2, 0, 0, 0, 0, 2, 0, 2, 2, 0, 2, 2, 0, 2, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 2, 0, 2, 2, 0, 2, 2, 0, 2, 0, 0, 0, 0, 2, 0, 2, 2, 0, 2, 2, 0, 2, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 2, 0, 2, 2, 0, 2, 2, 0, 2, 0, 0, 0, 0, 2, 0, 2, 2, 0, 2, 2, 0, 2, 0, 0, 0, 0, 0, 1],
    [1, 2, 0, 0, 0, 0, 2, 0, 2, 2, 0, 2, 2, 0, 2, 0, 0, 0, 0, 2, 0, 2, 2, 0, 2, 2, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 2, 2, 0, 2, 2, 0, 2, 0, 0, 0, 0, 2, 0, 2, 2, 0, 2, 2, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 2, 2, 0, 2, 2, 0, 2, 0, 0, 0, 0, 2, 0, 2, 2, 0, 2, 2, 0, 2, 0, 0, 0, 0, 0, 1],
    [1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 2, 0, 0, 0, 0, 2, 0, 2, 2, 0, 2, 2, 0, 2, 0, 0, 0, 0, 2, 0, 2, 2, 0, 2, 2, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 2, 2, 0, 2, 2, 0, 2, 0, 0, 0, 0, 2, 0, 2, 2, 0, 2, 2, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 2, 2, 0, 2, 2, 0, 2, 0, 0, 0, 0, 2, 0, 2, 2, 0, 2, 2, 0, 2, 0, 0, 0, 0, 0, 1],
    [1, 2, 0, 0, 0, 0, 2, 0, 2, 2, 0, 2, 2, 0, 2, 0, 0, 0, 0, 2, 0, 2, 2, 0, 2, 2, 0, 2, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 2, 0, 2, 2, 0, 2, 2, 0, 2, 0, 0, 0, 0, 2, 0, 2, 2, 0, 2, 2, 0, 2, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 2, 0, 2, 2, 0, 2, 2, 0, 2, 0, 0, 0, 0, 2, 0, 2, 2, 0, 2, 2, 0, 2, 0, 0, 0, 0, 0, 1],
    [1, 2, 0, 0, 0, 0, 2, 0, 2, 2, 0, 2, 2, 0, 2, 0, 0, 0, 0, 2, 0, 2, 2, 0, 2, 2, 0, 2, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 2, 0, 2, 2, 0, 2, 2, 0, 2, 0, 0, 0, 0, 2, 0, 2, 2, 0, 2, 2, 0, 2, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 2, 0, 2, 2, 0, 2, 2, 0, 2, 0, 0, 0, 0, 2, 0, 2, 2, 0, 2, 2, 0, 2, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];

var mapMissed = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];

// Cache the door locations
var doors = [3, 4, 16, 17, 29, 30, 36, 37, 49, 50, 62, 63, 69, 70, 82, 83, 95, 96];
var tunnels = [33, 66];

var stations = [
    "Matinkylä",
    "Niittykumpu",
    "Urheilupuisto",
    "Hagalund",
    "Aalto-yliopisto",
    "Keilaniemi",
    "Koivusaari",
    "Lauttasaari",
    "Ruoholahti",
    "Kamppi",
    "Rautatientori",
    "Helsingin yliopisto",
    "Hakaniemi",
    "Sörnäinen",
    "Kalasatama",
    "Kulosaari",
    "Herttoniemi",
    "Siilitie",
    "Itäkeskus",
    "Myllypuro",
    "Kontula",
    "Mellunmäki",
    "Puotila",
    "Rastila",
    "Vuosaari"
];

// Starting station
var currentStation = 0;

// Train state
var trainState = "stationed";

// Train direction
// 1: Matinkylä -> Vuosaari
//-1: Vuosaari -> Matinkylä
var direction = 1;

// Array for the hsl agent objects
var hslControllers = [];

// Player object
var finn = {
    x: null,
    y: null,
    speed: 500, // (pixels/second)
    inTrain: false
};

var canMove = true;
var AICanMove = true;

var started = false;

// Score keeping
var score = 0;

// =====================================
// Input capture
// =====================================

var keyDown = null;

// Events for key-press and key-release
addEventListener("keydown", function (key) {
    key.preventDefault();
    keyDown = key.keyCode;
});
addEventListener("keyup", function () {
    keyDown = null;
});
window.addEventListener("message", receiveMessage, false);

var difficultySlider = document.getElementById("difficultySlider");

// =====================================
// Utility functions
// =====================================

// Reset the player and licorice positions when player catches a licorice
function resetGame() {
    // Reset player's position to start of the station
    finn.x = 0;
    finn.y = 0;
    currentStation = 0;
    direction = 1;
    hslControllers = [];
    timeInStation = 5;
    timeToNextStation = 10;
    started = false;
    finished = false;
    score = 0;
    trainState = "stationed";
};

// Manhattan distane function for the A* heuristic
var manDistance = function (agent, finn) {
    return Math.abs(agent.x - finn.x) + Math.abs(agent.y - finn.y);
}

// Function to check for valid neighbors
function Neighbours(x, y) {
    let result = [];
    let currentPosition = { x: x, y: y };
    if (checkValidCell(currentPosition, 'n'))
        result.push({ x: x, y: y - 1 });
    if (checkValidCell(currentPosition, 'e'))
        result.push({ x: x + 1, y: y });
    if (checkValidCell(currentPosition, 's'))
        result.push({ x: x, y: y + 1 });
    if (checkValidCell(currentPosition, 'w'))
        result.push({ x: x - 1, y: y });
    return result;
}

// Node object representation for the A* algorithm
function Node(Parent, Point) {
    var newNode = {
        Parent: Parent,
        value: Point.x + (Point.y * 500),
        x: Point.x,
        y: Point.y,
        f: 0,
        g: 0
    };
    return newNode;
}

// A* algorithm to calculate paths from the agents to the player
var calculatePath = function (agent, finn) {
    // Set starting and desired end points
    var agentNode = Node(null, agent);
    var finnNode = Node(null, finn);

    let searchSize = 500;
    var AStar = new Array(searchSize);
    var openNodes = [agentNode];
    var closedNodes = [];

    var result = [];
    var neighbours;
    var currentNode;
    var myPath;
    var length, max, min, i, j;

    while (length = openNodes.length) {
        max = searchSize;
        min = -1;
        for (i = 0; i < length; i++) {
            if (openNodes[i].f < max) {
                max = openNodes[i].f;
                min = i;
            }
        }
        currentNode = openNodes.splice(min, 1)[0];
        if (currentNode.value === finnNode.value) {
            myPath = closedNodes[closedNodes.push(currentNode) - 1];
            do {
                result.push([myPath.x, myPath.y]);
            }
            while (myPath = myPath.Parent);
            AStar = closedNodes = openNodes = [];
            result.reverse();
        } else {
            neighbours = Neighbours(currentNode.x, currentNode.y);
            for (i = 0, j = neighbours.length; i < j; i++) {
                myPath = Node(currentNode, neighbours[i]);
                if (!AStar[myPath.value]) {
                    myPath.g = currentNode.g + manDistance(neighbours[i], currentNode);
                    myPath.f = myPath.g + manDistance(neighbours[i], finnNode);
                    openNodes.push(myPath);
                    AStar[myPath.value] = true;
                }
            }
            closedNodes.push(currentNode);
        }
    }
    return result;
}

// Spawn HSL controllers somewhere in the station
var spawnHSLController = function () {
    // Clear old agents
    hslControllers = [];

    // Spawn a random number of new controllers between 1 & the chosen value.
    let numControllers = Math.ceil(Math.random() * difficultySlider.value);

    for (var i = 0; i < numControllers; ++i) {
        let x = Math.ceil(Math.random() * 99);
        let agent = {
            x: x,
            y: 0,
        };
        hslControllers.push(agent);
    }
}

// Messages to communicate with the GamePlatform
function saveGame() {
    let message = {
        messageType: "SAVE",
        gameState: {
            player: finn,
            score: score,
            station: currentStation,
            direction: direction,
            hslControllers: hslControllers,
            timeInStation: timeInStation,
            timeToNextStation: timeToNextStation
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
        score: score
    };
    parent.postMessage(message);
}

function settingMessage() {
    let message = {
        messageType: "SETTING",
        options: {
            "width": 1040,
            "height": 540 //Integer
        }
    };
    parent.postMessage(message);
}

function receiveMessage(event) {
    if (event.data.messageType == "LOAD") {
        let data = event.data.gameState;
        finn = data.player;
        score = data.score;
        currentStation = data.station;
        direction = data.direction;
        hslControllers = data.hslControllers;
        timeInStation = data.timeInStation;
        timeToNextStation = data.timeToNextStation;
        finished = false;
    }
}

//========================================
// Movement controllers
//========================================

// Update game objects - change player position based on key pressed
var movement = function (modifier) {
    if (canMove) {
        if (keyDown == 38) { // Player is holding up key
            if (checkValidCell(finn, "n")) {
                finn.y -= 1;
                canMove = false;
            }
        }
        if (keyDown == 40) { // Player is holding down key
            if (checkValidCell(finn, "s")) {
                finn.y += 1;
                canMove = false;
            }
        }
        if (keyDown == 37) { // Player is holding left key
            if (checkValidCell(finn, "w")) {
                finn.x -= 1;
                canMove = false;
            }
        }
        if (keyDown == 39) { // Player is holding right key
            if (checkValidCell(finn, "e")) {
                finn.x += 1;
                canMove = false;
            }
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

        // Update whether the player is in the train or not
        finn.inTrain = checkInTrain(finn);

        if (!started && finn.inTrain) {
            started = true;
        }
    }
};

// Function to update the controllers position based on the A* path
var moveHSLControllers = function () {
    if (AICanMove) {
        hslControllers.forEach((agent) => {
            // Recalculate path
            let pathToFinn = calculatePath(agent, finn);

            // Move agent to next position in path
            let nextPosition = pathToFinn[1];
            if (nextPosition) {
                agent.x = nextPosition[0];
                agent.y = nextPosition[1];
                agent.inTrain = checkInTrain(agent);
            }
        });
        AICanMove = false;
    }
}

//========================================
// Validity checkers
//========================================

// Function to check if a tile is walkable
function canWalkHere(y, x) {
    let map = (trainState == "stationed" ? mapStation : mapMoving);
    return (map[y][x] == 0);
};

// Check whether the intended next position is valid
var checkValidCell = function (currentPosition, direction) {
    let valid = false;
    if (direction == "n" && currentPosition.y > 0 && canWalkHere(currentPosition.y - 1, currentPosition.x)) {
        valid = true && checkValidDoor(currentPosition, direction);
    }
    if (direction == "e" && currentPosition.x < 99 && canWalkHere(currentPosition.y, currentPosition.x + 1)) {
        valid = true;
    }
    if (direction == "s" && currentPosition.y < 9 && canWalkHere(currentPosition.y + 1, currentPosition.x)) {
        valid = true && checkValidDoor(currentPosition, direction);
    }
    if (direction == "w" && currentPosition.x > 0 && canWalkHere(currentPosition.y, currentPosition.x - 1)) {
        valid = true;
    }

    return valid;
}

// Check if the player can walk through a door
var checkValidDoor = function (currentPosition, direction) {
    let valid = true;
    if (currentPosition.y == 1) {
        if (direction == 's') {
            if (trainState != "stationed" || !(doors.includes(currentPosition.x))) {
                valid = false;
            }
        }
    } else if (currentPosition.y == 2) {
        if (direction == "n") {
            if (trainState != "stationed" || !(doors.includes(currentPosition.x))) {
                valid = false;
            }
        }
    }
    return valid;
}

// Check if the player has gotten on the train
var checkInTrain = function (currentPosition) {
    if (currentPosition.x > 0 && currentPosition.x < 99) {
        if (currentPosition.y > 1 && currentPosition.y < 9) {
            return true;
        }
    }
    return false;
}

// Check whether an HSL controller has gotten to the player
var checkCaught = function () {
    // Check if player touches either the controllers or the exits
    hslControllers.forEach((agent) => {
        if (agent.x == finn.x && agent.y == finn.y) {
            caught = true;
            finished = true;
        }
    });
}

//========================================
// Visual computation and rendering
//========================================

// Compute offset of the game elements to keep the player centered
var offset = function () {
    let mapLength = 100;
    let margin = 10;

    if (finn.x < margin) {
        return 0;
    } else if (finn.x >= margin && finn.x < mapLength - margin) {
        return (finn.x - margin) * -50;
    } else {
        return (mapLength - 20) * -50;
    }
}

// Draw everything on the canvas
var render = function () {
    // Render backgrounds
    if (bgImage.stationReady && bgImage.closedReady && bgImage.missedReady) {
        if (trainState == "stationed") {
            ctx.drawImage(bgImage.station, offset(), 0);
        } else if (trainState == "moving") {
            ctx.drawImage(bgImage.closed, offset(), 0);
        } else {
            ctx.drawImage(bgImage.missed, offset(), 0);
        }
    }

    // Render player object
    if (finnReady) {
        if (!tunnels.includes(finn.x) || !([3, 4, 5, 6]).includes(finn.y)) {
            ctx.drawImage(finnImage, finn.x * 50 + offset(), finn.y * 50);
        }
    }

    // Render HSL agents
    if (agentReady) {
        hslControllers.forEach((agent) => {
            if (trainState == "stationed" || agent.inTrain) {
                if (!tunnels.includes(agent.x) || !([3, 4, 5, 6]).includes(agent.y)) {
                    ctx.drawImage(agentImage, agent.x * 50 + offset(), agent.y * 50);
                }
            }
        });
    }

    // Display score and time 
    ctx.fillStyle = "rgb(100, 100, 100)";
    ctx.font = "24px Helvetica";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";

    if (started) {
        ctx.fillText("Station: " + stations[currentStation], 20, 20);
        ctx.fillText("Score: " + score, 20, 40);

        if (trainState == "stationed") {
            ctx.fillText("Train departs in: " + timeInStation, 750, 20);
        } else {
            ctx.fillText("Train arrives in: " + timeToNextStation, 750, 20);
        }
    } else {
        ctx.fillText("Get on the train to begin!", 20, 20);
    }


    // Display game over message when timer finished
    if (finished == true) {
        if (caught) {
            ctx.fillText("You were caught by HSL!", canvas.width / 2 - 150, canvas.height / 2 + 10);
        } else {
            ctx.fillText("You missed the train!", canvas.width / 2 - 150, canvas.height / 2 + 10);
        }
        ctx.fillText("Score: " + score, canvas.width / 2 - 150, canvas.height / 2 + 40);
        submitScore();
    }
};

//========================================
// Initialize timer and game end variables
//========================================
var timeInStation = 3;
var timeToNextStation = 5; // how many seconds to next station

var finished = false;
var caught = false;

var counter = function () {
    if (finished) {
        return;
    }
    if (started) {
        if (trainState == "stationed") {
            if (timeInStation > 0) {
                timeInStation--;
            } else {
                trainState = "moving";
                if (!finn.inTrain) {
                    trainState = "missed";
                    finished = true;
                }
                // Reset station timer
                timeInStation = 3;
            }
        } else {
            // Train is moving with you in it
            if (timeToNextStation > 0) {
                timeToNextStation--;

                // Increase score
                score += hslControllers.length + 1;

                // Train arrived at destination
            } else {
                trainState = "stationed";
                // Flip direction if at end of line
                if ((currentStation == 0 && direction == -1) || (currentStation == stations.length - 1 && direction == 1)) {
                    direction *= -1;
                }
                currentStation = currentStation + direction;
                // Reset travel timer
                timeToNextStation = 5;

                // Clear and respawn agents
                spawnHSLController();
            }
        }
    }
}
var movementTicker = function () {
    canMove = true;
}
var AITicker = function () {
    AICanMove = true;
}

// timer interval is every second (1000ms)
setInterval(counter, 1000);
setInterval(movementTicker, 150);
setInterval(AITicker, 300);

// The main game loop
var main = function () {
    // Allow for movement
    if (!finished) {
        movement(0.02);
        // Update HSL controller positions
        moveHSLControllers();
    }
    // Check for collisions
    checkCaught();
    // Render graphics
    render();
    // Request to do this again ASAP
    requestAnimationFrame(main);
};

//========================================
// Run the stuff
//========================================
var w = window;
// Send message to parent to size iframe
settingMessage();
// Cross-browser support for requestAnimationFrame
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;
resetGame();
main();