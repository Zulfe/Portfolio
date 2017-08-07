var binder = function(selector, speaker, exec_function) {
    $(selector).on(speaker, exec_function);
}

class View {
    constructor() {
        this._dynamically_generated_modals = [];
    }

    prependToView(selector, code) {
        $(selector).prepend(code);
    }

    appendToView(selector, code) {
        $(selector).append(code);
    }

    loadIntoElement(selector, snippet) {
        $(selector).load(snippet);
    }

    createListener(selector, speaker, exec_function) {
        $(selector).on(speaker, exec_function);
    }

    createNewModal(element_id, header, image, image_size, youtube_import, description, button_text) {
        this._dynamically_generated_modals.push(new ModalFactory(element_id, header, image, image_size, youtube_import, description, button_text));
    }

    createNewTab() {
        var UID = Math.random().toString(36).substring(2, 6);
        $(".appPane .secondary a:last-of-type").before("<a class='item' data-tab='" + UID + "'>" + UID + "<i class='medium close icon'></i></a>");
        $(".appPane .tab:last").before("<div class='ui bottom attached tab segment' data-tab='" + UID + "'>This is sample input for a new tab.</div>");
        $(".appPane .menu .item").tab();
    }

    removeTab() {

    }

    tabFlow() {

    }

    getInputValue(selector) {
        return $(selector).val();
    }

    animateElement(selector, animation) {
        $(selector).transition(animation);
    }

    logLatestActiveTab(selector) {
        this._latest_active_tab = $(selector).parent().children(".active");
    }

    displayModal(modal_id) {
        $(modal_id).modal("show");
    }

    setElementText(selector, new_text, parent_animation) {
        if(parent_animation === undefined)
            $(selector).text(new_text);
        else {
            $(selector).parent().transition({
                "animation" : parent_animation,
                onComplete  : function() {
                    $(selector).text(new_text);
                    $(selector).parent().transition(parent_animation);
                }
            });
        }
            
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
