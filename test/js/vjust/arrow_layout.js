/**
 * 
 * @author Damon A. Shaw of Virginia Department of Transportation (Damon.Shaw@vdot.virginia.gov || admins@vt.edu)
 */

class ArrowLayout {
    constructor(container, UID) {
        this._UID = UID;
        this._approach_container = container;

        // The dimensions of the approach container. These are the dimensions that define how wide of a space
        // is allotted for the arrows to fit inside of.
        this._APPROACH_WIDTH = $(container).width();
        this._APPROACH_HEIGHT = $(container).height();

        // The height of each arrow. This should equal or close to the height of the approach container.
        this._ARROW_HEIGHT = this._APPROACH_HEIGHT;

        // Variables for the storage of aspect ratios by image. These are currently incorrectly defined by
        // AR = Height / Width
        // It should be AR = Width / Height
        this._EXCLUSIVE_TURN_AR            = 2.540677159;
        this._EXCLUSIVE_THROUGH_AR         = 4.02541264;
        this._SHARED_THROUGH_LEFT_AR       = 280 / 141.5;
        this._SHARED_THROUGH_RIGHT_AR      = 280 / 141.5;
        this._SHARED_THROUGH_LEFT_RIGHT_AR = 280 / 213.438;
        this._SHARED_LEFT_RIGHT_AR         = 280 / 213.438;
        this._CHANNELIZED_RIGHT_AR         = 280 / 110.208;

        // Variable for the storage of the width of each type of image.
        // The exclusive left and exclusive right arrow images are just mirrors of one another, so their width
        // is the same and defined under this._EXCLUSIVE_TURN_ARROW_WIDTH
        this._EXCLUSIVE_TURN_ARROW_WIDTH            = this._ARROW_HEIGHT * (1 / this._EXCLUSIVE_TURN_AR);
        this._EXCLUSIVE_THROUGH_ARROW_WIDTH         = this._ARROW_HEIGHT * (1 / this._EXCLUSIVE_THROUGH_AR);
        this._SHARED_THROUGH_LEFT_ARROW_WIDTH       = this._ARROW_HEIGHT * (1 / this._SHARED_THROUGH_LEFT_AR);
        this._SHARED_THROUGH_RIGHT_ARROW_WIDTH      = this._ARROW_HEIGHT * (1 / this._SHARED_THROUGH_RIGHT_AR);
        this._SHARED_THROUGH_LEFT_RIGHT_ARROW_WIDTH = this._ARROW_HEIGHT * (1 / this._SHARED_THROUGH_LEFT_RIGHT_AR);
        this._SHARED_LEFT_RIGHT_ARROW_WIDTH         = this._ARROW_HEIGHT * (1 / this._SHARED_LEFT_RIGHT_AR);
        this._CHANNELIZED_RIGHT_ARROW_WIDTH         = this._ARROW_HEIGHT * (1 / this._CHANNELIZED_RIGHT_AR);

        // The negative margin turn arrows should have.
        // This should only be applied to left turn arrows that are not the rightmost and
        // right turn arrows that are not the leftmost.
        this._EXCLUSIVE_ARROW_INWARD_MARGIN = 0.1764 * this._EXCLUSIVE_TURN_ARROW_WIDTH;

        // The scaling factor that all images should use upon creation or modification. This is vital in allowing
        // all of the added arrows to fit inside the container.
        this._height_scale = 1.0;

        // Counters for each type of image. This is needed in determining the width of the arrows alone for adjusting
        // left, through, and right containers to be as snug as possible.
        this._NUM_EXCLUSIVE_LEFT                  = 0;
        this._NUM_EXCLUSIVE_RIGHT                 = 0;
        this._NUM_EXCLUSIVE_THROUGH               = 0;
        this._NUM_SHARED_THROUGH_LEFT             = 0;
        this._NUM_SHARED_THROUGH_RIGHT            = 0;
        this._NUM_SHARED_THROUGH_LEFT_RIGHT       = 0;
        this._NUM_SHARED_LEFT_RIGHT               = 0;
        this._NUM_CHANNELIZED_RIGHT               = 0;

        // Counters for the total number of images for each group.
        this._NUM_ALL_LEFT    = 0;
        this._NUM_ALL_THROUGH = 0;
        this._NUM_ALL_RIGHT   = 0;

        // Constants for the maximum number of allowed arrows for each group.
        this._MAX_LEFT    = 3;
        this._MAX_THROUGH = 6;
        this._MAX_RIGHT   = 3;

        this.createApproach();
    }

