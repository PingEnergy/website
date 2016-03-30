$(document).ready(function() {
    generateChart3();
});

var buildings = { "name": "buildings",
    "children": [
        {"name": "1st",
            "children": [
                {"name": "Beard", "size": 10000, "active": false}
            ]
        },
        {"name": "2nd",
            "children": [
                {"name": "Chapin", "size": 8500, "active": false}
            ]
        },
        {"name": "3rd",
            "children": [
                {"name": "Clark", "size": 6000, "active": false}
            ]
        },
        {"name": "2ndgroup",
            "children": [
                {"name": "Cragin", "size": 6500, "active": false},
                {"name": "Everett", "size": 6250, "active": false},
                {"name": "Gebbie", "size": 5500, "active": false}
            ]
        },
        {"name": "3rdgroup",
            "children": [
                {"name": "Keefe", "size": 5000, "active": false},
                {"name": "Kilham", "size": 4500, "active": false},
                {"name": "Larcom", "size": 3800, "active": false}
            ]
        },
        {"name": "4thgroup",
            "children": [
                {"name": "McIntire", "size": 3750, "active": false},
                {"name": "Meadows", "size": 3500, "active": false},
                {"name": "Metcalf", "size": 3250, "active": false}
            ]
        },
        {"name": "5thgroup",
            "children": [
                {"name": "Stanton", "size": 3000, "active": false},
                {"name": "White", "size": 2750, "active": false},
                {"name": "Young", "size": 2500, "active": false}
            ]
        }
    ]
};

function generateChart1() {

    $("#bubbles").empty();

    var buildings = { "name": "buildings",
        "children": [
            {"name": "1st",
                "children": [
                    {"name": "Beard", "size": 10000, "active": false}
                ]
            },
            {"name": "2nd",
                "children": [
                    {"name": "Chapin", "size": 8500, "active": false}
                ]
            },
            {"name": "3rd",
                "children": [
                    {"name": "Clark", "size": 6000, "active": false}
                ]
            },
            {"name": "2ndgroup",
                "children": [
                    {"name": "Cragin", "size": 6500, "active": false},
                    {"name": "Everett", "size": 6250, "active": false},
                    {"name": "Gebbie", "size": 5500, "active": false}
                ]
            },
            {"name": "3rdgroup",
                "children": [
                    {"name": "Keefe", "size": 5000, "active": false},
                    {"name": "Kilham", "size": 4500, "active": false},
                    {"name": "Larcom", "size": 3800, "active": false}
                ]
            },
            {"name": "4thgroup",
                "children": [
                    {"name": "McIntire", "size": 3750, "active": false},
                    {"name": "Meadows", "size": 3500, "active": false},
                    {"name": "Metcalf", "size": 3250, "active": false}
                ]
            },
            {"name": "5thgroup",
                "children": [
                    {"name": "Stanton", "size": 3000, "active": false},
                    {"name": "White", "size": 2750, "active": false},
                    {"name": "Young", "size": 2500, "active": false}
                ]
            }
        ]
    };

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

            if (!(svg.selectAll(".active").empty())) {
                redoNodes();
            }
        });

    var node = svg.selectAll(".node")
        .data(nodes)
    .enter().append("g")
        .attr("class", "node")
        .call(force.drag);

    node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

    node.append("title")
        .text(function(d) { return d.className + ": " + format(d.value); });

    node.append("circle")
        .attr("r", function(d) {
            if (d.active == true) {
                return 150;
            }
            return d.r;
        })
        .classed("nodecircle", true)
        .style("fill", function(d) { return color(d.packageName); })
        .style("stroke", "black")
        .style("stroke-width", 1);

    node.append("text")
        .attr("dy", ".3em")
        .style("text-anchor", "middle")
        .text(function(d) { return d.className.substring(0, d.r / 3); });

    node.on("click", function(d) {
        var circ = d3.select(this).select(".nodecircle");

        if (circ.classed("active")) {
            circ.classed("active", false);
        }
        else {
            circ.classed("active", true);
        }
    });

    var mainNode = svg.append("g")
        .classed("mainNode", true)
        .style("visibility", "hidden")
        .on("click", function() {
            svg.selectAll(".node")
                .style("visibility", "visible");

            svg.select(".mainNode").style("visibility", "hidden");
            svg.select(".active")
                .classed("active", false);

            force.start();
        })
        .attr("transform", "translate(400, 225)");

    mainNode.append("circle")
        .attr("r", 150)
        .classed("mainCircle", true);

    mainNode.append("text")
        .attr("text-anchor", "middle")
        .text("Ooh a bubble! In the future valuable");

    mainNode.append("text")
        .attr("text-anchor", "middle")
        .attr("dy", 20)
        .text("information will be present here!");

    function redoNodes() {
        if (svg.selectAll(".mainNode").attr("text")) {
            svg.selectAll(".mainNode").attr("text").remove();
        }

        if (svg.select(".mainNode").style("visibility") == "hidden") {
            svg.select(".mainNode")
                .style("visibility", "visible");

            svg.select(".mainCircle")
                .style("fill", function() {
                    return d3.select(".active").style("fill");
                })
                .style("stroke", "black")
                .style("stroke-width", 1);
        }
    }

    force.start();

    function classes(root) {
        var classes = [];

        function recurse(name, node) {
            if (node.children) node.children.forEach(function(child) { recurse(node.name, child); });
            else classes.push({packageName: name, className: node.name, value: node.size, active: node.active});
        }

        recurse(null, root);
        return {children: classes};
    }

    d3.select(self.frameElement).style("height", height + "px");
}

