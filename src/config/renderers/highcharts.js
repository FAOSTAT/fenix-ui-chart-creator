if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(function () {

    'use strict';

    return {

        line: {
            chart: {type: 'line'},
            title: {text: ''},
            subtitle: {text: ''},
            xAxis: {crosshair: true},
            //yAxis: {min: 0, title: {text: ''}},
            tooltip: {
                headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y:.1f} </b></td></tr>',
                footerFormat: '</table>',
                useHTML: true
            },
            plotOptions: {column: {pointPadding: 0.2, borderWidth: 0}},
            series: []
        },
        column: {
            chart: {type: 'column'},
            title: {text: ''},
            subtitle: {text: ''},
            xAxis: {categories: [], crosshair: true},
           // yAxis: {min: 0, title: {text: ''}},
            tooltip: {
                headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y:.1f} </b></td></tr>',
                footerFormat: '</table>',
                useHTML: true
            },
            plotOptions: {column: {pointPadding: 0.2, borderWidth: 0}},
            series: []
        },
        column_stacked: {
            chart: {type: 'column'},
            title: {text: ''},
            subtitle: {text: ''},
            xAxis: {categories: [], crosshair: true},
           // yAxis: {min: 0, title: {text: ''}},
            tooltip: {
                headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y:.1f} </b></td></tr>',
                footerFormat: '</table>',
                useHTML: true
            },
            plotOptions: {column: {stacking: 'normal',pointPadding: 0.2, borderWidth: 0}},
            series: []
        },

        area: {
            chart: {type: 'area'},
            title: {text: ''},
            subtitle: {text: ''},
            xAxis: {categories: [], crosshair: true},
          //  yAxis: {min: 0, title: {text: ''}},
            tooltip: {
                headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y:.1f} </b></td></tr>',
                footerFormat: '</table>',
                useHTML: true
            },
            plotOptions: {column: {pointPadding: 0.2, borderWidth: 0}},
            series: []
        },
		pyramid: 
      {
            chart: {
                type: 'bar'
            },
            title: {
                text: ''
            },
            subtitle: {
                text: ''
            },
            xAxis: [{
               categories:[],
                reversed: false,
                labels: {
                    step: 1
                }
            }, { // mirror axis on right side

               categories:[],              
			  opposite: true,
                reversed: false,
              
                linkedTo: 0,
                labels: {
                    step: 1
                }
            }],
            yAxis: {
                title: {
                    text: null
                },
                labels: {
                    formatter: function () {
                        return Math.abs(this.value) ;
                    }
                }
            },

            plotOptions: {
                series: {
                    stacking: 'normal'
                }
            },

            tooltip: {
                formatter: function () {
                    return '<b>' + this.series.name + ', age ' + this.point.category + '</b><br/>' +
                        'Population: ' + Highcharts.numberFormat(Math.abs(this.point.y), 0);
                }
            },

         	"series":[],
        
        },
        area_stacked: {
            chart: {type: 'area'},
            title: {text: ''},
            subtitle: {text: ''},
            xAxis: {categories: [], crosshair: true},
            //yAxis: {min: 0, title: {text: ''}},
            tooltip: {
                headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y:.1f} </b></td></tr>',
                footerFormat: '</table>',
                useHTML: true
            },
            plotOptions: {area: {stacking: 'normal'}},
            series: []
        },
        pie: {
            chart: {type: 'pie'},
            title: {text: ''},
            subtitle: {text: ''},
            xAxis: {categories: [], crosshair: true},   plotOptions: {
            series: {
                dataLabels: {
                    enabled: true,
                    format: '{point.name}: {point.y:.1f}'
                }
            }
        },
           //yAxis: {min: 0, title: {text: ''}},
            tooltip: {
                headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y:.1f} </b></td></tr>',
                footerFormat: '</table>',
                useHTML: true
            },
           // plotOptions: {area: {stacking: 'normal'}},
            series: [{data:[]	}]
			,drilldown:{series:[]}
        }, 
		donut: {
            chart: {type: 'pie'},
            title: {text: ''},
            subtitle: {text: ''},
            xAxis: {categories: [], crosshair: true}, plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: false
                    },
                    showInLegend: true
                }
            },
           //yAxis: {min: 0, title: {text: ''}},
            tooltip: {
                headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y:.1f} </b></td></tr>',
                footerFormat: '</table>',
                useHTML: true
            },
           // plotOptions: {area: {stacking: 'normal'}},
            series: []
        },
        scatter: {
        chart: {
            type: 'scatter',
            zoomType: 'xy'
        },
       /* title: {
            text: 'Height Versus Weight of 507 Individuals by Gender'
        },
        subtitle: {
            text: 'Source: Heinz  2003'
        },
        xAxis: {
            title: {
                enabled: true,
                text: 'Height (cm)'
            },
            startOnTick: true,
            endOnTick: true,
            showLastLabel: true
        },
        yAxis: {
            title: {
                text: 'Weight (kg)'
            }
        },
        legend: {
            layout: 'vertical',
            align: 'left',
            verticalAlign: 'top',
            x: 100,
            y: 70,
            floating: true,
            backgroundColor:  '#FFFFFF',
            borderWidth: 1
        },
        plotOptions: {
            scatter: {
                marker: {
                    radius: 5,
                    states: {
                        hover: {
                            enabled: true,
                            lineColor: 'rgb(100,100,100)'
                        }
                    }
                },
                states: {
                    hover: {
                        marker: {
                            enabled: false
                        }
                    }
                },
                tooltip: {
                    headerFormat: '<b>{series.name}</b><br>',
                    pointFormat: '{point.x} cm, {point.y} kg'
                }
            }
        },*/
        series: []
    },
       
        heatmap: {

            chart: {
                type: 'heatmap',
                marginTop: 40,
                marginBottom: 80,
                plotBorderWidth: 1
            },


            title: {
                text: ''
            },

            xAxis: {
                categories: [/*'Alexander', 'Marie', 'Maximilian', 'Sophia', 'Lukas', 'Maria', 'Leon', 'Anna', 'Tim', 'Laura'*/]
            },

            yAxis: {
                categories: [/*'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'*/],
                title: null
            },

            colorAxis: {
                min: 0,
                minColor: '#FFFFFF',
              //  maxColor: Highcharts.getOptions().colors[0]
            },

            legend: {
                align: 'right',
                layout: 'vertical',
                margin: 0,
                verticalAlign: 'top',
                y: 25,
                symbolHeight: 280
            },

            tooltip: {
                formatter: function () {
                    return '<b>' + this.series.xAxis.categories[this.point.x] + '</b>  <br><b>' + this.series.yAxis.categories[this.point.y] + '</b><br> Value : <b>' +this.point.value + '</b>';
                }
            },

            series: [{
                name: '',
                borderWidth: 1,
                data: [/*[0, 0, 10], [0, 1, 19], [0, 2, 8], [0, 3, 24], [0, 4, 67], [1, 0, 92], [1, 1, 58], [1, 2, 78], [1, 3, 117], [1, 4, 48], [2, 0, 35], [2, 1, 15], [2, 2, 123], [2, 3, 64], [2, 4, 52], [3, 0, 72], [3, 1, 132], [3, 2, 114], [3, 3, 19], [3, 4, 16], [4, 0, 38], [4, 1, 5], [4, 2, 8], [4, 3, 117], [4, 4, 115], [5, 0, 88], [5, 1, 32], [5, 2, 12], [5, 3, 6], [5, 4, 120], [6, 0, 13], [6, 1, 44], [6, 2, 88], [6, 3, 98], [6, 4, 96], [7, 0, 31], [7, 1, 1], [7, 2, 82], [7, 3, 32], [7, 4, 30], [8, 0, 85], [8, 1, 97], [8, 2, 123], [8, 3, 64], [8, 4, 84], [9, 0, 47], [9, 1, 114], [9, 2, 31], [9, 3, 48], [9, 4, 91]*/],
                dataLabels: {
                    enabled: true,
                    color: '#000000'
                }
            }]

        },
        treemap: {
       
          series: []
    },
        boxplot: {

        chart: {
            type: 'boxplot'
        },

        title: {
            text: ''
        },

        legend: {
            enabled: false
        },

        xAxis: {
            categories: [/*'1', '2', '3', '4', '5'*/],
            title: {
                text: ''
            }
        },

        yAxis: {
            title: {
                text: ''
            }
        },

        series: []

    },
