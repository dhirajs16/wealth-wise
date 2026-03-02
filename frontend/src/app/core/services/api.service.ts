import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private http = inject(HttpClient);
  private apiUrl = 'https://localhost:5001/api';

  get(path: string, params: any = {}): Observable<any> {
    let httpParams = new HttpParams();
    Object.keys(params).forEach(key => {
      if (params[key]) httpParams = httpParams.append(key, params[key]);
    });
    return this.http.get(`${this.apiUrl}${path}`, { params: httpParams });
  }

  post(path: string, body: any = {}): Observable<any> {
    return this.http.post(`${this.apiUrl}${path}`, body);
  }

  put(path: string, body: any = {}): Observable<any> {
    return this.http.put(`${this.apiUrl}${path}`, body);
  }

  delete(path: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}${path}`);
  }
}
