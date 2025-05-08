/**
 * eslint-disable @sap/ui5-jsdocs/no-jsdoc
 */

sap.ui.define([
        "sap/ui/core/UIComponent",
        "sap/ui/Device",
        "pendinginst/model/models"
    ],
    function (UIComponent, Device, models) {
        "use strict";

        return UIComponent.extend("pendinginst.Component", {
            metadata: {
                manifest: "json"
            },

            /**
             * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
             * @public
             * @override
             */
            init: function () {
                // call the base component's init function
                UIComponent.prototype.init.apply(this, arguments);

                // enable routing
                this.getRouter().initialize();

                // set the device model
                this.setModel(models.createDeviceModel(), "device");
            }
        });
    }
);

/*
  "resources": {
      "css": [
        {
          "uri":"/sap/bc/ui5_ui5/sap/zsharpcss/css/style.css"  
        },
        {          
          "uri":"https://port8081-workspaces-ws-qmzzf.us21.applicationstudio.cloud.sap/css/style.css"
        }
        
      ]
    },


*/