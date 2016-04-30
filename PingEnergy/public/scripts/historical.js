$(document).ready(function(){
    // dayData = {"date_integer": [totalForAllBuildings, CO2, treeOffset}
    makeSVG(2016);   
});

function makeSVG(year) {
    var width = 1000,
        height = 150,
        cellSize = 18; // cell size
      
    var percent = d3.format(".2%"),
        format = d3.time.format("%m-%d-%Y")
      
    var margin = {top: 20, right: 20, bottom: 20, left: 20};
      
    var svg = d3.select("#historical").append("svg")
        .attr("width", width + margin.left + margin.right )
        .attr("height", height + margin.top + margin.bottom)
        .attr("transform", "translate(" + ((width - cellSize * 53) / 2) + "," + (height - cellSize * 7 - 1) + ")");
        
    var svg2 = d3.select("#information").append("svg")
        .attr("id", "information")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .attr("stroke", "black")
        .attr("stroke-width", "1px")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        
    draw(year, svg, svg2);
}

function draw(year, svg, svg2) {

    var color = ["#d1ecd1", "#66c166", "#99d699", "#cceacc", "#ffcccc", "#ff9999", "#ff6666"];
    var totalSum = 0;
    var daySum = 0;

    var width = 1000,
        height = 150,
        cellSize = 18; // cell size
      
    var percent = d3.format(".2%"),
      format = d3.time.format("%m-%d-%Y")
      
    var margin = {top: 20, right: 20, bottom: 20, left: 20};
    
    var total = d3.select("#yearChosen").append("text")
        .attr("transform", "translate(45, 0)rotate(-90)")
        .style("text-anchor", "left")
        .style("font-size","34px")
        .text(year);
    
    var rect = svg.selectAll(".day")
        .data(function(d) { return(d3.time.days(new Date(year, 0, 1), new Date(year + 1, 0, 1)));
           /* var old = d3.time.days(new Date(year, 0, 1), new Date(year + 1, 0, 1));
            var days = [] 
            for(var i =0; i < old.length; i++) {
                var month = old[i].getMonth()+1;
                var day = old[i].getDate();
                var date = month + '-' + day + '-' + year;
                days[i] = date;
            }
            console.log(days);
            
            return days; // returns a Date*/
        })
      .enter().append("rect")
        .attr("class", "day")
        .attr("width", cellSize)
        .attr("height", cellSize)
        .attr("x", function(d) { return d3.time.weekOfYear(d) * cellSize; })
        .attr("y", function(d) { return d.getDay() * cellSize; })
        .attr("stroke", "black")
        .attr("stroke-width", ".5px")
        .attr("fill", "white")
        .on("click", function(d) {lowerBox(d);})
        .datum(format);
               
    console.log(days["high"]);
    console.log(days["low"]);
    
    var differance = (parseFloat(days["high"]) - parseFloat(days["low"]))/6;
    console.log(differance);
    
        
    var allRects = d3.selectAll(".day")[0];
 
    //for (x = 0; x < 90; x++) { 
    //    if (days) {
    //        d3.select(allRects[x]).attr("fill", "#d1ecd1");
    //    }
    //    else if (dayData[x] > 30 && dayData[x] <= 50) {
    //        d3.select(allRects[x]).attr("fill", "#66c166");
    //    }
    //    else if (dayData[x] > 50 && dayData[x] <= 75) {
    //        d3.select(allRects[x]).attr("fill", "#99d699");
    //    }
    //    else if (dayData[x]> 75 && dayData[x] <= 135) {
    //        d3.select(allRects[x]).attr("fill", "#cceacc");
    //    }
    //    else if ( dayData[x]> 135 && dayData[x] <= 195) {
    //        d3.select(allRects[x]).attr("fill", "#ffcccc");
    //    }
    //    else if (dayData[x] > 195 && dayData[x] <= 225) {
    //        d3.select(allRects[x]).attr("fill", "#ff9999");
    //    }
    //    else {
    //        d3.select(allRects[x]).attr("fill", "#ff6666"); 
    //    }
    //
    //}   
           
        
        
        
        
        
        
        
        
        
        
        
        

    svg.selectAll(".month")
        .data(function(d) { return d3.time.months(new Date(year, 0, 1), new Date(year+1, 0, 1)); })
      .enter().append("path")
        .attr("class", "month")
        .attr("d", monthPath);
     
    function monthPath(t0) {
      var t1 = new Date(t0.getFullYear(), t0.getMonth() + 1, 0),
          d0 = t0.getDay(), w0 = d3.time.weekOfYear(t0),
          d1 = t1.getDay(), w1 = d3.time.weekOfYear(t1);
      return "M" + (w0 + 1) * cellSize + "," + d0 * cellSize
          + "H" + w0 * cellSize + "V" + 7 * cellSize
          + "H" + w1 * cellSize + "V" + (d1 + 1) * cellSize
          + "H" + (w1 + 1) * cellSize + "V" + 0
          + "H" + (w0 + 1) * cellSize + "Z";
    }

    var total = d3.select("#total").append("text")
        .attr("transform", "translate(100, 0)rotate(0)")
        .style("text-anchor", "left")
        .text("Total Energy Used:  " + totalYear["yearTotal"] + " kWh");
 
 //.00159 tree per kwh * kwh = trees to offset for that day
           
    function lowerBox(date) {
        var str = ("Date: " + date + "<br>" + "Total Energy Used : 1089 MWh" + "<br>" + "Trees to offset: 7" + "<br>" + "CO2 emitted: 888lbs");

        d3.select("#words").selectAll("text").remove();
        $('#words').empty();

        var div = document.getElementById("words");
        div.innerHTML = div.innerHTML + str;

    }
    
    
}

function clear() {
    console.log("fuck me sideways");
    $( "#container" ).empty();
    makeSVG(2017);
}


