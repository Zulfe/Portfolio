window.onload = function() {

    var totalRoutes = [];




    var destroyAllOfTargetInArray = function(target, source) {
        var source_minus_target = [];

        source.forEach(function(entry, index) {
            var is_match = entry.every(function(element, index) {
                return element === target[index];
            });

            if(!is_match)
                source_minus_target.push(entry);
        });

        return source_minus_target;
    }




    var importFromCSV = function() {
        totalRoutes = [];

        var csv_data = "";

        var input = document.getElementById("input");
        var reader = new FileReader();
        input.onchange = function() {
            const file = input.files[0];
            reader.readAsText(file);
        };

        reader.onload = function() {
            csv_data = reader.result;
        };

        console.log(csv_data);

        var tempArray = new Array();
        for(var r = 0; r < 12; r++) {
            tempArray = new Array();
            for(var e = 0; e < 6; e++)
                tempArray.push([-1, -1, -1]);
            totalRoutes.push(tempArray);
        }

        csv_data = $.csv.toArrays(csv_data);

        var using_2D = true;

        var code_string = "";
        var route_num = 1;
        var zone;
        var dir;
        var mvt;
        var entry_count = 0;
        code_string += "["
        for(var row = 2; row < csv_data.length; row++) {
            if(!(csv_data[row][0] == route_num.toString())) {
                entry_count = 0;
            }

            route_num = parseInt(csv_data[row][0]);
            zone      = parseInt(csv_data[row][1]);
            dir       = parseInt(csv_data[row][2]);
            mvt       = parseInt(csv_data[row][3]);
            o_zone    = parseInt(csv_data[row][4]);
            o_dir     = parseInt(csv_data[row][5]);
            o_mvt     = parseInt(csv_data[row][6]);

            code_string += "\t" + "[" + route_num + ", " + zone + ", " + dir + ", " + mvt + ", " + o_zone + ", " + o_dir + ", " + o_mvt + "]" + (row == csv_data.length - 1 ? "" : ",");

            totalRoutes[route_num][entry_count] = [zone, dir, mvt];
            entry_count = entry_count + 1;
        }
        code_string += "];";

        for(var i = 0; i < totalRoutes.length; i++) {
            totalRoutes[i] = destroyAllOfTargetInArray([-1, -1, -1], totalRoutes[i]); 
        }


        if(!using_2D) {
            code_string = "";
            for(var i = 0; i < totalRoutes.length; i++) {
                code_string += "[" + "\n";
                for(var j = 0; j < totalRoutes[i].length; j++) {
                    code_string += "[";
                    for(var k = 0; k < totalRoutes[i][j].length; k++) {
                        if(k == totalRoutes[i][j].length - 1)
                            code_string += totalRoutes[i][j][k].toString();
                        else
                            code_string += totalRoutes[i][j][k].toString() + ", ";
                    }
                    if(j == totalRoutes[i].length - 1)
                        code_string += "]";
                    else
                        code_string += "]," + "\n";
                }
                if(i == totalRoutes.length - 1)
                    code_string += "\n" + "]";
                else
                    code_string += "\n" + "]," + "\n";
            }
        }

        $(".language-javascript").append(code_string);

        
    }




            document.getElementById("input").addEventListener("change", importFromCSV, false);
}
