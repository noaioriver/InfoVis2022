/*
    m: margin
    cm: chart_margin
    l, r, t, b: left, right, top, bottom
    iw, ih: inner_width, inner_height

        (m.t, m.l)
        *----------------------
        | (m+cm) title        |
        |   *--------------   |
        |   |             |   |
        |   |             |   |
        | y |    chart    ih   |
        |   |             |   |
        |   |             |   |
        |   ------iw-------   |
        |          x          |
        -----------------------
*/
class Chart {

    constructor(config) {
        this.config = {
            parent: config.parent,
            width: config.width || 256,
            height: config.height || 256,
            offset: config.offset || [0, 0],
            margin: config.margin || { top: 10, right: 10, bottom: 10, left: 10 },
            chart_margin: config.chart_margin || { top: 10, right: 10, bottom: 10, left: 10 },
            xlabel: config.xlabel || "",
            ylabel: config.ylabel || "",
            title: config.title || "",
            fontsize: config.fontsize || '14pt',
        }

        this._initChart();
    }

    _initChart() {
        let self = this;

        self.svg = d3.select(self.config.parent)
            .attr('width', self.config.width)
            .attr('height', self.config.height);

        // Chart settings
        var xOffset = self.config.offset[0]
            + self.config.margin.left + self.config.chart_margin.left;
        var yOffset = self.config.offset[1]
            + self.config.margin.top + self.config.chart_margin.top;
        self.chart = self.svg.append('g')
            .attr('transform', `translate(${xOffset}, ${yOffset})`);

        self.inner_width = self.config.width
            - self.config.margin.left - self.config.margin.right
            - self.config.chart_margin.left - self.config.chart_margin.right;
        self.inner_height = self.config.height
            - self.config.margin.top - self.config.margin.bottom
            - self.config.chart_margin.top - self.config.chart_margin.bottom;

        var xOffset = self.config.margin.left;
        var yOffset = self.config.margin.top;
        self.labels = self.svg.append('g')
            .attr('transform', `translate(${xOffset}, ${yOffset})`);

        // Add ylabel
        self.ylabel = self.labels.append("text");

        // Add xlabel
        self.xlabel = self.labels.append("text");

        // Add title
        self.title = self.labels.append("text");

    }

    update(data) {
        let self = this;

        self._update(data);

        self._render(data);

        self.ylabel
            .attr("transform", "rotate(-90)")
            .attr("y", self.config.margin.left)
            .attr("x", -self.inner_height / 2 - self.config.margin.top)
            .attr("font-size", self.config.fontsize)
            .attr("font-weight", "bold")
            .attr("text-anchor", "middle")
            .text(self.config.ylabel);

        self.xlabel
            .attr("x", self.inner_width / 2
                + self.config.margin.left + self.config.chart_margin.left)
            .attr("y", self.inner_height
                + self.config.margin.top + self.config.chart_margin.top
                + self.config.chart_margin.bottom)
            .attr("font-size", self.config.fontsize)
            .attr("font-weight", "bold")
            .attr("text-anchor", "middle")
            .text(self.config.xlabel);

        self.title
            .attr("x", self.inner_width / 2
                + self.config.margin.left + self.config.chart_margin.left)
            .attr("y", self.config.margin.top)
            .attr("font-size", self.config.fontsize)
            .attr("font-weight", "bold")
            .attr("text-anchor", "middle")
            .text(self.config.title);
    }

    _update(data) {
        throw new Error('Not Implemented');
    }

    _render(data) {
        throw new Error('Not Implemented');
    }
}