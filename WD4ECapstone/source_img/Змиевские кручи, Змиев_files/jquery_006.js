jQuery.noConflict(),function(e){e.fn.proofreader=function(t,o){var n=this,r={initialized:!1,selectionObject:{},scripts:[]},i=e.extend({loadFormUrl:null,messagesContainerSelector:"#proofreader_messages_container",typoContainerSelector:"#proofreader_typo_container",typoTextElementSelector:"#proofreader_typo_text",typoPrefixElementSelector:"#proofreader_typo_prefix",typoSuffixElementSelector:"#proofreader_typo_suffix",highlightClass:"proofreader_highlight",messageErrorClass:"proofreader_message_error",overlayClass:"proofreader_overlay",popupClass:"proofreader_popup",popupCloseClass:"proofreader_popup_close",popupMessageClass:"proofreader_popup_message",popupMessageErrorClass:"proofreader_popup_message_error",popupMessageSuccessClass:"proofreader_popup_message_success",popupDelay:4e3,floatingButtonClass:"proofreader_mouse",floatingButtonOffset:15,floatingButtonDelay:2e3,highlightTypos:!1,selectionMaxLength:100,showWordsBefore:10,showWordsAfter:10,handlerType:"keyboard"},t),s=e.extend({reportTypo:"Report a typo",thankYou:"Thank you for reporting the typo!",browserIsNotSupported:"Your browser does not support selection handling.",selectionIsTooLarge:"You have selected too large text block!"},o);return r.init=function(){r.clearSelectionObject(),n.find("form").length&&(n.show(),r.initForm()),("keyboard"===i.handlerType||"both"===i.handlerType)&&r.addKeyboardEvents(),("mouse"===i.handlerType||"both"===i.handlerType)&&r.addSelectionEvents(),r.wrapPopup(n,r.hideProofreader),r.createMessagePopup()},r.initForm=function(){r.$form=n.find("form").first(),r.$form.length&&(r.$form.on("click",function(e){return r.isSubmitButtonClick(e)}).on("submit",function(e){return r.submitForm(),!1}),r.$messagesContainer=e(i.messagesContainerSelector),r.$typoContainer=e(i.typoContainerSelector),r.$typoTextElement=e(i.typoTextElementSelector),r.$typoPrefixElement=e(i.typoPrefixElementSelector),r.$typoSuffixElement=e(i.typoSuffixElementSelector),r.$submitButton=r.$form.find('button[type="submit"],input[type="submit"]').first(),r.initialized=!0)},r.loadForm=function(t){var o=i.loadFormUrl,n={page_url:window.location.href,page_title:e(document).find("title").text()};e.ajax({type:"GET",url:o,dataType:"json",data:n,success:function(e){r.isValidFormResponse(e.form)?(r.replaceForm(e.form),r.injectScripts(e.scripts,e.script).done(function(){void 0!==t&&t()})):r.hideProofreader()},error:function(){r.hideProofreader()}})},r.addKeyboardEvents=function(){var t=!1;e(document).keyup(function(e){17===e.which&&(t=!1)}).keydown(function(e){return 27===e.which?(n.is(":visible")?r.hideProofreader():r.$messagePopup.is(":visible")&&r.resetMessagePopup(),!1):(17===e.which&&(t=!0),t!==!0||13!==e.which||n.is(":visible")?void 0:(r.removeFloatingButton(),r.refreshSelectionObject(),r.showProofreader(),!1))})},r.addSelectionEvents=function(){e("body").on("mouseup",function(e){r.isSubmitButtonClick(e)||(r.removeFloatingButton(),r.refreshSelectionObject(),r.canShowProofreader()&&r.createFloatingButton(e))})},r.injectScript=function(t){e("head").append(e("<script>",{type:"text/javascript",text:t}))},r.injectScripts=function(t,o){var n=[],i=e.Deferred();return t?(e.each(t,function(t,o){-1!==e.inArray(o,r.scripts)||e('script[src="'+o+'"]').length||n.push(e.ajax({url:o,dataType:"script",success:function(){r.scripts.push(o)}}))}),o&&""!==o?n.length?e.when.apply(e,n).done(function(){r.injectScript(o),i.resolve()}):(r.injectScript(o),i.resolve()):i.resolve()):i.resolve(),i.promise()},r.canShowProofreader=function(){return!(""===r.selectionObject.text||n.is(":visible")||r.$messagePopup.is(":visible"))},r.showProofreader=function(){if(r.canShowProofreader()){if(r.selectionObject.text.length>i.selectionMaxLength)return void r.showMessage(s.selectionIsTooLarge,i.popupMessageErrorClass);if(r.initialized)r.showForm();else{if(!i.loadFormUrl)return;r.loadForm(r.showForm)}n.parent().show()}},r.hideProofreader=function(){r.clearSelectionObject(),n.parent().hide()},r.showForm=function(){r.initialized&&(r.$form.trigger("reset"),r.removeFormMessages(),r.renderFormTypoContainer(),r.updateFormHiddenFields(),r.$submitButton.length&&r.$submitButton.removeAttr("disabled"))},r.submitForm=function(){var t=r.$form.serialize(),o=r.selectionObject.text,n=e(r.selectionObject.node);r.removeFormMessages(),r.$submitButton.attr("disabled","disabled"),e.ajax({type:"POST",url:r.$form.attr("action"),dataType:"json",data:t,success:function(e){e.error?(r.$submitButton.removeAttr("disabled"),r.renderFormMessages(e.messages)):(r.hideProofreader(),r.isValidFormResponse(e.form)&&(r.replaceForm(e.form),r.injectScripts(e.scripts,e.script)),i.highlightTypos&&r.highlightTypo(n,o),r.showMessage(s.thankYou,i.popupMessageSuccessClass))},error:function(){r.hideProofreader()}})},r.replaceForm=function(t){n.find("form").remove().end().show().append(t),r.initForm(),e.each(r.$form.find("label"),function(t,o){e(o).removeAttr("title")}),r.$form.find("button").focus()},r.isSubmitButtonClick=function(t){return"submit"===e(t.target).attr("type")},r.wrapPopup=function(t,o){var n=e("<div>",{"class":i.overlayClass}).on("click",function(t){return r.isSubmitButtonClick(t)||(e(this).hide(),o()),!0}),s=e("<div>",{"class":i.popupCloseClass}).on("click",o);t.wrap(n).prepend(s)},r.createMessagePopup=function(){if(void 0===r.$messagePopup){var t=e("<div>",{"class":i.popupMessageClass});r.$messagePopup=e("<div>",{"class":i.popupClass}).on("click",function(){return!1}).append(t).appendTo(e("body"))}r.wrapPopup(r.$messagePopup,r.resetMessagePopup)},r.resetMessagePopup=function(){clearInterval(r.messagePopupTimer),r.$messagePopup.parent().hide().find("."+i.popupMessageClass).attr("class",i.popupMessageClass).html("")},r.createFloatingButton=function(t){var o=r.getMousePosition(t);r.$floatingButton=e("<div>",{text:s.reportTypo,"class":i.floatingButtonClass}).css({position:"absolute",top:o.y+i.floatingButtonOffset+"px",left:o.x+i.floatingButtonOffset+"px"}).on("mouseup",function(t){return r.showProofreader(),e(this).remove(),!1}).appendTo(e("body")),r.floatingButtonTimer=setTimeout(function(){void 0!==r.$floatingButton&&r.$floatingButton.remove()},i.floatingButtonDelay)},r.removeFloatingButton=function(){void 0!==r.floatingButtonTimer&&clearInterval(r.floatingButtonTimer),void 0!==r.$floatingButton&&r.$floatingButton.remove()},r.updateFormHiddenFields=function(){r.$typoTextElement.length&&r.$typoTextElement.val(r.selectionObject.text),r.$typoPrefixElement.length&&r.$typoPrefixElement.val(r.selectionObject.prefix),r.$typoSuffixElement.length&&r.$typoSuffixElement.val(r.selectionObject.suffix)},r.renderFormTypoContainer=function(){r.initialized&&r.$typoContainer.length&&(r.$typoContainer.html(""),""!==r.selectionObject.prefix&&r.$typoContainer.append(e("<span>",{text:r.selectionObject.prefix})),r.$typoContainer.append(e("<span>",{text:r.selectionObject.text,"class":i.highlightClass})),""!==r.selectionObject.suffix&&r.$typoContainer.append(e("<span>",{text:r.selectionObject.suffix})))},r.renderFormMessages=function(t){r.initialized&&r.$messagesContainer.length&&(r.removeFormMessages(),e.each(t,function(t,o){r.$messagesContainer.append(e("<div>",{text:o,"class":i.messageErrorClass}))}))},r.removeFormMessages=function(){r.initialized&&r.$messagesContainer.length&&r.$messagesContainer.html("")},r.highlightTypo=function(t,o){var n,r,s="",a="";""!==o&&t.length&&"body"!==t.prop("tagName").toLowerCase()&&(n=o.split(" "),e.each(n,function(e,t){s=s+"(<[^>]+>)?(\\s)?("+t.replace(/([-.*+?^${}()|[\]\/\\])/g,"\\$1")+")(\\s)?",a=a+"$"+(4*e+1)+"$"+(4*e+2)+'<span class="'+i.highlightClass+'">$'+(4*e+3)+"</span>$"+(4*e+4)}),r=t.html().replace(new RegExp(s,"g"),a),""!==r&&t.html(r))},r.showMessage=function(e,t){r.resetMessagePopup(),r.removeFloatingButton(),r.$messagePopup.parent().show().find("."+i.popupClass).addClass(t).find("."+i.popupMessageClass).text(e),r.messagePopupTimer=setTimeout(function(){r.resetMessagePopup()},i.popupDelay)},r.createSelectionObject=function(e,t,o,n){return{text:e,prefix:t,suffix:o,node:n}},r.clearSelectionObject=function(){r.selectionObject=r.createSelectionObject("","","")},r.refreshSelectionObject=function(){window.getSelection?r.selectionObject=r.getWebKitSelection():document.getSelection?r.selectionObject=r.getGeckoSelection():document.selection?r.selectionObject=r.getTridentSelection():(r.clearSelectionObject(),r.showMessage(s.browserIsNotSupported,i.popupMessageErrorClass))},r.getRangeText=function(t){for(var o,n,r=t.cloneContents(),i=document.createElement("div");r.firstChild;)i.appendChild(r.firstChild);for(o=e(i).find("script,style,form"),n=o.length;n--;)o[n].parentNode.removeChild(o[n]);for(;i.firstChild;)r.appendChild(i.firstChild);return r.textContent},r.getSelectionContainer=function(e){for(;e;){if(1===e.nodeType)return e;e=e.parentNode}},r.getWebKitSelection=function(){var e,t,o,n,s=window.getSelection(),a="",c="",l="";return s&&s.rangeCount>0&&(a=s.toString(),t=s.getRangeAt(0),e=r.getSelectionContainer(t.commonAncestorContainer),o=t.cloneRange(),o.setStartBefore(t.startContainer.ownerDocument.body),o.setEnd(t.startContainer,t.startOffset),c=r.truncateText(r.getRangeText(o),-i.showWordsBefore),n=t.cloneRange(),n.setStart(t.endContainer,t.endOffset),n.setEndAfter(t.endContainer.ownerDocument.body),l=r.truncateText(r.getRangeText(n),i.showWordsAfter)),r.createSelectionObject(a,c,l,e)},r.getGeckoSelection=function(){var e=document.getSelection().toString();return r.createSelectionObject(e,"","")},r.getTridentSelection=function(){var e=document.selection,t=e.createRange,o=t.text,n=r.getSelectionContainer(t.parentElement()),s=e.createRange(),a=e.createRange();return s.moveStart("word",-i.showWordsBefore),s.moveEnd("character",-o.length),a.moveStart("character",o.length),a.moveEnd("word",i.showWordsAfter),r.createSelectionObject(o,s.text,a.text,n)},r.getMousePosition=function(e){var t={x:0,y:0};return e&&(e.pageX||e.pageY?(t.x=e.pageX,t.y=e.pageY):(e.clientX||e.clientY)&&(t.x=e.clientX+document.body.scrollLeft+document.documentElement.scrollLeft,t.y=e.clientY+document.body.scrollTop+document.documentElement.scrollTop)),t},r.truncateText=function(e,t){var o=e.replace(/(\r|\n|\t)+/g," ").replace(/(\s)+/g," ").split(" ").filter(Boolean),n=Math.min(o.length,Math.abs(t)),r="";return r=t>0?(e.match(/^\s/g)?" ":"")+o.slice(0,n).join(" "):o.slice(o.length-n).join(" ")+(e.match(/\s$/g)?" ":"")},r.isValidFormResponse=function(t){return t&&e("<div>"+t+"</div>").find("form").length>0},r.init(),n}}(jQuery);