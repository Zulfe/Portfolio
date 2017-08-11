/**
 * @fileOverview A controller to interface the VJuST data structure and VJuST frontend.
 * @author Damon A. Shaw of VDOT <Damon.Shaw@vdot.virginia.gov || admins@vt.edu>
 * @version Alpha-0.0.2
 */

// Wait until the content is loaded and visible before 
$(document).bind("contentLoaded", function() {

var view = new View();


// Add content to the Application Settings menu now that it is hidden.
view.prependToElement("#appSettMenu",  
"<div class='ui item'> "+
"    <div class='ui slider checkbox'> "+
"        <input id='tooltipsToggleswitch' type='checkbox' name='tooltipsToggle'> "+
"        <label>Disable Tooltips</label> "+
"    </div> "+
"    <div class='ui item'><div id='restore_from_cookies' class='ui button'>Restore From Cookies</div></div>" +
"</div>");


/**
 * Use the ModalFactory class to create a new modal ID'd cookies_found. It has no image and no
 * YouTube URL to load a video from.
 * Ideally all current help modals will be converted into ModalFactory objects that can be
 * manipulated.
*/
//view.createNewModal("cookies_found", "We found a backup!", "null", "null", "null", "Hooray! We found a backup. We've automatically applied the settings to your current configuration!", "Hooray!");




/* Sidebar Headers
 * =============================================================================================== */
view.createListener("#introItemHeader", "click", function() {
    view.animateElement(".introMenu", "slide down");
});
view.createListener("#projInfoItem", "click", function() {
    view.animateElement("#piMenu", "slide down");
});
view.createListener("#appSettHeader", "click", function() {
    view.animateElement("#appSettMenu", "slide down");
});



/* Input Box Help Clickables
 * =============================================================================================== */
view.createListener("#projNameHelpClickable",       "click", function() {
    view.displayModal("#projNameHelp"); 
});
view.createListener("#interNameHelpClickable",      "click", function() {
    view.displayModal("#interNameHelp"); 
});
view.createListener("#northRouteNameHelpClickable", "click", function() {
    view.displayModal("#nsRouteNameHelp"); 
});
view.createListener("#southRouteNameHelpClickable", "click", function() {
    view.displayModal("#nsRouteNameHelp"); 
});
view.createListener("#eastRouteNameHelpClickable",  "click", function() {
    view.displayModal("#ewRouteNameHelp"); 
});
view.createListener("#westRouteNameHelpClickable",  "click", function() {
    view.displayModal("ewRouteNameHelp"); 
});
view.createListener("#cpOneNameHelpClickable",      "click", function() {
    view.displayModal("#cpOneNameHelp"); 
});
view.createListener("#cpTwoNameHelpClickable",      "click", function() {
    view.displayModal("#cpTwoNameHelp"); 
});
view.createListener("#cpThreeNameHelpClickable",    "click", function() {
    view.displayModal("#cpThreeNameHelp"); 
});
view.createListener("#cpFourNameHelpClickable",     "click", function() {
    view.displayModal("#cpFourNameHelp"); 
});



/* Context Point Name Input-View Synchronization
 * =============================================================================================== */
view.createListener($("#cpOneNameInput").parent(), "input", function() {
    view.setElementText(".input.tab.content.intersection.internal.context-point-one span", view.getInputValue("#cpOneNameInput")); 
});
view.createListener($("#cpTwoNameInput").parent(), "input", function() {
    view.setElementText(".input.tab.content.intersection.internal.context-point-two span", view.getInputValue("#cpTwoNameInput"));
});
view.createListener($("#cpThreeNameInput").parent(), "input", function() {
    view.setElementText(".input.tab.content.intersection.internal.context-point-three span", view.getInputValue("#cpThreeNameInput"));
});
view.createListener($("#cpFourNameInput").parent(), "input", function() {
    view.setElementText(".input.tab.content.intersection.internal.context-point-four span", view.getInputValue("#cpFourNameInput"));
});



/* Route Name Input-View Synchronization
 * =============================================================================================== */
view.createListener("#nRouteNameInput", "input", function() {
    var inputValue = view.getInputValue("#nRouteNameInput");
    project.setRouteName("north", inputValue);
    view.setElementText(".input.tab.content.intersection.internal.roadway.southbound p", inputValue);
});
view.createListener("#eRouteNameInput", "input", function() {
    var inputValue = view.getInputValue("#eRouteNameInput");
    project.setRouteName("east", inputValue);
    view.setElementText(".input.tab.content.intersection.internal.roadway.westbound p", inputValue);
});
view.createListener("#sRouteNameInput", "input", function() {
    var inputValue = view.getInputValue("#sRouteNameInput");
    project.setRouteName("south", inputValue);
    view.setElementText(".input.tab.content.intersection.internal.roadway.northbound p", inputValue);
});
view.createListener("#wRouteNameInput", "input", function() {
    var inputValue = view.getInputValue("#wRouteNameInput");
    project.setRouteName("west", inputValue);
    view.setElementText(".input.tab.content.intersection.internal.roadway.eastbound p", inputValue);
});



/* Application Settings Togglers and Buttons
 * =============================================================================================== */
view.createListener("#tooltipsToggleswitch", "click", function() {
    view.toggleFirstVisitInputModals($("#tooltipsToggleswitch").prop("checked"));
});

view.createListener("#restore_from_cookies", "click", function() {
    //var cookies_data = 
    project.getCookiesUtility().readConfigFromCookies();
    //view.updateEverything(cookies_data);
});




/* Tab Creation, Deletion, and Information Collection
 * =============================================================================================== */

/**
 * When a child of the Add Tab tab is clicked, identify the child clicked and open a new tab
 * with content corresponding to the clicked child.
 */
view.createListener($(".appPane div[data-tab='add_tab'] div"), "click", function() {
    view.createNewTab($(this).attr("data-intersection-type"));
});

/**
 * When the user mouses over any of the tabs, find the tab that is active and store it in
 * latestActive.
 * This is done to improve the functionality and fluidity of the tabflow function. If mouseenter is
 * used instead, rapid mouse movement can result in a failed loggings of the latest active tab.
 */
view.createListener([".appPane .secondary", "a"], "mouseover", function() {
    view.logLatestActiveTab(this);
});


view.createListener([".appPane .secondary", "i"], "click", function() {
    var UID = $(this).parent().attr("data-tab");
    console.log("Suggested new tab is " + view.tabFlow($(this).parent()));
    view.tabFlow($(this).parent()).click();
    $(this).parent().remove();
    $(".appPane div[data-tab='" + UID + "']").remove();
    $(".appPane .menu .item").tab();
});

view.createListener([".appPane .secondary", "a"], "click", function() {
    view.notifyContent(this);
});



/* Input Tab Data Collection
 * =============================================================================================== */
view.createListener(".input.tab.content.table input", "input", function() {
    var input_id = $(this).attr("name").split("-");
    var val      = $(this).val().charAt( $(this).val().length - 1 ) == "%" ? $(this).val().substring(0, $(this).val().length - 1) : $(this).val();

    if(input_id[3] === undefined) {
        //project.getUserVolumeDefinitions().updateComponentValueViaVerbal(input_id[1], input_id[2], val);
        console.log("Trying to write " + val + " to the " + input_id[1] + " " + input_id[2] + " volume");
        $(".input.tab.content.intersection.internal.volume-container input[name='view-" + input_id[1] + "-" + input_id[2] + "']")
            .val($(this).val());
    }
    else {
        //project.getUserVolumeDefinitions().updateComponentValueViaVerbal(input_id[1], input_id[2], val);
        console.log("Trying to write " + val + " to the " + input_id[1] + " " + input_id[2] + " truck percentage");
    }
});

view.createListener(".input.tab.content.intersection.internal.volume-container input", "input", function() {
    var input_id = $(this).attr("name").split("-");
    
    $(".input.tab.content.table input[name='usertable-" + input_id[1] + "-" + input_id[2] + "']")
        .val($(this).val());

});

view.createListener(".input.tab.content.table input", "change", function() {
   if($(this).hasClass("perc-input") && $(this).val().charAt($(this).val().length - 1) != "%")
        view.setInputValue(this, $(this).val() + "%");
});


/* *********************************************************************************************** */


/* Add Tab Fading
 * =============================================================================================== */



/* Initial Setup
 * =============================================================================================== */
//var freewall = new Freewall(".appPane div[data-tab='add_tab']");
//freewall.fitWidth();

$(".tab.segment.active").bind("elementsVisible", function() {
    console.log("Triggering elements visible!");

    var southbound_approach = new ArrowLayout($(".input.tab.content.intersection.internal.approach.southbound"), "input-tab-viewer-southbound");
    var westbound_approach  = new ArrowLayout($(".input.tab.content.intersection.internal.approach.westbound"), "input-tab-viewer-westbound");
    var northbound_approach = new ArrowLayout($(".input.tab.content.intersection.internal.approach.northbound"), "input-tab-viewer-northbound");
    var eastbound_approach  = new ArrowLayout($(".input.tab.content.intersection.internal.approach.eastbound"), "input-tab-viewer-eastbound");

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

    $(".tab.segment.active").unbind("elementsVisible");
});

if(view.isFirstVisit())
    view.toggleFirstVisitInputModals(true);
/* **********************************************************************************************  */


/* END OF FILE | END OF FILE | END OF FILE | END OF FILE | END OF FILE | END OF FILE | END OF FILE
 * =============================================================================================== */
});
