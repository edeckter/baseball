var viz7_h=800
var viz7_w=800
var viz7_Padding={top:100, bottom:50, left:100, right:100};
var viz7_plotwidth=viz7_w-viz7_Padding.left-viz7_Padding.right;

//Set up tooltip div
var viz7_tooltip=d3.select("#viz7")
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
var viz7_svg=d3.select("#viz7")
          .append("svg")
          .attr("width",viz7_w)
          .attr("height",viz7_h);
          
//Scaling function for y-axis            
var viz7_yScale=d3.scaleLinear()
                  .range([viz7_h-viz7_Padding.bottom,viz7_Padding.top])
                  .domain([0,72])
                  .nice();                      
            
//Create y-axis
var viz7_yAxis=d3.axisLeft()
                 .scale(viz7_yScale);
var viz7_displayyAxis=viz7_svg.append("g")
                              .attr("class","y-axis")
                              .attr("transform","translate("+viz7_Padding.left+",0)")
                              .call(viz7_yAxis);
//Add y-axis label
viz7_svg.append("text")
        .attr("class","y-label")
        .attr("transform",function() {
                var y=(viz7_h-viz7_Padding.bottom-viz7_Padding.top)/2+viz7_Padding.top;
                var x=viz7_Padding.left/2;
                return "translate("+x+","+y+") rotate(-90)";
            })
        .attr("text-anchor","middle")
        .attr("dominant-baseline","central")
        .text("Recovery Time (in months)");
                              
//Draw x-axis
viz7_svg.append("line")
        .attr("class","x-axis")
        .attr("x1",viz7_Padding.left)
        .attr("x2",viz7_w-viz7_Padding.right)
        .attr("y1",viz7_h-viz7_Padding.bottom)
        .attr("y2",viz7_h-viz7_Padding.bottom)
        .style("stroke","black");
viz7_svg.append("text")
        .attr("class","x-labels")
        .attr("x",viz7_Padding.left+viz7_plotwidth/4)
        .attr("y",viz7_h-viz7_Padding.bottom/2)
        .text("Position Players")
        .attr("text-anchor","middle")
        .attr("dominant-baseline","central");
viz7_svg.append("text")
        .attr("class","x-labels")
        .attr("x",viz7_Padding.left+3*viz7_plotwidth/4)
        .attr("y",viz7_h-viz7_Padding.bottom/2)
        .text("Pitchers")
        .attr("text-anchor","middle")
        .attr("dominant-baseline","central");
        
//Create chart title
viz7_svg.append("text")
        .attr("x",viz5_Padding.left)
        .attr("y",viz5_Padding.top/2)
        .text("Time (in months) from Tommy John Surgery to Return to MLB")
        .attr("text-anchor","start")
        .attr("dominant-baseline","central")
        .attr("font-weight","bold");
        
//Draw box and whisker plot
//Position Players
var position=viz7_svg.append("g")
                     .attr("id","position-players");
//IQR Box
position.append("rect")
        .attr("x",viz7_Padding.left+viz7_plotwidth/8)
        .attr("width",viz7_plotwidth/4)
        .attr("y",viz7_yScale(12))
        .attr("height",viz7_yScale(8.5)-viz7_yScale(12))
        .style("fill","white")
        .style("stroke","black")
        .on("mouseover",function(d) {
            viz7_tooltip.style("opacity",1)
                        .style("left",d3.event.pageX+"px")
                        .style("top",d3.event.pageY+"px")
                        .html("Position Player Recovery Summary:<br>Average: 10.7 months<br>Median: 10 months<br>First Quartile: 8.5 months<br>Third Quartile: 12 months<br>Interquartile Range: 3.5 months<br>Number of Outliers: 2");
        })
        .on("mouseout",function() {viz7_tooltip.style("opacity",0);});
//Median line
position.append("line")
        .attr("x1",viz7_Padding.left+viz7_plotwidth/8)
        .attr("x2",viz7_Padding.left+3*viz7_plotwidth/8)
        .attr("y1",viz7_yScale(10))
        .attr("y2",viz7_yScale(10))
        .style("stroke","black")
        .style("stroke-width",1.5)
        .attr("pointer-events","none");
