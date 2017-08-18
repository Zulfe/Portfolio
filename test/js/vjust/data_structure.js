/**
 * @fileOverview Project structure classes and .
 * @author Jared H. Buchanan, P.E. of VDOT <jared.buchanan@vdot.virginia.gov>
 * @author Damon A. Shaw of VDOT <Damon.Shaw@vdot.virginia.gov || admins@vt.edu>
 * @version Alpha-0.0.1
 */

class Project {
    /**
     * A class that contains all data relevant to the application's configuration, or "project." Every
     * Project object, when initialized, creates 50 instances of Intersection objects for the 50 possible
     * configurations as specified by VDOT.
     * @constructor
     * @param {string} project_ID The name or identifier of the current configuration
     * @param {string} intersection_name The name or identifier of the intersection being evaluated
     * in the current project
     * @param {string} ns_route_name The name of the intersecting route that travels southbound and northbound
     * @param {string} ew_route_name The name of the intersecting route that travels westbound and eastbound
     * @param {string} cp_one The name of the first context point.
     * @param {string} cp_two The name of the second context point.
     * @param {string} cp_three The name of the third context point.
     * @param {string} cp_four The name of the fourth context point.
     */
    constructor(project_ID, intersection_name, n_route_name, e_route_name, s_route_name, w_route_name, cp_one,
                cp_two, cp_three, cp_four, user_name)
    {
        this._project_ID        = project_ID;
        this._user_name         = user_name;
        this._intersection_name = intersection_name;
        this._n_route_name      = n_route_name;
        this._e_route_name      = e_route_name;
        this._s_route_name      = s_route_name;
        this._w_route_name      = w_route_name;
        this._cp_one            = cp_one;
        this._cp_two            = cp_two;
        this._cp_three          = cp_three;
        this._cp_four           = cp_four;
        
        this._intersections = new Array();
        
        this._cookies_utility   = new CookiesUtility();

        this._intersections_created = false;
        
        this.initializeUserVolumeDefinitions();
        this.initializeGeneralVolumes(); 

        EventBus.addEventListener("fix", this.initializeIntersections, this);
    }

    initializeIntersections() {
      
        console.log(this._intersections_created);
        if(this._intersections_created)
            return;

        console.log("INITIALIZING INTERSECTIONS");
        console.log(PROJECT);
        for(var interNum = 0; interNum < NUM_INTERSECTION_CONFIGS; interNum++)
            this._intersections.push(new Intersection(interNum));
          
        this._intersections_created = true;
    }
    
    /**
     * Fills masterPCETable with UserVolumeDefinitions converted to Passenger Car Equivalents
     */
    updateMasterPCETable() {
        masterPCETable = userVolumeDefinitions.getUserVolumes().forEach(function(object, index) {
            object = object.getPassengerCarEquivalent(userVolumeDefinitions.getTruckPercentages()[index])
            }
        )
    }
    
    /**
     * Creates the UserVolumeDefinition object of the Project object and initializes to zeroes
     * Creates the master PCETable object used to derive ZonePCEs and initializes to zeroes
     */
    initializeUserVolumeDefinitions() {
        
        var southbound_detvol  = new BoundedDetailedVolume("southbound" , 0, 0, 0);
        var westbound_detvol   = new BoundedDetailedVolume("westbound" , 0, 0, 0);
        var northbound_detvol  = new BoundedDetailedVolume("northbound" , 0, 0, 0);
        var eastbound_detvol   = new BoundedDetailedVolume("eastbound" , 0, 0, 0);
        var southbound_detperc = new DetailedPercentage("southbound" , 0, 0, 0);
        var westbound_detperc  = new DetailedPercentage("westbound" , 0, 0, 0);
        var northbound_detperc = new DetailedPercentage("northbound" , 0, 0, 0);
        var eastbound_detperc  = new DetailedPercentage("eastbound" , 0, 0, 0);
        
        // This is the one raw volume table for the entire Project
        this._user_volume_definitions = new UserVolumeDefinitions(
            southbound_detvol   
            ,westbound_detvol   
            ,northbound_detvol    
            ,eastbound_detvol    
            ,southbound_detperc  
            ,westbound_detperc   
            ,northbound_detperc  
            ,eastbound_detperc   		
            ,false
        );
        
        // This is the one Passenger Car Equivalent table - based on values in this._user_volume_definitions - for the entire Project
        this._master_PCE_table = new PCETable(
            this._user_volume_definitions.getDirectionByIndex(0).getPassengerCarEquivalentWithDetailedPercentObject("southbound", this._user_volume_definitions._user_defined_southbound_truck_perc),
            this._user_volume_definitions.getDirectionByIndex(1).getPassengerCarEquivalentWithDetailedPercentObject("westbound", this._user_volume_definitions._user_defined_westbound_truck_perc),
            this._user_volume_definitions.getDirectionByIndex(2).getPassengerCarEquivalentWithDetailedPercentObject("northbound", this._user_volume_definitions._user_defined_northbound_truck_perc),
            this._user_volume_definitions.getDirectionByIndex(3).getPassengerCarEquivalentWithDetailedPercentObject("eastbound", this._user_volume_definitions._user_defined_eastbound_truck_perc)
        );
    }
    
    getUserVolumeDefinitions() {
        return this._user_volume_definitions;
    }
    
    /**
     * Creates GeneralVolume objects for running Fratar and storing Fratar inputs; initializes to zeroes
     * Creates GeneralVolumeSplitDirection objects for running Fratar and storing Fratar inputs; initializes to zeroes
     */
    initializeGeneralVolumes() {
        
        this._north_genvol = new GeneralVolume("north", 0, 0.5, 0.1, 0);
        this._east_genvol  = new GeneralVolume("east", 0, 0.5, 0.1, 0);
        this._south_genvol = new GeneralVolume("south", 0, 0.5, 0.1, 0);
        this._west_genvol  = new GeneralVolume("west", 0, 0.5, 0.1, 0);
        
        this._general_volumes = [this._north_genvol,
                                 this._east_genvol,
                                 this._south_genvol,
                                 this._west_genvol
                                ];
        
        this._north_split_genvol = new GeneralVolumeSplitDirection("north", 0, 0, 0.1, 0.1, 0, 0);
        this._east_split_genvol  = new GeneralVolumeSplitDirection("east", 0, 0, 0.1, 0.1, 0, 0);
        this._south_split_genvol = new GeneralVolumeSplitDirection("south", 0, 0, 0.1, 0.1, 0, 0);
        this._west_split_genvol  = new GeneralVolumeSplitDirection("west", 0, 0, 0.1, 0.1, 0, 0);
        
        this._general_split_volumes = [this._north_split_genvol,
                                       this._east_split_genvol, 
                                       this._south_split_genvol,
                                       this._west_split_genvol,
                                       ];
    }
    
    /**
     * Receives user input in Fratar general volume table, updates the appropriate GeneralVolume object and re-runs Fratar
     * @param {string} cardinal_direction The approach direction relative to the intersection (eg. "north" is the approach north of the intersection)
     * @param {int} volume The 2-way link volume (AADT or Peak Hour) of the subject approach
     * @param {float} d_factor The directional distribution of the subject link volume
     * @param {float} k_factor A factor indicating what percentage of volume occurs in the peak hour (k_factor == 1 implies volume is a peak hour volume)
     * @param {float} truck_percent The percentage of volume comprising trucks
     */
    updateGeneralVolume(cardinal_direction, volume, d_factor, k_factor, truck_percent) {
        var direction = parseInt(objectKeyByValue(UnboundDirectionEnum, cardinal_direction));
        this._general_volumes[direction].setGeneralVolumeArray([volume, d_factor, k_factor, truck_percent]);
        this._general_split_volumes[direction].syncWithGeneralVolume(cardinal_direction, volume, d_factor, k_factor, truck_percent);
        var run_fratar = new VolumeTool(this._north_genvol, this._east_genvol, this._south_genvol, this._west_genvol, true);
        var input_arr = run_fratar.calculateSyntheticVolumes().getUserVolumeDefinitionsInputs();
        this.updateUserVolumeDefinitions(
             input_arr[0], // southbound total volume
             input_arr[1], //  westbound total volume
             input_arr[2], // northbound total volume
             input_arr[3], //  eastbound total volume
             input_arr[4], // southbound truck percent
             input_arr[5], //  westbound truck percent
             input_arr[6], // northbound truck percent
             input_arr[7], //  eastbound truck percent
             input_arr[8]  // using_fratar boolean (=== true)
        );
    }
    
