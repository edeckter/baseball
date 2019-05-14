var viz6_h=600
var viz6_w=1000
var viz6_Padding={top:100, bottom:50, left:100, right:100};

//Set up tooltip div
var viz6_tooltip=d3.select("#viz6")
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
var viz6_svg=d3.select("#viz6")
          .append("svg")
          .attr("width",viz6_w)
          .attr("height",viz6_h);

//Format return percent for display
var formatPercent=d3.format(".1%");

//Scaling function for x-axis
var viz6_widthScale=d3.scaleBand()
                 .rangeRound([viz6_Padding.left,viz6_w-viz6_Padding.right])
                 .paddingInner(0.2);
   
//Scaling function for y-axis            
var viz6_yScale=d3.scaleLinear()
                  .range([viz6_h-viz6_Padding.bottom,viz6_Padding.top])
                  .domain([0,1]);                       
            
//Create y-axis
var viz6_yAxis=d3.axisLeft()
                 .scale(viz6_yScale)
                 .tickFormat(d3.format(".0%"));
var viz6_displayyAxis=viz6_svg.append("g")
                              .attr("class","y-axis")
                              .attr("transform","translate("+viz6_Padding.left+",0)")
                              .call(viz6_yAxis);
                              
//Create chart title
viz6_svg.append("text")
        .attr("x",viz6_Padding.left)
        .attr("y",viz6_Padding.top/2)
        .text("Percentage of Players per Year Who Return to MLB After Tommy John Surgery by Surgery Year")
        .attr("text-anchor","start")
        .attr("dominant-baseline","central")
        .attr("font-weight","bold");
            
d3.json('data/TJ_summary.json').then(function(tj_summary) {
    //Filter data to separate out average
    tj_years=tj_summary.filter(function(d) {return d.Year!="Avg" & d.Year!=2018;});
    tj_avg=tj_summary.filter(function(d) {return d.Year=="Avg";});  
    
    //Update domain of width scale based on number of seasons for selected pitcher
    viz6_widthScale.domain(d3.range(tj_years.length));
    //Add x-axis labels
    viz6_svg.append("g")
             .attr("class","x-labels")
             .selectAll("text")
             .data(tj_years)
             .enter()
             .append("text")
             .attr("x",function(d,i) {return viz6_widthScale(i)+viz6_widthScale.bandwidth()/2;})
             .attr("y",viz6_h-viz6_Padding.bottom/1.5)
             .text(function(d) {return d.Year.substring(2);})
             .attr("text-anchor","middle")
             .attr("dominant-baseline","central");
    viz6_svg.append("line")
             .attr("x1",viz6_Padding.left)
             .attr("x2",viz6_w-viz6_Padding.right)
             .attr("y1",viz6_h-viz6_Padding.bottom)
             .attr("y2",viz6_h-viz6_Padding.bottom)
             .style("stroke","black");

    //Add text label for axes
    viz6_svg.append("text")
            .attr("transform",function() {
                var y=(viz6_h-viz6_Padding.bottom-viz6_Padding.top)/2+viz6_Padding.top;
                var x=viz6_Padding.left/2;
                return "translate("+x+","+y+")rotate(-90)";
            })
            .attr("text-anchor","middle")
            .attr("dominant-baseline","central")
            .text("Percent of Players who Return to MLB");
            
    viz6_svg.append("text")
            .attr("x",(viz6_w-viz6_Padding.left-viz6_Padding.right)/2+viz6_Padding.left)
            .attr("y",viz6_h-viz6_Padding.bottom/3)
            .attr("text-anchor","middle")
            .attr("dominant-baseline","central")
            .text("Surgery Year");
    
    //Draw bars charts
    viz6_svg.append("g")
            .attr("class","bars")
            .selectAll("rect")
            .data(tj_years)
            .enter()
            .append("rect")
            .attr("x", function(d,i) {return viz6_widthScale(i);})
            .attr("y", function(d) {return viz6_yScale(d["Return%"]);})
            .attr("width", viz6_widthScale.bandwidth())
            .attr("height", function(d) {return viz6_yScale(0)-viz6_yScale(d["Return%"]);})
            .attr("fill","#495769")
            .on("mouseover",function(d) {
                viz6_tooltip.style("opacity",1)
                            .style("left",d3.event.pageX+"px")
                            .style("top",d3.event.pageY+"px")
                            .html("Surgery Year: "+d.Year+"<br>Number of Surgeries: "+d.Total+"<br>% of Players Returned to MLB: "+formatPercent(d["Return%"]))
            })
            .on("mouseout",function() {viz6_tooltip.style("opacity",0);});
                            
    //Add average value line
    viz6_svg.append("line")
            .attr("class","average")
            .attr("x1",viz6_Padding.left)
            .attr("x2",viz6_w-viz6_Padding.right)
            .attr("y1", viz6_yScale(tj_avg[0]["Return%"]))
            .attr("y2", viz6_yScale(tj_avg[0]["Return%"]))
            .attr("stroke","black")
            .on("mouseover",function(d) {
                viz6_tooltip.style("opacity",1)
                            .style("left",d3.event.pageX+"px")
                            .style("top",d3.event.pageY+"px")
                            .html("Average Percentage of Players who Return from TJ Surgery for All Years:<br>"+formatPercent(tj_avg[0]["Return%"]))
            })
            .on("mouseout",function() {viz6_tooltip.style("opacity",0);});
            
    
})