function generateChart2() {
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

    var node = svg.selectAll(".node")
        .data(nodes)
    .enter().append("g")
        .attr("class", "node");

    node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

    node.append("title")
        .text(function(d) { return d.className + ": " + format(d.value); });

    node.append("circle")
        .attr("r", function(d) { return d.r; })
        .classed("nodecircle", true)
        .style("fill", function(d) { return color(d.packageName); })
        .style("stroke", "black")
        .style("stroke-width", 1);

    node.append("text")
        .attr("dy", ".3em")
        .style("text-anchor", "middle")
        .text(function(d) { return d.className.substring(0, d.r / 3); });

    node.on("click", function(d) {
        console.log(classes(buildings));

        var toSend = classes(buildings);

        for (building in toSend["children"]) {
            if (toSend["children"][building]["className"] == d.className) {
                toSend["children"][building]["active"] = true;
            }
        }

        redrawNodes(toSend);
    });

    function redrawNodes(buildings) {
        for (building in buildings["children"]) {
            if (buildings["children"][building]["active"] == true) {
                buildings["children"][building]["value"] = 3000;
            }
            else {
                buildings["children"][building]["value"] = (buildings["children"][building]["value"]/25);
            }
        }

        svg.selectAll(".node").remove().transition().duration(5000);

        var nodes = bubble.nodes(buildings)
            .filter(function(d) {return !d.children;});

        var node = svg.selectAll(".node")
            .data(nodes)
        .enter().append("g")
            .attr("class", "node");

        node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

        node.append("title")
            .text(function(d) { return d.className + ": " + format(d.value); });

        node.append("circle")
            .attr("r", function(d) { return d.r; })
            .classed("nodecircle", true)
            .style("fill", function(d) { return color(d.packageName); })
            .style("stroke", "black")
            .style("stroke-width", 1);

        node.append("text")
            .attr("dy", ".3em")
            .style("text-anchor", "middle")
            .text(function(d) { return d.className.substring(0, d.r / 3); });

        node.on("click", function() {
            generateChart2();
        } );

    }

    function classes(root) {
        var classes = [];

        function recurse(name, node) {
            if (node.children) node.children.forEach(function(child) { recurse(node.name, child); });
            else classes.push({packageName: name, className: node.name, value: node.size, active: node.active});
        }

        recurse(null, root);
        return {children: classes};
    }

    d3.select(self.frameElement).style("height", height + "px");
}

function generateChart3() {
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
        .text(function(d) { return d.className + ": " + format(d.value); });

    node.append("circle")
        .attr("r", function(d) { return d.r; })
        .classed("nodecircle", true)
        .style("fill", function(d) { return color(d.packageName); })
        .style("stroke", "black")
        .style("stroke-width", 1);

    node.append("text")
        .attr("dy", ".3em")
        .style("text-anchor", "middle")
        .text(function(d) { return d.className.substring(0, d.r / 3); });

    node.on("click", function(d) {
        console.log(classes(buildings));

        var toSend = classes(buildings);

        for (building in toSend["children"]) {
            if (toSend["children"][building]["className"] == d.className) {
                toSend["children"][building]["active"] = true;
            }
        }

        redrawNodes(toSend);
    });

    force.start();

    function redrawNodes(buildings) {
        for (building in buildings["children"]) {
            if (buildings["children"][building]["active"] == true) {
                buildings["children"][building]["value"] = 3000;
            }
            else {
                buildings["children"][building]["value"] = (buildings["children"][building]["value"]/25);
            }
        }

        svg.selectAll(".node").remove().transition().duration(5000);

        var nodes = bubble.nodes(buildings)
            .filter(function(d) {return !d.children;});

        var node = svg.selectAll(".node")
            .data(nodes)
        .enter().append("g")
            .attr("class", "node");

        node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

        node.append("title")
            .text(function(d) { return d.className + ": " + format(d.value); });

        node.append("circle")
            .attr("r", function(d) { return d.r; })
            .classed("nodecircle", true)
            .style("fill", function(d) { return color(d.packageName); })
            .style("stroke", "black")
            .style("stroke-width", 1);

        node.append("text")
            .attr("dy", ".3em")
            .style("text-anchor", "middle")
            .text(function(d) { return d.className.substring(0, d.r / 3); });

        node.on("click", function() {
            generateChart3();
        } );

    }

    function classes(root) {
        var classes = [];

        function recurse(name, node) {
            if (node.children) node.children.forEach(function(child) { recurse(node.name, child); });
            else classes.push({packageName: name, className: node.name, value: node.size, active: node.active});
        }

        recurse(null, root);
        return {children: classes};
    }

    d3.select(self.frameElement).style("height", height + "px");
}