    /**
     * Returns selected attributes of a GeneralVolume object
     * @param {string} cardinal_direction The approach direction relative to the intersection (eg. "north" is the approach north of the intersection)
     * @returns {object} A single GeneralVolume object
     */
    getGeneralVolume(cardinal_direction) {
        if (typeof cardinal_direction == "number")
            return this._general_volumes[cardinal_direction];
        else {
            var direction = parseInt(objectKeyByValue(UnboundDirectionEnum, cardinal_direction));
            return this._general_volumes[direction];
        }
    } 
    
    /**
     * Receives user input in Fratar general volume table, updates the appropriate GeneralVolume object and re-runs Fratar
     * @param {string} cardinal_direction The approach direction relative to the intersection (eg. "north" is the approach north of the intersection)
     * @param {int} volume_in The 1-way link volume (AADT or Peak Hour) of the subject approach entering the intersection (eg. southbound traffic north of the intersection)
     * @param {int} volume_out The 1-way link volume (AADT or Peak Hour) of the subject approach exiting the intersection (eg. northbound traffic north of the intersection)
     * @param {float} k_factor A factor indicating what percentage of volume occurs in the peak hour (k_factor == 1 implies volume is a peak hour volume)
     * @param {float} truck_perc_in The percentage of volume_in comprising trucks
     * @param {float} truck_perc_out The percentage of volume_out comprising trucks
     */
    updateGeneralSplitVolume(cardinal_direction, volume_in, volume_out, k_factor, truck_perc_in, truck_perc_out) {
        var direction = parseInt(objectKeyByValue(UnboundDirectionEnum, cardinal_direction));
        this._general_split_volumes[direction].setGeneralSplitVolumeArray([cardinal_direction, volume_in, volume_out, k_factor, k_factor_out, truck_perc_in, truck_perc_out]);
        this._general_volumes[direction].syncWithGeneralSplitVolume(cardinal_direction, volume_in, volume_out, k_factor_in, k_factor_out, truck_perc_in, truck_perc_out);    
        var run_fratar = new VolumeTool(this._north_split_genvol, this._east_split_genvol, this._south_split_genvol, this._west_split_genvol, true);
        var input_arr = run_fratar.calculateSyntheticVolumes().getUserVolumeDefinitionsInputs();
        this.updateUserVolumeDefinitions(
             input_arr[0], // southbound total volume
             input_arr[1], //  westbound total volume
             input_arr[2], // northbound total volume
             input_arr[3], //  eastbound total volume
             input_arr[4], // southbound truck percent
             input_arr[5], //  westbound truck percent
             input_arr[6], // northbound truck percent
             input_arr[7], //  eastbound truck percent
             input_arr[8]  // using_fratar boolean (=== true)
        );
    }
    
    /**
     * Returns selected attributes of a GeneralVolumeSplitDirection object
     * @param {string} cardinal_direction The approach direction relative to the intersection (eg. "north" is the approach north of the intersection)
     * @returns {object} A single GeneralVolumeSplitDirection object
     */
    getGeneralSplitVolume(cardinal_direction) {
        if (typeof cardinal_direction == "number")
            return this._general_split_volumes[cardinal_direction];
        else {
            var direction = parseInt(objectKeyByValue(UnboundDirectionEnum, cardinal_direction));
            return this._general_split_volumes[direction];
        }
    }
    
    /** Replaces the values in this._user_volume_definitions, a UserVolumeDefinitions object, and updates this._master_PCE_table, a PCETable object
     * @param {object} southbound_totvol_bounded A BoundedDetailedVolume representing the total entering volume (cars + trucks) at the southbound approach
     * @param {object} westbound_totvol_bounded A BoundedDetailedVolume representing the total entering volume (cars + trucks) at the westbound approach
     * @param {object} northbound_totvol_bounded A BoundedDetailedVolume representing the total entering volume (cars + trucks) at the northbound approach
     * @param {object} eastbound_totvol_bounded A BoundedDetailedVolume representing the total entering volume (cars + trucks) at the eastbound approach
     * @param {object} southbound_truckperc A DetailedPercentage representing the truck percentage of the southbound approach
     * @param {object} westbound_truckperc A DetailedPercentage representing the truck percentage of the westbound approach
     * @param {object} northbound_truckperc A DetailedPercentage representing the truck percentage of the northbound approach
     * @param {object} eastbound_truckperc A DetailedPercentage representing the truck percentage of the eastbound approach
     * @param {bool} using_fratar A boolean value indicating whether the turning movements were generated by the Fratar method or not
     */    
    updateUserVolumeDefinitions(southbound_totvol_bounded, westbound_totvol_bounded, northbound_totvol_bounded, eastbound_totvol_bounded, southbound_truckperc, westbound_truckperc, northbound_truckperc, eastbound_truckperc, using_fratar) {
        this._user_volume_definitions.updateUserVolumeDefinitions(
            southbound_totvol_bounded,
            westbound_totvol_bounded,
            northbound_totvol_bounded,
            eastbound_totvol_bounded,
            southbound_truckperc,
            westbound_truckperc,
            northbound_truckperc,
            eastbound_truckperc,
            using_fratar
        );

        this._master_PCE_table.updatePCETable(
            this._user_volume_definitions.getDirectionByIndex(0).getPassengerCarEquivalentWithDetailedPercentObject("southbound", this._user_volume_definitions._user_defined_southbound_truck_perc),
            this._user_volume_definitions.getDirectionByIndex(1).getPassengerCarEquivalentWithDetailedPercentObject("westbound", this._user_volume_definitions._user_defined_westbound_truck_perc),
            this._user_volume_definitions.getDirectionByIndex(2).getPassengerCarEquivalentWithDetailedPercentObject("northbound", this._user_volume_definitions._user_defined_northbound_truck_perc),
            this._user_volume_definitions.getDirectionByIndex(3).getPassengerCarEquivalentWithDetailedPercentObject("eastbound", this._user_volume_definitions._user_defined_eastbound_truck_perc)
        );

        if (this._intersections_created)
            this.updateAllZones();			
    }
    
    /**
     * Calls the function to update each zone's PCETable - based on the Project object's master PCETable object and the config routing table - 
     * in each Intersection object in the Project object 
     * @deprecated
	 */
	updateAllZones() {
		for (var config = 0; config < NUM_INTERSECTION_CONFIGS; config++) {
			if (PROJECT.getIntersectionByIndex(config).isEnabled) 
				PROJECT.getIntersectionByIndex(config).updateZonePCEs();
		}
	}
    
    /**
     * Retrieve the master PCETable object for this Project
     * @returns {object} The master PCETable object
     */
    getMasterPCETable() {
        return this._master_PCE_table;
    }

    /**
     * Retreive an Intersection object by its position in the Project's Intersection array.
     * @param {int} index The index of the Intersection object
     * @returns {Object} The Intersection object at the specified index
     */
    getIntersectionByIndex(index) {
        return this._intersections[index];
    }

    /**
     * Retreive an Intersection object by its ID number.
     * @param {int} config_ID The ID number of the Intersection type
     * @returns {Object} The Intersection object with the specified ID number
     */
    getIntersectionByID(config_ID) {
        return this._intersections[config_ID];
    }

    /**
     * Retreive an array containing every Intersection object in the Project object
     * @returns {Object[]} The an array of Intersection objects
     */
    getIntersectionArray() {
        return this._intersections;
    }
    
    getCookiesUtility() {
        return this._cookies_utility;
    }

    /**
     * Set the route name corresponding to a given cardinal direction
     * @param {string} route A string representing the subject approach's direction (ie. "north" = north of the intersection, 
     * "southbound" = the southbound entering approach)
     * @param {string} name The name of the route (eg. "Main Street", "I-95")
     */
    setRouteName(route, name) {
        if(route == "north" || route == "southbound")
            this._n_route_name = name;
        if(route == "east"  || route == "westbound")
            this._e_route_name = name;
        if(route == "south" || route == "northbound")
            this._s_route_name = name;
        if(route == "west"  || route == "eastbound")
            this._w_route_name = name;
    }

