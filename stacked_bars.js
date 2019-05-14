var viz2_h=800
var viz2_w=800
var viz2_Padding={top:100, bottom:50, left:150, right:150};

//Set up tooltip div
var viz2_tooltip=d3.select("#viz2")
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

//Set up svgs for stacked bar charts
var viz2_svg1=d3.select("#viz2")
          .append("svg")
          .attr("width",viz2_w)
          .attr("height",viz2_h);
var viz2_svg2=d3.select("#viz2")
          .append("svg")
          .attr("width",viz2_w)
          .attr("height",viz2_h);

//Create chart titles
var viz2_title1=viz2_svg1.append("text")
                         .attr("x",viz2_Padding.left/2)
                         .attr("y",viz2_Padding.top/2)
                         .text("Percentage of Pitches Thrown by Pitch Type and xFIP by Season")
                         .style("font-weight","bold");

var viz2_title2=viz2_svg2.append("text")
                         .attr("x",viz2_Padding.left/2)
                         .attr("y",viz2_Padding.top/2)
                         .text("Percentage of Batter Contact by Contact Type and Opponent BABIP by Season")
                         .style("font-weight","bold");
          
//Scaling function for y-axis            
var viz2_y1Scale=d3.scaleLinear()
             .range([viz2_h-viz2_Padding.bottom,viz2_Padding.top])
             .domain([0,1]);
//Scaling function for y-axis            
var viz2_y12Scale=d3.scaleLinear()
             .range([viz2_h-viz2_Padding.bottom,viz2_Padding.top]);
//Scaling function for y-axis            
var viz2_y22Scale=d3.scaleLinear()
             .range([viz2_h-viz2_Padding.bottom,viz2_Padding.top]);
//Scaling function for categories
var viz2_widthScale=d3.scaleBand()
                 .rangeRound([viz2_Padding.left,viz2_w-viz2_Padding.right])
                 .paddingInner(0.2);
                        
//Create primary y-axis
var viz2_y1Axis=d3.axisLeft()
            .scale(viz2_y1Scale)
            .tickFormat(d3.format(",.0%"));
//Display y-axis
viz2_svg1.append("g")
        .attr("class","y-axis")
        .attr("transform","translate("+viz2_Padding.left/2+",0)")
        .call(viz2_y1Axis);
viz2_svg2.append("g")
        .attr("class","y-axis")
        .attr("transform","translate("+viz2_Padding.left/2+",0)")
        .call(viz2_y1Axis);
viz2_svg1.append("text")
        .attr("class","viz2-axis-label")
        .attr("transform",function() {
                var y=(viz2_h-viz2_Padding.bottom-viz2_Padding.top)/2+viz2_Padding.top;
                var x=viz2_Padding.right/9;
                return "translate("+x+","+y+") rotate(-90)";
            })
        .attr("text-anchor","middle")
        .attr("dominant-baseline","central")
        .text("Percent of Total Pitches Thrown");
viz2_svg2.append("text")
        .attr("class","viz2-axis-label")
        .attr("transform",function() {
                var y=(viz2_h-viz2_Padding.bottom-viz2_Padding.top)/2+viz2_Padding.top;
                var x=viz2_Padding.right/9;
                return "translate("+x+","+y+") rotate(-90)";
            })
        .attr("text-anchor","middle")
        .attr("dominant-baseline","central")
        .text("Percent of Contact by Type");

//Create secondary y-axis for first chart
var viz2_y12Axis=d3.axisRight()
                   .scale(viz2_y12Scale);
viz2_svg1.append("text")
        .attr("class","viz2-axis-label")
        .attr("transform",function() {
                var y=(viz2_h-viz2_Padding.bottom-viz2_Padding.top)/2+viz2_Padding.top;
                var x=viz2_w-viz2_Padding.right/4;
                return "translate("+x+","+y+") rotate(90)";
            })
        .attr("text-anchor","middle")
        .attr("dominant-baseline","central")
        .text("xFIP");
//Create secondary y-axis for second chart
var viz2_y22Axis=d3.axisRight()
                   .scale(viz2_y22Scale);
viz2_svg2.append("text")
        .attr("class","viz2-axis-label")
        .attr("transform",function() {
                var y=(viz2_h-viz2_Padding.bottom-viz2_Padding.top)/2+viz2_Padding.top;
                var x=viz2_w-viz2_Padding.right/6;
                return "translate("+x+","+y+") rotate(90)";
            })
        .attr("text-anchor","middle")
        .attr("dominant-baseline","central")
        .text("Opponent BABIP");

//Colors for points and lines
var pitch_colors=["#495769","#A0C2BB","#F4A775","#F4C667","#F37361","#FE938C","#E6B89C","#EAD2AC"];

