d3.csv("https://noaioriver.github.io/InfoVis2022/W08/w08_task3.csv")
    .then( data => {
        data.forEach( d => { d.label = d.maker; d.value = +d.value; d.color=d.color; });


        var config = {
            parent: '#drawing_region',
            width: 256*2,
            height: 256*2,
            margin: {top:30, right:20, bottom:50, left:70},
            title: '日本におけるスマホメーカー別シェア(2019年)',
            radius:60,
        };


        const pie_chart = new PieChart( config, data );
        pie_chart.update();
    })
    .catch( error => {
        console.log( error );
    });

class PieChart {

    constructor( config, data ) {
        this.config = {
            parent: config.parent,
            width: config.width || 256,
            height: config.height || 256,
            margin: config.margin || {top:10, right:10, bottom:10, left:10},
            title: config.title || '',
            radius:config.radius || 5
        }
        this.data = data;
        this.init();
    }

    init() {
        let self = this;

        self.svg = d3.select( self.config.parent )
            .attr('width', self.config.width)
            .attr('height', self.config.height);

        self.chart = self.svg.append('g')
            .attr('transform', `translate(${self.config.width/2}, ${self.config.height/2})`);

        self.inner_width = self.config.width - self.config.margin.left - self.config.margin.right;
        self.inner_height = self.config.height - self.config.margin.top - self.config.margin.bottom;

        self.pie=d3.pie()
            .value(d=>d.value)
            .sort(null)

        self.radius=Math.min(self.inner_width,self.inner_height)/2

        self.arc=d3.arc()
            .innerRadius(self.radius)
            .outerRadius(self.radius)

        /*self.text_arc = d3.arc().outerRadius(self.radius).innerRadius(self.radius)*/
        


        
        const title_space = 10;
        self.svg.append('text')
            .style('font-size', '20px')
            .style('font-weight', 'bold')
            .attr('text-anchor', 'middle')
            .attr('x', self.config.width / 2)
            .attr('y', self.config.margin.top - title_space)
            .text( self.config.title );

    
    }

    update() {
        let self = this;
        self.arc.innerRadius(self.config.radius);
        self.chart.selectAll("path").remove();
        self.chart.selectAll("text").remove();
        self.render();
    }

    render() {
        let self = this;

        self.chart.selectAll("pie")
            .data(self.pie(self.data))
            .enter()
            .append("path")
            .attr("d",self.arc )
            .style('fill', d=>d.data.color)
            .attr("opacity", 0.8);

        self.chart.selectAll("p")
            .data(self.pie(self.data))
            .enter()
            .append("text")
            .text(d=>d.data.label)
            .attr("text-anchor", "middle")
            .attr("font-size", d => d.data.label == "SAMSUNG"  || d.data.label=="HUAWEI" || d.data.label=="FUJITSU"||d.data.label=="Others"?  15:20 )
            .attr("fill", d => d.data.label=="SHARP"?  "gray":"white")
            .attr("transform", d => `translate(${self.arc.centroid(d)})`)
            //.attr("dy", "50px");

        

        self.chart.selectAll("q")
            .data(self.pie(self.data))
            .enter()
            .append("text")
            .text(d=>d.data.value+"%")
            .attr("text-anchor", "middle")
            .attr("font-size", d => d.data.label == "SAMSUNG"  || d.data.label=="HUAWEI" || d.data.label=="FUJITSU"||d.data.label=="Others"?  15:20)
            .attr("fill", d => d.data.label=="SHARP"?  "gray":"white")
            .attr("transform", d => `translate(${self.arc.centroid(d)})`)
            .attr("dy", d => d.data.label == "SAMSUNG"  || d.data.label=="HUAWEI" || d.data.label=="FUJITSU"||d.data.label=="Others"?  "12px":"20px");
            
    }
}

