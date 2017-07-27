/**
 * @fileOverview Various tools and data structures relative to the VJuST application and its functionality.
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
     * @param {string} ns_route_name The name of the intersecting route that travels north and south
     * @param {string} ew_route_name The name of the intersecting route that travels east and west
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
        for(var interNum = 0; interNum < NUM_INTERSECTION_CONFIGS; interNum++)
            this._intersections.push(new Intersection(interNum, 6));
    }

    /**
     * Sets the entries of every direction of every zone of every intersection to 0.
     */
    resetConfig() {
        for(var i = 0; i < 50; i++)
            for(var z = 0; z < 6; z++)
                for(var d = 0; d < 4; d++)
                    this._intersections[i].getZoneByIndex(z).getDirectionByIndex(d).setEntryArray([0, 0, 0, 0, 0, 0]);
    }

    /**
     * Retreive an Intersection object by its position in the Project's Intersection array.
     * @param {number} index The index of the Intersection object
     * @returns {Object} The Intersection object at the specified index
     */
    getIntersectionByIndex(index) {
        return this._intersections[index];
    }

    /**
     * Retreive an Intersection object by its ID number.
     * @param {number} config_ID The ID number of the Intersection type
     * @returns {Object} The Intersection object with the specified ID number
     */
    getIntersectionByID(config_ID) {
        return this._intersections[config_ID - 1];
    }

    getIntersectionArray() {
        return this._intersections;
    }

    /**
     * Use a given configuration matrix to update the configuration, from the Intersections down to the Direction(al) entries.
     * @param {int[][][][]} config_matrix A four-dimensional matrix where the first dimension represents Intersections, the second dimension
     * represents Zones, the third dimensions represents Directions, and the fourth dimension represents the Direction's entries.
     * The first entry on the second and third dimensions are reserved for flags to detail if the above dimension is active.
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
        var headers = ["configuration", "zone", "direction", "left lanes", "through lanes", "right lanes", "shared left", "shared right", "channeled right"];
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
                    csvContent += IntersectionEnum[config.toString()] + "," + (zone + 1) + "," + DirectionEnum[dir.toString()] + ",";
                    
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
                    .getDirectionByIndex(objectKeyByValue(DirectionEnum, csv_data[row][2]))
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
     * @param {int} effective_zones The number of active zones the intersection has.
     */
    constructor(config_ID, effective_zones) {
        if(config_ID > NUM_INTERSECTION_CONFIGS) {
            console.warn("Invalid Intersection construction: configuration ID cannot be greater than 50.")
        }
        if(effective_zones > 6)
            console.warn("Invalid Intersection construction: number of effective zones cannot be greater than 6.");

        this._config_ID = config_ID;
        this._enabled = 1;
        this._effective_zones = effective_zones;

        this._zones = new Array();
        for(var zone_num = 0; zone_num < effective_zones; zone_num++)
            this._zones.push(new Zone(zone_num + 1, config_ID));
    }

    /**
     * Change the value of this objects stored number of effective zones.
     * @param {int} effective_zones The number of effective zones to be set.
     */
    setEffectiveZones(effective_zones) {
        this._effective_zones = effective_zones;
    }

    /**
     * Returns the number of effective or active zones for this Intersection.
     * @returns {int} The number of active zones
     */
    getEffectiveZones() {
        return this._effective_zones;
    }

    /**
     * Reduce the number of effective zones for this Intersection by one. If the number of effective zones is now
     * zero, set the Intersection to disabled. This is exclusively used in testing the behavior of a project and its
     * functions with randomly generated values.
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
    constructor(zone_ID, intersection_ID) {
        if(zone_ID > 6) {
            console.warn("Invalid Zone construction: zone ID cannot be greater than 6. Skipping...");
        }

        this._intersection_ID = intersection_ID;
        this._zone_ID         = zone_ID;
        this._active_flag     = 1;
        this._north           = new Direction("north", intersection_ID, zone_ID, 0);
        this._south           = new Direction("south", intersection_ID, zone_ID, 2);
        this._east            = new Direction("east" , intersection_ID, zone_ID, 1);
        this._west            = new Direction("west" , intersection_ID, zone_ID, 3);
        this._direction_array = [this._north, this._south, this._east, this._west];

    }

    /**
     * Returns the Direction object in which traffic is traveling through this Zone northbound.
     * @returns {Direction} The Direction object for northbound traffic
     */
    getNorthbound() {
        return this._north;
    }

    /**
     * Returns the Direction object in whcih traffic is traveling through this Zone southbound.
     * @returns {Direction} The Direction object for southbound traffic
     */
    getSouthbound() {
        return this._south;
    }

    /**
     * Returns the Direction object in which traffic is traveling through this Zone eastbound.
     * @returns {Direction} The Direction object for eastbound traffic
     */
    getEastbound() {
        return this._east;
    }

    /**
     * Returns the Direction object in which traffic is traveling through this Zone westbound.
     * @returns {Direction} The Direction object for westbound traffic
     */
    getWestbound() {
        return this._west;
    }

    /**
     * Returns the array of Direction objects for the Zone in the order: North, South, East, West
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
}





class Direction {
    /**
     * The lowest level of the Project data structure. The Direction object contains information about its cardinal direction and
     * the number of (left, through, right, shared left, shared right, and channeled right) lanes for said cardinal direction.
     * @constructor
     * @param {string} cardinal_direction The cardinal direction (north, east, south, or west) for this Direction object.
     */
    constructor(cardinal_direction, intersection_id, zone_id, direction_id) {
        this._cardinal_direction   = cardinal_direction;
        this._left_turn            = 0;
        this._through              = 0;
        this._right_turn           = 0;
        this._shared_left          = 0;
        this._shared_right         = 0;
        this._channeled_right      = 0;
        this._entry_array          = [this._left_turn, this._through, this._right_turn, this._shared_left, this._shared_right, this._channeled_right];
        this._user_movement_vols   = new DetailedVolume(this._cardinal_direction, -1, -1, -1);
        this._TCU_vols             = new DetailedVolume(this._cardinal_direction, -1, -1, -1);
        this._address              = [intersection_id, zone_id, direction_id];

        //this._route                = new Object();
        //this._route.left           = new MovementRoute(this._address.push(0));
        //this._route.through        = new MovementRoute(this._address.push(1));
        //this._route.right          = new MovementRoute(this._address.push(2));
        // experimentation
        //this.randomizeEntries();
    }

    /**
     * Returns a lane data entry based on the specified index. Shared left (3), shared right (4), and channeled right (5) are flags.
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
    sync() {
        this._left_turn         = this._entry_array[0];
        this._through           = this._entry_array[1];
        this._right_turn        = this._entry_array[2];
        this._shared_left       = this._entry_array[3];
        this._shared_right      = this._entry_array[4];
        this._channeled_right   = this._entry_array[5];
    }

    /**
     * Set the value of a data entry in the entry array at a specified index to a specified value. Note that values at indices 3 to 5
     * should not be set to a value other than 0 or 1.
     * @param {int} entry_pos The index of the entry to be changed
     * @param {int} new_value The value to set the entry to
     */
    setEntryByIndex(entry_pos, new_value) {
        this._entry_array[entry_pos] = new_value;
        this.sync();
    }

    /**
     * Set the entire entry array to the passed array. As of version 0.0.1 the entry array consists of six entries in the order
     * left turn lanes, through lanes, right turn lanes, shared left flag, shared right flag, channeled right flag.
     * @param {int[]} An array of entry values
     */
    setEntryArray(entry_array) {
        this._entry_array = entry_array;
        this.sync();
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
    getChanneledRight() {
        return this._channeled_right;
    }

    /**
     * Returns the entire entry array stored in this Direction object.
     * @returns {int[]} The array of entries
     */
    getEntryArray() {
        return this._entry_array;
    }

    /**
     * Set all of the entry values to random values within reasonable values relative to the variable.
     * Left and right turns should be between 0 and 3. Through lanes should be between 0 and 5.
     * Shared left, shared right, and channelized right flags should be between 0 and 1.
     * All values are integers.
     * This is used exclusively for testing.
     */
    randomizeEntries() {
        var getRandomInt = function(min, max) {
            var rand = Math.floor(Math.random() * (max - min + 1)) + min;
            return rand;
        }

        this._left_turn         = getRandomInt(0,3);
        this._through           = getRandomInt(0,5);
        this._right_turn        = getRandomInt(0,3);
        this._shared_left       = getRandomInt(0,1);
        this._shared_right      = getRandomInt(0,1);
        this._channeled_right   = getRandomInt(0,1);
        this.sync();
    }

    getVolumes() {
        return this._user_movement_vols;
    }

    /**
     * Adjust movement volumes based on the number and configuration of lanes. If three exclusive right turn lanes and a single shared right
     * lane exist, move one-fourth of the general right volume to the shared right lane. When the channelized right lane exists, consider 
     *
     */
    adjustFlowRatesByLaneConfiguration() {
        // Ensure that the TCU volumes are up to date. Here we are assuming the user movement volumes have already been converted to their PCE.
        this._TCU_vols.setLeft(this._user_movement_vols.getLeft());
        this._TCU_vols.setRight(this._user_movement_vols.getRight()); 
        this._TCU_vols.setThrough(this._user_movement_vols.getThrough());

        var right_vol = this._TCU_vols.getRight();
        var right_vol_splitfrac = ( (1 + (this._right_turn - this._shared_right)) / (this._right_turn + 1) );
        this._TCU_vols.setThrough(Math.round(this._TCU_vols.getThrough() + ((right_vol / UNIVERSAL_RIGHT_TURN_ADJUSTMENT_FACTOR ) * (1 - right_vol_splitfrac) ) ));
        this._TCU_vols.setRight(Math.round(right_vol * (right_vol_splitfrac * (1 - this._channeled_right))));

        // This needs to be adjusted for phase effect.
        var left_vol = this._TCU_vols.getLeft();
        var left_vol_splitfrac = ( (1 + (this._left_turn - this._shared_left)) / (this._left_turn + 1) );
        this._TCU_vols.setThrough(this._TCU_vols.getThrough() + (left_vol * (1 - left_vol_splitfrac) ));
        this._TCU_vols.setLeft(left_vol * left_vol_splitfrac);
    }
}



