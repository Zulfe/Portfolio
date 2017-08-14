class InfoSwitcher {
    /**
     * A class for creating and manipulating switchable information panels.
     * @param {string} 
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

    initialize(container) {
        var switcher_style =
        "<style>" +
"       #" + this._UID + "{ height: 100%; width: 100%; }" +
"       #" + this._UID + " .rotate-container { height: 100%; width: 20%; display: inline-block; vertical-align: top;}" +
"       #" + this._UID + " .rotate-container .rotate-up { position: relative; background-color: green; height: 50%; width: 100%; font-size: 10vw; text-align: center;}" +
"       #" + this._UID + " .rotate-container .rotate-down { position: relative; background-color: red; height: 50%; width: 100%; font-size: 10vw; text-align: center;}" +
"       #" + this._UID + " .rotate-container .rotate-up p { height: 100%; width: 100%; margin: auto;}" +
"       #" + this._UID + " .rotate-container .rotate-down p { height: 100%; width: 100%; margin: auto;}" +
"       #" + this._UID + " .text-view { height: 100%; width: 80%; background-color: #F5F2F0; position: relative; display: inline-block; vertical-align: top; text-align: center;}" +
"       #" + this._UID + " .text-view p { position: absolute; top: 0%; left: 0%; font-size: 20vh; white-space: nowrap; margin: 0px 0px 0px 0px;}" +
        "</style>";

        var switcher_code =
            "<div id='" + this._UID + "'><div class='rotate-container'><div class='rotate-up'><p>" + "^" + "</p></div><div class='rotate-down'><p>" + "v" + "</p></div></div><div class='text-view'><p></p></div></div></div>";

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
     *
     *
     */
    setDegree(value, degree) {
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
     * 
     *
     */
    firstDisplayDegree() {
        var _this = "#" + this._UID + " .text-view";

        $(_this + " p").text(this._headers[this._focus] + ": " + this._entries[this._focus]);

        while($(_this + " p").width() < $(_this).width() ) {
            $(_this + " p").css("font-size", (parseInt($(_this + " p").css("font-size")) + 1));
        }
        
        while($(_this + " p").width() > $(_this).width()) {
            $(_this + " p").css("font-size", (parseInt($(_this + " p").css("font-size")) - 1));
        }

        while($(_this + " p").height() > $(_this).height()) {
            $(_this + " p").css("font-size", (parseInt($(_this + " p").css("font-size")) - 1));
        }
    }

    displayDegree() {

        console.log("Attempting to switch info.");

        var _this = this;
        var text_view = "#" + this._UID + " .text-view";

        $(text_view + " p").transition({
            "animation" : "slide right",
            "onComplete" : function() {
                $(text_view + " p").text(_this._headers[_this._focus] + ": " + _this._entries[_this._focus]);


                        while($(text_view + " p").width() < $(text_view).width()) {
                            //console.log($(text_view + " p").width() + " and " + $(text_view).width());
                            //console.log("Enlarging font based on container width.");
                            $(text_view + " p").css("font-size", (parseInt($(text_view + " p").css("font-size")) + 1));
                        }
                        
                        while($(text_view + " p").width() > $(text_view).width()) {
                            //console.log("Shrinking font based on container width.");
                            $(text_view + " p").css("font-size", (parseInt($(text_view + " p").css("font-size")) - 1));
                        }

                        while($(text_view + " p").height() > $(text_view).height()) {
                            //console.log("Shrinking font based on container height.");
                            $(text_view + " p").css("font-size", (parseInt($(text_view + " p").css("font-size")) - 1));
                        }

                        var vcent_dist = ($(text_view).height() - $(text_view + " p").height()) / 2;
                        var hcent_dist = ($(text_view).width() - $(text_view + " p").width()) / 2;
                        $(text_view + " p").css("top", vcent_dist + "px");
                        $(text_view + " p").css("left", hcent_dist + "px");

                        $(text_view + " p").transition("slide right");
            }
        });
    }



}
