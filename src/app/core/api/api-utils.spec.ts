import { buildUrlWithParams } from './api-utils';

describe('ApiUtils', () => {
  describe('buildUrlWithParams', () => {
    it('should return base URL when no query params provided', () => {
      const baseUrl = 'http://localhost:8000/api/spaces';
      const result = buildUrlWithParams(baseUrl);
      expect(result).toBe(baseUrl);
    });

    it('should return base URL when empty query params provided', () => {
      const baseUrl = 'http://localhost:8000/api/spaces';
      const result = buildUrlWithParams(baseUrl, '');
      expect(result).toBe(baseUrl);
    });

    it('should add ? separator when query params do not start with ?', () => {
      const baseUrl = 'http://localhost:8000/api/spaces';
      const queryParams = '$top=10&$skip=0';
      const result = buildUrlWithParams(baseUrl, queryParams);
      expect(result).toBe('http://localhost:8000/api/spaces?$top=10&$skip=0');
    });

    it('should not add ? separator when query params already start with ?', () => {
      const baseUrl = 'http://localhost:8000/api/spaces';
      const queryParams = '?$top=10&$skip=0';
      const result = buildUrlWithParams(baseUrl, queryParams);
      expect(result).toBe('http://localhost:8000/api/spaces?$top=10&$skip=0');
    });
  });
});
