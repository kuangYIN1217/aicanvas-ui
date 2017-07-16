/**
 * Created by Administrator on 2017/7/14 0014.
 */
export const calc_size = num => {
  if (num) {
    return num > 1024
      ? num / 1024 > 1024
        ? num / (1024 * 1024) > 1024
          ? (num / (1024 * 1024 * 1024)).toFixed(2) + 'GB'
          : (num / (1024 * 1024)).toFixed(2) + 'MB'
        : (num / 1024).toFixed(2) + 'KB'
      : (parseFloat(num)).toFixed(2) + 'B';
  }
  return num;
}
