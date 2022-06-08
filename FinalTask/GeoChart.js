class GeoChart {
    //白地図完成

    constructor(data,config) {
        
        let self=this;

        this.config = {
            parent: config.parent,
            width: config.width || 256,
            height: config.height || 256,
            margin: config.margin || {top:10, right:10, bottom:10, left:10},
            cscale: config.cscale,
            centerPos:config.centerPos || [137.0, 38.2],
            color:config.color || 'white',
            scale:config.scale || 1000,

        }
        self.lists = [];
        //this.ccolor=[];
        this.data=data;
        self.selected="";
        self.preselected="";
        self.preselectedc="";
        this.init();
        
    }

    init() {
        let self = this;
        //self.ccolor=[];

        self.svg = d3.select(self.config.parent)
            .attr('width', self.config.width)
            .attr('height', self.config.height);
        
        self.chart = self.svg.append('g')
            .attr('transform', `translate(${self.config.margin.left}, ${self.config.margin.top})`);

        self.inner_width = self.config.width- self.config.margin.left - self.config.margin.right;
        self.inner_height = self.config.height- self.config.margin.top - self.config.margin.bottom;

        const projection = d3.geoMercator()
            .center(self.config.centerPos)
            .translate([self.inner_width / 2, self.inner_height / 2])
            .scale(self.config.scale);

        self.path = d3.geoPath().projection(projection);
    }

    update() {
        let self=this;
        
        self.chart.selectAll("path").remove();
        self.render();
        
       

    }

    render() {
        let self = this;
        

       

        let i=1;
      
        
        let path=self.chart.selectAll("path")
              .data(self.data.features)
              .enter()
              .append("path")
              .attr("d", self.path)
              .style("stroke", "black")
              .style("stroke-width", 0.25)
              .style("fill","white")
              .style('fill', d => {
                if (self.ccolor[d.properties.name_ja]!="") {
                    return self.ccolor[d.properties.name_ja]
                } else {
                    return "red";
                }
            })
              .on('mouseover', async function(item,any){

                  d3.select('#tooltip')
                      .style('opacity', 1)
                     
                      .html(`<div class="tooltip-label">${any.properties.name_ja}</div>`);

                      
              })
              .on('mousemove', (e) => {
                  const padding = 10;
                  d3.select('#tooltip')
                      .style('left', (e.pageX + padding) + 'px')
                      .style('top', (e.pageY + padding) + 'px');
              })
              .on('mouseleave', () => {
                  d3.select('#tooltip')
                      .style('opacity', 0);
              })
              
             
              self.lists.forEach((list) => {
                let name = list[0];
                let func = list[1];
                path.on(name, (e, d) => func(e, d));
            });

        
       

        self.lists.forEach((list) => {
            let name = list[0];
            let func = list[1];
            path.on(name, (e, d) => func(e, d));
        });
    }

    addList(name, func) {
        let self = this;

        self.lists.push([name, func]);
    }
}