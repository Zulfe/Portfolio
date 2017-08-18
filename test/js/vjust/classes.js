/**
 * @fileOverview Various tools and data structures relative to the VJuST application and its functionality.
 * @author Jared H. Buchanan, P.E. of VDOT <jared.buchanan@vdot.virginia.gov>
 * @author Damon A. Shaw of VDOT <Damon.Shaw@vdot.virginia.gov || admins@vt.edu>
 * @version Alpha-0.0.1
 */

class BoundedCapacity {
    /**
	 * A class for storing calculated capacities for turning movements from a bounded (eg. southbound) point of view.
     * @constructor
	 * @param {string} bound_direction The cardinal direction of the bounded capacity
	 * @param {int} left The value of bounded capacity for left-turn movements
	 * @param {int} through The value of bounded capacity for through movements
	 * @param {int} right The value of bounded capacity for right-turn movements
	 */
    constructor(bound_direction, left, through, right) {
        this._bound_direction = bound_direction;
        this._left            = left;
        this._through         = through;
        this._right           = right;
		
		this._movement_array = [
			this._left,
			this._through,
			this._right
		];
    }
	
    /** 
     * Set the capacity of a movement based on an index to its location in the movement array
     * @param {int} index The index to the subject movement (0=left, 1=through, 2=right)
     * @param {int} new_value The new capacity value for the subject movement
     */
	setMovementByIndex(index, new_value) {
		this._movement_array[index] = new_value;
		this.sync();
	}
	
    /**
     * Replaces all three values in the movement array simultaneously
     * @param {int[]} new_array An array of integers representing the capacity for each turning movement
     */
	setMovementArray(new_array) {
		this._movement_array = new_array;
		this.sync();
	}

    /**
     * If the movement array has changed, run this function to implement the changes in the individual class variables.
     * By default this function runs automatically when an movement capacity or the entire movement array has been changed using
     * <tt>setMovementByIndex(index, new_value)</tt> or <tt>setMovementArray(new_array)</tt>.
     */ 
	sync() {
		this._left    = this._movement_array[0];
		this._through = this._movement_array[1];
		this._right   = this._movement_array[2];
	}
    
	/**
     * Sets the capacity of movement in the left lane.
     * @param {int} left lane capacity
     */
    setLeft(capacity) {
        this._left = capacity;
    }

    /**
     * Sets the capacity of movement in the through lane.
     * @param {int} through lane capacity
     */
    setThrough(capacity) {
        this._through = capacity;
    }

    /**
     * Sets the capacity of movement in the right lane.
     * @param {int} right lane capacity
     */
    setRight(capacity) {
        this._right = capacity;
    }
    
	/**
	 * Gets each movement capacity by index (0 for Left, 1 for Through, 2 for Right)
	 * @param {int} capacity index
	 */
	getMovementByIndex(index) {
		return this._movement_array[index];	
	}
	
    /**
     * Returns the capacity of movement in the left lane.
     * @returns {int} left lane capacity
     */
    getLeft() {
        return this._left;
    }

    /**
     * Returns the capacity of movement in the through lane.
     * @returns {int} through lane capacity
     */
    getThrough() {
        return this._through;
    }

    /**
     * Returns the capacity of movement in the right lane.
     * @returns {int} right lane capacity
     */
    getRight() {
        return this._right;
    }
}

class PCETable {
    /**
	 * A class for storing calculated passenger-car equivalents for turning movements from a bounded (eg. southbound) point of view.
     * @constructor
	 * @param {object} southbound_PCEs A PCE-enabled BoundedDetailedVolume object containing southbound PCEs
	 * @param {object} westbound_PCEs A PCE-enabled BoundedDetailedVolume object containing westbound PCEs
	 * @param {object} northbound_PCEs A PCE-enabled BoundedDetailedVolume object containing northbound PCEs
	 * @param {object} eastbound_PCEs A PCE-enabled BoundedDetailedVolume object containing eastbound PCEs
	 */
	constructor (southbound_PCEs, westbound_PCEs, northbound_PCEs, eastbound_PCEs) {
		this._southbound_PCEs = southbound_PCEs;
		this._westbound_PCEs = westbound_PCEs;
		this._northbound_PCEs = northbound_PCEs;
		this._eastbound_PCEs = eastbound_PCEs;
		
		this._southbound_PCEs.setPCEState(true);
		this._westbound_PCEs.setPCEState(true);
		this._northbound_PCEs.setPCEState(true);
		this._eastbound_PCEs.setPCEState(true);
		
		this._PCE_array = [
			this._southbound_PCEs,
			this._westbound_PCEs, 
			this._northbound_PCEs,
			this._eastbound_PCEs 
		];
	}
	
    /**
     * Retrieve the array of all four directional PCE-enabled BoundedDetailedVolume objects
     * @return {object[]} An array of four PCE-enabled BoundedDetailedVolume objects
     */
    getPCEArray() {
        return this._PCE_array;
    }
    
    /**
     * Retreive one PCE-enabled BoundedDetailedVolume object by its index in the PCE array of PCE-enabled BoundedDetailedVolume objects
     * @param {int} index The location of the subject direction in the PCE array
     * @return {object} A PCE-enabled BoundedDetailedVolume object
     */
	getDirectionByIndex(index) {
		return this._PCE_array[index];
	}
	
    /**
     * Replace one PCE-enabled BoundedDetailedVolume object by its index in the PCE array of PCE-enabled BoundedDetailedVolume objects
     * @param {int} index The location of the subject direction in the PCE array
     * @param {object} A PCE-enabled BoundedDetailedVolume object
     */
	setDirectionByIndex(index, detvolume) {
		this._PCE_array[index] = detvolume;
		this.sync;
	}
	
    /**
     * If the PCE array has changed, run this function to implement the changes in the individual class variables.
     * By default this function runs automatically when an approach PCE has been changed using
     * <tt>setDirectionByIndex(index, detvolume)</tt>.
     */ 
	sync() {
		this._southbound_PCEs = this._PCE_array[0];
		this._westbound_PCEs  = this._PCE_array[1]; 
		this._northbound_PCEs = this._PCE_array[2];
		this._eastbound_PCEs  = this._PCE_array[3];
	}
	
