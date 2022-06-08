function tooltipHtml(n, d){	/* function to create html content string in tooltip div. */
		return "<h4>"+n+"</h4><table>"+
			//"<tr><td>Low</td><td>"+(d.low)+"</td></tr>"+
			//"<tr><td>Average</td><td>"+(d.avg)+"</td></tr>"+
			//"<tr><td>High</td><td>"+(d.high)+"</td></tr>"+
			"</table>";
	}
	
    d3.csv("https://noaioriver.github.io/InfoVis2022/W012/ex3.csv")
    .then( data => {
        data.forEach( d => { d.label = +d.label; d.color=d.color; });



        //const bar_chart = new BarChart( config, data );
        //bar_chart.update();
        
    })
    .catch( error => {
        console.log( error );
    });
	/*var sampleData ={};	/* Sample random data. */	
	/*["HI", "AK", "FL", "SC", "GA", "AL", "NC", "TN", "RI", "CT", "MA",
	"ME", "NH", "VT", "NY", "NJ", "PA", "DE", "MD", "WV", "KY", "OH", 
	"MI", "WY", "MT", "ID", "WA", "DC", "TX", "CA", "AZ", "NV", "UT", 
	"CO", "NM", "OR", "ND", "SD", "NE", "IA", "MS", "IN", "IL", "MN", 
	"WI", "MO", "AR", "OK", "KS", "LS", "VA"]
		.forEach(function(d){ 
			var low=Math.round(100*Math.random()), 
				mid=Math.round(100*Math.random()), 
				high=Math.round(100*Math.random());
			sampleData[d]={low:d3.min([low,mid,high]), high:d3.max([low,mid,high]), 
					avg:Math.round((low+mid+high)/3) /*,color:d3.interpolate("#ffffcc", "#800026")(low/100)*//*}; 
		});*/
	
	/* draw states on id #statesvg */	
	uStates.draw("#statesvg", data.label, tooltipHtml);
	
	d3.select(self.frameElement).style("height", "600px"); 