// set the dimensions and margins of the graph
var margin3 = {top3: 30, right3: 100, bottom3: 30, left3: 100},
width3 = 1000 - margin3.left3 - margin3.right3,
height3 = 400 - margin3.top3 - margin3.bottom3;

// append the svg object to the body of the page
var svg = d3.select("#my_dataviz2")
.append("svg")
.attr("width", width3 + margin3.left3 + margin3.right3)
.attr("height", height3 + margin3.top3 + margin3.bottom3)
.append("g")
.attr("transform",
      "translate(" + margin3.left3 + "," + margin3.top3 + ")");

//Read the data
d3.csv("4LineChart.csv", function(data3) {

// List of groups (here I have one group per column)
var allGroup = ["Business_Analyst","Data_Analyst","Data_Engineer","Data_Scientist","Software_Engineer","Statistician"]

// Reformat the data: we need an array of arrays of {x, y} tuples
var dataReady = allGroup.map( function(grpName) { // .map allows to do something for each element of the list
  return {
    name3: grpName,
    values3: data3.map(function(d) {
      return {time: d.time, value3: +d[grpName]};
    })
  };
});
// I strongly advise to have a look to dataReady with
console.log(dataReady)

// A color scale: one color for each group
var myColor = d3.scaleOrdinal()
  .domain(allGroup)
  .range(d3.schemeSet2);

// Add X axis --> it is a date format
var x3 = d3.scaleLinear()
  .domain([0,40])
  .range([ 0, width3 ]);
svg.append("g")
  .attr("transform", "translate(0," + height3 + ")")
  .call(d3.axisBottom(x3));

// Add Y axis
var y = d3.scaleLinear()
  .domain( [20000,80000])
  .range([ height3, 0 ]);
svg.append("g")
  .call(d3.axisLeft(y));

// Add the lines
var line = d3.line()
  .x(function(d) { return x3(+d.time) })
  .y(function(d) { return y(+d.value3) })
svg.selectAll("myLines")
  .data(dataReady)
  .enter()
  .append("path")
    .attr("class", function(d){ return d.name3 })
    .attr("d", function(d){ return line(d.values3) } )
    .attr("stroke", function(d){ return myColor(d.name3) })
    .style("stroke-width", 4)
    .style("fill", "none")

// Add the points
svg
  // First we need to enter in a group
  .selectAll("myDots")
  .data(dataReady)
  .enter()
    .append('g')
    .style("fill", function(d){ return myColor(d.name3) })
    .attr("class", function(d){ return d.name3 })
  // Second we need to enter in the 'values' part of this group
  .selectAll("myPoints")
  .data(function(d){ return d.values3 })
  .enter()
  .append("circle")
    .attr("cx", function(d) { return x3(d.time) } )
    .attr("cy", function(d) { return y(d.value3) } )
    .attr("r", 5)
    .attr("stroke", "white")

// Add a label at the end of each line
svg
  .selectAll("myLabels")
  .data(dataReady)
  .enter()
    .append('g')
    .append("text")
      .attr("class", function(d){ return d.name3 })
      .datum(function(d) { return {name3: d.name3, value3: d.values3[d.values3.length - 1]}; }) // keep only the last value of each time series
      .attr("transform", function(d) { return "translate(" + x3(d.value3.time) + "," + y(d.value3.value3) + ")"; }) // Put the text at the position of the last point
      .attr("x", 32) // shift the text a bit more right
      .text(function(d) { return d.name3; })
      .style("fill", function(d){ return myColor(d.name3) })
      .style("font-size", 15)

// Add a legend (interactive)
svg
  .selectAll("myLegend")
  .data(dataReady)
  .enter()
    .append('g')
    .append("text")
      .attr('x', function(d,i){ return 20 + i*130})
      .attr('y', 10)
      .text(function(d) { return d.name3; })
      .style("fill", function(d){ return myColor(d.name3) })
      .style("font-size", 15)
    .on("click", function(d){
      // is the element currently visible ?
      currentOpacity = d3.selectAll("." + d.name3).style("opacity")
      // Change the opacity: from 0 to 1 or from 1 to 0
      d3.selectAll("." + d.name3).transition().style("opacity", currentOpacity == 1 ? 0:1)

    })
})