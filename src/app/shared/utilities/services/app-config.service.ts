import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment.prod';

export interface AppConfig {
  production: boolean;
  API_BASE_URL: string;
  appVersion: string;
  USERDATA_KEY: string;
  isMockEnabled: boolean;
  primengTheme: string;
  apiUrl: string;
}

@Injectable({ providedIn: 'root' })
export class AppConfigService {
  private config?: AppConfig;

  constructor(private http: HttpClient) {}

  async load(): Promise<void> {
    const file = environment.production
      ? 'appconfig.production.json'
      : 'appconfig.json';

    try {
      // Add timestamp to prevent caching issues
      const timestamp = new Date().getTime();
      this.config = await firstValueFrom(
        this.http.get<AppConfig>(`/assets/${file}?t=${timestamp}`)
      );
      //console.log(`[AppConfigService] Loaded config from /assets/${file}`, this.config);
    } catch (err) {
      //console.error(`[AppConfigService] Failed to load /assets/${file}`, err);
      // Fallback to environment values if config file fails to load
      this.config = {
        production: environment.production,
        API_BASE_URL: environment?.API_BASE_URL,
        appVersion: environment.appVersion,
        USERDATA_KEY: environment.USERDATA_KEY,
        isMockEnabled: environment.isMockEnabled,
        primengTheme: environment.primengTheme,
        apiUrl: environment.apiUrl
      };
    }
  }

  get apiBaseUrl(): string {
    // Return fallback during initialization, config value after load
    return this.config?.API_BASE_URL || environment.API_BASE_URL;
  }

  get appVersion(): string {
    return this.config?.appVersion || environment.appVersion;
  }

  get userDataKey(): string {
    return this.config?.USERDATA_KEY || environment.USERDATA_KEY;
  }

  get isMockEnabled(): boolean {
    return this.config?.isMockEnabled ?? environment.isMockEnabled;
  }

  get primengTheme(): string {
    return this.config?.primengTheme || environment.primengTheme;
  }

  get apiUrl(): string {
    return this.config?.apiUrl || environment.apiUrl;
  }

  get isProduction(): boolean {
    return this.config?.production ?? environment.production;
  }

  getConfig(): AppConfig | undefined {
    return this.config;
  }
}