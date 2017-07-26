/**
* Updates the text in the "terminal" box with the passed string.
*/
var updateTerminal = function(message) {
    timeTool = new Date();
    $("#terminal").html("Terminal [" + timeTool.getUTCHours() + ":" + timeTool.getUTCMinutes() + ":" + timeTool.getUTCSeconds() + "]: &nbsp;&nbsp;&nbsp;" + message);
}
    
var updateToolItemColor = function(tool_elem, color) {
    var _this = "#" + tool_elem;
    console.log("Updating " + $(_this).attr("id") + " and its prev-color data to " + $(_this).data("prev-color"));
    $(_this).attr("data-prev-color", $(_this).css("background-color"));
    $(_this).css("background-color", color);
}

var updateMovementBlocks = function(color) {
    jQuery.each($(".mvt_ids"), function(index, object) {
        updateToolItemColor($(object).attr("id"), "#94B95B");
    });
}

var overwriteMovementBlockPrevColor = function(color) {
    for(var i = 0; i < 12; i++)
        $("#" + routeTo.ID[i]).attr("data-prev-color", color);
}

/**
*
*
*/
var clearCanvas = function() {
    $("#canvas").children().remove();
    zonesDrawn = [false, false, false, false, false, false];
    updateTerminal("The canvas has been cleared");
    numClicks = 0;
}

/**
*
*
*/
var flashArrow = function(arrow_elem) {
    var int = setInterval(function() {
        if($(arrow_elem).css("background-color") == "rgb(255, 165, 0)") {
            $(arrow_elem).css("background-color", "blue");
        }
        else {
            $(arrow_elem).css("background-color", "orange");
        }
    }, 400);
    $(arrow_elem).data("interid", int.toString());
    $(arrow_elem).data("active", "1");
    $(arrow_elem).parent().parent().data("active-arrows", "1");
    intervals.push(int);
}

/**
*
*
*/
var resetArrow = function(arrow_elem, approach_elem) {
    $(arrow_elem).data("active", "0");
    // approach_elem is a jQuery object already.
    $(approach_elem).data("active-arrows", "0");
    clearInterval($(arrow_elem).data("interid"));
    $(arrow_elem).css("background-color", "black");
}

/**
*
*
*/
var resetArrows = function() {
    intervals.forEach(function(interval, index) {
        clearInterval(interval); 
    });
    intervals = [];
    $(".zone_block img").css({
        "background-color" : "black",
        "visibility" : "visible"
    });
    $(".zone_block img").data("active", "0");
    $(".approach").data("active-arrows", "0");
}


var drawZoneBlock = function(topval, leftval) {
    numClicks++;
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

    

    $("#canvas").append(zone_block_html);
     

    if(topval === undefined || leftval === undefined) {
        $("#" + UID).css({
            position: 'relative',
            left: relX - 85,
            top: "calc(" + relY + "px - " + numClicks + " * 10.5em)"
        });
    }
    else {
        console.log("Placing a zone block at " + leftval + ", " + topval);
        $("#" + UID).css({
            position: 'relative',
            left: leftval.toString() + "px",
            top: topval.toString() + "px"
        });
    }


    $("#" + UID).css("visibility", "visible");

    zonesDrawn[zoneDrawNumber - 1] = true;
}
