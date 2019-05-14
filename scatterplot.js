var viz1_h=800
var viz1_w=800
var viz1_Padding={top:100, bottom:50, left:100, right:100};

//Set up div for tooltip
var viz1_tooltip=d3.select("#viz1")
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

//Set up title div
var viz1_title=d3.select("#viz1")
                 .append("div")
                 .style("position","relative")
                 .style("top",viz1_Padding.top/3+"px")
                 .style("left",viz1_Padding.left+"px");

              
//Set up svg for visualization
var viz1_svg=d3.select("#viz1")
          .append("svg")
          .attr("width",viz1_w)
          .attr("height",viz1_h);        

//Scaling function for x-axis
var viz1_xScale=d3.scaleLinear()
              .range([viz1_Padding.left,viz1_w-viz1_Padding.right]);
            
//Scaling function for y-axis            
var viz1_yScale=d3.scaleLinear()
             .range([viz1_h-viz1_Padding.bottom,viz1_Padding.top]);

//Create x-axis
var viz1_xAxis=d3.axisBottom()
            .scale(viz1_xScale);
                        
//Create y-axis
var viz1_yAxis=d3.axisLeft()
            .scale(viz1_yScale);
            
//Available years for drop-down
var seasons = [];
for (var i = 1990; i <= 2018; i++) {
    seasons.push(i);
}

//Colors for points and lines
var pitcher_colors={Starter:"#495769",Reliever:"#A0C2BB"};

//Scale display numbers
var formatDecimal=d3.format(".3n");
                       
