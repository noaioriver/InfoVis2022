async function main(){
    const geoJson = await d3.json('https://noaioriver.github.io/InfoVis2022/FinalTask/japangeo.json')
    let thisdata;
    let bar1;
    let bar2;
    let flag;
    let ccolor={};
    let wcolor={};
    let ncolor={};
    const ken_array = ['北海道','青森県','岩手県','宮城県','秋田県','山形県','福島県','茨城県','栃木県','群馬県','埼玉県','千葉県','東京都','神奈川県','新潟県','富山県','石川県','福井県','山梨県','長野県','岐阜県','静岡県','愛知県','三重県','滋賀県','京都府','大阪府','兵庫県','奈良県','和歌山県','鳥取県','島根県','岡山県','広島県','山口県','徳島県','香川県','愛媛県','高知県','福岡県','佐賀県','長崎県','熊本県','大分県','宮崎県','鹿児島県','沖縄県'];
    await d3.csv("https://noaioriver.github.io/InfoVis2022/FinalTask/women2019.csv")
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

    thisdata.forEach((d, i) => {
        d.color = d3.interpolateBlues(d.woman / d3.max(thisdata, d => d.woman))
        wcolor[d.label] = d.color;
  })

  thisdata.forEach((d, i) => {
                
    d.color = d3.interpolateBlues(d.nhk / d3.max(thisdata, d => d.nhk))
    ncolor[d.label] = d.color;
})

    var scatter_config={
        parent: '#scatter_region',
        width: 400,
        height: 400,
        margin: { top: 50, right: 50, bottom: 50, left: 50 },
        radius:5,
        xlabel:"地方議会の女性議員比率",
        ylabel:"NHK受信料未払い率",
        title:"地方議会の女性議員比率とNHK受信料未払い率の相関"
      }
      const scatter_plot=new ScatterPlot(scatter_config,thisdata);

      scatter_plot.update();

    var bar_config1={
        parent: '#barchart_region1',
        width: 400,
        height: 570,
        margin: { top: 50, right: 65, bottom: 50, left: 65 },
        ylabel:"都道府県",
        
    }

    let bar_chart1=new BarChart(bar_config1,thisdata);
    bar_chart1.chart.selectAll("rect")
        .style('opacity', 0);

    bar1=bar_chart1;

    var bar_config2={
        parent: '#barchart_region2',
        width: 400,
        height: 570,
        margin: { top: 50, right: 65, bottom: 50, left: 65 },
        ylabel:"都道府県",
    }

    let bar_chart2=new BarChart(bar_config2,thisdata);
    bar_chart2.hide();
    bar2=bar_chart2;
    var dtwJson;
    dtwJson = await d3.json('https://nkzono99.github.io/InfoVis2021/final/prefectures_dtw.json')
   
        let geoChart = new GeoChart(geoJson,{
            parent: '#geochart_region',
            width: 400,
            height: 550,
            margin: { top: 10, right: 10, bottom: 20, left: 10 },
            color: 'white'
      });

      let selected;
      let preselectedc="";
      let path=geoChart.path;

      bar_chart1.addList('#value-sort', (e, d) => {

        switch(bar_chart1.data_type){
            case "woman":
                bar_chart1.data.sort((x,y) => y.woman - x.woman)
               
                bar_chart1.update("woman");
                break
            case "nhk":
                bar_chart1.data.sort((x,y)=>(y.nhk)-(x.nhk))
               
                bar_chart1.update("nhk");
                break
            

        }
           
            
      })

      bar_chart1.addList('#value-sort2', (e, d) => {
        switch(bar_chart1.data_type){
            case "woman":
                bar_chart1.data.sort((x,y) => x.woman - y.woman)
                
                bar_chart1.update("woman");
                break
            case "nhk":
                bar_chart1.data.sort((x,y)=>(x.nhk)-(y.nhk))
                
                bar_chart1.update("nhk");
                break
            

        }
           
            
        })
    

    bar_chart1.addList('#original', (e, d) => {
        bar_chart1.data.sort((x, y) => ken_array.indexOf(x.label) - ken_array.indexOf(y.label))
       
        bar_chart1.update(bar_chart1.data_type);

    })

      bar_chart2.addList('#value-sort', (e, d) => {
        switch(bar_chart1.data_type){
            case "woman":
                bar_chart1.data.sort((x,y) => y.woman - x.woman)
                
                bar_chart1.update("woman");
                break
            case "nhk":
                bar_chart1.data.sort((x,y)=>(y.nhk)-(x.nhk))
               
                bar_chart1.update("nhk");
                break
            

        }
           
            bar_chart2.data.sort((x,y)=>(y.nhk)-(x.nhk));
            bar_chart2.update("nhk");
        })

      bar_chart2.addList('#value-sort2', (e, d) => {
            switch(bar_chart1.data_type){
                case "woman":
                    bar_chart1.data.sort((x,y) => x.woman - y.woman)
                    bar_chart1.update("woman");
                    break
                case "nhk":
                    bar_chart1.data.sort((x,y)=>(x.nhk)-(y.nhk))
                    bar_chart1.update("nhk");
                    break
                
    
            }
               
                bar_chart2.data.sort((x,y)=>(x.nhk)-(y.nhk));
                bar_chart2.update("nhk");
            })
        
    
        bar_chart2.addList('#original', (e, d) => {
            bar_chart1.data.sort((x, y) => ken_array.indexOf(x.label) - ken_array.indexOf(y.label))
           
            bar_chart1.update(bar_chart1.data_type);

            bar_chart2.data.sort((x, y) => ken_array.indexOf(x.label) - ken_array.indexOf(y.label))
           
            bar_chart2.update("nhk");
        })

    geoChart.addList('click', (e, d) => {
        

        if(selected/*=='北海道'||'青森県'||'岩手県'||'宮城県'||'秋田県'||'山形県'||'福島県'||'茨城県'||'栃木県'||'群馬県'||'埼玉県'||'千葉県'||'東京都'||'神奈川県'||'新潟県'||'富山県'||'石川県'||'福井県'||'山梨県'||'長野県'||'岐阜県'||'静岡県'||'愛知県'||'三重県'||'滋賀県'||'京都府'||'大阪府'||'兵庫県'||'奈良県'||'和歌山県'||'鳥取県'||'島根県'||'岡山県'||'広島県'||'山口県'||'徳島県'||'香川県'||'愛媛県'||'高知県'||'福岡県'||'佐賀県'||'長崎県'||'熊本県'||'大分県'||'宮崎県'||'鹿児島県'||'沖縄県'*/){
            geoChart.ccolor[selected]=preselectedc;
            preselectedc=geoChart.ccolor[d.properties.name_ja];
        }
        preselectedc=geoChart.ccolor[d.properties.name_ja];
        geoChart.ccolor[d.properties.name_ja]="gold";
        selected=d.properties.name_ja;

        

       
        geoChart.update();
        
        
        bar_chart1.chart.selectAll("rect")
                .style("fill",d => {
                    if (d.label==selected) {
                        return "gold"
                    } else {
                        return bar_chart1.ccolor[d.label];
                    }})
         bar_chart2.chart.selectAll("rect")
                    .style("fill",d => {
                        if (d.label==selected) {
                            return "gold"
                        } else {
                            return bar_chart2.ccolor[d.label];
                        }})
        scatter_plot.chart.selectAll("circle")
        .style("fill",d => {
            if (d.label==selected) {
                return "gold"
            } })
       

    })




    d3.select('#woman')
        .on('click',d =>{
          thisdata.forEach((d, i) => {
                d.color = d3.interpolateBlues(d.woman / d3.max(thisdata, d => d.woman))
                wcolor[d.label] = d.color;
          });


          geoChart.ccolor = wcolor;
          geoChart.update();
          
            

            
            bar_chart1.ccolor=wcolor;
          bar_chart1.update("woman");
          flag="woman";
    
            

            bar_chart2.hide();
            scatter_plot.update();
            selected="";
            
        })

        d3.select('#nhk')
        .on('click',d =>{
            
          thisdata.forEach((d, i) => {
                
                d.color = d3.interpolateBlues(d.nhk / d3.max(thisdata, d => d.nhk))
                ncolor[d.label] = d.color;
          });

            
          geoChart.ccolor = ncolor;
          geoChart.update();
          
            

            bar_chart1.ccolor=ncolor;
            bar_chart1.update("nhk");

            bar_chart2.hide();
            flag="nhk";
            scatter_plot.update();
            selected="";

            

        })

        d3.select('#both')
        .on('click',d =>{

          //カラースケール
         
          thisdata.forEach((d, i) => {
               
                d.color = d3.interpolateBlues(d.woman / d3.max(thisdata, d => d.woman))
                wcolor[d.label] = d.color;
          });
            

            bar_chart1.ccolor=wcolor;
            bar_chart1.update("woman");

            thisdata.forEach((d, i) => {
                
                d.color = d3.interpolateBlues(d.nhk / d3.max(thisdata, d => d.nhk))
                ncolor[d.label] = d.color;
          });

          bar_chart2.look();
          bar_chart2.ccolor=ncolor;
          bar_chart2.update("nhk");
          //bar_chart1.update("woman");
          flag="both";
          geoChart.update();
          scatter_plot.update();

          selected="";
            

            

        })




        
    
        thisdata.forEach((d) => {
          
            ccolor[d.label] = "white";});
        geoChart.ccolor=ccolor;
      geoChart.update();
      


      
    
    }
    
    
    
    
main();
    