    /**
     * Creates the HTML elements for the approach container, the left, through, and right containers, and proper CSS styling. Appends the code
     * to the container passed at instantiation. Creates a context menu for the approach allowing selection of movement types.
     */
    createApproach() {
        var style =
        "#" + this._UID + " * {                     "+
        "    user-select: none;                     "+
        "}                                          "+
        "#" + this._UID + " .center.wrapper {       "+
        "    display: table;                        "+
        "    float: right;                          "+
        "    height: inherit;                       "+
        "}                                          "+
        "#" + this._UID + " {                       "+
        "    height: 100%;                          "+
        "    width: 100%;                           "+
        "    margin: auto;                          "+
        "}                                          "+
        "#" + this._UID + " .container {            "+
        "    height: inherit;                       "+
        "    display: inline-block;                 "+
        "    float: left;                           "+
        "    text-align: center;                    "+
        "}                                          "+
        "#" + this._UID + " .container.left {       "+
        "    margin-right: 0px;                     "+
        "}                                          "+
        "#" + this._UID + " .container:hover {      "+
        "    filter: contrast(0.9);                 "+
        "}                                          "+
        "#" + this._UID + " .container.through {    "+
        "    margin-left: 0px;                      "+
        "    margin-right: 0px;                     "+
        "}                                          "+
        "#" + this._UID + " .container.right {      "+
        "    margin-left: 0px;                      "+
        "    float: left;                           "+
        "}                                          "+
        "#" + this._UID + " .arrow {                "+
        "    width: auto;                           "+
        "}                                          "+
        "#" + this._UID + " .left.exclusive.arrow { "+
        "    float: right;                          "+
        "}                                          ";

        $(this._approach_container).append("<style>" + style + "</style>");
        
        $(this._approach_container).append("<div id='" + this._UID + "'>" +
                                              "<div class='center wrapper'>" +
                                                 "<div class='left container'></div>" +
                                                 "<div class='through container'></div>" +
                                                 "<div class='right container'></div>" +
                                              "</div>" +
                                           "</div>");

        var _this = this;
        var menu_config = [
            {
                name: "Left",
                subMenu: [
                {
                    name: "Exclusive",
                    fun: function() { _this.clickLeft("exclusive"); }
                }]
            },
            {
                name: "Through",
                subMenu: [
                {
                    name: "Exclusive",
                    fun: function() { _this.clickThrough("exclusive"); }
                },
                {
                    name: "Shared Through Left",
                    fun: function() { _this.clickThrough("shared through left"); }
                },
                {
                    name: "Shared Through Right",
                    fun: function() { _this.clickThrough("shared through right"); }
                },
                {
                    name: "Shared Through Left Right",
                    fun: function() { _this.clickThrough("shared through left right"); }
                },
                {
                    name: "Shared Left Right",
                    fun: function() { _this.clickThrough("shared left right"); }
                }
                ]
            },
            {
                name: "Right",
                subMenu: [
                {
                    name: "Exclusive",
                    fun: function() { _this.clickRight("exclusive"); }
                },
                {
                    name: "Channelized",
                    fun: function() { _this.clickRight("channelized"); }
                }
                ]
            },
        ];

        $("#" + this._UID).contextMenu(menu_config, {
            "triggerOn"    : "click",
            "mouseClick"   : "right",
            "centerAround" : "cursor"
        });
    }

    /**
     * Returns the total width of the three arrow containers. The containers are sealed around the arrows upon every update, so getting the
     * width of all arrows using the containers is accurate enough.
     */
    getTotalWidth() {
        return $("#" + this._UID + " .left.container").width() + $("#" + this._UID + " .through.container").width() + $("#" + this._UID + " .right.container").width();
    }

