/**
 * @fileOverview Variables whose constant values are used across classes, functions, and loose code.
 * @author Damon A. Shaw of VDOT <Damon.Shaw@vdot.virginia.gov || admins@vt.edu>
 * @version Alpha-0.0.1
 */


/**
 * Initialization of a project variable on startup. Everything should have access to the data this object organizes.
 */
var PROJECT;
var importFiles;

/**
 * A local repository for all pulled images and other resources.
 */
var resources = {
    'images_intersection': []   
};

/**
 * A global switch for hopping between debug mode and production mode.
 */
var testMode = true;

var NUM_INTERSECTION_CONFIGS = 50;

var MIN_EFFECTIVE_ZONE = 0;
var NUM_ZONES = 6;

// var MIN_EFFECTIVE_ZONE = 1;
// var NUM_ZONES = 7;

var MIN_EFFECTIVE_DIR = 0;
var NUM_DIRS = 4;

var MIN_EFFECTIVE_ENTRY = 0;
var NUM_ENTRIES = 6;






/*
 * TCU Conversion
 */

var UNIVERSAL_RIGHT_TURN_ADJUSTMENT_FACTOR = 0.85;
var UNIVERSAL_LEFT_TURN_ADJUSTMENT_FACTOR  = 0.95;









var IntersectionEnum = {
    "0"  : "Conventional1",
    "1"  : "Conventional2",
    "2"  : "Conventional3",
    "3"  : "Conventional4",
    "4"  : "Conventional5",
    "5"  : "Conventional6",
    "6"  : "Conventional",
    "7"  : "Conventional",
    "8"  : "Conventional",
    "9"  : "Conventional",
    "10" : "Conventional",
    "11" : "Conventional",
    "12" : "Conventional",
    "13" : "Conventional",
    "14" : "Conventional",
    "15" : "Conventional",
    "16" : "Conventional",
    "17" : "Conventional",
    "18" : "Conventional",
    "19" : "Conventional",
    "20" : "Conventional",
    "21" : "Conventional",
    "22" : "Conventional",
    "23" : "Conventional",
    "24" : "Conventional",
    "25" : "Conventional",
    "26" : "Conventional",
    "27" : "Conventional",
    "28" : "Conventional",
    "29" : "Conventional",
    "30" : "Conventional",
    "31" : "undefined"
}

var DirectionEnum = {
    "0" : "southbound",
    "1" : "westbound",
    "2" : "northbound",
    "3" : "eastbound"
};

var UnboundDirectionEnum = {
    "0" : "north",
    "1" : "east",
    "2" : "south",
    "3" : "west"
};

var MASTERPCETABLE;
var USERVOLUMEDEFINITIONS;

// [END] ////////// [GLOBAL VARIABLES] ////////////////////
