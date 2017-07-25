
//// [SUBSECTION] ////// [SIDEBAR >> HEADERS] ///////

// When a menu header is clicked, reveal the content inside.
// When it is clicked when open, hide the content.
$("#introItemHeader").click(function(){
    $(".introMenu").transition("slide down");
});
$("#projInfoItem").click(function(){
    $("#piMenu").transition("slide down");
});
$("#appSettHeader").click(function(){
    $("#appSettMenu").transition("slide down");
});

//// [\SUBSECTION] ////// [SIDEBAR >> HEADERS] //////

//// [SUBSECTION] ////// [HELP MODALS] //////

var modalfac = new ModalFactory("cookies_found", "We found a backup!", "null", "null", "null", "Hooray! We found a backup. We've automatically applied the settings to your current" +
                                " configuration!", "Hooray!");

$("#projNameHelpClickable").click(function(){
    $("#projNameHelp").modal("show");
});
$("#interNameHelpClickable").click(function(){
    $("#interNameHelp").modal("show");
});
$("#northRouteNameHelpClickable").click(function(){
    console.log("clicked nroutenamehelp");
    $("#nsRouteNameHelp").modal("show");
});

$("#northRouteNameHelpClickable").click(function() { console.log("CLICK!"); });

$("#southRouteNameHelpClickable").click(function(){
    $("#nsRouteNameHelp").modal("show");
});
$("#eastRouteNameHelpClickable").click(function(){
    $("#ewRouteNameHelp").modal("show");
});
$("#westRouteNameHelpClickable").click(function(){
    $("#ewRouteNameHelp").modal("show");
});
$("#cpOneNameHelpClickable").click(function(){
    $("#cpOneNameHelp").modal("show");
});

//// [\SUBSECTION] ////// [HELP MODALS] //////

//// [SUBSECTION] ////// [TABS] //////

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



var latestActive;
$(".appPane .secondary").on("mouseover", "a", function(){
    var tab_tree = $(this).parent().children();
    $(tab_tree).each(function(index, curChild) {
        if($(curChild).hasClass("active"))
            latestActive = curChild;
    });
    console.log("JUST SET LATEST ACTIVE AS: "); console.log(latestActive);
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

/**
 * When the user's mouse is over a tab, except for the Add Tab tab, identify the focused tab
 * and create a right click menu that contains a "Close Tab" button to close that tab.
 */
/*
$(".appPane .secondary").on("mouseover", "a.item:not([data-tab='add_tab'])", function() {
    var focusedElem = $(this).attr("data-tab");
    var menuDefinition = [{
        name: 'Close Tab',
        title: 'Close this tab...',
        fun: function() {
            $(".appPane a[data-tab='" + focusedElem + "']").remove();
            $(".appPane .menu .item").tab();
        }
    }];
    $(".appPane .secondary a").not("a[data-tab='add_tab']").contextMenu(menuDefinition, {
        triggerOn:  'click',
        mouseClick: 'right',
        displayAround: 'cursor'
    });
});
*/


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