bubble:{

        chart: {
            type: 'bubble',
            plotBorderWidth: 1,
            zoomType: 'xy'
        },

        legend: {
            enabled: false
        },

        title: {
            text: 'Sugar and fat intake per country'
        },

        subtitle: {
            text: 'Source: <a href="http://www.euromonitor.com/">Euromonitor</a> and <a href="https://data.oecd.org/">OECD</a>'
        },

        xAxis: {
            gridLineWidth: 1,
            title: {
                text: ''
            },
            labels: {
                format: '{value} '
            },
            plotLines: [{
                color: 'black',
                dashStyle: 'dot',
                width: 2,
                value: 65,
                label: {
                    rotation: 0,
                    y: 15,
                    style: {
                        fontStyle: 'italic'
                    },
                    text: ''
                },
                zIndex: 3
            }]
        },

        yAxis: {
            startOnTick: false,
            endOnTick: false,
            title: {
                text: ''
            },
            labels: {
                format: '{value}'
            },
            maxPadding: 0.2,
            plotLines: [{
                color: 'black',
                dashStyle: 'dot',
                width: 2,
                value: 50,
                label: {
                    align: 'right',
                    style: {fontStyle: 'italic'},
                    text: '',
                    x: -10
                },
                zIndex: 3
            }]
        },

      

        plotOptions: {
            series: {
                dataLabels: {
                    enabled: true,
                    format: '{point.name}'
                }
            }
        },

        series: [{data:[]}]

    },

    bubblecircle: {

        chart: {
            height:400,
            width:400,
            polar: true,
            type: 'bubble',
            plotBorderWidth: 1,
            zoomType: 'xy'
        },

        legend: {
            enabled: false
        },

        title: {
            text: ''
        },

        subtitle: {
            text: ''
        },

        xAxis: {
            gridLineWidth: 1,
            title: {
                text: ''
            },
            labels: {
                enabled: false,
                format: '{value} '
            },
            plotLines: [{
                color: 'black',
                dashStyle: 'dot',
                width: 2,
                value: 65,
                label: {
                    rotation: 0,
                    y: 15,
                    style: {
                        fontStyle: 'italic'
                    },
                    text: ''
                },
                zIndex: 3
            }]
        },

        yAxis: {
            startOnTick: false,
            endOnTick: false,
            title: {
                text: ''
            },
            labels: {
                enabled: false,
                format: '{value}'
            },
            maxPadding: 0.2,
            plotLines: [{
                color: 'black',
                dashStyle: 'dot',
                width: 2,
                value: 50,
                label: {
                    align: 'right',
                    style: {fontStyle: 'italic'},
                    text: '',
                    x: -10
                },
                zIndex: 3
            }]
        },

      

        plotOptions: {
            series: {
                dataLabels: {
                    enabled: false,
                    format: '{point.name}'
                }
            }
        },

        series: [{data:[]}]

    }
    };
});