class BarChart extends Chart {

    constructor(config) {
        super(config);

        let self = this;

        self.config.xticks = config.xticks || 5;
        self.config.fontsize = config.fontsize || '14pt';
        self.config.duration = config.duration || 1000;

        this._initBarchart();
    }

    _initBarchart() {
        let self = this;

        self.xscale = d3.scaleLinear()
            .range([0, self.inner_width]);

        self.yscale = d3.scaleBand()
            .range([0, self.inner_height])
            .paddingInner(0.1);

        self.xaxis_group = self.chart.append('g')
            .attr('transform', `translate(0, ${self.inner_height})`);

        self.yaxis_group = self.chart.append('g');

        self.xaxis = d3.axisBottom(self.xscale)
            .ticks(self.config.xticks)
            .tickSizeOuter(0);

        self.yaxis = d3.axisLeft(self.yscale)
            .tickSizeOuter(0);

        self.xaxis_group = self.chart.append('g')
            .attr('transform', `translate(0, ${self.inner_height})`)
            .call(self.xaxis);

        self.yaxis_group = self.chart.append('g')
            .call(self.yaxis);
    }

    _update(data) {
        let self = this;

        

        self.xscale
            .domain([0, d3.max(data, d => d.value)]);

        self.yscale
            .domain(data.map(d => d.label));
    }

    _render(data) {
        let self = this;

        self.chart.selectAll("rect")
            .data(data)
            .join("rect")
            .transition(self.config.duration)
            .attr("x", 0)
            .attr("y", d => self.yscale(d.label))
            .attr("width", d => self.xscale(d.value))
            .attr("height", self.yscale.bandwidth())
            .attr('fill', d => d.color || 'steelblue');

        self.xaxis_group.call(self.xaxis);
        self.yaxis_group.call(self.yaxis);
    }
}

