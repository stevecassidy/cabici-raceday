import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import {ApiHttpClient} from './api-http-client';
import {environment} from '../environments/environment';


fdescribe('GithubApiService', () => {
  let injector: TestBed;
  let service: ApiHttpClient;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiHttpClient]
    });
    injector = getTestBed();
    service = injector.get(ApiHttpClient);
    httpMock = injector.get(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should make a GET request with an Authorization header', () => {
      service.get('/api/races/').subscribe(response => {
          expect(response).toBe(3);
        }
      );

      const req = httpMock.expectOne(`${environment.apiURL}/api/races/`);
      expect(req.request.method).toBe("GET");
      expect(req.request.headers.get('Authorization')).toBeNull();
      req.flush(3);
    });
});
