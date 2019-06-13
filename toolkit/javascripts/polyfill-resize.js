/*
DragResize v1.0@74147644ad1f26597f1c8d1c42a065f57d9b2e8b
(c) 2005-2013 Angus Turnbull, TwinHelix Designs http://www.twinhelix.com
Licensed under the GNU LGPL, version 3 or later:
https://www.gnu.org/copyleft/lesser.html
This is distributed WITHOUT ANY WARRANTY; without even the implied
warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
*/
if(typeof addEvent!='function'){var addEvent=function(o,t,f,l){var d='addEventListener',n='on'+t,rO=o,rT=t,rF=f,rL=l;if(o[d]&&!l)return o[d](t,f,false);if(!o._evts)o._evts={};if(!o._evts[t]){o._evts[t]=o[n]?{b:o[n]}:{};o[n]=new Function('e','var r=true,o=this,a=o._evts["'+t+'"],i;for(i in a){o._f=a[i];r=o._f(e||window.event)!=false&&r;o._f=null}return r');if(t!='unload')addEvent(window,'unload',function(){removeEvent(rO,rT,rF,rL)})}if(!f._i)f._i=addEvent._i++;o._evts[t][f._i]=f};addEvent._i=1;var removeEvent=function(o,t,f,l){var d='removeEventListener';if(o[d]&&!l)return o[d](t,f,false);if(o._evts&&o._evts[t]&&f._i)delete o._evts[t][f._i]}}function cancelEvent(e,c){e.returnValue=false;if(e.preventDefault)e.preventDefault();if(c){e.cancelBubble=true;if(e.stopPropagation)e.stopPropagation()}};function DragResize(myName,config){var props={myName:myName,enabled:true,handles:['tl','tm','tr','ml','mr','bl','bm','br'],isElement:null,isHandle:null,element:null,handle:null,minWidth:10,minHeight:10,minLeft:0,maxLeft:9999,minTop:0,maxTop:9999,gridX:1,gridY:1,zIndex:1,mouseX:0,mouseY:0,lastMouseX:0,lastMouseY:0,mOffX:0,mOffY:0,elmX:0,elmY:0,elmW:0,elmH:0,allowBlur:true,ondragfocus:null,ondragstart:null,ondragmove:null,ondragend:null,ondragblur:null};for(var p in props)this[p]=(typeof config[p]=='undefined')?props[p]:config[p]};DragResize.prototype.apply=function(node){var obj=this;addEvent(node,'mousedown',function(e){obj.mouseDown(e)});addEvent(node,'mousemove',function(e){obj.mouseMove(e)});addEvent(node,'mouseup',function(e){obj.mouseUp(e)});addEvent(node,'touchstart',function(e){obj.mouseDown(e)});addEvent(node,'touchmove',function(e){obj.mouseMove(e)});addEvent(node,'touchend',function(e){obj.mouseUp(e)})};DragResize.prototype.select=function(newElement){with(this){if(!document.getElementById||!enabled)return;if(newElement&&(newElement!=element)&&enabled){element=newElement;element.style.zIndex=++zIndex;if(this.resizeHandleSet)this.resizeHandleSet(element,true);var eCS=element.currentStyle||window.getComputedStyle(element,null);if(eCS.right){element.style.left=element.offsetLeft+'px';element.style.right=''}if(eCS.bottom){element.style.top=element.offsetTop+'px';element.style.bottom=''}elmX=parseInt(element.style.left);elmY=parseInt(element.style.top);elmW=element.clientWidth||element.offsetWidth;elmH=element.clientHeight||element.offsetHeight;if(ondragfocus)this.ondragfocus()}}};DragResize.prototype.deselect=function(delHandles){with(this){if(!document.getElementById||!enabled)return;if(delHandles){if(ondragblur)this.ondragblur();if(this.resizeHandleSet)this.resizeHandleSet(element,false);element=null}handle=null;mOffX=0;mOffY=0}};DragResize.prototype.mouseDown=function(e){with(this){if(!document.getElementById||!enabled)return true;if(e.touches&&e.touches.length)this.mouseMove(e);var elm=e.target||e.srcElement,newElement=null,newHandle=null,hRE=new RegExp(myName+'-([trmbl]{2})','');while(elm){if(elm.className){if(!newHandle&&(hRE.test(elm.className)||isHandle(elm)))newHandle=elm;if(isElement(elm)){newElement=elm;break}} elm=elm.parentNode}if(element&&(element!=newElement)&&allowBlur)deselect(true);if(newElement&&(!element||(newElement==element))){if(newHandle)cancelEvent(e);select(newElement,newHandle);handle=newHandle;if(handle&&ondragstart)this.ondragstart(hRE.test(handle.className))}}};DragResize.prototype.mouseMove=function(e){with(this){if(!document.getElementById||!enabled)return true;var mt=(e.touches&&e.touches.length)?e.touches[0]:e;mouseX=mt.pageX||mt.clientX+document.documentElement.scrollLeft;mouseY=mt.pageY||mt.clientY+document.documentElement.scrollTop;var diffX=mouseX-lastMouseX+mOffX;var diffY=mouseY-lastMouseY+mOffY;mOffX=mOffY=0;lastMouseX=mouseX;lastMouseY=mouseY;if(!handle)return true;var isResize=false;if(this.resizeHandleDrag&&this.resizeHandleDrag(diffX,diffY)){isResize=true}else{var dX=diffX,dY=diffY;if(elmX+dX<minLeft)mOffX=(dX-(diffX=minLeft-elmX));else if(elmX+elmW+dX>maxLeft)mOffX=(dX-(diffX=maxLeft-elmX-elmW));if(elmY+dY<minTop)mOffY=(dY-(diffY=minTop-elmY));else if(elmY+elmH+dY>maxTop)mOffY=(dY-(diffY=maxTop-elmY-elmH));elmX+=diffX;elmY+=diffY}element.style.left=(Math.round(elmX/gridX)*gridX)+'px';element.style.top=(Math.round(elmY/gridY)*gridY)+'px';if(isResize){element.style.width=(Math.round(elmW/gridX)*gridX)+'px';element.style.height=(Math.round(elmH/gridY)*gridY)+'px'}if(window.opera&&document.documentElement){var oDF=document.getElementById('op-drag-fix');if(!oDF){var oDF=document.createElement('input');oDF.id='op-drag-fix';oDF.style.display='none';document.body.appendChild(oDF)}oDF.focus()}if(ondragmove)this.ondragmove(isResize);cancelEvent(e)}};DragResize.prototype.mouseUp=function(e){with(this){if(!document.getElementById||!enabled)return;var hRE=new RegExp(myName+'-([trmbl]{2})','');if(handle&&ondragend)this.ondragend(hRE.test(handle.className));deselect(false)}};DragResize.prototype.resizeHandleSet=function(elm,show){with(this){if(!elm._handle_tr){for(var h=0;h<handles.length;h++){var hDiv=document.createElement('div');hDiv.className=myName+' '+myName+'-'+handles[h];elm['_handle_'+handles[h]]=elm.appendChild(hDiv)}} for(var h=0;h<handles.length;h++){elm['_handle_'+handles[h]].style.visibility=show?'inherit':'hidden'}}};DragResize.prototype.resizeHandleDrag=function(diffX,diffY){with(this){var hClass=handle&&handle.className&&handle.className.match(new RegExp(myName+'-([tmblr]{2})'))?RegExp.$1:'';var dY=diffY,dX=diffX,processed=false;if(hClass.indexOf('t')>=0){if(elmH-dY<minHeight)mOffY=(dY-(diffY=elmH-minHeight));else if(elmY+dY<minTop)mOffY=(dY-(diffY=minTop-elmY));elmY+=diffY;elmH-=diffY;processed=true}if(hClass.indexOf('b')>=0){if(elmH+dY<minHeight)mOffY=(dY-(diffY=minHeight-elmH));else if(elmY+elmH+dY>maxTop)mOffY=(dY-(diffY=maxTop-elmY-elmH));elmH+=diffY;processed=true}if(hClass.indexOf('l')>=0){if(elmW-dX<minWidth)mOffX=(dX-(diffX=elmW-minWidth));else if(elmX+dX<minLeft)mOffX=(dX-(diffX=minLeft-elmX));elmX+=diffX;elmW-=diffX;processed=true}if(hClass.indexOf('r')>=0){if(elmW+dX<minWidth)mOffX=(dX-(diffX=minWidth-elmW));else if(elmX+elmW+dX>maxLeft)mOffX=(dX-(diffX=maxLeft-elmX-elmW));elmW+=diffX;processed=true}return processed}};

