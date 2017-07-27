/**
* Updates the text in the "terminal" box with the passed string.
* @param {string} message The message to print to the terminal
*/
var updateTerminal = function(message) {
    // Create a new Date object to get the time current to the function call.
    timeTool = new Date();
    $("#terminal").html("Terminal [" + timeTool.getUTCHours() + ":" + timeTool.getUTCMinutes() + ":" + timeTool.getUTCSeconds() + "]: &nbsp;&nbsp;&nbsp;" + message);
}

var dimPlotModeButtons = function() {
    $("#done").addClass("dimmed_write");
    $("#clear_route").addClass("dimmed_clearroute");

    $("#zone_1, #zone_2, #zone_3, #zone_4, #zone_5, #zone_6").removeClass("dimmed_zone");
    $("#clear").removeClass("dimmed_clear");
}

var dimDrawModeButtons = function() {
    $("#done").removeClass("dimmed_write");
    $("#clear_route").removeClass("dimmed_clearroute");

    $("#zone_1, #zone_2, #zone_3, #zone_4, #zone_5, #zone_6").addClass("dimmed_zone");
    $("#clear").addClass("dimmed_clear");
}

// !!! THIS FUNCTION CAN BUT SHOULDN'T APPLY TO ALL TOOLBAR ACTION BUTTONS. THIS SHOULD ONLY WORK FOR ROUTE CONFIGURATION BUTTONS !!!
/**
 * Set the background color of the toolbar item specified to the color specified.
 * @param {string} tool_elem The ID of the element to be modified
 * @param {string} color The color to change it to; either a verbal color (yellow) or a hex color (#CCCCCC)
 */
var updateToolItemColor = function(tool_elem, color) {
    var _this = "#" + tool_elem;
    // Set data attribute for storing the previous color to the current background color.
    // This is used for returning a block to color it was at before editing when navigating between routes configurations.
    console.log("Read previous color from " + _this + " as " + $(_this).attr("data-prev-color"));
    $(_this).attr("data-prev-color", $(_this).css("background-color"));
    // Set the current background color to the passed color.
    $(_this).css("background-color", color);
}

// !!! THIS FUNCTION'S NAME IS POOR AND DOESN'T WELL REPRESENT WHAT IT IS DOING --- CONSIDER REVISING !!!
/**
 *  
 *
 */
var updateMovementBlocksColor = function(color) {
    jQuery.each($(".mvt_ids"), function(index, object) {
        $(object).css("background-color", color);
    });
}

var updateMovementBlocksPrevColor = function(color) {
    console.log("Updating all movement blocks prev-colors to " + color);
    jQuery.each($(".mvt_ids"), function(index, object) {
        $(this).attr("data-prev-color", color);
    });
}

/**
* Clear all zone blocks from the canvas, reset all variables to initial states, and set the colors of the entrance
* movement blocks back to gray.
*/
var clearCanvas = function() {
    // Count the number of drawn zone blocks and subtract it from the stored total number of clicks.
    // Still not sure why it's like this, but it keeps newly drawn zone blocks from being placed way
    // above or way below the mouse.
    numClicks = numClicks - zonesDrawn.filter(v => v).length;
    // Set the latest incomplete route and latest accessed route numbers to SBL.
    route_number, lastAtRouteNumber = 0;
    // Set the application's mode to nothing. Clicks to the canvas are ignored.
    zoneDrawEnabled, plotModeEnabled, plottingStarted = false;
    
    // Set the draw state of all zones to false. None of the zones are drawn now.
    zonesDrawn = [false, false, false, false, false, false];
    // Clear the stored routes.
    totalRoutes = [];
    // Clear the currently stored movements.
    currentRoute = [];

    // Remove all zone blocks and their contents from the canvas.
    $("#canvas").children().remove();
    // Set the background color of all entrance blocks on the toolbar to gray.
    updateMovementBlocks("#CCCCCC");
    updateTerminal("The canvas has been cleared");
}

// !!! resetArrow() REQUIRES AN ARROW ELEMENT AND AN APPROACH 
/**
* Given an arrow object or ID string, start a color change interval, log the arrow's interval ID in its associated data attribute,
* mark the arrow as active via its associated data attribute, and mark its approach parent as having one active arrow via its associated
* data attribute. Add the interval to the intervals array for later management.
* @param {string} arrow_elem The ID of the arrow in reference form (#arrow)
*/
var flashArrow = function(arrow_elem) {
    // Create an interval for the given arrow element and store the Interval object so that it may be managed later.
    var int = setInterval(function() {
        if($(arrow_elem).css("background-color") == "rgb(255, 165, 0)") {
            $(arrow_elem).css("background-color", "blue");
        }
        else {
            $(arrow_elem).css("background-color", "orange");
        }
    }, 400);
    // Add the newly created interval to the interval array so that it can be referenced and managed later.
    intervals.push(int);
    // Store the arrow's associated color change interval with the arrow via its interid data attribute.
    $(arrow_elem).attr("data-interid", int.toString());
    // Mark the arrow as active by setting its corresponding data attribute to 1, true, or active
    $(arrow_elem).attr("data-active", "1");
    // Mark the approach as having one active arrow by setting its corresponding data attribute to 1
    $(arrow_elem).parent().parent().attr("data-active-arrows", "1");
}

