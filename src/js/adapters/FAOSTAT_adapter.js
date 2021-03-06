/*global define, amplify, console*/
define([
        'jquery',
        'underscore',
        'loglevel',
        //'highcharts',
        'amplify'
    ],
    function ($, _, log) {

        'use strict';

        var defaultOptions = {

                lang: 'EN',

                decimalPlaces: 0,

                //type: 'timeserie',  //[custom, scatter, pie] TODO: probably not needed and not used yet

                // Chart (Based on Highchart Definition)
                chartObj: {
                    chart: {},
                    xAxis: {},
                    //yAxis: [],
                    series: []
                },


                // filtering parameters
                //xDimensions: ['yeargroup'],
                //yDimensions: ['unit'],
                //valueDimensions: ['value'],
                //seriesDimensions: ['areagroup'],

                //UMColumn : "um",

                // TODO add as paramenter (N.B. for now the yAxis is added to the serie name to avoid conflicts)
                addYAxisToSeriesName: true,

                // aux variables used to process the model
                aux: {
                    x: {},
                    y: {},
                    value: {},
                    series: []
                },

                seriesLabelBreak: '<br>',

                debugging: false
            },
            e = {
                DESTROY: 'fx.component.chart.destroy',
                READY: 'fx.component.chart.ready'
            };

        function FAOSTAT_Highchart_Adapter() {
            return this;
        }

        FAOSTAT_Highchart_Adapter.prototype.prepareData = function (config) {

            if (this.o === undefined) {
                this.o = $.extend(true, {}, defaultOptions, config);
            }
            else {
                var chartObj = this.o.chartObj;
                this.o = $.extend(true, {}, defaultOptions, config);
                this.o.chartObj = chartObj;
            }

            if (this._validateInput() === true) {
                this._initVariable();
                this._prepareData();
                if (this._validateData() === true) {
                    this._onValidateDataSuccess();
                } else {
                    this._onValidateDataError();
                }
            } else {
                log.error(this.errors);
                throw new Error("FENIX Chart creator has not a valid configuration");
            }
        };

        FAOSTAT_Highchart_Adapter.prototype._prepareData = function () {

            // TODO: change variables names according to the new nomenclature

            var xAxis = this.o.xDimensions,
                yAxis = this.o.yDimensions,
                value = this.o.valueDimensions,
                series = this.o.seriesDimensions,
                columns = this.o.$columns,
                addYAxisToSeriesName = this.o.addYAxisToSeriesName;

            // TODO: workaround on arrays used to standardize all charts.
            // TODO: Add check on multiple columns (like for series)
            xAxis = _.isArray(xAxis) ? xAxis[0] : xAxis;
            yAxis = _.isArray(yAxis) ? yAxis[0] : yAxis;
            value = _.isArray(value) ? value[0] : value;

            // TODO: if type is 'pie' force the adapted to avoid xDimensions and yDimensions
            if (this.o.type === 'pie') {
                this.o.xDimensions = null;
                //this.o.yDimensions = null;
                xAxis = this.o.xDimensions;
                yAxis = this.o.yDimensions;
                yAxis = _.isArray(yAxis) ? yAxis[0] : yAxis;

                //log.info(yAxis)
            }


            // parsing columns to get
            columns.forEach(_.bind(function (column) {

                // TODO: this should be already checked and validated
                //if (column.hasOwnProperty('dimension_id') && (column.type === 'label' || column.type === 'unit' || column.type === 'value')) {
                if (column.hasOwnProperty('dimension_id') && (column.type !== 'code')) {

                    if (column.dimension_id === xAxis) {
                        this.o.aux.x = this._getColumnStructure(columns, column);
                    }

                    else if (column.dimension_id === yAxis) {
                        this.o.aux.y = this._getColumnStructure(columns, column);
                    }

                    else if (column.dimension_id === value) {
                        this.o.aux.value = this._getColumnStructure(columns, column);
                    }

                    if (series.length > 0) {
                        series.forEach(_.bind(function (serie) {
                            if (column.dimension_id === serie) {
                                this.o.aux.series.push(this._getColumnStructure(columns, column));
                            }
                        }, this));

                        // TODO: check the series index to map dinamically
                    }
                }

            }, this));

            // get series columns
            if (this.o.aux.series.length <= 0) {
                columns.forEach(_.bind(function (column) {

                    if (column.hasOwnProperty('dimension_id')) {
                        if (column.type !== 'code') {
                            var index = column.index;

                            // TODO: issue with the y axis and inconsistent series
                            // TODO i.e. series with the same name but with different yAxis
                            // if (index != this.aux.x.index && index != this.aux.y.index && index != this.aux.value.index) {
                            if (index !== this.o.aux.x.index && index !== this.o.aux.value.index) {
                                // check if serie already in series (skip coded columns!)
                                this.o.aux.series.push(this._getColumnStructure(this.o.$columns, column));
                            }
                        }
                    }

                }, this));
            }

            this._printAuxColumns();
        };

      /*  FAOSTAT_Highchart_Adapter.prototype._addUnitOfMeasure = function() {

            var suffix = '',
                index = -1;

            if (this.o.aux.y.index > -1 && Array.isArray(this.o.$data) && this.o.$data.length > 0) {
                suffix = " " + this.o.$data[0][index];
            }

            return { tooltip: {
                valueSuffix: suffix
                }
            };

        };*/

        /**
         * Get column structure
         * @param columns
         * @param column
         * @param index
         * @returns {*}
         * @private
         */
        FAOSTAT_Highchart_Adapter.prototype._getColumnStructure = function (columns, column) {
            if (column.hasOwnProperty('type')) {
                switch (column.type) {
                    case 'code':
                        //TODO: remove it
                        return null;
                    default :
                        return {
                            column: column,
                            //TODO: remove it when API changes
                            index: (column.key === 'Unit Description')? 'Unit': column.key,
                            id: column.dimension_id
                        };
                }
            }
        };

        FAOSTAT_Highchart_Adapter.prototype.prepareChart = function (config) {

            config = $.extend(true, {}, this.o, config);

            switch (config.type) {
                case 'pie':
                    this.o.chartObj = this._processPieChart(config);
                    break;
                case 'treemap':
                    this.o.chartObj = this._processTreeMapChart(config);
                    break;
                case 'scatter':
                    break;
                default :
                    // check wheater the xAxis column is time
                   //    var xSubject = config.aux.x.column;
                    this.o.chartObj = this._processStandardChart(config, config.type.toLowerCase());
            }

            //log.info(this.o.chartObj);

            return this.o.chartObj;
        };

        /**
         * This is used for standard chart and timeseries
         * @param isTimeserie
         * @private
         */
        FAOSTAT_Highchart_Adapter.prototype._processStandardChart = function (config, type) {

            var chartObj = config.chartObj,
                x = config.aux.x,
                y = config.aux.y,
                value = config.aux.value,
                auxSeries = config.aux.series,
                decimalPlaces = config.decimalPlaces,
                data = config.$data;

            // Sort Data TODO: check if the sort is always applicable
            //this._sortData(data, x.index);

            // Process yAxis
            if (y.index) {
                chartObj.yAxis = this._createYAxis(chartObj.yAxis, data, y.index);
            }

            //log.info(type)
            // create Series
            // TODO: used switch
            if (type === 'timeserie') {

                // TODO: move it to the template!!
                //log.warn('TODO: xAxis Categories: for timeserie directly datatime??');
                //chartObj.xAxis.type = 'datetime';
                //chartObj.xAxis.minRange = 30 * 24 * 3600 * 1000; //
                //chartObj.xAxis.minTickInterval = 12 * 30 * 24 * 3600 * 1000; // An year
                // TODO: add yearly data

                chartObj.xAxis.categories = this._createXAxisCategoriesTimeseries(data, x.index);
                //chartObj.series = this._createSeriesTimeserie(chartObj.series, data, x, y, value, chartObj.yAxis, auxSeries);
                //chartObj.series = this._createSeriesTimeserie(chartObj.series, data, x, y, value, chartObj.yAxis, auxSeries);
                chartObj.series = this._createSeriesStandard(data, x, y, value, chartObj.yAxis, chartObj.xAxis, auxSeries, decimalPlaces);

            }
            else if (type === 'timeserie_compare') {

                // TODO: move it to the template!!
                //log.warn('TODO: xAxis Categories: for timeserie directly datatime??');
                chartObj.xAxis.type = 'datetime';
                chartObj.xAxis.minRange = 30 * 24 * 3600 * 1000; //
                chartObj.xAxis.minTickInterval = 12 * 30 * 24 * 3600 * 1000; // An year

                // TODO: add yearly data
                chartObj.series = this._createSeriesTimeserie(chartObj.series, data, x, y, value, chartObj.yAxis, auxSeries);
            }
            else {
                // create xAxis categories
                chartObj.xAxis.categories = this._createXAxisCategories(data, x.index);
                chartObj.series = this._createSeriesStandard(data, x, y, value, chartObj.yAxis, chartObj.xAxis, auxSeries, decimalPlaces);
            }

            // TODO: add tooltip on series?

            // TODO: this has to be refactoring, doesn't work with multiple yAxis
            //$.extend(true, chartObj,this._addUnitOfMeasure());

            //log.info(chartObj)

            return chartObj;
        };

        FAOSTAT_Highchart_Adapter.prototype._addData = function (data, columnIndex) {

        },

        /**
         * creates the yAxis TODO: probably to check
         * @param data
         * @param columnIndex
         * @private
         */
        FAOSTAT_Highchart_Adapter.prototype._createYAxis = function (yAxis, data, columnIndex) {
            var yAxisNames = [],
                yAxis = yAxis || [],
                yAxisCache = [];

            // if original yAxis was not empty
            yAxis.forEach(function (value) {
                yAxisCache.push(value.title.text);
            });

            // TODO it can be done faster the unique array
            data.forEach(function (value) {
                if ($.inArray(value[columnIndex], yAxisCache) === -1) {
                    yAxisNames.push(value[columnIndex]);
                }
            });
            yAxisNames = _.uniq(yAxisNames);

            // creating yAxis objects
            // TODO; probably it should merge the yAxis template somehow. PROBLEM: how to merge multiple axes properties from the baseConfig?
            yAxisNames.forEach(function (v) {
                yAxis.push({title: {text: v}});
            });

            return yAxis;
        };


        FAOSTAT_Highchart_Adapter.prototype._createXAxisCategoriesTimeseries = function (data, xIndex) {

            var xCategories = [];
            data.forEach(function (row) {
                if (row[xIndex] === null) {
                    log.warn("Error on the xAxis data (is null)", row[xIndex], row, xIndex);
                }
                else {
                    xCategories.push(row[xIndex]);
                }
            });

            var max = Math.max.apply(null, xCategories);
            var min = Math.min.apply(null, xCategories);

            xCategories = [];
            for(var i = min; i <= max; i++) {
                xCategories.push(i.toString());
            }

            return xCategories;
            //return _.uniq(xCategories);
        };

        /**
         * Create unique xAxis categories
         * @param data
         * @private
         */
        FAOSTAT_Highchart_Adapter.prototype._createXAxisCategories = function (data, xIndex) {

            var xCategories = [];
            data.forEach(function (row) {
                if (row[xIndex] === null) {
                    log.warn("Error on the xAxis data (is null)", row[xIndex], row, xIndex);
                }
                else {
                    xCategories.push(row[xIndex]);
                }
            });

            return _.uniq(xCategories);
        };

        FAOSTAT_Highchart_Adapter.prototype._createSeriesTimeserie = function (series, data, x, y, value, yAxis, auxSeries) {
            var xIndex = x.index,
                yIndex = y.index,
                valueIndex = value.index,
                series = series || [];


            //log.info(x)


            // Create the series
            data.forEach(_.bind(function (row) {

                // unique key for series
                var name = this._createSeriesName(row, auxSeries);

                // get serie
                var serie = _.findWhere(data.series, {name: name}) || {name: name},
                    yLabel;

                // data of the serie
                serie.data = [];

                // Create yAxis if exists
                if (yIndex !== null) {
                    serie.yAxis = this._getYAxisIndex(yAxis, row[yIndex]);
                }

                // push the value of the serie
                if (row[xIndex] !== null && row[xIndex] !== undefined && row[valueIndex] !== undefined && row[valueIndex] !== null) {

                    if (row[valueIndex] !== undefined && row[valueIndex] !== null) {

                        // TODO: FIX THE VALUE!!!!!!!!!!!!!!
                        serie.data.push([
                            this._getDatetimeByDataType('year', row[xIndex]), row[valueIndex],
                            //parseFloat(this.replaceAll(row[valueIndex], ",", ""))
                        ]);
                        //serie.data.push([row[xIndex], 12]);
                        // fill gaps
                        //log.info(serie.xAxis);

                        // Add serie to series
                        series = this._addSerie(series, serie);
                    }
                }

            }, this));

            return series;
        };

        /**
         * Add serie to series
         * @param series
         * @param serie
         * @returns {*}
         * @private
         */
            //TODO: clean the code, clone the object to return a new series.
            // TODO: This method can be highly simplified.
        FAOSTAT_Highchart_Adapter.prototype._addSerie = function (series, serie, valueIndex) {
            var seriesAlreadyAdded = false;
            for (var i = 0; i < series.length; i++) {
                if (serie.name === series[i].name) {

                    // this a "switch" between the timeserie and a standard chart
                    // TODO: make it nicer, or separate the two _addSerie function
                    // TODO: between _addSerie and _addSerieTimeseries
                    if (valueIndex) {
                        series[i].data[valueIndex] = serie.data[valueIndex];
                    }
                    else {
                        series[i].data.push(serie.data[0]);
                    }
                    seriesAlreadyAdded = true;
                    break;
                }
            }

            if (!seriesAlreadyAdded) {
                series.push(serie);
            }

            return series;
        };

        FAOSTAT_Highchart_Adapter.prototype._createSeriesStandard = function (data, x, y, value, yAxis, xAxis, auxSeries, decimalPlaces) {

            try {
                var xIndex = x.index,
                    yIndex = y.index,
                    valueIndex = value.index,
                    xCategories = xAxis.categories,
                    decimalPlaces = decimalPlaces,
                    series = [];

                // Create the series
                _.each(data, function (row) {

                    // unique key for series
                    var name = this._createSeriesName(row, auxSeries);

                    // get serie
                    var serie = _.findWhere(data.series, {name: name}) || {name: name},
                        yLabel;

                    // data of the serie
                    serie.data = [];
                    // initialize serie with null values. this fixed missing values from categories
                    _.each(xCategories, function () {
                        serie.data.push(null);
                    });

                    // Create yAxis if exists
                    if (yIndex !== null) {
                        serie.yAxis = this._getYAxisIndex(yAxis, row[yIndex]);
                    }

                    var index = _.indexOf(xCategories, row[xIndex]);

                    if (index !== null) {

                        if (row[valueIndex] !== undefined && row[valueIndex] !== null && index !== -1) {

                            //serie.data[index] = isNaN(row[valueIndex]) ? row[valueIndex] : parseFloat(row[valueIndex].replace(",", ""));
                            serie.data[index] = parseFloat(row[valueIndex].toFixed(decimalPlaces));
                            // Add serie to series
                            series = this._addSerie(series, serie, index);

                        }
                    }

                }, this);

            }catch (e) {
                log.error(e);
            }

            return series;
        };

        /**
         * Sort the data by an index (in theory this should be the xAxis index 'this.aux.x.index')
         * @param data
         * @param index
         * @private
         */
        FAOSTAT_Highchart_Adapter.prototype._sortData = function (data, index) {

            data.sort(_.bind(function (a, b) {

                if (a[index] < b[index]) {
                    return -1;
                }
                if (a[index] > b[index]) {
                    return 1;
                }
                // a must be equal to b
                return 0;
            }, this));
        };

        FAOSTAT_Highchart_Adapter.prototype._getDatetimeByDataType = function (type, value) {

            // TODO: this is can be simplified and not applied to each row
            switch (type.toLowerCase()) {
                case 'year':
                    return Date.UTC(value, 0, 1);
                default :
                    log.warn("Date type date format not yet supported: " + type);
                    break;
            }
        };

        FAOSTAT_Highchart_Adapter.prototype._getYAxisIndex = function (yAxis, label) {
            var index = 0;

            if (label !== null) {
                _.each(yAxis, function (y, i) {

                    if (y.title.text === label) {
                        index = i;
                    }

                }, this);

                if (index < 0) {
                    log.error("Data contains an unknown yAxis value: " + label);
                }
            }

            return index;
        };

        FAOSTAT_Highchart_Adapter.prototype._createSeriesName = function (row, auxSeries) {

            var name = [];

            // TODO Add a tooltip name? (based on the array)

            _.each(auxSeries, function (serie) {
                if (row[serie.index] !== undefined && row[serie.index] !== null) {
                   name.push(row[serie.index]);
                }
            }, this);

            return name.join(this.o.seriesLabelBreak);
        };

        FAOSTAT_Highchart_Adapter.prototype._processPieChart = function (config) {
            var chartObj = config.chartObj,
                valueIndex = config.aux.value.index,
                auxSeries = config.aux.series,
                yAxisIndex = (config.aux.y)? config.aux.y.index: null,
                decimalPlaces = config.decimalPlaces,
                data = config.$data;

            // force type "pie" to chart
            chartObj.chart.type = "pie";



            // initialize the series
            chartObj.series = [
                {
                    // TODO: name?
                    name: ' ',
                    data: []
                }
            ];


            // create PIE series
            var measurementUnit = null;
            _.each(data, function (row) {

                var name = this._createSeriesName(row, auxSeries);
                if (row[valueIndex] !== null && name !== null) {
                    //var value = isNaN(row[valueIndex]) ? row[valueIndex] : parseFloat(row[valueIndex].replace(",", ""));
                    var value = parseFloat(row[valueIndex].toFixed(decimalPlaces));
                    // N.B. values <=0 are not allowed in a pie chart
                    if (value > 0) {
                        chartObj.series[0].data.push([name, value]);
                    }
                }
                if (yAxisIndex && row[yAxisIndex] !== null) {
                    measurementUnit = row[yAxisIndex];
                }

            }, this);


            // add measurement unit
            chartObj.plotOptions = {
                pie: {
                    tooltip: {
                        valueSuffix: (measurementUnit)? ' (' + measurementUnit + ')': ''
                    }
                }
            };

            return chartObj;
        };

        FAOSTAT_Highchart_Adapter.prototype._processTreeMapChart = function (config) {

            var chartObj = config.chartObj,
                valueIndex = config.aux.value.index,
                auxSeries = config.aux.series,
                yAxisIndex = (config.aux.y)? config.aux.y.index: null,
                decimalPlaces = config.decimalPlaces,
                data = config.$data;

            // force type "pie" to chart
            chartObj.chart.type = "treemap";

            // TODO: remove hardcoded here
            // N.B. this goes in conflict with other options in the standard charts
            chartObj.colorAxis = {
                minColor: '#ffeda0',
                maxColor: '#e31a1c'
            };
            // initialize the series
            chartObj.series = [
                {
                    type: 'treemap',
                    layoutAlgorithm: 'squarified',
                    data: []
                }
            ];


            // create TreeMap series
            var measurementUnit = null;
            _.each(data, function (row) {

                var name = this._createSeriesName(row, auxSeries);
                if (row[valueIndex] !== null && name !== null) {
                    //var value = isNaN(row[valueIndex]) ? row[valueIndex] : parseFloat(row[valueIndex].replace(",", ""));
                    var value = parseFloat(row[valueIndex].toFixed(decimalPlaces));
                    // N.B. values <=0 are not allowed in a pie chart
                    if (value > 0) {
                        chartObj.series[0].data.push({
                            name: name,
                            value: value,
                            colorValue: value
                        });
                    }
                }
                if (yAxisIndex && row[yAxisIndex] !== null) {
                    measurementUnit = row[yAxisIndex];
                }

            }, this);


            // add measurement unit
            chartObj.plotOptions = {
                treemap: {
                    tooltip: {
                        valueSuffix: (measurementUnit)? ' (' + measurementUnit + ')': ''
                    }
                }
            };

            // fix highcharts bug (with the shared it doesn't work the hover)
            chartObj.tooltip = {
                "shared": false
            };

            return chartObj;
        };

        FAOSTAT_Highchart_Adapter.prototype._onValidateDataSuccess = function () {
            amplify.publish(e.READY, this);
        };

        FAOSTAT_Highchart_Adapter.prototype._onValidateDataError = function () {
            this._showConfigurationForm();
        };

        FAOSTAT_Highchart_Adapter.prototype._initVariable = function () {

            // TODO: this could be simplified (and not store all that information)
            this.o.$metadata = this.o.model.metadata;
            this.o.$columns = this.o.$metadata.dsd;
            this.o.$data = this.o.model.data;

        };

        FAOSTAT_Highchart_Adapter.prototype._validateInput = function () {

            this.errors = {};

            //Metadata
            if (!this.o.model.hasOwnProperty("metadata")) {
                this.errors.metadata = "Model does not container 'metadata' attribute.";
            }

            if (!this.o.model.metadata.hasOwnProperty("dsd")) {
                this.errors.dsd = "Metadata does not container 'dsd' attribute.";
            }


            //Container
            /* if (!this.hasOwnProperty("container")) {
             this.errors.container = "'container' attribute not present.";
             }

             if ($(this.container).find(this.s.CONTENT) === 0) {
             this.errors.container = "'container' is not a valid HTML element.";
             }

             //Model
             if (!this.hasOwnProperty("model")) {
             this.errors.model = "'model' attribute not present.";
             }

             if (typeof this.model !== 'object') {
             this.errors.model = "'model' is not an object.";
             }

             //Metadata
             if (!this.model.hasOwnProperty("metadata")) {
             this.errors.metadata = "Model does not container 'metadata' attribute.";
             }

             //DSD
             if (!this.model.metadata.hasOwnProperty("dsd")) {
             this.errors.dsd = "Metadata does not container 'dsd' attribute.";
             }

             //Columns
             if (!Array.isArray(this.model.metadata.dsd.columns)) {
             this.errors.columns = "DSD does not container a valid 'columns' attribute.";
             }

             //Option
             if (this.options && typeof this.options !== 'object') {
             this.errors.options = "'options' is not an object.";
             }

             //Data
             if (!this.model.hasOwnProperty("data")) {
             this.errors.data = "Model does not container 'data' attribute.";
             }

             // seriesSubject
             if (!Array.isArray(this.seriesSubject)) {
             this.errors.seriesSubject = "SeriesSubject is not an Array element";
             }*/

            return (Object.keys(this.errors).length === 0);
        };

        FAOSTAT_Highchart_Adapter.prototype._validateData = function () {

            this.errors = {};

            return (Object.keys(this.errors).length === 0);
        };

        FAOSTAT_Highchart_Adapter.prototype._printAuxColumns = function () {
            if (this.o.debugging) {
                log.info("----------Aux Columns");
                log.info(this.o.aux.x);
                log.info(this.o.aux.y); // yAxis can be undefined (launch a warning)
                log.info(this.o.aux.value);
                log.info(this.o.aux.series);
                log.info("~~~~~~~");
            }
        };

        FAOSTAT_Highchart_Adapter.prototype.destroy = function () {
            
        };

        FAOSTAT_Highchart_Adapter.prototype.escapeRegExp = function(string) {
            return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
        };

        FAOSTAT_Highchart_Adapter.prototype.replaceAll = function (string, find, replace) {
            //return string.replace(new RegExp(this.escapeRegExp(find), 'g'), replace);
            return string;
        };

        FAOSTAT_Highchart_Adapter.prototype.getChartObj = function () {
            return (this.o)? this.o.chartObj : undefined;
        };

        return FAOSTAT_Highchart_Adapter;
    });