    /**
     * 
     *
     */
    isAdditionPermitted(group, type) {
        if (group == "left") {
            if(this._NUM_ALL_LEFT == this._MAX_LEFT)                return false;

            if(type == "exclusive") {
                // no rules
            }
        }

        else if(group == "through") {
            if(this._NUM_ALL_THROUGH == this._MAX_THROUGH)          return false

            if(type == "exclusive") {
                if(this._NUM_SHARED_THROUGH_LEFT_RIGHT > 0)         return false;
                if(this._NUM_SHARED_LEFT_RIGHT > 0)                 return false;
            }
            else if(type == "shared through left") {
                if(this._NUM_SHARED_THROUGH_LEFT > 0)               return false;
                if(this._NUM_SHARED_THROUGH_LEFT_RIGHT > 0)         return false;
                if(this._NUM_SHARED_LEFT_RIGHT > 0)                 return false;
            }
            else if(type == "shared through right") {
                if(this._NUM_SHARED_THROUGH_RIGHT > 0)              return false;
                if(this._NUM_SHARED_THROUGH_LEFT_RIGHT > 0)         return false;
                if(this._NUM_SHARED_LEFT_RIGHT > 0)                 return false;
            } 
            else if(type == "shared through left right") {
                if(this._NUM_ALL_THROUGH > 0)                       return false;
            }
            else if(type == "shared left right") {
                if(this._NUM_ALL_THROUGH > 0)                       return false;
            }
            else                                                    return false;
        }

        else if(group == "right") {
            if(this._NUM_ALL_RIGHT == this._MAX_RIGHT)              return false;

            if(type == "exclusive") {
                // no rules
            }
            else if(type == "channelized") {
                if(this._NUM_CHANNELIZED_RIGHT > 0)                 return false;
            }
            else                                                    return false;
        }
        else                                                        return false;

        return true;
    }
   
    /**
     * Adjust the width of a given container using the number of elements inside of it and the width of each element.
     * This may not be necessary anymore, but it's been left in until further testing.
     *
     */
    adjustContainerWidth(container, num_elems, elem_width) {
        $(container).css("width", (num_elems * elem_width));
    }

    /**
     *
     *
     */
    adjustAllContainerWidths() {
        if(this._NUM_EXCLUSIVE_LEFT != 0)
            $("#" + this._UID + " .left.container").css("width", (this._NUM_EXCLUSIVE_LEFT * this._EXCLUSIVE_TURN_ARROW_WIDTH) - ((this._NUM_EXCLUSIVE_LEFT - 1) * this._EXCLUSIVE_ARROW_INWARD_MARGIN) + 1);

        
        if((this._NUM_EXCLUSIVE_THROUGH + this._NUM_SHARED_THROUGH_LEFT + this._NUM_SHARED_THROUGH_RIGHT + this._NUM_SHARED_THROUGH_LEFT_RIGHT + this._NUM_SHARED_LEFT_RIGHT) != 0) {

            var through_width = (this._NUM_EXCLUSIVE_THROUGH * this._EXCLUSIVE_THROUGH_ARROW_WIDTH) +
                                (this._NUM_SHARED_THROUGH_LEFT * this._SHARED_THROUGH_LEFT_ARROW_WIDTH) +
                                (this._NUM_SHARED_THROUGH_RIGHT * this._SHARED_THROUGH_RIGHT_ARROW_WIDTH) +
                                (this._NUM_SHARED_THROUGH_LEFT_RIGHT * this._SHARED_THROUGH_LEFT_RIGHT_ARROW_WIDTH) +
                                (this._NUM_SHARED_LEFT_RIGHT * this._SHARED_LEFT_RIGHT_ARROW_WIDTH) +
                                1; //a little extra space

            $("#" + this._UID + " .through.container").css("width", through_width);
        }
        else
            $("#" + this._UID + " .through.container").css("width", this._EXCLUSIVE_THROUGH_ARROW_WIDTH);
        
        
        if(this._NUM_EXCLUSIVE_RIGHT + this._NUM_CHANNELIZED_RIGHT != 0) {
         
            var right_width = (this._NUM_EXCLUSIVE_RIGHT * this._EXCLUSIVE_TURN_ARROW_WIDTH) -
                              ((this._NUM_EXCLUSIVE_RIGHT + this._NUM_CHANNELIZED_RIGHT - 1) * this._EXCLUSIVE_ARROW_INWARD_MARGIN) + // if exclusive rights are present, factor in margins
                              (this._NUM_CHANNELIZED_RIGHT * this._CHANNELIZED_RIGHT_ARROW_WIDTH) +
                              1; //a little extra space

            
            $("#" + this._UID + " .right.container").css("width", right_width);
        }
    }

