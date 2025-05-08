sap.ui.define([
    
    'sap/m/Button', 'sap/m/Dialog', 'sap/m/Label',
						'sap/m/MessageToast', 'sap/m/Text', 'sap/m/TextArea',
						'sap/ui/core/mvc/Controller',
						'sap/ui/layout/HorizontalLayout',
						'sap/ui/layout/VerticalLayout',
						'sap/ui/core/util/Export',
						'sap/ui/core/util/ExportTypeCSV',
						'sap/ui/core/util/File',
						'sap/ui/model/json/JSONModel',
						'sap/m/MessageBox',
						'sap/ui/core/format/NumberFormat',
						'sap/ui/Device',
						"sap/ui/model/Filter",
						"sap/ui/model/FilterOperator",
						"sap/ui/model/Sorter",
						"sap/m/BusyDialog",
						"sap/ui/export/library",
						"sap/ui/export/Spreadsheet",
						"pendinginst/utils/jspdf.umd.min",								
						"../model/formatter"
],
    
    function (Button, Dialog, Label, MessageToast, Text, TextArea,
        Controller, HorizontalLayout, VerticalLayout, Export, ExportTypeCSV,
		File,  JSONModel, MessageBox, NumberFormat, Device,
		Filter, FilterOperator, Sorter, BusyDialog, exportLibrary,
		Spreadsheet, jsPDF, formatter) {
        "use strict";
		var oPendingModel, that, total,userEmailID ;
		//var oExtCustModel, oView,oComponent, oBackendModel, oLocalModel;
		var oBusyDialog;
		const EdmType = exportLibrary.EdmType;
        return Controller.extend("pendinginst.controller.View1", {
			formatter: formatter,
            onInit: function ()
			 {
						this.claimsByUser = null;
						this.isClaimsDateFrom = null;
						this.isClaimsDateTo = null;
						this.statusTypes = null;
						this.textDealerName = null;
						this.selectedStatusTypes = "";
						
						this.isUserAdmin = "N";
						this.isUserView = 'N';
						this.userInfo = null;

						this.programTypes = 'ALL';
						this.selectedProgramTypes = "";
						oBusyDialog = new BusyDialog();
						console.log("In Controller");

//	   			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
//				oRouter.attachRouteMatched(this.onDataReceived , this);
											
							var oView = this.getView();
							that  = this;
							// set message model
							var oMessageManager = sap.ui.getCore().getMessageManager();
							oView.setModel(oMessageManager.getMessageModel(), "message");
							// or just do it for the whole view
							oMessageManager.registerObject(oView, true);
							
							// set device model
							var oDeviceModel = new JSONModel(Device);
							//oDeviceModel.setDefaultBindingMode("OneWay");
							oView.setModel(oDeviceModel, "device");
							
							this.claimHeaderDetails = null;
							
							this.userID = null;
							this.plantID = null;
							this.initrun = 'Y';
							this.epuser = "";
							total = 0;
							this.returnMessage = "";
							this.isDefectREquired = "";
							this.dealerCheck = "E";
							
											
											var userGroups = jQuery.sap
											.getUriParameters().get(
													"epgroups");
									console.log("userGroups:", userGroups);
											var userIDPortal = jQuery.sap
													.getUriParameters().get(
															"epuser");
											console.log("userIDPortal:",
													userIDPortal);

											this.userEmailID = jQuery.sap
													.getUriParameters().get(
															"epmail");
											console.log("userEmailID:",
													userEmailID);

											this.userFname = jQuery.sap
											       .getUriParameters().get(
											    		    "epfname");
											this.userLname = jQuery.sap
											       .getUriParameters().get(
											    		    "eplname");
											console.log("userFname:",this.userFname);
											console.log("userLname:",this.userLname);
											
											// this.epuser="";

											// get application parameter from
											// iView
											if (jQuery.sap.getUriParameters() != null
													&& jQuery.sap
															.getUriParameters() != undefined) {
												console.log("epuser1:",
														this.epuser);
												if (jQuery.sap
														.getUriParameters()
														.get("epuser") != null
														&& jQuery.sap
																.getUriParameters()
																.get("epuser") != undefined) {
													console.log("epuser2:",
															this.epuser);
													this.epuser = jQuery.sap
															.getUriParameters()
															.get("epuser")
															.trim();
													console.log("epuser:",
															this.epuser);
													if (this.epuser == "2") {
														// some code..
														console.log("epuser:",
																this.epuser);
													}
													if (this.epuser == "3") {
														// some code..
														console.log("epuser:",
																this.epuser);
													}
												}
											}

											if (this.epuser != ""
													&& this.epuser != null
													&& this.epuser != undefined) {
												this.userID = this.epuser
												.toUpperCase();
												//this.onGetCompCodes(this.userID);
											}
												//this.onGetCompCodes(this.userID);
											//this.onLoadProgramTypes();
										

											// this.onUIUpdate();
											var today  = that.yyyymmdd(new Date());
											
//											var frmDate  = toDate.setMonth(toDate.getMonth() - 6);
												 var oGlobalModel = new JSONModel({
													CustNum: "",
													DealerName:"" ,
													DealerInfo:"",
													DealerAddress:"",
													SizeInfo:0,
													SizeClaims:0,
													SizePending:0,
													Currency:"",
													PeriodCombinedFunds:0,
													RebateAgr:"",
													Today: today,
													Period:"",
													formVis:false,
													PeriodClaimDeadline:"",
													PeriodToBeClaimed:0,
													PeriodCoopAllowance:0,
													PeriodTotalClaimed:0,
													TotalSales:"",
													SforcePeriodClaimDeadline:"",
													SforcePeriodTotalClaimed:0,
													SforcePeriodToBeClaimed:0,	
													SforcePeriodCoopAllowance:0,
													StreetForceVisible:true,													
													TotOpenVis:false,
													DatesVis:false,
													pastXDVis:false,
													fixedBottom:0,
													globalFilter:""
												});
												 oGlobalModel.setDefaultBindingMode(sap.ui.model.BindingMode.TwoWay);
												 this.getView().setModel(oGlobalModel,"oGlobalModel");
												
												 var oDetModel = new JSONModel();
												 oDetModel.setDefaultBindingMode(sap.ui.model.BindingMode.TwoWay);
												 this.getView().setModel(oDetModel,"oDetModel");
												
												
						this.onInitPeriod();
						this.setHTMLTags();

            },

			setHTMLTags : function ()
			{
				var oModelHTML = new JSONModel({
					HTML : "<ul><li>These install reports are for your information only; you are not required to submit them to Sharp.</li>" +
						"<li>Install reports shown in this section will be removed after 60 days.</li></ul>" 
				});
				this.getView().setModel(oModelHTML, "htmltags");

			},

                                        spaceWidth:function()
										{
											var deviceModel = that.getView().getModel("device");
											
											//deviceModel.getData().system.phone = true;
											if(deviceModel.getData().system.phone == true)
												{
												return '2rem';
												}
											else
												{
												return '56rem';	
												}
											
										},
								resetTable:function(oEvent)
								{
									var resetid = oEvent.getSource().getId().split("--")[1];
									var tabid;
									var model;
									if(resetid == "reset1")
										{
										tabid = "tabPending";
										model = "oDetModel"
										}
									else if(resetid == "reset2")
										{
										tabid = "tabInfo";
										model = "oInfoModel"
										}
									var oTableEmpl = that.getView().byId(tabid);
									var oListBinding = oTableEmpl.getBinding();
									oListBinding.aSorters = null;
									oListBinding.aFilters = null;
									that.getView().getModel(model).refresh(true);
								},
								
										onDataReceived : function(event) {
											var oModel = new sap.ui.model.json.JSONModel();
											var oView = this.getView();

											console.log("onDataReceived:");
											oModel.setData(this.programTypes);
											this.getView().setModel(oModel);
											oModel.refresh(true);
											this.getView().byId('idProgramTypeS')
												.setModel(oModel)
												.bindElement({
													path : '/results'});
											if (this.initrun == 'N') {
												oView.byId("idProgramTypeS")
												.setSelectedKey("ALL");
													this.oncustomClaims();
											}
											this.initrun = 'N';
											//this.onUIUpdate();
										},
										
										
										
										
										onGetCompCodes : function(userID) {
											var t = this;
											sap.ui.core.BusyIndicator.show();
											var serviceUrl = "/sap/opu/odata/SAP/ZACNTSUMMARY_SRV";
											if (window.location.hostname == "localhost") {
												serviceUrl = "proxy"
														+ serviceUrl;
											} else {
												serviceUrl = serviceUrl;
											};
											this.oData = new sap.ui.model.odata.ODataModel(serviceUrl);
											
											//var userID = 'SBSTST000';

											var vPath = "custSet?$filter= User eq '"+userID+"'";

											//var userID = null;

											this.oData.read(vPath,
															{ async : true,
																success : function(oData) {																	
																	if(oData.results.length >0 ) {
																		if(oData.results[0].Return.Type == "E")
																			{
																			t.onUserMessage(oData.results[0].Return.Message,"E");
																			}
																		else
																			{
																			// populate the com
																			var oModel = new sap.ui.model.json.JSONModel();
																			oModel.setData(oData.results);
																			this.getView().setModel(oModel,"CompCodesModel");
																			}
																		
																		
																	} else {
																		console
																		.log(
																				"No Data",
																				oData);
																		
																		t.onUserMessageDialog();
																	}
																		
																	
																},
																error : function(
																		oError) {
																	var data = JSON
																			.stringify(oError);
																	var message = $(
																			oError.response.body)
																			.find(
																					"message")
																			.first()
																			.text();
																	t
																			.onUserMessage(
																					message,
																					"E");
																	result = "S";

																}
															});
											sap.ui.core.BusyIndicator.hide();
											//return userID;
										},
										
										
										onUserMessageDialog : function() {
											var that = this;
											var dialog = new Dialog(
													{
														title : 'Error',
														type : 'Message',
														state : 'Error',
														content : new Text({
															text : "No User Data Found, Please contact Administrator",
														}),
//														beginButton : new Button(
//																{
//																	text : 'OK',
//																	press : function() {
//																		dialog
//																				.close();
//																		if (mType == "Success")
//																			that
//																					.onMainScreen();
//																	}
//																}),
//														afterClose : function() {
//															dialog.destroy();
//														}
													});

											dialog.open();

										},
										onAfterRendering : function() {
											console.log("onAfterRendering");
											var oComponent = this.getOwnerComponent();
											oPendingModel = oComponent.getModel("CompModel");
											
										},
										
										addLeadingZeroes:function(custnum)
										{
											var Kunnr = custnum;
											var length = custnum.length;
											var zerocnt = 10 - length;
											for(i=0;i<zerocnt;i++)
												{
												Kunnr = "0".concat(Kunnr);
												}
											
											return Kunnr;
										},
										dateFormUS:function(inDate)
										{
											
										
											var outDate = "";
											var month = parseInt(inDate.substring(5,7));
											if(month <10 )
											{
											month = "0" + month;
											}
											var date = parseInt(inDate.substring(8,10));
											if(date <10 )
											{
											date = "0" + date;
											}
											var year = fromDate.substring(0,4);
											outDate = month + "/" + date + "/" + year;
											return outDate;
										},
										radioSelected:function(oEvent)
										{
											
											var oModelGlob = that.getView().getModel("oGlobalModel");
											var id = oEvent.getSource().getId().split("--")[1];
											if(id == "rd1")
												{
												oModelGlob.setProperty("/DatesVis",false);
												oModelGlob.setProperty("/pastXDVis",false);
												}
											else if(id == "rd2")
												{
												oModelGlob.setProperty("/DatesVis",false);
												oModelGlob.setProperty("/pastXDVis",true);
												}
											else if(id == "rd3")
												{
												oModelGlob.setProperty("/DatesVis",true);
												oModelGlob.setProperty("/pastXDVis",false);
												}
											debugger
										},
										onSort:function(oEvent)
										{
											//
											var oTable = that.getView().byId("tableReporting");
											var bDescending = false;
											var openItemsModel = that.getView().getModel("openItems");
											var oOrder = oEvent.mParameters.sortOrder;
											if(oOrder == "Ascending")
												{
												bDescending = false;
												}
											else
												{
												bDescending = true;
												}
											var sPath = "/"+oEvent.mParameters.column.mProperties.sortProperty;
											var oSorter = new Sorter(sPath, bDescending);
											var oTable = that.getView().byId("tableReporting");
											var aData = that.getView().getModel("openItems").getData();
											var index = aData.length - 1;
											openItemsModel.oData[index].Belnr = '';
												openItemsModel.oData[index].Ltext = '';
												openItemsModel.oData[index].Salesorder = '';
												
											if(sPath == '/Belnr')
											{if(bDescending){openItemsModel.oData[index].Belnr = '';}
											else{openItemsModel.oData[index].Belnr = '9999999999';}
											// autoresize columns
											}											
											
											else if(sPath == '/Ltext')
											{if(bDescending){openItemsModel.oData[index].Ltext = '';}
											else{openItemsModel.oData[index].Ltext = 'ZZZZZZZZZZ';} oTable.autoResizeColumn(1);}
											
											else if(sPath == '/Salesorder')
											{if(bDescending){openItemsModel.oData[index].Salesorder = '';}
											else{openItemsModel.oData[index].Salesorder = '9999999999';}}
											
											else if(sPath == '/Xblnr')
											{if(bDescending){openItemsModel.oData[index].Xblnr = '';}
											else{openItemsModel.oData[index].Xblnr = 'ZZZZZZZZZZ';}}
											
											else if(sPath == '/Zuonr')
											{if(bDescending){openItemsModel.oData[index].Zuonr = '';}
											else{openItemsModel.oData[index].Zuonr = 'ZZZZZZZZZZ';}}
											
											else if(sPath == '/Zfbdt')
											{if(bDescending){openItemsModel.oData[index].Zfbdt = '';}
											else{openItemsModel.oData[index].Zfbdt = '99991231';}}
											
											else if(sPath == '/Zaldt')
											{if(bDescending){openItemsModel.oData[index].Zaldt = '';}
											else{openItemsModel.oData[index].Zaldt = '99991231';}}
											
											
											
											
											
											
											var oBindings = oTable.getBinding("rows");
											oBindings.sort(oSorter, "Application");
											
										},
										belnrVis:function(Belnr)
										{
											
											if(Belnr == '9999999999')
												{
												return "tabColHide";
												}
											else
												{
												return "tabColVis";
												}
										},
										viewReport:function()
										{
											
											var target = oEvent.getSource().getTarget();
											var Kschl = target.split("|")[0];
											var Belnr = target.split("|")[1];
											var Vbtyp = target.split("|")[2];
											var url = "/sap/opu/odata/sap/ZSD_PENDINGINSTALL_SRV/pdfSet(salesDoc='"+Kschl+"')/$value";
											window.open(url,Belnr);
										},

										
					getPending:function()
					{

						//var t = this;
						var currDate = new Date();
						var oModel = that.getView().getModel("oGlobalModel");
						var oDetModel = that.getView().getModel("oDetModel");
						var custnum = oModel.getProperty("/CustNum");

						// Validate Install Delear
					var oCustNumInp = that.getView().byId("idCustNumInp");	
					oCustNumInp.setValueState(sap.ui.core.ValueState.None);
					if (oCustNumInp.getValue() == "") {
						oCustNumInp.setValueState(sap.ui.core.ValueState.Error);
						oCustNumInp.setValueStateText("Install Dealer is mandatory");
						//return;
					}
						
						var oGlobMod = that.getView().getModel("oGlobalModel");							
						var Dealeracct = new sap.ui.model.Filter({
							path: "Dealeracct",
							operator: sap.ui.model.FilterOperator.EQ,
							value1: custnum
						});
					oBusyDialog.setText("Fetching data. Please wait...")
					oBusyDialog.open();
						//sap.ui.core.BusyIndicator.show();
						oPendingModel.read("/pinstSet", {
							filters: [Dealeracct],
							urlParameters: {
								"$expand": "NOILISTNAV,NOILISTOTHNAV"
							},
							success: function (oData) {
							oBusyDialog.close();
							var total = 0;
							var NOILISTNAV = oData.results[0].NOILISTNAV.results;
							var NOILISTOTHNAV = oData.results[0].NOILISTOTHNAV.results;
						
							// Dealer info
							oModel.setProperty("/DealerInfo", 
									oData.results[0].Dealerinfo.Name1 + "(" + custnum + "), " +oData.results[0].Dealerinfo.Stras + ", " +
									oData.results[0].Dealerinfo.Ort01 + ", " + oData.results[0].Dealerinfo.Regio +", " +oData.results[0].Dealerinfo.Pstlz);
							var oInfoModel = new sap.ui.model.json.JSONModel();
							oInfoModel.setData(NOILISTOTHNAV);
							that.getView().setModel(oInfoModel,"oInfoModel");
							
							oModel.setProperty("/SizeInfo",NOILISTOTHNAV.length);
							
							var oDetModel = new sap.ui.model.json.JSONModel();
							oDetModel.setData(NOILISTNAV);
							that.getView().setModel(oDetModel,"oDetModel");
							
							oModel.setProperty("/SizePending",NOILISTNAV.length);
							oModel.setProperty("/formVis",true);
							
							// *************************************************************
							//sap.ui.core.BusyIndicator.hide();
							
						},
						error : function(oError) {
							//sap.ui.core.BusyIndicator.hide();
							oBusyDialog.close();
							var data = JSON.stringify(oError);
							var message = $(oError.response.body).find("message").first().text();
							t.onUserMessage(message,"E");
							result = "S";

						}
						});
						//sap.ui.core.BusyIndicator.hide();
						//return userID;
					
					},


										streetVis:function(one, two)
										{
											if(one && two)
												{
												return true;
												}
											else
												{
												return false;
												}
										},
										totDesign:function(text)
										{
											if("Total Amount" == text)
												{
												return "Bold";
												}
											else
												{
												return "Standard";
												}
										},
										getGroupHeader:function(oGroup)
										{
											return new sap.m.GroupHeaderListItem( {
								                title: oGroup.key,
								                upperCase: false
								            } );
										},
				onChangePending:function(oEvent)
				{
					
					var iLength = oEvent.getSource().iLength;
					/*
					if(iLength > 5){
						that.getView().getModel("oGlobalModel").setProperty("/SizePending",5);
					}
					else{
						that.getView().getModel("oGlobalModel").setProperty("/SizePending",iLength);  
					}
					*/
						
				},
				onChangeInform:function(oEvent)
				{
					
					var iInformLength = oEvent.getSource().iLength;
					/*
					if(iInformLength > 5){
						that.getView().getModel("oGlobalModel").setProperty("/SizeInfo",5);
					}
					else{
						that.getView().getModel("oGlobalModel").setProperty("/SizeInfo",iInformLength);  
					}
					*/
				},
										invoice:function(oEvent)
										{
											
											var target = oEvent.getSource().getTarget();
											var Kschl = target.split("|")[0];
											var Belnr = target.split("|")[1];
											var Vbtyp = target.split("|")[2];
											var url = href="/sap/opu/odata/sap/ZACNTSUMMARY_SRV/pdfSet(ConditionType='"+Kschl+"',DocumentNumber='"+Belnr+"',DocumentType='"+Vbtyp+"')/$value";
											window.open(url,Belnr);
											
										},
										linkTarget:function(Kschl,Belnr,Vbtyp)
										{
											return Kschl+"|"+Belnr+"|"+Vbtyp;
										},
										pdfExists:function(formfound){								
										if(null == formfound)
											{
											formfound = "";
											return false;
											}
										else if(formfound == "X")
										{
										return true;
										}
										else
											{
											return false;
											}
										},
										onFilter:function(oEvent){
											var filterid = oEvent.getSource().getId().split("--")[2];
											var tabid;
											if(filterid == "filter1")
												{
												tabid = "tabPending";
												}
											else if(filterid == "filter2")
												{
												tabid = "tabInfo";
												}
											var oTable = that.getView().byId(tabid);
											var oBindings = oTable.getBinding("rows");
											var sQuery = oEvent.getParameter("query");
											oFilter = null;

											if (sQuery) {
												oFilter = new Filter([
													new Filter("Salesord", FilterOperator.Contains, sQuery),
													new Filter("SoldTo", FilterOperator.Contains, sQuery),
													new Filter("Name1Ag", FilterOperator.Contains, sQuery),
													new Filter("Ort01Ag", FilterOperator.Contains, sQuery),													
													new Filter("RegioAg", FilterOperator.Contains, sQuery),
													new Filter("ShipTo", FilterOperator.Contains, sQuery),
													new Filter("Name1We", FilterOperator.Contains, sQuery),
													new Filter("StrasWe", FilterOperator.Contains, sQuery),
													new Filter("Ort01We", FilterOperator.Contains, sQuery),
													new Filter("RegioWe", FilterOperator.Contains, sQuery),
													new Filter("DocNumber", FilterOperator.Contains, sQuery)
													
												], false);
											}

											
											oBindings.filter(oFilter, "Application");
										},
										sumAmount:function(amount)
										{
											
											total = total + amount;
											return total;
											alert(total);
										},							


										onInitPeriod : function() {
											
											
											var now = new Date();
											var y = now.getFullYear();
											var frmDate1 = '';
											var toDate1 = '';
											var Lab1 = '';
											var frmDate2 = '';
											var toDate2 = '';
											var Lab2 = '';

											if(y<2018)
												{
												frmDate1 = '01' + '04' + y;
												toDate1 = '12' + '31' + y;
												Lab1 = "April " + y + " - " + "December " + y;
												y=y-1;
												frmDate2 = '01' + '04' + y;
												toDate2 = '12' + '31' + y;
												Lab2 = "April " + y + " - " + "December " + y;
												}
											else
												{
												frmDate1 = '01' + '01' + y;
												toDate1 = '12' + '31' + y;
												Lab1 = "January " + y + " - " + "December " + y;
												y=y-1;
												frmDate2 = '01' + '01' + y;
												toDate2 = '12' + '31' + y;
												Lab2 = "January " + y + " - " + "December " + y;
												}
											
//											var frmDate  = toDate.setMonth(toDate.getMonth() - 6);
												 var oPeriodModel = new JSONModel(
													 [{ 
														    "fromDate" : frmDate1,
														    "toDate" : toDate1,														    
														    "label" : Lab1,
														},
														{ 
															 "fromDate" : frmDate2,
															    "toDate" : toDate2,														    
															    "label" : Lab2,
														}]
												);
												 
												// oPeriodModel.setDefaultBindingMode(sap.ui.model.BindingMode.TwoWay);
												 //sap.ui.getCore().setModel(oGlobalModel,"oGlobalModel");
												 that.getView().setModel(oPeriodModel,"oPeriodModel");
											
										},

										onClaimsDateFrom : function(oEvent) {
											var oSource = oEvent.getSource();
											var oNewDate = oSource
													.getDateValue();
											this.isClaimsDateFrom = this
													.yyyymmdd(oNewDate);
											console.log("onClaimsDateFrom:",
													this.isClaimsDateFrom);
										},

										onClaimsDateTo : function(oEvent) {
											var oSource = oEvent.getSource();
											var oNewDate = oSource
													.getDateValue();
											this.isClaimsDateTo = this
													.yyyymmdd(oNewDate);
											console.log("onClaimsDateTo:",
													this.isClaimsDateTo);
										},

										yyyymmdd : function(oNewDate) {
											var now = oNewDate;
											var y = now.getFullYear();
											var m = now.getMonth() + 1;
											var d = now.getDate();
//											return '' + y + (m < 10 ? '.0' : '.')
//													+ m + (d < 10 ? '.0' : '.')
//													+ d;
											
											return '' +(m < 10 ? '0' : '')
											+ m + (d < 10 ? '/0' : '/')
											+ d + "/"+y;
										},
										yyyymmdd1 : function(oNewDate) {
											var now = oNewDate;
											var y = now.getFullYear();
											var m = now.getMonth() + 1;
											var d = now.getDate();
											return '' + y + (m < 10 ? '0' : '')
													+ m + (d < 10 ? '0' : '')
													+ d;
											
											
										},
										
										dateFormat:function(date)
										{
											if(null != date && "" != date)
												{
												var d = date.substring(6,8);
												var m = date.substring(4,6);
												var y = date.substring(0,4);
												date = m + "/" + d + "/" + y;
												if(date != "12/31/9999")
													{
													return date;	
													}
//												return m + "/" + d + "/" + y;	
												}
											else
												{
												return date;
												}
											
										},
										currFormatO:function(status)
										{	
											if (null == status)
												{
												status = "";
												}
											
											if(null != status)
												{
												if("Total Amount" == status)
												{
												return "Warning"
												}
											else
												{
												return "None";
												}
												}
											
										},
										periodFormat:function(period)
										{
											var year = period.substring(0,4);
											var month = period.substring(4,6);
											if(1 == parseInt(month))
												{
												return "January" + " - " + year;
												}
											else if(2 == parseInt(month))
												{
												return "February" + " - " + year;
												}
											else if(3 == parseInt(month))
											{
											return "March" + " - " + year;
											}
											
											else if(4 == parseInt(month))
											{
											return "April" + " - " + year;
											}
											else if(5 == parseInt(month))
											{
											return "May" + " - " + year;
											}
											
											else if(6 == parseInt(month))
											{
											return "June" + " - " + year;
											}
											else if(7 == parseInt(month))
											{
											return "July" + " - " + year;
											}
											else if(8 == parseInt(month))
											{
											return "August" + " - " + year;
											}
											else if(9 == parseInt(month))
											{
											return "September" + " - " + year;
											}
											else if(10 == parseInt(month))
											{
											return "October" + " - " + year;
											}
											else if(11 == parseInt(month))
											{
											return "November" + " - " + year;
											}
											else if(12 == parseInt(month))
											{
											return "December" + " - " + year;
											}
											else
												{
												return "Total Amount" ; 
												}
											
										},
										currFormatC:function(curr, status)
										{	
											
											if(null != curr)
												{
												var oCurrencyFormat = NumberFormat.getCurrencyInstance();
												return oCurrencyFormat.format(curr, "$");
												}
											
										},
							removeLeading:function(number)
							{
								//var oControl = this.getId();
								this;								
								if(null != number){
									number = number.replace(/^0+/, '');													
								}
								
								if(number == '9999999999' || number == 'ZZZZZZZZZZ'){
//										this.addStyleClass('green');
								}
								else{
									return number;
								}
							},
										statusFormat:function(status)
										{
											
											if ("O" == status)
												{
											return "Open";	
												}
											else if("C" == status)
												{
												return "Closed";
												}
											else if("TO" == status || "TC" == status)
												{
												return "";
												}
											
										},
										onUserMessage : function(uText, mType) {
											if (mType == 'E') {

												var oModel = new sap.ui.model.json.JSONModel();
												sap.ui.getCore().setModel(
														oModel);
												sap.ui.getCore().getModel()
														.setProperty("/oFlag",
																true);
												var oFlag = sap.ui.getCore()
														.getModel()
														.getProperty("/oFlag");
												sap.m.MessageToast
														.show(
																uText,
																{
																	duration : 60000,
																	my : "center center",
																	at : "center center"
																});
												this.onShowColor(oFlag,
														'#ff0000');
											} else {

												var oModel = new sap.ui.model.json.JSONModel();
												sap.ui.getCore().setModel(
														oModel);
												sap.ui.getCore().getModel()
														.setProperty("/oFlag",
																true);
												var oFlag = sap.ui.getCore()
														.getModel()
														.getProperty("/oFlag");
												sap.m.MessageToast
														.show(
																uText,
																{
																	duration : 60000,
																	my : "center center",
																	at : "center center"
																});
												this.onShowColor(oFlag,
														'#008000');
											}
										},

										onLoadProgramTypes : function() {},
										
										onClearMessage : function() {
											var oView = this.getView();
											var oText = oView
													.byId("MessageText");
											oText.setText("-");
											oText.setVisible(false);

											// Button setVisible(false)
											var oText = oView
													.byId("MessageButton");
											oText.setVisible(false);

										},

										onShowColor : function(Flag, color) {
											var oContentDOM = $('#content'); // Pass
											// div
											// Content
											// ID
											var oParent = $('#content')
													.parent(); // Get Parent
											// Find for MessageToast class
											var oMessageToastDOM = $('#content')
													.parent()
													.find('.sapMMessageToast');
											oMessageToastDOM.css('background',
													color); // Apply css
											sap.ui.getCore().getModel()
													.setProperty("/oFlag",
															!Flag);
										},

										hideBusyIndicator : function() {
											sap.ui.core.BusyIndicator.hide();
										},

										showBusyIndicator : function(iDuration,
												iDelay) {
											// sap.ui.core.BusyIndicator.show(iDelay);

											var oBusyDialog = new sap.m.BusyDialog();

											oBusyDialog.open();

											jQuery.sap.delayedCall(iDuration,
													this, function() {
														oBusyDialog.close();
													});

										},
					
					onDataExportCSV : function(oEvent) {

						var modelName = oEvent.getSource().getId().split("--")[2];
						var fileName1;
						debugger;
						if(modelName == "oDetModel")
							{
							fileName1 = "Pending_Install_Report";
							}
						else if(modelName == "oInfoModel")
							{
							fileName1 = "Info_Install_Report";
							}
						var oModel = that.getView().getModel(modelName);
						console.log("OpenItems Model 11>> :",openItems);
						var oExport = new Export({

							// Type that will be used to generate the content. 
							// Own ExportType's can be created to support other 
							// formats
							exportType : new ExportTypeCSV({
								separatorChar : ","
							}),

							// Pass in the model created above
							models : oModel,

							// binding information for the rows aggregation
							rows : {
								path : "/"
							},

							// column definitions with column name and binding info for the content

							columns : [{
								name : "Order #",
								template : {
									content : "{Salesord}"
								}
							},
							{
								name : "Sold To#",
								template : {
									content : "{SoldTo}"
								}
							},
							{
								name : "Name",
								template : {
									content : "{Name1Ag}"
								}
							},
							{
								name : "City",
								template : {
									content : "{Ort01Ag}"
								}
							},
							{
								name : "State",
								template : {
									content : "{RegioAg}"
								}
							},
							{
								name : "Ship To#",
								template : {
									content : "{ShipTo}"
								}
							},
							{
								name : "Name",
								template : {
									content : "{Name1We}"
								}
							},
							{
								name : "Street",
								template : {
									content : "{StrasWe}"
								}
							},
							{
								name : "City",
								template : {
									content : "{Ort01We}"
								}
							},
							{
								name : "State",
								template : {
									content : "{RegioWe}"
								}
							},
							{
								name : "Delivery #",
								template : {
									content : "{DocNumber}"
								}
							}
							]
						});

						var newDate = new Date();
						var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
								pattern : "yyyyMMdd"
							});
						var subFromDate = oDateFormat.format(newDate);
						var oTimeFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
								pattern : "HHmmss"
							});
						var subFromTime = oTimeFormat.format(newDate);
						
						var fileName = fileName1+"_"+subFromDate+"_"+subFromTime;
						console.log(newDate, subFromDate, subFromTime, fileName);
						console.log(oExport);
						oExport.saveFile(fileName).catch(function(oError) {
							MessageBox.error("Error when downloading data. Browser might not be supported!\n\n" + oError);
						}).then(function() {
							oExport.destroy();
						});
					},//End of onDataExportCSV()
					
		createTabColumnConfig: function() {
			
			const aCols = [];
		
				aCols.push({
					label: "Order #",
					property: "Salesord",
					//property: "{ path: 'Salesord', formatter: '.removeLeading'}",
					type: EdmType.Number,
					scale:0 
				});
	
				aCols.push({
					label: "Sold To#",
					property: "SoldTo",
					type: EdmType.Number
				});
	
				aCols.push({
					label: "Name",
					property: "Name1Ag",
					type: EdmType.String
				});
				aCols.push({
					label: "City",
					property: "Ort01Ag",
					type: EdmType.String
				});
				aCols.push({
					label: "State",
					property: "RegioAg",
					type: EdmType.String
				});
				aCols.push({
					label: "Ship To#",
					property: "ShipTo",
					type: EdmType.Number
				});
				aCols.push({
					label: "Name",
					property: "Name1We",
					type: EdmType.String
				});
	
				aCols.push({
					label: "Street",
					property: "StrasWe",
					type: EdmType.String
				});
				aCols.push({
					label: "City",
					property: "Ort01We",
					type: EdmType.String
				});
				aCols.push({
					label: "State",
					property: "RegioWe",
					type: EdmType.String
				});
	
				aCols.push({
					label: "Delivery",
					property: "DocNumber",
					type: EdmType.Number
				});
				
				return aCols;
			},
			onDataExport: function(oEvent) {
				debugger;

				var modelName = oEvent.getSource().getId().split("--")[2];
				var fileName1;
			
				if(modelName == "oDetModel"){
					fileName1 = "Pending_Install_Report";
				}
				else if(modelName == "oInfoModel"){
					fileName1 = "Info_Install_Report";
				}
				var pendInfoModelData = this.getView().getModel(modelName).getData();
				//var thatPendModel = that.getView().getModel("oDetModel");

				if(pendInfoModelData.length>0){
					const aCols = this.createTabColumnConfig();
					const oSettings = {
						workbook: {
							columns: aCols,
							hierarchyLevel: "Level",
							sheetName: "Pending Install Report"
						},
						dataSource: pendInfoModelData,
						fileName: fileName1,
						worker: false // We need to disable worker because we are using a MockServer as OData Service
					};	
					const oSheet = new Spreadsheet(oSettings);
					oSheet.build().finally(function() {
						oSheet.destroy();
					});
				}
				else{
					MessageBox.error("Excel export is not possible because no data to export.");
				}
			},// End of onDataExport()	
			
			//&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&
			// Method to export table data into a PDF document and download locally on user's machine.
			//This uses a third party API called jsPDF. It has been declared as a dependency in the manifest.json
				onExportToPDF: function ( oEvent) {
					debugger;

					var idPDFButton = oEvent.getSource().getId().split("--")[2];
					console.log("ID " + idPDFButton);
					var modelName1, fileName1, heading1;
					if(idPDFButton == "idPendingPDF"){
						modelName1 = "oDetModel"
						fileName1 = "Pending_Install_Report";
						heading1 = "Pending Install Report";
					}
					else if(idPDFButton == "idInfoPDF"){
						modelName1 = "oInfoModel"
						fileName1 = "Info_Install_Report";
						heading1 = "Info Install Report";
					}
					// Default export is a4 paper, portrait, using milimeters for units 
					var doc = new jspdf.jsPDF();
					var modelPendInfo = that.getView().getModel(modelName1);
					var aData = modelPendInfo.oData;
					var imgData = "data:image/png;base64,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";
					//											//
					doc.addImage(imgData, 'PNG', 170, 5, 10, 5);

					//doc.setDrawColor(0);
					//doc.setFillColor(46,49,146);
					//doc.setFontStyle('bold');
					//doc.rect(15, 4, 45, 5); // filled square
					doc.text(16, 8, heading1);
					//var curr = oLocalModel.getProperty("/Currency");

					//header start
					//doc.setFillColor(46,49,146);

					var iLength = 15;
					var iBreadth = 15;
					doc.setFontSize(8);

					doc.rect(iLength, iBreadth, 15, 5); // empty square	
					doc.text(iLength + 1, iBreadth + 3, 'Order #');
					iLength = iLength + 15;
					doc.rect(iLength, iBreadth, 15, 5); // empty square
					doc.text(iLength + 1, iBreadth + 3, 'Sold To #');
					iLength = iLength + 15;
					doc.rect(iLength, iBreadth, 15, 5); // empty square
					doc.text(iLength + 1, iBreadth + 3, 'Name');
					iLength = iLength + 15;
					doc.rect(iLength, iBreadth, 15, 5); // empty square
					doc.text(iLength + 1, iBreadth + 3, 'City');
					iLength = iLength + 15;
					doc.rect(iLength, iBreadth, 15, 5); // empty square
					doc.text(iLength + 1, iBreadth + 3, 'State');
					iLength = iLength + 15;
					doc.rect(iLength, iBreadth, 15, 5); // empty square
					doc.text(iLength + 1, iBreadth + 3, 'Ship To #');
					iLength = iLength + 15;
					doc.rect(iLength, iBreadth, 15, 5); // empty square
					doc.text(iLength + 1, iBreadth + 3, 'Name');
					iLength = iLength + 15;
					doc.rect(iLength, iBreadth, 15, 5); // empty square
					doc.text(iLength + 1, iBreadth + 3, 'Street');
					iLength = iLength + 15;
					doc.rect(iLength, iBreadth, 15, 5); // empty square
					doc.text(iLength + 1, iBreadth + 3, 'City');
					iLength = iLength + 15;
					doc.rect(iLength, iBreadth, 15, 5); // empty square
					doc.text(iLength + 1, iBreadth + 3, 'State');
					iLength = iLength + 15;
					doc.rect(iLength, iBreadth, 15, 5); // empty square
					doc.text(iLength + 1, iBreadth + 3, 'Delivery #');

					var iYCordinate = 15;
					var iXCordinate = 0;
					//doc.setFontStyle('normal');
					for (var k = 0; k < aData.length; k++) {
						iYCordinate = iYCordinate + 5;
						iXCordinate = 0;
						if (k % 50 == 0 && (k != 0)) {
							doc.addPage();
							iYCordinate = 15;
						}
						doc.setFontSize(6);
						for (var i = 0; i < 11; i++) {
							doc.setDrawColor(0);
							doc.setFillColor(46, 49, 146);

							iXCordinate = iXCordinate + 15;
							doc.rect(iXCordinate, iYCordinate, 15, 5); // empty square

							if (i == 0) {
								doc.text(iXCordinate + 1, iYCordinate + 3, aData[k].Salesord);
							}
							else if (i == 1) {
								doc.text(iXCordinate + 1, iYCordinate + 3, aData[k].SoldTo);								
							}
							else if (i == 2) {
								doc.setFontSize(4);
								var temp = doc.splitTextToSize(aData[k].Name1Ag, 15)
								doc.text(iXCordinate + 1, iYCordinate + 2, temp);
								//doc.text(iXCordinate+1, iYCordinate+3, aData[k].Ltext);
							}
							else if (i == 3) {
								doc.setFontSize(4);
								var temp = doc.splitTextToSize(aData[k].Ort01Ag, 12)
								doc.text(iXCordinate + 1, iYCordinate + 2, temp);
								//doc.text(iXCordinate + 1, iYCordinate + 3, aData[k].Ort01Ag);
							}
							else if (i == 4) {
								//var temp = doc.splitTextToSize(aData[k].RegioAg, 15)
								doc.setFontSize(6);
								doc.text(iXCordinate + 1, iYCordinate + 2, aData[k].RegioAg);
							}
							else if (i == 5) {
								doc.text(iXCordinate + 1, iYCordinate + 3, aData[k].ShipTo);
							}
							else if (i == 6) {	
								doc.setFontSize(4);
								var temp = doc.splitTextToSize(aData[k].Name1We, 15)
								doc.text(iXCordinate + 1, iYCordinate + 2, temp);	

							}

							else if (i == 7) {
								doc.setFontSize(4);
								var temp = doc.splitTextToSize(aData[k].StrasWe, 15)
								doc.text(iXCordinate + 1, iYCordinate + 2, temp);
								
							}
							else if (i == 8) {
								doc.setFontSize(4);
								//doc.text(iXCordinate + 1, iYCordinate + 3, aData[k].Ort01We);
								var temp = doc.splitTextToSize(aData[k].Ort01We, 15)
								doc.text(iXCordinate + 1, iYCordinate + 2, temp);
							}
							else if (i == 9) {
								doc.setFontSize(6);
								doc.text(iXCordinate + 1, iYCordinate + 3, aData[k].RegioWe);
							}
							else if (i == 10) {
								doc.text(iXCordinate + 1, iYCordinate + 3, aData[k].DocNumber);
							}
						}
					}
					//doc.save('PendInstallReport.pdf');
					doc.save(fileName1);
					

				}// End of method onExportToPDF();

			//&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&
										
        });
    });
