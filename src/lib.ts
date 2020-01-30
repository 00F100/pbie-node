import request from 'request';
import { buildAuthHeader, buildRequestParams } from './builder';
import config from './config';
import { getAuthToken, getEmbedToken } from './internals';
import {
  EmbedTokenGenerator, EmbedTokenGeneratorWithRls, PowerBiAsyncRequest,
  PowerBiReport, PowerBiRequestCallback, PowerBiDatasetRequest, PowerBiDataset, Options,
} from './types';

export const getReport: PowerBiAsyncRequest<PowerBiReport> = (config: Options, url, options, reportId) => {
  const { workspaceId } = config;

  const promise = new Promise<PowerBiReport>((resolve, reject) => {
    if (!reportId) return reject(new Error('No reportId provided'));

    const callback: PowerBiRequestCallback = (error, { statusCode }, body) => {
      if (error) return reject(error);

      if (statusCode >= 400) return reject(new Error('Invalid request'));

      if (!body || body === '') return reject(new Error(`No report with id: ${reportId} in group with id: ${workspaceId}`));

      try {
        resolve(JSON.parse(body));
      } catch (error) {
        reject(error);
      }
    };

    request(url, options, callback as any);

  });

  return promise;
};

export const getDataset: PowerBiDatasetRequest<PowerBiDataset> = (config, accessToken, datasetId) => {

  const { apiUrl, workspaceId } = config;

  const { Authorization } = buildAuthHeader(accessToken);
  const options = { headers: { Authorization }, method: 'GET' };
  const url = `${apiUrl}v1.0/myorg/groups/${workspaceId}/datasets/${datasetId}`;

  const promise = new Promise<PowerBiDataset>((resolve, reject) => {

    const callback: PowerBiRequestCallback = (error, { statusCode }, body) => {
      if (error) reject(error);

      if (statusCode >= 400) return reject(new Error('Request invalid'));

      try {
        const getReportRes = JSON.parse(body) as PowerBiDataset;
        resolve(getReportRes);
      } catch (error) {
        reject(error);
      }
    };

    request(url, options, callback as any);
  });

  return promise;

};

export const generateEmbedToken: EmbedTokenGenerator = async (config: Options) => {
  const { apiUrl, workspaceId, reportId } = config;

  const { accessToken } = await getAuthToken(config);

  const { Authorization } = buildAuthHeader(accessToken);

  const headers = { Authorization, 'Content-Type': 'application/json' };
  const options = { headers, method: 'POST', body: JSON.stringify({ accessLevel: 'View' }) };
  const url = `${apiUrl}v1.0/myorg/groups/${workspaceId}/reports/${reportId}/GenerateToken`;

  return getEmbedToken(config, url, options, reportId);
};

export const generateEmbedTokenWithRls: EmbedTokenGeneratorWithRls = async (term: string, config: Options) => {

  const { apiUrl, workspaceId, reportId, roles } = config;

  const { accessToken } = await getAuthToken(config);
  const { Authorization } = buildAuthHeader(accessToken);
  const { url, options } = buildRequestParams(config, accessToken, reportId);

  const report = await getReport(config, url, options, reportId);
  if (report instanceof Error) throw report;
  const { id, datasetId } = report;

  const dataset = await getDataset(config, accessToken, datasetId);
  if (dataset instanceof Error) throw dataset;

  if (!dataset.isEffectiveIdentityRequired) throw new Error('EffectiveIdentityRequired');

  const identities = [{ roles, username: term, datasets: [datasetId] }];
  const body = { identities, accessLevel: 'View' };
  const headers = { Authorization, 'Content-Type': 'application/json' };
  const embedTokenOptions = { headers, method: 'POST', body: JSON.stringify(body) };
  const embedTokenUrl = `${apiUrl}v1.0/myorg/groups/${workspaceId}/reports/${id}/GenerateToken`;
  return getEmbedToken(config, embedTokenUrl, embedTokenOptions, id);
};
