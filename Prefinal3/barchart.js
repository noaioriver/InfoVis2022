class BarChart {

    constructor( config, data) {
        this.config = {
            parent: config.parent,
            width: config.width || 256,
            height: config.height || 256,
            margin: config.margin || {top:10, right:10, bottom:10, left:10},
            title: config.title || '',
            xlabel: config.xlabel || '',
            ylabel: config.ylabel || '',
        }
        this.data = data;
        this.data_type="";
        this.ccolor=[];
        //this.data_type=data_type;
        //this.ken=data;
        this.ken_array = ['北海道','青森県','岩手県','宮城県','秋田県','山形県','福島県','茨城県','栃木県','群馬県','埼玉県','千葉県','東京都','神奈川県','新潟県','富山県','石川県','福井県','山梨県','長野県','岐阜県','静岡県','愛知県','三重県','滋賀県','京都府','大阪府','兵庫県','奈良県','和歌山県','鳥取県','島根県','岡山県','広島県','山口県','徳島県','香川県','愛媛県','高知県','福岡県','佐賀県','長崎県','熊本県','大分県','宮崎県','鹿児島県','沖縄県']
        
        this.init();
        
    }

    init() {
        let self = this;
        self.data_type="";
        self.ccolor=[];

        //self.data_type="total"
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

        self.xlabel=self.svg.append("g").append("text");

        /*const xlabel_space = 40;
        self.svg.append('text')
            .style('font-size','15px')
            .attr('x', self.config.width / 2)
            .attr('y', self.inner_height + self.config.margin.top + xlabel_space)
            .text( self.config.xlabel );*/

        /*const ylabel_space = 60;
        self.svg.append('text')
            .style('font-size','15px')
            .attr('transform', `rotate(-90)`)
            .attr('y', self.config.margin.left - ylabel_space-5)
            .attr('x', -(self.config.height / 2))
            .attr('text-anchor', 'middle')
            .attr('dy', '1em')
            .text( self.config.ylabel );*/
    }

    update(data_type) {
        let self = this;

        let xmax=50

        self.data_type=data_type;
        
        
        self.xscale.domain( [0, xmax] );

        self.yscale.domain( self.data.map(d => d.label));

        self.chart.selectAll("rect").remove();
        self.chart.selectAll("text").remove();
        //self.chart.selectAll("number").remove();
        self.chart.selectAll(".graph__axis--x .tick:not(:first-of-type) line").remove();
        //self.chart.selectAll("zeronumber").remove();
        //self.chart.selectAll("tennumber").remove();
        //self.xaxis_group.remove();
        //self.yaxis_group.remove();
    

        self.render();
        //self.onClickSort();
    }

    hide(){
        let self=this;
        self.chart.selectAll("rect").remove();
        self.chart.selectAll("womannumber").remove();
        self.chart.selectAll("nhknumber").remove();
        self.chart.selectAll(".graph__axis--x .tick:not(:first-of-type) line").remove();
        self.svg
        .style('opacity', 0)
    }

    look(){
        let self=this;
        self.svg
        .style('opacity', 1)
    }

    render() {
        let self = this;

        self.xaxis_group = self.chart.append('g')
            .attr('transform', `translate(0, ${self.inner_height})`)
            .attr("class","graph__axis graph__axis--x")
            .call(self.xaxis);

        self.yaxis_group = self.chart.append('g')
            .call(self.yaxis);

        

///データ変換
        switch(self.data_type){

            case "woman":
                self.chart.selectAll("rect")
                .data(self.data)
                .enter()
                .append("rect")
                .attr("x", 0)
                .attr("y", d => self.yscale( d.label ) )
                .transition().duration(500)
                .attr("width", d => self.xscale(d.woman))
                .style('fill', d => {
                    if(this.ccolor)
                    {return self.ccolor[d.label]}
                    else{return "brack";}})
                .attr("height", self.yscale.bandwidth())
                
        
                self.chart.selectAll("womannumber")
                    .data(self.data)
                    .enter()
                    .append("text")
                    .transition().duration(500)
                    .text(d=>d.woman)
                    .attr("text-anchor", "end")
                    //.transition().duration(500)
                    .attr("x",  d => self.xscale(d.woman))
                    .attr("y",d => self.yscale( d.label )+8)
                    .attr("font-size", "10px")
                    .attr("fill", "white");

                /*self.svg.selectAll('xlabel')
                    .append("text")
                    .style('font-size','15px')
                    .attr('x', self.config.width / 2)
                    .attr('y', self.inner_height + self.config.margin.top )
                    .text( "地方議会の女性議員比率" )
                    .attr("text-anchor","middle");*/
                self.xlabel.style("opacity",0);


                self.xlabel
                    .attr('x', self.config.width / 2)
                    .attr('y', self.inner_height + self.config.margin.top+35 )
                    .text( "地方議会の女性議員比率" )
                    .attr("text-anchor","middle")
                    .style("opacity",1);
                    break





            case "nhk":
                self.chart.selectAll("rect")
                .data(self.data)
                .enter()
                .append("rect")
                .attr("x", 0)
                .attr("y", d => self.yscale( d.label ) )
                .attr("height", self.yscale.bandwidth())
                .style('fill', d => {
                    if(this.ccolor)
                    {return self.ccolor[d.label]}
                    else{return "brack";}})
                .transition().duration(500)
                .attr("width", d => self.xscale(d.nhk))
                
                
        
                self.chart.selectAll("nhknumber")
                            .data(self.data)
                            .enter()
                            .append("text")
                            .transition().duration(500)
                            .text(d=>d.nhk)
                            .attr("text-anchor", "end")
                            .attr("x",  d => self.xscale(d.nhk))
                            .attr("y",d => self.yscale( d.label )+8)
                            .attr("font-size", "10px")
                            .attr("fill", "white");
                self.xlabel.style("opacity",0);

                /*self.svg.append('text')
                            .style('font-size','15px')
                            .attr('x', self.config.width / 2)
                            .attr('y', self.inner_height + self.config.margin.top + 40)
                            .text( "NHK受信料不支払い率" )
                            .attr("text-anchor","middle");*/
                
                self.xlabel
                            .attr('x', self.config.width / 2)
                            .attr('y', self.inner_height + self.config.margin.top+35 )
                            .text( "NHK受信料不支払い率" )
                            .attr("text-anchor","middle")
                            .style("opacity",1);
                            break
                   

            
        }




        

        const ylabel_space=60;
        self.svg.append('text')
        .style('font-size','15px')
        .attr('transform', `rotate(-90)`)
        .attr('y', self.config.margin.left - ylabel_space-5)
        .attr('x', -(self.config.height / 2))
        .attr('text-anchor', 'middle')
        .attr('dy', '1em')
        .text( self.config.ylabel );
        
            


        self.chart.selectAll(".graph__axis--x .tick:not(:first-of-type) line")
            .attr("x1", 0)
            .attr("y1", -self.inner_height)
            .attr("x2", 0)
            .attr("y2", 0)
            .attr("stroke", "silver")
            .attr("stroke-dasharray", "2,2");

           /* d3.select('#reverse')
        .on('click', d => {
            self.data.reverse();
            self.update(self.data_type);
            
        })*/

        d3.select('#value-sort')
        .on('click',d =>{
            switch(self.data_type){
                case "woman":
                    self.data.sort((x,y) => y.woman - x.woman)
                    break
                case "nhk":
                    self.data.sort((x,y)=>(y.nhk)-(x.nhk))
                    break
                

            }
            //self.data.sort((x,y) => y.value - x.value)
            self.update(self.data_type);
        })

        d3.select('#value-sort2')
        .on('click',d =>{
            switch(self.data_type){
                case "woman":
                    self.data.sort((x,y) => x.woman - y.woman)
                    break
                case "nhk":
                    self.data.sort((x,y)=>(x.nhk)-(y.nhk))
                    break
                

            }
            //self.data.sort((x,y) => x.value - y.value)
            self.update(self.data_type);
        })

        d3.select('#original')
        .on('click',d =>{
            self.data.sort((x, y) => self.ken_array.indexOf(x.label) - self.ken_array.indexOf(y.label))
            //self.data.sort((x,y)=>y.index-x.index)
            self.update(self.data_type);
        })

    }

    onClickSort(){
        let self = this;
        //const ken_array = ['北海道','青森県','岩手県','宮城県','秋田県','山形県','福島県','茨城県','栃木県','群馬県','埼玉県','千葉県','東京都','神奈川県','新潟県','富山県','石川県','福井県','山梨県','長野県','岐阜県','静岡県','愛知県','三重県','滋賀県','京都府','大阪府','兵庫県','奈良県','和歌山県','鳥取県','島根県','岡山県','広島県','山口県','徳島県','香川県','愛媛県','高知県','福岡県','佐賀県','長崎県','熊本県','大分県','宮崎県','鹿児島県','沖縄県']
        /*d3.select('#reverse')
        .on('click', d => {
            self.data.reverse();
            self.update(self.data);
            self.chart.remove();
        })

        d3.select('#value-sort')
        .on('click',d =>{
            switch(self.data_type){
                case "woman":
                    self.data.sort((x,y) => y.woman - x.nhk)
                    break
                case "nhk":
                    self.data.sort((x,y)=>(y.nhk)-(x.nhk))
                    break
                

            }
            //self.data.sort((x,y) => y.value - x.value)
            self.update();
        })

        d3.select('#value-sort2')
        .on('click',d =>{
            switch(self.data_type){
                case "woman":
                    self.data.sort((x,y) => x.woman - y.woman)
                    break
                case "nhk":
                    self.data.sort((x,y)=>(x.nhk)-(y.nhk))
                    break
                

            }
            //self.data.sort((x,y) => x.value - y.value)
            self.update();
        })

        d3.select('#original')
        .on('click',d =>{
            self.data.sort((x, y) => self.ken_array.indexOf(x.label) - self.ken_array.indexOf(y.label))
            //self.data.sort((x,y)=>y.index-x.index)
            self.update();
        })*/

        d3.select('#woman')
        .on('click',d =>{
            //self.data.sort((x, y) => self.ken_array.indexOf(x.label) - self.ken_array.indexOf(y.label))
            self.data_type="woman"
            self.update();
        })

        d3.select('#nhk')
        .on('click',d =>{
            self.data_type="nhk"
            self.update();
        })

        
    }

}




