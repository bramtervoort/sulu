require.config({paths:{sulucontent:"../../sulucontent/js",sulucontentcss:"../../sulucontent/css","type/resourceLocator":"../../sulucontent/js/validation/types/resourceLocator","type/textEditor":"../../sulucontent/js/validation/types/textEditor","type/smartContent":"../../sulucontent/js/validation/types/smartContent","type/internalLinks":"../../sulucontent/js/validation/types/internalLinks","type/singleInternalLink":"../../sulucontent/js/validation/types/singleInternalLink","type/block":"../../sulucontent/js/validation/types/block","extensions/sulu-buttons-contentbundle":"../../sulucontent/js/extensions/sulu-buttons"}}),define(["config","extensions/sulu-buttons-contentbundle","css!sulucontentcss/main"],function(a,b){return{name:"Sulu Content Bundle",initialize:function(c){"use strict";function d(){return e.sulu.getUserSetting("contentLanguage")||Object.keys(a.get("sulu-content").locales)[0]}var e=c.sandbox;e.sulu.buttons.push(b.getButtons()),e.sulu.buttons.dropdownItems.push(b.getDropdownItems()),c.components.addSource("sulucontent","/bundles/sulucontent/js/components"),a.set("sulusearch.page.options",{image:!1}),e.urlManager.setUrl("page",function(a){return"content/contents/<%= webspace %>/<%= locale %>/edit:<%= id %>/content"},function(a){return{id:a.id,webspace:a.properties.webspace_key,url:a.url,locale:a.locale}},function(a){return 0===a.indexOf("page_")?"page":void 0}),e.mvc.routes.push({route:"content/contents/:webspace",callback:function(a){var b=d();e.emit("sulu.router.navigate","content/contents/"+a+"/"+b)}}),e.mvc.routes.push({route:"content/contents/:webspace/:language",callback:function(a,b){return'<div data-aura-component="content@sulucontent" data-aura-webspace="'+a+'" data-aura-language="'+b+'" data-aura-display="column" data-aura-preview="false"/>'}}),e.mvc.routes.push({route:"content/contents/:webspace/:language/add::id/:content",callback:function(a,b,c,d){return'<div data-aura-component="content@sulucontent" data-aura-webspace="'+a+'" data-aura-language="'+b+'" data-aura-content="'+d+'" data-aura-parent="'+c+'"/>'}}),e.mvc.routes.push({route:"content/contents/:webspace/:language/add/:content",callback:function(a,b,c){return'<div data-aura-component="content@sulucontent" data-aura-webspace="'+a+'" data-aura-language="'+b+'" data-aura-content="'+c+'"/>'}}),e.mvc.routes.push({route:"content/contents/:webspace/edit::id/:content",callback:function(a,b,c){var f=d();e.emit("sulu.router.navigate","content/contents/"+a+"/"+f+"/edit:"+b+"/"+c)}}),e.mvc.routes.push({route:"content/contents/:webspace/:language/edit::id/:content",callback:function(a,b,c,d){return'<div data-aura-component="content@sulucontent" data-aura-webspace="'+a+'" data-aura-language="'+b+'" data-aura-content="'+d+'" data-aura-id="'+c+'" data-aura-preview="true"/>'}})}}});