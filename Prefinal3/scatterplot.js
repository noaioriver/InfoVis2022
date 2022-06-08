class ScatterPlot {

    constructor( config, data ) {
        this.config = {
            parent: config.parent,
            width: config.width || 256,
            height: config.height || 256,
            margin: config.margin || {top:20, right:20, bottom:20, left:20},
            radius:config.radius,
            xlabel:config.xlabel||"",
            ylabel:config.ylabel||"",
            title:config.title||""
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

        self.title = self.svg.append('text');

        self.xlabel=self.chart.append("text");

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
            .ticks(5)//.tickFormat((d)=>{return d*10+1+'月'});

        self.xaxis_group = self.chart.append('g')
            .attr('transform', `translate(0, ${self.inner_height})`);

        self.yaxis = d3.axisLeft(self.yscale)
            .ticks(5)
            

        self.yaxis_group=self.chart.append('g')
            .attr("class","graph__axis graph__axis--y");
    }

    update() {
        let self = this;
        self.chart.selectAll("circle").remove();

        self.dx=d=>d.woman;
        self.dy=d=>d.nhk;

        //const xmin = d3.min( self.data, d => d.woman );
        //const xmax = d3.max( self.data, d => d.woman );

        const xmin=0;
        const xmax=50;
        //let xmax=d3.max( self.data, d => d.x );
        //xmax=xmax+20;


        self.xscale.domain( [xmin, xmax] );

        //const ymin = d3.min( self.data, d => d.nhk );
        //const ymax = d3.max( self.data, d => d.nhk );
        const ymax=50;
        const ymin=0;
        self.yscale.domain( [ymin, ymax] );

        self.render();
    }

    render() {
        let self = this;
/*1
        self.title.text('神戸市の平均気温(2021年)')
            .attr('x',(self.inner_width - self.config.margin.left)/2-60)
            .attr('y',self.config.margin.top/2 )
            .attr('font-size',20)
            .attr('font-weight','bold')
1*/

        self.title
            .attr('x',(self.inner_width - self.config.margin.left)/2-95)
            .attr('y',self.config.margin.top/2 )
            .attr('font-size',15)
            .attr('font-weight','bold')
            .attr('text-anchor', 'start')
            .text(self.config.title);


        /*self.chart.selectAll("circle")
            .data(self.data)
            .enter()
            .append("circle")
            .attr("cx", d => self.xscale( d.x ) )
            .attr("cy", d => self.yscale( d.y ) )
            .attr("r", d => d.r )
            //.attr('transform',`translate(${self.config.margin.left},0)`)*/

        /*let line=d3.line()
            //.data(self.data)
            //.enter()
            .x(d=>self.xscale(d.x))
            .y(d=>self.yscale(d.y));

        self.chart.append('path')
            .attr('d',line(self.data))
            .transition()
            .attr('stroke','gray')
            .attr('fill','none');*/

        let circles = self.chart.selectAll("circle")
            .data(self.data)
            .enter()
            .append('circle');

        circles
            .attr("cx", d => self.xscale(self.dx(d)))
            .attr("cy", d => self.yscale(self.dy(d)))
            .attr("r", 5)
            .attr("fill", "gray");

        circles
        .on('mouseover', (e,d) => {
            d3.select('#tooltip')
                .style('opacity', 1)
                .html(`<div class="tooltip-label">
                ${d.label}<br>
                女性割合: ${self.dx(d)+"%"}<br>
                NHK不支払い率: ${self.dy(d)+"%"}<br></div>
                `);

            d3.select(e.target)
                .transition().duration(250)
                .attr('r', self.config.radius * 2)
                .style("fill",
                function(d){
                    if(d.y==d3.max( self.data, d => d.y ))
                    {return "orange";}
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
            .text(self.config.xlabel+"(%)")

        
        
        
        self.yaxis_group
            .call(self.yaxis)
            .append('text')
            .attr("fill", "black")
            .attr('x',-50)
            .attr('y',-30)
            .attr('font-size',15)
            .attr('font-weight','bold')
            .attr('transform','rotate(-90)')
            .text(self.config.ylabel+"(%)")

        /*self.chart.selectAll(".graph__axis--y .tick:not(:first-of-type) line")
            .attr("x1", 0)
            .attr("y1", 0)
            .attr("x2", self.inner_width)
            .attr("y2", 0)
            .attr("stroke", "silver")
            .attr("stroke-dasharray", "2,2");*/
    }
}
