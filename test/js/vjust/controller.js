/**
 * @fileOverview A controller to interface the VJuST data structure and VJuST frontend.
 * @author Damon A. Shaw of VDOT <Damon.Shaw@vdot.virginia.gov || admins@vt.edu>
 * @version Alpha-0.0.2
 */

class Controller {
    constructor(model, view) {
        this._model = model;
        this._view = view;
    
        this.initialize();

        /**
         * From Model
         * ************************************************************************************************ */
        EventBus.addEventListener("arrowLayoutUpdated", this.handleArrowLayoutUpdated, this);
        //EventBus.addEventListener("infoSwitcherDataUpdated", this.handleInfoSwitcherDataUpdated, this);
        EventBus.addEventListener("plsfix", this.handleIntersections, this);

        /**
         * From View
         * ************************************************************************************************* */
        EventBus.addEventListener("updateUserVolumeDefinitionsVolume", this.handleUpdateUserVolumeDefinitionsVolume, this);
        EventBus.addEventListener("updateUserVolumeDefinitionsPercentage", this.handleUpdateUserVolumeDefinitionsPercentage, this);

        EventBus.addEventListener("updateProjectRouteName", this.handleUpdateProjectRouteName, this);
        
        EventBus.addEventListener("updateArrow", this.handleUpdateArrow, this);
    }


    /*
     * View Event Handlers
     */

    handleUpdateUserVolumeDefinitionsVolume(event, direction, movement, value) {
        this._model.getUserVolumeDefinitions().setComponentVolumeValue(direction, movement, value);
    }

    handleUpdateUserVolumeDefinitionsPercentage(event, direction, movement, value) {
        this._model.getUserVolumeDefinitions().setComponentPercentageValue(direction, movement, value);
    }

    handleUpdateProjectContextPointName(event, cp_num, name) {
        this._model.setContextPointName(cp_num, name);
    }

    handleUpdateProjectRouteName(event, route, name) {
        this._model.setRouteName(route, name); 
    }

    handleUpdateArrow(event, config, zone, dir, movement, value) {
        //this._model.getIntersectionByID(config).getZoneByID(zone).getDirectionByID(dir).setArrowByMovement(movement, value);
    }

    /*
     * Model Event Handlers
     */

    handleArrowLayoutUpdated(event, config, zone, direction, arrow_array) {
        var address = config + "-" + zone + "-" + direction;
      
        this._view.addToArrowChangeQueue(address, arrow_array);
    }

    handleInfoSwitcherDataUpdated(event, config, zone, direction, movement, data) {
        var address = config + "-" + zone + "-" + direction + "-" + movement;


        if(this._view.isInfoSwitcherObjectActive(address))
            this._view.updateInfoSwitcherData(address, data);
        else
            this._view.addToInfoSwitcherChangeQueue(address, data);
    } 

    initialize() {
        /*
        this._view.createListener("#restore_from_cookies", "click", function() {
            //var cookies_data = 
            project.getCookiesUtility().readConfigFromCookies();
            //this._view.updateEverything(cookies_data);
        });
        */

        /* Initial Setup
         * =============================================================================================== */
        //var freewall = new Freewall(".appPane div[data-tab='add_tab']");
        //freewall.fitWidth();

            var southbound_approach = new ArrowLayout($(".input.tab.content.specific.intersection.internal.approach.southbound"), "input-tab-viewer-southbound");
            var westbound_approach  = new ArrowLayout($(".input.tab.content.specific.intersection.internal.approach.westbound"), "input-tab-viewer-westbound");
            var northbound_approach = new ArrowLayout($(".input.tab.content.specific.intersection.internal.approach.northbound"), "input-tab-viewer-northbound");
            var eastbound_approach  = new ArrowLayout($(".input.tab.content.specific.intersection.internal.approach.eastbound"), "input-tab-viewer-eastbound");

            southbound_approach.disableUserInput();
            westbound_approach.disableUserInput();
            northbound_approach.disableUserInput();
            eastbound_approach.disableUserInput();

            southbound_approach.clickLeft("exclusive");
            southbound_approach.clickThrough("exclusive");
            southbound_approach.clickRight("exclusive");

            westbound_approach.clickLeft("exclusive");
            westbound_approach.clickThrough("exclusive");
            westbound_approach.clickRight("exclusive");

            northbound_approach.clickLeft("exclusive");
            northbound_approach.clickThrough("exclusive");
            northbound_approach.clickRight("exclusive");

            eastbound_approach.clickLeft("exclusive");
            eastbound_approach.clickThrough("exclusive");
            eastbound_approach.clickRight("exclusive");

        if(this._view.isFirstVisit())
            this._view.toggleFirstVisitInputModals(true);
    }

}
