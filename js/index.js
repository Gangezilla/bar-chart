var url = "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json";
//var height = $(window).height() - 50;
//var width = $(window).width() - 50;
var canvasHeight = 600;
var canvasWidth = 800;
var padding = 50;
var barGap = 1;
var margin = {
    top: 10,
    bottom: 40,
    left: 30,
    right: 40
};
var width = canvasWidth - margin.left - margin.right;
var height = canvasHeight - margin.bottom - margin.top;
var months = [
    "January", "February", "March",
    "April", "May", "June", "July",
    "August", "September", "October",
    "November", "December"
];

$('document').ready(function() {

    var viz = d3.select("#viz-wrapper")
        .append("svg")
        .attr("id", "viz")
        .attr("class", "viz-class")
        .attr('height', height + margin.top + margin.bottom)
        .attr('width', width + margin.left + margin.right)
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    d3.json(url, function(err, data) {
        var parseTime = d3.time.format("%Y-%m-%d");

        var xDomain = d3.extent(data.data, function(d) {
            return parseTime.parse(d[0]);
        });

        var yDomain = d3.extent(data.data, function(d) {
            return d[1];
        });

        var yScale = d3.scale
            .linear()
            .domain(yDomain)
            .range([height, 0]);

        var xScale = d3.time
            .scale()
            .domain(xDomain)
            .range([0, width]);

        var xAxis = d3.svg
            .axis()
            .scale(xScale)
            .orient("bottom")
            .ticks(10);

        var yAxis = d3.svg
            .axis()
            .scale(yScale)
            .orient("right")
            .ticks(25);

        var tooltip = d3.select("#viz-wrapper").append("div")
            .style("opacity", "0")
            .style("position", "absolute")
            .style("z-index", "10");

        viz.append("g")
            .attr("class", "axis")
            .call(yAxis);

        viz.append("g")
            .attr("class", "axis")
            .call(xAxis)
            .attr("transform", "translate(0," + (height + 10) + ")");

        lines = viz.selectAll('rect')
            .data(data.data)
            .enter()
            .append('rect')
            .attr('y', function(d) {
                return yScale(d[1]);
            })
            .attr('class', 'bar')
            .attr('width', width / data.data.length);

        lines.attr('x', function(d) {
            date = parseTime.parse(d[0]);
            return xScale(date);
        }).attr('height', function(d) {
            return (yScale(0) - yScale(d[1]));
        });

        lines.on("mouseenter", function(d, i) {
            var date = new Date(d[0]);
            var monthIndex = date.getMonth();
            var year = date.getFullYear();
            var fDate = (months[monthIndex] + ", " + year);

            line = d3.select(this);
            line.attr("class", "mouseover");
            return tooltip.style('opacity', '0.9')
                .style("left", (d3.event.pageX + 30) + "px")
                .style("top", (d3.event.pageY - 50) + "px")
                .style("border-radius", "5px")
                .style("background-color", "#eee")
                .style("padding", "10px")
                .html("<span class='year'>" + fDate + "</span><br><span class='amount'>$" + d[1] + " Billion </span>");
        });

        lines.on('mouseleave', function(d, i) {
            line = d3.select(this);
            line.classed('mouseover', false);
            line.attr("class", "bar");
            return tooltip.style("opacity", "0");

        });



    });
});