    /**
     * If one or more PCE variables has changed, run this function to implement the changes in the class PCE array.
     * By default this function runs automatically when the individual class variables have been updated using
     * <tt>updatePCETable(southbound_detvol, westbound_detvol, northbound_detvol, eastbound_detvol)</tt>.
     */ 
	syncArray() {
		this._PCE_array[0] = this._southbound_PCEs;
		this._PCE_array[1] = this._westbound_PCEs; 
		this._PCE_array[2] = this._northbound_PCEs;
		this._PCE_array[3] = this._eastbound_PCEs;
	}

    /**
     * Update the class PCE objects and PCE object array using four PCE-enabled BoundedDetailedVolume objects
     * @param {object} southbound_detvol A PCE-enabled BoundedDetailedVolume representing the southbound approach
     * @param {object} westbound_detvol A PCE-enabled BoundedDetailedVolume representing the westbound approach
     * @param {object} northbound_detvol A PCE-enabled BoundedDetailedVolume representing the northbound approach
     * @param {object} eastbound_detvol A PCE-enabled BoundedDetailedVolume representing the eastbound approach
     */
	updatePCETable(southbound_detvol, westbound_detvol, northbound_detvol, eastbound_detvol) {
		this._southbound_PCEs = southbound_detvol;
		this._westbound_PCEs = westbound_detvol;
		this._northbound_PCEs = northbound_detvol;
		this._eastbound_PCEs = eastbound_detvol;
		
		this.syncArray();
	}
}

class UserVolumeDefinitions {
    /**
     * A class to store and organize the user-defined data pulled from the initial volume table. Supports the storage of Fratar data alongside
     * user data.
     * @param {BoundedDetailedVolume} southbound_detvol A BoundedDetailedVolumeDetailedVolume object containing volumes for movements southbound of the intersection
     * @param {BoundedDetailedVolume} westbound_detvol A BoundedDetailedVolume object containing volumes for movements westbound of the intersection
     * @param {BoundedDetailedVolume} northbound_detvol A BoundedDetailedVolume object containing volumes for movements northbound of the intersection
     * @param {BoundedDetailedVolume} eastbound_detvol A BoundedDetailedVolume object containing volumes for movements eastbound of the intersection.
     * @param {DetailedTruckPercent} southbound_truckperc A DetailedTruckPercent representing the percentage of trucks for all movements southbound of the intersection
     * @param {DetailedTruckPercent} westbound_truckperc A DetailedTruckPercent representing the percentage of trucks for all movements westbound of the intersection
     * @param {DetailedTruckPercent} northbound_truckperc A DetailedTruckPercent representing the percentage of trucks for all omvements northbound of the intersection
     * @param {DetailedTruckPercent} eastbound_truckperc A DetailedTruckPercent representing the percentage of trucks for all movements eastbound of the intersection
     */
    constructor(southbound_detvol, westbound_detvol, northbound_detvol, eastbound_detvol, southbound_truckperc, westbound_truckperc, northbound_truckperc, eastbound_truckperc, using_fratar) {
        this._user_defined_southbound_volumes = southbound_detvol;
        this._user_defined_westbound_volumes  = westbound_detvol;
        this._user_defined_northbound_volumes = northbound_detvol;
        this._user_defined_eastbound_volumes  = eastbound_detvol;

        this._user_defined_southbound_truck_perc = southbound_truckperc;
        this._user_defined_westbound_truck_perc  = westbound_truckperc;
        this._user_defined_northbound_truck_perc = northbound_truckperc;
        this._user_defined_eastbound_truck_perc  = eastbound_truckperc;

        // A flag that, when true, signifies that Fratar volumes should be provided when getting object data. This is set to true whenever
        // Fratar volumes are defined.
        this._using_fratar = using_fratar;
		if (this._using_fratar) {
			this.defineFratarSpecificTruckPercentages();
			this.setFratarParameters();
		}
		
		this._direction_array = [
			this._user_defined_southbound_volumes,
			this._user_defined_westbound_volumes,
			this._user_defined_northbound_volumes,
			this._user_defined_eastbound_volumes
		];
        
        this._percent_array = [
            this._user_defined_southbound_truck_perc,
            this._user_defined_westbound_truck_perc,
            this._user_defined_northbound_truck_perc,
            this._user_defined_eastbound_truck_perc
        ];
	}
	
	setDirectionArray(new_array) {
		this._direction_array = new_array;
		this.sync();
	}

    /**
     * If the volume array has changed, run this function to implement the changes in the individual class variables.
     * By default this function runs automatically when the entire direction array has been changed using
     * <tt>setDirectionArray(new_array)</tt>.
     */ 
	sync() {
		this._user_defined_southbound_volumes = this._direction_array[0];
		this._user_defined_westbound_volumes  = this._direction_array[1];
		this._user_defined_northbound_volumes = this._direction_array[2];
		this._user_defined_eastbound_volumes  = this._direction_array[3];
	}
	
    /**
     * If the volume has changed in one or more class volume variables, run this function to implement the changes in the individual class variables.
     * By default this function runs automatically when the entire direction array has been changed using
     * <tt>setDirectionArray(new_array)</tt>.
     */
	syncArray() {
		this._direction_array[0] = this._user_defined_southbound_volumes;
		this._direction_array[1] = this._user_defined_westbound_volumes;
		this._direction_array[2] = this._user_defined_northbound_volumes;
		this._direction_array[3] = this._user_defined_eastbound_volumes;
	}
	
    /**
     * Add to this object variables storing user-defined per-lane truck percentages. This will also enable the flag for specific percentages.
     * @param {DetailedPercentage} southbound_detperc The DetailedPercentage object containing percentages for movements southbound of the intersection
     * @param {DetailedPercentage} westbound_detperc The DetailedPercentage object containing percentages for movements westbound of the intersection
     * @param {DetailedPercentage} northbound_detperc The DetailedPercentage object containing percentages for movements northbound of the intersection
     * @param {DetailedPercetnage} eastbound_detperc The DetailedPercentage object containing percentages for movements eastbound of the intersection 
	 * @deprecated object now requires detailed percentages
     */
    defineUserSpecificTruckPercentages(southbound_detperc, westbound_detperc, northbound_detperc, eastbound_detperc) {
        this._user_defined_southbound_truck_perc = southbound_detperc;
        this._user_defined_westbound_truck_perc  = westbound_detperc;
        this._user_defined_northbound_truck_perc = northbound_detperc;
        this._user_defined_eastbound_truck_perc  = eastbound_detperc;
    }

