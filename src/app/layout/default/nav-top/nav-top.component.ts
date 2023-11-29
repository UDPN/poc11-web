import { Component } from '@angular/core';
import { ThemeService } from '@app/core/services/store/common-store/theme.service';

@Component({
  selector: 'app-nav-top',
  templateUrl: './nav-top.component.html',
  styleUrls: ['./nav-top.component.less'],
})
export class NavTopComponent {
  isOverMode$ = this.themesService.getIsOverMode();
  constructor(private themesService: ThemeService) { }
}
