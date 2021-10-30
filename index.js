// set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 40, left: 50},
    width = 520 - margin.left - margin.right,
    height = 520 - margin.top - margin.bottom;

// append the SVg object to the body of the page
var SVG = d3.select("#my_dataviz4")
  .style("background-color", "#061f08")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")")

// Add the black box around the chart
SVG
  .append("rect")
    .attr("x",0)
    .attr("y",0)
    .attr("height", height)
    .attr("width", height)
    .style("fill", "none")
    .style("stroke", "black")
    .style("opacity", 0.6)
    
    //Read the data
d3.csv("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/iris.csv", function(data) {

    // Add X axis
    var x = d3.scaleLinear()
      .domain([4, 8])
      .range([ 0, width ])
    SVG.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x))
  
    // Add Y axis
    var y = d3.scaleLinear()
      .domain([0, 8])
      .range([ height, 0])
      .nice()
    SVG.append("g")
      .call(d3.axisLeft(y))
  
    // Add X axis label:
    SVG.append("text")
        .attr("text-anchor", "end")
        .attr("x", width)
        .attr("y", height + margin.top + 20)
        .text("Sepal Length")
        .style("fill", "white")
  
    // Y axis label:
    SVG.append("text")
        .attr("text-anchor", "end")
        .attr("transform", "rotate(-90)")
        .attr("y", -margin.left+20)
        .attr("x", -margin.top)
        .text("Petal Length")
        .style("fill", "white")
  
    // Customization
    SVG.selectAll(".tick line").attr("stroke", "white")
    SVG.selectAll(".tick text").attr("stroke", "white").style("font-size", 10)
  
    // Color scale: give me a specie name, I return a color
    var color = d3.scaleOrdinal()
      .domain(["setosa", "versicolor", "virginica" ])
      .range([ "#440154ff", "#21908dff", "#fde725ff"])
  
    // Add dots
    SVG.append('g')
      .selectAll("dot")
      .data(data)
      .enter()
      .append("circle")
        .attr("cx", function (d) { return x(d.Sepal_Length); } )
        .attr("cy", function (d) { return y(d.Petal_Length); } )
        .attr("r", 8)
        .style("fill", function (d) { return color(d.Species) } )
        .style("stroke", "white")
        .style("stroke-width", 1)
  
  
  })
  