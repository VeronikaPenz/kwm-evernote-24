import {Injectable} from '@angular/core';

type requestType = 'json' | 'blob' | 'text';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = "http://evernote.s1810456025.student.kwmhgb.at/api";

  async issueRequest(url: string, init: RequestInit = {}, type: requestType = 'json'): Promise<any> {
    init = {
      ...init,
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${sessionStorage.getItem('token')}`
      }
    }
    try {
      window.loading = true;
      return await fetch(this.baseUrl + url, init).then((r) => {
        window.loading = false;
        if (!r.ok) throw new Error(String(r.status) + ' / ' + r.statusText);
        else {
          switch (type) {
            case 'text':
              return r.text();
            case 'blob':
              return r.blob();
            case 'json':
            default:
              return r.json();
          }
        }
      });
    } catch (e) {
      window.loading = false;
      throw (url + '\n' + e);
    }
  }
}
