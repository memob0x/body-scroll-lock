"use strict";var $html=document.documentElement,$console=document.querySelector("#console"),log=function(){for(var o,e=arguments.length,l=new Array(e),t=0;t<e;t++)l[t]=arguments[t];console.log&&(o=console).log.apply(o,l),$console.hasChildNodes()||$console.appendChild(document.createElement("ol"));var n=$console.querySelector("ol"),c=document.createElement("li");c.innerHTML=l,n.appendChild(c),$console.scrollTop=n.offsetHeight};document.querySelector(".toggle-scroll-lock").addEventListener("click",function(){return bodyScroll.toggle()}),document.querySelector("button.toggle-custom-scrollbar").addEventListener("click",function(){log("toggling custom scrollbars"),$html.classList.toggle("custom-scrollbar")}),document.querySelector("button.toggle-horizontal-orientation").addEventListener("click",function(){log("toggling page orientation"),$html.classList.toggle("horizontal")}),window.addEventListener("bodyScrollLock",function(){return log("body scroll locked")}),window.addEventListener("bodyScrollUnlock",function(){return log("body scroll unlocked")});
//# sourceMappingURL=scripts.js.map
