sap.ui.define([
    'sap/ui/core/format/NumberFormat',
],
    function (NumberFormat) {
        "use strict";
        return {
            quantityFormat: function (quantityVal) {
                var oFormat = NumberFormat.getFloatInstance({
                    "groupingEnabled": true,  // grouping is enabled
                    "groupingSeparator": ',', // grouping separator is '.'
                    "groupingSize": 3,        // the amount of digits to be grouped (here: thousand)
                    "decimalSeparator": "."   // the decimal separator must be different from the grouping separator
                });

                if (quantityVal != null) {
                    return oFormat.format(quantityVal); // "1.234,56"
                }
                else {
                    return "";
                }
            },
            dateFormat: function (date) {
                //debugger;
                if (null != date && "" != date && "Total Quantity" != date) {
                    var d = date.substring(6, 8);
                    var m = date.substring(4, 6);
                    var y = date.substring(0, 4);
                    date = m + "/" + d + "/" + y;
                    if (date != "12/31/9999") {
                        return date;
                    }
                    //return m + "/" + d + "/" + y;	
                }
                else {
                    return date;
                }

            },
            //Method to remove leading zeroes from a number
				removeLeading11: function (number) {
                    debugger;
					if (null != number) {
						number = number.replace(/^0+/, '');
					}

					if (number == '9999999999' || number == 'ZZZZZZZZZZ') {

					}
					else {
						return number;
					}
				},






        };
    });