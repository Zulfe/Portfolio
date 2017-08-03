// The dimensions of the approach container. These are the dimensions that define how wide of a space
// is allotted for the arrows to fit inside of.
var APPROACH_WIDTH = $("#approach").width();
var APPROACH_HEIGHT = $("#approach").height();

// The height of each arrow. This should equal or close to the height of the approach container.
var ARROW_HEIGHT = APPROACH_HEIGHT;

// Variables for the storage of aspect ratios by image. These are currently incorrectly defined by
// AR = Height / Width
// It should be AR = Width / Height
var EXCLUSIVE_TURN_AR = 2.540677159;
var EXCLUSIVE_THROUGH_AR = 4.02541264;
var SHARED_THROUGH_LEFT_AR = 280 / 141.5;
var SHARED_THROUGH_RIGHT_AR = 280 / 141.5;
var SHARED_THROUGH_LEFT_RIGHT_AR = 280 / 213.438;
var SHARED_LEFT_RIGHT_AR = 280 / 213.438;
var CHANNELIZED_RIGHT_AR = 280 /110.208;

// Variable for the storage of the width of each type of image.
// The exclusive left and exclusive right arrow images are just mirrors of one another, so their width
// is the same and defined under EXCLUSIVE_TURN_ARROW_WIDTH
var EXCLUSIVE_TURN_ARROW_WIDTH = ARROW_HEIGHT *  (1 / EXCLUSIVE_TURN_AR);
var EXCLUSIVE_THROUGH_ARROW_WIDTH = ARROW_HEIGHT * (1 / EXCLUSIVE_THROUGH_AR);
var SHARED_THROUGH_LEFT_ARROW_WIDTH = ARROW_HEIGHT * (1 / SHARED_THROUGH_LEFT_AR);
var SHARED_THROUGH_RIGHT_ARROW_WIDTH = ARROW_HEIGHT * (1 / SHARED_THROUGH_RIGHT_AR);
var SHARED_THROUGH_LEFT_RIGHT_ARROW_WIDTH = ARROW_HEIGHT * (1 / SHARED_THROUGH_LEFT_RIGHT_AR);
var SHARED_LEFT_RIGHT_ARROW_WIDTH = ARROW_HEIGHT * (1 / SHARED_LEFT_RIGHT_AR);
var CHANNELIZED_RIGHT_ARROW_WIDTH = ARROW_HEIGHT * (1 / CHANNELIZED_RIGHT_AR);

// The negative margin turn arrows should have.
// This should only be applied to left turn arrows that are not the rightmost and
// right turn arrows that are not the leftmost.
var EXCLUSIVE_ARROW_INWARD_MARGIN = 0.1764 * EXCLUSIVE_TURN_ARROW_WIDTH;

// The scaling factor that all images should use upon creation or modification. This is vital in allowing
// all of the added arrows to fit inside the container.
var heightScale = 1.0;

// Counters for each type of image. This is needed in determining the width of the arrows alone for adjusting
// left, through, and right containers to be as snug as possible.
var NUM_EXCLUSIVE_LEFT = 0;
var NUM_EXCLUSIVE_RIGHT = 0;
var NUM_EXCLUSIVE_THROUGH = 0;
var NUM_SHARED_THROUGH_LEFT = 0;
var NUM_SHARED_THROUGH_RIGHT = 0;
var NUM_SHARED_THROUGH_LEFT_RIGHT = 0;
var NUM_SHARED_LEFT_RIGHT = 0;
var NUM_CHANNELIZED_RIGHT = 0;

// Counters for the total number of images for each group.
var NUM_ALL_LEFT = 0;
var NUM_ALL_THROUGH = 0;
var NUM_ALL_RIGHT = 0;

// Constants for the maximum number of allowed arrows for each group.
var MAX_LEFT = 3;
var MAX_THROUGH = 6;
var MAX_RIGHT = 3;

/**
 * Recompute the width variables for all images. This should be run whenever heightScale so that the right width values are used in future computations.
 */
