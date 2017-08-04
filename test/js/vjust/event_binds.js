
$("#piMenu").prepend(
"<div class='ui item'>" +
"    <div class='ui input corner labeled'>"+
"        <input type='text' id='projNameInput' class='wideInput' placeholder='My VJUST Project'>"+
"        <div id='projNameHelpClickable' class='ui corner label'>"+
"            <i class='help icon'></i>"+
"        </div>"+
"    </div>"+
"</div>"+
"<div class='ui item'>"+
"    <div class='ui input corner labeled'>"+
"        <input type='text' id='interNameInput' class='wideInput' placeholder='Intersection Name'>"+
"        <div id='interNameHelpClickable' class='ui corner label'>"+
"            <i class='help icon'></i>"+
"        </div>"+
"    </div>"+
"</div>"+
"<div class='ui item'>"+
"    <div class='ui input corner labeled'>"+
"        <input type='text' id='nRouteNameInput' class='wideInput' placeholder='N Route Name'>"+
"        <div id='northRouteNameHelpClickable' class='ui corner label'>"+
"            <i class='help icon'></i>"+
"        </div>"+
"    </div>"+
"</div>"+
"<div class='ui item'>"+
"    <div class='ui input corner labeled'>"+
"        <input type='text' id='sRouteNameInput' class='wideInput' placeholder='S Route Name'>"+
"        <div id='southRouteNameHelpClickable' class='ui corner label'>"+
"            <i class='help icon'></i>"+
"        </div>"+
"    </div>"+
"</div>"+
"<div class='ui item'>"+
"    <div class='ui input corner labeled'>"+
"        <input type='text' id='eRouteNameInput' class='wideInput' placeholder='E Route Name'>"+
"        <div id='eastRouteNameHelpClickable' class='ui corner label'>"+
"            <i class='help icon'></i>"+
"        </div>"+
"    </div>"+
"</div>"+
"<div class='ui item'>"+
"    <div class='ui input corner labeled'>"+
"        <input type='text' id='wRouteNameInput' class='wideInput' placeholder='W Route Name'>"+
"        <div id='westRouteNameHelpClickable', class='ui corner label'>"+
"            <i class='help icon'></i>"+
"        </div>"+
"    </div>"+
"</div>"+
"<div class='ui item'>"+
"    <div class='ui input corner labeled'>"+
"        <input type='text' id='cpOneNameInput' class='wideInput' placeholder='Context Point One'>"+
"        <div class='ui corner label'>"+
"            <i class='help icon'></i>"+
"        </div>"+
"    </div>"+
"</div>"+
"<div class='ui item'>"+
"    <div class='ui input corner labeled'>"+
"        <input type='text' id='cpTwoNameInput' class='wideInput' placeholder='Context Point Two'>"+
"        <div class='ui corner label'>"+
"            <i class='help icon'></i>"+
"        </div>"+
"    </div>"+
"</div>"+
"<div class='ui item'>"+
"    <div class='ui input corner labeled'>"+
"        <input type='text' id='cpThreeNameInput' class='wideInput' placeholder='Context Point Three'>"+
"        <div class='ui corner label'>"+
"            <i class='help icon'></i>"+
"        </div>"+
"    </div>"+
"</div>"+
"<div class='ui item'>"+
"    <div class='ui input corner labeled'>"+
"        <input type='text' id='cpFourNameInput' class='wideInput' placeholder='Context Point Four'>"+
"        <div class='ui corner label'>"+
"            <i class='help icon'></i>"+
"        </div>"+
"    </div>"+
"</div>");

