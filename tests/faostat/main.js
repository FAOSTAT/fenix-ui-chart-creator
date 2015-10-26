/*global requirejs*/
requirejs(['../../src/js/paths', '../utils'], function (paths, Utils) {

    'use strict';

    var FENIX_CDN = "//fenixrepo.fao.org/cdn",
        baseUrl = '../../src/js/';

    // replace placeholders and baseUrl
    paths = Utils.replacePlaceholders(paths, FENIX_CDN);
    paths.baseUrl = baseUrl;

    requirejs.config(paths);

    requirejs(['fx-c-c/start', 'jquery', 'amplify'], function (ChartCreator, $) {

        // Chart with timeseries
/*        $.getJSON("data/data.json", function (model) {

            // Consistant Timeseri/e Chart
            var c = new ChartCreator();
            $.when(c.init({
                model: model,
                adapter: {
                    adapterType: 'faostat',
                    type: "timeserie",
                    xDimensions: 'yeargroup',
                    yDimensions: 'unit',
                    valueDimensions: 'value',
                    seriesDimensions: ['areagroup']
                },
                template: {},
                creator: {}
            })).then(function(creator) {
                var o = {
                    template: {
                        title: "Chart with Timeserie"
                    }
                };
                creator.render(Utils.lineChartOptions(o));
                //creator.render(Utils.columnChartOptions(o));
                //creator.render(Utils.barChartOptions(o));
            });

        });*/


/*        $.getJSON("data/no_yearly_data.json", function (model) {

            // Consistant Timeseri/e Chart
            var c = new ChartCreator();
            $.when(c.init({
                model: model,
                adapter: {
                    adapterType: 'faostat',
                    type: "normal",
                    xDimensions: 'yeargroup',
                    yDimensions: 'unit',
                    valueDimensions: 'value',
                    //seriesDimensions: ['areagroup', 'itemgroup']
                    seriesDimensions: []
                },
                template: {},
                creator: {}
            })).then(function(creator) {
                var o = {
                    template: {
                        title: "Scattered Data (No Timeserie)"
                    }
                };
                creator.render(Utils.lineChartOptions(o));
                //creator.render(Utils.columnChartOptions(o));
                //creator.render(Utils.barChartOptions(o));
            });

        });*/


        $.getJSON("data/double_axes.json", function (model) {

            // Consistant Timeseri/e Chart
            var c = new ChartCreator();
            $.when(c.init({
                model: model,
                adapter: {
                    adapterType: 'faostat',
                    type: "timeserie",
                    xDimensions: 'yeargroup',
                    yDimensions: 'unit',
                    valueDimensions: 'value',
                    seriesDimensions: ['areagroup', 'itemgroup']
                    //seriesDimensions: []
                },
                template: {},
                creator: {}
            })).then(function(creator) {
                var o = {
                    template: {
                        title: "Double Axes"
                    }
                };
                creator.render(Utils.lineChartOptions(o));
                //creator.render(Utils.columnChartOptions(o));
                //creator.render(Utils.barChartOptions(o));
            });

        });


        $.getJSON("data/scattered_data.json", function (model) {

            // Consistant Timeseri/e Chart
            var c = new ChartCreator();
            $.when(c.init({
                model: model,
                adapter: {
                    adapterType: 'faostat',
                    type: "timeserie",
                    xDimensions: 'yeargroup',
                    yDimensions: 'unit',
                    valueDimensions: 'value',
                    seriesDimensions: ['areagroup', 'itemgroup']
                    //seriesDimensions: []
                },
                template: {},
                creator: {}
            })).then(function(creator) {
                var o = {
                    template: {
                        title: "Double Axes"
                    }
                };
                creator.render(Utils.lineChartOptions(o));
                //creator.render(Utils.columnChartOptions(o));
                //creator.render(Utils.barChartOptions(o));
            });

        });

        $.getJSON("data/pie.json", function (model) {

            // Consistant Timeseri/e Chart
            var c = new ChartCreator();
            $.when(c.init({
                model: model,
                adapter: {
                    adapterType: 'faostat',
                    type: "pie",
                    xDimensions: null,
                    yDimensions: null,
                    valueDimensions: 'value',
                    seriesDimensions: ['areagroup']
                    //seriesDimensions: []
                },
                template: {},
                creator: {}
            })).then(function(creator) {
                var o = {
                    template: {
                        title: "Double Axes"
                    }
                };
                creator.render(Utils.lineChartOptions(o));
                //creator.render(Utils.columnChartOptions(o));
                //creator.render(Utils.barChartOptions(o));
            });

        });


/*
        // Chart with timeseries
        $.getJSON("data/fenix.json", function (model) {

            // Consistant Timeseri/e Chart
            var c = new ChartCreator();
            $.when(c.init({
                model: model,
                adapter: {
                    adapterType: 'faostat',
                    type: "timeserie",
                    xDimensions: 'time',
                    yDimensions: 'Element',
                    valueDimensions: 'value',
                    seriesDimensions: []
                },
                template: {},
                creator: {}
            })).then(function(creator) {
                var o = {
                    template: {
                        title: "Chart with Timeserie"
                    }
                };
                creator.render(Utils.lineChartOptions(o));
                creator.render(Utils.columnChartOptions(o));
                creator.render(Utils.barChartOptions(o));
            });

        });
*/

    });
});