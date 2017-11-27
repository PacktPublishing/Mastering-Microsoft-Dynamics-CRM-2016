function checkAccountStatus()
{
    //Fetch parent account
    var accountAttribute = Xrm.Page.getAttribute("parentcustomerid");
    var accountId;
    
    //Check if account is not null
    if (accountAttribute != null)
    {
        //Get value of account attribute
        accountId = accountAttribute.getValue();
        if (accountId != null)
        {
            //Gets the account Id
            accountId = accountId[0].id.replace(/[{}]/g, "");
            
            //Initializes new request.
            var req = new XMLHttpRequest();
            //Open the request
            req.open("GET", Xrm.Page.context.getClientUrl() + "/api/data/v8.2/accounts(" + accountId + ")?$select=name,statuscode", true);
            //Sets the Request Headers
            req.setRequestHeader("OData-MaxVersion", "4.0");
            req.setRequestHeader("OData-Version", "4.0");
            req.setRequestHeader("Accept", "application/json");
            req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
            req.setRequestHeader("Prefer", "odata.include-annotations=\"*\"");
            //Function to detect ready state
            req.onreadystatechange = function ()
            {
                //Check if request is completed
                if (this.readyState === 4)
                {
                    req.onreadystatechange = null;
                    
                    //Check if status code is 200 for success
                    if (this.status === 200)
                    {
                        var result = JSON.parse(this.response);
                        var name = result["name"];
                        var statuscode = result["statuscode"];
                        
                        //checks if statuscode is inactive i.e 3
                        if (statuscode == 2)
                        {
                            deactivateForm();
                        }
                    }
                    else
                    {
                        Xrm.Utility.alertDialog(this.statusText);
                    }
                }
            };
            req.send();
        }
    }
}

//Function to deactivate the form
function deactivateForm()
{
    var allAttributes = Xrm.Page.data.entity.attributes.get();
    for (var i in allAttributes)
    {
        if (allAttributes[i].getName() != null)
        {
            var attribute = Xrm.Page.data.entity.attributes.get(allAttributes[i].getName());
            if (attribute != null)
            {
                var name = attribute.getName();
                if (name != null)
                {
                    var control = Xrm.Page.getControl(name);
                    if (control != null)
                    {
                        Xrm.Page.getControl(name).setDisabled(true);
                    }
                }
            }
        }
    }
    Xrm.Page.ui.setFormNotification('Information:Form Disabled!', 'INFORMATION');
}
