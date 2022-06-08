async function main(){
    const geoJson = await d3.json('https://noaioriver.github.io/InfoVis2022/FinalTask/japangeo.json')
    let thisdata;
    let ccolor={};
    await d3.csv("https://noaioriver.github.io/InfoVis2022/Final/women2019.csv")
    .then( data => {
        data.forEach( d => { 
            d.label = d.label; 
            d.woman=+d.woman;
            d.nhk=+d.nhk;
            d.color = 'white';
            /*d.color = d3.interpolateRdBu(1.0 - d.woman / d3.max(data, d => d.woman))
        ccolor[d.label] = d.color;*/});
        //thisdata=Object.assign({}, data);
        //data.sort((a, b) => b.woman - a.woman);

        var config={
            parent: '#scatter_region',
            width: 400,
            height: 400,
            margin: { top: 50, right: 50, bottom: 50, left: 50 },
            //chart_margin: { top: 10, right: 10, bottom: 10, left: 10 },
            radius:5,xlabel:"地方議会の女性議員比率",
            ylabel:"NHK受信料不支払い率",
            title:"地方議会の女性議員比率とNHK受信料不支払い率の相関"
          }
          const scatter_plot=new ScatterPlot(config,data);

          scatter_plot.update();

        thisdata=data;
    })
    .catch( error => {
        console.log( error );
    });

    var dtwJson;
    dtwJson = await d3.json('https://nkzono99.github.io/InfoVis2021/final/prefectures_dtw.json')
   /* var config = {
        parent: '#geochart_region',
        width: 400,
        height: 550,
        margin: { top: 10, right: 10, bottom: 20, left: 10 },
        //chart_margin: { top: 10, right: 10, bottom: 10, left: 10 },
        color: '#2566CC',
        };

        const geoChart = new ScatterPlot( config, data );*/

        let geoChart = new GeoChart({
            parent: '#geochart_region',
            width: 400,
            height: 550,
            margin: { top: 10, right: 10, bottom: 20, left: 10 },
            //chart_margin: { top: 10, right: 10, bottom: 10, left: 10 },
            color: 'white'
      });

      //let dtw_selected = Object.entries(thisdata.woman);
      //let ccolor={};
    /*thisdata.forEach((d) => {
        d.color = d3.interpolateRdBu(1.0 - d.woman / d3.max(thisdata, d => d.woman))
        ccolor[d.label] = "red";
    });*/

    

    /*function getColor(i, max) {
        const g = 255 - Math.floor(i*255/max);
        let res = g.toString(16);
        if (res.length == 1) {
          res = "0" + res
        }
        return "#" + res + "ff" + res;
      }*/
    /*dtw_selected.forEach((d, i) => {
        // d.color = d3.interpolateRdBu(i / dtw_selected.length);
        d.color = d3.interpolateRdBu(1.0 - d.woman / d3.max(dtw_selected, d => d.woman))
        ccolor[d.label] = d.color;
  });*/
  //ccolor["北海道"]="red";
  //ccolor["東京"]="green";
  /*var cscale = d3.scale.sqrt()
    .domain([0, d3.max(thisdata, function(d) {
        return getMaxValue(d.woman);
    })])
    .range([255, 0]);
  for (var key in d.woman) {
    var color = cscale(d.woman[key]);
    ccolor[d.label]=color;}*/
    


    d3.select('#woman')
        .on('click',d =>{
            //ccolor = {};
            //ccolor[d.properties.name_ja] = 'red';
            /*dtw_selected.forEach(d => { d.label = d[0]; d.value = 1.0 / (+d[1]); });
            dtw_selected.forEach(selected => {
                if (selected.label == d.properties.name_ja) {
                      selected.value = 0.0;
                };
          });*/

          //カラースケール
          //dtw_selected.sort((a, b) => -a.value + b.value);
          thisdata.forEach((d, i) => {
                // d.color = d3.interpolateRdBu(i / dtw_selected.length);
                d.color = d3.interpolateBlues(d.woman / d3.max(thisdata, d => d.woman))
                ccolor[d.label] = d.color;
          });

            /*thisdata.forEach((d) => {
                // d.color = d3.interpolateRdBu(i / dtw_selected.length);
                d.color = d3.interpolateRdBu(1.0 - d.woman / d3.max(thisdata, d => d.woman))
                ccolor[d.label] = d.color;
          })*/
          geoChart.ccolor = ccolor;
          geoChart.update(geoJson);
          geoChart.chart.selectAll("path")
            .data(geoJson.features)
            .transition().duration(500)
            .style('fill', d => ccolor[d.properties.name_ja])

        })

        d3.select('#nhk')
        .on('click',d =>{
            //ccolor = {};
            //ccolor[d.properties.name_ja] = 'red';
            /*dtw_selected.forEach(d => { d.label = d[0]; d.value = 1.0 / (+d[1]); });
            dtw_selected.forEach(selected => {
                if (selected.label == d.properties.name_ja) {
                      selected.value = 0.0;
                };
          });*/

          //カラースケール
          //dtw_selected.sort((a, b) => -a.value + b.value);
          thisdata.forEach((d, i) => {
                // d.color = d3.interpolateRdBu(i / dtw_selected.length);
                d.color = d3.interpolateBlues(d.nhk / d3.max(thisdata, d => d.nhk))
                ccolor[d.label] = d.color;
          });

            /*thisdata.forEach((d) => {
                // d.color = d3.interpolateRdBu(i / dtw_selected.length);
                d.color = d3.interpolateRdBu(1.0 - d.woman / d3.max(thisdata, d => d.woman))
                ccolor[d.label] = d.color;
          })*/
          geoChart.ccolor = ccolor;
          geoChart.update(geoJson);
          geoChart.chart.selectAll("path")
            .data(geoJson.features)
            .transition().duration(500)
            .style('fill', d => ccolor[d.properties.name_ja])

        })



        thisdata.forEach((d) => {
            // d.color = d3.interpolateRdBu(i / dtw_selected.length);
            d.color = d3.interpolateBlues( d.woman / d3.max(thisdata, d => d.woman))
            ccolor[d.label] = d.color;});
       
    
      geoChart.update(geoJson);
      /*geoChart.chart.selectAll("path")
            .data(geoJson.features)
            .style('fill', d => ccolor[d.properties.name_ja])*/

        

            /*let scatter_plot = new ScatterPlot(thisdata,{
                parent: '#scatter_region',
                width: 400,
                height: 550,
                margin: { top: 10, right: 10, bottom: 20, left: 10 },
                //chart_margin: { top: 10, right: 10, bottom: 10, left: 10 },
                radius:5,
          });*/

          /*var config={
            parent: '#scatter_region',
            width: 400,
            height: 550,
            margin: { top: 10, right: 10, bottom: 20, left: 10 },
            //chart_margin: { top: 10, right: 10, bottom: 10, left: 10 },
            radius:5
          }
          const scatter_plot=new ScatterPlot(config,thisdata);

          scatter_plot.update();*/


      
    
    }
    
    
    
    
main();
    