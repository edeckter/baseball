var viz4_h=600
var viz4_w=800
var viz4_Padding={top:100, bottom:50, left:200, right:100};

//Format values for display
var formatDecimal=d3.format(".3n");              
var formatPercent=d3.format(".1%");

//Available years for drop-down
var seasons = [];
for (var i = 2002; i <= 2018; i++) {
    seasons.push(i);
}

//Create svgs for charts              
var viz4_svg1=d3.select("#viz4")
          .append("svg")
          .attr("width",viz4_w)
          .attr("height",viz4_h);
var viz4_svg2=d3.select("#viz4")
          .append("svg")
          .attr("width",viz4_w)
          .attr("height",viz4_h);
          
//Create chart titles
var viz4_title1_1=viz4_svg1.append("text")
                           .attr("x",viz4_Padding.left/2)
                           .attr("y",viz4_Padding.top/2)
                           .text("Average Fastball Velocity")
                           .style("font-weight","bold");
var viz4_title1_2=viz4_svg1.append("text")
                           .attr("x",viz4_Padding.left/2)
                           .attr("y",3*viz4_Padding.top/4)
                           .style("font-weight","bold");

var viz4_title2_1=viz4_svg2.append("text")
                           .attr("x",viz4_Padding.left/2)
                           .attr("y",viz4_Padding.top/2)
                           .text("Average Fastball Use (Percentage of All Pitches Thrown)")
                           .style("font-weight","bold");
var viz4_title2_2=viz4_svg2.append("text")
                           .attr("x",viz4_Padding.left/2)
                           .attr("y",3*viz4_Padding.top/4)
                           .style("font-weight","bold");

//Scaling function for x-axes            
var viz4_xScale1=d3.scaleLinear()
             .range([viz4_Padding.left,viz4_w-viz4_Padding.right-viz4_Padding.left]);
var viz4_xScale2=d3.scaleLinear()
             .range([viz4_Padding.left,viz4_w-viz4_Padding.right-viz4_Padding.left]);
//Scaling function for players
var viz4_widthScale=d3.scaleBand()
                 .rangeRound([viz4_Padding.top,viz4_h-viz4_Padding.bottom])
                 .paddingInner(0.2);
                 