    /**
     *
     *
     */
    scaleImages(add_ar, group) {
        console.log("[SCALING] Detected ", this._NUM_EXCLUSIVE_LEFT, " lefts, ", this._NUM_EXCLUSIVE_RIGHT, " rights, ", this._NUM_EXCLUSIVE_THROUGH, " throughs, ",
                    this._NUM_SHARED_THROUGH_LEFT, " through-lefts, ", this._NUM_SHARED_THROUGH_RIGHT, " through-rights ", this._NUM_SHARED_THROUGH_LEFT_RIGHT, " through-left-rights, ",
                    this._NUM_SHARED_LEFT_RIGHT, " left-rights, ", this._NUM_CHANNELIZED_RIGHT, " channelized rights.");
        // Starting at 100% scale (of the current image dimensions), iterate down one percent at a time until all of the existing elements and the future element, when
        // multiplied by the current scale factor, are narrow enough to fit inside the approach container. Store this scale factor in this._height_scale for use in scaling all
        // existing images and allowing future images to be of the same size.
        for(var scaler = 1; scaler > 0; scaler = scaler - 0.01) {
            var contents_width = 
                  // Width of the image if it was scaled by scaler            for however many times the image exists       minus any margins that reduce the effective width of the image
                  (((this._ARROW_HEIGHT * scaler) / this._EXCLUSIVE_TURN_AR)            * (this._NUM_EXCLUSIVE_LEFT + this._NUM_EXCLUSIVE_RIGHT))
                - ((((this._ARROW_HEIGHT * scaler) / this._EXCLUSIVE_TURN_AR)           * 0.1764) * (this._NUM_EXCLUSIVE_LEFT + this._NUM_EXCLUSIVE_RIGHT - 2))
                + (((this._ARROW_HEIGHT * scaler) / this._EXCLUSIVE_THROUGH_AR)         * this._NUM_EXCLUSIVE_THROUGH)       // Exclusive Throughs; account for spacing when no throughs are present
                + (((this._ARROW_HEIGHT * scaler) / this._SHARED_THROUGH_LEFT_AR)       * this._NUM_SHARED_THROUGH_LEFT)   // Through-Left Shares
                + (((this._ARROW_HEIGHT * scaler) / this._SHARED_THROUGH_RIGHT_AR)      * this._NUM_SHARED_THROUGH_RIGHT) // Through-Right Shares
                + (((this._ARROW_HEIGHT * scaler) / this._SHARED_THROUGH_LEFT_RIGHT_AR) * this._NUM_SHARED_THROUGH_LEFT_RIGHT)
                + (((this._ARROW_HEIGHT * scaler) / this._SHARED_LEFT_RIGHT_AR)         * this._NUM_SHARED_LEFT_RIGHT)
                + (((this._ARROW_HEIGHT * scaler) / this._CHANNELIZED_RIGHT_AR)         * this._NUM_CHANNELIZED_RIGHT)
                + (((this._ARROW_HEIGHT * scaler) / this._EXCLUSIVE_THROUGH_AR)         * (this._NUM_ALL_THROUGH == 0 && group != "through" ? 1 : 0)) // account for exclusive-wide spacing when no throughs are present
                + 1 // left container add space
                + 1 // through container add space
                + 1 // right container add space
                + ((this._ARROW_HEIGHT * scaler) / add_ar); // scaling would be more optimized for maximum possible display size if this was also scaled by scaler, but this would require an AR to work off of, which
                             // means every call to scaleImages would need to be updated to pass AR's instead of widths
            
            console.log("[SCALING] Contents width is", contents_width);
            if(contents_width < this._APPROACH_WIDTH)
            {
                this._height_scale = scaler;
                break;
            }
        }
        
        $("#" + this._UID + " .arrow").css("height", (this._height_scale * this._ARROW_HEIGHT));
        this.updateWidths();

        console.log("[SCALING] Exclusive arrow inward margin is now", this._EXCLUSIVE_ARROW_INWARD_MARGIN);
        $("#" + this._UID + " .exclusive.left.arrow:not(:first-child)").css("margin-right", -1 * this._EXCLUSIVE_ARROW_INWARD_MARGIN);
        $("#" + this._UID + " .exclusive.right.arrow:not(:first-child)").css("margin-left", -1 * this._EXCLUSIVE_ARROW_INWARD_MARGIN);

        this.adjustAllContainerWidths();
    }

