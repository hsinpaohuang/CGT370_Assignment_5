var tip = d3.tip().attr('class', 'd3-tip').html(function(d) { return '<strong>Name: </strong> <span class="details">' + d.properties.NAME + '<br /></span> <strong>Migration flow: </strong> <span class="details">' + indata[d.properties.NAME] + '</span>'; });

var svg = d3.select("#us");
var w = 300, h = 50;
var USkey = d3.select("#uslegend");

var svgstate = d3.select("#state");
var statekey = d3.select("#statelegend");

var path = d3.geoPath();
var statedata = new Array(57).fill(0);
console.log(statedata);
var USscale = [];
var indata = {};
svg.call(tip);

d3.csv('data/states.csv', function(error, sum)
	{
		console.log(sum);
		var USmax = 0, USmin = 0;
		var j = 0;
		for (var i = 0; i < sum.length; i++)
		{
			sum[i]["state ID"] = +sum[i]["state ID"];
			console.log(sum[i]["state ID"])
			sum[i].sum = +sum[i].sum;
			statedata[sum[i]["state ID"]] = sum[i].sum;
			if (sum[i].sum > USmax)
			{
				USmax = sum[i].sum;
			}
			else if (sum[i].sum < USmin)
			{
				USmin = sum[i].sum;
			}
		}
		var USstep = (Math.abs(USmax) + Math.abs(USmin)) / 9;
		for(var i = 0; i < 9; i++)
		{
			USscale.push(USmin + USstep * i);
		}
		USscale.push(USmax);
		console.log(USscale);
		drawUS(statedata);
		
		//legend
		var USlegend = USkey.append("defs")
		.append("svg:linearGradient")
		.attr("id", "USgradient")
		.attr("x1", "0%")
		.attr("y1", "100%")
		.attr("x2", "100%")
		.attr("y2", "100%")
		.attr("spreadMethod", "pad");

		USlegend.append("stop")
		.attr("offset", "0%")
		.attr("stop-color", "#FF0000")
		.attr("stop-opacity", 1);

		USlegend.append("stop")
		.attr("offset", "33%")
		.attr("stop-color", "#FF6900")
		.attr("stop-opacity", 1);

		USlegend.append("stop")
		.attr("offset", "66%")
		.attr("stop-color", "#8DFF00")
		.attr("stop-opacity", 1);

		USlegend.append("stop")
		.attr("offset", "100%")
		.attr("stop-color", "#24FF00")
		.attr("stop-opacity", 1);

		USkey.append("rect")
		.attr("width", w)
		.attr("height", h - 30)
		.style("fill", "url(#USgradient)")
		.attr("transform", "translate(0,10)");

		var y = d3.scaleLinear()
		.range([300, 0])
		.domain([USmax, USmin]);

		var yAxis = d3.axisBottom()
		.scale(y)
		.ticks(5);

		USkey.append("g")
		.attr("class", "y axis")
		.attr("transform", "translate(0,30)")
		.call(yAxis)
		.append("text")
		.attr("transform", "rotate(-90)")
		.attr("y", 0)
		.attr("dy", ".71em")
		.style("text-anchor", "end")
		.text("US Migration pattern");
		}
		)

function drawUS(statedata)
{	
	console.log(statedata);
	var UScolor = d3.scaleThreshold()
			.domain(USscale)
			.range(["#FF0000", "#FF3400", "#FF6900", "#FF9E00", "#FFD300", "#F7FF00", "#C2FF00", "#8DFF00", "#58FF00", "#24FF00"]);
	console.log(UScolor(statedata[+"09"]))
	d3.json("https://d3js.org/us-10m.v1.json", function(error, us) {
	  if (error) throw error;
	  console.log(statedata);
	  svg.append("g")
		.attr("class", "counties")
		.selectAll("path")
		.data(topojson.feature(us, us.objects.states).features)
		.enter().append("path")
		.attr("d", path)
		.attr("id", function(d){ return d.id;})
		.attr("fill", function(d) {console.log(d.id, statedata[+d.id]); return UScolor(statedata[d.id]);})
		.on("click", function(d)
		   {
				console.log(d);
				d3.selectAll(".states").remove();
		  		d3.selectAll("#statelegend > def").remove();
		  		d3.selectAll("#statelegend > g").remove();
				drawState(d.id);
			})

	  svg.append("path")
		  .attr("class", "state-borders counties")
		  .attr("d", path(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; })));
	});
}