// Add content to the Application Settings menu now that it is hidden.
$("#appSettMenu").prepend(
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
$("#introItemHeader").click(function(){
    $(".introMenu").transition("slide down");
});
$("#projInfoItem").click(function(){
    $("#piMenu").transition("slide down");
});
$("#appSettHeader").click(function(){
    $("#appSettMenu").transition("slide down");
});

/**
 * Use the ModalFactory class to create a new modal ID'd cookies_found. It has no image and no YouTube URL to load a video from.
 * Ideally all current help modals will be converted into ModalFactory objects that can be manipulated.
 */
var modalfac = new ModalFactory("cookies_found", "We found a backup!", "null", "null", "null", "Hooray! We found a backup. We've automatically applied the settings to your current" +
                                " configuration!", "Hooray!");

/**
 * When a input box help clickable is clicked, open the corresponding help modal.
 * Input box clickables are tags found in the upper right-hand corner of the box, and feature a question-mark icon.
 */
$("#projNameHelpClickable").click(function() {
    $("#projNameHelp").modal("show");
});
$("#interNameHelpClickable").click(function() {
    $("#interNameHelp").modal("show");
});
$("#northRouteNameHelpClickable").click(function() {
    $("#nsRouteNameHelp").modal("show");
});
$("#southRouteNameHelpClickable").click(function() {
    $("#nsRouteNameHelp").modal("show");
});
$("#eastRouteNameHelpClickable").click(function() {
    $("#ewRouteNameHelp").modal("show");
});
$("#westRouteNameHelpClickable").click(function() {
    $("#ewRouteNameHelp").modal("show");
});
$("#cpOneNameHelpClickable").click(function() {
    $("#cpOneNameHelp").modal("show");
});

$("#cpOneNameInput").parent().on("input", function() {
    $(".input.tab.content.intersection.internal.context-point-one span").text($("#cpOneNameInput").val());
});
$("#cpTwoNameInput").parent().on("input", function() {
    $(".input.tab.content.intersection.internal.context-point-two span").text($("#cpTwoNameInput").val());
});
$("#cpThreeNameInput").parent().on("input", function() {
    $(".input.tab.content.intersection.internal.context-point-three span").text($("#cpThreeNameInput").val());
});
$("#cpFourNameInput").parent().on("input", function() {
    $(".input.tab.content.intersection.internal.context-point-four span").text($("#cpFourNameInput").val());
});


$("#nRouteNameInput").parent().on("input", function() {
    console.log("Got input from input parent.");
    $(".input.tab.content.intersection.internal.roadway.southbound p").text($("#nRouteNameInput").val());
});
$("#nRouteNameInput").on("input", function() {
    console.log("Got input from input.");
});

$("#wRouteNameInput").parent().on("input", function() {
    $(".input.tab.content.intersection.internal.roadway.westbound p").text($("#wRouteNameInput").val());
});
$("#nRouteNameInput").parent().on("input", function() {
    $(".input.tab.content.intersection.internal.roadway.northbound p").text($("#nRouteNameInput").val());
});
$("#eRouteNameInput").parent().on("input", function() {
    $(".input.tab.content.intersection.internal.roadway.eastbound p").text($("#eRouteNameInput").val());
});







/**
 * When a child of the Add Tab tab is clicked, identify the child clicked and open a new tab
 * with content corresponding to the clicked child.
 */
$(".appPane div[data-tab='add_tab']").children().click(function(){
    console.log("Clicked a child in the add tab tab!");
    var UID = Math.random().toString(36).substring(2, 5);
    console.log("New tab UID: " + UID);
    $(".appPane .secondary a:last-of-type").before("<a class='item' data-tab='" + UID + "'>" + UID + "<i class='medium close icon'></i></a>");
    $(".appPane .tab:last").before("<div class='ui bottom attached tab segment' data-tab='" + UID + "'>This is sample input for a new tab.</div>");
    $(".appPane .menu .item").tab();
});


/**
 * Note: This should be in globals.js
 */
var latestActive;
/**
 * When the user mouses over any of the tabs, find the tab that is active and store it in latestActive.
 * This is done to improve the functionality and fluidity of the tabflow function. If mouseenter is used instead,
 * rapid mouse movement can result in a failed loggings of the latest active tab.
 */
$(".appPane .secondary").on("mouseover", "a", function(){
    latestActive = $(this).parent().children(".active");
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
