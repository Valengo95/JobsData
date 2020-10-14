// set the dimensions and margins of the graph
var margin4 = {top4: 30, right4: 30, bottom4: 70, left4: 60},
width4 = 900 - margin4.left4 - margin4.right4,
height4 = 500 - margin4.top4 - margin4.bottom4;

// append the svg object to the body of the page
var svg = d3.select("#my_dataviz4")
.append("svg")
.attr("width", width4 + margin4.left4 + margin4.right4)
.attr("height", height4 + margin4.top4 + margin4.bottom4)
.append("g")
.attr("transform",
      "translate(" + margin4.left4 + "," + margin4.top4 + ")");

// Initialize the X axis
var x4 = d3.scaleBand()
.range([ 0, width4 ])
.padding(0.2);
var xAxis4 = svg.append("g")
.attr("transform", "translate(0," + height4 + ")")

// Initialize the Y axis
var y4 = d3.scaleLinear()
.range([ height4, 0]);
var yAxis4 = svg.append("g")
.attr("class", "myYaxis")


// A function that create / update the plot for a given variable:
function update(selectedVar) {

// Parse the Data
d3.csv("5Histogramme.csv", function(data4) {

// X axis
x4.domain(data4.map(function(d) { return d.group; }))
xAxis4.transition().duration(1000).call(d3.axisBottom(x4))

// Add Y axis
y4.domain([0, d3.max(data4, function(d) { return +d[selectedVar] }) ]);
yAxis4.transition().duration(1000).call(d3.axisLeft(y4));

// variable u: map data to existing bars
var u = svg.selectAll("rect")
  .data(data4)

// update bars
u
  .enter()
  .append("rect")
  .merge(u)
  .transition()
  .duration(1000)
    .attr("x", function(d) { return x4(d.group); })
    .attr("y", function(d) { return y4(d[selectedVar]); })
    .attr("width", x4.bandwidth())
    .attr("height", function(d) { return height4 - y4(d[selectedVar]); })
    .attr("fill", "#69b3a2")
})

}

// Initialize plot
update('All_Jobs')