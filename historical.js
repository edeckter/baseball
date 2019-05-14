var viz3_h=400;
var viz3_w=600;
var viz3_Padding={top: 100, bottom: 50, left: 50, right: 50};
var plot_width=viz3_w-viz3_Padding.left-viz3_Padding.right;
var plot_height=viz3_h-viz3_Padding.top-viz3_Padding.bottom;

//Scaling function for x-axis
var viz3_xScale=d3.scaleLinear()
             .range([viz3_Padding.left,viz3_w-viz3_Padding.right]);
            
//Scaling function for y-axis            
var viz3_yScale=d3.scaleLinear()
                  .range([viz3_h-viz3_Padding.bottom,viz3_Padding.top]);           
             
//Create x-axis
var viz3_xAxis=d3.axisBottom()
                 .scale(viz3_xScale)
                 .tickFormat(d3.format(".4"));
                        
//Create y-axis
var viz3_yAxis=d3.axisLeft()
            .scale(viz3_yScale)
            //.tickFormat(d3.format("$.2s"));
           
//Create drop-down options
var stats_keys=["Average Total Outs","Average ERA","Average Strikeouts per 9","Average Walks per 9","Average FIP","Average xFIP","Average WHIP","Average BABIP","Total Complete Games",
"Average Outs per Game","Average Pitches per Game","Average Batters Faced per 9","Average Fastball Velocity"]
var stats={"Average Total Outs":"Avg_Total_Outs","Average ERA":"Avg_ERA","Average Strikeouts per 9":"Avg_K/9","Average Walks per 9":"Avg_BB/9","Average FIP":"Avg_FIP","Average xFIP":"Avg_xFIP","Average WHIP":"Avg_WHIP","Average BABIP":"Avg_BABIP","Total Complete Games":"Total_CompleteGames","Average Pitches per Game":"Avg_Pitches/Game",
"Average Outs per Game":"Avg_Outs/Game","Average Batters Faced per 9":"Avg_BattersFaced/9","Average Fastball Velocity":"Avg_FBv"}

//Create svgs and tie to div
var viz3_svg1=d3.select("#viz3")
          .append("svg")
          .attr("class","svg")
          .attr("id","svg1")
          .attr("width",viz3_w)
          .attr("height",viz3_h);
          
var viz3_svg2=d3.select("#viz3")
          .append("svg")
          .attr("class","svg")
          .attr("id","svg2")
          .attr("width",viz3_w)
          .attr("height",viz3_h);
          
var viz3_svg3=d3.select("#viz3")
          .append("svg")
          .attr("class","svg")
          .attr("id","svg3")
          .attr("width",viz3_w)
          .attr("height",viz3_h);
          
//Format date for tooltip
var formatDecimal=d3.format(".3n");

// Define the div for the tooltip
var viz3_tooltip=d3.select("#viz3")
            .append("div")	
            .attr("class","tooltip")
            .style("opacity",0)
            .style("background-color", "white")
            .style("border", "solid")
            .style("border-width", "2px")
            .style("border-radius", "2px")
            .style("padding", "5px")
            .style("position","absolute");
          