class ModalFactory {
    /** 
     * This is a class that helps with the creation of help modals on the application view. This tool will automatically
     * store new modals in the help_modals div. An image or youtube video may be shown on the modal, but not both simultaneously.
     * One ModalFactory object can be used to generate any number of modal elements on the HTML page. Simply modify the class's
     * member variables and regenerate with <tt>ModalObject.injectModalHTML(ModalObject.generateModalHTML())</tt>; however, it
     * is recommended to create a new ModalFactory object for each modal if one wishes to later manage the modal. Once a new
     * modal is generated and injected, the previous modal cannot be modified and must be removed from the page manually via ID.
     * @constructor
     * @param {string} element_id The element ID to be used in the creation of the modal
     * @param {string} header The header text that is to be shown on the modal
     * @param {string} image An image to be shown on the help modal. If an image shouldn't be used, specify "null"
     * @param {string} image_size The size of the image following Semantic-UI descriptors (small, medium, large, or huge). If an image wasn't used, specify "null"
     * @param {string} youtube_import The URL of a YouTube video to be added to the modal. If a YouTube video shouldn't be used, specify "null"
     * @param {string} description The description text to be shown in the description of the modal
     */
    constructor(element_id, header, image, image_size, youtube_import, description, button_text) {
        // Header error tracer for improperly defined ModalFactory object.
        if(header === undefined) 
            this._header = "Undefined Header";
        else
            this._header = header;
        
        // Description error tracer for improperly defined ModalFactory object.
        if(description === undefined)
            this._description = "Undefined description! Check your function call.";
        else
            this._description = description;

        // Default button text value.
        if(button_text === undefined)
            this._button_text = "Got it!";
        else
            this._button_text = button_text;

        this._element_id       = element_id;
        this._image            = image;
        this._image_size       = image_size;
        this._youtube_import   = youtube_import;
        this._button_text      = button_text;

        // Add the modal to the DOM upon object instantiation
        this.injectModalHTML(this.generateModalHTML());
    }

    /**
     * Returns the ID to be used in the generation of the modal.
     * @returns {string} The stored ID
     */
    getElementID() {
        return this._element_id;
    }

    /**
     * Returns the header to be used in the generation of the modal.
     * @returns {string} The stored description
     */
    getHeader() {
        return this._header;
    }

    /**
     * Returns the image data (not the URL) for the image to be used in the generation of the modal.
     * @returns {string} The stored image data
     */
    getImageURI() {
        return this._image;
    }

    /**
     * Returns the image size descriptior to be used in the generation of the modal.
     * @returns {string} The stored image size
     */
    getImageSize() {
        return this._image_size;
    }

    /**
     * Returns the URL of the YouTube video to be used in the generation of the modal.
     * @returns {string} The stored YouTube video URL
     */
    getYoutubeImportURL() {
        return this._youtube_import;
    }