var updateWidths = function() {
    EXCLUSIVE_TURN_ARROW_WIDTH = (ARROW_HEIGHT * heightScale) *  (1 / EXCLUSIVE_TURN_AR);
    EXCLUSIVE_THROUGH_ARROW_WIDTH = (ARROW_HEIGHT * heightScale) * (1 / EXCLUSIVE_THROUGH_AR);
    SHARED_THROUGH_LEFT_ARROW_WIDTH = (ARROW_HEIGHT * heightScale) * (1 / SHARED_THROUGH_LEFT_AR);
    SHARED_THROUGH_RIGHT_ARROW_WIDTH = (ARROW_HEIGHT * heightScale) * (1 / SHARED_THROUGH_RIGHT_AR);
    SHARED_THROUGH_LEFT_RIGHT_ARROW_WIDTH = (ARROW_HEIGHT * heightScale) * (1 / SHARED_THROUGH_LEFT_RIGHT_AR);
    SHARED_LEFT_RIGHT_ARROW_WIDTH = (ARROW_HEIGHT * heightScale) * (1 / SHARED_LEFT_RIGHT_AR);
    CHANNELIZED_RIGHT_ARROW_WIDTH = (ARROW_HEIGHT * heightScale) * (1 / CHANNELIZED_RIGHT_AR);
}

/**
 * Use the stored image widths, the number of each type of image, and a width that is to be added post-scaling to find the greatest scale down factor that allows
 * all of the existing elements and one future element of the given width to exist in the approach.
 * This may not be the most efficient method, but it makes sense and works quite well. Expect about twenty iterations per scaling.
 * Reasonably speaking, the inefficiency of this function should not impact the user experience.
 */
var scaleImages = function(add_width) {
    // Starting at 100% scale (of the current image dimensions), iterate down one percent at a time until all of the existing elements and the future element, when
    // multiplied by the current scale factor, are narrow enough to fit inside the approach container. Store this scale factor in heightScale for use in scaling all
    // existing images and allowing future images to be of the same size.
    for(var scaler = 1; scaler > 0; scaler = scaler - 0.01) {
        var contents_width = 
              // Width of the image if it was scaled by scaler            for however many times the image exists       minus any margins that reduce the effective width of the image
              (((ARROW_HEIGHT * scaler) / EXCLUSIVE_TURN_AR)            * (NUM_EXCLUSIVE_LEFT + NUM_EXCLUSIVE_RIGHT)) - (EXCLUSIVE_ARROW_INWARD_MARGIN * (NUM_EXCLUSIVE_LEFT + NUM_EXCLUSIVE_RIGHT - 2))
            + (((ARROW_HEIGHT * scaler) / EXCLUSIVE_THROUGH_AR)         * NUM_EXCLUSIVE_THROUGH)       // Exclusive Throughs; account for spacing when no throughs are present
            + (((ARROW_HEIGHT * scaler) / SHARED_THROUGH_LEFT_AR)       * NUM_SHARED_THROUGH_LEFT)   // Through-Left Shares
            + (((ARROW_HEIGHT * scaler) / SHARED_THROUGH_RIGHT_AR)      * NUM_SHARED_THROUGH_RIGHT) // Through-Right Shares
            + (((ARROW_HEIGHT * scaler) / SHARED_THROUGH_LEFT_RIGHT_AR) * NUM_SHARED_THROUGH_LEFT_RIGHT)
            + (((ARROW_HEIGHT * scaler) / SHARED_LEFT_RIGHT_AR)         * NUM_SHARED_LEFT_RIGHT)
            + (((ARROW_HEIGHT * scaler) / CHANNELIZED_RIGHT_AR)         * NUM_CHANNELIZED_RIGHT)
            + (((ARROW_HEIGHT * scaler) / EXCLUSIVE_THROUGH_AR)         * (NUM_ALL_THROUGH == 0 ? 1 : 0)) // account for exclusive-wide spacing when no throughs are present
            + 1 // left container add space
            + 1 // through container add space
            + 1 // right container add space
            + add_width; // scaling would be more optimized for maximum possible display size if this was also scaled by scaler, but this would require an AR to work off of, which
                         // means every call to scaleImages would need to be updated to pass AR's instead of widths
        
        if(contents_width < APPROACH_WIDTH)
        {
            heightScale = scaler;
            break;
        }
    }

    $(".arrow").css("height", (heightScale * ARROW_HEIGHT));
    updateWidths();


    $(".exclusive.left.arrow:not(:first-child)").css("margin-right", -1 * EXCLUSIVE_ARROW_INWARD_MARGIN);
    $(".exclusive.right.arrow:not(:first-child)").css("margin-left", -1 * EXCLUSIVE_ARROW_INWARD_MARGIN);

    adjustAllContainerWidths();
}

