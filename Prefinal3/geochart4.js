class GeoChart {
    //白地図完成

    constructor(data,config) {
        //this(config);
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
        self.listeners = [];
        //this.ccolor=[];
        this.data=data;
        self.selected="";
        self.preselected="";
        self.preselectedc="";
        this.init();
        /*let self = this;

        self.config.centerPos = config.centerPos || [137.0, 38.2];
        self.config.scale = config.scale || 1000;
        self.config.color = config.color || '#2566CC';

        self.listeners = [];

        self._initGeoChart();*/
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

    update(/*color*/) {
        let self=this;
        /*self.ccolor=color;*/
        self.chart.selectAll("path").remove();
        self.render();
        
        //self.ccolor=colormap;

    }

    render() {
        let self = this;
        //self.ccolor=colormap;

        //tuika

        let i=1;
        //self.ccolor["北海道"]="red";
        
        let path=self.chart.selectAll("path")
              .data(self.data.features)
              .enter()
              .append("path")
              .attr("d", self.path)
              .style("stroke", "black")
              .style("stroke-width", 0.25)
              .style("fill","white")
              .style('fill', d => {
                if (self.ccolor) {
                    return self.ccolor[d.properties.name_ja]
                } else {
                    return "white";
                }
            })
              .on('mouseover', async function(item,any){

                  d3.select('#tooltip')
                      .style('opacity', 1)
                      //.text(d);
                      .html(`<div class="tooltip-label">${any.properties.name_ja}</div>`);

                      //var p = await plotgraph(any.properties.pref);
                      //console.log(p);
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
              
              /*.on('click', (e,d)=>{
                  

                if(self.preselected!=""){
                    self.ccolor[self.preselected]=self.preselectedc;
                }
                self.preselectedc=self.ccolor[d.properties.name_ja];
                self.ccolor[d.properties.name_ja]="red";
                self.preselected=d.properties.name_ja;

                self.update();




              })*/

              self.listeners.forEach((listener) => {
                let name = listener[0];
                let func = listener[1];
                path.on(name, (e, d) => func(e, d));
            });

        
        //koko

        /*let path = self.chart.selectAll('path')
            .data(data.features)
            .join('path')
            .attr('d', self.path)
            .attr('stroke', '#666')
            .attr('stroke-width', 0.25)
            .attr('fill', d => {
                if (self.name2color) {
                    return self.name2color[d.properties.name_ja]
                } else {
                    return self.config.color
                }
            })*/

        self.listeners.forEach((listener) => {
            let name = listener[0];
            let func = listener[1];
            path.on(name, (e, d) => func(e, d));
        });
    }

    addListener(name, func) {
        let self = this;

        self.listeners.push([name, func]);
    }
}