    /**
     * Add to this object variables storing Fratar-defined per-lane truck percentages. This will also enable the flag for specific percentages.
     * @param {DetailedPercentage} southbound_detperc The DetailedPercentage object containing percentages for movements southbound of the intersection
     * @param {DetailedPercentage} westbound_detperc The DetailedPercentage object containing percentages for movements westbound of the intersection
     * @param {DetailedPercentage} northbound_detperc The DetailedPercentage object containing percentages for movements northbound of the intersection
     * @param {DetailedPercetnage} eastbound_detperc The DetailedPercentage object containing percentages for movements eastbound of the intersection
     */
    defineFratarSpecificTruckPercentages(southbound_detperc, westbound_detperc, northbound_detperc, eastbound_detperc) {
        this._fratar_defined_southbound_truck_perc = southbound_detperc;
        this._fratar_defined_westbound_truck_perc  = westbound_detperc;
        this._fratar_defined_northbound_truck_perc = northbound_detperc;
        this._fratar_defined_eastbound_truck_perc  = eastbound_detperc;
    }

    /**
     * Return the percentage of trucks to this object's most specific knowledge. If specific values have been defined, those will
     * be returned. If not, the general percentages will
     *
     */
    getTruckPercentages() {
        if(this.isUsingFratar()) {
			// return fratar-defined specific truck percentages
			return [this._fratar_defined_southbound_truck_perc,
					this._fratar_defined_westbound_truck_perc,
					this._fratar_defined_northbound_truck_perc,
					this._fratar_defined_eastbound_truck_perc
			];
        }
        else {
			// return user-defined specific truck percentages
			return [this._user_defined_southbound_truck_perc,
					this._user_defined_westbound_truck_perc,
					this._user_defined_northbound_truck_perc,
					this._user_defined_eastbound_truck_perc
			];
		}
    }

	/**
	 *
	 */
	getDetailedVolumeByBoundedDirection(direction) {
		switch (direction) {
			case "southbound":
				return this._user_defined_southbound_volumes;
				break;
			case "westbound":
				return this._user_defined_westbound_volumes;
				break;
			case "northbound":
				return this._user_defined_northbound_volumes;
				break;
			case "eastbound":
				return this._user_defined_eastbound_volumes;
				break;
		}
	}
	
    /**
     * Enable or disable the use of Fratar volumes.
     * @param {boolean} state <tt>true</tt> for using Fratar volumes; <tt>false</tt> for using user-defined volumes
     * Note: This function currently does not have any support for undefined variable error control. If no Fratar volumes have been defined
     * and this is set to true, this object will attempt to return an undefined variable. Error control needs to be added!
     */
    setUsingFratarVolumes(state) {
        this._using_fratar = state;
    }

    /**
     *
     *
     */
    setFratarParameters(southbound_detvol, westbound_detvol, northbound_detvol, eastbound_detvol, southbound_truckperc, westbound_truckperc, northbound_truckperc, eastbound_truckperc) {
        this._fratar_defined_southbound_volumes = southbound_detvol;
        this._fratar_defined_westbound_volumes  = westbound_detvol;
        this._fratar_defined_northbound_volumes = northbound_detvol;
        this._fratar_defined_eastbound_volumes  = eastbound_detvol;

        this._fratar_defined_southbound_truck_perc = southbound_truckperc;
        this._fratar_defined_westbound_truck_perc  = westbound_truckperc;
        this._fratar_defined_northbound_truck_perc = northbound_truckperc;
        this._fratar_defined_eastbound_truck_perc  = eastbound_truckperc;
    }

    /**
     * Return a state value stating if Fratar values are the current focus of the 
     *
     */
    isUsingFratar() {
        return this._using_fratar;
    }
	
	getDirectionByIndex(index) {
		return this._direction_array[index];	
	}
	
	getVolumeByAddress(direction, movement) {
		return (this.getDirectionByIndex(direction).getMovementByIndex(movement));
	}
	
	updateUserVolumeDefinitions (southbound_detvol, westbound_detvol, northbound_detvol, eastbound_detvol, southbound_truckperc, westbound_truckperc, northbound_truckperc, eastbound_truckperc, update_using_fratar) {
        /** Replaces the values in this._user_volume_definitions, a UserVolumeDefinitions object, and updates this._master_PCE_table, a PCETable object
         * @param {object} southbound_detvol A BoundedDetailedVolume representing the total entering volume (cars + trucks) at the southbound approach
         * @param {object} westbound_detvol A BoundedDetailedVolume representing the total entering volume (cars + trucks) at the westbound approach
         * @param {object} northbound_detvol A BoundedDetailedVolume representing the total entering volume (cars + trucks) at the northbound approach
         * @param {object} eastbound_ A BoundedDetailedVolume representing the total entering volume (cars + trucks) at the eastbound approach
         * @param {object} southbound_truckperc A DetailedPercentage representing the truck percentage of the southbound approach
         * @param {object} westbound_truckperc A DetailedPercentage representing the truck percentage of the westbound approach
         * @param {object} northbound_truckperc A DetailedPercentage representing the truck percentage of the northbound approach
         * @param {object} eastbound_truckperc A DetailedPercentage representing the truck percentage of the eastbound approach
         * @param {bool} update_using_fratar A boolean value indicating whether the turning movements were generated by the Fratar method or not
         */
		if (update_using_fratar) {
			this._fratar_defined_southbound_volumes = southbound_detvol;
			this._fratar_defined_westbound_volumes  = westbound_detvol;
			this._fratar_defined_northbound_volumes = northbound_detvol;
			this._fratar_defined_eastbound_volumes  = eastbound_detvol;

			this._fratar_defined_southbound_truck_perc = southbound_truckperc;
			this._fratar_defined_westbound_truck_perc  = westbound_truckperc;
			this._fratar_defined_northbound_truck_perc = northbound_truckperc;
			this._fratar_defined_eastbound_truck_perc  = eastbound_truckperc;
            
            this._using_fratar = true;
		} else {
            this._using_fratar = false;
        }
		this._user_defined_southbound_volumes = southbound_detvol;
		this._user_defined_westbound_volumes  = westbound_detvol;
		this._user_defined_northbound_volumes = northbound_detvol;
		this._user_defined_eastbound_volumes  = eastbound_detvol;

		this._user_defined_southbound_truck_perc = southbound_truckperc;
		this._user_defined_westbound_truck_perc  = westbound_truckperc;
		this._user_defined_northbound_truck_perc = northbound_truckperc;
		this._user_defined_eastbound_truck_perc  = eastbound_truckperc;
		
		this.syncArray();
	}
    
