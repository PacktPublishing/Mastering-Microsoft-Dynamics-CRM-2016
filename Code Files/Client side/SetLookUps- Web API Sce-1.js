function retrieveProductInfo()
{
	//Gets attribute for product.
	var product = Xrm.Page.getAttribute("dyn_product");
	//Attribute name of Category field
	var categoryField = "dyn_category";
	//Attribute name of Sub Category Field.
	var subCategoryField = "dyn_subcategory";
	//Variable to store product ID
	var productId;
	//Check if Product attribute is null
	if (product != null)
	{
		//Assign the selected product Id
		productId = product.getValue()[0].id.replace(/[{}]/g, "");
	}
	//Initializes request object
	var req = new XMLHttpRequest();
	//Opens the request
	req.open("GET", Xrm.Page.context.getClientUrl() + "/api/data/v8.2/dyn_customproducts(" + productId + ")?$select=_dyn_category_value,dyn_name,_dyn_subcategory_value", true);
	//Set the request headers
	req.setRequestHeader("OData-MaxVersion", "4.0");
	req.setRequestHeader("OData-Version", "4.0");
	req.setRequestHeader("Accept", "application/json");
	req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
	req.setRequestHeader("Prefer", "odata.include-annotations=\"*\"");
	//Function to detect changes of readystate
	req.onreadystatechange = function ()
	{
		if (this.readyState === 4)
		{
			req.onreadystatechange = null;
			//Checks if request was completed succesfully
			if (this.status === 200)
			{
				//Parses the JSON response
				var result = JSON.parse(this.response);
				//Get the CategoryId
				var categoryId = result["_dyn_category_value"];
				//Gets Category Name
				var categoryName = result["_dyn_category_value@OData.Community.Display.V1.FormattedValue"];
				//Gets logical name of Category entity.
				var categoryLogicalName = result["_dyn_category_value@Microsoft.Dynamics.CRM.lookuplogicalname"];
				//Get the SubCategoryId
				var subcategoryId = result["_dyn_subcategory_value"];
				//Get the SubCategory Name
				var subcategoryName = result["_dyn_subcategory_value@OData.Community.Display.V1.FormattedValue"];
				//Get the logical name of SubCategory Entity
				var subcategoryLogicalName = result["_dyn_subcategory_value@Microsoft.Dynamics.CRM.lookuplogicalname"];
				//Calls the funtion to set lookups
				SetLookupValue(categoryField, categoryId, categoryName, categoryLogicalName);
				SetLookupValue(subCategoryField, subcategoryId, subcategoryName, subcategoryLogicalName);
			}
			else
			{
				Xrm.Utility.alertDialog(this.statusText);
			}
		}
	};
	req.send();
}
//Function that sets lookups

function SetLookupValue(fieldName, id, name, entityType)
{
	if (fieldName != null)
	{
		var lookupValue = new Array();
		lookupValue[0] = new Object();
		lookupValue[0].id = id;
		lookupValue[0].name = name;
		lookupValue[0].entityType = entityType;
		if (lookupValue[0].id != null)
		{
			Xrm.Page.getAttribute(fieldName).setValue(lookupValue);
		}
	}
}