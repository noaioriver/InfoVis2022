d3.csv("https://noaioriver.github.io/InfoVis2022/W06/w06_task2.csv")
    .then( data => {
        data.forEach( d => { d.x = +d.x; d.y = +d.y; });

        var config = {
            parent: '#drawing_region',
            width: 256*2,
            height: 256*2,
            margin: {top:50, right:50, bottom:50, left:50}
        };

        const scatter_plot = new ScatterPlot( config, data );
        scatter_plot.update();
    })
    .catch( error => {
        console.log( error );
    });

class ScatterPlot {

    constructor( config, data ) {
        this.config = {
            parent: config.parent,
            width: config.width || 256,
            height: config.height || 256,
            margin: config.margin || {top:20, right:20, bottom:20, left:20}
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
            .attr('transform', `translate(${self.config.margin.left}, ${self.config.margin.top})`);

        self.title = self.svg.append('text')

        self.inner_width = self.config.width - self.config.margin.left - self.config.margin.right;
        self.inner_height = self.config.height - self.config.margin.top - self.config.margin.bottom;

        self.mrg_inner_width=self.inner_width-40;
        self.mrg_inner_height=self.inner_height-40;

        self.xscale = d3.scaleLinear()
            .range( [0, self.inner_width] );

        self.yscale = d3.scaleLinear()
            .range( [self.inner_height, 0] );
        
        self.rexscale=d3.scaleLinear()
            .range([0,self.mrg_inner_width]);

        self.reyscale=d3.scaleLinear()
            .range([0,self.mrg_inner_height]);

        self.xaxis = d3.axisBottom( self.xscale )
            .ticks(10)//.tickFormat((d)=>{return d*10+1+'月'});
            .tickFormat(d => d === 0  || d===13? "" : d+"月")

        self.xaxis_group = self.chart.append('g')
            .attr('transform', `translate(0, ${self.inner_height})`);

        self.yaxis = d3.axisLeft(self.yscale)
            .ticks(10)
            .tickFormat(d=> d===30?d+"℃":d)
            

        self.yaxis_group=self.chart.append('g')
    }

    update() {
        let self = this;

        //const xmin = d3.min( self.data, d => d.x );
        //const xmax = d3.max( self.data, d => d.x );

        const xmin=0;
        //let xmax=d3.max( self.data, d => d.x );
        //xmax=xmax+20;
        const xmax=13;


        self.xscale.domain( [xmin, xmax] );

        //const ymin = d3.min( self.data, d => d.y );
        //const ymax = d3.max( self.data, d => d.y );
        const ymax=30;
        const ymin=0;
        self.yscale.domain( [ymin, ymax] );

        self.render();
    }

    render() {
        let self = this;

        self.title.text('神戸市の平均気温(2021年)')
            .attr('x',(self.inner_width - self.config.margin.left)/2-60)
            .attr('y',self.config.margin.top/2 )
            .attr('font-size',20)
            .attr('font-weight','bold')

        self.chart.selectAll("circle")
            .data(self.data)
            .enter()
            .append("circle")
            .attr("cx", d => self.xscale( d.x ) )
            .attr("cy", d => self.yscale( d.y ) )
            .attr("r", d => d.r )
            //.attr('transform',`translate(${self.config.margin.left},0)`)
            
        self.xaxis_group
            .call( self.xaxis )
            .append('text')
            .attr("fill", "black")
            .attr('x',self.inner_width/2)
            .attr('y',self.config.margin.bottom-10)
            .attr('font-size',15)
            .attr('font-weight','bold')
            .text('月')

        
        
        
        self.yaxis_group
            .call(self.yaxis)
            .append('text')
            .attr("fill", "black")
            .attr('x',-(self.inner_height/2-self.config.margin.top))
            .attr('y',-30)
            .attr('font-size',15)
            .attr('font-weight','bold')
            .attr('transform','rotate(-90)')
            .text("平均気温")
    }
}
