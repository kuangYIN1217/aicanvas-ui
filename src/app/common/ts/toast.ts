/**
 * Created by Administrator on 2017/6/13 0013.
 */
import {ToastyService , ToastOptions, ToastData} from 'ng2-toasty';
/**
 *
 * @param msg
 * @param flag info/success/wait/warning/default/error
 * @param title
 */
export const addToast = (toastyService: ToastyService, msg: string , flag: string = 'default' ,title: string = '消息提示') => {
  var toastOptions:ToastOptions = {
    title: title,
    msg: msg,
    showClose: true,
    timeout: 3000,
    theme: 'default',
    onAdd: (toast:ToastData) => {
    },
    onRemove: function(toast:ToastData) {
    }
  };
  toastyService[flag](toastOptions);
}


export const addWarningToast = (toastyService: ToastyService, msg: string , title: string = '消息提示') => {
  addToast(toastyService , msg , 'warning' , title)
}

export const addInfoToast = (toastyService: ToastyService, msg: string, title: string = '消息提示') => {
  addToast(toastyService , msg , 'info' , title)
}

export const addSuccessToast = (toastyService: ToastyService, msg: string, title: string = '消息提示') => {
  addToast(toastyService , msg , 'success' , title)
}

export const addWaitToast = (toastyService: ToastyService, msg: string, title: string = '消息提示') => {
  addToast(toastyService , msg , 'wait' , title)
}

export const addErrorToast = (toastyService: ToastyService, msg: string, title: string = '消息提示') => {
  addToast(toastyService , msg , 'error' , title)
}