/**
* Mark the given arrow as inactive, its approach as having no active arrows, then kill the color change interval associated
* with the arrow. Set the arrow's background color back to black to clear the interval's last color.
* @param {string|Object} arrow_elem The ID of the arrow in reference form (#arrow) or as a jQuery object (<tt>$(this)</tt>)
* @param {string|Object} approach_elem The ID of the approach in reference form (#approach) or as a jQuery object (<tt>$(this)</tt>)
*/
var resetArrow = function(arrow_elem, approach_elem) {
    $(arrow_elem).attr("data-active", "0");
    $(approach_elem).attr("data-active-arrows", "0");
    clearInterval($(arrow_elem).attr("data-interid"));
    $(arrow_elem).css("background-color", "black");
}

/**
* Kill the color change interval for all arrows. Since new intervals are created through the route load function, running this
* function will not impact color change intervals for other route configurations.
*/
var resetArrows = function() {
    // For each of the interval objects in the global interval array...
    intervals.forEach(function(interval, index) {
        // clear the interval.
        clearInterval(interval); 
    });
    // Dispose of the current interval array and set it to a fresh, element-less array.
    intervals = [];

    // Set the background color of all images in every zone back to black in case that, when the interval stopped, the movement's
    // background color was something other than black.
    $(".zone_block img").css({
        "background-color" : "black",
        "visibility" : "visible"
    });
    // Set the active data attribute of all arrows to 0, off, or false.
    $(".zone_block img").attr("data-active", "0");
    // Set the number of active arrows data attribute of all approaches to 0 or none.
    $(".approach").attr("data-active-arrows", "0");
}

/**
 * Add a zone block to the canvas at a given position.
 * @param {int} topval The distance, in pixels, that the zone block should be drawn from the top of the window
 * @param {int} leftval The distance, in pixels, that the zone block should be drawn from the left of the window
 */
var drawZoneBlock = function(topval, leftval) {
    // Increment the number of clicks on the canvas pertaining to zone block drawings. For some reason blocks are drawn
    // a block's height below the mouse for each zone-enabled click made on the canvas.
    numClicks++;

    // Generate a random identification value to set the block's id tag to. The bounds of the substring may need to be
    // widened as with three characters it's unlikely yet probable that the same UID is generated twice.
    var UID = Math.random().toString(36).substring(2,5);
    var zone_block_html =
"                        <div id='" + UID + "' class='zone_block' style='visibility: hidden;' data-zone='" + zoneDrawNumber + "' data-active-arrows='0'>" +
"                            <div class='top_arrows approach' data-dir='0' data-active-arrows='0'>" +
"                                <div class='imggrp'>" +
"                                    <img data-mvt='0' data-active='0' data-interid='-1' src='assets/arrow_left.svg' />" +
"                                    <img data-mvt='1' data-active='0' data-interid='-1' class='through' src='assets/arrow_through.svg' />" +
"                                    <img data-mvt='2' data-active='0' data-interid='-1' src='assets/arrow_right.svg' />" +
"                                </div>" +
"                            </div>" +
"                            <div class='left_arrows approach' data-dir='3' data-active-arrows='0'>" +
"                                <div class='imggrp'>" +
"                                    <img data-mvt='0' data-active='0' data-interid='-1' src='assets/arrow_left.svg' />" +
"                                    <img data-mvt='1' data-active='0' data-interid='-1' class='through' src='assets/arrow_through.svg' />" +
"                                    <img data-mvt='2' data-active='0' data-interid='-1' src='assets/arrow_right.svg' />" +
"                                </div>" +
"                            </div>" +
"                            <div class='bot_arrows approach' data-dir='2' data-active-arrows='0'>" +
"                                <div class='imggrp'>" +
"                                    <img data-mvt='0' data-active='0' data-interid='-1' src='assets/arrow_left.svg' />" +
"                                    <img data-mvt='1' data-active='0' data-interid='-1' class='through' src='assets/arrow_through.svg' />" +
"                                    <img data-mvt='2' data-active='0' data-interid='-1' src='assets/arrow_right.svg' />" +
"                                </div>" +
"                            </div>" +
"                            <div class='right_arrows approach' data-dir='1' data-active-arrows='0'>" +
"                                <div class='imggrp'>" +
"                                    <img data-mvt='0' data-active='0' data-interid='-1' src='assets/arrow_left.svg' />" +
"                                    <img data-mvt='1' data-active='0' data-interid='-1' class='through' src='assets/arrow_through.svg' />" +
"                                    <img data-mvt='2' data-active='0' data-interid='-1' src='assets/arrow_right.svg' />" +
"                                </div>" +
"                            </div>" +
"                            <div class='zone_num'>" +
"                                " + zoneDrawNumber +
"                            </div>" +
"                        </div>";

    
    // Add the dynamically generated zone block HTML code to the canvas, beneath all existing children.
    $("#canvas").append(zone_block_html);
     
    // If a value for neither topval nor leftval has been specified (method has been called from a click
    // event and is using the mouse position in the window for reference), set the position of the zone
    // block using some maths.
    if(topval === undefined && leftval === undefined) {
        $("#" + UID).css({
            position: 'relative',
            left: relX - 85,
            top: "calc(" + relY + "px - " + numClicks + " * 10.5em)"
        });
    }
    // If topval and leftval have been specified (method has been called from the import function with
    // left and top values collected from the CSV file), use those values for positioning the block.
    else {
        console.log("Placing a zone block at " + leftval + ", " + topval);
        $("#" + UID).css({
            position: 'relative',
            left: leftval.toString() + "px",
            top: topval.toString() + "px"
        });
    }
    
    // Now that the block has been generated and positioned, make it visible to the user.
    $("#" + UID).css("visibility", "visible");

    // Mark the zone number for the drawn block as drawn so that another may not be drawn.
    zonesDrawn[zoneDrawNumber - 1] = true;
}