//Bottom whisker
position.append("line")
        .attr("x1",viz7_Padding.left+viz7_plotwidth/4)
        .attr("x2",viz7_Padding.left+viz7_plotwidth/4)
        .attr("y1",viz7_yScale(6))
        .attr("y2",viz7_yScale(8.5))
        .style("stroke","black");
//Top whisker
position.append("line")
        .attr("x1",viz7_Padding.left+viz7_plotwidth/4)
        .attr("x2",viz7_Padding.left+viz7_plotwidth/4)
        .attr("y1",viz7_yScale(12))
        .attr("y2",viz7_yScale(17.25))
        .style("stroke","black");
//Outliers
position_outliers=[18,22];
position.selectAll("circle")
        .data(position_outliers)
        .enter()
        .append("circle")
        .attr("cx",viz7_Padding.left+viz7_plotwidth/4)
        .attr("cy",function(d) {return viz7_yScale(d);})
        .attr("r",3)
        .style("fill","black")
        .on("mouseover",function(d) {
            viz7_tooltip.style("opacity",1)
                        .style("left",d3.event.pageX+"px")
                        .style("top",d3.event.pageY+"px")
                        .html("Position Player Recovery Outlier:<br>"+d+" months");
        })
        .on("mouseout",function() {viz7_tooltip.style("opacity",0);});
        
//Pitchers
var pitchers=viz7_svg.append("g")
                     .attr("id","pitchers");
//IQR Box
pitchers.append("rect")
        .attr("x",viz7_Padding.left+5*viz7_plotwidth/8)
        .attr("width",viz7_plotwidth/4)
        .attr("y",viz7_yScale(23))
        .attr("height",viz7_yScale(13)-viz7_yScale(23))
        .style("fill","white")
        .style("stroke","black")
        .on("mouseover",function(d) {
            viz7_tooltip.style("opacity",1)
                        .style("left",d3.event.pageX+"px")
                        .style("top",d3.event.pageY+"px")
                        .html("Pitcher Recovery Summary:<br>Average: 21.0 months<br>Median: 17 months<br>First Quartile: 13 months<br>Third Quartile: 23 months<br>Interquartile Range: 10 months<br>Number of Outliers: 18");
        })
        .on("mouseout",function() {viz7_tooltip.style("opacity",0);});
//Median line
pitchers.append("line")
        .attr("x1",viz7_Padding.left+5*viz7_plotwidth/8)
        .attr("x2",viz7_Padding.left+7*viz7_plotwidth/8)
        .attr("y1",viz7_yScale(17))
        .attr("y2",viz7_yScale(17))
        .style("stroke","black")
        .style("stroke-width",1.5)
        .attr("pointer-events","none");
//Bottom whisker
pitchers.append("line")
        .attr("x1",viz7_Padding.left+3*viz7_plotwidth/4)
        .attr("x2",viz7_Padding.left+3*viz7_plotwidth/4)
        .attr("y1",viz7_yScale(7))
        .attr("y2",viz7_yScale(13))
        .style("stroke","black");
//Top whisker
pitchers.append("line")
        .attr("x1",viz7_Padding.left+3*viz7_plotwidth/4)
        .attr("x2",viz7_Padding.left+3*viz7_plotwidth/4)
        .attr("y1",viz7_yScale(23))
        .attr("y2",viz7_yScale(38))
        .style("stroke","black");
//Outliers
pitcher_outliers=[36,37,37,38,38,39,41,41,41,43,45,47,47,49,51,59,64,72];
pitchers.selectAll("circle")
        .data(pitcher_outliers)
        .enter()
        .append("circle")
        .attr("cx",viz7_Padding.left+3*viz7_plotwidth/4)
        .attr("cy",function(d) {return viz7_yScale(d);})
        .attr("r",3)
        .style("fill","black")
        .on("mouseover",function(d) {
            viz7_tooltip.style("opacity",1)
                        .style("left",d3.event.pageX+"px")
                        .style("top",d3.event.pageY+"px")
                        .html("Pitcher Recovery Outlier:<br>"+d+" months");
        })
        .on("mouseout",function() {viz7_tooltip.style("opacity",0);});
        
        