    /**
     * Use a given configuration matrix to update the configuration, from the Intersections down to the Direction(al) entries.
     * @param {int[][][][]} config_matrix A four-dimensional matrix where the first dimension represents Intersections, the second dimension
     * represents Zones, the third dimension represents Directions, and the fourth dimension represents the Direction's entries.
     * The first entry on the second and third dimensions are reserved for flags to detail if the above dimension is active.
     * @deprecated
     */
    importConfigFromMatrix(config_matrix) {
        for(var config_index = 0; config_index < config_matrix.length; config_index++) {
            var currentConfig = this.getIntersectionByIndex(config_index);
            for(var zone_index = 0; zone_index < config_matrix[0].length; zone_index++) {
                if(config_matrix[config_index][zone_index][0][0] == 0)
                    continue;
                else
                    currentConfig.getZoneByIndex(zone_index).setEnabled(true);
                for(var dir_index = 0; dir_index < config_matrix[0][0].length - 1; dir_index++) {
                    for(var entry_index = 0; entry_index < config_matrix[0][0][0].length; entry_index++) {
                        currentConfig.getZoneByIndex(zone_index).getDirectionByIndex(dir_index).setEntryByIndex(entry_index, config_matrix[config_index][zone_index][dir_index + 1][entry_index]);
                    }
                }
            }
        }
    }

    /**
     * Create a four-dimensional matrix from the current configuration settings such that zero'th entry is a flag representing
     * if the above dimension is interpretated as active.
     * @returns {int[][][][]} A four-dimensional matrix 
     * @deprecated
     */
    exportConfigToMatrix() {
        // Needs refactoring...
        // There's gotta be a better way to populate a 4D Array...
        // maybe a 1 pass foreach?
        var export_matrix = new Array();
        for(var configs = 0; configs < NUM_INTERSECTION_CONFIGS; configs++)
            export_matrix[configs] = new Array();
        for(var configs = 0; configs < NUM_INTERSECTION_CONFIGS; configs++)
            for(var zones = 0; zones < 6; zones++)
                export_matrix[configs][zones] = new Array();
        for(var configs = 0; configs < NUM_INTERSECTION_CONFIGS; configs++)
            for(var zones = 0; zones < 6; zones++)
                for(var dirs = 0; dirs < 5; dirs++)
                    export_matrix[configs][zones][dirs] = new Array();
        for(var configs = 0; configs < NUM_INTERSECTION_CONFIGS; configs++)
            for(var zones = 0; zones < 6; zones++)
                for(var dirs = 0; dirs < 5; dirs++)
                    export_matrix[configs][zones][dirs] = new Array(0, 0, 0, 0, 0, 0);


        for(var configs = 0; configs < NUM_INTERSECTION_CONFIGS; configs++)
            for(var zones = 0; zones < 6; zones++) {
                export_matrix[configs][zones][0] = this._intersections[configs].getZoneByIndex(zones).isEnabled ? [1, 1, 1, 1, 1, 1] : [0, 0, 0, 0, 0, 0];
                for(var dirs = 0; dirs < 4; dirs++)
                    for(var entries = 0; entries < 6; entries++) 
                        export_matrix[configs][zones][dirs + 1][entries] = this._intersections[configs].getZoneByIndex(zones).getDirectionByIndex(dirs).getEntryByIndex(entries);
            }

        return export_matrix;
    }

    /**
     * Write the current configuration in CSV format with a row layout of [intersection name][zone][direction][entry, entry, entry, entry, entry, entry].
     * Automatically initiate a download for the completed CSV contents.
     */
    exportConfigToCSV() {
        var headers = ["configuration", "zone", "direction", "left lanes", "through lanes", "right lanes", "shared left", "shared right", "channelized right"];
        var csvContent = "data:text/csv;charset=utf-8,";

        // For each header string in the headers array, add it to the CSV content with a comma appended as long as it's not the last element. If it is the 
        // last element, add it to the CSV content with a newline character appended.
        headers.forEach(function(header, index){
            csvContent += index < headers.length - 1  ? header + "," : header + "\n"
        });
       
        // Add to the CSV content the entries of every direction for every active zone for every active intersection.
        for(var config = 0; config < NUM_INTERSECTION_CONFIGS; config++) {
            
            // If the intersection isn't enabled, don't write any of its data to the CSV.
            if(!this.getIntersectionByIndex(config).isEnabled())
                continue;

            for(var zone = 0; zone < 6; zone++) {
                
                // If the zone isn't enabled, don't write any of its data to the CSV.
                if(!this.getIntersectionByIndex(config).getZoneByIndex(zone).isEnabled())
                    continue;

                for(var dir = MIN_EFFECTIVE_DIR; dir < NUM_DIRS; dir++) {
                   
                    // Write the intersection's name in the first column, the zone number in the second, and the cardinal direction in the third.
                    csvContent += IntersectionEnum[config.toString()] + "," + (zone + 1) + "," + DirectionEnum[dir.toString()].toUpperCase() + ",";
                    
                    for(var entry = MIN_EFFECTIVE_ENTRY; entry < NUM_ENTRIES; entry++) {
                        var data_entry = this.getIntersectionByIndex(config).getZoneByIndex(zone).getDirectionByIndex(dir).getEntryByIndex(entry); 
                        csvContent += entry < NUM_ENTRIES - 1 ? data_entry + "," : data_entry + "\n"; 
                    }
                }
            }
        }

        var csvURI = encodeURI(csvContent);

        // Get the current date and time to include in the exported CSV's filename.
        var curDate = new Date();
        var date_and_time = curDate.getDate() + "_" + (curDate.getMonth() + 1) + "_" + curDate.getFullYear() + "-" + curDate.getHours() + "_" + curDate.getMinutes();

        // Create a link on the page, link the CSV to it, mark it as a possible download, then click it for the user.
        var link = document.createElement("a");
        link.setAttribute("href", csvURI);
        link.setAttribute("download", this._project_ID + "__" + date_and_time);
        document.body.appendChild(link);-
        link.click();
    }

    /**
     * Can only be called when using HTML5's file elements. Load the details of the CSV file into this object's configuration.
     */
    importConfigFromCSV() {
        var csv_data;
        
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

        var _this = this;
        readFile.then(function() {
            csv_data = $.csv.toArrays(csv_data);

            var currentZone;
            for(var row = 1; row < csv_data.length; row++) {
                _this._intersections[objectKeyByValue(IntersectionEnum, csv_data[row][0])]
                    .getZoneByIndex(csv_data[row][1] - 1)
                    .getDirectionByIndex(objectKeyByValue(DirectionEnum.toLowerCase(), csv_data[row][2]))
                    .setEntryArray([parseInt(csv_data[row][3]), parseInt(csv_data[row][4]), parseInt(csv_data[row][5]), parseInt(csv_data[row][6]), parseInt(csv_data[row][7]), parseInt(csv_data[row][8])]);
            }
        });
    }
}

class Intersection {
    /**
     * A class that contains all data relevant to a particular intersection configuration or type. Every
     * Intersection object, when initialized, creates 6 instances of Zone objects as there may exist up to
     * 6 active zones for each Intersection configuration or type.
     * @constructor
     * @param {int} config_ID The intersection's configuration identification number (i.e. 13 for Conventional)
     */
    constructor(config_ID) {
        if(config_ID > NUM_INTERSECTION_CONFIGS) {
            console.warn("Invalid Intersection construction: configuration ID cannot be greater than 50.")
        }

        this._config_ID = config_ID;
        this._enabled = 1;
        this._effective_zones = NUM_ZONES;

        this._config_arr = [];
        if (CONFIGROUTE.length < this._config_ID + 1) {
            this._enabled = 0;
        } else {
            this._config_arr = CONFIGROUTE[this._config_ID];
        }
        
        this._zones = new Array();
        this._enabled_zones = new Array();
        
        for (var zone_num = 0; zone_num < this._effective_zones; zone_num++)
            this._enabled_zones[zone_num] = 0;
        
        for (var record = 0; record < this._config_arr.length; record++) {
	    var enabled_zone = this._config_arr[record][1] - 1;
            if (enabled_zone >= 0)
                this._enabled_zones[enabled_zone] = 1;
        }
        
        for(zone_num = 0; zone_num < this._effective_zones; zone_num++)
            this._zones.push(new Zone(zone_num + 1, config_ID, this._enabled_zones[zone_num]));
        
        this._constructing = true;
        
        this.initializeZonePCEs();
        this._constructing = false;
    }

    getEnabledZones() {
        return this._enabled_zones;
    }
    
    initializeZonePCEs() {
        this.updateZonePCEs();
        this.setEffectiveZones(0);
        for (var subjectZone = 0; subjectZone < 6; subjectZone++) {
            if (this.getZoneByIndex(subjectZone).isEnabled()) {
                this.getZoneByIndex(subjectZone).createDirections();
                this.setEffectiveZones(1 + this.getEffectiveZones());
            }
        }
    }
    