    updateWidths() {
        this._EXCLUSIVE_TURN_ARROW_WIDTH            = (this._ARROW_HEIGHT * this._height_scale) * (1 / this._EXCLUSIVE_TURN_AR);
        this._EXCLUSIVE_THROUGH_ARROW_WIDTH         = (this._ARROW_HEIGHT * this._height_scale) * (1 / this._EXCLUSIVE_THROUGH_AR);
        this._SHARED_THROUGH_LEFT_ARROW_WIDTH       = (this._ARROW_HEIGHT * this._height_scale) * (1 / this._SHARED_THROUGH_LEFT_AR);
        this._SHARED_THROUGH_RIGHT_ARROW_WIDTH      = (this._ARROW_HEIGHT * this._height_scale) * (1 / this._SHARED_THROUGH_RIGHT_AR);
        this._SHARED_THROUGH_LEFT_RIGHT_ARROW_WIDTH = (this._ARROW_HEIGHT * this._height_scale) * (1 / this._SHARED_THROUGH_LEFT_RIGHT_AR);
        this._SHARED_LEFT_RIGHT_ARROW_WIDTH         = (this._ARROW_HEIGHT * this._height_scale) * (1 / this._SHARED_LEFT_RIGHT_AR);
        this._CHANNELIZED_RIGHT_ARROW_WIDTH         = (this._ARROW_HEIGHT * this._height_scale) * (1 / this._CHANNELIZED_RIGHT_AR);

        this._EXCLUSIVE_ARROW_INWARD_MARGIN         = 0.1764 * this._EXCLUSIVE_TURN_ARROW_WIDTH;
    }

    /********************************************************/
    /*                     LEFT                             */
    /********************************************************/

    clickLeft(type) {
        console.log("Clicking left!");

        var _this = "#" + this._UID + " .left.container";
        
        if(!this.isAdditionPermitted("left", type))
            return;

        if(this.getTotalWidth() + ((this._EXCLUSIVE_TURN_ARROW_WIDTH - this._EXCLUSIVE_ARROW_INWARD_MARGIN) + 1) > this._APPROACH_WIDTH) {
            this.scaleImages(this._EXCLUSIVE_TURN_AR, "left");
            this.adjustContainerWidth(_this, this._NUM_EXCLUSIVE_LEFT + 1, this._EXCLUSIVE_TURN_ARROW_WIDTH);
            this.updateWidths();
        }
        else {
            $(_this).css("width", "+=" + ((this._EXCLUSIVE_TURN_ARROW_WIDTH - this._EXCLUSIVE_ARROW_INWARD_MARGIN) + 1));
        }
       $(_this).prepend("<img class='left exclusive arrow' style='height: " + (this._ARROW_HEIGHT * this._height_scale) + "px; margin-right: -" + this._EXCLUSIVE_ARROW_INWARD_MARGIN + "px' src='assets/arrows/arrow_left.svg'>");
        
        $("#" + this._UID + " .exclusive.left.arrow:not(:first-child)").css("margin-right", (-1 * this._EXCLUSIVE_ARROW_INWARD_MARGIN) + "px");
        $("#" + this._UID + " .exclusive.left.arrow:first-child").css("margin-right", "0px");

        this._NUM_EXCLUSIVE_LEFT++;
        this._NUM_ALL_LEFT++;
        this.adjustAllContainerWidths();
    }

    /********************************************************/
    /*                  THROUGH                             */
    /********************************************************/

