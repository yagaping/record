const convertHtmlToText = function(htmltext){

  htmltext = "" + htmltext;
  // 提取图片
  var imgReg = /<img.*?src="([^"]+)".*?\/?>/gi;
  var imageArr = htmltext.match(imgReg);
  htmltext = htmltext.replace(imgReg, "\r\n{{IMAGE}}\r\n");
  // 提取重点文本
  var strongReg = /(<strong.*?>(.*?)<\/strong>|<b.*?>(.*?)<\/b>)/gi;
  var strongArr = htmltext.match(strongReg);
  htmltext = htmltext.replace(strongReg, "{{STRONG}}");

  // 过滤行标签
  htmltext = htmltext.replace(/<(span|strong|font|i|a|b|g|em|var).*?>/gi, "");
  htmltext = htmltext.replace(/<\/(span|strong|font|i|a|b|g|em|var)>/ig, "");
  // 过滤其它标签
  htmltext = htmltext.replace(/<[a-zA-Z0-9]+.*?>/gi, "\r\n");
  htmltext = htmltext.replace(/<\/[a-zA-Z0-9]+>/ig, '\r\n');
  htmltext = htmltext.replace(/<\!\-\-[^>]+\-\->/ig, '\r\n'); // HTML 注释

  var contentArr = []
  var arr = htmltext.split(/\r\n/)
  var ii = 0
  for(var i = 0; i < arr.length; ++i) {
      var txt = arr[i].replace(/(^\s*)|(\s*$)/g, "")
      if (txt == '') {
          continue
      }
      var obj = {}
      if(txt == '{{IMAGE}}') {
          obj.type = 'image';
          obj.src = imageArr[ii].replace(imgReg, "$1");
          ii++;
      } else {
          obj.type = 'text';
          obj.text = txt;
      }
      contentArr.push(obj);
  }

  var textContent = "";
  var a1;
  for(var i = 0; i < contentArr.length; ++i) {

      if(contentArr[i].type == "text") {
          textContent += '<p>' + contentArr[i].text + '</p>';
      }
      if(contentArr[i].type == "image") {
          var imgId = 'iid' + Math.random();
          (function(iid, imgSrc){
              var img = new Image();
              img.id = iid;
              img.src = imgSrc;
              img.onload = function(e){
                  if(img.width <= 375 / 3) {
                      this.style.width = "auto";
                      this.style.height = "auto";
                      this.style.display = "inline";
                  }
              }
          })(imgId, contentArr[i].src)
          textContent += '<img id="' + imgId + '" src="' + contentArr[i].src + '" />';
      }

  }
  
  if(strongArr) {
      for(var i = 0; i < strongArr.length; ++i) {
          strongArr[i] = strongArr[i].replace(/<(span|strong|i|a|g|em|var).*?>/gi, "");
          strongArr[i] = strongArr[i].replace(/<\/(span|strong|i|a|g|em|var)>/ig, "");
          textContent = textContent.replace("{{STRONG}}", strongArr[i]);
      }
  }
  return textContent;
}

export { convertHtmlToText };