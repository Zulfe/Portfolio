/**
 *
 *
 *
 *
 */


/**
 * Allow for the creation of zone block elements on the canvas. Prevents plotting when a user clicks an arrow image.
 * @param {int} zone_id The identification number of the zone to be drawn. This number is between 1 and 6.
 */
var enableZoneDraw = function(zone_id) {
    plotModeEnabled = false;
    zoneDrawEnabled = true;
    zoneDrawNumber = zone_id;
}

/**
 * Allow for the selection of arrow images for compiling route arrays. If no plotting has been done yet, initiate the
 * plotting process.
 *
 */
var enablePlotMode = function() {
    zoneDrawEnabled = false;
    plotModeEnabled = true;

    if(!plottingStarted) {
        updateToolItemColor(routeTo.ID[(0).toString()], "yellow");
        updateTerminal("Now recording a route that enters through the Southbound Left!");
        currentRoute.push([0, 0, 0]);
        plottingStarted = true;
    }
}

/**
* Given an enumeration, return the key associated with the given value.
*/
var objectKeyByValue = function(obj, val) {
      return Object.entries(obj).find(i => i[1] === val)[0];
}

/**
*
*
*/
var saveRoute = function() {
    if(route_number < 11) {
        if(lastAtRouteNumber == route_number) {
            updateTerminal(routeTo.Verbal[route_number.toString()] + " has been recorded. Now recording " + routeTo.Verbal[(route_number + 1).toString()] + ".");
            
            updateToolItemColor(routeTo.ID[route_number], "#94B95B");
            updateToolItemColor(routeTo.ID[route_number + 1], "yellow");
            
            // Add the route configured for this entrance to the list of total routes.
            totalRoutes.push(currentRoute);
            // Reset the array reserved for the current route so that new movements may be added.
            currentRoute = [];

            route_number = route_number + 1;
            lastAtRouteNumber = lastAtRouteNumber + 1;

            // Add to the newly cleared current route variable the volume table origin for the route to now be configured.
            currentRoute.push(routeTo.Address[route_number.toString()]);

            // Clear the blinking from all arrows.
            resetArrows();
        }
        else {
            updateTerminal(routeTo.Verbal[lastAtRouteNumber] + " has been updated. Now recording " + routeTo.Verbal[route_number] + ".");

            updateToolItemColor(routeTo.ID[lastAtRouteNumber], "#94B95B");
            updateToolItemColor(routeTo.ID[route_number], "yellow");

            totalRoutes[lastAtRouteNumber] = currentRoute;
            currentRoute = [];

            lastAtRouteNumber = route_number;

            currentRoute.push(routeTo.Address[route_number]);

            resetArrows();
        }
    }
    else {
        updateToolItemColor(routeTo.ID[11], "#94B95B");
        updateTerminal("All routes have been written. Please export!");
    }

    console.log(totalRoutes);

}

/**
 * Given an array, find a target entry and remove it from the array. This is exclusively used for disabling movement arrows, and thus
 * removing their presence in the currentRoute array. This function is somewhat limited as it may only take arrays as target items.
 * @param {int[]} target_array The array to look for in the current route variable or in a route stored in the total routes variable.
 */
var seekAndDestroy = function(target_array) {
    // Clone the array.
    var route_array_minus_target = [];

    /*
     * Since focus in route editing has been moved to overwriting, editing, and using currentRoute to write to
     * totalRoutes, the else in this block causes issues. It has been left for future 
     */

    // If there does not exist a route array at the route ID, the user must be editing the latest route.
    //if(totalRoutes[lastAtRouteNumber] === undefined) {
        currentRoute.forEach(function(entry, index) {
            var is_match = entry.every(function(element, index) {
                return element === target_array[index];
            });

            if(!is_match)
                route_array_minus_target.push(entry);
        });
        currentRoute = route_array_minus_target;
    //}
    /*
    // If it does exist, then the user is trying to edit a previous route.
    else {
        totalRoutes[lastAtRouteNumber].forEach(function(entry, index) {
            var is_match = entry.every(function(element, index) {
                return element === target_array[index];
            });
            
            if(!is_match)
                route_array_minus_target.push(entry);            
        });
        totalRoutes[route_number] = route_array_minus_target;
    }
    */
}