/*
Calls the above class on each textarea element on the page if resize is not natively supported
Attaches css classes to parentdiv of textarea to provide resize functionality.

A rework of https://github.com/CezaryDanielNowak/css-resize-polyfill by Cezary Daniel Nowak
*/


(function() {
  var resizeSupported = document.createElement('textarea').style.resize !== undefined;

  var resizeHandlerPolyfill = function(idx, target, force) {
      // Attach required classes to **parent div** of textarea element.
      if (resizeSupported && !force) {
        // We don't need to polyfill if resize is supported
        return;
      }


      var textareaElement = target;
      var textareaElementParentDiv = target.parentNode;

      textareaElementParentDiv.className += ' resize-polyfill-wrapper';

      var isElementFunc = function(elm) {return elm === textareaElementParentDiv};
      var isHandleFunc = function(elm) {return false};

      var dragresize = new DragResize('resize-polyfill', {
        handles: ['br'],
        isElement: isElementFunc,
        isHandle: isHandleFunc,
        minWidth: 50,
        minHeight: 50,
        allowBlur: false,
        ondragfocus: false,
        ondragstart: false,
        ondragmove: false,
        ondragend: false,
        ondragblur: false
      });

      textareaElementParentDiv.style.width = textareaElement.offsetWidth + 'px';
      textareaElementParentDiv.style.height = textareaElement.offsetHeight + 'px';
      textareaElement.style.resize = 'none';

      dragresize.apply(document);
      dragresize.select(textareaElementParentDiv); // required to show handler on bottom-right
      textareaElementParentDiv.className += ' resize-polyfill-polyfilled';
  };

  // On load apply resizeHandlerPolyfill to each 'textarea' element on page
  this.GOVUK = this.GOVUK || {};
  this.GOVUK.GDM = this.GOVUK.GDM || {};
  GOVUK.GDM.resizePolyfill = function() {
    $('textarea').each(resizeHandlerPolyfill);
  };

  // Attach required styles to stylesheet
  if (typeof window !== 'undefined') {
    var head = document.head || document.getElementsByTagName('head')[0],
        style = document.createElement('style'),
        css = '.resize-polyfill-wrapper {position: relative;top: auto !important;left: auto !important;} ' +
          '.resize-polyfill-polyfilled textarea {width: 100%;height: 100%;} ' +
          '.resize-polyfill-br {background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAYAAADED76LAAAALUlEQVR42mNgwAH279//H4QZyFYAAv///5fBqQurCQQVEHQMVjaMAQQc2BQAABXMU79BvB5bAAAAAElFTkSuQmCC") no-repeat center center;border: 2px solid transparent;bottom: 0px;cursor: se-resize;height: 8px;position: absolute;right: 0px;width: 8px;}';

    if (style.styleSheet){
      style.styleSheet.cssText = css;
    } else {
      style.appendChild(document.createTextNode(css));
    }
    head.appendChild(style);
  }

})();

