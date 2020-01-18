import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class NgRecaptcha3Service {

  private baseUrl = 'https://www.google.com/recaptcha/api.js';
  private siteKey = '';
  private isLoaded: Boolean = false;
  private scriptId: number;


  public constructor() {
    window['ngRecaptcha3Loaded'] = () => {
      this.isLoaded = true;
    };
    this.scriptId = +(new Date());
  }

  public getToken(): Promise<any> {
    return window['grecaptcha'].execute(this.siteKey);
  }

  public init(siteKey: string) {
    if (this.isLoaded) {
      return;
    }
    this.siteKey = siteKey;
    const script = document.createElement('script');
    script.innerHTML = '';
    script.src = this.baseUrl + `?render=${this.siteKey}&onload=ngRecaptcha3Loaded`;
    script.id = `recapthcha-${this.scriptId}`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
  }

  public destroy() {
	this.isLoaded = false;
    const script = document.getElementById(`recapthcha-${this.scriptId}`);
    if (script) {
      script.remove();
    }
    window['grecaptcha'] = null;
    const badge = document.getElementsByClassName('grecaptcha-badge')[0];
    if (badge) {
      badge.remove();
    }

  }


}