/**
 * Returns the total width of the three arrow containers. The containers are sealed around the arrows upon every update, so getting the width of all arrows
 * using the containers is accurate enough.
 */
var getTotalWidth = function() {
    return $(".left.container").width() + $(".through.container").width() + $(".right.container").width();
}

/**
 * Adjust the width of a given container using the number of elements inside of it and the width of each element.
 * This may not be necessary anymore, but it's been left in until further testing.
 */
var adjustContainerWidth = function(container, num_elems, elem_width) {
    $(container).css("width", (num_elems * elem_width));
}

/**
 *
 *
 *
 */
var adjustAllContainerWidths = function() {
    
    if(NUM_EXCLUSIVE_LEFT != 0)
        $(".left.container").css("width", (NUM_EXCLUSIVE_LEFT * EXCLUSIVE_TURN_ARROW_WIDTH) - ((NUM_EXCLUSIVE_LEFT - 1) * EXCLUSIVE_ARROW_INWARD_MARGIN) + 1);

    
    
    if((NUM_EXCLUSIVE_THROUGH + NUM_SHARED_THROUGH_LEFT + NUM_SHARED_THROUGH_RIGHT + NUM_SHARED_THROUGH_LEFT_RIGHT + NUM_SHARED_LEFT_RIGHT) != 0) {

        var through_width = (NUM_EXCLUSIVE_THROUGH * EXCLUSIVE_THROUGH_ARROW_WIDTH) +
                            (NUM_SHARED_THROUGH_LEFT * SHARED_THROUGH_LEFT_ARROW_WIDTH) +
                            (NUM_SHARED_THROUGH_RIGHT * SHARED_THROUGH_RIGHT_ARROW_WIDTH) +
                            (NUM_SHARED_THROUGH_LEFT_RIGHT * SHARED_THROUGH_LEFT_RIGHT_ARROW_WIDTH) +
                            (NUM_SHARED_LEFT_RIGHT * SHARED_LEFT_RIGHT_ARROW_WIDTH) +
                            1; //a little extra space

        $(".through.container").css("width", through_width);
    }
    else
        $(".through.container").css("width", EXCLUSIVE_THROUGH_ARROW_WIDTH);
    
    
    
    if(NUM_EXCLUSIVE_RIGHT + NUM_CHANNELIZED_RIGHT != 0) {
     
        var right_width = (NUM_EXCLUSIVE_RIGHT * EXCLUSIVE_TURN_ARROW_WIDTH) -
                          ((NUM_EXCLUSIVE_RIGHT + NUM_CHANNELIZED_RIGHT - 1) * EXCLUSIVE_ARROW_INWARD_MARGIN) + // if exclusive rights are present, factor in margins
                          (NUM_CHANNELIZED_RIGHT * CHANNELIZED_RIGHT_ARROW_WIDTH) +
                          1; //a little extra space

        
        $(".right.container").css("width", right_width);
    }

}


/**
 *
 *
 *
 *
 */
var clickLeft = function(type) {
    var _this = ".left.container";
    
    if(!isAdditionPermitted("left", type))
        return;

    if(type == "exclusive") {

    }

    if(getTotalWidth() + ((EXCLUSIVE_TURN_ARROW_WIDTH - EXCLUSIVE_ARROW_INWARD_MARGIN) + 1) > APPROACH_WIDTH) {
        scaleImages(EXCLUSIVE_TURN_ARROW_WIDTH);
        adjustContainerWidth(_this, NUM_EXCLUSIVE_LEFT + 1, EXCLUSIVE_TURN_ARROW_WIDTH);
        updateWidths();
    }
    else {
        $(_this).css("width", "+=" + ((EXCLUSIVE_TURN_ARROW_WIDTH - EXCLUSIVE_ARROW_INWARD_MARGIN) + 1));
    }
   $(_this).prepend("<img class='left exclusive arrow' style='height: " + (ARROW_HEIGHT * heightScale) + "px; margin-right: -" + EXCLUSIVE_ARROW_INWARD_MARGIN + "' src='assets/arrow_left.svg'>");
    
    $(".exclusive.left.arrow:not(:first-child)").css("margin-right", -1 * EXCLUSIVE_ARROW_INWARD_MARGIN);

    NUM_EXCLUSIVE_LEFT++;
    NUM_ALL_LEFT++;
    adjustAllContainerWidths();
}


