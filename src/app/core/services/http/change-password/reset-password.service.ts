import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ResetPasswordService {

  constructor(private http: HttpClient) { }
  resetPassword(Request: any): Observable<any> {
    const data = {
      newPwd: Request.newPwd || '',
      oldPwd: Request.oldPwd || '',
      verifyPwd: Request.verifyPwd || '',
    };
    return this.http.post('/v1/fxsp/sys/user/manage/password/update', data)
      .pipe(
        map((Response: any) => {
          return Response;
        })
      );
  }
}
