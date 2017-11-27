using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Microsoft.Xrm.Sdk;
using Microsoft.Crm.Sdk.Messages;
using Microsoft.Xrm.Sdk.Query;

namespace SamplePluginProject
{
    public class PreCreateUpdateStudent : IPlugin
    {
        public void Execute(IServiceProvider serviceProvider)
        {
            Microsoft.Xrm.Sdk.IPluginExecutionContext context = (Microsoft.Xrm.Sdk.IPluginExecutionContext)
                serviceProvider.GetService(typeof(Microsoft.Xrm.Sdk.IPluginExecutionContext));
            IOrganizationServiceFactory serviceFactory = (IOrganizationServiceFactory)serviceProvider.GetService(typeof(IOrganizationServiceFactory));
            IOrganizationService service = serviceFactory.CreateOrganizationService(context.UserId);
            // For impersonation
            // IOrganizationService service = serviceFactory.CreateOrganizationService(new Guid ("8240cddf-fb54-4d96-90db-0ff926be0c14"));    

            if (context.InputParameters.Contains("Target") &&
                context.InputParameters["Target"] is Entity)
            {
                Entity entity = (Entity)context.InputParameters["Target"];
                if (entity.LogicalName == "contact")
                {
                    if (context.MessageName.ToLower() == "create" || context.MessageName.ToLower() == "update")
                    {
                        string city;
                        string postCode;
                        if (entity.Contains("address1_city") && entity.Contains("address1_postofficebox"))
                        {
                            city = entity.Attributes["address1_city"].ToString();
                            postCode = entity.Attributes["address1_postofficebox"].ToString();
                            EntityReference region = this.RetrieveRegionID(city, postCode, service);
                            if (region != null)
                            {
                                if (entity.Contains("new_regionid"))
                                {
                                    entity["new_regionid"] = region;
                                }
                                else
                                {
                                    entity.Attributes.Add("new_regionid", region);
                                }
                            }
                        }
                    }
                }
            }
        }

        private EntityReference RetrieveRegionID(string city, string postOfficeBox, IOrganizationService service)
        {
            EntityReference region = new EntityReference();
            ColumnSet columns = new ColumnSet("new_regionid");
            QueryExpression regionQuery = new QueryExpression();
            regionQuery.EntityName = "new_busregionroaster";
            FilterExpression filterExpression = new FilterExpression();
            filterExpression.FilterOperator = LogicalOperator.And;
            ConditionExpression cityCondition = new ConditionExpression();
            cityCondition.AttributeName = "new_city";
            cityCondition.EntityName = "new_busregionroaster";
            cityCondition.Operator = ConditionOperator.Equal;
            cityCondition.Values.Add(city);
            filterExpression.Conditions.Add(cityCondition);
            ConditionExpression postOfficeCondition = new ConditionExpression();
            postOfficeCondition.AttributeName = "new_name";
            postOfficeCondition.EntityName = "new_busregionroaster";
            postOfficeCondition.Operator = ConditionOperator.Equal;
            postOfficeCondition.Values.Add(postOfficeBox);
            filterExpression.Conditions.Add(postOfficeCondition);
            regionQuery.Criteria = filterExpression;
            regionQuery.ColumnSet = columns;
            EntityCollection regions = service.RetrieveMultiple(regionQuery);
            if (regions != null)
            {
                if (regions.Entities.Count > 0)
                {
                    if (regions.Entities[0].Contains("new_regionid"))
                    {
                        region = (EntityReference)regions.Entities[0]["new_regionid"];
                    }
                }
            }
            return region;
        }
    }
}
