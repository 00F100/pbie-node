import * as dotenv from 'dotenv';
import { Options } from './types';

dotenv.config();

const config: Options = {
  authorityUrl: 'https://login.microsoftonline.com/common/',
  resourceUrl: 'https://analysis.windows.net/powerbi/api',
  apiUrl: 'https://api.powerbi.com/',
  appId: (process.env.PBIE_APP_ID as string),
  workspaceId: (process.env.PBIE_WORKSPACE_ID as string),
  reportId: (process.env.PBIE_REPORT_ID as string),
  username: (process.env.PBIE_USERNAME as string),
  password: (process.env.PBIE_PASSWORD as string),
  roles: []
};

export default config;
