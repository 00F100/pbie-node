import config from './config';
import { BearerBuilder, RequestParamsBuilder } from './types';

export const buildAuthHeader: BearerBuilder = accessToken => ({ Authorization: `Bearer ${accessToken}` });

export const buildRequestParams: RequestParamsBuilder = (accessToken, reportId) => {
  const { apiUrl, workspaceId } = config;
  const { Authorization } = buildAuthHeader(accessToken);
  const headers = { Authorization };
  const options = { headers, method: 'GET' };
  const url = `${apiUrl}v1.0/myorg/groups/${workspaceId}/reports/${reportId}`;

  return { url, options };
};
