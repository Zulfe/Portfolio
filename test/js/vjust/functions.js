/**
 * @fileOverview Generally useful functions not of a greater structure or purpose. Typically used once or twice
 * throughout the program but isolated to achieve cleaner code.
 * @author Damon A. Shaw of VDOT <Damon.Shaw@vdot.virginia.gov || admins@vt.edu>
 * @version Alpha-0.0.1
 */


/**
 * A toggle for the forced displaying of help modals when a relative text box has been clicked.
 * @param {boolean} toggleSwitch A <tt>true</tt> or <tt>false</tt> value indicating if first time modals should be activated
 */
var toggleFirstVisitInputModals = function(toggleSwitch){
    if(toggleSwitch){
        $("#projNameInput").click(function(){
            $("#projNameHelp").modal("show");
            $(this).unbind();
            $("#projNameHelp.button").click(function(){$("#projNameInput").focus()});
        }); 
        $("#interNameInput").click(function(){
            $("#interNameHelp").modal("show");
            $(this).unbind();
        });
        $("#nsRouteNameInput").click(function(){
            $("#nsRouteNameHelp").modal("show");
            $(this).unbind();
        });
        $("#ewRouteNameInput").click(function(){
            $("#ewRouteNameHelp").modal("show");
            $(this).unbind();
        });
        $("#cpOneNameInput").click(function(){
            $("#cpOneNameHelp").modal("show");
            $(this).unbind();
        });
    }
    else{
        $("#projNameInput, #interNameInput, #nsRouteNameInput, #ewRouteNameInput, #cpOneNameInput").unbind();
    }
};



/**
 * Use an image's URL to get the image and store pull its image data for local storage. This is particularly useful for this
 * application as it aims to collect all necessary resources in case the user disconnects.
 * @param {string} URL The URL of the image
 * @returns {string} The image's data
 */
var getImageData = function(URL){
    var image = new Image();
    image.crossOrigin = "Anonymous";

    var canvas = document.createElement("canvas");
    var canvasContext = canvas.getContext("2d");

    image.src = URL;

    canvas.width = image.width;
    canvas.height = image.height;

    canvasContext.drawImage(image, 0, 0, image.width, image.height);

    return canvas.toDataURL();
};



/**
 * [WORK IN PROGRESS]
 * Find and store locally all resources necessary in the functioning of the application. In VJuST, that means images of intersections.
 */
var acquireResources = function(){

    var def = $.Deferred();

    //resources["images_intersection"].push(getImageData("http://i.imgur.com/KUuRtTc.jpg"));
  
    if(testMode)
        setTimeout(function(){
            console.log("Acquiring resources...");
            def.resolve();
        }, 3000);
    else
        def.resolve();

    return $.when(def).done(function(){
        console.log("Done loading resources!");
    }).promise();
}

// @function killLoader
// @purpose  Fade out the loading screen and wait for a short period to avoid clipping of
//           content elements over the partially faded loading screen.
var killLoader = function(){
    var def = $.Deferred();

    $("#init_loader").transition("fade");

    setTimeout(function(){
        console.log("Killed loader! Page contents should be fading in now.");
        def.resolve();
    }, 300);

    return $.when(def).promise();
}

/**
 * Part of the [Acquire Resources] -> [Hide Loader] -> [Show Content] sequence. 
 *
 */
var awakenContent = function() {
    var def = $.Deferred();

    $("#init_loader").children().slice(1).transition({
        animation  : "fade",
        duration   : "1000ms",
    });

    setTimeout(function() {
        console.log("Waking up content...");
        def.resolve();
    }, 20);

    return def.promise();
}

/**
 * 
 * @returns {promise} A deferred promise.
 */
var killContent = function() {
    var def = $.Deferred();

    $("#init_loader").children().slice(1).transition({
        animation: "fade",
        duration:  "1100ms",
        onComplete: function(){ def.resolve() }
    }); 

    return def.promise();
}

var toggleLoader = function(flag, message) {
    if(flag) {
        if(message === undefined) {
            $("#init_loader").children().first()[0].innerHTML = "Doing something...";
            killContent().done(function() {
                $("#init_loader").transition({
                    animation: "fade",
                    duration:  "2000ms"
                });
            });
        }
        else {
            $("#init_loader").children().first()[0].innerHTML = message;
            killContent().done(function() {
                $("#init_loader").transition({
                    animation: "fade",
                    duration:  "2000ms"
                });
            });
        }
    }
    else {
        killLoader().done(function(){
            $("#init_loader").children().slice(1).transition("fade", 1700);
        });
    }
}

/**
 * Calculates the initial laneage for a zone based on strict rules
 */
var calculateLanesByRules = function(left, through, right, opp_left, opp_through, adj_left, base_through, base_left, base_right) {
    
    var left_lanes, through_lanes, right_lanes, left_shared, right_shared, channelized_right;
    
    left_lanes = 0;
    left_shared = 0;
    if (left >= 800)
        left_lanes = 2;
    else if (left >= 400) 
        left_lanes = 1;
    left_lanes = Math.max(left_lanes, base_left);
    
    right_lanes = 0;
    right_shared = 0;
    if (right >= 400)
        right_lanes = 1;
    right_lanes = Math.max(right_lanes, base_right);    
    
    through_lanes = 0;
    through_lanes = Math.ceil( (through + 1) / 800);
   
    if ( Math.max((Math.max(left, 0) - (left_lanes * 400),0) + Math.max(through, 0) + Math.max(Math.max(right, 0) - (right_lanes * 400), 0) ) / through_lanes <= 800) {
        left_shared  = left_lanes < 2 && left > 400 ? 1 : 0;
        right_shared = right > 400 ? 1 : 0;
    }
    
    if (left_lanes === 0 && left != -1) {
        if (through !== -1 || right !== -1)
            left_shared = 1;
        else
            left_lanes = 1;
    } 
    
    if (right_lanes == 1 && through == -1 && left_lanes > 1) {
        right_shared = 0;
    } 
    
    var through_equivalents = Math.max(0, through)
                            + Math.max(0, right - right_lanes * 400) / 0.85
                            + Math.max(0, left - left_lanes * 400) / 0.95 * 2;
    
    if (through_lanes !== 0) 
        through_lanes = Math.min(base_through + 2, Math.ceil(through_equivalents / 800));
        
    if (right_lanes + right_shared === 0 && right != -1) {
        if (through_equivalents - (800 * (through_lanes - 1) ) < 800 - right)
            right_shared = 1;
        else
            right_lanes = 1;
    } 
    
    return [left_lanes, through_lanes, right_lanes, left_shared, right_shared, 0];
}

// Credit to StackOverflow's Pawel
var objectKeyByValue = function(obj, val) {
      return Object.entries(obj).find(i => i[1] === val)[0];
}

var buildImportFilelist = function(evt) {
    importFiles = evt.target.files;
    project.importConfigFromCSV();
}

// [END] ////////// [FUNCTIONS] ///////////////////
