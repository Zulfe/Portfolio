class View {
    /**
     * A class for handling all view-related tasks, such as the adding, displaying, removing, repositioning, and animation of elements visible to the end user.
     * All listeners for on-screen elements are created here through <tt>createListener()</tt>.
     */
    constructor() {
        this._dynamically_generated_modals = [];
        this._first_visit_input_modals_enabled = true;
        this._latest_active_tab = "";

        this._first_click_modals = [
            "projNameHelp",
            "interNameHelp",
            "nsRouteNameHelp",
            "ewRouteNameHelp",
            "cpOneNameHelp"
        ];


    }

    /**
     * Add to the beginning of the body tag the passed code.
     */
    prependToView(selector, code) {
        $(selector).prepend(code);
    }

    /**
     * Add to the end of the body tag the passed code.
     */
    appendToView(selector, code) {
        $(selector).append(code);
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
     *
     */
    createNewTab(int_type) {
        if($(".appPane .secondary a[data-tab='" + int_type + "']").length > 0) { 
            this.warn("You can only have one type of this tab open at a time!");
            return;
        }
        
        var UID = int_type.toLowerCase().replace(/\b[a-z]/g, function(letter) { return letter.toUpperCase(); });

        $(".appPane .secondary a:last-of-type").before("<a class='item' data-tab='" + int_type + "'>" + UID + "<i class='medium close icon'></i></a>");
        $(".appPane .tab:last").before("<div class='ui bottom attached tab segment' data-tab='" + int_type + "'></div>");
        this.loadIntoElement(".appPane .tab.segment[data-tab='" + int_type + "']", int_type + ".html");
        $(".appPane .menu .item").tab();
    }

    /**
     * Remove a tab from the tab bar with the given UID.
     */
    removeTab() {

    }

    notifyContent(clicked_tab) {
        var tab_id = $(clicked_tab).attr("data-tab");

        if(tab_id == "add_tab" || false) return;

        console.log("Notifying (.appPane .tag.segment[data-tab='" + tab_id + "'] .container) that it's time to load.");
        $(".appPane .tab.segment[data-tab='" + tab_id + "'] .container").trigger("tabLoaded");
    }

    tabFlow(tab_element) {
        var tab_tree = $(tab_element).parent();
        var num_tabs = $(tab_tree).children().length;
      
        console.log($(tab_element));

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
     * Return the content of a user input box with the specified selector.
     * @returns {string} The content of the input box at the selector given
     */
    getInputValue(selector) {
        return $(selector).val();
    }

    /**
     * Animate an element
     *
     */
    animateElement(selector, animation) {
        $(selector).transition(animation);
    }

    /**
     * Store to an associated member variable the tab element that was previously active.
     * @param {string} selector The selector for a tab element in a tab bar
     */
    logLatestActiveTab(selector) {
        this._latest_active_tab = $(selector).parent().children(".active");
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
     * Make visible to the user the modal with the ID attribute specified. If modals for first ti
     */
    displayModal(modal_id) {
        if(this.isModalFirstClickHelper(modal_id))
            if(this._first_visit_input_modals_enabled)
                $(modal_id).modal("show");
        else
            $(modal_id).modal("show");
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

    isCookiesDefined() {
        if($(document).cookie.length > 0)
            return true;
        else
            return false;
    }

    isFirstVisit() {
        return true;
    }

    warn(message) {
        if($("#warnbox_container").length > 0) {
            clearInterval($("#warnbox_container").attr("data-interval-id"));
            $("#warnbox_container").remove();
        }

        var prepend_code = "<div id='warnbox_container' style='pointer-events: none !important; height: 100%; width: 100%; z-index: 9998;'><div id='warnbox' class='ui red message' style='height: 10%; width: 20%; position: absolute; top: 3%; right: 3%;'><i style='pointer-events: initial !important;' class='close icon'></i>" + message + "</div></div>";
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
