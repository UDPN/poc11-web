import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { WindowService } from '@app/core/services/common/window.service';

@Component({
  selector: 'app-sp-details',
  templateUrl: './sp-details.component.html',
  styleUrls: ['./sp-details.component.less'],
})
export class SpDetailsComponent implements OnInit {
  initData!: any;
  documentDid!: string;
  srcUrl!: string;


  constructor(private windowSrc: WindowService, private router: Router, private cdr: ChangeDetectorRef) { }
  ngOnInit(): void {
    // this.initData = this.windowSrc.getSessionStorage('initData');
    // this.initData = JSON.parse(this.initData);
    // this.documentDid = JSON.parse(this.initData['memberNodeDidDoc']);
    // this.documentDid = JSON.stringify(this.documentDid, undefined, 2);
    // this._bnJoinService.downImg({ hash: this.initData['nodeLicense'] }).subscribe(base64 => {
    //   this.srcUrl = 'data:image/jpg;base64,' + base64;
    //   this.cdr.detectChanges();
    // });
    
    // this.windowSrc.removeSessionStorage("secondStep");
    // this.windowSrc.removeSessionStorage("sencStepData");
    // this.windowSrc.removeSessionStorage("oneStep");
    // this.windowSrc.removeSessionStorage("oneStepData");
  }
  doAction() {
    this.router.navigateByUrl('/onboarding/bn-onboarding')
  }

  
  
  
  
  
}
