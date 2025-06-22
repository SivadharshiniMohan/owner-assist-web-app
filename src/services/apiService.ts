
import { ENV } from '@/config/env';

class ApiService {
  private baseURL = ENV.API_BASE_URL;

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const token = this.getAuthToken();
    
    const config: RequestInit = {
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    
    return response.json();
  }

  // Authentication methods
  async login(phoneNumber: string, password: string) {
    const formData = new URLSearchParams();
    formData.append('phoneNumber', phoneNumber);
    formData.append('password', password);

    const response = await this.request<any>('/v2/oa/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });
    
    if (response.data.oaId) {
      this.setAuthToken(response.data.oaId);
      localStorage.setItem('oaId', response?.data.oaId.toString());
      console.log('Login successful, OA ID:', response.data.oaId);
    }
    
    return response;
  }

  async isNewUser(phoneNumber: string) {
    return this.request<any>(`/v2/oa/isNew?phoneNumber=${phoneNumber}`);
  }

  // Fleet methods
  async getFleetStatus(oaId: number) {
    return this.request<any>(`/v2/oa/stats/fleetStatus?oaId=${oaId}`);
  }

  async getFleetList(oaId: number, filterBy: string) {
    return this.request<any>(`/v2/oa/stats/fleetList?oaId=${oaId}&filterBy=${filterBy}`);
  }

  async getRevenue(startDate: string, endDate: string, zones: string) {
    return this.request<any>(`/v2/admin/stats/revenue?startDate=${startDate}&endDate=${endDate}&zones=${zones}`);
  }

  async getWalletTransactions(id: number, pageNo: number, pageSize: number) {
    return this.request<any>(`/v2/driver/walletTxns?id=${id}&pageNo=${pageNo}&pageSize=${pageSize}`);
  }

    async getWalletBalance(id: number) {
    return this.request<any>(`/v2/driver/walletBalance?id=${id}`);
  }

  // Token management
  setAuthToken(token: number) {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + ENV.TOKEN_EXPIRY_DAYS);
    
    const tokenData = {
      token,
      expiry: expiryDate.toISOString(),
    };
    
    // localStorage.setItem('auth_token', token);
    // localStorage.setItem('auth_token', JSON.stringify(token));

  }

  getAuthToken(): number | null {
    const tokenData = localStorage.getItem('auth_token');
    
    if (!tokenData) return null;
    
    try {
      const { token, expiry } = JSON.parse(tokenData);
      
      if (new Date() > new Date(expiry)) {
        this.removeAuthToken();
        return null;
      }
      
      return token;
    } catch {
      this.removeAuthToken();
      return null;
    }
  }

  removeAuthToken() {
    localStorage.removeItem('auth_token');
  }

  isAuthenticated(): boolean {
    return !!this.getAuthToken();
  }
}

export const apiService = new ApiService();
