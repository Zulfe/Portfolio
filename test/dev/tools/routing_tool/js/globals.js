var zoneDrawEnabled = true;
var plotModeEnabled = false;
var plottingStarted = false;

// Describes the number of the selected zone so that when the zone block is drawn the correct identification number can be
// printed inside of it.
var zoneDrawNumber  = 0;
// A state array where each index (+1) represents the corresponding zone. This is used to keep track of which zones have been
// drawn so the user cannot draw multiples of the same zone.
var zonesDrawn = [false, false, false, false, false, false];

// Used for keeping track of how many zones have been drawn. For some reason every time a zone is drawn the next zone to be
// drawn is placed the height of the zone block beneath the mouse position. By counting the number of clicks (or zones drawn),
// the element can be moved up numClicks times the height of the zone block.
// The same effect as numClicks can be achieved by counting the number of true values in the zonesDrawn array, but it's more
// efficient to use a counter than to traverse the array each time.
var numClicks = 0;
// Used for keeping track of the mouse position on the screen.
var relX = 0;
var relY = 0;

// Stores all interval objects so that they may be killed at a later point.
var intervals = [];

// Used for keeping track of the latest incomplete route.
var route_number = 0;
// Used for keeping track of the latest route the user has been working on.
var lastAtRouteNumber = 0;

// Stores "enumerations" that allows converting between route identifiers.
var routeTo = new Object();
routeTo.Address = {
    "0" : [0, 0, 0],
    "1" : [0, 0, 1],
    "2" : [0, 0, 2],
    "3" : [0, 1, 0],
    "4" : [0, 1, 1],
    "5" : [0, 1, 2],
    "6" : [0, 2, 0],
    "7" : [0, 2, 1],
    "8" : [0, 2, 2],
    "9" : [0, 3, 0],
    "10" : [0, 3, 1],
    "11" : [0, 3, 2]
}
routeTo.ID = {
    "0" : "SBL",
    "1" : "SBT",
    "2" : "SBR",
    "3" : "WBL",
    "4" : "WBT",
    "5" : "WBR",
    "6" : "NBL",
    "7" : "NBT",
    "8" : "NBR",
    "9" : "EBL",
    "10" : "EBT",
    "11" : "EBR"
}
routeTo.Verbal = {
    "0" : "Southbound Left",
    "1" : "Southbound Through",
    "2" : "Southbound Right",
    "3" : "Westbound Left",
    "4" : "Westbound Through",
    "5" : "Westbound Right",
    "6" : "Northbound Left",
    "7" : "Northbound Through",
    "8" : "Northbound Right",
    "9" : "Eastbound Left",
    "10" : "Eastbound Through",
    "11" : "Eastbound Right"
}

var currentRoute = [];
var totalRoutes = [];

var seekAndAwaitReplaceIndex = -1;
var seekAndAwaitReplaceAddress = [-1, -1, -1];

var timeTool = new Date();
