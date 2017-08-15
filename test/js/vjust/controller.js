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

        EventBus.addEventListener("view_notify", this.handleViewNotify);
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

        console.log("Creating arrow layouts!");

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

    handleViewNotify(event, command, params) {
        console.log("Command is " + command);
        console.log("Params are " + params);

        var compart = command.split(" ");
        var action = compart[0];
        var target = compart[1];

        if(action == "set") {
            // If we're updating a volume in the UserVolumeDefinitions
            if(target == "uvdvol") {
                project.getUserVolumeDefinitions().setComponentValue(params[0], params[1], params[2]);
            }
            // If we're updating a percentage in the UserVolumeDefinitions
            else if(target == "uvdperc") {
                // Set the percentage...
                //project.getUserVolumeDefinitions().setComponentValue
            }
            else if(target == "projRouteName") {
                project.setRouteName(params[0], params[1]);
            }
            else if(target == "arrow") {
               project.getIntersectionByID(params[0]).getZoneByID(params[1]).getDirectionByID(params[2]).getMovementByID(params[3]) 
            }
        }



        else if(action == "get") {

        }
        
    }
}