var destroyAllOfTargetInArray = function(target, source) {
    var source_minus_target = [];

    console.log(source);

    source.forEach(function(entry, index) {
        var is_match = entry.every(function(element, index) {
            return element === target[index];
        });

        if(!is_match)
            source_minus_target.push(entry);
    });

    return source_minus_target;
}

/**
 *
 *
 *
 */
var seekAndAwaitReplace = function(target_array) {
    currentRoute.forEach(function(entry, index) {
        var is_match = entry.every(function(element, index) {
            return element === target_array[index];
        });

        if(is_match) {
            seekAndAwaitReplaceIndex = index;
            seekAndAwaitReplaceAddress = entry;
            console.log("Located match of " + entry + " at index " + index);
        }
    });
}

/**
 *
 *
 */
var executeReplacement = function(replacement_array) {
    currentRoute[seekAndAwaitReplaceIndex] = replacement_array;
    seekAndAwaitReplaceIndex = -1;
    seekAndAwaitReplaceAddress = [-1, -1, -1];
}





/**
*
*
*/
var loadRoute = function(moveToRoute) {
    // Error Control: Don't allow a user to switch between routes if there are not multiple completed or WIP routes to switch between.
    // Note: This could be moved to the mvtItem click binding.
    if(totalRoutes.length < 2) {
        updateTerminal("You must first create route configurations before swapping between them.");
        return;
    }
    
    // Disabling blink on all of the currently active arrows.
    resetArrows();
    // Define a temporary variable to read the desired route's configuration from.
    currentRoute = totalRoutes[moveToRoute];

    // If the route the user requested does not contain any data, notify that there's nothing to show them.
    // This only happens when the user has begun a new route, has not highlighted any of the arrows,  goes
    // back to a previous route, then returns to the new route.
    if(currentRoute === undefined)
        updateTerminal("No data has been written to this entrance movement yet. No movements to highlight.");
    // If the route the user requested does contain information about the
    else
        currentRoute.forEach(function(mvts, index) {
            if(mvts[0] == 0)
                return;
            flashArrow($(".zone_block[data-zone='" + mvts[0] +"'] div[data-dir='" + mvts[1] + "'] img[data-mvt='" + mvts[2] + "']"));
        });
}

/**
 *
 *
 *
 */
var clearRoute = function() {
    totalRoutes[lastAtRouteNumber] = [];
    currentRoute = [];
    // Add the Zone 0 table connection to the new route configuration.
    currentRoute.push(routeTo.Address[lastAtRouteNumber]);
    resetArrows();
}

/**
 *
 *
 *
 */
var getZonePos = function(zone_num) {
    var _this = "#canvas div[data-zone='" + zone_num + "']";
    if($(_this).length == 0)
        return -1;
    else {
        return {
            top: parseInt($(_this).css("top").substring(0, $(_this).css("top").length - 2)),
            left: parseInt($(_this).css("left").substring(0, $(_this).css("left").length - 2))
        };
    }
}