    /**
     * Returns the description to be used in the generation of the modal.
     * @returns {string} The stored description text
     */
    getDescription() {
        return this._description;
    }

    /**
     * Change the element ID of the last generated modal. This function will remove the last generated modal
     * and replace it with a new modal with the changed element ID. If you're looking for a method to change
     * the element ID in order to create a new modal, see {@link setElementID}.
     * @see setElementID
     * @param {string} new_id The element ID to switch to
     */
    setExistingElementID() {
        this._element_id = new_id;
        $("#" + element_ID).remove();
        injectModalHTML(generateModalHTML());
    }

    /**
     * Check if a given string qualifies as a URL.
     * @returns {boolean} <tt>true</tt> if URL; <tt>false</tt> if not
     */
    isURL(url) {
            var strRegex = "^((https|http|ftp|rtsp|mms)?://)"
                + "?(([0-9a-z_!~*'().&=+$%-]+: )?[0-9a-z_!~*'().&=+$%-]+@)?" //ftp的user@
                + "(([0-9]{1,3}\.){3}[0-9]{1,3}" // IP形式的URL- 199.194.52.184
                + "|" // 允许IP和DOMAIN（域名）
                + "([0-9a-z_!~*'()-]+\.)*" // 域名- www.
                + "([0-9a-z][0-9a-z-]{0,61})?[0-9a-z]\." // 二级域名
                + "[a-z]{2,6})" // first level domain- .com or .museum
                + "(:[0-9]{1,4})?" // 端口- :80
                + "((/?)|" // a slash isn't required if there is no file name
                + "(/[0-9a-z_!~*'().;?:@&=+$,%#-]+)+/?)$";
             var re = new RegExp(strRegex);
             return re.test(url);
    }

    /**
     * Generate the HTML for the modal that is to be added to the view using settings defined in this object's member variables.
     * In order for the generated HTML, use this in conjuntion with ModalFactory's injection function.
     * @see injectModalHTML
     * @returns {string} The HTML code for the modal
     */
    generateModalHTML() {
        var htmlInjection;
        if(this._image === undefined || this._image === "null") {
            if(this._youtube_import === undefined || this._image === "null") {
                htmlInjection = "<div id='" + this._element_id + "' class='ui modal'><div class='header'>" + this._header + "</div><div class='content'><p>" +
                                this._description + "</p></div><div class='actions'><div class='ui positive right labeled icon button'>" + this._button_text + "<i class='checkmark icon'></i></div>";
            }
            else {
                if(isURL(this._youtube_import)) {
                    htmlInjection = "<div id='" + this._element_id + "' class='ui modal'><div class='header'>" + this._header + "</div><div class='image content'>" +
                                    "<div class='ui image large'><iframe width='390' height'220' src='" + this._youtube_import + "' frameborder='0' allowfullscreen>" +
                                    "</iframe></div><div class='description'><p>" + this._description + "</p></div></div><div class='actions'><div class='ui positive" +
                                    " right labeled icon button'>" + this._button_text + "</div><i class='checkmark icon'></i></div></div></div>";
                }
                else {
                    this._description = this._description + " The YouTube URL wasn't recognized as a valid URL. Make sure http:// or https:// has been included.";
                    htmlInjection = "<div id='" + this._element_id + "' class='ui modal'><div class='header'>" + this._header + "</div><div class='content'><p>" + 
                                    this._description + "</p></div><div class='actions'><div class='ui positive right labeled icon button'>" + this._button_text + "<i class='checkmark icon'></i></div>";
                }
            }
        }
        else {
            if(this._image_size === undefined || this._image_size === "null") {
                htmlInjection = "<div id='" + this._element_id + "' class='ui modal'><div class='header'>" + this._header + "</div><div class='image content'>" +
                                "<div class='ui image medium'><img src='" + this._image + "'></div><div class='description'><p>" + this._description + "</p></div></div>" +
                                "<div class='actions'><div class='ui positive right labeled icon button'>" + this._button_text + "</div><i class='checkmark icon'></i></div></div></div>";
            }
            else {
                htmlInjection = "<div id='" + this._element_id + "' class='ui modal'><div class='header'>" + this._header + "</div><div class='image content'>" +
                                "<div class='ui image " + this._image_size + "'><img src='" + this._image + "'></div><div class='description'><p>" + this._description + "</p></div></div>" +
                                "<div class='actions'><div class='ui positive right labeled icon button'>" + this._button_text + "</div><i class='checkmark icon'></i></div></div></div>";
            }
        }

        return htmlInjection;
    }