/**
 * Handles error control for the addition of movement elements to the requested movement's corresponding group.
 * @param {string} group The movement group that the requested movement falls under (left, through, or right)
 * @param {string} type The type of movement being requested (exclusive, channelized, shared through left, shared through right, shared through left right, shared left right)
 * @returns {boolean} <tt>true</tt> if the addition is permitted; <tt>false</tt> if the addition is not permitted
 */
var isAdditionPermitted = function(group, type) {
    if (group == "left") {
        if(NUM_ALL_LEFT == MAX_LEFT)                return false;

        if(type == "exclusive") {
            // no rules
        }
    }


    else if(group == "through") {
        if(NUM_ALL_THROUGH == MAX_THROUGH)          return false

        if(type == "exclusive") {
            if(NUM_SHARED_THROUGH_LEFT_RIGHT > 0)   return false;
            if(NUM_SHARED_LEFT_RIGHT > 0)           return false;
        }
        else if(type == "shared through left") {
            if(NUM_SHARED_THROUGH_LEFT > 0)         return false;
            if(NUM_SHARED_THROUGH_LEFT_RIGHT > 0)   return false;
            if(NUM_SHARED_LEFT_RIGHT > 0)           return false;
        }
        else if(type == "shared through right") {
            if(NUM_SHARED_THROUGH_RIGHT > 0)        return false;
            if(NUM_SHARED_THROUGH_LEFT_RIGHT > 0)   return false;
            if(NUM_SHARED_LEFT_RIGHT > 0)           return false;
        } 
        else if(type == "shared through left right") {
            if(NUM_ALL_THROUGH > 0)                 return false;
        }
        else if(type == "shared left right") {
            if(NUM_ALL_THROUGH > 0)                 return false;
        }
        else                                        return false;
    }


    else if(group == "right") {
        if(NUM_ALL_RIGHT == MAX_RIGHT)              return false;

        if(type == "exclusive") {
            // no rules
        }
        else if(type == "channelized") {
            if(NUM_CHANNELIZED_RIGHT > 0)           return false;
        }
        else                                        return false;
    }

    return true;
}

/**
 * Handles the insertion of a new arrow image into the through group container. The <tt>container</tt> parameter seems unncessary considering the container
 * that HTML to which HTML will be added is known, but this function may be extended for the general case; furthermore, it may work better when multiple approaches
 * are present.
 * @param {string} type The type of movement to be added (exclusive, shared through left, shared through right, shared through left right, shared left right)
 * @param {string} container The reference form of the through container (".through.container")
 * @param {string} html_insert The HTML code for the image to be inserted
 */
