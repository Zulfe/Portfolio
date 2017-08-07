/**
 * Handles application hotkeys.
 */
$(window).keypress(function(event) {
    // Enter --> [Write Route]
    if(event.which == 13)
        $("#done").click();
    
    // 1 --> [Zone 1]
    else if(event.which == 49)
        $("#zone_1").click();
    
    // 2 --> [Zone 2]
    else if(event.which == 50)
        $("#zone_2").click();
    
    // 3 --> [Zone 3]
    else if(event.which == 51)
        $("#zone_3").click();

    // 4 --> [Zone 4]
    else if(event.which == 52)
        $("#zone_4").click();

    // 5 --> [Zone 5]
    else if(event.which == 53)
        $("#zone_5").click();

    // 6 --> [Zone 6]
    else if(event.which == 54)
        $("#zone_6").click();

    // p --> [Plot Route]
    else if(event.which == 112)
        $("#plot").click();
});

/**
* Handles the clicking of toolbar buttons by detecting the button clicked and calling its associated function.
* This particularly handles elements on the toolbar that are not entrance movement identification elements.
*/
$("#toolbar div").click(function(){
    var button_id = $(this).attr("id");

    if(zoneDrawEnabled) {
        if(button_id == "zone_1") {
            enableZoneDraw(1);
            dimPlotModeButtons();
            updateTerminal("Zone draw enabled for Zone 1.");
        }

        if(button_id == "zone_2") {
            enableZoneDraw(2);
            dimPlotModeButtons();
            updateTerminal("Zone draw enabled for Zone 2.");
        }
        
        if(button_id == "zone_3") {
            enableZoneDraw(3);
            dimPlotModeButtons();
            updateTerminal("Zone draw enabled for Zone 3.");
        }
        
        if(button_id == "zone_4") {
            enableZoneDraw(4); 
            dimPlotModeButtons();
            updateTerminal("Zone draw enabled for Zone 4.");
        }

        if(button_id == "zone_5") {
            enableZoneDraw(5);
            dimPlotModeButtons();
            updateTerminal("Zone draw enabled for Zone 5.");
        }
        
        if(button_id == "zone_6") {
            enableZoneDraw(6);
            dimPlotModeButtons();
            updateTerminal("Zone draw enabled for Zone 6.");
        }

        if(button_id == "plot") {
            enablePlotMode();
            dimDrawModeButtons();
            updateTerminal("Plot mode enabled.");
        }
    }
   
    if(plotModeEnabled) {
        if(button_id == "done")
            saveRoute();

        if(button_id == "clear_route")
            clearRoute();

        if(button_id == "clear")
            clearCanvas();

        if(button_id == "export")
            exportToCSV();
    }

    if(button_id == "import") {
        clearCanvas();
        triggerUpload(); 
    }

    if(button_id == "clear")
        clearCanvas();

    if($(this).attr("id") == "terminal")
        return;

});

/**
* Handles the clicking of entrance movement identification elements. Doing so should load the route configuration
* associated with it.
*/
$(".mvt_ids").click(function() {
    var elem_id = $(this).attr("id");
    var num_id = parseInt(objectKeyByValue(routeTo.ID, elem_id));

    if(num_id > route_number) {
        updateTerminal("You cannot edit this route without first completing all previous routes.");
        return;
    }
    else
        loadRoute(num_id);

    console.log("Setting " + routeTo.ID[lastAtRouteNumber] + " to it's previous color!");
    updateToolItemColor(routeTo.ID[lastAtRouteNumber], $("#" + routeTo.ID[lastAtRouteNumber]).data("prev-color"));
    updateToolItemColor(elem_id, "yellow");

    lastAtRouteNumber = num_id;
});


/**
*
*
*/
$(document).on("click", "img", function() {
    /*
    * Error Control
    */
    // If plot mode isn't active, don't allow arrows to be activated.
    if(!plotModeEnabled)
        return;

    var zone_elem = $(this).parent().parent().parent();
    var approach_elem = $(this).parent().parent();
    var zone = zone_elem.data("zone");
    var dir = approach_elem.data("dir");
    var mvt = $(this).data("mvt");
    
    // If there is an arrow already active in this zone, don't allow another arrow to become activated.
    if(approach_elem.data("active-arrows") == "1") {
        if($(this).data("active") == "1") {
            resetArrow(this, approach_elem);
            console.log("Deleting ["  + zone + ", " + dir + ", " + mvt + "] from the list of current route nodes.");
            seekAndAwaitReplace([zone, dir, mvt]);
        }
        else {
            updateTerminal("A movement arrow for this approach is already active.");
            return;
        }
    }
    // If there isn't one active, increment the number of active arrows.
    else {
        flashArrow($(this));

        var address = [zone, dir, mvt];
        console.log(zone);
        console.log(seekAndAwaitReplaceAddress[0]);
        if(seekAndAwaitReplaceIndex == -1 && seekAndAwaitReplaceAddress[0] != zone) {
            currentRoute.push(address);
            console.log("Adding ["  + zone + ", " + dir + ", " + mvt + "] to list of current route nodes.");
        }
        else {
            console.log("Replacing index " + seekAndAwaitReplaceIndex + " with [" + zone + ", " + dir + ", " + mvt + "]");
            executeReplacement(address);
        }
    }
});

/**
*
*
*/
$("#canvas").click(function(e) {
    if(!zoneDrawEnabled)
        return;
    // If a zone to draw has been clicked, allow a zone to be drawn.
    if(zoneDrawEnabled) {
        if(!zonesDrawn[zoneDrawNumber - 1])
            drawZoneBlock();
        else
            updateTerminal("You cannot draw multiples of Zone " + zoneDrawNumber);
    }
    else
        updateTerminal("No zone has been selected to draw.");
});

/**
* Every time the mouse moves in the canvas, store its position as to be most accurate when drawing in zones.
*/
$("#canvas").mousemove(function(mouseevent) {
    relX = mouseevent.pageX;
    relY = mouseevent.pageY;
});

/////////////////////////////////////////////////////////////////////////////////////////


$(window).keypress(function(event) {
});
