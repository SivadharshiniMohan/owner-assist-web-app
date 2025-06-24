import { ENV } from '@/config/env';

interface UserData {
  phoneNumber: string;
  name: string;
  oaId: number;
}

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
    
    if (response.data && response.status === 'success') {
      // Store user data along with token
      this.setUserData(response.data);
      this.setAuthToken('dummy_token'); // Since API doesn't return token, using dummy
    }
    
    return response;
  }

  async isNewUser(phoneNumber: string) {
    const formData = new URLSearchParams();
    formData.append('phoneNumber', phoneNumber);

    return this.request<any>('/v2/oa/isNew', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });
  }

  // User data API call
  async getUserDataFromAPI(oaId: number) {
    const formData = new URLSearchParams();
    formData.append('oaId', oaId.toString());

    return this.request<any>('/v2/oa/getUserData', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });
  }

  // Fleet methods
  async getFleetStatus(oaId: number) {
    const formData = new URLSearchParams();
    formData.append('oaId', oaId.toString());

    return this.request<any>('/v2/oa/stats/fleetStatus', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });
  }

  async getFleetList(oaId: number, filterBy: string) {
    const formData = new URLSearchParams();
    formData.append('oaId', oaId.toString());
    formData.append('filterBy', filterBy);

    return this.request<any>('/v2/oa/stats/fleetList', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });
  }

  async getRevenue(startDate: string, endDate: string, zones: string) {
    const formData = new URLSearchParams();
    formData.append('startDate', startDate);
    formData.append('endDate', endDate);
    formData.append('zones', zones);

    return this.request<any>('/v2/admin/stats/revenue', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });
  }

  async getWalletTransactions(id: number, pageNo: number, pageSize: number) {
    const formData = new URLSearchParams();
    formData.append('id', id.toString());
    formData.append('pageNo', pageNo.toString());
    formData.append('pageSize', pageSize.toString());

    return this.request<any>('/v2/driver/walletTxns', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });
  }

  // Driver summary for reports
  async getDriverSummary(startDate: string, endDate: string, oaId: number) {
    const params = new URLSearchParams();
    params.append('startDate', startDate);
    params.append('endDate', endDate);
    params.append('oaId', oaId.toString());

    return this.request<any>(`/v2/oa/driverSummary?${params.toString()}`, {
      method: 'GET',
    });
  }

  // User data management
  setUserData(userData: UserData) {
    localStorage.setItem('user_data', JSON.stringify(userData));
  }

  getUserData(): UserData | null {
    const userData = localStorage.getItem('user_data');
    return userData ? JSON.parse(userData) : null;
  }

  removeUserData() {
    localStorage.removeItem('user_data');
  }

  // Token management
  setAuthToken(token: string) {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + ENV.TOKEN_EXPIRY_DAYS);
    
    const tokenData = {
      token,
      expiry: expiryDate.toISOString(),
    };
    
    localStorage.setItem('auth_token', JSON.stringify(tokenData));
  }

  getAuthToken(): string | null {
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
    this.removeUserData();
  }

  isAuthenticated(): boolean {
    return !!this.getAuthToken();
  }
}

export const apiService = new ApiService();
