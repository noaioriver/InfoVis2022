async function main() {
    // データをロード
    const geoJson = await d3.json('https://nkzono99.github.io/InfoVis2021/final/japan.geo.json')
    let infects;
    await d3.csv("https://nkzono99.github.io/InfoVis2021/final/nprefectors.csv")
          .then(data => {
                data.forEach(d => { d.value = +d.value; d.color = '#2566CC'; });
                data.sort((a, b) => b.value - a.value);
                infects = data;
          }).catch(error => {
                console.log(error);
          });
    var dtwJson;
    //dtwJson = await d3.json('https://nkzono99.github.io/InfoVis2021/final/dist.json')

    // グラフオブジェクトの生成
    let geoChart = new GeoChart({
          parent: '#geochart_region',
          width: 400,
          height: 550,
          margin: { top: 10, right: 10, bottom: 20, left: 10 },
          chart_margin: { top: 10, right: 10, bottom: 10, left: 10 },
          color: '#2566CC',
    });

    /*let barChart = new BarChart({
          parent: '#barchart_region',
          width: 400,
          height: 600,
          fontsize: '10pt',
          offset: [0, 0],
          margin: { top: 10, right: 10, bottom: 20, left: 10 },
          chart_margin: { top: 30, right: 10, bottom: 40, left: 70 },
          xlabel: '感染者数',
          ylabel: '都道府県',
          title: '都道府県別累計感染者数(2020/1/16~2021/5/25)'
    });*/

    /*let dtwChart = new BarChart({
          parent: '#dtwchart_region',
          width: 400,
          height: 600,
          offset: [0, 0],
          margin: { top: 10, right: 10, bottom: 20, left: 10 },
          chart_margin: { top: 30, right: 10, bottom: 40, left: 70 },
          xlabel: '1 / Distance',
          ylabel: '都道府県',
          title: '選択都道府県との感染者数増減の類似度'
    });*/
    // 状態変数(選択されている都道府県とそれに付随するデータ)を定義
    let name2color = {};
    let selected_prefecture = ['', ''];

    // ラジオボタンの設定
    document.getElementById('method1')
          .addEventListener('change', async () => {
                dtwJson = await d3.json('https://nkzono99.github.io/InfoVis2021/final/dist.json')
                dtwChart.config.xlabel = '1 / Distance';
          });
    document.getElementById('method2')
          .addEventListener('change', async () => {
                dtwJson = await d3.json('https://nkzono99.github.io/InfoVis2021/final/prefectures_dtw.json')
                dtwChart.config.xlabel = '1 / DTW';
          });

    // マウス用アニメーションの設定
    geoChart.addListener('mouseover', (e, d) => {
          d3.select(e.currentTarget).attr('fill', 'red');
          d3.select('#tooltip')
                .style('opacity', 1)
                .html(`<div class="tooltip-label">${d.properties.name_ja}</div>`);
    });
    geoChart.addListener('mousemove', (e) => {
          const padding = 10;
          d3.select('#tooltip')
                .style('left', (e.pageX + padding) + 'px')
                .style('top', (e.pageY + padding) + 'px');
    })
    geoChart.addListener('mouseleave', (e, d) => {
          let target = selected_prefecture[0];
          let d_selected = selected_prefecture[1];
          if (d_selected != '' && d_selected.properties.name_ja == d.properties.name_ja) {
                return;
          }
          let cl = name2color[d.properties.name_ja] || '#2566CC'
          d3.select(e.currentTarget).attr('fill', cl);

          d3.select('#tooltip')
                .style('opacity', 0);
    });

    // 都道府県を選択するイベントを設定
    geoChart.addListener('click', (e, d) => {
          // Unhighlight to previous target
          /*let target = selected_prefecture[0];
          let d_selected = selected_prefecture[1];
          if (target != '') {
                d3.select(target)
                      .attr('fill', '#2566CC')
                      .attr('stroke-width', 2);
          }*/

          // Highlight to current taget
          /*selected_prefecture = [e.currentTarget, d];
          d3.select(e.currentTarget)
                .attr('fill', 'black')
                .attr('stroke-width', 1.5);*/

          /*let dtw_selected = Object.entries(dtwJson[d.properties.name_ja]);
          name2color = {};
          name2color[d.properties.name_ja] = 'red';
          dtw_selected.forEach(d => { d.label = d[0]; d.value = 1.0 / (+d[1]); });
          dtw_selected.forEach(selected => {
                if (selected.label == d.properties.name_ja) {
                      selected.value = 0.0;
                };
          });*/

          //カラースケール
          /*dtw_selected.sort((a, b) => -a.value + b.value);
          dtw_selected.forEach((d, i) => {
                // d.color = d3.interpolateRdBu(i / dtw_selected.length);
                d.color = d3.interpolateRdBu(1.0 - d.value / d3.max(dtw_selected, d => d.value))
                name2color[d.label] = d.color;
          });*/

          // Plot graph of the number of infects.
          /*infects.forEach(d => {
                let name_ja = selected_prefecture[1].properties.name_ja;
                if (d.label == name_ja) {
                      d.color = 'red';
                } else {
                      d.color = '#2566CC';
                }
          });*/
          //barChart.update(infects);

          //dtwChart.update(dtw_selected);
          //geoChart.config.title = '選択: ' + selected_prefecture[1].properties.name_ja;
          //geoChart.name2color = name2color;
          //geoChart.update(geoJson);
    });

    // 各種イベントを設定した後、初期グラフを描画
    geoChart.update(geoJson);
    //barChart.update(infects);
    //dtwChart.update([]);
}

main()

