d3.csv("https://noaioriver.github.io/InfoVis2022/W10/nenhito.csv")
    .then( data => {
        data.forEach( d => { d.label = d.label; d.value = +d.value; d.index=+d.index; });

        var config = {
            parent: '#drawing_region',
            width: 256*3,
            height: 256*3,
            margin: {top:30, right:20, bottom:50, left:70},
            title: '日本の出生数',
            xlabel: '出生数(人)',
            ylabel: '年'
        };



        const bar_chart = new BarChart( config, data );
        bar_chart.update();
    })
    .catch( error => {
        console.log( error );
    });

class BarChart {

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
        //this.ken_array = ['北海道','青森県','岩手県','宮城県','秋田県','山形県','福島県','茨城県','栃木県','群馬県','埼玉県','千葉県','東京都','神奈川県','新潟県','富山県','石川県','福井県','山梨県','長野県','岐阜県','静岡県','愛知県','三重県','滋賀県','京都府','大阪府','兵庫県','奈良県','和歌山県','鳥取県','島根県','岡山県','広島県','山口県','徳島県','香川県','愛媛県','高知県','福岡県','佐賀県','長崎県','熊本県','大分県','宮崎県','鹿児島県','沖縄県']
        
        this.init();
    }

    init() {
        let self = this;

        //ken=Array.from(self.data);

        self.svg = d3.select( self.config.parent )
            .attr('width', self.config.width)
            .attr('height', self.config.height);

        self.chart = self.svg.append('g')
            .attr('transform', `translate(${self.config.margin.left}, ${self.config.margin.top})`);

        self.inner_width = self.config.width - self.config.margin.left - self.config.margin.right;
        self.inner_height = self.config.height - self.config.margin.top - self.config.margin.bottom;

        self.xscale = d3.scaleLinear()
            .range( [0, self.inner_width] );

        self.yscale = d3.scaleBand()
            .range( [0, self.inner_height] )
            .paddingInner(0.1);

        self.xaxis = d3.axisBottom( self.xscale )
            .ticks(5)
            .tickSizeOuter(0);
            

        self.yaxis = d3.axisLeft( self.yscale )
            .tickSizeOuter(0);
            

        self.xaxis_group = self.chart.append('g')
            .attr('transform', `translate(0, ${self.inner_height})`)
            .attr("class","graph__axis graph__axis--x");

        self.yaxis_group = self.chart.append('g');

        const title_space = 10;
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

        const ylabel_space = 60;
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

        self.xscale.domain( [0, 15000] );

        self.yscale.domain( self.data.map(d => d.label));

        self.chart.selectAll("rect").remove();
        self.chart.selectAll("text").remove();
        //self.xaxis_group.remove();
        //self.yaxis_group.remove();
    

        self.render();
        self.onClickSort();
    }

    render() {
        let self = this;

        self.xaxis_group = self.chart.append('g')
            .attr('transform', `translate(0, ${self.inner_height})`)
            .attr("class","graph__axis graph__axis--x")
            .call(self.xaxis);

        self.yaxis_group = self.chart.append('g')
            .call(self.yaxis);

        self.chart.selectAll("rect")
            .data(self.data)
            .enter()
            .append("rect")
            .attr("x", 0)
            .attr("y", d => self.yscale( d.label ) )
            .attr("width", d => self.xscale(d.value))
            .attr("height", self.yscale.bandwidth())
            //.style("fill",d=>d.color)
            //.style("fill",d=>d.value==d3.max( self.data, d => d.value )?"red":"black")
            .style("fill",
            function(d){
                if(d.value==d3.max( self.data, d => d.value ))
                {return "red";}
                else if(d.value==d3.min( self.data, d => d.value ))
                {return "blue";}
            })

        self.chart.selectAll("number")
            .data(self.data)
            .enter()
            .append("text")
            .text(d=>d.value)
            .attr("text-anchor", "middle")
            .attr("x",  d => self.xscale(d.value)-15)
            .attr("y",d => self.yscale( d.label )+10)
            .attr("font-size", "10px")
            .attr("fill", "white");
            


        self.chart.selectAll(".graph__axis--x .tick:not(:first-of-type) line")
            .attr("x1", 0)
            .attr("y1", -self.inner_height)
            .attr("x2", 0)
            .attr("y2", 0)
            .attr("stroke", "silver")
            .attr("stroke-dasharray", "2,2");
    }

    onClickSort(){
        let self = this;
        //const ken_array = ['北海道','青森県','岩手県','宮城県','秋田県','山形県','福島県','茨城県','栃木県','群馬県','埼玉県','千葉県','東京都','神奈川県','新潟県','富山県','石川県','福井県','山梨県','長野県','岐阜県','静岡県','愛知県','三重県','滋賀県','京都府','大阪府','兵庫県','奈良県','和歌山県','鳥取県','島根県','岡山県','広島県','山口県','徳島県','香川県','愛媛県','高知県','福岡県','佐賀県','長崎県','熊本県','大分県','宮崎県','鹿児島県','沖縄県']
        d3.select('#reverse')
        .on('click', d => {
            self.data.reverse();
            self.update(self.data);
        })

        d3.select('#value-sort')
        .on('click',d =>{
            self.data.sort((x,y) => y.value - x.value)
            self.update();
        })

        d3.select('#value-sort2')
        .on('click',d =>{
            self.data.sort((x,y) => x.value - y.value)
            self.update();
        })

        d3.select('#name-sort')
        .on('click',d =>{
            //self.data.sort((x, y) => self.ken_array.indexOf(x.label) - self.ken_array.indexOf(y.label))
            self.data.sort((x,y)=>y.index-x.index)
            self.update();
        })
    }

}




