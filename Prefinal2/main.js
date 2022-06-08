async function main(){

    const region = '#drawing_region_prefplot';
    const width = 600;
    const height = 600;
    const scale = 1200;
    const centerPos = [ 136.0, 35.6 ]
    const margin = {top:10, right:10, bottom:50, left:50};

    const projection = d3.geoMercator()
         .center(centerPos)
         .translate([width/2, height/2])
         .scale(scale);

    const path = d3.geoPath().projection(projection);

    const svg = d3.select(region)
        .attr('width', width)
        .attr('height', height)

    const chart = svg.append("g")
        .attr('transform', `translate(${margin.left}, ${margin.top})`)

    const color = "red";


    d3.json("https://214x112x-nakashima.github.io/InfoVis2021/W15/japan.geojson")
        .then( data =>{

            

          chart.selectAll("path")
              .data(data.features)
              .enter()
              .append("path")
              .attr("d", path)
              .style("stroke", "black")
              .style("stroke-width", 0.25)
              .style("fill", "red")
              .on('mouseover', async function(item,any){

                  d3.select('#tooltip')
                      .style('opacity', 1)
                      //.text(d);
                      .html(`<div class="tooltip-label">${any.properties.pref_j}</div>`);

                      //var p = await plotgraph(any.properties.pref);
                      //console.log(p);
              })
              .on('mousemove', (e) => {
                  const padding = 10;
                  d3.select('#tooltip')
                      .style('left', (e.pageX + padding) + 'px')
                      .style('top', (e.pageY + padding) + 'px');
              })
              .on('mouseleave', () => {
                  d3.select('#tooltip')
                      .style('opacity', 0);
              })
              .on('click', (item,any)=>{

                plot(any.properties.pref,graph);

              })

        })
        .catch( error => {
            console.log( error );
        });

}




main();