/**
*
*
*/
var exportToCSV = function() {
    if(totalRoutes.length != 12) {
        updateTerminal("You haven't completed all twelve movements for this configuration.");
        return;
    }
    
    var zone_pos = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1];
    var x;
    var y;
    for(var zone = 1; zone <= 6; zone++) {
        x = getZonePos(zone).left;
        y = getZonePos(zone).top;
        if(!(x === undefined)) zone_pos[(zone - 1) * 2] = x;
        if(!(y === undefined)) zone_pos[((zone - 1) * 2) + 1] = y;
    }

    var headers = ["route", "zone", "dir", "mvt", "o_zone", "o_dir", "o_mvt"];
    var csvContent = "data:text/csv;charset=utf-8,";

    zone_pos.forEach(function(value, index) {
        csvContent += index < zone_pos.length - 1 ? value + ", " : value + "\n";
    });
    headers.forEach(function(header, index){
        csvContent += index < headers.length - 1  ? header + "," : header + "\n";
    });
   
    for(var route = 0; route < totalRoutes.length; route++) {
        for(var node = 0; node < totalRoutes[route].length; node++) {
            csvContent += route + 1;
            csvContent += ", " + totalRoutes[route][node][0] + ", " + totalRoutes[route][node][1] + ", " + totalRoutes[route][node][2];
            if(node != 0)
                csvContent += ", " + totalRoutes[route][node - 1][0] + ", " + totalRoutes[route][node - 1][1] + ", " + totalRoutes[route][node - 1][2];
            else
                csvContent += ", " + -1 + ", " + -1 + ", " + -1;
            csvContent += "\n";
        }
    }


    var filename = prompt("Please define a filename.");
    if(filename === undefined || filename == "null")
        filename = "int_X_routesconf";

    var csvURI = encodeURI(csvContent);

    // Create a link on the page, link the CSV to it, mark it as a possible download, then click it for the user.
    var link = document.createElement("a");
    link.setAttribute("href", csvURI);
    link.setAttribute("download", filename + ".csv");
    document.body.appendChild(link);-
    link.click();
}

/**
*
*
*/
var triggerUpload = function() {
    document.getElementById("files").click();
}

/**
*
*
*/
var importFromCSV = function(evt) {
    console.log("Starting import!");
    var csv_data;
    var importFiles = evt.target.files;

    var readFile = new function() {

        var def = $.Deferred();

        var file_reader = new FileReader();
        file_reader.addEventListener('load', function() {
            csv_data = this.result;
            def.resolve()
        });
        file_reader.readAsText(importFiles[0]);

        return def.promise();
    }

    var tempArray = new Array();
    for(var r = 0; r < 12; r++) {
        tempArray = new Array();
        for(var e = 0; e < 6; e++)
            tempArray.push([-1, -1, -1]);
        totalRoutes.push(tempArray);
    }
           

    readFile.then(function() {
        csv_data = $.csv.toArrays(csv_data);

        var step = 1;
        for(var zone_pos = 0; zone_pos < 12; zone_pos = zone_pos + 2) {
            console.log("zone_pos = (" + csv_data[0][zone_pos] + ", " + csv_data[0][zone_pos + 1] + ")");
            if(!(csv_data[0][zone_pos] == -1) && !(csv_data[0][zone_pos + 1] == -1)) {
                zoneDrawNumber = step;
                // drawZoneBlock(top, left)
                drawZoneBlock(csv_data[0][zone_pos + 1], csv_data[0][zone_pos]);
            }
            step++;
        }

        var route_num = 1;
        var zone;
        var dir;
        var mvt;
        var entry_count = 0;
        for(var row = 2; row < csv_data.length; row++) {
            if(!(csv_data[row][0] == route_num.toString())) {
                entry_count = 0;
            }

            route_num = parseInt(csv_data[row][0]);
            zone = parseInt(csv_data[row][1]);
            dir = parseInt(csv_data[row][2]);
            mvt = parseInt(csv_data[row][3]);

            totalRoutes[route_num - 1][entry_count] = [zone, dir, mvt];
            entry_count = entry_count + 1;
        }


        for(var i = 0; i < totalRoutes.length; i++) {
            totalRoutes[i] = destroyAllOfTargetInArray([-1, -1, -1], totalRoutes[i]); 
        }

        console.log(totalRoutes);


        plottingStarted = true;
        route_number = 12;

        updateMovementBlocksPrevColor("#94B95B");
        updateMovementBlocksColor("#94B95B");
    });

}