     /**
     * Resets the BoundedDetailedVolume object in each Direction and calculates their new values based on updates to Project._master_PCE_table
     * -1s indicate an invalid approach; if no entry for a given approach exists in the config routing table, the -1 will not be overwritten
     */
    updateZonePCEs() {
            for (var zone = MIN_EFFECTIVE_ZONE; zone < NUM_ZONES; zone++) {
                    for (var direction = 0; direction < 4; direction++) {
                        var subjectZone = this.getZoneByIndex(zone);
                        if (subjectZone.isEnabled())
                            subjectZone.getZonePCEs().getDirectionByIndex(direction).setMovementArray([-1,-1,-1]);
                    }
            }
            this.setZonePCEs();
    }

     /**
     * Updates the BoundedDetailedVolume object in each Direction object when a new zone is instantiated
     * or if UserVolumeDefinitions change
     */
    setZonePCEs() {
			
        for (var record = 0; record < this._config_arr.length; record++) {
                var route = this._config_arr[record][0];
                if (this._config_arr[record][1] == 0) {
                        var masterDirection = this._config_arr[record][2];
                        var masterMovement = this._config_arr[record][3];
                        var volume = PROJECT.getMasterPCETable().getDirectionByIndex(masterDirection).getMovementByIndex(masterMovement);
                }
                else if (this._config_arr[record][1] == -1) {
                        1 == 1;
                }
                else {
                        var subjectZone = this._config_arr[record][1];
                        var subjectDirection = this._config_arr[record][2];
                        var subjectMovement = this._config_arr[record][3];
                        this.getZoneByIndex(subjectZone - 1).addPCEtoZone(volume, subjectDirection, subjectMovement);
        //this.getZoneByIndex(subjectZone - 1).setEnabled(true);
                }
        }
        if (!this._constructing) {
            for (var zone = 0; zone < 6; zone++) {
                if (this.getZoneByIndex(zone).isEnabled()) {
                    this.getZoneByIndex(zone).getZoneTCUs().updateTCUs();
                
                    for (var dir = 0; dir < 4; dir++) 
                        var left = [
                            this.getZoneByIndex(zone).getZonePCEs().getDirectionByIndex(dir).getLeft(),
                            this.getZoneByIndex(zone).getZoneTCUs().getCapacityByIndex(dir).getLeft(),
                            this.getZoneByIndex(zone).getZonePCEs().getDirectionByIndex(dir).getLeft() / 
                            this.getZoneByIndex(zone).getZoneTCUs().getCapacityByIndex(dir).getLeft()
                        ]
                        var thru = [
                            this.getZoneByIndex(zone).getZonePCEs().getDirectionByIndex(dir).getLeft(),
                            this.getZoneByIndex(zone).getZoneTCUs().getCapacityByIndex(dir).getLeft(),
                            this.getZoneByIndex(zone).getZonePCEs().getDirectionByIndex(dir).getLeft() / 
                            this.getZoneByIndex(zone).getZoneTCUs().getCapacityByIndex(dir).getLeft()
                        ]
                        var rite = [
                            this.getZoneByIndex(zone).getZonePCEs().getDirectionByIndex(dir).getLeft(),
                            this.getZoneByIndex(zone).getZoneTCUs().getCapacityByIndex(dir).getLeft(),
                            this.getZoneByIndex(zone).getZonePCEs().getDirectionByIndex(dir).getLeft() / 
                            this.getZoneByIndex(zone).getZoneTCUs().getCapacityByIndex(dir).getLeft()
                        ]
                        EventBus.dispatch("infoSwitcherDataUpdated", 0, this._intersection_ID, zone, dir, 0, left);
                        EventBus.dispatch("infoSwitcherDataUpdated", 0, this._intersection_ID, zone, dir, 1, thru);
                        EventBus.dispatch("infoSwitcherDataUpdated", 0, this._intersection_ID, zone, dir, 2, rite);
                }
            }
        }
    }

    /**
     * Change the value of this object's stored number of effective zones.
     * @param {int} effective_zones The number of effective zones to be set.
     * @deprecated
     */
    setEffectiveZones(effective_zones) {
        this._effective_zones = effective_zones;
    }

    /**
     * Returns the number of effective or active zones for this Intersection.
     * @returns {int} The number of active zones
     * @deprecated
     */
    getEffectiveZones() {
        return this._effective_zones;
    }

    /**
     * Reduce the number of effective zones for this Intersection by one. If the number of effective zones is now
     * zero, set the Intersection to disabled. This is exclusively used in testing the behavior of a project and its
     * functions with randomly generated values.
     * @deprecated
     */
    decrementEffectiveZones() {
        this._effective_zones--;
        if(this._effective_zones == 0)
            this.setEnabled(false);
    }

    /**
     * Returns the array of Zone objects.
     * @returns {Zone[]} The array of Zone objects for this Intersection object
     */
    getZoneArray() {
        return this._zones;
    }

    /**
     * Returns the Zone object in this Intersection's Zone array at the given index.
     * @returns {Zone} The Zone object at the specified index
     */
    getZoneByIndex(zone_index) {
        return this._zones[zone_index];
    }

    /**
     * Returns if this Intersection object is enabled or active.
     * @returns {boolean} The able state of this Intersection
     */
    isEnabled() {
        if(this._enabled == 1)
            return true;
        else
            return false;
    }

    /**
     * Set the able state of this Intersection with a boolean value.
     * @param {boolean} toggle <tt>true</tt> for enable; <tt>false</tt> for disable
     */
    setEnabled(toggle) {
        if(toggle)
            this._enabled = 1;
        else
            this._enabled = 0;
    }
}

class Zone {
    /**
     * A class that contains all data relevant to an intersectional Zone. Every Zone object,
     * when initialized, creates four instances of Direction objects, one for each cardinal direction.
     * @param {int} zone_ID The identification number for this zone. This number should always be between 1 and 6.
     */
    constructor(zone_ID, intersection_ID, active_flag) {
        if(zone_ID > 6) {
            console.warn("Invalid Zone construction: zone ID cannot be greater than 6. Skipping...");
        }
        
        this._ControlEnum      = {
            "0" : "Signalized",
            "1" : "Two-Way Stop Controlled",
            "2" : "Roundabout",
        //    "3" : "All-Way Stop Controlled"
        }

        this.CONTROL_SIGNAL     = 0;
        this.CONTROL_TWSC       = 1;
        this.CONTROL_ROUNDABOUT = 2;
        //this.CONTROL_AWSC       = 3;
		
        this._intersection_ID   = intersection_ID;
        this._zone_ID           = zone_ID;
        this._active_flag       = active_flag;
        this._control_type      = this.CONTROL_SIGNAL;
		
        this._southbound_PCEs   = new BoundedDetailedVolume("southbound",-1,-1,-1);
		this._westbound_PCEs    = new BoundedDetailedVolume("westbound",-1,-1,-1);
		this._northbound_PCEs   = new BoundedDetailedVolume("northbound",-1,-1,-1);
		this._eastbound_PCEs    = new BoundedDetailedVolume("eastbound",-1,-1,-1);
		
		this._southbound_PCEs.setPCEState(true);
		this._westbound_PCEs.setPCEState(true);
        this._northbound_PCEs.setPCEState(true);
        this._eastbound_PCEs.setPCEState(true);		

		this.initializeZonePCEs();
	}
	
    /**
     * Initialize an active Zone object (this._active_flag = 1) by creating its PCETable object
     */
	initializeZonePCEs() {
        if (this._active_flag) 
			this._zone_PCEs = new PCETable(this._southbound_PCEs, this._westbound_PCEs, this._northbound_PCEs, this._eastbound_PCEs);
	}
	
	/**
	 * Fill the PCETable object with values
     * If the existing value at the given location is -1, replace -1 with the passed volume;
     * if the existing value at the given location is not -1, add the passed volume to the existing value
     * @param {float} volume The volume value to be added at the subject turning movement
     * @param {int} subjectDirection An integer representation of the cardinal direction of the approach (0=southbound, 1=westbound, 2=northbound, 3=eastbound)
     * @param {int} subjectMovement An integer representation of the subject movement (0=left, 1=through, 2=right)
	 */
	addPCEtoZone(volume, subjectDirection, subjectMovement) {
		
		var subjectVol = this.getZonePCEs().getDirectionByIndex(subjectDirection).getMovementByIndex(subjectMovement);
		if ( subjectVol == -1) {
			this.getZonePCEs().getDirectionByIndex(subjectDirection).setMovementByIndex(subjectMovement, volume);
		}
		else {
			this.getZonePCEs().getDirectionByIndex(subjectDirection).setMovementByIndex(subjectMovement, subjectVol + volume);
		}
        this.sync();
	}
	
