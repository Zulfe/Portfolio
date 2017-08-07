$(document).bind("contentLoaded", function() {

var view = new View();


// Add content to the Application Settings menu now that it is hidden.
view.prependToView("#appSettMenu", 
"<div class='ui item'> "+
"    <div class='ui slider checkbox'> "+
"        <input id='tooltipsToggleswitch' type='checkbox' name='tooltipsToggle'> "+
"        <label>Disable Tooltips</label> "+
"    </div> "+
"    <div class='ui item'><div id='restore_from_cookies' class='ui button'>Restore From Cookies</div></div>" +
"</div>");

/**
 * When a menu header is clicked, reveal the content inside. When it is clicked and already visible, hide the content.
 */
view.createListener("#introItemHeader", "click", function() {
    view.animateElement(".introMenu", "slide down");
});
view.createListener("#projInfoItem", "click", function() {
    view.animateElement("#piMenu", "slide down");
});
view.createListener("#appSettHeader", "click", function() {
    view.animateElement("#appSettMenu", "slide down");
});

/**
 * Use the ModalFactory class to create a new modal ID'd cookies_found. It has no image and no YouTube URL to load a video from.
 * Ideally all current help modals will be converted into ModalFactory objects that can be manipulated.
*/
//view.createNewModal("cookies_found", "We found a backup!", "null", "null", "null", "Hooray! We found a backup. We've automatically applied the settings to your current configuration!", "Hooray!");


/**
 * When a input box help clickable is clicked, open the corresponding help modal.
 * Input box clickables are tags found in the upper right-hand corner of the box, and feature a question-mark icon.
 */
view.createListener("#projNameHelpClickable", "click", function() {
    view.displayModal("#projNameHelp"); 
});
view.createListener("#interNameHelpClickable", "click", function() {
    view.displayModal("#interNameHelp"); 
});
view.createListener("#northRouteNameHelpClickable", "click", function() {
    view.displayModal("#nsRouteNameHelp"); 
});
view.createListener("#southRouteNameHelpClickable", "click", function() {
    view.displayModal("#nsRouteNameHelp"); 
});
view.createListener("#eastRouteNameHelpClickable", "click", function() {
    view.displayModal("#ewRouteNameHelp"); 
});
view.createListener("#westRouteNameHelpClickable", "click", function() {
    view.displayModal("ewRouteNameHelp"); 
});
view.createListener("#cpOneNameHelpClickable", "click", function() {
    view.displayModal("#cpOneNameHelp"); 
});
view.createListener("#cpTwoNameHelpClickable", "click", function() {
    view.displayModal("#cpTwoNameHelp"); 
});
view.createListener("#cpThreeNameHelpClickable", "click", function() {
    view.displayModal("#cpThreeNameHelp"); 
});
view.createListener("#cpFourNameHelpClickable", "click", function() {
    view.displayModal("#cpFourNameHelp"); 
});

/**
 * Input binds for context points one, two, three, and four.
 */
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


/**
 * Input binds for north, east, south, and west routes.
 */
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


/**
 * When a child of the Add Tab tab is clicked, identify the child clicked and open a new tab
 * with content corresponding to the clicked child.
 */
view.createListener($(".appPane div[data-tab='add_tab']").children(), "click", function() {
    view.createNewTab();
});

/**
 * When the user mouses over any of the tabs, find the tab that is active and store it in latestActive.
 * This is done to improve the functionality and fluidity of the tabflow function. If mouseenter is used instead,
 * rapid mouse movement can result in a failed loggings of the latest active tab.
 */
view.createListener(".appPane .secondary a", "mouseover", function() {
    view.logLatestActiveTab(this);
});

var tabflow = function(tab_element) {
    var tab_tree = $(tab_element).parent();
    var num_tabs = $(tab_tree).children().length;
   
    if(!($(tab_element)[0] == $(latestActive)[0])) {
        console.log("Tab to be closed is not active tab!");
        return latestActive;
    }

    if(num_tabs == 2)
        return tab_tree.children().eq(1);
    else {
        var tab_element_pos;
        $(tab_tree).children().each(function(index, curChild){
            if($(curChild)[0] == $(tab_element)[0])
                tab_element_pos = index;
        });

        if(tab_element_pos == 0 || tab_element_pos != (num_tabs - 2))
            return tab_tree.children().eq(tab_element_pos + 1);
        else
            return tab_tree.children().eq(tab_element_pos - 1);
    }
}

$(".appPane .secondary").on("click", "i", function(){
    var UID = $(this).parent().attr("data-tab");
    console.log("MOVING TO TAB: "); console.log(tabflow($(this).parent()));
    tabflow($(this).parent()).click();
    $(this).parent().remove();
    $(".appPane div[data-tab='" + UID + "']").remove();
    $(".appPane .menu .item").tab();
});

var freewall = new Freewall(".appPane div[data-tab='add_tab']");
freewall.fitWidth();

/**
 * When the Add Tab tab is clicked for the first time, animate the tab's content.
 */
var isFirstNewtabLoad = true;
$(".appPane .secondary a[data-tab='add_tab'").click(function() {
    if(isFirstNewtabLoad) {
        $(".appPane div[data-tab='add_tab']").children().transition("slide down");
        isFirstNewtabLoad = false;
    }
});

$(".tab.segment.active").bind("elementsVisible", function() {
    var southbound_approach = new ArrowLayout($(".input.tab.content.intersection.internal.approach.southbound"), "input-tab-viewer-southbound");
    var westbound_approach  = new ArrowLayout($(".input.tab.content.intersection.internal.approach.westbound"), "input-tab-viewer-westbound");
    var northbound_approach = new ArrowLayout($(".input.tab.content.intersection.internal.approach.northbound"), "input-tab-viewer-northbound");
    var eastbound_approach  = new ArrowLayout($(".input.tab.content.intersection.internal.approach.eastbound"), "input-tab-viewer-eastbound");

    $(".tab.segment.active").unbind("elementsVisible");
});







//////////////////////////////////////////////





//// [SUBSECTION] ////// [SIDEBAR >> APPLICATION SETTINGS] //////

// When the "Toggle Tooltips" switch is clicked, enable once-valid modals if the switch
// is being clicked to on; disable all modals from input elements if the switch is being
// clicked to off.
$("#tooltipsToggleswitch").click(function(){
    if($(this).prop("checked"))
        toggleFirstVisitInputModals(false);
    else
        toggleFirstVisitInputModals(true);
});

$("#restore_from_cookies").click(function() {
   COOKIETOOL.readConfigFromCookies(); 
});

//// [\SUBSECTION] ////// [SIDEBAR >> APPLICATION SETTINGS] //////

// [END] ////////// [USER BEHAVIOR BINDS] ////////////////////
//
});
