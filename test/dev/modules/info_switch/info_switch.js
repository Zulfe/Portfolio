class InfoSwitcher {
    constructor(element, entries, headers) {
        this._num_degrees = entries.length;
        this._headers     = headers;
        this._entries     = entries;
        this._focus       = 0;

        console.log(this._num_degrees);
        console.log(this._entries);
    
        this.initialize(element);
    }

    initialize(element) {
        this.firstDisplayDegree();

        var _this = this;
        $("#degree_up").on("click", function() {
            _this.incrementDegree();
        });
        $("#degree_down").on("click", function() {
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

    incrementDegree() {
        this._focus = (this._focus + 1) % this._num_degrees;
        this.displayDegree();
    }

    decrementDegree() {
        this._focus = ( (this._focus - 1 < 0 ? this._num_degrees - 1 : this._focus - 1) % this._num_degrees);
        this.displayDegree();
    }

    getDegreeInfo(degree) {
        if(degree < this._num_degrees)
            return this._entries[degree];
        else
            console.log("Request was made to InfoSwitcher to return an out of bounds degree.");
    }

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

    firstDisplayDegree() {
        $("#text_view p").text(this._headers[this._focus] + ": " + this._entries[this._focus]);

        while($("#text_view p").width() < $("#text_view").width()) {
            console.log($("#text_view p").width() + " and " + $("#text_view").width());
            console.log("Enlarging font based on container width.");
            $("#text_view p").css("font-size", (parseInt($("#text_view p").css("font-size")) + 1));
        }
        
        while($("#text_view p").width() > $("#text_view").width()) {
            console.log("Shrinking font based on container width.");
            $("#text_view p").css("font-size", (parseInt($("#text_view p").css("font-size")) - 1));
        }

        while($("#text_view p").height() > $("#text_view").height()) {
            console.log("Shrinking font based on container height.");
            $("#text_view p").css("font-size", (parseInt($("#text_view p").css("font-size")) - 1));
        }
    }

    displayDegree() {
        
        var _this = this;
        $("#text_view p").transition({
            "animation" : "slide right",
            "onComplete" : function() {
                $("#text_view p").text(_this._headers[_this._focus] + ": " + _this._entries[_this._focus]);

                while($("#text_view p").width() < $("#text_view").width()) {
                    console.log($("#text_view p").width() + " and " + $("#text_view").width());
                    console.log("Enlarging font based on container width.");
                    $("#text_view p").css("font-size", (parseInt($("#text_view p").css("font-size")) + 1));
                }
                
                while($("#text_view p").width() > $("#text_view").width()) {
                    console.log("Shrinking font based on container width.");
                    $("#text_view p").css("font-size", (parseInt($("#text_view p").css("font-size")) - 1));
                }

                while($("#text_view p").height() > $("#text_view").height()) {
                    console.log("Shrinking font based on container height.");
                    $("#text_view p").css("font-size", (parseInt($("#text_view p").css("font-size")) - 1));
                }
               
                var vcent_dist = ($("#text_view").height() - $("#text_view p").height()) / 2;
                var hcent_dist = ($("#text_view").width() - $("#text_view p").width()) / 2;
                $("#text_view p").css("top", vcent_dist + "px");
                $("#text_view p").css("left", hcent_dist + "px");

                console.log("Calculated a vertical distance of " + vcent_dist);
                console.log("Calculated a horizontal distance of " + hcent_dist);

                $("#text_view p").transition("slide right");

            }
        });

    }



}