//Scale display numbers
var formatDecimal=d3.format(".3n");
var formatPercent=d3.format(",.1%");

//Set up stack methods
var keys1=["FB%","SL%","CT%","CB%","CH%","SF%","KN%","XX%"]
var stack1=d3.stack()
             .keys(keys1);
var keys2=["Soft%","Med%","Hard%"];
var stack2=d3.stack()
             .keys(keys2);
             
//Set up line function for first bar chart
var line1=d3.line()
            .x(function(d,i) {return viz2_widthScale(i)+viz2_widthScale.bandwidth()/2;})
            .y(function(d) {return viz2_y12Scale(d.xFIP);});
var line2=d3.line()
            .x(function(d,i) {return viz2_widthScale(i)+viz2_widthScale.bandwidth()/2;})
            .y(function(d) {return viz2_y12Scale(d.Avg_xFIP);});
//Set up line function for second bar chart
var line3=d3.line()
            .x(function(d,i) {return viz2_widthScale(i)+viz2_widthScale.bandwidth()/2;})
            .y(function(d) {return viz2_y22Scale(d.BABIP);});
var line4=d3.line()
            .x(function(d,i) {return viz2_widthScale(i)+viz2_widthScale.bandwidth()/2;})
            .y(function(d) {return viz2_y22Scale(d.Avg_BABIP);});
             
//Convert keys to readable text
var types={"FB%":"Fastball","SL%":"Slider","CT%":"Cutter","CB%":"Curveball","CH%":"Change-Up","SF%":"Split-Finger","KN%":"Knuckleball","XX%":"Unknown Pitch"}
                      
