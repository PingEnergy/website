$(document).ready(function() {

    var color = d3.scale.ordinal().range(["#ffffbe", "#e0fba7", "#d9f0a3", "#addd8e", "#78c679", "#41ab5d", "#238443", "#006837"]);

    var diameter = 800,
        format = d3.format(",d")

    var bubble = d3.layout.pack()
        .sort(null)
        .size([diameter, 400])
        .padding(1.5);

    var svg = d3.select("#bubbles").append("svg")
        .attr("width", diameter)
        .attr("height", 400)
        .attr("class", "bubble");

    d3.json("/data/bubbles.json", function(error, root) {
      if (error) throw error;

      var node = svg.selectAll(".node")
          .data(bubble.nodes(classes(root))
          .filter(function(d) { return !d.children; }))
        .enter().append("g")
          .attr("class", "node")
          .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

      node.append("title")
          .text(function(d) { return d.className + ": " + format(d.value); });

      node.append("circle")
          .attr("r", function(d) { return d.r; })
          .style("fill", function(d) { return color(d.packageName); });

      node.append("text")
          .attr("dy", ".3em")
          .style("text-anchor", "middle")
          .text(function(d) { return d.className.substring(0, d.r / 3); });
    });

    function classes(root) {
      var classes = [];

      function recurse(name, node) {
        if (node.children) node.children.forEach(function(child) { recurse(node.name, child); });
        else classes.push({packageName: name, className: node.name, value: node.size});
      }

      recurse(null, root);
      return {children: classes};
    }

    d3.select(self.frameElement).style("height", diameter + "px");

});
