d3.csv("https://noaioriver.github.io/InfoVis2022/W06/w06_task2.csv")
    .then( data => {
        data.forEach( d => { d.x = +d.x; d.y = +d.y; });

        var config = {
            parent: '#drawing_region',
            width: 256*2,
            height: 256*2,
            margin: {top:50, right:50, bottom:50, left:50},
            radius:5
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
            margin: config.margin || {top:20, right:20, bottom:20, left:20},
            radius:config.radius
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
            .attr("class","graph__axis graph__axis--y");
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

        /*self.chart.selectAll("circle")
            .data(self.data)
            .enter()
            .append("circle")
            .attr("cx", d => self.xscale( d.x ) )
            .attr("cy", d => self.yscale( d.y ) )
            .attr("r", d => d.r )
            //.attr('transform',`translate(${self.config.margin.left},0)`)*/

        let line=d3.line()
            /*.data(self.data)
            .enter()*/
            .x(d=>self.xscale(d.x))
            .y(d=>self.yscale(d.y));

        self.chart.append('path')
            .attr('d',line(self.data))
            .transition()
            .attr('stroke','gray')
            .attr('fill','none');

        let circles = self.chart.selectAll("circle")
            .data(self.data)
            .enter()
            .append('circle');

        circles
            .transition().duration(500)
            .attr("cx", d => self.xscale(d.x))
            .attr("cy", d => self.yscale(d.y))
            .attr("r", d => d.r)
            .attr("fill", "gray");

        circles
        .on('mouseover', (e,d) => {
            d3.select('#tooltip')
                .style('opacity', 1)
                .html(`<div class="tooltip-label"></div>
                月: ${d.x+"月"}<br>
                平均気温: ${d.y+"℃"}<br>
                `);

            d3.select(e.target)
                .transition().duration(250)
                .attr('r', self.config.radius * 2)
                .style("fill",
                function(d){
                    if(d.y==d3.max( self.data, d => d.y ))
                    {return "red";}
                    else if(d.y==d3.min( self.data, d => d.y ))
                    {return "blue";}
                    else
                    {return "black";}
                })
        })
        .on('mousemove', (e) => {
            const padding = 10;
            d3.select('#tooltip')
                .style('left', (e.pageX + padding) + 'px')
                .style('top', (e.pageY + padding) + 'px');
        })
        .on('mouseleave', (e) => {
            d3.select('#tooltip')
                .style('opacity', 0);
        
            d3.select(e.target)
                .transition().duration(500)
                .attr("r", self.config.radius)
                .style("fill", "gray")
        });
            
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

        self.chart.selectAll(".graph__axis--y .tick:not(:first-of-type) line")
            .attr("x1", 0)
            .attr("y1", 0)
            .attr("x2", self.inner_width)
            .attr("y2", 0)
            .attr("stroke", "silver")
            .attr("stroke-dasharray", "2,2");
    }
}
