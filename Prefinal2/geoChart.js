var geoW = 600;
var geoH = 600;
var geoScale = 1200;
 
var geoProjection = d3.geoMercator()
    .center([ 136.0, 35.6 ])
    .translate([geoW/2, geoH/2])
    .scale(geoScale);

var geoPath = d3.geoPath().projection(geoProjection);

var geoSvg = d3.select("#geo_region")
    .attr("width", geoW)
    .attr("height", geoH);

geoSvg.selectAll("path")   //都道府県の領域データをpathで描画
    .data(geoJson.features)
    .enter()
    .append("path")
    .attr("d", geoPath)
    .style("stroke", "gray")
    .style("stroke-width", 0.25)
    .style("fill", "white");
    //.style("fill", d => d.properties.pref === "Hokkaido" ? "red": "blue")