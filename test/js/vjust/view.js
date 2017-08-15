class View {
    /**
     * A class for handling all view-related tasks, such as the adding, displaying, removing, repositioning, and animation of elements visible to the end user.
     * All listeners for on-screen elements are created here using <tt>createListener()</tt>.
     */
    constructor() {
        this._dynamically_generated_modals = [];
        this._first_visit_input_modals_enabled = true;
        this._latest_active_tab = "";

        this._self = this;

        this._first_click_modals = [
            "projNameHelp",
            "interNameHelp",
            "nsRouteNameHelp",
            "ewRouteNameHelp",
            "cpOneNameHelp"
        ];

        this._ARDictionary = {};

        this.initialize();

        // Make the View responsible for acknowledging when a module is created.
        EventBus.addEventListener("module_created", this.handleModuleCreated, this);
        // Make the View responsible for acknowledging when a module does something important.
        EventBus.addEventListener("module_announce", this.handleModuleAnnouncement);

    }

    initialize() {

        var _this = this;

        this.prependToElement("#appSettMenu",  
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
        this.createListener("#introItemHeader", "click", function() {
            _this.animateElement(".introMenu", "slide down");
        });
        this.createListener("#projInfoItem", "click", function() {
            _this.animateElement("#piMenu", "slide down");
        });
        this.createListener("#appSettHeader", "click", function() {
            _this.animateElement("#appSettMenu", "slide down");
        });





        /* Input Box Help Clickables
         * =============================================================================================== */
        this.createListener("#projNameHelpClickable",       "click", function() {
            _this.displayModal("#projNameHelp"); 
        });
        this.createListener("#interNameHelpClickable",      "click", function() {
            _this.displayModal("#interNameHelp"); 
        });
        this.createListener("#northRouteNameHelpClickable", "click", function() {
            _this.displayModal("#nsRouteNameHelp"); 
        });
        this.createListener("#southRouteNameHelpClickable", "click", function() {
            _this.displayModal("#nsRouteNameHelp"); 
        });
        this.createListener("#eastRouteNameHelpClickable",  "click", function() {
            _this.displayModal("#ewRouteNameHelp"); 
        });
        this.createListener("#westRouteNameHelpClickable",  "click", function() {
            _this.displayModal("ewRouteNameHelp"); 
        });
        this.createListener("#cpOneNameHelpClickable",      "click", function() {
            _this.displayModal("#cpOneNameHelp"); 
        });
        this.createListener("#cpTwoNameHelpClickable",      "click", function() {
            _this.displayModal("#cpTwoNameHelp"); 
        });
        this.createListener("#cpThreeNameHelpClickable",    "click", function() {
            _this.displayModal("#cpThreeNameHelp"); 
        });
        this.createListener("#cpFourNameHelpClickable",     "click", function() {
            _this.displayModal("#cpFourNameHelp"); 
        });




        /* Route Name Input-this._view Synchronization
         * =============================================================================================== */
        this.createListener("#nRouteNameInput", "input", function() {
            var inputValue = _this.getInputValue("#nRouteNameInput");
            _this.notifyController("set projRouteName", ["north", inputValue]);
            _this.setElementText(".input.tab.content.intersection.internal.roadway.southbound p", inputValue);
        });

        this.createListener("#eRouteNameInput", "input", function() {
            var inputValue = _this.getInputValue("#eRouteNameInput");
            _this.notifyController("set projRouteName", ["east", inputValue]);
            _this.setElementText(".input.tab.content.intersection.internal.roadway.westbound p", inputValue);
        });

        this.createListener("#sRouteNameInput", "input", function() {
            var inputValue = _this.getInputValue("#sRouteNameInput");
            _this.notifyController("set projRouteName", ["south", inputValue]);
            _this.setElementText(".input.tab.content.intersection.internal.roadway.northbound p", inputValue);
        });

        this.createListener("#wRouteNameInput", "input", function() {
            var inputValue = _this.getInputValue("#wRouteNameInput");
            _this.notifyController("set projRouteName", ["west", inputValue]);
            _this.setElementText(".input.tab.content.intersection.internal.roadway.eastbound p", inputValue);
        });





        /* Context Point Name Input-View Synchronization
         * =============================================================================================== */
        this.createListener($("#cpOneNameInput").parent(), "input", function() {
            _this.setElementText(".input.tab.content.intersection.internal.context-point-one span", _this.getInputValue("#cpOneNameInput"));
            _this.notifyController("change", "");
        });
        this.createListener($("#cpTwoNameInput").parent(), "input", function() {
            _this.setElementText(".input.tab.content.intersection.internal.context-point-two span", _this.getInputValue("#cpTwoNameInput"));
        });
        this.createListener($("#cpThreeNameInput").parent(), "input", function() {
            _this.setElementText(".input.tab.content.intersection.internal.context-point-three span", _this.getInputValue("#cpThreeNameInput"));
        });
        this.createListener($("#cpFourNameInput").parent(), "input", function() {
            _this.setElementText(".input.tab.content.intersection.internal.context-point-four span", _this.getInputValue("#cpFourNameInput"));
        });





        /* Application Settings Togglers and Buttons
         * =============================================================================================== */
        this.createListener("#tooltipsToggleswitch", "click", function() {
            _this.toggleFirstVisitInputModals($("#tooltipsToggleswitch").prop("checked"));
        });





       /* Tab Creation, Deletion, and Information Collection
         * =============================================================================================== */

        /**
         * When a child of the Add Tab tab is clicked, identify the child clicked and open a new tab
         * with content corresponding to the clicked child.
         */
        this.createListener($(".appPane div[data-tab='add_tab'] div"), "click", function() {
            _this.createNewTab($(this).attr("data-intersection-type"));
        });

        /**
         * When the user mouses over any of the tabs, find the tab that is active and store it in
         * latestActive.
         * This is done to improve the functionality and fluidity of the tabflow function. If mouseenter is
         * used instead, rapid mouse movement can result in a failed loggings of the latest active tab.
         */
        this.createListener([".appPane .secondary", "a"], "mouseover", function() {
            _this.logLatestActiveTab(this);
        });

        this.createListener([".appPane .secondary", "i"], "click", function() {
            var UID = $(this).parent().attr("data-tab");
            _this.tabFlow($(this).parent()).click();
            $(this).parent().remove();
            $(".appPane div[data-tab='" + UID + "']").remove();
            $(".appPane .menu .item").tab();
        });

        this.createListener([".appPane .secondary", "a"], "click", function() {
            _this.notifyContent(this);
        });





        /* Input Tab Data Collection
         * =============================================================================================== */
        this.createListener(".input.tab.content.table input", "input", function() {
            var input_id = $(this).attr("name").split("-");
            var val      = $(this).val().charAt( $(this).val().length - 1 ) == "%" ? $(this).val().substring(0, $(this).val().length - 1) : $(this).val();

            if(input_id[3] === undefined) {
                _this.notifyController("set uvdvol", [input_id[1], input_id[2], val]);
                $(".input.tab.content.intersection.internal.volume-container input[name='this._view-" + input_id[1] + "-" + input_id[2] + "']").val(val);
            }
            else {
                _this.notifyController("set uvdperc", [input_id[1], input_id[2], val]);
            }
        });

        /**
         * When a volume input in the intersection view is updated, update the corresponding input in the
         * user input table and notify the controller that the Model needs to have its variable corresponding
         * to the direction and movement updated.
         */
        this.createListener(".input.tab.content.intersection.internal.volume-container input", "input", function() {
            var input_id = $(this).attr("name").split("-");
            var val = $(this).val();
            
            _this.notifyController("set uvdvol", [input_id[1], input_id[2], val]);
            $(".input.tab.content.table input[name='usertable-" + input_id[1] + "-" + input_id[2] + "']").val(val);
        });

        /**
         * When a user enters a value into a percentage input and navigates to the next input, append a percentage symbol
         * to the content of the input box they've modified. This aims to clarify to the user that the values they enter
         * are percentages, thus 0.1 and 10% are not equivalent.
         */
        this.createListener(".input.tab.content.table input", "change", function() {
           if($(this).hasClass("perc-input") && $(this).val().charAt($(this).val().length - 1) != "%")
                _this.setInputValue(this, $(this).val() + "%");
        });

    }

    notifyController(command, params) {
        EventBus.dispatch("view_notify", this, command, params);
    }

    handleModuleCreated(event, UID, module_object) {
        var mod_det = UID.split("-");

        if(mod_det[0] == "AR") {
            var conf = mod_det[1];
            var zone = mod_det[2];
            var dir  = mod_det[3];

            var mod_address = conf + "-" + zone + "-" + dir;
            this._ARDictionary[mod_address] = module_object;
        }

        console.log(this._ARDictionary);
    }

    /**
     * When a module calls out that it has behaved in a way that is considered important to the scope of this application, and
     * the View has received it's UID and associated update information, pass the information on to the Controller to handle
     * getting information from the Model and placing it where it needs to go in the DOM via this View.
     * @param {Event} event The event information describing where this behavior is coming from
     * @param {string} UID A unique identifier for the module that announced itself
     * @param {Array} value An array of update values to be used in updating the Model and potentially the View
     */
    handleModuleAnnouncement(event, UID, value) {
        var mod_det = UID.split("-");
        // If the announcing module is ArrowLayout...
        if(mod_det[0] == "AR") {
            var conf = mod_det[1];
            var zone = mod_det[2];
            var dir  = mod_det[3];
            var mvt  = mod_det[4];

            this.notifyController("set arrow", [conf, zone, dir, mvt]);

            // Notify the controller of a new value...
            // controller.updateArrowCount(conf, zone, dir, mvt, value);
        }
        // If the announcing module is InfoSwitch...
        if(mod_det[0] == "IS") {

        }
    }

    /**
     * Animate an element using a Semantic-UI <tt>.transition()</tt> animation.
     * @param {string} selector The element(s) to be animated in selector form
     * @param {string} animation The Semantic-UI animation to be performed
     */
    animateElement(selector, animation) {
        $(selector).transition(animation);
    }

    /**
     * Add to the end of the body tag the passed code.
     * @param {string} code The code to be inserted at the end of the body
     */
    appendToView(code) {
        $("body").append(code);
    }

    /**
     * Create a new event delegation that listens to the element(s) specified for the event specified. When the listener hears the event, execute
     * the given function.
     * @param {string} selector The reference form or jQuery object of the element(s) to have an event handler bound to them
     * @param {string} event The jQuery notation for the event desired ("click", "input", "mouseover")
     * @param {function} exec_function The function to be executed when the listener hears the event on the element specified
     */
    createListener(selector, event, exec_function) {
        if(jQuery.type(selector) == "array")
            $(selector[0]).on(event, selector[1], exec_function);
        else
            $(selector).on(event, exec_function);
    }

    /**
     * Use the ModalFactory class to create a new ModalFactory object, thus creating and injecting HTML code into the DOM for a Semantic-UI modal.
     * @see ModalFactory
     */
    createNewModal(element_id, header, image, image_size, youtube_import, description, button_text) {
        this._dynamically_generated_modals.push(new ModalFactory(element_id, header, image, image_size, youtube_import, description, button_text));
    }

    /**
     * Open a new tab on the tab bar.
     * Note! Need to implement adding a tab with a given ID.
     * @param {string} int_type The type of intersection or configuration that is having a tab created for it
     */
    createNewTab(int_type) {
        if($(".appPane .secondary a[data-tab='" + int_type + "']").length > 0) { 
            this.warn("You can only have one type of this tab open at a time!");
            return;
        }
       
        // Use the name of the HTML snippet being loaded, but with the first letter capitalized.
        var UID = int_type.toLowerCase().replace(/\b[a-z]/g, function(letter) { return letter.toUpperCase(); });

        $(".appPane .secondary a:last-of-type").before("<a class='item' data-tab='" + int_type + "'>" + UID + "<i class='medium close icon'></i></a>");
        $(".appPane .tab:last").before("<div class='ui bottom attached tab segment' data-tab='" + int_type + "'></div>");
        this.loadIntoElement(".appPane .tab.segment[data-tab='" + int_type + "']", int_type + ".html");
        $(".appPane .menu .item").tab();
    }

    /**
     * Make visible to the user the modal with the ID attribute specified. If the modal is designated as one that runs when it is the user's first
     * visit, and the displaying of modals for a user's first time visit is enabled, show the modal.
     * @param {string} modal_id The ID of the modal in selector form (#someModal)
     */
    displayModal(modal_id) {
        if(this.isModalFirstClickHelper(modal_id))
            if(this._first_visit_input_modals_enabled)
                $(modal_id).modal("show");
        else
            $(modal_id).modal("show");
    }

    /**
     * Return the content of a user input box with the specified selector.
     * @returns {string} The content of the input box at the selector given
     */
    getInputValue(selector) {
        return $(selector).val();
    }

    /**
     * Check if cookies (and thus a backup) is/are present. Return if cookies were found.
     * @returns {boolean} <tt>true</tt> if cookies have been found; <tt>false</tt> if cookies were not found
     */
    isCookiesDefined() {
        if(1 + 2 == 4)
            return true;
        else
            return false;
    }

    /**
     * Check if it is the user's first time visiting the page. This and the presence of cookies are close in that
     * this function depends on the accuracy of <tt>isCookiesDefined()</tt>.
     * @returns {boolean} <tt>true</tt> if it is the user's first time visiting; <tt>false</tt> if the user has visited before
     */
    isFirstVisit() {
        return !(this.isCookiesDefined());
    }

    /**
     * Check if the given modal ID (minus the #) is in the list of predefined first click displayable
     * modals. First click displayable modals are those that display on the first click only if the
     * script has determined that it is the user's first time visiting the tool.
     * @param {string} modal_id The ID of the modal in reference form (#someModal)
     * @returns {boolean} <tt>true</tt> if the modal is in the list of first click helper modals;
     *                    <tt>false</tt> if it is not
    */
    isModalFirstClickHelper(modal_id) {
        return ($.inArray(modal_id.substring(1), this._first_click_modals) != -1 ? true : false);
    }

    /**
     * Load into the selected element(s) the snippet of code contained in the file specified.
     * @param {string|Object} selector The reference form or jQuery object of the element(s) to have code injected into them
     * @param {string} snippet The file name or path to the file containing the snippet of code to be injected
     */
    loadIntoElement(selector, snippet) {
        console.log("Importing", snippet, "into ", $(selector));
        $(selector).load(snippet);
    }

    /**
     * Store to an associated member variable the tab element that was previously active.
     * @param {string} selector The selector for a tab element in a tab bar
     */
    logLatestActiveTab(selector) {
        this._latest_active_tab = $(selector).parent().children(".active");
    }

    /**
     * Notify the content associated with the tab header clicked that it's time for any embedded Javascript to load. This
     * is used to ensure that the content is visible before attempting to pull data from it. When elements widths are
     * defined by a percentage, executing a jQuery <tt>.width()</tt> or <tt>.height()</tt> call on them results in their
     * percentage value being returned, not their computed pixel value.
     * @param {string|Object} clicked_tab The identification of the element in reference form or a jQuery object of the
     * element.
     */
    notifyContent(clicked_tab) {
        var tab_id = $(clicked_tab).attr("data-tab");

        // If the clicked tab is the add tab or is a tab that has already been notified, stop now.
        // A system has not yet been implemented to determine if a tab has already been notified or not.
        // It's hard to tell when a tab that is closed has all of its content removed, but in closing a tab
        // this function is called.
        if(tab_id == "add_tab" || false) return;

        $(".appPane .tab.segment[data-tab='" + tab_id + "'] .container").trigger("tabLoaded");
    }

    /**
     * Add to the beginning of the body tag the passed code.
     * @param {string} code The code to be inserted at the beginning of the body
     */
    prependToView(code) {
        $("body").prepend(code);
    }

    /**
     * Add to the beginning of a given element the passed code.
     * @param {string} element The element(s) in selector form to have code prepended to them
     * @param {string} code The code to be prepended to the selected elements
     */
    prependToElement(element, code) {
        $(element).prepend(code);
    }

    /**
     * Remove a tab from the tab bar with the given UID.
     */
    removeTab() {

    }

    /**
     * Select an element or elements and change the contents of their text. If specified, perform an animation on the parent
     * element to smoothen the changing of text. This is useful for providing a smooth, transitional progression through
     * content, like viewing help on a new type of intersection.
     * @param {string} selector The elements to have their text changed in selector form
     * @param {string} new_text The text to update the element(s) with
     * @param {string} parent_animation The SemanticUI <tt>transition()</tt> animation to use on the parent
     */
    setElementText(selector, new_text, parent_animation) {
        if(parent_animation === undefined)
            $(selector).text(new_text);
        else
            $(selector).parent().transition({
                "animation" : parent_animation,
                onComplete  : function() {
                    $(selector).text(new_text);
                    $(selector).parent().transition(parent_animation);
                }
            });
    }

    /**
     * Set the value of one or multiple input boxes with the given value.
     * @param {string} selector The element(s) to be modified
     * @param {string} new_input The value to write inside the input box
     */
    setInputValue(selector, new_input) {
        $(selector).val(new_input);
    }

    /**
     * Computes the tab that should be moved to if the given tab is being removed from the list.
     * @param {string} tab_element The tab element to that we expect to remove, in selector form
     * @returns {jQuery} A jQuery object of the tab to be moved to prior to removing the tab specified
     */
    tabFlow(tab_element) {
        var tab_tree = $(tab_element).parent();
        var num_tabs = $(tab_tree).children().length;
      
        if(!($(tab_element)[0] == $(this._latest_active_tab)[0])) {
            console.log("Tab to be closed is not active tab!");
            return this._latest_active_tab;
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

    /**
     * Enable or disable the displaying of help modals when a user clicks on modal-enabled elements for the first time.
     * @param {boolean} flag <tt>true</tt> for enabled; <tt>false</tt> for disable
     */
    toggleFirstVisitInputModals(flag) {
        if(flag) {
            this._first_visit_input_modals_enabled = true;
        }
        else {
            this._first_visit_input_modals_enabled = false;
        }
    }

    /**
     * Create a warning box in the top right of the screen with the given message. The box will be faded in, shaken to grab
     * the user's attention, kept visible for three seconds, then faded out.
     * @param {string} message The message to be shown in the warning box
     */
    warn(message) {
        if($("#warnbox_container").length > 0) {
            clearInterval($("#warnbox_container").attr("data-interval-id"));
            $("#warnbox_container").remove();
        }

        var prepend_code = "<div id='warnbox_container' style='pointer-events: none !important; height: 100%; width: 100%; z-index: 9998;'><div id='warnbox' class='ui orange message' style='height: 10%; width: 20%; position: absolute; top: 3%; right: 3%;'><i style='pointer-events: initial !important;' class='close icon'></i>" + message + "</div></div>";
        $("body").prepend(prepend_code);
        
        $("#warnbox_container").fadeIn(200);
        
        $("#warnbox i").click(function() {
            clearInterval($("#warnbox_container").attr("data-interval-id"));
            $("#warnbox_container").remove();
        });

        $("#warnbox_container").shake(4, 8, 550).delay(3000).fadeOut(1800);
        
        var timeout = setTimeout(function() {
            $("#warnbox_container").remove();
        }, 6750);
        $("#warnbox_container").attr("data-interval-id", timeout);
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
                + "?(([0-9a-z_!~*'().&=+$%-]+: )?[0-9a-z_!~*'().&=+$%-]+@)?" //ftpçš„user@
                + "(([0-9]{1,3}\.){3}[0-9]{1,3}" // IPå½¢å¼çš„URL- 199.194.52.184
                + "|" // å…è®¸IPå’ŒDOMAINï¼ˆåŸŸåï¼‰
                + "([0-9a-z_!~*'()-]+\.)*" // åŸŸå- www.
                + "([0-9a-z][0-9a-z-]{0,61})?[0-9a-z]\." // äºŒçº§åŸŸå
                + "[a-z]{2,6})" // first level domain- .com or .museum
                + "(:[0-9]{1,4})?" // ç«¯å£- :80
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
