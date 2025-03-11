import { API_URL, API_CONFIG } from '../config';
import Cookies from 'js-cookie';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

interface AuthResponse {
  token: string;
  user: User;
}

class AuthService {
  private static instance: AuthService;
  private token: string | null = null;

  private constructor() {
    this.token = this.getToken();
  }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    const contentType = response.headers.get('content-type');
    
    // Check if the response is JSON
    if (!contentType || !contentType.includes('application/json')) {
      console.error('Non-JSON response:', await response.text());
      throw new Error('Server response was not JSON');
    }

    const data = await response.json();
    
    if (!response.ok) {
      console.error('Error response:', data);
      throw new Error(data.message || 'Request failed');
    }

    return data;
  }

  public async register(data: RegisterData): Promise<AuthResponse> {
    try {
      console.log('Attempting to register with:', {
        url: `${API_URL}/auth/register`,
        data,
        config: API_CONFIG
      });

      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        ...API_CONFIG,
        body: JSON.stringify(data),
      });

      const responseData = await this.handleResponse<AuthResponse>(response);
      
      if (responseData.token) {
        this.setToken(responseData.token);
        if (responseData.user) {
          this.setUser(responseData.user);
        }
      } else {
        throw new Error('No token received from server');
      }

      return responseData;
    } catch (error) {
      console.error('Registration error:', error);
      throw error instanceof Error ? error : new Error('Registration failed');
    }
  }

  public async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        ...API_CONFIG,
        body: JSON.stringify(credentials),
      });

      const data = await this.handleResponse<AuthResponse>(response);
      this.setToken(data.token);
      this.setUser(data.user);
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error instanceof Error ? error : new Error('Login failed');
    }
  }

  public logout(): void {
    this.token = null;
    Cookies.remove('token');
    Cookies.remove('user');
    window.location.href = '/login';
  }

  public isAuthenticated(): boolean {
    return !!this.getToken();
  }

  public getToken(): string | null {
    if (!this.token) {
      this.token = Cookies.get('token') || null;
    }
    return this.token;
  }

  public setToken(token: string): void {
    this.token = token;
    Cookies.set('token', token, { secure: true, sameSite: 'strict' });
  }

  public getUser(): User | null {
    const userStr = Cookies.get('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  public setUser(user: User): void {
    Cookies.set('user', JSON.stringify(user), { secure: true, sameSite: 'strict' });
  }

  public setAuthHeader(): void {
    const token = this.getToken();
    if (token) {
      // Set for any future fetch calls
      this.token = token;
      API_CONFIG.headers = {
        ...API_CONFIG.headers,
        'Authorization': `Bearer ${token}`
      };
    }
  }
}

export const authService = AuthService.getInstance(); 