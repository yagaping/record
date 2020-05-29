const sizeType = function(n,elem){
  //缓存表格翻页
  let size = n;
  let userId = JSON.parse(localStorage.getItem('currentUser')).userid;
  let sizeObj = JSON.parse(localStorage.getItem('size'))||{};
  const sizeType = elem.location.pathname.split('/');
  const sizeName = sizeType[sizeType.length-1].split('-').join('')+`_${userId}`;
  if(sizeObj&&sizeObj[sizeName]){
    size = sizeObj[sizeName];
  }else{
    sizeObj[sizeName] = size;
  } 
  localStorage.setItem('size',JSON.stringify(sizeObj));
  return size;
  // 缓存表格翻页结束
}
const sizeChange = function(n,elem){
  //操作表格翻页
    let userId = JSON.parse(localStorage.getItem('currentUser')).userid;
    let sizeObj = JSON.parse(localStorage.getItem('size'))||{};
    const sizeType = elem.location.pathname.split('/');
    const sizeName = sizeType[sizeType.length-1].split('-').join('')+`_${userId}`;
    sizeObj[sizeName] = n;
    localStorage.setItem('size',JSON.stringify(sizeObj));
  // 操作表格翻页结束
}
export { sizeType, sizeChange };