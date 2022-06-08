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

    //const graph = await plotgraph();

    //await plotdetail()


    d3.json("https://214x112x-nakashima.github.io/InfoVis2021/W15/japan.geojson")
        .then( data =>{

          chart.selectAll("path")
              .data(data.features)
              .enter()
              .append("path")
              .attr("d", path)
              .style("stroke", "black")
              .style("stroke-width", 0.25)
              .style("fill", /*d=>store(d.properties.pref,color)*/"red")
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

/*function conv(){

return new Promise((resolve,reject)=>{

  d3.csv("https://noaioriver.github.io/InfoVis2022/Final/women2019.csv")
      .then( data =>{


        function getColor(i, max) {
            const g = 255 - Math.floor(i*255/max);
            let res = g.toString(16);
            if (res.length == 1) {
              res = "0" + res
            }
            return "#" + res + "ff" + res;
          }
          d => getColor(this.map[d.properties.pref][this.q.toString()], this.map["max"][this.q.toString()])
          
        var color = new Array();

        for(let i=0;i<47;i++){
          color[data[i].pref] = data[i].max;
      };


      resolve(color);
      })
      .catch( error => {
          console.log( error );

      });


});

}*/

/*function store( input_pref,color ){

const c = color[input_pref];

if(c == "seven"){
  return "red"
}else if(c == "lawson"){
  return "blue"
}else{
  return "green"
}
}*/

/*function plotgraph(){

  return new Promise((resolve,reject)=>{

  d3.csv("https://214x112x-nakashima.github.io/InfoVis2021/W15/store.csv")
  //d3.csv("https://214x112x-nakashima.github.io/InfoVis2021/W1/iris.csv")
     .then(data => {
         data.forEach( d => {
             //d.seven = +d.seven;
             //d.lawson = +d.lawson;
             //d.family = +d.family
             d.seven = +d.seven;
             d.lawson = +d.lawson;
             d.family = +d.family;
         });

  var input_data = new Array();

  for(let i=0;i<47;i++){
        input_data[data[i].pref] = {seven:data[i].seven,lawson:data[i].lawson,family:data[i].family};
    };

    resolve(input_data);
    })

     .catch( error => {
         console.log( error );
     });

   })

}*/

/*async function plot(input_pref,graph){

  const input_data = graph[input_pref];
  const input = new Array();

  console.log(input_data)

  input.label = ["seven","lawson","family"];
  input.value = [input_data["seven"],input_data["lawson"],input_data["family"]]
  input.color = ["red","blue","green"]
  input.pref = input_pref;

  d3.select('#drawing_region_graphplot').remove();
  d3.select("#remove")
      .append("svg")
      .attr("id","drawing_region_graphplot")

  window.bar_chart = new BarChart( {
              parent: '#drawing_region_graphplot',
              width: 256,
              height: 256,
              margin: {top:10, right:20, bottom:50, left:30},
          }, input );

  await bar_chart.update();

}*/


/*async function plotdetail(){

  const region = '#detail'
  const color = ["red","blue","green"]
  const shop = ["セブンイレブン","ローソン","ファミリーマート"]

  const  det = d3.select(region)
                  .append('svg')
                  .attr("width",256)
                  .attr("height",256)
                  .attr('transform', `translate(100,250)`);

  for(let i=0;i<3;i++){
    var num = det.append('g')

    num.append('rect')
       .attr("x",0)
       .attr("y",i*30)
       .attr("width",70)
       .attr("height",20)
       .attr("fill",color[i]);

   num.append("text")
      .attr("x",80)
      .attr("y",i*30+15)
      .text(shop[i]);


  }


}*/


main();

