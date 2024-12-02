declare module 'selenium-webdriver' {
    import { Options } from 'selenium-webdriver/chrome';
    
    export class Builder {
      forBrowser(name: string): Builder;
      setChromeOptions(options: Options): Builder;
      build(): WebDriver;
    }
  
    export class WebDriver {
      [x: string]: any;
      get(url: string): Promise<void>;
      executeScript(script: string): Promise<any>;
      quit(): Promise<void>;
    }
  }