    setComponentVolumeValue(direction, movement, volume) {
        var dir_int = typeof direction == "number" ? direction : parseInt(objectKeyByValue(DirectionEnum, direction));
        console.log("Input volume: " + volume);
        if (typeof movement == "number") {
            this._direction_array[dir_int].setMovementByIndex(movement, volume);
        } else {
            switch(movement) {
                case "left":
                    this._direction_array[dir_int].setMovementByIndex(0, volume);
                    break;
                case "through":
                    this._direction_array[dir_int].setMovementByIndex(1, volume);
                    break;
                case "right":
                    this._direction_array[dir_int].setMovementByIndex(2, volume);
                    break;
            }
        }
        this._using_fratar = false;
    }

    setComponentPercentageValue(direction, movement, percent) {
        var dir_int = typeof direction == "number" ? direction : parseInt(objectKeyByValue(DirectionEnum,direction));
        
        if (typeof movement == "number") {
            this._direction_array[dir_int].setMovementByIndex(movement, volume);
        } else {
            switch(movement) {
                case "left":
                    this._percent_array[dir_int].setMovementByIndex(0, volume);
                    break;
                case "through":
                    this._percent_array[dir_int].setMovementByIndex(1, volume);
                    break;
                case "right":
                    this._percent_array[dir_int].setMovementByIndex(2, volume);
                    break;
            }
        }
        this._using_fratar = false;
    }

}

class VolumetricIntersection {
    /**
     * This is a class to organize and contain VolumeTool output data. It accepts BoundedDetailedVolume objects
     * @param {BoundedDetailedVolume} southbound_carvol A BoundedDetailedVolume for car volumes southbound or north of the intersection
     * @param {BoundedDetailedVolume} westbound_carvol A BoundedDetailedVolume for car volumes westbound or east of the intersection
     * @param {BoundedDetailedVolume} northbound_carvol A BoundedDetailedVolume for car volumes northbound or south of the intersection
     * @param {BoundedDetailedVolume} eastbound_carvol A BoundedDetailedVolume for car volumes eastbound or west of the intersection
     * @param {BoundedDetailedVolume} southbound_truckvol A BoundedDetailedVolume for truck volumes southbound or south of the intersection
     * @param {BoundedDetailedVolume} westbound_truckvol A BoundedDetailedVolume for truck volumes westbound or east of the intersection
     * @param {BoundedDetailedVolume} northbound_truckvol A BoundedDetailedVolume for truck volumes northbound or south of the intersection
     * @param {BoundedDetailedVolume} eastbound_truckvol A BoundedDetailedVolume for truck volumes eastbound or west of the intersection
     * @param {boolean} override_user_volumes A flag indicating whether the volumes in this object should be used to overwrite the values in PROJECT.getUserVolumeDefinitions()
     * @constructor
     */
    constructor(southbound_carvol, westbound_carvol, northbound_carvol, eastbound_carvol, southbound_truckvol, westbound_truckvol, northbound_truckvol, eastbound_truckvol, override_user_volumes) {

		this._southbound_carvol_bounded   = southbound_carvol;
		this._westbound_carvol_bounded    = westbound_carvol;
		this._northbound_carvol_bounded   = northbound_carvol;
		this._eastbound_carvol_bounded    = eastbound_carvol;
		this._southbound_truckvol_bounded = southbound_truckvol;
		this._westbound_truckvol_bounded  = westbound_truckvol;
		this._northbound_truckvol_bounded = northbound_truckvol;
		this._eastbound_truckvol_bounded  = eastbound_truckvol;
		this._override_user_volumes 	  = override_user_volumes;
		
		this._southbound_totvol_bounded = this.sumVolumes("southbound", this._southbound_carvol_bounded, this._southbound_truckvol_bounded);		
		this._westbound_totvol_bounded  = this.sumVolumes("westbound", this._westbound_carvol_bounded, this._westbound_truckvol_bounded);
		this._northbound_totvol_bounded = this.sumVolumes("northbound", this._northbound_carvol_bounded, this._northbound_truckvol_bounded);
		this._eastbound_totvol_bounded  = this.sumVolumes("eastbound", this._eastbound_carvol_bounded, this._eastbound_truckvol_bounded);
		
		this._southbound_truckperc = this.calculateDetailedTruckPercent("southbound", this._southbound_carvol_bounded,this._southbound_truckvol_bounded);
		this._westbound_truckperc  = this.calculateDetailedTruckPercent("westbound", this._westbound_carvol_bounded, this._westbound_truckvol_bounded);
		this._northbound_truckperc = this.calculateDetailedTruckPercent("northbound", this._northbound_carvol_bounded, this._northbound_truckvol_bounded);
		this._eastbound_truckperc  = this.calculateDetailedTruckPercent("eastbound", this._eastbound_carvol_bounded, this._eastbound_truckvol_bounded);
	}
		
    /**
     *
     */
    sumVolumes(direction, carvols, truckvols) {
        return (new BoundedDetailedVolume(direction, carvols.getLeft() + truckvols.getLeft(), carvols.getThrough() + truckvols.getThrough(), carvols.getRight() + truckvols.getRight()));
    }