    /**
     * Sync values in each PCE-enabled BoundedDetailedVolume when changes are made to the corresponding member of the ZonePCE array of PCE-enabled BoundedDetailedVolumes
     */
    sync() {
        this._southbound_PCEs = this.getZonePCEs().getDirectionByIndex(0);
        this._westbound_PCEs  = this.getZonePCEs().getDirectionByIndex(1);
        this._northbound_PCEs = this.getZonePCEs().getDirectionByIndex(2);
        this._eastbound_PCEs  = this.getZonePCEs().getDirectionByIndex(3); 
    }
    
    /**
     * Retreieve the array of PCE-enabled BoundedDetailedVolumes
     */
	getZonePCEs () {
		return this._zone_PCEs;
	}
	
    /**
     * Retreieve the array of PCE-enabled BoundedDetailedVolumes converted to through flow-rate equivalent
     */
    getZoneTCUs () {
        return this._zone_TCUs;
    }
    
    /**
     * Creates Direction objects for each cardinal direction and copies them into an array of Direction objects
     * Creates a TCUTable object 
     */
    createDirections() {
        this._southbound        = new Direction("southbound", this._zone_PCEs, this._intersection_ID, this._zone_ID, 0);
        this._westbound         = new Direction("westbound" , this._zone_PCEs, this._intersection_ID, this._zone_ID, 1);
        this._northbound        = new Direction("northbound", this._zone_PCEs, this._intersection_ID, this._zone_ID, 2);
        this._eastbound         = new Direction("eastbound" , this._zone_PCEs, this._intersection_ID, this._zone_ID, 3);
        this._direction_array   = [this._southbound, this._westbound, this._northbound, this._eastbound];
        this._zone_TCUs         = new TCUTable(this._zone_ID, this._intersection_ID, this._zone_PCEs, this._direction_array);
    } 
    
    /**
     * Returns the Direction object in which traffic is traveling through this Zone southbound.
     * @returns {Direction} The Direction object for southbound traffic
     */
    getsouthbound() {
        return this._southbound;
    }

    /**
     * Returns the Direction object in whcih traffic is traveling through this Zone northbound.
     * @returns {Direction} The Direction object for northbound traffic
     */
    getnorthbound() {
        return this._northbound;
    }

    /**
     * Returns the Direction object in which traffic is traveling through this Zone westbound.
     * @returns {Direction} The Direction object for westbound traffic
     */
    getwestbound() {
        return this._westbound;
    }

    /**
     * Returns the Direction object in which traffic is traveling through this Zone eastbound.
     * @returns {Direction} The Direction object for eastbound traffic
     */
    geteastbound() {
        return this._eastbound;
    }

    /**
     * Returns the array of Direction objects for the Zone in the order: southbound, westbound, northbound, eastbound
     * @returns {Direction[]} An array of Direction objects
     */
    getDirectionArray() {
        return this._direction_array;
    }

    /**
     * Changes the able state based on boolean input.
     * @param {boolean} flag <tt>true</tt> for enable; <tt>false</tt> for disable
     */
    setEnabled(flag) {
        if(flag)
            this._active_flag = 1;
        else
            this._active_flag = 0;
    }

    /**
     * Returns if this Zone object is enabled or not.
     * @returns {boolean} <tt>true</tt> if enabled; <tt>false</tt> if disabled
     */
    isEnabled(){
        if(this._active_flag)
            return true;
        else
            return false;
    }

    /**
     * Returns the Direction object at the specified index in this Zone's Direction array.
     * @returns {Direction} The Direction object at the given index
     */
    getDirectionByIndex(direction_pos) {
        return this._direction_array[direction_pos];
    }

    /**
     * Changes the zone analysis type between Signalized, Two-Way Stop Control, Roundabout, or All-Way Stop Control
     * @param {integer} <tt>0</tt> for Signalized, <tt>1</tt> for TWSC, <tt>2</tt> for Roundabout, or <tt>3</tt> for AWSC
     */
    setControl(controlVal) {
        this._control_type = controlVal;
    }

    /** Returns the control type of this zone as an integer
      * @returns {integer} 0 for Signalized, 1 for TWSC, 2 for Roundabout, or 3 for AWSC
      */
    getControlVal() {
         return this._control_type;
     }

    /** Returns the control type of this zone as a string
      * @returns {string} A string describing the zone control type
      */
    getControlType() {
        return this._ControlEnum[this._control_type.toString()];
     }
}

class Direction {
    /**
     * The lowest level of the Project data structure. The Direction object contains information about its cardinal direction and
     * the number of (left, through, right, shared left, shared right, and channelized right) lanes for said cardinal direction.
     * @constructor
     * @param {string} cardinal_direction The cardinal direction (southbound, westbound, northbound, or eastbound) for this Direction object.
     */
    constructor(cardinal_direction, user_volumes, intersection_id, zone_id, direction_id) {
        this._cardinal_direction   = cardinal_direction;
        this._intersection_ID = intersection_id;
        this._zone_ID = zone_id;
        this._direction_ID = direction_id;
        this._entry_array = calculateLanesByRules(user_volumes.getDirectionByIndex(direction_id).getLeft(),
                                                user_volumes.getDirectionByIndex(direction_id).getThrough(),
                                                user_volumes.getDirectionByIndex(direction_id).getRight(),
                                                user_volumes.getDirectionByIndex( (direction_id + 2) % 3 ).getLeft(),
                                                user_volumes.getDirectionByIndex( (direction_id + 2) % 3 ).getThrough(),
                                                user_volumes.getDirectionByIndex( (direction_id + 3) % 3 ).getLeft(),
                                                1,
                                                0,
                                                0                                         
                                               );
        
        this.syncEntries();
        /*        
        if (user_volumes.getDirectionByIndex(direction_id).getLeft() == -1) {
            this._left_turn        = 0;
        } else {
            this._left_turn        = 1;
        }
        if (user_volumes.getDirectionByIndex(direction_id).getThrough() == -1) {
            this._through          = 0;
        } else {
            this._through          = Math.max(Math.floor(user_volumes.getDirectionByIndex(direction_id).getThrough() / 800), 1);
        }
        if (user_volumes.getDirectionByIndex(direction_id).getThrough() == -1) {
            this._right_turn       = 0;
        } else {
            this._right_turn       = 1;
        }
        this._shared_left          = 0;
        this._shared_right         = 0;
        this._channelized_right    = 0;
        this._entry_array          = [this._left_turn, this._through, this._right_turn, this._shared_left, this._shared_right, this._channelized_right]; */
        this._address              = [intersection_id, zone_id, direction_id];
        this._constructing = true;
        this.calculateArrowsFromEntries();
        this._constructing = false;
    }

    calculateEntriesFromArrows() {
        this._channelized_right = this._arrow_chan_right;
        this._right_turn        = this._arrow_right + this._arrow_chan_right;
        this._left_turn         = this._arrow_left;
        this._through           = this._arrow_all_share + this._arrow_through + this._arrow_through_left + this._arrow_through_right;
        this._shared_left       = this._arrow_all_share + this._arrow_through_left + this._arrow_left_right;
        this._shared_right      = this._arrow_all_share + this._arrow_through_right + this._arrow_left_right;
        
        this.syncEntryArray();
    }
    
    calculateArrowsFromEntries() {
        
        this._arrow_array = [0, 0, 0, 0, 0, 0, 0, 0];
        this.syncArrows();
        
        console.log(this._left_turn, this._through, this._right_turn, this._shared_left, this._shared_right, this._channelized_right);
        
        this._arrow_chan_right = this._channelized_right;
        this._arrow_right      = this._right_turn - this._arrow_chan_right;
        this._arrow_left       = this._left_turn;
        this._arrow_through    = this._through;
        
        //this._shared_left and this._shared_right are always 1 or 0; functionally and conceptually they are booleans
        if (this._shared_left && this._shared_right && this._through == 1) {
            this._arrow_all_share  = 1;
            this._arrow_through    = 0;
        }
        else if (this._shared_left && this._shared_right && !this._through) {
            this._arrow_left_right = 1;
        }
        else {
            if (this._shared_left)
                this._arrow_through_left  = 1;
            if (this._shared_right)
                this._arrow_through_right = 1;
        }
        
        this._arrow_through = this._arrow_through - this._arrow_through_left - this._arrow_through_right - this._arrow_all_share;
               
        this.syncArrowArray();
        console.log(this._arrow_array);
    }
    
