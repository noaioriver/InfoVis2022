async function main(){
    const geoJson = await d3.json('https://noaioriver.github.io/InfoVis2022/FinalTask/japangeo.json')
    let thisdata;
    let bar1;
    let bar2;
    let ccolor={};
    await d3.csv("https://noaioriver.github.io/InfoVis2022/Final/women2019.csv")
    .then( data => {
        data.forEach( d => { 
            d.label = d.label; 
            d.woman=+d.woman;
            d.nhk=+d.nhk;
            d.color = 'white';
           });

        

        thisdata=data;
    })
    .catch( error => {
        console.log( error );
    });

    var scatter_config={
        parent: '#scatter_region',
        width: 400,
        height: 400,
        margin: { top: 50, right: 50, bottom: 50, left: 50 },
        //chart_margin: { top: 10, right: 10, bottom: 10, left: 10 },
        radius:5,
        xlabel:"地方議会の女性議員比率",
        ylabel:"NHK受信料不支払い率",
        title:"地方議会の女性議員比率とNHK受信料不支払い率の相関"
      }
      const scatter_plot=new ScatterPlot(scatter_config,thisdata);

      scatter_plot.update();

    var bar_config1={
        parent: '#barchart_region1',
        width: 400,
        height: 570,
        margin: { top: 50, right: 50, bottom: 50, left: 50 },
        ylabel:"都道府県",
        
    }

    const bar_chart1=new BarChart(bar_config1,thisdata);
    bar_chart1.update("woman");
    bar_chart1.chart.selectAll("rect")
        .style('opacity', 0);

    bar1=bar_chart1;

    var bar_config2={
        parent: '#barchart_region2',
        width: 400,
        height: 570,
        margin: { top: 50, right: 50, bottom: 50, left: 50 },
        ylabel:"都道府県",
    }

    const bar_chart2=new BarChart(bar_config2,thisdata);
    bar2=bar_chart2;
    var dtwJson;
    dtwJson = await d3.json('https://nkzono99.github.io/InfoVis2021/final/prefectures_dtw.json')
   
        let geoChart = new GeoChart({
            parent: '#geochart_region',
            width: 400,
            height: 550,
            margin: { top: 10, right: 10, bottom: 20, left: 10 },
            //chart_margin: { top: 10, right: 10, bottom: 10, left: 10 },
            color: 'white'
      });



    d3.select('#woman')
        .on('click',d =>{
          thisdata.forEach((d, i) => {
                // d.color = d3.interpolateRdBu(i / dtw_selected.length);
                d.color = d3.interpolateBlues(d.woman / d3.max(thisdata, d => d.woman))
                ccolor[d.label] = d.color;
          });


          geoChart.ccolor = ccolor;
          geoChart.update(geoJson);
          geoChart.chart.selectAll("path")
            .data(geoJson.features)
            .transition().duration(500)
            .style('fill', d => ccolor[d.properties.name_ja]);
            

            bar_chart1.ccolor=ccolor;
          bar_chart1.update("woman");
    
            /*bar_chart1.chart.selectAll("rect")
                .data(thisdata)
                .attr("width", d => bar_chart1.xscale(d.woman))
                .style('opacity', 1)
                .style('fill', d => ccolor[d.label]);*/

            /*bar2.chart.selectAll("rect")
                .data(thisdata)
                .style("fill","white")*/

            /*bar2.chart.selectAll("rect")
                .style('opacity', 0);*/
            
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
            .style('fill', d => ccolor[d.properties.name_ja]);

            

            bar_chart1.ccolor=ccolor;
            bar_chart1.update("nhk",ccolor);

            

        })



        thisdata.forEach((d) => {
            // d.color = d3.interpolateRdBu(i / dtw_selected.length);
            d.color = d3.interpolateBlues( d.woman / d3.max(thisdata, d => d.woman))
            ccolor[d.label] = d.color;});
       
    
      geoChart.update(geoJson);
      


      
    
    }
    
    
    
    
main();
    