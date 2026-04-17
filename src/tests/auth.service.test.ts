import { describe, it, expect, vi, beforeEach } from 'vitest';
import { 
  toBackendRole, 
  toFrontendRole, 
  mapBackendUserToFrontend, 
  loginRequest, 
  registerRequest, 
  getApiErrorMessage,
  type BackendUser,
  type BackendRole
} from '../services/auth/auth.service';
import { http } from '../services/http/http';

vi.mock('../services/http/http', () => ({
  http: {
    post: vi.fn(),
  }
}));

describe('auth.service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('toBackendRole', () => {
    it('converts frontend roles to backend roles', () => {
      expect(toBackendRole('captain')).toBe('CAPTAIN');
      expect(toBackendRole('organizer')).toBe('TOURNAMENT_ORGANIZER');
      expect(toBackendRole('referee')).toBe('REFEREE');
      expect(toBackendRole('player')).toBe('PLAYER');
      // @ts-expect-error testing default case
      expect(toBackendRole('unknown')).toBe('PLAYER');
    });
  });

  describe('toFrontendRole', () => {
    it('converts backend roles to frontend roles', () => {
      expect(toFrontendRole('CAPTAIN')).toBe('captain');
      expect(toFrontendRole('TOURNAMENT_ORGANIZER')).toBe('organizer');
      expect(toFrontendRole('ADMINISTRADOR_SISTEMA')).toBe('organizer');
      expect(toFrontendRole('REFEREE')).toBe('referee');
      expect(toFrontendRole('PLAYER')).toBe('player');
      expect(toFrontendRole(undefined)).toBe('player');
      expect(toFrontendRole(null)).toBe('player');
    });
  });

  describe('mapBackendUserToFrontend', () => {
    it('maps correctly with full data', () => {
      const backendUser: BackendUser = {
        name: 'Test',
        email: 'test@example.com',
        role: 'CAPTAIN' as BackendRole,
        position: 'Forward',
        jerseyNumber: 10,
        photo: 'url',
        userType: 'internal'
      };
      
      const frontendUser = mapBackendUserToFrontend(backendUser);
      
      expect(frontendUser.id).toBe('test@example.com');
      expect(frontendUser.name).toBe('Test');
      expect(frontendUser.role).toBe('captain');
      expect(frontendUser.position).toBe('Forward');
      expect(frontendUser.jerseyNumber).toBe(10);
      expect(frontendUser.photo).toBe('url');
      expect(frontendUser.userType).toBe('internal');
    });

    it('maps correctly with missing optional data', () => {
      const backendUser: BackendUser = {
        name: 'Test',
        email: 'test@example.com',
        role: 'PLAYER' as BackendRole,
      };
      
      const frontendUser = mapBackendUserToFrontend(backendUser);
      
      expect(frontendUser.position).toBeUndefined();
      expect(frontendUser.jerseyNumber).toBeUndefined();
      expect(frontendUser.photo).toBeUndefined();
    });
  });

  describe('loginRequest', () => {
    it('calls http.post with correct endpoint', async () => {
      const mockResponse = { data: { token: '123', user: { email: 'a@a.com', role: 'PLAYER' } } };
      vi.mocked(http.post).mockResolvedValueOnce(mockResponse);

      const result = await loginRequest({ email: 'a@a.com', password: 'password' });

      expect(http.post).toHaveBeenCalledWith('/auth', { email: 'a@a.com', password: 'password' });
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('registerRequest', () => {
    it('calls http.post with correct endpoint', async () => {
      const mockResponse = { data: { email: 'a@a.com', role: 'PLAYER' } };
      vi.mocked(http.post).mockResolvedValueOnce(mockResponse);

      const result = await registerRequest({ name: 'A', email: 'a@a.com', password: 'p', role: 'PLAYER' as BackendRole });

      expect(http.post).toHaveBeenCalledWith('/users', { name: 'A', email: 'a@a.com', password: 'p', role: 'PLAYER' });
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('getApiErrorMessage', () => {
    it('extracts error from string response data', () => {
      const error = { response: { data: 'String error' } };
      expect(getApiErrorMessage(error)).toBe('String error');
    });

    it('extracts error from object response data (message)', () => {
      const error = { response: { data: { message: 'Object message' } } };
      expect(getApiErrorMessage(error)).toBe('Object message');
    });

    it('extracts error from object response data (error)', () => {
      const error = { response: { data: { error: 'Object error' } } };
      expect(getApiErrorMessage(error)).toBe('Object error');
    });

    it('extracts error from axios message', () => {
      const error = { response: {}, message: 'Axios message' };
      expect(getApiErrorMessage(error)).toBe('Axios message');
    });

    it('falls back to error.message', () => {
      const error = new Error('Standard error');
      expect(getApiErrorMessage(error)).toBe('Standard error');
    });

    it('uses fallback when unknown', () => {
      expect(getApiErrorMessage(null, 'Custom fallback')).toBe('Custom fallback');
    });
  });
});
