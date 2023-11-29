import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';

import Driver from 'driver.js';

@Injectable({
  providedIn: 'root'
})
export class DriverService {
  constructor(@Inject(DOCUMENT) private doc: Document) { }

  load(): void {
    setTimeout(() => {
      const driver = new Driver({
        animate: false,
        allowClose: true,
        doneBtnText: 'complete',
        closeBtnText: 'Shut down',
        nextBtnText: 'The next step',
        prevBtnText: 'The previous step',
        onHighlightStarted: () => {
          this.doc.body.style.cssText = 'overflow:hidden';
        },
        onReset: () => {
          this.doc.body.style.cssText = '';
        }
      });
      driver.defineSteps([
        {
          element: '#menuNav',
          popover: {
            title: 'The menu',
            description: 'Here is the menu',
            position: 'right-center'
          }
        },
        {
          element: '#drawer-handle',
          popover: {
            title: 'Theme Settings button',
            description: 'Click on Settings theme, can drag the up and down',
            position: 'left'
          }
        },
        {
          element: '#tools',
          popover: {
            title: 'The toolbar',
            description: 'Lock screen, search menus, full screen, the notification message, log out, more than language',
            position: 'bottom'
          }
        },
        {
          element: '#chats',
          popover: {
            title: 'Contact your administrator',
            description: 'Contact administrator',
            position: 'top'
          }
        },
        {
          element: '#trigger',
          popover: {
            title: 'Fold the menu',
            description: 'Menu folding',
            position: 'bottom'
          }
        },
        {
          element: '#multi-tab',
          popover: {
            title: 'More labels',
            description: 'The right mouse button click on a single tag can expand multiple options, beyond the screen, scroll the mouse wheel can be TAB scroll',
            position: 'bottom'
          }
        },
        {
          element: '#multi-tab2',
          popover: {
            title: 'More labels',
            description: 'The right mouse button click on a single tag can expand multiple options, beyond the screen, scroll the mouse wheel can be TAB scroll',
            position: 'bottom'
          }
        }
      ]);
      driver.start();
    }, 500);
  }
}
