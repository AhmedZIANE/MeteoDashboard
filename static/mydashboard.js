// contient les articles de presse, qui doivent être 
// gardés en mémoire même après affichage du graphique
var news_data;

// Palette de couleurs utilisée par tous les graphiques
var colors = ["#1D507A", "#2F6999", "#66A0D1", "#8FC0E9", "#4682B4"];



// Chargement des données météo
d3.json('/api/meteo', display_nvd3_graph);


function display_nvd3_graph(data) {

    if (data["status"] == "ok") {
        var temperature_data = [{
            key: 'Temperature',
            values: data["data"]
        }]

        var first_date = temperature_data[0]['values'][0][0];

        nv.addGraph(function() {

            var chart = nv.models.lineWithFocusChart()
                .x(function(d) {
                    return d[0]
                })
                .y(function(d) {
                    return d[1]
                })
                .yDomain([-5, 35])
                .height(270)
                .color(colors);

            chart.brushExtent([new Date(first_date), new Date(first_date + 24*3600*1000)]); // 24*3600*1000ms = 1jour

            chart.xAxis
                .showMaxMin(false)
                .tickFormat(function(d) {
                    return d3.time.format('%H:00 (%a)')(new Date(d))
                });

            chart.x2Axis
                .showMaxMin(false)
                .tickFormat(function(d) {
                    return d3.time.format('%a %-d/%-m')(new Date(d))
                });

            chart.yAxis //Chart y-axis settings
                .showMaxMin(false)
                .axisLabel('Temperature (°c)')
                .tickFormat(d3.format('.00f'));

            chart.y2Axis
                .showMaxMin(false)
                .ticks(false);

            d3.select('#meteo svg')
                .datum(temperature_data)
                .call(chart);

            //Update the chart when window resizes.
            nv.utils.windowResize(chart.update);

            return chart;
        });
    }
}