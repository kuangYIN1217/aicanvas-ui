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
export const addToast = (toastyService: ToastyService, msg: string , flag: string = 'default' ,title: string = '消息提示' , timeout: number = 3000) => {
  var toastOptions:ToastOptions = {
    title: title,
    msg: msg,
    showClose: true,
    timeout: timeout,
    theme: 'default',
    onAdd: (toast:ToastData) => {
    },
    onRemove: function(toast:ToastData) {
    }
  };
  toastyService[flag](toastOptions);
}


export const addWarningToast = (toastyService: ToastyService, msg: string , title: string = '消息提示', timeout: number = 3000) => {
  addToast(toastyService , msg , 'warning' , title, timeout)
}

export const addInfoToast = (toastyService: ToastyService, msg: string, title: string = '消息提示', timeout: number = 3000) => {
  addToast(toastyService , msg , 'info' , title, timeout)
}

export const addSuccessToast = (toastyService: ToastyService, msg: string, title: string = '消息提示', timeout: number = 3000) => {
  addToast(toastyService , msg , 'success' , title, timeout)
}

export const addWaitToast = (toastyService: ToastyService, msg: string, title: string = '消息提示', timeout: number = 3000) => {
  addToast(toastyService , msg , 'wait' , title, timeout)
}

export const addErrorToast = (toastyService: ToastyService, msg: string, title: string = '消息提示', timeout: number = 3000) => {
  addToast(toastyService , msg , 'error' , title , timeout)
}