d3.json('data/master_pitcher_list.json').then(function(master) {  
    //Set up scatterplot framework
    var viz1_displayxAxis=viz1_svg.append("g")
                                 .attr("class","x-axis")
                                 .attr("transform","translate(0,"+(viz1_h-viz1_Padding.bottom)+")")
    
    var viz1_displayyAxis=viz1_svg.append("g")
                                 .attr("class","y-axis")
                                 .attr("transform","translate("+viz1_Padding.left+",0)")                             
    
    //Initial values for visualization
    var selected_stat="xFIP";
    var year=2018;
    var league="MLB";
    var innings_min=50;

    //Select stat to display
    var pick_stat=function(d) {
        if (selected_stat=="ERA") {return d.ERA;
        } else if (selected_stat=="FIP") {return d.FIP;
        } else if (selected_stat=="xFIP") {return d.xFIP;
        } else if (selected_stat=="K/9") {return d["K/9"];
        } else if (selected_stat=="BB/9") {return d["BB/9"];
        } else if (selected_stat=="WHIP") {return d.WHIP;
        } else {return d.WAR;}
    }
    
    var pick_avg_stat=function(d) {
        if (selected_stat=="ERA") {return d.Avg_ERA;
        } else if (selected_stat=="FIP") {return d.Avg_FIP;
        } else if (selected_stat=="xFIP") {return d.Avg_xFIP;
        } else if (selected_stat=="K/9") {return d["Avg_K/9"];
        } else if (selected_stat=="BB/9") {return d["Avg_BB/9"];
        } else if (selected_stat=="WHIP") {return d.Avg_WHIP;
        } else {return 0;}
    }

    var draw_scatterpoints=function(year,selected_stat,league) {
        var filtered_data=master.filter(function(d) {return d.IP_Fraction>=innings_min;})
                                .filter(function(d) {return d.Season==year;});
        if (league!="MLB") {filtered_data=filtered_data.filter(function(d) {return d.League==league;})};
        
        viz1_xScale.domain([innings_min,d3.max(filtered_data,function(d) {return d.IP_Fraction;})])
            .nice()
        viz1_yScale.domain([d3.min(filtered_data,function(d) {return pick_stat(d);})
                ,d3.max(filtered_data,function(d) {return pick_stat(d);})])
            .nice()
            
        //Remove existing points
        viz1_svg.selectAll(".points")
                .remove();
        viz1_svg.selectAll(".viz1-axis-label")
                .remove();
        viz1_svg.selectAll(".viz1-title")
                .remove();
          
        //Display x-axis
        viz1_displayxAxis.call(viz1_xAxis);
        viz1_svg.append("text")
                .attr("class","viz1-axis-label")
                .attr("x",(viz1_w-viz1_Padding.right-viz1_Padding.left)/2+viz1_Padding.left)
                .attr("y",viz1_h-viz1_Padding.bottom/5)
                .attr("text-anchor","middle")
                .attr("dominant-baseline","central")
                .text("Innings Pitched")
              
               
        //Display y-axis
        viz1_displayyAxis.call(viz1_yAxis);
        viz1_svg.append("text")
                .attr("class","viz1-axis-label")
                .attr("x",viz1_Padding.left/3)
                .attr("y",(viz1_h-viz1_Padding.top-viz1_Padding.bottom)/2+viz1_Padding.top)
                .attr("text-anchor","left")
                .attr("dominant-baseline","central")
                .text(selected_stat)

        //Chart title
        var title1="<b>"+selected_stat+"<br>";
        if (league=="MLB") {title1=title1+league+" Pitchers: "+year+" Season</b>";}
        else {title1=title1+league+" League Pitchers: "+year+" Season</b>";}
        viz1_title.html(title1);
                
        
        //Draw points
        var points=viz1_svg.append("g")
                           .attr("class","points")  
                           .selectAll("circle")
                           .data(filtered_data)
                           .enter()
              .append("circle")
              .attr("cx",function(d) {return viz1_xScale(d.IP_Fraction);})
              .attr("cy",function(d) {return viz1_yScale(pick_stat(d));})
              .attr("r",4)
              .style("fill",function(d) {return pitcher_colors[d.Type];})
              .style("stroke",function(d) {return pitcher_colors[d.Type];})
              .on("mouseover",function(d) {
                    d3.select(this).style("fill","none")
                                   .attr("r",6);
                    
                    var player_info="<b>"+d.Name+"</b><br>Season: "+d.Season+"<br>League: "+d.League+"<br>";
                    if (d.Team2 && d.Team3) {player_info=player_info+"Teams: "+d.Team+"<br>"+d.Team2+"<br>"+d.Team3;
                    } else if (d.Team2) {player_info=player_info+"Teams: "+d.Team+"<br>"+d.Team2;
                    } else {player_info=player_info+"Team: "+d.Team;}
                    player_info=player_info+"<br>"+selected_stat+": "+formatDecimal(pick_stat(d))+"<br>Games: "+d.G+"<br>Games Started: "+d.GS;
                    
                    viz1_tooltip.style("opacity",1)
                                .style("left",d3.event.pageX+"px")
                                .style("top",d3.event.pageY+"px")
                                .html(player_info);
            })
            .on("mouseout",function() {
                d3.select(this).style("fill",function(d) {return pitcher_colors[d.Type];})
                               .attr("r",4)
                viz1_tooltip.style("opacity",0);
            });
    }
    
    //Add historical data
    d3.json("data/historical_trends.json").then(function(historical) {     
        var historical_filter=historical.filter(function(d) {return d.League==league;})
                                       .filter(function(d) {return d.Type!="All Pitchers";});
        
        var add_historical_lines=function(year,selected_stat,league) {
            //Remove existing points
            viz1_svg.selectAll(".averages")
                .remove();
            
            viz1_svg.append("g")
                    .attr("class","averages")
                    .selectAll("line")
                    .data(historical_filter)
                    .enter()
                    .filter(function(d) {return d.Season==year;})
                    .append("line")
                    .attr("x1",viz1_Padding.left+10)
                    .attr("x2",viz1_w-viz1_Padding.right-10)
                    .attr("y1",function(d) {return viz1_yScale(pick_avg_stat(d));})
                    .attr("y2",function(d) {return viz1_yScale(pick_avg_stat(d));})
                    .style("stroke",function(d) {return pitcher_colors[d.Type];})
                    .style("stroke-width",1.5)
                    .on("mouseover",function(d) {
                       if (league=="MLB") {var avg_info="MLB <br>"+d.Type+" "+selected_stat+" Average:<br>"+formatDecimal(pick_avg_stat(d));
                       } else {var avg_info=league+" League <br>"+d.Type+" "+selected_stat+" Average:<br>"+formatDecimal(pick_avg_stat(d));}
                       
                       viz1_tooltip.style("opacity",1)
                                .style("left",d3.event.pageX+"px")
                                .style("top",d3.event.pageY+"px")
                                .html(avg_info)
                    })
                    .on("mouseout",function() {viz1_tooltip.style("opacity",0);});
        }
                
        //Add drop-down menu
        var viz1_dropdown1=d3.select("#viz1_dropdown1")
                             .insert("select")
                             .on("change",function() {
                                year=d3.select(this).property("value");
                                if (year<2002 && selected_stat=="xFIP") {selected_stat="FIP";}
                                draw_scatterpoints(year,selected_stat,league);
                                add_historical_lines(year,selected_stat,league);
                             });

        //Populate options and change scatterplot
        viz1_dropdown1.selectAll("option")
                      .data(seasons)
                      .enter()
                      .append("option")
                      .attr("value", function(d) {return d;})
                      .text(function(d) {return d;})
                      .property("selected",2018);
                      
        //Add radio buttons
        var stats=["ERA","FIP","xFIP","K/9","BB/9","WHIP","WAR"];
        var viz1_radiobuttons=d3.select("#viz1_buttons")
                                .insert("form")
                                .attr("id","stat")
                                .on("change",function() {
                                    var form=document.getElementById("stat")
                                    for(var i=0; i<form.length; i++){
                                        if(form[i].checked){
                                            selected_stat=form[i].value;}}
                                    if (year<2002 && selected_stat=="xFIP") {selected_stat="FIP";}
                                    draw_scatterpoints(year,selected_stat,league);
                                    add_historical_lines(year,selected_stat,league); 
                                })
                                
        viz1_radiobuttons.selectAll("input")
                         .data(stats)
                         .enter()
                         .append("label")
                         .text(function(d) {return "     "+d;})
                         .insert("input")
                         .attr("type","radio")
                         .attr("name","stat")
                         .attr("value",function(d) {return d;})
                         .property("checked",function(d) {return d==selected_stat;});
                         
        //Create league buttons
        var AllPitchers=viz1_svg.append("g")
                                .attr("class","button")
                                .style("cursor","pointer")
                                .on("click",function() {
                                    league="MLB";
                                    draw_scatterpoints(year,selected_stat,league);
                                    add_historical_lines(year,selected_stat,league); 
                                    d3.select("#allpitchers").attr("fill","gray");
                                    d3.select("#AL").attr("fill","white");
                                    d3.select("#NL").attr("fill","white");
                                });
        var American=viz1_svg.append("g")
                             .attr("class","button")
                             .style("cursor","pointer")
                             .on("click",function() {
                                    league="American";
                                    draw_scatterpoints(year,selected_stat,league);
                                    add_historical_lines(year,selected_stat,league); 
                                    d3.select("#allpitchers").attr("fill","white");
                                    d3.select("#AL").attr("fill","gray");
                                    d3.select("#NL").attr("fill","white");
                              });
        var National=viz1_svg.append("g")
                             .attr("class","button")
                             .style("cursor","pointer")
                             .on("click",function() {
                                    league="National";
                                    draw_scatterpoints(year,selected_stat,league);
                                    add_historical_lines(year,selected_stat,league); 
                                    d3.select("#allpitchers").attr("fill","white");
                                    d3.select("#AL").attr("fill","white");
                                    d3.select("#NL").attr("fill","gray");
                             });
        //Draw league buttons
        AllPitchers.append("rect")
                   .attr("id","allpitchers")
                   .attr("x",viz1_Padding.left+50)
                   .attr("y",viz1_Padding.top/2)
                   .attr("width",150)
                   .attr("height",viz1_Padding.top/4)
                   .attr("fill","gray")
                   .attr("stroke","black");
        American.append("rect")
                   .attr("id","AL")
                   .attr("x",viz1_Padding.left+210)
                   .attr("y",viz1_Padding.top/2)
                   .attr("width",150)
                   .attr("height",viz1_Padding.top/4)
                   .attr("fill","white")
                   .attr("stroke","black");
        National.append("rect")
                   .attr("id","NL")
                   .attr("x",viz1_Padding.left+370)
                   .attr("y",viz1_Padding.top/2)
                   .attr("width",150)
                   .attr("height",viz1_Padding.top/4)
                   .attr("fill","white")
                   .attr("stroke","black");
        //Add text to buttons
        AllPitchers.append("text")
                   .attr("x",viz1_Padding.left+125)
                   .attr("y",5*viz1_Padding.top/8)
                   .attr("text-anchor","middle")
                   .attr("dominant-baseline","central")
                   .text("All MLB");
        American.append("text")
                   .attr("x",viz1_Padding.left+285)
                   .attr("y",5*viz1_Padding.top/8)
                   .attr("text-anchor","middle")
                   .attr("dominant-baseline","central")
                   .text("American League");
        National.append("text")
                   .attr("x",viz1_Padding.left+445)
                   .attr("y",5*viz1_Padding.top/8)
                   .attr("text-anchor","middle")
                   .attr("dominant-baseline","central")
                   .text("National League");
        
        
        //Draw initial scatterplot              
        draw_scatterpoints(year,selected_stat,league);
        add_historical_lines(year,selected_stat,league); 
    })
});