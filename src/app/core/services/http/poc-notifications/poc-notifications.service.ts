import { HttpClient } from "@angular/common/http";
import { BaseHttpService } from "../base-http.service";
import { DatePipe } from "@angular/common";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class TransactionRecordService {
    constructor(
      public http: BaseHttpService,
      private https: HttpClient,
      private date: DatePipe
    ) {}
  
  }