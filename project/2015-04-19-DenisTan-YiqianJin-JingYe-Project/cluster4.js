function runFour() {
function addAxesAndLegendFour (svg, xAxis, yAxis, margin, chartWidth, chartHeight) {

	var axes = svg.append('g')
		.attr('clip-path', 'url(#axes-clip)');

	axes.append('g')
		.attr('class', 'x axis')
		.attr('transform', 'translate(0,' + chartHeight + ')')
		.call(xAxis);

	axes.append('g')
		.attr('class', 'y axis')
		.call(yAxis)
		.append('text')
			.attr('transform', 'rotate(-90)')
			.attr('y', -36)
			.attr('dy', '.71em')
			.style('text-anchor', 'end')
			.text('Daily Average Energy Demand (Cluster 4)');


}

var cityFourOne = "Abidjan";
var cityFourTwo = "El Paso";
var cityFourThree = "Singapore";

function drawPathsFour (svg, data, x, y) {
	var pathOne = d3.svg.line()
		.interpolate('basis')
		.x (function (d) { if (d.city == cityFourOne) { return x(d.date) || 1; } })
		.defined(function(d) { if (d.city == cityFourOne) { return !isNaN(d.date); } })
		.y(function (d) { if (d.city == cityFourOne) { return y(d.MW); } })
		.defined(function(d) { if (d.city == cityFourOne) { return !isNaN(d.MW); } });

	var pathTwo = d3.svg.line()
		.interpolate('basis')
		.x (function (d) { if (d.city == cityFourTwo) { return x(d.date) || 1; } })
		.defined(function(d) { if (d.city == cityFourTwo) { return !isNaN(d.date); } })
		.y(function (d) { if (d.city == cityFourTwo) { return y(d.MW); } })
		.defined(function(d) { if (d.city == cityFourTwo) { return !isNaN(d.MW); } });
	
	var pathThree = d3.svg.line()
		.interpolate('basis')
		.x(function (d) { if (d.city == cityFourThree) { return x(d.date); } })
		.defined(function(d) { if (d.city == cityFourThree) { return !isNaN(d.date); } })
		.y(function (d) { if (d.city == cityFourThree) { return y(d.MW); } })
		.defined(function(d) { if (d.city == cityFourThree) { return !isNaN(d.MW); } });
		
	svg.datum(data);

	svg.append('path')
		.attr('class', 'One')
		.attr('d', pathOne)
		.attr('clip-path', 'url(#rect-clip)')
		.attr('shape-rendering', "crispEdges")
		.attr("fill", "none")
		.attr("stroke", "#abe3ce")
		.attr("stroke-width", "2");

	svg.append('path')
		.attr('class', 'Two')
		.attr('d', pathTwo)
		.attr('clip-path', 'url(#rect-clip)')
		.attr('shape-rendering', "crispEdges")
		.attr("fill", "none")
		.attr("stroke", "#fdb59c")
		.attr("stroke-width", "2");
		
	svg.append('path')
		.attr('class', 'Three')
		.attr('d', pathThree)
		.attr('clip-path', 'url(#rect-clip)')
		.attr('shape-rendering', "crispEdges")
		.attr("fill", "none")
		.attr("stroke", "black")
		.attr("stroke-width", "2");
		
}

function startTransitions (svg, chartWidth, chartHeight, rectClip, x) {
	rectClip
		.transition().duration(30000).attr('width', chartWidth);
}

function makeChart (data) {
	var svgWidth  = 960,
		svgHeight = 300,
		margin = { top: 20, right: 20, bottom: 40, left: 60 },
		chartWidth  = svgWidth  - margin.left - margin.right,
		chartHeight = svgHeight - margin.top  - margin.bottom;

	var x = d3.time.scale().range([0, chartWidth])
			.domain(d3.extent(data, function (d) { return d.date; })),
		y = d3.scale.linear().range([chartHeight, 0])
			.domain([-d3.max(data, function (d) {return -d.MW;}), d3.max(data, function (d) { return d.MW; })]);

	var xAxis = d3.svg.axis().scale(x).orient('bottom')
				.innerTickSize(-chartHeight).outerTickSize(0).tickPadding(10),
		yAxis = d3.svg.axis().scale(y).orient('left')
				.innerTickSize(-chartWidth).outerTickSize(0).tickPadding(10);

	var svg = d3.select('body').append('svg')
		.attr('width',  svgWidth)
		.attr('height', svgHeight)
		.append('g')
			.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

	// clipping to start chart hidden and slide it in later
	var rectClip = svg.append('clipPath')
		.attr('id', 'rect-clip')
		.append('rect')
			.attr('width', 0)
			.attr('height', chartHeight);

	addAxesAndLegendFour(svg, xAxis, yAxis, margin, chartWidth, chartHeight);
	drawPathsFour(svg, data, x, y);
	startTransitions(svg, chartWidth, chartHeight, rectClip, x);
	
}

var parseDate  = d3.time.format('%Y-%m-%d').parse;
d3.csv('data/data_cluster4.csv', function (rawData) {

	var data = rawData.map(function (d) {
		return {
			MW: d.MW,
			city: d.city,
			date:  parseDate(d.date),
		};
	});

makeChart(data);
});

};

function removeAll() {
	d3.select('body').selectAll("g")
		.remove();

	d3.select('body').selectAll("path")
		.remove();
		
	d3.select('body').selectAll("clipPath")
		.remove();
		
	d3.select('body').selectAll("polygon")
		.remove();
	
}