import adal, { TokenResponse } from 'adal-node';
import * as fs from 'fs';
import https from 'https';
import request from 'request';
// import config from './config';
import { Options, PowerBiAsyncRequest, PowerBiAuthenticationCallback, PowerBiAuthFunction, PowerBiEmbedToken } from './types';

export const getAuthToken: PowerBiAuthFunction = async (config: Options) => {
  const AuthenticationContext = adal.AuthenticationContext;

  const { authorityUrl, resourceUrl, username, password, appId } = config;

  https.globalAgent.options.ca = config.signature;

  const promise = new Promise<TokenResponse>((resolve, reject) => {

    const authCallback: PowerBiAuthenticationCallback = (err, tokenResponse) => {
      if (err) return reject(err);
      if ('error' in tokenResponse) return reject(new Error(tokenResponse.error));
      return resolve(tokenResponse);
    };

    new AuthenticationContext(authorityUrl)
      .acquireTokenWithUsernamePassword(resourceUrl, username, password, appId, authCallback);
  });

  return promise;
};

export const getEmbedToken: PowerBiAsyncRequest<PowerBiEmbedToken> = (config: Options, url, options, reportId) => {
  const { workspaceId } = config;
  const promise = new Promise<PowerBiEmbedToken>((resolve, reject) => {
    request(url, options, (error, { statusCode }, body) => {
      if (error) return reject(error);

      if (statusCode >= 400) return reject(new Error('Invalid request'));

      if (!body || body === '') reject(new Error(`No report with id: ${reportId} in group with id: ${workspaceId}`));

      try {
        resolve(JSON.parse(body) as PowerBiEmbedToken);
      } catch (error) {
        reject(error);
      }
    });
  });

  return promise;
};
