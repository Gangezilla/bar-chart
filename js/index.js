var url = "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json";
var height = 800;
var width = 800;
var padding = 50;

$('document').ready(function() {

    var viz = d3.select("#viz-wrapper").append("svg").attr("id", "viz").attr('height', height).attr('width', width);

    d3.json(url, function(err, data) {
        var minDate = new Date(data.data[0][0]);
        var maxDate = new Date(data.data[274][0]);
        console.log(data.data);
        // var yMax = d3.max(data.data, function(d) {
        // 	return d[1];
        // });
        // var yMin = d3.min(data.data, function(d) {
        // 	return d[1];
        // });
        var yDomain = d3.extent(data.data, function(d) {
        	return d[1];
        });
        yScale=d3.scale.linear().range([height, 0]);
        //yScale.domain(yDomain);
        yAxis = d3.svg.axis().scale(yScale)
        					.orient("left")
        					.ticks("25");
        dots = viz.selectAll('circle')
            .data(data.data)
            .enter()
            .append('circle');
        dots.attr('r', function(d) {
            return Math.abs(d[1] / 500);
        }).attr('cx', function(d) {
            return Math.max(0 + padding, Math.random() * width - padding);
        }).attr('cy', function(d) {
            return Math.max(0 + padding, Math.random() * width - padding);
        }).style('fill', function(d) {
            if (d[1] < 5000) {
                return "blue";
            } else {
                return "red";
            }
        });
    });

});
