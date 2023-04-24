# Snowflake-Chat GPT (GPT-4) integration

This repository contains code for an external function that allows you to use GPT-4 (Chat GPT) from within Snowflake. 

You can manually create the Azure function using the SFCallGPT.js file or use the SFCallGPT_ARM_template.json file as a template replacement for the instructions from https://docs.snowflake.com/en/sql-reference/external-functions-creating-azure-template

Steps for using SFCallGPT_ARM_template.json:
1. Follow the instructions from https://docs.snowflake.com/en/sql-reference/external-functions-creating-azure-template, but use SFCallGPT_ARM_template.json in step 2 (described at https://docs.snowflake.com/en/sql-reference/external-functions-creating-azure-template-services).
2. Once the template is deployed, set the OPENAI_API_KEY, OPENAI_HOSTNAME, OPENAI_PATH variables in App Settings in Azure Function (as documented at https://learn.microsoft.com/en-us/azure/azure-functions/functions-how-to-use-azure-function-app-settings?tabs=portal)

Snowflake command templates:
```
create or replace api integration <API_Integration_Name>.
    api_provider = azure_api_management
    azure_tenant_id = '<tenant_id>'
    azure_ad_application_id = '<Application (client) ID of Azure AD application>'.
    api_allowed_prefixes = ('<API Management URL >')
    enabled = true;

describe api integration <API_Integration_Name>;

create or override external function AskGPT(context varchar, question varchar)
    returns varchar
    api_integration = <API_Integration_Name>.
    as "<Azure Function HTTP Trigger URL>"; 
```

Sample SQL query to Chat GPT:
```    
Select AskGPT('You are a poet', 'Write a poem about Snowflake');
``` 
See more examples at https://www.linkedin.com/pulse/snowflake-chatgpt-release-your-information-from-free-text-kantyka/
