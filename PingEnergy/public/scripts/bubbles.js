$(document).ready(function() {
    generateChart();
});

var buildings = { "name": "buildings",
    "children": [
        {"name": "1st",
            "children": [
                {"name": "Beard", "size": 10000, "active": false, "money": "$86.40"}
            ]
        },
        {"name": "2nd",
            "children": [
                {"name": "Chapin", "size": 8500, "active": false, "money": "$80.64"}
            ]
        },
        {"name": "3rd",
            "children": [
                {"name": "Clark", "size": 6000, "active": false, "money": "$74.88"}
            ]
        },
        {"name": "2ndgroup",
            "children": [
                {"name": "Cragin", "size": 6500, "active": false, "money": "$69.12"},
                {"name": "Everett", "size": 6250, "active": false, "money": "$63.36"},
                {"name": "Gebbie", "size": 5500, "active": false, "money": "$57.60"}
            ]
        },
        {"name": "3rdgroup",
            "children": [
                {"name": "Keefe", "size": 5000, "active": false, "money": "$51.84"},
                {"name": "Kilham", "size": 4500, "active": false, "money": "$46.08"},
                {"name": "Larcom", "size": 3800, "active": false, "money": "$40.32"}
            ]
        },
        {"name": "4thgroup",
            "children": [
                {"name": "McIntire", "size": 3750, "active": false, "money": "$34.56"},
                {"name": "Meadows", "size": 3500, "active": false, "money": "$28.80"},
                {"name": "Metcalf", "size": 3250, "active": false, "money": "$23.04"}
            ]
        },
        {"name": "5thgroup",
            "children": [
                {"name": "Stanton", "size": 3000, "active": false, "money": "$17.28"},
                {"name": "White", "size": 2750, "active": false, "money": "$11.52"},
                {"name": "Young", "size": 2500, "active": false, "money": "$5.76"}
            ]
        }
    ]
};

function generateChart() {
    $("#bubbles").empty();

    var color = d3.scale.ordinal().range(["#006d2c", "#238b45", "#41ab5d", "#74c476", "#a1d99b", "#c7e9c0", "#e5f5e0", "#f7fcf5"]);

    var diameter = 800,
        height = 450,
        format = d3.format(",d");

    var bubble = d3.layout.pack()
        .sort(function comparator(a, b) {
            return b.value - a.value;
        })
        .size([diameter, height])
        .padding(1.5);

    var svg = d3.select("#bubbles").append("svg")
        .attr("width", diameter)
        .attr("height", height)
        .attr("class", "bubble");

    var nodes = bubble.nodes(classes(buildings))
        .filter(function(d) {return !d.children;});

    var force = d3.layout.force()
        .gravity(0.02)
        .alpha(.3)
        .friction(.9)
        .charge(function(d) {
            return -1.9 * d.r;
        })
        .nodes(nodes)
        .size([diameter, height])
        .on("tick", function() {
            svg.selectAll(".node")
                .attr("transform", function(d) {
                    return "translate(" + d.x + "," + d.y + ")";
                });
        });

    var node = svg.selectAll(".node")
        .data(nodes)
    .enter().append("g")
        .attr("class", "node")
        .call(force.drag);

    node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

    node.append("title")
        .text(function(d) { return d.className + ": " + d.money; });

    node.append("circle")
        .attr("r", function(d) { return d.r; })
        .classed("nodecircle", true)
        .style("fill", function(d) { return color(d.packageName); })
        .style("stroke", "black")
        .style("stroke-width", 1);

    //add building name to all nodes
    node.append("text")
        .attr("dy", ".6em")
        .style("text-anchor", "middle")
        .text(function(d) { return d.className.substring(0, d.r / 3); })
        .attr("font-weight", "bold")
        .attr("font-size", "1.1em")
        .attr("transform", "translate(0, -10)");

    //add money value to all nodes
    node.append("text")
        .attr("dy", "1.2em")
        .style("text-anchor", "middle")
        .style("font-size", ".9em")
        .text(function(d) { return d.money });

    node.on("click", function(d) {
        var toSend = classes(buildings);
        for (building in toSend["children"]) {
            if (toSend["children"][building]["className"] == d.className) {
                toSend["children"][building]["active"] = true;
            }
        }
        bubblesTwo(toSend);
    });

    node.on("mouseover", function() {
        $("#bubbles").css("cursor", "pointer");
    })
    node.on("mouseout", function() {
        $("#bubbles").css("cursor", "default");
    });

    force.start();

    function bubblesTwo(sentBuildings) {
        for (building in sentBuildings["children"]) {
            if (sentBuildings["children"][building]["active"] == true) {
                sentBuildings["children"][building]["value"] = 3000;
            }
            else {
                sentBuildings["children"][building]["value"] = (sentBuildings["children"][building]["value"]/25);
            }
        }

        svg.selectAll(".node").remove().transition().duration(5000);

        var nodes = bubble.nodes(sentBuildings)
            .filter(function(d) {return !d.children;});

        var node = svg.selectAll(".node")
            .data(nodes)
        .enter().append("g")
            .attr("class", "node");

        node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

        node.append("title")
            .text(function(d) { return d.className + ": " + d.money; });

        node.append("circle")
            .attr("r", function(d) { return d.r; })
            .classed("nodecircle", true)
            .style("fill", function(d) { return color(d.packageName); })
            .style("stroke", "black")
            .style("stroke-width", 1);

        node.on("mouseover", function() {
            $("#bubbles").css("cursor", "pointer");
        })
        node.on("mouseout", function() {
            $("#bubbles").css("cursor", "default");
        });

        //add building name to all nodes
        node.filter(function(d) { return d.active != true; })
        .append("text")
            .attr("dy", ".3em")
            .style("text-anchor", "middle")
            .text(function(d) { return d.className.substring(0, d.r / 3); })
            .attr("font-size", "1em");

        node.filter(function(d) { return d.active != true; })
            .on("click", function(d) {
                var toSend = classes(buildings);
                for (building in toSend["children"]) {
                    if (toSend["children"][building]["className"] == d.className) {
                        toSend["children"][building]["active"] = true;
                    }
                    else {
                        toSend["children"][building]["active"] = false;
                    }
                }
                bubblesTwo(toSend);
            });

        //main node building name
        node.filter(function(d) { return d.active == true; })
        .append("text")
            .attr("dy", "-.5em")
            .style("text-anchor", "middle")
            .style("font-size", "2em")
            .text(function(d) { return d.className; })

        //main node money raised
        node.filter(function(d) { return d.active == true; })
        .append("text")
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text(function(d) { return "Money raised: " + d.money });

        //main node energy usage per bed
        node.filter(function(d) { return d.active == true; })
        .append("text")
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text(function(d) { return ""; });

        //click main node exits to original graph
        node.filter(function(d) { return d.active == true; })
            .on("click", function() {
                generateChart();
            });
    }

    function classes(root) {
        var classes = [];

        function recurse(name, node) {
            if (node.children) node.children.forEach(function(child) { recurse(node.name, child); });
            else classes.push({packageName: name, className: node.name, value: node.size, active: node.active, money: node.money});
        }

        recurse(null, root);
        return {children: classes};
    }

    d3.select(self.frameElement).style("height", height + "px");

}
