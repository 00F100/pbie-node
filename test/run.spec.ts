import 'jasmine';
import config from '../src/config';
import { generateEmbedToken, generateEmbedTokenWithRls } from '../src/lib';
import { getAuthToken } from '../src/internals';

describe('get powerbi token', () => {
  const { reportId } = config;
  const username = 'DrogaSil';
  const roles = ['FuncUser'];

  it('get access token', async () => {
    const { accessToken } = await getAuthToken();
    expect(accessToken).toBeTruthy();
  });
  it('get report by id', async () => {
    const { token } = await generateEmbedToken(reportId);
    expect(token).toBeTruthy();
  });
  it('get embed token with rls', async () => {
    const { token } = await generateEmbedTokenWithRls(reportId, username, roles);
    expect(token).toBeTruthy();
  });
});