    syncArrowArray() {
        this._arrow_array = [this._arrow_left, this._arrow_through, this._arrow_through_left, this._arrow_through_right, this._arrow_all_share, this._arrow_left_right, this._arrow_right, this._arrow_chan_right];  
        if (!this._constructing) {
            console.log("[MODEL] Dispatching an arrow layout update.");
            EventBus.dispatch("arrowLayoutUpdated", 0, this._intersection_ID, this._zone_ID, this._direction_ID, this._arrow_array);
            PROJECT.getIntersectionByID(this._intersection_ID).updateZonePCEs();
        }
    }
    
    getArrowArray() {
        return this._arrow_array;
    }
    
    getArrowByEnum(arrow_type) {
        var arrow_index = parseInt(objectKeyByValue(ArrowEnum, arrow_type));
        return this._arrow_array[arrow_index];
    }
    
    getArrowByIndex(index) {
        return this._arrow_array[index];
    }
    
    clearArrowArray() {
        this._arrow_array = [0, 0, 0, 0, 0, 0, 0, 0];
        this.syncArrows();
    }
    
    setArrowsByMovement(movement, arrows) {
        if(movement == 0)
            setLeftArrows(arrows);

        else if(movement == 1)
            setThroughArrows(arrows);

        else if(movement == 2)
            setRightArrows(arrows);
    }

    setLeftArrows(arrows) {
        this._arrows[0] = arrows[0];
        
        this.syncArrows();
        this.calculateEntriesFromArrows();
    }

    setThroughArrows(arrows) {
        this._arrows[1] = arrows[0];
        this._arrows[2] = arrows[1];
        this._arrows[3] = arrows[2];
        this._arrows[4] = arrows[3];
        this._arrows[5] = arrows[4];
        
        this.syncArrows();
        this.calculateEntriesFromArrows();
    }

    setRightArrows(arrows) {
        this._arrows[6] = arrows[0];
        this._arrows[7] = arrows[1];
        
        this.syncArrows();
        this.calculateEntriesFromArrows();
    }
    
    setArrowArray(arrows) {
        if (arrows.length = 8) {
            this._arrow_array = arrows;
            this.calculateEntriesFromArrows();
            this.syncArrows();
        } else {
            console.log("Function setArrowArray(arrows) expects an array of 8 integers");
        }
    }
    
    setArrowByIndex(index, new_value) {
        this._arrow_array[index] = new_value;
        
        this.syncArrows();
        this.calculateEntriesFromArrows();
    }
    
    setArrowByEnum(arrow_type, new_value) {
        var arrow_index = parseInt(objectKeyByValue(ArrowEnum, arrow_type));
        this._arrow_array[arrow_index] = new_value;
    
        this.syncArrows();
        this.calculateEntriesFromArrows();
    }   
    
    syncArrows() {
        this._arrow_left           = this._arrow_array[0];
        this._arrow_through        = this._arrow_array[1];
        this._arrow_right          = this._arrow_array[2]; 
        this._arrow_all_share      = this._arrow_array[3];
        this._arrow_through_left   = this._arrow_array[4];
        this._arrow_through_right  = this._arrow_array[5];
        this._arrow_left_right     = this._arrow_array[6];
        this._arrow_chan_right     = this._arrow_array[7];
    }
    
    /**
     * Retrieve the bounded cardinal direction (eg. "southbound")
     */
    getCardinalDirection() {
        return this._cardinal_direction;
    }
    
    /**
     * Retrieve the cardinal direction expressed as an integer (0=southbound, 1=westbound, 2=northbound, 3=eastbound)
     */
    getCardinalDirectionAsInteger() {
        var dir_int;
        switch(this._cardinal_direction) {
            case "southbound":
                dir_int = 0;
                break;
            case "westbound":
                dir_int = 1;
                break;
            case "northbound":
                dir_int = 2;
                break;
            case "eastbound":
                dir_int = 3;
                break;
        }
        return dir_int;
    }
    
    /**
     * Returns a lane data entry based on the specified index. Shared left (3), shared right (4), and channelized right (5) are flags.
     * @returns {int} The entry at the given index
     */
    getEntryByIndex(entry_pos) {
        return this._entry_array[entry_pos];
    }

    /**
     * If the entry array has changed, run this function to implement the changes in the individual class variables.
     * By default this function runs automatically when an entry or the entire entry array has been changed using
     * <tt>setEntryByIndex(entry_pos, new_value)</tt> or <tt>setEntryArray(entry_array)</tt>.
     */
    syncEntries() {
        this._left_turn         = this._entry_array[0];
        this._through           = this._entry_array[1];
        this._right_turn        = this._entry_array[2];
        this._shared_left       = this._entry_array[3];
        this._shared_right      = this._entry_array[4];
        this._channelized_right = this._entry_array[5];
    }
    
    syncEntryArray() {
        this._entry_array[0] = this._left_turn;        
        this._entry_array[1] = this._through;          
        this._entry_array[2] = this._right_turn;       
        this._entry_array[3] = this._shared_left;      
        this._entry_array[4] = this._shared_right;     
        this._entry_array[5] = this._channelized_right;
    }

    /**
     * Set the value of a data entry in the entry array at a specified index to a specified value. Note that values at indices 3 to 5
     * should not be set to a value other than 0 or 1.
     * @param {int} entry_pos The index of the entry to be changed
     * @param {int} new_value The value to set the entry to
     */
    setEntryByIndex(entry_pos, new_value) {
        this._entry_array[entry_pos] = new_value;
        this.syncEntries();
    }

    /**
     * Set the entire entry array to the passed array. As of version 0.0.1 the entry array consists of six entries in the order
     * left turn lanes, through lanes, right turn lanes, shared left flag, shared right flag, channelized right flag.
     * @param {int[]} An array of entry values
     */
    setEntryArray(entry_array) {
        this._entry_array = entry_array;
        this.syncEntries();
    }

    /**
     * Print to the console the contents of the entry array.
     */
    printEntryArray() {
        console.log(this._entry_array);
    }

    /**
     * Returns the stored number of left turn lanes for this Direction object.
     * @returns {int} The number of left turn lanes
     */
    getLeftTurn() {
        return this._left_turn;
    }

    /**
     * Returns the stored number of right turn lanes for this Direction object.
     * @returns {int} The number of right turn lanes
     */
    getRightTurn() {
        return this._right_turn;
    }

    /**
     * Returns the stored number of through lanes for this Direction object.
     * @returns {int} The number of through lanes
     */
    getThrough() {
        return this._through;
    }

    /**
     * Returns the state of the shared left flag for this Direction object.
     * @returns {int} state flag
     */
    getSharedLeft() {
        return this._shared_left;
    }

    /**
     * Returns the state of the shared right flag for this Direction object.
     * @returns {int} state flag
     */
    getSharedRight() {
        return this._shared_right;
    }

    /**
     * Returns the state of the channelized right flag for this Direction object.
     * @returns {int} state flag
     */
    getChannelizedRight() {
        return this._channelized_right;
    }

    /**
     * Returns the entire entry array stored in this Direction object.
     * @returns {int[]} The array of entries
     */
    getEntryArray() {
        return this._entry_array;
    }
}

class TCUTable {
    /**
	 * A class for calculating and storing through-car equivalents for turning movements from a bounded (eg. southbound) point of view.
     * @constructor
     * @param {int} zone_ID The unique ID of the parent Zone object
     * @param {int} intersection_ID The unique ID of the grandparent Intersection object
     */
    constructor (zone_ID, intersection_ID, zone_PCEs, directions) {
        this._zone_ID = zone_ID;
        this._intersection_ID = intersection_ID;
        
        this._TCUs = new PCETable(
            zone_PCEs.getDirectionByIndex(0),
            zone_PCEs.getDirectionByIndex(1),
            zone_PCEs.getDirectionByIndex(2),
            zone_PCEs.getDirectionByIndex(3),
        )
        
        this._capacity_array = [
                                (this._southbound_cap = new BoundedCapacity("southbound", 0, 0, 0) ),
                                (this._westbound_cap  = new BoundedCapacity( "westbound", 0, 0, 0) ),
                                (this._northbound_cap = new BoundedCapacity("northbound", 0, 0, 0) ),
                                (this._eastbound_cap  = new BoundedCapacity( "eastbound", 0, 0, 0) )
                                ];
        
        
        this._north_south_split_phase = false;
        this._north_south_split_override = false;
        this._east_west_split_phase = false;
        this._east_west_split_override = false;
        this._protected_lefts = [false, false, false, false];
        
        this.calculateTCUs(directions, zone_PCEs);    
    }
    
    /**
     * Call this function when any zone configuration or user-defined volumes are changed to recalculate the through-car equivalents
     */
    updateTCUs() {
        this.calculateTCUs(-1, -1);
    }
    
