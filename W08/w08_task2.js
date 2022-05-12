d3.csv("https://noaioriver.github.io/InfoVis2022/W06/w06_task2.csv")
    .then( data => {
        data.forEach( d => { d.x = +d.x; d.y = +d.y; d.r=+d.r; });

        var config = {
            parent: '#drawing_region',
            width: 256*3,
            height: 256*2,
            margin: {top:60, right:60, bottom:60, left:60},
            title: '神戸市の平均気温(2021年)',
            xlabel: '月',
            ylabel: '平均気温'
        };


        const line_chart = new LineChart( config, data );
        line_chart.update();
    })
    .catch( error => {
        console.log( error );
    });

class LineChart {

    constructor( config, data ) {
        this.config = {
            parent: config.parent,
            width: config.width || 256,
            height: config.height || 256,
            margin: config.margin || {top:10, right:10, bottom:10, left:10},
            title: config.title || '',
            xlabel: config.xlabel || '',
            ylabel: config.ylabel || ''
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

        self.inner_width = self.config.width - self.config.margin.left - self.config.margin.right;
        self.inner_height = self.config.height - self.config.margin.top - self.config.margin.bottom;

        self.xscale = d3.scaleLinear()
            .range( [0, self.inner_width] );

        self.yscale = d3.scaleLinear()
            .range( [self.inner_height, 0] )

        self.xaxis = d3.axisBottom( self.xscale )
            .ticks(10)
            .tickSizeOuter(0)
            .tickFormat(d => d === 0  || d===13? "" : d+"月");
            

        self.yaxis = d3.axisLeft( self.yscale )
            .tickSizeOuter(0)
            .tickSize(-self.inner_width)
            .tickFormat(d=> d===30?d+"℃":d);
            

        self.xaxis_group = self.chart.append('g')
            .attr('transform', `translate(0, ${self.inner_height})`);

        self.yaxis_group = self.chart.append('g');

        const title_space = 20;
        self.svg.append('text')
            .style('font-size', '20px')
            .style('font-weight', 'bold')
            .attr('text-anchor', 'middle')
            .attr('x', self.config.width / 2)
            .attr('y', self.config.margin.top - title_space)
            .text( self.config.title );

        const xlabel_space = 40;
        self.svg.append('text')
            .style('font-size','15px')
            .attr('x', self.config.width / 2)
            .attr('y', self.inner_height + self.config.margin.top + xlabel_space)
            .text( self.config.xlabel );

        const ylabel_space = 50;
        self.svg.append('text')
            .style('font-size','15px')
            .attr('transform', `rotate(-90)`)
            .attr('y', self.config.margin.left - ylabel_space)
            .attr('x', -(self.config.height / 2))
            .attr('text-anchor', 'middle')
            .attr('dy', '1em')
            .text( self.config.ylabel );
    }

    update() {
        let self = this;

        self.xscale.domain( [0, 13] );

        self.yscale.domain([0,30]);

        self.render();
    }

    render() {
        let self = this;

        let line=d3.line()
            /*.data(self.data)
            .enter()*/
            .x(d=>self.xscale(d.x))
            .y(d=>self.yscale(d.y));

        self.chart.append('path')
            .attr('d',line(self.data))
            .attr('stroke','black')
            .attr('fill','none');

        self.chart.selectAll("circle")
            .data(self.data)
            .enter()
            .append("circle")
            .attr("cx", d => self.xscale( d.x ) )
            .attr("cy", d => self.yscale( d.y ) )
            .attr("r", d => d.r )

           /* var data = [
                {x:0, y:100},
                {x:40, y:5},
                {x:120, y:80},
                {x:150, y:30},
                {x:200, y:50}
            ];
            
            const line = d3.line()
                  .x( d => d.x )
                  .y( d => d.y );
            
            self.svg.append('path')
                .attr('d', line(data))
                .attr('stroke', 'black')
                .attr('fill', 'none');*/

            self.chart.selectAll("text")
                .data(self.data)
                .enter()
                .append("text")
                .text(d=>d.y)
                .attr("x",  d => d.x<8?self.xscale( d.x )-15:self.xscale( d.x )+5)
                .attr("y",d => self.yscale( d.y )-10)
                .attr("font-size", "10px")
                .attr("fill", "gray");

            /*var rangeX = d3.range(0, self.inner_width, 60);
            var rangeY = d3.range(self.config.margin.bottom, self.inner_height, 30);
            // 縦方向のグリッドを生成
            self.chart.selectAll("line.y")
                .data(rangeY)
                .enter()
                .append("line")
                .attr("x1", 0).attr("y1", function(d,i){return d; })
                .attr("x2", self.inner_width).attr("y2", function(d,i){return d ;})
            // 横方向のグリッドを生成
            self.chart.selectAll("line.x")
                .data(rangeX)
                .enter()
                .append("line")
                .attr("x1", function(d,i){return d;}).attr("y1", 0)
                .attr("x2", function(d,i){return d;}).attr("y2", self.inner_height);
            // グリッドを描画
            self.chart.selectAll("line")
                .attr("stroke", "silver")
                .attr("shape-rendering", "crispEdges");*/

            
        self.xaxis_group
            .call( self.xaxis );

        self.yaxis_group
            .call( self.yaxis );
    }
}