d3.json("data/historical_trends.json").then(function(historical) {
    //Set initial stat
    var selected_stat="Avg_ERA";
    //Filter for MLB (all leagues) only
    var historical_MLB=historical.filter(function(d) {return d.League=="MLB";});

    //Add drop-down menu
    var viz3_dropdown1=d3.select("#viz3_dropdown1")
                         .insert("select")
                         .on("change",function() {
                             selected_stat=d3.select(this).property("value");
                             draw_chart(selected_stat);
                         });

    //Populate options and change scatterplot
    viz3_dropdown1.selectAll("option")
                  .data(stats_keys)
                  .enter()
                  .append("option")
                  .attr("value", function(d) {return stats[d];})
                  .text(function(d) {return d;})
                  .property("selected",function(d) {return d=="Average ERA";});
    
    var draw_chart=function(selected_stat) {
        //Filter based on stat to get correct x-axis (for stats that do not stretch back to 1900)
        historical_MLB=historical_MLB.filter(function(d) {return d[selected_stat];});
        if (historical_MLB.length==0) {zooming(1);};
        
        //Clear existing chart
        d3.select("#viz3")
          .selectAll(".plot")
          .remove();
        d3.select("#viz3")
          .selectAll(".x-axis")
          .remove();
        d3.select("#viz3")
          .selectAll(".y-axis")
          .remove();
        
        //Add xScale domain
        viz3_xScale.domain([d3.min(historical_MLB,function(d) {return d.Season;}),
                    d3.max(historical_MLB,function(d) {return d.Season;})])
                .nice();
                
        //Add yScale domain
        viz3_yScale.domain([d3.min(historical_MLB,function(d) {return d[selected_stat];}),
                    d3.max(historical_MLB,function(d) {return d[selected_stat];})])
                .nice();

        //Display x-axis
        viz3_svg1.append("g")
             .attr("class","x-axis")
             .attr("transform","translate(0,"+(viz3_h-viz3_Padding.bottom)+")")
             .call(viz3_xAxis);
        viz3_svg2.append("g")
             .attr("class","x-axis")
             .attr("transform","translate(0,"+(viz3_h-viz3_Padding.bottom)+")")
             .call(viz3_xAxis);
        viz3_svg3.append("g")
             .attr("class","x-axis")
             .attr("transform","translate(0,"+(viz3_h-viz3_Padding.bottom)+")")
             .call(viz3_xAxis);
    
        //Display y-axis
        viz3_svg1.append("g")
        .attr("class","y-axis")
        .attr("transform","translate("+viz3_Padding.left+",0)")
        .call(viz3_yAxis);
        viz3_svg2.append("g")
        .attr("class","y-axis")
        .attr("transform","translate("+viz3_Padding.left+",0)")
        .call(viz3_yAxis);
        viz3_svg3.append("g")
        .attr("class","y-axis")
        .attr("transform","translate("+viz3_Padding.left+",0)")
        .call(viz3_yAxis);

        //Add chart directions
        viz3_svg1.append("g")
                 .attr("class","subtitle")
                .append("text")
                .text("Click and drag on any chart to zoom")
                .attr("x",viz3_Padding.left)
                .attr("y",viz3_Padding.top/3)
                .attr("text-anchor","start")
                .attr("dominant-baseline","central");
        
        //Add chart titles
        viz3_svg1.append("g")
            .attr("class","title")
            .append("text")
            .text("All Pitchers")
            .attr("x",viz3_Padding.left)
            .attr("y",viz3_Padding.top/1.5)
            .attr("text-anchor","start")
            .attr("dominant-baseline","central")
            .attr("font-weight","bold"); 
        viz3_svg2.append("g")
            .attr("class","title")
            .append("text")
            .text("Starters")
            .attr("x",viz3_Padding.left)
            .attr("y",viz3_Padding.top/1.5)
            .attr("text-anchor","start")
            .attr("dominant-baseline","central")
            .attr("font-weight","bold"); 
        viz3_svg3.append("g")
            .attr("class","title")
            .append("text")
            .text("Relievers")
            .attr("x",viz3_Padding.left)
            .attr("y",viz3_Padding.top/1.5)
            .attr("text-anchor","start")
            .attr("dominant-baseline","central")
            .attr("font-weight","bold"); 
    
        //Line path function
        var viz3_line1=d3.line()
                         .x(function(d) {return viz3_xScale(d.Season);})
                         .y(function(d) {return viz3_yScale(d[selected_stat]);});
    
        //Draw MLB chart
        var MLB_chart=viz3_svg1.append("g")
                               .attr("class","plot");
        MLB_chart.append("path")
                 .datum(historical_MLB.filter(function(d) {return d.Type=="All Pitchers";}))
                 .attr("d",viz3_line1)
                 .style("stroke","#495769")
                 .style("fill","none")
                 .attr("pointer-events","none");
        MLB_chart.append("g")
                 .attr("class","points")
                 .selectAll("circle")
                 .data(historical_MLB.filter(function(d) {return d.Type=="All Pitchers";}))
                 .enter()
                 .append("circle")
                 .attr("cx",function(d) {return viz3_xScale(d.Season);})
                 .attr("cy",function(d) {return viz3_yScale(d[selected_stat]);})
                 .attr("r",2)
                 .style("fill","#495769")
                .on("mouseover",function(d) {
                    viz3_tooltip.style("opacity",1)
                                .style("left",d3.event.pageX+"px")
                                .style("top",d3.event.pageY+"px")
                                .html("All Pitchers<br>Season: "+d.Season+"<br>"+selected_stat+": "+formatDecimal(d[selected_stat]));
                })
                .on("mouseout",function(d) {viz3_tooltip.style("opacity",0);});
        //Draw Starters chart
        var Starters_chart=viz3_svg2.append("g")
                               .attr("class","plot");
        Starters_chart.append("path")
                 .datum(historical_MLB.filter(function(d) {return d.Type=="Starter";}))
                 .attr("d",viz3_line1)
                 .style("stroke","#495769")
                 .style("fill","none")
                 .attr("pointer-events","none");
        Starters_chart.append("g")
                 .attr("class","points")
                 .selectAll("circle")
                 .data(historical_MLB.filter(function(d) {return d.Type=="Starter";}))
                 .enter()
                 .append("circle")
                 .attr("cx",function(d) {return viz3_xScale(d.Season);})
                 .attr("cy",function(d) {return viz3_yScale(d[selected_stat]);})
                 .attr("r",2)
                 .style("fill","#495769")
                .on("mouseover",function(d) {
                    viz3_tooltip.style("opacity",1)
                                .style("left",d3.event.pageX+"px")
                                .style("top",d3.event.pageY+"px")
                                .html("Starting Pitchers<br>Season: "+d.Season+"<br>"+selected_stat+": "+formatDecimal(d[selected_stat]));
                })
                .on("mouseout",function(d) {viz3_tooltip.style("opacity",0);});
        //Draw Relievers chart
        var Relievers_chart=viz3_svg3.append("g")
                               .attr("class","plot");
        Relievers_chart.append("path")
                 .datum(historical_MLB.filter(function(d) {return d.Type=="Reliever";}))
                 .attr("d",viz3_line1)
                 .style("stroke","#495769")
                 .style("fill","none")
                 .attr("pointer-events","none");
        Relievers_chart.append("g")
                 .attr("class","points")
                 .selectAll("circle")
                 .data(historical_MLB.filter(function(d) {return d.Type=="Reliever";}))
                 .enter()
                 .append("circle")
                 .attr("cx",function(d) {return viz3_xScale(d.Season);})
                 .attr("cy",function(d) {return viz3_yScale(d[selected_stat]);})
                 .attr("r",2)
                 .style("fill","#495769")
                .on("mouseover",function(d) {
                    viz3_tooltip.style("opacity",1)
                                .style("left",d3.event.pageX+"px")
                                .style("top",d3.event.pageY+"px")
                                .html("Relief Pitchers<br>Season: "+d.Season+"<br>"+selected_stat+": "+formatDecimal(d[selected_stat]));
                })
                .on("mouseout",function(d) {viz3_tooltip.style("opacity",0);});

             
    }
    //Draw initial charts
    draw_chart(selected_stat);
    
    //Draw reset button
    var reset_button=viz3_svg1.append("g")
                              .attr("class","button")
                              .style("cursor","pointer")
                              .on("click",function() {
                                    var reset=1;
                                    zooming(reset);
                              });  
    reset_button.append("rect")
                .attr("id","reset")
                .attr("x",viz3_w-viz3_Padding.left-80)
                .attr("y",viz3_Padding.top/2)
                .attr("width",100)
                .attr("height",viz3_Padding.top/4)
                .attr("fill","white")
                .attr("stroke","black");
    //Add text to key buttons
    reset_button.append("text")
                .attr("x",viz3_w-viz3_Padding.left-30)
                .attr("y",5*viz3_Padding.top/8)
                .attr("text-anchor","middle")
                .attr("dominant-baseline","central")
                .text("Reset Zoom");                  
     
    //Add zoom by rectangle function
    var zooming=function(reset) {
        if (reset==1) {
            var new_min=d3.min(historical,function(d) {return d.Season;});
            var new_max=d3.max(historical,function(d) {return d.Season;});
        } else {
            var x1=parseFloat(d3.select(".zoom").attr("x"));
            var x2=parseFloat(d3.select(".zoom").attr("width"));
            var new_min=viz3_xScale.invert(x1);
            var new_max=viz3_xScale.invert(x1+x2);
        };

        //Update dataset
        historical_MLB=historical.filter(function(d) {return d.League=="MLB";})
                                 .filter(function(d) {return d[selected_stat];})
                                 .filter(function(d) {return d.Season<=new_max && d.Season>=new_min;});
       
        //Redraw area chart       
        draw_chart(selected_stat);
    };
    
    viz3_svg1.on("mousedown",zoom_box);
    viz3_svg2.on("mousedown",zoom_box);
    viz3_svg3.on("mousedown",zoom_box);
    
    function zoom_box() {
            d3.event.preventDefault(); // disable text dragging
            var e=this;
            var origin = d3.mouse(e);
            var rect = d3.select("#"+this.id).append("rect").attr("class", "zoom");
            origin[0] = Math.max(0, Math.min(plot_width, origin[0]));
            origin[1] = Math.max(0, Math.min(plot_height, origin[1]));
            d3.select(window)
              .on("mousemove",mousemove)
              .on("mouseup",function() {
                  d3.select(window).on("mousemove",null).on("mouseup",null);
                  var m=d3.mouse(e);
                  m[0] = Math.max(0, Math.min(plot_width+viz3_Padding.left, m[0]));
                  m[1] = Math.max(0, Math.min(plot_height+viz3_Padding.top, m[1]));
                  if (m[0] !== origin[0] && m[1] !== origin[1]) {
                      zooming(0);
                  }
                  rect.remove();
               });
            
            function mousemove() {
                var m=d3.mouse(e);
                m[0] = Math.max(0, Math.min(plot_width+viz3_Padding.left, m[0]));
                m[1] = Math.max(0, Math.min(plot_height+viz3_Padding.top, m[1]));
                rect.attr("x", Math.min(origin[0], m[0]))
                    .attr("y", Math.min(origin[1], m[1]))
                    .attr("width", Math.abs(m[0] - origin[0]))
                    .attr("height", Math.abs(m[1] - origin[1]))
                    .attr("fill","none")
                    .attr("stroke","blue");
            }
    }
});
            
