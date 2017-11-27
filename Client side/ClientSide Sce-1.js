function suggestZipCodes() {
    //defined possible ZipCode
    ZipCodes = [
    { name: '94102' },
    { name: '94103' },
    { name: '94104' },
    { name: '94105' },
    { name: '94107' },
    { name: '94108' }
    ];

    var OnZipCodekeyPress = function (fld) {
        var ZipCodetxt = Xrm.Page.getControl("address1_postalcode").getValue();
        resultSet = {
            results: new Array(),
            commands: {
                id: "ZipCodecmd",
                label: "Search in Bing",
                action: function () {
                    window.open("http://bing.com"); //Open Bing URL
                }
            }
        };
        var ZipCodetxtLowerCase = ZipCodetxt.toLowerCase();
        for (i = 0; i < ZipCodes.length; i++) {
            if (ZipCodetxtLowerCase ===
			ZipCodes[i].name.substring(0, ZipCodetxtLowerCase.length).toLowerCase()) {
                resultSet.results.push({
                    id: i,
                    fields: [ZipCodes[i].name]
                });
            }
            if (resultSet.results.length >= 10) {
                break;
            }
        }

        if (resultSet.results.length > 0) {
            //Show Auto Complete
            fld.getEventSource().showAutoComplete(resultSet);
        }
        else {
            //Hide Auto Complete
            fld.getEventSource().hideAutoComplete();
        }
    };
    Xrm.Page.getControl("address1_postalcode").addOnKeyPress(OnZipCodekeyPress);
}
