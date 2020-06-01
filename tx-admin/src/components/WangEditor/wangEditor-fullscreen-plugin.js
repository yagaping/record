/**
 * 
 */
import React, { Component } from 'react';
import $ from 'jquery';
import "./wangEditor-fullscreen-plugin.less";
export const fullscreen = {
	// editor create之后调用
	init: function(editorSelector){
		let myDiv = document.createElement('div');
		myDiv.innerHTML = '<a class="_wangEditor_btn_fullscreen" href="javascropt:void(0)">全屏</a>'
		myDiv.setAttribute('class','w-e-menu');
		myDiv.setAttribute('style','z-index:10001')
		editorSelector.firstChild.append(myDiv);
		$('._wangEditor_btn_fullscreen').click(function() {
			$('.w-e-menu').parent().parent().toggleClass('fullscreen-editor');
			if($('._wangEditor_btn_fullscreen').text() == '全屏'){
				$('._wangEditor_btn_fullscreen').text('退出全屏');
			}else{
				$('._wangEditor_btn_fullscreen').text('全屏');
			}
		})
	}
};