    /**
     * Handles the insertion of a new arrow image into the through group container. The <tt>container</tt> parameter seems unnecessary
     * considering the container to which HTML is added is known, but this function may be extended for the general case; furthermore,
     * it may work better when multiple approaches are present.
     * @param {string} type The type of movement to be added (exclusive, shared through left, shared through right, sahred through left right, shared left right)
     * @param {string} container The reference form of the through container (".through.container")
     * @param {string} html_insert The HTML code for the image to be inserted
     */
    insertThrough(type, container, html_insert) {
        if(type == "exclusive") {
            if(this._NUM_SHARED_THROUGH_LEFT > 0)
                $(html_insert).insertAfter($(container).children().first());
            else if(this._NUM_SHARED_THROUGH_RIGHT > 0)
                $(html_insert).insertBefore($(container).children().last());
            else
                $(container).append(html_insert);
        }
        else if(type == "shared through left") {
            $(container).prepend(html_insert);
        }
        else if(type == "shared through right") {
            $(container).append(html_insert);
        }
        else if(type == "shared through left right") {
            $(container).prepend(html_insert);
        }
        else if(type == "shared left right") {
            $(container).prepend(html_insert);
        }
    }

    /**
     * Handles the addition of arrows from the through group to the through container.
     * @param {string} type The type of through arrow to be added (exclusive, shared through left, shared through right, shared through left right, shared left right)
     */
    clickThrough(type) {
        // Define this, our object of focus, to be the through container for this unique approach
        var _this = "#" + this._UID + " .through.container";

        // If the addition of a through arrow of the passed type isn't allowed, return now to avoid
        // unnecessary computation. Because of how isAdditionPermitted is written, this will also check
        // to make sure a valid through type has been submitted; in the case that an unknown through type
        // has been passed, isAdditionPermitted will return false.
        if(!this.isAdditionPermitted("through", type))
            return;

        // Instantiate and define the necessary information for the passed type.

        // The path to the type's SVG image.
        var asset = "";
        // The width of the arrow being added.
        var img_width = 0;
        // An arbitrary value that is tuned in the backend to mitigate display issues in the through container.
        var width_mod = 0;
        var add_ar = 0;
        // The number of occurences of the type of through movement to be drawn.
        var num = 0;
        // The class(es) to which the through movement should be added (for later addressing)
        var html_class = "";
        if(type == "exclusive") {
            asset       = "assets/arrows/arrow_through.svg";
            img_width   = this._EXCLUSIVE_THROUGH_ARROW_WIDTH;
            width_mod   = 2;
            add_ar      = this._EXCLUSIVE_THROUGH_AR;
            num         = this._NUM_EXCLUSIVE_THROUGH;
            html_class  = "exclusive through arrow";
        }
        else if(type == "shared through left") {
            asset       = "assets/arrows/arrow_shared_through_left.svg";
            img_width   = this._SHARED_THROUGH_LEFT_ARROW_WIDTH;
            width_mod   = 2;
            add_ar      = this._SHARED_THROUGH_LEFT_AR;
            num         = this._NUM_SHARED_THROUGH_LEFT;
            html_class  = "shared through left arrow";
        }
        else if(type == "shared through right") {
            asset       = "assets/arrows/arrow_shared_through_right.svg";
            img_width   = this._SHARED_THROUGH_RIGHT_ARROW_WIDTH;
            width_mod   = 2;
            add_ar      = this._SHARED_THROUGH_RIGHT_AR;
            num         = this._NUM_SHARED_THROUGH_RIGHT;
            html_class  = "shared through right arrow";
        }
        else if(type == "shared through left right") {
            asset       = "assets/arrows/arrow_shared_through_left_right.svg";
            img_width   = this._SHARED_THROUGH_LEFT_RIGHT_ARROW_WIDTH;
            width_mod   = 2;
            add_ar      = this._SHARED_THROUGH_LEFT_RIGHT_AR;
            num         = this._NUM_SHARED_THROUGH_LEFT_RIGHT;
            html_class  = "shared through right left arrow";
        }
        else if(type == "shared left right") {
            asset       = "assets/arrows/arrow_shared_left_right.svg";
            img_width   = this._SHARED_LEFT_RIGHT_ARROW_WIDTH;
            width_mod   = 2;
            add_ar      = this._SHARED_LEFT_RIGHT_AR;
            num         = this._NUM_SHARED_LEFT_RIGHT;
            html_class  = "shared left right arrow";
        }

        // If the addition of this movement makes the combined width of all arrows (including this hypothetical arrow)
        // greater than the alloted width of the approach container...
        if(this.getTotalWidth() + img_width + width_mod > this._APPROACH_WIDTH) {
            // scale down the size of all existing images and modify the image scale factor for all future images.
            this.scaleImages(add_ar, "through");
            // Adjust the container width to accomodate a new through arrow of this type.
            this.adjustContainerWidth(_this, num + 1, img_width);
            // Update the widths of all arrows using the newly modified scale factor.
            this.updateWidths();
        }
        // otherwise allocate enough space in the container for a new through movement of the passed type. 
        else this.adjustContainerWidth(_this, num + 1, img_width + width_mod);

        // Define the HTML code to be added to the container using the asset and class information defined above.
        var html_insert = "<img class='" + html_class + "' style='height: " + (this._ARROW_HEIGHT * this._height_scale) + "px;' src='" + asset +"'>";

        // Insert this HTML code into the through container based on a rule set of existing movements.
        this.insertThrough(type, _this, html_insert);

        // Increment by one the known number of existing movements of the type passed.
        if(type == "exclusive")                      this._NUM_EXCLUSIVE_THROUGH++;
        else if(type == "shared through left")       this._NUM_SHARED_THROUGH_LEFT++;
        else if(type == "shared through right")      this._NUM_SHARED_THROUGH_RIGHT++;
        else if(type == "shared through left right") this._NUM_SHARED_THROUGH_LEFT_RIGHT++;
        else if(type == "shared left right")         this._NUM_SHARED_LEFT_RIGHT++;
        // Increement by one the known number of all through movements.
        this._NUM_ALL_THROUGH++;

        // Fit all of the containers snuggly around the content inside of them.
        this.adjustAllContainerWidths();
    }

