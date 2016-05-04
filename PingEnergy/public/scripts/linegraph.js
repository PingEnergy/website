// http://cs.wheatonma.edu/egauge/dorm/dorm.xml
$(document).ready(function() {
  $("#rankListPerBed").show();
  $("#rankList").hide();

  function drawGraph(yOption){
    if ($("#switch-color").attr("val") == 0){
      colorScheme = ["f00", "f22", "#f44",  "#f66", "#f88", "faa", "fcc"]
      colorScheme2 = ["cfc", "afa", "#8f8", "#6f6", "#4f4", "#2f2", "0f0"];
    }
    else{
      colorScheme = ["#006DDB", "#B66D9B", "#6DB6FF", "#B6DBFF", "#FFFF6D", "#24FF24", "#DBD100", "#3f9b3f"];
    }

    var margin = {top: 20, right: 80, bottom: 30, left: 50},
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    var parseDate = d3.time.format("%Y%m%d").parse;

    var x = d3.time.scale()
      .range([0, width]);

    var y = d3.scale.linear()
      .range([height, 0]);

    var color = d3.scale.ordinal()
      .range(colorScheme);

    var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");

    var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left");

    var line = d3.svg.line()
      .x(function(d) { return x(d[0]); })
      .y(function(d) {
        if (yOption == 0){
          return y(d[1]/beds[i]);
        }else if (yOption == 1){
          return y(d[1]);
        }else if (yOption == 2){
          return y(d[1] * 0.6379);
        }else{
          return y(d[1] * 0.0274957);
        }
      });

    var svg = d3.select("#linegraph").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom).append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    x.domain(d3.extent(data2[0], function(d) { return d[0]; }));

    yExtent = [10000000, 0];
    for (var i=0; i< data2.length; i++) {
      var newExtent = d3.extent(data2[i], function(d) {
        if (yOption == 0){
          return d[1]/beds[i];
        }else if (yOption == 1){
          return d[1];
        }else if (yOption == 2){
          return d[1] * 0.6379;
        }else{
          return d[1] * 0.0274957;
        }
      });

      if (newExtent[0] < yExtent[0]) {
        yExtent[0] = newExtent[0] * 0.1;
      }
      if (newExtent[1] > yExtent[1]) {
        yExtent[1] = newExtent[1] * 1.1;
      }
    }
    y.domain(yExtent);


    var mouseOn = function() {
        var circle = d3.select(this);

        // Horizontal line
        svg.append("g")
          .attr("class", "guide")
          .append("line")
          .attr("x1", circle.attr("cx"))
          .attr("x2", circle.attr("cx"))
          .attr("y1", +circle.attr("cy"))
          .attr("y2", height)
          .style("stroke", circle.style("fill"))
          .transition().delay(200).duration(400)
          .styleTween("opacity", function() { return d3.interpolate(0, 0.5);
        });

        // Vertical line
        svg.append("g")
          .attr("class", "guide")
          .append("line")
          .attr("x1", circle.attr("cx"))
          .attr("x2", 0)
          .attr("y1", circle.attr("cy"))
          .attr("y2", circle.attr("cy"))
          .style("stroke", circle.style("fill"))
          .transition().delay(200).duration(400)
          .styleTween("opacity", function() { return d3.interpolate(0, 0.5);
        });
    };

    var mouseOff = function() {
        var circle = d3.select(this);

        // fade out guide lines, then remove them
        d3.selectAll(".guide").transition().duration(100)
          .styleTween("opacity", function() { return d3.interpolate(0.5, 0); })
          .remove();
    };

  
    for (i = 0; i < data2.length; i++) {
      svg.append("g").selectAll(".circles")
        .data(data2[i])
        .enter()
        .append("circle")
        .attr("class", "circles")
        .attr({
          cx: function(d) { return x(d[0]); },
          cy: function(d) {
            if (yOption == 0){
              return y(d[1]/beds[i]);
            }else if (yOption == 1){
              return y(d[1]);
            }else if (yOption == 2){
              return y(d[1] * 0.6379);
            }else{
              return y(d[1] * 0.0274957);
            }
          },
          cTime: function(d) { return d[0]; },
          cEnergy: function(d) { return d[1]; },
          cUsagePerBed: function(d) { return d[1]/beds[i]; },
          cBeds: beds[i],
          buildingName: buildings[i].replace(/ /g, ""),
          r: 6
        })
        .style("fill", "transparent")
        .on("mouseover", mouseOn)
        .on("mouseout", mouseOff);
      }

    for (i = 0; i < data2.length; i++) {
      svg.append("svg:path")
        .datum(data2[i])
        .attr("class", "line")
        .attr("id", buildings[i].replace(/ /g, ""))
        .attr("d", line)
        .attr("opacity", 1)
        .style("stroke", function() {
          // console.log(buildings[i], buildingsSorted.indexOf(buildings[i]));
          if(yOption == 0){
            var avgIndex = buildingSortedPerBed.indexOf("Average");
            return colorScheme[buildingSortedPerBed.indexOf(buildings[i])];
          }else{
            return colorScheme[buildingsSorted.indexOf(buildings[i])];
          }
        })
        .attr("fill", "none");
    }

    $(".circles").tipsy({
        gravity: 's',
        html: true,
          title: function() {
            var d = new Date();
            d.setTime(d3.select(this).attr("cTime")).toString();
            d = String(d).slice(0, 16);
            var energyRound = Math.round(d3.select(this).attr("cEnergy") * 100)/100;
            var energyPerBedRound = Math.round(d3.select(this).attr("cUsagePerBed") * 100)/100;
            var co2Round = Math.round(energyRound * 0.6379 * 100)/100;
            var treeOffsetRound = Math.round(energyRound * 0.0274957 * 100)/100;
            var bedsRound = Math.round(d3.select(this).attr("cBeds"));
            return 'Building: '+ d3.select(this).attr("buildingName") + '<br>' + d + '<br>Building Energy Usage: ' + energyRound + ' (kwh)<br>Total Beds: ' + bedsRound + '<br>Per Bed Energy Usage: ' + energyPerBedRound + ' (kwh)<br>CO2 Generated: ' + co2Round + ' (pounds)<br>Tree Offset: ' + treeOffsetRound + ' trees to offset the carbon emission';
          }
      });

    // x-axis
    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

    var yAxisText = null;
    if (yOption == 0){
      yAxisText = "Total Kilowatt Hours (kwh) Per Bed";
    } else if(yOption == 1){
      yAxisText = "Total Kilowatt Hours (kwh)";
    }else if(yOption == 1){
      yAxisText = "Total CO2 Emission";
    }else{
      yAxisText = "Total Trees to Offset Carbon Emission";
    }
    // y-axis
    svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .append("text")
      .attr("dy", "20")
      .style("text-anchor", "end")
      .attr("transform", "rotate(-90)")
      .text(yAxisText);

    var toggleLine = null;
    if(yOption == 0){
      $('.rankListPerBed').each(function(){
        toggleLine = $(this).attr("value").replace(/ /g,'');
        if($(this).attr("index") == 0 || $(this).attr("index") == buildings.length-1 || toggleLine=="Average"){
          $(this).attr('highlight', "true");
          $(this).css("background-color", "rgba(193, 230, 193, 0.9)");
          $("#"+toggleLine).attr({"opacity": 1});
        }else{
          $(this).attr('highlight', "false");
          $(this).css("background-color", "rgba(255,255,240,0)");
          $("#"+toggleLine).attr({"opacity": 0});
        }
      });
    }else{
      $('.rankListEachBuilding').each(function(){
        toggleLine = $(this).attr("value").replace(/ /g,'');
        if($(this).attr("index") == buildings.length || $(this).attr("index") == buildings.length*2-1 || toggleLine=="Average"){
          $(this).attr('highlight', "true");
          $(this).css("background-color", "rgba(193, 230, 193, 0.9)");
          $("#"+toggleLine).attr({"opacity": 1});
        }else{
          $(this).attr('highlight', "false");
          $(this).css("background-color", "rgba(255,255,240,0)");
          $("#"+toggleLine).attr({"opacity": 0});
        }
      });
    }
  }


  $('#switch-color').click(function(){
     if ($('#switch-color').attr('val') == 1){
       $('#switch-color').attr('val', "0");
     }
     else{
       $('#switch-color').attr('val', "1");
     }
     $('#Apply').click();
   });

  $('.rankingToggle').mouseover(function(){
    $(this).css("cursor", "pointer");
  }).mouseout(function(){
    $(this).css("cursor", "auto");
  });

  $('.rankingToggle').click(function(){
      toggleLine = $(this).attr("value").replace(/ /g,'');
      // console.log(toggleLine);
      if($(this).attr('highlight') == "true") {
        // console.log("Turn off");
        $("#"+toggleLine).attr({"opacity": 0});
        $(this).attr('highlight', "false");
        $(this).css("background-color", "rgba(255,255,240,0)");
      }else{
        // console.log("Turn on");
        $("#"+toggleLine).attr({"opacity": 1});
        $(this).attr('highlight', "true");
        $(this).css("background-color", "rgba(193, 230, 193, 0.9)");
      }
    });


  drawGraph(0);

  $('#Apply').on("click", function(){
    var yOption = $("#cheese").val();
    if(yOption == 0){
      $("#rankListPerBed").show();
      $("#rankList").hide();
    }else{
      $("#rankListPerBed").hide();
      $("#rankList").show();
    }

    d3.select("svg").remove();
    drawGraph(yOption);
    // yOption: 
    // 1 - Energy Usage Per Bed
    // 2 - Energy Usage
    // 3 - CO2 Consumption
    // 4 - Tree Offset
  });
});
