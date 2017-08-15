class InfoSwitcher {
    /**
     * A class for creating and manipulating switchable information panels.
     * @param {string} container The element that is to contain the info switcher in reference form
     * @
     */
    constructor(container, UID, entries, headers) {
        this._num_degrees = entries.length;
        this._headers     = headers;
        this._entries     = entries;
        this._focus       = 0;

        this._container   = container;
        this._UID         = UID;
    
        this.initialize(container);
    }

    /**
     * Create the HTML code and associated styling to be inserted into the DOM. Append it to the
     * object's defined container and display the first degree of information. Bind the rotation
     * buttons to the rotation functions.
     * @param {string} container The element that is to contain the info switcher in reference form
     */
    initialize(container) {
        var switcher_style =
        "<style>" +
"       #" + this._UID + "{ height: 100%; width: 100%; }" +
"       #" + this._UID + " .rotate-container { height: 100%; width: 20%; display: inline-block; vertical-align: top;}" +
"       #" + this._UID + " .rotate-container .rotate-up { position: relative; background-color: green; height: 50%; width: 100%; font-size: 10vw; text-align: center;}" +
"       #" + this._UID + " .rotate-container .rotate-down { position: relative; background-color: red; height: 50%; width: 100%; font-size: 10vw; text-align: center; transform: rotate(180deg)}" +
"       #" + this._UID + " .rotate-container .rotate-up p { height: 100%; width: 100%; margin: auto;}" +
"       #" + this._UID + " .rotate-container .rotate-down p { height: 100%; width: 100%; margin: auto;}" +
"       #" + this._UID + " .text-view { height: 100%; width: 80%; background-color: #F5F2F0; position: relative; display: inline-block; vertical-align: top; text-align: center;}" +
"       #" + this._UID + " .text-view p { position: absolute; top: 0%; left: 0%; font-size: 20vh; white-space: nowrap; margin: 0px 0px 0px 0px;}" +
        "</style>";

        var switcher_code =
            "<div id='" + this._UID + "'><div class='rotate-container'><div class='rotate-up'><p>" + "^" + "</p></div><div class='rotate-down'><p>" + "^" + "</p></div></div><div class='text-view'><p></p></div></div></div>";

        $(container).append(switcher_style);
        $(container).append(switcher_code);

        this.firstDisplayDegree();

        var _this = this;
        $("#" + this._UID + " .rotate-up").on("click", function() {
            _this.incrementDegree();
        });
        $("#" + this._UID + " .rotate-down").on("click", function() {
            _this.decrementDegree();
        });
    }

    /**
     * Focus the degree at the specified index and display it on the switcher.
     * @param {int} degree The degree of information to focus
     */
    switchDegree(degree) {
        if(degree === undefined)
            this._focus = (this._focus + 1) % this._num_degrees;
        else {
            if(degree < this._num_degrees)
                this._focus = degree;
            else
                console.log("Request was made to InfoSwitcher to focus an out of bounds degree.");
        }
        this.displayDegree();
    }

    /**
     * Move to the right in the list of entries. If the currently focused entry is at the end of the list, loop
     * back to the first in the list.
     */
    incrementDegree() {
        this._focus = (this._focus + 1) % this._num_degrees;
        this.displayDegree();
    }

    /**
     * Move to the left in the list of entries. If the currently focused entry is at the beginning of the list,
     * loop to the last in the list.
     */
    decrementDegree() {
        this._focus = ( (this._focus - 1 < 0 ? this._num_degrees - 1 : this._focus - 1) % this._num_degrees);
        this.displayDegree();
    }

    /**
     * Get the value of the entry at the given index. If the requested entry does not exist, return undefined.
     * @param {int} degree The index of the entry to have its value returned
     * @returns {string} The  
     */
    getDegreeInfo(degree) {
        if(degree < this._num_degrees)
            return this._entries[degree];
        else {
            console.log("Request was made to InfoSwitcher to return an out of bounds degree.");
            return undefined;
        }
    }

    /**
     * Overwrite the degree at the specified degree with the given value.
     * @param {int} degree The index of the degree to overwrite the value of
     * @param {string} value The value to write to the degree
     */
    setDegree(degree, value) {
        if(degree === undefined)
            this._entries[this._focus] = value;
        else {
            if(degree < this._num_degrees)
                this._entries[degree] = value;
            else
                console.log("Request was made to InfoSwitcher to change an out of bounds degree.");
        }
    }

    /**
     * A display function to be executed when the information switcher is first initialized.
     * The transitions involved in <tt>displayDegree()</tt> result in positioning issues.
     * Furthermore, an animation on load is not necessary.
     */
    firstDisplayDegree() {
        var text_view = "#" + this._UID + " .text-view";

        $(text_view + " p").text(this._headers[this._focus] + ": " + this._entries[this._focus]);

        while($(text_view + " p").width() < $(text_view).width())
            $(text_view + " p").css("font-size", (parseInt($(text_view + " p").css("font-size")) + 1));
        
        while($(text_view + " p").width() > $(text_view).width())
            $(text_view + " p").css("font-size", (parseInt($(text_view + " p").css("font-size")) - 1));

        while($(text_view + " p").height() > $(text_view).height())
            $(text_view + " p").css("font-size", (parseInt($(text_view + " p").css("font-size")) - 1));

        var vcent_dist = ($(text_view).height() - $(text_view + " p").height()) / 2;
        var hcent_dist = ($(text_view).width() - $(text_view + " p").width()) / 2;
        $(text_view + " p").css("top", vcent_dist + "px");
        $(text_view + " p").css("left", hcent_dist + "px");
    }

    /**
     * Display the currently focused degree by animating away the currently displayed degree
     * and animating in the currently focused degree. End-user control of the information switcher
     * will never result in the current degree being the same as the newly displayed degree, but
     * keep in mind that displaying a degree that's already focused may be confusing to the end
     * user.
     */
    displayDegree() {
        var _this = this;
        var text_view = "#" + this._UID + " .text-view";

        $(text_view + " p").transition({
            "animation" : "slide right",
            "onComplete" : function() {
                $(text_view + " p").text(_this._headers[_this._focus] + ": " + _this._entries[_this._focus]);

                while($(text_view + " p").width() < $(text_view).width())
                    $(text_view + " p").css("font-size", (parseInt($(text_view + " p").css("font-size")) + 1));
                
                while($(text_view + " p").width() > $(text_view).width())
                    $(text_view + " p").css("font-size", (parseInt($(text_view + " p").css("font-size")) - 1));

                while($(text_view + " p").height() > $(text_view).height())
                    $(text_view + " p").css("font-size", (parseInt($(text_view + " p").css("font-size")) - 1));


                var vcent_dist = ($(text_view).height() - $(text_view + " p").height()) / 2;
                var hcent_dist = ($(text_view).width() - $(text_view + " p").width()) / 2;
                $(text_view + " p").css("top", vcent_dist + "px");
                $(text_view + " p").css("left", hcent_dist + "px");

                $(text_view + " p").transition("slide right");
            }
        });
    }
}
