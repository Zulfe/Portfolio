
//////////////////////////////////////////////////////
// [BEGIN] ////////// [FUNCTIONS] ////////////////////
//////////////////////////////////////////////////////

// @function  toggleFirstVisitInputModals(boolean)
// @purpose   Given a boolean value, enable or disable forced display of input modals
//            when the user clicks the associated input box.
// @param toggleSwitch A boolean value
var toggleFirstVisitInputModals = function(toggleSwitch){
    if(toggleSwitch){
        $("#projNameInput").click(function(){
            $("#projNameHelp").modal("show");
            $(this).unbind();
            $("#projNameHelp.button").click(function(){$("#projNameInput").focus()});
        }); 
        $("#interNameInput").click(function(){
            $("#interNameHelp").modal("show");
            $(this).unbind();
        });
        $("#nsRouteNameInput").click(function(){
            $("#nsRouteNameHelp").modal("show");
            $(this).unbind();
        });
        $("#ewRouteNameInput").click(function(){
            $("#ewRouteNameHelp").modal("show");
            $(this).unbind();
        });
        $("#cpOneNameInput").click(function(){
            $("#cpOneNameHelp").modal("show");
            $(this).unbind();
        });
    }
    else{
        $("#projNameInput, #interNameInput, #nsRouteNameInput, #ewRouteNameInput, #cpOneNameInput").unbind();
    }
};

// @function getImageData(String)
// @purpose Given a string representing the URL of the image, get and return the image's
//          data.
// @param URL A string representing the location of the image.
var getImageData = function(URL){
    var image = new Image();
    image.crossOrigin = "Anonymous";

    var canvas = document.createElement("canvas");
    var canvasContext = canvas.getContext("2d");

    image.src = URL;

    canvas.width = image.width;
    canvas.height = image.height;

    canvasContext.drawImage(image, 0, 0, image.width, image.height);

    return canvas.toDataURL();
};

// @function acquireResources
// @purpose  Acquire all necessary resources, as defined by the programmer, and store them
//          categorically in the resource object.
var acquireResources = function(){

    var def = $.Deferred();

    resources["images_intersection"].push(getImageData("http://i.imgur.com/KUuRtTc.jpg"));
  
    if(testMode)
        setTimeout(function(){
            console.log("Acquiring resources...");
            def.resolve();
        }, 3000);
    else
        def.resolve();

    return $.when(def).done(function(){
        console.log("Done loading resources!");
    }).promise();
}

// @function killLoader
// @purpose  Fade out the loading screen and wait for a short period to avoid clipping of
//           content elements over the partially faded loading screen.
var killLoader = function(){
    var def = $.Deferred();

    $("#init_loader").transition("fade");

    setTimeout(function(){
        console.log("Killed loader! Page contents should be fading in now.");
        def.resolve();
    }, 300);

    return $.when(def).promise();
}

var killContent = function() {
    var def = $.Deferred();

    $("#init_loader").children().slice(1).transition({
        animation: "fade",
        duration:  "1100ms",
        onComplete: function(){ def.resolve() }
    }); 

    return def.promise();
}

var toggleLoader = function(flag, message) {
    if(flag) {
        if(message === undefined) {
            $("#init_loader").children().first()[0].innerHTML = "Doing something...";
            killContent().done(function() {
                $("#init_loader").transition({
                    animation: "fade",
                    duration:  "2000ms"
                });
            });
        }
        else {
            $("#init_loader").children().first()[0].innerHTML = message;
            killContent().done(function() {
                $("#init_loader").transition({
                    animation: "fade",
                    duration:  "2000ms"
                });
            });
        }
    }
    else {
        killLoader().done(function(){
            $("#init_loader").children().slice(1).transition("fade", 1700);
        });
    }
}

// Credit to StackOverflow's Pawel
var objectKeyByValue = function(obj, val) {
      return Object.entries(obj).find(i => i[1] === val)[0];
}

var buildImportFilelist = function(evt) {
    importFiles = evt.target.files;
    project.importConfigFromCSV();
}

// [END] ////////// [FUNCTIONS] ///////////////////
