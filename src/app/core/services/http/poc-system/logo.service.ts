import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseHttpService } from '../base-http.service';

@Injectable({
  providedIn: 'root'
})
export class LogoService {

  constructor(private http: BaseHttpService) { }
  public search(params: { logoType: any }): Observable<any> {
    return this.http.post(`/v1/udpn/processing/system/logo/searches`, params);
  }
  public upload(params: { logoBase64: string, logoType: any }): Observable<any> {
    return this.http.post(`/v1/udpn/processing/system/logo/upload`, params);
  }

  public delete(params: { sysLogoId: string }): Observable<any> {
    return this.http.post(`/v1/udpn/processing/system/logo/delete`, params);
  }
}
