/**
* Handles the clicking of toolbar buttons by detecting the button clicked and calling its associated function.
* This particularly handles elements on the toolbar that are not entrance movement identification elements.
*/
$("#toolbar div").click(function(){
    var button_id = $(this).attr("id");

    if(button_id == "zone_1")
        enableZoneDraw(1);
    
    if(button_id == "zone_2")
        enableZoneDraw(2);
    
    if(button_id == "zone_3")
        enableZoneDraw(3);
    
    if(button_id == "zone_4")
        enableZoneDraw(4); 

    if(button_id == "zone_5")
        enableZoneDraw(5);
    
    if(button_id == "zone_6")
        enableZoneDraw(6);
   
    if(button_id == "plot")
        enablePlotMode();

    if(button_id == "done")
        saveRoute();

    if(button_id == "clear")
        clearCanvas();

    if(button_id == "import")
        triggerUpload();

    if(button_id == "export")
        exportToCSV();


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
        updateTerminal("You cannot edit this route without first writing all previous routes.");
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
* Every time the mouse moves in the canvas, store its position as to be most accurate when drawing in zones.
*/
$("#canvas").mousemove(function(mouseevent) {
    relX = mouseevent.pageX;
    relY = mouseevent.pageY;
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

    /*
    * NEED TO REMOVE ENTRY FROM ARRY WHEN AN ARROW IS DISABLED!!!!!!!!!!!!!!!!!!!!!!!!!!!
    *
    ************************************************/

    var zone_elem = $(this).parent().parent().parent();
    var mvt = $(this).data("mvt");
    var dir = $(this).parent().parent().data("dir");
    var zone = zone_elem.data("zone");

    // If there is an arrow already active in this zone, don't allow another arrow to become activated.
    if(zone_elem.data("active-arrows") == "1") {
        if($(this).data("active") == "1") {
            $(this).data("active", "0");
            zone_elem.data("active-arrows", "0");
            resetArrow(this, $(this).data("interid"));
            console.log("Deleting ["  + zone + ", " + dir + ", " + mvt + "] from the list of current route nodes.");
            seekAndDestroy([zone, dir, mvt]);
        }
        else {
            updateTerminal("A movement arrow for this zone is already active.");
            return;
        }
    }
    // If there isn't one active, increment the number of active arrows.
    else {
        zone_elem.data("active-arrows", "1");
        $(this).data("active", "1");

        var mvt = $(this).data("mvt");
        var dir = $(this).parent().parent().data("dir");
        var zone = zone_elem.data("zone");
      
        flashArrow($(this));

        console.log("Adding ["  + zone + ", " + dir + ", " + mvt + "] to list of current route nodes.");
        currentRoute.push([zone, dir, mvt]);
    }
});

/**
*
*
*/
$("#canvas").click(function(e) {
   /* if(!volumesEntered) {
        updateTerminal("You haven't entered any input volumes yet.");
        return;
    }*/
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