    /**
     * Calculates the through-car equivalents for each approach based on ZonePCEs and Direction variables (ie. lane-sharing, number of lanes, etc.)
     */
    calculateTCUs (initial_directions, initial_PCEs) {
    // Ensure that the TCU volumes are up to date. Here we are assuming the user movement volumes have already been converted to their PCE.
        if (initial_directions == -1) {
            var direction_array = PROJECT.getIntersectionByID(this._intersection_ID).getZoneByIndex(this._zone_ID - 1).getDirectionArray();
            var PCE_table = PROJECT.getIntersectionByID(this._intersection_ID).getZoneByIndex(this._zone_ID - 1).getZonePCEs().getPCEArray();
        } else {
            var direction_array = initial_directions;
            var PCE_table = initial_PCEs.getPCEArray();
            console.log(direction_array);
            console.log(PCE_table);
        }
        
        for (var direction = 0; direction < 4; direction++) {
            
            var right_vol = PCE_table[direction].getRight();
            var through_vol = PCE_table[direction].getThrough();
            var left_vol = PCE_table[direction].getLeft();
            
            var right_turn_lanes = direction_array[direction].getRightTurn();
            var through_lanes = direction_array[direction].getThrough();
            var left_turn_lanes = direction_array[direction].getLeftTurn();
            var shared_right = direction_array[direction].getSharedRight();
            var shared_left = direction_array[direction].getSharedLeft();
            var chan_right = direction_array[direction].getChannelizedRight();
            
            // Gets the direction exactly 2 away from 'direction'; masking by three returns only the 1s and 2s bits (0 - 3)
            var opposing_throughs_vol = PCE_table[(direction + 2) & 3].getThrough();
            var opposing_right_vol = PCE_table[(direction + 2) & 3].getRight();
            var opposing_through_lanes = direction_array[(direction + 2) & 3].getThrough();
            var opposing_right_lanes = direction_array[(direction + 2) & 3].getRightTurn();
            var opposing_chan_right = direction_array[(direction + 2) & 3].getChannelizedRight();
            var opposing_left_lanes = direction_array[(direction + 2) & 3].getLeftTurn();
            var opposing_shared_left = direction_array[(direction + 2) & 3].getSharedLeft();
            
            var this_phase_split;
            
            if (direction % 2 === 0 && !this._north_south_split_override) {
                this._north_south_split_phase = (left_turn_lanes > 0 && shared_left) ? true : 
                (opposing_left_lanes > 0 && opposing_shared_left) ? true : false;
                this_phase_split = this._north_south_split_phase;
            } else if (!this._east_west_split_override) {
                this._east_west_split_phase = (left_turn_lanes > 0 && shared_left) ? true : 
                (opposing_left_lanes > 0 && opposing_shared_left) ? true : false;
                this_phase_split = this._east_west_split_phase;
            }
            
            if (this_phase_split) {
                this._protected_lefts[direction] = false;
            } else {
                this._protected_lefts[direction] = left_turn_lanes > 1 ? true : 
                    (left_vol >= 240 && left_turn_lanes == 1) ? true : 
                    (opposing_through_lanes == 1 && (left_vol * ( opposing_throughs_vol + opposing_right_vol * (1 - opposing_chan_right) ) ) > 50000) ? true :
                    (opposing_through_lanes == 2 && (left_vol * ( opposing_throughs_vol + opposing_right_vol * (1 - opposing_chan_right) ) ) > 90000) ? true :
                    (opposing_through_lanes == 3 && (left_vol * ( opposing_throughs_vol + opposing_right_vol * (1 - opposing_chan_right) ) ) > 110000) ? true :
                    (opposing_through_lanes >  3 && left_turn_lanes > 0) ? true:
                    false;
            }
            
            var throughs = through_vol;
            var rights = 0;
            var lefts = 0;
            
            if (!chan_right) {
                // Calculates % of right-turn volume in exclusive right-turn lanes and shared through-right
                var right_vol_splitfrac = ( (1 + (right_turn_lanes - shared_right)) / (right_turn_lanes + 1) );

                // Add shared rights to through volume
                throughs = Math.round(throughs + ((right_vol / UNIVERSAL_RIGHT_TURN_ADJUSTMENT_FACTOR ) * (1 - right_vol_splitfrac) ) );

                // Will be zero if no exclusive lanes; = right_vol if no shared right; something between 0 and right_vol if shared and exclusive rights exist for this approach
                rights = Math.round(right_vol * right_vol_splitfrac / right_turn_lanes) * (1 - chan_right);
                // Old version of this line; allows rights to be channelized AND shared. Probably an unnecessary case
                // rights = Math.round(right_vol * (right_vol_splitfrac * (1 - chan_right)) / right_turn_lanes);
            }
            
            // This needs to be adjusted for phase effect.
            var left_turn_factor = 5;
            var left_vol_splitfrac = (1 + (left_turn_lanes - shared_left)) / (left_turn_lanes + 1);
            
            throughs = throughs + (((left_vol * left_turn_factor) / UNIVERSAL_LEFT_TURN_ADJUSTMENT_FACTOR ) * (1 - left_vol_splitfrac) );
            var lefts = Math.round(left_vol * left_vol_splitfrac / left_turn_lanes);
            
            // Convert through volume to a flow rate
            throughs = Math.round(throughs / through_lanes);
            
            /////// NOW SET THE VOLUMES IN this._TCUs
            this._TCUs.getDirectionByIndex(direction).setLeft(lefts);
            this._TCUs.getDirectionByIndex(direction).setThrough(throughs);
            this._TCUs.getDirectionByIndex(direction).setRight(rights);
            
            console.log(this);
        } 
        this.calculateCapacities();
    }
    calculateCapacities() {
        for (var dir = 0; dir < 1; dir++) {
            
            this.getCapacityByIndex(dir).setLeft(Math.floor(Math.random() * 1600));
            this.getCapacityByIndex(dir).setThrough(Math.floor(Math.random() * 1600));
            this.getCapacityByIndex(dir).setRight(Math.floor(Math.random() * 1600));
            
            this.getCapacityByIndex(dir + 2).setLeft(1600 - this.getCapacityByIndex(dir).getLeft());
            this.getCapacityByIndex(dir + 2).setThrough(1600 - this.getCapacityByIndex(dir).getThrough());
            this.getCapacityByIndex(dir + 2).setRight(1600 - this.getCapacityByIndex(dir).getRight());
        }
    }
    getCapacityByIndex(index) {
        return this._capacity_array[index];
    }
    
}

class CookiesUtility {
    /**
     * A class for the creation, encoding, decoding, and translation of cookies to and from the current configuration. An
     * instance of this class should always be active when this application is in production. Cookies encoding needs to be
     * updated if the number of entries increases but not if they decrease (which they won't). Currently, cookies are encoded
     * by storing the entry values in sections of a byte, then translating that byte into an integer, then translating that integer
     * into an ASCII character.
     * Cookies are written in the following order where each closed bracket is replaced with one ASCII character:
     * [break_char][config_id][ [zone, direction, shared_left, shared_right, channelized_right] [left_lanes, through_lanes, right_lanes] ]
     */
    constructor() {
        this._cookie                  = "";
        this._cookie_id               = "vjust_proj";
        this._break_char              = String.fromCharCode(254);
        this._startup_cookies_found   = false;
        this._are_cookies_latest      = false;

        this._ConfigKeyEnum = { 
            "0"  : String.fromCharCode(60),
            "1"  : String.fromCharCode(61),
            "2"  : String.fromCharCode(62),
            "3"  : String.fromCharCode(63),
            "4"  : String.fromCharCode(64),
            "5"  : String.fromCharCode(65),
            "6"  : String.fromCharCode(66),
            "7"  : String.fromCharCode(67),
            "8"  : String.fromCharCode(68),
            "9"  : String.fromCharCode(69),
            "10" : String.fromCharCode(70),
            "11" : String.fromCharCode(71),
            "12" : String.fromCharCode(72),
            "13" : String.fromCharCode(73),
            "14" : String.fromCharCode(74),
            "15" : String.fromCharCode(75),
            "16" : String.fromCharCode(76),
            "17" : String.fromCharCode(77),
            "18" : String.fromCharCode(78),
            "19" : String.fromCharCode(79),
            "20" : String.fromCharCode(80),
            "21" : String.fromCharCode(81),
            "22" : String.fromCharCode(82),
            "23" : String.fromCharCode(83),
            "24" : String.fromCharCode(84),
            "25" : String.fromCharCode(85),
            "26" : String.fromCharCode(86),
            "27" : String.fromCharCode(87),
            "28" : String.fromCharCode(88),
            "29" : String.fromCharCode(89),
            "30" : String.fromCharCode(90),
            "31" : String.fromCharCode(91),
            "32" : String.fromCharCode(92),
            "33" : String.fromCharCode(93),
            "34" : String.fromCharCode(94),
            "35" : String.fromCharCode(95),
            "36" : String.fromCharCode(96),
            "37" : String.fromCharCode(97),
            "38" : String.fromCharCode(98),
            "39" : String.fromCharCode(99),
            "40" : String.fromCharCode(100),
            "41" : String.fromCharCode(101),
            "42" : String.fromCharCode(102),
            "43" : String.fromCharCode(103),
            "44" : String.fromCharCode(104),
            "45" : String.fromCharCode(105),
            "46" : String.fromCharCode(106),
            "47" : String.fromCharCode(107),
            "48" : String.fromCharCode(108),
            "49" : String.fromCharCode(109),
            "50" : String.fromCharCode(110)
            };

        this.readConfigFromCookies();
    }