var insertThrough = function(type, container, html_insert) {
    if(type == "exclusive") {
        if(NUM_SHARED_THROUGH_LEFT > 0)
            $(html_insert).insertAfter($(container).children().first());
        else if(NUM_SHARED_THROUGH_RIGHT > 0)
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
 * Handles the adding and scaling for all movements that fall under the through category.
 */
var clickThrough = function(type) {

    var _this = ".through.container";

    if(!isAdditionPermitted("through", type))
        return;

    var asset = "";
    var img_width = 0;
    var width_mod = 0;
    var num = 0;
    var html_class = "";
    if(type == "exclusive") {
        asset       = "assets/arrow_through.svg";
        img_width   = EXCLUSIVE_THROUGH_ARROW_WIDTH;
        width_mod   = 2;
        num         = NUM_EXCLUSIVE_THROUGH;
        html_class  = "exclusive through arrow";
    }
    else if(type == "shared through left") {
        asset       = "assets/arrow_shared_through_left.svg";
        img_width   = SHARED_THROUGH_LEFT_ARROW_WIDTH;
        width_mod   = 2;
        num         = NUM_SHARED_THROUGH_LEFT;
        html_class  = "shared through left arrow";
    }
    else if(type == "shared through right") {
        asset       = "assets/arrow_shared_through_right.svg";
        img_width   = SHARED_THROUGH_RIGHT_ARROW_WIDTH;
        width_mod   = 2;
        num         = NUM_SHARED_THROUGH_RIGHT;
        html_class  = "shared through right arrow";
    }
    else if(type == "shared through left right") {
        asset       = "assets/arrow_shared_through_left_right.svg";
        img_width   = SHARED_THROUGH_LEFT_RIGHT_ARROW_WIDTH;
        width_mod   = 2;
        num         = NUM_SHARED_THROUGH_LEFT_RIGHT;
        html_class  = "shared through right left arrow";
    }
    else if(type == "shared left right") {
        asset       = "assets/arrow_shared_left_right.svg";
        img_width   = SHARED_LEFT_RIGHT_ARROW_WIDTH;
        width_mod   = 2;
        num         = NUM_SHARED_LEFT_RIGHT;
        html_class  = "shared left right arrow";
    }

    if(getTotalWidth() + img_width + width_mod > APPROACH_WIDTH) {
        scaleImages(img_width + width_mod);
        adjustContainerWidth(_this, num + 1, img_width);
        updateWidths();
    } else adjustContainerWidth(_this, num + 1, img_width + width_mod);

    var html_insert = "<img class='" + html_class + "' style='height: " + (ARROW_HEIGHT * heightScale) + "px;' src='" + asset +"'>";

    insertThrough(type, _this, html_insert);

    if(type == "exclusive")                      NUM_EXCLUSIVE_THROUGH++;
    else if(type == "shared through left")       NUM_SHARED_THROUGH_LEFT++;
    else if(type == "shared through right")      NUM_SHARED_THROUGH_RIGHT++;
    else if(type == "shared through left right") NUM_SHARED_THROUGH_LEFT_RIGHT++;
    else if(type == "shared left right")         NUM_SHARED_LEFT_RIGHT++;
    
    NUM_ALL_THROUGH++;
    adjustAllContainerWidths();
}

var insertRight = function(type, container, html_insert) {
    if(type == "exclusive") {
        $(container).append(html_insert);
    }
    else if(type == "channelized") {
        if(NUM_EXCLUSIVE_RIGHT > 0)
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
var clickRight = function(type) {
    var _this = ".right.container";

     if(!isAdditionPermitted("right", type))
        return;

    var asset = "";
    var img_width = 0;
    var width_mod = 0;
    var num = 0;
    var html_class = "";
    if(type == "exclusive") {
        asset       = "assets/arrow_right.svg";
        img_width   = EXCLUSIVE_TURN_ARROW_WIDTH;
        width_mod   = -(EXCLUSIVE_ARROW_INWARD_MARGIN);
        num         = NUM_EXCLUSIVE_RIGHT;
        html_class  = "exclusive right arrow";
    }
    else if(type == "channelized") {
        asset       = "assets/arrow_right_chan.svg";
        img_width   = CHANNELIZED_RIGHT_ARROW_WIDTH;
        width_mod   = 0;
        num         = NUM_CHANNELIZED_RIGHT;
        html_class  = "channelized exclusive right arrow";
    }

    if(getTotalWidth() + img_width + width_mod > APPROACH_WIDTH) {
        scaleImages(img_width + width_mod);
        adjustContainerWidth(_this, num + 1, img_width);
        updateWidths();
    } else adjustContainerWidth(_this, num + 1, img_width + width_mod);

    var html_insert = "<img class='" + html_class + "' style='height: " + (ARROW_HEIGHT * heightScale) + "px;' src='" + asset +"'>";

    insertRight(type, _this, html_insert);

    if(type == "exclusive")         NUM_EXCLUSIVE_RIGHT++;
    else if(type == "channelized")  NUM_CHANNELIZED_RIGHT++;
    
    NUM_ALL_RIGHT++;
    adjustAllContainerWidths();

    $(".exclusive.right.arrow:not(:first-child)").css("margin-left", -1 * EXCLUSIVE_ARROW_INWARD_MARGIN);
}

var arrows = [
    {
        name: "Left",
        fun: function(data, event) { clickLeft(); }
    },
    {
        name: "Through",
        fun: function() { clickThrough(); }
    },
    {
        name: "Right",
        fun: function() { clickRight(); }
    }
];

$("#approach").contextMenu(arrows, {
    "triggerOn" : "click",
    "mouseClick" : "right",
    "centerAround" : "cursor"
});

$(window).keypress(function(event) {
    console.log(event.which);
    if(event.which == 108)
        clickLeft("exclusive");
    else if(event.which == 114)
        clickRight("exclusive");
    else if(event.which == 116)
        clickThrough("exclusive");
    else if(event.which == 113)
        clickThrough("shared through left");
    else if(event.which == 112)
        clickThrough("shared through right");
    else if(event.which == 99)
        clickRight("channelized");
    else if(event.which == 97)
        clickThrough("shared through left right");
    else if(event.which == 100)
        clickThrough("shared left right");
});