    /**
     * Append the given HTML code to the end of the #modal_wrapper div in the HTML view.
     * @param {string} modal_html The HTML to be appended
     */
    injectModalHTML(modal_html) {
        $("#modal_wrapper").append(modal_html);
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

            if(!project.getIntersectionByIndex(config).isEnabled())
                continue;
            else
                configString += this._break_char + this.getConfigId(config);

            currentConfig = project.getIntersectionByIndex(config);
            for(var zone = MIN_EFFECTIVE_ZONE; zone < NUM_ZONES; zone++) {

                if(!currentConfig.getZoneByIndex(zone).isEnabled()) {
                    continue;
                }

                currentZone = currentConfig.getZoneByIndex(zone);
                for(var dir = 0; dir < 4; dir++) {
                    currentDir = currentZone.getDirectionByIndex(dir);

                    configString += this.TMtoCHAR(zone, dir, currentDir.getSharedLeft(), currentDir.getSharedRight(),
                                            currentDir.getChanneledRight(), currentDir.getThrough(), currentDir.getLeftTurn(),
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
                    currentConfig = project.getIntersectionByIndex(objectKeyByValue(configKeyEnum, record.charAt(0)));
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

class GeneralVolume {
    /**
     * A class to contain and organize data pertaining to general volumes used in the Fratar balancing
     * method. General volumes are those that describe only the number of vehicles that enter and leave
     * each leg of the intersection. They do not detail the volume per movement (left, through, right).
     * @param {string} direction The cardinal direction of the intersection branch relative to the intersection
     * itself. A general volume describing vehicles moving southbound to enter the intersection and northbound
     * to exit the intersection are in the north cardinal zone.
     * @param {int} general_volume The number of vehicles traveling in and out of this branch of the intersection.
     * @param {float} d_factor A percentage value describing the ratio between eastbound and westbound vehicles, and
     * northbound and southbound vehicles. Being that each GeneralVolume object describes only a single branch, this value
     * dictates the number of vehicles entering and leaving said branch. In the case of eastbound and westbound vehicles,
     * a D factor greater than 0.50 expresses that more vehicles are moving eastbound than westbound. In the case of
     * northbound and southbound vehicles, a D factor greater than 0.50 expresses that more vehicles are moving northbound
     * than southbound.
     * @param {float} k_factor NOT DEFINED YET
     * @param {float} truck_per A percentage value describing the volume of trucks relative to the general volume. If 30 of 100
     * vehicles in the measured general volume are trucks, there is a 30% truck percentage, represented here by 0.3.
     * @constructor
     */
    constructor(direction, general_volume, d_factor, k_factor, truck_per) {
        this._direction      = direction;
        this._general_volume = general_volume;
        this._d_factor       = d_factor;
        this._k_factor       = k_factor;
        this._truck_per      = truck_per;

        if(direction === "north") {
            this._volume_in  = this._general_volume * (1 - d_factor);
            this._volume_out = this._general_volume * d_factor;
        }
        if(direction === "east") {
            this._volume_in  = this._general_volume * (1 - d_factor);
            this._volume_out = this._general_volume * d_factor;
        }
        if(direction === "south") {
            this._volume_in  = this._general_volume * d_factor;
            this._volume_out = this._general_volume * (1 - d_factor);
        }
        if(direction === "west") {
            this._volume_in  = this._general_volume * d_factor;
            this._volume_out = this._general_volume * (1 - d_factor);
        }

        this._volume_cars_in  = this._volume_in * (1 - this._truck_per);
        this._volume_cars_out = this._volume_out * (1 - this._truck_per);

        this._volume_trucks_in  = this._volume_in * this._truck_per;
        this._volume_trucks_out = this._volume_out * this._truck_per;
    }

    /**
     * Returns the stored value for the general volume.
     * @returns {int} The volume of vehicles
     */
    getGeneralVolume() {
        return this._general_volume;
    }

    /**
     * Returns the stored value for the number of cars that are entering the intersection via the specified branch. 
     * @returns {int} The volume of cars entering
     */
    getVolumeCarsIn() {
        return this._volume_cars_in;
    }

    /**
     * Returns the stored value for the number of cars that are exiting the intersection via the specified branch.
     * @returns {int} The volume of cars exiting
     */
    getVolumeCarsOut() {
        return this._volume_cars_out;
    }

    /**
     * Returns the stored value for the number of trucks that are entering the intersection via the specified branch.
     * @returns {int} The volume of trucks entering
     */
    getVolumeTrucksIn() {
        return this._volume_trucks_in;
    }

    /**
     * Returns the stored value for the number of trucks that are exiting the intersection via the specified branch.
     * @returns {int} The volume of trucks exiting
     */
    getVolumeTrucksOut() {
        return this._volume_trucks_out;
    }
}

class DetailedVolume {
    /**
     * A class for containing and organizing information relative to intersection branch movement volumes in an unbounded manner. In the
     * unbounded case, a "north" DetailedVolume object describes vehicles entering and leaving via the northern branch of the intersection
     * (southbound entering the intersection and northbound exiting the intersection).
     * @param {string} direction The cardinal direction of the branch relative to the intersection point
     * @param {int} left The volume of vehicles traveling through the left turning lane of this branch
     * @param {int} through The volume of vehicles traveling through the through movement lane of this branch
     * @param {int} right The volume of vehicles traveling through the right turning lane of this branch
     * @see BoundedDetailedVolume for the same organization but with direction described in terms of bounds ("northbound" being the southern branch).
     * @constructor
     */
    constructor(direction, left, through, right) {
        this._direction   = direction;
        this._left        = left;
        this._through     = through;
        this._right       = right;
        this._pce_enabled = false;
    }

    /**
     * Returns the volume of movement in the left lane.
     * @returns {int} left lane volume
     */
    getLeft() {
        return this._left;
    }
 
    /**
     * Returns the volume of movement in the through lane.
     * @returns {int} through lane volume
     */
    getThrough() {
        return this._through;
    }

    /**
     * Returns the volume of movement in the right lane.
     * @returns {int} right lane volume
     */
    getRight() {
        return this._right;
    }

    /**
     * Given the truck percentages for each movement, calculate the Passenger Car Equivalent (PCE) assuming that one truck equals two passenger
     * cars. Return a new DetailedVolume object with the modified values. To perform this calculation, the number of trucks is added to the existing
     * volume.
     * @param {float} left_truck_per The percentage of vehicles in the left turn lane that are trucks
     * @param {float} through_truck_per The percentage of vehicles in the through lane that are trucks
     * @param {float} right_truck_per The percentage of vehicles in the right turn lane that are trucks
     * @returns {DetailedVolume} A new DetailedVolume object with updated lane volumes
     *
     * @example
     * // Convert an existing DetailedVolume object into a PCE-Enabled DetailedVolume object based on the original object's values
     * myDetailedVolume.getLeft() // → 500
     * myDetailedVolume = myDetailedVolume.getPassengerCarEquivalent(0.05, 0.10, 0.15);
     * myDetailedVolume.getLeft() // → 525
     */
    getPassengerCarEquivalent(left_truck_per, through_truck_per, right_truck_per) {
        var new_detvol = new DetailedVolume(this._direction, (this._left + (this._left * left_truck_per)), (this._through * (this._through * through_truck_per)), (this._right * (this._right * right_truck_per)));
        new_detvol.enablePCE();
        return new_detvol;
    }
    
    /**
     * Manually set the PCE state to a passed boolean value.
     * @param {boolean} state <tt>true</tt> for enabled; <tt>false</tt> for disabled
     */
    setPCEState(state) {
        this._pce_enabled = state;
    }

    setLeft(value) {
        this._left = value;
    }

    setThrough(value) {
        this._through = value;
    }

    setRight(value) {
        this._right = value;
    }

    /**
     * Set the PCE-Enabled state to on, or true.
     */
    enablePCE() {
        this.setPCEState(true);
    }

    /**
     * Set the PCE-Enabled state to off, or false.
     */
    disablePCE() {
        this.setPCEState(false);
    }

    /**
     * Return if Passenger Car Equivalence is on or off.
     * @returns {boolean} <tt>true</tt> if PCE is enabled; </tt>false</tt> if PCE is disabled
     */
    isPCEEnabled() {
        return this._pce_enabled;
    }
}

/**
 * A class for storing and organizing volumes for turning movements from a bounded (northbound) point of view.
 * @param {string} bound_direction The cardinal direction of the bounded movement
 * @param {int} left The value of bounded movement in the left lane
 * @param {int} through The value of bounded movement in the through lane
 * @param {int} right The value of the bounded movement in the right lane
 * @constructor
 */
class BoundedDetailedVolume {
    constructor(bound_direction, left, through, right) {
        this._bound_direction = bound_direction;
        this._left            = left;
        this._through         = through;
        this._right           = right;
        this._pce_enabled     = false;
    }

    /**
     * Returns the volume of movement in the left lane.
     * @returns {int} left lane volume
     */
    getLeft() {
        return this._left;
    }

    /**
     * Returns the volume of movement in the through lane.
     * @returns {int} through lane volume
     */
    getThrough() {
        return this._through;
    }

    /**
     * Returns the volume of movement in the right lane.
     * @returns {int} right lane volume
     */
    getRight() {
        return this._right;
    }

    /**
     * Given the truck percentages for each movement, calculate the Passenger Car Equivalent (PCE) assuming that one truck equals two passenger
     * cars. Return a new BoundedDetailedVolume object with the modified values. To perform this calculation, the number of trucks is added to
     * the existing volume.
     * @param {float} left_truck_per The percentage of vehicles in the left turn lane that are trucks
     * @param {float} through_truck_per The percentage of vehicles in the through lane that are trucks
     * @param {float} right_truck_per The percentage of vehicles in the right turn lane that are trucks
     * @returns {BoundedDetailedVolume} A new BoundedDetailedVolume object with updated lane volumes
     *
     * @example
     * // Convert an existing BoundedDetailedVolume object into a PCE-Enabled BoundedDetailedVolume object based on the original object's values
     * myBoundedDetailedVolume.getLeft() // → 500
     * myBoundedDetailedVolume = myBoundedDetailedVolume.getPassengerCarEquivalent(0.05, 0.10, 0.15);
     * myBoundedDetailedVolume.getLeft() // → 525
     */
    getPassengerCarEquivalent(left_truck_per, through_truck_per, right_truck_per) {
        var new_bdetvol = new BoundedDetailedVolume(this._direction, (this._left + (this._left * left_truck_per)), (this._through * (this._through * through_truck_per)), (this._right * (this._right * right_truck_per)));
        new_bdetvol.enablePCE();
        return new_bdetvol;
    }
    
    /**
     * Manually set the PCE state to a passed boolean value.
     * @param {boolean} state <tt>true</tt> for enabled; <tt>false</tt> for disabled
     */
    setPCEState(state) {
        this._pce_enabled = state;
    }

    /**
     * Set the PCE-Enabled state to on, or true.
     */
    enablePCE() {
        this.setPCEState(true);
    }

    /**
     * Set the PCE-Enabled state to off, or false.
     */
    disablePCE() {
        this.setPCEState(false);
    }

    /**
     * Return if Passenger Car Equivalence is on or off.
     * @returns {boolean} <tt>true</tt> if PCE is enabled; </tt>false</tt> if PCE is disabled
     */
    isPCEEnabled() {
        return this._pce_enabled;
    }
}

class DetailedPercentage {
    constructor(direction, left_perc, through_perc, right_perc) {
        this._direction = direction;
        this._left_perc = left_perc;
        this._through_perc = through_perc;
        this._right_perc = right_perc;
    }

    getLeft() {
        return this._left_perc;
    }

    getThrough() {
        return this._through_perc;
    }

    getRight() {
        return this._right_perc;
    }
}


class UserVolumeDefinitions {
    /**
     * A class to store and organize the user-defined data pulled from the initial volume table. Supports the storage of Fratar data alongside
     * user data.
     * @param {DetailedVolume} north_detvol
     * @param {DetailedVolume} east_detvol
     * @param {DetailedVolume} south_detvol
     * @param {DetailedVolume} west_detvol
     * @param {double} north_truckperc 
     * @param {double} east_truckperc
     * @param {double} south_truckperc
     * @param {double} west_truckperc
     */
    constructor(north_detvol, east_detvol, south_detvol, west_detvol, north_truckperc, east_truckperc, south_truckperc, west_truckperc) {
        this._user_defined_north_volumes = north_detvol;
        this._user_defined_east_volumes = east_detvol;
        this._user_defined_south_volumes = south_detvol;
        this._user_defined_west_volumes = west_detvol;

        this._user_defined_general_north_truck_perc = north_truckperc;
        this._user_defined_general_east_truck_perc = east_truckperc;
        this._user_defined_general_south_truck_perc = south_truckperc;
        this._user_defined_general_west_truck_perc = west_truckperc;

        this._using_fratar = false;
        this._specific_truck_percs_defined = false;
    }

    /**
     * Add to this object variables storing user-defined per-lane truck percentages. This will also enable the flag for specific percentages.
     * @param {DetailedPercentage} north_detperc
     * @param {DetailedPercentage} east_detperc
     * @param {DetailedPercentage} south_detperc
     * @param {DetailedPercetnage} west_detperc
     */
    defineUserSpecificTruckPercentages(north_detperc, east_detperc, south_detperc, west_detperc) {
        this._user_defined_specific_north_truck_perc = north_detperc;
        this._user_defined_specific_east_truck_perc = east_detperc;
        this._user_defined_specific_south_truck_perc = south_detperc;
        this._user_defined_specific_west_truck_perc = west_detperc;
        
        this._specific_truck_percs_defined = true;
    }

    /**
     * Add to this object variables storing Fratar-defined per-lane truck percentages. This will also enable the flag for specific percentages.
     * @param {DetailedPercentage} north_detperc
     * @param {DetailedPercentage} east_detperc
     * @param {DetailedPercentage} south_detperc
     * @param {DetailedPercetnage} west_detperc
     */
    defineFratarSpecificTruckPercentages(north_detperc, east_detperc, south_detperc, west_detperc) {
        this._fratar_defined_specific_north_truck_perc = north_detperc;
        this._fratar_defined_specific_east_truck_perc = east_detperc;
        this._fratar_defined_specific_south_truck_perc = south_detperc;
        this._fratar_defined_specific_west_truck_perc = west_detperc;
        
        this._specific_truck_percs_defined = true;
    }

    /**
     * Return the percentage of trucks to this object's most specific knowledge. If specific values have been defined, those will
     * be returned. If not, the general percentages will
     *
     */
    getUserDefinedTruckPercentages() {
        if(this.isUsingFratar()) {
            if(this.isSpecificTruckPercsDefined()) {
                // return fratar-defined specific truck percentages
                return [this._fratar_defined_specific_north_truck_perc,
                        this._fratar_defined_specific_east_truck_perc,
                        this._fratar_defined_specific_south_truck_perc,
                        this._fratar_defined_specific_west_truck_perc
                ];
            }
            else {
                // return fratar-defined general truck percentages
                return [this._fratar_defined_general_north_truck_perc,
                        this._fratar_defined_general_east_truck_perc,
                        this._fratar_defined_general_south_truck_perc,
                        this._fratar_defined_general_west_truck_perc
                ];
            }
        }
        else {
            if(this.isSpecificTruckPercsDefined()) {
                // return user-defined specific truck percentages
                return [this._user_defined_specific_north_truck_perc,
                        this._user_defined_specific_east_truck_perc,
                        this._user_defined_specific_south_truck_perc,
                        this._user_defined_specific_west_truck_perc
                ];
            }
            else {
                // return user-defined general truck percentages
                return [this._user_defined_general_north_truck_perc,
                        this._user_defined_general_east_truck_perc,
                        this._user_defined_general_south_truck_perc,
                        this._user_defined_general_west_truck_perc
                ];
            }
        }
    }

    setUsingFratarVolumes(state) {
        this._using_fratar = false;
    }

    setFratarParameters(north_detvol, east_detvol, south_detvol, west_detvol, north_truckperc, east_truckperc, south_truckperc, west_truckperc) {
        this._fratar_defined_north_volumes = north_detvol;
        this._fratar_defined_east_volumes  = east_detvol;
        this._fratar_defined_south_volumes = south_detvol;
        this._fratar_defined_west_volumes  = west_detvol;

        this._fratar_defined_general_north_truck_perc = north_truckperc;
        this._fratar_defined_general_east_truck_perc = east_truckperc;
        this._fratar_defined_general_south_truck_perc = south_truckperc;
        this._fratar_defined_general_west_truck_perc = west_truckperc;
    }

    isUsingFratar() {
        return this._using_fratar;
    }

    isSpecificTruckPercsDefined() {
        return this._specific_truck_percs_defined;
    }
}



class VolumetricIntersection {
    /**
     * This is a class to organize and contain VolumeTool output data. It accepts DetailedVolume or BoundedDetailedVolume objects and
     * extends the given form to form a record of both. In other words, only DetailedVolume objects or only BoundedDetailedVolume objects
     * may be passed in, but either may be retreived once the object has been instantiated. It is very important that the <tt>bounded</tt>
     * flag is specified and specified correctly.
     * @param {DetailedVolume|BoundedDetailedVolume} north_carvol A DetailedVolume or BoundedDetailedVolume for car volumes north or southbound of the intersection
     * @param {DetailedVolume|BoundedDetailedVolume} east_carvol A DetailedVolume or BoundedDetailedVolume for car volumes east or westbound of the intersection
     * @param {DetailedVolume|BoundedDetailedVolume} south_carvol A DetailedVolume or BoundedDetailedVolume for car volumes south or northbound of the intersection
     * @param {DetailedVolume|BoundedDetailedVolume} west_carvol A DetailedVolume or BoundedDetailedVolume for car volumes west or eastbound of the intersection
     * @param {DetailedVolume|BoundedDetailedVolume} north_truckvol A DetailedVolume or BoundedDetailedVolume for truck volumes north or soutbound of the intersection
     * @param {DetailedVolume|BoundedDetailedVolume} east_truckvol A DetailedVolume or BoundedDetailedVolume for truck volumes east or westbound of the intersection
     * @param {DetailedVolume|BoundedDetailedVolume} south_truckvol A DetailedVolume or BoundedDetailedVolume for truck volumes south or northbound of the intersection
     * @param {DetailedVolume|BoundedDetailedVolume} west_truckvol A DetailedVolume or BoundedDetailedVolume for truck volumes west or eastbound of the intersection
     * @param {boolean} bounded A flag specifying if the given volume objects are BoundedDetailedVolume objects
     * @constructor
     */
    constructor(north_carvol, east_carvol, south_carvol, west_carvol, north_truckvol, east_truckvol, south_truckvol, west_truckvol, bounded) {
        if(bounded) {
            this._north_carvol_bounded   = north_carvol;
            this._east_carvol_bounded    = north_carvol;
            this._south_carvol_bounded   = north_carvol;
            this._west_carvol_bounded    = north_carvol;
            this._north_truckvol_bounded = north_truckvol;
            this._east_truckvol_bounded  = north_truckvol;
            this._south_truckvol_bounded = north_truckvol;
            this._west_truckvol_bounded  = north_truckvol;
        
            this._north_carvol   = new DetailedVolume("north", this._south_carvol_bounded.getLeft(), this._south_carvol_bounded.getThrough(), this._south_carvol_bounded.getRight());
            this._east_carvol    = new DetailedVolume("east" , this._west_carvol_bounded.getLeft(), this._west_carvol_bounded.getThrough(), this._west_carvol_bounded.getRight());
            this._south_carvol   = new DetailedVolume("south", this._north_carvol_bounded.getLeft(), this._north_carvol_bounded.getThrough(), this._north_carvol_bounded.getRight());
            this._west_carvol    = new DetailedVolume("west" , this._east_carvol_bounded.getLeft(), this._east_carvol_bounded.getThrough(), this._east_carvol_bounded.getRight());
            this._north_truckvol = new DetailedVolume("north", this._south_truckvol_bounded.getLeft(), this._south_truckvol_bounded.getThrough(), this._south_truckvol_bounded.getRight());
            this._east_truckvol  = new DetailedVolume("east" , this._west_truckvol_bounded.getLeft(), this._west_truckvol_bounded.getThrough(), this._west_truckvol_bounded.getRight());
            this._south_truckvol = new DetailedVolume("south", this._north_truckvol_bounded.getLeft(), this._north_truckvol_bounded.getThrough(), this._north_truckvol_bounded.getRight());
            this._west_truckvol  = new DetailedVolume("west" , this._east_truckvol_bounded.getLeft(), this._east_truckvol_bounded.getThrough(), this._east_truckvol_bounded.getRight());
        }
        else {
            this._north_carvol   = north_carvol;
            this._east_carvol    = east_carvol;
            this._west_carvol    = west_carvol;
            this._south_carvol   = south_carvol;
            this._north_truckvol = north_truckvol;
            this._east_truckvol  = east_truckvol;
            this._south_truckvol = south_truckvol;
            this._west_truckvol  = west_truckvol;

            this._north_carvol_bounded   = new BoundedDetailedVolume("northbound", this._south_carvol.getLeft(), this._south_carvol.getThrough(), this._south_carvol.getRight());
            this._east_carvol_bounded    = new BoundedDetailedVolume("eastbound",  this._west_carvol.getLeft(), this._west_carvol.getThrough(), this._west_carvol.getRight());
            this._south_carvol_bounded   = new BoundedDetailedVolume("southbound", this._north_carvol.getLeft(), this._north_carvol.getThrough(), this._north_carvol.getRight());
            this._west_carvol_bounded    = new BoundedDetailedVolume("westbound",  this._east_carvol.getLeft(), this._east_carvol.getThrough(), this._east_carvol.getRight());;
            this._north_truckvol_bounded = new BoundedDetailedVolume("northbound", this._south_truckvol.getLeft(), this._south_truckvol.getThrough(), this._south_truckvol.getRight());
            this._east_truckvol_bounded  = new BoundedDetailedVolume("eastbound",  this._west_truckvol.getLeft(), this._west_truckvol.getThrough(), this._west_truckvol.getRight());
            this._south_truckvol_bounded = new BoundedDetailedVolume("southbound", this._north_truckvol.getLeft(), this._north_truckvol.getThrough(), this._north_truckvol.getRight());
            this._west_truckvol_bounded  = new BoundedDetailedVolume("westbound",  this._east_truckvol.getLeft(), this._east_truckvol.getThrough(), this._east_truckvol.getRight());
        }
    }

    /**
     * Return detailed volumes (volume objects including information about movement volumes) about car volumes for each branch of the intersection in an unbounded format.
     * @returns {DetailedVolume[]} An array of car DetailedVolume objects in the order north, east, south, west
     */
    getUnboundedCarVolumes() {
        return [this._north_carvol, this._east_carvol, this._south_carvol, this._west_carvol];
    }

    /**
     * Return detailed volumes (volume objects including information about movement volumes) about truck volumes for each branch of the intersection in an unbounded format.
     * @returns {DetailedVolume[]} An array of truck DetailedVolume objects in the order north, east, south, west
     */
    getUnboundedTruckVolumes() {
        return [this._north_truckvol, this._east_truckvol, this._south_truckvol, this._west_truckvol];
    }

    /**
     * Return bounded detailed volumes (volume objects including information about movement volumes) about car volumes for each branch of the intersection by their
     * bounded movement (e.g. "northbound").
     * @returns {BoundedDetailedVolume[]} An array of car BoundedDetailedVolume objects in the order north, east, south, west
     */
    getBoundedCarVolumes() {
        return [this._north_carvol_bounded, this._east_carvol_bounded, this._south_carvol_bounded, this._west_carvol_bounded];
    }

    /**
     * Return bounded detailed volumes (volume objects including information about movement volumes) about truck volumes for each branch of the intersection by their
     * bounded movement (e.g. "northbound").
     * @returns {BoundedDetailedVolume[]} An array of truck BoundedDetailedVolume objects in the order north, east, south, west
     */
    getBoundedTruckVolumes() {
        return [this._north_truckvol_bounded, this._east_truckvol_bounded, this._south_truckvol_bounded, this._west_truckvol_bounded];
    }

    /**
     * Calculate and return the percentage of trucks for each direction using the general volume from said direction. The general volume
     * is equal to the sum of the left, through, and right volumes. The returned array contains percentages in the order north, east, south
     * and west. Note that the percentages correspond to unbounded directions, meaning southbound traffic contains the percentage of trucks
     * equal to the first (north) value returned from this function.
     * @returns {double[]} An array of decimal numbers between 0 and 1 representing percentages
     */
    getGeneralTruckPercentages() {
        var carvols = this.getUnboundedCarVolumes();
        var truckvols = this.getUnboundedTruckVolumes();

        var north_genperc = (truckvols[0].getLeft() + truckvols[0].getThrough() + truckvols[0].getRight()) / (truckvols[0].getLeft() + truckvols[0].getThrough() + truckvols[0].getRight() +
                                                                                                              carvols[0].getLeft() + carvols[0].getThrough() + carvols[0].getRight());

        var east_genperc = (truckvols[1].getLeft() + truckvols[1].getThrough() + truckvols[1].getRight()) / (truckvols[1].getLeft() + truckvols[1].getThrough() + truckvols[1].getRight() +
                                                                                                              carvols[1].getLeft() + carvols[1].getThrough() + carvols[1].getRight());
        
        var south_genperc = (truckvols[2].getLeft() + truckvols[2].getThrough() + truckvols[2].getRight()) / (truckvols[2].getLeft() + truckvols[2].getThrough() + truckvols[2].getRight() +
                                                                                                              carvols[2].getLeft() + carvols[2].getThrough() + carvols[2].getRight());
        
        var west_genperc = (truckvols[3].getLeft() + truckvols[3].getThrough() + truckvols[3].getRight()) / (truckvols[3].getLeft() + truckvols[3].getThrough() + truckvols[3].getRight() +
                                                                                                              carvols[3].getLeft() + carvols[3].getThrough() + carvols[3].getRight());

        return [north_genperc, east_genperc, south_genperc, west_genperc];
    }

    /**
     * Calculate and return the percentage of trucks for each movement for each direction. This will return a two dimensional array
     * where the first row is truck percentages for the movements left, through, and right (in that order) north of the intersection.
     * The second row corresponds to eastern movements, the third to southern movements, and the fourth to western movements.
     * @returns {double[][]} A two-dimensional array of decimal numbers between 0 and 1 representing percentages
     *
     */
    getSpecificTruckPercentages() {
        var carvols = this.getUnboundedCarVolumes();
        var truckvols = this.getUnboundedTruckVolumes();

        var north_specperc_left = (truckvols[0].getLeft()) / (truckvols[0].getLeft() + carvols[0].getLeft());
        var north_specperc_through = (truckvols[0].getThrough()) / (truckvols[0].getThrough() + carvols[0].getThrough());
        var north_specperc_right = (truckvols[0].getRight()) / (truckvols[0].getRight() + carvols[0].getRight());

        var east_specperc_left = (truckvols[1].getLeft()) / (truckvols[1].getLeft() + carvols[1].getLeft());
        var east_specperc_through = (truckvols[1].getThrough()) / (truckvols[1].getThrough() + carvols[1].getThrough());
        var east_specperc_right = (truckvols[1].getRight()) / (truckvols[1].getRight() + carvols[1].getRight());

        var south_specperc_left = (truckvols[2].getLeft()) / (truckvols[2].getLeft() + carvols[2].getLeft());
        var south_specperc_through = (truckvols[2].getThrough()) / (truckvols[2].getThrough() + carvols[2].getThrough());
        var south_specperc_right = (truckvols[2].getRight()) / (truckvols[2].getRight() + carvols[2].getRight());
        
        var west_specperc_left = (truckvols[3].getLeft()) / (truckvols[3].getLeft() + carvols[3].getLeft());
        var west_specperc_through = (truckvols[3].getThrough()) / (truckvols[3].getThrough() + carvols[3].getThrough());
        var west_specperc_right = (truckvols[3].getRight()) / (truckvols[3].getRight() + carvols[3].getRight());
    
        return [
            [north_specperc_left, north_specperc_through, north_specperc_right],
            [east_specperc_left, east_specperc_through, east_specperc_right],
            [south_specperc_left, south_specperc_through, south_specperc_right],
            [west_specperc_left, west_specperc_through, west_specperc_right]
        ];
    
    }
}

class VolumeTool {
    /**
     * This class is a tool for organizing data for its use in Fratar calculations of synthetic turning movement volumes.
     * @constructor
     * @param {GeneralVolume} north_genvol The GeneralVolume object for the zone north of the intersection
     * @param {GeneralVolume} east_genvol The GeneralVolume object for the zone east of the intersection
     * @param {GeneralVolume} south_genvol The GeneralVolume object for the zone south of the intersection
     * @param {GeneralVolume} west_genvol The GeneralVolume object for the zone west of the intersection
     */
    constructor(north_genvol, east_genvol, south_genvol, west_genvol) {
        this._north_genvol = north_genvol;
        this._east_genvol  = east_genvol;
        this._south_genvol = south_genvol;
        this._west_genvol  = west_genvol;

        this._car_in_array  = [this._north_genvol.getVolumeCarsIn(), this._east_genvol.getVolumeCarsIn(), this._south_genvol.getVolumeCarsIn(), this._west_genvol.getVolumeCarsIn()];
        this._car_out_array  = [this._north_genvol.getVolumeCarsOut(), this._east_genvol.getVolumeCarsOut(), this._south_genvol.getVolumeCarsOut(), this._west_genvol.getVolumeCarsOut()];

        this._truck_in_array  = [this._north_genvol.getVolumeTrucksIn(), this._east_genvol.getVolumeTrucksIn(), this._south_genvol.getVolumeTrucksIn(), this._west_genvol.getVolumeTrucksIn()];
        this._truck_out_array  = [this._north_genvol.getVolumeTrucksOut(), this._east_genvol.getVolumeTrucksOut(), this._south_genvol.getVolumeTrucksOut(), this._west_genvol.getVolumeTrucksOut()];

        this._carvol_table = [
                        [0, 1, 1, 1],
                        [1, 0, 1, 1],
                        [1, 1, 0, 1],
                        [1, 1, 1, 0]
                      ];

        this._truckvol_table = [
                        [0, 1, 1, 1],
                        [1, 0, 1, 1],
                        [1, 1, 0, 1],
                        [1, 1, 1, 0]
                      ];
    }

    /**
     * Given a table, calculate the totals of each row and report them.
     * @param {int[][]} table A table of integers
     * @returns {int[]} An array of totals for each row such that each column in the
     * array corresponds to its index-equivalent row in the table
     */
    getRowTotals(table) {
        var count = 0;
        var rowTotals = [];
        for(var rowCount = 0; rowCount < table.length; rowCount++) {
            count = 0;
            for(var i = table[rowCount].length; i--;)
                count += table[rowCount][i];
            rowTotals.push(count);
        }
        return rowTotals;
    }

    /**
     * Given a table, calculate the totals of each column and report them.
     * @param {int[][]} table A table of integers
     * @returns {int[]} An array of totals for each column such that each column in the
     * array corresponds to its index-equivalent column in the table
     */
    getColumnTotals(table) {
        var count = 0;
        var colTotals = [];
        for(var colCount = 0; colCount < table[0].length; colCount++) {
            count = 0;
            for(var i = table.length; i--;)
                count += table[i][colCount];
            colTotals.push(count);
        }
        return colTotals;
    }
   
    /**
     * Uses the inputted (assuming converged) table to create DetailedVolume objects for
     * the north, east, south, and west volume zones. Returns an array of these new
     * DetailedVolume objects.
     * @param {int[][]} table A table that has been corverged
     * @returns {int[]} An array of DetailedVolume objects such that the first element is north, the second
     * is east, the third is south, and the fourth is west
     */
    getDetailedVolumes(table) {
        var north = new DetailedVolume("north", table[0][1], table[0][2], table[0][3]);
        var east  = new DetailedVolume("east" , table[1][2], table[1][3], table[1][0]);
        var south = new DetailedVolume("south", table[2][3], table[2][0], table[2][1]);
        var west  = new DetailedVolume("west" , table[3][0], table[3][1], table[3][2]);

        return [north, east, south, west];
    }

    /**
     * This performs the actual Fratar convergence on the car and truck tables using their respective volume inputs.
     * Used by <tt>calculateSyntheticValues()</tt>
     * @see calculateSyntheticValues
     * @param {int[][]} table A square matrix filled with ones with zeros along the diagonal
     * @param {int[]} in_array An array of four input volumes such that the first element is north, second is east, third
     * is south, and fourth is west
     * @param {int[][]} out_array An array of four output volumes such that the first element is north, second is east, third
     * is south, and fourth is west
     * @returns {int[][]} A square (4x4) matrix containing the converged values, not sorted nor organized
     */
    convergeTable(table, in_array, out_array) {

        for(var i = 0; i < 1; i++) {
            var rowTotals = this.getRowTotals(table);
            var colTotals = this.getColumnTotals(table);
            var sym_row = 0;
            var sym_col = 0;


                for(var row = 0; row < table.length; row++) {
                    for(var col = 0; col < table[0].length; col++) {            
                        sym_row = in_array[row] / rowTotals[row];
                        sym_col = out_array[col] / colTotals[col];
                        table[row][col] = Math.round(table[row][col] * ((sym_row + sym_col) / 2));
                    }
                }

        }

        return table;
    }

    /**
     * Perform Fratar balancing using the car and truck volumes stored in this object and return a VolumetricIntersection object
     * containing the bounded and unbounded turn volumes for all four zones around the intersection.
     * @returns {VolumetricIntersection} A VolumetricIntersection object containing the synthetic turn volumes for cars and trucks
     * in the bounded and unbounded cases
     */
    calculateSyntheticVolumes() {
        var car_detvols   = this.getDetailedVolumes(this.convergeTable(this._carvol_table, this._car_in_array, this._car_out_array));
        var truck_detvols = this.getDetailedVolumes(this.convergeTable(this._truckvol_table, this._truck_in_array, this._truck_out_array));
        
        return (new VolumetricIntersection(car_detvols[0], car_detvols[1], car_detvols[2], car_detvols[3], truck_detvols[0], truck_detvols[1], truck_detvols[2], truck_detvols[3], false));
    }

}

// [END] ////////// [CLASSES] ////////////////////