    /********************************************************/
    /*                      RIGHT                           */
    /********************************************************/

    /**
     * Handles the addition of a right turn to the right turn container based on its existing contents.
     */
    insertRight(type, container, html_insert) {
        if(type == "exclusive") {
            $(container).append(html_insert);
        }
        else if(type == "channelized") {
            if(this._NUM_EXCLUSIVE_RIGHT > 0)
                $(html_insert).insertBefore($(container).children().first());
            else
                $(container).prepend(html_insert);
        }
    }

    /**
     *
     *
     *
     */
    clickRight(type) {
        var _this = "#" + this._UID + " .right.container";

         if(!this.isAdditionPermitted("right", type))
            return;

        var asset = "";
        var img_width = 0;
        var width_mod = 0;
        var add_ar = 0;
        var num = 0;
        var html_class = "";
        if(type == "exclusive") {
            asset       = "assets/arrows/arrow_right.svg";
            img_width   = this._EXCLUSIVE_TURN_ARROW_WIDTH;
            width_mod   = -(this._EXCLUSIVE_ARROW_INWARD_MARGIN);
            add_ar      = this._EXCLUSIVE_TURN_AR;
            num         = this._NUM_EXCLUSIVE_RIGHT;
            html_class  = "exclusive right arrow";
        }
        else if(type == "channelized") {
            asset       = "assets/arrows/arrow_right_chan.svg";
            img_width   = this._CHANNELIZED_RIGHT_ARROW_WIDTH;
            width_mod   = 0;
            add_ar      = this._CHANNELIZED_RIGHT_AR;
            num         = this._NUM_CHANNELIZED_RIGHT;
            html_class  = "channelized exclusive right arrow";
        }

        if(this.getTotalWidth() + img_width + width_mod > this._APPROACH_WIDTH) {
            this.scaleImages(add_ar, "right");
            this.adjustContainerWidth(_this, num + 1, img_width);
            this.updateWidths();
        } else this.adjustContainerWidth(_this, num + 1, img_width + width_mod);

        var html_insert = "<img class='" + html_class + "' style='height: " + (this._ARROW_HEIGHT * this._height_scale) + "px;' src='" + asset +"'>";

        this.insertRight(type, _this, html_insert);

        if(type == "exclusive")         this._NUM_EXCLUSIVE_RIGHT++;
        else if(type == "channelized")  this._NUM_CHANNELIZED_RIGHT++;
        
        this._NUM_ALL_RIGHT++;
        this.adjustAllContainerWidths();

        $("#" + this._UID + " .exclusive.right.arrow:not(:first-child)").css("margin-left", -1 * this._EXCLUSIVE_ARROW_INWARD_MARGIN);
    }








}