function drawState(ID)
{
	 indata = {};
	var max = 0, min = 0;
	
	loaddata()
	
	function loaddata()
	{
		d3.csv("data/" + ID + ".csv", function(error, migration)
		{
			console.log(migration);
			if (error) throw error;
			for(var i = 0; i < migration.length; i++)
			{
				netflow = +migration[i].flow;
				indata[migration[i].County] = netflow;

				if (netflow > max)
				{
					max = netflow;
				}
				else if (netflow < min)
				{
					min = netflow;
				}
			} //for
			
			//legend
			var statelegend = statekey.append("defs")
			.append("svg:linearGradient")
			.attr("id", "gradient")
			.attr("x1", "0%")
			.attr("y1", "100%")
			.attr("x2", "100%")
			.attr("y2", "100%")
			.attr("spreadMethod", "pad");

			statelegend.append("stop")
			.attr("offset", "0%")
			.attr("stop-color", "#FF0000")
			.attr("stop-opacity", 1);

			statelegend.append("stop")
			.attr("offset", "33%")
			.attr("stop-color", "#FF6900")
			.attr("stop-opacity", 1);

			statelegend.append("stop")
			.attr("offset", "66%")
			.attr("stop-color", "#8DFF00")
			.attr("stop-opacity", 1);

			statelegend.append("stop")
			.attr("offset", "100%")
			.attr("stop-color", "#24FF00")
			.attr("stop-opacity", 1);

			statekey.append("rect")
			.attr("width", w)
			.attr("height", h - 30)
			.style("fill", "url(#gradient)")
			.attr("transform", "translate(0,10)");

			var y = d3.scaleLinear()
			.range([300, 0])
			.domain([max, min]);

			var yAxis = d3.axisBottom()
			.scale(y)
			.ticks(5);

			statekey.append("g")
			.attr("class", "y axis")
			.attr("transform", "translate(0,30)")
			.call(yAxis)
			.append("text")
			.attr("transform", "rotate(-90)")
			.attr("y", 0)
			.attr("dy", ".71em")
			.style("text-anchor", "end")
			.text("State Migration pattern");
			
			loadmap();
		}) //d3.csv
	} //loaddata
	
	function loadmap()
	{	
		var step = (Math.abs(max) + Math.abs(min)) / 9;
		var scale = [];
		for(var i = 0; i < 9; i++)
		{
			scale.push(min + step * i);
		}
		scale.push(max);
		var color = d3.scaleThreshold()
			.domain(scale)
			.range(["#FF0000", "#FF3400", "#FF6900", "#FF9E00", "#FFD300", "#F7FF00", "#C2FF00", "#8DFF00", "#58FF00", "#24FF00"]);
		d3.json("maps/" + ID + ".json", function(error, state)
		{
			console.log(state);
			if(error) throw error;
			var thestate = topojson.feature(state, state.objects.cb_2015_county_20m);
			var projection = d3.geoMercator()
				.fitExtent([[0, 0], [500, 500]],thestate);

			var statePath = d3.geoPath()
				.projection(projection);

			svgstate.append("g")
				.attr("class", "counties states")
				.selectAll("path")
				.data(topojson.feature(state, state.objects.cb_2015_county_20m).features)
				.enter().append("path")
				.attr("d", statePath)
				.attr("fill", function(d) {return color(indata[d.properties.NAME]);})
				.on("click", function(d){tip.show(d); console.log(d.properties.NAME); console.log(indata[d.properties.NAME])})
				.on("mouseout", function(d){tip.hide();});

			svgstate.append("path")
				.attr("class", "states")
				.attr("d", statePath);
		});
	} //loadmap
} //drawstate