	/**
	 * Create a DetailedPercentage object from passenger car volumes and truck volumes
	 * @param {string} Bounded direction of subject approach
	 * @param {BoundedDetailedVolume} A BoundedDetailedVolume object containing passenger car turning movement volumes for the subject approach
	 * @param {BoundedDetailedVolume} A BoundedDetailedVolume object containing truck turning movement volumes for the subject approach
	 * @returns {DetailedPercentage} A DetailedPercentage object for a single bound direction (eg. "southbound")
	 */
	calculateDetailedTruckPercent(bound_direction, boundedCarsVolume, boundedTrucksVolume) {
		
		var left_truck_per    = boundedTrucksVolume.getLeft() / (boundedCarsVolume.getLeft() + boundedTrucksVolume.getLeft());
		var through_truck_per = boundedTrucksVolume.getThrough() / (boundedCarsVolume.getThrough() + boundedTrucksVolume.getThrough());
		var right_truck_per   = boundedTrucksVolume.getRight() / (boundedCarsVolume.getRight() + boundedTrucksVolume.getRight());
		
		return (new DetailedPercentage(bound_direction, left_truck_per, through_truck_per, right_truck_per));
	}

    /**
     * Return bounded detailed volumes (volume objects including information about movement volumes) about car volumes for each branch of the intersection by their
     * bounded movement (e.g. "southbound").
     * @returns {BoundedDetailedVolume[]} An array of car BoundedDetailedVolume objects in the order southbound, westbound, northbound, eastbound
     */
    getBoundedCarVolumes() {
        return [this._southbound_carvol_bounded, this._westbound_carvol_bounded, this._northbound_carvol_bounded, this._eastbound_carvol_bounded];
    }

    /**
     * Return bounded detailed volumes (volume objects including information about movement volumes) about truck volumes for each branch of the intersection by their
     * bounded movement (e.g. "southbound").
     * @returns {BoundedDetailedVolume[]} An array of truck BoundedDetailedVolume objects in the order southbound, westbound, northbound, eastbound
     */
    getBoundedTruckVolumes() {
        return [this._southbound_truckvol_bounded, this._westbound_truckvol_bounded, this._northbound_truckvol_bounded, this._eastbound_truckvol_bounded];
    }
    
    /**
     * Calculate and return the percentage of trucks for each movement for each direction. This will return a two dimensional array
     * where the first row is truck percentages for the movements left, through, and right (in that order) southbound of the intersection.
     * The second row corresponds to westboundern movements, the third to northboundern movements, and the fourth to eastboundern movements.
     * @returns {double[][]} A two-dimensional array of decimal numbers between 0 and 1 representing percentages
     *
     */
    getSpecificTruckPercentages() {
        var carvols = this.getBoundedCarVolumes();
        var truckvols = this.getBoundedTruckVolumes();

        var southbound_specperc_left = (truckvols[0].getLeft()) / (truckvols[0].getLeft() + carvols[0].getLeft());
        var southbound_specperc_through = (truckvols[0].getThrough()) / (truckvols[0].getThrough() + carvols[0].getThrough());
        var southbound_specperc_right = (truckvols[0].getRight()) / (truckvols[0].getRight() + carvols[0].getRight());
		var southboundDetailedTruckPercent = new DetailedPercentage("southbound", southbound_specperc_left, southbound_specperc_through, southbound_specperc_right);
		
        var westbound_specperc_left = (truckvols[1].getLeft()) / (truckvols[1].getLeft() + carvols[1].getLeft());
        var westbound_specperc_through = (truckvols[1].getThrough()) / (truckvols[1].getThrough() + carvols[1].getThrough());
        var westbound_specperc_right = (truckvols[1].getRight()) / (truckvols[1].getRight() + carvols[1].getRight());
		var westboundDetailedTruckPercent = new DetailedPercentage("westbound", westbound_specperc_left, westbound_specperc_through, westbound_specperc_right);

        var northbound_specperc_left = (truckvols[2].getLeft()) / (truckvols[2].getLeft() + carvols[2].getLeft());
        var northbound_specperc_through = (truckvols[2].getThrough()) / (truckvols[2].getThrough() + carvols[2].getThrough());
        var northbound_specperc_right = (truckvols[2].getRight()) / (truckvols[2].getRight() + carvols[2].getRight());
		var northboundDetailedTruckPercent = new DetailedPercentage("northbound", northbound_specperc_left, northbound_specperc_through, northbound_specperc_right);
        
        var eastbound_specperc_left = (truckvols[3].getLeft()) / (truckvols[3].getLeft() + carvols[3].getLeft());
        var eastbound_specperc_through = (truckvols[3].getThrough()) / (truckvols[3].getThrough() + carvols[3].getThrough());
        var eastbound_specperc_right = (truckvols[3].getRight()) / (truckvols[3].getRight() + carvols[3].getRight());
		var eastboundDetailedTruckPercent = new DetailedPercentage("eastbound", eastbound_specperc_left, eastbound_specperc_through, eastbound_specperc_right);
    
        return [
            southboundDetailedTruckPercent,
			westboundDetailedTruckPercent,
			northboundDetailedTruckPercent,
			eastboundDetailedTruckPercent
        ];
    }
	
    getUserVolumeDefinitionsInputs() {
        var values = [this._southbound_totvol_bounded, this._westbound_totvol_bounded, this._northbound_totvol_bounded, this._eastbound_totvol_bounded];
        this.getSpecificTruckPercentages().forEach(
            function(object, index) {
                values.push(object);
            }
        );
        values.push(true);
        return values;
    }
    