d3.json('data/historical_trends.json').then(function(historical) {
d3.json('data/cyyoung_pitcher_list.json').then(function(pitchers) {     
    var player="Jacob deGrom"; //Default player displayed on load
    var label1="" //Blank variable for stack labels
    var label2=""
    
    //Draw drop-down to select pitcher
    var viz2_dropdown1=d3.select("#viz2_dropdown1")
                     .insert("select")
                     .on("change",function() {
                                player=d3.select(this).property("value");
                                draw_bars(player);
                     });
    d3.csv('data/cyyoung_dropdown.csv').then(function(name_list) {
        //Populate options and change scatterplot
        viz2_dropdown1.selectAll("option")
                      .data(name_list)
                      .enter()
                      .append("option")
                      .attr("value", function(d) {return d.Name;})
                      .text(function(d) {return d.Name;})
                      .property("selected",function(d) {return d.Name==player;});
        })
    
    var draw_bars=function(player) {
        //Clear previous data
        viz2_svg1.selectAll(".x-labels")
                .remove();
        viz2_svg1.selectAll(".stacked-bars")
                .remove();
        viz2_svg1.selectAll(".stat_line")
                .remove();
        viz2_svg1.selectAll(".stat_points")
                .remove();
        
        var pitcher=pitchers.filter(function(d) {return d.Name==player;});
        var temp=[];
        var filtered=Array();
        var filter_historical_stats=function(d) {
            for (var i=0; i<d.length; i++) {
                temp[i]=d[i].Season;                
                filtered=filtered.concat(historical.filter(function(d) {return d.Season==temp[i];}));
            }
            filtered=filtered.filter(function(d) {return d.Type=="All Pitchers";})
                             .filter(function(d) {return d.League=="MLB";});
            return filtered;
        }
        var historical_filtered=filter_historical_stats(pitcher)

        //Add zeroes for blank key values
        for (var j=0;j<pitcher.length;j++) {
            for (var i=0;i<keys1.length;i++) {
                
                if (!pitcher[j][keys1[i]]) {pitcher[j][keys1[i]]=0;}
            }
        }

        //Update domain of width scale based on number of seasons for selected pitcher
        viz2_widthScale.domain(d3.range(pitcher.length));
        //Add x-axis labels
        viz2_svg1.append("g")
                .attr("class","x-labels")
                .selectAll("text")
                .data(pitcher)
                .enter()
                .append("text")
                .attr("x",function(d,i) {return viz2_widthScale(i)+viz2_widthScale.bandwidth()/2;})
                .attr("y",viz2_h-viz2_Padding.bottom/2)
                .text(function(d) {return d.Season;})
                .attr("text-anchor","middle")
                .attr("dominant-baseline","central");
        viz2_svg1.append("line")
                .attr("x1",viz2_Padding.left/2)
                .attr("x2",viz2_w-viz2_Padding.right/2)
                .attr("y1",viz2_h-viz2_Padding.bottom)
                .attr("y2",viz2_h-viz2_Padding.bottom)
                .style("stroke","black");
                
        //Update domain for secondary y-axis
        viz2_y12Scale.domain([0,11.5])
                     .nice();
        //Draw secondary y-axis      
        viz2_svg1.append("g")
                .attr("class","y-axis")
                .attr("transform","translate("+(viz2_w-viz2_Padding.right/2)+",0)").call(viz2_y12Axis);
                
        var pitch_type=stack1(pitcher);
        //Ensure all values add to 1
        for (var i=0;i<pitch_type[pitch_type.length-1].length;i++) {
            pitch_type[pitch_type.length-1][i][1]=1;
        }
        
        //Create stacked bars
        viz2_svg1.append("g")
                         .attr("class","stacked-bars");
        
        var bars=viz2_svg1.select(".stacked-bars")
                .selectAll("g")
                .data(pitch_type)
                .enter()
                .append("g")
                .attr("class","stacked-bar")
                .attr("fill",function(d,i) {return pitch_colors[i];})
                .on("mouseover",function(d,i) {
                    label1=keys1[i];
                });
     
        bars.selectAll("rect")
                .data(function(d) {return d;})
                .enter()
                .append("rect")
                .attr("class","bar")
                .attr("x", function(d,i) {return viz2_widthScale(i);})
                .attr("y", function(d) {return viz2_y1Scale(d[1]);})
                .attr("width", viz2_widthScale.bandwidth())
                .attr("height", function(d) {return viz2_y1Scale(d[0])-viz2_y1Scale(d[1]);})
                .on("mousemove",function(d,i) {
                    viz2_tooltip.style("opacity",1)
                                .style("left",d3.event.pageX+"px")
                                .style("top",d3.event.pageY+"px")
                                .html(types[label1]+": "+formatPercent(d[1]-d[0]));
                })
                .on("mouseout",function(d) {viz2_tooltip.style("opacity",0);});
                
        //Add xFIP line on secondary axis
        viz2_svg1.append("path")
                .attr("class","stat_line")
                .datum(pitcher)
                .attr("d",line1)
                .style("stroke","red")
                .style("fill","none");
        viz2_svg1.append("g")
                 .attr("class","stat_points")
                 .selectAll("circle")
                 .data(pitcher)
                 .enter()
                 .append("circle")
                 .attr("cx",function(d,i) {return viz2_widthScale(i)+viz2_widthScale.bandwidth()/2;})
                 .attr("cy",function(d) {return viz2_y12Scale(d.xFIP);})
                 .attr("r",3)
                 .style("stroke","red")
                 .style("fill","red")
                 .style("z-index","999")
                 .on("mouseover",function(d) {
                    viz2_tooltip.style("opacity",1)
                                .style("left",d3.event.pageX+"px")
                                .style("top",d3.event.pageY+"px")
                                .html("Season: "+d.Season+"<br>xFIP: "+formatDecimal(d.xFIP)+"<br>Wins: "+d.W+"<br>Losses: "+d.L+"<br>Games: "+d.G+"<br>Games Started: "+d.GS);
                 })
                 .on("mouseout",function(d) {viz2_tooltip.style("opacity",0);});
        //Add league xFIP on secondary axis        
        viz2_svg1.append("path")
                .attr("class","stat_line")
                .datum(historical_filtered)
                .attr("d",line2)
                .style("stroke","black")
                .style("fill","none");
        viz2_svg1.append("g")
                 .attr("class","stat_points")
                 .selectAll("circle")
                 .data(historical_filtered)
                 .enter()
                 .append("circle")
                 .attr("cx",function(d,i) {return viz2_widthScale(i)+viz2_widthScale.bandwidth()/2;})
                 .attr("cy",function(d) {return viz2_y12Scale(d.Avg_xFIP);})
                 .attr("r",3)
                 .style("stroke","black")
                 .style("fill","black")
                 .on("mouseover",function(d) {
                    viz2_tooltip.style("opacity",1)
                                .style("left",d3.event.pageX+"px")
                                .style("top",d3.event.pageY+"px")
                                .html("Season: "+d.Season+"<br>MLB Average<br>xFIP: "+formatDecimal(d.Avg_xFIP));
                 })
                 .on("mouseout",function(d) {viz2_tooltip.style("opacity",0);});
    
//Start next bar chart
        //Clear previous data
        viz2_svg2.selectAll(".x-labels")
                .remove();
        viz2_svg2.selectAll(".stacked-bars")
                .remove();
        viz2_svg2.selectAll(".stat_line")
                .remove();
        viz2_svg2.selectAll(".stat_points")
                .remove();

        //Add x-axis labels
        viz2_svg2.append("g")
                .attr("class","x-labels")
                .selectAll("text")
                .data(pitcher)
                .enter()
                .append("text")
                .attr("x",function(d,i) {return viz2_widthScale(i)+viz2_widthScale.bandwidth()/2;})
                .attr("y",viz2_h-viz2_Padding.bottom/2)
                .text(function(d) {return d.Season;})
                .attr("text-anchor","middle")
                .attr("dominant-baseline","central");
        viz2_svg2.append("line")
                .attr("x1",viz2_Padding.left/2)
                .attr("x2",viz2_w-viz2_Padding.right/2)
                .attr("y1",viz2_h-viz2_Padding.bottom)
                .attr("y2",viz2_h-viz2_Padding.bottom)
                .style("stroke","black");
                
        //Update domain for secondary y-axis
        viz2_y22Scale.domain([0,0.615])
                     .nice();
        //Draw secondary y-axis      
        viz2_svg2.append("g")
                .attr("class","y-axis")
                .attr("transform","translate("+(viz2_w-viz2_Padding.right/2)+",0)").call(viz2_y22Axis);
                
        var contact_type=stack2(pitcher);
        
        //Create stacked bars
        viz2_svg2.append("g")
                 .attr("class","stacked-bars");
        
        var bars2=viz2_svg2.select(".stacked-bars")
                .selectAll("g")
                .data(contact_type)
                .enter()
                .append("g")
                .attr("class","stacked-bar")
                .attr("fill",function(d,i) {return pitch_colors[i];})
                .on("mouseover",function(d,i) {
                    label2=i;
                });
     
        bars2.selectAll("rect")
                .data(function(d) {return d;})
                .enter()
                .append("rect")
                .attr("class","bar")
                .attr("x", function(d,i) {return viz2_widthScale(i);})
                .attr("y", function(d) {return viz2_y1Scale(d[1]);})
                .attr("width", viz2_widthScale.bandwidth())
                .attr("height", function(d) {return viz2_y1Scale(d[0])-viz2_y1Scale(d[1]);})
                .on("mousemove",function(d,i) {
                    viz2_tooltip.style("opacity",1)
                                .style("left",d3.event.pageX+"px")
                                .style("top",d3.event.pageY+"px")
                                .html(keys2[label2]+": "+formatPercent(d[1]-d[0]));
                })
                .on("mouseout",function(d) {viz2_tooltip.style("opacity",0);});
                
        //Add pitcher Opponent BABIP line on secondary axis
        viz2_svg2.append("path")
                .attr("class","stat_line")
                .datum(pitcher)
                .attr("d",line3)
                .style("stroke","red")
                .style("fill","none");
        viz2_svg2.append("g")
                 .attr("class","stat_points")
                 .selectAll("circle")
                 .data(pitcher)
                 .enter()
                 .append("circle")
                 .attr("cx",function(d,i) {return viz2_widthScale(i)+viz2_widthScale.bandwidth()/2;})
                 .attr("cy",function(d) {return viz2_y22Scale(d.BABIP);})
                 .attr("r",3)
                 .style("stroke","red")
                 .style("fill","red")
                 .style("z-index","999")
                 .on("mouseover",function(d) {
                    viz2_tooltip.style("opacity",1)
                                .style("left",d3.event.pageX+"px")
                                .style("top",d3.event.pageY+"px")
                                .html("Season: "+d.Season+"<br>Opponent BABIP: "+formatDecimal(d.BABIP)+"<br>Wins: "+d.W+"<br>Losses: "+d.L+"<br>Games: "+d.G+"<br>Games Started: "+d.GS);
                 })
                 .on("mouseout",function(d) {viz2_tooltip.style("opacity",0);});
        //Add league Opponent BABIP line on secondary axis        
        viz2_svg2.append("path")
                .attr("class","stat_line")
                .datum(historical_filtered)
                .attr("d",line4)
                .style("stroke","black")
                .style("fill","none");
        viz2_svg2.append("g")
                 .attr("class","stat_points")
                 .selectAll("circle")
                 .data(historical_filtered)
                 .enter()
                 .append("circle")
                 .attr("cx",function(d,i) {return viz2_widthScale(i)+viz2_widthScale.bandwidth()/2;})
                 .attr("cy",function(d) {return viz2_y22Scale(d.Avg_BABIP);})
                 .attr("r",3)
                 .style("stroke","black")
                 .style("fill","black")
                 .on("mouseover",function(d) {
                    viz2_tooltip.style("opacity",1)
                                .style("left",d3.event.pageX+"px")
                                .style("top",d3.event.pageY+"px")
                                .html("Season: "+d.Season+"<br>MLB Average<br>Opponent BABIP: "+formatDecimal(d.Avg_BABIP));
                 })
                 .on("mouseout",function(d) {viz2_tooltip.style("opacity",0);});
    };
    
    //Draw initial plot
    draw_bars(player);
})
});