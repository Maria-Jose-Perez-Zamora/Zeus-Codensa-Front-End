import { render, screen, act, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { MemoryRouter, Route, Routes } from 'react-router';
import * as authService from '@/services/auth/auth.service';

vi.mock('@/services/auth/auth.service', () => ({
  loginRequest: vi.fn(),
  mapBackendUserToFrontend: vi.fn(),
  registerRequest: vi.fn(),
  getApiErrorMessage: vi.fn(),
  toBackendRole: vi.fn(),
}));

const TestComponent = () => {
  const { user, login, logout } = useAuth();
  return (
    <div>
      <span data-testid="user-status">{user ? `Logged in as ${user.role}` : 'Not logged in'}</span>
      <button onClick={() => login({ email: 'test@test.com', password: 'password' })}>Login</button>
      <button onClick={() => logout()}>Logout</button>
    </div>
  );
};

describe('Authentication & Protected Routes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.localStorage.clear();
  });

  it('1. Provides initial unauthenticated state', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    expect(screen.getByTestId('user-status')).toHaveTextContent('Not logged in');
  });

  it('2. login updates the user state correctly', async () => {
    const mockUser = { id: '1', name: 'Test User', role: 'player', email: 'test@test.com' };
    
    vi.mocked(authService.loginRequest).mockResolvedValue({ token: 'fake-token', user: mockUser as any });
    vi.mocked(authService.mapBackendUserToFrontend).mockReturnValue(mockUser as any);

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    act(() => {
      screen.getByText('Login').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('user-status')).toHaveTextContent('Logged in as player');
    });
    
    expect(window.localStorage.getItem('techcup.auth.session')).toBeTruthy();
  });

  it('3. logout clears the user state and localStorage', async () => {
    const mockUser = { id: '1', name: 'Test User', role: 'player', email: 'test@test.com' };
    window.localStorage.setItem('techcup.auth.session', JSON.stringify({ user: mockUser, token: 'fake' }));

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId('user-status')).toHaveTextContent('Logged in as player');

    act(() => {
      screen.getByText('Logout').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('user-status')).toHaveTextContent('Not logged in');
    });

    expect(window.localStorage.getItem('techcup.auth.session')).toBeNull();
  });

  it('4. ProtectedRoute redirects to login if unauthenticated', () => {
    render(
      <AuthProvider>
        <MemoryRouter initialEntries={['/protected']}>
          <Routes>
            <Route element={<ProtectedRoute />}>
              <Route path="/protected" element={<div>Protected Content</div>} />
            </Route>
            <Route path="/auth/login" element={<div>Login Page</div>} />
          </Routes>
        </MemoryRouter>
      </AuthProvider>
    );

    expect(screen.getByText('Login Page')).toBeInTheDocument();
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('5. ProtectedRoute renders content if authenticated and has allowed role', () => {
    const mockUser = { id: '1', name: 'Test User', role: 'organizer', email: 'org@test.com' };
    window.localStorage.setItem('techcup.auth.session', JSON.stringify({ user: mockUser, token: 'fake' }));

    render(
      <AuthProvider>
        <MemoryRouter initialEntries={['/protected']}>
          <Routes>
            <Route element={<ProtectedRoute allowedRoles={['organizer']} />}>
              <Route path="/protected" element={<div>Protected Content</div>} />
            </Route>
            <Route path="/" element={<div>Home Page</div>} />
          </Routes>
        </MemoryRouter>
      </AuthProvider>
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });
});
