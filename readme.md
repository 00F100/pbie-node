# pbie-node

NodeJS library written in typescript and designed for using [PowerBI](https://powerbi.microsoft.com/en-us/) embedded reports.

Inspired on [Power BI API Code Samples](https://github.com/microsoft/PowerBI-Developer-Samples)

## Installation
```sh
>> npm i -s @mend3/pbie-node
```

## Testing
```sh
>> npm test
```

## Getting Started
After installation, create or update your **.env** file.
```env
PBIE_APP_ID="your_app_id"
PBIE_WORKSPACE_ID="your_workspace_id"
PBIE_REPORT_ID="your_report_id"
PBIE_USERNAME="your_powerbi_user"
PBIE_PASSWORD="your_powerbi_password"
```

### Getting access token

```typescript
const { accessToken } = await getAuthToken();
```

### Getting embed token for report

```typescript
const { token } = await generateEmbedToken(reportId);
```

### Getting embed token with roles for report

```typescript
const { token } = await generateEmbedTokenWithRls(reportId, username, roles);
```

## Issues
[Repo Issues](https://github.com/mend3/pbie-node/issues)

[Power BI Support Page](https://powerbi.microsoft.com/en-us/support/)

[Power BI Ideas](https://ideas.powerbi.com)
