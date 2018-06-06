var plotWords = function() {
var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 700 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// setup x
var xValue = function(d) { return d.x;}, // data -> value
    xScale = d3.scale.linear().range([0, width]), // value -> display
    xMap = function(d) { return xScale(xValue(d));}, // data -> display
    xAxis = d3.svg.axis().scale(xScale).orient("bottom");

// setup y
var yValue = function(d) { return d.y;}, // data -> value
    yScale = d3.scale.linear().range([height, 0]), // value -> display
    yMap = function(d) { return yScale(yValue(d));}, // data -> display
    yAxis = d3.svg.axis().scale(yScale).orient("left");

// add the graph canvas to the body of the webpage
var svg = d3.select("#words").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("max-width", "100%")
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// add the tooltip area to the webpage
var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

// load data
d3.csv("./words.csv", function(error, data) {

  // change string (from CSV) into number format
  data.forEach(function(d) {
    d.x = +d.x;
    d.y = +d.y;
  });

  // don't want dots overlapping axis, so add in buffer to data domain
  xScale.domain([d3.min(data, xValue)-1, d3.max(data, xValue)+1]);
  yScale.domain([d3.min(data, yValue)-1, d3.max(data, yValue)+1]);

  // draw dots
  svg.selectAll(".dot")
      .data(data)
      .enter().append("circle")
      .attr("r", 3)
      .attr("cx", xMap)
      .attr("cy", yMap)
      .style("fill", "rgba(31, 119, 180, 0.8)")
      .on("mouseover", function(d) {
          tooltip.transition()
              .duration(200)
              .style("opacity", 1);
          tooltip.html(d.word)
              .style("left", (d3.event.pageX + 5) + "px")
              .style("top", (d3.event.pageY - 28) + "px");
          d3.select(this).transition()
              .duration(100)
              .attr("r", 8)
              .style("fill", "rgb(31, 119, 180)");
      })
      .on("mouseout", function(d) {
          tooltip.transition()
              .duration(500)
              .style("opacity", 0);
          d3.select(this).transition()
              .duration(100)
              .attr("r", 3)
              .style("fill", "rgb(31, 119, 180, 0.8)");
      });
});
}

plotWords();
