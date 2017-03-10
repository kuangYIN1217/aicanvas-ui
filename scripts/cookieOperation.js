function setCookie(name,hour,value){
  var exp = new Date();
  exp.setTime(exp.getTime() + hour*60*60*1000);
  document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
}

function getCookie(name){
  var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
  if(arr=document.cookie.match(reg)){
    return unescape(arr[2]);
  }
  return null;
}

function delCookie(name){
  var exp = new Date();
  exp.setTime(exp.getTime() - 1);
  var cval=getCookie(name);
  if(cval!=null){
    document.cookie= name + "="+cval+";expires="+exp.toGMTString();
  }
}

function verifyLogin(){
  console.log("verify-login");
  var is_logined = getCookie("login");
  if (is_logined=="true"){
    console.log("logined");
      return true;
  }
  console.log("not logined");
  return false;
}
