import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ScrollService {

  constructor() { }

  scrollToHideNavbar(): void {
    window.scrollTo({
      top: 100, // Adjust this value to control how far down the page scrolls
      behavior: 'smooth',
    });
  }
}