    /**
     * Translate the given zone, direction, shared left flag, shared right flag, channelized right, through lanes, left lanes,
     * right lanes, and unused flag parameters into two ASCII characters. The first character represents the zone, direction, and
     * three flags; the second character represents the three lane type values and one flag that, thus far, is unused.
     * @param {int} zone The zone value between 0 and 5
     * @param {int} dir The zone value between 0 and 3
     * @param {int} LS The value of the left shared flag
     * @param {int} RS The value of the right shared flag
     * @param {int} RC The value of the right channelized flag
     * @param {int} T The number of through lanes for the given zone and given direction
     * @param {int} L The number of left lanes for the given zone and given direction
     * @param {int} R The number of right lanes for the given zone and given direction
     * @param {int} Flag The value of the unused flag
     * @returns {string} A string of two characters that represents all of the data given
     */
    TMtoCHAR(Zone,Dir,LS,RS,RC,T,L,R,Flag) {
            var a,b,strCode,x,y;
            b = (Zone << 5) + (Dir << 3) + (LS << 2) + (RS << 1) + (RC << 0) + 32;
            if (b >= 59)
                b++;
            if (b >= 127)
                b++;
            a = (Flag << 7) + (T << 4) + (L << 2) + (R << 0) + 32;
            if (a >= 59)
                a++;
            if (a >= 127)
                a++;
            strCode = String.fromCharCode(b,a);
            return strCode;
    };

    /**
     * Translate the given string of two ASCII characters into an array containing the values of the zone, direction,
     * shared left flag, shared right flag, channelized right, through lanes, left lanes, right lanes, and one unused
     * flag.
     * @param {string} strCode A string of two characters to be decoded
     * @returns {int[]} An array containing the described parameters
     */
    CHARtoTM(strCode) {
            var a, T, L, R, LS, RS, RC, b, Flag, Zone, Dir, x;
            b = strCode.charCodeAt();
            a = strCode.charCodeAt(1);

            if (b >= 128)
                b--;
            if (b >= 60)
                b--;
            b = b - 32;
            Zone = (b & 0b11100000) >> 5;
            Dir  = (b & 0b00011000) >> 3;
            LS   = (b & 0b00000100) >> 2;
            RS   = (b & 0b00000010) >> 1;
            RC   = (b & 0b00000001) >> 0;
            if (a >= 128)
                a--;
            if (a >= 60)
                a--;
            a = a - 32;
            Flag = (a & 0b10000000) >> 7;
            R = (a & 0b00000011) >> 0;
            L = (a & 0b00001100) >> 2;
            T = (a & 0b01110000) >> 4;
            x = [Zone,Dir,LS,RS,RC,T,L,R,Flag];
            return x;
    };

    /**
     * Reference the configuration key enumeration to get the ASCII character for the given configuration number.
     * This feature is soon to be deprecated because it's easier to add 33 to config_ID.
     * @param {int} config_num The configuration number of the Intersection to get the character ID for
     * @returns {string} A string containing the character corresponding to the given integer ID
     */
    getConfigId(config_num) {
        return this._ConfigKeyEnum[config_num.toString()];
    }

    /**
     * Encodes the current configuration into an ASCII string that is then added to the user's cookies. The default
     * expiration date of the configuration is a week from its last writing.
     */
    writeConfigToCookies() { 

        var configString = "";

        configString += this.isCookieLatestBackup() ? "1" : "0";

        var currentConfig, currentZone, currentDir;
        for(var config = 0; config < NUM_INTERSECTION_CONFIGS; config++) {

            if(!PROJECT.getIntersectionByIndex(config).isEnabled())
                continue;
            else
                configString += this._break_char + this.getConfigId(config);

            currentConfig = PROJECT.getIntersectionByIndex(config);
            for(var zone = MIN_EFFECTIVE_ZONE; zone < NUM_ZONES; zone++) {

                if(!currentConfig.getZoneByIndex(zone).isEnabled()) {
                    continue;
                }

                currentZone = currentConfig.getZoneByIndex(zone);
                for(var dir = 0; dir < 4; dir++) {
                    currentDir = currentZone.getDirectionByIndex(dir);

                    configString += this.TMtoCHAR(zone, dir, currentDir.getSharedLeft(), currentDir.getSharedRight(),
                                            currentDir.getchannelizedRight(), currentDir.getThrough(), currentDir.getLeftTurn(),
                                            currentDir.getRightTurn(), 0);
                }
            }
        }

        this._cookie = configString;

        var date = new Date();
        date.setTime(date.getTime() + (7 * 24 * 60 * 60 * 1000));
        var expires = "; expires=" + date.toUTCString();
        document.cookie = this._cookie_id + "=" + this._cookie + expires + "; path=/";
    }

    cookiesFoundOnStartup() {
        return this._startup_cookies_found;
    }

    setCookieAsLatestBackup() {
        this._are_cookies_latest = true;
    }

    isCookieLatestBackup() {
        return this._are_cookies_latest;    
    }

    /**
     * Searches for any stored cookies, decodes them if they are found, and updates the configuration.
     */
    readConfigFromCookies() {

        // Check if there exists any content stored in a field ID'd _cookie_id.
        // If not, don't do anything of value.
        if(!(document.cookie.indexOf(this._cookie_id + "=") >= 0))
            console.log("No cookies found. Not updating configuration from backup.");
        // If so, decode the cookies and read the project configuration into this session's project object.
        else {
            console.log("Cookies found! Check if they're the latest backup...");
            this._startup_cookies_found = true;
            console.log(true);
            // If the "cookies as latest backup" flag is set to true, continue reading cookies to the project config.
            // If not, there's nothing to do. Function will complete with no further action.
            if(document.cookie.charAt(this._cookie_id.length + 1) === "1") {
                console.log("Cookies identified as latest backup, writing them to the project configuration...");
                this.setCookieAsLatestBackup();

                this._cookie = document.cookie.substring(this._cookie_id.length + 2);
                var records     = [];
                var char_index  = 1;
                var sub_start   = 0;
                var sub_end     = 0;
                while(char_index != this._cookie.length) {
                    if(this._cookie.charAt(char_index) === this._break_char) {
                        sub_end = char_index;
                        records.push(this._cookie.substring(sub_start + 1, sub_end));
                        sub_start = sub_end;
                    }
                    if(char_index == this._cookie.length - 1) {
                        records.push(this._cookie.substring(sub_start + 1));
                        break;
                    }
                    char_index++;
                }
               
                var currentConfig;
                var configKeyEnum = this._ConfigKeyEnum;
                var _this = this;
                records.forEach(function(record){
                    currentConfig = PROJECT.getIntersectionByIndex(objectKeyByValue(configKeyEnum, record.charAt(0)));
                    // Credit to StackOverflow's David TanG
                    record.substring(1).match(/.{2}/g).forEach(function(infopack) {
                        var configDetails = _this.CHARtoTM(infopack);
                        //if(objectKeyByValue(configKeyEnum, record.charAt(0)) == 0) console.log("Setting zone " + configDetails[0] + ", direction " + configDetails[1] + " to " + [configDetails[6], configDetails[5], configDetails[7], configDetails[2], configDetails[3], configDetails[4] ]); 
                        currentConfig.getZoneByIndex(configDetails[0]).getDirectionByIndex(configDetails[1]).setEntryArray( [configDetails[6], configDetails[5], configDetails[7], configDetails[2], configDetails[3], configDetails[4] ]);
                    });
                });
            }
        }
    }
}
// [END] ////////// [DATA STRUCTURE] ////////////////////
