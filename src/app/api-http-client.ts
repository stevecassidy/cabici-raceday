// https://medium.com/@admin_87321/extending-angular-httpclient-6b33a7a1a4d0

import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {AuthService} from './services/auth.service';
import {environment} from '../environments/environment';

export interface IRequestOptions {
  headers?: HttpHeaders;
  observe?: 'body';
  params?: HttpParams;
  reportProgress?: boolean;
  responseType?: 'json';
  withCredentials?: boolean;
  body?: any;
}

export function apiHttpClientCreator(http: HttpClient, authService: AuthService) {
  return new ApiHttpClient(http, authService);
}

@Injectable()
export class ApiHttpClient {

  private readonly httpOptions: IRequestOptions;
  private readonly apiUrl: string;

  // Extending the HttpClient through the Angular DI.
  public constructor(public http: HttpClient,
                     public authService: AuthService) {

    this.apiUrl = environment.apiURL;
  }

  options(): IRequestOptions {
    const user = this.authService.currentUser();
    if (user) {
      return <IRequestOptions>{
        headers: new HttpHeaders({
          'Authorization': 'Token ' + user.token
        })
      };
    } else {
      return <IRequestOptions>{};
    }
  }

  /**
   * GET request
   * @param {string} endPoint
   * @returns {Observable<T>}
   */
  public get<T>(endPoint: string): Observable<T> {

    return this.http.get<T>(this.apiUrl + endPoint, this.options());
  }

  /**
   * POST request
   * @param {string} endPoint end point of the api
   * @param {Object} params body of the request.
   * @returns {Observable<T>}
   */
  public post<T>(endPoint: string, params: Object): Observable<T> {
    return this.http.post<T>(this.apiUrl + endPoint, params, this.options());
  }

  /**
   * PUT request
   * @param {string} endPoint end point of the api
   * @param {Object} params body of the request.
   * @returns {Observable<T>}
   */
  public put<T>(endPoint: string, params: Object): Observable<T> {
    return this.http.put<T>(this.apiUrl + endPoint, params,  this.options());
  }

  /**
   * DELETE request
   * @param {string} endPoint end point of the api
   * @returns {Observable<T>}
   */
  public delete<T>(endPoint: string): Observable<T> {
    return this.http.delete<T>(this.apiUrl + endPoint,  this.options());
  }
}