d3.json('data/TJ_fastballs_byyear.json').then(function(tj_fastballs) {
    //Set initial season value
    var season=2018;
    
    var draw_barcharts=function(season) {
        //Remove previous data
        d3.select("#viz4")
          .selectAll(".bars")
          .remove();
        d3.select("#viz4")
          .selectAll(".y-labels")
          .remove();  
        d3.select("#viz4")
          .selectAll(".value-labels")
          .remove();
        d3.select("#viz4")
          .selectAll(".title")
          .remove();           

        //Filter data for selected season  
        var tj_data=tj_fastballs.filter(function(d) {return d.Year==season;})
                                .filter(function(d) {return d.Player!="MLB";});
        var season_avg=tj_fastballs.filter(function(d) {return d.Year==season;})
                                .filter(function(d) {return d.Player=="MLB";});
                                
        //Update chart titles
        viz4_title1_2.text("MLB Season Average Fastball Velocity: "+formatDecimal(season_avg[0]["FBv"]));
        viz4_title2_2.text("MLB Season Average Fastball Usage: "+formatPercent(season_avg[0]["FB%"]));
        
        //Update domain for x-scale for selected year
        viz4_xScale1.domain([0,d3.max(tj_data,function(d) {return d["FBv"];})])
        viz4_xScale2.domain([0,d3.max(tj_data,function(d) {return d["FB%"];})])
        
        //Update bar height scale for selected year
        viz4_widthScale.domain(d3.range(tj_data.length));
        
        //Add y-axis labels
        viz4_svg1.append("g")
                .attr("class","y-labels")
                .selectAll("text")
                .data(tj_data)
                .enter()
                .append("text")
                .sort(function(a,b) {
                        return d3.descending(a["FBv"],b["FBv"]);})
                .attr("y",function(d,i) {return viz4_widthScale(i)+viz4_widthScale.bandwidth()/2;})
                .attr("x",viz4_Padding.left/1.05)
                .text(function(d) {return d.Player;})
                .attr("text-anchor","end")
                .attr("dominant-baseline","central");
        viz4_svg2.append("g")
                .attr("class","y-labels")
                .selectAll("text")
                .data(tj_data)
                .enter()
                .append("text")
                .sort(function(a,b) {
                        return d3.descending(a["FB%"],b["FB%"]);})
                .attr("y",function(d,i) {return viz4_widthScale(i)+viz4_widthScale.bandwidth()/2;})
                .attr("x",viz4_Padding.left/1.05)
                .text(function(d) {return d.Player;})
                .attr("text-anchor","end")
                .attr("dominant-baseline","central");
        //Add value labels
        viz4_svg1.append("g")
                .attr("class","value-labels")
                .selectAll("text")
                .data(tj_data)
                .enter()
                .append("text")
                .sort(function(a,b) {
                        return d3.descending(a["FBv"],b["FBv"]);})
                .attr("y",function(d,i) {return viz4_widthScale(i)+viz4_widthScale.bandwidth()/2;})
                .attr("x",function(d) {return viz4_xScale1(0)+viz4_xScale1(d["FBv"])+10;})
                .text(function(d) {return formatDecimal(d["FBv"]);})
                .attr("text-anchor","start")
                .attr("dominant-baseline","central");
        viz4_svg2.append("g")
                .attr("class","value-labels")
                .selectAll("text")
                .data(tj_data)
                .enter()
                .append("text")
                .sort(function(a,b) {
                        return d3.descending(a["FB%"],b["FB%"]);})
                .attr("y",function(d,i) {return viz4_widthScale(i)+viz4_widthScale.bandwidth()/2;})
                .attr("x",function(d) {return viz4_xScale2(0)+viz4_xScale2(d["FB%"])+10;})
                .text(function(d) {return formatPercent(d["FB%"]);})
                .attr("text-anchor","start")
                .attr("dominant-baseline","central");
                
        //Draw bars for Fastball velocity
        viz4_svg1.append("g")
                 .attr("class","bars")
                 .selectAll("rect")
                 .data(tj_data)
                 .enter()
                 .append("rect")
                 .sort(function(a,b) {
                        return d3.descending(a["FBv"],b["FBv"]);})
                 .attr("x",viz4_xScale1(0))
                 .attr("y",function(d,i) {return viz4_widthScale(i);})
                 .attr("width",function(d) {return viz4_xScale1(d["FBv"]);})
                 .attr("height",viz4_widthScale.bandwidth())
                 .style("fill",function(d) {if (d["FBv"]>=season_avg[0]["FBv"]) {return "#495769";} else {return "none";}})
                 .style("stroke","#495769");  
             
        //Draw bars for Fastball percentage
        viz4_svg2.append("g")
                 .attr("class","bars")
                 .selectAll("rect")
                 .data(tj_data)
                 .enter()
                 .append("rect")
                 .sort(function(a,b) {
                        return d3.descending(a["FB%"],b["FB%"]);})
                 .attr("x",viz4_xScale2(0))
                 .attr("y",function(d,i) {return viz4_widthScale(i);})
                 .attr("width",function(d) {return viz4_xScale2(d["FB%"]);})
                 .attr("height",viz4_widthScale.bandwidth())
                 .style("fill",function(d) {if (d["FB%"]>=season_avg[0]["FB%"]) {return "#495769";} else {return "none";}})
                 .style("stroke","#495769");  
    }
        
    //Add drop-down menu
    var viz4_dropdown1=d3.select("#viz4_dropdown1")
                         .insert("select")
                         .on("change",function() {
                                season=d3.select(this).property("value");
                                draw_barcharts(season);
                          });

    //Populate options and change scatterplot
    viz4_dropdown1.selectAll("option")
                  .data(seasons)
                  .enter()
                  .append("option")
                  .attr("value", function(d) {return d;})
                  .text(function(d) {return d;})
                  .property("selected",2018);
    
    //Initial call of bar chart function
    draw_barcharts(season);
});