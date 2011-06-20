/*
* Aloha Editor
* Author & Copyright (c) 2010 Gentics Software GmbH
* aloha-sales@gentics.com
* Licensed unter the terms of http://www.aloha-editor.com/license.html
*/
GENTICS.Aloha.CropNResize=new GENTICS.Aloha.Plugin("com.gentics.aloha.plugins.CropNResize");GENTICS.Aloha.CropNResize.languages=["en","de","fr"];GENTICS.Aloha.CropNResize.obj=null;GENTICS.Aloha.CropNResize.jcAPI=null;GENTICS.Aloha.CropNResize.restoreProps=[];GENTICS.Aloha.CropNResize.onResized=function(image){};GENTICS.Aloha.CropNResize.onCropped=function(image,props){};GENTICS.Aloha.CropNResize.onReset=function(image){return false};GENTICS.Aloha.CropNResize.cropButton=null;GENTICS.Aloha.CropNResize.interval=null;GENTICS.Aloha.CropNResize.attachedObjects=[];GENTICS.Aloha.CropNResize.init=function(){var that=this;if(!this.settings.load){this.settings.load=[]}if(this.settings.load.jqueryui!==false&&this.settings.load.jqueryui!=="false"){jQuery("head").append('<script type="text/javascript" src="'+GENTICS.Aloha.settings.base+'plugins/com.gentics.aloha.plugins.CropNResize/js/jquery-ui-1.8.7.custom.min.js"><\/script>')}if(this.settings.load.jqueryuicss!==false&&this.settings.load.jqueryuicss!=="false"){jQuery("head").append('<link rel="stylesheet" href="'+GENTICS.Aloha.settings.base+'plugins/com.gentics.aloha.plugins.CropNResize/css/ui-lightness/jquery-ui-1.8.7.custom.css" />')}if(this.settings.load.jcrop!==false&&this.settings.load.jcrop!=="false"){jQuery("head").append('<script type="text/javascript" src="'+GENTICS.Aloha.settings.base+'plugins/com.gentics.aloha.plugins.CropNResize/js/jquery.Jcrop.min.js"><\/script>')}if(this.settings.load.jcropcss!==false&&this.settings.load.jcropcss!=="false"){jQuery("head").append('<link rel="stylesheet" href="'+GENTICS.Aloha.settings.base+'plugins/com.gentics.aloha.plugins.CropNResize/css/jquery.Jcrop.css" />')}jQuery("head").append('<link rel="stylesheet" href="'+GENTICS.Aloha.settings.base+'plugins/com.gentics.aloha.plugins.CropNResize/css/cropnresize.css" />');GENTICS.Aloha.FloatingMenu.createScope("GENTICS.Aloha.image",["GENTICS.Aloha.global"]);if(typeof this.settings.onResized=="function"){this.onResized=this.settings.onResized}if(typeof this.settings.onCropped=="function"){this.onCropped=this.settings.onCropped}if(typeof this.settings.onReset=="function"){this.onReset=this.settings.onReset}if(typeof this.settings.aspectRatio!="boolean"){this.settings.aspectRatio=true}if(typeof this.settings.rootSelector!=="string"){this.settings.rootSelector=".GENTICS_editable"}if(typeof this.settings.selector!=="string"){this.settings.selector="img"}this.cropButton=new GENTICS.Aloha.ui.Button({size:"small",tooltip:this.i18n("Crop"),toggle:true,iconClass:"cnr_crop",onclick:function(btn,event){if(btn.pressed){that.crop()}else{that.endCrop()}}});GENTICS.Aloha.FloatingMenu.addButton("GENTICS.Aloha.image",this.cropButton,this.i18n("floatingmenu.tab.image"),20);GENTICS.Aloha.FloatingMenu.addButton("GENTICS.Aloha.image",new GENTICS.Aloha.ui.Button({size:"small",tooltip:this.i18n("Reset"),toggle:false,iconClass:"cnr_reset",onclick:function(btn,event){that.reset()}}),this.i18n("floatingmenu.tab.image"),30);GENTICS.Aloha.EventRegistry.subscribe(GENTICS.Aloha,"selectionChanged",function(event,rangeObject,originalEvent){if(!originalEvent||!originalEvent.target){return}if(!jQuery(originalEvent.target).hasClass("ui-resizable-handle")){that.endResize()}});GENTICS.Aloha.EventRegistry.subscribe(GENTICS.Aloha,"editableCreated",function(event,editable){that.attach()})};GENTICS.Aloha.CropNResize.attach=function(selector){if(typeof selector!="string"){selector=this.settings.selector}var that=this;var attachSelector=this.settings.rootSelector+" "+selector;jQuery(attachSelector).each(function(){if(!that.isAttached(this)){var o=jQuery(this);if(o.parent().hasClass("GENTICS_editicon")){return true}o.mouseup(function(e){that.focus(e);e.stopPropagation()})}});try{document.execCommand("enableObjectResizing",false,"false")}catch(e){}};GENTICS.Aloha.CropNResize.isAttached=function(domobj){for(var i=0;i<this.attachedObjects.length;i++){if(this.attachedObjects[i]===domobj){return true}}return false};GENTICS.Aloha.CropNResize.reset=function(){};GENTICS.Aloha.CropNResize.reset=function(){this.endCrop();this.endResize();if(this.onReset(this.obj)){return}for(var i=0;i<this.restoreProps.length;i++){if(this.obj.get(0)===this.restoreProps[i].obj){this.obj.attr("src",this.restoreProps[i].src);this.obj.width(this.restoreProps[i].width);this.obj.height(this.restoreProps[i].height);return}}};GENTICS.Aloha.CropNResize.initCropButtons=function(){jQuery("body").append('<div id="GENTICS_CropNResize_btns"><button class="cnr_crop_apply" title="'+this.i18n("Accept")+'" onclick="GENTICS.Aloha.CropNResize.acceptCrop();">&#10004;</button><button class="cnr_crop_cancel" title="'+this.i18n("Cancel")+'" onclick="GENTICS.Aloha.CropNResize.endCrop();">&#10006;</button></div>');var btns=jQuery("#GENTICS_CropNResize_btns");var oldLeft=0;var oldTop=0;this.interval=setInterval(function(){var jt=jQuery(".jcrop-tracker:first");var off=jt.offset();if(jt.css("height")!="0px"&&jt.css("width")!="0px"){btns.fadeIn("slow")}off.top=parseInt(off.top+jt.height()+3);off.left=parseInt(off.left+jt.width()-55);if(oldLeft!=off.left||oldTop!=off.top){btns.offset(off)}oldLeft=off.left;oldTop=off.top},10)};GENTICS.Aloha.CropNResize.destroyCropButtons=function(){jQuery("#GENTICS_CropNResize_btns").remove();clearInterval(this.interval)};GENTICS.Aloha.CropNResize.crop=function(){var that=this;this.endResize();this.initCropButtons();this.jcAPI=jQuery.Jcrop(this.obj,{onSelect:function(){setTimeout(function(){GENTICS.Aloha.FloatingMenu.setScope("GENTICS.Aloha.image")},10)}})};GENTICS.Aloha.CropNResize.endCrop=function(){if(this.jcAPI){this.jcAPI.destroy();this.jcAPI=null}this.destroyCropButtons();this.cropButton.extButton.toggle(false);this.resize()};GENTICS.Aloha.CropNResize.acceptCrop=function(){this.onCropped(this.obj,this.jcAPI.tellSelect());this.endCrop();this.resize()};GENTICS.Aloha.CropNResize.resize=function(){var that=this;this.obj.resizable({stop:function(event,ui){that.onResized(that.obj);setTimeout(function(){GENTICS.Aloha.FloatingMenu.setScope("GENTICS.Aloha.image");that.done(event)},10)},aspectRatio:that.settings.aspectRatio,maxHeight:that.settings.maxHeight,minHeight:that.settings.minHeight,maxWidth:that.settings.maxWidth,minWidth:that.settings.minWidth,grid:that.settings.grid});jQuery(".ui-wrapper").attr("contentEditable",false).bind("resizestart",function(e){e.preventDefault()})};GENTICS.Aloha.CropNResize.endResize=function(){if(this.obj){this.obj.resizable("destroy")}};GENTICS.Aloha.CropNResize.focus=function(e){GENTICS.Aloha.FloatingMenu.setScope("GENTICS.Aloha.image");this.obj=jQuery(e.target);this.restoreProps.push({obj:e.srcElement,src:this.obj.attr("src"),width:this.obj.width(),height:this.obj.height()});this.resize();this.updateFM()};GENTICS.Aloha.CropNResize.done=function(e){this.updateFM()};GENTICS.Aloha.CropNResize.updateFM=function(){var o=this.obj.offset();GENTICS.Aloha.FloatingMenu.floatTo({x:o.left,y:(o.top-100)})};