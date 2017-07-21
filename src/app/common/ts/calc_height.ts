/**
 * Created by Administrator on 2017/7/21 0021.
 */
declare var $:any;
export const calc_height = (dom) => {
  let top = $(dom).offset().top;
  let win_height = $(window).height();
  $(dom).css({
    'min-height': win_height - top + 'px',
    'height': 'auto',
    'box-sizing': 'border-box'
  })
}
