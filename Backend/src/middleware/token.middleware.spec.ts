import { TokenMiddleware } from './token.middleware';
import { Request, Response, NextFunction } from 'express';

describe('TokenMiddleware', () => {
  let middleware: TokenMiddleware;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    middleware = new TokenMiddleware();
    mockRequest = {
      url: '',
      query: {}
    };
    mockResponse = {};
    mockNext = jest.fn();
  });

  it('should extract access_token and refresh_token from the URL fragment and assign them to req.query', () => {
    mockRequest.url = '/callback#access_token=abc123&refresh_token=def456';

    middleware.use(mockRequest as Request, mockResponse as Response, mockNext);

    expect(mockRequest.query.access_token).toBe('abc123');
    expect(mockRequest.query.refresh_token).toBe('def456');
    expect(mockNext).toHaveBeenCalled();
  });

  it('should not assign anything to req.query if there is no URL fragment', () => {
    mockRequest.url = '/callback';

    middleware.use(mockRequest as Request, mockResponse as Response, mockNext);

    expect(mockRequest.query.access_token).toBeUndefined();
    expect(mockRequest.query.refresh_token).toBeUndefined();
    expect(mockNext).toHaveBeenCalled();
  });

  it('should handle a fragment with no tokens correctly', () => {
    mockRequest.url = '/callback#other_param=789';

    middleware.use(mockRequest as Request, mockResponse as Response, mockNext);

    expect(mockRequest.query.access_token).toBeNull();
    expect(mockRequest.query.refresh_token).toBeNull();
    expect(mockNext).toHaveBeenCalled();
  });

  it('should not modify req.query if there is no fragment in the URL', () => {
    mockRequest.url = '/callback?param=123';

    middleware.use(mockRequest as Request, mockResponse as Response, mockNext);

    expect(mockRequest.query.access_token).toBeUndefined();
    expect(mockRequest.query.refresh_token).toBeUndefined();
    expect(mockNext).toHaveBeenCalled();
  });

  it('should call next even if no tokens are found', () => {
    mockRequest.url = '/callback#';

    middleware.use(mockRequest as Request, mockResponse as Response, mockNext);

    expect(mockNext).toHaveBeenCalled();
  });
});