	/**
	 *@deprecated
	 */
	getPassengerCarEquivalent() {
		var southboundPCEs = this._user_defined_southbound_volumes.getPassengerCarEquivalent(this._user_defined_southbound_truck_perc);
		var westboundPCEs = this._user_defined_westbound_volumes.getPassengerCarEquivalent(this._user_defined_westbound_truck_perc);
		var northboundPCEs = this._user_defined_northbound_volumes.getPassengerCarEquivalent(this._user_defined_northbound_truck_perc);
		var eastboundPCEs = this._user_defined_eastbound_volumes.getPassengerCarEquivalent(this._user_defined_eastbound_truck_perc);
		
		return [
                southboundPCEs,
		        westboundPCEs, 
	            northboundPCEs,
                eastboundPCEs
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
    constructor(north_genvol, east_genvol, south_genvol, west_genvol, override_user_volumes) {
        this._north_genvol 			= north_genvol;
        this._east_genvol  			= east_genvol;
        this._south_genvol  		= south_genvol;
        this._west_genvol 	        = west_genvol;
		this._override_user_volumes = override_user_volumes;

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
	 * @deprecated
	 */
	 updateGeneralVolumes(north_genvol, east_genvol, south_genvol, west_genvol, override_user_volumes) {
		this._north_genvol 			= north_genvol;
        this._east_genvol  			= east_genvol;
        this._south_genvol  		= south_genvol;
        this._west_genvol 	        = west_genvol;
		this._override_user_volumes = override_user_volumes;

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
     * Uses the inputted (assuming converged) table to create BoundedDetailedVolume objects for
     * the southbound, westbound, northbound, and eastbound volume zones. Returns an array of these new
     * BoundedDetailedVolume objects.
     * @param {int[][]} table A table that has been corverged
     * @returns {int[]} An array of BoundedDetailedVolume objects such that the first element is southbound, the second
     * is westbound, the third is northbound, and the fourth is eastbound
     */
    getBoundedDetailedVolumes(table) {
        var southbound = new BoundedDetailedVolume("southbound", table[0][1], table[0][2], table[0][3]);
        var westbound  = new BoundedDetailedVolume("westbound" , table[1][2], table[1][3], table[1][0]);
        var northbound = new BoundedDetailedVolume("northbound", table[2][3], table[2][0], table[2][1]);
        var eastbound  = new BoundedDetailedVolume("eastbound" , table[3][0], table[3][1], table[3][2]);

        return [southbound, westbound, northbound, eastbound];
    }

    /**
     * This performs the actual Fratar convergence on the car and truck tables using their respective volume inputs.
     * Used by <tt>calculateSyntheticValues()</tt>
     * @see calculateSyntheticValues
     * @param {int[][]} table A square matrix filled with ones with zeros along the diagonal
     * @param {int[]} in_array An array of four input volumes such that the first element is southbound, second is westbound, third
     * is northbound, and fourth is eastbound
     * @param {int[][]} out_array An array of four output volumes such that the first element is southbound, second is westbound, third
     * is northbound, and fourth is eastbound
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
     * containing the bounded turn volumes for all four zones around the intersection.
     * @returns {VolumetricIntersection} A VolumetricIntersection object containing the synthetic turn volumes for cars and trucks
     * in the bounded and unbounded cases
     */
    calculateSyntheticVolumes() {
        var car_detvols   = this.getBoundedDetailedVolumes(this.convergeTable(this._carvol_table, this._car_in_array, this._car_out_array));
        var truck_detvols = this.getBoundedDetailedVolumes(this.convergeTable(this._truckvol_table, this._truck_in_array, this._truck_out_array));
        
        return (new VolumetricIntersection(car_detvols[0], car_detvols[1], car_detvols[2], car_detvols[3], truck_detvols[0], truck_detvols[1], truck_detvols[2], truck_detvols[3], this._override_user_volumes));
    }

}

class BoundedDetailedVolume {
/**
 * A class for storing and organizing volumes for turning movements from a bounded (southbound) point of view.
 * @param {string} bound_direction The cardinal direction of the bounded movement
 * @param {int} left The value of bounded movement in the left lane
 * @param {int} through The value of bounded movement in the through lane
 * @param {int} right The value of the bounded movement in the right lane
 * @constructor
 */
    constructor(bound_direction, left, through, right) {
        this._bound_direction = bound_direction;
        this._left            = left;
        this._through         = through;
        this._right           = right;
        this._pce_enabled     = false;
		
		this._movement_array = [
			this._left,
			this._through,
			this._right
		];
    }
	
	setMovementByIndex(index, new_value) {
		this._movement_array[index] = new_value;
		this.sync();
	}
	
	setMovementArray(new_array) {
		this._movement_array = new_array;
		this.sync();
	}

	sync() {
		this._left    = this._movement_array[0];
		this._through = this._movement_array[1];
		this._right   = this._movement_array[2];
	}
	/**
     * Sets the volume of movement in the left lane.
     * @param {int} left lane volume
     */
    setLeft(volume) {
        this._left = volume;
    }

    /**
     * Sets the volume of movement in the through lane.
     * @param {int} through lane volume
     */
    setThrough(volume) {
        this._through = volume;
    }

    /**
     * Sets the volume of movement in the right lane.
     * @param {int} right lane volume
     */
    setRight(volume) {
        this._right = volume;
    }
	/**
	 * Gets each movement volume by index (0 for Left, 1 for Through, 2 for Right)
	 * @param {int} volume index
	 */
	getMovementByIndex(index) {
		return this._movement_array[index];	
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
     * myBoundedDetailedVolume.getLeft() // â†’ 500
     * myBoundedDetailedVolume = myBoundedDetailedVolume.getPassengerCarEquivalent(0.05, 0.10, 0.15);
     * myBoundedDetailedVolume.getLeft() // â†’ 525
     */
    getPassengerCarEquivalent(left_truck_per, through_truck_per, right_truck_per) {
        var new_bdetvol = new BoundedDetailedVolume(this._direction, (this._left + (this._left * left_truck_per)), (this._through + (this._through * through_truck_per)), (this._right + (this._right * right_truck_per)));
        new_bdetvol.enablePCE();
        return new_bdetvol;
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
     * myBoundedDetailedVolume.getLeft() // â†’ 500
     * myBoundedDetailedVolume = myBoundedDetailedVolume.getPassengerCarEquivalent(0.05, 0.10, 0.15);
     * myBoundedDetailedVolume.getLeft() // â†’ 525
     */
    getPassengerCarEquivalentWithDetailedPercentObject(direction, detailedPercentObject) {
        var new_bdetvol = new BoundedDetailedVolume(direction, (this._left + (this._left * detailedPercentObject.getLeft())), (this._through + (this._through * detailedPercentObject.getThrough())), (this._right + (this._right * detailedPercentObject.getRight())));
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
        
        this._movement_array = [
            this._left_perc,
            this._through_perc,
            this._right_perc,
        ];
    }

	setMovementByIndex(index, new_value) {
		this._movement_array[index] = new_value;
		this.sync();
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

class GeneralVolume {
    /**
     * A class to contain and organize data pertaining to general volumes used in the Fratar balancing
     * method. General volumes are those that describe only the number of vehicles that enter and leave
     * each leg of the intersection. They do not detail the volume per movement (left, through, right).
     * @param {string} direction The cardinal direction of the intersection branch relative to the intersection
     * itself. A general volume describing vehicles moving southbound to enter the intersection and northbound
     * to exit the intersection are in the south cardinal zone.
     * @param {int} general_volume The number of vehicles traveling in and out of this branch of the intersection.
     * @param {float} d_factor A percentage value describing the ratio between westbound and eastbound vehicles, and
     * southbound and northbound vehicles. Being that each GeneralVolume object describes only a single branch, this value
     * dictates the number of vehicles entering and leaving said branch. In the case of westbound and eastbound vehicles,
     * a D factor greater than 0.50 expresses that more vehicles are moving eastbound than westbound. In the case of
     * southbound and northbound vehicles, a D factor greater than 0.50 expresses that more vehicles are moving northbound
     * than southbound.
     * @param {float} k_factor A percentage of the entered volume occurring in the peak hour (1.0 if entering a peak-hour count, default value = 0.10)
     * @param {float} truck_per A percentage value describing the volume of trucks relative to the general volume. If 10 of 100
     * vehicles in the measured general volume are trucks, there is a 10% truck percentage, represented here by 0.1.
     * @constructor
     */
    constructor(direction, general_volume, d_factor, k_factor, truck_per) {
        this._direction      = direction;
        this._general_volume = general_volume;
        this._d_factor       = d_factor;
        this._k_factor       = k_factor;
        this._truck_per      = truck_per;

        this.calculateGeneralVolumes();        
    }
    
    calculateGeneralVolumes() {
        if(this._direction === "north") {
            this._volume_in  = Math.round(this._general_volume * (1 - this._d_factor));
            this._volume_out = Math.round(this._general_volume * this._d_factor);
        }
        if(this._direction === "east") {
            this._volume_in  = Math.round(this._general_volume * (1 - this._d_factor));
            this._volume_out = Math.round(this._general_volume * this._d_factor);
        }
        if(this._direction === "south") {
            this._volume_in  = Math.round(this._general_volume * this._d_factor);
            this._volume_out = Math.round(this._general_volume * (1 - this._d_factor));
        }
        if(this._direction === "west") {
            this._volume_in  = Math.round(this._general_volume * this._d_factor);
            this._volume_out = Math.round(this._general_volume * (1 - this._d_factor));
        }

        this._volume_cars_in  = Math.round(this._volume_in * (1 - this._truck_per) * this._k_factor);
        this._volume_cars_out = Math.round(this._volume_out * (1 - this._truck_per) * this._k_factor);

        this._volume_trucks_in  = Math.round(this._volume_in * this._truck_per * this._k_factor);
        this._volume_trucks_out = Math.round(this._volume_out * this._truck_per * this._k_factor);
    }

    getAttributeBySelector(selector) {
        if (selector == "array" || selector === undefined)
            return [this._direction, this._general_volume, this._d_factor, this._k_factor, this._truck_per];
        else if (selector == "direction")
            return this._direction;
        else if (selector == "volume")
            return this._general_volume;
        else if (selector == "d-factor")
            return this._d_factor;
        else if (selector == "k-factor")
            return this._k_factor;
        else if (selector == "truck percent")
            return this._truck_per;
    }
    
    /**
     * Returns the stored value for the general volume.
     * @returns {int} The volume of vehicles
     */
    getGeneralVolume() {
        return this._general_volume;
    }
    
    getDFactor() {
        return this._d_factor;
    }
    
    getKFactor() {
        return this._k_factor;
    }
    
    getTruckPercent() {
        return this._truck_per;
    }
    
    setGeneralVolumeArray(volume_array) {
        this._general_volume = volume_array[0];
        this._d_factor = volume_array[1];
        this._k_factor = volume_array[2];
        this._truck_per = volume_array[3];
        this.calculateGeneralVolumes();
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
    
    syncWithGeneralSplitVolume(direction, entering_volume, exiting_volume, k_factor_in, k_factor_out, entering_truck_per, exiting_truck_per) {
        if (typeof cardinal_direction == "number")
            this._direction = UnboundDirectionEnum[cardinal_direction];
        else 
            this._direction = direction;
        this._general_volume = entering_volume + exiting_volume;
        this._k_factor = ( (entering_volume * k_factor_in) + (exiting_volume * k_factor_out) ) / this._general_volume;
        
        this._volume_cars_in  = Math.round(entering_volume * (1 - entering_truck_per) * k_factor_in);
        this._volume_cars_out = Math.round(exiting_volume * (1 - exiting_truck_per) * k_factor_out);

        this._volume_trucks_in  = Math.round(entering_volume * entering_truck_per * k_factor_in);
        this._volume_trucks_out = Math.round(exiting_volume * exiting_truck_per * k_factor_out);
        
        this._volume_in  = this._volume_cars_in + this._volume_trucks_in;
        this._volume_out = this._volume_cars_out + this._volume_trucks_out;
        
        this._truck_per = (this._volume_trucks_in + this._volume_trucks_out)
                        / (this._volume_cars_in + this._volume_cars_out + this._volume_trucks_in + this._volume_trucks_out);
        
        if (this._direction === "north")
            this._d_factor = exiting_volume / this._general_volume;
        else if (this._direction === "east")
            this._d_factor = exiting_volume / this._general_volume;
        else if (this._direction === "south")
            this._d_factor = entering_volume / this._general_volume;
        else if (this._direction === "west")
            this._d_factor = entering_volume / this._general_volume;
    }
}

class GeneralVolumeSplitDirection {
    /**
     * A class to contain and organize data pertaining to general volumes used in the Fratar balancing
     * method. General volumes are those that describe only the number of vehicles that enter and leave
     * each leg of the intersection. They do not detail the volume per movement (left, through, right).
	 * GeneralVolumeSplitDirection provide the entering volume and exiting volume separately.
     * @param {string} direction The cardinal direction of the intersection branch relative to the intersection
     * itself. A general volume describing vehicles moving southbound to enter the intersection and northbound
     * to exit the intersection are in the south cardinal zone.
     * @param {int} entering_volume The number of vehicles traveling into this branch of the intersection.
     * @param {int} exiting_volume The number of vehicles traveling out from this branch of the intersection.
     * @param {float} k_factor NOT DEFINED YET
     * @param {float} entering_truck_per A percentage value describing the volume of trucks entering this branch 
	 * relative to the total entering volume. If 10 of 100 vehicles in the measured entering volume are trucks, there 
	 * is a 30% truck percentage, represented here by 0.1.
     * @param {float} exiting_truck_per A percentage value describing the volume of trucks exit through this branch 
	 * relative to the total exiting volume. If 10 of 100 vehicles in the measured exiting volume are trucks, there 
	 * is a 30% truck percentage, represented here by 0.1.
     * @constructor
     */
    constructor(direction, entering_volume, exiting_volume, entering_k_factor, exiting_k_factor, entering_truck_per, exiting_truck_per) {
        this._direction      = direction;
        this._volume_in      = entering_volume;
        this._volume_out     = exiting_volume;
        this._k_factor_in    = entering_k_factor;
        this._k_factor_out   = exiting_k_factor;
        this._in_truck_per   = entering_truck_per;
        this._out_truck_per  = exiting_truck_per;
        
        this.calculateGeneralSplitVolumes();
    }
    
    calculateGeneralSplitVolumes() {
        this._general_volume = this._volume_in + this._volume_out;
        this._volume_cars_in  = Math.round(this._volume_in * (1 - this._in_truck_per) * this._k_factor_in);
        this._volume_cars_out = Math.round(this._volume_out * (1 - this._out_truck_per) * this._k_factor_out);

        this._volume_trucks_in  = Math.round(this._volume_in * this._in_truck_per * this._k_factor_in);
        this._volume_trucks_out = Math.round(this._volume_out * this._out_truck_per * this._k_factor_out);
        
        if (this._direction === "north")
            this._d_factor = this._volume_out / this._general_volume;
        else if (this._direction === "east")
            this._d_factor = this._volume_out / this._general_volume;
        else if (this._direction === "south")
            this._d_factor = this._volume_in / this._general_volume;
        else if (this._direction === "west")
            this._d_factor = this._volume_in / this._general_volume;
    }

    getAttributeBySelector(selector) {
        if (selector == "array" || selector === undefined)
            return [this._direction, this._volume_in, this._volume_out, this._k_factor_in, this._k_factor_out, this._in_truck_per, this._out_truck_per];
        else if (selector == "direction")
            return this._direction;
        else if (selector == "volume in")
            return this._volume_in;
        else if (selector == "volume out")
            return this._volume_out;
        else if (selector == "k-factor in")
            return this._k_factor_in;
        else if (selector == "k-factor out")
            return this._k_factor_out;
        else if (selector == "truck percent in")
            return this._in_truck_per;
        else if (selector == "truck percent out")
            return this._out_truck_per;
    }
    
    setGeneralSplitVolumeArray(volume_array) {
        this._volume_in     = volume_array[1];
        this._volume_out    = volume_array[2];
        this._k_factor_in   = volume_array[3];
        this._k_factor_out  = volume_array[4];
        this._in_truck_per  = volume_array[5];
        this._out_truck_per = volume_array[6];
        this.calculateGeneralVolumes();
    }
    
    /**
     * Returns the stored value for the entering volume.
     * @returns {int} The volume of vehicles
     */
    getVolumeIn() {
        return this._volume_in;
    }
    
    /**
     * Returns the stored value for the exiting volume.
     * @returns {int} The volume of vehicles
     */
    getVolumeOut() {
        return this._volume_in;
    }
    
    getKFactorIn() {
        return this._k_factor_in;
    }
    
    getKFactorOut() {
        return this._k_factor_out;
    }
    
    getTruckPercentIn() {
        return this._in_truck_per;
    }
    
    getTruckPercentOut() {
        return this._out_truck_per;
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
    
    syncWithGeneralVolume(direction, general_volume, d_factor, k_factor, truck_per) {
        if (typeof cardinal_direction == "number")
            this._direction = UnboundDirectionEnum[cardinal_direction];
        else 
            this._direction = direction;
        this._general_volume = general_volume;
        this._d_factor       = d_factor;
        this._k_factor_in    = k_factor;
        this._k_factor_out   = k_factor;

        if(this._direction == "north") {
            this._volume_in  = Math.round(this._general_volume * (1 - this._d_factor) );
            this._volume_out = Math.round(this._general_volume * this._d_factor);
        }
        if(this._direction == "east") {
            this._volume_in  = Math.round(this._general_volume * (1 - this._d_factor) );
            this._volume_out = Math.round(this._general_volume * this._d_factor);
        }
        if(this._direction == "south") {
            this._volume_in  = Math.round(this._general_volume * this._d_factor);
            this._volume_out = Math.round(this._general_volume * (1 - this._d_factor) );
        }
        if(this._direction == "west") {
            this._volume_in  = Math.round(this._general_volume * this._d_factor);
            this._volume_out = Math.round(this._general_volume * (1 - this._d_factor) );
        }
        
        this._volume_cars_in  = Math.round(this._volume_in * (1 - truck_per) * this._k_factor_in);
        this._volume_cars_out = Math.round(this._volume_out * (1 - truck_per) * this._k_factor_out);

        this._volume_trucks_in  = Math.round(this._volume_in * truck_per * this._k_factor_in);
        this._volume_trucks_out = Math.round(this._volume_out * truck_per * this._k_factor_out);
        
        this._in_truck_per   = this._volume_trucks_in / (this._volume_cars_in + this._volume_trucks_in) ;
        this._out_truck_per  = this._volume_trucks_out / (this._volume_cars_out + this._volume_trucks_out);
    }
}

// [END] ////////// [CLASSES] ////////////////////
