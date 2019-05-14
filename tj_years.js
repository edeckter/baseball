var viz5_h=600
var viz5_w=800
var viz5_Padding={top:100, bottom:50, left:100, right:100};

//Set up tooltip div
var viz5_tooltip=d3.select("#viz5")
              .append("div")
              .style("position","absolute")
              .style("opacity",0)
              .style("background-color","white")
              .style("border", "solid")
              .style("border-width", "2px")
              .style("border-radius", "2px")
              .style("padding","5px")
              .style("pointer-events","none")
              .style("z-index","999");
              
//Set up svg for visualization
var viz5_svg=d3.select("#viz5")
          .append("svg")
          .attr("width",viz5_w)
          .attr("height",viz5_h);

//Line functions to create paths
var viz5_line1=d3.line()
                .x(function(d) {return viz5_xScale(d.Year);})
                .y(function(d) {return viz5_yScale(d.Total);});
var viz5_line2=d3.line()
                .x(function(d) {return viz5_xScale(d.Year);})
                .y(function(d) {return viz5_yScale(d["Position Players"]);});
var viz5_line3=d3.line()
                .x(function(d) {return viz5_xScale(d.Year);})
                .y(function(d) {return viz5_yScale(d["Pitchers"]);});

//Scaling function for x-axis
var viz5_xScale=d3.scaleLinear()
                  .range([viz5_Padding.left,viz5_w-viz5_Padding.right]);
   
//Scaling function for y-axis            
var viz5_yScale=d3.scaleLinear()
                  .range([viz5_h-viz5_Padding.bottom,viz5_Padding.top]);
                        
//Create x-axis
var viz5_xAxis=d3.axisBottom()
                 .scale(viz5_xScale)
                 .tickFormat(d3.format(".4"));
var viz5_displayxAxis=viz5_svg.append("g")
                              .attr("class","x-axis")
                              .attr("transform","translate(0,"+(viz5_h-viz5_Padding.bottom)+")");
            
//Create y-axis
var viz5_yAxis=d3.axisLeft()
                 .scale(viz5_yScale);
var viz5_displayyAxis=viz5_svg.append("g")
                              .attr("class","y-axis")
                              .attr("transform","translate("+viz5_Padding.left+",0)");
                              
//Create chart title
viz5_svg.append("text")
        .attr("x",viz5_Padding.left)
        .attr("y",viz5_Padding.top/2)
        .text("Number of Tommy John (UCL Repair) Surgeries Performed on MLB Players per Year")
        .attr("text-anchor","start")
        .attr("dominant-baseline","central")
        .attr("font-weight","bold");
            
d3.json('data/TJ_summary.json').then(function(tj_summary) {
    //Filter data to separate out average
    tj_years=tj_summary.filter(function(d) {return d.Year!="Avg";});
    
    //Set scale values
    viz5_xScale.domain([d3.min(tj_years,function(d) {return d.Year;}),
                    d3.max(tj_years,function(d) {return d.Year;})])
               .nice()
    viz5_displayxAxis.call(viz5_xAxis);
    viz5_yScale.domain([d3.min(tj_years,function(d) {return d.Total;}),
                    d3.max(tj_years,function(d) {return d.Total;})])
               .nice()
    viz5_displayyAxis.call(viz5_yAxis);
    viz5_svg.append("text")
            .attr("transform",function() {
                var y=(viz5_h-viz5_Padding.bottom-viz5_Padding.top)/2+viz5_Padding.top;
                var x=viz5_Padding.left/1.5;
                return "translate("+x+","+y+")rotate(-90)";
            })
            .attr("text-anchor","middle")
            .attr("dominant-baseline","central")
            .text("Number of Surgeries per Year");
    
    //Draw line charts
    var total=viz5_svg.append("g")
                      .attr("class","tj_series")
                      .attr("id","total");
    total.append("path")
         .datum(tj_years)
         .attr("d",viz5_line1)
         .style("fill","none")
         .style("stroke","#495769");
    total.selectAll("circle")
         .data(tj_years)
         .enter()
         .append("circle")
         .attr("cx",function(d) {return viz5_xScale(d.Year);})
         .attr("cy",function(d) {return viz5_yScale(d.Total);})
         .attr("r",2)
         .style("fill","#495769")
         .on("mouseover",function(d) {
             viz5_tooltip.style("opacity",1)
                         .style("left",d3.event.pageX+"px")
                         .style("top",d3.event.pageY+"px")
                         .html("Season: "+d.Year+"<br>Total Number of Surgeries: "+d.Total);
         })
        .on("mouseout",function() {viz5_tooltip.style("opacity",0);});
    //Draw line charts
    var position=viz5_svg.append("g")
                      .attr("class","tj_series")
                      .attr("id","position-players");
    position.append("path")
            .datum(tj_years)
            .attr("d",viz5_line2)
            .style("fill","none")
            .style("stroke","#A0C2BB");
    position.selectAll("circle")
            .data(tj_years)
            .enter()
            .append("circle")
            .attr("cx",function(d) {return viz5_xScale(d.Year);})
            .attr("cy",function(d) {return viz5_yScale(d["Position Players"]);})
            .attr("r",2)
            .style("fill","#A0C2BB")
            .on("mouseover",function(d) {
             viz5_tooltip.style("opacity",1)
                         .style("left",d3.event.pageX+"px")
                         .style("top",d3.event.pageY+"px")
                         .html("Season: "+d.Year+"<br>Number of Surgeries for Position Players: "+d["Position Players"]);
            })
            .on("mouseout",function() {viz5_tooltip.style("opacity",0);});
    //Draw line charts
    var pitchers=viz5_svg.append("g")
                      .attr("class","tj_series")
                      .attr("id","position");
    pitchers.append("path")
            .datum(tj_years)
            .attr("d",viz5_line3)
            .style("fill","none")
            .style("stroke","#F4A775");
    pitchers.selectAll("circle")
            .data(tj_years)
            .enter()
            .append("circle")
            .attr("cx",function(d) {return viz5_xScale(d.Year);})
            .attr("cy",function(d) {return viz5_yScale(d["Pitchers"]);})
            .attr("r",2)
            .style("fill","#F4A775")
            .on("mouseover",function(d) {
                viz5_tooltip.style("opacity",1)
                         .style("left",d3.event.pageX+"px")
                         .style("top",d3.event.pageY+"px")
                         .html("Season: "+d.Year+"<br>Number of Surgeries for Pitchers: "+d["Pitchers"]);
            })
            .on("mouseout",function() {viz5_tooltip.style("opacity",0);});
    
})