class GeoChart extends Chart {

    constructor(config) {
        super(config);

        let self = this;

        self.config.centerPos = config.centerPos || [137.0, 38.2];
        self.config.scale = config.scale || 1000;
        self.config.color = config.color || '#2566CC';

        self.listeners = [];

        self._initGeoChart();
    }

    _initGeoChart() {
        let self = this;

        const projection = d3
            .geoMercator()
            .center(self.config.centerPos)
            .translate([self.inner_width / 2, self.inner_height / 2])
            .scale(self.config.scale);

        self.path = d3.geoPath().projection(projection);
    }

    _update(data) {

    }

    _render(data) {
        let self = this;

        let path = self.chart.selectAll('path')
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
            })

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