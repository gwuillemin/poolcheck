sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/ws/WebSocket",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
    'sap/viz/ui5/format/ChartFormatter',
        'sap/viz/ui5/api/env/Format'
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,WebSocket,MessageToast,JSONModel, Filter, FilterOperator,ChartFormatter,Format ) {
        "use strict";
        

        return Controller.extend("guy.poolcheck.poolmonitor.controller.MonitorView", {

            props: {
                plotArea: {
                    window: {
                        start: "firstDataPoint",
                        end: "lastDataPoint"
                    },
                    dataLabel: {
                        formatString:ChartFormatter.DefaultPattern.SHORTFLOAT_MFD2,
                        visible: false
                    }
                },
                valueAxis: {
                    visible: true,
                    label: {
                        formatString:ChartFormatter.DefaultPattern.SHORTFLOAT
                    },
                    title: {
                        visible: false
                    }
                },
                valueAxis2: {
                    visible: true,
                    label: {
                        formatString:ChartFormatter.DefaultPattern.SHORTFLOAT
                    },
                    title: {
                        visible: false
                    }
                },
                timeAxis: {
                    title: {
                        visible: false
                    },
                    interval : {
                        unit : ''
                    }
                },
                title: {
                    visible: false
                },
                interaction: {
                    syncValueAxis: false
                }
            },
            onInit: function () {


              //  this.props.plotArea.dataPointStyle = null;
            var oVizFrame = this.getView().byId("idVizFrame");
       //     oVizFrame.setVizProperties(this.props);


                
var hostname = window.location.hostname;
var jsModel = new JSONModel({OrpLive: "",onoff:"off"});
this.getView().setModel(jsModel,"live");
var oOrpLiveData = this.getView().byId("OrpLiveId");
 // build filter array
 var aFilter = [];
  
 var date = new Date();
date.setDate(date.getDate() - 5);
  
     //aFilter.push(new Filter("date", FilterOperator.GT, date.toISOString()));
 
     aFilter.push(new Filter("date", FilterOperator.GT, date));
 
 var oBinding = oOrpLiveData.getBinding("data");
 oBinding.filter(aFilter);
 oBinding.refresh();

                var connection = new WebSocket("ws://" + hostname + ":8080/");
                // connection opened
                connection.attachOpen(function (oControlEvent) {
                    console.log(oControlEvent.getParameter("data"));
                });

                // server messages
                connection.attachMessage(function (oControlEvent) {
                    var oData = JSON.parse(oControlEvent.getParameter("data"));
                    //jsModel.setProperty("/OrpLive",oIdea.OrpLive);
                   jsModel.setData(oData);
                });

                // error handling
                connection.attachError(function (oControlEvent) {
                    console.log(oControlEvent.getParameter("data"));
                });

                // onConnectionClose
                connection.attachClose(function (oControlEvent) {
                    console.log(oControlEvent.getParameter("data"));
                });

            }
        });
    });
