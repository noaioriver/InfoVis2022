async function main(){

    let geoChart = new GeoChart({
        parent: '#geochart_region',
        width: 400,
        height: 550,
        margin: { top: 10, right: 10, bottom: 20, left: 10 },
        //chart_margin: { top: 10, right: 10, bottom: 10, left: 10 },
        color: '#2566CC',
  });

  geoChart.update();

}




main();

