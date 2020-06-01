export const setRichText = (content) => {
    let textLabel, imgLabel, newContent = [], newContentFormat= [];
    if(content) {
      let contentArray = JSON.parse(content);
        contentArray.map((item, i) => {
          if(item.type == 0) {
            textLabel = item.text;
            newContent.push(textLabel)
          }else if (item.type == 1) {
            imgLabel = `<p><img src=${item.url} /></p>`;
            newContent.push(imgLabel)
          }
      })
      newContentFormat = newContent.join(" ");
    }
    return convertHtmlToText(newContentFormat);
}
const convertHtmlToText = (htmltext) => {
  // 格式化html

    htmltext = "" + htmltext;
    // 过滤行标签
    htmltext = htmltext.replace(/<(span|strong|font|a|b|g|em|var)>/gi, "");  //.*?
    // htmltext = htmltext.replace(/<br \/><br \/>/ig, "<br />");   //两个br替换成一个
    htmltext = htmltext.replace(/<\/(span|strong|font|a|b|g|em|var)>/ig, "");
    //去掉标签之间的空格
    htmltext = htmltext.replace(/>\s+</g, "><");
    //删除空的p标签
    htmltext = htmltext.replace(/<p><\/p>/ig, "");
    //删除style
    htmltext = htmltext.replace(/style\s*?=\s*?([‘"])[\s\S]*?\1/ig, "") // 替换style
    // 提取图片
    var imgReg = /<img.*?src="([^"]+?)"(.|\n)*?\/?>/gi;
    var imageArr = htmltext.match(imgReg);
    htmltext = htmltext.replace(imgReg, "\r\n{{IMAGE}}\r\n");
    // 提取重点文本
    var strongReg = /(<strong.*?>(.*?)<\/strong>|<b.*?>(.*?)<\/b>)/gi;
    var strongArr = htmltext.match(strongReg);
    htmltext = htmltext.replace(strongReg, "{{STRONG}}");

    // 过滤其它标签
    // htmltext = htmltext.replace(/<[a-zA-Z0-9]+.*?>/gi, "\r\n");
    // htmltext = htmltext.replace(/<\/[a-zA-Z0-9]+>/ig, '\r\n');
    // htmltext = htmltext.replace(/<\!\-\-[^>]+\-\->/ig, '\r\n'); // HTML 注释
    // htmltext = htmltext.replace(/\/\*?.*?\*?\//ig,''); //过滤注释内容

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
                    if(img.width <= window.innerWidth / 3) {
                        document.getElementById(img.id).style.width = "auto";
                        document.getElementById(img.id).style.height = "auto";
                        document.getElementById(img.id).style.display = "inline";
                    }
                }
            })(imgId, contentArr[i].src)
            textContent += '<img id="' + imgId + '" src="' + contentArr[i].src + '" />';
        }

    }

    if(strongArr) {
        for(var i = 0; i < strongArr.length; ++i) {
            strongArr[i] = strongArr[i].replace(/<(span|i|a|g|em|var).*?>/gi, "");
            strongArr[i] = strongArr[i].replace(/<\/(span|i|a|g|em|var)>/ig, "");
            textContent = textContent.replace("{{STRONG}}", strongArr[i]);
        }
    }
    return textContent;
}