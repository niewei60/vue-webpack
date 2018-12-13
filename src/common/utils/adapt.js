/**
 * 根据屏幕大小自动计算根节点FontSize
 * @param  {Number} maxWidth  [description]
 * @param  {Number} baseWidth [description]
 * @param  {Number} baseSize  [description]
 */
export default (maxWidth, baseWidth, baseSize) => {
  const el = document.documentElement;
  maxWidth = maxWidth || 640;
  baseWidth = baseWidth || 320;
  baseSize = baseSize || 16;

  let docWidth = parseInt(el.clientWidth, 10);
  docWidth > maxWidth && (docWidth = maxWidth);

  // 设置文字基准值
  el.style.fontSize = (docWidth / baseWidth) * baseSize + 'px';
};
