import { CoreOptions } from 'request';
import { AcquireTokenCallback, TokenResponse } from 'adal-node';

export interface Options {
  authorityUrl: string;
  resourceUrl: string;
  apiUrl: string;
  appId: string;
  workspaceId: string;
  reportId: string;
  username: string;
  password: string;
  roles: string[];
}

export interface AuthorizationHeader { Authorization: string; }

export interface RequestParamOptions {
  url: string;
  options: {
    headers: AuthorizationHeader;
    method: string;
  };
}

export interface PowerBiResource {
  '@odata.context': string;
}

export interface PowerBiEmbedToken extends PowerBiResource {
  token: string;
  tokenId: string;
  expiration: string;
}

export interface PowerBiDataset extends PowerBiResource {
  id: string;
  name: string;
  addRowsAPIEnabled: boolean;
  configuredBy: string;
  isRefreshable: boolean;
  isEffectiveIdentityRequired: boolean;
  isEffectiveIdentityRolesRequired: boolean;
  isOnPremGatewayRequired: boolean;
  targetStorageMode: string;
}

export interface PowerBiReport extends PowerBiResource {
  id: string;
  reportType: string;
  name: string;
  webUrl: string;
  embedUrl: string;
  isFromPbix: boolean;
  isOwnedByMe: boolean;
  datasetId: string;
}

interface PowerBiHeaders extends Headers {
  'cache-control': string;
  pragma: string;
  'transfer-encoding': string;
  'content-type': string;
  'strict-transport-security': string;
  'x-frame-options': string;
  'x-content-type-options': string;
  requestid: string;
  'access-control-expose-headers': string;
  date: string;
  connection: string;
}

interface Uri {
  protocol: string;
  slashes: boolean;
  auth: any;
  host: string;
  port: number;
  hostname: string;
  hash: any;
  search: any;
  query: any;
  pathname: string;
  path: string;
  href: string;
}

interface PowerBiRequest {
  uri: Uri;
  method: string;
  headers: AuthorizationHeader;
}

export interface PowerBiResponse extends Response {
  statusCode: number;
  headers: PowerBiHeaders;
  request: PowerBiRequest;
}

export type BearerBuilder = (accessToken: string) => AuthorizationHeader;
export type RequestParamsBuilder = (accessToken: string, reportId: string) => RequestParamOptions;

export type PowerBiRequestCallback = (error: any, response: PowerBiResponse, body: string) => void;
export type PowerBiAuthenticationCallback = AcquireTokenCallback;

export type PowerBiAsyncRequest<T> = (config: Options, url: string, options: CoreOptions, reportId: string) => Promise<T>;
export type PowerBiDatasetRequest<T> = (accessToken: string, datasetId: string) => Promise<T>;
export type PowerBiAuthFunction = (options: Options) => Promise<TokenResponse>;
export type EmbedTokenGenerator = (config: Options) => Promise<PowerBiEmbedToken>;
export type EmbedTokenGeneratorWithRls = (config: Options) => Promise<PowerBiEmbedToken>;
