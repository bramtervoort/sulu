define(["services/sulucontact/contact-manager","services/sulucontact/contact-router"],function(a,b){"use strict";var c={datagridInstanceName:"contacts",listViewStorageKey:"contactListView"},d=function(){this.sandbox.on("sulu.toolbar.delete",function(){this.sandbox.emit("husky.datagrid."+c.datagridInstanceName+".items.get-selected",e.bind(this))},this),this.sandbox.on("sulu.contacts.contact.deleted",function(a){this.sandbox.emit("husky.datagrid."+c.datagridInstanceName+".record.remove",a)},this),this.sandbox.on("sulu.toolbar.add",function(){b.toAdd()},this),this.sandbox.on("husky.datagrid."+c.datagridInstanceName+".number.selections",function(a){var b=a>0?"enable":"disable";this.sandbox.emit("sulu.header.toolbar.item."+b,"deleteSelected",!1)},this),this.sandbox.on("sulu.toolbar.change.table",function(){this.sandbox.emit("husky.datagrid."+c.datagridInstanceName+".view.change","table"),this.sandbox.sulu.saveUserSetting(c.listViewStorageKey,"table")}.bind(this)),this.sandbox.on("sulu.toolbar.change.cards",function(){this.sandbox.emit("husky.datagrid."+c.datagridInstanceName+".view.change","decorators/cards"),this.sandbox.sulu.saveUserSetting(c.listViewStorageKey,"decorators/cards")}.bind(this))},e=function(b){this.sandbox.sulu.showDeleteDialog(function(c){c&&a["delete"](b)}.bind(this))},f=function(a){b.toEdit(a)};return{layout:{content:{width:"max"}},header:{noBack:!0,title:"contact.contacts.title",toolbar:{buttons:{add:{},deleteSelected:{}}}},templates:["/admin/contact/template/contact/list"],initialize:function(){this.render(),d.call(this)},getListToolbarConfig:function(){return{el:this.$find("#list-toolbar-container"),instanceName:"contacts",template:this.sandbox.sulu.buttons.get({contactDecoratorDropdown:{},settings:{options:{dropdownItems:[{type:"columnOptions"}]}}})}},getDatagridConfig:function(){return{el:this.sandbox.dom.find("#people-list",this.$el),url:"/admin/api/contacts?flat=true",searchInstanceName:"contacts",searchFields:["fullName"],resultKey:"contacts",instanceName:c.datagridInstanceName,actionCallback:f.bind(this),view:this.sandbox.sulu.getUserSetting(c.listViewStorageKey)||"decorators/cards",viewOptions:{table:{actionIconColumn:"firstName"},"decorators/cards":{fields:{picture:"avatar",title:["firstName","lastName"]},icons:{picture:"fa-user"}}}}},render:function(){this.sandbox.dom.html(this.$el,this.renderTemplate("/admin/contact/template/contact/list")),this.sandbox.sulu.initListToolbarAndList.call(this,"contacts","/admin/api/contacts/fields",this.getListToolbarConfig(),this.getDatagridConfig(),"contacts","#people-list-info")}}});