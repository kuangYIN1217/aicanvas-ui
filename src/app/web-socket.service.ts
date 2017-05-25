import {Injectable} from '@angular/core';
import {StompService} from 'ng2-stomp-service-fixed';
import {SERVER_URL} from './app.constants';
@Injectable()
export class WebSocketService {

  constructor(private stomp: StompService) {
  }

  private subscription: any;
  public queuePromises :any;
  public  connect() {
    this.stomp.configure({
      host: SERVER_URL+'/websocket',
      debug: true,
      queue: {'init': false}
    });
  }

  public subscribe(subscribe: string,callback:(data:any)=>void){

    this.stomp.startConnect().then(() => {
      this.stomp.subscribe(subscribe,(result)=>{
        callback(result);
      });

      }
    );



  }

  public unsubscribe() {
    this.stomp.startConnect().then(() => {
        this.subscription.unsubscribe();
      }
    );

  }

  public disconnect(callback: any) {
    this.stomp.startConnect().then(() => {
        this.stomp.disconnect().then(() => {
          callback();
        })
      }
    );

  }


}
