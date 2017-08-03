console.log($("#snippet").offset().top - $("#image").offset().top);

var imageAR = $("#image").width() / $("#image").height();

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var data = "";
$("#image").mousemove(function(event) {

    $("#snippet").css("top", event.pageY);
    $("#snippet").css("left", event.pageX);
    
    var x_offset = $("#snippet").offset().left - $("#image").offset().left - 1;
    var y_offset = $("#snippet").offset().top - $("#image").offset().top - 1;
    $("#viewer").css("background-position", "-" + (x_offset * 6) + "px -" + (y_offset * 6) + "px");

    var img =  new Image();

    img.onload = function() {
        ctx.drawImage(img, 0, 0, 100, 100);
    }
    img.src = "http://upload.wikimedia.org/wikipedia/commons/d/d2/Svg_example_square.svg";
    
});
