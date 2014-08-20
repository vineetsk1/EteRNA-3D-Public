
var Prototype={Version:'1.6.1',Browser:(function(){var ua=navigator.userAgent;var isOpera=Object.prototype.toString.call(window.opera)=='[object Opera]';return{IE:!!window.attachEvent&&!isOpera,Opera:isOpera,WebKit:ua.indexOf('AppleWebKit/')>-1,Gecko:ua.indexOf('Gecko')>-1&&ua.indexOf('KHTML')===-1,MobileSafari:/Apple.*Mobile.*Safari/.test(ua)}})(),BrowserFeatures:{XPath:!!document.evaluate,SelectorsAPI:!!document.querySelector,ElementExtensions:(function(){var constructor=window.Element||window.HTMLElement;return!!(constructor&&constructor.prototype);})(),SpecificElementExtensions:(function(){if(typeof window.HTMLDivElement!=='undefined')
return true;var div=document.createElement('div');var form=document.createElement('form');var isSupported=false;if(div['__proto__']&&(div['__proto__']!==form['__proto__'])){isSupported=true;}
div=form=null;return isSupported;})()},ScriptFragment:'<script[^>]*>([\\S\\s]*?)<\/script>',JSONFilter:/^\/\*-secure-([\s\S]*)\*\/\s*$/,emptyFunction:function(){},K:function(x){return x}};if(Prototype.Browser.MobileSafari)
Prototype.BrowserFeatures.SpecificElementExtensions=false;var Abstract={};var Try={these:function(){var returnValue;for(var i=0,length=arguments.length;i<length;i++){var lambda=arguments[i];try{returnValue=lambda();break;}catch(e){}}
return returnValue;}};var Class=(function(){function subclass(){};function create(){var parent=null,properties=$A(arguments);if(Object.isFunction(properties[0]))
parent=properties.shift();function klass(){this.initialize.apply(this,arguments);}
Object.extend(klass,Class.Methods);klass.superclass=parent;klass.subclasses=[];if(parent){subclass.prototype=parent.prototype;klass.prototype=new subclass;parent.subclasses.push(klass);}
for(var i=0;i<properties.length;i++)
klass.addMethods(properties[i]);if(!klass.prototype.initialize)
klass.prototype.initialize=Prototype.emptyFunction;klass.prototype.constructor=klass;return klass;}
function addMethods(source){var ancestor=this.superclass&&this.superclass.prototype;var properties=Object.keys(source);if(!Object.keys({toString:true}).length){if(source.toString!=Object.prototype.toString)
properties.push("toString");if(source.valueOf!=Object.prototype.valueOf)
properties.push("valueOf");}
for(var i=0,length=properties.length;i<length;i++){var property=properties[i],value=source[property];if(ancestor&&Object.isFunction(value)&&value.argumentNames().first()=="$super"){var method=value;value=(function(m){return function(){return ancestor[m].apply(this,arguments);};})(property).wrap(method);value.valueOf=method.valueOf.bind(method);value.toString=method.toString.bind(method);}
this.prototype[property]=value;}
return this;}
return{create:create,Methods:{addMethods:addMethods}};})();(function(){var _toString=Object.prototype.toString;function extend(destination,source){for(var property in source)
destination[property]=source[property];return destination;}
function inspect(object){try{if(isUndefined(object))return'undefined';if(object===null)return'null';return object.inspect?object.inspect():String(object);}catch(e){if(e instanceof RangeError)return'...';throw e;}}
function toJSON(object){var type=typeof object;switch(type){case'undefined':case'function':case'unknown':return;case'boolean':return object.toString();}
if(object===null)return'null';if(object.toJSON)return object.toJSON();if(isElement(object))return;var results=[];for(var property in object){var value=toJSON(object[property]);if(!isUndefined(value))
results.push(property.toJSON()+': '+value);}
return'{'+results.join(', ')+'}';}
function toQueryString(object){return $H(object).toQueryString();}
function toHTML(object){return object&&object.toHTML?object.toHTML():String.interpret(object);}
function keys(object){var results=[];for(var property in object)
results.push(property);return results;}
function values(object){var results=[];for(var property in object)
results.push(object[property]);return results;}
function clone(object){return extend({},object);}
function isElement(object){return!!(object&&object.nodeType==1);}
function isArray(object){return _toString.call(object)=="[object Array]";}
function isHash(object){return object instanceof Hash;}
function isFunction(object){return typeof object==="function";}
function isString(object){return _toString.call(object)=="[object String]";}
function isNumber(object){return _toString.call(object)=="[object Number]";}
function isUndefined(object){return typeof object==="undefined";}
extend(Object,{extend:extend,inspect:inspect,toJSON:toJSON,toQueryString:toQueryString,toHTML:toHTML,keys:keys,values:values,clone:clone,isElement:isElement,isArray:isArray,isHash:isHash,isFunction:isFunction,isString:isString,isNumber:isNumber,isUndefined:isUndefined});})();Object.extend(Function.prototype,(function(){var slice=Array.prototype.slice;function update(array,args){var arrayLength=array.length,length=args.length;while(length--)array[arrayLength+length]=args[length];return array;}
function merge(array,args){array=slice.call(array,0);return update(array,args);}
function argumentNames(){var names=this.toString().match(/^[\s\(]*function[^(]*\(([^)]*)\)/)[1].replace(/\/\/.*?[\r\n]|\/\*(?:.|[\r\n])*?\*\//g,'').replace(/\s+/g,'').split(',');return names.length==1&&!names[0]?[]:names;}
function bind(context){if(arguments.length<2&&Object.isUndefined(arguments[0]))return this;var __method=this,args=slice.call(arguments,1);return function(){var a=merge(args,arguments);return __method.apply(context,a);}}
function bindAsEventListener(context){var __method=this,args=slice.call(arguments,1);return function(event){var a=update([event||window.event],args);return __method.apply(context,a);}}
function curry(){if(!arguments.length)return this;var __method=this,args=slice.call(arguments,0);return function(){var a=merge(args,arguments);return __method.apply(this,a);}}
function delay(timeout){var __method=this,args=slice.call(arguments,1);timeout=timeout*1000
return window.setTimeout(function(){return __method.apply(__method,args);},timeout);}
function defer(){var args=update([0.01],arguments);return this.delay.apply(this,args);}
function wrap(wrapper){var __method=this;return function(){var a=update([__method.bind(this)],arguments);return wrapper.apply(this,a);}}
function methodize(){if(this._methodized)return this._methodized;var __method=this;return this._methodized=function(){var a=update([this],arguments);return __method.apply(null,a);};}
return{argumentNames:argumentNames,bind:bind,bindAsEventListener:bindAsEventListener,curry:curry,delay:delay,defer:defer,wrap:wrap,methodize:methodize}})());Date.prototype.toJSON=function(){return'"'+this.getUTCFullYear()+'-'+
(this.getUTCMonth()+1).toPaddedString(2)+'-'+
this.getUTCDate().toPaddedString(2)+'T'+
this.getUTCHours().toPaddedString(2)+':'+
this.getUTCMinutes().toPaddedString(2)+':'+
this.getUTCSeconds().toPaddedString(2)+'Z"';};RegExp.prototype.match=RegExp.prototype.test;RegExp.escape=function(str){return String(str).replace(/([.*+?^=!:${}()|[\]\/\\])/g,'\\$1');};var PeriodicalExecuter=Class.create({initialize:function(callback,frequency){this.callback=callback;this.frequency=frequency;this.currentlyExecuting=false;this.registerCallback();},registerCallback:function(){this.timer=setInterval(this.onTimerEvent.bind(this),this.frequency*1000);},execute:function(){this.callback(this);},stop:function(){if(!this.timer)return;clearInterval(this.timer);this.timer=null;},onTimerEvent:function(){if(!this.currentlyExecuting){try{this.currentlyExecuting=true;this.execute();this.currentlyExecuting=false;}catch(e){this.currentlyExecuting=false;throw e;}}}});Object.extend(String,{interpret:function(value){return value==null?'':String(value);},specialChar:{'\b':'\\b','\t':'\\t','\n':'\\n','\f':'\\f','\r':'\\r','\\':'\\\\'}});Object.extend(String.prototype,(function(){function prepareReplacement(replacement){if(Object.isFunction(replacement))return replacement;var template=new Template(replacement);return function(match){return template.evaluate(match)};}
function gsub(pattern,replacement){var result='',source=this,match;replacement=prepareReplacement(replacement);if(Object.isString(pattern))
pattern=RegExp.escape(pattern);if(!(pattern.length||pattern.source)){replacement=replacement('');return replacement+source.split('').join(replacement)+replacement;}
while(source.length>0){if(match=source.match(pattern)){result+=source.slice(0,match.index);result+=String.interpret(replacement(match));source=source.slice(match.index+match[0].length);}else{result+=source,source='';}}
return result;}
function sub(pattern,replacement,count){replacement=prepareReplacement(replacement);count=Object.isUndefined(count)?1:count;return this.gsub(pattern,function(match){if(--count<0)return match[0];return replacement(match);});}
function scan(pattern,iterator){this.gsub(pattern,iterator);return String(this);}
function truncate(length,truncation){length=length||30;truncation=Object.isUndefined(truncation)?'...':truncation;return this.length>length?this.slice(0,length-truncation.length)+truncation:String(this);}
function strip(){return this.replace(/^\s+/,'').replace(/\s+$/,'');}
function stripTags(){return this.replace(/<\w+(\s+("[^"]*"|'[^']*'|[^>])+)?>|<\/\w+>/gi,'');}
function stripScripts(){return this.replace(new RegExp(Prototype.ScriptFragment,'img'),'');}
function extractScripts(){var matchAll=new RegExp(Prototype.ScriptFragment,'img');var matchOne=new RegExp(Prototype.ScriptFragment,'im');return(this.match(matchAll)||[]).map(function(scriptTag){return(scriptTag.match(matchOne)||['',''])[1];});}
function evalScripts(){return this.extractScripts().map(function(script){return eval(script)});}
function escapeHTML(){return this.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}
function unescapeHTML(){return this.stripTags().replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&');}
function toQueryParams(separator){var match=this.strip().match(/([^?#]*)(#.*)?$/);if(!match)return{};return match[1].split(separator||'&').inject({},function(hash,pair){if((pair=pair.split('='))[0]){var key=decodeURIComponent(pair.shift());var value=pair.length>1?pair.join('='):pair[0];if(value!=undefined)value=decodeURIComponent(value);if(key in hash){if(!Object.isArray(hash[key]))hash[key]=[hash[key]];hash[key].push(value);}
else hash[key]=value;}
return hash;});}
function toArray(){return this.split('');}
function succ(){return this.slice(0,this.length-1)+
String.fromCharCode(this.charCodeAt(this.length-1)+1);}
function times(count){return count<1?'':new Array(count+1).join(this);}
function camelize(){var parts=this.split('-'),len=parts.length;if(len==1)return parts[0];var camelized=this.charAt(0)=='-'?parts[0].charAt(0).toUpperCase()+parts[0].substring(1):parts[0];for(var i=1;i<len;i++)
camelized+=parts[i].charAt(0).toUpperCase()+parts[i].substring(1);return camelized;}
function capitalize(){return this.charAt(0).toUpperCase()+this.substring(1).toLowerCase();}
function underscore(){return this.replace(/::/g,'/').replace(/([A-Z]+)([A-Z][a-z])/g,'$1_$2').replace(/([a-z\d])([A-Z])/g,'$1_$2').replace(/-/g,'_').toLowerCase();}
function dasherize(){return this.replace(/_/g,'-');}
function inspect(useDoubleQuotes){var escapedString=this.replace(/[\x00-\x1f\\]/g,function(character){if(character in String.specialChar){return String.specialChar[character];}
return'\\u00'+character.charCodeAt().toPaddedString(2,16);});if(useDoubleQuotes)return'"'+escapedString.replace(/"/g,'\\"')+'"';return"'"+escapedString.replace(/'/g,'\\\'')+"'";}
function toJSON(){return this.inspect(true);}
function unfilterJSON(filter){return this.replace(filter||Prototype.JSONFilter,'$1');}
function isJSON(){var str=this;if(str.blank())return false;str=this.replace(/\\./g,'@').replace(/"[^"\\\n\r]*"/g,'');return(/^[,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t]*$/).test(str);}
function evalJSON(sanitize){var json=this.unfilterJSON();try{if(!sanitize||json.isJSON())return eval('('+json+')');}catch(e){}
throw new SyntaxError('Badly formed JSON string: '+this.inspect());}
function include(pattern){return this.indexOf(pattern)>-1;}
function startsWith(pattern){return this.indexOf(pattern)===0;}
function endsWith(pattern){var d=this.length-pattern.length;return d>=0&&this.lastIndexOf(pattern)===d;}
function empty(){return this=='';}
function blank(){return/^\s*$/.test(this);}
function interpolate(object,pattern){return new Template(this,pattern).evaluate(object);}
return{gsub:gsub,sub:sub,scan:scan,truncate:truncate,strip:String.prototype.trim?String.prototype.trim:strip,stripTags:stripTags,stripScripts:stripScripts,extractScripts:extractScripts,evalScripts:evalScripts,escapeHTML:escapeHTML,unescapeHTML:unescapeHTML,toQueryParams:toQueryParams,parseQuery:toQueryParams,toArray:toArray,succ:succ,times:times,camelize:camelize,capitalize:capitalize,underscore:underscore,dasherize:dasherize,inspect:inspect,toJSON:toJSON,unfilterJSON:unfilterJSON,isJSON:isJSON,evalJSON:evalJSON,include:include,startsWith:startsWith,endsWith:endsWith,empty:empty,blank:blank,interpolate:interpolate};})());var Template=Class.create({initialize:function(template,pattern){this.template=template.toString();this.pattern=pattern||Template.Pattern;},evaluate:function(object){if(object&&Object.isFunction(object.toTemplateReplacements))
object=object.toTemplateReplacements();return this.template.gsub(this.pattern,function(match){if(object==null)return(match[1]+'');var before=match[1]||'';if(before=='\\')return match[2];var ctx=object,expr=match[3];var pattern=/^([^.[]+|\[((?:.*?[^\\])?)\])(\.|\[|$)/;match=pattern.exec(expr);if(match==null)return before;while(match!=null){var comp=match[1].startsWith('[')?match[2].replace(/\\\\]/g,']'):match[1];ctx=ctx[comp];if(null==ctx||''==match[3])break;expr=expr.substring('['==match[3]?match[1].length:match[0].length);match=pattern.exec(expr);}
return before+String.interpret(ctx);});}});Template.Pattern=/(^|.|\r|\n)(#\{(.*?)\})/;var $break={};var Enumerable=(function(){function each(iterator,context){var index=0;try{this._each(function(value){iterator.call(context,value,index++);});}catch(e){if(e!=$break)throw e;}
return this;}
function eachSlice(number,iterator,context){var index=-number,slices=[],array=this.toArray();if(number<1)return array;while((index+=number)<array.length)
slices.push(array.slice(index,index+number));return slices.collect(iterator,context);}
function all(iterator,context){iterator=iterator||Prototype.K;var result=true;this.each(function(value,index){result=result&&!!iterator.call(context,value,index);if(!result)throw $break;});return result;}
function any(iterator,context){iterator=iterator||Prototype.K;var result=false;this.each(function(value,index){if(result=!!iterator.call(context,value,index))
throw $break;});return result;}
function collect(iterator,context){iterator=iterator||Prototype.K;var results=[];this.each(function(value,index){results.push(iterator.call(context,value,index));});return results;}
function detect(iterator,context){var result;this.each(function(value,index){if(iterator.call(context,value,index)){result=value;throw $break;}});return result;}
function findAll(iterator,context){var results=[];this.each(function(value,index){if(iterator.call(context,value,index))
results.push(value);});return results;}
function grep(filter,iterator,context){iterator=iterator||Prototype.K;var results=[];if(Object.isString(filter))
filter=new RegExp(RegExp.escape(filter));this.each(function(value,index){if(filter.match(value))
results.push(iterator.call(context,value,index));});return results;}
function include(object){if(Object.isFunction(this.indexOf))
if(this.indexOf(object)!=-1)return true;var found=false;this.each(function(value){if(value==object){found=true;throw $break;}});return found;}
function inGroupsOf(number,fillWith){fillWith=Object.isUndefined(fillWith)?null:fillWith;return this.eachSlice(number,function(slice){while(slice.length<number)slice.push(fillWith);return slice;});}
function inject(memo,iterator,context){this.each(function(value,index){memo=iterator.call(context,memo,value,index);});return memo;}
function invoke(method){var args=$A(arguments).slice(1);return this.map(function(value){return value[method].apply(value,args);});}
function max(iterator,context){iterator=iterator||Prototype.K;var result;this.each(function(value,index){value=iterator.call(context,value,index);if(result==null||value>=result)
result=value;});return result;}
function min(iterator,context){iterator=iterator||Prototype.K;var result;this.each(function(value,index){value=iterator.call(context,value,index);if(result==null||value<result)
result=value;});return result;}
function partition(iterator,context){iterator=iterator||Prototype.K;var trues=[],falses=[];this.each(function(value,index){(iterator.call(context,value,index)?trues:falses).push(value);});return[trues,falses];}
function pluck(property){var results=[];this.each(function(value){results.push(value[property]);});return results;}
function reject(iterator,context){var results=[];this.each(function(value,index){if(!iterator.call(context,value,index))
results.push(value);});return results;}
function sortBy(iterator,context){return this.map(function(value,index){return{value:value,criteria:iterator.call(context,value,index)};}).sort(function(left,right){var a=left.criteria,b=right.criteria;return a<b?-1:a>b?1:0;}).pluck('value');}
function toArray(){return this.map();}
function zip(){var iterator=Prototype.K,args=$A(arguments);if(Object.isFunction(args.last()))
iterator=args.pop();var collections=[this].concat(args).map($A);return this.map(function(value,index){return iterator(collections.pluck(index));});}
function size(){return this.toArray().length;}
function inspect(){return'#<Enumerable:'+this.toArray().inspect()+'>';}
return{each:each,eachSlice:eachSlice,all:all,every:all,any:any,some:any,collect:collect,map:collect,detect:detect,findAll:findAll,select:findAll,filter:findAll,grep:grep,include:include,member:include,inGroupsOf:inGroupsOf,inject:inject,invoke:invoke,max:max,min:min,partition:partition,pluck:pluck,reject:reject,sortBy:sortBy,toArray:toArray,entries:toArray,zip:zip,size:size,inspect:inspect,find:detect};})();function $A(iterable){if(!iterable)return[];if('toArray'in Object(iterable))return iterable.toArray();var length=iterable.length||0,results=new Array(length);while(length--)results[length]=iterable[length];return results;}
function $w(string){if(!Object.isString(string))return[];string=string.strip();return string?string.split(/\s+/):[];}
Array.from=$A;(function(){var arrayProto=Array.prototype,slice=arrayProto.slice,_each=arrayProto.forEach;function each(iterator){for(var i=0,length=this.length;i<length;i++)
iterator(this[i]);}
if(!_each)_each=each;function clear(){this.length=0;return this;}
function first(){return this[0];}
function last(){return this[this.length-1];}
function compact(){return this.select(function(value){return value!=null;});}
function flatten(){return this.inject([],function(array,value){if(Object.isArray(value))
return array.concat(value.flatten());array.push(value);return array;});}
function without(){var values=slice.call(arguments,0);return this.select(function(value){return!values.include(value);});}
function reverse(inline){return(inline!==false?this:this.toArray())._reverse();}
function uniq(sorted){return this.inject([],function(array,value,index){if(0==index||(sorted?array.last()!=value:!array.include(value)))
array.push(value);return array;});}
function intersect(array){return this.uniq().findAll(function(item){return array.detect(function(value){return item===value});});}
function clone(){return slice.call(this,0);}
function size(){return this.length;}
function inspect(){return'['+this.map(Object.inspect).join(', ')+']';}
function toJSON(){var results=[];this.each(function(object){var value=Object.toJSON(object);if(!Object.isUndefined(value))results.push(value);});return'['+results.join(', ')+']';}
function indexOf(item,i){i||(i=0);var length=this.length;if(i<0)i=length+i;for(;i<length;i++)
if(this[i]===item)return i;return-1;}
function lastIndexOf(item,i){i=isNaN(i)?this.length:(i<0?this.length+i:i)+1;var n=this.slice(0,i).reverse().indexOf(item);return(n<0)?n:i-n-1;}
function concat(){var array=slice.call(this,0),item;for(var i=0,length=arguments.length;i<length;i++){item=arguments[i];if(Object.isArray(item)&&!('callee'in item)){for(var j=0,arrayLength=item.length;j<arrayLength;j++)
array.push(item[j]);}else{array.push(item);}}
return array;}
Object.extend(arrayProto,Enumerable);if(!arrayProto._reverse)
arrayProto._reverse=arrayProto.reverse;Object.extend(arrayProto,{_each:_each,clear:clear,first:first,last:last,compact:compact,flatten:flatten,without:without,reverse:reverse,uniq:uniq,intersect:intersect,clone:clone,toArray:clone,size:size,inspect:inspect,toJSON:toJSON});var CONCAT_ARGUMENTS_BUGGY=(function(){return[].concat(arguments)[0][0]!==1;})(1,2)
if(CONCAT_ARGUMENTS_BUGGY)arrayProto.concat=concat;if(!arrayProto.indexOf)arrayProto.indexOf=indexOf;if(!arrayProto.lastIndexOf)arrayProto.lastIndexOf=lastIndexOf;})();function $H(object){return new Hash(object);};var Hash=Class.create(Enumerable,(function(){function initialize(object){this._object=Object.isHash(object)?object.toObject():Object.clone(object);}
function _each(iterator){for(var key in this._object){var value=this._object[key],pair=[key,value];pair.key=key;pair.value=value;iterator(pair);}}
function set(key,value){return this._object[key]=value;}
function get(key){if(this._object[key]!==Object.prototype[key])
return this._object[key];}
function unset(key){var value=this._object[key];delete this._object[key];return value;}
function toObject(){return Object.clone(this._object);}
function keys(){return this.pluck('key');}
function values(){return this.pluck('value');}
function index(value){var match=this.detect(function(pair){return pair.value===value;});return match&&match.key;}
function merge(object){return this.clone().update(object);}
function update(object){return new Hash(object).inject(this,function(result,pair){result.set(pair.key,pair.value);return result;});}
function toQueryPair(key,value){if(Object.isUndefined(value))return key;return key+'='+encodeURIComponent(String.interpret(value));}
function toQueryString(){return this.inject([],function(results,pair){var key=encodeURIComponent(pair.key),values=pair.value;if(values&&typeof values=='object'){if(Object.isArray(values))
return results.concat(values.map(toQueryPair.curry(key)));}else results.push(toQueryPair(key,values));return results;}).join('&');}
function inspect(){return'#<Hash:{'+this.map(function(pair){return pair.map(Object.inspect).join(': ');}).join(', ')+'}>';}
function toJSON(){return Object.toJSON(this.toObject());}
function clone(){return new Hash(this);}
return{initialize:initialize,_each:_each,set:set,get:get,unset:unset,toObject:toObject,toTemplateReplacements:toObject,keys:keys,values:values,index:index,merge:merge,update:update,toQueryString:toQueryString,inspect:inspect,toJSON:toJSON,clone:clone};})());Hash.from=$H;Object.extend(Number.prototype,(function(){function toColorPart(){return this.toPaddedString(2,16);}
function succ(){return this+1;}
function times(iterator,context){$R(0,this,true).each(iterator,context);return this;}
function toPaddedString(length,radix){var string=this.toString(radix||10);return'0'.times(length-string.length)+string;}
function toJSON(){return isFinite(this)?this.toString():'null';}
function abs(){return Math.abs(this);}
function round(){return Math.round(this);}
function ceil(){return Math.ceil(this);}
function floor(){return Math.floor(this);}
return{toColorPart:toColorPart,succ:succ,times:times,toPaddedString:toPaddedString,toJSON:toJSON,abs:abs,round:round,ceil:ceil,floor:floor};})());function $R(start,end,exclusive){return new ObjectRange(start,end,exclusive);}
var ObjectRange=Class.create(Enumerable,(function(){function initialize(start,end,exclusive){this.start=start;this.end=end;this.exclusive=exclusive;}
function _each(iterator){var value=this.start;while(this.include(value)){iterator(value);value=value.succ();}}
function include(value){if(value<this.start)
return false;if(this.exclusive)
return value<this.end;return value<=this.end;}
return{initialize:initialize,_each:_each,include:include};})());var Ajax={getTransport:function(){return Try.these(function(){return new XMLHttpRequest()},function(){return new ActiveXObject('Msxml2.XMLHTTP')},function(){return new ActiveXObject('Microsoft.XMLHTTP')})||false;},activeRequestCount:0};Ajax.Responders={responders:[],_each:function(iterator){this.responders._each(iterator);},register:function(responder){if(!this.include(responder))
this.responders.push(responder);},unregister:function(responder){this.responders=this.responders.without(responder);},dispatch:function(callback,request,transport,json){this.each(function(responder){if(Object.isFunction(responder[callback])){try{responder[callback].apply(responder,[request,transport,json]);}catch(e){}}});}};Object.extend(Ajax.Responders,Enumerable);Ajax.Responders.register({onCreate:function(){Ajax.activeRequestCount++},onComplete:function(){Ajax.activeRequestCount--}});Ajax.Base=Class.create({initialize:function(options){this.options={method:'post',asynchronous:true,contentType:'application/x-www-form-urlencoded',encoding:'UTF-8',parameters:'',evalJSON:true,evalJS:true};Object.extend(this.options,options||{});this.options.method=this.options.method.toLowerCase();if(Object.isString(this.options.parameters))
this.options.parameters=this.options.parameters.toQueryParams();else if(Object.isHash(this.options.parameters))
this.options.parameters=this.options.parameters.toObject();}});Ajax.Request=Class.create(Ajax.Base,{_complete:false,initialize:function($super,url,options){$super(options);this.transport=Ajax.getTransport();this.request(url);},request:function(url){this.url=url;this.method=this.options.method;var params=Object.clone(this.options.parameters);if(!['get','post'].include(this.method)){params['_method']=this.method;this.method='post';}
this.parameters=params;if(params=Object.toQueryString(params)){if(this.method=='get')
this.url+=(this.url.include('?')?'&':'?')+params;else if(/Konqueror|Safari|KHTML/.test(navigator.userAgent))
params+='&_=';}
try{var response=new Ajax.Response(this);if(this.options.onCreate)this.options.onCreate(response);Ajax.Responders.dispatch('onCreate',this,response);this.transport.open(this.method.toUpperCase(),this.url,this.options.asynchronous);if(this.options.asynchronous)this.respondToReadyState.bind(this).defer(1);this.transport.onreadystatechange=this.onStateChange.bind(this);this.setRequestHeaders();this.body=this.method=='post'?(this.options.postBody||params):null;this.transport.send(this.body);if(!this.options.asynchronous&&this.transport.overrideMimeType)
this.onStateChange();}
catch(e){this.dispatchException(e);}},onStateChange:function(){var readyState=this.transport.readyState;if(readyState>1&&!((readyState==4)&&this._complete))
this.respondToReadyState(this.transport.readyState);},setRequestHeaders:function(){var headers={'X-Requested-With':'XMLHttpRequest','X-Prototype-Version':Prototype.Version,'Accept':'text/javascript, text/html, application/xml, text/xml, */*'};if(this.method=='post'){headers['Content-type']=this.options.contentType+
(this.options.encoding?'; charset='+this.options.encoding:'');if(this.transport.overrideMimeType&&(navigator.userAgent.match(/Gecko\/(\d{4})/)||[0,2005])[1]<2005)
headers['Connection']='close';}
if(typeof this.options.requestHeaders=='object'){var extras=this.options.requestHeaders;if(Object.isFunction(extras.push))
for(var i=0,length=extras.length;i<length;i+=2)
headers[extras[i]]=extras[i+1];else
$H(extras).each(function(pair){headers[pair.key]=pair.value});}
for(var name in headers)
this.transport.setRequestHeader(name,headers[name]);},success:function(){var status=this.getStatus();return!status||(status>=200&&status<300);},getStatus:function(){try{return this.transport.status||0;}catch(e){return 0}},respondToReadyState:function(readyState){var state=Ajax.Request.Events[readyState],response=new Ajax.Response(this);if(state=='Complete'){try{this._complete=true;(this.options['on'+response.status]||this.options['on'+(this.success()?'Success':'Failure')]||Prototype.emptyFunction)(response,response.headerJSON);}catch(e){this.dispatchException(e);}
var contentType=response.getHeader('Content-type');if(this.options.evalJS=='force'||(this.options.evalJS&&this.isSameOrigin()&&contentType&&contentType.match(/^\s*(text|application)\/(x-)?(java|ecma)script(;.*)?\s*$/i)))
this.evalResponse();}
try{(this.options['on'+state]||Prototype.emptyFunction)(response,response.headerJSON);Ajax.Responders.dispatch('on'+state,this,response,response.headerJSON);}catch(e){this.dispatchException(e);}
if(state=='Complete'){this.transport.onreadystatechange=Prototype.emptyFunction;}},isSameOrigin:function(){var m=this.url.match(/^\s*https?:\/\/[^\/]*/);return!m||(m[0]=='#{protocol}//#{domain}#{port}'.interpolate({protocol:location.protocol,domain:document.domain,port:location.port?':'+location.port:''}));},getHeader:function(name){try{return this.transport.getResponseHeader(name)||null;}catch(e){return null;}},evalResponse:function(){try{return eval((this.transport.responseText||'').unfilterJSON());}catch(e){this.dispatchException(e);}},dispatchException:function(exception){(this.options.onException||Prototype.emptyFunction)(this,exception);Ajax.Responders.dispatch('onException',this,exception);}});Ajax.Request.Events=['Uninitialized','Loading','Loaded','Interactive','Complete'];Ajax.Response=Class.create({initialize:function(request){this.request=request;var transport=this.transport=request.transport,readyState=this.readyState=transport.readyState;if((readyState>2&&!Prototype.Browser.IE)||readyState==4){this.status=this.getStatus();this.statusText=this.getStatusText();this.responseText=String.interpret(transport.responseText);this.headerJSON=this._getHeaderJSON();}
if(readyState==4){var xml=transport.responseXML;this.responseXML=Object.isUndefined(xml)?null:xml;this.responseJSON=this._getResponseJSON();}},status:0,statusText:'',getStatus:Ajax.Request.prototype.getStatus,getStatusText:function(){try{return this.transport.statusText||'';}catch(e){return''}},getHeader:Ajax.Request.prototype.getHeader,getAllHeaders:function(){try{return this.getAllResponseHeaders();}catch(e){return null}},getResponseHeader:function(name){return this.transport.getResponseHeader(name);},getAllResponseHeaders:function(){return this.transport.getAllResponseHeaders();},_getHeaderJSON:function(){var json=this.getHeader('X-JSON');if(!json)return null;json=decodeURIComponent(escape(json));try{return json.evalJSON(this.request.options.sanitizeJSON||!this.request.isSameOrigin());}catch(e){this.request.dispatchException(e);}},_getResponseJSON:function(){var options=this.request.options;if(!options.evalJSON||(options.evalJSON!='force'&&!(this.getHeader('Content-type')||'').include('application/json'))||this.responseText.blank())
return null;try{return this.responseText.evalJSON(options.sanitizeJSON||!this.request.isSameOrigin());}catch(e){this.request.dispatchException(e);}}});Ajax.Updater=Class.create(Ajax.Request,{initialize:function($super,container,url,options){this.container={success:(container.success||container),failure:(container.failure||(container.success?null:container))};options=Object.clone(options);var onComplete=options.onComplete;options.onComplete=(function(response,json){this.updateContent(response.responseText);if(Object.isFunction(onComplete))onComplete(response,json);}).bind(this);$super(url,options);},updateContent:function(responseText){var receiver=this.container[this.success()?'success':'failure'],options=this.options;if(!options.evalScripts)responseText=responseText.stripScripts();if(receiver=$(receiver)){if(options.insertion){if(Object.isString(options.insertion)){var insertion={};insertion[options.insertion]=responseText;receiver.insert(insertion);}
else options.insertion(receiver,responseText);}
else receiver.update(responseText);}}});Ajax.PeriodicalUpdater=Class.create(Ajax.Base,{initialize:function($super,container,url,options){$super(options);this.onComplete=this.options.onComplete;this.frequency=(this.options.frequency||2);this.decay=(this.options.decay||1);this.updater={};this.container=container;this.url=url;this.start();},start:function(){this.options.onComplete=this.updateComplete.bind(this);this.onTimerEvent();},stop:function(){this.updater.options.onComplete=undefined;clearTimeout(this.timer);(this.onComplete||Prototype.emptyFunction).apply(this,arguments);},updateComplete:function(response){if(this.options.decay){this.decay=(response.responseText==this.lastText?this.decay*this.options.decay:1);this.lastText=response.responseText;}
this.timer=this.onTimerEvent.bind(this).delay(this.decay*this.frequency);},onTimerEvent:function(){this.updater=new Ajax.Updater(this.container,this.url,this.options);}});function $(element){if(arguments.length>1){for(var i=0,elements=[],length=arguments.length;i<length;i++)
elements.push($(arguments[i]));return elements;}
if(Object.isString(element))
element=document.getElementById(element);return Element.extend(element);}
if(Prototype.BrowserFeatures.XPath){document._getElementsByXPath=function(expression,parentElement){var results=[];var query=document.evaluate(expression,$(parentElement)||document,null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,null);for(var i=0,length=query.snapshotLength;i<length;i++)
results.push(Element.extend(query.snapshotItem(i)));return results;};}
if(!window.Node)var Node={};if(!Node.ELEMENT_NODE){Object.extend(Node,{ELEMENT_NODE:1,ATTRIBUTE_NODE:2,TEXT_NODE:3,CDATA_SECTION_NODE:4,ENTITY_REFERENCE_NODE:5,ENTITY_NODE:6,PROCESSING_INSTRUCTION_NODE:7,COMMENT_NODE:8,DOCUMENT_NODE:9,DOCUMENT_TYPE_NODE:10,DOCUMENT_FRAGMENT_NODE:11,NOTATION_NODE:12});}
(function(global){var SETATTRIBUTE_IGNORES_NAME=(function(){var elForm=document.createElement("form");var elInput=document.createElement("input");var root=document.documentElement;elInput.setAttribute("name","test");elForm.appendChild(elInput);root.appendChild(elForm);var isBuggy=elForm.elements?(typeof elForm.elements.test=="undefined"):null;root.removeChild(elForm);elForm=elInput=null;return isBuggy;})();var element=global.Element;global.Element=function(tagName,attributes){attributes=attributes||{};tagName=tagName.toLowerCase();var cache=Element.cache;if(SETATTRIBUTE_IGNORES_NAME&&attributes.name){tagName='<'+tagName+' name="'+attributes.name+'">';delete attributes.name;return Element.writeAttribute(document.createElement(tagName),attributes);}
if(!cache[tagName])cache[tagName]=Element.extend(document.createElement(tagName));return Element.writeAttribute(cache[tagName].cloneNode(false),attributes);};Object.extend(global.Element,element||{});if(element)global.Element.prototype=element.prototype;})(this);Element.cache={};Element.idCounter=1;Element.Methods={visible:function(element){return $(element).style.display!='none';},toggle:function(element){element=$(element);Element[Element.visible(element)?'hide':'show'](element);return element;},hide:function(element){element=$(element);element.style.display='none';return element;},show:function(element){element=$(element);element.style.display='';return element;},remove:function(element){element=$(element);element.parentNode.removeChild(element);return element;},update:(function(){var SELECT_ELEMENT_INNERHTML_BUGGY=(function(){var el=document.createElement("select"),isBuggy=true;el.innerHTML="<option value=\"test\">test</option>";if(el.options&&el.options[0]){isBuggy=el.options[0].nodeName.toUpperCase()!=="OPTION";}
el=null;return isBuggy;})();var TABLE_ELEMENT_INNERHTML_BUGGY=(function(){try{var el=document.createElement("table");if(el&&el.tBodies){el.innerHTML="<tbody><tr><td>test</td></tr></tbody>";var isBuggy=typeof el.tBodies[0]=="undefined";el=null;return isBuggy;}}catch(e){return true;}})();var SCRIPT_ELEMENT_REJECTS_TEXTNODE_APPENDING=(function(){var s=document.createElement("script"),isBuggy=false;try{s.appendChild(document.createTextNode(""));isBuggy=!s.firstChild||s.firstChild&&s.firstChild.nodeType!==3;}catch(e){isBuggy=true;}
s=null;return isBuggy;})();function update(element,content){element=$(element);if(content&&content.toElement)
content=content.toElement();if(Object.isElement(content))
return element.update().insert(content);content=Object.toHTML(content);var tagName=element.tagName.toUpperCase();if(tagName==='SCRIPT'&&SCRIPT_ELEMENT_REJECTS_TEXTNODE_APPENDING){element.text=content;return element;}
if(SELECT_ELEMENT_INNERHTML_BUGGY||TABLE_ELEMENT_INNERHTML_BUGGY){if(tagName in Element._insertionTranslations.tags){while(element.firstChild){element.removeChild(element.firstChild);}
Element._getContentFromAnonymousElement(tagName,content.stripScripts()).each(function(node){element.appendChild(node)});}
else{element.innerHTML=content.stripScripts();}}
else{element.innerHTML=content.stripScripts();}
content.evalScripts.bind(content).defer();return element;}
return update;})(),replace:function(element,content){element=$(element);if(content&&content.toElement)content=content.toElement();else if(!Object.isElement(content)){content=Object.toHTML(content);var range=element.ownerDocument.createRange();range.selectNode(element);content.evalScripts.bind(content).defer();content=range.createContextualFragment(content.stripScripts());}
element.parentNode.replaceChild(content,element);return element;},insert:function(element,insertions){element=$(element);if(Object.isString(insertions)||Object.isNumber(insertions)||Object.isElement(insertions)||(insertions&&(insertions.toElement||insertions.toHTML)))
insertions={bottom:insertions};var content,insert,tagName,childNodes;for(var position in insertions){content=insertions[position];position=position.toLowerCase();insert=Element._insertionTranslations[position];if(content&&content.toElement)content=content.toElement();if(Object.isElement(content)){insert(element,content);continue;}
content=Object.toHTML(content);tagName=((position=='before'||position=='after')?element.parentNode:element).tagName.toUpperCase();childNodes=Element._getContentFromAnonymousElement(tagName,content.stripScripts());if(position=='top'||position=='after')childNodes.reverse();childNodes.each(insert.curry(element));content.evalScripts.bind(content).defer();}
return element;},wrap:function(element,wrapper,attributes){element=$(element);if(Object.isElement(wrapper))
$(wrapper).writeAttribute(attributes||{});else if(Object.isString(wrapper))wrapper=new Element(wrapper,attributes);else wrapper=new Element('div',wrapper);if(element.parentNode)
element.parentNode.replaceChild(wrapper,element);wrapper.appendChild(element);return wrapper;},inspect:function(element){element=$(element);var result='<'+element.tagName.toLowerCase();$H({'id':'id','className':'class'}).each(function(pair){var property=pair.first(),attribute=pair.last();var value=(element[property]||'').toString();if(value)result+=' '+attribute+'='+value.inspect(true);});return result+'>';},recursivelyCollect:function(element,property){element=$(element);var elements=[];while(element=element[property])
if(element.nodeType==1)
elements.push(Element.extend(element));return elements;},ancestors:function(element){return Element.recursivelyCollect(element,'parentNode');},descendants:function(element){return Element.select(element,"*");},firstDescendant:function(element){element=$(element).firstChild;while(element&&element.nodeType!=1)element=element.nextSibling;return $(element);},immediateDescendants:function(element){if(!(element=$(element).firstChild))return[];while(element&&element.nodeType!=1)element=element.nextSibling;if(element)return[element].concat($(element).nextSiblings());return[];},previousSiblings:function(element){return Element.recursivelyCollect(element,'previousSibling');},nextSiblings:function(element){return Element.recursivelyCollect(element,'nextSibling');},siblings:function(element){element=$(element);return Element.previousSiblings(element).reverse().concat(Element.nextSiblings(element));},match:function(element,selector){if(Object.isString(selector))
selector=new Selector(selector);return selector.match($(element));},up:function(element,expression,index){element=$(element);if(arguments.length==1)return $(element.parentNode);var ancestors=Element.ancestors(element);return Object.isNumber(expression)?ancestors[expression]:Selector.findElement(ancestors,expression,index);},down:function(element,expression,index){element=$(element);if(arguments.length==1)return Element.firstDescendant(element);return Object.isNumber(expression)?Element.descendants(element)[expression]:Element.select(element,expression)[index||0];},previous:function(element,expression,index){element=$(element);if(arguments.length==1)return $(Selector.handlers.previousElementSibling(element));var previousSiblings=Element.previousSiblings(element);return Object.isNumber(expression)?previousSiblings[expression]:Selector.findElement(previousSiblings,expression,index);},next:function(element,expression,index){element=$(element);if(arguments.length==1)return $(Selector.handlers.nextElementSibling(element));var nextSiblings=Element.nextSiblings(element);return Object.isNumber(expression)?nextSiblings[expression]:Selector.findElement(nextSiblings,expression,index);},select:function(element){var args=Array.prototype.slice.call(arguments,1);return Selector.findChildElements(element,args);},adjacent:function(element){var args=Array.prototype.slice.call(arguments,1);return Selector.findChildElements(element.parentNode,args).without(element);},identify:function(element){element=$(element);var id=Element.readAttribute(element,'id');if(id)return id;do{id='anonymous_element_'+Element.idCounter++}while($(id));Element.writeAttribute(element,'id',id);return id;},readAttribute:function(element,name){element=$(element);if(Prototype.Browser.IE){var t=Element._attributeTranslations.read;if(t.values[name])return t.values[name](element,name);if(t.names[name])name=t.names[name];if(name.include(':')){return(!element.attributes||!element.attributes[name])?null:element.attributes[name].value;}}
return element.getAttribute(name);},writeAttribute:function(element,name,value){element=$(element);var attributes={},t=Element._attributeTranslations.write;if(typeof name=='object')attributes=name;else attributes[name]=Object.isUndefined(value)?true:value;for(var attr in attributes){name=t.names[attr]||attr;value=attributes[attr];if(t.values[attr])name=t.values[attr](element,value);if(value===false||value===null)
element.removeAttribute(name);else if(value===true)
element.setAttribute(name,name);else element.setAttribute(name,value);}
return element;},getHeight:function(element){return Element.getDimensions(element).height;},getWidth:function(element){return Element.getDimensions(element).width;},classNames:function(element){return new Element.ClassNames(element);},hasClassName:function(element,className){if(!(element=$(element)))return;var elementClassName=element.className;return(elementClassName.length>0&&(elementClassName==className||new RegExp("(^|\\s)"+className+"(\\s|$)").test(elementClassName)));},addClassName:function(element,className){if(!(element=$(element)))return;if(!Element.hasClassName(element,className))
element.className+=(element.className?' ':'')+className;return element;},removeClassName:function(element,className){if(!(element=$(element)))return;element.className=element.className.replace(new RegExp("(^|\\s+)"+className+"(\\s+|$)"),' ').strip();return element;},toggleClassName:function(element,className){if(!(element=$(element)))return;return Element[Element.hasClassName(element,className)?'removeClassName':'addClassName'](element,className);},cleanWhitespace:function(element){element=$(element);var node=element.firstChild;while(node){var nextNode=node.nextSibling;if(node.nodeType==3&&!/\S/.test(node.nodeValue))
element.removeChild(node);node=nextNode;}
return element;},empty:function(element){return $(element).innerHTML.blank();},descendantOf:function(element,ancestor){element=$(element),ancestor=$(ancestor);if(element.compareDocumentPosition)
return(element.compareDocumentPosition(ancestor)&8)===8;if(ancestor.contains)
return ancestor.contains(element)&&ancestor!==element;while(element=element.parentNode)
if(element==ancestor)return true;return false;},scrollTo:function(element){element=$(element);var pos=Element.cumulativeOffset(element);window.scrollTo(pos[0],pos[1]);return element;},getStyle:function(element,style){element=$(element);style=style=='float'?'cssFloat':style.camelize();var value=element.style[style];if(!value||value=='auto'){var css=document.defaultView.getComputedStyle(element,null);value=css?css[style]:null;}
if(style=='opacity')return value?parseFloat(value):1.0;return value=='auto'?null:value;},getOpacity:function(element){return $(element).getStyle('opacity');},setStyle:function(element,styles){element=$(element);var elementStyle=element.style,match;if(Object.isString(styles)){element.style.cssText+=';'+styles;return styles.include('opacity')?element.setOpacity(styles.match(/opacity:\s*(\d?\.?\d*)/)[1]):element;}
for(var property in styles)
if(property=='opacity')element.setOpacity(styles[property]);else
elementStyle[(property=='float'||property=='cssFloat')?(Object.isUndefined(elementStyle.styleFloat)?'cssFloat':'styleFloat'):property]=styles[property];return element;},setOpacity:function(element,value){element=$(element);element.style.opacity=(value==1||value==='')?'':(value<0.00001)?0:value;return element;},getDimensions:function(element){element=$(element);var display=Element.getStyle(element,'display');if(display!='none'&&display!=null)
return{width:element.offsetWidth,height:element.offsetHeight};var els=element.style;var originalVisibility=els.visibility;var originalPosition=els.position;var originalDisplay=els.display;els.visibility='hidden';if(originalPosition!='fixed')
els.position='absolute';els.display='block';var originalWidth=element.clientWidth;var originalHeight=element.clientHeight;els.display=originalDisplay;els.position=originalPosition;els.visibility=originalVisibility;return{width:originalWidth,height:originalHeight};},makePositioned:function(element){element=$(element);var pos=Element.getStyle(element,'position');if(pos=='static'||!pos){element._madePositioned=true;element.style.position='relative';if(Prototype.Browser.Opera){element.style.top=0;element.style.left=0;}}
return element;},undoPositioned:function(element){element=$(element);if(element._madePositioned){element._madePositioned=undefined;element.style.position=element.style.top=element.style.left=element.style.bottom=element.style.right='';}
return element;},makeClipping:function(element){element=$(element);if(element._overflow)return element;element._overflow=Element.getStyle(element,'overflow')||'auto';if(element._overflow!=='hidden')
element.style.overflow='hidden';return element;},undoClipping:function(element){element=$(element);if(!element._overflow)return element;element.style.overflow=element._overflow=='auto'?'':element._overflow;element._overflow=null;return element;},cumulativeOffset:function(element){var valueT=0,valueL=0;do{valueT+=element.offsetTop||0;valueL+=element.offsetLeft||0;element=element.offsetParent;}while(element);return Element._returnOffset(valueL,valueT);},positionedOffset:function(element){var valueT=0,valueL=0;do{valueT+=element.offsetTop||0;valueL+=element.offsetLeft||0;element=element.offsetParent;if(element){if(element.tagName.toUpperCase()=='BODY')break;var p=Element.getStyle(element,'position');if(p!=='static')break;}}while(element);return Element._returnOffset(valueL,valueT);},absolutize:function(element){element=$(element);if(Element.getStyle(element,'position')=='absolute')return element;var offsets=Element.positionedOffset(element);var top=offsets[1];var left=offsets[0];var width=element.clientWidth;var height=element.clientHeight;element._originalLeft=left-parseFloat(element.style.left||0);element._originalTop=top-parseFloat(element.style.top||0);element._originalWidth=element.style.width;element._originalHeight=element.style.height;element.style.position='absolute';element.style.top=top+'px';element.style.left=left+'px';element.style.width=width+'px';element.style.height=height+'px';return element;},relativize:function(element){element=$(element);if(Element.getStyle(element,'position')=='relative')return element;element.style.position='relative';var top=parseFloat(element.style.top||0)-(element._originalTop||0);var left=parseFloat(element.style.left||0)-(element._originalLeft||0);element.style.top=top+'px';element.style.left=left+'px';element.style.height=element._originalHeight;element.style.width=element._originalWidth;return element;},cumulativeScrollOffset:function(element){var valueT=0,valueL=0;do{valueT+=element.scrollTop||0;valueL+=element.scrollLeft||0;element=element.parentNode;}while(element);return Element._returnOffset(valueL,valueT);},getOffsetParent:function(element){if(element.offsetParent)return $(element.offsetParent);if(element==document.body)return $(element);while((element=element.parentNode)&&element!=document.body)
if(Element.getStyle(element,'position')!='static')
return $(element);return $(document.body);},viewportOffset:function(forElement){var valueT=0,valueL=0;var element=forElement;do{valueT+=element.offsetTop||0;valueL+=element.offsetLeft||0;if(element.offsetParent==document.body&&Element.getStyle(element,'position')=='absolute')break;}while(element=element.offsetParent);element=forElement;do{if(!Prototype.Browser.Opera||(element.tagName&&(element.tagName.toUpperCase()=='BODY'))){valueT-=element.scrollTop||0;valueL-=element.scrollLeft||0;}}while(element=element.parentNode);return Element._returnOffset(valueL,valueT);},clonePosition:function(element,source){var options=Object.extend({setLeft:true,setTop:true,setWidth:true,setHeight:true,offsetTop:0,offsetLeft:0},arguments[2]||{});source=$(source);var p=Element.viewportOffset(source);element=$(element);var delta=[0,0];var parent=null;if(Element.getStyle(element,'position')=='absolute'){parent=Element.getOffsetParent(element);delta=Element.viewportOffset(parent);}
if(parent==document.body){delta[0]-=document.body.offsetLeft;delta[1]-=document.body.offsetTop;}
if(options.setLeft)element.style.left=(p[0]-delta[0]+options.offsetLeft)+'px';if(options.setTop)element.style.top=(p[1]-delta[1]+options.offsetTop)+'px';if(options.setWidth)element.style.width=source.offsetWidth+'px';if(options.setHeight)element.style.height=source.offsetHeight+'px';return element;}};Object.extend(Element.Methods,{getElementsBySelector:Element.Methods.select,childElements:Element.Methods.immediateDescendants});Element._attributeTranslations={write:{names:{className:'class',htmlFor:'for'},values:{}}};if(Prototype.Browser.Opera){Element.Methods.getStyle=Element.Methods.getStyle.wrap(function(proceed,element,style){switch(style){case'left':case'top':case'right':case'bottom':if(proceed(element,'position')==='static')return null;case'height':case'width':if(!Element.visible(element))return null;var dim=parseInt(proceed(element,style),10);if(dim!==element['offset'+style.capitalize()])
return dim+'px';var properties;if(style==='height'){properties=['border-top-width','padding-top','padding-bottom','border-bottom-width'];}
else{properties=['border-left-width','padding-left','padding-right','border-right-width'];}
return properties.inject(dim,function(memo,property){var val=proceed(element,property);return val===null?memo:memo-parseInt(val,10);})+'px';default:return proceed(element,style);}});Element.Methods.readAttribute=Element.Methods.readAttribute.wrap(function(proceed,element,attribute){if(attribute==='title')return element.title;return proceed(element,attribute);});}
else if(Prototype.Browser.IE){Element.Methods.getOffsetParent=Element.Methods.getOffsetParent.wrap(function(proceed,element){element=$(element);try{element.offsetParent}
catch(e){return $(document.body)}
var position=element.getStyle('position');if(position!=='static')return proceed(element);element.setStyle({position:'relative'});var value=proceed(element);element.setStyle({position:position});return value;});$w('positionedOffset viewportOffset').each(function(method){Element.Methods[method]=Element.Methods[method].wrap(function(proceed,element){element=$(element);try{element.offsetParent}
catch(e){return Element._returnOffset(0,0)}
var position=element.getStyle('position');if(position!=='static')return proceed(element);var offsetParent=element.getOffsetParent();if(offsetParent&&offsetParent.getStyle('position')==='fixed')
offsetParent.setStyle({zoom:1});element.setStyle({position:'relative'});var value=proceed(element);element.setStyle({position:position});return value;});});Element.Methods.cumulativeOffset=Element.Methods.cumulativeOffset.wrap(function(proceed,element){try{element.offsetParent}
catch(e){return Element._returnOffset(0,0)}
return proceed(element);});Element.Methods.getStyle=function(element,style){element=$(element);style=(style=='float'||style=='cssFloat')?'styleFloat':style.camelize();var value=element.style[style];if(!value&&element.currentStyle)value=element.currentStyle[style];if(style=='opacity'){if(value=(element.getStyle('filter')||'').match(/alpha\(opacity=(.*)\)/))
if(value[1])return parseFloat(value[1])/100;return 1.0;}
if(value=='auto'){if((style=='width'||style=='height')&&(element.getStyle('display')!='none'))
return element['offset'+style.capitalize()]+'px';return null;}
return value;};Element.Methods.setOpacity=function(element,value){function stripAlpha(filter){return filter.replace(/alpha\([^\)]*\)/gi,'');}
element=$(element);var currentStyle=element.currentStyle;if((currentStyle&&!currentStyle.hasLayout)||(!currentStyle&&element.style.zoom=='normal'))
element.style.zoom=1;var filter=element.getStyle('filter'),style=element.style;if(value==1||value===''){(filter=stripAlpha(filter))?style.filter=filter:style.removeAttribute('filter');return element;}else if(value<0.00001)value=0;style.filter=stripAlpha(filter)+'alpha(opacity='+(value*100)+')';return element;};Element._attributeTranslations=(function(){var classProp='className';var forProp='for';var el=document.createElement('div');el.setAttribute(classProp,'x');if(el.className!=='x'){el.setAttribute('class','x');if(el.className==='x'){classProp='class';}}
el=null;el=document.createElement('label');el.setAttribute(forProp,'x');if(el.htmlFor!=='x'){el.setAttribute('htmlFor','x');if(el.htmlFor==='x'){forProp='htmlFor';}}
el=null;return{read:{names:{'class':classProp,'className':classProp,'for':forProp,'htmlFor':forProp},values:{_getAttr:function(element,attribute){return element.getAttribute(attribute);},_getAttr2:function(element,attribute){return element.getAttribute(attribute,2);},_getAttrNode:function(element,attribute){var node=element.getAttributeNode(attribute);return node?node.value:"";},_getEv:(function(){var el=document.createElement('div');el.onclick=Prototype.emptyFunction;var value=el.getAttribute('onclick');var f;if(String(value).indexOf('{')>-1){f=function(element,attribute){attribute=element.getAttribute(attribute);if(!attribute)return null;attribute=attribute.toString();attribute=attribute.split('{')[1];attribute=attribute.split('}')[0];return attribute.strip();};}
else if(value===''){f=function(element,attribute){attribute=element.getAttribute(attribute);if(!attribute)return null;return attribute.strip();};}
el=null;return f;})(),_flag:function(element,attribute){return $(element).hasAttribute(attribute)?attribute:null;},style:function(element){return element.style.cssText.toLowerCase();},title:function(element){return element.title;}}}}})();Element._attributeTranslations.write={names:Object.extend({cellpadding:'cellPadding',cellspacing:'cellSpacing'},Element._attributeTranslations.read.names),values:{checked:function(element,value){element.checked=!!value;},style:function(element,value){element.style.cssText=value?value:'';}}};Element._attributeTranslations.has={};$w('colSpan rowSpan vAlign dateTime accessKey tabIndex '+'encType maxLength readOnly longDesc frameBorder').each(function(attr){Element._attributeTranslations.write.names[attr.toLowerCase()]=attr;Element._attributeTranslations.has[attr.toLowerCase()]=attr;});(function(v){Object.extend(v,{href:v._getAttr2,src:v._getAttr2,type:v._getAttr,action:v._getAttrNode,disabled:v._flag,checked:v._flag,readonly:v._flag,multiple:v._flag,onload:v._getEv,onunload:v._getEv,onclick:v._getEv,ondblclick:v._getEv,onmousedown:v._getEv,onmouseup:v._getEv,onmouseover:v._getEv,onmousemove:v._getEv,onmouseout:v._getEv,onfocus:v._getEv,onblur:v._getEv,onkeypress:v._getEv,onkeydown:v._getEv,onkeyup:v._getEv,onsubmit:v._getEv,onreset:v._getEv,onselect:v._getEv,onchange:v._getEv});})(Element._attributeTranslations.read.values);if(Prototype.BrowserFeatures.ElementExtensions){(function(){function _descendants(element){var nodes=element.getElementsByTagName('*'),results=[];for(var i=0,node;node=nodes[i];i++)
if(node.tagName!=="!")
results.push(node);return results;}
Element.Methods.down=function(element,expression,index){element=$(element);if(arguments.length==1)return element.firstDescendant();return Object.isNumber(expression)?_descendants(element)[expression]:Element.select(element,expression)[index||0];}})();}}
else if(Prototype.Browser.Gecko&&/rv:1\.8\.0/.test(navigator.userAgent)){Element.Methods.setOpacity=function(element,value){element=$(element);element.style.opacity=(value==1)?0.999999:(value==='')?'':(value<0.00001)?0:value;return element;};}
else if(Prototype.Browser.WebKit){Element.Methods.setOpacity=function(element,value){element=$(element);element.style.opacity=(value==1||value==='')?'':(value<0.00001)?0:value;if(value==1)
if(element.tagName.toUpperCase()=='IMG'&&element.width){element.width++;element.width--;}else try{var n=document.createTextNode(' ');element.appendChild(n);element.removeChild(n);}catch(e){}
return element;};Element.Methods.cumulativeOffset=function(element){var valueT=0,valueL=0;do{valueT+=element.offsetTop||0;valueL+=element.offsetLeft||0;if(element.offsetParent==document.body)
if(Element.getStyle(element,'position')=='absolute')break;element=element.offsetParent;}while(element);return Element._returnOffset(valueL,valueT);};}
if('outerHTML'in document.documentElement){Element.Methods.replace=function(element,content){element=$(element);if(content&&content.toElement)content=content.toElement();if(Object.isElement(content)){element.parentNode.replaceChild(content,element);return element;}
content=Object.toHTML(content);var parent=element.parentNode,tagName=parent.tagName.toUpperCase();if(Element._insertionTranslations.tags[tagName]){var nextSibling=element.next();var fragments=Element._getContentFromAnonymousElement(tagName,content.stripScripts());parent.removeChild(element);if(nextSibling)
fragments.each(function(node){parent.insertBefore(node,nextSibling)});else
fragments.each(function(node){parent.appendChild(node)});}
else element.outerHTML=content.stripScripts();content.evalScripts.bind(content).defer();return element;};}
Element._returnOffset=function(l,t){var result=[l,t];result.left=l;result.top=t;return result;};Element._getContentFromAnonymousElement=function(tagName,html){var div=new Element('div'),t=Element._insertionTranslations.tags[tagName];if(t){div.innerHTML=t[0]+html+t[1];t[2].times(function(){div=div.firstChild});}else div.innerHTML=html;return $A(div.childNodes);};Element._insertionTranslations={before:function(element,node){element.parentNode.insertBefore(node,element);},top:function(element,node){element.insertBefore(node,element.firstChild);},bottom:function(element,node){element.appendChild(node);},after:function(element,node){element.parentNode.insertBefore(node,element.nextSibling);},tags:{TABLE:['<table>','</table>',1],TBODY:['<table><tbody>','</tbody></table>',2],TR:['<table><tbody><tr>','</tr></tbody></table>',3],TD:['<table><tbody><tr><td>','</td></tr></tbody></table>',4],SELECT:['<select>','</select>',1]}};(function(){var tags=Element._insertionTranslations.tags;Object.extend(tags,{THEAD:tags.TBODY,TFOOT:tags.TBODY,TH:tags.TD});})();Element.Methods.Simulated={hasAttribute:function(element,attribute){attribute=Element._attributeTranslations.has[attribute]||attribute;var node=$(element).getAttributeNode(attribute);return!!(node&&node.specified);}};Element.Methods.ByTag={};Object.extend(Element,Element.Methods);(function(div){if(!Prototype.BrowserFeatures.ElementExtensions&&div['__proto__']){window.HTMLElement={};window.HTMLElement.prototype=div['__proto__'];Prototype.BrowserFeatures.ElementExtensions=true;}
div=null;})(document.createElement('div'))
Element.extend=(function(){function checkDeficiency(tagName){if(typeof window.Element!='undefined'){var proto=window.Element.prototype;if(proto){var id='_'+(Math.random()+'').slice(2);var el=document.createElement(tagName);proto[id]='x';var isBuggy=(el[id]!=='x');delete proto[id];el=null;return isBuggy;}}
return false;}
function extendElementWith(element,methods){for(var property in methods){var value=methods[property];if(Object.isFunction(value)&&!(property in element))
element[property]=value.methodize();}}
var HTMLOBJECTELEMENT_PROTOTYPE_BUGGY=checkDeficiency('object');if(Prototype.BrowserFeatures.SpecificElementExtensions){if(HTMLOBJECTELEMENT_PROTOTYPE_BUGGY){return function(element){if(element&&typeof element._extendedByPrototype=='undefined'){var t=element.tagName;if(t&&(/^(?:object|applet|embed)$/i.test(t))){extendElementWith(element,Element.Methods);extendElementWith(element,Element.Methods.Simulated);extendElementWith(element,Element.Methods.ByTag[t.toUpperCase()]);}}
return element;}}
return Prototype.K;}
var Methods={},ByTag=Element.Methods.ByTag;var extend=Object.extend(function(element){if(!element||typeof element._extendedByPrototype!='undefined'||element.nodeType!=1||element==window)return element;var methods=Object.clone(Methods),tagName=element.tagName.toUpperCase();if(ByTag[tagName])Object.extend(methods,ByTag[tagName]);extendElementWith(element,methods);element._extendedByPrototype=Prototype.emptyFunction;return element;},{refresh:function(){if(!Prototype.BrowserFeatures.ElementExtensions){Object.extend(Methods,Element.Methods);Object.extend(Methods,Element.Methods.Simulated);}}});extend.refresh();return extend;})();Element.hasAttribute=function(element,attribute){if(element.hasAttribute)return element.hasAttribute(attribute);return Element.Methods.Simulated.hasAttribute(element,attribute);};Element.addMethods=function(methods){var F=Prototype.BrowserFeatures,T=Element.Methods.ByTag;if(!methods){Object.extend(Form,Form.Methods);Object.extend(Form.Element,Form.Element.Methods);Object.extend(Element.Methods.ByTag,{"FORM":Object.clone(Form.Methods),"INPUT":Object.clone(Form.Element.Methods),"SELECT":Object.clone(Form.Element.Methods),"TEXTAREA":Object.clone(Form.Element.Methods)});}
if(arguments.length==2){var tagName=methods;methods=arguments[1];}
if(!tagName)Object.extend(Element.Methods,methods||{});else{if(Object.isArray(tagName))tagName.each(extend);else extend(tagName);}
function extend(tagName){tagName=tagName.toUpperCase();if(!Element.Methods.ByTag[tagName])
Element.Methods.ByTag[tagName]={};Object.extend(Element.Methods.ByTag[tagName],methods);}
function copy(methods,destination,onlyIfAbsent){onlyIfAbsent=onlyIfAbsent||false;for(var property in methods){var value=methods[property];if(!Object.isFunction(value))continue;if(!onlyIfAbsent||!(property in destination))
destination[property]=value.methodize();}}
function findDOMClass(tagName){var klass;var trans={"OPTGROUP":"OptGroup","TEXTAREA":"TextArea","P":"Paragraph","FIELDSET":"FieldSet","UL":"UList","OL":"OList","DL":"DList","DIR":"Directory","H1":"Heading","H2":"Heading","H3":"Heading","H4":"Heading","H5":"Heading","H6":"Heading","Q":"Quote","INS":"Mod","DEL":"Mod","A":"Anchor","IMG":"Image","CAPTION":"TableCaption","COL":"TableCol","COLGROUP":"TableCol","THEAD":"TableSection","TFOOT":"TableSection","TBODY":"TableSection","TR":"TableRow","TH":"TableCell","TD":"TableCell","FRAMESET":"FrameSet","IFRAME":"IFrame"};if(trans[tagName])klass='HTML'+trans[tagName]+'Element';if(window[klass])return window[klass];klass='HTML'+tagName+'Element';if(window[klass])return window[klass];klass='HTML'+tagName.capitalize()+'Element';if(window[klass])return window[klass];var element=document.createElement(tagName);var proto=element['__proto__']||element.constructor.prototype;element=null;return proto;}
var elementPrototype=window.HTMLElement?HTMLElement.prototype:Element.prototype;if(F.ElementExtensions){copy(Element.Methods,elementPrototype);copy(Element.Methods.Simulated,elementPrototype,true);}
if(F.SpecificElementExtensions){for(var tag in Element.Methods.ByTag){var klass=findDOMClass(tag);if(Object.isUndefined(klass))continue;copy(T[tag],klass.prototype);}}
Object.extend(Element,Element.Methods);delete Element.ByTag;if(Element.extend.refresh)Element.extend.refresh();Element.cache={};};document.viewport={getDimensions:function(){return{width:this.getWidth(),height:this.getHeight()};},getScrollOffsets:function(){return Element._returnOffset(window.pageXOffset||document.documentElement.scrollLeft||document.body.scrollLeft,window.pageYOffset||document.documentElement.scrollTop||document.body.scrollTop);}};(function(viewport){var B=Prototype.Browser,doc=document,element,property={};function getRootElement(){if(B.WebKit&&!doc.evaluate)
return document;if(B.Opera&&window.parseFloat(window.opera.version())<9.5)
return document.body;return document.documentElement;}
function define(D){if(!element)element=getRootElement();property[D]='client'+D;viewport['get'+D]=function(){return element[property[D]]};return viewport['get'+D]();}
viewport.getWidth=define.curry('Width');viewport.getHeight=define.curry('Height');})(document.viewport);Element.Storage={UID:1};Element.addMethods({getStorage:function(element){if(!(element=$(element)))return;var uid;if(element===window){uid=0;}else{if(typeof element._prototypeUID==="undefined")
element._prototypeUID=[Element.Storage.UID++];uid=element._prototypeUID[0];}
if(!Element.Storage[uid])
Element.Storage[uid]=$H();return Element.Storage[uid];},store:function(element,key,value){if(!(element=$(element)))return;if(arguments.length===2){Element.getStorage(element).update(key);}else{Element.getStorage(element).set(key,value);}
return element;},retrieve:function(element,key,defaultValue){if(!(element=$(element)))return;var hash=Element.getStorage(element),value=hash.get(key);if(Object.isUndefined(value)){hash.set(key,defaultValue);value=defaultValue;}
return value;},clone:function(element,deep){if(!(element=$(element)))return;var clone=element.cloneNode(deep);clone._prototypeUID=void 0;if(deep){var descendants=Element.select(clone,'*'),i=descendants.length;while(i--){descendants[i]._prototypeUID=void 0;}}
return Element.extend(clone);}});var Selector=Class.create({initialize:function(expression){this.expression=expression.strip();if(this.shouldUseSelectorsAPI()){this.mode='selectorsAPI';}else if(this.shouldUseXPath()){this.mode='xpath';this.compileXPathMatcher();}else{this.mode="normal";this.compileMatcher();}},shouldUseXPath:(function(){var IS_DESCENDANT_SELECTOR_BUGGY=(function(){var isBuggy=false;if(document.evaluate&&window.XPathResult){var el=document.createElement('div');el.innerHTML='<ul><li></li></ul><div><ul><li></li></ul></div>';var xpath=".//*[local-name()='ul' or local-name()='UL']"+"//*[local-name()='li' or local-name()='LI']";var result=document.evaluate(xpath,el,null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,null);isBuggy=(result.snapshotLength!==2);el=null;}
return isBuggy;})();return function(){if(!Prototype.BrowserFeatures.XPath)return false;var e=this.expression;if(Prototype.Browser.WebKit&&(e.include("-of-type")||e.include(":empty")))
return false;if((/(\[[\w-]*?:|:checked)/).test(e))
return false;if(IS_DESCENDANT_SELECTOR_BUGGY)return false;return true;}})(),shouldUseSelectorsAPI:function(){if(!Prototype.BrowserFeatures.SelectorsAPI)return false;if(Selector.CASE_INSENSITIVE_CLASS_NAMES)return false;if(!Selector._div)Selector._div=new Element('div');try{Selector._div.querySelector(this.expression);}catch(e){return false;}
return true;},compileMatcher:function(){var e=this.expression,ps=Selector.patterns,h=Selector.handlers,c=Selector.criteria,le,p,m,len=ps.length,name;if(Selector._cache[e]){this.matcher=Selector._cache[e];return;}
this.matcher=["this.matcher = function(root) {","var r = root, h = Selector.handlers, c = false, n;"];while(e&&le!=e&&(/\S/).test(e)){le=e;for(var i=0;i<len;i++){p=ps[i].re;name=ps[i].name;if(m=e.match(p)){this.matcher.push(Object.isFunction(c[name])?c[name](m):new Template(c[name]).evaluate(m));e=e.replace(m[0],'');break;}}}
this.matcher.push("return h.unique(n);\n}");eval(this.matcher.join('\n'));Selector._cache[this.expression]=this.matcher;},compileXPathMatcher:function(){var e=this.expression,ps=Selector.patterns,x=Selector.xpath,le,m,len=ps.length,name;if(Selector._cache[e]){this.xpath=Selector._cache[e];return;}
this.matcher=['.//*'];while(e&&le!=e&&(/\S/).test(e)){le=e;for(var i=0;i<len;i++){name=ps[i].name;if(m=e.match(ps[i].re)){this.matcher.push(Object.isFunction(x[name])?x[name](m):new Template(x[name]).evaluate(m));e=e.replace(m[0],'');break;}}}
this.xpath=this.matcher.join('');Selector._cache[this.expression]=this.xpath;},findElements:function(root){root=root||document;var e=this.expression,results;switch(this.mode){case'selectorsAPI':if(root!==document){var oldId=root.id,id=$(root).identify();id=id.replace(/([\.:])/g,"\\$1");e="#"+id+" "+e;}
results=$A(root.querySelectorAll(e)).map(Element.extend);root.id=oldId;return results;case'xpath':return document._getElementsByXPath(this.xpath,root);default:return this.matcher(root);}},match:function(element){this.tokens=[];var e=this.expression,ps=Selector.patterns,as=Selector.assertions;var le,p,m,len=ps.length,name;while(e&&le!==e&&(/\S/).test(e)){le=e;for(var i=0;i<len;i++){p=ps[i].re;name=ps[i].name;if(m=e.match(p)){if(as[name]){this.tokens.push([name,Object.clone(m)]);e=e.replace(m[0],'');}else{return this.findElements(document).include(element);}}}}
var match=true,name,matches;for(var i=0,token;token=this.tokens[i];i++){name=token[0],matches=token[1];if(!Selector.assertions[name](element,matches)){match=false;break;}}
return match;},toString:function(){return this.expression;},inspect:function(){return"#<Selector:"+this.expression.inspect()+">";}});if(Prototype.BrowserFeatures.SelectorsAPI&&document.compatMode==='BackCompat'){Selector.CASE_INSENSITIVE_CLASS_NAMES=(function(){var div=document.createElement('div'),span=document.createElement('span');div.id="prototype_test_id";span.className='Test';div.appendChild(span);var isIgnored=(div.querySelector('#prototype_test_id .test')!==null);div=span=null;return isIgnored;})();}
Object.extend(Selector,{_cache:{},xpath:{descendant:"//*",child:"/*",adjacent:"/following-sibling::*[1]",laterSibling:'/following-sibling::*',tagName:function(m){if(m[1]=='*')return'';return"[local-name()='"+m[1].toLowerCase()+"' or local-name()='"+m[1].toUpperCase()+"']";},className:"[contains(concat(' ', @class, ' '), ' #{1} ')]",id:"[@id='#{1}']",attrPresence:function(m){m[1]=m[1].toLowerCase();return new Template("[@#{1}]").evaluate(m);},attr:function(m){m[1]=m[1].toLowerCase();m[3]=m[5]||m[6];return new Template(Selector.xpath.operators[m[2]]).evaluate(m);},pseudo:function(m){var h=Selector.xpath.pseudos[m[1]];if(!h)return'';if(Object.isFunction(h))return h(m);return new Template(Selector.xpath.pseudos[m[1]]).evaluate(m);},operators:{'=':"[@#{1}='#{3}']",'!=':"[@#{1}!='#{3}']",'^=':"[starts-with(@#{1}, '#{3}')]",'$=':"[substring(@#{1}, (string-length(@#{1}) - string-length('#{3}') + 1))='#{3}']",'*=':"[contains(@#{1}, '#{3}')]",'~=':"[contains(concat(' ', @#{1}, ' '), ' #{3} ')]",'|=':"[contains(concat('-', @#{1}, '-'), '-#{3}-')]"},pseudos:{'first-child':'[not(preceding-sibling::*)]','last-child':'[not(following-sibling::*)]','only-child':'[not(preceding-sibling::* or following-sibling::*)]','empty':"[count(*) = 0 and (count(text()) = 0)]",'checked':"[@checked]",'disabled':"[(@disabled) and (@type!='hidden')]",'enabled':"[not(@disabled) and (@type!='hidden')]",'not':function(m){var e=m[6],p=Selector.patterns,x=Selector.xpath,le,v,len=p.length,name;var exclusion=[];while(e&&le!=e&&(/\S/).test(e)){le=e;for(var i=0;i<len;i++){name=p[i].name
if(m=e.match(p[i].re)){v=Object.isFunction(x[name])?x[name](m):new Template(x[name]).evaluate(m);exclusion.push("("+v.substring(1,v.length-1)+")");e=e.replace(m[0],'');break;}}}
return"[not("+exclusion.join(" and ")+")]";},'nth-child':function(m){return Selector.xpath.pseudos.nth("(count(./preceding-sibling::*) + 1) ",m);},'nth-last-child':function(m){return Selector.xpath.pseudos.nth("(count(./following-sibling::*) + 1) ",m);},'nth-of-type':function(m){return Selector.xpath.pseudos.nth("position() ",m);},'nth-last-of-type':function(m){return Selector.xpath.pseudos.nth("(last() + 1 - position()) ",m);},'first-of-type':function(m){m[6]="1";return Selector.xpath.pseudos['nth-of-type'](m);},'last-of-type':function(m){m[6]="1";return Selector.xpath.pseudos['nth-last-of-type'](m);},'only-of-type':function(m){var p=Selector.xpath.pseudos;return p['first-of-type'](m)+p['last-of-type'](m);},nth:function(fragment,m){var mm,formula=m[6],predicate;if(formula=='even')formula='2n+0';if(formula=='odd')formula='2n+1';if(mm=formula.match(/^(\d+)$/))
return'['+fragment+"= "+mm[1]+']';if(mm=formula.match(/^(-?\d*)?n(([+-])(\d+))?/)){if(mm[1]=="-")mm[1]=-1;var a=mm[1]?Number(mm[1]):1;var b=mm[2]?Number(mm[2]):0;predicate="[((#{fragment} - #{b}) mod #{a} = 0) and "+"((#{fragment} - #{b}) div #{a} >= 0)]";return new Template(predicate).evaluate({fragment:fragment,a:a,b:b});}}}},criteria:{tagName:'n = h.tagName(n, r, "#{1}", c);      c = false;',className:'n = h.className(n, r, "#{1}", c);    c = false;',id:'n = h.id(n, r, "#{1}", c);           c = false;',attrPresence:'n = h.attrPresence(n, r, "#{1}", c); c = false;',attr:function(m){m[3]=(m[5]||m[6]);return new Template('n = h.attr(n, r, "#{1}", "#{3}", "#{2}", c); c = false;').evaluate(m);},pseudo:function(m){if(m[6])m[6]=m[6].replace(/"/g,'\\"');return new Template('n = h.pseudo(n, "#{1}", "#{6}", r, c); c = false;').evaluate(m);},descendant:'c = "descendant";',child:'c = "child";',adjacent:'c = "adjacent";',laterSibling:'c = "laterSibling";'},patterns:[{name:'laterSibling',re:/^\s*~\s*/},{name:'child',re:/^\s*>\s*/},{name:'adjacent',re:/^\s*\+\s*/},{name:'descendant',re:/^\s/},{name:'tagName',re:/^\s*(\*|[\w\-]+)(\b|$)?/},{name:'id',re:/^#([\w\-\*]+)(\b|$)/},{name:'className',re:/^\.([\w\-\*]+)(\b|$)/},{name:'pseudo',re:/^:((first|last|nth|nth-last|only)(-child|-of-type)|empty|checked|(en|dis)abled|not)(\((.*?)\))?(\b|$|(?=\s|[:+~>]))/},{name:'attrPresence',re:/^\[((?:[\w-]+:)?[\w-]+)\]/},{name:'attr',re:/\[((?:[\w-]*:)?[\w-]+)\s*(?:([!^$*~|]?=)\s*((['"])([^\4]*?)\4|([^'"][^\]]*?)))?\]/}],assertions:{tagName:function(element,matches){return matches[1].toUpperCase()==element.tagName.toUpperCase();},className:function(element,matches){return Element.hasClassName(element,matches[1]);},id:function(element,matches){return element.id===matches[1];},attrPresence:function(element,matches){return Element.hasAttribute(element,matches[1]);},attr:function(element,matches){var nodeValue=Element.readAttribute(element,matches[1]);return nodeValue&&Selector.operators[matches[2]](nodeValue,matches[5]||matches[6]);}},handlers:{concat:function(a,b){for(var i=0,node;node=b[i];i++)
a.push(node);return a;},mark:function(nodes){var _true=Prototype.emptyFunction;for(var i=0,node;node=nodes[i];i++)
node._countedByPrototype=_true;return nodes;},unmark:(function(){var PROPERTIES_ATTRIBUTES_MAP=(function(){var el=document.createElement('div'),isBuggy=false,propName='_countedByPrototype',value='x'
el[propName]=value;isBuggy=(el.getAttribute(propName)===value);el=null;return isBuggy;})();return PROPERTIES_ATTRIBUTES_MAP?function(nodes){for(var i=0,node;node=nodes[i];i++)
node.removeAttribute('_countedByPrototype');return nodes;}:function(nodes){for(var i=0,node;node=nodes[i];i++)
node._countedByPrototype=void 0;return nodes;}})(),index:function(parentNode,reverse,ofType){parentNode._countedByPrototype=Prototype.emptyFunction;if(reverse){for(var nodes=parentNode.childNodes,i=nodes.length-1,j=1;i>=0;i--){var node=nodes[i];if(node.nodeType==1&&(!ofType||node._countedByPrototype))node.nodeIndex=j++;}}else{for(var i=0,j=1,nodes=parentNode.childNodes;node=nodes[i];i++)
if(node.nodeType==1&&(!ofType||node._countedByPrototype))node.nodeIndex=j++;}},unique:function(nodes){if(nodes.length==0)return nodes;var results=[],n;for(var i=0,l=nodes.length;i<l;i++)
if(typeof(n=nodes[i])._countedByPrototype=='undefined'){n._countedByPrototype=Prototype.emptyFunction;results.push(Element.extend(n));}
return Selector.handlers.unmark(results);},descendant:function(nodes){var h=Selector.handlers;for(var i=0,results=[],node;node=nodes[i];i++)
h.concat(results,node.getElementsByTagName('*'));return results;},child:function(nodes){var h=Selector.handlers;for(var i=0,results=[],node;node=nodes[i];i++){for(var j=0,child;child=node.childNodes[j];j++)
if(child.nodeType==1&&child.tagName!='!')results.push(child);}
return results;},adjacent:function(nodes){for(var i=0,results=[],node;node=nodes[i];i++){var next=this.nextElementSibling(node);if(next)results.push(next);}
return results;},laterSibling:function(nodes){var h=Selector.handlers;for(var i=0,results=[],node;node=nodes[i];i++)
h.concat(results,Element.nextSiblings(node));return results;},nextElementSibling:function(node){while(node=node.nextSibling)
if(node.nodeType==1)return node;return null;},previousElementSibling:function(node){while(node=node.previousSibling)
if(node.nodeType==1)return node;return null;},tagName:function(nodes,root,tagName,combinator){var uTagName=tagName.toUpperCase();var results=[],h=Selector.handlers;if(nodes){if(combinator){if(combinator=="descendant"){for(var i=0,node;node=nodes[i];i++)
h.concat(results,node.getElementsByTagName(tagName));return results;}else nodes=this[combinator](nodes);if(tagName=="*")return nodes;}
for(var i=0,node;node=nodes[i];i++)
if(node.tagName.toUpperCase()===uTagName)results.push(node);return results;}else return root.getElementsByTagName(tagName);},id:function(nodes,root,id,combinator){var targetNode=$(id),h=Selector.handlers;if(root==document){if(!targetNode)return[];if(!nodes)return[targetNode];}else{if(!root.sourceIndex||root.sourceIndex<1){var nodes=root.getElementsByTagName('*');for(var j=0,node;node=nodes[j];j++){if(node.id===id)return[node];}}}
if(nodes){if(combinator){if(combinator=='child'){for(var i=0,node;node=nodes[i];i++)
if(targetNode.parentNode==node)return[targetNode];}else if(combinator=='descendant'){for(var i=0,node;node=nodes[i];i++)
if(Element.descendantOf(targetNode,node))return[targetNode];}else if(combinator=='adjacent'){for(var i=0,node;node=nodes[i];i++)
if(Selector.handlers.previousElementSibling(targetNode)==node)
return[targetNode];}else nodes=h[combinator](nodes);}
for(var i=0,node;node=nodes[i];i++)
if(node==targetNode)return[targetNode];return[];}
return(targetNode&&Element.descendantOf(targetNode,root))?[targetNode]:[];},className:function(nodes,root,className,combinator){if(nodes&&combinator)nodes=this[combinator](nodes);return Selector.handlers.byClassName(nodes,root,className);},byClassName:function(nodes,root,className){if(!nodes)nodes=Selector.handlers.descendant([root]);var needle=' '+className+' ';for(var i=0,results=[],node,nodeClassName;node=nodes[i];i++){nodeClassName=node.className;if(nodeClassName.length==0)continue;if(nodeClassName==className||(' '+nodeClassName+' ').include(needle))
results.push(node);}
return results;},attrPresence:function(nodes,root,attr,combinator){if(!nodes)nodes=root.getElementsByTagName("*");if(nodes&&combinator)nodes=this[combinator](nodes);var results=[];for(var i=0,node;node=nodes[i];i++)
if(Element.hasAttribute(node,attr))results.push(node);return results;},attr:function(nodes,root,attr,value,operator,combinator){if(!nodes)nodes=root.getElementsByTagName("*");if(nodes&&combinator)nodes=this[combinator](nodes);var handler=Selector.operators[operator],results=[];for(var i=0,node;node=nodes[i];i++){var nodeValue=Element.readAttribute(node,attr);if(nodeValue===null)continue;if(handler(nodeValue,value))results.push(node);}
return results;},pseudo:function(nodes,name,value,root,combinator){if(nodes&&combinator)nodes=this[combinator](nodes);if(!nodes)nodes=root.getElementsByTagName("*");return Selector.pseudos[name](nodes,value,root);}},pseudos:{'first-child':function(nodes,value,root){for(var i=0,results=[],node;node=nodes[i];i++){if(Selector.handlers.previousElementSibling(node))continue;results.push(node);}
return results;},'last-child':function(nodes,value,root){for(var i=0,results=[],node;node=nodes[i];i++){if(Selector.handlers.nextElementSibling(node))continue;results.push(node);}
return results;},'only-child':function(nodes,value,root){var h=Selector.handlers;for(var i=0,results=[],node;node=nodes[i];i++)
if(!h.previousElementSibling(node)&&!h.nextElementSibling(node))
results.push(node);return results;},'nth-child':function(nodes,formula,root){return Selector.pseudos.nth(nodes,formula,root);},'nth-last-child':function(nodes,formula,root){return Selector.pseudos.nth(nodes,formula,root,true);},'nth-of-type':function(nodes,formula,root){return Selector.pseudos.nth(nodes,formula,root,false,true);},'nth-last-of-type':function(nodes,formula,root){return Selector.pseudos.nth(nodes,formula,root,true,true);},'first-of-type':function(nodes,formula,root){return Selector.pseudos.nth(nodes,"1",root,false,true);},'last-of-type':function(nodes,formula,root){return Selector.pseudos.nth(nodes,"1",root,true,true);},'only-of-type':function(nodes,formula,root){var p=Selector.pseudos;return p['last-of-type'](p['first-of-type'](nodes,formula,root),formula,root);},getIndices:function(a,b,total){if(a==0)return b>0?[b]:[];return $R(1,total).inject([],function(memo,i){if(0==(i-b)%a&&(i-b)/a>=0)memo.push(i);return memo;});},nth:function(nodes,formula,root,reverse,ofType){if(nodes.length==0)return[];if(formula=='even')formula='2n+0';if(formula=='odd')formula='2n+1';var h=Selector.handlers,results=[],indexed=[],m;h.mark(nodes);for(var i=0,node;node=nodes[i];i++){if(!node.parentNode._countedByPrototype){h.index(node.parentNode,reverse,ofType);indexed.push(node.parentNode);}}
if(formula.match(/^\d+$/)){formula=Number(formula);for(var i=0,node;node=nodes[i];i++)
if(node.nodeIndex==formula)results.push(node);}else if(m=formula.match(/^(-?\d*)?n(([+-])(\d+))?/)){if(m[1]=="-")m[1]=-1;var a=m[1]?Number(m[1]):1;var b=m[2]?Number(m[2]):0;var indices=Selector.pseudos.getIndices(a,b,nodes.length);for(var i=0,node,l=indices.length;node=nodes[i];i++){for(var j=0;j<l;j++)
if(node.nodeIndex==indices[j])results.push(node);}}
h.unmark(nodes);h.unmark(indexed);return results;},'empty':function(nodes,value,root){for(var i=0,results=[],node;node=nodes[i];i++){if(node.tagName=='!'||node.firstChild)continue;results.push(node);}
return results;},'not':function(nodes,selector,root){var h=Selector.handlers,selectorType,m;var exclusions=new Selector(selector).findElements(root);h.mark(exclusions);for(var i=0,results=[],node;node=nodes[i];i++)
if(!node._countedByPrototype)results.push(node);h.unmark(exclusions);return results;},'enabled':function(nodes,value,root){for(var i=0,results=[],node;node=nodes[i];i++)
if(!node.disabled&&(!node.type||node.type!=='hidden'))
results.push(node);return results;},'disabled':function(nodes,value,root){for(var i=0,results=[],node;node=nodes[i];i++)
if(node.disabled)results.push(node);return results;},'checked':function(nodes,value,root){for(var i=0,results=[],node;node=nodes[i];i++)
if(node.checked)results.push(node);return results;}},operators:{'=':function(nv,v){return nv==v;},'!=':function(nv,v){return nv!=v;},'^=':function(nv,v){return nv==v||nv&&nv.startsWith(v);},'$=':function(nv,v){return nv==v||nv&&nv.endsWith(v);},'*=':function(nv,v){return nv==v||nv&&nv.include(v);},'~=':function(nv,v){return(' '+nv+' ').include(' '+v+' ');},'|=':function(nv,v){return('-'+(nv||"").toUpperCase()+'-').include('-'+(v||"").toUpperCase()+'-');}},split:function(expression){var expressions=[];expression.scan(/(([\w#:.~>+()\s-]+|\*|\[.*?\])+)\s*(,|$)/,function(m){expressions.push(m[1].strip());});return expressions;},matchElements:function(elements,expression){var matches=$$(expression),h=Selector.handlers;h.mark(matches);for(var i=0,results=[],element;element=elements[i];i++)
if(element._countedByPrototype)results.push(element);h.unmark(matches);return results;},findElement:function(elements,expression,index){if(Object.isNumber(expression)){index=expression;expression=false;}
return Selector.matchElements(elements,expression||'*')[index||0];},findChildElements:function(element,expressions){expressions=Selector.split(expressions.join(','));var results=[],h=Selector.handlers;for(var i=0,l=expressions.length,selector;i<l;i++){selector=new Selector(expressions[i].strip());h.concat(results,selector.findElements(element));}
return(l>1)?h.unique(results):results;}});if(Prototype.Browser.IE){Object.extend(Selector.handlers,{concat:function(a,b){for(var i=0,node;node=b[i];i++)
if(node.tagName!=="!")a.push(node);return a;}});}
function $$(){return Selector.findChildElements(document,$A(arguments));}
var Form={reset:function(form){form=$(form);form.reset();return form;},serializeElements:function(elements,options){if(typeof options!='object')options={hash:!!options};else if(Object.isUndefined(options.hash))options.hash=true;var key,value,submitted=false,submit=options.submit;var data=elements.inject({},function(result,element){if(!element.disabled&&element.name){key=element.name;value=$(element).getValue();if(value!=null&&element.type!='file'&&(element.type!='submit'||(!submitted&&submit!==false&&(!submit||key==submit)&&(submitted=true)))){if(key in result){if(!Object.isArray(result[key]))result[key]=[result[key]];result[key].push(value);}
else result[key]=value;}}
return result;});return options.hash?data:Object.toQueryString(data);}};Form.Methods={serialize:function(form,options){return Form.serializeElements(Form.getElements(form),options);},getElements:function(form){var elements=$(form).getElementsByTagName('*'),element,arr=[],serializers=Form.Element.Serializers;for(var i=0;element=elements[i];i++){arr.push(element);}
return arr.inject([],function(elements,child){if(serializers[child.tagName.toLowerCase()])
elements.push(Element.extend(child));return elements;})},getInputs:function(form,typeName,name){form=$(form);var inputs=form.getElementsByTagName('input');if(!typeName&&!name)return $A(inputs).map(Element.extend);for(var i=0,matchingInputs=[],length=inputs.length;i<length;i++){var input=inputs[i];if((typeName&&input.type!=typeName)||(name&&input.name!=name))
continue;matchingInputs.push(Element.extend(input));}
return matchingInputs;},disable:function(form){form=$(form);Form.getElements(form).invoke('disable');return form;},enable:function(form){form=$(form);Form.getElements(form).invoke('enable');return form;},findFirstElement:function(form){var elements=$(form).getElements().findAll(function(element){return'hidden'!=element.type&&!element.disabled;});var firstByIndex=elements.findAll(function(element){return element.hasAttribute('tabIndex')&&element.tabIndex>=0;}).sortBy(function(element){return element.tabIndex}).first();return firstByIndex?firstByIndex:elements.find(function(element){return/^(?:input|select|textarea)$/i.test(element.tagName);});},focusFirstElement:function(form){form=$(form);form.findFirstElement().activate();return form;},request:function(form,options){form=$(form),options=Object.clone(options||{});var params=options.parameters,action=form.readAttribute('action')||'';if(action.blank())action=window.location.href;options.parameters=form.serialize(true);if(params){if(Object.isString(params))params=params.toQueryParams();Object.extend(options.parameters,params);}
if(form.hasAttribute('method')&&!options.method)
options.method=form.method;return new Ajax.Request(action,options);}};Form.Element={focus:function(element){$(element).focus();return element;},select:function(element){$(element).select();return element;}};Form.Element.Methods={serialize:function(element){element=$(element);if(!element.disabled&&element.name){var value=element.getValue();if(value!=undefined){var pair={};pair[element.name]=value;return Object.toQueryString(pair);}}
return'';},getValue:function(element){element=$(element);var method=element.tagName.toLowerCase();return Form.Element.Serializers[method](element);},setValue:function(element,value){element=$(element);var method=element.tagName.toLowerCase();Form.Element.Serializers[method](element,value);return element;},clear:function(element){$(element).value='';return element;},present:function(element){return $(element).value!='';},activate:function(element){element=$(element);try{element.focus();if(element.select&&(element.tagName.toLowerCase()!='input'||!(/^(?:button|reset|submit)$/i.test(element.type))))
element.select();}catch(e){}
return element;},disable:function(element){element=$(element);element.disabled=true;return element;},enable:function(element){element=$(element);element.disabled=false;return element;}};var Field=Form.Element;var $F=Form.Element.Methods.getValue;Form.Element.Serializers={input:function(element,value){switch(element.type.toLowerCase()){case'checkbox':case'radio':return Form.Element.Serializers.inputSelector(element,value);default:return Form.Element.Serializers.textarea(element,value);}},inputSelector:function(element,value){if(Object.isUndefined(value))return element.checked?element.value:null;else element.checked=!!value;},textarea:function(element,value){if(Object.isUndefined(value))return element.value;else element.value=value;},select:function(element,value){if(Object.isUndefined(value))
return this[element.type=='select-one'?'selectOne':'selectMany'](element);else{var opt,currentValue,single=!Object.isArray(value);for(var i=0,length=element.length;i<length;i++){opt=element.options[i];currentValue=this.optionValue(opt);if(single){if(currentValue==value){opt.selected=true;return;}}
else opt.selected=value.include(currentValue);}}},selectOne:function(element){var index=element.selectedIndex;return index>=0?this.optionValue(element.options[index]):null;},selectMany:function(element){var values,length=element.length;if(!length)return null;for(var i=0,values=[];i<length;i++){var opt=element.options[i];if(opt.selected)values.push(this.optionValue(opt));}
return values;},optionValue:function(opt){return Element.extend(opt).hasAttribute('value')?opt.value:opt.text;}};Abstract.TimedObserver=Class.create(PeriodicalExecuter,{initialize:function($super,element,frequency,callback){$super(callback,frequency);this.element=$(element);this.lastValue=this.getValue();},execute:function(){var value=this.getValue();if(Object.isString(this.lastValue)&&Object.isString(value)?this.lastValue!=value:String(this.lastValue)!=String(value)){this.callback(this.element,value);this.lastValue=value;}}});Form.Element.Observer=Class.create(Abstract.TimedObserver,{getValue:function(){return Form.Element.getValue(this.element);}});Form.Observer=Class.create(Abstract.TimedObserver,{getValue:function(){return Form.serialize(this.element);}});Abstract.EventObserver=Class.create({initialize:function(element,callback){this.element=$(element);this.callback=callback;this.lastValue=this.getValue();if(this.element.tagName.toLowerCase()=='form')
this.registerFormCallbacks();else
this.registerCallback(this.element);},onElementEvent:function(){var value=this.getValue();if(this.lastValue!=value){this.callback(this.element,value);this.lastValue=value;}},registerFormCallbacks:function(){Form.getElements(this.element).each(this.registerCallback,this);},registerCallback:function(element){if(element.type){switch(element.type.toLowerCase()){case'checkbox':case'radio':Event.observe(element,'click',this.onElementEvent.bind(this));break;default:Event.observe(element,'change',this.onElementEvent.bind(this));break;}}}});Form.Element.EventObserver=Class.create(Abstract.EventObserver,{getValue:function(){return Form.Element.getValue(this.element);}});Form.EventObserver=Class.create(Abstract.EventObserver,{getValue:function(){return Form.serialize(this.element);}});(function(){var Event={KEY_BACKSPACE:8,KEY_TAB:9,KEY_RETURN:13,KEY_ESC:27,KEY_LEFT:37,KEY_UP:38,KEY_RIGHT:39,KEY_DOWN:40,KEY_DELETE:46,KEY_HOME:36,KEY_END:35,KEY_PAGEUP:33,KEY_PAGEDOWN:34,KEY_INSERT:45,cache:{}};var docEl=document.documentElement;var MOUSEENTER_MOUSELEAVE_EVENTS_SUPPORTED='onmouseenter'in docEl&&'onmouseleave'in docEl;var _isButton;if(Prototype.Browser.IE){var buttonMap={0:1,1:4,2:2};_isButton=function(event,code){return event.button===buttonMap[code];};}else if(Prototype.Browser.WebKit){_isButton=function(event,code){switch(code){case 0:return event.which==1&&!event.metaKey;case 1:return event.which==1&&event.metaKey;default:return false;}};}else{_isButton=function(event,code){return event.which?(event.which===code+1):(event.button===code);};}
function isLeftClick(event){return _isButton(event,0)}
function isMiddleClick(event){return _isButton(event,1)}
function isRightClick(event){return _isButton(event,2)}
function element(event){event=Event.extend(event);var node=event.target,type=event.type,currentTarget=event.currentTarget;if(currentTarget&&currentTarget.tagName){if(type==='load'||type==='error'||(type==='click'&&currentTarget.tagName.toLowerCase()==='input'&&currentTarget.type==='radio'))
node=currentTarget;}
if(node.nodeType==Node.TEXT_NODE)
node=node.parentNode;return Element.extend(node);}
function findElement(event,expression){var element=Event.element(event);if(!expression)return element;var elements=[element].concat(element.ancestors());return Selector.findElement(elements,expression,0);}
function pointer(event){return{x:pointerX(event),y:pointerY(event)};}
function pointerX(event){var docElement=document.documentElement,body=document.body||{scrollLeft:0};return event.pageX||(event.clientX+
(docElement.scrollLeft||body.scrollLeft)-
(docElement.clientLeft||0));}
function pointerY(event){var docElement=document.documentElement,body=document.body||{scrollTop:0};return event.pageY||(event.clientY+
(docElement.scrollTop||body.scrollTop)-
(docElement.clientTop||0));}
function stop(event){Event.extend(event);event.preventDefault();event.stopPropagation();event.stopped=true;}
Event.Methods={isLeftClick:isLeftClick,isMiddleClick:isMiddleClick,isRightClick:isRightClick,element:element,findElement:findElement,pointer:pointer,pointerX:pointerX,pointerY:pointerY,stop:stop};var methods=Object.keys(Event.Methods).inject({},function(m,name){m[name]=Event.Methods[name].methodize();return m;});if(Prototype.Browser.IE){function _relatedTarget(event){var element;switch(event.type){case'mouseover':element=event.fromElement;break;case'mouseout':element=event.toElement;break;default:return null;}
return Element.extend(element);}
Object.extend(methods,{stopPropagation:function(){this.cancelBubble=true},preventDefault:function(){this.returnValue=false},inspect:function(){return'[object Event]'}});Event.extend=function(event,element){if(!event)return false;if(event._extendedByPrototype)return event;event._extendedByPrototype=Prototype.emptyFunction;var pointer=Event.pointer(event);Object.extend(event,{target:event.srcElement||element,relatedTarget:_relatedTarget(event),pageX:pointer.x,pageY:pointer.y});return Object.extend(event,methods);};}else{Event.prototype=window.Event.prototype||document.createEvent('HTMLEvents').__proto__;Object.extend(Event.prototype,methods);Event.extend=Prototype.K;}
function _createResponder(element,eventName,handler){var registry=Element.retrieve(element,'prototype_event_registry');if(Object.isUndefined(registry)){CACHE.push(element);registry=Element.retrieve(element,'prototype_event_registry',$H());}
var respondersForEvent=registry.get(eventName);if(Object.isUndefined(respondersForEvent)){respondersForEvent=[];registry.set(eventName,respondersForEvent);}
if(respondersForEvent.pluck('handler').include(handler))return false;var responder;if(eventName.include(":")){responder=function(event){if(Object.isUndefined(event.eventName))
return false;if(event.eventName!==eventName)
return false;Event.extend(event,element);handler.call(element,event);};}else{if(!MOUSEENTER_MOUSELEAVE_EVENTS_SUPPORTED&&(eventName==="mouseenter"||eventName==="mouseleave")){if(eventName==="mouseenter"||eventName==="mouseleave"){responder=function(event){Event.extend(event,element);var parent=event.relatedTarget;while(parent&&parent!==element){try{parent=parent.parentNode;}
catch(e){parent=element;}}
if(parent===element)return;handler.call(element,event);};}}else{responder=function(event){Event.extend(event,element);handler.call(element,event);};}}
responder.handler=handler;respondersForEvent.push(responder);return responder;}
function _destroyCache(){for(var i=0,length=CACHE.length;i<length;i++){Event.stopObserving(CACHE[i]);CACHE[i]=null;}}
var CACHE=[];if(Prototype.Browser.IE)
window.attachEvent('onunload',_destroyCache);if(Prototype.Browser.WebKit)
window.addEventListener('unload',Prototype.emptyFunction,false);var _getDOMEventName=Prototype.K;if(!MOUSEENTER_MOUSELEAVE_EVENTS_SUPPORTED){_getDOMEventName=function(eventName){var translations={mouseenter:"mouseover",mouseleave:"mouseout"};return eventName in translations?translations[eventName]:eventName;};}
function observe(element,eventName,handler){element=$(element);var responder=_createResponder(element,eventName,handler);if(!responder)return element;if(eventName.include(':')){if(element.addEventListener)
element.addEventListener("dataavailable",responder,false);else{element.attachEvent("ondataavailable",responder);element.attachEvent("onfilterchange",responder);}}else{var actualEventName=_getDOMEventName(eventName);if(element.addEventListener)
element.addEventListener(actualEventName,responder,false);else
element.attachEvent("on"+actualEventName,responder);}
return element;}
function stopObserving(element,eventName,handler){element=$(element);var registry=Element.retrieve(element,'prototype_event_registry');if(Object.isUndefined(registry))return element;if(eventName&&!handler){var responders=registry.get(eventName);if(Object.isUndefined(responders))return element;responders.each(function(r){Element.stopObserving(element,eventName,r.handler);});return element;}else if(!eventName){registry.each(function(pair){var eventName=pair.key,responders=pair.value;responders.each(function(r){Element.stopObserving(element,eventName,r.handler);});});return element;}
var responders=registry.get(eventName);if(!responders)return;var responder=responders.find(function(r){return r.handler===handler;});if(!responder)return element;var actualEventName=_getDOMEventName(eventName);if(eventName.include(':')){if(element.removeEventListener)
element.removeEventListener("dataavailable",responder,false);else{element.detachEvent("ondataavailable",responder);element.detachEvent("onfilterchange",responder);}}else{if(element.removeEventListener)
element.removeEventListener(actualEventName,responder,false);else
element.detachEvent('on'+actualEventName,responder);}
registry.set(eventName,responders.without(responder));return element;}
function fire(element,eventName,memo,bubble){element=$(element);if(Object.isUndefined(bubble))
bubble=true;if(element==document&&document.createEvent&&!element.dispatchEvent)
element=document.documentElement;var event;if(document.createEvent){event=document.createEvent('HTMLEvents');event.initEvent('dataavailable',true,true);}else{event=document.createEventObject();event.eventType=bubble?'ondataavailable':'onfilterchange';}
event.eventName=eventName;event.memo=memo||{};if(document.createEvent)
element.dispatchEvent(event);else
element.fireEvent(event.eventType,event);return Event.extend(event);}
Object.extend(Event,Event.Methods);Object.extend(Event,{fire:fire,observe:observe,stopObserving:stopObserving});Element.addMethods({fire:fire,observe:observe,stopObserving:stopObserving});Object.extend(document,{fire:fire.methodize(),observe:observe.methodize(),stopObserving:stopObserving.methodize(),loaded:false});if(window.Event)Object.extend(window.Event,Event);else window.Event=Event;})();(function(){var timer;function fireContentLoadedEvent(){if(document.loaded)return;if(timer)window.clearTimeout(timer);document.loaded=true;document.fire('dom:loaded');}
function checkReadyState(){if(document.readyState==='complete'){document.stopObserving('readystatechange',checkReadyState);fireContentLoadedEvent();}}
function pollDoScroll(){try{document.documentElement.doScroll('left');}
catch(e){timer=pollDoScroll.defer();return;}
fireContentLoadedEvent();}
if(document.addEventListener){document.addEventListener('DOMContentLoaded',fireContentLoadedEvent,false);}else{document.observe('readystatechange',checkReadyState);if(window==top)
timer=pollDoScroll.defer();}
Event.observe(window,'load',fireContentLoadedEvent);})();Element.addMethods();Hash.toQueryString=Object.toQueryString;var Toggle={display:Element.toggle};Element.Methods.childOf=Element.Methods.descendantOf;var Insertion={Before:function(element,content){return Element.insert(element,{before:content});},Top:function(element,content){return Element.insert(element,{top:content});},Bottom:function(element,content){return Element.insert(element,{bottom:content});},After:function(element,content){return Element.insert(element,{after:content});}};var $continue=new Error('"throw $continue" is deprecated, use "return" instead');var Position={includeScrollOffsets:false,prepare:function(){this.deltaX=window.pageXOffset||document.documentElement.scrollLeft||document.body.scrollLeft||0;this.deltaY=window.pageYOffset||document.documentElement.scrollTop||document.body.scrollTop||0;},within:function(element,x,y){if(this.includeScrollOffsets)
return this.withinIncludingScrolloffsets(element,x,y);this.xcomp=x;this.ycomp=y;this.offset=Element.cumulativeOffset(element);return(y>=this.offset[1]&&y<this.offset[1]+element.offsetHeight&&x>=this.offset[0]&&x<this.offset[0]+element.offsetWidth);},withinIncludingScrolloffsets:function(element,x,y){var offsetcache=Element.cumulativeScrollOffset(element);this.xcomp=x+offsetcache[0]-this.deltaX;this.ycomp=y+offsetcache[1]-this.deltaY;this.offset=Element.cumulativeOffset(element);return(this.ycomp>=this.offset[1]&&this.ycomp<this.offset[1]+element.offsetHeight&&this.xcomp>=this.offset[0]&&this.xcomp<this.offset[0]+element.offsetWidth);},overlap:function(mode,element){if(!mode)return 0;if(mode=='vertical')
return((this.offset[1]+element.offsetHeight)-this.ycomp)/element.offsetHeight;if(mode=='horizontal')
return((this.offset[0]+element.offsetWidth)-this.xcomp)/element.offsetWidth;},cumulativeOffset:Element.Methods.cumulativeOffset,positionedOffset:Element.Methods.positionedOffset,absolutize:function(element){Position.prepare();return Element.absolutize(element);},relativize:function(element){Position.prepare();return Element.relativize(element);},realOffset:Element.Methods.cumulativeScrollOffset,offsetParent:Element.Methods.getOffsetParent,page:Element.Methods.viewportOffset,clone:function(source,target,options){options=options||{};return Element.clonePosition(target,source,options);}};if(!document.getElementsByClassName)document.getElementsByClassName=function(instanceMethods){function iter(name){return name.blank()?null:"[contains(concat(' ', @class, ' '), ' "+name+" ')]";}
instanceMethods.getElementsByClassName=Prototype.BrowserFeatures.XPath?function(element,className){className=className.toString().strip();var cond=/\s/.test(className)?$w(className).map(iter).join(''):iter(className);return cond?document._getElementsByXPath('.//*'+cond,element):[];}:function(element,className){className=className.toString().strip();var elements=[],classNames=(/\s/.test(className)?$w(className):null);if(!classNames&&!className)return elements;var nodes=$(element).getElementsByTagName('*');className=' '+className+' ';for(var i=0,child,cn;child=nodes[i];i++){if(child.className&&(cn=' '+child.className+' ')&&(cn.include(className)||(classNames&&classNames.all(function(name){return!name.toString().blank()&&cn.include(' '+name+' ');}))))
elements.push(Element.extend(child));}
return elements;};return function(className,parentElement){return $(parentElement||document.body).getElementsByClassName(className);};}(Element.Methods);Element.ClassNames=Class.create();Element.ClassNames.prototype={initialize:function(element){this.element=$(element);},_each:function(iterator){this.element.className.split(/\s+/).select(function(name){return name.length>0;})._each(iterator);},set:function(className){this.element.className=className;},add:function(classNameToAdd){if(this.include(classNameToAdd))return;this.set($A(this).concat(classNameToAdd).join(' '));},remove:function(classNameToRemove){if(!this.include(classNameToRemove))return;this.set($A(this).without(classNameToRemove).join(' '));},toString:function(){return $A(this).join(' ');}};Object.extend(Element.ClassNames.prototype,Enumerable);String.prototype.parseColor=function(){var color='#';if(this.slice(0,4)=='rgb('){var cols=this.slice(4,this.length-1).split(',');var i=0;do{color+=parseInt(cols[i]).toColorPart()}while(++i<3);}else{if(this.slice(0,1)=='#'){if(this.length==4)for(var i=1;i<4;i++)color+=(this.charAt(i)+this.charAt(i)).toLowerCase();if(this.length==7)color=this.toLowerCase();}}
return(color.length==7?color:(arguments[0]||this));};Element.collectTextNodes=function(element){return $A($(element).childNodes).collect(function(node){return(node.nodeType==3?node.nodeValue:(node.hasChildNodes()?Element.collectTextNodes(node):''));}).flatten().join('');};Element.collectTextNodesIgnoreClass=function(element,className){return $A($(element).childNodes).collect(function(node){return(node.nodeType==3?node.nodeValue:((node.hasChildNodes()&&!Element.hasClassName(node,className))?Element.collectTextNodesIgnoreClass(node,className):''));}).flatten().join('');};Element.setContentZoom=function(element,percent){element=$(element);element.setStyle({fontSize:(percent/100)+'em'});if(Prototype.Browser.WebKit)window.scrollBy(0,0);return element;};Element.getInlineOpacity=function(element){return $(element).style.opacity||'';};Element.forceRerendering=function(element){try{element=$(element);var n=document.createTextNode(' ');element.appendChild(n);element.removeChild(n);}catch(e){}};var Effect={_elementDoesNotExistError:{name:'ElementDoesNotExistError',message:'The specified DOM element does not exist, but is required for this effect to operate'},Transitions:{linear:Prototype.K,sinoidal:function(pos){return(-Math.cos(pos*Math.PI)/2)+.5;},reverse:function(pos){return 1-pos;},flicker:function(pos){var pos=((-Math.cos(pos*Math.PI)/4)+.75)+Math.random()/4;return pos>1?1:pos;},wobble:function(pos){return(-Math.cos(pos*Math.PI*(9*pos))/2)+.5;},pulse:function(pos,pulses){return(-Math.cos((pos*((pulses||5)-.5)*2)*Math.PI)/2)+.5;},spring:function(pos){return 1-(Math.cos(pos*4.5*Math.PI)*Math.exp(-pos*6));},none:function(pos){return 0;},full:function(pos){return 1;}},DefaultOptions:{duration:1.0,fps:100,sync:false,from:0.0,to:1.0,delay:0.0,queue:'parallel'},tagifyText:function(element){var tagifyStyle='position:relative';if(Prototype.Browser.IE)tagifyStyle+=';zoom:1';element=$(element);$A(element.childNodes).each(function(child){if(child.nodeType==3){child.nodeValue.toArray().each(function(character){element.insertBefore(new Element('span',{style:tagifyStyle}).update(character==' '?String.fromCharCode(160):character),child);});Element.remove(child);}});},multiple:function(element,effect){var elements;if(((typeof element=='object')||Object.isFunction(element))&&(element.length))
elements=element;else
elements=$(element).childNodes;var options=Object.extend({speed:0.1,delay:0.0},arguments[2]||{});var masterDelay=options.delay;$A(elements).each(function(element,index){new effect(element,Object.extend(options,{delay:index*options.speed+masterDelay}));});},PAIRS:{'slide':['SlideDown','SlideUp'],'blind':['BlindDown','BlindUp'],'appear':['Appear','Fade']},toggle:function(element,effect,options){element=$(element);effect=(effect||'appear').toLowerCase();return Effect[Effect.PAIRS[effect][element.visible()?1:0]](element,Object.extend({queue:{position:'end',scope:(element.id||'global'),limit:1}},options||{}));}};Effect.DefaultOptions.transition=Effect.Transitions.sinoidal;Effect.ScopedQueue=Class.create(Enumerable,{initialize:function(){this.effects=[];this.interval=null;},_each:function(iterator){this.effects._each(iterator);},add:function(effect){var timestamp=new Date().getTime();var position=Object.isString(effect.options.queue)?effect.options.queue:effect.options.queue.position;switch(position){case'front':this.effects.findAll(function(e){return e.state=='idle'}).each(function(e){e.startOn+=effect.finishOn;e.finishOn+=effect.finishOn;});break;case'with-last':timestamp=this.effects.pluck('startOn').max()||timestamp;break;case'end':timestamp=this.effects.pluck('finishOn').max()||timestamp;break;}
effect.startOn+=timestamp;effect.finishOn+=timestamp;if(!effect.options.queue.limit||(this.effects.length<effect.options.queue.limit))
this.effects.push(effect);if(!this.interval)
this.interval=setInterval(this.loop.bind(this),15);},remove:function(effect){this.effects=this.effects.reject(function(e){return e==effect});if(this.effects.length==0){clearInterval(this.interval);this.interval=null;}},loop:function(){var timePos=new Date().getTime();for(var i=0,len=this.effects.length;i<len;i++)
this.effects[i]&&this.effects[i].loop(timePos);}});Effect.Queues={instances:$H(),get:function(queueName){if(!Object.isString(queueName))return queueName;return this.instances.get(queueName)||this.instances.set(queueName,new Effect.ScopedQueue());}};Effect.Queue=Effect.Queues.get('global');Effect.Base=Class.create({position:null,start:function(options){if(options&&options.transition===false)options.transition=Effect.Transitions.linear;this.options=Object.extend(Object.extend({},Effect.DefaultOptions),options||{});this.currentFrame=0;this.state='idle';this.startOn=this.options.delay*1000;this.finishOn=this.startOn+(this.options.duration*1000);this.fromToDelta=this.options.to-this.options.from;this.totalTime=this.finishOn-this.startOn;this.totalFrames=this.options.fps*this.options.duration;this.render=(function(){function dispatch(effect,eventName){if(effect.options[eventName+'Internal'])
effect.options[eventName+'Internal'](effect);if(effect.options[eventName])
effect.options[eventName](effect);}
return function(pos){if(this.state==="idle"){this.state="running";dispatch(this,'beforeSetup');if(this.setup)this.setup();dispatch(this,'afterSetup');}
if(this.state==="running"){pos=(this.options.transition(pos)*this.fromToDelta)+this.options.from;this.position=pos;dispatch(this,'beforeUpdate');if(this.update)this.update(pos);dispatch(this,'afterUpdate');}};})();this.event('beforeStart');if(!this.options.sync)
Effect.Queues.get(Object.isString(this.options.queue)?'global':this.options.queue.scope).add(this);},loop:function(timePos){if(timePos>=this.startOn){if(timePos>=this.finishOn){this.render(1.0);this.cancel();this.event('beforeFinish');if(this.finish)this.finish();this.event('afterFinish');return;}
var pos=(timePos-this.startOn)/this.totalTime,frame=(pos*this.totalFrames).round();if(frame>this.currentFrame){this.render(pos);this.currentFrame=frame;}}},cancel:function(){if(!this.options.sync)
Effect.Queues.get(Object.isString(this.options.queue)?'global':this.options.queue.scope).remove(this);this.state='finished';},event:function(eventName){if(this.options[eventName+'Internal'])this.options[eventName+'Internal'](this);if(this.options[eventName])this.options[eventName](this);},inspect:function(){var data=$H();for(property in this)
if(!Object.isFunction(this[property]))data.set(property,this[property]);return'#<Effect:'+data.inspect()+',options:'+$H(this.options).inspect()+'>';}});Effect.Parallel=Class.create(Effect.Base,{initialize:function(effects){this.effects=effects||[];this.start(arguments[1]);},update:function(position){this.effects.invoke('render',position);},finish:function(position){this.effects.each(function(effect){effect.render(1.0);effect.cancel();effect.event('beforeFinish');if(effect.finish)effect.finish(position);effect.event('afterFinish');});}});Effect.Tween=Class.create(Effect.Base,{initialize:function(object,from,to){object=Object.isString(object)?$(object):object;var args=$A(arguments),method=args.last(),options=args.length==5?args[3]:null;this.method=Object.isFunction(method)?method.bind(object):Object.isFunction(object[method])?object[method].bind(object):function(value){object[method]=value};this.start(Object.extend({from:from,to:to},options||{}));},update:function(position){this.method(position);}});Effect.Event=Class.create(Effect.Base,{initialize:function(){this.start(Object.extend({duration:0},arguments[0]||{}));},update:Prototype.emptyFunction});Effect.Opacity=Class.create(Effect.Base,{initialize:function(element){this.element=$(element);if(!this.element)throw(Effect._elementDoesNotExistError);if(Prototype.Browser.IE&&(!this.element.currentStyle.hasLayout))
this.element.setStyle({zoom:1});var options=Object.extend({from:this.element.getOpacity()||0.0,to:1.0},arguments[1]||{});this.start(options);},update:function(position){this.element.setOpacity(position);}});Effect.Move=Class.create(Effect.Base,{initialize:function(element){this.element=$(element);if(!this.element)throw(Effect._elementDoesNotExistError);var options=Object.extend({x:0,y:0,mode:'relative'},arguments[1]||{});this.start(options);},setup:function(){this.element.makePositioned();this.originalLeft=parseFloat(this.element.getStyle('left')||'0');this.originalTop=parseFloat(this.element.getStyle('top')||'0');if(this.options.mode=='absolute'){this.options.x=this.options.x-this.originalLeft;this.options.y=this.options.y-this.originalTop;}},update:function(position){this.element.setStyle({left:(this.options.x*position+this.originalLeft).round()+'px',top:(this.options.y*position+this.originalTop).round()+'px'});}});Effect.MoveBy=function(element,toTop,toLeft){return new Effect.Move(element,Object.extend({x:toLeft,y:toTop},arguments[3]||{}));};Effect.Scale=Class.create(Effect.Base,{initialize:function(element,percent){this.element=$(element);if(!this.element)throw(Effect._elementDoesNotExistError);var options=Object.extend({scaleX:true,scaleY:true,scaleContent:true,scaleFromCenter:false,scaleMode:'box',scaleFrom:100.0,scaleTo:percent},arguments[2]||{});this.start(options);},setup:function(){this.restoreAfterFinish=this.options.restoreAfterFinish||false;this.elementPositioning=this.element.getStyle('position');this.originalStyle={};['top','left','width','height','fontSize'].each(function(k){this.originalStyle[k]=this.element.style[k];}.bind(this));this.originalTop=this.element.offsetTop;this.originalLeft=this.element.offsetLeft;var fontSize=this.element.getStyle('font-size')||'100%';['em','px','%','pt'].each(function(fontSizeType){if(fontSize.indexOf(fontSizeType)>0){this.fontSize=parseFloat(fontSize);this.fontSizeType=fontSizeType;}}.bind(this));this.factor=(this.options.scaleTo-this.options.scaleFrom)/100;this.dims=null;if(this.options.scaleMode=='box')
this.dims=[this.element.offsetHeight,this.element.offsetWidth];if(/^content/.test(this.options.scaleMode))
this.dims=[this.element.scrollHeight,this.element.scrollWidth];if(!this.dims)
this.dims=[this.options.scaleMode.originalHeight,this.options.scaleMode.originalWidth];},update:function(position){var currentScale=(this.options.scaleFrom/100.0)+(this.factor*position);if(this.options.scaleContent&&this.fontSize)
this.element.setStyle({fontSize:this.fontSize*currentScale+this.fontSizeType});this.setDimensions(this.dims[0]*currentScale,this.dims[1]*currentScale);},finish:function(position){if(this.restoreAfterFinish)this.element.setStyle(this.originalStyle);},setDimensions:function(height,width){var d={};if(this.options.scaleX)d.width=width.round()+'px';if(this.options.scaleY)d.height=height.round()+'px';if(this.options.scaleFromCenter){var topd=(height-this.dims[0])/2;var leftd=(width-this.dims[1])/2;if(this.elementPositioning=='absolute'){if(this.options.scaleY)d.top=this.originalTop-topd+'px';if(this.options.scaleX)d.left=this.originalLeft-leftd+'px';}else{if(this.options.scaleY)d.top=-topd+'px';if(this.options.scaleX)d.left=-leftd+'px';}}
this.element.setStyle(d);}});Effect.Highlight=Class.create(Effect.Base,{initialize:function(element){this.element=$(element);if(!this.element)throw(Effect._elementDoesNotExistError);var options=Object.extend({startcolor:'#ffff99'},arguments[1]||{});this.start(options);},setup:function(){if(this.element.getStyle('display')=='none'){this.cancel();return;}
this.oldStyle={};if(!this.options.keepBackgroundImage){this.oldStyle.backgroundImage=this.element.getStyle('background-image');this.element.setStyle({backgroundImage:'none'});}
if(!this.options.endcolor)
this.options.endcolor=this.element.getStyle('background-color').parseColor('#ffffff');if(!this.options.restorecolor)
this.options.restorecolor=this.element.getStyle('background-color');this._base=$R(0,2).map(function(i){return parseInt(this.options.startcolor.slice(i*2+1,i*2+3),16)}.bind(this));this._delta=$R(0,2).map(function(i){return parseInt(this.options.endcolor.slice(i*2+1,i*2+3),16)-this._base[i]}.bind(this));},update:function(position){this.element.setStyle({backgroundColor:$R(0,2).inject('#',function(m,v,i){return m+((this._base[i]+(this._delta[i]*position)).round().toColorPart());}.bind(this))});},finish:function(){this.element.setStyle(Object.extend(this.oldStyle,{backgroundColor:this.options.restorecolor}));}});Effect.ScrollTo=function(element){var options=arguments[1]||{},scrollOffsets=document.viewport.getScrollOffsets(),elementOffsets=$(element).cumulativeOffset();if(options.offset)elementOffsets[1]+=options.offset;return new Effect.Tween(null,scrollOffsets.top,elementOffsets[1],options,function(p){scrollTo(scrollOffsets.left,p.round());});};Effect.Fade=function(element){element=$(element);var oldOpacity=element.getInlineOpacity();var options=Object.extend({from:element.getOpacity()||1.0,to:0.0,afterFinishInternal:function(effect){if(effect.options.to!=0)return;effect.element.hide().setStyle({opacity:oldOpacity});}},arguments[1]||{});return new Effect.Opacity(element,options);};Effect.Appear=function(element){element=$(element);var options=Object.extend({from:(element.getStyle('display')=='none'?0.0:element.getOpacity()||0.0),to:1.0,afterFinishInternal:function(effect){effect.element.forceRerendering();},beforeSetup:function(effect){effect.element.setOpacity(effect.options.from).show();}},arguments[1]||{});return new Effect.Opacity(element,options);};Effect.Puff=function(element){element=$(element);var oldStyle={opacity:element.getInlineOpacity(),position:element.getStyle('position'),top:element.style.top,left:element.style.left,width:element.style.width,height:element.style.height};return new Effect.Parallel([new Effect.Scale(element,200,{sync:true,scaleFromCenter:true,scaleContent:true,restoreAfterFinish:true}),new Effect.Opacity(element,{sync:true,to:0.0})],Object.extend({duration:1.0,beforeSetupInternal:function(effect){Position.absolutize(effect.effects[0].element);},afterFinishInternal:function(effect){effect.effects[0].element.hide().setStyle(oldStyle);}},arguments[1]||{}));};Effect.BlindUp=function(element){element=$(element);element.makeClipping();return new Effect.Scale(element,0,Object.extend({scaleContent:false,scaleX:false,restoreAfterFinish:true,afterFinishInternal:function(effect){effect.element.hide().undoClipping();}},arguments[1]||{}));};Effect.BlindDown=function(element){element=$(element);var elementDimensions=element.getDimensions();return new Effect.Scale(element,100,Object.extend({scaleContent:false,scaleX:false,scaleFrom:0,scaleMode:{originalHeight:elementDimensions.height,originalWidth:elementDimensions.width},restoreAfterFinish:true,afterSetup:function(effect){effect.element.makeClipping().setStyle({height:'0px'}).show();},afterFinishInternal:function(effect){effect.element.undoClipping();}},arguments[1]||{}));};Effect.SwitchOff=function(element){element=$(element);var oldOpacity=element.getInlineOpacity();return new Effect.Appear(element,Object.extend({duration:0.4,from:0,transition:Effect.Transitions.flicker,afterFinishInternal:function(effect){new Effect.Scale(effect.element,1,{duration:0.3,scaleFromCenter:true,scaleX:false,scaleContent:false,restoreAfterFinish:true,beforeSetup:function(effect){effect.element.makePositioned().makeClipping();},afterFinishInternal:function(effect){effect.element.hide().undoClipping().undoPositioned().setStyle({opacity:oldOpacity});}});}},arguments[1]||{}));};Effect.DropOut=function(element){element=$(element);var oldStyle={top:element.getStyle('top'),left:element.getStyle('left'),opacity:element.getInlineOpacity()};return new Effect.Parallel([new Effect.Move(element,{x:0,y:100,sync:true}),new Effect.Opacity(element,{sync:true,to:0.0})],Object.extend({duration:0.5,beforeSetup:function(effect){effect.effects[0].element.makePositioned();},afterFinishInternal:function(effect){effect.effects[0].element.hide().undoPositioned().setStyle(oldStyle);}},arguments[1]||{}));};Effect.Shake=function(element){element=$(element);var options=Object.extend({distance:20,duration:0.5},arguments[1]||{});var distance=parseFloat(options.distance);var split=parseFloat(options.duration)/10.0;var oldStyle={top:element.getStyle('top'),left:element.getStyle('left')};return new Effect.Move(element,{x:distance,y:0,duration:split,afterFinishInternal:function(effect){new Effect.Move(effect.element,{x:-distance*2,y:0,duration:split*2,afterFinishInternal:function(effect){new Effect.Move(effect.element,{x:distance*2,y:0,duration:split*2,afterFinishInternal:function(effect){new Effect.Move(effect.element,{x:-distance*2,y:0,duration:split*2,afterFinishInternal:function(effect){new Effect.Move(effect.element,{x:distance*2,y:0,duration:split*2,afterFinishInternal:function(effect){new Effect.Move(effect.element,{x:-distance,y:0,duration:split,afterFinishInternal:function(effect){effect.element.undoPositioned().setStyle(oldStyle);}});}});}});}});}});}});};Effect.SlideDown=function(element){element=$(element).cleanWhitespace();var oldInnerBottom=element.down().getStyle('bottom');var elementDimensions=element.getDimensions();return new Effect.Scale(element,100,Object.extend({scaleContent:false,scaleX:false,scaleFrom:window.opera?0:1,scaleMode:{originalHeight:elementDimensions.height,originalWidth:elementDimensions.width},restoreAfterFinish:true,afterSetup:function(effect){effect.element.makePositioned();effect.element.down().makePositioned();if(window.opera)effect.element.setStyle({top:''});effect.element.makeClipping().setStyle({height:'0px'}).show();},afterUpdateInternal:function(effect){effect.element.down().setStyle({bottom:(effect.dims[0]-effect.element.clientHeight)+'px'});},afterFinishInternal:function(effect){effect.element.undoClipping().undoPositioned();effect.element.down().undoPositioned().setStyle({bottom:oldInnerBottom});}},arguments[1]||{}));};Effect.SlideUp=function(element){element=$(element).cleanWhitespace();var oldInnerBottom=element.down().getStyle('bottom');var elementDimensions=element.getDimensions();return new Effect.Scale(element,window.opera?0:1,Object.extend({scaleContent:false,scaleX:false,scaleMode:'box',scaleFrom:100,scaleMode:{originalHeight:elementDimensions.height,originalWidth:elementDimensions.width},restoreAfterFinish:true,afterSetup:function(effect){effect.element.makePositioned();effect.element.down().makePositioned();if(window.opera)effect.element.setStyle({top:''});effect.element.makeClipping().show();},afterUpdateInternal:function(effect){effect.element.down().setStyle({bottom:(effect.dims[0]-effect.element.clientHeight)+'px'});},afterFinishInternal:function(effect){effect.element.hide().undoClipping().undoPositioned();effect.element.down().undoPositioned().setStyle({bottom:oldInnerBottom});}},arguments[1]||{}));};Effect.Squish=function(element){return new Effect.Scale(element,window.opera?1:0,{restoreAfterFinish:true,beforeSetup:function(effect){effect.element.makeClipping();},afterFinishInternal:function(effect){effect.element.hide().undoClipping();}});};Effect.Grow=function(element){element=$(element);var options=Object.extend({direction:'center',moveTransition:Effect.Transitions.sinoidal,scaleTransition:Effect.Transitions.sinoidal,opacityTransition:Effect.Transitions.full},arguments[1]||{});var oldStyle={top:element.style.top,left:element.style.left,height:element.style.height,width:element.style.width,opacity:element.getInlineOpacity()};var dims=element.getDimensions();var initialMoveX,initialMoveY;var moveX,moveY;switch(options.direction){case'top-left':initialMoveX=initialMoveY=moveX=moveY=0;break;case'top-right':initialMoveX=dims.width;initialMoveY=moveY=0;moveX=-dims.width;break;case'bottom-left':initialMoveX=moveX=0;initialMoveY=dims.height;moveY=-dims.height;break;case'bottom-right':initialMoveX=dims.width;initialMoveY=dims.height;moveX=-dims.width;moveY=-dims.height;break;case'center':initialMoveX=dims.width/2;initialMoveY=dims.height/2;moveX=-dims.width/2;moveY=-dims.height/2;break;}
return new Effect.Move(element,{x:initialMoveX,y:initialMoveY,duration:0.01,beforeSetup:function(effect){effect.element.hide().makeClipping().makePositioned();},afterFinishInternal:function(effect){new Effect.Parallel([new Effect.Opacity(effect.element,{sync:true,to:1.0,from:0.0,transition:options.opacityTransition}),new Effect.Move(effect.element,{x:moveX,y:moveY,sync:true,transition:options.moveTransition}),new Effect.Scale(effect.element,100,{scaleMode:{originalHeight:dims.height,originalWidth:dims.width},sync:true,scaleFrom:window.opera?1:0,transition:options.scaleTransition,restoreAfterFinish:true})],Object.extend({beforeSetup:function(effect){effect.effects[0].element.setStyle({height:'0px'}).show();},afterFinishInternal:function(effect){effect.effects[0].element.undoClipping().undoPositioned().setStyle(oldStyle);}},options));}});};Effect.Shrink=function(element){element=$(element);var options=Object.extend({direction:'center',moveTransition:Effect.Transitions.sinoidal,scaleTransition:Effect.Transitions.sinoidal,opacityTransition:Effect.Transitions.none},arguments[1]||{});var oldStyle={top:element.style.top,left:element.style.left,height:element.style.height,width:element.style.width,opacity:element.getInlineOpacity()};var dims=element.getDimensions();var moveX,moveY;switch(options.direction){case'top-left':moveX=moveY=0;break;case'top-right':moveX=dims.width;moveY=0;break;case'bottom-left':moveX=0;moveY=dims.height;break;case'bottom-right':moveX=dims.width;moveY=dims.height;break;case'center':moveX=dims.width/2;moveY=dims.height/2;break;}
return new Effect.Parallel([new Effect.Opacity(element,{sync:true,to:0.0,from:1.0,transition:options.opacityTransition}),new Effect.Scale(element,window.opera?1:0,{sync:true,transition:options.scaleTransition,restoreAfterFinish:true}),new Effect.Move(element,{x:moveX,y:moveY,sync:true,transition:options.moveTransition})],Object.extend({beforeStartInternal:function(effect){effect.effects[0].element.makePositioned().makeClipping();},afterFinishInternal:function(effect){effect.effects[0].element.hide().undoClipping().undoPositioned().setStyle(oldStyle);}},options));};Effect.Pulsate=function(element){element=$(element);var options=arguments[1]||{},oldOpacity=element.getInlineOpacity(),transition=options.transition||Effect.Transitions.linear,reverser=function(pos){return 1-transition((-Math.cos((pos*(options.pulses||5)*2)*Math.PI)/2)+.5);};return new Effect.Opacity(element,Object.extend(Object.extend({duration:2.0,from:0,afterFinishInternal:function(effect){effect.element.setStyle({opacity:oldOpacity});}},options),{transition:reverser}));};Effect.Fold=function(element){element=$(element);var oldStyle={top:element.style.top,left:element.style.left,width:element.style.width,height:element.style.height};element.makeClipping();return new Effect.Scale(element,5,Object.extend({scaleContent:false,scaleX:false,afterFinishInternal:function(effect){new Effect.Scale(element,1,{scaleContent:false,scaleY:false,afterFinishInternal:function(effect){effect.element.hide().undoClipping().setStyle(oldStyle);}});}},arguments[1]||{}));};Effect.Morph=Class.create(Effect.Base,{initialize:function(element){this.element=$(element);if(!this.element)throw(Effect._elementDoesNotExistError);var options=Object.extend({style:{}},arguments[1]||{});if(!Object.isString(options.style))this.style=$H(options.style);else{if(options.style.include(':'))
this.style=options.style.parseStyle();else{this.element.addClassName(options.style);this.style=$H(this.element.getStyles());this.element.removeClassName(options.style);var css=this.element.getStyles();this.style=this.style.reject(function(style){return style.value==css[style.key];});options.afterFinishInternal=function(effect){effect.element.addClassName(effect.options.style);effect.transforms.each(function(transform){effect.element.style[transform.style]='';});};}}
this.start(options);},setup:function(){function parseColor(color){if(!color||['rgba(0, 0, 0, 0)','transparent'].include(color))color='#ffffff';color=color.parseColor();return $R(0,2).map(function(i){return parseInt(color.slice(i*2+1,i*2+3),16);});}
this.transforms=this.style.map(function(pair){var property=pair[0],value=pair[1],unit=null;if(value.parseColor('#zzzzzz')!='#zzzzzz'){value=value.parseColor();unit='color';}else if(property=='opacity'){value=parseFloat(value);if(Prototype.Browser.IE&&(!this.element.currentStyle.hasLayout))
this.element.setStyle({zoom:1});}else if(Element.CSS_LENGTH.test(value)){var components=value.match(/^([\+\-]?[0-9\.]+)(.*)$/);value=parseFloat(components[1]);unit=(components.length==3)?components[2]:null;}
var originalValue=this.element.getStyle(property);return{style:property.camelize(),originalValue:unit=='color'?parseColor(originalValue):parseFloat(originalValue||0),targetValue:unit=='color'?parseColor(value):value,unit:unit};}.bind(this)).reject(function(transform){return((transform.originalValue==transform.targetValue)||(transform.unit!='color'&&(isNaN(transform.originalValue)||isNaN(transform.targetValue))));});},update:function(position){var style={},transform,i=this.transforms.length;while(i--)
style[(transform=this.transforms[i]).style]=transform.unit=='color'?'#'+
(Math.round(transform.originalValue[0]+
(transform.targetValue[0]-transform.originalValue[0])*position)).toColorPart()+
(Math.round(transform.originalValue[1]+
(transform.targetValue[1]-transform.originalValue[1])*position)).toColorPart()+
(Math.round(transform.originalValue[2]+
(transform.targetValue[2]-transform.originalValue[2])*position)).toColorPart():(transform.originalValue+
(transform.targetValue-transform.originalValue)*position).toFixed(3)+
(transform.unit===null?'':transform.unit);this.element.setStyle(style,true);}});Effect.Transform=Class.create({initialize:function(tracks){this.tracks=[];this.options=arguments[1]||{};this.addTracks(tracks);},addTracks:function(tracks){tracks.each(function(track){track=$H(track);var data=track.values().first();this.tracks.push($H({ids:track.keys().first(),effect:Effect.Morph,options:{style:data}}));}.bind(this));return this;},play:function(){return new Effect.Parallel(this.tracks.map(function(track){var ids=track.get('ids'),effect=track.get('effect'),options=track.get('options');var elements=[$(ids)||$$(ids)].flatten();return elements.map(function(e){return new effect(e,Object.extend({sync:true},options))});}).flatten(),this.options);}});Element.CSS_PROPERTIES=$w('backgroundColor backgroundPosition borderBottomColor borderBottomStyle '+'borderBottomWidth borderLeftColor borderLeftStyle borderLeftWidth '+'borderRightColor borderRightStyle borderRightWidth borderSpacing '+'borderTopColor borderTopStyle borderTopWidth bottom clip color '+'fontSize fontWeight height left letterSpacing lineHeight '+'marginBottom marginLeft marginRight marginTop markerOffset maxHeight '+'maxWidth minHeight minWidth opacity outlineColor outlineOffset '+'outlineWidth paddingBottom paddingLeft paddingRight paddingTop '+'right textIndent top width wordSpacing zIndex');Element.CSS_LENGTH=/^(([\+\-]?[0-9\.]+)(em|ex|px|in|cm|mm|pt|pc|\%))|0$/;String.__parseStyleElement=document.createElement('div');String.prototype.parseStyle=function(){var style,styleRules=$H();if(Prototype.Browser.WebKit)
style=new Element('div',{style:this}).style;else{String.__parseStyleElement.innerHTML='<div style="'+this+'"></div>';style=String.__parseStyleElement.childNodes[0].style;}
Element.CSS_PROPERTIES.each(function(property){if(style[property])styleRules.set(property,style[property]);});if(Prototype.Browser.IE&&this.include('opacity'))
styleRules.set('opacity',this.match(/opacity:\s*((?:0|1)?(?:\.\d*)?)/)[1]);return styleRules;};if(document.defaultView&&document.defaultView.getComputedStyle){Element.getStyles=function(element){var css=document.defaultView.getComputedStyle($(element),null);return Element.CSS_PROPERTIES.inject({},function(styles,property){styles[property]=css[property];return styles;});};}else{Element.getStyles=function(element){element=$(element);var css=element.currentStyle,styles;styles=Element.CSS_PROPERTIES.inject({},function(results,property){results[property]=css[property];return results;});if(!styles.opacity)styles.opacity=element.getOpacity();return styles;};}
Effect.Methods={morph:function(element,style){element=$(element);new Effect.Morph(element,Object.extend({style:style},arguments[2]||{}));return element;},visualEffect:function(element,effect,options){element=$(element);var s=effect.dasherize().camelize(),klass=s.charAt(0).toUpperCase()+s.substring(1);new Effect[klass](element,options);return element;},highlight:function(element,options){element=$(element);new Effect.Highlight(element,options);return element;}};$w('fade appear grow shrink fold blindUp blindDown slideUp slideDown '+'pulsate shake puff squish switchOff dropOut').each(function(effect){Effect.Methods[effect]=function(element,options){element=$(element);Effect[effect.charAt(0).toUpperCase()+effect.substring(1)](element,options);return element;};});$w('getInlineOpacity forceRerendering setContentZoom collectTextNodes collectTextNodesIgnoreClass getStyles').each(function(f){Effect.Methods[f]=Element[f];});Element.addMethods(Effect.Methods);if(typeof Effect=='undefined')
throw("controls.js requires including script.aculo.us' effects.js library");var Autocompleter={};Autocompleter.Base=Class.create({baseInitialize:function(element,update,options){element=$(element);this.element=element;this.update=$(update);this.hasFocus=false;this.changed=false;this.active=false;this.index=0;this.entryCount=0;this.oldElementValue=this.element.value;if(this.setOptions)
this.setOptions(options);else
this.options=options||{};this.options.paramName=this.options.paramName||this.element.name;this.options.tokens=this.options.tokens||[];this.options.frequency=this.options.frequency||0.4;this.options.minChars=this.options.minChars||1;this.options.onShow=this.options.onShow||function(element,update){if(!update.style.position||update.style.position=='absolute'){update.style.position='absolute';Position.clone(element,update,{setHeight:false,offsetTop:element.offsetHeight});}
Effect.Appear(update,{duration:0.15});};this.options.onHide=this.options.onHide||function(element,update){new Effect.Fade(update,{duration:0.15})};if(typeof(this.options.tokens)=='string')
this.options.tokens=new Array(this.options.tokens);if(!this.options.tokens.include('\n'))
this.options.tokens.push('\n');this.observer=null;this.element.setAttribute('autocomplete','off');Element.hide(this.update);Event.observe(this.element,'blur',this.onBlur.bindAsEventListener(this));Event.observe(this.element,'keydown',this.onKeyPress.bindAsEventListener(this));},show:function(){if(Element.getStyle(this.update,'display')=='none')this.options.onShow(this.element,this.update);if(!this.iefix&&(Prototype.Browser.IE)&&(Element.getStyle(this.update,'position')=='absolute')){new Insertion.After(this.update,'<iframe id="'+this.update.id+'_iefix" '+'style="display:none;position:absolute;filter:progid:DXImageTransform.Microsoft.Alpha(opacity=0);" '+'src="javascript:false;" frameborder="0" scrolling="no"></iframe>');this.iefix=$(this.update.id+'_iefix');}
if(this.iefix)setTimeout(this.fixIEOverlapping.bind(this),50);},fixIEOverlapping:function(){Position.clone(this.update,this.iefix,{setTop:(!this.update.style.height)});this.iefix.style.zIndex=1;this.update.style.zIndex=2;Element.show(this.iefix);},hide:function(){this.stopIndicator();if(Element.getStyle(this.update,'display')!='none')this.options.onHide(this.element,this.update);if(this.iefix)Element.hide(this.iefix);},startIndicator:function(){if(this.options.indicator)Element.show(this.options.indicator);},stopIndicator:function(){if(this.options.indicator)Element.hide(this.options.indicator);},onKeyPress:function(event){if(this.active)
switch(event.keyCode){case Event.KEY_TAB:case Event.KEY_RETURN:this.selectEntry();Event.stop(event);case Event.KEY_ESC:this.hide();this.active=false;Event.stop(event);return;case Event.KEY_LEFT:case Event.KEY_RIGHT:return;case Event.KEY_UP:this.markPrevious();this.render();Event.stop(event);return;case Event.KEY_DOWN:this.markNext();this.render();Event.stop(event);return;}
else
if(event.keyCode==Event.KEY_TAB||event.keyCode==Event.KEY_RETURN||(Prototype.Browser.WebKit>0&&event.keyCode==0))return;this.changed=true;this.hasFocus=true;if(this.observer)clearTimeout(this.observer);this.observer=setTimeout(this.onObserverEvent.bind(this),this.options.frequency*1000);},activate:function(){this.changed=false;this.hasFocus=true;this.getUpdatedChoices();},onHover:function(event){var element=Event.findElement(event,'LI');if(this.index!=element.autocompleteIndex)
{this.index=element.autocompleteIndex;this.render();}
Event.stop(event);},onClick:function(event){var element=Event.findElement(event,'LI');this.index=element.autocompleteIndex;this.selectEntry();this.hide();},onBlur:function(event){setTimeout(this.hide.bind(this),250);this.hasFocus=false;this.active=false;},render:function(){if(this.entryCount>0){for(var i=0;i<this.entryCount;i++)
this.index==i?Element.addClassName(this.getEntry(i),"selected"):Element.removeClassName(this.getEntry(i),"selected");if(this.hasFocus){this.show();this.active=true;}}else{this.active=false;this.hide();}},markPrevious:function(){if(this.index>0)this.index--;else this.index=this.entryCount-1;this.getEntry(this.index).scrollIntoView(true);},markNext:function(){if(this.index<this.entryCount-1)this.index++;else this.index=0;this.getEntry(this.index).scrollIntoView(false);},getEntry:function(index){return this.update.firstChild.childNodes[index];},getCurrentEntry:function(){return this.getEntry(this.index);},selectEntry:function(){this.active=false;this.updateElement(this.getCurrentEntry());},updateElement:function(selectedElement){if(this.options.updateElement){this.options.updateElement(selectedElement);return;}
var value='';if(this.options.select){var nodes=$(selectedElement).select('.'+this.options.select)||[];if(nodes.length>0)value=Element.collectTextNodes(nodes[0],this.options.select);}else
value=Element.collectTextNodesIgnoreClass(selectedElement,'informal');var bounds=this.getTokenBounds();if(bounds[0]!=-1){var newValue=this.element.value.substr(0,bounds[0]);var whitespace=this.element.value.substr(bounds[0]).match(/^\s+/);if(whitespace)
newValue+=whitespace[0];this.element.value=newValue+value+this.element.value.substr(bounds[1]);}else{this.element.value=value;}
this.oldElementValue=this.element.value;this.element.focus();if(this.options.afterUpdateElement)
this.options.afterUpdateElement(this.element,selectedElement);},updateChoices:function(choices){if(!this.changed&&this.hasFocus){this.update.innerHTML=choices;Element.cleanWhitespace(this.update);Element.cleanWhitespace(this.update.down());if(this.update.firstChild&&this.update.down().childNodes){this.entryCount=this.update.down().childNodes.length;for(var i=0;i<this.entryCount;i++){var entry=this.getEntry(i);entry.autocompleteIndex=i;this.addObservers(entry);}}else{this.entryCount=0;}
this.stopIndicator();this.index=0;if(this.entryCount==1&&this.options.autoSelect){this.selectEntry();this.hide();}else{this.render();}}},addObservers:function(element){Event.observe(element,"mouseover",this.onHover.bindAsEventListener(this));Event.observe(element,"click",this.onClick.bindAsEventListener(this));},onObserverEvent:function(){this.changed=false;this.tokenBounds=null;if(this.getToken().length>=this.options.minChars){this.getUpdatedChoices();}else{this.active=false;this.hide();}
this.oldElementValue=this.element.value;},getToken:function(){var bounds=this.getTokenBounds();return this.element.value.substring(bounds[0],bounds[1]).strip();},getTokenBounds:function(){if(null!=this.tokenBounds)return this.tokenBounds;var value=this.element.value;if(value.strip().empty())return[-1,0];var diff=arguments.callee.getFirstDifferencePos(value,this.oldElementValue);var offset=(diff==this.oldElementValue.length?1:0);var prevTokenPos=-1,nextTokenPos=value.length;var tp;for(var index=0,l=this.options.tokens.length;index<l;++index){tp=value.lastIndexOf(this.options.tokens[index],diff+offset-1);if(tp>prevTokenPos)prevTokenPos=tp;tp=value.indexOf(this.options.tokens[index],diff+offset);if(-1!=tp&&tp<nextTokenPos)nextTokenPos=tp;}
return(this.tokenBounds=[prevTokenPos+1,nextTokenPos]);}});Autocompleter.Base.prototype.getTokenBounds.getFirstDifferencePos=function(newS,oldS){var boundary=Math.min(newS.length,oldS.length);for(var index=0;index<boundary;++index)
if(newS[index]!=oldS[index])
return index;return boundary;};Ajax.Autocompleter=Class.create(Autocompleter.Base,{initialize:function(element,update,url,options){this.baseInitialize(element,update,options);this.options.asynchronous=true;this.options.onComplete=this.onComplete.bind(this);this.options.defaultParams=this.options.parameters||null;this.url=url;},getUpdatedChoices:function(){this.startIndicator();var entry=encodeURIComponent(this.options.paramName)+'='+
encodeURIComponent(this.getToken());this.options.parameters=this.options.callback?this.options.callback(this.element,entry):entry;if(this.options.defaultParams)
this.options.parameters+='&'+this.options.defaultParams;new Ajax.Request(this.url,this.options);},onComplete:function(request){this.updateChoices(request.responseText);}});Autocompleter.Local=Class.create(Autocompleter.Base,{initialize:function(element,update,array,options){this.baseInitialize(element,update,options);this.options.array=array;},getUpdatedChoices:function(){this.updateChoices(this.options.selector(this));},setOptions:function(options){this.options=Object.extend({choices:10,partialSearch:true,partialChars:2,ignoreCase:true,fullSearch:false,selector:function(instance){var ret=[];var partial=[];var entry=instance.getToken();var count=0;for(var i=0;i<instance.options.array.length&&ret.length<instance.options.choices;i++){var elem=instance.options.array[i];var foundPos=instance.options.ignoreCase?elem.toLowerCase().indexOf(entry.toLowerCase()):elem.indexOf(entry);while(foundPos!=-1){if(foundPos==0&&elem.length!=entry.length){ret.push("<li><strong>"+elem.substr(0,entry.length)+"</strong>"+
elem.substr(entry.length)+"</li>");break;}else if(entry.length>=instance.options.partialChars&&instance.options.partialSearch&&foundPos!=-1){if(instance.options.fullSearch||/\s/.test(elem.substr(foundPos-1,1))){partial.push("<li>"+elem.substr(0,foundPos)+"<strong>"+
elem.substr(foundPos,entry.length)+"</strong>"+elem.substr(foundPos+entry.length)+"</li>");break;}}
foundPos=instance.options.ignoreCase?elem.toLowerCase().indexOf(entry.toLowerCase(),foundPos+1):elem.indexOf(entry,foundPos+1);}}
if(partial.length)
ret=ret.concat(partial.slice(0,instance.options.choices-ret.length));return"<ul>"+ret.join('')+"</ul>";}},options||{});}});Field.scrollFreeActivate=function(field){setTimeout(function(){Field.activate(field);},1);};Ajax.InPlaceEditor=Class.create({initialize:function(element,url,options){this.url=url;this.element=element=$(element);this.prepareOptions();this._controls={};arguments.callee.dealWithDeprecatedOptions(options);Object.extend(this.options,options||{});if(!this.options.formId&&this.element.id){this.options.formId=this.element.id+'-inplaceeditor';if($(this.options.formId))
this.options.formId='';}
if(this.options.externalControl)
this.options.externalControl=$(this.options.externalControl);if(!this.options.externalControl)
this.options.externalControlOnly=false;this._originalBackground=this.element.getStyle('background-color')||'transparent';this.element.title=this.options.clickToEditText;this._boundCancelHandler=this.handleFormCancellation.bind(this);this._boundComplete=(this.options.onComplete||Prototype.emptyFunction).bind(this);this._boundFailureHandler=this.handleAJAXFailure.bind(this);this._boundSubmitHandler=this.handleFormSubmission.bind(this);this._boundWrapperHandler=this.wrapUp.bind(this);this.registerListeners();},checkForEscapeOrReturn:function(e){if(!this._editing||e.ctrlKey||e.altKey||e.shiftKey)return;if(Event.KEY_ESC==e.keyCode)
this.handleFormCancellation(e);else if(Event.KEY_RETURN==e.keyCode)
this.handleFormSubmission(e);},createControl:function(mode,handler,extraClasses){var control=this.options[mode+'Control'];var text=this.options[mode+'Text'];if('button'==control){var btn=document.createElement('input');btn.type='submit';btn.value=text;btn.className='editor_'+mode+'_button';if('cancel'==mode)
btn.onclick=this._boundCancelHandler;this._form.appendChild(btn);this._controls[mode]=btn;}else if('link'==control){var link=document.createElement('a');link.href='#';link.appendChild(document.createTextNode(text));link.onclick='cancel'==mode?this._boundCancelHandler:this._boundSubmitHandler;link.className='editor_'+mode+'_link';if(extraClasses)
link.className+=' '+extraClasses;this._form.appendChild(link);this._controls[mode]=link;}},createEditField:function(){var text=(this.options.loadTextURL?this.options.loadingText:this.getText());var fld;if(1>=this.options.rows&&!/\r|\n/.test(this.getText())){fld=document.createElement('input');fld.type='text';var size=this.options.size||this.options.cols||0;if(0<size)fld.size=size;}else{fld=document.createElement('textarea');fld.rows=(1>=this.options.rows?this.options.autoRows:this.options.rows);fld.cols=this.options.cols||40;}
fld.name=this.options.paramName;fld.value=text;fld.className='editor_field';if(this.options.submitOnBlur)
fld.onblur=this._boundSubmitHandler;this._controls.editor=fld;if(this.options.loadTextURL)
this.loadExternalText();this._form.appendChild(this._controls.editor);},createForm:function(){var ipe=this;function addText(mode,condition){var text=ipe.options['text'+mode+'Controls'];if(!text||condition===false)return;ipe._form.appendChild(document.createTextNode(text));};this._form=$(document.createElement('form'));this._form.id=this.options.formId;this._form.addClassName(this.options.formClassName);this._form.onsubmit=this._boundSubmitHandler;this.createEditField();if('textarea'==this._controls.editor.tagName.toLowerCase())
this._form.appendChild(document.createElement('br'));if(this.options.onFormCustomization)
this.options.onFormCustomization(this,this._form);addText('Before',this.options.okControl||this.options.cancelControl);this.createControl('ok',this._boundSubmitHandler);addText('Between',this.options.okControl&&this.options.cancelControl);this.createControl('cancel',this._boundCancelHandler,'editor_cancel');addText('After',this.options.okControl||this.options.cancelControl);},destroy:function(){if(this._oldInnerHTML)
this.element.innerHTML=this._oldInnerHTML;this.leaveEditMode();this.unregisterListeners();},enterEditMode:function(e){if(this._saving||this._editing)return;this._editing=true;this.triggerCallback('onEnterEditMode');if(this.options.externalControl)
this.options.externalControl.hide();this.element.hide();this.createForm();this.element.parentNode.insertBefore(this._form,this.element);if(!this.options.loadTextURL)
this.postProcessEditField();if(e)Event.stop(e);},enterHover:function(e){if(this.options.hoverClassName)
this.element.addClassName(this.options.hoverClassName);if(this._saving)return;this.triggerCallback('onEnterHover');},getText:function(){return this.element.innerHTML.unescapeHTML();},handleAJAXFailure:function(transport){this.triggerCallback('onFailure',transport);if(this._oldInnerHTML){this.element.innerHTML=this._oldInnerHTML;this._oldInnerHTML=null;}},handleFormCancellation:function(e){this.wrapUp();if(e)Event.stop(e);},handleFormSubmission:function(e){var form=this._form;var value=$F(this._controls.editor);this.prepareSubmission();var params=this.options.callback(form,value)||'';if(Object.isString(params))
params=params.toQueryParams();params.editorId=this.element.id;if(this.options.htmlResponse){var options=Object.extend({evalScripts:true},this.options.ajaxOptions);Object.extend(options,{parameters:params,onComplete:this._boundWrapperHandler,onFailure:this._boundFailureHandler});new Ajax.Updater({success:this.element},this.url,options);}else{var options=Object.extend({method:'get'},this.options.ajaxOptions);Object.extend(options,{parameters:params,onComplete:this._boundWrapperHandler,onFailure:this._boundFailureHandler});new Ajax.Request(this.url,options);}
if(e)Event.stop(e);},leaveEditMode:function(){this.element.removeClassName(this.options.savingClassName);this.removeForm();this.leaveHover();this.element.style.backgroundColor=this._originalBackground;this.element.show();if(this.options.externalControl)
this.options.externalControl.show();this._saving=false;this._editing=false;this._oldInnerHTML=null;this.triggerCallback('onLeaveEditMode');},leaveHover:function(e){if(this.options.hoverClassName)
this.element.removeClassName(this.options.hoverClassName);if(this._saving)return;this.triggerCallback('onLeaveHover');},loadExternalText:function(){this._form.addClassName(this.options.loadingClassName);this._controls.editor.disabled=true;var options=Object.extend({method:'get'},this.options.ajaxOptions);Object.extend(options,{parameters:'editorId='+encodeURIComponent(this.element.id),onComplete:Prototype.emptyFunction,onSuccess:function(transport){this._form.removeClassName(this.options.loadingClassName);var text=transport.responseText;if(this.options.stripLoadedTextTags)
text=text.stripTags();this._controls.editor.value=text;this._controls.editor.disabled=false;this.postProcessEditField();}.bind(this),onFailure:this._boundFailureHandler});new Ajax.Request(this.options.loadTextURL,options);},postProcessEditField:function(){var fpc=this.options.fieldPostCreation;if(fpc)
$(this._controls.editor)['focus'==fpc?'focus':'activate']();},prepareOptions:function(){this.options=Object.clone(Ajax.InPlaceEditor.DefaultOptions);Object.extend(this.options,Ajax.InPlaceEditor.DefaultCallbacks);[this._extraDefaultOptions].flatten().compact().each(function(defs){Object.extend(this.options,defs);}.bind(this));},prepareSubmission:function(){this._saving=true;this.removeForm();this.leaveHover();this.showSaving();},registerListeners:function(){this._listeners={};var listener;$H(Ajax.InPlaceEditor.Listeners).each(function(pair){listener=this[pair.value].bind(this);this._listeners[pair.key]=listener;if(!this.options.externalControlOnly)
this.element.observe(pair.key,listener);if(this.options.externalControl)
this.options.externalControl.observe(pair.key,listener);}.bind(this));},removeForm:function(){if(!this._form)return;this._form.remove();this._form=null;this._controls={};},showSaving:function(){this._oldInnerHTML=this.element.innerHTML;this.element.innerHTML=this.options.savingText;this.element.addClassName(this.options.savingClassName);this.element.style.backgroundColor=this._originalBackground;this.element.show();},triggerCallback:function(cbName,arg){if('function'==typeof this.options[cbName]){this.options[cbName](this,arg);}},unregisterListeners:function(){$H(this._listeners).each(function(pair){if(!this.options.externalControlOnly)
this.element.stopObserving(pair.key,pair.value);if(this.options.externalControl)
this.options.externalControl.stopObserving(pair.key,pair.value);}.bind(this));},wrapUp:function(transport){this.leaveEditMode();this._boundComplete(transport,this.element);}});Object.extend(Ajax.InPlaceEditor.prototype,{dispose:Ajax.InPlaceEditor.prototype.destroy});Ajax.InPlaceCollectionEditor=Class.create(Ajax.InPlaceEditor,{initialize:function($super,element,url,options){this._extraDefaultOptions=Ajax.InPlaceCollectionEditor.DefaultOptions;$super(element,url,options);},createEditField:function(){var list=document.createElement('select');list.name=this.options.paramName;list.size=1;this._controls.editor=list;this._collection=this.options.collection||[];if(this.options.loadCollectionURL)
this.loadCollection();else
this.checkForExternalText();this._form.appendChild(this._controls.editor);},loadCollection:function(){this._form.addClassName(this.options.loadingClassName);this.showLoadingText(this.options.loadingCollectionText);var options=Object.extend({method:'get'},this.options.ajaxOptions);Object.extend(options,{parameters:'editorId='+encodeURIComponent(this.element.id),onComplete:Prototype.emptyFunction,onSuccess:function(transport){var js=transport.responseText.strip();if(!/^\[.*\]$/.test(js))
throw('Server returned an invalid collection representation.');this._collection=eval(js);this.checkForExternalText();}.bind(this),onFailure:this.onFailure});new Ajax.Request(this.options.loadCollectionURL,options);},showLoadingText:function(text){this._controls.editor.disabled=true;var tempOption=this._controls.editor.firstChild;if(!tempOption){tempOption=document.createElement('option');tempOption.value='';this._controls.editor.appendChild(tempOption);tempOption.selected=true;}
tempOption.update((text||'').stripScripts().stripTags());},checkForExternalText:function(){this._text=this.getText();if(this.options.loadTextURL)
this.loadExternalText();else
this.buildOptionList();},loadExternalText:function(){this.showLoadingText(this.options.loadingText);var options=Object.extend({method:'get'},this.options.ajaxOptions);Object.extend(options,{parameters:'editorId='+encodeURIComponent(this.element.id),onComplete:Prototype.emptyFunction,onSuccess:function(transport){this._text=transport.responseText.strip();this.buildOptionList();}.bind(this),onFailure:this.onFailure});new Ajax.Request(this.options.loadTextURL,options);},buildOptionList:function(){this._form.removeClassName(this.options.loadingClassName);this._collection=this._collection.map(function(entry){return 2===entry.length?entry:[entry,entry].flatten();});var marker=('value'in this.options)?this.options.value:this._text;var textFound=this._collection.any(function(entry){return entry[0]==marker;}.bind(this));this._controls.editor.update('');var option;this._collection.each(function(entry,index){option=document.createElement('option');option.value=entry[0];option.selected=textFound?entry[0]==marker:0==index;option.appendChild(document.createTextNode(entry[1]));this._controls.editor.appendChild(option);}.bind(this));this._controls.editor.disabled=false;Field.scrollFreeActivate(this._controls.editor);}});Ajax.InPlaceEditor.prototype.initialize.dealWithDeprecatedOptions=function(options){if(!options)return;function fallback(name,expr){if(name in options||expr===undefined)return;options[name]=expr;};fallback('cancelControl',(options.cancelLink?'link':(options.cancelButton?'button':options.cancelLink==options.cancelButton==false?false:undefined)));fallback('okControl',(options.okLink?'link':(options.okButton?'button':options.okLink==options.okButton==false?false:undefined)));fallback('highlightColor',options.highlightcolor);fallback('highlightEndColor',options.highlightendcolor);};Object.extend(Ajax.InPlaceEditor,{DefaultOptions:{ajaxOptions:{},autoRows:3,cancelControl:'link',cancelText:'cancel',clickToEditText:'Click to edit',externalControl:null,externalControlOnly:false,fieldPostCreation:'activate',formClassName:'inplaceeditor-form',formId:null,highlightColor:'#ffff99',highlightEndColor:'#ffffff',hoverClassName:'',htmlResponse:true,loadingClassName:'inplaceeditor-loading',loadingText:'Loading...',okControl:'button',okText:'ok',paramName:'value',rows:1,savingClassName:'inplaceeditor-saving',savingText:'Saving...',size:0,stripLoadedTextTags:false,submitOnBlur:false,textAfterControls:'',textBeforeControls:'',textBetweenControls:''},DefaultCallbacks:{callback:function(form){return Form.serialize(form);},onComplete:function(transport,element){new Effect.Highlight(element,{startcolor:this.options.highlightColor,keepBackgroundImage:true});},onEnterEditMode:null,onEnterHover:function(ipe){ipe.element.style.backgroundColor=ipe.options.highlightColor;if(ipe._effect)
ipe._effect.cancel();},onFailure:function(transport,ipe){alert('Error communication with the server: '+transport.responseText.stripTags());},onFormCustomization:null,onLeaveEditMode:null,onLeaveHover:function(ipe){ipe._effect=new Effect.Highlight(ipe.element,{startcolor:ipe.options.highlightColor,endcolor:ipe.options.highlightEndColor,restorecolor:ipe._originalBackground,keepBackgroundImage:true});}},Listeners:{click:'enterEditMode',keydown:'checkForEscapeOrReturn',mouseover:'enterHover',mouseout:'leaveHover'}});Ajax.InPlaceCollectionEditor.DefaultOptions={loadingCollectionText:'Loading options...'};Form.Element.DelayedObserver=Class.create({initialize:function(element,delay,callback){this.delay=delay||0.5;this.element=$(element);this.callback=callback;this.timer=null;this.lastValue=$F(this.element);Event.observe(this.element,'keyup',this.delayedListener.bindAsEventListener(this));},delayedListener:function(event){if(this.lastValue==$F(this.element))return;if(this.timer)clearTimeout(this.timer);this.timer=setTimeout(this.onTimerEvent.bind(this),this.delay*1000);this.lastValue=$F(this.element);},onTimerEvent:function(){this.timer=null;this.callback(this.element,$F(this.element));}});if(Object.isUndefined(Effect))
throw("dragdrop.js requires including script.aculo.us' effects.js library");var Droppables={drops:[],remove:function(element){this.drops=this.drops.reject(function(d){return d.element==$(element)});},add:function(element){element=$(element);var options=Object.extend({greedy:true,hoverclass:null,tree:false},arguments[1]||{});if(options.containment){options._containers=[];var containment=options.containment;if(Object.isArray(containment)){containment.each(function(c){options._containers.push($(c))});}else{options._containers.push($(containment));}}
if(options.accept)options.accept=[options.accept].flatten();Element.makePositioned(element);options.element=element;this.drops.push(options);},findDeepestChild:function(drops){deepest=drops[0];for(i=1;i<drops.length;++i)
if(Element.isParent(drops[i].element,deepest.element))
deepest=drops[i];return deepest;},isContained:function(element,drop){var containmentNode;if(drop.tree){containmentNode=element.treeNode;}else{containmentNode=element.parentNode;}
return drop._containers.detect(function(c){return containmentNode==c});},isAffected:function(point,element,drop){return((drop.element!=element)&&((!drop._containers)||this.isContained(element,drop))&&((!drop.accept)||(Element.classNames(element).detect(function(v){return drop.accept.include(v)})))&&Position.within(drop.element,point[0],point[1]));},deactivate:function(drop){if(drop.hoverclass)
Element.removeClassName(drop.element,drop.hoverclass);this.last_active=null;},activate:function(drop){if(drop.hoverclass)
Element.addClassName(drop.element,drop.hoverclass);this.last_active=drop;},show:function(point,element){if(!this.drops.length)return;var drop,affected=[];this.drops.each(function(drop){if(Droppables.isAffected(point,element,drop))
affected.push(drop);});if(affected.length>0)
drop=Droppables.findDeepestChild(affected);if(this.last_active&&this.last_active!=drop)this.deactivate(this.last_active);if(drop){Position.within(drop.element,point[0],point[1]);if(drop.onHover)
drop.onHover(element,drop.element,Position.overlap(drop.overlap,drop.element));if(drop!=this.last_active)Droppables.activate(drop);}},fire:function(event,element){if(!this.last_active)return;Position.prepare();if(this.isAffected([Event.pointerX(event),Event.pointerY(event)],element,this.last_active))
if(this.last_active.onDrop){this.last_active.onDrop(element,this.last_active.element,event);return true;}},reset:function(){if(this.last_active)
this.deactivate(this.last_active);}};var Draggables={drags:[],observers:[],register:function(draggable){if(this.drags.length==0){this.eventMouseUp=this.endDrag.bindAsEventListener(this);this.eventMouseMove=this.updateDrag.bindAsEventListener(this);this.eventKeypress=this.keyPress.bindAsEventListener(this);Event.observe(document,"mouseup",this.eventMouseUp);Event.observe(document,"mousemove",this.eventMouseMove);Event.observe(document,"keypress",this.eventKeypress);}
this.drags.push(draggable);},unregister:function(draggable){this.drags=this.drags.reject(function(d){return d==draggable});if(this.drags.length==0){Event.stopObserving(document,"mouseup",this.eventMouseUp);Event.stopObserving(document,"mousemove",this.eventMouseMove);Event.stopObserving(document,"keypress",this.eventKeypress);}},activate:function(draggable){if(draggable.options.delay){this._timeout=setTimeout(function(){Draggables._timeout=null;window.focus();Draggables.activeDraggable=draggable;}.bind(this),draggable.options.delay);}else{window.focus();this.activeDraggable=draggable;}},deactivate:function(){this.activeDraggable=null;},updateDrag:function(event){if(!this.activeDraggable)return;var pointer=[Event.pointerX(event),Event.pointerY(event)];if(this._lastPointer&&(this._lastPointer.inspect()==pointer.inspect()))return;this._lastPointer=pointer;this.activeDraggable.updateDrag(event,pointer);},endDrag:function(event){if(this._timeout){clearTimeout(this._timeout);this._timeout=null;}
if(!this.activeDraggable)return;this._lastPointer=null;this.activeDraggable.endDrag(event);this.activeDraggable=null;},keyPress:function(event){if(this.activeDraggable)
this.activeDraggable.keyPress(event);},addObserver:function(observer){this.observers.push(observer);this._cacheObserverCallbacks();},removeObserver:function(element){this.observers=this.observers.reject(function(o){return o.element==element});this._cacheObserverCallbacks();},notify:function(eventName,draggable,event){if(this[eventName+'Count']>0)
this.observers.each(function(o){if(o[eventName])o[eventName](eventName,draggable,event);});if(draggable.options[eventName])draggable.options[eventName](draggable,event);},_cacheObserverCallbacks:function(){['onStart','onEnd','onDrag'].each(function(eventName){Draggables[eventName+'Count']=Draggables.observers.select(function(o){return o[eventName];}).length;});}};var Draggable=Class.create({initialize:function(element){var defaults={handle:false,reverteffect:function(element,top_offset,left_offset){var dur=Math.sqrt(Math.abs(top_offset^2)+Math.abs(left_offset^2))*0.02;new Effect.Move(element,{x:-left_offset,y:-top_offset,duration:dur,queue:{scope:'_draggable',position:'end'}});},endeffect:function(element){var toOpacity=Object.isNumber(element._opacity)?element._opacity:1.0;new Effect.Opacity(element,{duration:0.2,from:0.7,to:toOpacity,queue:{scope:'_draggable',position:'end'},afterFinish:function(){Draggable._dragging[element]=false}});},zindex:1000,revert:false,quiet:false,scroll:false,scrollSensitivity:20,scrollSpeed:15,snap:false,delay:0};if(!arguments[1]||Object.isUndefined(arguments[1].endeffect))
Object.extend(defaults,{starteffect:function(element){element._opacity=Element.getOpacity(element);Draggable._dragging[element]=true;new Effect.Opacity(element,{duration:0.2,from:element._opacity,to:0.7});}});var options=Object.extend(defaults,arguments[1]||{});this.element=$(element);if(options.handle&&Object.isString(options.handle))
this.handle=this.element.down('.'+options.handle,0);if(!this.handle)this.handle=$(options.handle);if(!this.handle)this.handle=this.element;if(options.scroll&&!options.scroll.scrollTo&&!options.scroll.outerHTML){options.scroll=$(options.scroll);this._isScrollChild=Element.childOf(this.element,options.scroll);}
Element.makePositioned(this.element);this.options=options;this.dragging=false;this.eventMouseDown=this.initDrag.bindAsEventListener(this);Event.observe(this.handle,"mousedown",this.eventMouseDown);Draggables.register(this);},destroy:function(){Event.stopObserving(this.handle,"mousedown",this.eventMouseDown);Draggables.unregister(this);},currentDelta:function(){return([parseInt(Element.getStyle(this.element,'left')||'0'),parseInt(Element.getStyle(this.element,'top')||'0')]);},initDrag:function(event){if(!Object.isUndefined(Draggable._dragging[this.element])&&Draggable._dragging[this.element])return;if(Event.isLeftClick(event)){var src=Event.element(event);if((tag_name=src.tagName.toUpperCase())&&(tag_name=='INPUT'||tag_name=='SELECT'||tag_name=='OPTION'||tag_name=='BUTTON'||tag_name=='TEXTAREA'))return;var pointer=[Event.pointerX(event),Event.pointerY(event)];var pos=this.element.cumulativeOffset();this.offset=[0,1].map(function(i){return(pointer[i]-pos[i])});Draggables.activate(this);Event.stop(event);}},startDrag:function(event){this.dragging=true;if(!this.delta)
this.delta=this.currentDelta();if(this.options.zindex){this.originalZ=parseInt(Element.getStyle(this.element,'z-index')||0);this.element.style.zIndex=this.options.zindex;}
if(this.options.ghosting){this._clone=this.element.cloneNode(true);this._originallyAbsolute=(this.element.getStyle('position')=='absolute');if(!this._originallyAbsolute)
Position.absolutize(this.element);this.element.parentNode.insertBefore(this._clone,this.element);}
if(this.options.scroll){if(this.options.scroll==window){var where=this._getWindowScroll(this.options.scroll);this.originalScrollLeft=where.left;this.originalScrollTop=where.top;}else{this.originalScrollLeft=this.options.scroll.scrollLeft;this.originalScrollTop=this.options.scroll.scrollTop;}}
Draggables.notify('onStart',this,event);if(this.options.starteffect)this.options.starteffect(this.element);},updateDrag:function(event,pointer){if(!this.dragging)this.startDrag(event);if(!this.options.quiet){Position.prepare();Droppables.show(pointer,this.element);}
Draggables.notify('onDrag',this,event);this.draw(pointer);if(this.options.change)this.options.change(this);if(this.options.scroll){this.stopScrolling();var p;if(this.options.scroll==window){with(this._getWindowScroll(this.options.scroll)){p=[left,top,left+width,top+height];}}else{p=Position.page(this.options.scroll);p[0]+=this.options.scroll.scrollLeft+Position.deltaX;p[1]+=this.options.scroll.scrollTop+Position.deltaY;p.push(p[0]+this.options.scroll.offsetWidth);p.push(p[1]+this.options.scroll.offsetHeight);}
var speed=[0,0];if(pointer[0]<(p[0]+this.options.scrollSensitivity))speed[0]=pointer[0]-(p[0]+this.options.scrollSensitivity);if(pointer[1]<(p[1]+this.options.scrollSensitivity))speed[1]=pointer[1]-(p[1]+this.options.scrollSensitivity);if(pointer[0]>(p[2]-this.options.scrollSensitivity))speed[0]=pointer[0]-(p[2]-this.options.scrollSensitivity);if(pointer[1]>(p[3]-this.options.scrollSensitivity))speed[1]=pointer[1]-(p[3]-this.options.scrollSensitivity);this.startScrolling(speed);}
if(Prototype.Browser.WebKit)window.scrollBy(0,0);Event.stop(event);},finishDrag:function(event,success){this.dragging=false;if(this.options.quiet){Position.prepare();var pointer=[Event.pointerX(event),Event.pointerY(event)];Droppables.show(pointer,this.element);}
if(this.options.ghosting){if(!this._originallyAbsolute)
Position.relativize(this.element);delete this._originallyAbsolute;Element.remove(this._clone);this._clone=null;}
var dropped=false;if(success){dropped=Droppables.fire(event,this.element);if(!dropped)dropped=false;}
if(dropped&&this.options.onDropped)this.options.onDropped(this.element);Draggables.notify('onEnd',this,event);var revert=this.options.revert;if(revert&&Object.isFunction(revert))revert=revert(this.element);var d=this.currentDelta();if(revert&&this.options.reverteffect){if(dropped==0||revert!='failure')
this.options.reverteffect(this.element,d[1]-this.delta[1],d[0]-this.delta[0]);}else{this.delta=d;}
if(this.options.zindex)
this.element.style.zIndex=this.originalZ;if(this.options.endeffect)
this.options.endeffect(this.element);Draggables.deactivate(this);Droppables.reset();},keyPress:function(event){if(event.keyCode!=Event.KEY_ESC)return;this.finishDrag(event,false);Event.stop(event);},endDrag:function(event){if(!this.dragging)return;this.stopScrolling();this.finishDrag(event,true);Event.stop(event);},draw:function(point){var pos=this.element.cumulativeOffset();if(this.options.ghosting){var r=Position.realOffset(this.element);pos[0]+=r[0]-Position.deltaX;pos[1]+=r[1]-Position.deltaY;}
var d=this.currentDelta();pos[0]-=d[0];pos[1]-=d[1];if(this.options.scroll&&(this.options.scroll!=window&&this._isScrollChild)){pos[0]-=this.options.scroll.scrollLeft-this.originalScrollLeft;pos[1]-=this.options.scroll.scrollTop-this.originalScrollTop;}
var p=[0,1].map(function(i){return(point[i]-pos[i]-this.offset[i])}.bind(this));if(this.options.snap){if(Object.isFunction(this.options.snap)){p=this.options.snap(p[0],p[1],this);}else{if(Object.isArray(this.options.snap)){p=p.map(function(v,i){return(v/this.options.snap[i]).round()*this.options.snap[i]}.bind(this));}else{p=p.map(function(v){return(v/this.options.snap).round()*this.options.snap}.bind(this));}}}
var style=this.element.style;if((!this.options.constraint)||(this.options.constraint=='horizontal'))
style.left=p[0]+"px";if((!this.options.constraint)||(this.options.constraint=='vertical'))
style.top=p[1]+"px";if(style.visibility=="hidden")style.visibility="";},stopScrolling:function(){if(this.scrollInterval){clearInterval(this.scrollInterval);this.scrollInterval=null;Draggables._lastScrollPointer=null;}},startScrolling:function(speed){if(!(speed[0]||speed[1]))return;this.scrollSpeed=[speed[0]*this.options.scrollSpeed,speed[1]*this.options.scrollSpeed];this.lastScrolled=new Date();this.scrollInterval=setInterval(this.scroll.bind(this),10);},scroll:function(){var current=new Date();var delta=current-this.lastScrolled;this.lastScrolled=current;if(this.options.scroll==window){with(this._getWindowScroll(this.options.scroll)){if(this.scrollSpeed[0]||this.scrollSpeed[1]){var d=delta/1000;this.options.scroll.scrollTo(left+d*this.scrollSpeed[0],top+d*this.scrollSpeed[1]);}}}else{this.options.scroll.scrollLeft+=this.scrollSpeed[0]*delta/1000;this.options.scroll.scrollTop+=this.scrollSpeed[1]*delta/1000;}
Position.prepare();Droppables.show(Draggables._lastPointer,this.element);Draggables.notify('onDrag',this);if(this._isScrollChild){Draggables._lastScrollPointer=Draggables._lastScrollPointer||$A(Draggables._lastPointer);Draggables._lastScrollPointer[0]+=this.scrollSpeed[0]*delta/1000;Draggables._lastScrollPointer[1]+=this.scrollSpeed[1]*delta/1000;if(Draggables._lastScrollPointer[0]<0)
Draggables._lastScrollPointer[0]=0;if(Draggables._lastScrollPointer[1]<0)
Draggables._lastScrollPointer[1]=0;this.draw(Draggables._lastScrollPointer);}
if(this.options.change)this.options.change(this);},_getWindowScroll:function(w){var T,L,W,H;with(w.document){if(w.document.documentElement&&documentElement.scrollTop){T=documentElement.scrollTop;L=documentElement.scrollLeft;}else if(w.document.body){T=body.scrollTop;L=body.scrollLeft;}
if(w.innerWidth){W=w.innerWidth;H=w.innerHeight;}else if(w.document.documentElement&&documentElement.clientWidth){W=documentElement.clientWidth;H=documentElement.clientHeight;}else{W=body.offsetWidth;H=body.offsetHeight;}}
return{top:T,left:L,width:W,height:H};}});Draggable._dragging={};var SortableObserver=Class.create({initialize:function(element,observer){this.element=$(element);this.observer=observer;this.lastValue=Sortable.serialize(this.element);},onStart:function(){this.lastValue=Sortable.serialize(this.element);},onEnd:function(){Sortable.unmark();if(this.lastValue!=Sortable.serialize(this.element))
this.observer(this.element)}});var Sortable={SERIALIZE_RULE:/^[^_\-](?:[A-Za-z0-9\-\_]*)[_](.*)$/,sortables:{},_findRootElement:function(element){while(element.tagName.toUpperCase()!="BODY"){if(element.id&&Sortable.sortables[element.id])return element;element=element.parentNode;}},options:function(element){element=Sortable._findRootElement($(element));if(!element)return;return Sortable.sortables[element.id];},destroy:function(element){element=$(element);var s=Sortable.sortables[element.id];if(s){Draggables.removeObserver(s.element);s.droppables.each(function(d){Droppables.remove(d)});s.draggables.invoke('destroy');delete Sortable.sortables[s.element.id];}},create:function(element){element=$(element);var options=Object.extend({element:element,tag:'li',dropOnEmpty:false,tree:false,treeTag:'ul',overlap:'vertical',constraint:'vertical',containment:element,handle:false,only:false,delay:0,hoverclass:null,ghosting:false,quiet:false,scroll:false,scrollSensitivity:20,scrollSpeed:15,format:this.SERIALIZE_RULE,elements:false,handles:false,onChange:Prototype.emptyFunction,onUpdate:Prototype.emptyFunction},arguments[1]||{});this.destroy(element);var options_for_draggable={revert:true,quiet:options.quiet,scroll:options.scroll,scrollSpeed:options.scrollSpeed,scrollSensitivity:options.scrollSensitivity,delay:options.delay,ghosting:options.ghosting,constraint:options.constraint,handle:options.handle};if(options.starteffect)
options_for_draggable.starteffect=options.starteffect;if(options.reverteffect)
options_for_draggable.reverteffect=options.reverteffect;else
if(options.ghosting)options_for_draggable.reverteffect=function(element){element.style.top=0;element.style.left=0;};if(options.endeffect)
options_for_draggable.endeffect=options.endeffect;if(options.zindex)
options_for_draggable.zindex=options.zindex;var options_for_droppable={overlap:options.overlap,containment:options.containment,tree:options.tree,hoverclass:options.hoverclass,onHover:Sortable.onHover};var options_for_tree={onHover:Sortable.onEmptyHover,overlap:options.overlap,containment:options.containment,hoverclass:options.hoverclass};Element.cleanWhitespace(element);options.draggables=[];options.droppables=[];if(options.dropOnEmpty||options.tree){Droppables.add(element,options_for_tree);options.droppables.push(element);}
(options.elements||this.findElements(element,options)||[]).each(function(e,i){var handle=options.handles?$(options.handles[i]):(options.handle?$(e).select('.'+options.handle)[0]:e);options.draggables.push(new Draggable(e,Object.extend(options_for_draggable,{handle:handle})));Droppables.add(e,options_for_droppable);if(options.tree)e.treeNode=element;options.droppables.push(e);});if(options.tree){(Sortable.findTreeElements(element,options)||[]).each(function(e){Droppables.add(e,options_for_tree);e.treeNode=element;options.droppables.push(e);});}
this.sortables[element.identify()]=options;Draggables.addObserver(new SortableObserver(element,options.onUpdate));},findElements:function(element,options){return Element.findChildren(element,options.only,options.tree?true:false,options.tag);},findTreeElements:function(element,options){return Element.findChildren(element,options.only,options.tree?true:false,options.treeTag);},onHover:function(element,dropon,overlap){if(Element.isParent(dropon,element))return;if(overlap>.33&&overlap<.66&&Sortable.options(dropon).tree){return;}else if(overlap>0.5){Sortable.mark(dropon,'before');if(dropon.previousSibling!=element){var oldParentNode=element.parentNode;element.style.visibility="hidden";dropon.parentNode.insertBefore(element,dropon);if(dropon.parentNode!=oldParentNode)
Sortable.options(oldParentNode).onChange(element);Sortable.options(dropon.parentNode).onChange(element);}}else{Sortable.mark(dropon,'after');var nextElement=dropon.nextSibling||null;if(nextElement!=element){var oldParentNode=element.parentNode;element.style.visibility="hidden";dropon.parentNode.insertBefore(element,nextElement);if(dropon.parentNode!=oldParentNode)
Sortable.options(oldParentNode).onChange(element);Sortable.options(dropon.parentNode).onChange(element);}}},onEmptyHover:function(element,dropon,overlap){var oldParentNode=element.parentNode;var droponOptions=Sortable.options(dropon);if(!Element.isParent(dropon,element)){var index;var children=Sortable.findElements(dropon,{tag:droponOptions.tag,only:droponOptions.only});var child=null;if(children){var offset=Element.offsetSize(dropon,droponOptions.overlap)*(1.0-overlap);for(index=0;index<children.length;index+=1){if(offset-Element.offsetSize(children[index],droponOptions.overlap)>=0){offset-=Element.offsetSize(children[index],droponOptions.overlap);}else if(offset-(Element.offsetSize(children[index],droponOptions.overlap)/2)>=0){child=index+1<children.length?children[index+1]:null;break;}else{child=children[index];break;}}}
dropon.insertBefore(element,child);Sortable.options(oldParentNode).onChange(element);droponOptions.onChange(element);}},unmark:function(){if(Sortable._marker)Sortable._marker.hide();},mark:function(dropon,position){var sortable=Sortable.options(dropon.parentNode);if(sortable&&!sortable.ghosting)return;if(!Sortable._marker){Sortable._marker=($('dropmarker')||Element.extend(document.createElement('DIV'))).hide().addClassName('dropmarker').setStyle({position:'absolute'});document.getElementsByTagName("body").item(0).appendChild(Sortable._marker);}
var offsets=dropon.cumulativeOffset();Sortable._marker.setStyle({left:offsets[0]+'px',top:offsets[1]+'px'});if(position=='after')
if(sortable.overlap=='horizontal')
Sortable._marker.setStyle({left:(offsets[0]+dropon.clientWidth)+'px'});else
Sortable._marker.setStyle({top:(offsets[1]+dropon.clientHeight)+'px'});Sortable._marker.show();},_tree:function(element,options,parent){var children=Sortable.findElements(element,options)||[];for(var i=0;i<children.length;++i){var match=children[i].id.match(options.format);if(!match)continue;var child={id:encodeURIComponent(match?match[1]:null),element:element,parent:parent,children:[],position:parent.children.length,container:$(children[i]).down(options.treeTag)};if(child.container)
this._tree(child.container,options,child);parent.children.push(child);}
return parent;},tree:function(element){element=$(element);var sortableOptions=this.options(element);var options=Object.extend({tag:sortableOptions.tag,treeTag:sortableOptions.treeTag,only:sortableOptions.only,name:element.id,format:sortableOptions.format},arguments[1]||{});var root={id:null,parent:null,children:[],container:element,position:0};return Sortable._tree(element,options,root);},_constructIndex:function(node){var index='';do{if(node.id)index='['+node.position+']'+index;}while((node=node.parent)!=null);return index;},sequence:function(element){element=$(element);var options=Object.extend(this.options(element),arguments[1]||{});return $(this.findElements(element,options)||[]).map(function(item){return item.id.match(options.format)?item.id.match(options.format)[1]:'';});},setSequence:function(element,new_sequence){element=$(element);var options=Object.extend(this.options(element),arguments[2]||{});var nodeMap={};this.findElements(element,options).each(function(n){if(n.id.match(options.format))
nodeMap[n.id.match(options.format)[1]]=[n,n.parentNode];n.parentNode.removeChild(n);});new_sequence.each(function(ident){var n=nodeMap[ident];if(n){n[1].appendChild(n[0]);delete nodeMap[ident];}});},serialize:function(element){element=$(element);var options=Object.extend(Sortable.options(element),arguments[1]||{});var name=encodeURIComponent((arguments[1]&&arguments[1].name)?arguments[1].name:element.id);if(options.tree){return Sortable.tree(element,arguments[1]).children.map(function(item){return[name+Sortable._constructIndex(item)+"[id]="+
encodeURIComponent(item.id)].concat(item.children.map(arguments.callee));}).flatten().join('&');}else{return Sortable.sequence(element,arguments[1]).map(function(item){return name+"[]="+encodeURIComponent(item);}).join('&');}}};Element.isParent=function(child,element){if(!child.parentNode||child==element)return false;if(child.parentNode==element)return true;return Element.isParent(child.parentNode,element);};Element.findChildren=function(element,only,recursive,tagName){if(!element.hasChildNodes())return null;tagName=tagName.toUpperCase();if(only)only=[only].flatten();var elements=[];$A(element.childNodes).each(function(e){if(e.tagName&&e.tagName.toUpperCase()==tagName&&(!only||(Element.classNames(e).detect(function(v){return only.include(v)}))))
elements.push(e);if(recursive){var grandchildren=Element.findChildren(e,only,recursive,tagName);if(grandchildren)elements.push(grandchildren);}});return(elements.length>0?elements.flatten():[]);};Element.offsetSize=function(element,type){return element['offset'+((type=='vertical'||type=='height')?'Height':'Width')];};if(!Control)var Control={};Control.Slider=Class.create({initialize:function(handle,track,options){var slider=this;if(Object.isArray(handle)){this.handles=handle.collect(function(e){return $(e)});}else{this.handles=[$(handle)];}
this.track=$(track);this.options=options||{};this.axis=this.options.axis||'horizontal';this.increment=this.options.increment||1;this.step=parseInt(this.options.step||'1');this.range=this.options.range||$R(0,1);this.value=0;this.values=this.handles.map(function(){return 0});this.spans=this.options.spans?this.options.spans.map(function(s){return $(s)}):false;this.options.startSpan=$(this.options.startSpan||null);this.options.endSpan=$(this.options.endSpan||null);this.restricted=this.options.restricted||false;this.maximum=this.options.maximum||this.range.end;this.minimum=this.options.minimum||this.range.start;this.alignX=parseInt(this.options.alignX||'0');this.alignY=parseInt(this.options.alignY||'0');this.trackLength=this.maximumOffset()-this.minimumOffset();this.handleLength=this.isVertical()?(this.handles[0].offsetHeight!=0?this.handles[0].offsetHeight:this.handles[0].style.height.replace(/px$/,"")):(this.handles[0].offsetWidth!=0?this.handles[0].offsetWidth:this.handles[0].style.width.replace(/px$/,""));this.active=false;this.dragging=false;this.disabled=false;if(this.options.disabled)this.setDisabled();this.allowedValues=this.options.values?this.options.values.sortBy(Prototype.K):false;if(this.allowedValues){this.minimum=this.allowedValues.min();this.maximum=this.allowedValues.max();}
this.eventMouseDown=this.startDrag.bindAsEventListener(this);this.eventMouseUp=this.endDrag.bindAsEventListener(this);this.eventMouseMove=this.update.bindAsEventListener(this);this.handles.each(function(h,i){i=slider.handles.length-1-i;slider.setValue(parseFloat((Object.isArray(slider.options.sliderValue)?slider.options.sliderValue[i]:slider.options.sliderValue)||slider.range.start),i);h.makePositioned().observe("mousedown",slider.eventMouseDown);});this.track.observe("mousedown",this.eventMouseDown);document.observe("mouseup",this.eventMouseUp);document.observe("mousemove",this.eventMouseMove);this.initialized=true;},dispose:function(){var slider=this;Event.stopObserving(this.track,"mousedown",this.eventMouseDown);Event.stopObserving(document,"mouseup",this.eventMouseUp);Event.stopObserving(document,"mousemove",this.eventMouseMove);this.handles.each(function(h){Event.stopObserving(h,"mousedown",slider.eventMouseDown);});},setDisabled:function(){this.disabled=true;},setEnabled:function(){this.disabled=false;},getNearestValue:function(value){if(this.allowedValues){if(value>=this.allowedValues.max())return(this.allowedValues.max());if(value<=this.allowedValues.min())return(this.allowedValues.min());var offset=Math.abs(this.allowedValues[0]-value);var newValue=this.allowedValues[0];this.allowedValues.each(function(v){var currentOffset=Math.abs(v-value);if(currentOffset<=offset){newValue=v;offset=currentOffset;}});return newValue;}
if(value>this.range.end)return this.range.end;if(value<this.range.start)return this.range.start;return value;},setValue:function(sliderValue,handleIdx){if(!this.active){this.activeHandleIdx=handleIdx||0;this.activeHandle=this.handles[this.activeHandleIdx];this.updateStyles();}
handleIdx=handleIdx||this.activeHandleIdx||0;if(this.initialized&&this.restricted){if((handleIdx>0)&&(sliderValue<this.values[handleIdx-1]))
sliderValue=this.values[handleIdx-1];if((handleIdx<(this.handles.length-1))&&(sliderValue>this.values[handleIdx+1]))
sliderValue=this.values[handleIdx+1];}
sliderValue=this.getNearestValue(sliderValue);this.values[handleIdx]=sliderValue;this.value=this.values[0];this.handles[handleIdx].style[this.isVertical()?'top':'left']=this.translateToPx(sliderValue);this.drawSpans();if(!this.dragging||!this.event)this.updateFinished();},setValueBy:function(delta,handleIdx){this.setValue(this.values[handleIdx||this.activeHandleIdx||0]+delta,handleIdx||this.activeHandleIdx||0);},translateToPx:function(value){return Math.round(((this.trackLength-this.handleLength)/(this.range.end-this.range.start))*(value-this.range.start))+"px";},translateToValue:function(offset){return((offset/(this.trackLength-this.handleLength)*(this.range.end-this.range.start))+this.range.start);},getRange:function(range){var v=this.values.sortBy(Prototype.K);range=range||0;return $R(v[range],v[range+1]);},minimumOffset:function(){return(this.isVertical()?this.alignY:this.alignX);},maximumOffset:function(){return(this.isVertical()?(this.track.offsetHeight!=0?this.track.offsetHeight:this.track.style.height.replace(/px$/,""))-this.alignY:(this.track.offsetWidth!=0?this.track.offsetWidth:this.track.style.width.replace(/px$/,""))-this.alignX);},isVertical:function(){return(this.axis=='vertical');},drawSpans:function(){var slider=this;if(this.spans)
$R(0,this.spans.length-1).each(function(r){slider.setSpan(slider.spans[r],slider.getRange(r))});if(this.options.startSpan)
this.setSpan(this.options.startSpan,$R(0,this.values.length>1?this.getRange(0).min():this.value));if(this.options.endSpan)
this.setSpan(this.options.endSpan,$R(this.values.length>1?this.getRange(this.spans.length-1).max():this.value,this.maximum));},setSpan:function(span,range){if(this.isVertical()){span.style.top=this.translateToPx(range.start);span.style.height=this.translateToPx(range.end-range.start+this.range.start);}else{span.style.left=this.translateToPx(range.start);span.style.width=this.translateToPx(range.end-range.start+this.range.start);}},updateStyles:function(){this.handles.each(function(h){Element.removeClassName(h,'selected')});Element.addClassName(this.activeHandle,'selected');},startDrag:function(event){if(Event.isLeftClick(event)){if(!this.disabled){this.active=true;var handle=Event.element(event);var pointer=[Event.pointerX(event),Event.pointerY(event)];var track=handle;if(track==this.track){var offsets=this.track.cumulativeOffset();this.event=event;this.setValue(this.translateToValue((this.isVertical()?pointer[1]-offsets[1]:pointer[0]-offsets[0])-(this.handleLength/2)));var offsets=this.activeHandle.cumulativeOffset();this.offsetX=(pointer[0]-offsets[0]);this.offsetY=(pointer[1]-offsets[1]);}else{while((this.handles.indexOf(handle)==-1)&&handle.parentNode)
handle=handle.parentNode;if(this.handles.indexOf(handle)!=-1){this.activeHandle=handle;this.activeHandleIdx=this.handles.indexOf(this.activeHandle);this.updateStyles();var offsets=this.activeHandle.cumulativeOffset();this.offsetX=(pointer[0]-offsets[0]);this.offsetY=(pointer[1]-offsets[1]);}}}
Event.stop(event);}},update:function(event){if(this.active){if(!this.dragging)this.dragging=true;this.draw(event);if(Prototype.Browser.WebKit)window.scrollBy(0,0);Event.stop(event);}},draw:function(event){var pointer=[Event.pointerX(event),Event.pointerY(event)];var offsets=this.track.cumulativeOffset();pointer[0]-=this.offsetX+offsets[0];pointer[1]-=this.offsetY+offsets[1];this.event=event;this.setValue(this.translateToValue(this.isVertical()?pointer[1]:pointer[0]));if(this.initialized&&this.options.onSlide)
this.options.onSlide(this.values.length>1?this.values:this.value,this);},endDrag:function(event){if(this.active&&this.dragging){this.finishDrag(event,true);Event.stop(event);}
this.active=false;this.dragging=false;},finishDrag:function(event,success){this.active=false;this.dragging=false;this.updateFinished();},updateFinished:function(){if(this.initialized&&this.options.onChange)
this.options.onChange(this.values.length>1?this.values:this.value,this);this.event=null;}});var Resizables={instances:[],observers:[],register:function(resizable){if(this.instances.length==0){this.eventMouseUp=this.endResize.bindAsEventListener(this);this.eventMouseMove=this.updateResize.bindAsEventListener(this);Event.observe(document,"mouseup",this.eventMouseUp);Event.observe(document,"mousemove",this.eventMouseMove);}
this.instances.push(resizable);},unregister:function(resizable){this.instances=this.instances.reject(function(d){return d==resizable});if(this.instances.length==0){Event.stopObserving(document,"mouseup",this.eventMouseUp);Event.stopObserving(document,"mousemove",this.eventMouseMove);}},activate:function(resizable){if(resizable.options.delay){this._timeout=setTimeout(function(){Resizables._timeout=null;Resizables.activeResizable=resizable;}.bind(this),resizable.options.delay);}else{this.activeResizable=resizable;}},deactivate:function(){this.activeResizable=null;},updateResize:function(event){if(!this.activeResizable)return;var pointer=[Event.pointerX(event),Event.pointerY(event)];if(this._lastPointer&&(this._lastPointer.inspect()==pointer.inspect()))return;this._lastPointer=pointer;this.activeResizable.updateResize(event,pointer);},endResize:function(event){if(this._timeout){clearTimeout(this._timeout);this._timeout=null;}
if(!this.activeResizable)return;this._lastPointer=null;this.activeResizable.endResize(event);this.activeResizable=null;},addObserver:function(observer){this.observers.push(observer);this._cacheObserverCallbacks();},removeObserver:function(element){this.observers=this.observers.reject(function(o){return o.element==element});this._cacheObserverCallbacks();},notify:function(eventName,resizable,event){if(this[eventName+'Count']>0)
this.observers.each(function(o){if(o[eventName])o[eventName](eventName,resizable,event);});if(resizable.options[eventName])resizable.options[eventName](resizable,event);},_cacheObserverCallbacks:function(){['onStart','onEnd','onResize'].each(function(eventName){Resizables[eventName+'Count']=Resizables.observers.select(function(o){return o[eventName];}).length;});}}
var Resizable=Class.create();Resizable._resizing={};Resizable.prototype={initialize:function(element){var defaults={handle:false,snap:false,delay:0,minHeight:false,minwidth:false,maxHeight:false,maxWidth:false}
this.element=$(element);var options=Object.extend(defaults,arguments[1]||{});if(options.handle&&typeof options.handle=='string')
this.handle=$(options.handle);else if(options.handle)
this.handle=options.handle;if(!this.handle)this.handle=this.element;this.options=options;this.dragging=false;this.eventMouseDown=this.initResize.bindAsEventListener(this);Event.observe(this.handle,"mousedown",this.eventMouseDown);Resizables.register(this);},destroy:function(){Event.stopObserving(this.handle,"mousedown",this.eventMouseDown);},currentDelta:function(){return([parseInt(Element.getStyle(this.element,'width')||'0'),parseInt(Element.getStyle(this.element,'height')||'0')]);},initResize:function(event){if(typeof Resizable._resizing[this.element]!='undefined'&&Resizable._resizing[this.element])return;if(Event.isLeftClick(event)){var src=Event.element(event);if((tag_name=src.tagName.toUpperCase())&&(tag_name=='INPUT'||tag_name=='SELECT'||tag_name=='OPTION'||tag_name=='BUTTON'||tag_name=='TEXTAREA'))return;this.pointer=[Event.pointerX(event),Event.pointerY(event)];this.size=[parseInt(this.element.getStyle('width'))||0,parseInt(this.element.getStyle('height'))||0];Resizables.activate(this);Event.stop(event);}},startResize:function(event){this.resizing=true;if(this.options.zindex){this.originalZ=parseInt(Element.getStyle(this.element,'z-index')||0);this.element.style.zIndex=this.options.zindex;}
Resizables.notify('onStart',this,event);Resizable._resizing[this.element]=true;},updateResize:function(event,pointer){if(!this.resizing)this.startResize(event);Resizables.notify('onResize',this,event);this.draw(pointer);if(this.options.change)this.options.change(this);if(Prototype.Browser.WebKit)window.scrollBy(0,0);Event.stop(event);},finishResize:function(event,success){this.resizing=false;Resizables.notify('onEnd',this,event);if(this.options.zindex)this.element.style.zIndex=this.originalZ;Resizable._resizing[this.element]=false;Resizables.deactivate(this);},endResize:function(event){if(!this.resizing)return;this.finishResize(event,true);Event.stop(event);},draw:function(point){var p=[0,1].map(function(i){return(this.size[i]+point[i]-this.pointer[i]);}.bind(this));if(this.options.snap){if(typeof this.options.snap=='function'){p=this.options.snap(p[0],p[1],this);}else{if(this.options.snap instanceof Array){p=p.map(function(v,i){return Math.round(v/this.options.snap[i])*this.options.snap[i]}.bind(this))}else{p=p.map(function(v){return Math.round(v/this.options.snap)*this.options.snap}.bind(this))}}}
var minWidth=(typeof(this.options.minWidth)=='function')?this.options.minWidth(this.element):this.options.minWidth;var maxWidth=(typeof(this.options.maxWidth)=='function')?this.options.maxWidth(this.element):this.options.maxWidth;var minHeight=(typeof(this.options.minHeight)=='function')?this.options.minHeight(this.element):this.options.minHeight;var maxHeight=(typeof(this.options.maxHeight)=='function')?this.options.maxHeight(this.element):this.options.maxHeight;if(minWidth&&p[0]<=minWidth)p[0]=minWidth;if(maxWidth&&p[0]>=maxWidth)p[0]=maxWidth;if(minHeight&&p[1]<=minHeight)p[1]=minHeight;if(maxHeight&&p[1]>=maxHeight)p[1]=maxHeight;var style=this.element.style;if((!this.options.constraint)||(this.options.constraint=='horizontal')){style.width=p[0]+"px";}
if((!this.options.constraint)||(this.options.constraint=='vertical')){style.height=p[1]+"px";}
if(style.visibility=="hidden")style.visibility="";}};if(typeof(Control)=='undefined')
Control={};var $proc=function(proc){return typeof(proc)=='function'?proc:function(){return proc};};var $value=function(value){return typeof(value)=='function'?value():value;};Object.Event={extend:function(object){object._objectEventSetup=function(event_name){this._observers=this._observers||{};this._observers[event_name]=this._observers[event_name]||[];};object.observe=function(event_name,observer){if(typeof(event_name)=='string'&&typeof(observer)!='undefined'){this._objectEventSetup(event_name);if(!this._observers[event_name].include(observer))
this._observers[event_name].push(observer);}else
for(var e in event_name)
this.observe(e,event_name[e]);};object.stopObserving=function(event_name,observer){this._objectEventSetup(event_name);if(event_name&&observer)
this._observers[event_name]=this._observers[event_name].without(observer);else if(event_name)
this._observers[event_name]=[];else
this._observers={};};object.observeOnce=function(event_name,outer_observer){var inner_observer=function(){outer_observer.apply(this,arguments);this.stopObserving(event_name,inner_observer);}.bind(this);this._objectEventSetup(event_name);this._observers[event_name].push(inner_observer);};object.notify=function(event_name){this._objectEventSetup(event_name);var collected_return_values=[];var args=$A(arguments).slice(1);try{for(var i=0;i<this._observers[event_name].length;++i)
collected_return_values.push(this._observers[event_name][i].apply(this._observers[event_name][i],args)||null);}catch(e){if(e==$break)
return false;else
throw e;}
return collected_return_values;};if(object.prototype){object.prototype._objectEventSetup=object._objectEventSetup;object.prototype.observe=object.observe;object.prototype.stopObserving=object.stopObserving;object.prototype.observeOnce=object.observeOnce;object.prototype.notify=function(event_name){if(object.notify){var args=$A(arguments).slice(1);args.unshift(this);args.unshift(event_name);object.notify.apply(object,args);}
this._objectEventSetup(event_name);var args=$A(arguments).slice(1);var collected_return_values=[];try{if(this.options&&this.options[event_name]&&typeof(this.options[event_name])=='function')
collected_return_values.push(this.options[event_name].apply(this,args)||null);for(var i=0;i<this._observers[event_name].length;++i)
collected_return_values.push(this._observers[event_name][i].apply(this._observers[event_name][i],args)||null);}catch(e){if(e==$break)
return false;else
throw e;}
return collected_return_values;};}}};Element.addMethods({observeOnce:function(element,event_name,outer_callback){var inner_callback=function(){outer_callback.apply(this,arguments);Element.stopObserving(element,event_name,inner_callback);};Element.observe(element,event_name,inner_callback);}});(function(){function wheel(event){var delta,element,custom_event;if(event.wheelDelta){delta=event.wheelDelta/120;}else if(event.detail){delta=-event.detail/3;}
if(!delta){return;}
element=Event.extend(event).target;element=Element.extend(element.nodeType===Node.TEXT_NODE?element.parentNode:element);custom_event=element.fire('mouse:wheel',{delta:delta});if(custom_event.stopped){Event.stop(event);return false;}}
document.observe('mousewheel',wheel);document.observe('DOMMouseScroll',wheel);})();var IframeShim=Class.create({initialize:function(){this.element=new Element('iframe',{style:'position:absolute;filter:progid:DXImageTransform.Microsoft.Alpha(opacity=0);display:none',src:'javascript:void(0);',frameborder:0});$(document.body).insert(this.element);},hide:function(){this.element.hide();return this;},show:function(){this.element.show();return this;},positionUnder:function(element){var element=$(element);var offset=element.cumulativeOffset();var dimensions=element.getDimensions();this.element.setStyle({left:offset[0]+'px',top:offset[1]+'px',width:dimensions.width+'px',height:dimensions.height+'px',zIndex:element.getStyle('zIndex')-1}).show();return this;},setBounds:function(bounds){for(prop in bounds)
bounds[prop]+='px';this.element.setStyle(bounds);return this;},destroy:function(){if(this.element)
this.element.remove();return this;}});if(typeof(Prototype)=="undefined"){throw"Control.ContextMenu requires Prototype to be loaded.";}
if(typeof(Object.Event)=="undefined"){throw"Control.ContextMenu requires Object.Event to be loaded.";}
Control.ContextMenu=Class.create({initialize:function(container,options){Control.ContextMenu.load();this.options=Object.extend({leftClick:false,disableOnShiftKey:true,disableOnAltKey:true,selectedClassName:'selected',activatedClassName:'activated',animation:true,animationCycles:2,animationLength:300,delayCallback:true},options||{});this.activated=false;this.items=this.options.items||[];this.container=$(container);this.container.observe(this.options.leftClick?'click':(Prototype.Browser.Opera?'click':'contextmenu'),function(event){if(!Control.ContextMenu.enabled||Prototype.Browser.Opera&&!event.ctrlKey){return;}
this.open(event);}.bindAsEventListener(this));},open:function(event){if(Control.ContextMenu.current&&!Control.ContextMenu.current.close()){return;}
if(this.notify('beforeOpen',event)===false){return false;}
this.buildMenu();if(this.items.length===0){this.close(event);return false;}
this.clicked=Event.element(event);Control.ContextMenu.current=this;Control.ContextMenu.positionContainer(event);Control.ContextMenu.container.show();if(this.notify('afterOpen',event)===false){return false;}
event.stop();return true;},close:function(event){if(event){event.stop();}
if(this.notify('beforeClose')===false){return false;}
Control.ContextMenu.current=false;this.activated=false;Control.ContextMenu.container.removeClassName(this.options.activatedClassName);Control.ContextMenu.container.select('li').invoke('stopObserving');Control.ContextMenu.container.hide();Control.ContextMenu.container.update('');if(this.notify('afterClose')===false){return false;}
return true;},buildMenu:function(){var list=document.createElement('ul');Control.ContextMenu.container.appendChild(list);this.items.each(function(item){if(!(!item.condition||item.condition&&item.condition()!==false)){return;}
var item_container=$(document.createElement('li'));item_container.update($value(item.label));list.appendChild(item_container);item_container[$value(item.enabled)?'removeClassName':'addClassName']('disabled');item_container.observe('mousedown',function(event,item){if(!$value(item.enabled)){return event.stop();}
this.activated=$value(item.label);}.bindAsEventListener(this,item));item_container.observe('click',this.selectMenuItem.bindAsEventListener(this,item,item_container));item_container.observe('contextmenu',this.selectMenuItem.bindAsEventListener(this,item,item_container));}.bind(this));},addItem:function(params){if(!('enabled'in params)){params.enabled=true;}
this.items.push(params);return this;},destroy:function(){this.container.stopObserving(Prototype.Browser.Opera||this.options.leftClick?'click':'contextmenu');this.items=[];},selectMenuItem:function(event,item,item_container){if(!$value(item.enabled)){return event.stop();}
if(!this.activated||this.activated==$value(item.label)){if(this.options.animation){Control.ContextMenu.container.addClassName(this.options.activatedClassName);$A($R(0,this.options.animationCycles*2)).each(function(i){window.setTimeout(function(){item_container.toggleClassName(this.options.selectedClassName);}.bind(this),i*parseInt(this.options.animationLength/(this.options.animationCycles*2),10));}.bind(this));window.setTimeout(function(){if(this.close()&&this.options.delayCallback){item.callback(this.clicked);}}.bind(this),this.options.animationLength);if(!this.options.delayCallback){item.callback(this.clicked);}}else if(this.close()){item.callback(this.clicked);}}
event.stop();return false;}});Object.extend(Control.ContextMenu,{loaded:false,capture_all:false,menus:[],current:false,enabled:false,offset:4,load:function(capture_all){if(Control.ContextMenu.loaded){return;}
Control.ContextMenu.loaded=true;if(typeof(capture_all)=='undefined'){capture_all=false;}
Control.ContextMenu.capture_all=capture_all;Control.ContextMenu.container=$(document.createElement('div'));Control.ContextMenu.container.id='control_contextmenu';Control.ContextMenu.container.style.position='absolute';Control.ContextMenu.container.style.zIndex=99999;Control.ContextMenu.container.hide();document.body.appendChild(Control.ContextMenu.container);Control.ContextMenu.enable();},enable:function(){Control.ContextMenu.enabled=true;Event.observe(document.body,'click',Control.ContextMenu.onClick);if(Control.ContextMenu.capture_all){Event.observe(document.body,'contextmenu',Control.ContextMenu.onContextMenu);}},disable:function(){Event.stopObserving(document.body,'click',Control.ContextMenu.onClick);if(Control.ContextMenu.capture_all){Event.stopObserving(document.body,'contextmenu',Control.ContextMenu.onContextMenu);}},onContextMenu:function(event){event.stop();return false;},onClick:function(){if(Control.ContextMenu.current){Control.ContextMenu.current.close();}},positionContainer:function(event){var dimensions=Control.ContextMenu.container.getDimensions();var top=Event.pointerY(event);var left=Event.pointerX(event);var bottom=dimensions.height+top;var right=dimensions.width+left;var viewport_dimensions=document.viewport.getDimensions();var viewport_scroll_offsets=document.viewport.getScrollOffsets();if(bottom>viewport_dimensions.height+viewport_scroll_offsets.top){top-=bottom-((viewport_dimensions.height+viewport_scroll_offsets.top)-Control.ContextMenu.offset);}
if(right>viewport_dimensions.width+viewport_scroll_offsets.left){left-=right-((viewport_dimensions.width+viewport_scroll_offsets.left)-Control.ContextMenu.offset);}
Control.ContextMenu.container.setStyle({top:top+'px',left:left+'px'});}});Object.Event.extend(Control.ContextMenu);if(typeof(Prototype)=="undefined"){throw"Cookie requires Prototype to be loaded.";}
if(typeof(Object.Event)=="undefined"){throw"Cookie requires Object.Event to be loaded.";}
var Cookie={build:function(){return $A(arguments).compact().join("; ");},secondsFromNow:function(seconds){var d=new Date();d.setTime(d.getTime()+(seconds*1000));return d.toGMTString();},set:function(name,value,seconds){Cookie.notify('set',name,value);var expiry=seconds?'expires='+Cookie.secondsFromNow(seconds):null;document.cookie=Cookie.build(name+"="+value,expiry,"path=/");},get:function(name){Cookie.notify('get',name);var valueMatch=new RegExp(name+"=([^;]+)").exec(document.cookie);return valueMatch?valueMatch[1]:null;},unset:function(name){Cookie.notify('unset',name);Cookie.set(name,'',-1);}};Object.Event.extend(Cookie);if(typeof(Prototype)=="undefined"){throw"Event.Behavior requires Prototype to be loaded.";}
if(typeof(Object.Event)=="undefined"){throw"Event.Behavior requires Object.Event to be loaded.";}
Event.Behavior={addVerbs:function(verbs){var v;for(var name in verbs){if(verbs.hasOwnProperty(name)){v=new Event.Behavior.Verb(verbs[name]);Event.Behavior.Verbs[name]=v;Event.Behavior[name.underscore()]=Event.Behavior[name]=v.getCallbackForStack.bind(v);}}},addEvents:function(events){$H(events).each(function(event_type){Event.Behavior.Adjective.prototype[event_type.key.underscore()]=Event.Behavior.Adjective.prototype[event_type.key]=function(){this.nextConditionType='and';this.events.push(event_type.value);this.attachObserver(false);return this;};});},invokeElementMethod:function(element,action,args){if(typeof(element)=='function'){return $A(element()).each(function(e){if(typeof(args[0])=='function'){return $A(args[0]).each(function(a){return $(e)[action].apply($(e),(a?[a]:[]));});}else{return $(e)[action].apply($(e),args||[]);}});}else{return $(element)[action].apply($(element),args||[]);}}};Event.Behavior.Verbs=$H({});Event.Behavior.Verb=Class.create();Object.extend(Event.Behavior.Verb.prototype,{originalAction:false,execute:false,executeOpposite:false,target:false,initialize:function(action){this.originalAction=action;this.execute=function(action,target,argument){return(argument)?action(target,argument):action(target);}.bind(this,action);},setOpposite:function(opposite_verb){var opposite_action=opposite_verb.originalAction;this.executeOpposite=function(opposite_action,target,argument){return(argument)?opposite_action(target,argument):opposite_action(target);}.bind(this,opposite_action);},getCallbackForStack:function(argument){return new Event.Behavior.Noun(this,argument);}});Event.Behavior.addVerbs({call:function(callback){callback();},show:function(element){return Event.Behavior.invokeElementMethod(element,'show');},hide:function(element){return Event.Behavior.invokeElementMethod(element,'hide');},remove:function(element){return Event.Behavior.invokeElementMethod(element,'remove');},setStyle:function(element,styles){return Event.Behavior.invokeElementMethod(element,'setStyle',[(typeof(styles)=='function'?styles():styles)]);},addClassName:function(element,class_name){return Event.Behavior.invokeElementMethod(element,'addClassName',[(typeof(class_name)=='function'?class_name():class_name)]);},removeClassName:function(element,class_name){return Event.Behavior.invokeElementMethod(element,'removeClassName',[(typeof(class_name)=='function'?class_name():class_name)]);},setClassName:function(element,class_name){var c=(typeof(class_name)=='function')?class_name():class_name;if(typeof(element)=='function'){return $A(element()).each(function(e){$(e).className=c;});}else{c=$(element).className;return c;}},update:function(content,element){return Event.Behavior.invokeElementMethod(element,'update',[(typeof(content)=='function'?content():content)]);},replace:function(content,element){return Event.Behavior.invokeElementMethod(element,'replace',[(typeof(content)=='function'?content():content)]);}});Event.Behavior.Verbs.show.setOpposite(Event.Behavior.Verbs.hide);Event.Behavior.Verbs.hide.setOpposite(Event.Behavior.Verbs.show);Event.Behavior.Verbs.addClassName.setOpposite(Event.Behavior.Verbs.removeClassName);Event.Behavior.Verbs.removeClassName.setOpposite(Event.Behavior.Verbs.addClassName);Event.Behavior.Noun=Class.create();Object.extend(Event.Behavior.Noun.prototype,{verbs:false,verb:false,argument:false,subject:false,target:false,initialize:function(verb,argument){this.verb=verb;this.argument=argument;},execute:function(){return(this.target)?this.verb.execute(this.target,this.argument):this.verb.execute(this.argument);},executeOpposite:function(){return(this.target)?this.verb.executeOpposite(this.target,this.argument):this.verb.executeOpposite(this.argument);},when:function(subject){this.subject=subject;return new Event.Behavior.Adjective(this);},getValue:function(){return Try.these(function(){return $(this.subject).getValue();}.bind(this),function(){return $(this.subject).options[$(this.subject).options.selectedIndex].value;}.bind(this),function(){return $(this.subject).value;}.bind(this),function(){return $(this.subject).innerHTML;}.bind(this));},containsValue:function(match){var value=this.getValue();if(typeof(match)=='function'){return $A(match()).include(value);}else{return value.match(match);}},setTarget:function(target){this.target=target;return this;},and:function(){}});Event.Behavior.Noun.prototype._with=Event.Behavior.Noun.prototype.setTarget;Event.Behavior.Noun.prototype.on=Event.Behavior.Noun.prototype.setTarget;Event.Behavior.Noun.prototype.of=Event.Behavior.Noun.prototype.setTarget;Event.Behavior.Noun.prototype.to=Event.Behavior.Noun.prototype.setTarget;Event.Behavior.Noun.prototype.from=Event.Behavior.Noun.prototype.setTarget;Event.Behavior.Adjective=Class.create();Object.extend(Event.Behavior.Adjective.prototype,{noun:false,lastConditionName:'',nextConditionType:'and',conditions:$A([]),events:$A([]),attached:false,initialize:function(noun){this.conditions=$A([]);this.events=$A([]);this.noun=noun;},attachObserver:function(execute_on_load){if(this.attached){if(execute_on_load){this.execute();}
return;}
this.attached=true;if(typeof(this.noun.subject)=='function'){$A(this.noun.subject()).each(function(subject){(this.events.length>0?this.events:$A(['change'])).each(function(event_name){(subject.observe?subject:$(subject)).observe(event_name,function(){this.execute();}.bind(this));}.bind(this));}.bind(this));}else{(this.events.length>0?this.events:$A(['change'])).each(function(event_name){$(this.noun.subject).observe(event_name,function(){this.execute();}.bind(this));}.bind(this));}
if(execute_on_load){this.execute();}},execute:function(){if(this.match()){return this.noun.execute();}
else if(this.noun.verb.executeOpposite){this.noun.executeOpposite();}},attachCondition:function(callback){this.conditions.push([this.nextConditionType,callback.bind(this)]);},match:function(){if(this.conditions.length===0){return true;}
else{return this.conditions.inject(false,function(bool,condition){return(condition[0]==='or')?(bool&&condition[1]()):(bool||condition[1]());});}},is:function(item){this.lastConditionName='is';this.attachCondition(function(item){return(typeof(item)=='function'?item():item)==this.noun.getValue();}.bind(this,item));this.attachObserver(true);return this;},isNot:function(item){this.lastConditionName='isNot';this.attachCondition(function(item){return(typeof(item)=='function'?item():item)!=this.noun.getValue();}.bind(this,item));this.attachObserver(true);return this;},contains:function(item){this.lastConditionName='contains';this.attachCondition(function(item){return this.noun.containsValue(item);}.bind(this,item));this.attachObserver(true);return this;},within:function(item){this.lastConditionName='within';this.attachCondition(function(item){}.bind(this,item));this.attachObserver(true);return this;},change:function(){this.nextConditionType='and';this.attachObserver(true);return this;},and:function(condition){this.attached=false;this.nextConditionType='and';if(condition){this[this.lastConditionName](condition);}
return this;},or:function(condition){this.attached=false;this.nextConditionType='or';if(condition){this[this.lastConditionName](condition);}
return this;}});Event.Behavior.addEvents({losesFocus:'blur',gainsFocus:'focus',isClicked:'click',isDoubleClicked:'dblclick',keyPressed:'keypress'});Event.Behavior.Adjective.prototype.is_not=Event.Behavior.Adjective.prototype.isNot;Event.Behavior.Adjective.prototype.include=Event.Behavior.Adjective.prototype.contains;Event.Behavior.Adjective.prototype.includes=Event.Behavior.Adjective.prototype.contains;Event.Behavior.Adjective.prototype.are=Event.Behavior.Adjective.prototype.is;Event.Behavior.Adjective.prototype.areNot=Event.Behavior.Adjective.prototype.isNot;Event.Behavior.Adjective.prototype.are_not=Event.Behavior.Adjective.prototype.isNot;Event.Behavior.Adjective.prototype.changes=Event.Behavior.Adjective.prototype.change;if(typeof(Prototype)=="undefined"){throw"HotKey requires Prototype to be loaded.";}
if(typeof(Object.Event)=="undefined"){throw"HotKey requires Object.Event to be loaded.";}
var HotKey=Class.create({initialize:function(letter,callback,options){letter=letter.toUpperCase();HotKey.hotkeys.push(this);this.options=Object.extend({element:false,shiftKey:false,altKey:false,ctrlKey:true,bubbleEvent:true,fireOnce:false},options||{});this.letter=letter;this.callback=function(event){if(!(this.options.fireOnce&&this.fired)&&Object.isFunction(callback)){callback(event);}
if(!this.options.bubbleEvent){event.stop();}
this.fired=true;};this.element=$(this.options.element||document);this.handler=function(event){if(!event||((Event['KEY_'+this.letter]||this.letter.charCodeAt(0))==event.keyCode&&((!this.options.shiftKey||(this.options.shiftKey&&event.shiftKey))&&(!this.options.altKey||(this.options.altKey&&event.altKey))&&(!this.options.ctrlKey||(this.options.ctrlKey&&event.ctrlKey))))){if(this.notify('beforeCallback',event)===false){return;}
this.callback(event);this.notify('afterCallback',event);}}.bind(this);this.enable();},trigger:function(){this.handler();},enable:function(){this.element.observe('keydown',this.handler);},disable:function(){this.element.stopObserving('keydown',this.handler);},destroy:function(){this.disable();HotKey.hotkeys=HotKey.hotkeys.without(this);}});Object.extend(HotKey,{hotkeys:[]});Object.Event.extend(HotKey);if(typeof(Control)=="undefined")
Control={};if(typeof(Object.Event)=="undefined")
throw"Control.Pagination requires Object.Event to be loaded.";Control.Paginator=Class.create({initialize:function(items,options){this.items=items;this.options=Object.extend({size:10,onPageChange:Prototype.emptyFunction,onItemChange:Prototype.emptyFunction},options||{});this.setSize(this.options.size);this.page_index=1;this.item_index=0;},setSize:function(size){this.options.size=size;this.number_of_pages=Math.ceil(this.items.length/this.options.size);},pageIndexFromItemIndex:function(item_index){return Math.floor(((item_index||this.item_index)/this.options.size)+1);},goToPage:function(page_index){this.page_index=page_index;this.triggerOnPageChange();},triggerOnPageChange:function(){this.notify('onPageChange',this.items.slice((this.page_index-1)*this.options.size,((this.page_index-1)*this.options.size)+this.options.size),this.page_index);},goToItem:function(item_index){this.item_index=item_index;this.notify('onItemChange',this.items[this.item_index],this.item_index);var new_page_index=this.pageIndexFromItemIndex(this.item_index);if(new_page_index!=this.page_index)
this.goToPage(new_page_index);},hasNextItem:function(){return this.item_index<this.items.length-1;},hasPreviousItem:function(){return this.item_index>=1;},nextItem:function(){if(!this.hasNextItem())
return false;this.goToItem(this.item_index+1);return true;},previousItem:function(){if(!this.hasPreviousItem())
return false;this.goToItem(this.item_index-1);return true;},hasNextPage:function(){return this.page_index<this.number_of_pages;},hasPreviousPage:function(){return this.page_index>=2;},nextPage:function(){if(!this.hasNextPage())
return false;this.goToPage(this.page_index+1);return true;},previousPage:function(){if(!this.hasPreviousPage())
return false;this.goToPage(this.page_index-1);return true;}});Object.Event.extend(Control.Paginator);if(typeof(Prototype)=="undefined"){throw"Control.ProgressBar requires Prototype to be loaded.";}
if(typeof(Object.Event)=="undefined"){throw"Control.ProgressBar requires Object.Event to be loaded.";}
Control.ProgressBar=Class.create({initialize:function(container,options){this.progress=0;this.executer=false;this.active=false;this.poller=false;this.container=$(container);this.containerWidth=this.container.getDimensions().width-(parseInt(this.container.getStyle('border-right-width').replace(/px/,''),10)+parseInt(this.container.getStyle('border-left-width').replace(/px/,''),10));this.progressContainer=$(document.createElement('div'));this.progressContainer.setStyle({width:this.containerWidth+'px',height:'100%',position:'absolute',top:'0px',right:'0px'});this.container.appendChild(this.progressContainer);this.options={afterChange:Prototype.emptyFunction,interval:0.25,step:1,classNames:{active:'progress_bar_active',inactive:'progress_bar_inactive'}};Object.extend(this.options,options||{});this.container.addClassName(this.options.classNames.inactive);this.active=false;},setProgress:function(value){this.progress=value;this.draw();if(this.progress>=100){this.stop(false);}
this.notify('afterChange',this.progress,this.active);},poll:function(url,interval,ajaxOptions){ajaxOptions=ajaxOptions||{};var success=ajaxOptions.onSuccess||Prototype.emptyFunction;ajaxOptions.onSuccess=success.wrap(function(callOriginal,request){this.setProgress(parseInt(request.responseText,10));if(!this.active){this.poller.stop();}
callOriginal(request);}).bind(this);this.active=true;this.poller=new PeriodicalExecuter(function(){var a=new Ajax.Request(url,ajaxOptions);}.bind(this),interval||3);},start:function(){this.active=true;this.container.removeClassName(this.options.classNames.inactive);this.container.addClassName(this.options.classNames.active);this.executer=new PeriodicalExecuter(this.step.bind(this,this.options.step),this.options.interval);},stop:function(reset){this.active=false;if(this.executer){this.executer.stop();}
this.container.removeClassName(this.options.classNames.active);this.container.addClassName(this.options.classNames.inactive);if(typeof reset==='undefined'||reset===true){this.reset();}},step:function(amount){this.active=true;this.setProgress(Math.min(100,this.progress+amount));},reset:function(){this.active=false;this.setProgress(0);},draw:function(){this.progressContainer.setStyle({width:(this.containerWidth-Math.floor((parseInt(this.progress,10)/100)*this.containerWidth))+'px'});},notify:function(event_name){if(this.options[event_name]){return[this.options[event_name].apply(this.options[event_name],$A(arguments).slice(1))];}}});Object.Event.extend(Control.ProgressBar);if(typeof(Prototype)=="undefined"){throw"Control.Rating requires Prototype to be loaded.";}
if(typeof(Object.Event)=="undefined"){throw"Control.Rating requires Object.Event to be loaded.";}
Control.Rating=Class.create({initialize:function(container,options){Control.Rating.instances.push(this);this.value=false;this.links=[];this.container=$(container);this.container.update('');this.options={min:1,max:5,rated:false,input:false,reverse:false,capture:true,multiple:false,classNames:{off:'rating_off',half:'rating_half',on:'rating_on',selected:'rating_selected'},updateUrl:false,updateParameterName:'value',updateOptions:{},afterChange:Prototype.emptyFunction};Object.extend(this.options,options||{});if(this.options.value){this.value=this.options.value;delete this.options.value;}
if(this.options.input){this.options.input=$(this.options.input);this.options.input.observe('change',function(input){this.setValueFromInput(input);}.bind(this,this.options.input));this.setValueFromInput(this.options.input,true);}
var range=$R(this.options.min,this.options.max);(this.options.reverse?$A(range).reverse():range).each(function(i){var link=this.buildLink(i);this.container.appendChild(link);this.links.push(link);}.bind(this));this.setValue(this.value||this.options.min-1,false,true);},buildLink:function(rating){var link=$(document.createElement('a'));link.value=rating;if(this.options.multiple||(!this.options.rated&&!this.options.multiple)){link.href='';link.onmouseover=this.mouseOver.bind(this,link);link.onmouseout=this.mouseOut.bind(this,link);link.onclick=this.click.bindAsEventListener(this,link);}else{link.style.cursor='default';link.observe('click',function(event){Event.stop(event);return false;}.bindAsEventListener(this));}
link.addClassName(this.options.classNames.off);return link;},disable:function(){this.links.each(function(link){link.onmouseover=Prototype.emptyFunction;link.onmouseout=Prototype.emptyFunction;link.onclick=Prototype.emptyFunction;link.observe('click',function(event){Event.stop(event);return false;}.bindAsEventListener(this));link.style.cursor='default';}.bind(this));},setValueFromInput:function(input,prevent_callbacks){this.setValue($F(input),true,prevent_callbacks);},setValue:function(value,force_selected,prevent_callbacks){this.value=value;if(this.options.input){if(this.options.input.options){$A(this.options.input.options).each(function(option,i){if(option.value==this.value){this.options.input.options.selectedIndex=i;throw $break;}}.bind(this));}else{this.options.input.value=this.value;}}
this.render(this.value,force_selected);if(!prevent_callbacks){if(this.options.updateUrl){var params={},a;params[this.options.updateParameterName]=this.value;a=new Ajax.Request(this.options.updateUrl,Object.extend(this.options.updateOptions,{parameters:params}));}
this.notify('afterChange',this.value);}},render:function(rating,force_selected){(this.options.reverse?this.links.reverse():this.links).each(function(link,i){if(link.value<=Math.ceil(rating)){link.className=this.options.classNames[link.value<=rating?'on':'half'];if(this.options.rated||force_selected){link.addClassName(this.options.classNames.selected);}}else{link.className=this.options.classNames.off;}}.bind(this));},mouseOver:function(link){this.render(link.value,true);},mouseOut:function(link){this.render(this.value);},click:function(event,link){this.options.rated=true;this.setValue((link.value?link.value:link),true);if(!this.options.multiple){this.disable();}
if(this.options.capture){Event.stop(event);return false;}}});Object.extend(Control.Rating,{instances:[],findByElementId:function(id){return Control.Rating.instances.find(function(instance){return(instance.container.id&&instance.container.id==id);});}});Object.Event.extend(Control.Rating);if(typeof(Prototype)=="undefined")
throw"Control.ScrollBar requires Prototype to be loaded.";if(typeof(Control.Slider)=="undefined")
throw"Control.ScrollBar requires Control.Slider to be loaded.";if(typeof(Object.Event)=="undefined")
throw"Control.ScrollBar requires Object.Event to be loaded.";Control.ScrollBar=Class.create({initialize:function(container,track,options){this.enabled=false;this.notificationTimeout=false;this.container=$(container);this.boundMouseWheelEvent=this.onMouseWheel.bindAsEventListener(this);this.boundResizeObserver=this.onWindowResize.bind(this);this.track=$(track);this.handle=this.track.firstDescendant();this.options=Object.extend({active_class_name:'scrolling',apply_active_class_name_to:this.container,notification_timeout_length:125,handle_minimum_height:25,scroll_to_smoothing:0.01,scroll_to_steps:15,proportional:true,slider_options:{}},options||{});this.slider=new Control.Slider(this.handle,this.track,Object.extend({axis:'vertical',onSlide:this.onChange.bind(this),onChange:this.onChange.bind(this)},this.options.slider_options));this.recalculateLayout();Event.observe(window,'resize',this.boundResizeObserver);this.handle.observe('mousedown',function(){if(this.auto_sliding_executer)
this.auto_sliding_executer.stop();}.bind(this));},destroy:function(){Event.stopObserving(window,'resize',this.boundResizeObserver);},enable:function(){this.enabled=true;this.container.observe('mouse:wheel',this.boundMouseWheelEvent);this.slider.setEnabled();this.track.show();if(this.options.active_class_name)
$(this.options.apply_active_class_name_to).addClassName(this.options.active_class_name);this.notify('enabled');},disable:function(){this.enabled=false;this.container.stopObserving('mouse:wheel',this.boundMouseWheelEvent);this.slider.setDisabled();this.track.hide();if(this.options.active_class_name)
$(this.options.apply_active_class_name_to).removeClassName(this.options.active_class_name);this.notify('disabled');this.reset();},reset:function(){this.slider.setValue(0);},recalculateLayout:function(){if(this.container.scrollHeight<=this.container.offsetHeight)
this.disable();else{this.enable();this.slider.trackLength=this.slider.maximumOffset()-this.slider.minimumOffset();if(this.options.proportional){this.handle.style.height=Math.max(this.container.offsetHeight*(this.container.offsetHeight/this.container.scrollHeight),this.options.handle_minimum_height)+'px';this.slider.handleLength=this.handle.style.height.replace(/px/,'');}}},onWindowResize:function(){this.recalculateLayout();this.scrollBy(0);},onMouseWheel:function(event){if(this.auto_sliding_executer)
this.auto_sliding_executer.stop();this.slider.setValueBy(-(event.memo.delta/20));event.stop();return false;},onChange:function(value){this.container.scrollTop=Math.round(value/this.slider.maximum*(this.container.scrollHeight-this.container.offsetHeight));if(this.notification_timeout)
window.clearTimeout(this.notificationTimeout);this.notificationTimeout=window.setTimeout(function(){this.notify('change',value);}.bind(this),this.options.notification_timeout_length);},getCurrentMaximumDelta:function(){return this.slider.maximum*(this.container.scrollHeight-this.container.offsetHeight);},getDeltaToElement:function(element){return this.slider.maximum*((element.positionedOffset().top+(element.getHeight()/2))-(this.container.getHeight()/2));},scrollTo:function(y,animate){var current_maximum_delta=this.getCurrentMaximumDelta();if(y=='top')
y=0;else if(y=='bottom')
y=current_maximum_delta;else if(typeof(y)!="number")
y=this.getDeltaToElement($(y));if(this.enabled){y=Math.max(0,Math.min(y,current_maximum_delta));if(this.auto_sliding_executer)
this.auto_sliding_executer.stop();var target_value=y/current_maximum_delta;var original_slider_value=this.slider.value;var delta=(target_value-original_slider_value)*current_maximum_delta;if(animate){this.auto_sliding_executer=new PeriodicalExecuter(function(){if(Math.round(this.slider.value*100)/100<Math.round(target_value*100)/100||Math.round(this.slider.value*100)/100>Math.round(target_value*100)/100){this.scrollBy(delta/this.options.scroll_to_steps);}else{this.auto_sliding_executer.stop();this.auto_sliding_executer=null;if(typeof(animate)=="function")
animate();}}.bind(this),this.options.scroll_to_smoothing);}else
this.scrollBy(delta);}else if(typeof(animate)=="function")
animate();},scrollBy:function(y){if(!this.enabled)
return false;this.slider.setValueBy(y/this.getCurrentMaximumDelta());}});Object.Event.extend(Control.ScrollBar);if(typeof(Prototype)=="undefined"){throw"Control.Selection requires Prototype to be loaded.";}
if(typeof(Object.Event)=="undefined"){throw"Control.Selection requires Object.Event to be loaded.";}
Control.Selection={options:{resize_layout_timeout:125,selected:Prototype.emptyFunction,deselected:Prototype.emptyFunction,change:Prototype.emptyFunction,selection_id:'control_selection',selection_style:{zIndex:999,cursor:'default',border:'1px dotted #000'},filter:function(element){return true;},drag_proxy:false,drag_proxy_threshold:1,drag_proxy_options:{}},selectableElements:[],elements:[],selectableObjects:[],objects:[],active:false,container:false,resizeTimeout:false,load:function(options){Control.Selection.options=Object.extend(Control.Selection.options,options||{});Control.Selection.selection_div=$(document.createElement('div'));Control.Selection.selection_div.id=Control.Selection.options.selection_id;Control.Selection.selection_div.style.display='none';Control.Selection.selection_div.setStyle(Control.Selection.options.selection_style);Control.Selection.border_width=parseInt(Control.Selection.selection_div.getStyle('border-top-width'),10)*2;Control.Selection.container=Prototype.Browser.IE?window.container:window;$(document.body).insert(Control.Selection.selection_div);Control.Selection.enable();if(Control.Selection.options.drag_proxy&&typeof(Draggable)!='undefined'){Control.Selection.DragProxy.load();}
Event.observe(window,'resize',function(){if(Control.Selection.resizeTimeout){window.clearTimeout(Control.Selection.resizeTimeout);}
Control.Selection.resizeTimeout=window.setTimeout(Control.Selection.recalculateLayout,Control.Selection.options.resize_layout_timeout);});if(Prototype.Browser.IE){var body=$$('body').first();body.observe('mouseleave',Control.Selection.stop);body.observe('mouseup',Control.Selection.stop);}},enable:function(){if(Prototype.Browser.IE){document.onselectstart=function(){return false;};}
Event.observe(Control.Selection.container,'mousedown',Control.Selection.start);Event.observe(Control.Selection.container,'mouseup',Control.Selection.stop);},disable:function(){if(Prototype.Browser.IE){document.onselectstart=function(){return true;};}
Event.stopObserving(Control.Selection.container,'mousedown',Control.Selection.start);Event.stopObserving(Control.Selection.container,'mouseup',Control.Selection.stop);},recalculateLayout:function(){Control.Selection.selectableElements.each(function(element){var dimensions=element.getDimensions();var offset=element.cumulativeOffset();var scroll_offset=element.cumulativeScrollOffset();if(!element._control_selection){element._control_selection={};}
element._control_selection.top=offset[1]-scroll_offset[1];element._control_selection.left=offset[0]-scroll_offset[0];element._control_selection.width=dimensions.width;element._control_selection.height=dimensions.height;});},addSelectable:function(element,object,activation_targets,activation_target_callback){element=$(element);if(activation_targets){activation_targets=activation_targets.each?activation_targets:[activation_targets];}
var dimensions=element.getDimensions();var offset=Element.cumulativeOffset(element);element._control_selection={activation_targets:activation_targets,is_selected:false,top:offset[1],left:offset[0],width:dimensions.width,height:dimensions.height,activationTargetMouseMove:function(){Control.Selection.notify('activationTargetMouseMove',element);if(activation_targets){activation_targets.each(function(activation_target){activation_target.stopObserving('mousemove',element._control_selection.activationTargetMouseMove);});}
Control.Selection.DragProxy.container.stopObserving('mousemove',element._control_selection.activationTargetMouseMove);},activationTargetMouseDown:function(event){if(!Control.Selection.elements.include(element)){Control.Selection.select(element);}
Control.Selection.DragProxy.start(event);Control.Selection.DragProxy.container.hide();if(activation_targets){activation_targets.each(function(activation_target){activation_target.observe('mousemove',element._control_selection.activationTargetMouseMove);});}
Control.Selection.DragProxy.container.observe('mousemove',element._control_selection.activationTargetMouseMove);},activationTargetClick:function(){Control.Selection.select(element);if(typeof(activation_target_callback)=="function"){activation_target_callback();}
if(activation_targets){activation_targets.each(function(activation_target){activation_target.stopObserving('mousemove',element._control_selection.activationTargetMouseMove);});}
Control.Selection.DragProxy.container.stopObserving('mousemove',element._control_selection.activationTargetMouseMove);}};element.onselectstart=function(){return false;};element.unselectable='on';element.style.MozUserSelect='none';if(activation_targets){activation_targets.each(function(activation_target){activation_target.observe('mousedown',element._control_selection.activationTargetMouseDown);activation_target.observe('click',element._control_selection.activationTargetClick);});}
Control.Selection.selectableElements.push(element);Control.Selection.selectableObjects.push(object);},removeSelectable:function(element){element=$(element);if(element._control_selection.activation_targets){element._control_selection.activation_targets.each(function(activation_target){activation_target.stopObserving('mousedown',element._control_selection.activationTargetMouseDown);});element._control_selection.activation_targets.each(function(activation_target){activation_target.stopObserving('click',element._control_selection.activationTargetClick);});}
element._control_selection=null;element.onselectstart=function(){return true;};element.unselectable='off';element.style.MozUserSelect='';var position=0;Control.Selection.selectableElements.each(function(selectable_element,i){if(selectable_element==element){position=i;throw $break;}});Control.Selection.selectableElements=Control.Selection.selectableElements.without(element);Control.Selection.selectableObjects=Control.Selection.selectableObjects.slice(0,position).concat(Control.Selection.selectableObjects.slice(position+1));},select:function(selected_elements){if(typeof(selected_elements)=="undefined"||!selected_elements){selected_elements=[];}
if(!selected_elements.each&&!selected_elements._each){selected_elements=[selected_elements];}
var selected_items_have_changed=!(Control.Selection.elements.length==selected_elements.length&&Control.Selection.elements.all(function(item,i){return selected_elements[i]==item;}));if(!selected_items_have_changed){return;}
var selected_objects_indexed_by_element={};var selected_objects=selected_elements.collect(function(selected_element){var selected_object=Control.Selection.selectableObjects[Control.Selection.selectableElements.indexOf(selected_element)];selected_objects_indexed_by_element[selected_element]=selected_object;return selected_object;});if(Control.Selection.elements.length===0&&selected_elements.length!==0){selected_elements.each(function(element){Control.Selection.notify('selected',element,selected_objects_indexed_by_element[element]);});}else{Control.Selection.elements.each(function(element){if(!selected_elements.include(element)){Control.Selection.notify('deselected',element,selected_objects_indexed_by_element[element]);}});selected_elements.each(function(element){if(!Control.Selection.elements.include(element)){Control.Selection.notify('selected',element,selected_objects_indexed_by_element[element]);}});}
Control.Selection.elements=selected_elements;Control.Selection.objects=selected_objects;Control.Selection.notify('change',Control.Selection.elements,Control.Selection.objects);},deselect:function(){if(Control.Selection.notify('deselect')===false){return false;}
Control.Selection.elements.each(function(element){Control.Selection.notify('deselected',element,Control.Selection.selectableObjects[Control.Selection.selectableElements.indexOf(element)]);});Control.Selection.objects=[];Control.Selection.elements=[];Control.Selection.notify('change',Control.Selection.objects,Control.Selection.elements);return true;},start:function(event){if(!event.isLeftClick()||Control.Selection.notify('start',event)===false){return false;}
if(!event.shiftKey&&!event.altKey){Control.Selection.deselect();}
Event.observe(Control.Selection.container,'mousemove',Control.Selection.onMouseMove);Event.stop(event);return false;},stop:function(){Event.stopObserving(Control.Selection.container,'mousemove',Control.Selection.onMouseMove);Control.Selection.active=false;Control.Selection.selection_div.setStyle({display:'none',top:null,left:null,width:null,height:null});Control.Selection.start_mouse_coordinates={};Control.Selection.current_mouse_coordinates={};},mouseCoordinatesFromEvent:function(event){return{x:Event.pointerX(event),y:Event.pointerY(event)};},onClick:function(event,element,source){var selection=[];if(event.shiftKey){selection=Control.Selection.elements.clone();if(!selection.include(element)){selection.push(element);}}else if(event.altKey){selection=Control.Selection.elements.clone();if(selection.include(element)){selection=selection.without(element);}}else{selection=[element];}
Control.Selection.select(selection);if(source=='click'){Event.stop(event);}},onMouseMove:function(event){if(!Control.Selection.active){Control.Selection.active=true;Control.Selection.start_mouse_coordinates=Control.Selection.mouseCoordinatesFromEvent(event);}else{Control.Selection.current_mouse_coordinates=Control.Selection.mouseCoordinatesFromEvent(event);Control.Selection.drawSelectionDiv();var current_selection=Control.Selection.selectableElements.findAll(function(element){return Control.Selection.options.filter(element)&&Control.Selection.elementWithinSelection(element);});if(event.shiftKey&&!event.altKey){Control.Selection.elements.each(function(element){if(!current_selection.include(element)){current_selection.push(element);}});}else if(event.altKey&&!event.shiftKey){current_selection=Control.Selection.elements.findAll(function(element){return!current_selection.include(element);});}
Control.Selection.select(current_selection);}},drawSelectionDiv:function(){if(Control.Selection.start_mouse_coordinates==Control.Selection.current_mouse_coordinates){Control.Selection.selection_div.style.display='none';}else{Control.Selection.viewport=document.viewport.getDimensions();Control.Selection.selection_div.style.position='absolute';Control.Selection.current_direction=(Control.Selection.start_mouse_coordinates.y>Control.Selection.current_mouse_coordinates.y?'N':'S')+(Control.Selection.start_mouse_coordinates.x<Control.Selection.current_mouse_coordinates.x?'E':'W');Control.Selection.selection_div.setStyle(Control.Selection['dimensionsFor'+Control.Selection.current_direction]());Control.Selection.selection_div.style.display='block';}},dimensionsForNW:function(){return{top:(Control.Selection.start_mouse_coordinates.y-(Control.Selection.start_mouse_coordinates.y-Control.Selection.current_mouse_coordinates.y))+'px',left:(Control.Selection.start_mouse_coordinates.x-(Control.Selection.start_mouse_coordinates.x-Control.Selection.current_mouse_coordinates.x))+'px',width:(Control.Selection.start_mouse_coordinates.x-Control.Selection.current_mouse_coordinates.x)+'px',height:(Control.Selection.start_mouse_coordinates.y-Control.Selection.current_mouse_coordinates.y)+'px'};},dimensionsForNE:function(){return{top:(Control.Selection.start_mouse_coordinates.y-(Control.Selection.start_mouse_coordinates.y-Control.Selection.current_mouse_coordinates.y))+'px',left:Control.Selection.start_mouse_coordinates.x+'px',width:Math.min((Control.Selection.viewport.width-Control.Selection.start_mouse_coordinates.x)-Control.Selection.border_width,Control.Selection.current_mouse_coordinates.x-Control.Selection.start_mouse_coordinates.x)+'px',height:(Control.Selection.start_mouse_coordinates.y-Control.Selection.current_mouse_coordinates.y)+'px'};},dimensionsForSE:function(){return{top:Control.Selection.start_mouse_coordinates.y+'px',left:Control.Selection.start_mouse_coordinates.x+'px',width:Math.min((Control.Selection.viewport.width-Control.Selection.start_mouse_coordinates.x)-Control.Selection.border_width,Control.Selection.current_mouse_coordinates.x-Control.Selection.start_mouse_coordinates.x)+'px',height:Math.min((Control.Selection.viewport.height-Control.Selection.start_mouse_coordinates.y)-Control.Selection.border_width,Control.Selection.current_mouse_coordinates.y-Control.Selection.start_mouse_coordinates.y)+'px'};},dimensionsForSW:function(){return{top:Control.Selection.start_mouse_coordinates.y+'px',left:(Control.Selection.start_mouse_coordinates.x-(Control.Selection.start_mouse_coordinates.x-Control.Selection.current_mouse_coordinates.x))+'px',width:(Control.Selection.start_mouse_coordinates.x-Control.Selection.current_mouse_coordinates.x)+'px',height:Math.min((Control.Selection.viewport.height-Control.Selection.start_mouse_coordinates.y)-Control.Selection.border_width,Control.Selection.current_mouse_coordinates.y-Control.Selection.start_mouse_coordinates.y)+'px'};},inBoundsForNW:function(element,selection){return(((element.left>selection.left||element.right>selection.left)&&selection.right>element.left)&&((element.top>selection.top||element.bottom>selection.top)&&selection.bottom>element.top));},inBoundsForNE:function(element,selection){return(((element.left<selection.right||element.left<selection.right)&&selection.left<element.right)&&((element.top>selection.top||element.bottom>selection.top)&&selection.bottom>element.top));},inBoundsForSE:function(element,selection){return(((element.left<selection.right||element.left<selection.right)&&selection.left<element.right)&&((element.bottom<selection.bottom||element.top<selection.bottom)&&selection.top<element.bottom));},inBoundsForSW:function(element,selection){return(((element.left>selection.left||element.right>selection.left)&&selection.right>element.left)&&((element.bottom<selection.bottom||element.top<selection.bottom)&&selection.top<element.bottom));},elementWithinSelection:function(element){if(Control.Selection['inBoundsFor'+Control.Selection.current_direction]({top:element._control_selection.top,left:element._control_selection.left,bottom:element._control_selection.top+element._control_selection.height,right:element._control_selection.left+element._control_selection.width},{top:parseInt(Control.Selection.selection_div.style.top,10),left:parseInt(Control.Selection.selection_div.style.left,10),bottom:parseInt(Control.Selection.selection_div.style.top,10)+parseInt(Control.Selection.selection_div.style.height,10),right:parseInt(Control.Selection.selection_div.style.left,10)+parseInt(Control.Selection.selection_div.style.width,10)})){element._control_selection.is_selected=true;return true;}else{element._control_selection.is_selected=false;return false;}},DragProxy:{active:false,xorigin:0,yorigin:0,load:function(){Control.Selection.DragProxy.container=$(document.createElement('div'));Control.Selection.DragProxy.container.id='control_selection_drag_proxy';Control.Selection.DragProxy.container.setStyle({position:'absolute',top:'1px',left:'1px',zIndex:99999});Control.Selection.DragProxy.container.hide();document.body.appendChild(Control.Selection.DragProxy.container);Control.Selection.observe('selected',Control.Selection.DragProxy.selected);Control.Selection.observe('deselected',Control.Selection.DragProxy.deselected);},start:function(event){if(event.isRightClick()){Control.Selection.DragProxy.container.hide();return;}
if(Control.Selection.DragProxy.xorigin==Event.pointerX(event)&&Control.Selection.DragProxy.yorigin==Event.pointerY(event)){return;}
Control.Selection.DragProxy.active=true;Control.Selection.DragProxy.container.setStyle({position:'absolute',top:Event.pointerY(event)+'px',left:Event.pointerX(event)+'px'});Control.Selection.DragProxy.container.observe('mouseup',Control.Selection.DragProxy.onMouseUp);Control.Selection.DragProxy.container.show();Control.Selection.DragProxy.container._draggable=new Draggable(Control.Selection.DragProxy.container,Object.extend({onEnd:Control.Selection.DragProxy.stop},Control.Selection.options.drag_proxy_options));Control.Selection.DragProxy.container._draggable.eventMouseDown(event);Control.Selection.DragProxy.notify('start',Control.Selection.DragProxy.container,Control.Selection.elements);},stop:function(){window.setTimeout(function(){Control.Selection.DragProxy.active=false;Control.Selection.DragProxy.container.hide();if(Control.Selection.DragProxy.container._draggable){Control.Selection.DragProxy.container._draggable.destroy();Control.Selection.DragProxy.container._draggable=null;}
Control.Selection.DragProxy.notify('stop');},1);},onClick:function(event){Control.Selection.DragProxy.xorigin=Event.pointerX(event);Control.Selection.DragProxy.yorigin=Event.pointerY(event);if(event.isRightClick()){Control.Selection.DragProxy.container.hide();}
if(Control.Selection.elements.length>=Control.Selection.options.drag_proxy_threshold&&!(event.shiftKey||event.altKey)&&(Control.Selection.DragProxy.xorigin!=Event.pointerX(event)||Control.Selection.DragProxy.yorigin!=Event.pointerY(event))){Control.Selection.DragProxy.start(event);Event.stop(event);}},onMouseUp:function(event){Control.Selection.DragProxy.stop();Control.Selection.DragProxy.container.stopObserving('mouseup',Control.Selection.DragProxy.onMouseUp);},selected:function(element){element.observe('mousedown',Control.Selection.DragProxy.onClick);},deselected:function(element){element.stopObserving('mousedown',Control.Selection.DragProxy.onClick);}}};Object.Event.extend(Control.Selection);Object.Event.extend(Control.Selection.DragProxy);if(typeof(Prototype)=="undefined"){throw"Control.SelectMultiple requires Prototype to be loaded.";}
if(typeof(Object.Event)=="undefined"){throw"Control.SelectMultiple requires Object.Event to be loaded.";}
Control.SelectMultiple=Class.create({select:false,container:false,numberOfCheckedBoxes:0,checkboxes:[],hasExtraOption:false,initialize:function(select,container,options){this.options={checkboxSelector:'input[type=checkbox]',nameSelector:'span.name',labelSeparator:', ',valueSeparator:',',afterChange:Prototype.emptyFunction,overflowString:function(str){return str.truncate();},overflowLength:30};Object.extend(this.options,options||{});this.select=$(select);this.container=$(container);this.checkboxes=(typeof(this.options.checkboxSelector)=='function')?this.options.checkboxSelector.bind(this)():this.container.getElementsBySelector(this.options.checkboxSelector);var value_was_set=false;if(this.options.value){value_was_set=true;this.setValue(this.options.value);delete this.options.value;}
this.hasExtraOption=false;this.checkboxes.each(function(checkbox){checkbox.observe('click',this.checkboxOnClick.bind(this,checkbox));}.bind(this));this.select.observe('change',this.selectOnChange.bind(this));this.countAndCheckCheckBoxes();if(!value_was_set){this.scanCheckBoxes();}
this.notify('afterChange',this.select.options[this.select.options.selectedIndex].value);},countAndCheckCheckBoxes:function(){this.numberOfCheckedBoxes=this.checkboxes.inject(0,function(number,checkbox){checkbox.checked=(this.select.options[this.select.options.selectedIndex].value==checkbox.value);var value_string=this.select.options[this.select.options.selectedIndex].value;var value_collection=$A(value_string.split?value_string.split(this.options.valueSeparator):value_string);var should_check=value_collection.any(function(value){if(!should_check&&checkbox.value==value){return true;}}.bind(this));checkbox.checked=should_check;if(checkbox.checked){++number;}
return number;}.bind(this));},setValue:function(value_string){this.numberOfCheckedBoxes=0;var value_collection=$A(value_string.split?value_string.split(this.options.valueSeparator):value_string);this.checkboxes.each(function(checkbox){checkbox.checked=false;value_collection.each(function(value){if(checkbox.value==value){++this.numberOfCheckedBoxes;checkbox.checked=true;}}.bind(this));}.bind(this));this.scanCheckBoxes();},selectOnChange:function(){this.removeExtraOption();this.countAndCheckCheckBoxes();this.notify('afterChange',this.select.options[this.select.options.selectedIndex].value);},checkboxOnClick:function(checkbox){this.numberOfCheckedBoxes=this.checkboxes.findAll(function(c){return c.checked;}).length;this.scanCheckBoxes();this.notify('afterChange',this.numberOfCheckedBoxes===0?"":this.select.options[this.select.options.selectedIndex].value);},scanCheckBoxes:function(){switch(this.numberOfCheckedBoxes){case 1:this.checkboxes.each(function(checkbox){if(checkbox.checked){$A(this.select.options).each(function(option,i){if(option.value==checkbox.value){this.select.options.selectedIndex=i;throw $break;}}.bind(this));throw $break;}}.bind(this));break;case 0:this.removeExtraOption();break;default:this.addExtraOption();break;}},getLabelForExtraOption:function(){var label=(typeof(this.options.nameSelector)=='function'?this.options.nameSelector.bind(this)():this.container.getElementsBySelector(this.options.nameSelector).inject([],function(labels,name_element,i){if(this.checkboxes[i].checked){labels.push(name_element.innerHTML);}
return labels;}.bind(this))).join(this.options.labelSeparator);return(label.length>=this.options.overflowLength&&this.options.overflowLength>0)?(typeof(this.options.overflowString)=='function'?this.options.overflowString(label):this.options.overflowString):label;},getValueForExtraOption:function(){return this.checkboxes.inject([],function(values,checkbox){if(checkbox.checked){values.push(checkbox.value);}
return values;}).join(this.options.valueSeparator);},addExtraOption:function(){this.removeExtraOption();this.hasExtraOption=true;this.select.options[this.select.options.length]=new Option(this.getLabelForExtraOption(),this.getValueForExtraOption());this.select.options.selectedIndex=this.select.options.length-1;},removeExtraOption:function(){if(this.hasExtraOption){this.select.remove(this.select.options.length-1);this.hasExtraOption=false;}}});Object.Event.extend(Control.SelectMultiple);if(typeof(Prototype)=="undefined"){throw"Control.Tabs requires Prototype to be loaded.";}
if(typeof(Object.Event)=="undefined"){throw"Control.Tabs requires Object.Event to be loaded.";}
Control.Tabs=Class.create({initialize:function(tab_list_container,options){if(!$(tab_list_container)){throw"Control.Tabs could not find the element: "+tab_list_container;}
this.activeContainer=false;this.activeLink=false;this.containers=$H({});this.links=[];Control.Tabs.instances.push(this);this.options={beforeChange:Prototype.emptyFunction,afterChange:Prototype.emptyFunction,hover:false,linkSelector:'li a',setClassOnContainer:false,activeClassName:'active',defaultTab:'first',autoLinkExternal:true,targetRegExp:/#(.+)$/,showFunction:Element.show,hideFunction:Element.hide};Object.extend(this.options,options||{});(typeof(this.options.linkSelector=='string')?$(tab_list_container).select(this.options.linkSelector):this.options.linkSelector($(tab_list_container))).findAll(function(link){return(/^#/).exec((Prototype.Browser.WebKit?decodeURIComponent(link.href):link.href).replace(window.location.href.split('#')[0],''));}).each(function(link){this.addTab(link);}.bind(this));this.containers.values().each(Element.hide);if(this.options.defaultTab=='first'){this.setActiveTab(this.links.first());}else if(this.options.defaultTab=='last'){this.setActiveTab(this.links.last());}else{this.setActiveTab(this.options.defaultTab);}
var targets=this.options.targetRegExp.exec(window.location);if(targets&&targets[1]){targets[1].split(',').each(function(target){this.setActiveTab(this.links.find(function(link){return link.key==target;}));}.bind(this));}
if(this.options.autoLinkExternal){$A(document.getElementsByTagName('a')).each(function(a){if(!this.links.include(a)){var clean_href=a.href.replace(window.location.href.split('#')[0],'');if(clean_href.substring(0,1)=='#'){if(this.containers.keys().include(clean_href.substring(1))){$(a).observe('click',function(event,clean_href){this.setActiveTab(clean_href.substring(1));}.bindAsEventListener(this,clean_href));}}}}.bind(this));}},addTab:function(link){this.links.push(link);link.key=link.getAttribute('href').replace(window.location.href.split('#')[0],'').split('#').last().replace(/#/,'');var container=$(link.key);if(!container){throw"Control.Tabs: #"+link.key+" was not found on the page.";}
this.containers.set(link.key,container);link[this.options.hover?'onmouseover':'onclick']=function(link){if(window.event){Event.stop(window.event);}
this.setActiveTab(link);return false;}.bind(this,link);},setActiveTab:function(link){if(!link&&typeof(link)=='undefined'){return;}
if(typeof(link)=='string'){this.setActiveTab(this.links.find(function(_link){return _link.key==link;}));}else if(typeof(link)=='number'){this.setActiveTab(this.links[link]);}else{if(this.notify('beforeChange',this.activeContainer,this.containers.get(link.key))===false){return;}
if(this.activeContainer){this.options.hideFunction(this.activeContainer);}
this.links.each(function(item){(this.options.setClassOnContainer?$(item.parentNode):item).removeClassName(this.options.activeClassName);}.bind(this));(this.options.setClassOnContainer?$(link.parentNode):link).addClassName(this.options.activeClassName);this.activeContainer=this.containers.get(link.key);this.activeLink=link;this.options.showFunction(this.containers.get(link.key));this.notify('afterChange',this.containers.get(link.key));}},next:function(){this.links.each(function(link,i){if(this.activeLink==link&&this.links[i+1]){this.setActiveTab(this.links[i+1]);throw $break;}}.bind(this));},previous:function(){this.links.each(function(link,i){if(this.activeLink==link&&this.links[i-1]){this.setActiveTab(this.links[i-1]);throw $break;}}.bind(this));},first:function(){this.setActiveTab(this.links.first());},last:function(){this.setActiveTab(this.links.last());}});Object.extend(Control.Tabs,{instances:[],findByTabId:function(id){return Control.Tabs.instances.find(function(tab){return tab.links.find(function(link){return link.key==id;});});}});Object.Event.extend(Control.Tabs);if(typeof(Prototype)=="undefined"){throw"Control.TextArea requires Prototype to be loaded.";}
if(typeof(Object.Event)=="undefined"){throw"Control.TextArea requires Object.Event to be loaded.";}
Control.TextArea=Class.create({initialize:function(textarea){this.onChangeTimeout=false;this.element=$(textarea);$(this.element).observe('keyup',this.doOnChange.bindAsEventListener(this));$(this.element).observe('paste',this.doOnChange.bindAsEventListener(this));$(this.element).observe('input',this.doOnChange.bindAsEventListener(this));if(!!document.selection){$(this.element).observe('mouseup',this.saveRange.bindAsEventListener(this));$(this.element).observe('keyup',this.saveRange.bindAsEventListener(this));}},doOnChange:function(event){if(this.onChangeTimeout){window.clearTimeout(this.onChangeTimeout);}
this.onChangeTimeout=window.setTimeout(function(){this.notify('change',this.getValue());}.bind(this),Control.TextArea.onChangeTimeoutLength);},saveRange:function(){this.range=document.selection.createRange();},getValue:function(){return this.element.value;},getSelection:function(){if(!!document.selection){return document.selection.createRange().text;}
else if(!!this.element.setSelectionRange){return this.element.value.substring(this.element.selectionStart,this.element.selectionEnd);}
else{return false;}},replaceSelection:function(text){var scroll_top=this.element.scrollTop;if(!!document.selection){this.element.focus();var range=(this.range)?this.range:document.selection.createRange();range.text=text;range.select();}else if(!!this.element.setSelectionRange){var selection_start=this.element.selectionStart;this.element.value=this.element.value.substring(0,selection_start)+text+this.element.value.substring(this.element.selectionEnd);this.element.setSelectionRange(selection_start+text.length,selection_start+text.length);}
this.doOnChange();this.element.focus();this.element.scrollTop=scroll_top;},wrapSelection:function(before,after){var sel=this.getSelection();if(sel.indexOf(before)===0&&sel.lastIndexOf(after)===(sel.length-after.length)){this.replaceSelection(sel.substring(before.length,sel.length-after.length));}else{this.replaceSelection(before+sel+after);}},insertBeforeSelection:function(text){this.replaceSelection(text+this.getSelection());},insertAfterSelection:function(text){this.replaceSelection(this.getSelection()+text);},collectFromEachSelectedLine:function(callback,before,after){this.replaceSelection((before||'')+$A(this.getSelection().split("\n")).collect(callback).join("\n")+(after||''));},insertBeforeEachSelectedLine:function(text,before,after){this.collectFromEachSelectedLine(function(line){},before,after);}});Object.extend(Control.TextArea,{onChangeTimeoutLength:500});Object.Event.extend(Control.TextArea);Control.TextArea.ToolBar=Class.create({initialize:function(textarea,toolbar){this.textarea=textarea;if(toolbar){this.container=$(toolbar);}
else{this.container=$(document.createElement('ul'));this.textarea.element.parentNode.insertBefore(this.container,this.textarea.element);}},attachButton:function(node,callback){node.onclick=function(){return false;};$(node).observe('click',callback.bindAsEventListener(this.textarea));},addButton:function(link_text,callback,attrs){var li=document.createElement('li');var a=document.createElement('a');a.href='#';this.attachButton(a,callback);li.appendChild(a);Object.extend(a,attrs||{});if(link_text){var span=document.createElement('span');span.innerHTML=link_text;a.appendChild(span);}
this.container.appendChild(li);}});if(typeof(Draggable)!='undefined'){Draggable.prototype.draw=function(point){var pos=Position.cumulativeOffset(this.element);if(this.options.ghosting){var r=Position.realOffset(this.element);pos[0]+=r[0]-Position.deltaX;pos[1]+=r[1]-Position.deltaY;}
var d=this.currentDelta();pos[0]-=d[0];pos[1]-=d[1];if(this.options.scroll&&(this.options.scroll!=window&&this._isScrollChild)){pos[0]-=this.options.scroll.scrollLeft-this.originalScrollLeft;pos[1]-=this.options.scroll.scrollTop-this.originalScrollTop;}
var p=[0,1].map(function(i){return(point[i]-pos[i]-this.offset[i])}.bind(this));if(this.options.snap){if(typeof this.options.snap=='function'){p=this.options.snap(p[0],p[1],this);}else{if(this.options.snap instanceof Array){p=p.map(function(v,i){return Math.round(v/this.options.snap[i])*this.options.snap[i]}.bind(this))}else{p=p.map(function(v){return Math.round(v/this.options.snap)*this.options.snap}.bind(this))}}}
if(this.options.onDraw)
this.options.onDraw.bind(this)(p);else{var style=this.element.style;if(this.options.constrainToViewport){var viewport_dimensions=document.viewport.getDimensions();var container_dimensions=this.element.getDimensions();var margin_top=parseInt(this.element.getStyle('margin-top'));var margin_left=parseInt(this.element.getStyle('margin-left'));var boundary=[[0-margin_left,0-margin_top],[(viewport_dimensions.width-container_dimensions.width)-margin_left,(viewport_dimensions.height-container_dimensions.height)-margin_top]];if((!this.options.constraint)||(this.options.constraint=='horizontal')){if((p[0]>=boundary[0][0])&&(p[0]<=boundary[1][0]))
this.element.style.left=p[0]+"px";else
this.element.style.left=((p[0]<boundary[0][0])?boundary[0][0]:boundary[1][0])+"px";}
if((!this.options.constraint)||(this.options.constraint=='vertical')){if((p[1]>=boundary[0][1])&&(p[1]<=boundary[1][1]))
this.element.style.top=p[1]+"px";else
this.element.style.top=((p[1]<=boundary[0][1])?boundary[0][1]:boundary[1][1])+"px";}}else{if((!this.options.constraint)||(this.options.constraint=='horizontal'))
style.left=p[0]+"px";if((!this.options.constraint)||(this.options.constraint=='vertical'))
style.top=p[1]+"px";}
if(style.visibility=="hidden")
style.visibility="";}};}
if(typeof(Prototype)=="undefined")
throw"Control.Window requires Prototype to be loaded.";if(typeof(IframeShim)=="undefined")
throw"Control.Window requires IframeShim to be loaded.";if(typeof(Object.Event)=="undefined")
throw"Control.Window requires Object.Event to be loaded.";Control.Window=Class.create({initialize:function(container,options){Control.Window.windows.push(this);this.container=false;this.isOpen=false;this.href=false;this.sourceContainer=false;this.ajaxRequest=false;this.remoteContentLoaded=false;this.numberInSequence=Control.Window.windows.length+1;this.indicator=false;this.effects={fade:false,appear:false};this.indicatorEffects={fade:false,appear:false};this.options=Object.extend({beforeOpen:Prototype.emptyFunction,afterOpen:Prototype.emptyFunction,beforeClose:Prototype.emptyFunction,afterClose:Prototype.emptyFunction,height:null,width:null,className:false,position:'center',offsetLeft:0,offsetTop:0,iframe:false,hover:false,indicator:false,closeOnClick:false,iframeshim:true,fade:false,fadeDuration:0.75,draggable:false,onDrag:Prototype.emptyFunction,resizable:false,minHeight:false,minWidth:false,maxHeight:false,maxWidth:false,onResize:Prototype.emptyFunction,constrainToViewport:false,method:'post',parameters:{},onComplete:Prototype.emptyFunction,onSuccess:Prototype.emptyFunction,onFailure:Prototype.emptyFunction,onException:Prototype.emptyFunction,onRemoteContentLoaded:Prototype.emptyFunction,insertRemoteContentAt:false},options||{});this.indicator=this.options.indicator?$(this.options.indicator):false;if(container){if(typeof(container)=="string"&&container.match(Control.Window.uriRegex))
this.href=container;else{this.container=$(container);this.createDefaultContainer(container);if(this.container&&((this.container.readAttribute('href')&&this.container.readAttribute('href')!='')||(this.options.hover&&this.options.hover!==true))){if(this.options.hover&&this.options.hover!==true)
this.sourceContainer=$(this.options.hover);else{this.sourceContainer=this.container;this.href=this.container.readAttribute('href');var rel=this.href.match(/^#(.+)$/);if(rel&&rel[1]){this.container=$(rel[1]);this.href=false;}else
this.container=false;}
this.sourceContainerOpenHandler=function(event){this.open(event);event.stop();return false;}.bindAsEventListener(this);this.sourceContainerCloseHandler=function(event){this.close(event);}.bindAsEventListener(this);this.sourceContainerMouseMoveHandler=function(event){this.position(event);}.bindAsEventListener(this);if(this.options.hover){this.sourceContainer.observe('mouseenter',this.sourceContainerOpenHandler);this.sourceContainer.observe('mouseleave',this.sourceContainerCloseHandler);if(this.options.position=='mouse')
this.sourceContainer.observe('mousemove',this.sourceContainerMouseMoveHandler);}else
this.sourceContainer.observe('click',this.sourceContainerOpenHandler);}}}
this.createDefaultContainer(container);if(this.options.insertRemoteContentAt===false)
this.options.insertRemoteContentAt=this.container;var styles={margin:0,position:'absolute',zIndex:Control.Window.initialZIndexForWindow()};if(this.options.width)
styles.width=$value(this.options.width)+'px';if(this.options.height)
styles.height=$value(this.options.height)+'px';this.container.setStyle(styles);if(this.options.className)
this.container.addClassName(this.options.className);this.positionHandler=this.position.bindAsEventListener(this);this.outOfBoundsPositionHandler=this.ensureInBounds.bindAsEventListener(this);this.bringToFrontHandler=this.bringToFront.bindAsEventListener(this);this.container.observe('mousedown',this.bringToFrontHandler);this.container.hide();this.closeHandler=this.close.bindAsEventListener(this);if(this.options.iframeshim){this.iFrameShim=new IframeShim();this.iFrameShim.hide();}
this.applyResizable();this.applyDraggable();Event.observe(window,'resize',this.outOfBoundsPositionHandler);this.notify('afterInitialize');},open:function(event){if(this.isOpen){this.bringToFront();return false;}
if(this.notify('beforeOpen')===false)
return false;if(this.options.closeOnClick){if(this.options.closeOnClick===true)
this.closeOnClickContainer=$(document.body);else if(this.options.closeOnClick=='container')
this.closeOnClickContainer=this.container;else if(this.options.closeOnClick=='overlay'){Control.Overlay.load();this.closeOnClickContainer=Control.Overlay.container;}else
this.closeOnClickContainer=$(this.options.closeOnClick);this.closeOnClickContainer.observe('click',this.closeHandler);}
if(this.href&&!this.options.iframe&&!this.remoteContentLoaded){this.remoteContentLoaded=true;if(this.href.match(/\.(jpe?g|gif|png|tiff?)$/i)){var img=new Element('img');img.observe('load',function(img){this.getRemoteContentInsertionTarget().insert(img);this.position();if(this.notify('onRemoteContentLoaded')!==false){if(this.options.indicator)
this.hideIndicator();this.finishOpen();}}.bind(this,img));img.writeAttribute('src',this.href);}else{if(!this.ajaxRequest){if(this.options.indicator)
this.showIndicator();this.ajaxRequest=new Ajax.Request(this.href,{method:this.options.method,parameters:this.options.parameters,onComplete:function(request){this.notify('onComplete',request);this.ajaxRequest=false;}.bind(this),onSuccess:function(request){this.getRemoteContentInsertionTarget().insert(request.responseText);this.notify('onSuccess',request);if(this.notify('onRemoteContentLoaded')!==false){if(this.options.indicator)
this.hideIndicator();this.finishOpen();}}.bind(this),onFailure:function(request){this.notify('onFailure',request);if(this.options.indicator)
this.hideIndicator();}.bind(this),onException:function(request,e){this.notify('onException',request,e);if(this.options.indicator)
this.hideIndicator();}.bind(this)});}}
return true;}else if(this.options.iframe&&!this.remoteContentLoaded){this.remoteContentLoaded=true;if(this.options.indicator)
this.showIndicator();this.getRemoteContentInsertionTarget().insert(Control.Window.iframeTemplate.evaluate({href:this.href}));var iframe=this.container.down('iframe');iframe.onload=function(){this.notify('onRemoteContentLoaded');if(this.options.indicator)
this.hideIndicator();iframe.onload=null;}.bind(this);}
this.finishOpen(event);return true},close:function(event){if(!this.isOpen||this.notify('beforeClose',event)===false)
return false;if(this.options.closeOnClick)
this.closeOnClickContainer.stopObserving('click',this.closeHandler);if(this.options.fade){this.effects.fade=new Effect.Fade(this.container,{queue:{position:'front',scope:'Control.Window'+this.numberInSequence},from:1,to:0,duration:this.options.fadeDuration/2,afterFinish:function(){if(this.iFrameShim)
this.iFrameShim.hide();this.isOpen=false;this.notify('afterClose');}.bind(this)});}else{this.container.hide();if(this.iFrameShim)
this.iFrameShim.hide();}
if(this.ajaxRequest)
this.ajaxRequest.transport.abort();if(!(this.options.draggable||this.options.resizable)&&this.options.position=='center')
Event.stopObserving(window,'resize',this.positionHandler);if(!this.options.draggable&&this.options.position=='center')
Event.stopObserving(window,'scroll',this.positionHandler);if(this.options.indicator)
this.hideIndicator();if(!this.options.fade){this.isOpen=false;this.notify('afterClose');}
return true;},position:function(event){if(this.options.position=='mouse'){var xy=[Event.pointerX(event),Event.pointerY(event)];this.container.setStyle({top:xy[1]+$value(this.options.offsetTop)+'px',left:xy[0]+$value(this.options.offsetLeft)+'px'});return;}
var container_dimensions=this.container.getDimensions();var viewport_dimensions=document.viewport.getDimensions();Position.prepare();var offset_left=(Position.deltaX+Math.floor((viewport_dimensions.width-container_dimensions.width)/2));var offset_top=(Position.deltaY+((viewport_dimensions.height>container_dimensions.height)?Math.floor((viewport_dimensions.height-container_dimensions.height)/2):0));if(this.options.position=='center'){this.container.setStyle({top:(container_dimensions.height<=viewport_dimensions.height)?((offset_top!=null&&offset_top>0)?offset_top:0)+'px':0,left:(container_dimensions.width<=viewport_dimensions.width)?((offset_left!=null&&offset_left>0)?offset_left:0)+'px':0});}else if(this.options.position=='relative'){var xy=this.sourceContainer.cumulativeOffset();var top=xy[1]+$value(this.options.offsetTop);var left=xy[0]+$value(this.options.offsetLeft);this.container.setStyle({top:(container_dimensions.height<=viewport_dimensions.height)?(this.options.constrainToViewport?Math.max(0,Math.min(viewport_dimensions.height-(container_dimensions.height),top)):top)+'px':0,left:(container_dimensions.width<=viewport_dimensions.width)?(this.options.constrainToViewport?Math.max(0,Math.min(viewport_dimensions.width-(container_dimensions.width),left)):left)+'px':0});}else if(this.options.position.length){var top=$value(this.options.position[1])+$value(this.options.offsetTop);var left=$value(this.options.position[0])+$value(this.options.offsetLeft);this.container.setStyle({top:(container_dimensions.height<=viewport_dimensions.height)?(this.options.constrainToViewport?Math.max(0,Math.min(viewport_dimensions.height-(container_dimensions.height),top)):top)+'px':0,left:(container_dimensions.width<=viewport_dimensions.width)?(this.options.constrainToViewport?Math.max(0,Math.min(viewport_dimensions.width-(container_dimensions.width),left)):left)+'px':0});}
if(this.iFrameShim)
this.updateIFrameShimZIndex();},ensureInBounds:function(){if(!this.isOpen)
return;var viewport_dimensions=document.viewport.getDimensions();var container_offset=this.container.cumulativeOffset();var container_dimensions=this.container.getDimensions();if(container_offset.left+container_dimensions.width>viewport_dimensions.width){this.container.setStyle({left:(Math.max(0,viewport_dimensions.width-container_dimensions.width))+'px'});}
if(container_offset.top+container_dimensions.height>viewport_dimensions.height){this.container.setStyle({top:(Math.max(0,viewport_dimensions.height-container_dimensions.height))+'px'});}},bringToFront:function(){Control.Window.bringToFront(this);this.notify('bringToFront');},destroy:function(){this.container.stopObserving('mousedown',this.bringToFrontHandler);if(this.draggable){Draggables.removeObserver(this.container);this.draggable.handle.stopObserving('mousedown',this.bringToFrontHandler);this.draggable.destroy();}
if(this.resizable){Resizables.removeObserver(this.container);this.resizable.handle.stopObserving('mousedown',this.bringToFrontHandler);this.resizable.destroy();}
if(this.container&&!this.sourceContainer)
this.container.remove();if(this.sourceContainer){if(this.options.hover){this.sourceContainer.stopObserving('mouseenter',this.sourceContainerOpenHandler);this.sourceContainer.stopObserving('mouseleave',this.sourceContainerCloseHandler);if(this.options.position=='mouse')
this.sourceContainer.stopObserving('mousemove',this.sourceContainerMouseMoveHandler);}else
this.sourceContainer.stopObserving('click',this.sourceContainerOpenHandler);}
if(this.iFrameShim)
this.iFrameShim.destroy();Event.stopObserving(window,'resize',this.outOfBoundsPositionHandler);Control.Window.windows=Control.Window.windows.without(this);this.notify('afterDestroy');},applyResizable:function(){if(this.options.resizable){if(typeof(Resizable)=="undefined")
throw"Control.Window requires resizable.js to be loaded.";var resizable_handle=null;if(this.options.resizable===true){resizable_handle=new Element('div',{className:'resizable_handle'});this.container.insert(resizable_handle);}else
resizable_handle=$(this.options.resziable);this.resizable=new Resizable(this.container,{handle:resizable_handle,minHeight:this.options.minHeight,minWidth:this.options.minWidth,maxHeight:this.options.constrainToViewport?function(element){return(document.viewport.getDimensions().height-parseInt(element.style.top||0))-(element.getHeight()-parseInt(element.style.height||0));}:this.options.maxHeight,maxWidth:this.options.constrainToViewport?function(element){return(document.viewport.getDimensions().width-parseInt(element.style.left||0))-(element.getWidth()-parseInt(element.style.width||0));}:this.options.maxWidth});this.resizable.handle.observe('mousedown',this.bringToFrontHandler);Resizables.addObserver(new Control.Window.LayoutUpdateObserver(this,function(){if(this.iFrameShim)
this.updateIFrameShimZIndex();this.notify('onResize');}.bind(this)));}},applyDraggable:function(){if(this.options.draggable){if(typeof(Draggables)=="undefined")
throw"Control.Window requires dragdrop.js to be loaded.";var draggable_handle=null;if(this.options.draggable===true){draggable_handle=new Element('div',{className:'draggable_handle'});this.container.insert(draggable_handle);}else
draggable_handle=$(this.options.draggable);this.draggable=new Draggable(this.container,{handle:draggable_handle,constrainToViewport:this.options.constrainToViewport,zindex:this.container.getStyle('z-index'),starteffect:function(){if(Prototype.Browser.IE){this.old_onselectstart=document.onselectstart;document.onselectstart=function(){return false;};}}.bind(this),endeffect:function(){document.onselectstart=this.old_onselectstart;}.bind(this)});this.draggable.handle.observe('mousedown',this.bringToFrontHandler);Draggables.addObserver(new Control.Window.LayoutUpdateObserver(this,function(){if(this.iFrameShim)
this.updateIFrameShimZIndex();this.notify('onDrag');}.bind(this)));}},createDefaultContainer:function(container){if(!this.container){this.container=new Element('div',{id:'control_window_'+this.numberInSequence});$(document.body).insert(this.container);if(typeof(container)=="string"&&$(container)==null&&!container.match(/^#(.+)$/)&&!container.match(Control.Window.uriRegex))
this.container.update(container);}},finishOpen:function(event){this.bringToFront();if(this.options.fade){if(typeof(Effect)=="undefined")
throw"Control.Window requires effects.js to be loaded."
if(this.effects.fade)
this.effects.fade.cancel();this.effects.appear=new Effect.Appear(this.container,{queue:{position:'end',scope:'Control.Window.'+this.numberInSequence},from:0,to:1,duration:this.options.fadeDuration/2,afterFinish:function(){if(this.iFrameShim)
this.updateIFrameShimZIndex();this.isOpen=true;this.notify('afterOpen');}.bind(this)});}else
this.container.show();this.position(event);if(!(this.options.draggable||this.options.resizable)&&this.options.position=='center')
Event.observe(window,'resize',this.positionHandler,false);if(!this.options.draggable&&this.options.position=='center')
Event.observe(window,'scroll',this.positionHandler,false);if(!this.options.fade){this.isOpen=true;this.notify('afterOpen');}
return true;},showIndicator:function(){this.showIndicatorTimeout=window.setTimeout(function(){if(this.options.fade){this.indicatorEffects.appear=new Effect.Appear(this.indicator,{queue:{position:'front',scope:'Control.Window.indicator.'+this.numberInSequence},from:0,to:1,duration:this.options.fadeDuration/2});}else
this.indicator.show();}.bind(this),Control.Window.indicatorTimeout);},hideIndicator:function(){if(this.showIndicatorTimeout)
window.clearTimeout(this.showIndicatorTimeout);this.indicator.hide();},getRemoteContentInsertionTarget:function(){return typeof(this.options.insertRemoteContentAt)=="string"?this.container.down(this.options.insertRemoteContentAt):$(this.options.insertRemoteContentAt);},updateIFrameShimZIndex:function(){if(this.iFrameShim)
this.iFrameShim.positionUnder(this.container);}});Object.extend(Control.Window,{windows:[],baseZIndex:9999,indicatorTimeout:250,iframeTemplate:new Template('<iframe src="#{href}" width="100%" height="100%" frameborder="0"></iframe>'),uriRegex:/^(\/|\#|https?\:\/\/|[\w]+\/)/,bringToFront:function(w){Control.Window.windows=Control.Window.windows.without(w);Control.Window.windows.push(w);Control.Window.windows.each(function(w,i){var z_index=Control.Window.baseZIndex+i;w.container.setStyle({zIndex:z_index});if(w.isOpen){if(w.iFrameShim)
w.updateIFrameShimZIndex();}
if(w.options.draggable)
w.draggable.options.zindex=z_index;});},open:function(container,options){var w=new Control.Window(container,options);w.open();return w;},initialZIndexForWindow:function(w){return Control.Window.baseZIndex+(Control.Window.windows.length-1);}});Object.Event.extend(Control.Window);Control.Window.LayoutUpdateObserver=Class.create({initialize:function(w,observer){this.w=w;this.element=$(w.container);this.observer=observer;},onStart:Prototype.emptyFunction,onEnd:function(event_name,instance){if(instance.element==this.element&&this.iFrameShim)
this.w.updateIFrameShimZIndex();},onResize:function(event_name,instance){if(instance.element==this.element)
this.observer(this.element);},onDrag:function(event_name,instance){if(instance.element==this.element)
this.observer(this.element);}});Control.Overlay={id:'control_overlay',loaded:false,container:false,lastOpacity:0,styles:{position:'fixed',top:0,left:0,width:'100%',height:'100%',zIndex:9998},ieStyles:{position:'absolute',top:0,left:0,zIndex:9998},effects:{fade:false,appear:false},load:function(){if(Control.Overlay.loaded)
return false;Control.Overlay.loaded=true;Control.Overlay.container=new Element('div',{id:Control.Overlay.id});$(document.body).insert(Control.Overlay.container);if(Prototype.Browser.IE){Control.Overlay.container.setStyle(Control.Overlay.ieStyles);Event.observe(window,'scroll',Control.Overlay.positionOverlay);Event.observe(window,'resize',Control.Overlay.positionOverlay);Control.Overlay.observe('beforeShow',Control.Overlay.positionOverlay);}else
Control.Overlay.container.setStyle(Control.Overlay.styles);Control.Overlay.iFrameShim=new IframeShim();Control.Overlay.iFrameShim.hide();Event.observe(window,'resize',Control.Overlay.positionIFrameShim);Control.Overlay.container.hide();return true;},unload:function(){if(!Control.Overlay.loaded)
return false;Event.stopObserving(window,'resize',Control.Overlay.positionOverlay);Control.Overlay.stopObserving('beforeShow',Control.Overlay.positionOverlay);Event.stopObserving(window,'resize',Control.Overlay.positionIFrameShim);Control.Overlay.iFrameShim.destroy();Control.Overlay.container.remove();Control.Overlay.loaded=false;return true;},show:function(opacity,fade){if(Control.Overlay.notify('beforeShow')===false)
return false;Control.Overlay.lastOpacity=opacity;Control.Overlay.positionIFrameShim();Control.Overlay.iFrameShim.show();if(fade){if(typeof(Effect)=="undefined")
throw"Control.Window requires effects.js to be loaded."
if(Control.Overlay.effects.fade)
Control.Overlay.effects.fade.cancel();Control.Overlay.effects.appear=new Effect.Appear(Control.Overlay.container,{queue:{position:'end',scope:'Control.Overlay'},afterFinish:function(){Control.Overlay.notify('afterShow');},from:0,to:Control.Overlay.lastOpacity,duration:(fade===true?0.75:fade)/2});}else{Control.Overlay.container.setStyle({opacity:opacity||1});Control.Overlay.container.show();Control.Overlay.notify('afterShow');}
return true;},hide:function(fade){if(Control.Overlay.notify('beforeHide')===false)
return false;if(Control.Overlay.effects.appear)
Control.Overlay.effects.appear.cancel();Control.Overlay.iFrameShim.hide();if(fade){Control.Overlay.effects.fade=new Effect.Fade(Control.Overlay.container,{queue:{position:'front',scope:'Control.Overlay'},afterFinish:function(){Control.Overlay.notify('afterHide');},from:Control.Overlay.lastOpacity,to:0,duration:(fade===true?0.75:fade)/2});}else{Control.Overlay.container.hide();Control.Overlay.notify('afterHide');}
return true;},positionIFrameShim:function(){if(Control.Overlay.container.visible())
Control.Overlay.iFrameShim.positionUnder(Control.Overlay.container);},positionOverlay:function(){Control.Overlay.container.setStyle({width:document.body.clientWidth+'px',height:document.body.clientHeight+'px'});}};Object.Event.extend(Control.Overlay);Control.ToolTip=Class.create(Control.Window,{initialize:function($super,container,tooltip,options){$super(tooltip,Object.extend(Object.extend(Object.clone(Control.ToolTip.defaultOptions),options||{}),{position:'mouse',hover:container}));}});Object.extend(Control.ToolTip,{defaultOptions:{offsetLeft:10}});Control.Modal=Class.create(Control.Window,{initialize:function($super,container,options){Control.Modal.InstanceMethods.beforeInitialize.bind(this)();$super(container,Object.extend(Object.clone(Control.Modal.defaultOptions),options||{}));}});Object.extend(Control.Modal,{defaultOptions:{overlayOpacity:0.5,closeOnClick:'overlay'},current:false,open:function(container,options){var modal=new Control.Modal(container,options);modal.open();return modal;},close:function(){if(Control.Modal.current)
Control.Modal.current.close();},InstanceMethods:{beforeInitialize:function(){Control.Overlay.load();this.overlayFinishedOpening=false;this.observe('beforeOpen',Control.Modal.Observers.beforeOpen.bind(this));this.observe('afterOpen',Control.Modal.Observers.afterOpen.bind(this));this.observe('afterClose',Control.Modal.Observers.afterClose.bind(this));}},Observers:{beforeOpen:function(){if(!this.overlayFinishedOpening){Control.Overlay.observeOnce('afterShow',function(){this.overlayFinishedOpening=true;this.open();}.bind(this));Control.Overlay.show(this.options.overlayOpacity,this.options.fade?this.options.fadeDuration:false);throw $break;}else
Control.Window.windows.without(this).invoke('close');},afterOpen:function(){Control.Modal.current=this;},afterClose:function(){Control.Overlay.hide(this.options.fade?this.options.fadeDuration:false);Control.Modal.current=false;this.overlayFinishedOpening=false;}}});Control.LightBox=Class.create(Control.Window,{initialize:function($super,container,options){this.allImagesLoaded=false;if(options.modal){var options=Object.extend(Object.clone(Control.LightBox.defaultOptions),options||{});options=Object.extend(Object.clone(Control.Modal.defaultOptions),options);options=Control.Modal.InstanceMethods.beforeInitialize.bind(this)(options);$super(container,options);}else
$super(container,Object.extend(Object.clone(Control.LightBox.defaultOptions),options||{}));this.hasRemoteContent=this.href&&!this.options.iframe;if(this.hasRemoteContent)
this.observe('onRemoteContentLoaded',Control.LightBox.Observers.onRemoteContentLoaded.bind(this));else
this.applyImageObservers();this.observe('beforeOpen',Control.LightBox.Observers.beforeOpen.bind(this));},applyImageObservers:function(){var images=this.getImages();this.numberImagesToLoad=images.length;this.numberofImagesLoaded=0;images.each(function(image){image.observe('load',function(image){++this.numberofImagesLoaded;if(this.numberImagesToLoad==this.numberofImagesLoaded){this.allImagesLoaded=true;this.onAllImagesLoaded();}}.bind(this,image));image.hide();}.bind(this));},onAllImagesLoaded:function(){this.getImages().each(function(image){this.showImage(image);}.bind(this));if(this.hasRemoteContent){if(this.options.indicator)
this.hideIndicator();this.finishOpen();}else
this.open();},getImages:function(){return this.container.select(Control.LightBox.imageSelector);},showImage:function(image){image.show();}});Object.extend(Control.LightBox,{imageSelector:'img',defaultOptions:{},Observers:{beforeOpen:function(){if(!this.hasRemoteContent&&!this.allImagesLoaded)
throw $break;},onRemoteContentLoaded:function(){this.applyImageObservers();if(!this.allImagesLoaded)
throw $break;}}});var dp={sh:{Toolbar:{},Utils:{},RegexLib:{},Brushes:{},Strings:{AboutDialog:'<html><head><title>About...</title></head><body class="dp-about"><table cellspacing="0"><tr><td class="copy"><p class="title">dp.SyntaxHighlighter</div><div class="para">Version: {V}</p><p><a href="http://www.dreamprojections.com/syntaxhighlighter/?ref=about" target="_blank">http://www.dreamprojections.com/syntaxhighlighter</a></p>&copy;2004-2007 Alex Gorbatchev.</td></tr><tr><td class="footer"><input type="button" class="close" value="OK" onClick="window.close()"/></td></tr></table></body></html>'},ClipboardSwf:null,Version:'1.5'}};dp.SyntaxHighlighter=dp.sh;dp.sh.Toolbar.Commands={ExpandSource:{label:'+ expand source',check:function(highlighter){return highlighter.collapse;},func:function(sender,highlighter)
{sender.parentNode.removeChild(sender);highlighter.div.className=highlighter.div.className.replace('collapsed','');}},ViewSource:{label:'view plain',func:function(sender,highlighter)
{var code=highlighter.originalCode.replace(/</g,'&lt;');var wnd=window.open('','_blank','width=750, height=400, location=0, resizable=1, menubar=0, scrollbars=0');wnd.document.write('<textarea style="width:99%;height:99%">'+code+'</textarea>');wnd.document.close();}},CopyToClipboard:{label:'copy to clipboard',check:function(){return window.clipboardData!=null||dp.sh.ClipboardSwf!=null;},func:function(sender,highlighter)
{var code=highlighter.originalCode;if(window.clipboardData)
{window.clipboardData.setData('text',code);}
else if(dp.sh.ClipboardSwf!=null)
{var flashcopier=highlighter.flashCopier;if(flashcopier==null)
{flashcopier=document.createElement('div');highlighter.flashCopier=flashcopier;highlighter.div.appendChild(flashcopier);}
flashcopier.innerHTML='<embed src="'+dp.sh.ClipboardSwf+'" FlashVars="clipboard='+encodeURIComponent(code)+'" width="0" height="0" type="application/x-shockwave-flash"></embed>';}
alert('The code is in your clipboard now');}},PrintSource:{label:'print',func:function(sender,highlighter)
{var iframe=document.createElement('IFRAME');var doc=null;iframe.style.cssText='position:absolute;width:0px;height:0px;left:-500px;top:-500px;';document.body.appendChild(iframe);doc=iframe.contentWindow.document;dp.sh.Utils.CopyStyles(doc,window.document);doc.write('<div class="'+highlighter.div.className.replace('collapsed','')+' printing">'+highlighter.div.innerHTML+'</div>');doc.close();iframe.contentWindow.focus();iframe.contentWindow.print();alert('Printing...');document.body.removeChild(iframe);}},About:{label:'?',func:function(highlighter)
{var wnd=window.open('','_blank','dialog,width=300,height=150,scrollbars=0');var doc=wnd.document;dp.sh.Utils.CopyStyles(doc,window.document);doc.write(dp.sh.Strings.AboutDialog.replace('{V}',dp.sh.Version));doc.close();wnd.focus();}}};dp.sh.Toolbar.Create=function(highlighter)
{var div=document.createElement('DIV');div.className='tools';for(var name in dp.sh.Toolbar.Commands)
{var cmd=dp.sh.Toolbar.Commands[name];if(cmd.check!=null&&!cmd.check(highlighter))
continue;div.innerHTML+='<a href="#" onclick="dp.sh.Toolbar.Command(\''+name+'\',this);return false;">'+cmd.label+'</a>';}
return div;}
dp.sh.Toolbar.Command=function(name,sender)
{var n=sender;while(n!=null&&n.className.indexOf('dp-highlighter')==-1)
n=n.parentNode;if(n!=null)
dp.sh.Toolbar.Commands[name].func(sender,n.highlighter);}
dp.sh.Utils.CopyStyles=function(destDoc,sourceDoc)
{var links=sourceDoc.getElementsByTagName('link');for(var i=0;i<links.length;i++)
if(links[i].rel.toLowerCase()=='stylesheet')
destDoc.write('<link type="text/css" rel="stylesheet" href="'+links[i].href+'"></link>');}
dp.sh.RegexLib={MultiLineCComments:new RegExp('/\\*[\\s\\S]*?\\*/','gm'),SingleLineCComments:new RegExp('//.*$','gm'),SingleLinePerlComments:new RegExp('#.*$','gm'),DoubleQuotedString:new RegExp('"(?:\\.|(\\\\\\")|[^\\""])*"','g'),SingleQuotedString:new RegExp("'(?:\\.|(\\\\\\')|[^\\''])*'",'g')};dp.sh.Match=function(value,index,css)
{this.value=value;this.index=index;this.length=value.length;this.css=css;}
dp.sh.Highlighter=function()
{this.noGutter=false;this.addControls=true;this.collapse=false;this.tabsToSpaces=true;this.wrapColumn=80;this.showColumns=true;}
dp.sh.Highlighter.SortCallback=function(m1,m2)
{if(m1.index<m2.index)
return-1;else if(m1.index>m2.index)
return 1;else
{if(m1.length<m2.length)
return-1;else if(m1.length>m2.length)
return 1;}
return 0;}
dp.sh.Highlighter.prototype.CreateElement=function(name)
{var result=document.createElement(name);result.highlighter=this;return result;}
dp.sh.Highlighter.prototype.GetMatches=function(regex,css)
{var index=0;var match=null;while((match=regex.exec(this.code))!=null)
this.matches[this.matches.length]=new dp.sh.Match(match[0],match.index,css);}
dp.sh.Highlighter.prototype.AddBit=function(str,css)
{if(str==null||str.length==0)
return;var span=this.CreateElement('SPAN');str=str.replace(/ /g,'&nbsp;');str=str.replace(/</g,'&lt;');str=str.replace(/\n/gm,'&nbsp;<br>');if(css!=null)
{if((/br/gi).test(str))
{var lines=str.split('&nbsp;<br>');for(var i=0;i<lines.length;i++)
{span=this.CreateElement('SPAN');span.className=css;span.innerHTML=lines[i];this.div.appendChild(span);if(i+1<lines.length)
this.div.appendChild(this.CreateElement('BR'));}}
else
{span.className=css;span.innerHTML=str;this.div.appendChild(span);}}
else
{span.innerHTML=str;this.div.appendChild(span);}}
dp.sh.Highlighter.prototype.IsInside=function(match)
{if(match==null||match.length==0)
return false;for(var i=0;i<this.matches.length;i++)
{var c=this.matches[i];if(c==null)
continue;if((match.index>c.index)&&(match.index<c.index+c.length))
return true;}
return false;}
dp.sh.Highlighter.prototype.ProcessRegexList=function()
{for(var i=0;i<this.regexList.length;i++)
this.GetMatches(this.regexList[i].regex,this.regexList[i].css);}
dp.sh.Highlighter.prototype.ProcessSmartTabs=function(code)
{var lines=code.split('\n');var result='';var tabSize=4;var tab='\t';function InsertSpaces(line,pos,count)
{var left=line.substr(0,pos);var right=line.substr(pos+1,line.length);var spaces='';for(var i=0;i<count;i++)
spaces+=' ';return left+spaces+right;}
function ProcessLine(line,tabSize)
{if(line.indexOf(tab)==-1)
return line;var pos=0;while((pos=line.indexOf(tab))!=-1)
{var spaces=tabSize-pos%tabSize;line=InsertSpaces(line,pos,spaces);}
return line;}
for(var i=0;i<lines.length;i++)
result+=ProcessLine(lines[i],tabSize)+'\n';return result;}
dp.sh.Highlighter.prototype.SwitchToList=function()
{var html=this.div.innerHTML.replace(/<(br)\/?>/gi,'\n');var lines=html.split('\n');if(this.addControls==true)
this.bar.appendChild(dp.sh.Toolbar.Create(this));if(this.showColumns)
{var div=this.CreateElement('div');var columns=this.CreateElement('div');var showEvery=10;var i=1;while(i<=150)
{if(i%showEvery==0)
{div.innerHTML+=i;i+=(i+'').length;}
else
{div.innerHTML+='&middot;';i++;}}
columns.className='columns';columns.appendChild(div);this.bar.appendChild(columns);}
for(var i=0,lineIndex=this.firstLine;i<lines.length-1;i++,lineIndex++)
{var li=this.CreateElement('LI');var span=this.CreateElement('SPAN');li.className=(i%2==0)?'alt':'';span.innerHTML=lines[i]+'&nbsp;';li.appendChild(span);this.ol.appendChild(li);}
this.div.innerHTML='';}
dp.sh.Highlighter.prototype.Highlight=function(code)
{function Trim(str)
{return str.replace(/^\s*(.*?)[\s\n]*$/g,'$1');}
function Chop(str)
{return str.replace(/\n*$/,'').replace(/^\n*/,'');}
function Unindent(str)
{var lines=str.split('\n');var indents=new Array();var regex=new RegExp('^\\s*','g');var min=1000;for(var i=0;i<lines.length&&min>0;i++)
{if(Trim(lines[i]).length==0)
continue;var matches=regex.exec(lines[i]);if(matches!=null&&matches.length>0)
min=Math.min(matches[0].length,min);}
if(min>0)
for(var i=0;i<lines.length;i++)
lines[i]=lines[i].substr(min);return lines.join('\n');}
function Copy(string,pos1,pos2)
{return string.substr(pos1,pos2-pos1);}
var pos=0;if(code==null)
code='';this.originalCode=code;this.code=Chop(Unindent(code));this.div=this.CreateElement('DIV');this.bar=this.CreateElement('DIV');this.ol=this.CreateElement('OL');this.matches=new Array();this.div.className='dp-highlighter';this.div.highlighter=this;this.bar.className='bar';this.ol.start=this.firstLine;if(this.CssClass!=null)
this.ol.className=this.CssClass;if(this.collapse)
this.div.className+=' collapsed';if(this.noGutter)
this.div.className+=' nogutter';if(this.tabsToSpaces==true)
this.code=this.ProcessSmartTabs(this.code);this.ProcessRegexList();if(this.matches.length==0)
{this.AddBit(this.code,null);this.SwitchToList();this.div.appendChild(this.ol);return;}
this.matches=this.matches.sort(dp.sh.Highlighter.SortCallback);for(var i=0;i<this.matches.length;i++)
if(this.IsInside(this.matches[i]))
this.matches[i]=null;for(var i=0;i<this.matches.length;i++)
{var match=this.matches[i];if(match==null||match.length==0)
continue;this.AddBit(Copy(this.code,pos,match.index),null);this.AddBit(match.value,match.css);pos=match.index+match.length;}
this.AddBit(this.code.substr(pos),null);this.SwitchToList();this.div.appendChild(this.bar);this.div.appendChild(this.ol);}
dp.sh.Highlighter.prototype.GetKeywords=function(str)
{return'\\b'+str.replace(/ /g,'\\b|\\b')+'\\b';}
dp.sh.HighlightAll=function(name,showGutter,showControls,collapseAll,firstLine,showColumns)
{function FindValue()
{var a=arguments;for(var i=0;i<a.length;i++)
{if(a[i]==null)
continue;if(typeof(a[i])=='string'&&a[i]!='')
return a[i]+'';if(typeof(a[i])=='object'&&a[i].value!='')
return a[i].value+'';}
return null;}
function IsOptionSet(value,list)
{for(var i=0;i<list.length;i++)
if(list[i]==value)
return true;return false;}
function GetOptionValue(name,list,defaultValue)
{var regex=new RegExp('^'+name+'\\[(\\w+)\\]$','gi');var matches=null;for(var i=0;i<list.length;i++)
if((matches=regex.exec(list[i]))!=null)
return matches[1];return defaultValue;}
function FindTagsByName(list,name,tagName)
{var tags=document.getElementsByTagName(tagName);for(var i=0;i<tags.length;i++)
if(tags[i].getAttribute('class')==name)
list.push(tags[i]);}
var elements=[];var highlighter=null;var registered={};var propertyName='innerHTML';FindTagsByName(elements,name,'code');if(elements.length==0)
return;for(var brush in dp.sh.Brushes)
{var aliases=dp.sh.Brushes[brush].Aliases;if(aliases==null)
continue;for(var i=0;i<aliases.length;i++)
registered[aliases[i]]=brush;}
for(var i=0;i<elements.length;i++)
{var element=elements[i];var options=FindValue(element.attributes['class'],element.className,element.attributes['language'],element.language);var language='';if(options==null)
continue;options=options.split(':');language=options[0].toLowerCase();if(registered[language]==null)
continue;highlighter=new dp.sh.Brushes[registered[language]]();element.style.display='none';highlighter.noGutter=(showGutter==null)?IsOptionSet('nogutter',options):!showGutter;highlighter.addControls=(showControls==null)?!IsOptionSet('nocontrols',options):showControls;highlighter.collapse=(collapseAll==null)?IsOptionSet('collapse',options):collapseAll;highlighter.showColumns=(showColumns==null)?IsOptionSet('showcolumns',options):showColumns;highlighter.firstLine=(firstLine==null)?parseInt(GetOptionValue('firstline',options,1)):firstLine;highlighter.Highlight(element[propertyName]);highlighter.source=element;element.parentNode.insertBefore(highlighter.div,element);}}
dp.sh.Brushes.JScript=function()
{var keywords='\\$ abstract boolean break byte case catch char class const continue debugger '+'default delete do double else enum export extends final finally float '+'for function goto if implements import in instanceof int interface long native '+'new package private protected public return short static super switch '+'synchronized throw throws transient try typeof var void volatile while with';var constants='true false null TRUE FALSE NULL [0-9]+';var builtin='window document event Object Function Math Array Hash String Date RegExp';this.regexList=[{regex:dp.sh.RegexLib.SingleLineCComments,css:'comment'},{regex:dp.sh.RegexLib.MultiLineCComments,css:'comment'},{regex:dp.sh.RegexLib.DoubleQuotedString,css:'string'},{regex:dp.sh.RegexLib.SingleQuotedString,css:'string'},{regex:new RegExp('^\\s*#.*','gm'),css:'preprocessor'},{regex:new RegExp(this.GetKeywords(keywords),'gm'),css:'keyword'},{regex:new RegExp(this.GetKeywords(builtin),'gm'),css:'builtin'},{regex:new RegExp(this.GetKeywords(constants),'g'),css:'constants'},{regex:new RegExp('this(?=(\\.|\\,|\\)))','g'),css:'_this'},{regex:new RegExp('(\\s|\\{|\\,)[a-zA-Z0-9_]+(?=\\s?:\\s?function)','gm'),css:'func_dec'},{regex:new RegExp('on(R(ow(s(inserted|delete)|e(nter|xit))|e(s(ize(start|end)?|et)|adystatechange))|Mouse(o(ut|ver)|down|up|move)|B(efore(cut|deactivate|u(nload|pdate)|p(aste|rint)|editfocus|activate)|lur)|S(croll|top|ubmit|elect(start|ionchange)?)|H(over|elp)|C(hange|ont(extmenu|rolselect)|ut|ellchange|l(ick|ose))|D(eactivate|ata(setc(hanged|omplete)|available)|r(op|ag(start|over|drop|en(ter|d)|leave)?)|blclick)|Unload|P(aste|ropertychange)|Error(update)?|Key(down|up|press)|Focus|Load|A(ctivate|fter(update|print)|bort))','g'),css:'support_property'},{regex:new RegExp('(s(h(ift|ow(Mod(elessDialog|alDialog)|Help))|croll(X|By(Pages|Lines)?|Y|To)?|t(op|rike)|i(n|zeToContent|debar|gnText)|ort|u(p|b(str(ing)?)?)|pli(ce|t)|e(nd|t(Re(sizable|questHeader)|M(i(nutes|lliseconds)|onth)|Seconds|Ho(tKeys|urs)|Year|Cursor|Time(out)?|Interval|ZOptions|Date|UTC(M(i(nutes|lliseconds)|onth)|Seconds|Hours|Date|FullYear)|FullYear|Active)|arch)|qrt|lice|avePreferences|mall)|h(ome|andleEvent)|navigate|c(har(CodeAt|At)|o(s|n(cat|textual|firm)|mpile)|eil|lear(Timeout|Interval)?|a(ptureEvents|ll)|reate(StyleSheet|Popup|EventObject))|t(o(GMTString|S(tring|ource)|U(TCString|pperCase)|Lo(caleString|werCase))|est|a(n|int(Enabled)?))|i(s(NaN|Finite)|ndexOf|talics)|d(isableExternalCapture|ump|etachEvent)|u(n(shift|taint|escape|watch)|pdateCommands)|j(oin|avaEnabled)|p(o(p|w)|ush|lugins.refresh|a(ddings|rse(Int|Float)?)|r(int|ompt|eference))|e(scape|nableExternalCapture|val|lementFromPoint|x(p|ec(Script|Command)?))|valueOf|UTC|queryCommand(State|Indeterm|Enabled|Value)|f(i(nd|le(ModifiedDate|Size|CreatedDate|UpdatedDate)|xed)|o(nt(size|color)|rward)|loor|romCharCode)|watch|l(ink|o(ad|g)|astIndexOf)|a(sin|nchor|cos|t(tachEvent|ob|an(2)?)|pply|lert|b(s|ort))|r(ou(nd|teEvents)|e(size(By|To)|calc|turnValue|place|verse|l(oad|ease(Capture|Events)))|andom)|g(o|et(ResponseHeader|M(i(nutes|lliseconds)|onth)|Se(conds|lection)|Hours|Year|Time(zoneOffset)?|Da(y|te)|UTC(M(i(nutes|lliseconds)|onth)|Seconds|Hours|Da(y|te)|FullYear)|FullYear|A(ttention|llResponseHeaders)))|m(in|ove(B(y|elow)|To(Absolute)?|Above)|ergeAttributes|a(tch|rgins|x))|b(toa|ig|o(ld|rderWidths)|link|ack))(?=\\()','g'),css:'support_method'},{regex:new RegExp('(s(ub(stringData|mit)|plitText|e(t(NamedItem|Attribute(Node)?)|lect))|has(ChildNodes|Feature)|namedItem|c(l(ick|o(se|neNode))|reate(C(omment|DATASection|aption)|T(Head|extNode|Foot)|DocumentFragment|ProcessingInstruction|E(ntityReference|lement)|Attribute))|tabIndex|i(nsert(Row|Before|Cell|Data)|tem)|open|delete(Row|C(ell|aption)|T(Head|Foot)|Data)|focus|write(ln)?|a(dd|ppend(Child|Data))|re(set|place(Child|Data)|move(NamedItem|Child|Attribute(Node)?)?)|get(NamedItem|Element(sBy(Name|TagName)|ById)|Attribute(Node)?)|blur)(?=\\()','g'),css:'support_method'},{regex:new RegExp('on(R(ow(s(inserted|delete)|e(nter|xit))|e(s(ize(start|end)?|et)|adystatechange))|Mouse(o(ut|ver)|down|up|move)|B(efore(cut|deactivate|u(nload|pdate)|p(aste|rint)|editfocus|activate)|lur)|S(croll|top|ubmit|elect(start|ionchange)?)|H(over|elp)|C(hange|ont(extmenu|rolselect)|ut|ellchange|l(ick|ose))|D(eactivate|ata(setc(hanged|omplete)|available)|r(op|ag(start|over|drop|en(ter|d)|leave)?)|blclick)|Unload|P(aste|ropertychange)|Error(update)?|Key(down|up|press)|Focus|Load|A(ctivate|fter(update|print)|bort))','g'),css:'support_property'},{regex:new RegExp('\\.(s(ystemLanguage|cr(ipts|ollbars|een(X|Y|Top|Left))|t(yle(Sheets)?|atus(Text|bar)?)|ibling(Below|Above)|ource|uffixes|e(curity(Policy)?|l(ection|f)))|h(istory|ost(name)?|as(h|Focus))|y|X(MLDocument|SLDocument)|n(ext|ame(space(s|URI)|Prop))|M(IN_VALUE|AX_VALUE)|c(haracterSet|o(n(structor|trollers)|okieEnabled|lorDepth|mp(onents|lete))|urrent|puClass|l(i(p(boardData)?|entInformation)|osed|asses)|alle(e|r)|rypto)|t(o(olbar|p)|ext(Transform|Indent|Decoration|Align)|ags)|SQRT(1_2|2)|i(n(ner(Height|Width)|put)|ds|gnoreCase)|zIndex|o(scpu|n(readystatechange|Line)|uter(Height|Width)|p(sProfile|ener)|ffscreenBuffering)|NEGATIVE_INFINITY|d(i(splay|alog(Height|Top|Width|Left|Arguments)|rectories)|e(scription|fault(Status|Ch(ecked|arset)|View)))|u(ser(Profile|Language|Agent)|n(iqueID|defined)|pdateInterval)|_content|p(ixelDepth|ort|ersonalbar|kcs11|l(ugins|atform)|a(thname|dding(Right|Bottom|Top|Left)|rent(Window|Layer)?|ge(X(Offset)?|Y(Offset)?))|r(o(to(col|type)|duct(Sub)?|mpter)|e(vious|fix)))|e(n(coding|abledPlugin)|x(ternal|pando)|mbeds)|v(isibility|endor(Sub)?|Linkcolor)|URLUnencoded|P(I|OSITIVE_INFINITY)|f(ilename|o(nt(Size|Family|Weight)|rmName)|rame(s|Element)|gColor)|E|whiteSpace|l(i(stStyleType|n(eHeight|kColor))|o(ca(tion(bar)?|lName)|wsrc)|e(ngth|ft(Context)?)|a(st(M(odified|atch)|Index|Paren)|yer(s|X)|nguage))|a(pp(MinorVersion|Name|Co(deName|re)|Version)|vail(Height|Top|Width|Left)|ll|r(ity|guments)|Linkcolor|bove)|r(ight(Context)?|e(sponse(XML|Text)|adyState))|global|x|m(imeTypes|ultiline|enubar|argin(Right|Bottom|Top|Left))|L(N(10|2)|OG(10E|2E))|b(o(ttom|rder(RightWidth|BottomWidth|Style|Color|TopWidth|LeftWidth))|ufferDepth|elow|ackground(Color|Image)))','g'),css:'support_property'}];this.CssClass='javascript';}
dp.sh.Brushes.JScript.prototype=new dp.sh.Highlighter();dp.sh.Brushes.JScript.Aliases=['js','jscript','javascript'];dp.sh.Brushes.CSS=function()
{var keywords='ascent azimuth background-attachment background-color background-image background-position '+'background-repeat background baseline bbox border-collapse border-color border-spacing border-style border-top '+'border-right border-bottom border-left border-top-color border-right-color border-bottom-color border-left-color '+'border-top-style border-right-style border-bottom-style border-left-style border-top-width border-right-width '+'border-bottom-width border-left-width border-width border bottom cap-height caption-side centerline clear clip color '+'content counter-increment counter-reset cue-after cue-before cue cursor definition-src descent direction display '+'elevation empty-cells float font-size-adjust font-family font-size font-stretch font-style font-variant font-weight font '+'height letter-spacing line-height list-style-image list-style-position list-style-type list-style margin-top '+'margin-right margin-bottom margin-left margin marker-offset marks mathline max-height max-width min-height min-width orphans '+'outline-color outline-style outline-width outline overflow padding-top padding-right padding-bottom padding-left padding page '+'page-break-after page-break-before page-break-inside pause pause-after pause-before pitch pitch-range play-during position '+'quotes richness right size slope src speak-header speak-numeral speak-punctuation speak speech-rate stemh stemv stress '+'table-layout text-align text-decoration text-indent text-shadow text-transform unicode-bidi unicode-range units-per-em '+'vertical-align visibility voice-family volume white-space widows width widths word-spacing x-height z-index important';var values='above absolute all always aqua armenian attr aural auto avoid baseline behind below bidi-override black blink block blue bold bolder '+'both bottom braille capitalize caption center center-left center-right circle close-quote code collapse compact condensed '+'continuous counter counters crop cross crosshair cursive dashed decimal decimal-leading-zero default digits disc dotted double '+'embed embossed e-resize expanded extra-condensed extra-expanded fantasy far-left far-right fast faster fixed format fuchsia '+'gray green groove hand handheld hebrew help hidden hide high higher icon inline-table inline inset inside invert italic '+'justify landscape large larger left-side left leftwards level lighter lime line-through list-item local loud lower-alpha '+'lowercase lower-greek lower-latin lower-roman lower low ltr marker maroon medium message-box middle mix move narrower '+'navy ne-resize no-close-quote none no-open-quote no-repeat normal nowrap n-resize nw-resize oblique olive once open-quote outset '+'outside overline pointer portrait pre print projection purple red relative repeat repeat-x repeat-y rgb ridge right right-side '+'rightwards rtl run-in screen scroll semi-condensed semi-expanded separate se-resize show silent silver slower slow '+'small small-caps small-caption smaller soft solid speech spell-out square s-resize static status-bar sub super sw-resize '+'table-caption table-cell table-column table-column-group table-footer-group table-header-group table-row table-row-group teal '+'text-bottom text-top thick thin top transparent tty tv ultra-condensed ultra-expanded underline upper-alpha uppercase upper-latin '+'upper-roman url visible wait white wider w-resize x-fast x-high x-large x-loud x-low x-slow x-small x-soft xx-large xx-small yellow';var fonts='[mM]onospace [tT]ahoma [vV]erdana [aA]rial [hH]elvetica [sS]ans-serif [sS]erif';this.regexList=[{regex:dp.sh.RegexLib.MultiLineCComments,css:'comment'},{regex:dp.sh.RegexLib.DoubleQuotedString,css:'string'},{regex:dp.sh.RegexLib.SingleQuotedString,css:'string'},{regex:new RegExp('\\#[a-fA-F0-9]{3,6}','g'),css:'color'},{regex:new RegExp('-?(\\d+)(px|pt|\:|\\s)?','g'),css:'size'},{regex:new RegExp(this.GetKeywords(keywords),'gm'),css:'keyword'},{regex:new RegExp(this.GetKeywords(values),'g'),css:'value'},{regex:new RegExp(this.GetKeywords(fonts),'g'),css:'fonts'},{regex:new RegExp('(^|\n)[\\s\\#\\._\\-a-zA-Z0-9\\:\\,\\*]+[\\s\\n]*(?=\\{)','gm'),css:'rule'}];this.CssClass='css';}
dp.sh.Brushes.CSS.prototype=new dp.sh.Highlighter();dp.sh.Brushes.CSS.Aliases=['css'];dp.sh.Brushes.Xml=function()
{this.CssClass='xml';}
dp.sh.Brushes.Xml.prototype=new dp.sh.Highlighter();dp.sh.Brushes.Xml.Aliases=['xml','xhtml','xslt','html','xhtml'];dp.sh.Brushes.Xml.prototype.ProcessRegexList=function()
{function push(array,value)
{array[array.length]=value;}
var index=0;var match=null;var regex=null;this.GetMatches(new RegExp('(\&lt;|<)\\!\\[[\\w\\s]*?\\[(.|\\s)*?\\]\\](\&gt;|>)','gm'),'cdata');this.GetMatches(new RegExp('(\&lt;|<)!--\\s*.*?\\s*--(\&gt;|>)','gm'),'comments');regex=new RegExp('([:\\w-\.]+)\\s*=\\s*(".*?"|\'.*?\'|\\w+)*|(\\w+)','gm');while((match=regex.exec(this.code))!=null)
{if(match[1]==null)
{continue;}
push(this.matches,new dp.sh.Match(match[1],match.index,'attribute'));if(match[2]!=undefined)
{push(this.matches,new dp.sh.Match(match[2],match.index+match[0].indexOf(match[2]),'attribute-value'));}}
this.GetMatches(new RegExp('(\&lt;|<)/*\\?*(?!\\!)|/*\\?*(\&gt;|>)','gm'),'tag');regex=new RegExp('(?:\&lt;|<)/*\\?*\\s*([:\\w-\.]+)','gm');while((match=regex.exec(this.code))!=null)
{push(this.matches,new dp.sh.Match(match[1],match.index+match[0].indexOf(match[1]),'tag-name'));}}
Event.observe(window,'load',function(){dp.sh.HighlightAll('javascript',false,false,false,true,false);dp.sh.HighlightAll('css',false,false,false,true,false);dp.sh.HighlightAll('xml',false,false,false,true,false);});var Showdown={};Showdown.converter=function(){var g_urls;var g_titles;var g_html_blocks;var g_list_level=0;this.makeHtml=function(text){g_urls=new Array();g_titles=new Array();g_html_blocks=new Array();text=text.replace(/~/g,"~T");text=text.replace(/\$/g,"~D");text=text.replace(/\r\n/g,"\n");text=text.replace(/\r/g,"\n");text="\n\n"+text+"\n\n";text=_Detab(text);text=text.replace(/^[ \t]+$/mg,"");text=_HashHTMLBlocks(text);text=_StripLinkDefinitions(text);text=_RunBlockGamut(text);text=_UnescapeSpecialChars(text);text=text.replace(/~D/g,"$$");text=text.replace(/~T/g,"~");return text;}
var _StripLinkDefinitions=function(text){var text=text.replace(/^[ ]{0,3}\[(.+)\]:[ \t]*\n?[ \t]*<?(\S+?)>?[ \t]*\n?[ \t]*(?:(\n*)["(](.+?)[")][ \t]*)?(?:\n+|\Z)/gm,function(wholeMatch,m1,m2,m3,m4){m1=m1.toLowerCase();g_urls[m1]=_EncodeAmpsAndAngles(m2);if(m3){return m3+m4;}else if(m4){g_titles[m1]=m4.replace(/"/g,"&quot;");}
return"";});return text;}
var _HashHTMLBlocks=function(text){text=text.replace(/\n/g,"\n\n");var block_tags_a="p|div|h[1-6]|blockquote|pre|table|dl|ol|ul|script|noscript|form|fieldset|iframe|math|ins|del"
var block_tags_b="p|div|h[1-6]|blockquote|pre|table|dl|ol|ul|script|noscript|form|fieldset|iframe|math"
text=text.replace(/^(<(p|div|h[1-6]|blockquote|pre|table|dl|ol|ul|script|noscript|form|fieldset|iframe|math|ins|del)\b[^\r]*?\n<\/\2>[ \t]*(?=\n+))/gm,hashElement);text=text.replace(/^(<(p|div|h[1-6]|blockquote|pre|table|dl|ol|ul|script|noscript|form|fieldset|iframe|math)\b[^\r]*?.*<\/\2>[ \t]*(?=\n+)\n)/gm,hashElement);text=text.replace(/(\n[ ]{0,3}(<(hr)\b([^<>])*?\/?>)[ \t]*(?=\n{2,}))/g,hashElement);text=text.replace(/(\n\n[ ]{0,3}<!(--[^\r]*?--\s*)+>[ \t]*(?=\n{2,}))/g,hashElement);text=text.replace(/(?:\n\n)([ ]{0,3}(?:<([?%])[^\r]*?\2>)[ \t]*(?=\n{2,}))/g,hashElement);text=text.replace(/\n\n/g,"\n");return text;}
var hashElement=function(wholeMatch,m1){var blockText=m1;blockText=blockText.replace(/\n\n/g,"\n");blockText=blockText.replace(/^\n/,"");blockText=blockText.replace(/\n+$/g,"");blockText="\n\n~K"+(g_html_blocks.push(blockText)-1)+"K\n\n";return blockText;};var _RunBlockGamut=function(text){text=_DoHeaders(text);var key=hashBlock("<hr />");text=text.replace(/^[ ]{0,2}([ ]?\*[ ]?){3,}[ \t]*$/gm,key);text=text.replace(/^[ ]{0,2}([ ]?\-[ ]?){3,}[ \t]*$/gm,key);text=text.replace(/^[ ]{0,2}([ ]?\_[ ]?){3,}[ \t]*$/gm,key);text=_DoLists(text);text=_DoCodeBlocks(text);text=_DoBlockQuotes(text);text=_HashHTMLBlocks(text);text=_FormParagraphs(text);return text;}
var _RunSpanGamut=function(text){text=_DoCodeSpans(text);text=_EscapeSpecialCharsWithinTagAttributes(text);text=_EncodeBackslashEscapes(text);text=_DoImages(text);text=_DoAnchors(text);text=_DoAutoLinks(text);text=_EncodeAmpsAndAngles(text);text=_DoItalicsAndBold(text);text=text.replace(/  +\n/g," <br />\n");return text;}
var _EscapeSpecialCharsWithinTagAttributes=function(text){var regex=/(<[a-z\/!$]("[^"]*"|'[^']*'|[^'">])*>|<!(--.*?--\s*)+>)/gi;text=text.replace(regex,function(wholeMatch){var tag=wholeMatch.replace(/(.)<\/?code>(?=.)/g,"$1`");tag=escapeCharacters(tag,"\\`*_");return tag;});return text;}
var _DoAnchors=function(text){text=text.replace(/(\[((?:\[[^\]]*\]|[^\[\]])*)\][ ]?(?:\n[ ]*)?\[(.*?)\])()()()()/g,writeAnchorTag);text=text.replace(/(\[((?:\[[^\]]*\]|[^\[\]])*)\]\([ \t]*()<?(.*?)>?[ \t]*((['"])(.*?)\6[ \t]*)?\))/g,writeAnchorTag);text=text.replace(/(\[([^\[\]]+)\])()()()()()/g,writeAnchorTag);return text;}
var writeAnchorTag=function(wholeMatch,m1,m2,m3,m4,m5,m6,m7){if(m7==undefined)m7="";var whole_match=m1;var link_text=m2;var link_id=m3.toLowerCase();var url=m4;var title=m7;if(url==""){if(link_id==""){link_id=link_text.toLowerCase().replace(/ ?\n/g," ");}
url="#"+link_id;if(g_urls[link_id]!=undefined){url=g_urls[link_id];if(g_titles[link_id]!=undefined){title=g_titles[link_id];}}
else{if(whole_match.search(/\(\s*\)$/m)>-1){url="";}else{return whole_match;}}}
url=escapeCharacters(url,"*_");var result="<a href=\""+url+"\"";if(title!=""){title=title.replace(/"/g,"&quot;");title=escapeCharacters(title,"*_");result+=" title=\""+title+"\"";}
result+=">"+link_text+"</a>";return result;}
var _DoImages=function(text){text=text.replace(/(!\[(.*?)\][ ]?(?:\n[ ]*)?\[(.*?)\])()()()()/g,writeImageTag);text=text.replace(/(!\[(.*?)\]\s?\([ \t]*()<?(\S+?)>?[ \t]*((['"])(.*?)\6[ \t]*)?\))/g,writeImageTag);return text;}
var writeImageTag=function(wholeMatch,m1,m2,m3,m4,m5,m6,m7){var whole_match=m1;var alt_text=m2;var link_id=m3.toLowerCase();var url=m4;var title=m7;if(!title)title="";if(url==""){if(link_id==""){link_id=alt_text.toLowerCase().replace(/ ?\n/g," ");}
url="#"+link_id;if(g_urls[link_id]!=undefined){url=g_urls[link_id];if(g_titles[link_id]!=undefined){title=g_titles[link_id];}}
else{return whole_match;}}
alt_text=alt_text.replace(/"/g,"&quot;");url=escapeCharacters(url,"*_");var result="<img src=\""+url+"\" alt=\""+alt_text+"\"";title=title.replace(/"/g,"&quot;");title=escapeCharacters(title,"*_");result+=" title=\""+title+"\"";result+=" />";return result;}
var _DoHeaders=function(text){text=text.replace(/^(.+)[ \t]*\n=+[ \t]*\n+/gm,function(wholeMatch,m1){return hashBlock("<h1>"+_RunSpanGamut(m1)+"</h1>");});text=text.replace(/^(.+)[ \t]*\n-+[ \t]*\n+/gm,function(matchFound,m1){return hashBlock("<h2>"+_RunSpanGamut(m1)+"</h2>");});text=text.replace(/^(\#{1,6})[ \t]*(.+?)[ \t]*\#*\n+/gm,function(wholeMatch,m1,m2){var h_level=m1.length;return hashBlock("<h"+h_level+">"+_RunSpanGamut(m2)+"</h"+h_level+">");});return text;}
var _ProcessListItems;var _DoLists=function(text){text+="~0";var whole_list=/^(([ ]{0,3}([*+-]|\d+[.])[ \t]+)[^\r]+?(~0|\n{2,}(?=\S)(?![ \t]*(?:[*+-]|\d+[.])[ \t]+)))/gm;if(g_list_level){text=text.replace(whole_list,function(wholeMatch,m1,m2){var list=m1;var list_type=(m2.search(/[*+-]/g)>-1)?"ul":"ol";list=list.replace(/\n{2,}/g,"\n\n\n");;var result=_ProcessListItems(list);result=result.replace(/\s+$/,"");result="<"+list_type+">"+result+"</"+list_type+">\n";return result;});}else{whole_list=/(\n\n|^\n?)(([ ]{0,3}([*+-]|\d+[.])[ \t]+)[^\r]+?(~0|\n{2,}(?=\S)(?![ \t]*(?:[*+-]|\d+[.])[ \t]+)))/g;text=text.replace(whole_list,function(wholeMatch,m1,m2,m3){var runup=m1;var list=m2;var list_type=(m3.search(/[*+-]/g)>-1)?"ul":"ol";var list=list.replace(/\n{2,}/g,"\n\n\n");;var result=_ProcessListItems(list);result=runup+"<"+list_type+">\n"+result+"</"+list_type+">\n";return result;});}
text=text.replace(/~0/,"");return text;}
_ProcessListItems=function(list_str){g_list_level++;list_str=list_str.replace(/\n{2,}$/,"\n");list_str+="~0";list_str=list_str.replace(/(\n)?(^[ \t]*)([*+-]|\d+[.])[ \t]+([^\r]+?(\n{1,2}))(?=\n*(~0|\2([*+-]|\d+[.])[ \t]+))/gm,function(wholeMatch,m1,m2,m3,m4){var item=m4;var leading_line=m1;var leading_space=m2;if(leading_line||(item.search(/\n{2,}/)>-1)){item=_RunBlockGamut(_Outdent(item));}
else{item=_DoLists(_Outdent(item));item=item.replace(/\n$/,"");item=_RunSpanGamut(item);}
return"<li>"+item+"</li>\n";});list_str=list_str.replace(/~0/g,"");g_list_level--;return list_str;}
var _DoCodeBlocks=function(text){text+="~0";text=text.replace(/(?:\n\n|^)((?:(?:[ ]{4}|\t).*\n+)+)(\n*[ ]{0,3}[^ \t\n]|(?=~0))/g,function(wholeMatch,m1,m2){var codeblock=m1;var nextChar=m2;codeblock=_EncodeCode(_Outdent(codeblock));codeblock=_Detab(codeblock);codeblock=codeblock.replace(/^\n+/g,"");codeblock=codeblock.replace(/\n+$/g,"");codeblock="<pre><code>"+codeblock+"\n</code></pre>";return hashBlock(codeblock)+nextChar;});text=text.replace(/~0/,"");return text;}
var hashBlock=function(text){text=text.replace(/(^\n+|\n+$)/g,"");return"\n\n~K"+(g_html_blocks.push(text)-1)+"K\n\n";}
var _DoCodeSpans=function(text){text=text.replace(/(^|[^\\])(`+)([^\r]*?[^`])\2(?!`)/gm,function(wholeMatch,m1,m2,m3,m4){var c=m3;c=c.replace(/^([ \t]*)/g,"");c=c.replace(/[ \t]*$/g,"");c=_EncodeCode(c);return m1+"<code>"+c+"</code>";});return text;}
var _EncodeCode=function(text){text=text.replace(/&/g,"&amp;");text=text.replace(/</g,"&lt;");text=text.replace(/>/g,"&gt;");text=escapeCharacters(text,"\*_{}[]\\",false);return text;}
var _DoItalicsAndBold=function(text){text=text.replace(/(\*\*|__)(?=\S)([^\r]*?\S[*_]*)\1/g,"<strong>$2</strong>");text=text.replace(/(\*|_)(?=\S)([^\r]*?\S)\1/g,"<em>$2</em>");return text;}
var _DoBlockQuotes=function(text){text=text.replace(/((^[ \t]*>[ \t]?.+\n(.+\n)*\n*)+)/gm,function(wholeMatch,m1){var bq=m1;bq=bq.replace(/^[ \t]*>[ \t]?/gm,"~0");bq=bq.replace(/~0/g,"");bq=bq.replace(/^[ \t]+$/gm,"");bq=_RunBlockGamut(bq);bq=bq.replace(/(^|\n)/g,"$1  ");bq=bq.replace(/(\s*<pre>[^\r]+?<\/pre>)/gm,function(wholeMatch,m1){var pre=m1;pre=pre.replace(/^  /mg,"~0");pre=pre.replace(/~0/g,"");return pre;});return hashBlock("<blockquote>\n"+bq+"\n</blockquote>");});return text;}
var _FormParagraphs=function(text){text=text.replace(/^\n+/g,"");text=text.replace(/\n+$/g,"");var grafs=text.split(/\n{2,}/g);var grafsOut=new Array();var end=grafs.length;for(var i=0;i<end;i++){var str=grafs[i];if(str.search(/~K(\d+)K/g)>=0){grafsOut.push(str);}
else if(str.search(/\S/)>=0){str=_RunSpanGamut(str);str=str.replace(/^([ \t]*)/g,"<p>");str+="</p>"
grafsOut.push(str);}}
end=grafsOut.length;for(var i=0;i<end;i++){while(grafsOut[i].search(/~K(\d+)K/)>=0){var blockText=g_html_blocks[RegExp.$1];blockText=blockText.replace(/\$/g,"$$$$");grafsOut[i]=grafsOut[i].replace(/~K\d+K/,blockText);}}
return grafsOut.join("\n\n");}
var _EncodeAmpsAndAngles=function(text){text=text.replace(/&(?!#?[xX]?(?:[0-9a-fA-F]+|\w+);)/g,"&amp;");text=text.replace(/<(?![a-z\/?\$!])/gi,"&lt;");return text;}
var _EncodeBackslashEscapes=function(text){text=text.replace(/\\(\\)/g,escapeCharacters_callback);text=text.replace(/\\([`*_{}\[\]()>#+-.!])/g,escapeCharacters_callback);return text;}
var _DoAutoLinks=function(text){text=text.replace(/<((https?|ftp|dict):[^'">\s]+)>/gi,"<a href=\"$1\">$1</a>");text=text.replace(/<(?:mailto:)?([-.\w]+\@[-a-z0-9]+(\.[-a-z0-9]+)*\.[a-z]+)>/gi,function(wholeMatch,m1){return _EncodeEmailAddress(_UnescapeSpecialChars(m1));});return text;}
var _EncodeEmailAddress=function(addr){function char2hex(ch){var hexDigits='0123456789ABCDEF';var dec=ch.charCodeAt(0);return(hexDigits.charAt(dec>>4)+hexDigits.charAt(dec&15));}
var encode=[function(ch){return"&#"+ch.charCodeAt(0)+";";},function(ch){return"&#x"+char2hex(ch)+";";},function(ch){return ch;}];addr="mailto:"+addr;addr=addr.replace(/./g,function(ch){if(ch=="@"){ch=encode[Math.floor(Math.random()*2)](ch);}else if(ch!=":"){var r=Math.random();ch=(r>.9?encode[2](ch):r>.45?encode[1](ch):encode[0](ch));}
return ch;});addr="<a href=\""+addr+"\">"+addr+"</a>";addr=addr.replace(/">.+:/g,"\">");return addr;}
var _UnescapeSpecialChars=function(text){text=text.replace(/~E(\d+)E/g,function(wholeMatch,m1){var charCodeToReplace=parseInt(m1);return String.fromCharCode(charCodeToReplace);});return text;}
var _Outdent=function(text){text=text.replace(/^(\t|[ ]{1,4})/gm,"~0");text=text.replace(/~0/g,"")
return text;}
var _Detab=function(text){text=text.replace(/\t(?=\t)/g,"    ");text=text.replace(/\t/g,"~A~B");text=text.replace(/~B(.+?)~A/g,function(wholeMatch,m1,m2){var leadingText=m1;var numSpaces=4-leadingText.length%4;for(var i=0;i<numSpaces;i++)leadingText+=" ";return leadingText;});text=text.replace(/~A/g,"    ");text=text.replace(/~B/g,"");return text;}
var escapeCharacters=function(text,charsToEscape,afterBackslash){var regexString="(["+charsToEscape.replace(/([\[\]\\])/g,"\\$1")+"])";if(afterBackslash){regexString="\\\\"+regexString;}
var regex=new RegExp(regexString,"g");text=text.replace(regex,escapeCharacters_callback);return text;}
var escapeCharacters_callback=function(wholeMatch,m1){var charCodeToEscape=m1.charCodeAt(0);return"~E"+charCodeToEscape+"E";}}

// three.js / threejs.org/license
'use strict';var THREE={REVISION:"67"};self.console=self.console||{info:function(){},log:function(){},debug:function(){},warn:function(){},error:function(){}};
(function(){for(var a=0,b=["ms","moz","webkit","o"],c=0;c<b.length&&!self.requestAnimationFrame;++c)self.requestAnimationFrame=self[b[c]+"RequestAnimationFrame"],self.cancelAnimationFrame=self[b[c]+"CancelAnimationFrame"]||self[b[c]+"CancelRequestAnimationFrame"];void 0===self.requestAnimationFrame&&void 0!==self.setTimeout&&(self.requestAnimationFrame=function(b){var c=Date.now(),f=Math.max(0,16-(c-a)),g=self.setTimeout(function(){b(c+f)},f);a=c+f;return g});void 0===self.cancelAnimationFrame&&void 0!==
self.clearTimeout&&(self.cancelAnimationFrame=function(a){self.clearTimeout(a)})})();THREE.CullFaceNone=0;THREE.CullFaceBack=1;THREE.CullFaceFront=2;THREE.CullFaceFrontBack=3;THREE.FrontFaceDirectionCW=0;THREE.FrontFaceDirectionCCW=1;THREE.BasicShadowMap=0;THREE.PCFShadowMap=1;THREE.PCFSoftShadowMap=2;THREE.FrontSide=0;THREE.BackSide=1;THREE.DoubleSide=2;THREE.NoShading=0;THREE.FlatShading=1;THREE.SmoothShading=2;THREE.NoColors=0;THREE.FaceColors=1;THREE.VertexColors=2;THREE.NoBlending=0;
THREE.NormalBlending=1;THREE.AdditiveBlending=2;THREE.SubtractiveBlending=3;THREE.MultiplyBlending=4;THREE.CustomBlending=5;THREE.AddEquation=100;THREE.SubtractEquation=101;THREE.ReverseSubtractEquation=102;THREE.ZeroFactor=200;THREE.OneFactor=201;THREE.SrcColorFactor=202;THREE.OneMinusSrcColorFactor=203;THREE.SrcAlphaFactor=204;THREE.OneMinusSrcAlphaFactor=205;THREE.DstAlphaFactor=206;THREE.OneMinusDstAlphaFactor=207;THREE.DstColorFactor=208;THREE.OneMinusDstColorFactor=209;
THREE.SrcAlphaSaturateFactor=210;THREE.MultiplyOperation=0;THREE.MixOperation=1;THREE.AddOperation=2;THREE.UVMapping=function(){};THREE.CubeReflectionMapping=function(){};THREE.CubeRefractionMapping=function(){};THREE.SphericalReflectionMapping=function(){};THREE.SphericalRefractionMapping=function(){};THREE.RepeatWrapping=1E3;THREE.ClampToEdgeWrapping=1001;THREE.MirroredRepeatWrapping=1002;THREE.NearestFilter=1003;THREE.NearestMipMapNearestFilter=1004;THREE.NearestMipMapLinearFilter=1005;
THREE.LinearFilter=1006;THREE.LinearMipMapNearestFilter=1007;THREE.LinearMipMapLinearFilter=1008;THREE.UnsignedByteType=1009;THREE.ByteType=1010;THREE.ShortType=1011;THREE.UnsignedShortType=1012;THREE.IntType=1013;THREE.UnsignedIntType=1014;THREE.FloatType=1015;THREE.UnsignedShort4444Type=1016;THREE.UnsignedShort5551Type=1017;THREE.UnsignedShort565Type=1018;THREE.AlphaFormat=1019;THREE.RGBFormat=1020;THREE.RGBAFormat=1021;THREE.LuminanceFormat=1022;THREE.LuminanceAlphaFormat=1023;
THREE.RGB_S3TC_DXT1_Format=2001;THREE.RGBA_S3TC_DXT1_Format=2002;THREE.RGBA_S3TC_DXT3_Format=2003;THREE.RGBA_S3TC_DXT5_Format=2004;THREE.Color=function(a){return 3===arguments.length?this.setRGB(arguments[0],arguments[1],arguments[2]):this.set(a)};
THREE.Color.prototype={constructor:THREE.Color,r:1,g:1,b:1,set:function(a){a instanceof THREE.Color?this.copy(a):"number"===typeof a?this.setHex(a):"string"===typeof a&&this.setStyle(a);return this},setHex:function(a){a=Math.floor(a);this.r=(a>>16&255)/255;this.g=(a>>8&255)/255;this.b=(a&255)/255;return this},setRGB:function(a,b,c){this.r=a;this.g=b;this.b=c;return this},setHSL:function(a,b,c){if(0===b)this.r=this.g=this.b=c;else{var d=function(a,b,c){0>c&&(c+=1);1<c&&(c-=1);return c<1/6?a+6*(b-a)*
c:0.5>c?b:c<2/3?a+6*(b-a)*(2/3-c):a};b=0.5>=c?c*(1+b):c+b-c*b;c=2*c-b;this.r=d(c,b,a+1/3);this.g=d(c,b,a);this.b=d(c,b,a-1/3)}return this},setStyle:function(a){if(/^rgb\((\d+), ?(\d+), ?(\d+)\)$/i.test(a))return a=/^rgb\((\d+), ?(\d+), ?(\d+)\)$/i.exec(a),this.r=Math.min(255,parseInt(a[1],10))/255,this.g=Math.min(255,parseInt(a[2],10))/255,this.b=Math.min(255,parseInt(a[3],10))/255,this;if(/^rgb\((\d+)\%, ?(\d+)\%, ?(\d+)\%\)$/i.test(a))return a=/^rgb\((\d+)\%, ?(\d+)\%, ?(\d+)\%\)$/i.exec(a),this.r=
Math.min(100,parseInt(a[1],10))/100,this.g=Math.min(100,parseInt(a[2],10))/100,this.b=Math.min(100,parseInt(a[3],10))/100,this;if(/^\#([0-9a-f]{6})$/i.test(a))return a=/^\#([0-9a-f]{6})$/i.exec(a),this.setHex(parseInt(a[1],16)),this;if(/^\#([0-9a-f])([0-9a-f])([0-9a-f])$/i.test(a))return a=/^\#([0-9a-f])([0-9a-f])([0-9a-f])$/i.exec(a),this.setHex(parseInt(a[1]+a[1]+a[2]+a[2]+a[3]+a[3],16)),this;if(/^(\w+)$/i.test(a))return this.setHex(THREE.ColorKeywords[a]),this},copy:function(a){this.r=a.r;this.g=
a.g;this.b=a.b;return this},copyGammaToLinear:function(a){this.r=a.r*a.r;this.g=a.g*a.g;this.b=a.b*a.b;return this},copyLinearToGamma:function(a){this.r=Math.sqrt(a.r);this.g=Math.sqrt(a.g);this.b=Math.sqrt(a.b);return this},convertGammaToLinear:function(){var a=this.r,b=this.g,c=this.b;this.r=a*a;this.g=b*b;this.b=c*c;return this},convertLinearToGamma:function(){this.r=Math.sqrt(this.r);this.g=Math.sqrt(this.g);this.b=Math.sqrt(this.b);return this},getHex:function(){return 255*this.r<<16^255*this.g<<
8^255*this.b<<0},getHexString:function(){return("000000"+this.getHex().toString(16)).slice(-6)},getHSL:function(a){a=a||{h:0,s:0,l:0};var b=this.r,c=this.g,d=this.b,e=Math.max(b,c,d),f=Math.min(b,c,d),g,h=(f+e)/2;if(f===e)f=g=0;else{var k=e-f,f=0.5>=h?k/(e+f):k/(2-e-f);switch(e){case b:g=(c-d)/k+(c<d?6:0);break;case c:g=(d-b)/k+2;break;case d:g=(b-c)/k+4}g/=6}a.h=g;a.s=f;a.l=h;return a},getStyle:function(){return"rgb("+(255*this.r|0)+","+(255*this.g|0)+","+(255*this.b|0)+")"},offsetHSL:function(a,
b,c){var d=this.getHSL();d.h+=a;d.s+=b;d.l+=c;this.setHSL(d.h,d.s,d.l);return this},add:function(a){this.r+=a.r;this.g+=a.g;this.b+=a.b;return this},addColors:function(a,b){this.r=a.r+b.r;this.g=a.g+b.g;this.b=a.b+b.b;return this},addScalar:function(a){this.r+=a;this.g+=a;this.b+=a;return this},multiply:function(a){this.r*=a.r;this.g*=a.g;this.b*=a.b;return this},multiplyScalar:function(a){this.r*=a;this.g*=a;this.b*=a;return this},lerp:function(a,b){this.r+=(a.r-this.r)*b;this.g+=(a.g-this.g)*b;
this.b+=(a.b-this.b)*b;return this},equals:function(a){return a.r===this.r&&a.g===this.g&&a.b===this.b},fromArray:function(a){this.r=a[0];this.g=a[1];this.b=a[2];return this},toArray:function(){return[this.r,this.g,this.b]},clone:function(){return(new THREE.Color).setRGB(this.r,this.g,this.b)}};
THREE.ColorKeywords={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,
darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,
grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,
lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,
palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,
tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074};THREE.Quaternion=function(a,b,c,d){this._x=a||0;this._y=b||0;this._z=c||0;this._w=void 0!==d?d:1};
THREE.Quaternion.prototype={constructor:THREE.Quaternion,_x:0,_y:0,_z:0,_w:0,get x(){return this._x},set x(a){this._x=a;this.onChangeCallback()},get y(){return this._y},set y(a){this._y=a;this.onChangeCallback()},get z(){return this._z},set z(a){this._z=a;this.onChangeCallback()},get w(){return this._w},set w(a){this._w=a;this.onChangeCallback()},set:function(a,b,c,d){this._x=a;this._y=b;this._z=c;this._w=d;this.onChangeCallback();return this},copy:function(a){this._x=a._x;this._y=a._y;this._z=a._z;
this._w=a._w;this.onChangeCallback();return this},setFromEuler:function(a,b){if(!1===a instanceof THREE.Euler)throw Error("ERROR: Quaternion's .setFromEuler() now expects a Euler rotation rather than a Vector3 and order.  Please update your code.");var c=Math.cos(a._x/2),d=Math.cos(a._y/2),e=Math.cos(a._z/2),f=Math.sin(a._x/2),g=Math.sin(a._y/2),h=Math.sin(a._z/2);"XYZ"===a.order?(this._x=f*d*e+c*g*h,this._y=c*g*e-f*d*h,this._z=c*d*h+f*g*e,this._w=c*d*e-f*g*h):"YXZ"===a.order?(this._x=f*d*e+c*g*h,
this._y=c*g*e-f*d*h,this._z=c*d*h-f*g*e,this._w=c*d*e+f*g*h):"ZXY"===a.order?(this._x=f*d*e-c*g*h,this._y=c*g*e+f*d*h,this._z=c*d*h+f*g*e,this._w=c*d*e-f*g*h):"ZYX"===a.order?(this._x=f*d*e-c*g*h,this._y=c*g*e+f*d*h,this._z=c*d*h-f*g*e,this._w=c*d*e+f*g*h):"YZX"===a.order?(this._x=f*d*e+c*g*h,this._y=c*g*e+f*d*h,this._z=c*d*h-f*g*e,this._w=c*d*e-f*g*h):"XZY"===a.order&&(this._x=f*d*e-c*g*h,this._y=c*g*e-f*d*h,this._z=c*d*h+f*g*e,this._w=c*d*e+f*g*h);if(!1!==b)this.onChangeCallback();return this},
setFromAxisAngle:function(a,b){var c=b/2,d=Math.sin(c);this._x=a.x*d;this._y=a.y*d;this._z=a.z*d;this._w=Math.cos(c);this.onChangeCallback();return this},setFromRotationMatrix:function(a){var b=a.elements,c=b[0];a=b[4];var d=b[8],e=b[1],f=b[5],g=b[9],h=b[2],k=b[6],b=b[10],l=c+f+b;0<l?(c=0.5/Math.sqrt(l+1),this._w=0.25/c,this._x=(k-g)*c,this._y=(d-h)*c,this._z=(e-a)*c):c>f&&c>b?(c=2*Math.sqrt(1+c-f-b),this._w=(k-g)/c,this._x=0.25*c,this._y=(a+e)/c,this._z=(d+h)/c):f>b?(c=2*Math.sqrt(1+f-c-b),this._w=
(d-h)/c,this._x=(a+e)/c,this._y=0.25*c,this._z=(g+k)/c):(c=2*Math.sqrt(1+b-c-f),this._w=(e-a)/c,this._x=(d+h)/c,this._y=(g+k)/c,this._z=0.25*c);this.onChangeCallback();return this},setFromUnitVectors:function(){var a,b;return function(c,d){void 0===a&&(a=new THREE.Vector3);b=c.dot(d)+1;1E-6>b?(b=0,Math.abs(c.x)>Math.abs(c.z)?a.set(-c.y,c.x,0):a.set(0,-c.z,c.y)):a.crossVectors(c,d);this._x=a.x;this._y=a.y;this._z=a.z;this._w=b;this.normalize();return this}}(),inverse:function(){this.conjugate().normalize();
return this},conjugate:function(){this._x*=-1;this._y*=-1;this._z*=-1;this.onChangeCallback();return this},lengthSq:function(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w},length:function(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)},normalize:function(){var a=this.length();0===a?(this._z=this._y=this._x=0,this._w=1):(a=1/a,this._x*=a,this._y*=a,this._z*=a,this._w*=a);this.onChangeCallback();return this},multiply:function(a,b){return void 0!==
b?(console.warn("DEPRECATED: Quaternion's .multiply() now only accepts one argument. Use .multiplyQuaternions( a, b ) instead."),this.multiplyQuaternions(a,b)):this.multiplyQuaternions(this,a)},multiplyQuaternions:function(a,b){var c=a._x,d=a._y,e=a._z,f=a._w,g=b._x,h=b._y,k=b._z,l=b._w;this._x=c*l+f*g+d*k-e*h;this._y=d*l+f*h+e*g-c*k;this._z=e*l+f*k+c*h-d*g;this._w=f*l-c*g-d*h-e*k;this.onChangeCallback();return this},multiplyVector3:function(a){console.warn("DEPRECATED: Quaternion's .multiplyVector3() has been removed. Use is now vector.applyQuaternion( quaternion ) instead.");
return a.applyQuaternion(this)},slerp:function(a,b){var c=this._x,d=this._y,e=this._z,f=this._w,g=f*a._w+c*a._x+d*a._y+e*a._z;0>g?(this._w=-a._w,this._x=-a._x,this._y=-a._y,this._z=-a._z,g=-g):this.copy(a);if(1<=g)return this._w=f,this._x=c,this._y=d,this._z=e,this;var h=Math.acos(g),k=Math.sqrt(1-g*g);if(0.001>Math.abs(k))return this._w=0.5*(f+this._w),this._x=0.5*(c+this._x),this._y=0.5*(d+this._y),this._z=0.5*(e+this._z),this;g=Math.sin((1-b)*h)/k;h=Math.sin(b*h)/k;this._w=f*g+this._w*h;this._x=
c*g+this._x*h;this._y=d*g+this._y*h;this._z=e*g+this._z*h;this.onChangeCallback();return this},equals:function(a){return a._x===this._x&&a._y===this._y&&a._z===this._z&&a._w===this._w},fromArray:function(a){this._x=a[0];this._y=a[1];this._z=a[2];this._w=a[3];this.onChangeCallback();return this},toArray:function(){return[this._x,this._y,this._z,this._w]},onChange:function(a){this.onChangeCallback=a;return this},onChangeCallback:function(){},clone:function(){return new THREE.Quaternion(this._x,this._y,
this._z,this._w)}};THREE.Quaternion.slerp=function(a,b,c,d){return c.copy(a).slerp(b,d)};THREE.Vector2=function(a,b){this.x=a||0;this.y=b||0};
THREE.Vector2.prototype={constructor:THREE.Vector2,set:function(a,b){this.x=a;this.y=b;return this},setX:function(a){this.x=a;return this},setY:function(a){this.y=a;return this},setComponent:function(a,b){switch(a){case 0:this.x=b;break;case 1:this.y=b;break;default:throw Error("index is out of range: "+a);}},getComponent:function(a){switch(a){case 0:return this.x;case 1:return this.y;default:throw Error("index is out of range: "+a);}},copy:function(a){this.x=a.x;this.y=a.y;return this},add:function(a,
b){if(void 0!==b)return console.warn("DEPRECATED: Vector2's .add() now only accepts one argument. Use .addVectors( a, b ) instead."),this.addVectors(a,b);this.x+=a.x;this.y+=a.y;return this},addVectors:function(a,b){this.x=a.x+b.x;this.y=a.y+b.y;return this},addScalar:function(a){this.x+=a;this.y+=a;return this},sub:function(a,b){if(void 0!==b)return console.warn("DEPRECATED: Vector2's .sub() now only accepts one argument. Use .subVectors( a, b ) instead."),this.subVectors(a,b);this.x-=a.x;this.y-=
a.y;return this},subVectors:function(a,b){this.x=a.x-b.x;this.y=a.y-b.y;return this},multiply:function(a){this.x*=a.x;this.y*=a.y;return this},multiplyScalar:function(a){this.x*=a;this.y*=a;return this},divide:function(a){this.x/=a.x;this.y/=a.y;return this},divideScalar:function(a){0!==a?(a=1/a,this.x*=a,this.y*=a):this.y=this.x=0;return this},min:function(a){this.x>a.x&&(this.x=a.x);this.y>a.y&&(this.y=a.y);return this},max:function(a){this.x<a.x&&(this.x=a.x);this.y<a.y&&(this.y=a.y);return this},
clamp:function(a,b){this.x<a.x?this.x=a.x:this.x>b.x&&(this.x=b.x);this.y<a.y?this.y=a.y:this.y>b.y&&(this.y=b.y);return this},clampScalar:function(){var a,b;return function(c,d){void 0===a&&(a=new THREE.Vector2,b=new THREE.Vector2);a.set(c,c);b.set(d,d);return this.clamp(a,b)}}(),floor:function(){this.x=Math.floor(this.x);this.y=Math.floor(this.y);return this},ceil:function(){this.x=Math.ceil(this.x);this.y=Math.ceil(this.y);return this},round:function(){this.x=Math.round(this.x);this.y=Math.round(this.y);
return this},roundToZero:function(){this.x=0>this.x?Math.ceil(this.x):Math.floor(this.x);this.y=0>this.y?Math.ceil(this.y):Math.floor(this.y);return this},negate:function(){return this.multiplyScalar(-1)},dot:function(a){return this.x*a.x+this.y*a.y},lengthSq:function(){return this.x*this.x+this.y*this.y},length:function(){return Math.sqrt(this.x*this.x+this.y*this.y)},normalize:function(){return this.divideScalar(this.length())},distanceTo:function(a){return Math.sqrt(this.distanceToSquared(a))},
distanceToSquared:function(a){var b=this.x-a.x;a=this.y-a.y;return b*b+a*a},setLength:function(a){var b=this.length();0!==b&&a!==b&&this.multiplyScalar(a/b);return this},lerp:function(a,b){this.x+=(a.x-this.x)*b;this.y+=(a.y-this.y)*b;return this},equals:function(a){return a.x===this.x&&a.y===this.y},fromArray:function(a){this.x=a[0];this.y=a[1];return this},toArray:function(){return[this.x,this.y]},clone:function(){return new THREE.Vector2(this.x,this.y)}};THREE.Vector3=function(a,b,c){this.x=a||0;this.y=b||0;this.z=c||0};
THREE.Vector3.prototype={constructor:THREE.Vector3,set:function(a,b,c){this.x=a;this.y=b;this.z=c;return this},setX:function(a){this.x=a;return this},setY:function(a){this.y=a;return this},setZ:function(a){this.z=a;return this},setComponent:function(a,b){switch(a){case 0:this.x=b;break;case 1:this.y=b;break;case 2:this.z=b;break;default:throw Error("index is out of range: "+a);}},getComponent:function(a){switch(a){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw Error("index is out of range: "+
a);}},copy:function(a){this.x=a.x;this.y=a.y;this.z=a.z;return this},add:function(a,b){if(void 0!==b)return console.warn("DEPRECATED: Vector3's .add() now only accepts one argument. Use .addVectors( a, b ) instead."),this.addVectors(a,b);this.x+=a.x;this.y+=a.y;this.z+=a.z;return this},addScalar:function(a){this.x+=a;this.y+=a;this.z+=a;return this},addVectors:function(a,b){this.x=a.x+b.x;this.y=a.y+b.y;this.z=a.z+b.z;return this},sub:function(a,b){if(void 0!==b)return console.warn("DEPRECATED: Vector3's .sub() now only accepts one argument. Use .subVectors( a, b ) instead."),
this.subVectors(a,b);this.x-=a.x;this.y-=a.y;this.z-=a.z;return this},subVectors:function(a,b){this.x=a.x-b.x;this.y=a.y-b.y;this.z=a.z-b.z;return this},multiply:function(a,b){if(void 0!==b)return console.warn("DEPRECATED: Vector3's .multiply() now only accepts one argument. Use .multiplyVectors( a, b ) instead."),this.multiplyVectors(a,b);this.x*=a.x;this.y*=a.y;this.z*=a.z;return this},multiplyScalar:function(a){this.x*=a;this.y*=a;this.z*=a;return this},multiplyVectors:function(a,b){this.x=a.x*
b.x;this.y=a.y*b.y;this.z=a.z*b.z;return this},applyEuler:function(){var a;return function(b){!1===b instanceof THREE.Euler&&console.error("ERROR: Vector3's .applyEuler() now expects a Euler rotation rather than a Vector3 and order.  Please update your code.");void 0===a&&(a=new THREE.Quaternion);this.applyQuaternion(a.setFromEuler(b));return this}}(),applyAxisAngle:function(){var a;return function(b,c){void 0===a&&(a=new THREE.Quaternion);this.applyQuaternion(a.setFromAxisAngle(b,c));return this}}(),
applyMatrix3:function(a){var b=this.x,c=this.y,d=this.z;a=a.elements;this.x=a[0]*b+a[3]*c+a[6]*d;this.y=a[1]*b+a[4]*c+a[7]*d;this.z=a[2]*b+a[5]*c+a[8]*d;return this},applyMatrix4:function(a){var b=this.x,c=this.y,d=this.z;a=a.elements;this.x=a[0]*b+a[4]*c+a[8]*d+a[12];this.y=a[1]*b+a[5]*c+a[9]*d+a[13];this.z=a[2]*b+a[6]*c+a[10]*d+a[14];return this},applyProjection:function(a){var b=this.x,c=this.y,d=this.z;a=a.elements;var e=1/(a[3]*b+a[7]*c+a[11]*d+a[15]);this.x=(a[0]*b+a[4]*c+a[8]*d+a[12])*e;this.y=
(a[1]*b+a[5]*c+a[9]*d+a[13])*e;this.z=(a[2]*b+a[6]*c+a[10]*d+a[14])*e;return this},applyQuaternion:function(a){var b=this.x,c=this.y,d=this.z,e=a.x,f=a.y,g=a.z;a=a.w;var h=a*b+f*d-g*c,k=a*c+g*b-e*d,l=a*d+e*c-f*b,b=-e*b-f*c-g*d;this.x=h*a+b*-e+k*-g-l*-f;this.y=k*a+b*-f+l*-e-h*-g;this.z=l*a+b*-g+h*-f-k*-e;return this},transformDirection:function(a){var b=this.x,c=this.y,d=this.z;a=a.elements;this.x=a[0]*b+a[4]*c+a[8]*d;this.y=a[1]*b+a[5]*c+a[9]*d;this.z=a[2]*b+a[6]*c+a[10]*d;this.normalize();return this},
divide:function(a){this.x/=a.x;this.y/=a.y;this.z/=a.z;return this},divideScalar:function(a){0!==a?(a=1/a,this.x*=a,this.y*=a,this.z*=a):this.z=this.y=this.x=0;return this},min:function(a){this.x>a.x&&(this.x=a.x);this.y>a.y&&(this.y=a.y);this.z>a.z&&(this.z=a.z);return this},max:function(a){this.x<a.x&&(this.x=a.x);this.y<a.y&&(this.y=a.y);this.z<a.z&&(this.z=a.z);return this},clamp:function(a,b){this.x<a.x?this.x=a.x:this.x>b.x&&(this.x=b.x);this.y<a.y?this.y=a.y:this.y>b.y&&(this.y=b.y);this.z<
a.z?this.z=a.z:this.z>b.z&&(this.z=b.z);return this},clampScalar:function(){var a,b;return function(c,d){void 0===a&&(a=new THREE.Vector3,b=new THREE.Vector3);a.set(c,c,c);b.set(d,d,d);return this.clamp(a,b)}}(),floor:function(){this.x=Math.floor(this.x);this.y=Math.floor(this.y);this.z=Math.floor(this.z);return this},ceil:function(){this.x=Math.ceil(this.x);this.y=Math.ceil(this.y);this.z=Math.ceil(this.z);return this},round:function(){this.x=Math.round(this.x);this.y=Math.round(this.y);this.z=Math.round(this.z);
return this},roundToZero:function(){this.x=0>this.x?Math.ceil(this.x):Math.floor(this.x);this.y=0>this.y?Math.ceil(this.y):Math.floor(this.y);this.z=0>this.z?Math.ceil(this.z):Math.floor(this.z);return this},negate:function(){return this.multiplyScalar(-1)},dot:function(a){return this.x*a.x+this.y*a.y+this.z*a.z},lengthSq:function(){return this.x*this.x+this.y*this.y+this.z*this.z},length:function(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)},lengthManhattan:function(){return Math.abs(this.x)+
Math.abs(this.y)+Math.abs(this.z)},normalize:function(){return this.divideScalar(this.length())},setLength:function(a){var b=this.length();0!==b&&a!==b&&this.multiplyScalar(a/b);return this},lerp:function(a,b){this.x+=(a.x-this.x)*b;this.y+=(a.y-this.y)*b;this.z+=(a.z-this.z)*b;return this},cross:function(a,b){if(void 0!==b)return console.warn("DEPRECATED: Vector3's .cross() now only accepts one argument. Use .crossVectors( a, b ) instead."),this.crossVectors(a,b);var c=this.x,d=this.y,e=this.z;this.x=
d*a.z-e*a.y;this.y=e*a.x-c*a.z;this.z=c*a.y-d*a.x;return this},crossVectors:function(a,b){var c=a.x,d=a.y,e=a.z,f=b.x,g=b.y,h=b.z;this.x=d*h-e*g;this.y=e*f-c*h;this.z=c*g-d*f;return this},projectOnVector:function(){var a,b;return function(c){void 0===a&&(a=new THREE.Vector3);a.copy(c).normalize();b=this.dot(a);return this.copy(a).multiplyScalar(b)}}(),projectOnPlane:function(){var a;return function(b){void 0===a&&(a=new THREE.Vector3);a.copy(this).projectOnVector(b);return this.sub(a)}}(),reflect:function(){var a;
return function(b){void 0===a&&(a=new THREE.Vector3);return this.sub(a.copy(b).multiplyScalar(2*this.dot(b)))}}(),angleTo:function(a){a=this.dot(a)/(this.length()*a.length());return Math.acos(THREE.Math.clamp(a,-1,1))},distanceTo:function(a){return Math.sqrt(this.distanceToSquared(a))},distanceToSquared:function(a){var b=this.x-a.x,c=this.y-a.y;a=this.z-a.z;return b*b+c*c+a*a},setEulerFromRotationMatrix:function(a,b){console.error("REMOVED: Vector3's setEulerFromRotationMatrix has been removed in favor of Euler.setFromRotationMatrix(), please update your code.")},
setEulerFromQuaternion:function(a,b){console.error("REMOVED: Vector3's setEulerFromQuaternion: has been removed in favor of Euler.setFromQuaternion(), please update your code.")},getPositionFromMatrix:function(a){console.warn("DEPRECATED: Vector3's .getPositionFromMatrix() has been renamed to .setFromMatrixPosition(). Please update your code.");return this.setFromMatrixPosition(a)},getScaleFromMatrix:function(a){console.warn("DEPRECATED: Vector3's .getScaleFromMatrix() has been renamed to .setFromMatrixScale(). Please update your code.");
return this.setFromMatrixScale(a)},getColumnFromMatrix:function(a,b){console.warn("DEPRECATED: Vector3's .getColumnFromMatrix() has been renamed to .setFromMatrixColumn(). Please update your code.");return this.setFromMatrixColumn(a,b)},setFromMatrixPosition:function(a){this.x=a.elements[12];this.y=a.elements[13];this.z=a.elements[14];return this},setFromMatrixScale:function(a){var b=this.set(a.elements[0],a.elements[1],a.elements[2]).length(),c=this.set(a.elements[4],a.elements[5],a.elements[6]).length();
a=this.set(a.elements[8],a.elements[9],a.elements[10]).length();this.x=b;this.y=c;this.z=a;return this},setFromMatrixColumn:function(a,b){var c=4*a,d=b.elements;this.x=d[c];this.y=d[c+1];this.z=d[c+2];return this},equals:function(a){return a.x===this.x&&a.y===this.y&&a.z===this.z},fromArray:function(a){this.x=a[0];this.y=a[1];this.z=a[2];return this},toArray:function(){return[this.x,this.y,this.z]},clone:function(){return new THREE.Vector3(this.x,this.y,this.z)}};THREE.Vector4=function(a,b,c,d){this.x=a||0;this.y=b||0;this.z=c||0;this.w=void 0!==d?d:1};
THREE.Vector4.prototype={constructor:THREE.Vector4,set:function(a,b,c,d){this.x=a;this.y=b;this.z=c;this.w=d;return this},setX:function(a){this.x=a;return this},setY:function(a){this.y=a;return this},setZ:function(a){this.z=a;return this},setW:function(a){this.w=a;return this},setComponent:function(a,b){switch(a){case 0:this.x=b;break;case 1:this.y=b;break;case 2:this.z=b;break;case 3:this.w=b;break;default:throw Error("index is out of range: "+a);}},getComponent:function(a){switch(a){case 0:return this.x;
case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw Error("index is out of range: "+a);}},copy:function(a){this.x=a.x;this.y=a.y;this.z=a.z;this.w=void 0!==a.w?a.w:1;return this},add:function(a,b){if(void 0!==b)return console.warn("DEPRECATED: Vector4's .add() now only accepts one argument. Use .addVectors( a, b ) instead."),this.addVectors(a,b);this.x+=a.x;this.y+=a.y;this.z+=a.z;this.w+=a.w;return this},addScalar:function(a){this.x+=a;this.y+=a;this.z+=a;this.w+=a;return this},
addVectors:function(a,b){this.x=a.x+b.x;this.y=a.y+b.y;this.z=a.z+b.z;this.w=a.w+b.w;return this},sub:function(a,b){if(void 0!==b)return console.warn("DEPRECATED: Vector4's .sub() now only accepts one argument. Use .subVectors( a, b ) instead."),this.subVectors(a,b);this.x-=a.x;this.y-=a.y;this.z-=a.z;this.w-=a.w;return this},subVectors:function(a,b){this.x=a.x-b.x;this.y=a.y-b.y;this.z=a.z-b.z;this.w=a.w-b.w;return this},multiplyScalar:function(a){this.x*=a;this.y*=a;this.z*=a;this.w*=a;return this},
applyMatrix4:function(a){var b=this.x,c=this.y,d=this.z,e=this.w;a=a.elements;this.x=a[0]*b+a[4]*c+a[8]*d+a[12]*e;this.y=a[1]*b+a[5]*c+a[9]*d+a[13]*e;this.z=a[2]*b+a[6]*c+a[10]*d+a[14]*e;this.w=a[3]*b+a[7]*c+a[11]*d+a[15]*e;return this},divideScalar:function(a){0!==a?(a=1/a,this.x*=a,this.y*=a,this.z*=a,this.w*=a):(this.z=this.y=this.x=0,this.w=1);return this},setAxisAngleFromQuaternion:function(a){this.w=2*Math.acos(a.w);var b=Math.sqrt(1-a.w*a.w);1E-4>b?(this.x=1,this.z=this.y=0):(this.x=a.x/b,
this.y=a.y/b,this.z=a.z/b);return this},setAxisAngleFromRotationMatrix:function(a){var b,c,d;a=a.elements;var e=a[0];d=a[4];var f=a[8],g=a[1],h=a[5],k=a[9];c=a[2];b=a[6];var l=a[10];if(0.01>Math.abs(d-g)&&0.01>Math.abs(f-c)&&0.01>Math.abs(k-b)){if(0.1>Math.abs(d+g)&&0.1>Math.abs(f+c)&&0.1>Math.abs(k+b)&&0.1>Math.abs(e+h+l-3))return this.set(1,0,0,0),this;a=Math.PI;e=(e+1)/2;h=(h+1)/2;l=(l+1)/2;d=(d+g)/4;f=(f+c)/4;k=(k+b)/4;e>h&&e>l?0.01>e?(b=0,d=c=0.707106781):(b=Math.sqrt(e),c=d/b,d=f/b):h>l?0.01>
h?(b=0.707106781,c=0,d=0.707106781):(c=Math.sqrt(h),b=d/c,d=k/c):0.01>l?(c=b=0.707106781,d=0):(d=Math.sqrt(l),b=f/d,c=k/d);this.set(b,c,d,a);return this}a=Math.sqrt((b-k)*(b-k)+(f-c)*(f-c)+(g-d)*(g-d));0.001>Math.abs(a)&&(a=1);this.x=(b-k)/a;this.y=(f-c)/a;this.z=(g-d)/a;this.w=Math.acos((e+h+l-1)/2);return this},min:function(a){this.x>a.x&&(this.x=a.x);this.y>a.y&&(this.y=a.y);this.z>a.z&&(this.z=a.z);this.w>a.w&&(this.w=a.w);return this},max:function(a){this.x<a.x&&(this.x=a.x);this.y<a.y&&(this.y=
a.y);this.z<a.z&&(this.z=a.z);this.w<a.w&&(this.w=a.w);return this},clamp:function(a,b){this.x<a.x?this.x=a.x:this.x>b.x&&(this.x=b.x);this.y<a.y?this.y=a.y:this.y>b.y&&(this.y=b.y);this.z<a.z?this.z=a.z:this.z>b.z&&(this.z=b.z);this.w<a.w?this.w=a.w:this.w>b.w&&(this.w=b.w);return this},clampScalar:function(){var a,b;return function(c,d){void 0===a&&(a=new THREE.Vector4,b=new THREE.Vector4);a.set(c,c,c,c);b.set(d,d,d,d);return this.clamp(a,b)}}(),floor:function(){this.x=Math.floor(this.x);this.y=
Math.floor(this.y);this.z=Math.floor(this.z);this.w=Math.floor(this.w);return this},ceil:function(){this.x=Math.ceil(this.x);this.y=Math.ceil(this.y);this.z=Math.ceil(this.z);this.w=Math.ceil(this.w);return this},round:function(){this.x=Math.round(this.x);this.y=Math.round(this.y);this.z=Math.round(this.z);this.w=Math.round(this.w);return this},roundToZero:function(){this.x=0>this.x?Math.ceil(this.x):Math.floor(this.x);this.y=0>this.y?Math.ceil(this.y):Math.floor(this.y);this.z=0>this.z?Math.ceil(this.z):
Math.floor(this.z);this.w=0>this.w?Math.ceil(this.w):Math.floor(this.w);return this},negate:function(){return this.multiplyScalar(-1)},dot:function(a){return this.x*a.x+this.y*a.y+this.z*a.z+this.w*a.w},lengthSq:function(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w},length:function(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)},lengthManhattan:function(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)},normalize:function(){return this.divideScalar(this.length())},
setLength:function(a){var b=this.length();0!==b&&a!==b&&this.multiplyScalar(a/b);return this},lerp:function(a,b){this.x+=(a.x-this.x)*b;this.y+=(a.y-this.y)*b;this.z+=(a.z-this.z)*b;this.w+=(a.w-this.w)*b;return this},equals:function(a){return a.x===this.x&&a.y===this.y&&a.z===this.z&&a.w===this.w},fromArray:function(a){this.x=a[0];this.y=a[1];this.z=a[2];this.w=a[3];return this},toArray:function(){return[this.x,this.y,this.z,this.w]},clone:function(){return new THREE.Vector4(this.x,this.y,this.z,
this.w)}};THREE.Euler=function(a,b,c,d){this._x=a||0;this._y=b||0;this._z=c||0;this._order=d||THREE.Euler.DefaultOrder};THREE.Euler.RotationOrders="XYZ YZX ZXY XZY YXZ ZYX".split(" ");THREE.Euler.DefaultOrder="XYZ";
THREE.Euler.prototype={constructor:THREE.Euler,_x:0,_y:0,_z:0,_order:THREE.Euler.DefaultOrder,get x(){return this._x},set x(a){this._x=a;this.onChangeCallback()},get y(){return this._y},set y(a){this._y=a;this.onChangeCallback()},get z(){return this._z},set z(a){this._z=a;this.onChangeCallback()},get order(){return this._order},set order(a){this._order=a;this.onChangeCallback()},set:function(a,b,c,d){this._x=a;this._y=b;this._z=c;this._order=d||this._order;this.onChangeCallback();return this},copy:function(a){this._x=
a._x;this._y=a._y;this._z=a._z;this._order=a._order;this.onChangeCallback();return this},setFromRotationMatrix:function(a,b){var c=THREE.Math.clamp,d=a.elements,e=d[0],f=d[4],g=d[8],h=d[1],k=d[5],l=d[9],n=d[2],q=d[6],d=d[10];b=b||this._order;"XYZ"===b?(this._y=Math.asin(c(g,-1,1)),0.99999>Math.abs(g)?(this._x=Math.atan2(-l,d),this._z=Math.atan2(-f,e)):(this._x=Math.atan2(q,k),this._z=0)):"YXZ"===b?(this._x=Math.asin(-c(l,-1,1)),0.99999>Math.abs(l)?(this._y=Math.atan2(g,d),this._z=Math.atan2(h,k)):
(this._y=Math.atan2(-n,e),this._z=0)):"ZXY"===b?(this._x=Math.asin(c(q,-1,1)),0.99999>Math.abs(q)?(this._y=Math.atan2(-n,d),this._z=Math.atan2(-f,k)):(this._y=0,this._z=Math.atan2(h,e))):"ZYX"===b?(this._y=Math.asin(-c(n,-1,1)),0.99999>Math.abs(n)?(this._x=Math.atan2(q,d),this._z=Math.atan2(h,e)):(this._x=0,this._z=Math.atan2(-f,k))):"YZX"===b?(this._z=Math.asin(c(h,-1,1)),0.99999>Math.abs(h)?(this._x=Math.atan2(-l,k),this._y=Math.atan2(-n,e)):(this._x=0,this._y=Math.atan2(g,d))):"XZY"===b?(this._z=
Math.asin(-c(f,-1,1)),0.99999>Math.abs(f)?(this._x=Math.atan2(q,k),this._y=Math.atan2(g,e)):(this._x=Math.atan2(-l,d),this._y=0)):console.warn("WARNING: Euler.setFromRotationMatrix() given unsupported order: "+b);this._order=b;this.onChangeCallback();return this},setFromQuaternion:function(a,b,c){var d=THREE.Math.clamp,e=a.x*a.x,f=a.y*a.y,g=a.z*a.z,h=a.w*a.w;b=b||this._order;"XYZ"===b?(this._x=Math.atan2(2*(a.x*a.w-a.y*a.z),h-e-f+g),this._y=Math.asin(d(2*(a.x*a.z+a.y*a.w),-1,1)),this._z=Math.atan2(2*
(a.z*a.w-a.x*a.y),h+e-f-g)):"YXZ"===b?(this._x=Math.asin(d(2*(a.x*a.w-a.y*a.z),-1,1)),this._y=Math.atan2(2*(a.x*a.z+a.y*a.w),h-e-f+g),this._z=Math.atan2(2*(a.x*a.y+a.z*a.w),h-e+f-g)):"ZXY"===b?(this._x=Math.asin(d(2*(a.x*a.w+a.y*a.z),-1,1)),this._y=Math.atan2(2*(a.y*a.w-a.z*a.x),h-e-f+g),this._z=Math.atan2(2*(a.z*a.w-a.x*a.y),h-e+f-g)):"ZYX"===b?(this._x=Math.atan2(2*(a.x*a.w+a.z*a.y),h-e-f+g),this._y=Math.asin(d(2*(a.y*a.w-a.x*a.z),-1,1)),this._z=Math.atan2(2*(a.x*a.y+a.z*a.w),h+e-f-g)):"YZX"===
b?(this._x=Math.atan2(2*(a.x*a.w-a.z*a.y),h-e+f-g),this._y=Math.atan2(2*(a.y*a.w-a.x*a.z),h+e-f-g),this._z=Math.asin(d(2*(a.x*a.y+a.z*a.w),-1,1))):"XZY"===b?(this._x=Math.atan2(2*(a.x*a.w+a.y*a.z),h-e+f-g),this._y=Math.atan2(2*(a.x*a.z+a.y*a.w),h+e-f-g),this._z=Math.asin(d(2*(a.z*a.w-a.x*a.y),-1,1))):console.warn("WARNING: Euler.setFromQuaternion() given unsupported order: "+b);this._order=b;if(!1!==c)this.onChangeCallback();return this},reorder:function(){var a=new THREE.Quaternion;return function(b){a.setFromEuler(this);
this.setFromQuaternion(a,b)}}(),equals:function(a){return a._x===this._x&&a._y===this._y&&a._z===this._z&&a._order===this._order},fromArray:function(a){this._x=a[0];this._y=a[1];this._z=a[2];void 0!==a[3]&&(this._order=a[3]);this.onChangeCallback();return this},toArray:function(){return[this._x,this._y,this._z,this._order]},onChange:function(a){this.onChangeCallback=a;return this},onChangeCallback:function(){},clone:function(){return new THREE.Euler(this._x,this._y,this._z,this._order)}};THREE.Line3=function(a,b){this.start=void 0!==a?a:new THREE.Vector3;this.end=void 0!==b?b:new THREE.Vector3};
THREE.Line3.prototype={constructor:THREE.Line3,set:function(a,b){this.start.copy(a);this.end.copy(b);return this},copy:function(a){this.start.copy(a.start);this.end.copy(a.end);return this},center:function(a){return(a||new THREE.Vector3).addVectors(this.start,this.end).multiplyScalar(0.5)},delta:function(a){return(a||new THREE.Vector3).subVectors(this.end,this.start)},distanceSq:function(){return this.start.distanceToSquared(this.end)},distance:function(){return this.start.distanceTo(this.end)},at:function(a,
b){var c=b||new THREE.Vector3;return this.delta(c).multiplyScalar(a).add(this.start)},closestPointToPointParameter:function(){var a=new THREE.Vector3,b=new THREE.Vector3;return function(c,d){a.subVectors(c,this.start);b.subVectors(this.end,this.start);var e=b.dot(b),e=b.dot(a)/e;d&&(e=THREE.Math.clamp(e,0,1));return e}}(),closestPointToPoint:function(a,b,c){a=this.closestPointToPointParameter(a,b);c=c||new THREE.Vector3;return this.delta(c).multiplyScalar(a).add(this.start)},applyMatrix4:function(a){this.start.applyMatrix4(a);
this.end.applyMatrix4(a);return this},equals:function(a){return a.start.equals(this.start)&&a.end.equals(this.end)},clone:function(){return(new THREE.Line3).copy(this)}};THREE.Box2=function(a,b){this.min=void 0!==a?a:new THREE.Vector2(Infinity,Infinity);this.max=void 0!==b?b:new THREE.Vector2(-Infinity,-Infinity)};
THREE.Box2.prototype={constructor:THREE.Box2,set:function(a,b){this.min.copy(a);this.max.copy(b);return this},setFromPoints:function(a){if(0<a.length){var b=a[0];this.min.copy(b);this.max.copy(b);for(var c=1,d=a.length;c<d;c++)b=a[c],b.x<this.min.x?this.min.x=b.x:b.x>this.max.x&&(this.max.x=b.x),b.y<this.min.y?this.min.y=b.y:b.y>this.max.y&&(this.max.y=b.y)}else this.makeEmpty();return this},setFromCenterAndSize:function(){var a=new THREE.Vector2;return function(b,c){var d=a.copy(c).multiplyScalar(0.5);
this.min.copy(b).sub(d);this.max.copy(b).add(d);return this}}(),copy:function(a){this.min.copy(a.min);this.max.copy(a.max);return this},makeEmpty:function(){this.min.x=this.min.y=Infinity;this.max.x=this.max.y=-Infinity;return this},empty:function(){return this.max.x<this.min.x||this.max.y<this.min.y},center:function(a){return(a||new THREE.Vector2).addVectors(this.min,this.max).multiplyScalar(0.5)},size:function(a){return(a||new THREE.Vector2).subVectors(this.max,this.min)},expandByPoint:function(a){this.min.min(a);
this.max.max(a);return this},expandByVector:function(a){this.min.sub(a);this.max.add(a);return this},expandByScalar:function(a){this.min.addScalar(-a);this.max.addScalar(a);return this},containsPoint:function(a){return a.x<this.min.x||a.x>this.max.x||a.y<this.min.y||a.y>this.max.y?!1:!0},containsBox:function(a){return this.min.x<=a.min.x&&a.max.x<=this.max.x&&this.min.y<=a.min.y&&a.max.y<=this.max.y?!0:!1},getParameter:function(a,b){return(b||new THREE.Vector2).set((a.x-this.min.x)/(this.max.x-this.min.x),
(a.y-this.min.y)/(this.max.y-this.min.y))},isIntersectionBox:function(a){return a.max.x<this.min.x||a.min.x>this.max.x||a.max.y<this.min.y||a.min.y>this.max.y?!1:!0},clampPoint:function(a,b){return(b||new THREE.Vector2).copy(a).clamp(this.min,this.max)},distanceToPoint:function(){var a=new THREE.Vector2;return function(b){return a.copy(b).clamp(this.min,this.max).sub(b).length()}}(),intersect:function(a){this.min.max(a.min);this.max.min(a.max);return this},union:function(a){this.min.min(a.min);this.max.max(a.max);
return this},translate:function(a){this.min.add(a);this.max.add(a);return this},equals:function(a){return a.min.equals(this.min)&&a.max.equals(this.max)},clone:function(){return(new THREE.Box2).copy(this)}};THREE.Box3=function(a,b){this.min=void 0!==a?a:new THREE.Vector3(Infinity,Infinity,Infinity);this.max=void 0!==b?b:new THREE.Vector3(-Infinity,-Infinity,-Infinity)};
THREE.Box3.prototype={constructor:THREE.Box3,set:function(a,b){this.min.copy(a);this.max.copy(b);return this},addPoint:function(a){a.x<this.min.x?this.min.x=a.x:a.x>this.max.x&&(this.max.x=a.x);a.y<this.min.y?this.min.y=a.y:a.y>this.max.y&&(this.max.y=a.y);a.z<this.min.z?this.min.z=a.z:a.z>this.max.z&&(this.max.z=a.z);return this},setFromPoints:function(a){if(0<a.length){var b=a[0];this.min.copy(b);this.max.copy(b);for(var b=1,c=a.length;b<c;b++)this.addPoint(a[b])}else this.makeEmpty();return this},
setFromCenterAndSize:function(){var a=new THREE.Vector3;return function(b,c){var d=a.copy(c).multiplyScalar(0.5);this.min.copy(b).sub(d);this.max.copy(b).add(d);return this}}(),setFromObject:function(){var a=new THREE.Vector3;return function(b){var c=this;b.updateMatrixWorld(!0);this.makeEmpty();b.traverse(function(b){if(void 0!==b.geometry&&void 0!==b.geometry.vertices)for(var e=b.geometry.vertices,f=0,g=e.length;f<g;f++)a.copy(e[f]),a.applyMatrix4(b.matrixWorld),c.expandByPoint(a)});return this}}(),
copy:function(a){this.min.copy(a.min);this.max.copy(a.max);return this},makeEmpty:function(){this.min.x=this.min.y=this.min.z=Infinity;this.max.x=this.max.y=this.max.z=-Infinity;return this},empty:function(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z},center:function(a){return(a||new THREE.Vector3).addVectors(this.min,this.max).multiplyScalar(0.5)},size:function(a){return(a||new THREE.Vector3).subVectors(this.max,this.min)},expandByPoint:function(a){this.min.min(a);
this.max.max(a);return this},expandByVector:function(a){this.min.sub(a);this.max.add(a);return this},expandByScalar:function(a){this.min.addScalar(-a);this.max.addScalar(a);return this},containsPoint:function(a){return a.x<this.min.x||a.x>this.max.x||a.y<this.min.y||a.y>this.max.y||a.z<this.min.z||a.z>this.max.z?!1:!0},containsBox:function(a){return this.min.x<=a.min.x&&a.max.x<=this.max.x&&this.min.y<=a.min.y&&a.max.y<=this.max.y&&this.min.z<=a.min.z&&a.max.z<=this.max.z?!0:!1},getParameter:function(a,
b){return(b||new THREE.Vector3).set((a.x-this.min.x)/(this.max.x-this.min.x),(a.y-this.min.y)/(this.max.y-this.min.y),(a.z-this.min.z)/(this.max.z-this.min.z))},isIntersectionBox:function(a){return a.max.x<this.min.x||a.min.x>this.max.x||a.max.y<this.min.y||a.min.y>this.max.y||a.max.z<this.min.z||a.min.z>this.max.z?!1:!0},clampPoint:function(a,b){return(b||new THREE.Vector3).copy(a).clamp(this.min,this.max)},distanceToPoint:function(){var a=new THREE.Vector3;return function(b){return a.copy(b).clamp(this.min,
this.max).sub(b).length()}}(),getBoundingSphere:function(){var a=new THREE.Vector3;return function(b){b=b||new THREE.Sphere;b.center=this.center();b.radius=0.5*this.size(a).length();return b}}(),intersect:function(a){this.min.max(a.min);this.max.min(a.max);return this},union:function(a){this.min.min(a.min);this.max.max(a.max);return this},applyMatrix4:function(){var a=[new THREE.Vector3,new THREE.Vector3,new THREE.Vector3,new THREE.Vector3,new THREE.Vector3,new THREE.Vector3,new THREE.Vector3,new THREE.Vector3];
return function(b){a[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(b);a[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(b);a[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(b);a[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(b);a[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(b);a[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(b);a[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(b);a[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(b);this.makeEmpty();
this.setFromPoints(a);return this}}(),translate:function(a){this.min.add(a);this.max.add(a);return this},equals:function(a){return a.min.equals(this.min)&&a.max.equals(this.max)},clone:function(){return(new THREE.Box3).copy(this)}};THREE.Matrix3=function(a,b,c,d,e,f,g,h,k){var l=this.elements=new Float32Array(9);l[0]=void 0!==a?a:1;l[3]=b||0;l[6]=c||0;l[1]=d||0;l[4]=void 0!==e?e:1;l[7]=f||0;l[2]=g||0;l[5]=h||0;l[8]=void 0!==k?k:1};
THREE.Matrix3.prototype={constructor:THREE.Matrix3,set:function(a,b,c,d,e,f,g,h,k){var l=this.elements;l[0]=a;l[3]=b;l[6]=c;l[1]=d;l[4]=e;l[7]=f;l[2]=g;l[5]=h;l[8]=k;return this},identity:function(){this.set(1,0,0,0,1,0,0,0,1);return this},copy:function(a){a=a.elements;this.set(a[0],a[3],a[6],a[1],a[4],a[7],a[2],a[5],a[8]);return this},multiplyVector3:function(a){console.warn("DEPRECATED: Matrix3's .multiplyVector3() has been removed. Use vector.applyMatrix3( matrix ) instead.");return a.applyMatrix3(this)},
multiplyVector3Array:function(a){console.warn("DEPRECATED: Matrix3's .multiplyVector3Array() has been renamed. Use matrix.applyToVector3Array( array ) instead.");return this.applyToVector3Array(a)},applyToVector3Array:function(){var a=new THREE.Vector3;return function(b,c,d){void 0===c&&(c=0);void 0===d&&(d=b.length);for(var e=0;e<d;e+=3,c+=3)a.x=b[c],a.y=b[c+1],a.z=b[c+2],a.applyMatrix3(this),b[c]=a.x,b[c+1]=a.y,b[c+2]=a.z;return b}}(),multiplyScalar:function(a){var b=this.elements;b[0]*=a;b[3]*=
a;b[6]*=a;b[1]*=a;b[4]*=a;b[7]*=a;b[2]*=a;b[5]*=a;b[8]*=a;return this},determinant:function(){var a=this.elements,b=a[0],c=a[1],d=a[2],e=a[3],f=a[4],g=a[5],h=a[6],k=a[7],a=a[8];return b*f*a-b*g*k-c*e*a+c*g*h+d*e*k-d*f*h},getInverse:function(a,b){var c=a.elements,d=this.elements;d[0]=c[10]*c[5]-c[6]*c[9];d[1]=-c[10]*c[1]+c[2]*c[9];d[2]=c[6]*c[1]-c[2]*c[5];d[3]=-c[10]*c[4]+c[6]*c[8];d[4]=c[10]*c[0]-c[2]*c[8];d[5]=-c[6]*c[0]+c[2]*c[4];d[6]=c[9]*c[4]-c[5]*c[8];d[7]=-c[9]*c[0]+c[1]*c[8];d[8]=c[5]*c[0]-
c[1]*c[4];c=c[0]*d[0]+c[1]*d[3]+c[2]*d[6];if(0===c){if(b)throw Error("Matrix3.getInverse(): can't invert matrix, determinant is 0");console.warn("Matrix3.getInverse(): can't invert matrix, determinant is 0");this.identity();return this}this.multiplyScalar(1/c);return this},transpose:function(){var a,b=this.elements;a=b[1];b[1]=b[3];b[3]=a;a=b[2];b[2]=b[6];b[6]=a;a=b[5];b[5]=b[7];b[7]=a;return this},flattenToArrayOffset:function(a,b){var c=this.elements;a[b]=c[0];a[b+1]=c[1];a[b+2]=c[2];a[b+3]=c[3];
a[b+4]=c[4];a[b+5]=c[5];a[b+6]=c[6];a[b+7]=c[7];a[b+8]=c[8];return a},getNormalMatrix:function(a){this.getInverse(a).transpose();return this},transposeIntoArray:function(a){var b=this.elements;a[0]=b[0];a[1]=b[3];a[2]=b[6];a[3]=b[1];a[4]=b[4];a[5]=b[7];a[6]=b[2];a[7]=b[5];a[8]=b[8];return this},fromArray:function(a){this.elements.set(a);return this},toArray:function(){var a=this.elements;return[a[0],a[1],a[2],a[3],a[4],a[5],a[6],a[7],a[8]]},clone:function(){var a=this.elements;return new THREE.Matrix3(a[0],
a[3],a[6],a[1],a[4],a[7],a[2],a[5],a[8])}};THREE.Matrix4=function(a,b,c,d,e,f,g,h,k,l,n,q,p,s,t,r){var v=this.elements=new Float32Array(16);v[0]=void 0!==a?a:1;v[4]=b||0;v[8]=c||0;v[12]=d||0;v[1]=e||0;v[5]=void 0!==f?f:1;v[9]=g||0;v[13]=h||0;v[2]=k||0;v[6]=l||0;v[10]=void 0!==n?n:1;v[14]=q||0;v[3]=p||0;v[7]=s||0;v[11]=t||0;v[15]=void 0!==r?r:1};
THREE.Matrix4.prototype={constructor:THREE.Matrix4,set:function(a,b,c,d,e,f,g,h,k,l,n,q,p,s,t,r){var v=this.elements;v[0]=a;v[4]=b;v[8]=c;v[12]=d;v[1]=e;v[5]=f;v[9]=g;v[13]=h;v[2]=k;v[6]=l;v[10]=n;v[14]=q;v[3]=p;v[7]=s;v[11]=t;v[15]=r;return this},identity:function(){this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1);return this},copy:function(a){this.elements.set(a.elements);return this},extractPosition:function(a){console.warn("DEPRECATED: Matrix4's .extractPosition() has been renamed to .copyPosition().");
return this.copyPosition(a)},copyPosition:function(a){var b=this.elements;a=a.elements;b[12]=a[12];b[13]=a[13];b[14]=a[14];return this},extractRotation:function(){var a=new THREE.Vector3;return function(b){var c=this.elements;b=b.elements;var d=1/a.set(b[0],b[1],b[2]).length(),e=1/a.set(b[4],b[5],b[6]).length(),f=1/a.set(b[8],b[9],b[10]).length();c[0]=b[0]*d;c[1]=b[1]*d;c[2]=b[2]*d;c[4]=b[4]*e;c[5]=b[5]*e;c[6]=b[6]*e;c[8]=b[8]*f;c[9]=b[9]*f;c[10]=b[10]*f;return this}}(),makeRotationFromEuler:function(a){!1===
a instanceof THREE.Euler&&console.error("ERROR: Matrix's .makeRotationFromEuler() now expects a Euler rotation rather than a Vector3 and order.  Please update your code.");var b=this.elements,c=a.x,d=a.y,e=a.z,f=Math.cos(c),c=Math.sin(c),g=Math.cos(d),d=Math.sin(d),h=Math.cos(e),e=Math.sin(e);if("XYZ"===a.order){a=f*h;var k=f*e,l=c*h,n=c*e;b[0]=g*h;b[4]=-g*e;b[8]=d;b[1]=k+l*d;b[5]=a-n*d;b[9]=-c*g;b[2]=n-a*d;b[6]=l+k*d;b[10]=f*g}else"YXZ"===a.order?(a=g*h,k=g*e,l=d*h,n=d*e,b[0]=a+n*c,b[4]=l*c-k,b[8]=
f*d,b[1]=f*e,b[5]=f*h,b[9]=-c,b[2]=k*c-l,b[6]=n+a*c,b[10]=f*g):"ZXY"===a.order?(a=g*h,k=g*e,l=d*h,n=d*e,b[0]=a-n*c,b[4]=-f*e,b[8]=l+k*c,b[1]=k+l*c,b[5]=f*h,b[9]=n-a*c,b[2]=-f*d,b[6]=c,b[10]=f*g):"ZYX"===a.order?(a=f*h,k=f*e,l=c*h,n=c*e,b[0]=g*h,b[4]=l*d-k,b[8]=a*d+n,b[1]=g*e,b[5]=n*d+a,b[9]=k*d-l,b[2]=-d,b[6]=c*g,b[10]=f*g):"YZX"===a.order?(a=f*g,k=f*d,l=c*g,n=c*d,b[0]=g*h,b[4]=n-a*e,b[8]=l*e+k,b[1]=e,b[5]=f*h,b[9]=-c*h,b[2]=-d*h,b[6]=k*e+l,b[10]=a-n*e):"XZY"===a.order&&(a=f*g,k=f*d,l=c*g,n=c*d,b[0]=
g*h,b[4]=-e,b[8]=d*h,b[1]=a*e+n,b[5]=f*h,b[9]=k*e-l,b[2]=l*e-k,b[6]=c*h,b[10]=n*e+a);b[3]=0;b[7]=0;b[11]=0;b[12]=0;b[13]=0;b[14]=0;b[15]=1;return this},setRotationFromQuaternion:function(a){console.warn("DEPRECATED: Matrix4's .setRotationFromQuaternion() has been deprecated in favor of makeRotationFromQuaternion.  Please update your code.");return this.makeRotationFromQuaternion(a)},makeRotationFromQuaternion:function(a){var b=this.elements,c=a.x,d=a.y,e=a.z,f=a.w,g=c+c,h=d+d,k=e+e;a=c*g;var l=c*
h,c=c*k,n=d*h,d=d*k,e=e*k,g=f*g,h=f*h,f=f*k;b[0]=1-(n+e);b[4]=l-f;b[8]=c+h;b[1]=l+f;b[5]=1-(a+e);b[9]=d-g;b[2]=c-h;b[6]=d+g;b[10]=1-(a+n);b[3]=0;b[7]=0;b[11]=0;b[12]=0;b[13]=0;b[14]=0;b[15]=1;return this},lookAt:function(){var a=new THREE.Vector3,b=new THREE.Vector3,c=new THREE.Vector3;return function(d,e,f){var g=this.elements;c.subVectors(d,e).normalize();0===c.length()&&(c.z=1);a.crossVectors(f,c).normalize();0===a.length()&&(c.x+=1E-4,a.crossVectors(f,c).normalize());b.crossVectors(c,a);g[0]=
a.x;g[4]=b.x;g[8]=c.x;g[1]=a.y;g[5]=b.y;g[9]=c.y;g[2]=a.z;g[6]=b.z;g[10]=c.z;return this}}(),multiply:function(a,b){return void 0!==b?(console.warn("DEPRECATED: Matrix4's .multiply() now only accepts one argument. Use .multiplyMatrices( a, b ) instead."),this.multiplyMatrices(a,b)):this.multiplyMatrices(this,a)},multiplyMatrices:function(a,b){var c=a.elements,d=b.elements,e=this.elements,f=c[0],g=c[4],h=c[8],k=c[12],l=c[1],n=c[5],q=c[9],p=c[13],s=c[2],t=c[6],r=c[10],v=c[14],w=c[3],u=c[7],y=c[11],
c=c[15],L=d[0],x=d[4],N=d[8],J=d[12],B=d[1],K=d[5],A=d[9],G=d[13],D=d[2],C=d[6],F=d[10],z=d[14],H=d[3],E=d[7],Q=d[11],d=d[15];e[0]=f*L+g*B+h*D+k*H;e[4]=f*x+g*K+h*C+k*E;e[8]=f*N+g*A+h*F+k*Q;e[12]=f*J+g*G+h*z+k*d;e[1]=l*L+n*B+q*D+p*H;e[5]=l*x+n*K+q*C+p*E;e[9]=l*N+n*A+q*F+p*Q;e[13]=l*J+n*G+q*z+p*d;e[2]=s*L+t*B+r*D+v*H;e[6]=s*x+t*K+r*C+v*E;e[10]=s*N+t*A+r*F+v*Q;e[14]=s*J+t*G+r*z+v*d;e[3]=w*L+u*B+y*D+c*H;e[7]=w*x+u*K+y*C+c*E;e[11]=w*N+u*A+y*F+c*Q;e[15]=w*J+u*G+y*z+c*d;return this},multiplyToArray:function(a,
b,c){var d=this.elements;this.multiplyMatrices(a,b);c[0]=d[0];c[1]=d[1];c[2]=d[2];c[3]=d[3];c[4]=d[4];c[5]=d[5];c[6]=d[6];c[7]=d[7];c[8]=d[8];c[9]=d[9];c[10]=d[10];c[11]=d[11];c[12]=d[12];c[13]=d[13];c[14]=d[14];c[15]=d[15];return this},multiplyScalar:function(a){var b=this.elements;b[0]*=a;b[4]*=a;b[8]*=a;b[12]*=a;b[1]*=a;b[5]*=a;b[9]*=a;b[13]*=a;b[2]*=a;b[6]*=a;b[10]*=a;b[14]*=a;b[3]*=a;b[7]*=a;b[11]*=a;b[15]*=a;return this},multiplyVector3:function(a){console.warn("DEPRECATED: Matrix4's .multiplyVector3() has been removed. Use vector.applyMatrix4( matrix ) or vector.applyProjection( matrix ) instead.");
return a.applyProjection(this)},multiplyVector4:function(a){console.warn("DEPRECATED: Matrix4's .multiplyVector4() has been removed. Use vector.applyMatrix4( matrix ) instead.");return a.applyMatrix4(this)},multiplyVector3Array:function(a){console.warn("DEPRECATED: Matrix4's .multiplyVector3Array() has been renamed. Use matrix.applyToVector3Array( array ) instead.");return this.applyToVector3Array(a)},applyToVector3Array:function(){var a=new THREE.Vector3;return function(b,c,d){void 0===c&&(c=0);
void 0===d&&(d=b.length);for(var e=0;e<d;e+=3,c+=3)a.x=b[c],a.y=b[c+1],a.z=b[c+2],a.applyMatrix4(this),b[c]=a.x,b[c+1]=a.y,b[c+2]=a.z;return b}}(),rotateAxis:function(a){console.warn("DEPRECATED: Matrix4's .rotateAxis() has been removed. Use Vector3.transformDirection( matrix ) instead.");a.transformDirection(this)},crossVector:function(a){console.warn("DEPRECATED: Matrix4's .crossVector() has been removed. Use vector.applyMatrix4( matrix ) instead.");return a.applyMatrix4(this)},determinant:function(){var a=
this.elements,b=a[0],c=a[4],d=a[8],e=a[12],f=a[1],g=a[5],h=a[9],k=a[13],l=a[2],n=a[6],q=a[10],p=a[14];return a[3]*(+e*h*n-d*k*n-e*g*q+c*k*q+d*g*p-c*h*p)+a[7]*(+b*h*p-b*k*q+e*f*q-d*f*p+d*k*l-e*h*l)+a[11]*(+b*k*n-b*g*p-e*f*n+c*f*p+e*g*l-c*k*l)+a[15]*(-d*g*l-b*h*n+b*g*q+d*f*n-c*f*q+c*h*l)},transpose:function(){var a=this.elements,b;b=a[1];a[1]=a[4];a[4]=b;b=a[2];a[2]=a[8];a[8]=b;b=a[6];a[6]=a[9];a[9]=b;b=a[3];a[3]=a[12];a[12]=b;b=a[7];a[7]=a[13];a[13]=b;b=a[11];a[11]=a[14];a[14]=b;return this},flattenToArrayOffset:function(a,
b){var c=this.elements;a[b]=c[0];a[b+1]=c[1];a[b+2]=c[2];a[b+3]=c[3];a[b+4]=c[4];a[b+5]=c[5];a[b+6]=c[6];a[b+7]=c[7];a[b+8]=c[8];a[b+9]=c[9];a[b+10]=c[10];a[b+11]=c[11];a[b+12]=c[12];a[b+13]=c[13];a[b+14]=c[14];a[b+15]=c[15];return a},getPosition:function(){var a=new THREE.Vector3;return function(){console.warn("DEPRECATED: Matrix4's .getPosition() has been removed. Use Vector3.setFromMatrixPosition( matrix ) instead.");var b=this.elements;return a.set(b[12],b[13],b[14])}}(),setPosition:function(a){var b=
this.elements;b[12]=a.x;b[13]=a.y;b[14]=a.z;return this},getInverse:function(a,b){var c=this.elements,d=a.elements,e=d[0],f=d[4],g=d[8],h=d[12],k=d[1],l=d[5],n=d[9],q=d[13],p=d[2],s=d[6],t=d[10],r=d[14],v=d[3],w=d[7],u=d[11],d=d[15];c[0]=n*r*w-q*t*w+q*s*u-l*r*u-n*s*d+l*t*d;c[4]=h*t*w-g*r*w-h*s*u+f*r*u+g*s*d-f*t*d;c[8]=g*q*w-h*n*w+h*l*u-f*q*u-g*l*d+f*n*d;c[12]=h*n*s-g*q*s-h*l*t+f*q*t+g*l*r-f*n*r;c[1]=q*t*v-n*r*v-q*p*u+k*r*u+n*p*d-k*t*d;c[5]=g*r*v-h*t*v+h*p*u-e*r*u-g*p*d+e*t*d;c[9]=h*n*v-g*q*v-h*k*
u+e*q*u+g*k*d-e*n*d;c[13]=g*q*p-h*n*p+h*k*t-e*q*t-g*k*r+e*n*r;c[2]=l*r*v-q*s*v+q*p*w-k*r*w-l*p*d+k*s*d;c[6]=h*s*v-f*r*v-h*p*w+e*r*w+f*p*d-e*s*d;c[10]=f*q*v-h*l*v+h*k*w-e*q*w-f*k*d+e*l*d;c[14]=h*l*p-f*q*p-h*k*s+e*q*s+f*k*r-e*l*r;c[3]=n*s*v-l*t*v-n*p*w+k*t*w+l*p*u-k*s*u;c[7]=f*t*v-g*s*v+g*p*w-e*t*w-f*p*u+e*s*u;c[11]=g*l*v-f*n*v-g*k*w+e*n*w+f*k*u-e*l*u;c[15]=f*n*p-g*l*p+g*k*s-e*n*s-f*k*t+e*l*t;c=e*c[0]+k*c[4]+p*c[8]+v*c[12];if(0==c){if(b)throw Error("Matrix4.getInverse(): can't invert matrix, determinant is 0");
console.warn("Matrix4.getInverse(): can't invert matrix, determinant is 0");this.identity();return this}this.multiplyScalar(1/c);return this},translate:function(a){console.warn("DEPRECATED: Matrix4's .translate() has been removed.")},rotateX:function(a){console.warn("DEPRECATED: Matrix4's .rotateX() has been removed.")},rotateY:function(a){console.warn("DEPRECATED: Matrix4's .rotateY() has been removed.")},rotateZ:function(a){console.warn("DEPRECATED: Matrix4's .rotateZ() has been removed.")},rotateByAxis:function(a,
b){console.warn("DEPRECATED: Matrix4's .rotateByAxis() has been removed.")},scale:function(a){var b=this.elements,c=a.x,d=a.y;a=a.z;b[0]*=c;b[4]*=d;b[8]*=a;b[1]*=c;b[5]*=d;b[9]*=a;b[2]*=c;b[6]*=d;b[10]*=a;b[3]*=c;b[7]*=d;b[11]*=a;return this},getMaxScaleOnAxis:function(){var a=this.elements;return Math.sqrt(Math.max(a[0]*a[0]+a[1]*a[1]+a[2]*a[2],Math.max(a[4]*a[4]+a[5]*a[5]+a[6]*a[6],a[8]*a[8]+a[9]*a[9]+a[10]*a[10])))},makeTranslation:function(a,b,c){this.set(1,0,0,a,0,1,0,b,0,0,1,c,0,0,0,1);return this},
makeRotationX:function(a){var b=Math.cos(a);a=Math.sin(a);this.set(1,0,0,0,0,b,-a,0,0,a,b,0,0,0,0,1);return this},makeRotationY:function(a){var b=Math.cos(a);a=Math.sin(a);this.set(b,0,a,0,0,1,0,0,-a,0,b,0,0,0,0,1);return this},makeRotationZ:function(a){var b=Math.cos(a);a=Math.sin(a);this.set(b,-a,0,0,a,b,0,0,0,0,1,0,0,0,0,1);return this},makeRotationAxis:function(a,b){var c=Math.cos(b),d=Math.sin(b),e=1-c,f=a.x,g=a.y,h=a.z,k=e*f,l=e*g;this.set(k*f+c,k*g-d*h,k*h+d*g,0,k*g+d*h,l*g+c,l*h-d*f,0,k*h-
d*g,l*h+d*f,e*h*h+c,0,0,0,0,1);return this},makeScale:function(a,b,c){this.set(a,0,0,0,0,b,0,0,0,0,c,0,0,0,0,1);return this},compose:function(a,b,c){this.makeRotationFromQuaternion(b);this.scale(c);this.setPosition(a);return this},decompose:function(){var a=new THREE.Vector3,b=new THREE.Matrix4;return function(c,d,e){var f=this.elements,g=a.set(f[0],f[1],f[2]).length(),h=a.set(f[4],f[5],f[6]).length(),k=a.set(f[8],f[9],f[10]).length();0>this.determinant()&&(g=-g);c.x=f[12];c.y=f[13];c.z=f[14];b.elements.set(this.elements);
c=1/g;var f=1/h,l=1/k;b.elements[0]*=c;b.elements[1]*=c;b.elements[2]*=c;b.elements[4]*=f;b.elements[5]*=f;b.elements[6]*=f;b.elements[8]*=l;b.elements[9]*=l;b.elements[10]*=l;d.setFromRotationMatrix(b);e.x=g;e.y=h;e.z=k;return this}}(),makeFrustum:function(a,b,c,d,e,f){var g=this.elements;g[0]=2*e/(b-a);g[4]=0;g[8]=(b+a)/(b-a);g[12]=0;g[1]=0;g[5]=2*e/(d-c);g[9]=(d+c)/(d-c);g[13]=0;g[2]=0;g[6]=0;g[10]=-(f+e)/(f-e);g[14]=-2*f*e/(f-e);g[3]=0;g[7]=0;g[11]=-1;g[15]=0;return this},makePerspective:function(a,
b,c,d){a=c*Math.tan(THREE.Math.degToRad(0.5*a));var e=-a;return this.makeFrustum(e*b,a*b,e,a,c,d)},makeOrthographic:function(a,b,c,d,e,f){var g=this.elements,h=b-a,k=c-d,l=f-e;g[0]=2/h;g[4]=0;g[8]=0;g[12]=-((b+a)/h);g[1]=0;g[5]=2/k;g[9]=0;g[13]=-((c+d)/k);g[2]=0;g[6]=0;g[10]=-2/l;g[14]=-((f+e)/l);g[3]=0;g[7]=0;g[11]=0;g[15]=1;return this},fromArray:function(a){this.elements.set(a);return this},toArray:function(){var a=this.elements;return[a[0],a[1],a[2],a[3],a[4],a[5],a[6],a[7],a[8],a[9],a[10],a[11],
a[12],a[13],a[14],a[15]]},clone:function(){var a=this.elements;return new THREE.Matrix4(a[0],a[4],a[8],a[12],a[1],a[5],a[9],a[13],a[2],a[6],a[10],a[14],a[3],a[7],a[11],a[15])}};THREE.Ray=function(a,b){this.origin=void 0!==a?a:new THREE.Vector3;this.direction=void 0!==b?b:new THREE.Vector3};
THREE.Ray.prototype={constructor:THREE.Ray,set:function(a,b){this.origin.copy(a);this.direction.copy(b);return this},copy:function(a){this.origin.copy(a.origin);this.direction.copy(a.direction);return this},at:function(a,b){return(b||new THREE.Vector3).copy(this.direction).multiplyScalar(a).add(this.origin)},recast:function(){var a=new THREE.Vector3;return function(b){this.origin.copy(this.at(b,a));return this}}(),closestPointToPoint:function(a,b){var c=b||new THREE.Vector3;c.subVectors(a,this.origin);
var d=c.dot(this.direction);return 0>d?c.copy(this.origin):c.copy(this.direction).multiplyScalar(d).add(this.origin)},distanceToPoint:function(){var a=new THREE.Vector3;return function(b){var c=a.subVectors(b,this.origin).dot(this.direction);if(0>c)return this.origin.distanceTo(b);a.copy(this.direction).multiplyScalar(c).add(this.origin);return a.distanceTo(b)}}(),distanceSqToSegment:function(a,b,c,d){var e=a.clone().add(b).multiplyScalar(0.5),f=b.clone().sub(a).normalize(),g=0.5*a.distanceTo(b),
h=this.origin.clone().sub(e);a=-this.direction.dot(f);b=h.dot(this.direction);var k=-h.dot(f),l=h.lengthSq(),n=Math.abs(1-a*a),q,p;0<=n?(h=a*k-b,q=a*b-k,p=g*n,0<=h?q>=-p?q<=p?(g=1/n,h*=g,q*=g,a=h*(h+a*q+2*b)+q*(a*h+q+2*k)+l):(q=g,h=Math.max(0,-(a*q+b)),a=-h*h+q*(q+2*k)+l):(q=-g,h=Math.max(0,-(a*q+b)),a=-h*h+q*(q+2*k)+l):q<=-p?(h=Math.max(0,-(-a*g+b)),q=0<h?-g:Math.min(Math.max(-g,-k),g),a=-h*h+q*(q+2*k)+l):q<=p?(h=0,q=Math.min(Math.max(-g,-k),g),a=q*(q+2*k)+l):(h=Math.max(0,-(a*g+b)),q=0<h?g:Math.min(Math.max(-g,
-k),g),a=-h*h+q*(q+2*k)+l)):(q=0<a?-g:g,h=Math.max(0,-(a*q+b)),a=-h*h+q*(q+2*k)+l);c&&c.copy(this.direction.clone().multiplyScalar(h).add(this.origin));d&&d.copy(f.clone().multiplyScalar(q).add(e));return a},isIntersectionSphere:function(a){return this.distanceToPoint(a.center)<=a.radius},isIntersectionPlane:function(a){var b=a.distanceToPoint(this.origin);return 0===b||0>a.normal.dot(this.direction)*b?!0:!1},distanceToPlane:function(a){var b=a.normal.dot(this.direction);if(0==b)return 0==a.distanceToPoint(this.origin)?
0:null;a=-(this.origin.dot(a.normal)+a.constant)/b;return 0<=a?a:null},intersectPlane:function(a,b){var c=this.distanceToPlane(a);return null===c?null:this.at(c,b)},isIntersectionBox:function(){var a=new THREE.Vector3;return function(b){return null!==this.intersectBox(b,a)}}(),intersectBox:function(a,b){var c,d,e,f,g;d=1/this.direction.x;f=1/this.direction.y;g=1/this.direction.z;var h=this.origin;0<=d?(c=(a.min.x-h.x)*d,d*=a.max.x-h.x):(c=(a.max.x-h.x)*d,d*=a.min.x-h.x);0<=f?(e=(a.min.y-h.y)*f,f*=
a.max.y-h.y):(e=(a.max.y-h.y)*f,f*=a.min.y-h.y);if(c>f||e>d)return null;if(e>c||c!==c)c=e;if(f<d||d!==d)d=f;0<=g?(e=(a.min.z-h.z)*g,g*=a.max.z-h.z):(e=(a.max.z-h.z)*g,g*=a.min.z-h.z);if(c>g||e>d)return null;if(e>c||c!==c)c=e;if(g<d||d!==d)d=g;return 0>d?null:this.at(0<=c?c:d,b)},intersectTriangle:function(){var a=new THREE.Vector3,b=new THREE.Vector3,c=new THREE.Vector3,d=new THREE.Vector3;return function(e,f,g,h,k){b.subVectors(f,e);c.subVectors(g,e);d.crossVectors(b,c);f=this.direction.dot(d);if(0<
f){if(h)return null;h=1}else if(0>f)h=-1,f=-f;else return null;a.subVectors(this.origin,e);e=h*this.direction.dot(c.crossVectors(a,c));if(0>e)return null;g=h*this.direction.dot(b.cross(a));if(0>g||e+g>f)return null;e=-h*a.dot(d);return 0>e?null:this.at(e/f,k)}}(),applyMatrix4:function(a){this.direction.add(this.origin).applyMatrix4(a);this.origin.applyMatrix4(a);this.direction.sub(this.origin);this.direction.normalize();return this},equals:function(a){return a.origin.equals(this.origin)&&a.direction.equals(this.direction)},
clone:function(){return(new THREE.Ray).copy(this)}};THREE.Sphere=function(a,b){this.center=void 0!==a?a:new THREE.Vector3;this.radius=void 0!==b?b:0};
THREE.Sphere.prototype={constructor:THREE.Sphere,set:function(a,b){this.center.copy(a);this.radius=b;return this},setFromPoints:function(){var a=new THREE.Box3;return function(b,c){var d=this.center;void 0!==c?d.copy(c):a.setFromPoints(b).center(d);for(var e=0,f=0,g=b.length;f<g;f++)e=Math.max(e,d.distanceToSquared(b[f]));this.radius=Math.sqrt(e);return this}}(),copy:function(a){this.center.copy(a.center);this.radius=a.radius;return this},empty:function(){return 0>=this.radius},containsPoint:function(a){return a.distanceToSquared(this.center)<=
this.radius*this.radius},distanceToPoint:function(a){return a.distanceTo(this.center)-this.radius},intersectsSphere:function(a){var b=this.radius+a.radius;return a.center.distanceToSquared(this.center)<=b*b},clampPoint:function(a,b){var c=this.center.distanceToSquared(a),d=b||new THREE.Vector3;d.copy(a);c>this.radius*this.radius&&(d.sub(this.center).normalize(),d.multiplyScalar(this.radius).add(this.center));return d},getBoundingBox:function(a){a=a||new THREE.Box3;a.set(this.center,this.center);a.expandByScalar(this.radius);
return a},applyMatrix4:function(a){this.center.applyMatrix4(a);this.radius*=a.getMaxScaleOnAxis();return this},translate:function(a){this.center.add(a);return this},equals:function(a){return a.center.equals(this.center)&&a.radius===this.radius},clone:function(){return(new THREE.Sphere).copy(this)}};THREE.Frustum=function(a,b,c,d,e,f){this.planes=[void 0!==a?a:new THREE.Plane,void 0!==b?b:new THREE.Plane,void 0!==c?c:new THREE.Plane,void 0!==d?d:new THREE.Plane,void 0!==e?e:new THREE.Plane,void 0!==f?f:new THREE.Plane]};
THREE.Frustum.prototype={constructor:THREE.Frustum,set:function(a,b,c,d,e,f){var g=this.planes;g[0].copy(a);g[1].copy(b);g[2].copy(c);g[3].copy(d);g[4].copy(e);g[5].copy(f);return this},copy:function(a){for(var b=this.planes,c=0;6>c;c++)b[c].copy(a.planes[c]);return this},setFromMatrix:function(a){var b=this.planes,c=a.elements;a=c[0];var d=c[1],e=c[2],f=c[3],g=c[4],h=c[5],k=c[6],l=c[7],n=c[8],q=c[9],p=c[10],s=c[11],t=c[12],r=c[13],v=c[14],c=c[15];b[0].setComponents(f-a,l-g,s-n,c-t).normalize();b[1].setComponents(f+
a,l+g,s+n,c+t).normalize();b[2].setComponents(f+d,l+h,s+q,c+r).normalize();b[3].setComponents(f-d,l-h,s-q,c-r).normalize();b[4].setComponents(f-e,l-k,s-p,c-v).normalize();b[5].setComponents(f+e,l+k,s+p,c+v).normalize();return this},intersectsObject:function(){var a=new THREE.Sphere;return function(b){var c=b.geometry;null===c.boundingSphere&&c.computeBoundingSphere();a.copy(c.boundingSphere);a.applyMatrix4(b.matrixWorld);return this.intersectsSphere(a)}}(),intersectsSphere:function(a){var b=this.planes,
c=a.center;a=-a.radius;for(var d=0;6>d;d++)if(b[d].distanceToPoint(c)<a)return!1;return!0},intersectsBox:function(){var a=new THREE.Vector3,b=new THREE.Vector3;return function(c){for(var d=this.planes,e=0;6>e;e++){var f=d[e];a.x=0<f.normal.x?c.min.x:c.max.x;b.x=0<f.normal.x?c.max.x:c.min.x;a.y=0<f.normal.y?c.min.y:c.max.y;b.y=0<f.normal.y?c.max.y:c.min.y;a.z=0<f.normal.z?c.min.z:c.max.z;b.z=0<f.normal.z?c.max.z:c.min.z;var g=f.distanceToPoint(a),f=f.distanceToPoint(b);if(0>g&&0>f)return!1}return!0}}(),
containsPoint:function(a){for(var b=this.planes,c=0;6>c;c++)if(0>b[c].distanceToPoint(a))return!1;return!0},clone:function(){return(new THREE.Frustum).copy(this)}};THREE.Plane=function(a,b){this.normal=void 0!==a?a:new THREE.Vector3(1,0,0);this.constant=void 0!==b?b:0};
THREE.Plane.prototype={constructor:THREE.Plane,set:function(a,b){this.normal.copy(a);this.constant=b;return this},setComponents:function(a,b,c,d){this.normal.set(a,b,c);this.constant=d;return this},setFromNormalAndCoplanarPoint:function(a,b){this.normal.copy(a);this.constant=-b.dot(this.normal);return this},setFromCoplanarPoints:function(){var a=new THREE.Vector3,b=new THREE.Vector3;return function(c,d,e){d=a.subVectors(e,d).cross(b.subVectors(c,d)).normalize();this.setFromNormalAndCoplanarPoint(d,
c);return this}}(),copy:function(a){this.normal.copy(a.normal);this.constant=a.constant;return this},normalize:function(){var a=1/this.normal.length();this.normal.multiplyScalar(a);this.constant*=a;return this},negate:function(){this.constant*=-1;this.normal.negate();return this},distanceToPoint:function(a){return this.normal.dot(a)+this.constant},distanceToSphere:function(a){return this.distanceToPoint(a.center)-a.radius},projectPoint:function(a,b){return this.orthoPoint(a,b).sub(a).negate()},orthoPoint:function(a,
b){var c=this.distanceToPoint(a);return(b||new THREE.Vector3).copy(this.normal).multiplyScalar(c)},isIntersectionLine:function(a){var b=this.distanceToPoint(a.start);a=this.distanceToPoint(a.end);return 0>b&&0<a||0>a&&0<b},intersectLine:function(){var a=new THREE.Vector3;return function(b,c){var d=c||new THREE.Vector3,e=b.delta(a),f=this.normal.dot(e);if(0==f){if(0==this.distanceToPoint(b.start))return d.copy(b.start)}else return f=-(b.start.dot(this.normal)+this.constant)/f,0>f||1<f?void 0:d.copy(e).multiplyScalar(f).add(b.start)}}(),
coplanarPoint:function(a){return(a||new THREE.Vector3).copy(this.normal).multiplyScalar(-this.constant)},applyMatrix4:function(){var a=new THREE.Vector3,b=new THREE.Vector3,c=new THREE.Matrix3;return function(d,e){var f=e||c.getNormalMatrix(d),f=a.copy(this.normal).applyMatrix3(f),g=this.coplanarPoint(b);g.applyMatrix4(d);this.setFromNormalAndCoplanarPoint(f,g);return this}}(),translate:function(a){this.constant-=a.dot(this.normal);return this},equals:function(a){return a.normal.equals(this.normal)&&
a.constant==this.constant},clone:function(){return(new THREE.Plane).copy(this)}};THREE.Math={generateUUID:function(){var a="0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split(""),b=Array(36),c=0,d;return function(){for(var e=0;36>e;e++)8==e||13==e||18==e||23==e?b[e]="-":14==e?b[e]="4":(2>=c&&(c=33554432+16777216*Math.random()|0),d=c&15,c>>=4,b[e]=a[19==e?d&3|8:d]);return b.join("")}}(),clamp:function(a,b,c){return a<b?b:a>c?c:a},clampBottom:function(a,b){return a<b?b:a},mapLinear:function(a,b,c,d,e){return d+(a-b)*(e-d)/(c-b)},smoothstep:function(a,b,c){if(a<=
b)return 0;if(a>=c)return 1;a=(a-b)/(c-b);return a*a*(3-2*a)},smootherstep:function(a,b,c){if(a<=b)return 0;if(a>=c)return 1;a=(a-b)/(c-b);return a*a*a*(a*(6*a-15)+10)},random16:function(){return(65280*Math.random()+255*Math.random())/65535},randInt:function(a,b){return a+Math.floor(Math.random()*(b-a+1))},randFloat:function(a,b){return a+Math.random()*(b-a)},randFloatSpread:function(a){return a*(0.5-Math.random())},sign:function(a){return 0>a?-1:0<a?1:0},degToRad:function(){var a=Math.PI/180;return function(b){return b*
a}}(),radToDeg:function(){var a=180/Math.PI;return function(b){return b*a}}(),isPowerOfTwo:function(a){return 0===(a&a-1)&&0!==a}};THREE.Spline=function(a){function b(a,b,c,d,e,f,g){a=0.5*(c-a);d=0.5*(d-b);return(2*(b-c)+a+d)*g+(-3*(b-c)-2*a-d)*f+a*e+b}this.points=a;var c=[],d={x:0,y:0,z:0},e,f,g,h,k,l,n,q,p;this.initFromArray=function(a){this.points=[];for(var b=0;b<a.length;b++)this.points[b]={x:a[b][0],y:a[b][1],z:a[b][2]}};this.getPoint=function(a){e=(this.points.length-1)*a;f=Math.floor(e);g=e-f;c[0]=0===f?f:f-1;c[1]=f;c[2]=f>this.points.length-2?this.points.length-1:f+1;c[3]=f>this.points.length-3?this.points.length-1:
f+2;l=this.points[c[0]];n=this.points[c[1]];q=this.points[c[2]];p=this.points[c[3]];h=g*g;k=g*h;d.x=b(l.x,n.x,q.x,p.x,g,h,k);d.y=b(l.y,n.y,q.y,p.y,g,h,k);d.z=b(l.z,n.z,q.z,p.z,g,h,k);return d};this.getControlPointsArray=function(){var a,b,c=this.points.length,d=[];for(a=0;a<c;a++)b=this.points[a],d[a]=[b.x,b.y,b.z];return d};this.getLength=function(a){var b,c,d,e=b=b=0,f=new THREE.Vector3,g=new THREE.Vector3,h=[],k=0;h[0]=0;a||(a=100);c=this.points.length*a;f.copy(this.points[0]);for(a=1;a<c;a++)b=
a/c,d=this.getPoint(b),g.copy(d),k+=g.distanceTo(f),f.copy(d),b*=this.points.length-1,b=Math.floor(b),b!=e&&(h[b]=k,e=b);h[h.length]=k;return{chunks:h,total:k}};this.reparametrizeByArcLength=function(a){var b,c,d,e,f,g,h=[],k=new THREE.Vector3,l=this.getLength();h.push(k.copy(this.points[0]).clone());for(b=1;b<this.points.length;b++){c=l.chunks[b]-l.chunks[b-1];g=Math.ceil(a*c/l.total);e=(b-1)/(this.points.length-1);f=b/(this.points.length-1);for(c=1;c<g-1;c++)d=e+1/g*c*(f-e),d=this.getPoint(d),h.push(k.copy(d).clone());
h.push(k.copy(this.points[b]).clone())}this.points=h}};THREE.Triangle=function(a,b,c){this.a=void 0!==a?a:new THREE.Vector3;this.b=void 0!==b?b:new THREE.Vector3;this.c=void 0!==c?c:new THREE.Vector3};THREE.Triangle.normal=function(){var a=new THREE.Vector3;return function(b,c,d,e){e=e||new THREE.Vector3;e.subVectors(d,c);a.subVectors(b,c);e.cross(a);b=e.lengthSq();return 0<b?e.multiplyScalar(1/Math.sqrt(b)):e.set(0,0,0)}}();
THREE.Triangle.barycoordFromPoint=function(){var a=new THREE.Vector3,b=new THREE.Vector3,c=new THREE.Vector3;return function(d,e,f,g,h){a.subVectors(g,e);b.subVectors(f,e);c.subVectors(d,e);d=a.dot(a);e=a.dot(b);f=a.dot(c);var k=b.dot(b);g=b.dot(c);var l=d*k-e*e;h=h||new THREE.Vector3;if(0==l)return h.set(-2,-1,-1);l=1/l;k=(k*f-e*g)*l;d=(d*g-e*f)*l;return h.set(1-k-d,d,k)}}();
THREE.Triangle.containsPoint=function(){var a=new THREE.Vector3;return function(b,c,d,e){b=THREE.Triangle.barycoordFromPoint(b,c,d,e,a);return 0<=b.x&&0<=b.y&&1>=b.x+b.y}}();
THREE.Triangle.prototype={constructor:THREE.Triangle,set:function(a,b,c){this.a.copy(a);this.b.copy(b);this.c.copy(c);return this},setFromPointsAndIndices:function(a,b,c,d){this.a.copy(a[b]);this.b.copy(a[c]);this.c.copy(a[d]);return this},copy:function(a){this.a.copy(a.a);this.b.copy(a.b);this.c.copy(a.c);return this},area:function(){var a=new THREE.Vector3,b=new THREE.Vector3;return function(){a.subVectors(this.c,this.b);b.subVectors(this.a,this.b);return 0.5*a.cross(b).length()}}(),midpoint:function(a){return(a||
new THREE.Vector3).addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)},normal:function(a){return THREE.Triangle.normal(this.a,this.b,this.c,a)},plane:function(a){return(a||new THREE.Plane).setFromCoplanarPoints(this.a,this.b,this.c)},barycoordFromPoint:function(a,b){return THREE.Triangle.barycoordFromPoint(a,this.a,this.b,this.c,b)},containsPoint:function(a){return THREE.Triangle.containsPoint(a,this.a,this.b,this.c)},equals:function(a){return a.a.equals(this.a)&&a.b.equals(this.b)&&a.c.equals(this.c)},
clone:function(){return(new THREE.Triangle).copy(this)}};THREE.Vertex=function(a){console.warn("THREE.Vertex has been DEPRECATED. Use THREE.Vector3 instead.");return a};THREE.Clock=function(a){this.autoStart=void 0!==a?a:!0;this.elapsedTime=this.oldTime=this.startTime=0;this.running=!1};
THREE.Clock.prototype={constructor:THREE.Clock,start:function(){this.oldTime=this.startTime=void 0!==self.performance&&void 0!==self.performance.now?self.performance.now():Date.now();this.running=!0},stop:function(){this.getElapsedTime();this.running=!1},getElapsedTime:function(){this.getDelta();return this.elapsedTime},getDelta:function(){var a=0;this.autoStart&&!this.running&&this.start();if(this.running){var b=void 0!==self.performance&&void 0!==self.performance.now?self.performance.now():Date.now(),
a=0.001*(b-this.oldTime);this.oldTime=b;this.elapsedTime+=a}return a}};THREE.EventDispatcher=function(){};
THREE.EventDispatcher.prototype={constructor:THREE.EventDispatcher,apply:function(a){a.addEventListener=THREE.EventDispatcher.prototype.addEventListener;a.hasEventListener=THREE.EventDispatcher.prototype.hasEventListener;a.removeEventListener=THREE.EventDispatcher.prototype.removeEventListener;a.dispatchEvent=THREE.EventDispatcher.prototype.dispatchEvent},addEventListener:function(a,b){void 0===this._listeners&&(this._listeners={});var c=this._listeners;void 0===c[a]&&(c[a]=[]);-1===c[a].indexOf(b)&&
c[a].push(b)},hasEventListener:function(a,b){if(void 0===this._listeners)return!1;var c=this._listeners;return void 0!==c[a]&&-1!==c[a].indexOf(b)?!0:!1},removeEventListener:function(a,b){if(void 0!==this._listeners){var c=this._listeners[a];if(void 0!==c){var d=c.indexOf(b);-1!==d&&c.splice(d,1)}}},dispatchEvent:function(a){if(void 0!==this._listeners){var b=this._listeners[a.type];if(void 0!==b){a.target=this;for(var c=[],d=b.length,e=0;e<d;e++)c[e]=b[e];for(e=0;e<d;e++)c[e].call(this,a)}}}};(function(a){a.Raycaster=function(b,c,d,e){this.ray=new a.Ray(b,c);this.near=d||0;this.far=e||Infinity};var b=new a.Sphere,c=new a.Ray;new a.Plane;new a.Vector3;var d=new a.Vector3,e=new a.Matrix4,f=function(a,b){return a.distance-b.distance},g=new a.Vector3,h=new a.Vector3,k=new a.Vector3,l=function(f,n,s){if(f instanceof a.Sprite){d.setFromMatrixPosition(f.matrixWorld);var t=n.ray.distanceToPoint(d);if(t>f.scale.x)return s;s.push({distance:t,point:f.position,face:null,object:f})}else if(f instanceof
a.LOD)d.setFromMatrixPosition(f.matrixWorld),t=n.ray.origin.distanceTo(d),l(f.getObjectForDistance(t),n,s);else if(f instanceof a.Mesh){var r=f.geometry;null===r.boundingSphere&&r.computeBoundingSphere();b.copy(r.boundingSphere);b.applyMatrix4(f.matrixWorld);if(!1===n.ray.isIntersectionSphere(b))return s;e.getInverse(f.matrixWorld);c.copy(n.ray).applyMatrix4(e);if(null!==r.boundingBox&&!1===c.isIntersectionBox(r.boundingBox))return s;if(r instanceof a.BufferGeometry){var v=f.material;if(void 0===
v)return s;var w=r.attributes,u,y,L=n.precision;if(void 0!==w.index){var x=w.index.array,N=w.position.array,J=r.offsets;0===J.length&&(J=[{start:0,count:N.length,index:0}]);for(var B=0,K=J.length;B<K;++B)for(var w=J[B].start,A=J[B].index,r=w,G=w+J[B].count;r<G;r+=3){w=A+x[r];u=A+x[r+1];y=A+x[r+2];g.set(N[3*w],N[3*w+1],N[3*w+2]);h.set(N[3*u],N[3*u+1],N[3*u+2]);k.set(N[3*y],N[3*y+1],N[3*y+2]);var D=v.side===a.BackSide?c.intersectTriangle(k,h,g,!0):c.intersectTriangle(g,h,k,v.side!==a.DoubleSide);null!==
D&&(D.applyMatrix4(f.matrixWorld),t=n.ray.origin.distanceTo(D),t<L||t<n.near||t>n.far||s.push({distance:t,point:D,indices:[w,u,y],face:null,faceIndex:null,object:f}))}}else for(N=w.position.array,r=0,G=w.position.array.length;r<G;r+=3)w=r,u=r+1,y=r+2,g.set(N[3*w],N[3*w+1],N[3*w+2]),h.set(N[3*u],N[3*u+1],N[3*u+2]),k.set(N[3*y],N[3*y+1],N[3*y+2]),D=v.side===a.BackSide?c.intersectTriangle(k,h,g,!0):c.intersectTriangle(g,h,k,v.side!==a.DoubleSide),null!==D&&(D.applyMatrix4(f.matrixWorld),t=n.ray.origin.distanceTo(D),
t<L||t<n.near||t>n.far||s.push({distance:t,point:D,indices:[w,u,y],face:null,faceIndex:null,object:f}))}else if(r instanceof a.Geometry)for(N=f.material instanceof a.MeshFaceMaterial,J=!0===N?f.material.materials:null,L=n.precision,x=r.vertices,B=0,K=r.faces.length;B<K;B++)if(A=r.faces[B],v=!0===N?J[A.materialIndex]:f.material,void 0!==v){w=x[A.a];u=x[A.b];y=x[A.c];if(!0===v.morphTargets){t=r.morphTargets;D=f.morphTargetInfluences;g.set(0,0,0);h.set(0,0,0);k.set(0,0,0);for(var G=0,C=t.length;G<C;G++){var F=
D[G];if(0!==F){var z=t[G].vertices;g.x+=(z[A.a].x-w.x)*F;g.y+=(z[A.a].y-w.y)*F;g.z+=(z[A.a].z-w.z)*F;h.x+=(z[A.b].x-u.x)*F;h.y+=(z[A.b].y-u.y)*F;h.z+=(z[A.b].z-u.z)*F;k.x+=(z[A.c].x-y.x)*F;k.y+=(z[A.c].y-y.y)*F;k.z+=(z[A.c].z-y.z)*F}}g.add(w);h.add(u);k.add(y);w=g;u=h;y=k}D=v.side===a.BackSide?c.intersectTriangle(y,u,w,!0):c.intersectTriangle(w,u,y,v.side!==a.DoubleSide);null!==D&&(D.applyMatrix4(f.matrixWorld),t=n.ray.origin.distanceTo(D),t<L||t<n.near||t>n.far||s.push({distance:t,point:D,face:A,
faceIndex:B,object:f}))}}else if(f instanceof a.Line){L=n.linePrecision;v=L*L;r=f.geometry;null===r.boundingSphere&&r.computeBoundingSphere();b.copy(r.boundingSphere);b.applyMatrix4(f.matrixWorld);if(!1===n.ray.isIntersectionSphere(b))return s;e.getInverse(f.matrixWorld);c.copy(n.ray).applyMatrix4(e);if(r instanceof a.Geometry)for(x=r.vertices,L=x.length,w=new a.Vector3,u=new a.Vector3,y=f.type===a.LineStrip?1:2,r=0;r<L-1;r+=y)c.distanceSqToSegment(x[r],x[r+1],u,w)>v||(t=c.origin.distanceTo(u),t<
n.near||t>n.far||s.push({distance:t,point:w.clone().applyMatrix4(f.matrixWorld),face:null,faceIndex:null,object:f}))}},n=function(a,b,c){a=a.getDescendants();for(var d=0,e=a.length;d<e;d++)l(a[d],b,c)};a.Raycaster.prototype.precision=1E-4;a.Raycaster.prototype.linePrecision=1;a.Raycaster.prototype.set=function(a,b){this.ray.set(a,b)};a.Raycaster.prototype.intersectObject=function(a,b){var c=[];!0===b&&n(a,this,c);l(a,this,c);c.sort(f);return c};a.Raycaster.prototype.intersectObjects=function(a,b){for(var c=
[],d=0,e=a.length;d<e;d++)l(a[d],this,c),!0===b&&n(a[d],this,c);c.sort(f);return c}})(THREE);THREE.Object3D=function(){this.id=THREE.Object3DIdCount++;this.uuid=THREE.Math.generateUUID();this.name="";this.parent=void 0;this.children=[];this.up=new THREE.Vector3(0,1,0);this.position=new THREE.Vector3;var a=this;Object.defineProperties(this,{rotation:{enumerable:!0,value:(new THREE.Euler).onChange(function(){a.quaternion.setFromEuler(a.rotation,!1)})},quaternion:{enumerable:!0,value:(new THREE.Quaternion).onChange(function(){a.rotation.setFromQuaternion(a.quaternion,void 0,!1)})},scale:{enumerable:!0,
value:new THREE.Vector3(1,1,1)}});this.renderDepth=null;this.rotationAutoUpdate=!0;this.matrix=new THREE.Matrix4;this.matrixWorld=new THREE.Matrix4;this.matrixAutoUpdate=!0;this.matrixWorldNeedsUpdate=!1;this.visible=!0;this.receiveShadow=this.castShadow=!1;this.frustumCulled=!0;this.userData={}};
THREE.Object3D.prototype={constructor:THREE.Object3D,get eulerOrder(){console.warn("DEPRECATED: Object3D's .eulerOrder has been moved to Object3D's .rotation.order.");return this.rotation.order},set eulerOrder(a){console.warn("DEPRECATED: Object3D's .eulerOrder has been moved to Object3D's .rotation.order.");this.rotation.order=a},get useQuaternion(){console.warn("DEPRECATED: Object3D's .useQuaternion has been removed. The library now uses quaternions by default.")},set useQuaternion(a){console.warn("DEPRECATED: Object3D's .useQuaternion has been removed. The library now uses quaternions by default.")},
applyMatrix:function(a){this.matrix.multiplyMatrices(a,this.matrix);this.matrix.decompose(this.position,this.quaternion,this.scale)},setRotationFromAxisAngle:function(a,b){this.quaternion.setFromAxisAngle(a,b)},setRotationFromEuler:function(a){this.quaternion.setFromEuler(a,!0)},setRotationFromMatrix:function(a){this.quaternion.setFromRotationMatrix(a)},setRotationFromQuaternion:function(a){this.quaternion.copy(a)},rotateOnAxis:function(){var a=new THREE.Quaternion;return function(b,c){a.setFromAxisAngle(b,
c);this.quaternion.multiply(a);return this}}(),rotateX:function(){var a=new THREE.Vector3(1,0,0);return function(b){return this.rotateOnAxis(a,b)}}(),rotateY:function(){var a=new THREE.Vector3(0,1,0);return function(b){return this.rotateOnAxis(a,b)}}(),rotateZ:function(){var a=new THREE.Vector3(0,0,1);return function(b){return this.rotateOnAxis(a,b)}}(),translateOnAxis:function(){var a=new THREE.Vector3;return function(b,c){a.copy(b);a.applyQuaternion(this.quaternion);this.position.add(a.multiplyScalar(c));
return this}}(),translate:function(a,b){console.warn("DEPRECATED: Object3D's .translate() has been removed. Use .translateOnAxis( axis, distance ) instead. Note args have been changed.");return this.translateOnAxis(b,a)},translateX:function(){var a=new THREE.Vector3(1,0,0);return function(b){return this.translateOnAxis(a,b)}}(),translateY:function(){var a=new THREE.Vector3(0,1,0);return function(b){return this.translateOnAxis(a,b)}}(),translateZ:function(){var a=new THREE.Vector3(0,0,1);return function(b){return this.translateOnAxis(a,
b)}}(),localToWorld:function(a){return a.applyMatrix4(this.matrixWorld)},worldToLocal:function(){var a=new THREE.Matrix4;return function(b){return b.applyMatrix4(a.getInverse(this.matrixWorld))}}(),lookAt:function(){var a=new THREE.Matrix4;return function(b){a.lookAt(b,this.position,this.up);this.quaternion.setFromRotationMatrix(a)}}(),add:function(a){if(a===this)console.warn("THREE.Object3D.add: An object can't be added as a child of itself.");else if(a instanceof THREE.Object3D){void 0!==a.parent&&
a.parent.remove(a);a.parent=this;a.dispatchEvent({type:"added"});this.children.push(a);for(var b=this;void 0!==b.parent;)b=b.parent;void 0!==b&&b instanceof THREE.Scene&&b.__addObject(a)}},remove:function(a){var b=this.children.indexOf(a);if(-1!==b){a.parent=void 0;a.dispatchEvent({type:"removed"});this.children.splice(b,1);for(b=this;void 0!==b.parent;)b=b.parent;void 0!==b&&b instanceof THREE.Scene&&b.__removeObject(a)}},traverse:function(a){a(this);for(var b=0,c=this.children.length;b<c;b++)this.children[b].traverse(a)},
getObjectById:function(a,b){for(var c=0,d=this.children.length;c<d;c++){var e=this.children[c];if(e.id===a||!0===b&&(e=e.getObjectById(a,b),void 0!==e))return e}},getObjectByName:function(a,b){for(var c=0,d=this.children.length;c<d;c++){var e=this.children[c];if(e.name===a||!0===b&&(e=e.getObjectByName(a,b),void 0!==e))return e}},getChildByName:function(a,b){console.warn("DEPRECATED: Object3D's .getChildByName() has been renamed to .getObjectByName().");return this.getObjectByName(a,b)},getDescendants:function(a){void 0===
a&&(a=[]);Array.prototype.push.apply(a,this.children);for(var b=0,c=this.children.length;b<c;b++)this.children[b].getDescendants(a);return a},updateMatrix:function(){this.matrix.compose(this.position,this.quaternion,this.scale);this.matrixWorldNeedsUpdate=!0},updateMatrixWorld:function(a){!0===this.matrixAutoUpdate&&this.updateMatrix();if(!0===this.matrixWorldNeedsUpdate||!0===a)void 0===this.parent?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),
this.matrixWorldNeedsUpdate=!1,a=!0;for(var b=0,c=this.children.length;b<c;b++)this.children[b].updateMatrixWorld(a)},clone:function(a,b){void 0===a&&(a=new THREE.Object3D);void 0===b&&(b=!0);a.name=this.name;a.up.copy(this.up);a.position.copy(this.position);a.quaternion.copy(this.quaternion);a.scale.copy(this.scale);a.renderDepth=this.renderDepth;a.rotationAutoUpdate=this.rotationAutoUpdate;a.matrix.copy(this.matrix);a.matrixWorld.copy(this.matrixWorld);a.matrixAutoUpdate=this.matrixAutoUpdate;a.matrixWorldNeedsUpdate=
this.matrixWorldNeedsUpdate;a.visible=this.visible;a.castShadow=this.castShadow;a.receiveShadow=this.receiveShadow;a.frustumCulled=this.frustumCulled;a.userData=JSON.parse(JSON.stringify(this.userData));if(!0===b)for(var c=0;c<this.children.length;c++)a.add(this.children[c].clone());return a}};THREE.EventDispatcher.prototype.apply(THREE.Object3D.prototype);THREE.Object3DIdCount=0;THREE.Projector=function(){function a(){if(n===p){var a=new THREE.RenderableVertex;q.push(a);p++;n++;return a}return q[n++]}function b(){if(t===v){var a=new THREE.RenderableFace;r.push(a);v++;t++;return a}return r[t++]}function c(){if(u===L){var a=new THREE.RenderableLine;y.push(a);L++;u++;return a}return y[u++]}function d(a,b){return a.z!==b.z?b.z-a.z:a.id!==b.id?a.id-b.id:0}function e(a,b){var c=0,d=1,e=a.z+a.w,f=b.z+b.w,g=-a.z+a.w,h=-b.z+b.w;if(0<=e&&0<=f&&0<=g&&0<=h)return!0;if(0>e&&0>f||0>g&&
0>h)return!1;0>e?c=Math.max(c,e/(e-f)):0>f&&(d=Math.min(d,e/(e-f)));0>g?c=Math.max(c,g/(g-h)):0>h&&(d=Math.min(d,g/(g-h)));if(d<c)return!1;a.lerp(b,c);b.lerp(a,1-d);return!0}var f,g,h=[],k=0,l,n,q=[],p=0,s,t,r=[],v=0,w,u,y=[],L=0,x,N,J=[],B=0,K={objects:[],lights:[],elements:[]},A=new THREE.Vector3,G=new THREE.Vector3,D=new THREE.Vector3,C=new THREE.Vector3,F=new THREE.Vector4,z=new THREE.Box3(new THREE.Vector3(-1,-1,-1),new THREE.Vector3(1,1,1)),H=new THREE.Box3,E=Array(3),Q=new THREE.Matrix4,Y=
new THREE.Matrix4,U,la=new THREE.Matrix4,W=new THREE.Matrix3,R=new THREE.Frustum,I=new THREE.Vector4,da=new THREE.Vector4;this.projectVector=function(a,b){b.matrixWorldInverse.getInverse(b.matrixWorld);Y.multiplyMatrices(b.projectionMatrix,b.matrixWorldInverse);return a.applyProjection(Y)};this.unprojectVector=function(){var a=new THREE.Matrix4;return function(b,c){a.getInverse(c.projectionMatrix);Y.multiplyMatrices(c.matrixWorld,a);return b.applyProjection(Y)}}();this.pickingRay=function(a,b){a.z=
-1;var c=new THREE.Vector3(a.x,a.y,1);this.unprojectVector(a,b);this.unprojectVector(c,b);c.sub(a).normalize();return new THREE.Raycaster(a,c)};var V=function(a){if(!1!==a.visible){if(a instanceof THREE.Light)K.lights.push(a);else if(a instanceof THREE.Mesh||a instanceof THREE.Line||a instanceof THREE.Sprite)if(!1===a.frustumCulled||!0===R.intersectsObject(a)){if(g===k){var b=new THREE.RenderableObject;h.push(b);k++;g++;f=b}else f=h[g++];f.id=a.id;f.object=a;null!==a.renderDepth?f.z=a.renderDepth:
(C.setFromMatrixPosition(a.matrixWorld),C.applyProjection(Y),f.z=C.z);K.objects.push(f)}for(var b=0,c=a.children.length;b<c;b++)V(a.children[b])}},X=new function(){var d=[],e=[],f=null,g=null,h=new THREE.Matrix3,k=function(a){var b=a.positionWorld,c=a.positionScreen;b.copy(a.position).applyMatrix4(U);c.copy(b).applyMatrix4(Y);b=1/c.w;c.x*=b;c.y*=b;c.z*=b;a.visible=-1<=c.x&&1>=c.x&&-1<=c.y&&1>=c.y&&-1<=c.z&&1>=c.z},n=function(a,b,c){if(!0===a.visible||!0===b.visible||!0===c.visible)return!0;E[0]=a.positionScreen;
E[1]=b.positionScreen;E[2]=c.positionScreen;return z.isIntersectionBox(H.setFromPoints(E))},r=function(a,b,c){return 0>(c.positionScreen.x-a.positionScreen.x)*(b.positionScreen.y-a.positionScreen.y)-(c.positionScreen.y-a.positionScreen.y)*(b.positionScreen.x-a.positionScreen.x)};return{setObject:function(a){f=a;g=f.material;h.getNormalMatrix(f.matrixWorld);d.length=0;e.length=0},projectVertex:k,checkTriangleVisibility:n,checkBackfaceCulling:r,pushVertex:function(b,c,d){l=a();l.position.set(b,c,d);
k(l)},pushNormal:function(a,b,c){d.push(a,b,c)},pushUv:function(a,b){e.push(a,b)},pushLine:function(a,b){var d=q[a],e=q[b];w=c();w.id=f.id;w.v1.copy(d);w.v2.copy(e);w.z=(d.positionScreen.z+e.positionScreen.z)/2;w.material=f.material;K.elements.push(w)},pushTriangle:function(a,c,k){var l=q[a],p=q[c],t=q[k];if(!1!==n(l,p,t)&&(g.side===THREE.DoubleSide||!0===r(l,p,t))){s=b();s.id=f.id;s.v1.copy(l);s.v2.copy(p);s.v3.copy(t);s.z=(l.positionScreen.z+p.positionScreen.z+t.positionScreen.z)/3;for(l=0;3>l;l++)p=
3*arguments[l],t=s.vertexNormalsModel[l],t.set(d[p],d[p+1],d[p+2]),t.applyMatrix3(h).normalize(),p=2*arguments[l],s.uvs[l].set(e[p],e[p+1]);s.vertexNormalsLength=3;s.material=f.material;K.elements.push(s)}}}};this.projectScene=function(f,h,k,l){var r,p,v,y,L,C,z,E;N=u=t=0;K.elements.length=0;!0===f.autoUpdate&&f.updateMatrixWorld();void 0===h.parent&&h.updateMatrixWorld();Q.copy(h.matrixWorldInverse.getInverse(h.matrixWorld));Y.multiplyMatrices(h.projectionMatrix,Q);R.setFromMatrix(Y);g=0;K.objects.length=
0;K.lights.length=0;V(f);!0===k&&K.objects.sort(d);f=0;for(k=K.objects.length;f<k;f++)if(r=K.objects[f].object,p=r.geometry,X.setObject(r),U=r.matrixWorld,n=0,r instanceof THREE.Mesh)if(p instanceof THREE.BufferGeometry){if(C=p.attributes,r=p.offsets,void 0!==C.position){z=C.position.array;p=0;for(y=z.length;p<y;p+=3)X.pushVertex(z[p],z[p+1],z[p+2]);if(void 0!==C.normal)for(E=C.normal.array,p=0,y=E.length;p<y;p+=3)X.pushNormal(E[p],E[p+1],E[p+2]);if(void 0!==C.uv)for(E=C.uv.array,p=0,y=E.length;p<
y;p+=2)X.pushUv(E[p],E[p+1]);if(void 0!==C.index)if(C=C.index.array,0<r.length)for(f=0;f<r.length;f++)for(y=r[f],z=y.index,p=y.start,y=y.start+y.count;p<y;p+=3)X.pushTriangle(C[p]+z,C[p+1]+z,C[p+2]+z);else for(p=0,y=C.length;p<y;p+=3)X.pushTriangle(C[p],C[p+1],C[p+2]);else for(p=0,y=z.length/3;p<y;p+=3)X.pushTriangle(p,p+1,p+2)}}else{if(p instanceof THREE.Geometry){v=p.vertices;y=p.faces;C=p.faceVertexUvs[0];W.getNormalMatrix(U);z=r.material instanceof THREE.MeshFaceMaterial;E=!0===z?r.material:null;
for(var H=0,Fa=v.length;H<Fa;H++){var ia=v[H];X.pushVertex(ia.x,ia.y,ia.z)}H=0;for(Fa=y.length;H<Fa;H++){v=y[H];var ma=!0===z?E.materials[v.materialIndex]:r.material;if(void 0!==ma){var ya=ma.side,ia=q[v.a],Z=q[v.b],qa=q[v.c];if(!0===ma.morphTargets){L=p.morphTargets;var ua=r.morphTargetInfluences,Ca=ia.position,va=Z.position,Da=qa.position;A.set(0,0,0);G.set(0,0,0);D.set(0,0,0);for(var Ja=0,ja=L.length;Ja<ja;Ja++){var ra=ua[Ja];if(0!==ra){var Ka=L[Ja].vertices;A.x+=(Ka[v.a].x-Ca.x)*ra;A.y+=(Ka[v.a].y-
Ca.y)*ra;A.z+=(Ka[v.a].z-Ca.z)*ra;G.x+=(Ka[v.b].x-va.x)*ra;G.y+=(Ka[v.b].y-va.y)*ra;G.z+=(Ka[v.b].z-va.z)*ra;D.x+=(Ka[v.c].x-Da.x)*ra;D.y+=(Ka[v.c].y-Da.y)*ra;D.z+=(Ka[v.c].z-Da.z)*ra}}ia.position.add(A);Z.position.add(G);qa.position.add(D);X.projectVertex(ia);X.projectVertex(Z);X.projectVertex(qa)}if(!1!==X.checkTriangleVisibility(ia,Z,qa)){ua=X.checkBackfaceCulling(ia,Z,qa);if(ya!==THREE.DoubleSide){if(ya===THREE.FrontSide&&!1===ua)continue;if(ya===THREE.BackSide&&!0===ua)continue}s=b();s.id=r.id;
s.v1.copy(ia);s.v2.copy(Z);s.v3.copy(qa);s.normalModel.copy(v.normal);!1!==ua||ya!==THREE.BackSide&&ya!==THREE.DoubleSide||s.normalModel.negate();s.normalModel.applyMatrix3(W).normalize();L=v.vertexNormals;Ca=0;for(va=Math.min(L.length,3);Ca<va;Ca++)Da=s.vertexNormalsModel[Ca],Da.copy(L[Ca]),!1!==ua||ya!==THREE.BackSide&&ya!==THREE.DoubleSide||Da.negate(),Da.applyMatrix3(W).normalize();s.vertexNormalsLength=L.length;ya=C[H];if(void 0!==ya)for(L=0;3>L;L++)s.uvs[L].copy(ya[L]);s.color=v.color;s.material=
ma;s.z=(ia.positionScreen.z+Z.positionScreen.z+qa.positionScreen.z)/3;K.elements.push(s)}}}}}else if(r instanceof THREE.Line)if(p instanceof THREE.BufferGeometry){if(C=p.attributes,void 0!==C.position){z=C.position.array;p=0;for(y=z.length;p<y;p+=3)X.pushVertex(z[p],z[p+1],z[p+2]);if(void 0!==C.index)for(C=C.index.array,p=0,y=C.length;p<y;p+=2)X.pushLine(C[p],C[p+1]);else for(p=0,y=z.length/3-1;p<y;p++)X.pushLine(p,p+1)}}else{if(p instanceof THREE.Geometry&&(la.multiplyMatrices(Y,U),v=r.geometry.vertices,
0!==v.length))for(ia=a(),ia.positionScreen.copy(v[0]).applyMatrix4(la),p=r.type===THREE.LinePieces?2:1,H=1,Fa=v.length;H<Fa;H++)ia=a(),ia.positionScreen.copy(v[H]).applyMatrix4(la),0<(H+1)%p||(Z=q[n-2],I.copy(ia.positionScreen),da.copy(Z.positionScreen),!0===e(I,da)&&(I.multiplyScalar(1/I.w),da.multiplyScalar(1/da.w),w=c(),w.id=r.id,w.v1.positionScreen.copy(I),w.v2.positionScreen.copy(da),w.z=Math.max(I.z,da.z),w.material=r.material,r.material.vertexColors===THREE.VertexColors&&(w.vertexColors[0].copy(r.geometry.colors[H]),
w.vertexColors[1].copy(r.geometry.colors[H-1])),K.elements.push(w)))}else r instanceof THREE.Sprite&&(F.set(U.elements[12],U.elements[13],U.elements[14],1),F.applyMatrix4(Y),p=1/F.w,F.z*=p,-1<=F.z&&1>=F.z&&(N===B?(y=new THREE.RenderableSprite,J.push(y),B++,N++,x=y):x=J[N++],x.id=r.id,x.x=F.x*p,x.y=F.y*p,x.z=F.z,x.object=r,x.rotation=r.rotation,x.scale.x=r.scale.x*Math.abs(x.x-(F.x+h.projectionMatrix.elements[0])/(F.w+h.projectionMatrix.elements[12])),x.scale.y=r.scale.y*Math.abs(x.y-(F.y+h.projectionMatrix.elements[5])/
(F.w+h.projectionMatrix.elements[13])),x.material=r.material,K.elements.push(x)));!0===l&&K.elements.sort(d);return K}};THREE.Face3=function(a,b,c,d,e,f){this.a=a;this.b=b;this.c=c;this.normal=d instanceof THREE.Vector3?d:new THREE.Vector3;this.vertexNormals=d instanceof Array?d:[];this.color=e instanceof THREE.Color?e:new THREE.Color;this.vertexColors=e instanceof Array?e:[];this.vertexTangents=[];this.materialIndex=void 0!==f?f:0};
THREE.Face3.prototype={constructor:THREE.Face3,clone:function(){var a=new THREE.Face3(this.a,this.b,this.c);a.normal.copy(this.normal);a.color.copy(this.color);a.materialIndex=this.materialIndex;var b,c;b=0;for(c=this.vertexNormals.length;b<c;b++)a.vertexNormals[b]=this.vertexNormals[b].clone();b=0;for(c=this.vertexColors.length;b<c;b++)a.vertexColors[b]=this.vertexColors[b].clone();b=0;for(c=this.vertexTangents.length;b<c;b++)a.vertexTangents[b]=this.vertexTangents[b].clone();return a}};THREE.Face4=function(a,b,c,d,e,f,g){console.warn("THREE.Face4 has been removed. A THREE.Face3 will be created instead.");return new THREE.Face3(a,b,c,e,f,g)};THREE.BufferAttribute=function(){};
THREE.BufferAttribute.prototype={constructor:THREE.BufferAttribute,get length(){return this.array.length},set:function(a){this.array.set(a)},setX:function(a,b){this.array[a*this.itemSize]=b},setY:function(a,b){this.array[a*this.itemSize+1]=b},setZ:function(a,b){this.array[a*this.itemSize+2]=b},setXY:function(a,b,c){a*=this.itemSize;this.array[a]=b;this.array[a+1]=c},setXYZ:function(a,b,c,d){a*=this.itemSize;this.array[a]=b;this.array[a+1]=c;this.array[a+2]=d},setXYZW:function(a,b,c,d,e){a*=this.itemSize;
this.array[a]=b;this.array[a+1]=c;this.array[a+2]=d;this.array[a+3]=e}};THREE.Int8Attribute=function(a,b){this.array=new Int8Array(a*b);this.itemSize=b};THREE.Int8Attribute.prototype=Object.create(THREE.BufferAttribute.prototype);THREE.Uint8Attribute=function(a,b){this.array=new Uint8Array(a*b);this.itemSize=b};THREE.Uint8Attribute.prototype=Object.create(THREE.BufferAttribute.prototype);THREE.Uint8ClampedAttribute=function(a,b){this.array=new Uint8ClampedArray(a*b);this.itemSize=b};
THREE.Uint8ClampedAttribute.prototype=Object.create(THREE.BufferAttribute.prototype);THREE.Int16Attribute=function(a,b){this.array=new Int16Array(a*b);this.itemSize=b};THREE.Int16Attribute.prototype=Object.create(THREE.BufferAttribute.prototype);THREE.Uint16Attribute=function(a,b){this.array=new Uint16Array(a*b);this.itemSize=b};THREE.Uint16Attribute.prototype=Object.create(THREE.BufferAttribute.prototype);THREE.Int32Attribute=function(a,b){this.array=new Int32Array(a*b);this.itemSize=b};
THREE.Int32Attribute.prototype=Object.create(THREE.BufferAttribute.prototype);THREE.Uint32Attribute=function(a,b){this.array=new Uint32Array(a*b);this.itemSize=b};THREE.Uint32Attribute.prototype=Object.create(THREE.BufferAttribute.prototype);THREE.Float32Attribute=function(a,b){this.array=new Float32Array(a*b);this.itemSize=b};THREE.Float32Attribute.prototype=Object.create(THREE.BufferAttribute.prototype);THREE.Float64Attribute=function(a,b){this.array=new Float64Array(a*b);this.itemSize=b};
THREE.Float64Attribute.prototype=Object.create(THREE.BufferAttribute.prototype);THREE.BufferGeometry=function(){this.id=THREE.GeometryIdCount++;this.uuid=THREE.Math.generateUUID();this.name="";this.attributes={};this.offsets=this.drawcalls=[];this.boundingSphere=this.boundingBox=null};
THREE.BufferGeometry.prototype={constructor:THREE.BufferGeometry,addAttribute:function(a,b,c){!1===b instanceof THREE.BufferAttribute?(console.warn("DEPRECATED: BufferGeometry's addAttribute() now expects ( name, attribute )."),this.attributes[a]={array:b,itemSize:c}):this.attributes[a]=b},getAttribute:function(a){return this.attributes[a]},addDrawCall:function(a,b,c){this.drawcalls.push({start:a,count:b,index:void 0!==c?c:0})},applyMatrix:function(a){var b=this.attributes.position;void 0!==b&&(a.applyToVector3Array(b.array),
b.needsUpdate=!0);b=this.attributes.normal;void 0!==b&&((new THREE.Matrix3).getNormalMatrix(a).applyToVector3Array(b.array),b.needsUpdate=!0)},computeBoundingBox:function(){null===this.boundingBox&&(this.boundingBox=new THREE.Box3);var a=this.attributes.position.array;if(a){var b=this.boundingBox;3<=a.length&&(b.min.x=b.max.x=a[0],b.min.y=b.max.y=a[1],b.min.z=b.max.z=a[2]);for(var c=3,d=a.length;c<d;c+=3){var e=a[c],f=a[c+1],g=a[c+2];e<b.min.x?b.min.x=e:e>b.max.x&&(b.max.x=e);f<b.min.y?b.min.y=f:
f>b.max.y&&(b.max.y=f);g<b.min.z?b.min.z=g:g>b.max.z&&(b.max.z=g)}}if(void 0===a||0===a.length)this.boundingBox.min.set(0,0,0),this.boundingBox.max.set(0,0,0)},computeBoundingSphere:function(){var a=new THREE.Box3,b=new THREE.Vector3;return function(){null===this.boundingSphere&&(this.boundingSphere=new THREE.Sphere);var c=this.attributes.position.array;if(c){a.makeEmpty();for(var d=this.boundingSphere.center,e=0,f=c.length;e<f;e+=3)b.set(c[e],c[e+1],c[e+2]),a.addPoint(b);a.center(d);for(var g=0,
e=0,f=c.length;e<f;e+=3)b.set(c[e],c[e+1],c[e+2]),g=Math.max(g,d.distanceToSquared(b));this.boundingSphere.radius=Math.sqrt(g)}}}(),computeFaceNormals:function(){},computeVertexNormals:function(){if(this.attributes.position){var a,b,c,d;a=this.attributes.position.array.length;if(void 0===this.attributes.normal)this.attributes.normal={itemSize:3,array:new Float32Array(a)};else for(a=0,b=this.attributes.normal.array.length;a<b;a++)this.attributes.normal.array[a]=0;var e=this.attributes.position.array,
f=this.attributes.normal.array,g,h,k,l,n,q,p=new THREE.Vector3,s=new THREE.Vector3,t=new THREE.Vector3,r=new THREE.Vector3,v=new THREE.Vector3;if(this.attributes.index){var w=this.attributes.index.array,u=0<this.offsets.length?this.offsets:[{start:0,count:w.length,index:0}];c=0;for(d=u.length;c<d;++c){b=u[c].start;g=u[c].count;var y=u[c].index;a=b;for(b+=g;a<b;a+=3)g=y+w[a],h=y+w[a+1],k=y+w[a+2],l=e[3*g],n=e[3*g+1],q=e[3*g+2],p.set(l,n,q),l=e[3*h],n=e[3*h+1],q=e[3*h+2],s.set(l,n,q),l=e[3*k],n=e[3*
k+1],q=e[3*k+2],t.set(l,n,q),r.subVectors(t,s),v.subVectors(p,s),r.cross(v),f[3*g]+=r.x,f[3*g+1]+=r.y,f[3*g+2]+=r.z,f[3*h]+=r.x,f[3*h+1]+=r.y,f[3*h+2]+=r.z,f[3*k]+=r.x,f[3*k+1]+=r.y,f[3*k+2]+=r.z}}else for(a=0,b=e.length;a<b;a+=9)l=e[a],n=e[a+1],q=e[a+2],p.set(l,n,q),l=e[a+3],n=e[a+4],q=e[a+5],s.set(l,n,q),l=e[a+6],n=e[a+7],q=e[a+8],t.set(l,n,q),r.subVectors(t,s),v.subVectors(p,s),r.cross(v),f[a]=r.x,f[a+1]=r.y,f[a+2]=r.z,f[a+3]=r.x,f[a+4]=r.y,f[a+5]=r.z,f[a+6]=r.x,f[a+7]=r.y,f[a+8]=r.z;this.normalizeNormals();
this.normalsNeedUpdate=!0}},computeTangents:function(){function a(a,b,c){q=d[3*a];p=d[3*a+1];s=d[3*a+2];t=d[3*b];r=d[3*b+1];v=d[3*b+2];w=d[3*c];u=d[3*c+1];y=d[3*c+2];L=f[2*a];x=f[2*a+1];N=f[2*b];J=f[2*b+1];B=f[2*c];K=f[2*c+1];A=t-q;G=w-q;D=r-p;C=u-p;F=v-s;z=y-s;H=N-L;E=B-L;Q=J-x;Y=K-x;U=1/(H*Y-E*Q);la.set((Y*A-Q*G)*U,(Y*D-Q*C)*U,(Y*F-Q*z)*U);W.set((H*G-E*A)*U,(H*C-E*D)*U,(H*z-E*F)*U);k[a].add(la);k[b].add(la);k[c].add(la);l[a].add(W);l[b].add(W);l[c].add(W)}function b(a){fa.x=e[3*a];fa.y=e[3*a+1];
fa.z=e[3*a+2];za.copy(fa);Ea=k[a];wa.copy(Ea);wa.sub(fa.multiplyScalar(fa.dot(Ea))).normalize();Ha.crossVectors(za,Ea);Ga=Ha.dot(l[a]);Ia=0>Ga?-1:1;h[4*a]=wa.x;h[4*a+1]=wa.y;h[4*a+2]=wa.z;h[4*a+3]=Ia}if(void 0===this.attributes.index||void 0===this.attributes.position||void 0===this.attributes.normal||void 0===this.attributes.uv)console.warn("Missing required attributes (index, position, normal or uv) in BufferGeometry.computeTangents()");else{var c=this.attributes.index.array,d=this.attributes.position.array,
e=this.attributes.normal.array,f=this.attributes.uv.array,g=d.length/3;void 0===this.attributes.tangent&&(this.attributes.tangent={itemSize:4,array:new Float32Array(4*g)});for(var h=this.attributes.tangent.array,k=[],l=[],n=0;n<g;n++)k[n]=new THREE.Vector3,l[n]=new THREE.Vector3;var q,p,s,t,r,v,w,u,y,L,x,N,J,B,K,A,G,D,C,F,z,H,E,Q,Y,U,la=new THREE.Vector3,W=new THREE.Vector3,R,I,da,V,X,P=this.offsets,n=0;for(I=P.length;n<I;++n){R=P[n].start;da=P[n].count;var ga=P[n].index,g=R;for(R+=da;g<R;g+=3)da=
ga+c[g],V=ga+c[g+1],X=ga+c[g+2],a(da,V,X)}var wa=new THREE.Vector3,Ha=new THREE.Vector3,fa=new THREE.Vector3,za=new THREE.Vector3,Ia,Ea,Ga,n=0;for(I=P.length;n<I;++n)for(R=P[n].start,da=P[n].count,ga=P[n].index,g=R,R+=da;g<R;g+=3)da=ga+c[g],V=ga+c[g+1],X=ga+c[g+2],b(da),b(V),b(X)}},computeOffsets:function(a){var b=a;void 0===a&&(b=65535);Date.now();a=this.attributes.index.array;for(var c=this.attributes.position.array,d=a.length/3,e=new Uint16Array(a.length),f=0,g=0,h=[{start:0,count:0,index:0}],
k=h[0],l=0,n=0,q=new Int32Array(6),p=new Int32Array(c.length),s=new Int32Array(c.length),t=0;t<c.length;t++)p[t]=-1,s[t]=-1;for(c=0;c<d;c++){for(var r=n=0;3>r;r++)t=a[3*c+r],-1==p[t]?(q[2*r]=t,q[2*r+1]=-1,n++):p[t]<k.index?(q[2*r]=t,q[2*r+1]=-1,l++):(q[2*r]=t,q[2*r+1]=p[t]);if(g+n>k.index+b)for(k={start:f,count:0,index:g},h.push(k),n=0;6>n;n+=2)r=q[n+1],-1<r&&r<k.index&&(q[n+1]=-1);for(n=0;6>n;n+=2)t=q[n],r=q[n+1],-1===r&&(r=g++),p[t]=r,s[r]=t,e[f++]=r-k.index,k.count++}this.reorderBuffers(e,s,g);
return this.offsets=h},merge:function(){console.log("BufferGeometry.merge(): TODO")},normalizeNormals:function(){for(var a=this.attributes.normal.array,b,c,d,e=0,f=a.length;e<f;e+=3)b=a[e],c=a[e+1],d=a[e+2],b=1/Math.sqrt(b*b+c*c+d*d),a[e]*=b,a[e+1]*=b,a[e+2]*=b},reorderBuffers:function(a,b,c){var d={},e=[Int8Array,Uint8Array,Uint8ClampedArray,Int16Array,Uint16Array,Int32Array,Uint32Array,Float32Array,Float64Array],f;for(f in this.attributes)if("index"!=f)for(var g=this.attributes[f].array,h=0,k=e.length;h<
k;h++){var l=e[h];if(g instanceof l){d[f]=new l(this.attributes[f].itemSize*c);break}}for(e=0;e<c;e++)for(f in g=b[e],this.attributes)if("index"!=f)for(var h=this.attributes[f].array,k=this.attributes[f].itemSize,l=d[f],n=0;n<k;n++)l[e*k+n]=h[g*k+n];this.attributes.index.array=a;for(f in this.attributes)"index"!=f&&(this.attributes[f].array=d[f],this.attributes[f].numItems=this.attributes[f].itemSize*c)},clone:function(){var a=new THREE.BufferGeometry,b=[Int8Array,Uint8Array,Uint8ClampedArray,Int16Array,
Uint16Array,Int32Array,Uint32Array,Float32Array,Float64Array],c;for(c in this.attributes){for(var d=this.attributes[c],e=d.array,f={itemSize:d.itemSize,array:null},d=0,g=b.length;d<g;d++){var h=b[d];if(e instanceof h){f.array=new h(e);break}}a.attributes[c]=f}d=0;for(g=this.offsets.length;d<g;d++)b=this.offsets[d],a.offsets.push({start:b.start,index:b.index,count:b.count});return a},dispose:function(){this.dispatchEvent({type:"dispose"})}};THREE.EventDispatcher.prototype.apply(THREE.BufferGeometry.prototype);THREE.Geometry=function(){this.id=THREE.GeometryIdCount++;this.uuid=THREE.Math.generateUUID();this.name="";this.vertices=[];this.colors=[];this.faces=[];this.faceVertexUvs=[[]];this.morphTargets=[];this.morphColors=[];this.morphNormals=[];this.skinWeights=[];this.skinIndices=[];this.lineDistances=[];this.boundingSphere=this.boundingBox=null;this.hasTangents=!1;this.dynamic=!0;this.buffersNeedUpdate=this.lineDistancesNeedUpdate=this.colorsNeedUpdate=this.tangentsNeedUpdate=this.normalsNeedUpdate=this.uvsNeedUpdate=
this.elementsNeedUpdate=this.verticesNeedUpdate=!1};
THREE.Geometry.prototype={constructor:THREE.Geometry,applyMatrix:function(a){for(var b=(new THREE.Matrix3).getNormalMatrix(a),c=0,d=this.vertices.length;c<d;c++)this.vertices[c].applyMatrix4(a);c=0;for(d=this.faces.length;c<d;c++){a=this.faces[c];a.normal.applyMatrix3(b).normalize();for(var e=0,f=a.vertexNormals.length;e<f;e++)a.vertexNormals[e].applyMatrix3(b).normalize()}this.boundingBox instanceof THREE.Box3&&this.computeBoundingBox();this.boundingSphere instanceof THREE.Sphere&&this.computeBoundingSphere()},
computeFaceNormals:function(){for(var a=new THREE.Vector3,b=new THREE.Vector3,c=0,d=this.faces.length;c<d;c++){var e=this.faces[c],f=this.vertices[e.a],g=this.vertices[e.b];a.subVectors(this.vertices[e.c],g);b.subVectors(f,g);a.cross(b);a.normalize();e.normal.copy(a)}},computeVertexNormals:function(a){var b,c,d;d=Array(this.vertices.length);b=0;for(c=this.vertices.length;b<c;b++)d[b]=new THREE.Vector3;if(a){var e,f,g,h=new THREE.Vector3,k=new THREE.Vector3;new THREE.Vector3;new THREE.Vector3;new THREE.Vector3;
a=0;for(b=this.faces.length;a<b;a++)c=this.faces[a],e=this.vertices[c.a],f=this.vertices[c.b],g=this.vertices[c.c],h.subVectors(g,f),k.subVectors(e,f),h.cross(k),d[c.a].add(h),d[c.b].add(h),d[c.c].add(h)}else for(a=0,b=this.faces.length;a<b;a++)c=this.faces[a],d[c.a].add(c.normal),d[c.b].add(c.normal),d[c.c].add(c.normal);b=0;for(c=this.vertices.length;b<c;b++)d[b].normalize();a=0;for(b=this.faces.length;a<b;a++)c=this.faces[a],c.vertexNormals[0]=d[c.a].clone(),c.vertexNormals[1]=d[c.b].clone(),c.vertexNormals[2]=
d[c.c].clone()},computeMorphNormals:function(){var a,b,c,d,e;c=0;for(d=this.faces.length;c<d;c++)for(e=this.faces[c],e.__originalFaceNormal?e.__originalFaceNormal.copy(e.normal):e.__originalFaceNormal=e.normal.clone(),e.__originalVertexNormals||(e.__originalVertexNormals=[]),a=0,b=e.vertexNormals.length;a<b;a++)e.__originalVertexNormals[a]?e.__originalVertexNormals[a].copy(e.vertexNormals[a]):e.__originalVertexNormals[a]=e.vertexNormals[a].clone();var f=new THREE.Geometry;f.faces=this.faces;a=0;for(b=
this.morphTargets.length;a<b;a++){if(!this.morphNormals[a]){this.morphNormals[a]={};this.morphNormals[a].faceNormals=[];this.morphNormals[a].vertexNormals=[];e=this.morphNormals[a].faceNormals;var g=this.morphNormals[a].vertexNormals,h,k;c=0;for(d=this.faces.length;c<d;c++)h=new THREE.Vector3,k={a:new THREE.Vector3,b:new THREE.Vector3,c:new THREE.Vector3},e.push(h),g.push(k)}g=this.morphNormals[a];f.vertices=this.morphTargets[a].vertices;f.computeFaceNormals();f.computeVertexNormals();c=0;for(d=this.faces.length;c<
d;c++)e=this.faces[c],h=g.faceNormals[c],k=g.vertexNormals[c],h.copy(e.normal),k.a.copy(e.vertexNormals[0]),k.b.copy(e.vertexNormals[1]),k.c.copy(e.vertexNormals[2])}c=0;for(d=this.faces.length;c<d;c++)e=this.faces[c],e.normal=e.__originalFaceNormal,e.vertexNormals=e.__originalVertexNormals},computeTangents:function(){var a,b,c,d,e,f,g,h,k,l,n,q,p,s,t,r,v,w=[],u=[];c=new THREE.Vector3;var y=new THREE.Vector3,L=new THREE.Vector3,x=new THREE.Vector3,N=new THREE.Vector3;a=0;for(b=this.vertices.length;a<
b;a++)w[a]=new THREE.Vector3,u[a]=new THREE.Vector3;a=0;for(b=this.faces.length;a<b;a++)e=this.faces[a],f=this.faceVertexUvs[0][a],d=e.a,v=e.b,e=e.c,g=this.vertices[d],h=this.vertices[v],k=this.vertices[e],l=f[0],n=f[1],q=f[2],f=h.x-g.x,p=k.x-g.x,s=h.y-g.y,t=k.y-g.y,h=h.z-g.z,g=k.z-g.z,k=n.x-l.x,r=q.x-l.x,n=n.y-l.y,l=q.y-l.y,q=1/(k*l-r*n),c.set((l*f-n*p)*q,(l*s-n*t)*q,(l*h-n*g)*q),y.set((k*p-r*f)*q,(k*t-r*s)*q,(k*g-r*h)*q),w[d].add(c),w[v].add(c),w[e].add(c),u[d].add(y),u[v].add(y),u[e].add(y);y=
["a","b","c","d"];a=0;for(b=this.faces.length;a<b;a++)for(e=this.faces[a],c=0;c<Math.min(e.vertexNormals.length,3);c++)N.copy(e.vertexNormals[c]),d=e[y[c]],v=w[d],L.copy(v),L.sub(N.multiplyScalar(N.dot(v))).normalize(),x.crossVectors(e.vertexNormals[c],v),d=x.dot(u[d]),d=0>d?-1:1,e.vertexTangents[c]=new THREE.Vector4(L.x,L.y,L.z,d);this.hasTangents=!0},computeLineDistances:function(){for(var a=0,b=this.vertices,c=0,d=b.length;c<d;c++)0<c&&(a+=b[c].distanceTo(b[c-1])),this.lineDistances[c]=a},computeBoundingBox:function(){null===
this.boundingBox&&(this.boundingBox=new THREE.Box3);this.boundingBox.setFromPoints(this.vertices)},computeBoundingSphere:function(){null===this.boundingSphere&&(this.boundingSphere=new THREE.Sphere);this.boundingSphere.setFromPoints(this.vertices)},merge:function(a,b,c){if(!1===a instanceof THREE.Geometry)console.error("THREE.Geometry.merge(): geometry not an instance of THREE.Geometry.",a);else{var d,e=this.vertices.length,f=this.vertices,g=a.vertices,h=this.faces,k=a.faces,l=this.faceVertexUvs[0];
a=a.faceVertexUvs[0];void 0===c&&(c=0);void 0!==b&&(d=(new THREE.Matrix3).getNormalMatrix(b));for(var n=0,q=g.length;n<q;n++){var p=g[n].clone();void 0!==b&&p.applyMatrix4(b);f.push(p)}n=0;for(q=k.length;n<q;n++){var g=k[n],s,t=g.vertexNormals,r=g.vertexColors,p=new THREE.Face3(g.a+e,g.b+e,g.c+e);p.normal.copy(g.normal);void 0!==d&&p.normal.applyMatrix3(d).normalize();b=0;for(f=t.length;b<f;b++)s=t[b].clone(),void 0!==d&&s.applyMatrix3(d).normalize(),p.vertexNormals.push(s);p.color.copy(g.color);
b=0;for(f=r.length;b<f;b++)s=r[b],p.vertexColors.push(s.clone());p.materialIndex=g.materialIndex+c;h.push(p)}n=0;for(q=a.length;n<q;n++)if(c=a[n],d=[],void 0!==c){b=0;for(f=c.length;b<f;b++)d.push(new THREE.Vector2(c[b].x,c[b].y));l.push(d)}}},mergeVertices:function(){var a={},b=[],c=[],d,e=Math.pow(10,4),f,g;f=0;for(g=this.vertices.length;f<g;f++)d=this.vertices[f],d=Math.round(d.x*e)+"_"+Math.round(d.y*e)+"_"+Math.round(d.z*e),void 0===a[d]?(a[d]=f,b.push(this.vertices[f]),c[f]=b.length-1):c[f]=
c[a[d]];a=[];f=0;for(g=this.faces.length;f<g;f++)for(e=this.faces[f],e.a=c[e.a],e.b=c[e.b],e.c=c[e.c],e=[e.a,e.b,e.c],d=0;3>d;d++)if(e[d]==e[(d+1)%3]){a.push(f);break}for(f=a.length-1;0<=f;f--)for(e=a[f],this.faces.splice(e,1),c=0,g=this.faceVertexUvs.length;c<g;c++)this.faceVertexUvs[c].splice(e,1);f=this.vertices.length-b.length;this.vertices=b;return f},makeGroups:function(){var a=0;return function(b,c){var d,e,f,g,h={},k=this.morphTargets.length,l=this.morphNormals.length;this.geometryGroups=
{};d=0;for(e=this.faces.length;d<e;d++)f=this.faces[d],f=b?f.materialIndex:0,f in h||(h[f]={hash:f,counter:0}),g=h[f].hash+"_"+h[f].counter,g in this.geometryGroups||(this.geometryGroups[g]={faces3:[],materialIndex:f,vertices:0,numMorphTargets:k,numMorphNormals:l}),this.geometryGroups[g].vertices+3>c&&(h[f].counter+=1,g=h[f].hash+"_"+h[f].counter,g in this.geometryGroups||(this.geometryGroups[g]={faces3:[],materialIndex:f,vertices:0,numMorphTargets:k,numMorphNormals:l})),this.geometryGroups[g].faces3.push(d),
this.geometryGroups[g].vertices+=3;this.geometryGroupsList=[];for(var n in this.geometryGroups)this.geometryGroups[n].id=a++,this.geometryGroupsList.push(this.geometryGroups[n])}}(),clone:function(){for(var a=new THREE.Geometry,b=this.vertices,c=0,d=b.length;c<d;c++)a.vertices.push(b[c].clone());b=this.faces;c=0;for(d=b.length;c<d;c++)a.faces.push(b[c].clone());b=this.faceVertexUvs[0];c=0;for(d=b.length;c<d;c++){for(var e=b[c],f=[],g=0,h=e.length;g<h;g++)f.push(new THREE.Vector2(e[g].x,e[g].y));a.faceVertexUvs[0].push(f)}return a},
dispose:function(){this.dispatchEvent({type:"dispose"})}};THREE.EventDispatcher.prototype.apply(THREE.Geometry.prototype);THREE.GeometryIdCount=0;THREE.Camera=function(){THREE.Object3D.call(this);this.matrixWorldInverse=new THREE.Matrix4;this.projectionMatrix=new THREE.Matrix4};THREE.Camera.prototype=Object.create(THREE.Object3D.prototype);THREE.Camera.prototype.lookAt=function(){var a=new THREE.Matrix4;return function(b){a.lookAt(this.position,b,this.up);this.quaternion.setFromRotationMatrix(a)}}();
THREE.Camera.prototype.clone=function(a){void 0===a&&(a=new THREE.Camera);THREE.Object3D.prototype.clone.call(this,a);a.matrixWorldInverse.copy(this.matrixWorldInverse);a.projectionMatrix.copy(this.projectionMatrix);return a};THREE.OrthographicCamera=function(a,b,c,d,e,f){THREE.Camera.call(this);this.left=a;this.right=b;this.top=c;this.bottom=d;this.near=void 0!==e?e:0.1;this.far=void 0!==f?f:2E3;this.updateProjectionMatrix()};THREE.OrthographicCamera.prototype=Object.create(THREE.Camera.prototype);THREE.OrthographicCamera.prototype.updateProjectionMatrix=function(){this.projectionMatrix.makeOrthographic(this.left,this.right,this.top,this.bottom,this.near,this.far)};
THREE.OrthographicCamera.prototype.clone=function(){var a=new THREE.OrthographicCamera;THREE.Camera.prototype.clone.call(this,a);a.left=this.left;a.right=this.right;a.top=this.top;a.bottom=this.bottom;a.near=this.near;a.far=this.far;return a};THREE.PerspectiveCamera=function(a,b,c,d){THREE.Camera.call(this);this.fov=void 0!==a?a:50;this.aspect=void 0!==b?b:1;this.near=void 0!==c?c:0.1;this.far=void 0!==d?d:2E3;this.updateProjectionMatrix()};THREE.PerspectiveCamera.prototype=Object.create(THREE.Camera.prototype);THREE.PerspectiveCamera.prototype.setLens=function(a,b){void 0===b&&(b=24);this.fov=2*THREE.Math.radToDeg(Math.atan(b/(2*a)));this.updateProjectionMatrix()};
THREE.PerspectiveCamera.prototype.setViewOffset=function(a,b,c,d,e,f){this.fullWidth=a;this.fullHeight=b;this.x=c;this.y=d;this.width=e;this.height=f;this.updateProjectionMatrix()};
THREE.PerspectiveCamera.prototype.updateProjectionMatrix=function(){if(this.fullWidth){var a=this.fullWidth/this.fullHeight,b=Math.tan(THREE.Math.degToRad(0.5*this.fov))*this.near,c=-b,d=a*c,a=Math.abs(a*b-d),c=Math.abs(b-c);this.projectionMatrix.makeFrustum(d+this.x*a/this.fullWidth,d+(this.x+this.width)*a/this.fullWidth,b-(this.y+this.height)*c/this.fullHeight,b-this.y*c/this.fullHeight,this.near,this.far)}else this.projectionMatrix.makePerspective(this.fov,this.aspect,this.near,this.far)};
THREE.PerspectiveCamera.prototype.clone=function(){var a=new THREE.PerspectiveCamera;THREE.Camera.prototype.clone.call(this,a);a.fov=this.fov;a.aspect=this.aspect;a.near=this.near;a.far=this.far;return a};THREE.Light=function(a){THREE.Object3D.call(this);this.color=new THREE.Color(a)};THREE.Light.prototype=Object.create(THREE.Object3D.prototype);THREE.Light.prototype.clone=function(a){void 0===a&&(a=new THREE.Light);THREE.Object3D.prototype.clone.call(this,a);a.color.copy(this.color);return a};THREE.AmbientLight=function(a){THREE.Light.call(this,a)};THREE.AmbientLight.prototype=Object.create(THREE.Light.prototype);THREE.AmbientLight.prototype.clone=function(){var a=new THREE.AmbientLight;THREE.Light.prototype.clone.call(this,a);return a};THREE.AreaLight=function(a,b){THREE.Light.call(this,a);this.normal=new THREE.Vector3(0,-1,0);this.right=new THREE.Vector3(1,0,0);this.intensity=void 0!==b?b:1;this.height=this.width=1;this.constantAttenuation=1.5;this.linearAttenuation=0.5;this.quadraticAttenuation=0.1};THREE.AreaLight.prototype=Object.create(THREE.Light.prototype);THREE.DirectionalLight=function(a,b){THREE.Light.call(this,a);this.position.set(0,1,0);this.target=new THREE.Object3D;this.intensity=void 0!==b?b:1;this.onlyShadow=this.castShadow=!1;this.shadowCameraNear=50;this.shadowCameraFar=5E3;this.shadowCameraLeft=-500;this.shadowCameraTop=this.shadowCameraRight=500;this.shadowCameraBottom=-500;this.shadowCameraVisible=!1;this.shadowBias=0;this.shadowDarkness=0.5;this.shadowMapHeight=this.shadowMapWidth=512;this.shadowCascade=!1;this.shadowCascadeOffset=new THREE.Vector3(0,
0,-1E3);this.shadowCascadeCount=2;this.shadowCascadeBias=[0,0,0];this.shadowCascadeWidth=[512,512,512];this.shadowCascadeHeight=[512,512,512];this.shadowCascadeNearZ=[-1,0.99,0.998];this.shadowCascadeFarZ=[0.99,0.998,1];this.shadowCascadeArray=[];this.shadowMatrix=this.shadowCamera=this.shadowMapSize=this.shadowMap=null};THREE.DirectionalLight.prototype=Object.create(THREE.Light.prototype);
THREE.DirectionalLight.prototype.clone=function(){var a=new THREE.DirectionalLight;THREE.Light.prototype.clone.call(this,a);a.target=this.target.clone();a.intensity=this.intensity;a.castShadow=this.castShadow;a.onlyShadow=this.onlyShadow;a.shadowCameraNear=this.shadowCameraNear;a.shadowCameraFar=this.shadowCameraFar;a.shadowCameraLeft=this.shadowCameraLeft;a.shadowCameraRight=this.shadowCameraRight;a.shadowCameraTop=this.shadowCameraTop;a.shadowCameraBottom=this.shadowCameraBottom;a.shadowCameraVisible=
this.shadowCameraVisible;a.shadowBias=this.shadowBias;a.shadowDarkness=this.shadowDarkness;a.shadowMapWidth=this.shadowMapWidth;a.shadowMapHeight=this.shadowMapHeight;a.shadowCascade=this.shadowCascade;a.shadowCascadeOffset.copy(this.shadowCascadeOffset);a.shadowCascadeCount=this.shadowCascadeCount;a.shadowCascadeBias=this.shadowCascadeBias.slice(0);a.shadowCascadeWidth=this.shadowCascadeWidth.slice(0);a.shadowCascadeHeight=this.shadowCascadeHeight.slice(0);a.shadowCascadeNearZ=this.shadowCascadeNearZ.slice(0);
a.shadowCascadeFarZ=this.shadowCascadeFarZ.slice(0);return a};THREE.HemisphereLight=function(a,b,c){THREE.Light.call(this,a);this.position.set(0,100,0);this.groundColor=new THREE.Color(b);this.intensity=void 0!==c?c:1};THREE.HemisphereLight.prototype=Object.create(THREE.Light.prototype);THREE.HemisphereLight.prototype.clone=function(){var a=new THREE.HemisphereLight;THREE.Light.prototype.clone.call(this,a);a.groundColor.copy(this.groundColor);a.intensity=this.intensity;return a};THREE.PointLight=function(a,b,c){THREE.Light.call(this,a);this.intensity=void 0!==b?b:1;this.distance=void 0!==c?c:0};THREE.PointLight.prototype=Object.create(THREE.Light.prototype);THREE.PointLight.prototype.clone=function(){var a=new THREE.PointLight;THREE.Light.prototype.clone.call(this,a);a.intensity=this.intensity;a.distance=this.distance;return a};THREE.SpotLight=function(a,b,c,d,e){THREE.Light.call(this,a);this.position.set(0,1,0);this.target=new THREE.Object3D;this.intensity=void 0!==b?b:1;this.distance=void 0!==c?c:0;this.angle=void 0!==d?d:Math.PI/3;this.exponent=void 0!==e?e:10;this.onlyShadow=this.castShadow=!1;this.shadowCameraNear=50;this.shadowCameraFar=5E3;this.shadowCameraFov=50;this.shadowCameraVisible=!1;this.shadowBias=0;this.shadowDarkness=0.5;this.shadowMapHeight=this.shadowMapWidth=512;this.shadowMatrix=this.shadowCamera=this.shadowMapSize=
this.shadowMap=null};THREE.SpotLight.prototype=Object.create(THREE.Light.prototype);
THREE.SpotLight.prototype.clone=function(){var a=new THREE.SpotLight;THREE.Light.prototype.clone.call(this,a);a.target=this.target.clone();a.intensity=this.intensity;a.distance=this.distance;a.angle=this.angle;a.exponent=this.exponent;a.castShadow=this.castShadow;a.onlyShadow=this.onlyShadow;a.shadowCameraNear=this.shadowCameraNear;a.shadowCameraFar=this.shadowCameraFar;a.shadowCameraFov=this.shadowCameraFov;a.shadowCameraVisible=this.shadowCameraVisible;a.shadowBias=this.shadowBias;a.shadowDarkness=
this.shadowDarkness;a.shadowMapWidth=this.shadowMapWidth;a.shadowMapHeight=this.shadowMapHeight;return a};THREE.Cache=function(){this.files={}};THREE.Cache.prototype={constructor:THREE.Cache,add:function(a,b){this.files[a]=b},get:function(a){return this.files[a]},remove:function(a){delete this.files[a]},clear:function(){this.files={}}};THREE.Loader=function(a){this.statusDomElement=(this.showStatus=a)?THREE.Loader.prototype.addStatusElement():null;this.imageLoader=new THREE.ImageLoader;this.onLoadStart=function(){};this.onLoadProgress=function(){};this.onLoadComplete=function(){}};
THREE.Loader.prototype={constructor:THREE.Loader,crossOrigin:void 0,addStatusElement:function(){var a=document.createElement("div");a.style.position="absolute";a.style.right="0px";a.style.top="0px";a.style.fontSize="0.8em";a.style.textAlign="left";a.style.background="rgba(0,0,0,0.25)";a.style.color="#fff";a.style.width="120px";a.style.padding="0.5em 0.5em 0.5em 0.5em";a.style.zIndex=1E3;a.innerHTML="Loading ...";return a},updateProgress:function(a){var b="Loaded ",b=a.total?b+((100*a.loaded/a.total).toFixed(0)+
"%"):b+((a.loaded/1024).toFixed(2)+" KB");this.statusDomElement.innerHTML=b},extractUrlBase:function(a){a=a.split("/");if(1===a.length)return"./";a.pop();return a.join("/")+"/"},initMaterials:function(a,b){for(var c=[],d=0;d<a.length;++d)c[d]=this.createMaterial(a[d],b);return c},needsTangents:function(a){for(var b=0,c=a.length;b<c;b++)if(a[b]instanceof THREE.ShaderMaterial)return!0;return!1},createMaterial:function(a,b){function c(a){a=Math.log(a)/Math.LN2;return Math.pow(2,Math.round(a))}function d(a,
d,e,g,h,k,r){var v=/\.dds$/i.test(e),w=b+e;if(v){var u=THREE.ImageUtils.loadCompressedTexture(w);a[d]=u}else u=document.createElement("canvas"),a[d]=new THREE.Texture(u);a[d].sourceFile=e;g&&(a[d].repeat.set(g[0],g[1]),1!==g[0]&&(a[d].wrapS=THREE.RepeatWrapping),1!==g[1]&&(a[d].wrapT=THREE.RepeatWrapping));h&&a[d].offset.set(h[0],h[1]);k&&(e={repeat:THREE.RepeatWrapping,mirror:THREE.MirroredRepeatWrapping},void 0!==e[k[0]]&&(a[d].wrapS=e[k[0]]),void 0!==e[k[1]]&&(a[d].wrapT=e[k[1]]));r&&(a[d].anisotropy=
r);v||(u=a[d],f.imageLoader.crossOrigin=f.crossOrigin,f.imageLoader.load(w,function(a){if(!1===THREE.Math.isPowerOfTwo(a.width)||!1===THREE.Math.isPowerOfTwo(a.height)){var b=c(a.width),d=c(a.height);u.image.width=b;u.image.height=d;u.image.getContext("2d").drawImage(a,0,0,b,d)}else u.image=a;u.needsUpdate=!0}))}function e(a){return(255*a[0]<<16)+(255*a[1]<<8)+255*a[2]}var f=this,g="MeshLambertMaterial",h={color:15658734,opacity:1,map:null,lightMap:null,normalMap:null,bumpMap:null,wireframe:!1};if(a.shading){var k=
a.shading.toLowerCase();"phong"===k?g="MeshPhongMaterial":"basic"===k&&(g="MeshBasicMaterial")}void 0!==a.blending&&void 0!==THREE[a.blending]&&(h.blending=THREE[a.blending]);if(void 0!==a.transparent||1>a.opacity)h.transparent=a.transparent;void 0!==a.depthTest&&(h.depthTest=a.depthTest);void 0!==a.depthWrite&&(h.depthWrite=a.depthWrite);void 0!==a.visible&&(h.visible=a.visible);void 0!==a.flipSided&&(h.side=THREE.BackSide);void 0!==a.doubleSided&&(h.side=THREE.DoubleSide);void 0!==a.wireframe&&
(h.wireframe=a.wireframe);void 0!==a.vertexColors&&("face"===a.vertexColors?h.vertexColors=THREE.FaceColors:a.vertexColors&&(h.vertexColors=THREE.VertexColors));a.colorDiffuse?h.color=e(a.colorDiffuse):a.DbgColor&&(h.color=a.DbgColor);a.colorSpecular&&(h.specular=e(a.colorSpecular));a.colorAmbient&&(h.ambient=e(a.colorAmbient));a.colorEmissive&&(h.emissive=e(a.colorEmissive));a.transparency&&(h.opacity=a.transparency);a.specularCoef&&(h.shininess=a.specularCoef);a.mapDiffuse&&b&&d(h,"map",a.mapDiffuse,
a.mapDiffuseRepeat,a.mapDiffuseOffset,a.mapDiffuseWrap,a.mapDiffuseAnisotropy);a.mapLight&&b&&d(h,"lightMap",a.mapLight,a.mapLightRepeat,a.mapLightOffset,a.mapLightWrap,a.mapLightAnisotropy);a.mapBump&&b&&d(h,"bumpMap",a.mapBump,a.mapBumpRepeat,a.mapBumpOffset,a.mapBumpWrap,a.mapBumpAnisotropy);a.mapNormal&&b&&d(h,"normalMap",a.mapNormal,a.mapNormalRepeat,a.mapNormalOffset,a.mapNormalWrap,a.mapNormalAnisotropy);a.mapSpecular&&b&&d(h,"specularMap",a.mapSpecular,a.mapSpecularRepeat,a.mapSpecularOffset,
a.mapSpecularWrap,a.mapSpecularAnisotropy);a.mapBumpScale&&(h.bumpScale=a.mapBumpScale);a.mapNormal?(g=THREE.ShaderLib.normalmap,k=THREE.UniformsUtils.clone(g.uniforms),k.tNormal.value=h.normalMap,a.mapNormalFactor&&k.uNormalScale.value.set(a.mapNormalFactor,a.mapNormalFactor),h.map&&(k.tDiffuse.value=h.map,k.enableDiffuse.value=!0),h.specularMap&&(k.tSpecular.value=h.specularMap,k.enableSpecular.value=!0),h.lightMap&&(k.tAO.value=h.lightMap,k.enableAO.value=!0),k.diffuse.value.setHex(h.color),k.specular.value.setHex(h.specular),
k.ambient.value.setHex(h.ambient),k.shininess.value=h.shininess,void 0!==h.opacity&&(k.opacity.value=h.opacity),g=new THREE.ShaderMaterial({fragmentShader:g.fragmentShader,vertexShader:g.vertexShader,uniforms:k,lights:!0,fog:!0}),h.transparent&&(g.transparent=!0)):g=new THREE[g](h);void 0!==a.DbgName&&(g.name=a.DbgName);return g}};THREE.XHRLoader=function(a){this.cache=new THREE.Cache;this.manager=void 0!==a?a:THREE.DefaultLoadingManager};
THREE.XHRLoader.prototype={constructor:THREE.XHRLoader,load:function(a,b,c,d){var e=this,f=e.cache.get(a);void 0!==f?b(f):(f=new XMLHttpRequest,void 0!==b&&f.addEventListener("load",function(c){e.cache.add(a,c.target.responseText);b(c.target.responseText);e.manager.itemEnd(a)},!1),void 0!==c&&f.addEventListener("progress",function(a){c(a)},!1),void 0!==d&&f.addEventListener("error",function(a){d(a)},!1),void 0!==this.crossOrigin&&(f.crossOrigin=this.crossOrigin),f.open("GET",a,!0),f.send(null),e.manager.itemStart(a))},
setCrossOrigin:function(a){this.crossOrigin=a}};THREE.ImageLoader=function(a){this.cache=new THREE.Cache;this.manager=void 0!==a?a:THREE.DefaultLoadingManager};
THREE.ImageLoader.prototype={constructor:THREE.ImageLoader,load:function(a,b,c,d){var e=this,f=e.cache.get(a);if(void 0!==f)b(f);else return f=document.createElement("img"),void 0!==b&&f.addEventListener("load",function(c){e.cache.add(a,this);b(this);e.manager.itemEnd(a)},!1),void 0!==c&&f.addEventListener("progress",function(a){c(a)},!1),void 0!==d&&f.addEventListener("error",function(a){d(a)},!1),void 0!==this.crossOrigin&&(f.crossOrigin=this.crossOrigin),f.src=a,e.manager.itemStart(a),f},setCrossOrigin:function(a){this.crossOrigin=
a}};THREE.JSONLoader=function(a){THREE.Loader.call(this,a);this.withCredentials=!1};THREE.JSONLoader.prototype=Object.create(THREE.Loader.prototype);THREE.JSONLoader.prototype.load=function(a,b,c){c=c&&"string"===typeof c?c:this.extractUrlBase(a);this.onLoadStart();this.loadAjaxJSON(this,a,b,c)};
THREE.JSONLoader.prototype.loadAjaxJSON=function(a,b,c,d,e){var f=new XMLHttpRequest,g=0;f.onreadystatechange=function(){if(f.readyState===f.DONE)if(200===f.status||0===f.status){if(f.responseText){var h=JSON.parse(f.responseText);if(void 0!==h.metadata&&"scene"===h.metadata.type){console.error('THREE.JSONLoader: "'+b+'" seems to be a Scene. Use THREE.SceneLoader instead.');return}h=a.parse(h,d);c(h.geometry,h.materials)}else console.error('THREE.JSONLoader: "'+b+'" seems to be unreachable or the file is empty.');
a.onLoadComplete()}else console.error("THREE.JSONLoader: Couldn't load \""+b+'" ('+f.status+")");else f.readyState===f.LOADING?e&&(0===g&&(g=f.getResponseHeader("Content-Length")),e({total:g,loaded:f.responseText.length})):f.readyState===f.HEADERS_RECEIVED&&void 0!==e&&(g=f.getResponseHeader("Content-Length"))};f.open("GET",b,!0);f.withCredentials=this.withCredentials;f.send(null)};
THREE.JSONLoader.prototype.parse=function(a,b){var c=new THREE.Geometry,d=void 0!==a.scale?1/a.scale:1;(function(b){var d,g,h,k,l,n,q,p,s,t,r,v,w,u=a.faces;n=a.vertices;var y=a.normals,L=a.colors,x=0;if(void 0!==a.uvs){for(d=0;d<a.uvs.length;d++)a.uvs[d].length&&x++;for(d=0;d<x;d++)c.faceVertexUvs[d]=[]}k=0;for(l=n.length;k<l;)d=new THREE.Vector3,d.x=n[k++]*b,d.y=n[k++]*b,d.z=n[k++]*b,c.vertices.push(d);k=0;for(l=u.length;k<l;)if(b=u[k++],s=b&1,h=b&2,d=b&8,q=b&16,t=b&32,n=b&64,b&=128,s){s=new THREE.Face3;
s.a=u[k];s.b=u[k+1];s.c=u[k+3];r=new THREE.Face3;r.a=u[k+1];r.b=u[k+2];r.c=u[k+3];k+=4;h&&(h=u[k++],s.materialIndex=h,r.materialIndex=h);h=c.faces.length;if(d)for(d=0;d<x;d++)for(v=a.uvs[d],c.faceVertexUvs[d][h]=[],c.faceVertexUvs[d][h+1]=[],g=0;4>g;g++)p=u[k++],w=v[2*p],p=v[2*p+1],w=new THREE.Vector2(w,p),2!==g&&c.faceVertexUvs[d][h].push(w),0!==g&&c.faceVertexUvs[d][h+1].push(w);q&&(q=3*u[k++],s.normal.set(y[q++],y[q++],y[q]),r.normal.copy(s.normal));if(t)for(d=0;4>d;d++)q=3*u[k++],t=new THREE.Vector3(y[q++],
y[q++],y[q]),2!==d&&s.vertexNormals.push(t),0!==d&&r.vertexNormals.push(t);n&&(n=u[k++],n=L[n],s.color.setHex(n),r.color.setHex(n));if(b)for(d=0;4>d;d++)n=u[k++],n=L[n],2!==d&&s.vertexColors.push(new THREE.Color(n)),0!==d&&r.vertexColors.push(new THREE.Color(n));c.faces.push(s);c.faces.push(r)}else{s=new THREE.Face3;s.a=u[k++];s.b=u[k++];s.c=u[k++];h&&(h=u[k++],s.materialIndex=h);h=c.faces.length;if(d)for(d=0;d<x;d++)for(v=a.uvs[d],c.faceVertexUvs[d][h]=[],g=0;3>g;g++)p=u[k++],w=v[2*p],p=v[2*p+1],
w=new THREE.Vector2(w,p),c.faceVertexUvs[d][h].push(w);q&&(q=3*u[k++],s.normal.set(y[q++],y[q++],y[q]));if(t)for(d=0;3>d;d++)q=3*u[k++],t=new THREE.Vector3(y[q++],y[q++],y[q]),s.vertexNormals.push(t);n&&(n=u[k++],s.color.setHex(L[n]));if(b)for(d=0;3>d;d++)n=u[k++],s.vertexColors.push(new THREE.Color(L[n]));c.faces.push(s)}})(d);(function(){var b=void 0!==a.influencesPerVertex?a.influencesPerVertex:2;if(a.skinWeights)for(var d=0,g=a.skinWeights.length;d<g;d+=b)c.skinWeights.push(new THREE.Vector4(a.skinWeights[d],
1<b?a.skinWeights[d+1]:0,2<b?a.skinWeights[d+2]:0,3<b?a.skinWeights[d+3]:0));if(a.skinIndices)for(d=0,g=a.skinIndices.length;d<g;d+=b)c.skinIndices.push(new THREE.Vector4(a.skinIndices[d],1<b?a.skinIndices[d+1]:0,2<b?a.skinIndices[d+2]:0,3<b?a.skinIndices[d+3]:0));c.bones=a.bones;c.bones&&0<c.bones.length&&(c.skinWeights.length!==c.skinIndices.length||c.skinIndices.length!==c.vertices.length)&&console.warn("When skinning, number of vertices ("+c.vertices.length+"), skinIndices ("+c.skinIndices.length+
"), and skinWeights ("+c.skinWeights.length+") should match.");c.animation=a.animation;c.animations=a.animations})();(function(b){if(void 0!==a.morphTargets){var d,g,h,k,l,n;d=0;for(g=a.morphTargets.length;d<g;d++)for(c.morphTargets[d]={},c.morphTargets[d].name=a.morphTargets[d].name,c.morphTargets[d].vertices=[],l=c.morphTargets[d].vertices,n=a.morphTargets[d].vertices,h=0,k=n.length;h<k;h+=3){var q=new THREE.Vector3;q.x=n[h]*b;q.y=n[h+1]*b;q.z=n[h+2]*b;l.push(q)}}if(void 0!==a.morphColors)for(d=
0,g=a.morphColors.length;d<g;d++)for(c.morphColors[d]={},c.morphColors[d].name=a.morphColors[d].name,c.morphColors[d].colors=[],k=c.morphColors[d].colors,l=a.morphColors[d].colors,b=0,h=l.length;b<h;b+=3)n=new THREE.Color(16755200),n.setRGB(l[b],l[b+1],l[b+2]),k.push(n)})(d);c.computeFaceNormals();c.computeBoundingSphere();if(void 0===a.materials||0===a.materials.length)return{geometry:c};d=this.initMaterials(a.materials,b);this.needsTangents(d)&&c.computeTangents();return{geometry:c,materials:d}};THREE.LoadingManager=function(a,b,c){var d=this,e=0,f=0;this.onLoad=a;this.onProgress=b;this.onError=c;this.itemStart=function(a){f++};this.itemEnd=function(a){e++;if(void 0!==d.onProgress)d.onProgress(a,e,f);if(e===f&&void 0!==d.onLoad)d.onLoad()}};THREE.DefaultLoadingManager=new THREE.LoadingManager;THREE.BufferGeometryLoader=function(a){this.manager=void 0!==a?a:THREE.DefaultLoadingManager};
THREE.BufferGeometryLoader.prototype={constructor:THREE.BufferGeometryLoader,load:function(a,b,c,d){var e=this;c=new THREE.XHRLoader;c.setCrossOrigin(this.crossOrigin);c.load(a,function(a){b(e.parse(JSON.parse(a)))})},setCrossOrigin:function(a){this.crossOrigin=a},parse:function(a){var b=new THREE.BufferGeometry,c=a.attributes,d=a.offsets;a=a.boundingSphere;for(var e in c){var f=c[e];b.attributes[e]={itemSize:f.itemSize,array:new self[f.type](f.array)}}void 0!==d&&(b.offsets=JSON.parse(JSON.stringify(d)));
void 0!==a&&(b.boundingSphere=new THREE.Sphere((new THREE.Vector3).fromArray(void 0!==a.center?a.center:[0,0,0]),a.radius));return b}};THREE.MaterialLoader=function(a){this.manager=void 0!==a?a:THREE.DefaultLoadingManager};
THREE.MaterialLoader.prototype={constructor:THREE.MaterialLoader,load:function(a,b,c,d){var e=this;c=new THREE.XHRLoader;c.setCrossOrigin(this.crossOrigin);c.load(a,function(a){b(e.parse(JSON.parse(a)))})},setCrossOrigin:function(a){this.crossOrigin=a},parse:function(a){var b=new THREE[a.type];void 0!==a.color&&b.color.setHex(a.color);void 0!==a.ambient&&b.ambient.setHex(a.ambient);void 0!==a.emissive&&b.emissive.setHex(a.emissive);void 0!==a.specular&&b.specular.setHex(a.specular);void 0!==a.shininess&&
(b.shininess=a.shininess);void 0!==a.vertexColors&&(b.vertexColors=a.vertexColors);void 0!==a.blending&&(b.blending=a.blending);void 0!==a.side&&(b.side=a.side);void 0!==a.opacity&&(b.opacity=a.opacity);void 0!==a.transparent&&(b.transparent=a.transparent);void 0!==a.wireframe&&(b.wireframe=a.wireframe);if(void 0!==a.materials)for(var c=0,d=a.materials.length;c<d;c++)b.materials.push(this.parse(a.materials[c]));return b}};THREE.ObjectLoader=function(a){this.manager=void 0!==a?a:THREE.DefaultLoadingManager};
THREE.ObjectLoader.prototype={constructor:THREE.ObjectLoader,load:function(a,b,c,d){var e=this;c=new THREE.XHRLoader(e.manager);c.setCrossOrigin(this.crossOrigin);c.load(a,function(a){b(e.parse(JSON.parse(a)))})},setCrossOrigin:function(a){this.crossOrigin=a},parse:function(a){var b=this.parseGeometries(a.geometries),c=this.parseMaterials(a.materials);return this.parseObject(a.object,b,c)},parseGeometries:function(a){var b={};if(void 0!==a)for(var c=new THREE.JSONLoader,d=new THREE.BufferGeometryLoader,
e=0,f=a.length;e<f;e++){var g,h=a[e];switch(h.type){case "PlaneGeometry":g=new THREE.PlaneGeometry(h.width,h.height,h.widthSegments,h.heightSegments);break;case "BoxGeometry":case "CubeGeometry":g=new THREE.BoxGeometry(h.width,h.height,h.depth,h.widthSegments,h.heightSegments,h.depthSegments);break;case "CircleGeometry":g=new THREE.CircleGeometry(h.radius,h.segments);break;case "CylinderGeometry":g=new THREE.CylinderGeometry(h.radiusTop,h.radiusBottom,h.height,h.radialSegments,h.heightSegments,h.openEnded);
break;case "SphereGeometry":g=new THREE.SphereGeometry(h.radius,h.widthSegments,h.heightSegments,h.phiStart,h.phiLength,h.thetaStart,h.thetaLength);break;case "IcosahedronGeometry":g=new THREE.IcosahedronGeometry(h.radius,h.detail);break;case "TorusGeometry":g=new THREE.TorusGeometry(h.radius,h.tube,h.radialSegments,h.tubularSegments,h.arc);break;case "TorusKnotGeometry":g=new THREE.TorusKnotGeometry(h.radius,h.tube,h.radialSegments,h.tubularSegments,h.p,h.q,h.heightScale);break;case "BufferGeometry":g=
d.parse(h.data);break;case "Geometry":g=c.parse(h.data).geometry}g.uuid=h.uuid;void 0!==h.name&&(g.name=h.name);b[h.uuid]=g}return b},parseMaterials:function(a){var b={};if(void 0!==a)for(var c=new THREE.MaterialLoader,d=0,e=a.length;d<e;d++){var f=a[d],g=c.parse(f);g.uuid=f.uuid;void 0!==f.name&&(g.name=f.name);b[f.uuid]=g}return b},parseObject:function(){var a=new THREE.Matrix4;return function(b,c,d){var e;switch(b.type){case "Scene":e=new THREE.Scene;break;case "PerspectiveCamera":e=new THREE.PerspectiveCamera(b.fov,
b.aspect,b.near,b.far);break;case "OrthographicCamera":e=new THREE.OrthographicCamera(b.left,b.right,b.top,b.bottom,b.near,b.far);break;case "AmbientLight":e=new THREE.AmbientLight(b.color);break;case "DirectionalLight":e=new THREE.DirectionalLight(b.color,b.intensity);break;case "PointLight":e=new THREE.PointLight(b.color,b.intensity,b.distance);break;case "SpotLight":e=new THREE.SpotLight(b.color,b.intensity,b.distance,b.angle,b.exponent);break;case "HemisphereLight":e=new THREE.HemisphereLight(b.color,
b.groundColor,b.intensity);break;case "Mesh":e=c[b.geometry];var f=d[b.material];void 0===e&&console.error("THREE.ObjectLoader: Undefined geometry "+b.geometry);void 0===f&&console.error("THREE.ObjectLoader: Undefined material "+b.material);e=new THREE.Mesh(e,f);break;case "Sprite":f=d[b.material];void 0===f&&console.error("THREE.ObjectLoader: Undefined material "+b.material);e=new THREE.Sprite(f);break;default:e=new THREE.Object3D}e.uuid=b.uuid;void 0!==b.name&&(e.name=b.name);void 0!==b.matrix?
(a.fromArray(b.matrix),a.decompose(e.position,e.quaternion,e.scale)):(void 0!==b.position&&e.position.fromArray(b.position),void 0!==b.rotation&&e.rotation.fromArray(b.rotation),void 0!==b.scale&&e.scale.fromArray(b.scale));void 0!==b.visible&&(e.visible=b.visible);void 0!==b.userData&&(e.userData=b.userData);if(void 0!==b.children)for(var g in b.children)e.add(this.parseObject(b.children[g],c,d));return e}}()};THREE.SceneLoader=function(){this.onLoadStart=function(){};this.onLoadProgress=function(){};this.onLoadComplete=function(){};this.callbackSync=function(){};this.callbackProgress=function(){};this.geometryHandlers={};this.hierarchyHandlers={};this.addGeometryHandler("ascii",THREE.JSONLoader)};
THREE.SceneLoader.prototype={constructor:THREE.SceneLoader,load:function(a,b,c,d){var e=this;c=new THREE.XHRLoader(e.manager);c.setCrossOrigin(this.crossOrigin);c.load(a,function(c){e.parse(JSON.parse(c),b,a)})},setCrossOrigin:function(a){this.crossOrigin=a},addGeometryHandler:function(a,b){this.geometryHandlers[a]={loaderClass:b}},addHierarchyHandler:function(a,b){this.hierarchyHandlers[a]={loaderClass:b}},parse:function(a,b,c){function d(a,b){return"relativeToHTML"==b?a:s+a}function e(){f(B.scene,
A.objects)}function f(a,b){var c,e,g,h,l,n;for(n in b){var q=B.objects[n],s=b[n];if(void 0===q){if(s.type&&s.type in p.hierarchyHandlers){if(void 0===s.loading){c={type:1,url:1,material:1,position:1,rotation:1,scale:1,visible:1,children:1,userData:1,skin:1,morph:1,mirroredLoop:1,duration:1};var u={},w;for(w in s)w in c||(u[w]=s[w]);r=B.materials[s.material];s.loading=!0;c=p.hierarchyHandlers[s.type].loaderObject;c.options?c.load(d(s.url,A.urlBaseType),k(n,a,r,s)):c.load(d(s.url,A.urlBaseType),k(n,
a,r,s),u)}}else if(void 0!==s.geometry){if(t=B.geometries[s.geometry]){q=!1;r=B.materials[s.material];q=r instanceof THREE.ShaderMaterial;e=s.position;g=s.rotation;h=s.scale;c=s.matrix;l=s.quaternion;s.material||(r=new THREE.MeshFaceMaterial(B.face_materials[s.geometry]));r instanceof THREE.MeshFaceMaterial&&0===r.materials.length&&(r=new THREE.MeshFaceMaterial(B.face_materials[s.geometry]));if(r instanceof THREE.MeshFaceMaterial)for(u=0;u<r.materials.length;u++)q=q||r.materials[u]instanceof THREE.ShaderMaterial;
q&&t.computeTangents();s.skin?q=new THREE.SkinnedMesh(t,r):s.morph?(q=new THREE.MorphAnimMesh(t,r),void 0!==s.duration&&(q.duration=s.duration),void 0!==s.time&&(q.time=s.time),void 0!==s.mirroredLoop&&(q.mirroredLoop=s.mirroredLoop),r.morphNormals&&t.computeMorphNormals()):q=new THREE.Mesh(t,r);q.name=n;c?(q.matrixAutoUpdate=!1,q.matrix.set(c[0],c[1],c[2],c[3],c[4],c[5],c[6],c[7],c[8],c[9],c[10],c[11],c[12],c[13],c[14],c[15])):(q.position.fromArray(e),l?q.quaternion.fromArray(l):q.rotation.fromArray(g),
q.scale.fromArray(h));q.visible=s.visible;q.castShadow=s.castShadow;q.receiveShadow=s.receiveShadow;a.add(q);B.objects[n]=q}}else if("AmbientLight"===s.type||"PointLight"===s.type||"DirectionalLight"===s.type||"SpotLight"===s.type||"HemisphereLight"===s.type||"AreaLight"===s.type){u=s.color;c=s.intensity;e=s.distance;g=s.position;h=s.rotation;switch(s.type){case "AmbientLight":y=new THREE.AmbientLight(u);break;case "PointLight":y=new THREE.PointLight(u,c,e);y.position.fromArray(g);break;case "DirectionalLight":y=
new THREE.DirectionalLight(u,c);y.position.fromArray(s.direction);break;case "SpotLight":y=new THREE.SpotLight(u,c,e,1);y.angle=s.angle;y.position.fromArray(g);y.target.set(g[0],g[1]-e,g[2]);y.target.applyEuler(new THREE.Euler(h[0],h[1],h[2],"XYZ"));break;case "HemisphereLight":y=new THREE.DirectionalLight(u,c,e);y.target.set(g[0],g[1]-e,g[2]);y.target.applyEuler(new THREE.Euler(h[0],h[1],h[2],"XYZ"));break;case "AreaLight":y=new THREE.AreaLight(u,c),y.position.fromArray(g),y.width=s.size,y.height=
s.size_y}a.add(y);y.name=n;B.lights[n]=y;B.objects[n]=y}else"PerspectiveCamera"===s.type||"OrthographicCamera"===s.type?(e=s.position,g=s.rotation,l=s.quaternion,"PerspectiveCamera"===s.type?v=new THREE.PerspectiveCamera(s.fov,s.aspect,s.near,s.far):"OrthographicCamera"===s.type&&(v=new THREE.OrthographicCamera(s.left,s.right,s.top,s.bottom,s.near,s.far)),v.name=n,v.position.fromArray(e),void 0!==l?v.quaternion.fromArray(l):void 0!==g&&v.rotation.fromArray(g),a.add(v),B.cameras[n]=v,B.objects[n]=
v):(e=s.position,g=s.rotation,h=s.scale,l=s.quaternion,q=new THREE.Object3D,q.name=n,q.position.fromArray(e),l?q.quaternion.fromArray(l):q.rotation.fromArray(g),q.scale.fromArray(h),q.visible=void 0!==s.visible?s.visible:!1,a.add(q),B.objects[n]=q,B.empties[n]=q);if(q){if(void 0!==s.userData)for(var L in s.userData)q.userData[L]=s.userData[L];if(void 0!==s.groups)for(u=0;u<s.groups.length;u++)c=s.groups[u],void 0===B.groups[c]&&(B.groups[c]=[]),B.groups[c].push(n)}}void 0!==q&&void 0!==s.children&&
f(q,s.children)}}function g(a,b,c,d,f){var g=f.rotation,h=f.quaternion,k=f.scale;a.position.fromArray(f.position);h?a.quaternion.fromArray(h):a.rotation.fromArray(g);a.scale.fromArray(k);d&&a.traverse(function(a){a.material=d});var l=void 0!==f.visible?f.visible:!0;a.traverse(function(a){a.visible=l});c.add(a);a.name=b;B.objects[b]=a;e()}function h(a){return function(b,c){b.name=a;B.geometries[a]=b;B.face_materials[a]=c;e();L-=1;p.onLoadComplete();n()}}function k(a,b,c,d){return function(e){g(e.content?
e.content:e.dae?e.scene:e,a,b,c,d);L-=1;p.onLoadComplete();n()}}function l(a){return function(b,c){b.name=a;B.geometries[a]=b;B.face_materials[a]=c}}function n(){p.callbackProgress({totalModels:N,totalTextures:J,loadedModels:N-L,loadedTextures:J-x},B);p.onLoadProgress();if(0===L&&0===x){for(var a=0;a<K.length;a++){var c=K[a],d=B.objects[c.targetName];d?c.object.target=d:(c.object.target=new THREE.Object3D,B.scene.add(c.object.target));c.object.target.userData.targetInverse=c.object}b(B)}}function q(a,
b){b(a);if(void 0!==a.children)for(var c in a.children)q(a.children[c],b)}var p=this,s=THREE.Loader.prototype.extractUrlBase(c),t,r,v,w,u,y,L,x,N,J,B,K=[],A=a,G;for(G in this.geometryHandlers)a=this.geometryHandlers[G].loaderClass,this.geometryHandlers[G].loaderObject=new a;for(G in this.hierarchyHandlers)a=this.hierarchyHandlers[G].loaderClass,this.hierarchyHandlers[G].loaderObject=new a;x=L=0;B={scene:new THREE.Scene,geometries:{},face_materials:{},materials:{},textures:{},objects:{},cameras:{},
lights:{},fogs:{},empties:{},groups:{}};A.transform&&(G=A.transform.position,a=A.transform.rotation,c=A.transform.scale,G&&B.scene.position.fromArray(G),a&&B.scene.rotation.fromArray(a),c&&B.scene.scale.fromArray(c),G||a||c)&&(B.scene.updateMatrix(),B.scene.updateMatrixWorld());G=function(a){return function(){x-=a;n();p.onLoadComplete()}};for(var D in A.fogs)a=A.fogs[D],"linear"===a.type?w=new THREE.Fog(0,a.near,a.far):"exp2"===a.type&&(w=new THREE.FogExp2(0,a.density)),a=a.color,w.color.setRGB(a[0],
a[1],a[2]),B.fogs[D]=w;for(var C in A.geometries)w=A.geometries[C],w.type in this.geometryHandlers&&(L+=1,p.onLoadStart());for(var F in A.objects)q(A.objects[F],function(a){a.type&&a.type in p.hierarchyHandlers&&(L+=1,p.onLoadStart())});N=L;for(C in A.geometries)if(w=A.geometries[C],"cube"===w.type)t=new THREE.BoxGeometry(w.width,w.height,w.depth,w.widthSegments,w.heightSegments,w.depthSegments),t.name=C,B.geometries[C]=t;else if("plane"===w.type)t=new THREE.PlaneGeometry(w.width,w.height,w.widthSegments,
w.heightSegments),t.name=C,B.geometries[C]=t;else if("sphere"===w.type)t=new THREE.SphereGeometry(w.radius,w.widthSegments,w.heightSegments),t.name=C,B.geometries[C]=t;else if("cylinder"===w.type)t=new THREE.CylinderGeometry(w.topRad,w.botRad,w.height,w.radSegs,w.heightSegs),t.name=C,B.geometries[C]=t;else if("torus"===w.type)t=new THREE.TorusGeometry(w.radius,w.tube,w.segmentsR,w.segmentsT),t.name=C,B.geometries[C]=t;else if("icosahedron"===w.type)t=new THREE.IcosahedronGeometry(w.radius,w.subdivisions),
t.name=C,B.geometries[C]=t;else if(w.type in this.geometryHandlers){F={};for(u in w)"type"!==u&&"url"!==u&&(F[u]=w[u]);this.geometryHandlers[w.type].loaderObject.load(d(w.url,A.urlBaseType),h(C),F)}else"embedded"===w.type&&(F=A.embeds[w.id],F.metadata=A.metadata,F&&(F=this.geometryHandlers.ascii.loaderObject.parse(F,""),l(C)(F.geometry,F.materials)));for(var z in A.textures)if(C=A.textures[z],C.url instanceof Array)for(x+=C.url.length,u=0;u<C.url.length;u++)p.onLoadStart();else x+=1,p.onLoadStart();
J=x;for(z in A.textures){C=A.textures[z];void 0!==C.mapping&&void 0!==THREE[C.mapping]&&(C.mapping=new THREE[C.mapping]);if(C.url instanceof Array){F=C.url.length;w=[];for(u=0;u<F;u++)w[u]=d(C.url[u],A.urlBaseType);u=(u=/\.dds$/i.test(w[0]))?THREE.ImageUtils.loadCompressedTextureCube(w,C.mapping,G(F)):THREE.ImageUtils.loadTextureCube(w,C.mapping,G(F))}else u=/\.dds$/i.test(C.url),F=d(C.url,A.urlBaseType),w=G(1),u=u?THREE.ImageUtils.loadCompressedTexture(F,C.mapping,w):THREE.ImageUtils.loadTexture(F,
C.mapping,w),void 0!==THREE[C.minFilter]&&(u.minFilter=THREE[C.minFilter]),void 0!==THREE[C.magFilter]&&(u.magFilter=THREE[C.magFilter]),C.anisotropy&&(u.anisotropy=C.anisotropy),C.repeat&&(u.repeat.set(C.repeat[0],C.repeat[1]),1!==C.repeat[0]&&(u.wrapS=THREE.RepeatWrapping),1!==C.repeat[1]&&(u.wrapT=THREE.RepeatWrapping)),C.offset&&u.offset.set(C.offset[0],C.offset[1]),C.wrap&&(F={repeat:THREE.RepeatWrapping,mirror:THREE.MirroredRepeatWrapping},void 0!==F[C.wrap[0]]&&(u.wrapS=F[C.wrap[0]]),void 0!==
F[C.wrap[1]]&&(u.wrapT=F[C.wrap[1]]));B.textures[z]=u}var H,E;for(H in A.materials){z=A.materials[H];for(E in z.parameters)"envMap"===E||"map"===E||"lightMap"===E||"bumpMap"===E?z.parameters[E]=B.textures[z.parameters[E]]:"shading"===E?z.parameters[E]="flat"===z.parameters[E]?THREE.FlatShading:THREE.SmoothShading:"side"===E?z.parameters[E]="double"==z.parameters[E]?THREE.DoubleSide:"back"==z.parameters[E]?THREE.BackSide:THREE.FrontSide:"blending"===E?z.parameters[E]=z.parameters[E]in THREE?THREE[z.parameters[E]]:
THREE.NormalBlending:"combine"===E?z.parameters[E]=z.parameters[E]in THREE?THREE[z.parameters[E]]:THREE.MultiplyOperation:"vertexColors"===E?"face"==z.parameters[E]?z.parameters[E]=THREE.FaceColors:z.parameters[E]&&(z.parameters[E]=THREE.VertexColors):"wrapRGB"===E&&(G=z.parameters[E],z.parameters[E]=new THREE.Vector3(G[0],G[1],G[2]));void 0!==z.parameters.opacity&&1>z.parameters.opacity&&(z.parameters.transparent=!0);z.parameters.normalMap?(G=THREE.ShaderLib.normalmap,C=THREE.UniformsUtils.clone(G.uniforms),
u=z.parameters.color,F=z.parameters.specular,w=z.parameters.ambient,D=z.parameters.shininess,C.tNormal.value=B.textures[z.parameters.normalMap],z.parameters.normalScale&&C.uNormalScale.value.set(z.parameters.normalScale[0],z.parameters.normalScale[1]),z.parameters.map&&(C.tDiffuse.value=z.parameters.map,C.enableDiffuse.value=!0),z.parameters.envMap&&(C.tCube.value=z.parameters.envMap,C.enableReflection.value=!0,C.reflectivity.value=z.parameters.reflectivity),z.parameters.lightMap&&(C.tAO.value=z.parameters.lightMap,
C.enableAO.value=!0),z.parameters.specularMap&&(C.tSpecular.value=B.textures[z.parameters.specularMap],C.enableSpecular.value=!0),z.parameters.displacementMap&&(C.tDisplacement.value=B.textures[z.parameters.displacementMap],C.enableDisplacement.value=!0,C.uDisplacementBias.value=z.parameters.displacementBias,C.uDisplacementScale.value=z.parameters.displacementScale),C.diffuse.value.setHex(u),C.specular.value.setHex(F),C.ambient.value.setHex(w),C.shininess.value=D,z.parameters.opacity&&(C.opacity.value=
z.parameters.opacity),r=new THREE.ShaderMaterial({fragmentShader:G.fragmentShader,vertexShader:G.vertexShader,uniforms:C,lights:!0,fog:!0})):r=new THREE[z.type](z.parameters);r.name=H;B.materials[H]=r}for(H in A.materials)if(z=A.materials[H],z.parameters.materials){E=[];for(u=0;u<z.parameters.materials.length;u++)E.push(B.materials[z.parameters.materials[u]]);B.materials[H].materials=E}e();B.cameras&&A.defaults.camera&&(B.currentCamera=B.cameras[A.defaults.camera]);B.fogs&&A.defaults.fog&&(B.scene.fog=
B.fogs[A.defaults.fog]);p.callbackSync(B);n()}};THREE.TextureLoader=function(a){this.manager=void 0!==a?a:THREE.DefaultLoadingManager};THREE.TextureLoader.prototype={constructor:THREE.TextureLoader,load:function(a,b,c,d){c=new THREE.ImageLoader(this.manager);c.setCrossOrigin(this.crossOrigin);c.load(a,function(a){a=new THREE.Texture(a);a.needsUpdate=!0;void 0!==b&&b(a)})},setCrossOrigin:function(a){this.crossOrigin=a}};THREE.Material=function(){this.id=THREE.MaterialIdCount++;this.uuid=THREE.Math.generateUUID();this.name="";this.side=THREE.FrontSide;this.opacity=1;this.transparent=!1;this.blending=THREE.NormalBlending;this.blendSrc=THREE.SrcAlphaFactor;this.blendDst=THREE.OneMinusSrcAlphaFactor;this.blendEquation=THREE.AddEquation;this.depthWrite=this.depthTest=!0;this.polygonOffset=!1;this.overdraw=this.alphaTest=this.polygonOffsetUnits=this.polygonOffsetFactor=0;this.needsUpdate=this.visible=!0};
THREE.Material.prototype={constructor:THREE.Material,setValues:function(a){if(void 0!==a)for(var b in a){var c=a[b];if(void 0===c)console.warn("THREE.Material: '"+b+"' parameter is undefined.");else if(b in this){var d=this[b];d instanceof THREE.Color?d.set(c):d instanceof THREE.Vector3&&c instanceof THREE.Vector3?d.copy(c):this[b]="overdraw"==b?Number(c):c}}},clone:function(a){void 0===a&&(a=new THREE.Material);a.name=this.name;a.side=this.side;a.opacity=this.opacity;a.transparent=this.transparent;
a.blending=this.blending;a.blendSrc=this.blendSrc;a.blendDst=this.blendDst;a.blendEquation=this.blendEquation;a.depthTest=this.depthTest;a.depthWrite=this.depthWrite;a.polygonOffset=this.polygonOffset;a.polygonOffsetFactor=this.polygonOffsetFactor;a.polygonOffsetUnits=this.polygonOffsetUnits;a.alphaTest=this.alphaTest;a.overdraw=this.overdraw;a.visible=this.visible;return a},dispose:function(){this.dispatchEvent({type:"dispose"})}};THREE.EventDispatcher.prototype.apply(THREE.Material.prototype);
THREE.MaterialIdCount=0;THREE.LineBasicMaterial=function(a){THREE.Material.call(this);this.color=new THREE.Color(16777215);this.linewidth=1;this.linejoin=this.linecap="round";this.vertexColors=!1;this.fog=!0;this.setValues(a)};THREE.LineBasicMaterial.prototype=Object.create(THREE.Material.prototype);
THREE.LineBasicMaterial.prototype.clone=function(){var a=new THREE.LineBasicMaterial;THREE.Material.prototype.clone.call(this,a);a.color.copy(this.color);a.linewidth=this.linewidth;a.linecap=this.linecap;a.linejoin=this.linejoin;a.vertexColors=this.vertexColors;a.fog=this.fog;return a};THREE.LineDashedMaterial=function(a){THREE.Material.call(this);this.color=new THREE.Color(16777215);this.scale=this.linewidth=1;this.dashSize=3;this.gapSize=1;this.vertexColors=!1;this.fog=!0;this.setValues(a)};THREE.LineDashedMaterial.prototype=Object.create(THREE.Material.prototype);
THREE.LineDashedMaterial.prototype.clone=function(){var a=new THREE.LineDashedMaterial;THREE.Material.prototype.clone.call(this,a);a.color.copy(this.color);a.linewidth=this.linewidth;a.scale=this.scale;a.dashSize=this.dashSize;a.gapSize=this.gapSize;a.vertexColors=this.vertexColors;a.fog=this.fog;return a};THREE.MeshBasicMaterial=function(a){THREE.Material.call(this);this.color=new THREE.Color(16777215);this.envMap=this.specularMap=this.lightMap=this.map=null;this.combine=THREE.MultiplyOperation;this.reflectivity=1;this.refractionRatio=0.98;this.fog=!0;this.shading=THREE.SmoothShading;this.wireframe=!1;this.wireframeLinewidth=1;this.wireframeLinejoin=this.wireframeLinecap="round";this.vertexColors=THREE.NoColors;this.morphTargets=this.skinning=!1;this.setValues(a)};
THREE.MeshBasicMaterial.prototype=Object.create(THREE.Material.prototype);
THREE.MeshBasicMaterial.prototype.clone=function(){var a=new THREE.MeshBasicMaterial;THREE.Material.prototype.clone.call(this,a);a.color.copy(this.color);a.map=this.map;a.lightMap=this.lightMap;a.specularMap=this.specularMap;a.envMap=this.envMap;a.combine=this.combine;a.reflectivity=this.reflectivity;a.refractionRatio=this.refractionRatio;a.fog=this.fog;a.shading=this.shading;a.wireframe=this.wireframe;a.wireframeLinewidth=this.wireframeLinewidth;a.wireframeLinecap=this.wireframeLinecap;a.wireframeLinejoin=
this.wireframeLinejoin;a.vertexColors=this.vertexColors;a.skinning=this.skinning;a.morphTargets=this.morphTargets;return a};THREE.MeshLambertMaterial=function(a){THREE.Material.call(this);this.color=new THREE.Color(16777215);this.ambient=new THREE.Color(16777215);this.emissive=new THREE.Color(0);this.wrapAround=!1;this.wrapRGB=new THREE.Vector3(1,1,1);this.envMap=this.specularMap=this.lightMap=this.map=null;this.combine=THREE.MultiplyOperation;this.reflectivity=1;this.refractionRatio=0.98;this.fog=!0;this.shading=THREE.SmoothShading;this.wireframe=!1;this.wireframeLinewidth=1;this.wireframeLinejoin=this.wireframeLinecap=
"round";this.vertexColors=THREE.NoColors;this.morphNormals=this.morphTargets=this.skinning=!1;this.setValues(a)};THREE.MeshLambertMaterial.prototype=Object.create(THREE.Material.prototype);
THREE.MeshLambertMaterial.prototype.clone=function(){var a=new THREE.MeshLambertMaterial;THREE.Material.prototype.clone.call(this,a);a.color.copy(this.color);a.ambient.copy(this.ambient);a.emissive.copy(this.emissive);a.wrapAround=this.wrapAround;a.wrapRGB.copy(this.wrapRGB);a.map=this.map;a.lightMap=this.lightMap;a.specularMap=this.specularMap;a.envMap=this.envMap;a.combine=this.combine;a.reflectivity=this.reflectivity;a.refractionRatio=this.refractionRatio;a.fog=this.fog;a.shading=this.shading;
a.wireframe=this.wireframe;a.wireframeLinewidth=this.wireframeLinewidth;a.wireframeLinecap=this.wireframeLinecap;a.wireframeLinejoin=this.wireframeLinejoin;a.vertexColors=this.vertexColors;a.skinning=this.skinning;a.morphTargets=this.morphTargets;a.morphNormals=this.morphNormals;return a};THREE.MeshPhongMaterial=function(a){THREE.Material.call(this);this.color=new THREE.Color(16777215);this.ambient=new THREE.Color(16777215);this.emissive=new THREE.Color(0);this.specular=new THREE.Color(1118481);this.shininess=30;this.wrapAround=this.metal=!1;this.wrapRGB=new THREE.Vector3(1,1,1);this.bumpMap=this.lightMap=this.map=null;this.bumpScale=1;this.normalMap=null;this.normalScale=new THREE.Vector2(1,1);this.envMap=this.specularMap=null;this.combine=THREE.MultiplyOperation;this.reflectivity=
1;this.refractionRatio=0.98;this.fog=!0;this.shading=THREE.SmoothShading;this.wireframe=!1;this.wireframeLinewidth=1;this.wireframeLinejoin=this.wireframeLinecap="round";this.vertexColors=THREE.NoColors;this.morphNormals=this.morphTargets=this.skinning=!1;this.setValues(a)};THREE.MeshPhongMaterial.prototype=Object.create(THREE.Material.prototype);
THREE.MeshPhongMaterial.prototype.clone=function(){var a=new THREE.MeshPhongMaterial;THREE.Material.prototype.clone.call(this,a);a.color.copy(this.color);a.ambient.copy(this.ambient);a.emissive.copy(this.emissive);a.specular.copy(this.specular);a.shininess=this.shininess;a.metal=this.metal;a.wrapAround=this.wrapAround;a.wrapRGB.copy(this.wrapRGB);a.map=this.map;a.lightMap=this.lightMap;a.bumpMap=this.bumpMap;a.bumpScale=this.bumpScale;a.normalMap=this.normalMap;a.normalScale.copy(this.normalScale);
a.specularMap=this.specularMap;a.envMap=this.envMap;a.combine=this.combine;a.reflectivity=this.reflectivity;a.refractionRatio=this.refractionRatio;a.fog=this.fog;a.shading=this.shading;a.wireframe=this.wireframe;a.wireframeLinewidth=this.wireframeLinewidth;a.wireframeLinecap=this.wireframeLinecap;a.wireframeLinejoin=this.wireframeLinejoin;a.vertexColors=this.vertexColors;a.skinning=this.skinning;a.morphTargets=this.morphTargets;a.morphNormals=this.morphNormals;return a};THREE.MeshDepthMaterial=function(a){THREE.Material.call(this);this.wireframe=this.morphTargets=!1;this.wireframeLinewidth=1;this.setValues(a)};THREE.MeshDepthMaterial.prototype=Object.create(THREE.Material.prototype);THREE.MeshDepthMaterial.prototype.clone=function(){var a=new THREE.MeshDepthMaterial;THREE.Material.prototype.clone.call(this,a);a.wireframe=this.wireframe;a.wireframeLinewidth=this.wireframeLinewidth;return a};THREE.MeshNormalMaterial=function(a){THREE.Material.call(this,a);this.shading=THREE.FlatShading;this.wireframe=!1;this.wireframeLinewidth=1;this.morphTargets=!1;this.setValues(a)};THREE.MeshNormalMaterial.prototype=Object.create(THREE.Material.prototype);THREE.MeshNormalMaterial.prototype.clone=function(){var a=new THREE.MeshNormalMaterial;THREE.Material.prototype.clone.call(this,a);a.shading=this.shading;a.wireframe=this.wireframe;a.wireframeLinewidth=this.wireframeLinewidth;return a};THREE.MeshFaceMaterial=function(a){this.materials=a instanceof Array?a:[]};THREE.MeshFaceMaterial.prototype.clone=function(){for(var a=new THREE.MeshFaceMaterial,b=0;b<this.materials.length;b++)a.materials.push(this.materials[b].clone());return a};THREE.ParticleSystemMaterial=function(a){THREE.Material.call(this);this.color=new THREE.Color(16777215);this.map=null;this.size=1;this.sizeAttenuation=!0;this.vertexColors=!1;this.fog=!0;this.setValues(a)};THREE.ParticleSystemMaterial.prototype=Object.create(THREE.Material.prototype);
THREE.ParticleSystemMaterial.prototype.clone=function(){var a=new THREE.ParticleSystemMaterial;THREE.Material.prototype.clone.call(this,a);a.color.copy(this.color);a.map=this.map;a.size=this.size;a.sizeAttenuation=this.sizeAttenuation;a.vertexColors=this.vertexColors;a.fog=this.fog;return a};THREE.ParticleBasicMaterial=THREE.ParticleSystemMaterial;THREE.ShaderMaterial=function(a){THREE.Material.call(this);this.vertexShader=this.fragmentShader="void main() {}";this.uniforms={};this.defines={};this.attributes=null;this.shading=THREE.SmoothShading;this.linewidth=1;this.wireframe=!1;this.wireframeLinewidth=1;this.lights=this.fog=!1;this.vertexColors=THREE.NoColors;this.morphNormals=this.morphTargets=this.skinning=!1;this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv2:[0,0]};this.index0AttributeName=void 0;this.setValues(a)};
THREE.ShaderMaterial.prototype=Object.create(THREE.Material.prototype);
THREE.ShaderMaterial.prototype.clone=function(){var a=new THREE.ShaderMaterial;THREE.Material.prototype.clone.call(this,a);a.fragmentShader=this.fragmentShader;a.vertexShader=this.vertexShader;a.uniforms=THREE.UniformsUtils.clone(this.uniforms);a.attributes=this.attributes;a.defines=this.defines;a.shading=this.shading;a.wireframe=this.wireframe;a.wireframeLinewidth=this.wireframeLinewidth;a.fog=this.fog;a.lights=this.lights;a.vertexColors=this.vertexColors;a.skinning=this.skinning;a.morphTargets=
this.morphTargets;a.morphNormals=this.morphNormals;return a};THREE.RawShaderMaterial=function(a){THREE.ShaderMaterial.call(this,a)};THREE.RawShaderMaterial.prototype=Object.create(THREE.ShaderMaterial.prototype);THREE.RawShaderMaterial.prototype.clone=function(){var a=new THREE.RawShaderMaterial;THREE.ShaderMaterial.prototype.clone.call(this,a);return a};THREE.SpriteMaterial=function(a){THREE.Material.call(this);this.color=new THREE.Color(16777215);this.map=null;this.rotation=0;this.fog=!1;this.setValues(a)};THREE.SpriteMaterial.prototype=Object.create(THREE.Material.prototype);THREE.SpriteMaterial.prototype.clone=function(){var a=new THREE.SpriteMaterial;THREE.Material.prototype.clone.call(this,a);a.color.copy(this.color);a.map=this.map;a.rotation=this.rotation;a.fog=this.fog;return a};THREE.SpriteCanvasMaterial=function(a){THREE.Material.call(this);this.color=new THREE.Color(16777215);this.program=function(a,c){};this.setValues(a)};THREE.SpriteCanvasMaterial.prototype=Object.create(THREE.Material.prototype);THREE.SpriteCanvasMaterial.prototype.clone=function(){var a=new THREE.SpriteCanvasMaterial;THREE.Material.prototype.clone.call(this,a);a.color.copy(this.color);a.program=this.program;return a};THREE.ParticleCanvasMaterial=THREE.SpriteCanvasMaterial;THREE.Texture=function(a,b,c,d,e,f,g,h,k){this.id=THREE.TextureIdCount++;this.uuid=THREE.Math.generateUUID();this.name="";this.image=a;this.mipmaps=[];this.mapping=void 0!==b?b:new THREE.UVMapping;this.wrapS=void 0!==c?c:THREE.ClampToEdgeWrapping;this.wrapT=void 0!==d?d:THREE.ClampToEdgeWrapping;this.magFilter=void 0!==e?e:THREE.LinearFilter;this.minFilter=void 0!==f?f:THREE.LinearMipMapLinearFilter;this.anisotropy=void 0!==k?k:1;this.format=void 0!==g?g:THREE.RGBAFormat;this.type=void 0!==h?h:THREE.UnsignedByteType;
this.offset=new THREE.Vector2(0,0);this.repeat=new THREE.Vector2(1,1);this.generateMipmaps=!0;this.premultiplyAlpha=!1;this.flipY=!0;this.unpackAlignment=4;this._needsUpdate=!1;this.onUpdate=null};
THREE.Texture.prototype={constructor:THREE.Texture,get needsUpdate(){return this._needsUpdate},set needsUpdate(a){!0===a&&this.update();this._needsUpdate=a},clone:function(a){void 0===a&&(a=new THREE.Texture);a.image=this.image;a.mipmaps=this.mipmaps.slice(0);a.mapping=this.mapping;a.wrapS=this.wrapS;a.wrapT=this.wrapT;a.magFilter=this.magFilter;a.minFilter=this.minFilter;a.anisotropy=this.anisotropy;a.format=this.format;a.type=this.type;a.offset.copy(this.offset);a.repeat.copy(this.repeat);a.generateMipmaps=
this.generateMipmaps;a.premultiplyAlpha=this.premultiplyAlpha;a.flipY=this.flipY;a.unpackAlignment=this.unpackAlignment;return a},update:function(){this.dispatchEvent({type:"update"})},dispose:function(){this.dispatchEvent({type:"dispose"})}};THREE.EventDispatcher.prototype.apply(THREE.Texture.prototype);THREE.TextureIdCount=0;THREE.CompressedTexture=function(a,b,c,d,e,f,g,h,k,l,n){THREE.Texture.call(this,null,f,g,h,k,l,d,e,n);this.image={width:b,height:c};this.mipmaps=a;this.generateMipmaps=!1};THREE.CompressedTexture.prototype=Object.create(THREE.Texture.prototype);THREE.CompressedTexture.prototype.clone=function(){var a=new THREE.CompressedTexture;THREE.Texture.prototype.clone.call(this,a);return a};THREE.DataTexture=function(a,b,c,d,e,f,g,h,k,l,n){THREE.Texture.call(this,null,f,g,h,k,l,d,e,n);this.image={data:a,width:b,height:c}};THREE.DataTexture.prototype=Object.create(THREE.Texture.prototype);THREE.DataTexture.prototype.clone=function(){var a=new THREE.DataTexture;THREE.Texture.prototype.clone.call(this,a);return a};THREE.ParticleSystem=function(a,b){THREE.Object3D.call(this);this.geometry=void 0!==a?a:new THREE.Geometry;this.material=void 0!==b?b:new THREE.ParticleSystemMaterial({color:16777215*Math.random()});this.frustumCulled=this.sortParticles=!1};THREE.ParticleSystem.prototype=Object.create(THREE.Object3D.prototype);
THREE.ParticleSystem.prototype.clone=function(a){void 0===a&&(a=new THREE.ParticleSystem(this.geometry,this.material));a.sortParticles=this.sortParticles;THREE.Object3D.prototype.clone.call(this,a);return a};THREE.Line=function(a,b,c){THREE.Object3D.call(this);this.geometry=void 0!==a?a:new THREE.Geometry;this.material=void 0!==b?b:new THREE.LineBasicMaterial({color:16777215*Math.random()});this.type=void 0!==c?c:THREE.LineStrip};THREE.LineStrip=0;THREE.LinePieces=1;THREE.Line.prototype=Object.create(THREE.Object3D.prototype);THREE.Line.prototype.clone=function(a){void 0===a&&(a=new THREE.Line(this.geometry,this.material,this.type));THREE.Object3D.prototype.clone.call(this,a);return a};THREE.Mesh=function(a,b){THREE.Object3D.call(this);this.geometry=void 0!==a?a:new THREE.Geometry;this.material=void 0!==b?b:new THREE.MeshBasicMaterial({color:16777215*Math.random()});this.updateMorphTargets()};THREE.Mesh.prototype=Object.create(THREE.Object3D.prototype);
THREE.Mesh.prototype.updateMorphTargets=function(){if(void 0!==this.geometry.morphTargets&&0<this.geometry.morphTargets.length){this.morphTargetBase=-1;this.morphTargetForcedOrder=[];this.morphTargetInfluences=[];this.morphTargetDictionary={};for(var a=0,b=this.geometry.morphTargets.length;a<b;a++)this.morphTargetInfluences.push(0),this.morphTargetDictionary[this.geometry.morphTargets[a].name]=a}};
THREE.Mesh.prototype.getMorphTargetIndexByName=function(a){if(void 0!==this.morphTargetDictionary[a])return this.morphTargetDictionary[a];console.log("THREE.Mesh.getMorphTargetIndexByName: morph target "+a+" does not exist. Returning 0.");return 0};THREE.Mesh.prototype.clone=function(a,b){void 0===a&&(a=new THREE.Mesh(this.geometry,this.material));THREE.Object3D.prototype.clone.call(this,a,b);return a};THREE.Bone=function(a){THREE.Object3D.call(this);this.skin=a;this.skinMatrix=new THREE.Matrix4;this.accumulatedSclWeight=this.accumulatedPosWeight=this.accumulatedRotWeight=0};THREE.Bone.prototype=Object.create(THREE.Object3D.prototype);
THREE.Bone.prototype.update=function(a,b){this.matrixAutoUpdate&&(b|=this.updateMatrix());if(b||this.matrixWorldNeedsUpdate)a?this.skinMatrix.multiplyMatrices(a,this.matrix):this.skinMatrix.copy(this.matrix),this.matrixWorldNeedsUpdate=!1,b=!0,this.accumulatedSclWeight=this.accumulatedPosWeight=this.accumulatedRotWeight=0;for(var c=0,d=this.children.length;c<d;c++)this.children[c].update(this.skinMatrix,b)};THREE.Skeleton=function(a,b){this.useVertexTexture=void 0!==b?b:!0;this.bones=[];this.boneMatrices=[];var c,d,e,f,g;if(void 0!==a){for(var h=0;h<a.length;++h)d=a[h],e=d.pos,f=d.rotq,g=d.scl,c=this.addBone(),c.name=d.name,c.position.set(e[0],e[1],e[2]),c.quaternion.set(f[0],f[1],f[2],f[3]),void 0!==g?c.scale.set(g[0],g[1],g[2]):c.scale.set(1,1,1);for(h=0;h<a.length;++h)d=a[h],-1!==d.parent&&this.bones[d.parent].add(this.bones[h]);c=this.bones.length;this.useVertexTexture?(this.boneTextureHeight=this.boneTextureWidth=
c=256<c?64:64<c?32:16<c?16:8,this.boneMatrices=new Float32Array(this.boneTextureWidth*this.boneTextureHeight*4),this.boneTexture=new THREE.DataTexture(this.boneMatrices,this.boneTextureWidth,this.boneTextureHeight,THREE.RGBAFormat,THREE.FloatType),this.boneTexture.minFilter=THREE.NearestFilter,this.boneTexture.magFilter=THREE.NearestFilter,this.boneTexture.generateMipmaps=!1,this.boneTexture.flipY=!1):this.boneMatrices=new Float32Array(16*c)}};THREE.Skeleton.prototype=Object.create(THREE.Mesh.prototype);
THREE.Skeleton.prototype.addBone=function(a){void 0===a&&(a=new THREE.Bone(this));this.bones.push(a);return a};THREE.Skeleton.prototype.calculateInverses=function(a){this.boneInverses=[];a=0;for(var b=this.bones.length;a<b;++a){var c=new THREE.Matrix4;c.getInverse(this.bones[a].skinMatrix);this.boneInverses.push(c)}};THREE.SkinnedMesh=function(a,b,c){THREE.Mesh.call(this,a,b);this.skeleton=new THREE.Skeleton(this.geometry&&this.geometry.bones,c);for(a=0;a<this.skeleton.bones.length;++a)b=this.skeleton.bones[a],void 0===b.parent&&this.add(b);this.identityMatrix=new THREE.Matrix4;this.pose()};THREE.SkinnedMesh.prototype=Object.create(THREE.Mesh.prototype);
THREE.SkinnedMesh.prototype.updateMatrixWorld=function(){var a=new THREE.Matrix4;return function(b){this.matrixAutoUpdate&&this.updateMatrix();if(this.matrixWorldNeedsUpdate||b)this.parent?this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix):this.matrixWorld.copy(this.matrix),this.matrixWorldNeedsUpdate=!1;b=0;for(var c=this.children.length;b<c;b++){var d=this.children[b];d instanceof THREE.Bone?d.update(this.identityMatrix,!1):d.updateMatrixWorld(!0)}void 0===this.skeleton.boneInverses&&
this.skeleton.calculateInverses();b=0;for(c=this.skeleton.bones.length;b<c;b++)a.multiplyMatrices(this.skeleton.bones[b].skinMatrix,this.skeleton.boneInverses[b]),a.flattenToArrayOffset(this.skeleton.boneMatrices,16*b);this.skeleton.useVertexTexture&&(this.skeleton.boneTexture.needsUpdate=!0)}}();THREE.SkinnedMesh.prototype.pose=function(){this.updateMatrixWorld(!0);this.normalizeSkinWeights()};
THREE.SkinnedMesh.prototype.normalizeSkinWeights=function(){if(this.geometry instanceof THREE.Geometry)for(var a=0;a<this.geometry.skinIndices.length;a++){var b=this.geometry.skinWeights[a],c=1/b.lengthManhattan();Infinity!==c?b.multiplyScalar(c):b.set(1)}};THREE.SkinnedMesh.prototype.clone=function(a){void 0===a&&(a=new THREE.SkinnedMesh(this.geometry,this.material,this.useVertexTexture));THREE.Mesh.prototype.clone.call(this,a);return a};THREE.MorphAnimMesh=function(a,b){THREE.Mesh.call(this,a,b);this.duration=1E3;this.mirroredLoop=!1;this.currentKeyframe=this.lastKeyframe=this.time=0;this.direction=1;this.directionBackwards=!1;this.setFrameRange(0,this.geometry.morphTargets.length-1)};THREE.MorphAnimMesh.prototype=Object.create(THREE.Mesh.prototype);THREE.MorphAnimMesh.prototype.setFrameRange=function(a,b){this.startKeyframe=a;this.endKeyframe=b;this.length=this.endKeyframe-this.startKeyframe+1};
THREE.MorphAnimMesh.prototype.setDirectionForward=function(){this.direction=1;this.directionBackwards=!1};THREE.MorphAnimMesh.prototype.setDirectionBackward=function(){this.direction=-1;this.directionBackwards=!0};
THREE.MorphAnimMesh.prototype.parseAnimations=function(){var a=this.geometry;a.animations||(a.animations={});for(var b,c=a.animations,d=/([a-z]+)(\d+)/,e=0,f=a.morphTargets.length;e<f;e++){var g=a.morphTargets[e].name.match(d);if(g&&1<g.length){g=g[1];c[g]||(c[g]={start:Infinity,end:-Infinity});var h=c[g];e<h.start&&(h.start=e);e>h.end&&(h.end=e);b||(b=g)}}a.firstAnimation=b};
THREE.MorphAnimMesh.prototype.setAnimationLabel=function(a,b,c){this.geometry.animations||(this.geometry.animations={});this.geometry.animations[a]={start:b,end:c}};THREE.MorphAnimMesh.prototype.playAnimation=function(a,b){var c=this.geometry.animations[a];c?(this.setFrameRange(c.start,c.end),this.duration=(c.end-c.start)/b*1E3,this.time=0):console.warn("animation["+a+"] undefined")};
THREE.MorphAnimMesh.prototype.updateAnimation=function(a){var b=this.duration/this.length;this.time+=this.direction*a;if(this.mirroredLoop){if(this.time>this.duration||0>this.time)this.direction*=-1,this.time>this.duration&&(this.time=this.duration,this.directionBackwards=!0),0>this.time&&(this.time=0,this.directionBackwards=!1)}else this.time%=this.duration,0>this.time&&(this.time+=this.duration);a=this.startKeyframe+THREE.Math.clamp(Math.floor(this.time/b),0,this.length-1);a!==this.currentKeyframe&&
(this.morphTargetInfluences[this.lastKeyframe]=0,this.morphTargetInfluences[this.currentKeyframe]=1,this.morphTargetInfluences[a]=0,this.lastKeyframe=this.currentKeyframe,this.currentKeyframe=a);b=this.time%b/b;this.directionBackwards&&(b=1-b);this.morphTargetInfluences[this.currentKeyframe]=b;this.morphTargetInfluences[this.lastKeyframe]=1-b};
THREE.MorphAnimMesh.prototype.clone=function(a){void 0===a&&(a=new THREE.MorphAnimMesh(this.geometry,this.material));a.duration=this.duration;a.mirroredLoop=this.mirroredLoop;a.time=this.time;a.lastKeyframe=this.lastKeyframe;a.currentKeyframe=this.currentKeyframe;a.direction=this.direction;a.directionBackwards=this.directionBackwards;THREE.Mesh.prototype.clone.call(this,a);return a};THREE.LOD=function(){THREE.Object3D.call(this);this.objects=[]};THREE.LOD.prototype=Object.create(THREE.Object3D.prototype);THREE.LOD.prototype.addLevel=function(a,b){void 0===b&&(b=0);b=Math.abs(b);for(var c=0;c<this.objects.length&&!(b<this.objects[c].distance);c++);this.objects.splice(c,0,{distance:b,object:a});this.add(a)};THREE.LOD.prototype.getObjectForDistance=function(a){for(var b=1,c=this.objects.length;b<c&&!(a<this.objects[b].distance);b++);return this.objects[b-1].object};
THREE.LOD.prototype.update=function(){var a=new THREE.Vector3,b=new THREE.Vector3;return function(c){if(1<this.objects.length){a.setFromMatrixPosition(c.matrixWorld);b.setFromMatrixPosition(this.matrixWorld);c=a.distanceTo(b);this.objects[0].object.visible=!0;for(var d=1,e=this.objects.length;d<e;d++)if(c>=this.objects[d].distance)this.objects[d-1].object.visible=!1,this.objects[d].object.visible=!0;else break;for(;d<e;d++)this.objects[d].object.visible=!1}}}();
THREE.LOD.prototype.clone=function(a){void 0===a&&(a=new THREE.LOD);THREE.Object3D.prototype.clone.call(this,a);for(var b=0,c=this.objects.length;b<c;b++){var d=this.objects[b].object.clone();d.visible=0===b;a.addLevel(d,this.objects[b].distance)}return a};THREE.Sprite=function(){var a=new THREE.Float32Attribute(3,3);a.set([-0.5,-0.5,0,0.5,-0.5,0,0.5,0.5,0]);var b=new THREE.BufferGeometry;b.addAttribute("position",a);return function(a){THREE.Object3D.call(this);this.geometry=b;this.material=void 0!==a?a:new THREE.SpriteMaterial}}();THREE.Sprite.prototype=Object.create(THREE.Object3D.prototype);THREE.Sprite.prototype.updateMatrix=function(){this.matrix.compose(this.position,this.quaternion,this.scale);this.matrixWorldNeedsUpdate=!0};
THREE.Sprite.prototype.clone=function(a){void 0===a&&(a=new THREE.Sprite(this.material));THREE.Object3D.prototype.clone.call(this,a);return a};THREE.Particle=THREE.Sprite;THREE.Scene=function(){THREE.Object3D.call(this);this.overrideMaterial=this.fog=null;this.autoUpdate=!0;this.matrixAutoUpdate=!1;this.__lights=[];this.__objectsAdded=[];this.__objectsRemoved=[]};THREE.Scene.prototype=Object.create(THREE.Object3D.prototype);
THREE.Scene.prototype.__addObject=function(a){if(a instanceof THREE.Light)-1===this.__lights.indexOf(a)&&this.__lights.push(a),a.target&&void 0===a.target.parent&&this.add(a.target);else if(!(a instanceof THREE.Camera||a instanceof THREE.Bone)){this.__objectsAdded.push(a);var b=this.__objectsRemoved.indexOf(a);-1!==b&&this.__objectsRemoved.splice(b,1)}this.dispatchEvent({type:"objectAdded",object:a});a.dispatchEvent({type:"addedToScene",scene:this});for(b=0;b<a.children.length;b++)this.__addObject(a.children[b])};
THREE.Scene.prototype.__removeObject=function(a){if(a instanceof THREE.Light){var b=this.__lights.indexOf(a);-1!==b&&this.__lights.splice(b,1);if(a.shadowCascadeArray)for(b=0;b<a.shadowCascadeArray.length;b++)this.__removeObject(a.shadowCascadeArray[b])}else a instanceof THREE.Camera||(this.__objectsRemoved.push(a),b=this.__objectsAdded.indexOf(a),-1!==b&&this.__objectsAdded.splice(b,1));this.dispatchEvent({type:"objectRemoved",object:a});a.dispatchEvent({type:"removedFromScene",scene:this});for(b=
0;b<a.children.length;b++)this.__removeObject(a.children[b])};THREE.Scene.prototype.clone=function(a){void 0===a&&(a=new THREE.Scene);THREE.Object3D.prototype.clone.call(this,a);null!==this.fog&&(a.fog=this.fog.clone());null!==this.overrideMaterial&&(a.overrideMaterial=this.overrideMaterial.clone());a.autoUpdate=this.autoUpdate;a.matrixAutoUpdate=this.matrixAutoUpdate;return a};THREE.Fog=function(a,b,c){this.name="";this.color=new THREE.Color(a);this.near=void 0!==b?b:1;this.far=void 0!==c?c:1E3};THREE.Fog.prototype.clone=function(){return new THREE.Fog(this.color.getHex(),this.near,this.far)};THREE.FogExp2=function(a,b){this.name="";this.color=new THREE.Color(a);this.density=void 0!==b?b:2.5E-4};THREE.FogExp2.prototype.clone=function(){return new THREE.FogExp2(this.color.getHex(),this.density)};THREE.CanvasRenderer=function(a){function b(a,b,c,d){l(b);n(c);q(d);p(a.getStyle());A.stroke();qa.expandByScalar(2*b)}function c(a){s(a.getStyle());A.fill()}function d(a){e(a.target)}function e(a){var b=a.wrapS===THREE.RepeatWrapping,c=a.wrapT===THREE.RepeatWrapping,d=a.image,e=document.createElement("canvas");e.width=d.width;e.height=d.height;var f=e.getContext("2d");f.setTransform(1,0,0,-1,0,d.height);f.drawImage(d,0,0);Ga[a.id]=A.createPattern(e,!0===b&&!0===c?"repeat":!0===b&&!1===c?"repeat-x":
!1===b&&!0===c?"repeat-y":"no-repeat")}function f(a,b,c,f,g,h,k,l,n,m,p,r,q){if(!(q instanceof THREE.DataTexture)){!1===q.hasEventListener("update",d)&&(void 0!==q.image&&0<q.image.width&&e(q),q.addEventListener("update",d));var t=Ga[q.id];if(void 0!==t){s(t);var t=q.offset.x/q.repeat.x,u=q.offset.y/q.repeat.y,w=q.image.width*q.repeat.x;q=q.image.height*q.repeat.y;k=(k+t)*w;l=(l+u)*q;c-=a;f-=b;g-=a;h-=b;n=(n+t)*w-k;m=(m+u)*q-l;p=(p+t)*w-k;r=(r+u)*q-l;q=n*r-p*m;0!==q&&(t=1/q,q=(r*c-m*g)*t,m=(r*f-m*
h)*t,c=(n*g-p*c)*t,f=(n*h-p*f)*t,a=a-q*k-c*l,b=b-m*k-f*l,A.save(),A.transform(q,m,c,f,a,b),A.fill(),A.restore())}else s("rgba(0,0,0,1)"),A.fill()}}function g(a,b,c){var d=b.x-a.x,e=b.y-a.y,f=d*d+e*e;0!==f&&(c/=Math.sqrt(f),d*=c,e*=c,b.x+=d,b.y+=e,a.x-=d,a.y-=e)}function h(a){C!==a&&(C=A.globalAlpha=a)}function k(a){F!==a&&(a===THREE.NormalBlending?A.globalCompositeOperation="source-over":a===THREE.AdditiveBlending?A.globalCompositeOperation="lighter":a===THREE.SubtractiveBlending&&(A.globalCompositeOperation=
"darker"),F=a)}function l(a){E!==a&&(E=A.lineWidth=a)}function n(a){Q!==a&&(Q=A.lineCap=a)}function q(a){Y!==a&&(Y=A.lineJoin=a)}function p(a){z!==a&&(z=A.strokeStyle=a)}function s(a){H!==a&&(H=A.fillStyle=a)}function t(a,b){if(U!==a||la!==b)A.setLineDash([a,b]),U=a,la=b}console.log("THREE.CanvasRenderer",THREE.REVISION);var r=THREE.Math.smoothstep;a=a||{};var v=this,w,u,y,L=new THREE.Projector,x=void 0!==a.canvas?a.canvas:document.createElement("canvas"),N=x.width,J=x.height,B=Math.floor(N/2),K=
Math.floor(J/2),A=x.getContext("2d",{alpha:!0===a.alpha}),G=new THREE.Color(0),D=0,C=1,F=0,z=null,H=null,E=null,Q=null,Y=null,U=null,la=0,W,R,I,da;new THREE.RenderableVertex;new THREE.RenderableVertex;var V,X,P,ga,wa,Ha,fa=new THREE.Color;new THREE.Color;new THREE.Color;new THREE.Color;new THREE.Color;var za=new THREE.Color,Ia=new THREE.Color,Ea=new THREE.Color,Ga={},ha,Oa,Ra,Sa,Fa,ia,ma,ya=new THREE.Box2,Z=new THREE.Box2,qa=new THREE.Box2,ua=new THREE.Color,Ca=new THREE.Color,va=new THREE.Color,
Da=new THREE.Vector3,Ja=new THREE.Vector3,ja=new THREE.Vector3,ra=new THREE.Matrix3;void 0===A.setLineDash&&(A.setLineDash=function(){});this.domElement=x;this.devicePixelRatio=void 0!==a.devicePixelRatio?a.devicePixelRatio:void 0!==self.devicePixelRatio?self.devicePixelRatio:1;this.sortElements=this.sortObjects=this.autoClear=!0;this.info={render:{vertices:0,faces:0}};this.supportsVertexTextures=function(){};this.setFaceCulling=function(){};this.setSize=function(a,b,c){N=a*this.devicePixelRatio;
J=b*this.devicePixelRatio;x.width=N;x.height=J;B=Math.floor(N/2);K=Math.floor(J/2);!1!==c&&(x.style.width=a+"px",x.style.height=b+"px");ya.min.set(-B,-K);ya.max.set(B,K);Z.min.set(-B,-K);Z.max.set(B,K);C=1;F=0;Y=Q=E=H=z=null;this.setViewport(0,0,a,b)};this.setViewport=function(a,b,c,d){A.setTransform(c*this.devicePixelRatio/N,0,0,-(d*this.devicePixelRatio)/J,a*this.devicePixelRatio,J-b*this.devicePixelRatio);A.translate(B,K)};this.setScissor=function(){};this.enableScissorTest=function(){};this.setClearColor=
function(a,b){G.set(a);D=void 0!==b?b:1;Z.min.set(-B,-K);Z.max.set(B,K)};this.setClearColorHex=function(a,b){console.warn("DEPRECATED: .setClearColorHex() is being removed. Use .setClearColor() instead.");this.setClearColor(a,b)};this.getMaxAnisotropy=function(){return 0};this.clear=function(){!1===Z.empty()&&(Z.intersect(ya),Z.expandByScalar(2),1>D&&A.clearRect(Z.min.x|0,Z.min.y|0,Z.max.x-Z.min.x|0,Z.max.y-Z.min.y|0),0<D&&(k(THREE.NormalBlending),h(1),s("rgba("+Math.floor(255*G.r)+","+Math.floor(255*
G.g)+","+Math.floor(255*G.b)+","+D+")"),A.fillRect(Z.min.x|0,Z.min.y|0,Z.max.x-Z.min.x|0,Z.max.y-Z.min.y|0)),Z.makeEmpty())};this.clearColor=function(){};this.clearDepth=function(){};this.clearStencil=function(){};this.render=function(a,x){if(!1===x instanceof THREE.Camera)console.error("THREE.CanvasRenderer.render: camera is not an instance of THREE.Camera.");else{!0===this.autoClear&&this.clear();v.info.render.vertices=0;v.info.render.faces=0;w=L.projectScene(a,x,this.sortObjects,this.sortElements);
u=w.elements;y=w.lights;W=x;ra.getNormalMatrix(x.matrixWorldInverse);ua.setRGB(0,0,0);Ca.setRGB(0,0,0);va.setRGB(0,0,0);for(var C=0,J=y.length;C<J;C++){var z=y[C],G=z.color;z instanceof THREE.AmbientLight?ua.add(G):z instanceof THREE.DirectionalLight?Ca.add(G):z instanceof THREE.PointLight&&va.add(G)}C=0;for(J=u.length;C<J;C++){var E=u[C],N=E.material;if(void 0!==N&&0!==N.opacity){qa.makeEmpty();if(E instanceof THREE.RenderableSprite){R=E;R.x*=B;R.y*=K;var z=R,H=E,G=N;h(G.opacity);k(G.blending);var m=
H.scale.x*B,H=H.scale.y*K,E=0.5*Math.sqrt(m*m+H*H);qa.min.set(z.x-E,z.y-E);qa.max.set(z.x+E,z.y+E);if(G instanceof THREE.SpriteMaterial||G instanceof THREE.ParticleSystemMaterial){var D=G.map;if(null!==D){!1===D.hasEventListener("update",d)&&(void 0!==D.image&&0<D.image.width&&e(D),D.addEventListener("update",d));E=Ga[D.id];void 0!==E?s(E):s("rgba( 0, 0, 0, 1 )");var F=D.image,E=F.width*D.offset.x,N=F.height*D.offset.y,Q=F.width*D.repeat.x,D=F.height*D.repeat.y,F=m/Q,U=H/D;A.save();A.translate(z.x,
z.y);0!==G.rotation&&A.rotate(G.rotation);A.translate(-m/2,-H/2);A.scale(F,U);A.translate(-E,-N);A.fillRect(E,N,Q,D)}else s(G.color.getStyle()),A.save(),A.translate(z.x,z.y),0!==G.rotation&&A.rotate(G.rotation),A.scale(m,-H),A.fillRect(-0.5,-0.5,1,1);A.restore()}else G instanceof THREE.SpriteCanvasMaterial&&(p(G.color.getStyle()),s(G.color.getStyle()),A.save(),A.translate(z.x,z.y),0!==G.rotation&&A.rotate(G.rotation),A.scale(m,H),G.program(A),A.restore())}else if(E instanceof THREE.RenderableLine){if(R=
E.v1,I=E.v2,R.positionScreen.x*=B,R.positionScreen.y*=K,I.positionScreen.x*=B,I.positionScreen.y*=K,qa.setFromPoints([R.positionScreen,I.positionScreen]),!0===ya.isIntersectionBox(qa))if(z=R,G=I,m=E,H=N,h(H.opacity),k(H.blending),A.beginPath(),A.moveTo(z.positionScreen.x,z.positionScreen.y),A.lineTo(G.positionScreen.x,G.positionScreen.y),H instanceof THREE.LineBasicMaterial){l(H.linewidth);n(H.linecap);q(H.linejoin);if(H.vertexColors!==THREE.VertexColors)p(H.color.getStyle());else if(E=m.vertexColors[0].getStyle(),
m=m.vertexColors[1].getStyle(),E===m)p(E);else{try{var Y=A.createLinearGradient(z.positionScreen.x,z.positionScreen.y,G.positionScreen.x,G.positionScreen.y);Y.addColorStop(0,E);Y.addColorStop(1,m)}catch(la){Y=E}p(Y)}A.stroke();qa.expandByScalar(2*H.linewidth)}else H instanceof THREE.LineDashedMaterial&&(l(H.linewidth),n(H.linecap),q(H.linejoin),p(H.color.getStyle()),t(H.dashSize,H.gapSize),A.stroke(),qa.expandByScalar(2*H.linewidth),t(null,null))}else if(E instanceof THREE.RenderableFace){R=E.v1;
I=E.v2;da=E.v3;if(-1>R.positionScreen.z||1<R.positionScreen.z)continue;if(-1>I.positionScreen.z||1<I.positionScreen.z)continue;if(-1>da.positionScreen.z||1<da.positionScreen.z)continue;R.positionScreen.x*=B;R.positionScreen.y*=K;I.positionScreen.x*=B;I.positionScreen.y*=K;da.positionScreen.x*=B;da.positionScreen.y*=K;0<N.overdraw&&(g(R.positionScreen,I.positionScreen,N.overdraw),g(I.positionScreen,da.positionScreen,N.overdraw),g(da.positionScreen,R.positionScreen,N.overdraw));qa.setFromPoints([R.positionScreen,
I.positionScreen,da.positionScreen]);if(!0===ya.isIntersectionBox(qa)){G=R;m=I;H=da;z=N;v.info.render.vertices+=3;v.info.render.faces++;h(z.opacity);k(z.blending);V=G.positionScreen.x;X=G.positionScreen.y;P=m.positionScreen.x;ga=m.positionScreen.y;wa=H.positionScreen.x;Ha=H.positionScreen.y;var N=V,Q=X,D=P,F=ga,U=wa,Db=Ha;A.beginPath();A.moveTo(N,Q);A.lineTo(D,F);A.lineTo(U,Db);A.closePath();if((z instanceof THREE.MeshLambertMaterial||z instanceof THREE.MeshPhongMaterial)&&null===z.map){za.copy(z.color);
Ia.copy(z.emissive);z.vertexColors===THREE.FaceColors&&za.multiply(E.color);fa.copy(ua);Ja.copy(G.positionWorld).add(m.positionWorld).add(H.positionWorld).divideScalar(3);G=Ja;m=E.normalModel;H=fa;E=0;for(N=y.length;E<N;E++)Q=y[E],Ea.copy(Q.color),Q instanceof THREE.DirectionalLight?(D=Da.setFromMatrixPosition(Q.matrixWorld).normalize(),F=m.dot(D),0>=F||(F*=Q.intensity,H.add(Ea.multiplyScalar(F)))):Q instanceof THREE.PointLight&&(D=Da.setFromMatrixPosition(Q.matrixWorld),F=m.dot(Da.subVectors(D,G).normalize()),
0>=F||(F*=0==Q.distance?1:1-Math.min(G.distanceTo(D)/Q.distance,1),0!=F&&(F*=Q.intensity,H.add(Ea.multiplyScalar(F)))));fa.multiply(za).add(Ia);!0===z.wireframe?b(fa,z.wireframeLinewidth,z.wireframeLinecap,z.wireframeLinejoin):c(fa)}else z instanceof THREE.MeshBasicMaterial||z instanceof THREE.MeshLambertMaterial||z instanceof THREE.MeshPhongMaterial?null!==z.map?z.map.mapping instanceof THREE.UVMapping&&(ha=E.uvs,f(V,X,P,ga,wa,Ha,ha[0].x,ha[0].y,ha[1].x,ha[1].y,ha[2].x,ha[2].y,z.map)):null!==z.envMap?
z.envMap.mapping instanceof THREE.SphericalReflectionMapping?(ja.copy(E.vertexNormalsModel[0]).applyMatrix3(ra),Oa=0.5*ja.x+0.5,Ra=0.5*ja.y+0.5,ja.copy(E.vertexNormalsModel[1]).applyMatrix3(ra),Sa=0.5*ja.x+0.5,Fa=0.5*ja.y+0.5,ja.copy(E.vertexNormalsModel[2]).applyMatrix3(ra),ia=0.5*ja.x+0.5,ma=0.5*ja.y+0.5,f(V,X,P,ga,wa,Ha,Oa,Ra,Sa,Fa,ia,ma,z.envMap)):z.envMap.mapping instanceof THREE.SphericalRefractionMapping&&(ja.copy(E.vertexNormalsModel[0]).applyMatrix3(ra),Oa=-0.5*ja.x+0.5,Ra=-0.5*ja.y+0.5,
ja.copy(E.vertexNormalsModel[1]).applyMatrix3(ra),Sa=-0.5*ja.x+0.5,Fa=-0.5*ja.y+0.5,ja.copy(E.vertexNormalsModel[2]).applyMatrix3(ra),ia=-0.5*ja.x+0.5,ma=-0.5*ja.y+0.5,f(V,X,P,ga,wa,Ha,Oa,Ra,Sa,Fa,ia,ma,z.envMap)):(fa.copy(z.color),z.vertexColors===THREE.FaceColors&&fa.multiply(E.color),!0===z.wireframe?b(fa,z.wireframeLinewidth,z.wireframeLinecap,z.wireframeLinejoin):c(fa)):(z instanceof THREE.MeshDepthMaterial?fa.r=fa.g=fa.b=1-r(G.positionScreen.z*G.positionScreen.w,W.near,W.far):z instanceof THREE.MeshNormalMaterial?
(ja.copy(E.normalModel).applyMatrix3(ra),fa.setRGB(ja.x,ja.y,ja.z).multiplyScalar(0.5).addScalar(0.5)):fa.setRGB(1,1,1),!0===z.wireframe?b(fa,z.wireframeLinewidth,z.wireframeLinecap,z.wireframeLinejoin):c(fa))}}Z.union(qa)}}}}};THREE.ShaderChunk={fog_pars_fragment:"#ifdef USE_FOG\n\tuniform vec3 fogColor;\n\t#ifdef FOG_EXP2\n\t\tuniform float fogDensity;\n\t#else\n\t\tuniform float fogNear;\n\t\tuniform float fogFar;\n\t#endif\n#endif",fog_fragment:"#ifdef USE_FOG\n\t#ifdef USE_LOGDEPTHBUF_EXT\n\t\tfloat depth = gl_FragDepthEXT / gl_FragCoord.w;\n\t#else\n\t\tfloat depth = gl_FragCoord.z / gl_FragCoord.w;\n\t#endif\n\t#ifdef FOG_EXP2\n\t\tconst float LOG2 = 1.442695;\n\t\tfloat fogFactor = exp2( - fogDensity * fogDensity * depth * depth * LOG2 );\n\t\tfogFactor = 1.0 - clamp( fogFactor, 0.0, 1.0 );\n\t#else\n\t\tfloat fogFactor = smoothstep( fogNear, fogFar, depth );\n\t#endif\n\tgl_FragColor = mix( gl_FragColor, vec4( fogColor, gl_FragColor.w ), fogFactor );\n#endif",
envmap_pars_fragment:"#ifdef USE_ENVMAP\n\tuniform float reflectivity;\n\tuniform samplerCube envMap;\n\tuniform float flipEnvMap;\n\tuniform int combine;\n\t#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP )\n\t\tuniform bool useRefract;\n\t\tuniform float refractionRatio;\n\t#else\n\t\tvarying vec3 vReflect;\n\t#endif\n#endif",envmap_fragment:"#ifdef USE_ENVMAP\n\tvec3 reflectVec;\n\t#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP )\n\t\tvec3 cameraToVertex = normalize( vWorldPosition - cameraPosition );\n\t\tvec3 worldNormal = normalize( vec3( vec4( normal, 0.0 ) * viewMatrix ) );\n\t\tif ( useRefract ) {\n\t\t\treflectVec = refract( cameraToVertex, worldNormal, refractionRatio );\n\t\t} else { \n\t\t\treflectVec = reflect( cameraToVertex, worldNormal );\n\t\t}\n\t#else\n\t\treflectVec = vReflect;\n\t#endif\n\t#ifdef DOUBLE_SIDED\n\t\tfloat flipNormal = ( -1.0 + 2.0 * float( gl_FrontFacing ) );\n\t\tvec4 cubeColor = textureCube( envMap, flipNormal * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );\n\t#else\n\t\tvec4 cubeColor = textureCube( envMap, vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );\n\t#endif\n\t#ifdef GAMMA_INPUT\n\t\tcubeColor.xyz *= cubeColor.xyz;\n\t#endif\n\tif ( combine == 1 ) {\n\t\tgl_FragColor.xyz = mix( gl_FragColor.xyz, cubeColor.xyz, specularStrength * reflectivity );\n\t} else if ( combine == 2 ) {\n\t\tgl_FragColor.xyz += cubeColor.xyz * specularStrength * reflectivity;\n\t} else {\n\t\tgl_FragColor.xyz = mix( gl_FragColor.xyz, gl_FragColor.xyz * cubeColor.xyz, specularStrength * reflectivity );\n\t}\n#endif",
envmap_pars_vertex:"#if defined( USE_ENVMAP ) && ! defined( USE_BUMPMAP ) && ! defined( USE_NORMALMAP )\n\tvarying vec3 vReflect;\n\tuniform float refractionRatio;\n\tuniform bool useRefract;\n#endif",worldpos_vertex:"#if defined( USE_ENVMAP ) || defined( PHONG ) || defined( LAMBERT ) || defined ( USE_SHADOWMAP )\n\t#ifdef USE_SKINNING\n\t\tvec4 worldPosition = modelMatrix * skinned;\n\t#endif\n\t#if defined( USE_MORPHTARGETS ) && ! defined( USE_SKINNING )\n\t\tvec4 worldPosition = modelMatrix * vec4( morphed, 1.0 );\n\t#endif\n\t#if ! defined( USE_MORPHTARGETS ) && ! defined( USE_SKINNING )\n\t\tvec4 worldPosition = modelMatrix * vec4( position, 1.0 );\n\t#endif\n#endif",
envmap_vertex:"#if defined( USE_ENVMAP ) && ! defined( USE_BUMPMAP ) && ! defined( USE_NORMALMAP )\n\tvec3 worldNormal = mat3( modelMatrix[ 0 ].xyz, modelMatrix[ 1 ].xyz, modelMatrix[ 2 ].xyz ) * objectNormal;\n\tworldNormal = normalize( worldNormal );\n\tvec3 cameraToVertex = normalize( worldPosition.xyz - cameraPosition );\n\tif ( useRefract ) {\n\t\tvReflect = refract( cameraToVertex, worldNormal, refractionRatio );\n\t} else {\n\t\tvReflect = reflect( cameraToVertex, worldNormal );\n\t}\n#endif",
map_particle_pars_fragment:"#ifdef USE_MAP\n\tuniform sampler2D map;\n#endif",map_particle_fragment:"#ifdef USE_MAP\n\tgl_FragColor = gl_FragColor * texture2D( map, vec2( gl_PointCoord.x, 1.0 - gl_PointCoord.y ) );\n#endif",map_pars_vertex:"#if defined( USE_MAP ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( USE_SPECULARMAP )\n\tvarying vec2 vUv;\n\tuniform vec4 offsetRepeat;\n#endif",map_pars_fragment:"#if defined( USE_MAP ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( USE_SPECULARMAP )\n\tvarying vec2 vUv;\n#endif\n#ifdef USE_MAP\n\tuniform sampler2D map;\n#endif",
map_vertex:"#if defined( USE_MAP ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( USE_SPECULARMAP )\n\tvUv = uv * offsetRepeat.zw + offsetRepeat.xy;\n#endif",map_fragment:"#ifdef USE_MAP\n\tvec4 texelColor = texture2D( map, vUv );\n\t#ifdef GAMMA_INPUT\n\t\ttexelColor.xyz *= texelColor.xyz;\n\t#endif\n\tgl_FragColor = gl_FragColor * texelColor;\n#endif",lightmap_pars_fragment:"#ifdef USE_LIGHTMAP\n\tvarying vec2 vUv2;\n\tuniform sampler2D lightMap;\n#endif",lightmap_pars_vertex:"#ifdef USE_LIGHTMAP\n\tvarying vec2 vUv2;\n#endif",
lightmap_fragment:"#ifdef USE_LIGHTMAP\n\tgl_FragColor = gl_FragColor * texture2D( lightMap, vUv2 );\n#endif",lightmap_vertex:"#ifdef USE_LIGHTMAP\n\tvUv2 = uv2;\n#endif",bumpmap_pars_fragment:"#ifdef USE_BUMPMAP\n\tuniform sampler2D bumpMap;\n\tuniform float bumpScale;\n\tvec2 dHdxy_fwd() {\n\t\tvec2 dSTdx = dFdx( vUv );\n\t\tvec2 dSTdy = dFdy( vUv );\n\t\tfloat Hll = bumpScale * texture2D( bumpMap, vUv ).x;\n\t\tfloat dBx = bumpScale * texture2D( bumpMap, vUv + dSTdx ).x - Hll;\n\t\tfloat dBy = bumpScale * texture2D( bumpMap, vUv + dSTdy ).x - Hll;\n\t\treturn vec2( dBx, dBy );\n\t}\n\tvec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy ) {\n\t\tvec3 vSigmaX = dFdx( surf_pos );\n\t\tvec3 vSigmaY = dFdy( surf_pos );\n\t\tvec3 vN = surf_norm;\n\t\tvec3 R1 = cross( vSigmaY, vN );\n\t\tvec3 R2 = cross( vN, vSigmaX );\n\t\tfloat fDet = dot( vSigmaX, R1 );\n\t\tvec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );\n\t\treturn normalize( abs( fDet ) * surf_norm - vGrad );\n\t}\n#endif",
normalmap_pars_fragment:"#ifdef USE_NORMALMAP\n\tuniform sampler2D normalMap;\n\tuniform vec2 normalScale;\n\tvec3 perturbNormal2Arb( vec3 eye_pos, vec3 surf_norm ) {\n\t\tvec3 q0 = dFdx( eye_pos.xyz );\n\t\tvec3 q1 = dFdy( eye_pos.xyz );\n\t\tvec2 st0 = dFdx( vUv.st );\n\t\tvec2 st1 = dFdy( vUv.st );\n\t\tvec3 S = normalize(  q0 * st1.t - q1 * st0.t );\n\t\tvec3 T = normalize( -q0 * st1.s + q1 * st0.s );\n\t\tvec3 N = normalize( surf_norm );\n\t\tvec3 mapN = texture2D( normalMap, vUv ).xyz * 2.0 - 1.0;\n\t\tmapN.xy = normalScale * mapN.xy;\n\t\tmat3 tsn = mat3( S, T, N );\n\t\treturn normalize( tsn * mapN );\n\t}\n#endif",
specularmap_pars_fragment:"#ifdef USE_SPECULARMAP\n\tuniform sampler2D specularMap;\n#endif",specularmap_fragment:"float specularStrength;\n#ifdef USE_SPECULARMAP\n\tvec4 texelSpecular = texture2D( specularMap, vUv );\n\tspecularStrength = texelSpecular.r;\n#else\n\tspecularStrength = 1.0;\n#endif",lights_lambert_pars_vertex:"uniform vec3 ambient;\nuniform vec3 diffuse;\nuniform vec3 emissive;\nuniform vec3 ambientLightColor;\n#if MAX_DIR_LIGHTS > 0\n\tuniform vec3 directionalLightColor[ MAX_DIR_LIGHTS ];\n\tuniform vec3 directionalLightDirection[ MAX_DIR_LIGHTS ];\n#endif\n#if MAX_HEMI_LIGHTS > 0\n\tuniform vec3 hemisphereLightSkyColor[ MAX_HEMI_LIGHTS ];\n\tuniform vec3 hemisphereLightGroundColor[ MAX_HEMI_LIGHTS ];\n\tuniform vec3 hemisphereLightDirection[ MAX_HEMI_LIGHTS ];\n#endif\n#if MAX_POINT_LIGHTS > 0\n\tuniform vec3 pointLightColor[ MAX_POINT_LIGHTS ];\n\tuniform vec3 pointLightPosition[ MAX_POINT_LIGHTS ];\n\tuniform float pointLightDistance[ MAX_POINT_LIGHTS ];\n#endif\n#if MAX_SPOT_LIGHTS > 0\n\tuniform vec3 spotLightColor[ MAX_SPOT_LIGHTS ];\n\tuniform vec3 spotLightPosition[ MAX_SPOT_LIGHTS ];\n\tuniform vec3 spotLightDirection[ MAX_SPOT_LIGHTS ];\n\tuniform float spotLightDistance[ MAX_SPOT_LIGHTS ];\n\tuniform float spotLightAngleCos[ MAX_SPOT_LIGHTS ];\n\tuniform float spotLightExponent[ MAX_SPOT_LIGHTS ];\n#endif\n#ifdef WRAP_AROUND\n\tuniform vec3 wrapRGB;\n#endif",
lights_lambert_vertex:"vLightFront = vec3( 0.0 );\n#ifdef DOUBLE_SIDED\n\tvLightBack = vec3( 0.0 );\n#endif\ntransformedNormal = normalize( transformedNormal );\n#if MAX_DIR_LIGHTS > 0\nfor( int i = 0; i < MAX_DIR_LIGHTS; i ++ ) {\n\tvec4 lDirection = viewMatrix * vec4( directionalLightDirection[ i ], 0.0 );\n\tvec3 dirVector = normalize( lDirection.xyz );\n\tfloat dotProduct = dot( transformedNormal, dirVector );\n\tvec3 directionalLightWeighting = vec3( max( dotProduct, 0.0 ) );\n\t#ifdef DOUBLE_SIDED\n\t\tvec3 directionalLightWeightingBack = vec3( max( -dotProduct, 0.0 ) );\n\t\t#ifdef WRAP_AROUND\n\t\t\tvec3 directionalLightWeightingHalfBack = vec3( max( -0.5 * dotProduct + 0.5, 0.0 ) );\n\t\t#endif\n\t#endif\n\t#ifdef WRAP_AROUND\n\t\tvec3 directionalLightWeightingHalf = vec3( max( 0.5 * dotProduct + 0.5, 0.0 ) );\n\t\tdirectionalLightWeighting = mix( directionalLightWeighting, directionalLightWeightingHalf, wrapRGB );\n\t\t#ifdef DOUBLE_SIDED\n\t\t\tdirectionalLightWeightingBack = mix( directionalLightWeightingBack, directionalLightWeightingHalfBack, wrapRGB );\n\t\t#endif\n\t#endif\n\tvLightFront += directionalLightColor[ i ] * directionalLightWeighting;\n\t#ifdef DOUBLE_SIDED\n\t\tvLightBack += directionalLightColor[ i ] * directionalLightWeightingBack;\n\t#endif\n}\n#endif\n#if MAX_POINT_LIGHTS > 0\n\tfor( int i = 0; i < MAX_POINT_LIGHTS; i ++ ) {\n\t\tvec4 lPosition = viewMatrix * vec4( pointLightPosition[ i ], 1.0 );\n\t\tvec3 lVector = lPosition.xyz - mvPosition.xyz;\n\t\tfloat lDistance = 1.0;\n\t\tif ( pointLightDistance[ i ] > 0.0 )\n\t\t\tlDistance = 1.0 - min( ( length( lVector ) / pointLightDistance[ i ] ), 1.0 );\n\t\tlVector = normalize( lVector );\n\t\tfloat dotProduct = dot( transformedNormal, lVector );\n\t\tvec3 pointLightWeighting = vec3( max( dotProduct, 0.0 ) );\n\t\t#ifdef DOUBLE_SIDED\n\t\t\tvec3 pointLightWeightingBack = vec3( max( -dotProduct, 0.0 ) );\n\t\t\t#ifdef WRAP_AROUND\n\t\t\t\tvec3 pointLightWeightingHalfBack = vec3( max( -0.5 * dotProduct + 0.5, 0.0 ) );\n\t\t\t#endif\n\t\t#endif\n\t\t#ifdef WRAP_AROUND\n\t\t\tvec3 pointLightWeightingHalf = vec3( max( 0.5 * dotProduct + 0.5, 0.0 ) );\n\t\t\tpointLightWeighting = mix( pointLightWeighting, pointLightWeightingHalf, wrapRGB );\n\t\t\t#ifdef DOUBLE_SIDED\n\t\t\t\tpointLightWeightingBack = mix( pointLightWeightingBack, pointLightWeightingHalfBack, wrapRGB );\n\t\t\t#endif\n\t\t#endif\n\t\tvLightFront += pointLightColor[ i ] * pointLightWeighting * lDistance;\n\t\t#ifdef DOUBLE_SIDED\n\t\t\tvLightBack += pointLightColor[ i ] * pointLightWeightingBack * lDistance;\n\t\t#endif\n\t}\n#endif\n#if MAX_SPOT_LIGHTS > 0\n\tfor( int i = 0; i < MAX_SPOT_LIGHTS; i ++ ) {\n\t\tvec4 lPosition = viewMatrix * vec4( spotLightPosition[ i ], 1.0 );\n\t\tvec3 lVector = lPosition.xyz - mvPosition.xyz;\n\t\tfloat spotEffect = dot( spotLightDirection[ i ], normalize( spotLightPosition[ i ] - worldPosition.xyz ) );\n\t\tif ( spotEffect > spotLightAngleCos[ i ] ) {\n\t\t\tspotEffect = max( pow( spotEffect, spotLightExponent[ i ] ), 0.0 );\n\t\t\tfloat lDistance = 1.0;\n\t\t\tif ( spotLightDistance[ i ] > 0.0 )\n\t\t\t\tlDistance = 1.0 - min( ( length( lVector ) / spotLightDistance[ i ] ), 1.0 );\n\t\t\tlVector = normalize( lVector );\n\t\t\tfloat dotProduct = dot( transformedNormal, lVector );\n\t\t\tvec3 spotLightWeighting = vec3( max( dotProduct, 0.0 ) );\n\t\t\t#ifdef DOUBLE_SIDED\n\t\t\t\tvec3 spotLightWeightingBack = vec3( max( -dotProduct, 0.0 ) );\n\t\t\t\t#ifdef WRAP_AROUND\n\t\t\t\t\tvec3 spotLightWeightingHalfBack = vec3( max( -0.5 * dotProduct + 0.5, 0.0 ) );\n\t\t\t\t#endif\n\t\t\t#endif\n\t\t\t#ifdef WRAP_AROUND\n\t\t\t\tvec3 spotLightWeightingHalf = vec3( max( 0.5 * dotProduct + 0.5, 0.0 ) );\n\t\t\t\tspotLightWeighting = mix( spotLightWeighting, spotLightWeightingHalf, wrapRGB );\n\t\t\t\t#ifdef DOUBLE_SIDED\n\t\t\t\t\tspotLightWeightingBack = mix( spotLightWeightingBack, spotLightWeightingHalfBack, wrapRGB );\n\t\t\t\t#endif\n\t\t\t#endif\n\t\t\tvLightFront += spotLightColor[ i ] * spotLightWeighting * lDistance * spotEffect;\n\t\t\t#ifdef DOUBLE_SIDED\n\t\t\t\tvLightBack += spotLightColor[ i ] * spotLightWeightingBack * lDistance * spotEffect;\n\t\t\t#endif\n\t\t}\n\t}\n#endif\n#if MAX_HEMI_LIGHTS > 0\n\tfor( int i = 0; i < MAX_HEMI_LIGHTS; i ++ ) {\n\t\tvec4 lDirection = viewMatrix * vec4( hemisphereLightDirection[ i ], 0.0 );\n\t\tvec3 lVector = normalize( lDirection.xyz );\n\t\tfloat dotProduct = dot( transformedNormal, lVector );\n\t\tfloat hemiDiffuseWeight = 0.5 * dotProduct + 0.5;\n\t\tfloat hemiDiffuseWeightBack = -0.5 * dotProduct + 0.5;\n\t\tvLightFront += mix( hemisphereLightGroundColor[ i ], hemisphereLightSkyColor[ i ], hemiDiffuseWeight );\n\t\t#ifdef DOUBLE_SIDED\n\t\t\tvLightBack += mix( hemisphereLightGroundColor[ i ], hemisphereLightSkyColor[ i ], hemiDiffuseWeightBack );\n\t\t#endif\n\t}\n#endif\nvLightFront = vLightFront * diffuse + ambient * ambientLightColor + emissive;\n#ifdef DOUBLE_SIDED\n\tvLightBack = vLightBack * diffuse + ambient * ambientLightColor + emissive;\n#endif",
lights_phong_pars_vertex:"#if MAX_SPOT_LIGHTS > 0 || defined( USE_BUMPMAP ) || defined( USE_ENVMAP )\n\tvarying vec3 vWorldPosition;\n#endif",lights_phong_vertex:"#if MAX_SPOT_LIGHTS > 0 || defined( USE_BUMPMAP ) || defined( USE_ENVMAP )\n\tvWorldPosition = worldPosition.xyz;\n#endif",lights_phong_pars_fragment:"uniform vec3 ambientLightColor;\n#if MAX_DIR_LIGHTS > 0\n\tuniform vec3 directionalLightColor[ MAX_DIR_LIGHTS ];\n\tuniform vec3 directionalLightDirection[ MAX_DIR_LIGHTS ];\n#endif\n#if MAX_HEMI_LIGHTS > 0\n\tuniform vec3 hemisphereLightSkyColor[ MAX_HEMI_LIGHTS ];\n\tuniform vec3 hemisphereLightGroundColor[ MAX_HEMI_LIGHTS ];\n\tuniform vec3 hemisphereLightDirection[ MAX_HEMI_LIGHTS ];\n#endif\n#if MAX_POINT_LIGHTS > 0\n\tuniform vec3 pointLightColor[ MAX_POINT_LIGHTS ];\n\tuniform vec3 pointLightPosition[ MAX_POINT_LIGHTS ];\n\tuniform float pointLightDistance[ MAX_POINT_LIGHTS ];\n#endif\n#if MAX_SPOT_LIGHTS > 0\n\tuniform vec3 spotLightColor[ MAX_SPOT_LIGHTS ];\n\tuniform vec3 spotLightPosition[ MAX_SPOT_LIGHTS ];\n\tuniform vec3 spotLightDirection[ MAX_SPOT_LIGHTS ];\n\tuniform float spotLightAngleCos[ MAX_SPOT_LIGHTS ];\n\tuniform float spotLightExponent[ MAX_SPOT_LIGHTS ];\n\tuniform float spotLightDistance[ MAX_SPOT_LIGHTS ];\n#endif\n#if MAX_SPOT_LIGHTS > 0 || defined( USE_BUMPMAP ) || defined( USE_ENVMAP )\n\tvarying vec3 vWorldPosition;\n#endif\n#ifdef WRAP_AROUND\n\tuniform vec3 wrapRGB;\n#endif\nvarying vec3 vViewPosition;\nvarying vec3 vNormal;",
lights_phong_fragment:"vec3 normal = normalize( vNormal );\nvec3 viewPosition = normalize( vViewPosition );\n#ifdef DOUBLE_SIDED\n\tnormal = normal * ( -1.0 + 2.0 * float( gl_FrontFacing ) );\n#endif\n#ifdef USE_NORMALMAP\n\tnormal = perturbNormal2Arb( -vViewPosition, normal );\n#elif defined( USE_BUMPMAP )\n\tnormal = perturbNormalArb( -vViewPosition, normal, dHdxy_fwd() );\n#endif\n#if MAX_POINT_LIGHTS > 0\n\tvec3 pointDiffuse  = vec3( 0.0 );\n\tvec3 pointSpecular = vec3( 0.0 );\n\tfor ( int i = 0; i < MAX_POINT_LIGHTS; i ++ ) {\n\t\tvec4 lPosition = viewMatrix * vec4( pointLightPosition[ i ], 1.0 );\n\t\tvec3 lVector = lPosition.xyz + vViewPosition.xyz;\n\t\tfloat lDistance = 1.0;\n\t\tif ( pointLightDistance[ i ] > 0.0 )\n\t\t\tlDistance = 1.0 - min( ( length( lVector ) / pointLightDistance[ i ] ), 1.0 );\n\t\tlVector = normalize( lVector );\n\t\tfloat dotProduct = dot( normal, lVector );\n\t\t#ifdef WRAP_AROUND\n\t\t\tfloat pointDiffuseWeightFull = max( dotProduct, 0.0 );\n\t\t\tfloat pointDiffuseWeightHalf = max( 0.5 * dotProduct + 0.5, 0.0 );\n\t\t\tvec3 pointDiffuseWeight = mix( vec3( pointDiffuseWeightFull ), vec3( pointDiffuseWeightHalf ), wrapRGB );\n\t\t#else\n\t\t\tfloat pointDiffuseWeight = max( dotProduct, 0.0 );\n\t\t#endif\n\t\tpointDiffuse  += diffuse * pointLightColor[ i ] * pointDiffuseWeight * lDistance;\n\t\tvec3 pointHalfVector = normalize( lVector + viewPosition );\n\t\tfloat pointDotNormalHalf = max( dot( normal, pointHalfVector ), 0.0 );\n\t\tfloat pointSpecularWeight = specularStrength * max( pow( pointDotNormalHalf, shininess ), 0.0 );\n\t\tfloat specularNormalization = ( shininess + 2.0001 ) / 8.0;\n\t\tvec3 schlick = specular + vec3( 1.0 - specular ) * pow( max( 1.0 - dot( lVector, pointHalfVector ), 0.0 ), 5.0 );\n\t\tpointSpecular += schlick * pointLightColor[ i ] * pointSpecularWeight * pointDiffuseWeight * lDistance * specularNormalization;\n\t}\n#endif\n#if MAX_SPOT_LIGHTS > 0\n\tvec3 spotDiffuse  = vec3( 0.0 );\n\tvec3 spotSpecular = vec3( 0.0 );\n\tfor ( int i = 0; i < MAX_SPOT_LIGHTS; i ++ ) {\n\t\tvec4 lPosition = viewMatrix * vec4( spotLightPosition[ i ], 1.0 );\n\t\tvec3 lVector = lPosition.xyz + vViewPosition.xyz;\n\t\tfloat lDistance = 1.0;\n\t\tif ( spotLightDistance[ i ] > 0.0 )\n\t\t\tlDistance = 1.0 - min( ( length( lVector ) / spotLightDistance[ i ] ), 1.0 );\n\t\tlVector = normalize( lVector );\n\t\tfloat spotEffect = dot( spotLightDirection[ i ], normalize( spotLightPosition[ i ] - vWorldPosition ) );\n\t\tif ( spotEffect > spotLightAngleCos[ i ] ) {\n\t\t\tspotEffect = max( pow( spotEffect, spotLightExponent[ i ] ), 0.0 );\n\t\t\tfloat dotProduct = dot( normal, lVector );\n\t\t\t#ifdef WRAP_AROUND\n\t\t\t\tfloat spotDiffuseWeightFull = max( dotProduct, 0.0 );\n\t\t\t\tfloat spotDiffuseWeightHalf = max( 0.5 * dotProduct + 0.5, 0.0 );\n\t\t\t\tvec3 spotDiffuseWeight = mix( vec3( spotDiffuseWeightFull ), vec3( spotDiffuseWeightHalf ), wrapRGB );\n\t\t\t#else\n\t\t\t\tfloat spotDiffuseWeight = max( dotProduct, 0.0 );\n\t\t\t#endif\n\t\t\tspotDiffuse += diffuse * spotLightColor[ i ] * spotDiffuseWeight * lDistance * spotEffect;\n\t\t\tvec3 spotHalfVector = normalize( lVector + viewPosition );\n\t\t\tfloat spotDotNormalHalf = max( dot( normal, spotHalfVector ), 0.0 );\n\t\t\tfloat spotSpecularWeight = specularStrength * max( pow( spotDotNormalHalf, shininess ), 0.0 );\n\t\t\tfloat specularNormalization = ( shininess + 2.0001 ) / 8.0;\n\t\t\tvec3 schlick = specular + vec3( 1.0 - specular ) * pow( max( 1.0 - dot( lVector, spotHalfVector ), 0.0 ), 5.0 );\n\t\t\tspotSpecular += schlick * spotLightColor[ i ] * spotSpecularWeight * spotDiffuseWeight * lDistance * specularNormalization * spotEffect;\n\t\t}\n\t}\n#endif\n#if MAX_DIR_LIGHTS > 0\n\tvec3 dirDiffuse  = vec3( 0.0 );\n\tvec3 dirSpecular = vec3( 0.0 );\n\tfor( int i = 0; i < MAX_DIR_LIGHTS; i ++ ) {\n\t\tvec4 lDirection = viewMatrix * vec4( directionalLightDirection[ i ], 0.0 );\n\t\tvec3 dirVector = normalize( lDirection.xyz );\n\t\tfloat dotProduct = dot( normal, dirVector );\n\t\t#ifdef WRAP_AROUND\n\t\t\tfloat dirDiffuseWeightFull = max( dotProduct, 0.0 );\n\t\t\tfloat dirDiffuseWeightHalf = max( 0.5 * dotProduct + 0.5, 0.0 );\n\t\t\tvec3 dirDiffuseWeight = mix( vec3( dirDiffuseWeightFull ), vec3( dirDiffuseWeightHalf ), wrapRGB );\n\t\t#else\n\t\t\tfloat dirDiffuseWeight = max( dotProduct, 0.0 );\n\t\t#endif\n\t\tdirDiffuse  += diffuse * directionalLightColor[ i ] * dirDiffuseWeight;\n\t\tvec3 dirHalfVector = normalize( dirVector + viewPosition );\n\t\tfloat dirDotNormalHalf = max( dot( normal, dirHalfVector ), 0.0 );\n\t\tfloat dirSpecularWeight = specularStrength * max( pow( dirDotNormalHalf, shininess ), 0.0 );\n\t\tfloat specularNormalization = ( shininess + 2.0001 ) / 8.0;\n\t\tvec3 schlick = specular + vec3( 1.0 - specular ) * pow( max( 1.0 - dot( dirVector, dirHalfVector ), 0.0 ), 5.0 );\n\t\tdirSpecular += schlick * directionalLightColor[ i ] * dirSpecularWeight * dirDiffuseWeight * specularNormalization;\n\t}\n#endif\n#if MAX_HEMI_LIGHTS > 0\n\tvec3 hemiDiffuse  = vec3( 0.0 );\n\tvec3 hemiSpecular = vec3( 0.0 );\n\tfor( int i = 0; i < MAX_HEMI_LIGHTS; i ++ ) {\n\t\tvec4 lDirection = viewMatrix * vec4( hemisphereLightDirection[ i ], 0.0 );\n\t\tvec3 lVector = normalize( lDirection.xyz );\n\t\tfloat dotProduct = dot( normal, lVector );\n\t\tfloat hemiDiffuseWeight = 0.5 * dotProduct + 0.5;\n\t\tvec3 hemiColor = mix( hemisphereLightGroundColor[ i ], hemisphereLightSkyColor[ i ], hemiDiffuseWeight );\n\t\themiDiffuse += diffuse * hemiColor;\n\t\tvec3 hemiHalfVectorSky = normalize( lVector + viewPosition );\n\t\tfloat hemiDotNormalHalfSky = 0.5 * dot( normal, hemiHalfVectorSky ) + 0.5;\n\t\tfloat hemiSpecularWeightSky = specularStrength * max( pow( hemiDotNormalHalfSky, shininess ), 0.0 );\n\t\tvec3 lVectorGround = -lVector;\n\t\tvec3 hemiHalfVectorGround = normalize( lVectorGround + viewPosition );\n\t\tfloat hemiDotNormalHalfGround = 0.5 * dot( normal, hemiHalfVectorGround ) + 0.5;\n\t\tfloat hemiSpecularWeightGround = specularStrength * max( pow( hemiDotNormalHalfGround, shininess ), 0.0 );\n\t\tfloat dotProductGround = dot( normal, lVectorGround );\n\t\tfloat specularNormalization = ( shininess + 2.0001 ) / 8.0;\n\t\tvec3 schlickSky = specular + vec3( 1.0 - specular ) * pow( max( 1.0 - dot( lVector, hemiHalfVectorSky ), 0.0 ), 5.0 );\n\t\tvec3 schlickGround = specular + vec3( 1.0 - specular ) * pow( max( 1.0 - dot( lVectorGround, hemiHalfVectorGround ), 0.0 ), 5.0 );\n\t\themiSpecular += hemiColor * specularNormalization * ( schlickSky * hemiSpecularWeightSky * max( dotProduct, 0.0 ) + schlickGround * hemiSpecularWeightGround * max( dotProductGround, 0.0 ) );\n\t}\n#endif\nvec3 totalDiffuse = vec3( 0.0 );\nvec3 totalSpecular = vec3( 0.0 );\n#if MAX_DIR_LIGHTS > 0\n\ttotalDiffuse += dirDiffuse;\n\ttotalSpecular += dirSpecular;\n#endif\n#if MAX_HEMI_LIGHTS > 0\n\ttotalDiffuse += hemiDiffuse;\n\ttotalSpecular += hemiSpecular;\n#endif\n#if MAX_POINT_LIGHTS > 0\n\ttotalDiffuse += pointDiffuse;\n\ttotalSpecular += pointSpecular;\n#endif\n#if MAX_SPOT_LIGHTS > 0\n\ttotalDiffuse += spotDiffuse;\n\ttotalSpecular += spotSpecular;\n#endif\n#ifdef METAL\n\tgl_FragColor.xyz = gl_FragColor.xyz * ( emissive + totalDiffuse + ambientLightColor * ambient + totalSpecular );\n#else\n\tgl_FragColor.xyz = gl_FragColor.xyz * ( emissive + totalDiffuse + ambientLightColor * ambient ) + totalSpecular;\n#endif",
color_pars_fragment:"#ifdef USE_COLOR\n\tvarying vec3 vColor;\n#endif",color_fragment:"#ifdef USE_COLOR\n\tgl_FragColor = gl_FragColor * vec4( vColor, 1.0 );\n#endif",color_pars_vertex:"#ifdef USE_COLOR\n\tvarying vec3 vColor;\n#endif",color_vertex:"#ifdef USE_COLOR\n\t#ifdef GAMMA_INPUT\n\t\tvColor = color * color;\n\t#else\n\t\tvColor = color;\n\t#endif\n#endif",skinning_pars_vertex:"#ifdef USE_SKINNING\n\t#ifdef BONE_TEXTURE\n\t\tuniform sampler2D boneTexture;\n\t\tuniform int boneTextureWidth;\n\t\tuniform int boneTextureHeight;\n\t\tmat4 getBoneMatrix( const in float i ) {\n\t\t\tfloat j = i * 4.0;\n\t\t\tfloat x = mod( j, float( boneTextureWidth ) );\n\t\t\tfloat y = floor( j / float( boneTextureWidth ) );\n\t\t\tfloat dx = 1.0 / float( boneTextureWidth );\n\t\t\tfloat dy = 1.0 / float( boneTextureHeight );\n\t\t\ty = dy * ( y + 0.5 );\n\t\t\tvec4 v1 = texture2D( boneTexture, vec2( dx * ( x + 0.5 ), y ) );\n\t\t\tvec4 v2 = texture2D( boneTexture, vec2( dx * ( x + 1.5 ), y ) );\n\t\t\tvec4 v3 = texture2D( boneTexture, vec2( dx * ( x + 2.5 ), y ) );\n\t\t\tvec4 v4 = texture2D( boneTexture, vec2( dx * ( x + 3.5 ), y ) );\n\t\t\tmat4 bone = mat4( v1, v2, v3, v4 );\n\t\t\treturn bone;\n\t\t}\n\t#else\n\t\tuniform mat4 boneGlobalMatrices[ MAX_BONES ];\n\t\tmat4 getBoneMatrix( const in float i ) {\n\t\t\tmat4 bone = boneGlobalMatrices[ int(i) ];\n\t\t\treturn bone;\n\t\t}\n\t#endif\n#endif",
skinbase_vertex:"#ifdef USE_SKINNING\n\tmat4 boneMatX = getBoneMatrix( skinIndex.x );\n\tmat4 boneMatY = getBoneMatrix( skinIndex.y );\n\tmat4 boneMatZ = getBoneMatrix( skinIndex.z );\n\tmat4 boneMatW = getBoneMatrix( skinIndex.w );\n#endif",skinning_vertex:"#ifdef USE_SKINNING\n\t#ifdef USE_MORPHTARGETS\n\tvec4 skinVertex = vec4( morphed, 1.0 );\n\t#else\n\tvec4 skinVertex = vec4( position, 1.0 );\n\t#endif\n\tvec4 skinned  = boneMatX * skinVertex * skinWeight.x;\n\tskinned      += boneMatY * skinVertex * skinWeight.y;\n\tskinned      += boneMatZ * skinVertex * skinWeight.z;\n\tskinned      += boneMatW * skinVertex * skinWeight.w;\n#endif",
morphtarget_pars_vertex:"#ifdef USE_MORPHTARGETS\n\t#ifndef USE_MORPHNORMALS\n\tuniform float morphTargetInfluences[ 8 ];\n\t#else\n\tuniform float morphTargetInfluences[ 4 ];\n\t#endif\n#endif",morphtarget_vertex:"#ifdef USE_MORPHTARGETS\n\tvec3 morphed = vec3( 0.0 );\n\tmorphed += ( morphTarget0 - position ) * morphTargetInfluences[ 0 ];\n\tmorphed += ( morphTarget1 - position ) * morphTargetInfluences[ 1 ];\n\tmorphed += ( morphTarget2 - position ) * morphTargetInfluences[ 2 ];\n\tmorphed += ( morphTarget3 - position ) * morphTargetInfluences[ 3 ];\n\t#ifndef USE_MORPHNORMALS\n\tmorphed += ( morphTarget4 - position ) * morphTargetInfluences[ 4 ];\n\tmorphed += ( morphTarget5 - position ) * morphTargetInfluences[ 5 ];\n\tmorphed += ( morphTarget6 - position ) * morphTargetInfluences[ 6 ];\n\tmorphed += ( morphTarget7 - position ) * morphTargetInfluences[ 7 ];\n\t#endif\n\tmorphed += position;\n#endif",
default_vertex:"vec4 mvPosition;\n#ifdef USE_SKINNING\n\tmvPosition = modelViewMatrix * skinned;\n#endif\n#if !defined( USE_SKINNING ) && defined( USE_MORPHTARGETS )\n\tmvPosition = modelViewMatrix * vec4( morphed, 1.0 );\n#endif\n#if !defined( USE_SKINNING ) && ! defined( USE_MORPHTARGETS )\n\tmvPosition = modelViewMatrix * vec4( position, 1.0 );\n#endif\ngl_Position = projectionMatrix * mvPosition;",morphnormal_vertex:"#ifdef USE_MORPHNORMALS\n\tvec3 morphedNormal = vec3( 0.0 );\n\tmorphedNormal +=  ( morphNormal0 - normal ) * morphTargetInfluences[ 0 ];\n\tmorphedNormal +=  ( morphNormal1 - normal ) * morphTargetInfluences[ 1 ];\n\tmorphedNormal +=  ( morphNormal2 - normal ) * morphTargetInfluences[ 2 ];\n\tmorphedNormal +=  ( morphNormal3 - normal ) * morphTargetInfluences[ 3 ];\n\tmorphedNormal += normal;\n#endif",
skinnormal_vertex:"#ifdef USE_SKINNING\n\tmat4 skinMatrix = skinWeight.x * boneMatX;\n\tskinMatrix \t+= skinWeight.y * boneMatY;\n\tskinMatrix \t+= skinWeight.z * boneMatZ;\n\tskinMatrix \t+= skinWeight.w * boneMatW;\n\t#ifdef USE_MORPHNORMALS\n\tvec4 skinnedNormal = skinMatrix * vec4( morphedNormal, 0.0 );\n\t#else\n\tvec4 skinnedNormal = skinMatrix * vec4( normal, 0.0 );\n\t#endif\n#endif",defaultnormal_vertex:"vec3 objectNormal;\n#ifdef USE_SKINNING\n\tobjectNormal = skinnedNormal.xyz;\n#endif\n#if !defined( USE_SKINNING ) && defined( USE_MORPHNORMALS )\n\tobjectNormal = morphedNormal;\n#endif\n#if !defined( USE_SKINNING ) && ! defined( USE_MORPHNORMALS )\n\tobjectNormal = normal;\n#endif\n#ifdef FLIP_SIDED\n\tobjectNormal = -objectNormal;\n#endif\nvec3 transformedNormal = normalMatrix * objectNormal;",
shadowmap_pars_fragment:"#ifdef USE_SHADOWMAP\n\tuniform sampler2D shadowMap[ MAX_SHADOWS ];\n\tuniform vec2 shadowMapSize[ MAX_SHADOWS ];\n\tuniform float shadowDarkness[ MAX_SHADOWS ];\n\tuniform float shadowBias[ MAX_SHADOWS ];\n\tvarying vec4 vShadowCoord[ MAX_SHADOWS ];\n\tfloat unpackDepth( const in vec4 rgba_depth ) {\n\t\tconst vec4 bit_shift = vec4( 1.0 / ( 256.0 * 256.0 * 256.0 ), 1.0 / ( 256.0 * 256.0 ), 1.0 / 256.0, 1.0 );\n\t\tfloat depth = dot( rgba_depth, bit_shift );\n\t\treturn depth;\n\t}\n#endif",
shadowmap_fragment:"#ifdef USE_SHADOWMAP\n\t#ifdef SHADOWMAP_DEBUG\n\t\tvec3 frustumColors[3];\n\t\tfrustumColors[0] = vec3( 1.0, 0.5, 0.0 );\n\t\tfrustumColors[1] = vec3( 0.0, 1.0, 0.8 );\n\t\tfrustumColors[2] = vec3( 0.0, 0.5, 1.0 );\n\t#endif\n\t#ifdef SHADOWMAP_CASCADE\n\t\tint inFrustumCount = 0;\n\t#endif\n\tfloat fDepth;\n\tvec3 shadowColor = vec3( 1.0 );\n\tfor( int i = 0; i < MAX_SHADOWS; i ++ ) {\n\t\tvec3 shadowCoord = vShadowCoord[ i ].xyz / vShadowCoord[ i ].w;\n\t\tbvec4 inFrustumVec = bvec4 ( shadowCoord.x >= 0.0, shadowCoord.x <= 1.0, shadowCoord.y >= 0.0, shadowCoord.y <= 1.0 );\n\t\tbool inFrustum = all( inFrustumVec );\n\t\t#ifdef SHADOWMAP_CASCADE\n\t\t\tinFrustumCount += int( inFrustum );\n\t\t\tbvec3 frustumTestVec = bvec3( inFrustum, inFrustumCount == 1, shadowCoord.z <= 1.0 );\n\t\t#else\n\t\t\tbvec2 frustumTestVec = bvec2( inFrustum, shadowCoord.z <= 1.0 );\n\t\t#endif\n\t\tbool frustumTest = all( frustumTestVec );\n\t\tif ( frustumTest ) {\n\t\t\tshadowCoord.z += shadowBias[ i ];\n\t\t\t#if defined( SHADOWMAP_TYPE_PCF )\n\t\t\t\tfloat shadow = 0.0;\n\t\t\t\tconst float shadowDelta = 1.0 / 9.0;\n\t\t\t\tfloat xPixelOffset = 1.0 / shadowMapSize[ i ].x;\n\t\t\t\tfloat yPixelOffset = 1.0 / shadowMapSize[ i ].y;\n\t\t\t\tfloat dx0 = -1.25 * xPixelOffset;\n\t\t\t\tfloat dy0 = -1.25 * yPixelOffset;\n\t\t\t\tfloat dx1 = 1.25 * xPixelOffset;\n\t\t\t\tfloat dy1 = 1.25 * yPixelOffset;\n\t\t\t\tfDepth = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( dx0, dy0 ) ) );\n\t\t\t\tif ( fDepth < shadowCoord.z ) shadow += shadowDelta;\n\t\t\t\tfDepth = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( 0.0, dy0 ) ) );\n\t\t\t\tif ( fDepth < shadowCoord.z ) shadow += shadowDelta;\n\t\t\t\tfDepth = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( dx1, dy0 ) ) );\n\t\t\t\tif ( fDepth < shadowCoord.z ) shadow += shadowDelta;\n\t\t\t\tfDepth = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( dx0, 0.0 ) ) );\n\t\t\t\tif ( fDepth < shadowCoord.z ) shadow += shadowDelta;\n\t\t\t\tfDepth = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy ) );\n\t\t\t\tif ( fDepth < shadowCoord.z ) shadow += shadowDelta;\n\t\t\t\tfDepth = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( dx1, 0.0 ) ) );\n\t\t\t\tif ( fDepth < shadowCoord.z ) shadow += shadowDelta;\n\t\t\t\tfDepth = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( dx0, dy1 ) ) );\n\t\t\t\tif ( fDepth < shadowCoord.z ) shadow += shadowDelta;\n\t\t\t\tfDepth = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( 0.0, dy1 ) ) );\n\t\t\t\tif ( fDepth < shadowCoord.z ) shadow += shadowDelta;\n\t\t\t\tfDepth = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( dx1, dy1 ) ) );\n\t\t\t\tif ( fDepth < shadowCoord.z ) shadow += shadowDelta;\n\t\t\t\tshadowColor = shadowColor * vec3( ( 1.0 - shadowDarkness[ i ] * shadow ) );\n\t\t\t#elif defined( SHADOWMAP_TYPE_PCF_SOFT )\n\t\t\t\tfloat shadow = 0.0;\n\t\t\t\tfloat xPixelOffset = 1.0 / shadowMapSize[ i ].x;\n\t\t\t\tfloat yPixelOffset = 1.0 / shadowMapSize[ i ].y;\n\t\t\t\tfloat dx0 = -1.0 * xPixelOffset;\n\t\t\t\tfloat dy0 = -1.0 * yPixelOffset;\n\t\t\t\tfloat dx1 = 1.0 * xPixelOffset;\n\t\t\t\tfloat dy1 = 1.0 * yPixelOffset;\n\t\t\t\tmat3 shadowKernel;\n\t\t\t\tmat3 depthKernel;\n\t\t\t\tdepthKernel[0][0] = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( dx0, dy0 ) ) );\n\t\t\t\tdepthKernel[0][1] = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( dx0, 0.0 ) ) );\n\t\t\t\tdepthKernel[0][2] = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( dx0, dy1 ) ) );\n\t\t\t\tdepthKernel[1][0] = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( 0.0, dy0 ) ) );\n\t\t\t\tdepthKernel[1][1] = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy ) );\n\t\t\t\tdepthKernel[1][2] = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( 0.0, dy1 ) ) );\n\t\t\t\tdepthKernel[2][0] = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( dx1, dy0 ) ) );\n\t\t\t\tdepthKernel[2][1] = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( dx1, 0.0 ) ) );\n\t\t\t\tdepthKernel[2][2] = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( dx1, dy1 ) ) );\n\t\t\t\tvec3 shadowZ = vec3( shadowCoord.z );\n\t\t\t\tshadowKernel[0] = vec3(lessThan(depthKernel[0], shadowZ ));\n\t\t\t\tshadowKernel[0] *= vec3(0.25);\n\t\t\t\tshadowKernel[1] = vec3(lessThan(depthKernel[1], shadowZ ));\n\t\t\t\tshadowKernel[1] *= vec3(0.25);\n\t\t\t\tshadowKernel[2] = vec3(lessThan(depthKernel[2], shadowZ ));\n\t\t\t\tshadowKernel[2] *= vec3(0.25);\n\t\t\t\tvec2 fractionalCoord = 1.0 - fract( shadowCoord.xy * shadowMapSize[i].xy );\n\t\t\t\tshadowKernel[0] = mix( shadowKernel[1], shadowKernel[0], fractionalCoord.x );\n\t\t\t\tshadowKernel[1] = mix( shadowKernel[2], shadowKernel[1], fractionalCoord.x );\n\t\t\t\tvec4 shadowValues;\n\t\t\t\tshadowValues.x = mix( shadowKernel[0][1], shadowKernel[0][0], fractionalCoord.y );\n\t\t\t\tshadowValues.y = mix( shadowKernel[0][2], shadowKernel[0][1], fractionalCoord.y );\n\t\t\t\tshadowValues.z = mix( shadowKernel[1][1], shadowKernel[1][0], fractionalCoord.y );\n\t\t\t\tshadowValues.w = mix( shadowKernel[1][2], shadowKernel[1][1], fractionalCoord.y );\n\t\t\t\tshadow = dot( shadowValues, vec4( 1.0 ) );\n\t\t\t\tshadowColor = shadowColor * vec3( ( 1.0 - shadowDarkness[ i ] * shadow ) );\n\t\t\t#else\n\t\t\t\tvec4 rgbaDepth = texture2D( shadowMap[ i ], shadowCoord.xy );\n\t\t\t\tfloat fDepth = unpackDepth( rgbaDepth );\n\t\t\t\tif ( fDepth < shadowCoord.z )\n\t\t\t\t\tshadowColor = shadowColor * vec3( 1.0 - shadowDarkness[ i ] );\n\t\t\t#endif\n\t\t}\n\t\t#ifdef SHADOWMAP_DEBUG\n\t\t\t#ifdef SHADOWMAP_CASCADE\n\t\t\t\tif ( inFrustum && inFrustumCount == 1 ) gl_FragColor.xyz *= frustumColors[ i ];\n\t\t\t#else\n\t\t\t\tif ( inFrustum ) gl_FragColor.xyz *= frustumColors[ i ];\n\t\t\t#endif\n\t\t#endif\n\t}\n\t#ifdef GAMMA_OUTPUT\n\t\tshadowColor *= shadowColor;\n\t#endif\n\tgl_FragColor.xyz = gl_FragColor.xyz * shadowColor;\n#endif",
shadowmap_pars_vertex:"#ifdef USE_SHADOWMAP\n\tvarying vec4 vShadowCoord[ MAX_SHADOWS ];\n\tuniform mat4 shadowMatrix[ MAX_SHADOWS ];\n#endif",shadowmap_vertex:"#ifdef USE_SHADOWMAP\n\tfor( int i = 0; i < MAX_SHADOWS; i ++ ) {\n\t\tvShadowCoord[ i ] = shadowMatrix[ i ] * worldPosition;\n\t}\n#endif",alphatest_fragment:"#ifdef ALPHATEST\n\tif ( gl_FragColor.a < ALPHATEST ) discard;\n#endif",linear_to_gamma_fragment:"#ifdef GAMMA_OUTPUT\n\tgl_FragColor.xyz = sqrt( gl_FragColor.xyz );\n#endif",logdepthbuf_pars_vertex:"#ifdef USE_LOGDEPTHBUF\n\t#ifdef USE_LOGDEPTHBUF_EXT\n\t\tvarying float vFragDepth;\n\t#endif\n\tuniform float logDepthBufFC;\n#endif",
logdepthbuf_vertex:"#ifdef USE_LOGDEPTHBUF\n\tgl_Position.z = log2(max(1e-6, gl_Position.w + 1.0)) * logDepthBufFC;\n\t#ifdef USE_LOGDEPTHBUF_EXT\n\t\tvFragDepth = 1.0 + gl_Position.w;\n#else\n\t\tgl_Position.z = (gl_Position.z - 1.0) * gl_Position.w;\n\t#endif\n#endif",logdepthbuf_pars_fragment:"#ifdef USE_LOGDEPTHBUF\n\tuniform float logDepthBufFC;\n\t#ifdef USE_LOGDEPTHBUF_EXT\n\t\t#extension GL_EXT_frag_depth : enable\n\t\tvarying float vFragDepth;\n\t#endif\n#endif",logdepthbuf_fragment:"#if defined(USE_LOGDEPTHBUF) && defined(USE_LOGDEPTHBUF_EXT)\n\tgl_FragDepthEXT = log2(vFragDepth) * logDepthBufFC * 0.5;\n#endif"};THREE.UniformsUtils={merge:function(a){var b,c,d,e={};for(b=0;b<a.length;b++)for(c in d=this.clone(a[b]),d)e[c]=d[c];return e},clone:function(a){var b,c,d,e={};for(b in a)for(c in e[b]={},a[b])d=a[b][c],e[b][c]=d instanceof THREE.Color||d instanceof THREE.Vector2||d instanceof THREE.Vector3||d instanceof THREE.Vector4||d instanceof THREE.Matrix4||d instanceof THREE.Texture?d.clone():d instanceof Array?d.slice():d;return e}};THREE.UniformsLib={common:{diffuse:{type:"c",value:new THREE.Color(15658734)},opacity:{type:"f",value:1},map:{type:"t",value:null},offsetRepeat:{type:"v4",value:new THREE.Vector4(0,0,1,1)},lightMap:{type:"t",value:null},specularMap:{type:"t",value:null},envMap:{type:"t",value:null},flipEnvMap:{type:"f",value:-1},useRefract:{type:"i",value:0},reflectivity:{type:"f",value:1},refractionRatio:{type:"f",value:0.98},combine:{type:"i",value:0},morphTargetInfluences:{type:"f",value:0}},bump:{bumpMap:{type:"t",
value:null},bumpScale:{type:"f",value:1}},normalmap:{normalMap:{type:"t",value:null},normalScale:{type:"v2",value:new THREE.Vector2(1,1)}},fog:{fogDensity:{type:"f",value:2.5E-4},fogNear:{type:"f",value:1},fogFar:{type:"f",value:2E3},fogColor:{type:"c",value:new THREE.Color(16777215)}},lights:{ambientLightColor:{type:"fv",value:[]},directionalLightDirection:{type:"fv",value:[]},directionalLightColor:{type:"fv",value:[]},hemisphereLightDirection:{type:"fv",value:[]},hemisphereLightSkyColor:{type:"fv",
value:[]},hemisphereLightGroundColor:{type:"fv",value:[]},pointLightColor:{type:"fv",value:[]},pointLightPosition:{type:"fv",value:[]},pointLightDistance:{type:"fv1",value:[]},spotLightColor:{type:"fv",value:[]},spotLightPosition:{type:"fv",value:[]},spotLightDirection:{type:"fv",value:[]},spotLightDistance:{type:"fv1",value:[]},spotLightAngleCos:{type:"fv1",value:[]},spotLightExponent:{type:"fv1",value:[]}},particle:{psColor:{type:"c",value:new THREE.Color(15658734)},opacity:{type:"f",value:1},size:{type:"f",
value:1},scale:{type:"f",value:1},map:{type:"t",value:null},fogDensity:{type:"f",value:2.5E-4},fogNear:{type:"f",value:1},fogFar:{type:"f",value:2E3},fogColor:{type:"c",value:new THREE.Color(16777215)}},shadowmap:{shadowMap:{type:"tv",value:[]},shadowMapSize:{type:"v2v",value:[]},shadowBias:{type:"fv1",value:[]},shadowDarkness:{type:"fv1",value:[]},shadowMatrix:{type:"m4v",value:[]}}};THREE.ShaderLib={basic:{uniforms:THREE.UniformsUtils.merge([THREE.UniformsLib.common,THREE.UniformsLib.fog,THREE.UniformsLib.shadowmap]),vertexShader:[THREE.ShaderChunk.map_pars_vertex,THREE.ShaderChunk.lightmap_pars_vertex,THREE.ShaderChunk.envmap_pars_vertex,THREE.ShaderChunk.color_pars_vertex,THREE.ShaderChunk.morphtarget_pars_vertex,THREE.ShaderChunk.skinning_pars_vertex,THREE.ShaderChunk.shadowmap_pars_vertex,THREE.ShaderChunk.logdepthbuf_pars_vertex,"void main() {",THREE.ShaderChunk.map_vertex,
THREE.ShaderChunk.lightmap_vertex,THREE.ShaderChunk.color_vertex,THREE.ShaderChunk.skinbase_vertex,"\t#ifdef USE_ENVMAP",THREE.ShaderChunk.morphnormal_vertex,THREE.ShaderChunk.skinnormal_vertex,THREE.ShaderChunk.defaultnormal_vertex,"\t#endif",THREE.ShaderChunk.morphtarget_vertex,THREE.ShaderChunk.skinning_vertex,THREE.ShaderChunk.default_vertex,THREE.ShaderChunk.logdepthbuf_vertex,THREE.ShaderChunk.worldpos_vertex,THREE.ShaderChunk.envmap_vertex,THREE.ShaderChunk.shadowmap_vertex,"}"].join("\n"),
fragmentShader:["uniform vec3 diffuse;\nuniform float opacity;",THREE.ShaderChunk.color_pars_fragment,THREE.ShaderChunk.map_pars_fragment,THREE.ShaderChunk.lightmap_pars_fragment,THREE.ShaderChunk.envmap_pars_fragment,THREE.ShaderChunk.fog_pars_fragment,THREE.ShaderChunk.shadowmap_pars_fragment,THREE.ShaderChunk.specularmap_pars_fragment,THREE.ShaderChunk.logdepthbuf_pars_fragment,"void main() {\n\tgl_FragColor = vec4( diffuse, opacity );",THREE.ShaderChunk.logdepthbuf_fragment,THREE.ShaderChunk.map_fragment,
THREE.ShaderChunk.alphatest_fragment,THREE.ShaderChunk.specularmap_fragment,THREE.ShaderChunk.lightmap_fragment,THREE.ShaderChunk.color_fragment,THREE.ShaderChunk.envmap_fragment,THREE.ShaderChunk.shadowmap_fragment,THREE.ShaderChunk.linear_to_gamma_fragment,THREE.ShaderChunk.fog_fragment,"}"].join("\n")},lambert:{uniforms:THREE.UniformsUtils.merge([THREE.UniformsLib.common,THREE.UniformsLib.fog,THREE.UniformsLib.lights,THREE.UniformsLib.shadowmap,{ambient:{type:"c",value:new THREE.Color(16777215)},
emissive:{type:"c",value:new THREE.Color(0)},wrapRGB:{type:"v3",value:new THREE.Vector3(1,1,1)}}]),vertexShader:["#define LAMBERT\nvarying vec3 vLightFront;\n#ifdef DOUBLE_SIDED\n\tvarying vec3 vLightBack;\n#endif",THREE.ShaderChunk.map_pars_vertex,THREE.ShaderChunk.lightmap_pars_vertex,THREE.ShaderChunk.envmap_pars_vertex,THREE.ShaderChunk.lights_lambert_pars_vertex,THREE.ShaderChunk.color_pars_vertex,THREE.ShaderChunk.morphtarget_pars_vertex,THREE.ShaderChunk.skinning_pars_vertex,THREE.ShaderChunk.shadowmap_pars_vertex,
THREE.ShaderChunk.logdepthbuf_pars_vertex,"void main() {",THREE.ShaderChunk.map_vertex,THREE.ShaderChunk.lightmap_vertex,THREE.ShaderChunk.color_vertex,THREE.ShaderChunk.morphnormal_vertex,THREE.ShaderChunk.skinbase_vertex,THREE.ShaderChunk.skinnormal_vertex,THREE.ShaderChunk.defaultnormal_vertex,THREE.ShaderChunk.morphtarget_vertex,THREE.ShaderChunk.skinning_vertex,THREE.ShaderChunk.default_vertex,THREE.ShaderChunk.logdepthbuf_vertex,THREE.ShaderChunk.worldpos_vertex,THREE.ShaderChunk.envmap_vertex,
THREE.ShaderChunk.lights_lambert_vertex,THREE.ShaderChunk.shadowmap_vertex,"}"].join("\n"),fragmentShader:["uniform float opacity;\nvarying vec3 vLightFront;\n#ifdef DOUBLE_SIDED\n\tvarying vec3 vLightBack;\n#endif",THREE.ShaderChunk.color_pars_fragment,THREE.ShaderChunk.map_pars_fragment,THREE.ShaderChunk.lightmap_pars_fragment,THREE.ShaderChunk.envmap_pars_fragment,THREE.ShaderChunk.fog_pars_fragment,THREE.ShaderChunk.shadowmap_pars_fragment,THREE.ShaderChunk.specularmap_pars_fragment,THREE.ShaderChunk.logdepthbuf_pars_fragment,
"void main() {\n\tgl_FragColor = vec4( vec3( 1.0 ), opacity );",THREE.ShaderChunk.logdepthbuf_fragment,THREE.ShaderChunk.map_fragment,THREE.ShaderChunk.alphatest_fragment,THREE.ShaderChunk.specularmap_fragment,"\t#ifdef DOUBLE_SIDED\n\t\tif ( gl_FrontFacing )\n\t\t\tgl_FragColor.xyz *= vLightFront;\n\t\telse\n\t\t\tgl_FragColor.xyz *= vLightBack;\n\t#else\n\t\tgl_FragColor.xyz *= vLightFront;\n\t#endif",THREE.ShaderChunk.lightmap_fragment,THREE.ShaderChunk.color_fragment,THREE.ShaderChunk.envmap_fragment,
THREE.ShaderChunk.shadowmap_fragment,THREE.ShaderChunk.linear_to_gamma_fragment,THREE.ShaderChunk.fog_fragment,"}"].join("\n")},phong:{uniforms:THREE.UniformsUtils.merge([THREE.UniformsLib.common,THREE.UniformsLib.bump,THREE.UniformsLib.normalmap,THREE.UniformsLib.fog,THREE.UniformsLib.lights,THREE.UniformsLib.shadowmap,{ambient:{type:"c",value:new THREE.Color(16777215)},emissive:{type:"c",value:new THREE.Color(0)},specular:{type:"c",value:new THREE.Color(1118481)},shininess:{type:"f",value:30},wrapRGB:{type:"v3",
value:new THREE.Vector3(1,1,1)}}]),vertexShader:["#define PHONG\nvarying vec3 vViewPosition;\nvarying vec3 vNormal;",THREE.ShaderChunk.map_pars_vertex,THREE.ShaderChunk.lightmap_pars_vertex,THREE.ShaderChunk.envmap_pars_vertex,THREE.ShaderChunk.lights_phong_pars_vertex,THREE.ShaderChunk.color_pars_vertex,THREE.ShaderChunk.morphtarget_pars_vertex,THREE.ShaderChunk.skinning_pars_vertex,THREE.ShaderChunk.shadowmap_pars_vertex,THREE.ShaderChunk.logdepthbuf_pars_vertex,"void main() {",THREE.ShaderChunk.map_vertex,
THREE.ShaderChunk.lightmap_vertex,THREE.ShaderChunk.color_vertex,THREE.ShaderChunk.morphnormal_vertex,THREE.ShaderChunk.skinbase_vertex,THREE.ShaderChunk.skinnormal_vertex,THREE.ShaderChunk.defaultnormal_vertex,"\tvNormal = normalize( transformedNormal );",THREE.ShaderChunk.morphtarget_vertex,THREE.ShaderChunk.skinning_vertex,THREE.ShaderChunk.default_vertex,THREE.ShaderChunk.logdepthbuf_vertex,"\tvViewPosition = -mvPosition.xyz;",THREE.ShaderChunk.worldpos_vertex,THREE.ShaderChunk.envmap_vertex,
THREE.ShaderChunk.lights_phong_vertex,THREE.ShaderChunk.shadowmap_vertex,"}"].join("\n"),fragmentShader:["uniform vec3 diffuse;\nuniform float opacity;\nuniform vec3 ambient;\nuniform vec3 emissive;\nuniform vec3 specular;\nuniform float shininess;",THREE.ShaderChunk.color_pars_fragment,THREE.ShaderChunk.map_pars_fragment,THREE.ShaderChunk.lightmap_pars_fragment,THREE.ShaderChunk.envmap_pars_fragment,THREE.ShaderChunk.fog_pars_fragment,THREE.ShaderChunk.lights_phong_pars_fragment,THREE.ShaderChunk.shadowmap_pars_fragment,
THREE.ShaderChunk.bumpmap_pars_fragment,THREE.ShaderChunk.normalmap_pars_fragment,THREE.ShaderChunk.specularmap_pars_fragment,THREE.ShaderChunk.logdepthbuf_pars_fragment,"void main() {\n\tgl_FragColor = vec4( vec3( 1.0 ), opacity );",THREE.ShaderChunk.logdepthbuf_fragment,THREE.ShaderChunk.map_fragment,THREE.ShaderChunk.alphatest_fragment,THREE.ShaderChunk.specularmap_fragment,THREE.ShaderChunk.lights_phong_fragment,THREE.ShaderChunk.lightmap_fragment,THREE.ShaderChunk.color_fragment,THREE.ShaderChunk.envmap_fragment,
THREE.ShaderChunk.shadowmap_fragment,THREE.ShaderChunk.linear_to_gamma_fragment,THREE.ShaderChunk.fog_fragment,"}"].join("\n")},particle_basic:{uniforms:THREE.UniformsUtils.merge([THREE.UniformsLib.particle,THREE.UniformsLib.shadowmap]),vertexShader:["uniform float size;\nuniform float scale;",THREE.ShaderChunk.color_pars_vertex,THREE.ShaderChunk.shadowmap_pars_vertex,THREE.ShaderChunk.logdepthbuf_pars_vertex,"void main() {",THREE.ShaderChunk.color_vertex,"\tvec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );\n\t#ifdef USE_SIZEATTENUATION\n\t\tgl_PointSize = size * ( scale / length( mvPosition.xyz ) );\n\t#else\n\t\tgl_PointSize = size;\n\t#endif\n\tgl_Position = projectionMatrix * mvPosition;",
THREE.ShaderChunk.logdepthbuf_vertex,THREE.ShaderChunk.worldpos_vertex,THREE.ShaderChunk.shadowmap_vertex,"}"].join("\n"),fragmentShader:["uniform vec3 psColor;\nuniform float opacity;",THREE.ShaderChunk.color_pars_fragment,THREE.ShaderChunk.map_particle_pars_fragment,THREE.ShaderChunk.fog_pars_fragment,THREE.ShaderChunk.shadowmap_pars_fragment,THREE.ShaderChunk.logdepthbuf_pars_fragment,"void main() {\n\tgl_FragColor = vec4( psColor, opacity );",THREE.ShaderChunk.logdepthbuf_fragment,THREE.ShaderChunk.map_particle_fragment,
THREE.ShaderChunk.alphatest_fragment,THREE.ShaderChunk.color_fragment,THREE.ShaderChunk.shadowmap_fragment,THREE.ShaderChunk.fog_fragment,"}"].join("\n")},dashed:{uniforms:THREE.UniformsUtils.merge([THREE.UniformsLib.common,THREE.UniformsLib.fog,{scale:{type:"f",value:1},dashSize:{type:"f",value:1},totalSize:{type:"f",value:2}}]),vertexShader:["uniform float scale;\nattribute float lineDistance;\nvarying float vLineDistance;",THREE.ShaderChunk.color_pars_vertex,THREE.ShaderChunk.logdepthbuf_pars_vertex,
"void main() {",THREE.ShaderChunk.color_vertex,"\tvLineDistance = scale * lineDistance;\n\tvec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );\n\tgl_Position = projectionMatrix * mvPosition;",THREE.ShaderChunk.logdepthbuf_vertex,"}"].join("\n"),fragmentShader:["uniform vec3 diffuse;\nuniform float opacity;\nuniform float dashSize;\nuniform float totalSize;\nvarying float vLineDistance;",THREE.ShaderChunk.color_pars_fragment,THREE.ShaderChunk.fog_pars_fragment,THREE.ShaderChunk.logdepthbuf_pars_fragment,
"void main() {\n\tif ( mod( vLineDistance, totalSize ) > dashSize ) {\n\t\tdiscard;\n\t}\n\tgl_FragColor = vec4( diffuse, opacity );",THREE.ShaderChunk.logdepthbuf_fragment,THREE.ShaderChunk.color_fragment,THREE.ShaderChunk.fog_fragment,"}"].join("\n")},depth:{uniforms:{mNear:{type:"f",value:1},mFar:{type:"f",value:2E3},opacity:{type:"f",value:1}},vertexShader:[THREE.ShaderChunk.morphtarget_pars_vertex,THREE.ShaderChunk.logdepthbuf_pars_vertex,"void main() {",THREE.ShaderChunk.morphtarget_vertex,
THREE.ShaderChunk.default_vertex,THREE.ShaderChunk.logdepthbuf_vertex,"}"].join("\n"),fragmentShader:["uniform float mNear;\nuniform float mFar;\nuniform float opacity;",THREE.ShaderChunk.logdepthbuf_pars_fragment,"void main() {",THREE.ShaderChunk.logdepthbuf_fragment,"\t#ifdef USE_LOGDEPTHBUF_EXT\n\t\tfloat depth = gl_FragDepthEXT / gl_FragCoord.w;\n\t#else\n\t\tfloat depth = gl_FragCoord.z / gl_FragCoord.w;\n\t#endif\n\tfloat color = 1.0 - smoothstep( mNear, mFar, depth );\n\tgl_FragColor = vec4( vec3( color ), opacity );\n}"].join("\n")},
normal:{uniforms:{opacity:{type:"f",value:1}},vertexShader:["varying vec3 vNormal;",THREE.ShaderChunk.morphtarget_pars_vertex,THREE.ShaderChunk.logdepthbuf_pars_vertex,"void main() {\n\tvNormal = normalize( normalMatrix * normal );",THREE.ShaderChunk.morphtarget_vertex,THREE.ShaderChunk.default_vertex,THREE.ShaderChunk.logdepthbuf_vertex,"}"].join("\n"),fragmentShader:["uniform float opacity;\nvarying vec3 vNormal;",THREE.ShaderChunk.logdepthbuf_pars_fragment,"void main() {\n\tgl_FragColor = vec4( 0.5 * normalize( vNormal ) + 0.5, opacity );",
THREE.ShaderChunk.logdepthbuf_fragment,"}"].join("\n")},normalmap:{uniforms:THREE.UniformsUtils.merge([THREE.UniformsLib.fog,THREE.UniformsLib.lights,THREE.UniformsLib.shadowmap,{enableAO:{type:"i",value:0},enableDiffuse:{type:"i",value:0},enableSpecular:{type:"i",value:0},enableReflection:{type:"i",value:0},enableDisplacement:{type:"i",value:0},tDisplacement:{type:"t",value:null},tDiffuse:{type:"t",value:null},tCube:{type:"t",value:null},tNormal:{type:"t",value:null},tSpecular:{type:"t",value:null},
tAO:{type:"t",value:null},uNormalScale:{type:"v2",value:new THREE.Vector2(1,1)},uDisplacementBias:{type:"f",value:0},uDisplacementScale:{type:"f",value:1},diffuse:{type:"c",value:new THREE.Color(16777215)},specular:{type:"c",value:new THREE.Color(1118481)},ambient:{type:"c",value:new THREE.Color(16777215)},shininess:{type:"f",value:30},opacity:{type:"f",value:1},useRefract:{type:"i",value:0},refractionRatio:{type:"f",value:0.98},reflectivity:{type:"f",value:0.5},uOffset:{type:"v2",value:new THREE.Vector2(0,
0)},uRepeat:{type:"v2",value:new THREE.Vector2(1,1)},wrapRGB:{type:"v3",value:new THREE.Vector3(1,1,1)}}]),fragmentShader:["uniform vec3 ambient;\nuniform vec3 diffuse;\nuniform vec3 specular;\nuniform float shininess;\nuniform float opacity;\nuniform bool enableDiffuse;\nuniform bool enableSpecular;\nuniform bool enableAO;\nuniform bool enableReflection;\nuniform sampler2D tDiffuse;\nuniform sampler2D tNormal;\nuniform sampler2D tSpecular;\nuniform sampler2D tAO;\nuniform samplerCube tCube;\nuniform vec2 uNormalScale;\nuniform bool useRefract;\nuniform float refractionRatio;\nuniform float reflectivity;\nvarying vec3 vTangent;\nvarying vec3 vBinormal;\nvarying vec3 vNormal;\nvarying vec2 vUv;\nuniform vec3 ambientLightColor;\n#if MAX_DIR_LIGHTS > 0\n\tuniform vec3 directionalLightColor[ MAX_DIR_LIGHTS ];\n\tuniform vec3 directionalLightDirection[ MAX_DIR_LIGHTS ];\n#endif\n#if MAX_HEMI_LIGHTS > 0\n\tuniform vec3 hemisphereLightSkyColor[ MAX_HEMI_LIGHTS ];\n\tuniform vec3 hemisphereLightGroundColor[ MAX_HEMI_LIGHTS ];\n\tuniform vec3 hemisphereLightDirection[ MAX_HEMI_LIGHTS ];\n#endif\n#if MAX_POINT_LIGHTS > 0\n\tuniform vec3 pointLightColor[ MAX_POINT_LIGHTS ];\n\tuniform vec3 pointLightPosition[ MAX_POINT_LIGHTS ];\n\tuniform float pointLightDistance[ MAX_POINT_LIGHTS ];\n#endif\n#if MAX_SPOT_LIGHTS > 0\n\tuniform vec3 spotLightColor[ MAX_SPOT_LIGHTS ];\n\tuniform vec3 spotLightPosition[ MAX_SPOT_LIGHTS ];\n\tuniform vec3 spotLightDirection[ MAX_SPOT_LIGHTS ];\n\tuniform float spotLightAngleCos[ MAX_SPOT_LIGHTS ];\n\tuniform float spotLightExponent[ MAX_SPOT_LIGHTS ];\n\tuniform float spotLightDistance[ MAX_SPOT_LIGHTS ];\n#endif\n#ifdef WRAP_AROUND\n\tuniform vec3 wrapRGB;\n#endif\nvarying vec3 vWorldPosition;\nvarying vec3 vViewPosition;",
THREE.ShaderChunk.shadowmap_pars_fragment,THREE.ShaderChunk.fog_pars_fragment,THREE.ShaderChunk.logdepthbuf_pars_fragment,"void main() {",THREE.ShaderChunk.logdepthbuf_fragment,"\tgl_FragColor = vec4( vec3( 1.0 ), opacity );\n\tvec3 specularTex = vec3( 1.0 );\n\tvec3 normalTex = texture2D( tNormal, vUv ).xyz * 2.0 - 1.0;\n\tnormalTex.xy *= uNormalScale;\n\tnormalTex = normalize( normalTex );\n\tif( enableDiffuse ) {\n\t\t#ifdef GAMMA_INPUT\n\t\t\tvec4 texelColor = texture2D( tDiffuse, vUv );\n\t\t\ttexelColor.xyz *= texelColor.xyz;\n\t\t\tgl_FragColor = gl_FragColor * texelColor;\n\t\t#else\n\t\t\tgl_FragColor = gl_FragColor * texture2D( tDiffuse, vUv );\n\t\t#endif\n\t}\n\tif( enableAO ) {\n\t\t#ifdef GAMMA_INPUT\n\t\t\tvec4 aoColor = texture2D( tAO, vUv );\n\t\t\taoColor.xyz *= aoColor.xyz;\n\t\t\tgl_FragColor.xyz = gl_FragColor.xyz * aoColor.xyz;\n\t\t#else\n\t\t\tgl_FragColor.xyz = gl_FragColor.xyz * texture2D( tAO, vUv ).xyz;\n\t\t#endif\n\t}\n\tif( enableSpecular )\n\t\tspecularTex = texture2D( tSpecular, vUv ).xyz;\n\tmat3 tsb = mat3( normalize( vTangent ), normalize( vBinormal ), normalize( vNormal ) );\n\tvec3 finalNormal = tsb * normalTex;\n\t#ifdef FLIP_SIDED\n\t\tfinalNormal = -finalNormal;\n\t#endif\n\tvec3 normal = normalize( finalNormal );\n\tvec3 viewPosition = normalize( vViewPosition );\n\t#if MAX_POINT_LIGHTS > 0\n\t\tvec3 pointDiffuse = vec3( 0.0 );\n\t\tvec3 pointSpecular = vec3( 0.0 );\n\t\tfor ( int i = 0; i < MAX_POINT_LIGHTS; i ++ ) {\n\t\t\tvec4 lPosition = viewMatrix * vec4( pointLightPosition[ i ], 1.0 );\n\t\t\tvec3 pointVector = lPosition.xyz + vViewPosition.xyz;\n\t\t\tfloat pointDistance = 1.0;\n\t\t\tif ( pointLightDistance[ i ] > 0.0 )\n\t\t\t\tpointDistance = 1.0 - min( ( length( pointVector ) / pointLightDistance[ i ] ), 1.0 );\n\t\t\tpointVector = normalize( pointVector );\n\t\t\t#ifdef WRAP_AROUND\n\t\t\t\tfloat pointDiffuseWeightFull = max( dot( normal, pointVector ), 0.0 );\n\t\t\t\tfloat pointDiffuseWeightHalf = max( 0.5 * dot( normal, pointVector ) + 0.5, 0.0 );\n\t\t\t\tvec3 pointDiffuseWeight = mix( vec3( pointDiffuseWeightFull ), vec3( pointDiffuseWeightHalf ), wrapRGB );\n\t\t\t#else\n\t\t\t\tfloat pointDiffuseWeight = max( dot( normal, pointVector ), 0.0 );\n\t\t\t#endif\n\t\t\tpointDiffuse += pointDistance * pointLightColor[ i ] * diffuse * pointDiffuseWeight;\n\t\t\tvec3 pointHalfVector = normalize( pointVector + viewPosition );\n\t\t\tfloat pointDotNormalHalf = max( dot( normal, pointHalfVector ), 0.0 );\n\t\t\tfloat pointSpecularWeight = specularTex.r * max( pow( pointDotNormalHalf, shininess ), 0.0 );\n\t\t\tfloat specularNormalization = ( shininess + 2.0001 ) / 8.0;\n\t\t\tvec3 schlick = specular + vec3( 1.0 - specular ) * pow( 1.0 - dot( pointVector, pointHalfVector ), 5.0 );\n\t\t\tpointSpecular += schlick * pointLightColor[ i ] * pointSpecularWeight * pointDiffuseWeight * pointDistance * specularNormalization;\n\t\t}\n\t#endif\n\t#if MAX_SPOT_LIGHTS > 0\n\t\tvec3 spotDiffuse = vec3( 0.0 );\n\t\tvec3 spotSpecular = vec3( 0.0 );\n\t\tfor ( int i = 0; i < MAX_SPOT_LIGHTS; i ++ ) {\n\t\t\tvec4 lPosition = viewMatrix * vec4( spotLightPosition[ i ], 1.0 );\n\t\t\tvec3 spotVector = lPosition.xyz + vViewPosition.xyz;\n\t\t\tfloat spotDistance = 1.0;\n\t\t\tif ( spotLightDistance[ i ] > 0.0 )\n\t\t\t\tspotDistance = 1.0 - min( ( length( spotVector ) / spotLightDistance[ i ] ), 1.0 );\n\t\t\tspotVector = normalize( spotVector );\n\t\t\tfloat spotEffect = dot( spotLightDirection[ i ], normalize( spotLightPosition[ i ] - vWorldPosition ) );\n\t\t\tif ( spotEffect > spotLightAngleCos[ i ] ) {\n\t\t\t\tspotEffect = max( pow( spotEffect, spotLightExponent[ i ] ), 0.0 );\n\t\t\t\t#ifdef WRAP_AROUND\n\t\t\t\t\tfloat spotDiffuseWeightFull = max( dot( normal, spotVector ), 0.0 );\n\t\t\t\t\tfloat spotDiffuseWeightHalf = max( 0.5 * dot( normal, spotVector ) + 0.5, 0.0 );\n\t\t\t\t\tvec3 spotDiffuseWeight = mix( vec3( spotDiffuseWeightFull ), vec3( spotDiffuseWeightHalf ), wrapRGB );\n\t\t\t\t#else\n\t\t\t\t\tfloat spotDiffuseWeight = max( dot( normal, spotVector ), 0.0 );\n\t\t\t\t#endif\n\t\t\t\tspotDiffuse += spotDistance * spotLightColor[ i ] * diffuse * spotDiffuseWeight * spotEffect;\n\t\t\t\tvec3 spotHalfVector = normalize( spotVector + viewPosition );\n\t\t\t\tfloat spotDotNormalHalf = max( dot( normal, spotHalfVector ), 0.0 );\n\t\t\t\tfloat spotSpecularWeight = specularTex.r * max( pow( spotDotNormalHalf, shininess ), 0.0 );\n\t\t\t\tfloat specularNormalization = ( shininess + 2.0001 ) / 8.0;\n\t\t\t\tvec3 schlick = specular + vec3( 1.0 - specular ) * pow( 1.0 - dot( spotVector, spotHalfVector ), 5.0 );\n\t\t\t\tspotSpecular += schlick * spotLightColor[ i ] * spotSpecularWeight * spotDiffuseWeight * spotDistance * specularNormalization * spotEffect;\n\t\t\t}\n\t\t}\n\t#endif\n\t#if MAX_DIR_LIGHTS > 0\n\t\tvec3 dirDiffuse = vec3( 0.0 );\n\t\tvec3 dirSpecular = vec3( 0.0 );\n\t\tfor( int i = 0; i < MAX_DIR_LIGHTS; i++ ) {\n\t\t\tvec4 lDirection = viewMatrix * vec4( directionalLightDirection[ i ], 0.0 );\n\t\t\tvec3 dirVector = normalize( lDirection.xyz );\n\t\t\t#ifdef WRAP_AROUND\n\t\t\t\tfloat directionalLightWeightingFull = max( dot( normal, dirVector ), 0.0 );\n\t\t\t\tfloat directionalLightWeightingHalf = max( 0.5 * dot( normal, dirVector ) + 0.5, 0.0 );\n\t\t\t\tvec3 dirDiffuseWeight = mix( vec3( directionalLightWeightingFull ), vec3( directionalLightWeightingHalf ), wrapRGB );\n\t\t\t#else\n\t\t\t\tfloat dirDiffuseWeight = max( dot( normal, dirVector ), 0.0 );\n\t\t\t#endif\n\t\t\tdirDiffuse += directionalLightColor[ i ] * diffuse * dirDiffuseWeight;\n\t\t\tvec3 dirHalfVector = normalize( dirVector + viewPosition );\n\t\t\tfloat dirDotNormalHalf = max( dot( normal, dirHalfVector ), 0.0 );\n\t\t\tfloat dirSpecularWeight = specularTex.r * max( pow( dirDotNormalHalf, shininess ), 0.0 );\n\t\t\tfloat specularNormalization = ( shininess + 2.0001 ) / 8.0;\n\t\t\tvec3 schlick = specular + vec3( 1.0 - specular ) * pow( 1.0 - dot( dirVector, dirHalfVector ), 5.0 );\n\t\t\tdirSpecular += schlick * directionalLightColor[ i ] * dirSpecularWeight * dirDiffuseWeight * specularNormalization;\n\t\t}\n\t#endif\n\t#if MAX_HEMI_LIGHTS > 0\n\t\tvec3 hemiDiffuse  = vec3( 0.0 );\n\t\tvec3 hemiSpecular = vec3( 0.0 );\n\t\tfor( int i = 0; i < MAX_HEMI_LIGHTS; i ++ ) {\n\t\t\tvec4 lDirection = viewMatrix * vec4( hemisphereLightDirection[ i ], 0.0 );\n\t\t\tvec3 lVector = normalize( lDirection.xyz );\n\t\t\tfloat dotProduct = dot( normal, lVector );\n\t\t\tfloat hemiDiffuseWeight = 0.5 * dotProduct + 0.5;\n\t\t\tvec3 hemiColor = mix( hemisphereLightGroundColor[ i ], hemisphereLightSkyColor[ i ], hemiDiffuseWeight );\n\t\t\themiDiffuse += diffuse * hemiColor;\n\t\t\tvec3 hemiHalfVectorSky = normalize( lVector + viewPosition );\n\t\t\tfloat hemiDotNormalHalfSky = 0.5 * dot( normal, hemiHalfVectorSky ) + 0.5;\n\t\t\tfloat hemiSpecularWeightSky = specularTex.r * max( pow( hemiDotNormalHalfSky, shininess ), 0.0 );\n\t\t\tvec3 lVectorGround = -lVector;\n\t\t\tvec3 hemiHalfVectorGround = normalize( lVectorGround + viewPosition );\n\t\t\tfloat hemiDotNormalHalfGround = 0.5 * dot( normal, hemiHalfVectorGround ) + 0.5;\n\t\t\tfloat hemiSpecularWeightGround = specularTex.r * max( pow( hemiDotNormalHalfGround, shininess ), 0.0 );\n\t\t\tfloat dotProductGround = dot( normal, lVectorGround );\n\t\t\tfloat specularNormalization = ( shininess + 2.0001 ) / 8.0;\n\t\t\tvec3 schlickSky = specular + vec3( 1.0 - specular ) * pow( 1.0 - dot( lVector, hemiHalfVectorSky ), 5.0 );\n\t\t\tvec3 schlickGround = specular + vec3( 1.0 - specular ) * pow( 1.0 - dot( lVectorGround, hemiHalfVectorGround ), 5.0 );\n\t\t\themiSpecular += hemiColor * specularNormalization * ( schlickSky * hemiSpecularWeightSky * max( dotProduct, 0.0 ) + schlickGround * hemiSpecularWeightGround * max( dotProductGround, 0.0 ) );\n\t\t}\n\t#endif\n\tvec3 totalDiffuse = vec3( 0.0 );\n\tvec3 totalSpecular = vec3( 0.0 );\n\t#if MAX_DIR_LIGHTS > 0\n\t\ttotalDiffuse += dirDiffuse;\n\t\ttotalSpecular += dirSpecular;\n\t#endif\n\t#if MAX_HEMI_LIGHTS > 0\n\t\ttotalDiffuse += hemiDiffuse;\n\t\ttotalSpecular += hemiSpecular;\n\t#endif\n\t#if MAX_POINT_LIGHTS > 0\n\t\ttotalDiffuse += pointDiffuse;\n\t\ttotalSpecular += pointSpecular;\n\t#endif\n\t#if MAX_SPOT_LIGHTS > 0\n\t\ttotalDiffuse += spotDiffuse;\n\t\ttotalSpecular += spotSpecular;\n\t#endif\n\t#ifdef METAL\n\t\tgl_FragColor.xyz = gl_FragColor.xyz * ( totalDiffuse + ambientLightColor * ambient + totalSpecular );\n\t#else\n\t\tgl_FragColor.xyz = gl_FragColor.xyz * ( totalDiffuse + ambientLightColor * ambient ) + totalSpecular;\n\t#endif\n\tif ( enableReflection ) {\n\t\tvec3 vReflect;\n\t\tvec3 cameraToVertex = normalize( vWorldPosition - cameraPosition );\n\t\tif ( useRefract ) {\n\t\t\tvReflect = refract( cameraToVertex, normal, refractionRatio );\n\t\t} else {\n\t\t\tvReflect = reflect( cameraToVertex, normal );\n\t\t}\n\t\tvec4 cubeColor = textureCube( tCube, vec3( -vReflect.x, vReflect.yz ) );\n\t\t#ifdef GAMMA_INPUT\n\t\t\tcubeColor.xyz *= cubeColor.xyz;\n\t\t#endif\n\t\tgl_FragColor.xyz = mix( gl_FragColor.xyz, cubeColor.xyz, specularTex.r * reflectivity );\n\t}",
THREE.ShaderChunk.shadowmap_fragment,THREE.ShaderChunk.linear_to_gamma_fragment,THREE.ShaderChunk.fog_fragment,"}"].join("\n"),vertexShader:["attribute vec4 tangent;\nuniform vec2 uOffset;\nuniform vec2 uRepeat;\nuniform bool enableDisplacement;\n#ifdef VERTEX_TEXTURES\n\tuniform sampler2D tDisplacement;\n\tuniform float uDisplacementScale;\n\tuniform float uDisplacementBias;\n#endif\nvarying vec3 vTangent;\nvarying vec3 vBinormal;\nvarying vec3 vNormal;\nvarying vec2 vUv;\nvarying vec3 vWorldPosition;\nvarying vec3 vViewPosition;",
THREE.ShaderChunk.skinning_pars_vertex,THREE.ShaderChunk.shadowmap_pars_vertex,THREE.ShaderChunk.logdepthbuf_pars_vertex,"void main() {",THREE.ShaderChunk.skinbase_vertex,THREE.ShaderChunk.skinnormal_vertex,"\t#ifdef USE_SKINNING\n\t\tvNormal = normalize( normalMatrix * skinnedNormal.xyz );\n\t\tvec4 skinnedTangent = skinMatrix * vec4( tangent.xyz, 0.0 );\n\t\tvTangent = normalize( normalMatrix * skinnedTangent.xyz );\n\t#else\n\t\tvNormal = normalize( normalMatrix * normal );\n\t\tvTangent = normalize( normalMatrix * tangent.xyz );\n\t#endif\n\tvBinormal = normalize( cross( vNormal, vTangent ) * tangent.w );\n\tvUv = uv * uRepeat + uOffset;\n\tvec3 displacedPosition;\n\t#ifdef VERTEX_TEXTURES\n\t\tif ( enableDisplacement ) {\n\t\t\tvec3 dv = texture2D( tDisplacement, uv ).xyz;\n\t\t\tfloat df = uDisplacementScale * dv.x + uDisplacementBias;\n\t\t\tdisplacedPosition = position + normalize( normal ) * df;\n\t\t} else {\n\t\t\t#ifdef USE_SKINNING\n\t\t\t\tvec4 skinVertex = vec4( position, 1.0 );\n\t\t\t\tvec4 skinned  = boneMatX * skinVertex * skinWeight.x;\n\t\t\t\tskinned \t  += boneMatY * skinVertex * skinWeight.y;\n\t\t\t\tskinned \t  += boneMatZ * skinVertex * skinWeight.z;\n\t\t\t\tskinned \t  += boneMatW * skinVertex * skinWeight.w;\n\t\t\t\tdisplacedPosition  = skinned.xyz;\n\t\t\t#else\n\t\t\t\tdisplacedPosition = position;\n\t\t\t#endif\n\t\t}\n\t#else\n\t\t#ifdef USE_SKINNING\n\t\t\tvec4 skinVertex = vec4( position, 1.0 );\n\t\t\tvec4 skinned  = boneMatX * skinVertex * skinWeight.x;\n\t\t\tskinned \t  += boneMatY * skinVertex * skinWeight.y;\n\t\t\tskinned \t  += boneMatZ * skinVertex * skinWeight.z;\n\t\t\tskinned \t  += boneMatW * skinVertex * skinWeight.w;\n\t\t\tdisplacedPosition  = skinned.xyz;\n\t\t#else\n\t\t\tdisplacedPosition = position;\n\t\t#endif\n\t#endif\n\tvec4 mvPosition = modelViewMatrix * vec4( displacedPosition, 1.0 );\n\tvec4 worldPosition = modelMatrix * vec4( displacedPosition, 1.0 );\n\tgl_Position = projectionMatrix * mvPosition;",
THREE.ShaderChunk.logdepthbuf_vertex,"\tvWorldPosition = worldPosition.xyz;\n\tvViewPosition = -mvPosition.xyz;\n\t#ifdef USE_SHADOWMAP\n\t\tfor( int i = 0; i < MAX_SHADOWS; i ++ ) {\n\t\t\tvShadowCoord[ i ] = shadowMatrix[ i ] * worldPosition;\n\t\t}\n\t#endif\n}"].join("\n")},cube:{uniforms:{tCube:{type:"t",value:null},tFlip:{type:"f",value:-1}},vertexShader:["varying vec3 vWorldPosition;",THREE.ShaderChunk.logdepthbuf_pars_vertex,"void main() {\n\tvec4 worldPosition = modelMatrix * vec4( position, 1.0 );\n\tvWorldPosition = worldPosition.xyz;\n\tgl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
THREE.ShaderChunk.logdepthbuf_vertex,"}"].join("\n"),fragmentShader:["uniform samplerCube tCube;\nuniform float tFlip;\nvarying vec3 vWorldPosition;",THREE.ShaderChunk.logdepthbuf_pars_fragment,"void main() {\n\tgl_FragColor = textureCube( tCube, vec3( tFlip * vWorldPosition.x, vWorldPosition.yz ) );",THREE.ShaderChunk.logdepthbuf_fragment,"}"].join("\n")},depthRGBA:{uniforms:{},vertexShader:[THREE.ShaderChunk.morphtarget_pars_vertex,THREE.ShaderChunk.skinning_pars_vertex,THREE.ShaderChunk.logdepthbuf_pars_vertex,
"void main() {",THREE.ShaderChunk.skinbase_vertex,THREE.ShaderChunk.morphtarget_vertex,THREE.ShaderChunk.skinning_vertex,THREE.ShaderChunk.default_vertex,THREE.ShaderChunk.logdepthbuf_vertex,"}"].join("\n"),fragmentShader:[THREE.ShaderChunk.logdepthbuf_pars_fragment,"vec4 pack_depth( const in float depth ) {\n\tconst vec4 bit_shift = vec4( 256.0 * 256.0 * 256.0, 256.0 * 256.0, 256.0, 1.0 );\n\tconst vec4 bit_mask  = vec4( 0.0, 1.0 / 256.0, 1.0 / 256.0, 1.0 / 256.0 );\n\tvec4 res = mod( depth * bit_shift * vec4( 255 ), vec4( 256 ) ) / vec4( 255 );\n\tres -= res.xxyz * bit_mask;\n\treturn res;\n}\nvoid main() {",
THREE.ShaderChunk.logdepthbuf_fragment,"\t#ifdef USE_LOGDEPTHBUF_EXT\n\t\tgl_FragData[ 0 ] = pack_depth( gl_FragDepthEXT );\n\t#else\n\t\tgl_FragData[ 0 ] = pack_depth( gl_FragCoord.z );\n\t#endif\n}"].join("\n")}};THREE.WebGLRenderer=function(a){function b(a,b){var c=a.vertices.length,d=b.material;if(d.attributes){void 0===a.__webglCustomAttributesList&&(a.__webglCustomAttributesList=[]);for(var e in d.attributes){var f=d.attributes[e];if(!f.__webglInitialized||f.createUniqueBuffers){f.__webglInitialized=!0;var g=1;"v2"===f.type?g=2:"v3"===f.type?g=3:"v4"===f.type?g=4:"c"===f.type&&(g=3);f.size=g;f.array=new Float32Array(c*g);f.buffer=m.createBuffer();f.buffer.belongsToAttribute=e;f.needsUpdate=!0}a.__webglCustomAttributesList.push(f)}}}
function c(a,b){var c=b.geometry,g=a.faces3,h=3*g.length,k=1*g.length,l=3*g.length,g=d(b,a),n=f(g),p=e(g),q=g.vertexColors?g.vertexColors:!1;a.__vertexArray=new Float32Array(3*h);p&&(a.__normalArray=new Float32Array(3*h));c.hasTangents&&(a.__tangentArray=new Float32Array(4*h));q&&(a.__colorArray=new Float32Array(3*h));n&&(0<c.faceVertexUvs.length&&(a.__uvArray=new Float32Array(2*h)),1<c.faceVertexUvs.length&&(a.__uv2Array=new Float32Array(2*h)));b.geometry.skinWeights.length&&b.geometry.skinIndices.length&&
(a.__skinIndexArray=new Float32Array(4*h),a.__skinWeightArray=new Float32Array(4*h));c=null!==pb&&21845<k?Uint32Array:Uint16Array;a.__typeArray=c;a.__faceArray=new c(3*k);a.__lineArray=new c(2*l);if(a.numMorphTargets)for(a.__morphTargetsArrays=[],c=0,n=a.numMorphTargets;c<n;c++)a.__morphTargetsArrays.push(new Float32Array(3*h));if(a.numMorphNormals)for(a.__morphNormalsArrays=[],c=0,n=a.numMorphNormals;c<n;c++)a.__morphNormalsArrays.push(new Float32Array(3*h));a.__webglFaceCount=3*k;a.__webglLineCount=
2*l;if(g.attributes){void 0===a.__webglCustomAttributesList&&(a.__webglCustomAttributesList=[]);for(var r in g.attributes){var k=g.attributes[r],l={},s;for(s in k)l[s]=k[s];if(!l.__webglInitialized||l.createUniqueBuffers)l.__webglInitialized=!0,c=1,"v2"===l.type?c=2:"v3"===l.type?c=3:"v4"===l.type?c=4:"c"===l.type&&(c=3),l.size=c,l.array=new Float32Array(h*c),l.buffer=m.createBuffer(),l.buffer.belongsToAttribute=r,k.needsUpdate=!0,l.__original=k;a.__webglCustomAttributesList.push(l)}}a.__inittedArrays=
!0}function d(a,b){return a.material instanceof THREE.MeshFaceMaterial?a.material.materials[b.materialIndex]:a.material}function e(a){return a instanceof THREE.MeshBasicMaterial&&!a.envMap||a instanceof THREE.MeshDepthMaterial?!1:a&&void 0!==a.shading&&a.shading===THREE.SmoothShading?THREE.SmoothShading:THREE.FlatShading}function f(a){return a.map||a.lightMap||a.bumpMap||a.normalMap||a.specularMap||a instanceof THREE.ShaderMaterial?!0:!1}function g(a,b,c,d){for(var e in b){var f=b[e],g=c[e];if(0<=
f)if(g){var h=g.itemSize;m.bindBuffer(m.ARRAY_BUFFER,g.buffer);k(f);m.vertexAttribPointer(f,h,m.FLOAT,!1,0,d*h*4)}else a.defaultAttributeValues&&(2===a.defaultAttributeValues[e].length?m.vertexAttrib2fv(f,a.defaultAttributeValues[e]):3===a.defaultAttributeValues[e].length&&m.vertexAttrib3fv(f,a.defaultAttributeValues[e]))}l()}function h(){for(var a=0,b=Ka.length;a<b;a++)Ka[a]=0}function k(a){Ka[a]=1;0===ob[a]&&(m.enableVertexAttribArray(a),ob[a]=1)}function l(){for(var a=0,b=ob.length;a<b;a++)ob[a]!==
Ka[a]&&(m.disableVertexAttribArray(a),ob[a]=0)}function n(a,b){return a.z!==b.z?b.z-a.z:a.id-b.id}function q(a,b){return b[0]-a[0]}function p(a,b,c){if(a.length)for(var d=0,e=a.length;d<e;d++)Ia=wa=null,fa=za=ha=Ga=ma=ia=Oa=-1,cb=!0,a[d].render(b,c,ja,ra),Ia=wa=null,fa=za=ha=Ga=ma=ia=Oa=-1,cb=!0}function s(a,b,c,d,e,f,g,h){var k,m,l,n;b?(m=a.length-1,n=b=-1):(m=0,b=a.length,n=1);for(var p=m;p!==b;p+=n)if(k=a[p],k.render){m=k.object;l=k.buffer;if(h)k=h;else{k=k[c];if(!k)continue;g&&P.setBlending(k.blending,
k.blendEquation,k.blendSrc,k.blendDst);P.setDepthTest(k.depthTest);P.setDepthWrite(k.depthWrite);G(k.polygonOffset,k.polygonOffsetFactor,k.polygonOffsetUnits)}P.setMaterialFaces(k);l instanceof THREE.BufferGeometry?P.renderBufferDirect(d,e,f,k,l,m):P.renderBuffer(d,e,f,k,l,m)}}function t(a,b,c,d,e,f,g){for(var h,k,m=0,l=a.length;m<l;m++)if(h=a[m],k=h.object,k.visible){if(g)h=g;else{h=h[b];if(!h)continue;f&&P.setBlending(h.blending,h.blendEquation,h.blendSrc,h.blendDst);P.setDepthTest(h.depthTest);
P.setDepthWrite(h.depthWrite);G(h.polygonOffset,h.polygonOffsetFactor,h.polygonOffsetUnits)}P.renderImmediateObject(c,d,e,h,k)}}function r(a,d){var e,f,g;if(void 0===a.__webglInit&&(a.__webglInit=!0,a._modelViewMatrix=new THREE.Matrix4,a._normalMatrix=new THREE.Matrix3,f=a.geometry,void 0!==f&&void 0===f.__webglInit))if(f.__webglInit=!0,f.addEventListener("dispose",Eb),f instanceof THREE.BufferGeometry)for(g in f.attributes){var h="index"===g?m.ELEMENT_ARRAY_BUFFER:m.ARRAY_BUFFER,k=f.attributes[g];
k.buffer=m.createBuffer();m.bindBuffer(h,k.buffer);m.bufferData(h,k.array,m.STATIC_DRAW)}else if(a instanceof THREE.Mesh)for(e in g=a.material,void 0===f.geometryGroups&&f.makeGroups(g instanceof THREE.MeshFaceMaterial,pb?4294967296:65535),f.geometryGroups){if(g=f.geometryGroups[e],!g.__webglVertexBuffer){h=g;h.__webglVertexBuffer=m.createBuffer();h.__webglNormalBuffer=m.createBuffer();h.__webglTangentBuffer=m.createBuffer();h.__webglColorBuffer=m.createBuffer();h.__webglUVBuffer=m.createBuffer();
h.__webglUV2Buffer=m.createBuffer();h.__webglSkinIndicesBuffer=m.createBuffer();h.__webglSkinWeightsBuffer=m.createBuffer();h.__webglFaceBuffer=m.createBuffer();h.__webglLineBuffer=m.createBuffer();var l=k=void 0;if(h.numMorphTargets)for(h.__webglMorphTargetsBuffers=[],k=0,l=h.numMorphTargets;k<l;k++)h.__webglMorphTargetsBuffers.push(m.createBuffer());if(h.numMorphNormals)for(h.__webglMorphNormalsBuffers=[],k=0,l=h.numMorphNormals;k<l;k++)h.__webglMorphNormalsBuffers.push(m.createBuffer());P.info.memory.geometries++;
c(g,a);f.verticesNeedUpdate=!0;f.morphTargetsNeedUpdate=!0;f.elementsNeedUpdate=!0;f.uvsNeedUpdate=!0;f.normalsNeedUpdate=!0;f.tangentsNeedUpdate=!0;f.colorsNeedUpdate=!0}}else a instanceof THREE.Line?f.__webglVertexBuffer||(g=f,g.__webglVertexBuffer=m.createBuffer(),g.__webglColorBuffer=m.createBuffer(),g.__webglLineDistanceBuffer=m.createBuffer(),P.info.memory.geometries++,g=f,h=g.vertices.length,g.__vertexArray=new Float32Array(3*h),g.__colorArray=new Float32Array(3*h),g.__lineDistanceArray=new Float32Array(1*
h),g.__webglLineCount=h,b(g,a),f.verticesNeedUpdate=!0,f.colorsNeedUpdate=!0,f.lineDistancesNeedUpdate=!0):a instanceof THREE.ParticleSystem&&!f.__webglVertexBuffer&&(g=f,g.__webglVertexBuffer=m.createBuffer(),g.__webglColorBuffer=m.createBuffer(),P.info.memory.geometries++,g=f,h=g.vertices.length,g.__vertexArray=new Float32Array(3*h),g.__colorArray=new Float32Array(3*h),g.__sortArray=[],g.__webglParticleCount=h,b(g,a),f.verticesNeedUpdate=!0,f.colorsNeedUpdate=!0);if(void 0===a.__webglActive){if(a instanceof
THREE.Mesh)if(f=a.geometry,f instanceof THREE.BufferGeometry)v(d.__webglObjects,f,a);else{if(f instanceof THREE.Geometry)for(e in f.geometryGroups)g=f.geometryGroups[e],v(d.__webglObjects,g,a)}else a instanceof THREE.Line||a instanceof THREE.ParticleSystem?(f=a.geometry,v(d.__webglObjects,f,a)):a instanceof THREE.ImmediateRenderObject||a.immediateRenderCallback?d.__webglObjectsImmediate.push({id:null,object:a,opaque:null,transparent:null,z:0}):a instanceof THREE.Sprite?d.__webglSprites.push(a):a instanceof
THREE.LensFlare&&d.__webglFlares.push(a);a.__webglActive=!0}}function v(a,b,c){a.push({id:null,buffer:b,object:c,opaque:null,transparent:null,z:0})}function w(a){for(var b in a.attributes)if(a.attributes[b].needsUpdate)return!0;return!1}function u(a){for(var b in a.attributes)a.attributes[b].needsUpdate=!1}function y(a,b){a instanceof THREE.Mesh||a instanceof THREE.ParticleSystem||a instanceof THREE.Line?L(b.__webglObjects,a):a instanceof THREE.Sprite?x(b.__webglSprites,a):a instanceof THREE.LensFlare?
x(b.__webglFlares,a):(a instanceof THREE.ImmediateRenderObject||a.immediateRenderCallback)&&L(b.__webglObjectsImmediate,a);delete a.__webglActive}function L(a,b){for(var c=a.length-1;0<=c;c--)a[c].object===b&&a.splice(c,1)}function x(a,b){for(var c=a.length-1;0<=c;c--)a[c]===b&&a.splice(c,1)}function N(a,b,c,d,e){Ea=0;d.needsUpdate&&(d.program&&Fb(d),P.initMaterial(d,b,c,e),d.needsUpdate=!1);d.morphTargets&&!e.__webglMorphTargetInfluences&&(e.__webglMorphTargetInfluences=new Float32Array(P.maxMorphTargets));
var f=!1,g=d.program,h=g.uniforms,k=d.uniforms;g.id!==wa&&(m.useProgram(g.program),wa=g.id,f=!0);d.id!==fa&&(fa=d.id,f=!0);if(f||a!==Ia)m.uniformMatrix4fv(h.projectionMatrix,!1,a.projectionMatrix.elements),da&&m.uniform1f(h.logDepthBufFC,2/(Math.log(a.far+1)/Math.LN2)),a!==Ia&&(Ia=a);if(d.skinning)if(Gb&&e.skeleton.useVertexTexture){if(null!==h.boneTexture){var l=J();m.uniform1i(h.boneTexture,l);P.setTexture(e.skeleton.boneTexture,l)}null!==h.boneTextureWidth&&m.uniform1i(h.boneTextureWidth,e.skeleton.boneTextureWidth);
null!==h.boneTextureHeight&&m.uniform1i(h.boneTextureHeight,e.skeleton.boneTextureHeight)}else null!==h.boneGlobalMatrices&&m.uniformMatrix4fv(h.boneGlobalMatrices,!1,e.skeleton.boneMatrices);if(f){c&&d.fog&&(k.fogColor.value=c.color,c instanceof THREE.Fog?(k.fogNear.value=c.near,k.fogFar.value=c.far):c instanceof THREE.FogExp2&&(k.fogDensity.value=c.density));if(d instanceof THREE.MeshPhongMaterial||d instanceof THREE.MeshLambertMaterial||d.lights){if(cb){var n,p=l=0,q=0,r,s,t,u=Bb,w=u.directional.colors,
v=u.directional.positions,y=u.point.colors,A=u.point.positions,L=u.point.distances,x=u.spot.colors,G=u.spot.positions,C=u.spot.distances,E=u.spot.directions,N=u.spot.anglesCos,F=u.spot.exponents,Q=u.hemi.skyColors,I=u.hemi.groundColors,U=u.hemi.positions,Y=0,ga=0,R=0,X=0,$=0,aa=0,ba=0,Z=0,W=n=0;c=t=W=0;for(f=b.length;c<f;c++)if(n=b[c],!n.onlyShadow)if(r=n.color,s=n.intensity,t=n.distance,n instanceof THREE.AmbientLight)n.visible&&(P.gammaInput?(l+=r.r*r.r,p+=r.g*r.g,q+=r.b*r.b):(l+=r.r,p+=r.g,q+=
r.b));else if(n instanceof THREE.DirectionalLight){if($+=1,n.visible&&(oa.setFromMatrixPosition(n.matrixWorld),xa.setFromMatrixPosition(n.target.matrixWorld),oa.sub(xa),oa.normalize(),0!==oa.x||0!==oa.y||0!==oa.z))n=3*Y,v[n]=oa.x,v[n+1]=oa.y,v[n+2]=oa.z,P.gammaInput?B(w,n,r,s*s):K(w,n,r,s),Y+=1}else n instanceof THREE.PointLight?(aa+=1,n.visible&&(W=3*ga,P.gammaInput?B(y,W,r,s*s):K(y,W,r,s),xa.setFromMatrixPosition(n.matrixWorld),A[W]=xa.x,A[W+1]=xa.y,A[W+2]=xa.z,L[ga]=t,ga+=1)):n instanceof THREE.SpotLight?
(ba+=1,n.visible&&(W=3*R,P.gammaInput?B(x,W,r,s*s):K(x,W,r,s),xa.setFromMatrixPosition(n.matrixWorld),G[W]=xa.x,G[W+1]=xa.y,G[W+2]=xa.z,C[R]=t,oa.copy(xa),xa.setFromMatrixPosition(n.target.matrixWorld),oa.sub(xa),oa.normalize(),E[W]=oa.x,E[W+1]=oa.y,E[W+2]=oa.z,N[R]=Math.cos(n.angle),F[R]=n.exponent,R+=1)):n instanceof THREE.HemisphereLight&&(Z+=1,n.visible&&(oa.setFromMatrixPosition(n.matrixWorld),oa.normalize(),0!==oa.x||0!==oa.y||0!==oa.z))&&(t=3*X,U[t]=oa.x,U[t+1]=oa.y,U[t+2]=oa.z,r=n.color,n=
n.groundColor,P.gammaInput?(s*=s,B(Q,t,r,s),B(I,t,n,s)):(K(Q,t,r,s),K(I,t,n,s)),X+=1);c=3*Y;for(f=Math.max(w.length,3*$);c<f;c++)w[c]=0;c=3*ga;for(f=Math.max(y.length,3*aa);c<f;c++)y[c]=0;c=3*R;for(f=Math.max(x.length,3*ba);c<f;c++)x[c]=0;c=3*X;for(f=Math.max(Q.length,3*Z);c<f;c++)Q[c]=0;c=3*X;for(f=Math.max(I.length,3*Z);c<f;c++)I[c]=0;u.directional.length=Y;u.point.length=ga;u.spot.length=R;u.hemi.length=X;u.ambient[0]=l;u.ambient[1]=p;u.ambient[2]=q;cb=!1}c=Bb;k.ambientLightColor.value=c.ambient;
k.directionalLightColor.value=c.directional.colors;k.directionalLightDirection.value=c.directional.positions;k.pointLightColor.value=c.point.colors;k.pointLightPosition.value=c.point.positions;k.pointLightDistance.value=c.point.distances;k.spotLightColor.value=c.spot.colors;k.spotLightPosition.value=c.spot.positions;k.spotLightDistance.value=c.spot.distances;k.spotLightDirection.value=c.spot.directions;k.spotLightAngleCos.value=c.spot.anglesCos;k.spotLightExponent.value=c.spot.exponents;k.hemisphereLightSkyColor.value=
c.hemi.skyColors;k.hemisphereLightGroundColor.value=c.hemi.groundColors;k.hemisphereLightDirection.value=c.hemi.positions}if(d instanceof THREE.MeshBasicMaterial||d instanceof THREE.MeshLambertMaterial||d instanceof THREE.MeshPhongMaterial){k.opacity.value=d.opacity;P.gammaInput?k.diffuse.value.copyGammaToLinear(d.color):k.diffuse.value=d.color;k.map.value=d.map;k.lightMap.value=d.lightMap;k.specularMap.value=d.specularMap;d.bumpMap&&(k.bumpMap.value=d.bumpMap,k.bumpScale.value=d.bumpScale);d.normalMap&&
(k.normalMap.value=d.normalMap,k.normalScale.value.copy(d.normalScale));var V;d.map?V=d.map:d.specularMap?V=d.specularMap:d.normalMap?V=d.normalMap:d.bumpMap&&(V=d.bumpMap);void 0!==V&&(c=V.offset,V=V.repeat,k.offsetRepeat.value.set(c.x,c.y,V.x,V.y));k.envMap.value=d.envMap;k.flipEnvMap.value=d.envMap instanceof THREE.WebGLRenderTargetCube?1:-1;k.reflectivity.value=d.reflectivity;k.refractionRatio.value=d.refractionRatio;k.combine.value=d.combine;k.useRefract.value=d.envMap&&d.envMap.mapping instanceof
THREE.CubeRefractionMapping}d instanceof THREE.LineBasicMaterial?(k.diffuse.value=d.color,k.opacity.value=d.opacity):d instanceof THREE.LineDashedMaterial?(k.diffuse.value=d.color,k.opacity.value=d.opacity,k.dashSize.value=d.dashSize,k.totalSize.value=d.dashSize+d.gapSize,k.scale.value=d.scale):d instanceof THREE.ParticleSystemMaterial?(k.psColor.value=d.color,k.opacity.value=d.opacity,k.size.value=d.size,k.scale.value=H.height/2,k.map.value=d.map):d instanceof THREE.MeshPhongMaterial?(k.shininess.value=
d.shininess,P.gammaInput?(k.ambient.value.copyGammaToLinear(d.ambient),k.emissive.value.copyGammaToLinear(d.emissive),k.specular.value.copyGammaToLinear(d.specular)):(k.ambient.value=d.ambient,k.emissive.value=d.emissive,k.specular.value=d.specular),d.wrapAround&&k.wrapRGB.value.copy(d.wrapRGB)):d instanceof THREE.MeshLambertMaterial?(P.gammaInput?(k.ambient.value.copyGammaToLinear(d.ambient),k.emissive.value.copyGammaToLinear(d.emissive)):(k.ambient.value=d.ambient,k.emissive.value=d.emissive),d.wrapAround&&
k.wrapRGB.value.copy(d.wrapRGB)):d instanceof THREE.MeshDepthMaterial?(k.mNear.value=a.near,k.mFar.value=a.far,k.opacity.value=d.opacity):d instanceof THREE.MeshNormalMaterial&&(k.opacity.value=d.opacity);if(e.receiveShadow&&!d._shadowPass&&k.shadowMatrix)for(c=V=0,f=b.length;c<f;c++)l=b[c],l.castShadow&&(l instanceof THREE.SpotLight||l instanceof THREE.DirectionalLight&&!l.shadowCascade)&&(k.shadowMap.value[V]=l.shadowMap,k.shadowMapSize.value[V]=l.shadowMapSize,k.shadowMatrix.value[V]=l.shadowMatrix,
k.shadowDarkness.value[V]=l.shadowDarkness,k.shadowBias.value[V]=l.shadowBias,V++);b=d.uniformsList;k=0;for(V=b.length;k<V;k++)if(f=g.uniforms[b[k][1]])if(c=b[k][0],p=c.type,l=c.value,"i"===p)m.uniform1i(f,l);else if("f"===p)m.uniform1f(f,l);else if("v2"===p)m.uniform2f(f,l.x,l.y);else if("v3"===p)m.uniform3f(f,l.x,l.y,l.z);else if("v4"===p)m.uniform4f(f,l.x,l.y,l.z,l.w);else if("c"===p)m.uniform3f(f,l.r,l.g,l.b);else if("iv1"===p)m.uniform1iv(f,l);else if("iv"===p)m.uniform3iv(f,l);else if("fv1"===
p)m.uniform1fv(f,l);else if("fv"===p)m.uniform3fv(f,l);else if("v2v"===p){void 0===c._array&&(c._array=new Float32Array(2*l.length));p=0;for(q=l.length;p<q;p++)u=2*p,c._array[u]=l[p].x,c._array[u+1]=l[p].y;m.uniform2fv(f,c._array)}else if("v3v"===p){void 0===c._array&&(c._array=new Float32Array(3*l.length));p=0;for(q=l.length;p<q;p++)u=3*p,c._array[u]=l[p].x,c._array[u+1]=l[p].y,c._array[u+2]=l[p].z;m.uniform3fv(f,c._array)}else if("v4v"===p){void 0===c._array&&(c._array=new Float32Array(4*l.length));
p=0;for(q=l.length;p<q;p++)u=4*p,c._array[u]=l[p].x,c._array[u+1]=l[p].y,c._array[u+2]=l[p].z,c._array[u+3]=l[p].w;m.uniform4fv(f,c._array)}else if("m3"===p)m.uniformMatrix3fv(f,!1,l.elements);else if("m3v"===p){void 0===c._array&&(c._array=new Float32Array(9*l.length));p=0;for(q=l.length;p<q;p++)l[p].flattenToArrayOffset(c._array,9*p);m.uniformMatrix3fv(f,!1,c._array)}else if("m4"===p)m.uniformMatrix4fv(f,!1,l.elements);else if("m4v"===p){void 0===c._array&&(c._array=new Float32Array(16*l.length));
p=0;for(q=l.length;p<q;p++)l[p].flattenToArrayOffset(c._array,16*p);m.uniformMatrix4fv(f,!1,c._array)}else if("t"===p){if(u=l,l=J(),m.uniform1i(f,l),u)if(u.image instanceof Array&&6===u.image.length){if(c=u,f=l,6===c.image.length)if(c.needsUpdate){c.image.__webglTextureCube||(c.addEventListener("dispose",Hb),c.image.__webglTextureCube=m.createTexture(),P.info.memory.textures++);m.activeTexture(m.TEXTURE0+f);m.bindTexture(m.TEXTURE_CUBE_MAP,c.image.__webglTextureCube);m.pixelStorei(m.UNPACK_FLIP_Y_WEBGL,
c.flipY);f=c instanceof THREE.CompressedTexture;l=[];for(p=0;6>p;p++)P.autoScaleCubemaps&&!f?(q=l,u=p,w=c.image[p],y=dc,w.width<=y&&w.height<=y||(A=Math.max(w.width,w.height),v=Math.floor(w.width*y/A),y=Math.floor(w.height*y/A),A=document.createElement("canvas"),A.width=v,A.height=y,A.getContext("2d").drawImage(w,0,0,w.width,w.height,0,0,v,y),w=A),q[u]=w):l[p]=c.image[p];p=l[0];q=THREE.Math.isPowerOfTwo(p.width)&&THREE.Math.isPowerOfTwo(p.height);u=z(c.format);w=z(c.type);D(m.TEXTURE_CUBE_MAP,c,q);
for(p=0;6>p;p++)if(f)for(y=l[p].mipmaps,A=0,L=y.length;A<L;A++)v=y[A],c.format!==THREE.RGBAFormat?m.compressedTexImage2D(m.TEXTURE_CUBE_MAP_POSITIVE_X+p,A,u,v.width,v.height,0,v.data):m.texImage2D(m.TEXTURE_CUBE_MAP_POSITIVE_X+p,A,u,v.width,v.height,0,u,w,v.data);else m.texImage2D(m.TEXTURE_CUBE_MAP_POSITIVE_X+p,0,u,u,w,l[p]);c.generateMipmaps&&q&&m.generateMipmap(m.TEXTURE_CUBE_MAP);c.needsUpdate=!1;if(c.onUpdate)c.onUpdate()}else m.activeTexture(m.TEXTURE0+f),m.bindTexture(m.TEXTURE_CUBE_MAP,c.image.__webglTextureCube)}else u instanceof
THREE.WebGLRenderTargetCube?(c=u,m.activeTexture(m.TEXTURE0+l),m.bindTexture(m.TEXTURE_CUBE_MAP,c.__webglTexture)):P.setTexture(u,l)}else if("tv"===p){void 0===c._array&&(c._array=[]);p=0;for(q=c.value.length;p<q;p++)c._array[p]=J();m.uniform1iv(f,c._array);p=0;for(q=c.value.length;p<q;p++)u=c.value[p],l=c._array[p],u&&P.setTexture(u,l)}else console.warn("THREE.WebGLRenderer: Unknown uniform type: "+p);(d instanceof THREE.ShaderMaterial||d instanceof THREE.MeshPhongMaterial||d.envMap)&&null!==h.cameraPosition&&
(xa.setFromMatrixPosition(a.matrixWorld),m.uniform3f(h.cameraPosition,xa.x,xa.y,xa.z));(d instanceof THREE.MeshPhongMaterial||d instanceof THREE.MeshLambertMaterial||d instanceof THREE.ShaderMaterial||d.skinning)&&null!==h.viewMatrix&&m.uniformMatrix4fv(h.viewMatrix,!1,a.matrixWorldInverse.elements)}m.uniformMatrix4fv(h.modelViewMatrix,!1,e._modelViewMatrix.elements);h.normalMatrix&&m.uniformMatrix3fv(h.normalMatrix,!1,e._normalMatrix.elements);null!==h.modelMatrix&&m.uniformMatrix4fv(h.modelMatrix,
!1,e.matrixWorld.elements);return g}function J(){var a=Ea;a>=Cb&&console.warn("WebGLRenderer: trying to use "+a+" texture units while this GPU supports only "+Cb);Ea+=1;return a}function B(a,b,c,d){a[b]=c.r*c.r*d;a[b+1]=c.g*c.g*d;a[b+2]=c.b*c.b*d}function K(a,b,c,d){a[b]=c.r*d;a[b+1]=c.g*d;a[b+2]=c.b*d}function A(a){a!==ua&&(m.lineWidth(a),ua=a)}function G(a,b,c){ya!==a&&(a?m.enable(m.POLYGON_OFFSET_FILL):m.disable(m.POLYGON_OFFSET_FILL),ya=a);!a||Z===b&&qa===c||(m.polygonOffset(b,c),Z=b,qa=c)}function D(a,
b,c){c?(m.texParameteri(a,m.TEXTURE_WRAP_S,z(b.wrapS)),m.texParameteri(a,m.TEXTURE_WRAP_T,z(b.wrapT)),m.texParameteri(a,m.TEXTURE_MAG_FILTER,z(b.magFilter)),m.texParameteri(a,m.TEXTURE_MIN_FILTER,z(b.minFilter))):(m.texParameteri(a,m.TEXTURE_WRAP_S,m.CLAMP_TO_EDGE),m.texParameteri(a,m.TEXTURE_WRAP_T,m.CLAMP_TO_EDGE),m.texParameteri(a,m.TEXTURE_MAG_FILTER,F(b.magFilter)),m.texParameteri(a,m.TEXTURE_MIN_FILTER,F(b.minFilter)));db&&b.type!==THREE.FloatType&&(1<b.anisotropy||b.__oldAnisotropy)&&(m.texParameterf(a,
db.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(b.anisotropy,Ib)),b.__oldAnisotropy=b.anisotropy)}function C(a,b){m.bindRenderbuffer(m.RENDERBUFFER,a);b.depthBuffer&&!b.stencilBuffer?(m.renderbufferStorage(m.RENDERBUFFER,m.DEPTH_COMPONENT16,b.width,b.height),m.framebufferRenderbuffer(m.FRAMEBUFFER,m.DEPTH_ATTACHMENT,m.RENDERBUFFER,a)):b.depthBuffer&&b.stencilBuffer?(m.renderbufferStorage(m.RENDERBUFFER,m.DEPTH_STENCIL,b.width,b.height),m.framebufferRenderbuffer(m.FRAMEBUFFER,m.DEPTH_STENCIL_ATTACHMENT,m.RENDERBUFFER,
a)):m.renderbufferStorage(m.RENDERBUFFER,m.RGBA4,b.width,b.height)}function F(a){return a===THREE.NearestFilter||a===THREE.NearestMipMapNearestFilter||a===THREE.NearestMipMapLinearFilter?m.NEAREST:m.LINEAR}function z(a){if(a===THREE.RepeatWrapping)return m.REPEAT;if(a===THREE.ClampToEdgeWrapping)return m.CLAMP_TO_EDGE;if(a===THREE.MirroredRepeatWrapping)return m.MIRRORED_REPEAT;if(a===THREE.NearestFilter)return m.NEAREST;if(a===THREE.NearestMipMapNearestFilter)return m.NEAREST_MIPMAP_NEAREST;if(a===
THREE.NearestMipMapLinearFilter)return m.NEAREST_MIPMAP_LINEAR;if(a===THREE.LinearFilter)return m.LINEAR;if(a===THREE.LinearMipMapNearestFilter)return m.LINEAR_MIPMAP_NEAREST;if(a===THREE.LinearMipMapLinearFilter)return m.LINEAR_MIPMAP_LINEAR;if(a===THREE.UnsignedByteType)return m.UNSIGNED_BYTE;if(a===THREE.UnsignedShort4444Type)return m.UNSIGNED_SHORT_4_4_4_4;if(a===THREE.UnsignedShort5551Type)return m.UNSIGNED_SHORT_5_5_5_1;if(a===THREE.UnsignedShort565Type)return m.UNSIGNED_SHORT_5_6_5;if(a===
THREE.ByteType)return m.BYTE;if(a===THREE.ShortType)return m.SHORT;if(a===THREE.UnsignedShortType)return m.UNSIGNED_SHORT;if(a===THREE.IntType)return m.INT;if(a===THREE.UnsignedIntType)return m.UNSIGNED_INT;if(a===THREE.FloatType)return m.FLOAT;if(a===THREE.AlphaFormat)return m.ALPHA;if(a===THREE.RGBFormat)return m.RGB;if(a===THREE.RGBAFormat)return m.RGBA;if(a===THREE.LuminanceFormat)return m.LUMINANCE;if(a===THREE.LuminanceAlphaFormat)return m.LUMINANCE_ALPHA;if(a===THREE.AddEquation)return m.FUNC_ADD;
if(a===THREE.SubtractEquation)return m.FUNC_SUBTRACT;if(a===THREE.ReverseSubtractEquation)return m.FUNC_REVERSE_SUBTRACT;if(a===THREE.ZeroFactor)return m.ZERO;if(a===THREE.OneFactor)return m.ONE;if(a===THREE.SrcColorFactor)return m.SRC_COLOR;if(a===THREE.OneMinusSrcColorFactor)return m.ONE_MINUS_SRC_COLOR;if(a===THREE.SrcAlphaFactor)return m.SRC_ALPHA;if(a===THREE.OneMinusSrcAlphaFactor)return m.ONE_MINUS_SRC_ALPHA;if(a===THREE.DstAlphaFactor)return m.DST_ALPHA;if(a===THREE.OneMinusDstAlphaFactor)return m.ONE_MINUS_DST_ALPHA;
if(a===THREE.DstColorFactor)return m.DST_COLOR;if(a===THREE.OneMinusDstColorFactor)return m.ONE_MINUS_DST_COLOR;if(a===THREE.SrcAlphaSaturateFactor)return m.SRC_ALPHA_SATURATE;if(void 0!==Pa){if(a===THREE.RGB_S3TC_DXT1_Format)return Pa.COMPRESSED_RGB_S3TC_DXT1_EXT;if(a===THREE.RGBA_S3TC_DXT1_Format)return Pa.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(a===THREE.RGBA_S3TC_DXT3_Format)return Pa.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(a===THREE.RGBA_S3TC_DXT5_Format)return Pa.COMPRESSED_RGBA_S3TC_DXT5_EXT}return 0}console.log("THREE.WebGLRenderer",
THREE.REVISION);a=a||{};var H=void 0!==a.canvas?a.canvas:document.createElement("canvas"),E=void 0!==a.context?a.context:null,Q=void 0!==a.precision?a.precision:"highp",Y=void 0!==a.alpha?a.alpha:!1,U=void 0!==a.depth?a.depth:!0,la=void 0!==a.stencil?a.stencil:!0,W=void 0!==a.antialias?a.antialias:!1,R=void 0!==a.premultipliedAlpha?a.premultipliedAlpha:!0,I=void 0!==a.preserveDrawingBuffer?a.preserveDrawingBuffer:!1,da=void 0!==a.logarithmicDepthBuffer?a.logarithmicDepthBuffer:!1,V=new THREE.Color(0),
X=0;this.domElement=H;this.context=null;this.devicePixelRatio=void 0!==a.devicePixelRatio?a.devicePixelRatio:void 0!==self.devicePixelRatio?self.devicePixelRatio:1;this.autoUpdateObjects=this.sortObjects=this.autoClearStencil=this.autoClearDepth=this.autoClearColor=this.autoClear=!0;this.shadowMapEnabled=this.gammaOutput=this.gammaInput=!1;this.shadowMapAutoUpdate=!0;this.shadowMapType=THREE.PCFShadowMap;this.shadowMapCullFace=THREE.CullFaceFront;this.shadowMapCascade=this.shadowMapDebug=!1;this.maxMorphTargets=
8;this.maxMorphNormals=4;this.autoScaleCubemaps=!0;this.renderPluginsPre=[];this.renderPluginsPost=[];this.info={memory:{programs:0,geometries:0,textures:0},render:{calls:0,vertices:0,faces:0,points:0}};var P=this,ga=[],wa=null,Ha=null,fa=-1,za=null,Ia=null,Ea=0,Ga=-1,ha=-1,Oa=-1,Ra=-1,Sa=-1,Fa=-1,ia=-1,ma=-1,ya=null,Z=null,qa=null,ua=null,Ca=0,va=0,Da=H.width,Ja=H.height,ja=0,ra=0,Ka=new Uint8Array(16),ob=new Uint8Array(16),Ab=new THREE.Frustum,Pb=new THREE.Matrix4,cc=new THREE.Matrix4,xa=new THREE.Vector3,
oa=new THREE.Vector3,cb=!0,Bb={ambient:[0,0,0],directional:{length:0,colors:[],positions:[]},point:{length:0,colors:[],positions:[],distances:[]},spot:{length:0,colors:[],positions:[],distances:[],directions:[],anglesCos:[],exponents:[]},hemi:{length:0,skyColors:[],groundColors:[],positions:[]}},m,sb,xb,db,Pa,pb;(function(){try{var a={alpha:Y,depth:U,stencil:la,antialias:W,premultipliedAlpha:R,preserveDrawingBuffer:I};m=E||H.getContext("webgl",a)||H.getContext("experimental-webgl",a);if(null===m)throw"Error creating WebGL context.";
}catch(b){console.error(b)}sb=m.getExtension("OES_texture_float");m.getExtension("OES_texture_float_linear");xb=m.getExtension("OES_standard_derivatives");db=m.getExtension("EXT_texture_filter_anisotropic")||m.getExtension("MOZ_EXT_texture_filter_anisotropic")||m.getExtension("WEBKIT_EXT_texture_filter_anisotropic");Pa=m.getExtension("WEBGL_compressed_texture_s3tc")||m.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||m.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");pb=m.getExtension("OES_element_index_uint");
null===sb&&console.log("THREE.WebGLRenderer: Float textures not supported.");null===xb&&console.log("THREE.WebGLRenderer: Standard derivatives not supported.");null===db&&console.log("THREE.WebGLRenderer: Anisotropic texture filtering not supported.");null===Pa&&console.log("THREE.WebGLRenderer: S3TC compressed textures not supported.");null===pb&&console.log("THREE.WebGLRenderer: elementindex as unsigned integer not supported.");void 0===m.getShaderPrecisionFormat&&(m.getShaderPrecisionFormat=function(){return{rangeMin:1,
rangeMax:1,precision:1}});da&&m.getExtension("EXT_frag_depth")})();m.clearColor(0,0,0,1);m.clearDepth(1);m.clearStencil(0);m.enable(m.DEPTH_TEST);m.depthFunc(m.LEQUAL);m.frontFace(m.CCW);m.cullFace(m.BACK);m.enable(m.CULL_FACE);m.enable(m.BLEND);m.blendEquation(m.FUNC_ADD);m.blendFunc(m.SRC_ALPHA,m.ONE_MINUS_SRC_ALPHA);m.viewport(Ca,va,Da,Ja);m.clearColor(V.r,V.g,V.b,X);this.context=m;var Cb=m.getParameter(m.MAX_TEXTURE_IMAGE_UNITS),Db=m.getParameter(m.MAX_VERTEX_TEXTURE_IMAGE_UNITS);m.getParameter(m.MAX_TEXTURE_SIZE);
var dc=m.getParameter(m.MAX_CUBE_MAP_TEXTURE_SIZE),Ib=db?m.getParameter(db.MAX_TEXTURE_MAX_ANISOTROPY_EXT):0,Jb=0<Db,Gb=Jb&&sb;Pa&&m.getParameter(m.COMPRESSED_TEXTURE_FORMATS);var ec=m.getShaderPrecisionFormat(m.VERTEX_SHADER,m.HIGH_FLOAT),qc=m.getShaderPrecisionFormat(m.VERTEX_SHADER,m.MEDIUM_FLOAT);m.getShaderPrecisionFormat(m.VERTEX_SHADER,m.LOW_FLOAT);var rc=m.getShaderPrecisionFormat(m.FRAGMENT_SHADER,m.HIGH_FLOAT),sc=m.getShaderPrecisionFormat(m.FRAGMENT_SHADER,m.MEDIUM_FLOAT);m.getShaderPrecisionFormat(m.FRAGMENT_SHADER,
m.LOW_FLOAT);var tc=0<ec.precision&&0<rc.precision,Kb=0<qc.precision&&0<sc.precision;"highp"!==Q||tc||(Kb?(Q="mediump",console.warn("WebGLRenderer: highp not supported, using mediump")):(Q="lowp",console.warn("WebGLRenderer: highp and mediump not supported, using lowp")));"mediump"!==Q||Kb||(Q="lowp",console.warn("WebGLRenderer: mediump not supported, using lowp"));this.getContext=function(){return m};this.supportsVertexTextures=function(){return Jb};this.supportsFloatTextures=function(){return sb};
this.supportsStandardDerivatives=function(){return xb};this.supportsCompressedTextureS3TC=function(){return Pa};this.getMaxAnisotropy=function(){return Ib};this.getPrecision=function(){return Q};this.setSize=function(a,b,c){H.width=a*this.devicePixelRatio;H.height=b*this.devicePixelRatio;!1!==c&&(H.style.width=a+"px",H.style.height=b+"px");this.setViewport(0,0,a,b)};this.setViewport=function(a,b,c,d){Ca=a*this.devicePixelRatio;va=b*this.devicePixelRatio;Da=c*this.devicePixelRatio;Ja=d*this.devicePixelRatio;
m.viewport(Ca,va,Da,Ja)};this.setScissor=function(a,b,c,d){m.scissor(a*this.devicePixelRatio,b*this.devicePixelRatio,c*this.devicePixelRatio,d*this.devicePixelRatio)};this.enableScissorTest=function(a){a?m.enable(m.SCISSOR_TEST):m.disable(m.SCISSOR_TEST)};this.setClearColor=function(a,b){V.set(a);X=void 0!==b?b:1;m.clearColor(V.r,V.g,V.b,X)};this.setClearColorHex=function(a,b){console.warn("DEPRECATED: .setClearColorHex() is being removed. Use .setClearColor() instead.");this.setClearColor(a,b)};
this.getClearColor=function(){return V};this.getClearAlpha=function(){return X};this.clear=function(a,b,c){var d=0;if(void 0===a||a)d|=m.COLOR_BUFFER_BIT;if(void 0===b||b)d|=m.DEPTH_BUFFER_BIT;if(void 0===c||c)d|=m.STENCIL_BUFFER_BIT;m.clear(d)};this.clearColor=function(){m.clear(m.COLOR_BUFFER_BIT)};this.clearDepth=function(){m.clear(m.DEPTH_BUFFER_BIT)};this.clearStencil=function(){m.clear(m.STENCIL_BUFFER_BIT)};this.clearTarget=function(a,b,c,d){this.setRenderTarget(a);this.clear(b,c,d)};this.addPostPlugin=
function(a){a.init(this);this.renderPluginsPost.push(a)};this.addPrePlugin=function(a){a.init(this);this.renderPluginsPre.push(a)};this.updateShadowMap=function(a,b){wa=null;fa=za=ma=ia=Oa=-1;cb=!0;ha=Ga=-1;this.shadowMapPlugin.update(a,b)};var Eb=function(a){a=a.target;a.removeEventListener("dispose",Eb);a.__webglInit=void 0;if(a instanceof THREE.BufferGeometry){var b=a.attributes,c;for(c in b)void 0!==b[c].buffer&&m.deleteBuffer(b[c].buffer);P.info.memory.geometries--}else if(void 0!==a.geometryGroups)for(b in a.geometryGroups){c=
a.geometryGroups[b];if(void 0!==c.numMorphTargets)for(var d=0,e=c.numMorphTargets;d<e;d++)m.deleteBuffer(c.__webglMorphTargetsBuffers[d]);if(void 0!==c.numMorphNormals)for(d=0,e=c.numMorphNormals;d<e;d++)m.deleteBuffer(c.__webglMorphNormalsBuffers[d]);Qb(c)}else Qb(a)},Hb=function(a){a=a.target;a.removeEventListener("dispose",Hb);a.image&&a.image.__webglTextureCube?m.deleteTexture(a.image.__webglTextureCube):a.__webglInit&&(a.__webglInit=!1,m.deleteTexture(a.__webglTexture));P.info.memory.textures--},
Rb=function(a){a=a.target;a.removeEventListener("dispose",Rb);if(a&&a.__webglTexture)if(m.deleteTexture(a.__webglTexture),a instanceof THREE.WebGLRenderTargetCube)for(var b=0;6>b;b++)m.deleteFramebuffer(a.__webglFramebuffer[b]),m.deleteRenderbuffer(a.__webglRenderbuffer[b]);else m.deleteFramebuffer(a.__webglFramebuffer),m.deleteRenderbuffer(a.__webglRenderbuffer);P.info.memory.textures--},Sb=function(a){a=a.target;a.removeEventListener("dispose",Sb);Fb(a)},Qb=function(a){void 0!==a.__webglVertexBuffer&&
m.deleteBuffer(a.__webglVertexBuffer);void 0!==a.__webglNormalBuffer&&m.deleteBuffer(a.__webglNormalBuffer);void 0!==a.__webglTangentBuffer&&m.deleteBuffer(a.__webglTangentBuffer);void 0!==a.__webglColorBuffer&&m.deleteBuffer(a.__webglColorBuffer);void 0!==a.__webglUVBuffer&&m.deleteBuffer(a.__webglUVBuffer);void 0!==a.__webglUV2Buffer&&m.deleteBuffer(a.__webglUV2Buffer);void 0!==a.__webglSkinIndicesBuffer&&m.deleteBuffer(a.__webglSkinIndicesBuffer);void 0!==a.__webglSkinWeightsBuffer&&m.deleteBuffer(a.__webglSkinWeightsBuffer);
void 0!==a.__webglFaceBuffer&&m.deleteBuffer(a.__webglFaceBuffer);void 0!==a.__webglLineBuffer&&m.deleteBuffer(a.__webglLineBuffer);void 0!==a.__webglLineDistanceBuffer&&m.deleteBuffer(a.__webglLineDistanceBuffer);if(void 0!==a.__webglCustomAttributesList)for(var b in a.__webglCustomAttributesList)m.deleteBuffer(a.__webglCustomAttributesList[b].buffer);P.info.memory.geometries--},Fb=function(a){var b=a.program;if(void 0!==b){a.program=void 0;var c,d,e=!1;a=0;for(c=ga.length;a<c;a++)if(d=ga[a],d.program===
b){d.usedTimes--;0===d.usedTimes&&(e=!0);break}if(!0===e){e=[];a=0;for(c=ga.length;a<c;a++)d=ga[a],d.program!==b&&e.push(d);ga=e;m.deleteProgram(b);P.info.memory.programs--}}};this.renderBufferImmediate=function(a,b,c){h();a.hasPositions&&!a.__webglVertexBuffer&&(a.__webglVertexBuffer=m.createBuffer());a.hasNormals&&!a.__webglNormalBuffer&&(a.__webglNormalBuffer=m.createBuffer());a.hasUvs&&!a.__webglUvBuffer&&(a.__webglUvBuffer=m.createBuffer());a.hasColors&&!a.__webglColorBuffer&&(a.__webglColorBuffer=
m.createBuffer());a.hasPositions&&(m.bindBuffer(m.ARRAY_BUFFER,a.__webglVertexBuffer),m.bufferData(m.ARRAY_BUFFER,a.positionArray,m.DYNAMIC_DRAW),k(b.attributes.position),m.vertexAttribPointer(b.attributes.position,3,m.FLOAT,!1,0,0));if(a.hasNormals){m.bindBuffer(m.ARRAY_BUFFER,a.__webglNormalBuffer);if(c.shading===THREE.FlatShading){var d,e,f,g,p,n,q,r,s,u,t,w=3*a.count;for(t=0;t<w;t+=9)u=a.normalArray,d=u[t],e=u[t+1],f=u[t+2],g=u[t+3],n=u[t+4],r=u[t+5],p=u[t+6],q=u[t+7],s=u[t+8],d=(d+g+p)/3,e=(e+
n+q)/3,f=(f+r+s)/3,u[t]=d,u[t+1]=e,u[t+2]=f,u[t+3]=d,u[t+4]=e,u[t+5]=f,u[t+6]=d,u[t+7]=e,u[t+8]=f}m.bufferData(m.ARRAY_BUFFER,a.normalArray,m.DYNAMIC_DRAW);k(b.attributes.normal);m.vertexAttribPointer(b.attributes.normal,3,m.FLOAT,!1,0,0)}a.hasUvs&&c.map&&(m.bindBuffer(m.ARRAY_BUFFER,a.__webglUvBuffer),m.bufferData(m.ARRAY_BUFFER,a.uvArray,m.DYNAMIC_DRAW),k(b.attributes.uv),m.vertexAttribPointer(b.attributes.uv,2,m.FLOAT,!1,0,0));a.hasColors&&c.vertexColors!==THREE.NoColors&&(m.bindBuffer(m.ARRAY_BUFFER,
a.__webglColorBuffer),m.bufferData(m.ARRAY_BUFFER,a.colorArray,m.DYNAMIC_DRAW),k(b.attributes.color),m.vertexAttribPointer(b.attributes.color,3,m.FLOAT,!1,0,0));l();m.drawArrays(m.TRIANGLES,0,a.count);a.count=0};this.renderBufferDirect=function(a,b,c,d,e,f){if(!1!==d.visible){var k=N(a,b,c,d,f);a=k.attributes;b=e.attributes;c=!1;k=16777215*e.id+2*k.id+(d.wireframe?1:0);k!==za&&(za=k,c=!0);c&&h();if(f instanceof THREE.Mesh)if(f=b.index){var l;f.array instanceof Uint32Array?(k=m.UNSIGNED_INT,l=4):(k=
m.UNSIGNED_SHORT,l=2);e=e.offsets;if(0===e.length)c&&(g(d,a,b,0),m.bindBuffer(m.ELEMENT_ARRAY_BUFFER,f.buffer)),m.drawElements(m.TRIANGLES,f.array.length,k,0),P.info.render.calls++,P.info.render.vertices+=f.array.length,P.info.render.faces+=f.array.length/3;else{c=!0;for(var p=0,n=e.length;p<n;p++){var q=e[p].index;c&&(g(d,a,b,q),m.bindBuffer(m.ELEMENT_ARRAY_BUFFER,f.buffer));m.drawElements(m.TRIANGLES,e[p].count,k,e[p].start*l);P.info.render.calls++;P.info.render.vertices+=e[p].count;P.info.render.faces+=
e[p].count/3}}}else c&&g(d,a,b,0),d=e.attributes.position,m.drawArrays(m.TRIANGLES,0,d.array.length/3),P.info.render.calls++,P.info.render.vertices+=d.array.length/3,P.info.render.faces+=d.array.length/9;else if(f instanceof THREE.ParticleSystem)c&&g(d,a,b,0),d=b.position,m.drawArrays(m.POINTS,0,d.array.length/3),P.info.render.calls++,P.info.render.points+=d.array.length/3;else if(f instanceof THREE.Line)if(k=f.type===THREE.LineStrip?m.LINE_STRIP:m.LINES,A(d.linewidth),f=b.index)if(f.array instanceof
Uint32Array?(k=m.UNSIGNED_INT,l=4):(k=m.UNSIGNED_SHORT,l=2),e=e.offsets,0===e.length)c&&(g(d,a,b,0),m.bindBuffer(m.ELEMENT_ARRAY_BUFFER,f.buffer)),m.drawElements(m.LINES,f.array.length,k,0),P.info.render.calls++,P.info.render.vertices+=f.array.length;else for(1<e.length&&(c=!0),p=0,n=e.length;p<n;p++)q=e[p].index,c&&(g(d,a,b,q),m.bindBuffer(m.ELEMENT_ARRAY_BUFFER,f.buffer)),m.drawElements(m.LINES,e[p].count,k,e[p].start*l),P.info.render.calls++,P.info.render.vertices+=e[p].count;else c&&g(d,a,b,0),
d=b.position,m.drawArrays(k,0,d.array.length/3),P.info.render.calls++,P.info.render.points+=d.array.length/3}};this.renderBuffer=function(a,b,c,d,e,f){if(!1!==d.visible){var g,p;c=N(a,b,c,d,f);b=c.attributes;a=!1;c=16777215*e.id+2*c.id+(d.wireframe?1:0);c!==za&&(za=c,a=!0);a&&h();if(!d.morphTargets&&0<=b.position)a&&(m.bindBuffer(m.ARRAY_BUFFER,e.__webglVertexBuffer),k(b.position),m.vertexAttribPointer(b.position,3,m.FLOAT,!1,0,0));else if(f.morphTargetBase){c=d.program.attributes;-1!==f.morphTargetBase&&
0<=c.position?(m.bindBuffer(m.ARRAY_BUFFER,e.__webglMorphTargetsBuffers[f.morphTargetBase]),k(c.position),m.vertexAttribPointer(c.position,3,m.FLOAT,!1,0,0)):0<=c.position&&(m.bindBuffer(m.ARRAY_BUFFER,e.__webglVertexBuffer),k(c.position),m.vertexAttribPointer(c.position,3,m.FLOAT,!1,0,0));if(f.morphTargetForcedOrder.length){var n=0;p=f.morphTargetForcedOrder;for(g=f.morphTargetInfluences;n<d.numSupportedMorphTargets&&n<p.length;)0<=c["morphTarget"+n]&&(m.bindBuffer(m.ARRAY_BUFFER,e.__webglMorphTargetsBuffers[p[n]]),
k(c["morphTarget"+n]),m.vertexAttribPointer(c["morphTarget"+n],3,m.FLOAT,!1,0,0)),0<=c["morphNormal"+n]&&d.morphNormals&&(m.bindBuffer(m.ARRAY_BUFFER,e.__webglMorphNormalsBuffers[p[n]]),k(c["morphNormal"+n]),m.vertexAttribPointer(c["morphNormal"+n],3,m.FLOAT,!1,0,0)),f.__webglMorphTargetInfluences[n]=g[p[n]],n++}else{p=[];g=f.morphTargetInfluences;var r,s=g.length;for(r=0;r<s;r++)n=g[r],0<n&&p.push([n,r]);p.length>d.numSupportedMorphTargets?(p.sort(q),p.length=d.numSupportedMorphTargets):p.length>
d.numSupportedMorphNormals?p.sort(q):0===p.length&&p.push([0,0]);for(n=0;n<d.numSupportedMorphTargets;)p[n]?(r=p[n][1],0<=c["morphTarget"+n]&&(m.bindBuffer(m.ARRAY_BUFFER,e.__webglMorphTargetsBuffers[r]),k(c["morphTarget"+n]),m.vertexAttribPointer(c["morphTarget"+n],3,m.FLOAT,!1,0,0)),0<=c["morphNormal"+n]&&d.morphNormals&&(m.bindBuffer(m.ARRAY_BUFFER,e.__webglMorphNormalsBuffers[r]),k(c["morphNormal"+n]),m.vertexAttribPointer(c["morphNormal"+n],3,m.FLOAT,!1,0,0)),f.__webglMorphTargetInfluences[n]=
g[r]):f.__webglMorphTargetInfluences[n]=0,n++}null!==d.program.uniforms.morphTargetInfluences&&m.uniform1fv(d.program.uniforms.morphTargetInfluences,f.__webglMorphTargetInfluences)}if(a){if(e.__webglCustomAttributesList)for(g=0,p=e.__webglCustomAttributesList.length;g<p;g++)c=e.__webglCustomAttributesList[g],0<=b[c.buffer.belongsToAttribute]&&(m.bindBuffer(m.ARRAY_BUFFER,c.buffer),k(b[c.buffer.belongsToAttribute]),m.vertexAttribPointer(b[c.buffer.belongsToAttribute],c.size,m.FLOAT,!1,0,0));0<=b.color&&
(0<f.geometry.colors.length||0<f.geometry.faces.length?(m.bindBuffer(m.ARRAY_BUFFER,e.__webglColorBuffer),k(b.color),m.vertexAttribPointer(b.color,3,m.FLOAT,!1,0,0)):d.defaultAttributeValues&&m.vertexAttrib3fv(b.color,d.defaultAttributeValues.color));0<=b.normal&&(m.bindBuffer(m.ARRAY_BUFFER,e.__webglNormalBuffer),k(b.normal),m.vertexAttribPointer(b.normal,3,m.FLOAT,!1,0,0));0<=b.tangent&&(m.bindBuffer(m.ARRAY_BUFFER,e.__webglTangentBuffer),k(b.tangent),m.vertexAttribPointer(b.tangent,4,m.FLOAT,!1,
0,0));0<=b.uv&&(f.geometry.faceVertexUvs[0]?(m.bindBuffer(m.ARRAY_BUFFER,e.__webglUVBuffer),k(b.uv),m.vertexAttribPointer(b.uv,2,m.FLOAT,!1,0,0)):d.defaultAttributeValues&&m.vertexAttrib2fv(b.uv,d.defaultAttributeValues.uv));0<=b.uv2&&(f.geometry.faceVertexUvs[1]?(m.bindBuffer(m.ARRAY_BUFFER,e.__webglUV2Buffer),k(b.uv2),m.vertexAttribPointer(b.uv2,2,m.FLOAT,!1,0,0)):d.defaultAttributeValues&&m.vertexAttrib2fv(b.uv2,d.defaultAttributeValues.uv2));d.skinning&&0<=b.skinIndex&&0<=b.skinWeight&&(m.bindBuffer(m.ARRAY_BUFFER,
e.__webglSkinIndicesBuffer),k(b.skinIndex),m.vertexAttribPointer(b.skinIndex,4,m.FLOAT,!1,0,0),m.bindBuffer(m.ARRAY_BUFFER,e.__webglSkinWeightsBuffer),k(b.skinWeight),m.vertexAttribPointer(b.skinWeight,4,m.FLOAT,!1,0,0));0<=b.lineDistance&&(m.bindBuffer(m.ARRAY_BUFFER,e.__webglLineDistanceBuffer),k(b.lineDistance),m.vertexAttribPointer(b.lineDistance,1,m.FLOAT,!1,0,0))}l();f instanceof THREE.Mesh?(f=e.__typeArray===Uint32Array?m.UNSIGNED_INT:m.UNSIGNED_SHORT,d.wireframe?(A(d.wireframeLinewidth),a&&
m.bindBuffer(m.ELEMENT_ARRAY_BUFFER,e.__webglLineBuffer),m.drawElements(m.LINES,e.__webglLineCount,f,0)):(a&&m.bindBuffer(m.ELEMENT_ARRAY_BUFFER,e.__webglFaceBuffer),m.drawElements(m.TRIANGLES,e.__webglFaceCount,f,0)),P.info.render.calls++,P.info.render.vertices+=e.__webglFaceCount,P.info.render.faces+=e.__webglFaceCount/3):f instanceof THREE.Line?(f=f.type===THREE.LineStrip?m.LINE_STRIP:m.LINES,A(d.linewidth),m.drawArrays(f,0,e.__webglLineCount),P.info.render.calls++):f instanceof THREE.ParticleSystem&&
(m.drawArrays(m.POINTS,0,e.__webglParticleCount),P.info.render.calls++,P.info.render.points+=e.__webglParticleCount)}};this.render=function(a,b,c,d){if(!1===b instanceof THREE.Camera)console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");else{var e,f,g,h,k=a.__lights,l=a.fog;fa=-1;cb=!0;!0===a.autoUpdate&&a.updateMatrixWorld();void 0===b.parent&&b.updateMatrixWorld();b.matrixWorldInverse.getInverse(b.matrixWorld);Pb.multiplyMatrices(b.projectionMatrix,b.matrixWorldInverse);
Ab.setFromMatrix(Pb);this.autoUpdateObjects&&this.initWebGLObjects(a);p(this.renderPluginsPre,a,b);P.info.render.calls=0;P.info.render.vertices=0;P.info.render.faces=0;P.info.render.points=0;this.setRenderTarget(c);(this.autoClear||d)&&this.clear(this.autoClearColor,this.autoClearDepth,this.autoClearStencil);h=a.__webglObjects;d=0;for(e=h.length;d<e;d++)if(f=h[d],g=f.object,f.id=d,f.render=!1,g.visible&&(!(g instanceof THREE.Mesh||g instanceof THREE.ParticleSystem)||!g.frustumCulled||Ab.intersectsObject(g))){var q=
g;q._modelViewMatrix.multiplyMatrices(b.matrixWorldInverse,q.matrixWorld);q._normalMatrix.getNormalMatrix(q._modelViewMatrix);var q=f,r=q.object,u=q.buffer,w=r.geometry,r=r.material;r instanceof THREE.MeshFaceMaterial?(r=r.materials[w instanceof THREE.BufferGeometry?0:u.materialIndex],r.transparent?(q.transparent=r,q.opaque=null):(q.opaque=r,q.transparent=null)):r&&(r.transparent?(q.transparent=r,q.opaque=null):(q.opaque=r,q.transparent=null));f.render=!0;!0===this.sortObjects&&(null!==g.renderDepth?
f.z=g.renderDepth:(xa.setFromMatrixPosition(g.matrixWorld),xa.applyProjection(Pb),f.z=xa.z))}this.sortObjects&&h.sort(n);h=a.__webglObjectsImmediate;d=0;for(e=h.length;d<e;d++)f=h[d],g=f.object,g.visible&&(g._modelViewMatrix.multiplyMatrices(b.matrixWorldInverse,g.matrixWorld),g._normalMatrix.getNormalMatrix(g._modelViewMatrix),g=f.object.material,g.transparent?(f.transparent=g,f.opaque=null):(f.opaque=g,f.transparent=null));a.overrideMaterial?(d=a.overrideMaterial,this.setBlending(d.blending,d.blendEquation,
d.blendSrc,d.blendDst),this.setDepthTest(d.depthTest),this.setDepthWrite(d.depthWrite),G(d.polygonOffset,d.polygonOffsetFactor,d.polygonOffsetUnits),s(a.__webglObjects,!1,"",b,k,l,!0,d),t(a.__webglObjectsImmediate,"",b,k,l,!1,d)):(d=null,this.setBlending(THREE.NoBlending),s(a.__webglObjects,!0,"opaque",b,k,l,!1,d),t(a.__webglObjectsImmediate,"opaque",b,k,l,!1,d),s(a.__webglObjects,!1,"transparent",b,k,l,!0,d),t(a.__webglObjectsImmediate,"transparent",b,k,l,!0,d));p(this.renderPluginsPost,a,b);c&&
c.generateMipmaps&&c.minFilter!==THREE.NearestFilter&&c.minFilter!==THREE.LinearFilter&&(c instanceof THREE.WebGLRenderTargetCube?(m.bindTexture(m.TEXTURE_CUBE_MAP,c.__webglTexture),m.generateMipmap(m.TEXTURE_CUBE_MAP),m.bindTexture(m.TEXTURE_CUBE_MAP,null)):(m.bindTexture(m.TEXTURE_2D,c.__webglTexture),m.generateMipmap(m.TEXTURE_2D),m.bindTexture(m.TEXTURE_2D,null)));this.setDepthTest(!0);this.setDepthWrite(!0)}};this.renderImmediateObject=function(a,b,c,d,e){var f=N(a,b,c,d,e);za=-1;P.setMaterialFaces(d);
e.immediateRenderCallback?e.immediateRenderCallback(f,m,Ab):e.render(function(a){P.renderBufferImmediate(a,f,d)})};this.initWebGLObjects=function(a){a.__webglObjects||(a.__webglObjects=[],a.__webglObjectsImmediate=[],a.__webglSprites=[],a.__webglFlares=[]);for(;a.__objectsAdded.length;)r(a.__objectsAdded[0],a),a.__objectsAdded.splice(0,1);for(;a.__objectsRemoved.length;)y(a.__objectsRemoved[0],a),a.__objectsRemoved.splice(0,1);for(var b=0,g=a.__webglObjects.length;b<g;b++){var h=a.__webglObjects[b].object;
void 0===h.__webglInit&&(void 0!==h.__webglActive&&y(h,a),r(h,a));var k=h,l=k.geometry,p=void 0,n=void 0,s=void 0;if(l instanceof THREE.BufferGeometry){var t=m.DYNAMIC_DRAW,v=l.attributes,A=void 0,B=void 0;for(A in v)B=v[A],B.needsUpdate&&("index"===A?(m.bindBuffer(m.ELEMENT_ARRAY_BUFFER,B.buffer),m.bufferData(m.ELEMENT_ARRAY_BUFFER,B.array,t)):(m.bindBuffer(m.ARRAY_BUFFER,B.buffer),m.bufferData(m.ARRAY_BUFFER,B.array,t)),B.needsUpdate=!1)}else if(k instanceof THREE.Mesh){for(var z=0,L=l.geometryGroupsList.length;z<
L;z++)if(p=l.geometryGroupsList[z],s=d(k,p),l.buffersNeedUpdate&&c(p,k),n=s.attributes&&w(s),l.verticesNeedUpdate||l.morphTargetsNeedUpdate||l.elementsNeedUpdate||l.uvsNeedUpdate||l.normalsNeedUpdate||l.colorsNeedUpdate||l.tangentsNeedUpdate||n){var x=p,G=k,C=m.DYNAMIC_DRAW,E=!l.dynamic,J=s;if(x.__inittedArrays){var H=e(J),P=J.vertexColors?J.vertexColors:!1,N=f(J),K=H===THREE.SmoothShading,D=void 0,F=void 0,Q=void 0,I=void 0,U=void 0,fa=void 0,Y=void 0,ga=void 0,R=void 0,V=void 0,W=void 0,$=void 0,
aa=void 0,ba=void 0,wa=void 0,X=void 0,Z=void 0,da=void 0,Ia=void 0,Ga=void 0,Ea=void 0,ia=void 0,za=void 0,ja=void 0,Ha=void 0,la=void 0,oa=void 0,qa=void 0,ra=void 0,ha=void 0,ya=void 0,Fa=void 0,Ca=void 0,Da=void 0,ma=void 0,Ka=void 0,ua=void 0,va=void 0,Oa=void 0,Ja=void 0,ab=0,bb=0,Ra=0,Sa=0,Pa=0,eb=0,Ta=0,qb=0,Ya=0,ta=0,Aa=0,O=0,Qa=void 0,fb=x.__vertexArray,cb=x.__uvArray,db=x.__uv2Array,tb=x.__normalArray,Ua=x.__tangentArray,gb=x.__colorArray,Va=x.__skinIndexArray,Wa=x.__skinWeightArray,ob=
x.__morphTargetsArrays,sb=x.__morphNormalsArrays,pb=x.__webglCustomAttributesList,M=void 0,Tb=x.__faceArray,ub=x.__lineArray,La=G.geometry,Ab=La.elementsNeedUpdate,xb=La.uvsNeedUpdate,Db=La.normalsNeedUpdate,Gb=La.tangentsNeedUpdate,Hb=La.colorsNeedUpdate,Jb=La.morphTargetsNeedUpdate,fc=La.vertices,ea=x.faces3,hb=La.faces,Bb=La.faceVertexUvs[0],Cb=La.faceVertexUvs[1],gc=La.skinIndices,Ub=La.skinWeights,Vb=La.morphTargets,Eb=La.morphNormals;if(La.verticesNeedUpdate){D=0;for(F=ea.length;D<F;D++)I=hb[ea[D]],
$=fc[I.a],aa=fc[I.b],ba=fc[I.c],fb[bb]=$.x,fb[bb+1]=$.y,fb[bb+2]=$.z,fb[bb+3]=aa.x,fb[bb+4]=aa.y,fb[bb+5]=aa.z,fb[bb+6]=ba.x,fb[bb+7]=ba.y,fb[bb+8]=ba.z,bb+=9;m.bindBuffer(m.ARRAY_BUFFER,x.__webglVertexBuffer);m.bufferData(m.ARRAY_BUFFER,fb,C)}if(Jb)for(ma=0,Ka=Vb.length;ma<Ka;ma++){D=Aa=0;for(F=ea.length;D<F;D++)Oa=ea[D],I=hb[Oa],$=Vb[ma].vertices[I.a],aa=Vb[ma].vertices[I.b],ba=Vb[ma].vertices[I.c],ua=ob[ma],ua[Aa]=$.x,ua[Aa+1]=$.y,ua[Aa+2]=$.z,ua[Aa+3]=aa.x,ua[Aa+4]=aa.y,ua[Aa+5]=aa.z,ua[Aa+6]=
ba.x,ua[Aa+7]=ba.y,ua[Aa+8]=ba.z,J.morphNormals&&(K?(Ja=Eb[ma].vertexNormals[Oa],da=Ja.a,Ia=Ja.b,Ga=Ja.c):Ga=Ia=da=Eb[ma].faceNormals[Oa],va=sb[ma],va[Aa]=da.x,va[Aa+1]=da.y,va[Aa+2]=da.z,va[Aa+3]=Ia.x,va[Aa+4]=Ia.y,va[Aa+5]=Ia.z,va[Aa+6]=Ga.x,va[Aa+7]=Ga.y,va[Aa+8]=Ga.z),Aa+=9;m.bindBuffer(m.ARRAY_BUFFER,x.__webglMorphTargetsBuffers[ma]);m.bufferData(m.ARRAY_BUFFER,ob[ma],C);J.morphNormals&&(m.bindBuffer(m.ARRAY_BUFFER,x.__webglMorphNormalsBuffers[ma]),m.bufferData(m.ARRAY_BUFFER,sb[ma],C))}if(Ub.length){D=
0;for(F=ea.length;D<F;D++)I=hb[ea[D]],ja=Ub[I.a],Ha=Ub[I.b],la=Ub[I.c],Wa[ta]=ja.x,Wa[ta+1]=ja.y,Wa[ta+2]=ja.z,Wa[ta+3]=ja.w,Wa[ta+4]=Ha.x,Wa[ta+5]=Ha.y,Wa[ta+6]=Ha.z,Wa[ta+7]=Ha.w,Wa[ta+8]=la.x,Wa[ta+9]=la.y,Wa[ta+10]=la.z,Wa[ta+11]=la.w,oa=gc[I.a],qa=gc[I.b],ra=gc[I.c],Va[ta]=oa.x,Va[ta+1]=oa.y,Va[ta+2]=oa.z,Va[ta+3]=oa.w,Va[ta+4]=qa.x,Va[ta+5]=qa.y,Va[ta+6]=qa.z,Va[ta+7]=qa.w,Va[ta+8]=ra.x,Va[ta+9]=ra.y,Va[ta+10]=ra.z,Va[ta+11]=ra.w,ta+=12;0<ta&&(m.bindBuffer(m.ARRAY_BUFFER,x.__webglSkinIndicesBuffer),
m.bufferData(m.ARRAY_BUFFER,Va,C),m.bindBuffer(m.ARRAY_BUFFER,x.__webglSkinWeightsBuffer),m.bufferData(m.ARRAY_BUFFER,Wa,C))}if(Hb&&P){D=0;for(F=ea.length;D<F;D++)I=hb[ea[D]],Y=I.vertexColors,ga=I.color,3===Y.length&&P===THREE.VertexColors?(Ea=Y[0],ia=Y[1],za=Y[2]):za=ia=Ea=ga,gb[Ya]=Ea.r,gb[Ya+1]=Ea.g,gb[Ya+2]=Ea.b,gb[Ya+3]=ia.r,gb[Ya+4]=ia.g,gb[Ya+5]=ia.b,gb[Ya+6]=za.r,gb[Ya+7]=za.g,gb[Ya+8]=za.b,Ya+=9;0<Ya&&(m.bindBuffer(m.ARRAY_BUFFER,x.__webglColorBuffer),m.bufferData(m.ARRAY_BUFFER,gb,C))}if(Gb&&
La.hasTangents){D=0;for(F=ea.length;D<F;D++)I=hb[ea[D]],R=I.vertexTangents,wa=R[0],X=R[1],Z=R[2],Ua[Ta]=wa.x,Ua[Ta+1]=wa.y,Ua[Ta+2]=wa.z,Ua[Ta+3]=wa.w,Ua[Ta+4]=X.x,Ua[Ta+5]=X.y,Ua[Ta+6]=X.z,Ua[Ta+7]=X.w,Ua[Ta+8]=Z.x,Ua[Ta+9]=Z.y,Ua[Ta+10]=Z.z,Ua[Ta+11]=Z.w,Ta+=12;m.bindBuffer(m.ARRAY_BUFFER,x.__webglTangentBuffer);m.bufferData(m.ARRAY_BUFFER,Ua,C)}if(Db&&H){D=0;for(F=ea.length;D<F;D++)if(I=hb[ea[D]],U=I.vertexNormals,fa=I.normal,3===U.length&&K)for(ha=0;3>ha;ha++)Fa=U[ha],tb[eb]=Fa.x,tb[eb+1]=Fa.y,
tb[eb+2]=Fa.z,eb+=3;else for(ha=0;3>ha;ha++)tb[eb]=fa.x,tb[eb+1]=fa.y,tb[eb+2]=fa.z,eb+=3;m.bindBuffer(m.ARRAY_BUFFER,x.__webglNormalBuffer);m.bufferData(m.ARRAY_BUFFER,tb,C)}if(xb&&Bb&&N){D=0;for(F=ea.length;D<F;D++)if(Q=ea[D],V=Bb[Q],void 0!==V)for(ha=0;3>ha;ha++)Ca=V[ha],cb[Ra]=Ca.x,cb[Ra+1]=Ca.y,Ra+=2;0<Ra&&(m.bindBuffer(m.ARRAY_BUFFER,x.__webglUVBuffer),m.bufferData(m.ARRAY_BUFFER,cb,C))}if(xb&&Cb&&N){D=0;for(F=ea.length;D<F;D++)if(Q=ea[D],W=Cb[Q],void 0!==W)for(ha=0;3>ha;ha++)Da=W[ha],db[Sa]=
Da.x,db[Sa+1]=Da.y,Sa+=2;0<Sa&&(m.bindBuffer(m.ARRAY_BUFFER,x.__webglUV2Buffer),m.bufferData(m.ARRAY_BUFFER,db,C))}if(Ab){D=0;for(F=ea.length;D<F;D++)Tb[Pa]=ab,Tb[Pa+1]=ab+1,Tb[Pa+2]=ab+2,Pa+=3,ub[qb]=ab,ub[qb+1]=ab+1,ub[qb+2]=ab,ub[qb+3]=ab+2,ub[qb+4]=ab+1,ub[qb+5]=ab+2,qb+=6,ab+=3;m.bindBuffer(m.ELEMENT_ARRAY_BUFFER,x.__webglFaceBuffer);m.bufferData(m.ELEMENT_ARRAY_BUFFER,Tb,C);m.bindBuffer(m.ELEMENT_ARRAY_BUFFER,x.__webglLineBuffer);m.bufferData(m.ELEMENT_ARRAY_BUFFER,ub,C)}if(pb)for(ha=0,ya=pb.length;ha<
ya;ha++)if(M=pb[ha],M.__original.needsUpdate){O=0;if(1===M.size)if(void 0===M.boundTo||"vertices"===M.boundTo)for(D=0,F=ea.length;D<F;D++)I=hb[ea[D]],M.array[O]=M.value[I.a],M.array[O+1]=M.value[I.b],M.array[O+2]=M.value[I.c],O+=3;else{if("faces"===M.boundTo)for(D=0,F=ea.length;D<F;D++)Qa=M.value[ea[D]],M.array[O]=Qa,M.array[O+1]=Qa,M.array[O+2]=Qa,O+=3}else if(2===M.size)if(void 0===M.boundTo||"vertices"===M.boundTo)for(D=0,F=ea.length;D<F;D++)I=hb[ea[D]],$=M.value[I.a],aa=M.value[I.b],ba=M.value[I.c],
M.array[O]=$.x,M.array[O+1]=$.y,M.array[O+2]=aa.x,M.array[O+3]=aa.y,M.array[O+4]=ba.x,M.array[O+5]=ba.y,O+=6;else{if("faces"===M.boundTo)for(D=0,F=ea.length;D<F;D++)ba=aa=$=Qa=M.value[ea[D]],M.array[O]=$.x,M.array[O+1]=$.y,M.array[O+2]=aa.x,M.array[O+3]=aa.y,M.array[O+4]=ba.x,M.array[O+5]=ba.y,O+=6}else if(3===M.size){var sa;sa="c"===M.type?["r","g","b"]:["x","y","z"];if(void 0===M.boundTo||"vertices"===M.boundTo)for(D=0,F=ea.length;D<F;D++)I=hb[ea[D]],$=M.value[I.a],aa=M.value[I.b],ba=M.value[I.c],
M.array[O]=$[sa[0]],M.array[O+1]=$[sa[1]],M.array[O+2]=$[sa[2]],M.array[O+3]=aa[sa[0]],M.array[O+4]=aa[sa[1]],M.array[O+5]=aa[sa[2]],M.array[O+6]=ba[sa[0]],M.array[O+7]=ba[sa[1]],M.array[O+8]=ba[sa[2]],O+=9;else if("faces"===M.boundTo)for(D=0,F=ea.length;D<F;D++)ba=aa=$=Qa=M.value[ea[D]],M.array[O]=$[sa[0]],M.array[O+1]=$[sa[1]],M.array[O+2]=$[sa[2]],M.array[O+3]=aa[sa[0]],M.array[O+4]=aa[sa[1]],M.array[O+5]=aa[sa[2]],M.array[O+6]=ba[sa[0]],M.array[O+7]=ba[sa[1]],M.array[O+8]=ba[sa[2]],O+=9;else if("faceVertices"===
M.boundTo)for(D=0,F=ea.length;D<F;D++)Qa=M.value[ea[D]],$=Qa[0],aa=Qa[1],ba=Qa[2],M.array[O]=$[sa[0]],M.array[O+1]=$[sa[1]],M.array[O+2]=$[sa[2]],M.array[O+3]=aa[sa[0]],M.array[O+4]=aa[sa[1]],M.array[O+5]=aa[sa[2]],M.array[O+6]=ba[sa[0]],M.array[O+7]=ba[sa[1]],M.array[O+8]=ba[sa[2]],O+=9}else if(4===M.size)if(void 0===M.boundTo||"vertices"===M.boundTo)for(D=0,F=ea.length;D<F;D++)I=hb[ea[D]],$=M.value[I.a],aa=M.value[I.b],ba=M.value[I.c],M.array[O]=$.x,M.array[O+1]=$.y,M.array[O+2]=$.z,M.array[O+3]=
$.w,M.array[O+4]=aa.x,M.array[O+5]=aa.y,M.array[O+6]=aa.z,M.array[O+7]=aa.w,M.array[O+8]=ba.x,M.array[O+9]=ba.y,M.array[O+10]=ba.z,M.array[O+11]=ba.w,O+=12;else if("faces"===M.boundTo)for(D=0,F=ea.length;D<F;D++)ba=aa=$=Qa=M.value[ea[D]],M.array[O]=$.x,M.array[O+1]=$.y,M.array[O+2]=$.z,M.array[O+3]=$.w,M.array[O+4]=aa.x,M.array[O+5]=aa.y,M.array[O+6]=aa.z,M.array[O+7]=aa.w,M.array[O+8]=ba.x,M.array[O+9]=ba.y,M.array[O+10]=ba.z,M.array[O+11]=ba.w,O+=12;else if("faceVertices"===M.boundTo)for(D=0,F=
ea.length;D<F;D++)Qa=M.value[ea[D]],$=Qa[0],aa=Qa[1],ba=Qa[2],M.array[O]=$.x,M.array[O+1]=$.y,M.array[O+2]=$.z,M.array[O+3]=$.w,M.array[O+4]=aa.x,M.array[O+5]=aa.y,M.array[O+6]=aa.z,M.array[O+7]=aa.w,M.array[O+8]=ba.x,M.array[O+9]=ba.y,M.array[O+10]=ba.z,M.array[O+11]=ba.w,O+=12;m.bindBuffer(m.ARRAY_BUFFER,M.buffer);m.bufferData(m.ARRAY_BUFFER,M.array,C)}E&&(delete x.__inittedArrays,delete x.__colorArray,delete x.__normalArray,delete x.__tangentArray,delete x.__uvArray,delete x.__uv2Array,delete x.__faceArray,
delete x.__vertexArray,delete x.__lineArray,delete x.__skinIndexArray,delete x.__skinWeightArray)}}l.verticesNeedUpdate=!1;l.morphTargetsNeedUpdate=!1;l.elementsNeedUpdate=!1;l.uvsNeedUpdate=!1;l.normalsNeedUpdate=!1;l.colorsNeedUpdate=!1;l.tangentsNeedUpdate=!1;l.buffersNeedUpdate=!1;s.attributes&&u(s)}else if(k instanceof THREE.Line){s=d(k,l);n=s.attributes&&w(s);if(l.verticesNeedUpdate||l.colorsNeedUpdate||l.lineDistancesNeedUpdate||n){var Xa=l,Wb=m.DYNAMIC_DRAW,Lb=void 0,Mb=void 0,Nb=void 0,Xb=
void 0,pa=void 0,Yb=void 0,Fb=Xa.vertices,Ib=Xa.colors,Kb=Xa.lineDistances,Qb=Fb.length,Rb=Ib.length,Sb=Kb.length,Zb=Xa.__vertexArray,$b=Xa.__colorArray,lc=Xa.__lineDistanceArray,dc=Xa.colorsNeedUpdate,ec=Xa.lineDistancesNeedUpdate,hc=Xa.__webglCustomAttributesList,ac=void 0,mc=void 0,Ba=void 0,yb=void 0,Ma=void 0,na=void 0;if(Xa.verticesNeedUpdate){for(Lb=0;Lb<Qb;Lb++)Xb=Fb[Lb],pa=3*Lb,Zb[pa]=Xb.x,Zb[pa+1]=Xb.y,Zb[pa+2]=Xb.z;m.bindBuffer(m.ARRAY_BUFFER,Xa.__webglVertexBuffer);m.bufferData(m.ARRAY_BUFFER,
Zb,Wb)}if(dc){for(Mb=0;Mb<Rb;Mb++)Yb=Ib[Mb],pa=3*Mb,$b[pa]=Yb.r,$b[pa+1]=Yb.g,$b[pa+2]=Yb.b;m.bindBuffer(m.ARRAY_BUFFER,Xa.__webglColorBuffer);m.bufferData(m.ARRAY_BUFFER,$b,Wb)}if(ec){for(Nb=0;Nb<Sb;Nb++)lc[Nb]=Kb[Nb];m.bindBuffer(m.ARRAY_BUFFER,Xa.__webglLineDistanceBuffer);m.bufferData(m.ARRAY_BUFFER,lc,Wb)}if(hc)for(ac=0,mc=hc.length;ac<mc;ac++)if(na=hc[ac],na.needsUpdate&&(void 0===na.boundTo||"vertices"===na.boundTo)){pa=0;yb=na.value.length;if(1===na.size)for(Ba=0;Ba<yb;Ba++)na.array[Ba]=na.value[Ba];
else if(2===na.size)for(Ba=0;Ba<yb;Ba++)Ma=na.value[Ba],na.array[pa]=Ma.x,na.array[pa+1]=Ma.y,pa+=2;else if(3===na.size)if("c"===na.type)for(Ba=0;Ba<yb;Ba++)Ma=na.value[Ba],na.array[pa]=Ma.r,na.array[pa+1]=Ma.g,na.array[pa+2]=Ma.b,pa+=3;else for(Ba=0;Ba<yb;Ba++)Ma=na.value[Ba],na.array[pa]=Ma.x,na.array[pa+1]=Ma.y,na.array[pa+2]=Ma.z,pa+=3;else if(4===na.size)for(Ba=0;Ba<yb;Ba++)Ma=na.value[Ba],na.array[pa]=Ma.x,na.array[pa+1]=Ma.y,na.array[pa+2]=Ma.z,na.array[pa+3]=Ma.w,pa+=4;m.bindBuffer(m.ARRAY_BUFFER,
na.buffer);m.bufferData(m.ARRAY_BUFFER,na.array,Wb)}}l.verticesNeedUpdate=!1;l.colorsNeedUpdate=!1;l.lineDistancesNeedUpdate=!1;s.attributes&&u(s)}else if(k instanceof THREE.ParticleSystem){s=d(k,l);n=s.attributes&&w(s);if(l.verticesNeedUpdate||l.colorsNeedUpdate||k.sortParticles||n){var ib=l,ic=m.DYNAMIC_DRAW,Ob=k,Na=void 0,jb=void 0,kb=void 0,T=void 0,lb=void 0,rb=void 0,bc=ib.vertices,jc=bc.length,kc=ib.colors,nc=kc.length,vb=ib.__vertexArray,wb=ib.__colorArray,mb=ib.__sortArray,oc=ib.verticesNeedUpdate,
pc=ib.colorsNeedUpdate,nb=ib.__webglCustomAttributesList,Za=void 0,zb=void 0,ca=void 0,$a=void 0,ka=void 0,S=void 0;if(Ob.sortParticles){cc.copy(Pb);cc.multiply(Ob.matrixWorld);for(Na=0;Na<jc;Na++)kb=bc[Na],xa.copy(kb),xa.applyProjection(cc),mb[Na]=[xa.z,Na];mb.sort(q);for(Na=0;Na<jc;Na++)kb=bc[mb[Na][1]],T=3*Na,vb[T]=kb.x,vb[T+1]=kb.y,vb[T+2]=kb.z;for(jb=0;jb<nc;jb++)T=3*jb,rb=kc[mb[jb][1]],wb[T]=rb.r,wb[T+1]=rb.g,wb[T+2]=rb.b;if(nb)for(Za=0,zb=nb.length;Za<zb;Za++)if(S=nb[Za],void 0===S.boundTo||
"vertices"===S.boundTo)if(T=0,$a=S.value.length,1===S.size)for(ca=0;ca<$a;ca++)lb=mb[ca][1],S.array[ca]=S.value[lb];else if(2===S.size)for(ca=0;ca<$a;ca++)lb=mb[ca][1],ka=S.value[lb],S.array[T]=ka.x,S.array[T+1]=ka.y,T+=2;else if(3===S.size)if("c"===S.type)for(ca=0;ca<$a;ca++)lb=mb[ca][1],ka=S.value[lb],S.array[T]=ka.r,S.array[T+1]=ka.g,S.array[T+2]=ka.b,T+=3;else for(ca=0;ca<$a;ca++)lb=mb[ca][1],ka=S.value[lb],S.array[T]=ka.x,S.array[T+1]=ka.y,S.array[T+2]=ka.z,T+=3;else if(4===S.size)for(ca=0;ca<
$a;ca++)lb=mb[ca][1],ka=S.value[lb],S.array[T]=ka.x,S.array[T+1]=ka.y,S.array[T+2]=ka.z,S.array[T+3]=ka.w,T+=4}else{if(oc)for(Na=0;Na<jc;Na++)kb=bc[Na],T=3*Na,vb[T]=kb.x,vb[T+1]=kb.y,vb[T+2]=kb.z;if(pc)for(jb=0;jb<nc;jb++)rb=kc[jb],T=3*jb,wb[T]=rb.r,wb[T+1]=rb.g,wb[T+2]=rb.b;if(nb)for(Za=0,zb=nb.length;Za<zb;Za++)if(S=nb[Za],S.needsUpdate&&(void 0===S.boundTo||"vertices"===S.boundTo))if($a=S.value.length,T=0,1===S.size)for(ca=0;ca<$a;ca++)S.array[ca]=S.value[ca];else if(2===S.size)for(ca=0;ca<$a;ca++)ka=
S.value[ca],S.array[T]=ka.x,S.array[T+1]=ka.y,T+=2;else if(3===S.size)if("c"===S.type)for(ca=0;ca<$a;ca++)ka=S.value[ca],S.array[T]=ka.r,S.array[T+1]=ka.g,S.array[T+2]=ka.b,T+=3;else for(ca=0;ca<$a;ca++)ka=S.value[ca],S.array[T]=ka.x,S.array[T+1]=ka.y,S.array[T+2]=ka.z,T+=3;else if(4===S.size)for(ca=0;ca<$a;ca++)ka=S.value[ca],S.array[T]=ka.x,S.array[T+1]=ka.y,S.array[T+2]=ka.z,S.array[T+3]=ka.w,T+=4}if(oc||Ob.sortParticles)m.bindBuffer(m.ARRAY_BUFFER,ib.__webglVertexBuffer),m.bufferData(m.ARRAY_BUFFER,
vb,ic);if(pc||Ob.sortParticles)m.bindBuffer(m.ARRAY_BUFFER,ib.__webglColorBuffer),m.bufferData(m.ARRAY_BUFFER,wb,ic);if(nb)for(Za=0,zb=nb.length;Za<zb;Za++)if(S=nb[Za],S.needsUpdate||Ob.sortParticles)m.bindBuffer(m.ARRAY_BUFFER,S.buffer),m.bufferData(m.ARRAY_BUFFER,S.array,ic)}l.verticesNeedUpdate=!1;l.colorsNeedUpdate=!1;s.attributes&&u(s)}}};this.initMaterial=function(a,b,c,d){var e,f,g,h;a.addEventListener("dispose",Sb);var k,l,p,n;a instanceof THREE.MeshDepthMaterial?n="depth":a instanceof THREE.MeshNormalMaterial?
n="normal":a instanceof THREE.MeshBasicMaterial?n="basic":a instanceof THREE.MeshLambertMaterial?n="lambert":a instanceof THREE.MeshPhongMaterial?n="phong":a instanceof THREE.LineBasicMaterial?n="basic":a instanceof THREE.LineDashedMaterial?n="dashed":a instanceof THREE.ParticleSystemMaterial&&(n="particle_basic");n&&(e=THREE.ShaderLib[n],a.uniforms=THREE.UniformsUtils.clone(e.uniforms),a.vertexShader=e.vertexShader,a.fragmentShader=e.fragmentShader);p=h=g=f=e=0;for(var q=b.length;p<q;p++){var r=
b[p];r.onlyShadow||!1===r.visible||(r instanceof THREE.DirectionalLight&&e++,r instanceof THREE.PointLight&&f++,r instanceof THREE.SpotLight&&g++,r instanceof THREE.HemisphereLight&&h++)}q=p=0;for(r=b.length;q<r;q++){var s=b[q];s.castShadow&&(s instanceof THREE.SpotLight&&p++,s instanceof THREE.DirectionalLight&&!s.shadowCascade&&p++)}b=p;Gb&&d&&d.skeleton&&d.skeleton.useVertexTexture?p=1024:(p=m.getParameter(m.MAX_VERTEX_UNIFORM_VECTORS),p=Math.floor((p-20)/4),void 0!==d&&d instanceof THREE.SkinnedMesh&&
(p=Math.min(d.skeleton.bones.length,p),p<d.skeleton.bones.length&&console.warn("WebGLRenderer: too many bones - "+d.skeleton.bones.length+", this GPU supports just "+p+" (try OpenGL instead of ANGLE)")));c={precision:Q,supportsVertexTextures:Jb,map:!!a.map,envMap:!!a.envMap,lightMap:!!a.lightMap,bumpMap:!!a.bumpMap,normalMap:!!a.normalMap,specularMap:!!a.specularMap,vertexColors:a.vertexColors,fog:c,useFog:a.fog,fogExp:c instanceof THREE.FogExp2,sizeAttenuation:a.sizeAttenuation,logarithmicDepthBuffer:da,
skinning:a.skinning,maxBones:p,useVertexTexture:Gb&&d&&d.skeleton&&d.skeleton.useVertexTexture,morphTargets:a.morphTargets,morphNormals:a.morphNormals,maxMorphTargets:this.maxMorphTargets,maxMorphNormals:this.maxMorphNormals,maxDirLights:e,maxPointLights:f,maxSpotLights:g,maxHemiLights:h,maxShadows:b,shadowMapEnabled:this.shadowMapEnabled&&d.receiveShadow&&0<b,shadowMapType:this.shadowMapType,shadowMapDebug:this.shadowMapDebug,shadowMapCascade:this.shadowMapCascade,alphaTest:a.alphaTest,metal:a.metal,
wrapAround:a.wrapAround,doubleSided:a.side===THREE.DoubleSide,flipSided:a.side===THREE.BackSide};d=[];n?d.push(n):(d.push(a.fragmentShader),d.push(a.vertexShader));for(var u in a.defines)d.push(u),d.push(a.defines[u]);for(l in c)d.push(l),d.push(c[l]);n=d.join();var t;l=0;for(u=ga.length;l<u;l++)if(d=ga[l],d.code===n){t=d;t.usedTimes++;break}void 0===t&&(t=new THREE.WebGLProgram(this,n,a,c),ga.push(t),P.info.memory.programs=ga.length);a.program=t;t=a.program.attributes;if(a.morphTargets)for(a.numSupportedMorphTargets=
0,u="morphTarget",l=0;l<this.maxMorphTargets;l++)n=u+l,0<=t[n]&&a.numSupportedMorphTargets++;if(a.morphNormals)for(a.numSupportedMorphNormals=0,u="morphNormal",l=0;l<this.maxMorphNormals;l++)n=u+l,0<=t[n]&&a.numSupportedMorphNormals++;a.uniformsList=[];for(k in a.uniforms)a.uniformsList.push([a.uniforms[k],k])};this.setFaceCulling=function(a,b){a===THREE.CullFaceNone?m.disable(m.CULL_FACE):(b===THREE.FrontFaceDirectionCW?m.frontFace(m.CW):m.frontFace(m.CCW),a===THREE.CullFaceBack?m.cullFace(m.BACK):
a===THREE.CullFaceFront?m.cullFace(m.FRONT):m.cullFace(m.FRONT_AND_BACK),m.enable(m.CULL_FACE))};this.setMaterialFaces=function(a){var b=a.side===THREE.DoubleSide;a=a.side===THREE.BackSide;Ga!==b&&(b?m.disable(m.CULL_FACE):m.enable(m.CULL_FACE),Ga=b);ha!==a&&(a?m.frontFace(m.CW):m.frontFace(m.CCW),ha=a)};this.setDepthTest=function(a){ia!==a&&(a?m.enable(m.DEPTH_TEST):m.disable(m.DEPTH_TEST),ia=a)};this.setDepthWrite=function(a){ma!==a&&(m.depthMask(a),ma=a)};this.setBlending=function(a,b,c,d){a!==
Oa&&(a===THREE.NoBlending?m.disable(m.BLEND):a===THREE.AdditiveBlending?(m.enable(m.BLEND),m.blendEquation(m.FUNC_ADD),m.blendFunc(m.SRC_ALPHA,m.ONE)):a===THREE.SubtractiveBlending?(m.enable(m.BLEND),m.blendEquation(m.FUNC_ADD),m.blendFunc(m.ZERO,m.ONE_MINUS_SRC_COLOR)):a===THREE.MultiplyBlending?(m.enable(m.BLEND),m.blendEquation(m.FUNC_ADD),m.blendFunc(m.ZERO,m.SRC_COLOR)):a===THREE.CustomBlending?m.enable(m.BLEND):(m.enable(m.BLEND),m.blendEquationSeparate(m.FUNC_ADD,m.FUNC_ADD),m.blendFuncSeparate(m.SRC_ALPHA,
m.ONE_MINUS_SRC_ALPHA,m.ONE,m.ONE_MINUS_SRC_ALPHA)),Oa=a);if(a===THREE.CustomBlending){if(b!==Ra&&(m.blendEquation(z(b)),Ra=b),c!==Sa||d!==Fa)m.blendFunc(z(c),z(d)),Sa=c,Fa=d}else Fa=Sa=Ra=null};this.setTexture=function(a,b){if(a.needsUpdate){a.__webglInit||(a.__webglInit=!0,a.addEventListener("dispose",Hb),a.__webglTexture=m.createTexture(),P.info.memory.textures++);m.activeTexture(m.TEXTURE0+b);m.bindTexture(m.TEXTURE_2D,a.__webglTexture);m.pixelStorei(m.UNPACK_FLIP_Y_WEBGL,a.flipY);m.pixelStorei(m.UNPACK_PREMULTIPLY_ALPHA_WEBGL,
a.premultiplyAlpha);m.pixelStorei(m.UNPACK_ALIGNMENT,a.unpackAlignment);var c=a.image,d=THREE.Math.isPowerOfTwo(c.width)&&THREE.Math.isPowerOfTwo(c.height),e=z(a.format),f=z(a.type);D(m.TEXTURE_2D,a,d);var g=a.mipmaps;if(a instanceof THREE.DataTexture)if(0<g.length&&d){for(var h=0,k=g.length;h<k;h++)c=g[h],m.texImage2D(m.TEXTURE_2D,h,e,c.width,c.height,0,e,f,c.data);a.generateMipmaps=!1}else m.texImage2D(m.TEXTURE_2D,0,e,c.width,c.height,0,e,f,c.data);else if(a instanceof THREE.CompressedTexture)for(h=
0,k=g.length;h<k;h++)c=g[h],a.format!==THREE.RGBAFormat?m.compressedTexImage2D(m.TEXTURE_2D,h,e,c.width,c.height,0,c.data):m.texImage2D(m.TEXTURE_2D,h,e,c.width,c.height,0,e,f,c.data);else if(0<g.length&&d){h=0;for(k=g.length;h<k;h++)c=g[h],m.texImage2D(m.TEXTURE_2D,h,e,e,f,c);a.generateMipmaps=!1}else m.texImage2D(m.TEXTURE_2D,0,e,e,f,a.image);a.generateMipmaps&&d&&m.generateMipmap(m.TEXTURE_2D);a.needsUpdate=!1;if(a.onUpdate)a.onUpdate()}else m.activeTexture(m.TEXTURE0+b),m.bindTexture(m.TEXTURE_2D,
a.__webglTexture)};this.setRenderTarget=function(a){var b=a instanceof THREE.WebGLRenderTargetCube;if(a&&!a.__webglFramebuffer){void 0===a.depthBuffer&&(a.depthBuffer=!0);void 0===a.stencilBuffer&&(a.stencilBuffer=!0);a.addEventListener("dispose",Rb);a.__webglTexture=m.createTexture();P.info.memory.textures++;var c=THREE.Math.isPowerOfTwo(a.width)&&THREE.Math.isPowerOfTwo(a.height),d=z(a.format),e=z(a.type);if(b){a.__webglFramebuffer=[];a.__webglRenderbuffer=[];m.bindTexture(m.TEXTURE_CUBE_MAP,a.__webglTexture);
D(m.TEXTURE_CUBE_MAP,a,c);for(var f=0;6>f;f++){a.__webglFramebuffer[f]=m.createFramebuffer();a.__webglRenderbuffer[f]=m.createRenderbuffer();m.texImage2D(m.TEXTURE_CUBE_MAP_POSITIVE_X+f,0,d,a.width,a.height,0,d,e,null);var g=a,h=m.TEXTURE_CUBE_MAP_POSITIVE_X+f;m.bindFramebuffer(m.FRAMEBUFFER,a.__webglFramebuffer[f]);m.framebufferTexture2D(m.FRAMEBUFFER,m.COLOR_ATTACHMENT0,h,g.__webglTexture,0);C(a.__webglRenderbuffer[f],a)}c&&m.generateMipmap(m.TEXTURE_CUBE_MAP)}else a.__webglFramebuffer=m.createFramebuffer(),
a.__webglRenderbuffer=a.shareDepthFrom?a.shareDepthFrom.__webglRenderbuffer:m.createRenderbuffer(),m.bindTexture(m.TEXTURE_2D,a.__webglTexture),D(m.TEXTURE_2D,a,c),m.texImage2D(m.TEXTURE_2D,0,d,a.width,a.height,0,d,e,null),d=m.TEXTURE_2D,m.bindFramebuffer(m.FRAMEBUFFER,a.__webglFramebuffer),m.framebufferTexture2D(m.FRAMEBUFFER,m.COLOR_ATTACHMENT0,d,a.__webglTexture,0),a.shareDepthFrom?a.depthBuffer&&!a.stencilBuffer?m.framebufferRenderbuffer(m.FRAMEBUFFER,m.DEPTH_ATTACHMENT,m.RENDERBUFFER,a.__webglRenderbuffer):
a.depthBuffer&&a.stencilBuffer&&m.framebufferRenderbuffer(m.FRAMEBUFFER,m.DEPTH_STENCIL_ATTACHMENT,m.RENDERBUFFER,a.__webglRenderbuffer):C(a.__webglRenderbuffer,a),c&&m.generateMipmap(m.TEXTURE_2D);b?m.bindTexture(m.TEXTURE_CUBE_MAP,null):m.bindTexture(m.TEXTURE_2D,null);m.bindRenderbuffer(m.RENDERBUFFER,null);m.bindFramebuffer(m.FRAMEBUFFER,null)}a?(b=b?a.__webglFramebuffer[a.activeCubeFace]:a.__webglFramebuffer,c=a.width,a=a.height,e=d=0):(b=null,c=Da,a=Ja,d=Ca,e=va);b!==Ha&&(m.bindFramebuffer(m.FRAMEBUFFER,
b),m.viewport(d,e,c,a),Ha=b);ja=c;ra=a};this.shadowMapPlugin=new THREE.ShadowMapPlugin;this.addPrePlugin(this.shadowMapPlugin);this.addPostPlugin(new THREE.SpritePlugin);this.addPostPlugin(new THREE.LensFlarePlugin)};THREE.WebGLRenderTarget=function(a,b,c){this.width=a;this.height=b;c=c||{};this.wrapS=void 0!==c.wrapS?c.wrapS:THREE.ClampToEdgeWrapping;this.wrapT=void 0!==c.wrapT?c.wrapT:THREE.ClampToEdgeWrapping;this.magFilter=void 0!==c.magFilter?c.magFilter:THREE.LinearFilter;this.minFilter=void 0!==c.minFilter?c.minFilter:THREE.LinearMipMapLinearFilter;this.anisotropy=void 0!==c.anisotropy?c.anisotropy:1;this.offset=new THREE.Vector2(0,0);this.repeat=new THREE.Vector2(1,1);this.format=void 0!==c.format?c.format:
THREE.RGBAFormat;this.type=void 0!==c.type?c.type:THREE.UnsignedByteType;this.depthBuffer=void 0!==c.depthBuffer?c.depthBuffer:!0;this.stencilBuffer=void 0!==c.stencilBuffer?c.stencilBuffer:!0;this.generateMipmaps=!0;this.shareDepthFrom=null};
THREE.WebGLRenderTarget.prototype={constructor:THREE.WebGLRenderTarget,setSize:function(a,b){this.width=a;this.height=b},clone:function(){var a=new THREE.WebGLRenderTarget(this.width,this.height);a.wrapS=this.wrapS;a.wrapT=this.wrapT;a.magFilter=this.magFilter;a.minFilter=this.minFilter;a.anisotropy=this.anisotropy;a.offset.copy(this.offset);a.repeat.copy(this.repeat);a.format=this.format;a.type=this.type;a.depthBuffer=this.depthBuffer;a.stencilBuffer=this.stencilBuffer;a.generateMipmaps=this.generateMipmaps;
a.shareDepthFrom=this.shareDepthFrom;return a},dispose:function(){this.dispatchEvent({type:"dispose"})}};THREE.EventDispatcher.prototype.apply(THREE.WebGLRenderTarget.prototype);THREE.WebGLRenderTargetCube=function(a,b,c){THREE.WebGLRenderTarget.call(this,a,b,c);this.activeCubeFace=0};THREE.WebGLRenderTargetCube.prototype=Object.create(THREE.WebGLRenderTarget.prototype);THREE.WebGLProgram=function(){var a=0;return function(b,c,d,e){var f=b.context,g=d.fragmentShader,h=d.vertexShader,k=d.uniforms,l=d.attributes,n=d.defines,q=d.index0AttributeName;void 0===q&&!0===e.morphTargets&&(q="position");var p="SHADOWMAP_TYPE_BASIC";e.shadowMapType===THREE.PCFShadowMap?p="SHADOWMAP_TYPE_PCF":e.shadowMapType===THREE.PCFSoftShadowMap&&(p="SHADOWMAP_TYPE_PCF_SOFT");var s,t;s=[];for(var r in n)t=n[r],!1!==t&&(t="#define "+r+" "+t,s.push(t));s=s.join("\n");n=f.createProgram();d instanceof
THREE.RawShaderMaterial?b=d="":(d=["precision "+e.precision+" float;","precision "+e.precision+" int;",s,e.supportsVertexTextures?"#define VERTEX_TEXTURES":"",b.gammaInput?"#define GAMMA_INPUT":"",b.gammaOutput?"#define GAMMA_OUTPUT":"","#define MAX_DIR_LIGHTS "+e.maxDirLights,"#define MAX_POINT_LIGHTS "+e.maxPointLights,"#define MAX_SPOT_LIGHTS "+e.maxSpotLights,"#define MAX_HEMI_LIGHTS "+e.maxHemiLights,"#define MAX_SHADOWS "+e.maxShadows,"#define MAX_BONES "+e.maxBones,e.map?"#define USE_MAP":
"",e.envMap?"#define USE_ENVMAP":"",e.lightMap?"#define USE_LIGHTMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.vertexColors?"#define USE_COLOR":"",e.skinning?"#define USE_SKINNING":"",e.useVertexTexture?"#define BONE_TEXTURE":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals?"#define USE_MORPHNORMALS":"",e.wrapAround?"#define WRAP_AROUND":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":
"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+p:"",e.shadowMapDebug?"#define SHADOWMAP_DEBUG":"",e.shadowMapCascade?"#define SHADOWMAP_CASCADE":"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"","uniform mat4 modelMatrix;\nuniform mat4 modelViewMatrix;\nuniform mat4 projectionMatrix;\nuniform mat4 viewMatrix;\nuniform mat3 normalMatrix;\nuniform vec3 cameraPosition;\nattribute vec3 position;\nattribute vec3 normal;\nattribute vec2 uv;\nattribute vec2 uv2;\n#ifdef USE_COLOR\n\tattribute vec3 color;\n#endif\n#ifdef USE_MORPHTARGETS\n\tattribute vec3 morphTarget0;\n\tattribute vec3 morphTarget1;\n\tattribute vec3 morphTarget2;\n\tattribute vec3 morphTarget3;\n\t#ifdef USE_MORPHNORMALS\n\t\tattribute vec3 morphNormal0;\n\t\tattribute vec3 morphNormal1;\n\t\tattribute vec3 morphNormal2;\n\t\tattribute vec3 morphNormal3;\n\t#else\n\t\tattribute vec3 morphTarget4;\n\t\tattribute vec3 morphTarget5;\n\t\tattribute vec3 morphTarget6;\n\t\tattribute vec3 morphTarget7;\n\t#endif\n#endif\n#ifdef USE_SKINNING\n\tattribute vec4 skinIndex;\n\tattribute vec4 skinWeight;\n#endif\n"].join("\n"),
b=["precision "+e.precision+" float;","precision "+e.precision+" int;",e.bumpMap||e.normalMap?"#extension GL_OES_standard_derivatives : enable":"",s,"#define MAX_DIR_LIGHTS "+e.maxDirLights,"#define MAX_POINT_LIGHTS "+e.maxPointLights,"#define MAX_SPOT_LIGHTS "+e.maxSpotLights,"#define MAX_HEMI_LIGHTS "+e.maxHemiLights,"#define MAX_SHADOWS "+e.maxShadows,e.alphaTest?"#define ALPHATEST "+e.alphaTest:"",b.gammaInput?"#define GAMMA_INPUT":"",b.gammaOutput?"#define GAMMA_OUTPUT":"",e.useFog&&e.fog?"#define USE_FOG":
"",e.useFog&&e.fogExp?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.lightMap?"#define USE_LIGHTMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.vertexColors?"#define USE_COLOR":"",e.metal?"#define METAL":"",e.wrapAround?"#define WRAP_AROUND":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?
"#define "+p:"",e.shadowMapDebug?"#define SHADOWMAP_DEBUG":"",e.shadowMapCascade?"#define SHADOWMAP_CASCADE":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"","uniform mat4 viewMatrix;\nuniform vec3 cameraPosition;\n"].join("\n"));h=new THREE.WebGLShader(f,f.VERTEX_SHADER,d+h);g=new THREE.WebGLShader(f,f.FRAGMENT_SHADER,b+g);f.attachShader(n,h);f.attachShader(n,g);void 0!==q&&f.bindAttribLocation(n,0,q);f.linkProgram(n);!1===f.getProgramParameter(n,f.LINK_STATUS)&&(console.error("Could not initialise shader"),
console.error("gl.VALIDATE_STATUS",f.getProgramParameter(n,f.VALIDATE_STATUS)),console.error("gl.getError()",f.getError()));""!==f.getProgramInfoLog(n)&&console.error("gl.getProgramInfoLog()",f.getProgramInfoLog(n));f.deleteShader(h);f.deleteShader(g);q="viewMatrix modelViewMatrix projectionMatrix normalMatrix modelMatrix cameraPosition morphTargetInfluences".split(" ");e.useVertexTexture?(q.push("boneTexture"),q.push("boneTextureWidth"),q.push("boneTextureHeight")):q.push("boneGlobalMatrices");e.logarithmicDepthBuffer&&
q.push("logDepthBufFC");for(var v in k)q.push(v);k=q;v={};q=0;for(b=k.length;q<b;q++)p=k[q],v[p]=f.getUniformLocation(n,p);this.uniforms=v;q="position normal uv uv2 tangent color skinIndex skinWeight lineDistance".split(" ");for(k=0;k<e.maxMorphTargets;k++)q.push("morphTarget"+k);for(k=0;k<e.maxMorphNormals;k++)q.push("morphNormal"+k);for(var w in l)q.push(w);e=q;l={};w=0;for(k=e.length;w<k;w++)v=e[w],l[v]=f.getAttribLocation(n,v);this.attributes=l;this.id=a++;this.code=c;this.usedTimes=1;this.program=
n;this.vertexShader=h;this.fragmentShader=g;return this}}();THREE.WebGLShader=function(){var a=function(a){a=a.split("\n");for(var c=0;c<a.length;c++)a[c]=c+1+": "+a[c];return a.join("\n")};return function(b,c,d){c=b.createShader(c);b.shaderSource(c,d);b.compileShader(c);!1===b.getShaderParameter(c,b.COMPILE_STATUS)&&console.error("THREE.WebGLShader: Shader couldn't compile.");""!==b.getShaderInfoLog(c)&&(console.error("THREE.WebGLShader:","gl.getShaderInfoLog()",b.getShaderInfoLog(c)),console.error(a(d)));return c}}();THREE.RenderableVertex=function(){this.position=new THREE.Vector3;this.positionWorld=new THREE.Vector3;this.positionScreen=new THREE.Vector4;this.visible=!0};THREE.RenderableVertex.prototype.copy=function(a){this.positionWorld.copy(a.positionWorld);this.positionScreen.copy(a.positionScreen)};THREE.RenderableFace=function(){this.id=0;this.v1=new THREE.RenderableVertex;this.v2=new THREE.RenderableVertex;this.v3=new THREE.RenderableVertex;this.normalModel=new THREE.Vector3;this.vertexNormalsModel=[new THREE.Vector3,new THREE.Vector3,new THREE.Vector3];this.vertexNormalsLength=0;this.material=this.color=null;this.uvs=[new THREE.Vector2,new THREE.Vector2,new THREE.Vector2];this.z=0};THREE.RenderableObject=function(){this.id=0;this.object=null;this.z=0};THREE.RenderableSprite=function(){this.id=0;this.object=null;this.rotation=this.z=this.y=this.x=0;this.scale=new THREE.Vector2;this.material=null};THREE.RenderableLine=function(){this.id=0;this.v1=new THREE.RenderableVertex;this.v2=new THREE.RenderableVertex;this.vertexColors=[new THREE.Color,new THREE.Color];this.material=null;this.z=0};THREE.GeometryUtils={merge:function(a,b,c){console.warn("DEPRECATED: GeometryUtils's .merge() has been moved to Geometry. Use geometry.merge( geometry2, matrix, materialIndexOffset ) instead.");var d;b instanceof THREE.Mesh&&(b.matrixAutoUpdate&&b.updateMatrix(),d=b.matrix,b=b.geometry);a.merge(b,d,c)},randomPointInTriangle:function(){var a=new THREE.Vector3;return function(b,c,d){var e=new THREE.Vector3,f=THREE.Math.random16(),g=THREE.Math.random16();1<f+g&&(f=1-f,g=1-g);var h=1-f-g;e.copy(b);e.multiplyScalar(f);
a.copy(c);a.multiplyScalar(g);e.add(a);a.copy(d);a.multiplyScalar(h);e.add(a);return e}}(),randomPointInFace:function(a,b,c){return THREE.GeometryUtils.randomPointInTriangle(b.vertices[a.a],b.vertices[a.b],b.vertices[a.c])},randomPointsInGeometry:function(a,b){function c(a){function b(c,d){if(d<c)return c;var e=c+Math.floor((d-c)/2);return l[e]>a?b(c,e-1):l[e]<a?b(e+1,d):e}return b(0,l.length-1)}var d,e,f=a.faces,g=a.vertices,h=f.length,k=0,l=[],n,q,p;for(e=0;e<h;e++)d=f[e],n=g[d.a],q=g[d.b],p=g[d.c],
d._area=THREE.GeometryUtils.triangleArea(n,q,p),k+=d._area,l[e]=k;d=[];for(e=0;e<b;e++)g=THREE.Math.random16()*k,g=c(g),d[e]=THREE.GeometryUtils.randomPointInFace(f[g],a,!0);return d},triangleArea:function(){var a=new THREE.Vector3,b=new THREE.Vector3;return function(c,d,e){a.subVectors(d,c);b.subVectors(e,c);a.cross(b);return 0.5*a.length()}}(),center:function(a){a.computeBoundingBox();var b=a.boundingBox,c=new THREE.Vector3;c.addVectors(b.min,b.max);c.multiplyScalar(-0.5);a.applyMatrix((new THREE.Matrix4).makeTranslation(c.x,
c.y,c.z));a.computeBoundingBox();return c}};THREE.ImageUtils={crossOrigin:void 0,loadTexture:function(a,b,c,d){var e=new THREE.ImageLoader;e.crossOrigin=this.crossOrigin;var f=new THREE.Texture(void 0,b);b=e.load(a,function(){f.needsUpdate=!0;c&&c(f)},void 0,function(a){d&&d(a)});f.image=b;f.sourceFile=a;return f},loadCompressedTexture:function(a,b,c,d){var e=new THREE.CompressedTexture;e.mapping=b;var f=new XMLHttpRequest;f.onload=function(){var a=THREE.ImageUtils.parseDDS(f.response,!0);e.format=a.format;e.mipmaps=a.mipmaps;e.image.width=
a.width;e.image.height=a.height;e.generateMipmaps=!1;e.needsUpdate=!0;c&&c(e)};f.onerror=d;f.open("GET",a,!0);f.responseType="arraybuffer";f.send(null);return e},loadTextureCube:function(a,b,c,d){var e=[];e.loadCount=0;d=new THREE.ImageLoader;d.crossOrigin=this.crossOrigin;var f=new THREE.Texture;f.image=e;void 0!==b&&(f.mapping=b);f.flipY=!1;b=0;for(var g=a.length;b<g;++b){var h=d.load(a[b],function(){e.loadCount+=1;6===e.loadCount&&(f.needsUpdate=!0,c&&c(f))});e[b]=h}return f},loadCompressedTextureCube:function(a,
b,c,d){var e=[];e.loadCount=0;var f=new THREE.CompressedTexture;f.image=e;void 0!==b&&(f.mapping=b);f.flipY=!1;f.generateMipmaps=!1;b=function(a,b){return function(){var d=THREE.ImageUtils.parseDDS(a.response,!0);b.format=d.format;b.mipmaps=d.mipmaps;b.width=d.width;b.height=d.height;e.loadCount+=1;6===e.loadCount&&(f.format=d.format,f.needsUpdate=!0,c&&c(f))}};if(a instanceof Array)for(var g=0,h=a.length;g<h;++g){var k={};e[g]=k;var l=new XMLHttpRequest;l.onload=b(l,k);l.onerror=d;k=a[g];l.open("GET",
k,!0);l.responseType="arraybuffer";l.send(null)}else l=new XMLHttpRequest,l.onload=function(){var a=THREE.ImageUtils.parseDDS(l.response,!0);if(a.isCubemap){for(var b=a.mipmaps.length/a.mipmapCount,d=0;d<b;d++){e[d]={mipmaps:[]};for(var g=0;g<a.mipmapCount;g++)e[d].mipmaps.push(a.mipmaps[d*a.mipmapCount+g]),e[d].format=a.format,e[d].width=a.width,e[d].height=a.height}f.format=a.format;f.needsUpdate=!0;c&&c(f)}},l.onerror=d,l.open("GET",a,!0),l.responseType="arraybuffer",l.send(null);return f},loadDDSTexture:function(a,
b,c,d){var e=[];e.loadCount=0;var f=new THREE.CompressedTexture;f.image=e;void 0!==b&&(f.mapping=b);f.flipY=!1;f.generateMipmaps=!1;var g=new XMLHttpRequest;g.onload=function(){var a=THREE.ImageUtils.parseDDS(g.response,!0);if(a.isCubemap)for(var b=a.mipmaps.length/a.mipmapCount,d=0;d<b;d++){e[d]={mipmaps:[]};for(var n=0;n<a.mipmapCount;n++)e[d].mipmaps.push(a.mipmaps[d*a.mipmapCount+n]),e[d].format=a.format,e[d].width=a.width,e[d].height=a.height}else f.image.width=a.width,f.image.height=a.height,
f.mipmaps=a.mipmaps;f.format=a.format;f.needsUpdate=!0;c&&c(f)};g.onerror=d;g.open("GET",a,!0);g.responseType="arraybuffer";g.send(null);return f},parseDDS:function(a,b){function c(a){return a.charCodeAt(0)+(a.charCodeAt(1)<<8)+(a.charCodeAt(2)<<16)+(a.charCodeAt(3)<<24)}function d(a,b,c,d){var e=c*d*4;a=new Uint8Array(a,b,e);for(var e=new Uint8Array(e),f=b=0,g=0;g<d;g++)for(var h=0;h<c;h++){var k=a[f];f++;var l=a[f];f++;var p=a[f];f++;var n=a[f];f++;e[b]=p;b++;e[b]=l;b++;e[b]=k;b++;e[b]=n;b++}return e}
var e={mipmaps:[],width:0,height:0,format:null,mipmapCount:1},f=c("DXT1"),g=c("DXT3"),h=c("DXT5"),k=new Int32Array(a,0,31);if(542327876!==k[0])return console.error("ImageUtils.parseDDS(): Invalid magic number in DDS header"),e;if(!k[20]&4)return console.error("ImageUtils.parseDDS(): Unsupported format, must contain a FourCC code"),e;var l=k[21],n=!1;switch(l){case f:f=8;e.format=THREE.RGB_S3TC_DXT1_Format;break;case g:f=16;e.format=THREE.RGBA_S3TC_DXT3_Format;break;case h:f=16;e.format=THREE.RGBA_S3TC_DXT5_Format;
break;default:if(32==k[22]&&k[23]&16711680&&k[24]&65280&&k[25]&255&&k[26]&4278190080)n=!0,f=64,e.format=THREE.RGBAFormat;else return console.error("ImageUtils.parseDDS(): Unsupported FourCC code: ",String.fromCharCode(l&255,l>>8&255,l>>16&255,l>>24&255)),e}e.mipmapCount=1;k[2]&131072&&!1!==b&&(e.mipmapCount=Math.max(1,k[7]));e.isCubemap=k[28]&512?!0:!1;e.width=k[4];e.height=k[3];for(var k=k[1]+4,g=e.width,h=e.height,l=e.isCubemap?6:1,q=0;q<l;q++){for(var p=0;p<e.mipmapCount;p++){if(n)var s=d(a,k,
g,h),t=s.length;else t=Math.max(4,g)/4*Math.max(4,h)/4*f,s=new Uint8Array(a,k,t);e.mipmaps.push({data:s,width:g,height:h});k+=t;g=Math.max(0.5*g,1);h=Math.max(0.5*h,1)}g=e.width;h=e.height}return e},getNormalMap:function(a,b){var c=function(a){var b=Math.sqrt(a[0]*a[0]+a[1]*a[1]+a[2]*a[2]);return[a[0]/b,a[1]/b,a[2]/b]};b|=1;var d=a.width,e=a.height,f=document.createElement("canvas");f.width=d;f.height=e;var g=f.getContext("2d");g.drawImage(a,0,0);for(var h=g.getImageData(0,0,d,e).data,k=g.createImageData(d,
e),l=k.data,n=0;n<d;n++)for(var q=0;q<e;q++){var p=0>q-1?0:q-1,s=q+1>e-1?e-1:q+1,t=0>n-1?0:n-1,r=n+1>d-1?d-1:n+1,v=[],w=[0,0,h[4*(q*d+n)]/255*b];v.push([-1,0,h[4*(q*d+t)]/255*b]);v.push([-1,-1,h[4*(p*d+t)]/255*b]);v.push([0,-1,h[4*(p*d+n)]/255*b]);v.push([1,-1,h[4*(p*d+r)]/255*b]);v.push([1,0,h[4*(q*d+r)]/255*b]);v.push([1,1,h[4*(s*d+r)]/255*b]);v.push([0,1,h[4*(s*d+n)]/255*b]);v.push([-1,1,h[4*(s*d+t)]/255*b]);p=[];t=v.length;for(s=0;s<t;s++){var r=v[s],u=v[(s+1)%t],r=[r[0]-w[0],r[1]-w[1],r[2]-w[2]],
u=[u[0]-w[0],u[1]-w[1],u[2]-w[2]];p.push(c([r[1]*u[2]-r[2]*u[1],r[2]*u[0]-r[0]*u[2],r[0]*u[1]-r[1]*u[0]]))}v=[0,0,0];for(s=0;s<p.length;s++)v[0]+=p[s][0],v[1]+=p[s][1],v[2]+=p[s][2];v[0]/=p.length;v[1]/=p.length;v[2]/=p.length;w=4*(q*d+n);l[w]=(v[0]+1)/2*255|0;l[w+1]=(v[1]+1)/2*255|0;l[w+2]=255*v[2]|0;l[w+3]=255}g.putImageData(k,0,0);return f},generateDataTexture:function(a,b,c){var d=a*b,e=new Uint8Array(3*d),f=Math.floor(255*c.r),g=Math.floor(255*c.g);c=Math.floor(255*c.b);for(var h=0;h<d;h++)e[3*
h]=f,e[3*h+1]=g,e[3*h+2]=c;a=new THREE.DataTexture(e,a,b,THREE.RGBFormat);a.needsUpdate=!0;return a}};THREE.SceneUtils={createMultiMaterialObject:function(a,b){for(var c=new THREE.Object3D,d=0,e=b.length;d<e;d++)c.add(new THREE.Mesh(a,b[d]));return c},detach:function(a,b,c){a.applyMatrix(b.matrixWorld);b.remove(a);c.add(a)},attach:function(a,b,c){var d=new THREE.Matrix4;d.getInverse(c.matrixWorld);a.applyMatrix(d);b.remove(a);c.add(a)}};THREE.FontUtils={faces:{},face:"helvetiker",weight:"normal",style:"normal",size:150,divisions:10,getFace:function(){return this.faces[this.face][this.weight][this.style]},loadFace:function(a){var b=a.familyName.toLowerCase();this.faces[b]=this.faces[b]||{};this.faces[b][a.cssFontWeight]=this.faces[b][a.cssFontWeight]||{};this.faces[b][a.cssFontWeight][a.cssFontStyle]=a;return this.faces[b][a.cssFontWeight][a.cssFontStyle]=a},drawText:function(a){var b=this.getFace(),c=this.size/b.resolution,d=0,e=
String(a).split(""),f=e.length,g=[];for(a=0;a<f;a++){var h=new THREE.Path,h=this.extractGlyphPoints(e[a],b,c,d,h),d=d+h.offset;g.push(h.path)}return{paths:g,offset:d/2}},extractGlyphPoints:function(a,b,c,d,e){var f=[],g,h,k,l,n,q,p,s,t,r,v,w=b.glyphs[a]||b.glyphs["?"];if(w){if(w.o)for(b=w._cachedOutline||(w._cachedOutline=w.o.split(" ")),l=b.length,a=0;a<l;)switch(k=b[a++],k){case "m":k=b[a++]*c+d;n=b[a++]*c;e.moveTo(k,n);break;case "l":k=b[a++]*c+d;n=b[a++]*c;e.lineTo(k,n);break;case "q":k=b[a++]*
c+d;n=b[a++]*c;s=b[a++]*c+d;t=b[a++]*c;e.quadraticCurveTo(s,t,k,n);if(g=f[f.length-1])for(q=g.x,p=g.y,g=1,h=this.divisions;g<=h;g++){var u=g/h;THREE.Shape.Utils.b2(u,q,s,k);THREE.Shape.Utils.b2(u,p,t,n)}break;case "b":if(k=b[a++]*c+d,n=b[a++]*c,s=b[a++]*c+d,t=b[a++]*-c,r=b[a++]*c+d,v=b[a++]*-c,e.bezierCurveTo(k,n,s,t,r,v),g=f[f.length-1])for(q=g.x,p=g.y,g=1,h=this.divisions;g<=h;g++)u=g/h,THREE.Shape.Utils.b3(u,q,s,r,k),THREE.Shape.Utils.b3(u,p,t,v,n)}return{offset:w.ha*c,path:e}}}};
THREE.FontUtils.generateShapes=function(a,b){b=b||{};var c=void 0!==b.curveSegments?b.curveSegments:4,d=void 0!==b.font?b.font:"helvetiker",e=void 0!==b.weight?b.weight:"normal",f=void 0!==b.style?b.style:"normal";THREE.FontUtils.size=void 0!==b.size?b.size:100;THREE.FontUtils.divisions=c;THREE.FontUtils.face=d;THREE.FontUtils.weight=e;THREE.FontUtils.style=f;c=THREE.FontUtils.drawText(a).paths;d=[];e=0;for(f=c.length;e<f;e++)Array.prototype.push.apply(d,c[e].toShapes());return d};
(function(a){var b=function(a){for(var b=a.length,e=0,f=b-1,g=0;g<b;f=g++)e+=a[f].x*a[g].y-a[g].x*a[f].y;return 0.5*e};a.Triangulate=function(a,d){var e=a.length;if(3>e)return null;var f=[],g=[],h=[],k,l,n;if(0<b(a))for(l=0;l<e;l++)g[l]=l;else for(l=0;l<e;l++)g[l]=e-1-l;var q=2*e;for(l=e-1;2<e;){if(0>=q--){console.log("Warning, unable to triangulate polygon!");break}k=l;e<=k&&(k=0);l=k+1;e<=l&&(l=0);n=l+1;e<=n&&(n=0);var p;a:{var s=p=void 0,t=void 0,r=void 0,v=void 0,w=void 0,u=void 0,y=void 0,L=
void 0,s=a[g[k]].x,t=a[g[k]].y,r=a[g[l]].x,v=a[g[l]].y,w=a[g[n]].x,u=a[g[n]].y;if(1E-10>(r-s)*(u-t)-(v-t)*(w-s))p=!1;else{var x=void 0,N=void 0,J=void 0,B=void 0,K=void 0,A=void 0,G=void 0,D=void 0,C=void 0,F=void 0,C=D=G=L=y=void 0,x=w-r,N=u-v,J=s-w,B=t-u,K=r-s,A=v-t;for(p=0;p<e;p++)if(y=a[g[p]].x,L=a[g[p]].y,!(y===s&&L===t||y===r&&L===v||y===w&&L===u)&&(G=y-s,D=L-t,C=y-r,F=L-v,y-=w,L-=u,C=x*F-N*C,G=K*D-A*G,D=J*L-B*y,-1E-10<=C&&-1E-10<=D&&-1E-10<=G)){p=!1;break a}p=!0}}if(p){f.push([a[g[k]],a[g[l]],
a[g[n]]]);h.push([g[k],g[l],g[n]]);k=l;for(n=l+1;n<e;k++,n++)g[k]=g[n];e--;q=2*e}}return d?h:f};a.Triangulate.area=b;return a})(THREE.FontUtils);self._typeface_js={faces:THREE.FontUtils.faces,loadFace:THREE.FontUtils.loadFace};THREE.typeface_js=self._typeface_js;THREE.Curve=function(){};THREE.Curve.prototype.getPoint=function(a){console.log("Warning, getPoint() not implemented!");return null};THREE.Curve.prototype.getPointAt=function(a){a=this.getUtoTmapping(a);return this.getPoint(a)};THREE.Curve.prototype.getPoints=function(a){a||(a=5);var b,c=[];for(b=0;b<=a;b++)c.push(this.getPoint(b/a));return c};THREE.Curve.prototype.getSpacedPoints=function(a){a||(a=5);var b,c=[];for(b=0;b<=a;b++)c.push(this.getPointAt(b/a));return c};
THREE.Curve.prototype.getLength=function(){var a=this.getLengths();return a[a.length-1]};THREE.Curve.prototype.getLengths=function(a){a||(a=this.__arcLengthDivisions?this.__arcLengthDivisions:200);if(this.cacheArcLengths&&this.cacheArcLengths.length==a+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;var b=[],c,d=this.getPoint(0),e,f=0;b.push(0);for(e=1;e<=a;e++)c=this.getPoint(e/a),f+=c.distanceTo(d),b.push(f),d=c;return this.cacheArcLengths=b};
THREE.Curve.prototype.updateArcLengths=function(){this.needsUpdate=!0;this.getLengths()};THREE.Curve.prototype.getUtoTmapping=function(a,b){var c=this.getLengths(),d=0,e=c.length,f;f=b?b:a*c[e-1];for(var g=0,h=e-1,k;g<=h;)if(d=Math.floor(g+(h-g)/2),k=c[d]-f,0>k)g=d+1;else if(0<k)h=d-1;else{h=d;break}d=h;if(c[d]==f)return d/(e-1);g=c[d];return c=(d+(f-g)/(c[d+1]-g))/(e-1)};THREE.Curve.prototype.getTangent=function(a){var b=a-1E-4;a+=1E-4;0>b&&(b=0);1<a&&(a=1);b=this.getPoint(b);return this.getPoint(a).clone().sub(b).normalize()};
THREE.Curve.prototype.getTangentAt=function(a){a=this.getUtoTmapping(a);return this.getTangent(a)};
THREE.Curve.Utils={tangentQuadraticBezier:function(a,b,c,d){return 2*(1-a)*(c-b)+2*a*(d-c)},tangentCubicBezier:function(a,b,c,d,e){return-3*b*(1-a)*(1-a)+3*c*(1-a)*(1-a)-6*a*c*(1-a)+6*a*d*(1-a)-3*a*a*d+3*a*a*e},tangentSpline:function(a,b,c,d,e){return 6*a*a-6*a+(3*a*a-4*a+1)+(-6*a*a+6*a)+(3*a*a-2*a)},interpolate:function(a,b,c,d,e){a=0.5*(c-a);d=0.5*(d-b);var f=e*e;return(2*b-2*c+a+d)*e*f+(-3*b+3*c-2*a-d)*f+a*e+b}};
THREE.Curve.create=function(a,b){a.prototype=Object.create(THREE.Curve.prototype);a.prototype.getPoint=b;return a};THREE.CurvePath=function(){this.curves=[];this.bends=[];this.autoClose=!1};THREE.CurvePath.prototype=Object.create(THREE.Curve.prototype);THREE.CurvePath.prototype.add=function(a){this.curves.push(a)};THREE.CurvePath.prototype.checkConnection=function(){};THREE.CurvePath.prototype.closePath=function(){var a=this.curves[0].getPoint(0),b=this.curves[this.curves.length-1].getPoint(1);a.equals(b)||this.curves.push(new THREE.LineCurve(b,a))};
THREE.CurvePath.prototype.getPoint=function(a){var b=a*this.getLength(),c=this.getCurveLengths();for(a=0;a<c.length;){if(c[a]>=b)return b=c[a]-b,a=this.curves[a],b=1-b/a.getLength(),a.getPointAt(b);a++}return null};THREE.CurvePath.prototype.getLength=function(){var a=this.getCurveLengths();return a[a.length-1]};
THREE.CurvePath.prototype.getCurveLengths=function(){if(this.cacheLengths&&this.cacheLengths.length==this.curves.length)return this.cacheLengths;var a=[],b=0,c,d=this.curves.length;for(c=0;c<d;c++)b+=this.curves[c].getLength(),a.push(b);return this.cacheLengths=a};
THREE.CurvePath.prototype.getBoundingBox=function(){var a=this.getPoints(),b,c,d,e,f,g;b=c=Number.NEGATIVE_INFINITY;e=f=Number.POSITIVE_INFINITY;var h,k,l,n,q=a[0]instanceof THREE.Vector3;n=q?new THREE.Vector3:new THREE.Vector2;k=0;for(l=a.length;k<l;k++)h=a[k],h.x>b?b=h.x:h.x<e&&(e=h.x),h.y>c?c=h.y:h.y<f&&(f=h.y),q&&(h.z>d?d=h.z:h.z<g&&(g=h.z)),n.add(h);a={minX:e,minY:f,maxX:b,maxY:c};q&&(a.maxZ=d,a.minZ=g);return a};
THREE.CurvePath.prototype.createPointsGeometry=function(a){a=this.getPoints(a,!0);return this.createGeometry(a)};THREE.CurvePath.prototype.createSpacedPointsGeometry=function(a){a=this.getSpacedPoints(a,!0);return this.createGeometry(a)};THREE.CurvePath.prototype.createGeometry=function(a){for(var b=new THREE.Geometry,c=0;c<a.length;c++)b.vertices.push(new THREE.Vector3(a[c].x,a[c].y,a[c].z||0));return b};THREE.CurvePath.prototype.addWrapPath=function(a){this.bends.push(a)};
THREE.CurvePath.prototype.getTransformedPoints=function(a,b){var c=this.getPoints(a),d,e;b||(b=this.bends);d=0;for(e=b.length;d<e;d++)c=this.getWrapPoints(c,b[d]);return c};THREE.CurvePath.prototype.getTransformedSpacedPoints=function(a,b){var c=this.getSpacedPoints(a),d,e;b||(b=this.bends);d=0;for(e=b.length;d<e;d++)c=this.getWrapPoints(c,b[d]);return c};
THREE.CurvePath.prototype.getWrapPoints=function(a,b){var c=this.getBoundingBox(),d,e,f,g,h,k;d=0;for(e=a.length;d<e;d++)f=a[d],g=f.x,h=f.y,k=g/c.maxX,k=b.getUtoTmapping(k,g),g=b.getPoint(k),k=b.getTangent(k),k.set(-k.y,k.x).multiplyScalar(h),f.x=g.x+k.x,f.y=g.y+k.y;return a};THREE.Gyroscope=function(){THREE.Object3D.call(this)};THREE.Gyroscope.prototype=Object.create(THREE.Object3D.prototype);
THREE.Gyroscope.prototype.updateMatrixWorld=function(a){this.matrixAutoUpdate&&this.updateMatrix();if(this.matrixWorldNeedsUpdate||a)this.parent?(this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),this.matrixWorld.decompose(this.translationWorld,this.quaternionWorld,this.scaleWorld),this.matrix.decompose(this.translationObject,this.quaternionObject,this.scaleObject),this.matrixWorld.compose(this.translationWorld,this.quaternionObject,this.scaleWorld)):this.matrixWorld.copy(this.matrix),
this.matrixWorldNeedsUpdate=!1,a=!0;for(var b=0,c=this.children.length;b<c;b++)this.children[b].updateMatrixWorld(a)};THREE.Gyroscope.prototype.translationWorld=new THREE.Vector3;THREE.Gyroscope.prototype.translationObject=new THREE.Vector3;THREE.Gyroscope.prototype.quaternionWorld=new THREE.Quaternion;THREE.Gyroscope.prototype.quaternionObject=new THREE.Quaternion;THREE.Gyroscope.prototype.scaleWorld=new THREE.Vector3;THREE.Gyroscope.prototype.scaleObject=new THREE.Vector3;THREE.Path=function(a){THREE.CurvePath.call(this);this.actions=[];a&&this.fromPoints(a)};THREE.Path.prototype=Object.create(THREE.CurvePath.prototype);THREE.PathActions={MOVE_TO:"moveTo",LINE_TO:"lineTo",QUADRATIC_CURVE_TO:"quadraticCurveTo",BEZIER_CURVE_TO:"bezierCurveTo",CSPLINE_THRU:"splineThru",ARC:"arc",ELLIPSE:"ellipse"};THREE.Path.prototype.fromPoints=function(a){this.moveTo(a[0].x,a[0].y);for(var b=1,c=a.length;b<c;b++)this.lineTo(a[b].x,a[b].y)};
THREE.Path.prototype.moveTo=function(a,b){var c=Array.prototype.slice.call(arguments);this.actions.push({action:THREE.PathActions.MOVE_TO,args:c})};THREE.Path.prototype.lineTo=function(a,b){var c=Array.prototype.slice.call(arguments),d=this.actions[this.actions.length-1].args,d=new THREE.LineCurve(new THREE.Vector2(d[d.length-2],d[d.length-1]),new THREE.Vector2(a,b));this.curves.push(d);this.actions.push({action:THREE.PathActions.LINE_TO,args:c})};
THREE.Path.prototype.quadraticCurveTo=function(a,b,c,d){var e=Array.prototype.slice.call(arguments),f=this.actions[this.actions.length-1].args,f=new THREE.QuadraticBezierCurve(new THREE.Vector2(f[f.length-2],f[f.length-1]),new THREE.Vector2(a,b),new THREE.Vector2(c,d));this.curves.push(f);this.actions.push({action:THREE.PathActions.QUADRATIC_CURVE_TO,args:e})};
THREE.Path.prototype.bezierCurveTo=function(a,b,c,d,e,f){var g=Array.prototype.slice.call(arguments),h=this.actions[this.actions.length-1].args,h=new THREE.CubicBezierCurve(new THREE.Vector2(h[h.length-2],h[h.length-1]),new THREE.Vector2(a,b),new THREE.Vector2(c,d),new THREE.Vector2(e,f));this.curves.push(h);this.actions.push({action:THREE.PathActions.BEZIER_CURVE_TO,args:g})};
THREE.Path.prototype.splineThru=function(a){var b=Array.prototype.slice.call(arguments),c=this.actions[this.actions.length-1].args,c=[new THREE.Vector2(c[c.length-2],c[c.length-1])];Array.prototype.push.apply(c,a);c=new THREE.SplineCurve(c);this.curves.push(c);this.actions.push({action:THREE.PathActions.CSPLINE_THRU,args:b})};THREE.Path.prototype.arc=function(a,b,c,d,e,f){var g=this.actions[this.actions.length-1].args;this.absarc(a+g[g.length-2],b+g[g.length-1],c,d,e,f)};
THREE.Path.prototype.absarc=function(a,b,c,d,e,f){this.absellipse(a,b,c,c,d,e,f)};THREE.Path.prototype.ellipse=function(a,b,c,d,e,f,g){var h=this.actions[this.actions.length-1].args;this.absellipse(a+h[h.length-2],b+h[h.length-1],c,d,e,f,g)};THREE.Path.prototype.absellipse=function(a,b,c,d,e,f,g){var h=Array.prototype.slice.call(arguments),k=new THREE.EllipseCurve(a,b,c,d,e,f,g);this.curves.push(k);k=k.getPoint(1);h.push(k.x);h.push(k.y);this.actions.push({action:THREE.PathActions.ELLIPSE,args:h})};
THREE.Path.prototype.getSpacedPoints=function(a,b){a||(a=40);for(var c=[],d=0;d<a;d++)c.push(this.getPoint(d/a));return c};
THREE.Path.prototype.getPoints=function(a,b){if(this.useSpacedPoints)return console.log("tata"),this.getSpacedPoints(a,b);a=a||12;var c=[],d,e,f,g,h,k,l,n,q,p,s,t,r;d=0;for(e=this.actions.length;d<e;d++)switch(f=this.actions[d],g=f.action,f=f.args,g){case THREE.PathActions.MOVE_TO:c.push(new THREE.Vector2(f[0],f[1]));break;case THREE.PathActions.LINE_TO:c.push(new THREE.Vector2(f[0],f[1]));break;case THREE.PathActions.QUADRATIC_CURVE_TO:h=f[2];k=f[3];q=f[0];p=f[1];0<c.length?(g=c[c.length-1],s=g.x,
t=g.y):(g=this.actions[d-1].args,s=g[g.length-2],t=g[g.length-1]);for(f=1;f<=a;f++)r=f/a,g=THREE.Shape.Utils.b2(r,s,q,h),r=THREE.Shape.Utils.b2(r,t,p,k),c.push(new THREE.Vector2(g,r));break;case THREE.PathActions.BEZIER_CURVE_TO:h=f[4];k=f[5];q=f[0];p=f[1];l=f[2];n=f[3];0<c.length?(g=c[c.length-1],s=g.x,t=g.y):(g=this.actions[d-1].args,s=g[g.length-2],t=g[g.length-1]);for(f=1;f<=a;f++)r=f/a,g=THREE.Shape.Utils.b3(r,s,q,l,h),r=THREE.Shape.Utils.b3(r,t,p,n,k),c.push(new THREE.Vector2(g,r));break;case THREE.PathActions.CSPLINE_THRU:g=
this.actions[d-1].args;r=[new THREE.Vector2(g[g.length-2],g[g.length-1])];g=a*f[0].length;r=r.concat(f[0]);r=new THREE.SplineCurve(r);for(f=1;f<=g;f++)c.push(r.getPointAt(f/g));break;case THREE.PathActions.ARC:h=f[0];k=f[1];p=f[2];l=f[3];g=f[4];q=!!f[5];s=g-l;t=2*a;for(f=1;f<=t;f++)r=f/t,q||(r=1-r),r=l+r*s,g=h+p*Math.cos(r),r=k+p*Math.sin(r),c.push(new THREE.Vector2(g,r));break;case THREE.PathActions.ELLIPSE:for(h=f[0],k=f[1],p=f[2],n=f[3],l=f[4],g=f[5],q=!!f[6],s=g-l,t=2*a,f=1;f<=t;f++)r=f/t,q||
(r=1-r),r=l+r*s,g=h+p*Math.cos(r),r=k+n*Math.sin(r),c.push(new THREE.Vector2(g,r))}d=c[c.length-1];1E-10>Math.abs(d.x-c[0].x)&&1E-10>Math.abs(d.y-c[0].y)&&c.splice(c.length-1,1);b&&c.push(c[0]);return c};
THREE.Path.prototype.toShapes=function(a,b){function c(a){for(var b=[],c=0,d=a.length;c<d;c++){var e=a[c],f=new THREE.Shape;f.actions=e.actions;f.curves=e.curves;b.push(f)}return b}function d(a,b){for(var c=b.length,d=!1,e=c-1,f=0;f<c;e=f++){var g=b[e],h=b[f],k=h.x-g.x,l=h.y-g.y;if(1E-10<Math.abs(l)){if(0>l&&(g=b[f],k=-k,h=b[e],l=-l),!(a.y<g.y||a.y>h.y))if(a.y==g.y){if(a.x==g.x)return!0}else{e=l*(a.x-g.x)-k*(a.y-g.y);if(0==e)return!0;0>e||(d=!d)}}else if(a.y==g.y&&(h.x<=a.x&&a.x<=g.x||g.x<=a.x&&a.x<=
h.x))return!0}return d}var e=function(a){var b,c,d,e,f=[],g=new THREE.Path;b=0;for(c=a.length;b<c;b++)d=a[b],e=d.args,d=d.action,d==THREE.PathActions.MOVE_TO&&0!=g.actions.length&&(f.push(g),g=new THREE.Path),g[d].apply(g,e);0!=g.actions.length&&f.push(g);return f}(this.actions);if(0==e.length)return[];if(!0===b)return c(e);var f,g,h,k=[];if(1==e.length)return g=e[0],h=new THREE.Shape,h.actions=g.actions,h.curves=g.curves,k.push(h),k;var l=!THREE.Shape.Utils.isClockWise(e[0].getPoints()),l=a?!l:l;
h=[];var n=[],q=[],p=0,s;n[p]=void 0;q[p]=[];var t,r;t=0;for(r=e.length;t<r;t++)g=e[t],s=g.getPoints(),f=THREE.Shape.Utils.isClockWise(s),(f=a?!f:f)?(!l&&n[p]&&p++,n[p]={s:new THREE.Shape,p:s},n[p].s.actions=g.actions,n[p].s.curves=g.curves,l&&p++,q[p]=[]):q[p].push({h:g,p:s[0]});if(!n[0])return c(e);if(1<n.length){t=!1;r=[];g=0;for(e=n.length;g<e;g++)h[g]=[];g=0;for(e=n.length;g<e;g++)for(f=q[g],l=0;l<f.length;l++){p=f[l];s=!0;for(var v=0;v<n.length;v++)d(p.p,n[v].p)&&(g!=v&&r.push({froms:g,tos:v,
hole:l}),s?(s=!1,h[v].push(p)):t=!0);s&&h[g].push(p)}0<r.length&&(t||(q=h))}t=0;for(r=n.length;t<r;t++)for(h=n[t].s,k.push(h),g=q[t],e=0,f=g.length;e<f;e++)h.holes.push(g[e].h);return k};THREE.Shape=function(){THREE.Path.apply(this,arguments);this.holes=[]};THREE.Shape.prototype=Object.create(THREE.Path.prototype);THREE.Shape.prototype.extrude=function(a){return new THREE.ExtrudeGeometry(this,a)};THREE.Shape.prototype.makeGeometry=function(a){return new THREE.ShapeGeometry(this,a)};THREE.Shape.prototype.getPointsHoles=function(a){var b,c=this.holes.length,d=[];for(b=0;b<c;b++)d[b]=this.holes[b].getTransformedPoints(a,this.bends);return d};
THREE.Shape.prototype.getSpacedPointsHoles=function(a){var b,c=this.holes.length,d=[];for(b=0;b<c;b++)d[b]=this.holes[b].getTransformedSpacedPoints(a,this.bends);return d};THREE.Shape.prototype.extractAllPoints=function(a){return{shape:this.getTransformedPoints(a),holes:this.getPointsHoles(a)}};THREE.Shape.prototype.extractPoints=function(a){return this.useSpacedPoints?this.extractAllSpacedPoints(a):this.extractAllPoints(a)};
THREE.Shape.prototype.extractAllSpacedPoints=function(a){return{shape:this.getTransformedSpacedPoints(a),holes:this.getSpacedPointsHoles(a)}};
THREE.Shape.Utils={triangulateShape:function(a,b){function c(a,b,c){return a.x!=b.x?a.x<b.x?a.x<=c.x&&c.x<=b.x:b.x<=c.x&&c.x<=a.x:a.y<b.y?a.y<=c.y&&c.y<=b.y:b.y<=c.y&&c.y<=a.y}function d(a,b,d,e,f){var g=b.x-a.x,h=b.y-a.y,k=e.x-d.x,l=e.y-d.y,n=a.x-d.x,q=a.y-d.y,J=h*k-g*l,B=h*n-g*q;if(1E-10<Math.abs(J)){if(0<J){if(0>B||B>J)return[];k=l*n-k*q;if(0>k||k>J)return[]}else{if(0<B||B<J)return[];k=l*n-k*q;if(0<k||k<J)return[]}if(0==k)return!f||0!=B&&B!=J?[a]:[];if(k==J)return!f||0!=B&&B!=J?[b]:[];if(0==B)return[d];
if(B==J)return[e];f=k/J;return[{x:a.x+f*g,y:a.y+f*h}]}if(0!=B||l*n!=k*q)return[];h=0==g&&0==h;k=0==k&&0==l;if(h&&k)return a.x!=d.x||a.y!=d.y?[]:[a];if(h)return c(d,e,a)?[a]:[];if(k)return c(a,b,d)?[d]:[];0!=g?(a.x<b.x?(g=a,k=a.x,h=b,a=b.x):(g=b,k=b.x,h=a,a=a.x),d.x<e.x?(b=d,J=d.x,l=e,d=e.x):(b=e,J=e.x,l=d,d=d.x)):(a.y<b.y?(g=a,k=a.y,h=b,a=b.y):(g=b,k=b.y,h=a,a=a.y),d.y<e.y?(b=d,J=d.y,l=e,d=e.y):(b=e,J=e.y,l=d,d=d.y));return k<=J?a<J?[]:a==J?f?[]:[b]:a<=d?[b,h]:[b,l]:k>d?[]:k==d?f?[]:[g]:a<=d?[g,h]:
[g,l]}function e(a,b,c,d){var e=b.x-a.x,f=b.y-a.y;b=c.x-a.x;c=c.y-a.y;var g=d.x-a.x;d=d.y-a.y;a=e*c-f*b;e=e*d-f*g;return 1E-10<Math.abs(a)?(b=g*c-d*b,0<a?0<=e&&0<=b:0<=e||0<=b):0<e}var f,g,h,k,l,n={};h=a.concat();f=0;for(g=b.length;f<g;f++)Array.prototype.push.apply(h,b[f]);f=0;for(g=h.length;f<g;f++)l=h[f].x+":"+h[f].y,void 0!==n[l]&&console.log("Duplicate point",l),n[l]=f;f=function(a,b){function c(a,b){var d=h.length-1,f=a-1;0>f&&(f=d);var g=a+1;g>d&&(g=0);d=e(h[a],h[f],h[g],k[b]);if(!d)return!1;
d=k.length-1;f=b-1;0>f&&(f=d);g=b+1;g>d&&(g=0);return(d=e(k[b],k[f],k[g],h[a]))?!0:!1}function f(a,b){var c,e;for(c=0;c<h.length;c++)if(e=c+1,e%=h.length,e=d(a,b,h[c],h[e],!0),0<e.length)return!0;return!1}function g(a,c){var e,f,h,k;for(e=0;e<l.length;e++)for(f=b[l[e]],h=0;h<f.length;h++)if(k=h+1,k%=f.length,k=d(a,c,f[h],f[k],!0),0<k.length)return!0;return!1}var h=a.concat(),k,l=[],n,q,N,J,B,K=[],A,G,D,C=0;for(n=b.length;C<n;C++)l.push(C);A=0;for(var F=2*l.length;0<l.length;){F--;if(0>F){console.log("Infinite Loop! Holes left:"+
l.length+", Probably Hole outside Shape!");break}for(q=A;q<h.length;q++){N=h[q];n=-1;for(C=0;C<l.length;C++)if(J=l[C],B=N.x+":"+N.y+":"+J,void 0===K[B]){k=b[J];for(G=0;G<k.length;G++)if(J=k[G],c(q,G)&&!f(N,J)&&!g(N,J)){n=G;l.splice(C,1);A=h.slice(0,q+1);J=h.slice(q);G=k.slice(n);D=k.slice(0,n+1);h=A.concat(G).concat(D).concat(J);A=q;break}if(0<=n)break;K[B]=!0}if(0<=n)break}}return h}(a,b);var q=THREE.FontUtils.Triangulate(f,!1);f=0;for(g=q.length;f<g;f++)for(k=q[f],h=0;3>h;h++)l=k[h].x+":"+k[h].y,
l=n[l],void 0!==l&&(k[h]=l);return q.concat()},isClockWise:function(a){return 0>THREE.FontUtils.Triangulate.area(a)},b2p0:function(a,b){var c=1-a;return c*c*b},b2p1:function(a,b){return 2*(1-a)*a*b},b2p2:function(a,b){return a*a*b},b2:function(a,b,c,d){return this.b2p0(a,b)+this.b2p1(a,c)+this.b2p2(a,d)},b3p0:function(a,b){var c=1-a;return c*c*c*b},b3p1:function(a,b){var c=1-a;return 3*c*c*a*b},b3p2:function(a,b){return 3*(1-a)*a*a*b},b3p3:function(a,b){return a*a*a*b},b3:function(a,b,c,d,e){return this.b3p0(a,
b)+this.b3p1(a,c)+this.b3p2(a,d)+this.b3p3(a,e)}};THREE.LineCurve=function(a,b){this.v1=a;this.v2=b};THREE.LineCurve.prototype=Object.create(THREE.Curve.prototype);THREE.LineCurve.prototype.getPoint=function(a){var b=this.v2.clone().sub(this.v1);b.multiplyScalar(a).add(this.v1);return b};THREE.LineCurve.prototype.getPointAt=function(a){return this.getPoint(a)};THREE.LineCurve.prototype.getTangent=function(a){return this.v2.clone().sub(this.v1).normalize()};THREE.QuadraticBezierCurve=function(a,b,c){this.v0=a;this.v1=b;this.v2=c};THREE.QuadraticBezierCurve.prototype=Object.create(THREE.Curve.prototype);THREE.QuadraticBezierCurve.prototype.getPoint=function(a){var b;b=THREE.Shape.Utils.b2(a,this.v0.x,this.v1.x,this.v2.x);a=THREE.Shape.Utils.b2(a,this.v0.y,this.v1.y,this.v2.y);return new THREE.Vector2(b,a)};
THREE.QuadraticBezierCurve.prototype.getTangent=function(a){var b;b=THREE.Curve.Utils.tangentQuadraticBezier(a,this.v0.x,this.v1.x,this.v2.x);a=THREE.Curve.Utils.tangentQuadraticBezier(a,this.v0.y,this.v1.y,this.v2.y);b=new THREE.Vector2(b,a);b.normalize();return b};THREE.CubicBezierCurve=function(a,b,c,d){this.v0=a;this.v1=b;this.v2=c;this.v3=d};THREE.CubicBezierCurve.prototype=Object.create(THREE.Curve.prototype);THREE.CubicBezierCurve.prototype.getPoint=function(a){var b;b=THREE.Shape.Utils.b3(a,this.v0.x,this.v1.x,this.v2.x,this.v3.x);a=THREE.Shape.Utils.b3(a,this.v0.y,this.v1.y,this.v2.y,this.v3.y);return new THREE.Vector2(b,a)};
THREE.CubicBezierCurve.prototype.getTangent=function(a){var b;b=THREE.Curve.Utils.tangentCubicBezier(a,this.v0.x,this.v1.x,this.v2.x,this.v3.x);a=THREE.Curve.Utils.tangentCubicBezier(a,this.v0.y,this.v1.y,this.v2.y,this.v3.y);b=new THREE.Vector2(b,a);b.normalize();return b};THREE.SplineCurve=function(a){this.points=void 0==a?[]:a};THREE.SplineCurve.prototype=Object.create(THREE.Curve.prototype);THREE.SplineCurve.prototype.getPoint=function(a){var b=new THREE.Vector2,c=[],d=this.points,e;e=(d.length-1)*a;a=Math.floor(e);e-=a;c[0]=0==a?a:a-1;c[1]=a;c[2]=a>d.length-2?d.length-1:a+1;c[3]=a>d.length-3?d.length-1:a+2;b.x=THREE.Curve.Utils.interpolate(d[c[0]].x,d[c[1]].x,d[c[2]].x,d[c[3]].x,e);b.y=THREE.Curve.Utils.interpolate(d[c[0]].y,d[c[1]].y,d[c[2]].y,d[c[3]].y,e);return b};THREE.EllipseCurve=function(a,b,c,d,e,f,g){this.aX=a;this.aY=b;this.xRadius=c;this.yRadius=d;this.aStartAngle=e;this.aEndAngle=f;this.aClockwise=g};THREE.EllipseCurve.prototype=Object.create(THREE.Curve.prototype);
THREE.EllipseCurve.prototype.getPoint=function(a){var b;b=this.aEndAngle-this.aStartAngle;0>b&&(b+=2*Math.PI);b>2*Math.PI&&(b-=2*Math.PI);b=!0===this.aClockwise?this.aEndAngle+(1-a)*(2*Math.PI-b):this.aStartAngle+a*b;a=this.aX+this.xRadius*Math.cos(b);b=this.aY+this.yRadius*Math.sin(b);return new THREE.Vector2(a,b)};THREE.ArcCurve=function(a,b,c,d,e,f){THREE.EllipseCurve.call(this,a,b,c,c,d,e,f)};THREE.ArcCurve.prototype=Object.create(THREE.EllipseCurve.prototype);THREE.LineCurve3=THREE.Curve.create(function(a,b){this.v1=a;this.v2=b},function(a){var b=new THREE.Vector3;b.subVectors(this.v2,this.v1);b.multiplyScalar(a);b.add(this.v1);return b});THREE.QuadraticBezierCurve3=THREE.Curve.create(function(a,b,c){this.v0=a;this.v1=b;this.v2=c},function(a){var b,c;b=THREE.Shape.Utils.b2(a,this.v0.x,this.v1.x,this.v2.x);c=THREE.Shape.Utils.b2(a,this.v0.y,this.v1.y,this.v2.y);a=THREE.Shape.Utils.b2(a,this.v0.z,this.v1.z,this.v2.z);return new THREE.Vector3(b,c,a)});THREE.CubicBezierCurve3=THREE.Curve.create(function(a,b,c,d){this.v0=a;this.v1=b;this.v2=c;this.v3=d},function(a){var b,c;b=THREE.Shape.Utils.b3(a,this.v0.x,this.v1.x,this.v2.x,this.v3.x);c=THREE.Shape.Utils.b3(a,this.v0.y,this.v1.y,this.v2.y,this.v3.y);a=THREE.Shape.Utils.b3(a,this.v0.z,this.v1.z,this.v2.z,this.v3.z);return new THREE.Vector3(b,c,a)});THREE.SplineCurve3=THREE.Curve.create(function(a){this.points=void 0==a?[]:a},function(a){var b=new THREE.Vector3,c=[],d=this.points,e;a*=d.length-1;e=Math.floor(a);a-=e;c[0]=0==e?e:e-1;c[1]=e;c[2]=e>d.length-2?d.length-1:e+1;c[3]=e>d.length-3?d.length-1:e+2;e=d[c[0]];var f=d[c[1]],g=d[c[2]],c=d[c[3]];b.x=THREE.Curve.Utils.interpolate(e.x,f.x,g.x,c.x,a);b.y=THREE.Curve.Utils.interpolate(e.y,f.y,g.y,c.y,a);b.z=THREE.Curve.Utils.interpolate(e.z,f.z,g.z,c.z,a);return b});THREE.ClosedSplineCurve3=THREE.Curve.create(function(a){this.points=void 0==a?[]:a},function(a){var b=new THREE.Vector3,c=[],d=this.points,e;e=(d.length-0)*a;a=Math.floor(e);e-=a;a+=0<a?0:(Math.floor(Math.abs(a)/d.length)+1)*d.length;c[0]=(a-1)%d.length;c[1]=a%d.length;c[2]=(a+1)%d.length;c[3]=(a+2)%d.length;b.x=THREE.Curve.Utils.interpolate(d[c[0]].x,d[c[1]].x,d[c[2]].x,d[c[3]].x,e);b.y=THREE.Curve.Utils.interpolate(d[c[0]].y,d[c[1]].y,d[c[2]].y,d[c[3]].y,e);b.z=THREE.Curve.Utils.interpolate(d[c[0]].z,
d[c[1]].z,d[c[2]].z,d[c[3]].z,e);return b});THREE.AnimationHandler=function(){var a=[],b={},c={update:function(b){for(var c=0;c<a.length;c++)a[c].update(b)},addToUpdate:function(b){-1===a.indexOf(b)&&a.push(b)},removeFromUpdate:function(b){b=a.indexOf(b);-1!==b&&a.splice(b,1)},add:function(a){void 0!==b[a.name]&&console.log("THREE.AnimationHandler.add: Warning! "+a.name+" already exists in library. Overwriting.");b[a.name]=a;if(!0!==a.initialized){for(var c=0;c<a.hierarchy.length;c++){for(var d=0;d<a.hierarchy[c].keys.length;d++)if(0>a.hierarchy[c].keys[d].time&&
(a.hierarchy[c].keys[d].time=0),void 0!==a.hierarchy[c].keys[d].rot&&!(a.hierarchy[c].keys[d].rot instanceof THREE.Quaternion)){var h=a.hierarchy[c].keys[d].rot;a.hierarchy[c].keys[d].rot=(new THREE.Quaternion).fromArray(h)}if(a.hierarchy[c].keys.length&&void 0!==a.hierarchy[c].keys[0].morphTargets){h={};for(d=0;d<a.hierarchy[c].keys.length;d++)for(var k=0;k<a.hierarchy[c].keys[d].morphTargets.length;k++){var l=a.hierarchy[c].keys[d].morphTargets[k];h[l]=-1}a.hierarchy[c].usedMorphTargets=h;for(d=
0;d<a.hierarchy[c].keys.length;d++){var n={};for(l in h){for(k=0;k<a.hierarchy[c].keys[d].morphTargets.length;k++)if(a.hierarchy[c].keys[d].morphTargets[k]===l){n[l]=a.hierarchy[c].keys[d].morphTargetsInfluences[k];break}k===a.hierarchy[c].keys[d].morphTargets.length&&(n[l]=0)}a.hierarchy[c].keys[d].morphTargetsInfluences=n}}for(d=1;d<a.hierarchy[c].keys.length;d++)a.hierarchy[c].keys[d].time===a.hierarchy[c].keys[d-1].time&&(a.hierarchy[c].keys.splice(d,1),d--);for(d=0;d<a.hierarchy[c].keys.length;d++)a.hierarchy[c].keys[d].index=
d}a.initialized=!0}},remove:function(a){void 0===b[a]&&console.log("THREE.AnimationHandler.add: Warning! "+a+" doesn't exists in library. Doing nothing.");b[a]=void 0},get:function(a){if("string"===typeof a)return b[a]?b[a]:null},parse:function(a){var b=[];if(a instanceof THREE.SkinnedMesh)for(var c=0;c<a.skeleton.bones.length;c++)b.push(a.skeleton.bones[c]);else d(a,b);return b}},d=function(a,b){b.push(a);for(var c=0;c<a.children.length;c++)d(a.children[c],b)};c.LINEAR=0;c.CATMULLROM=1;c.CATMULLROM_FORWARD=
2;return c}();THREE.Animation=function(a,b){this.root=a;this.data=THREE.AnimationHandler.get(b);this.hierarchy=THREE.AnimationHandler.parse(a);this.currentTime=0;this.timeScale=1;this.isPlaying=!1;this.loop=this.isPaused=!0;this.weight=0;this.interpolationType=THREE.AnimationHandler.LINEAR};THREE.Animation.prototype.keyTypes=["pos","rot","scl"];THREE.Animation.prototype.play=function(a,b){this.currentTime=void 0!==a?a:0;this.weight=void 0!==b?b:1;this.isPlaying=!0;this.isPaused=!1;this.reset();THREE.AnimationHandler.addToUpdate(this)};
THREE.Animation.prototype.pause=function(){!0===this.isPaused?THREE.AnimationHandler.addToUpdate(this):THREE.AnimationHandler.removeFromUpdate(this);this.isPaused=!this.isPaused};THREE.Animation.prototype.stop=function(){this.isPaused=this.isPlaying=!1;THREE.AnimationHandler.removeFromUpdate(this)};
THREE.Animation.prototype.reset=function(){for(var a=0,b=this.hierarchy.length;a<b;a++){var c=this.hierarchy[a];c.matrixAutoUpdate=!0;void 0===c.animationCache&&(c.animationCache={});void 0===c.animationCache[this.data.name]&&(c.animationCache[this.data.name]={},c.animationCache[this.data.name].prevKey={pos:0,rot:0,scl:0},c.animationCache[this.data.name].nextKey={pos:0,rot:0,scl:0},c.animationCache[this.data.name].originalMatrix=c instanceof THREE.Bone?c.skinMatrix:c.matrix);for(var c=c.animationCache[this.data.name],
d=0;3>d;d++){for(var e=this.keyTypes[d],f=this.data.hierarchy[a].keys[0],g=this.getNextKeyWith(e,a,1);g.time<this.currentTime&&g.index>f.index;)f=g,g=this.getNextKeyWith(e,a,g.index+1);c.prevKey[e]=f;c.nextKey[e]=g}}};
THREE.Animation.prototype.update=function(){var a=[],b=new THREE.Vector3,c=new THREE.Vector3,d=new THREE.Quaternion,e=function(a,b){var c=[],d=[],e,q,p,s,t,r;e=(a.length-1)*b;q=Math.floor(e);e-=q;c[0]=0===q?q:q-1;c[1]=q;c[2]=q>a.length-2?q:q+1;c[3]=q>a.length-3?q:q+2;q=a[c[0]];s=a[c[1]];t=a[c[2]];r=a[c[3]];c=e*e;p=e*c;d[0]=f(q[0],s[0],t[0],r[0],e,c,p);d[1]=f(q[1],s[1],t[1],r[1],e,c,p);d[2]=f(q[2],s[2],t[2],r[2],e,c,p);return d},f=function(a,b,c,d,e,f,p){a=0.5*(c-a);d=0.5*(d-b);return(2*(b-c)+a+d)*
p+(-3*(b-c)-2*a-d)*f+a*e+b};return function(f){if(!1!==this.isPlaying&&(this.currentTime+=f*this.timeScale,0!==this.weight)){var h;f=this.data.length;if(!0===this.loop&&this.currentTime>f)this.currentTime%=f,this.reset();else if(!1===this.loop&&this.currentTime>f){this.stop();return}f=0;for(var k=this.hierarchy.length;f<k;f++)for(var l=this.hierarchy[f],n=l.animationCache[this.data.name],q=0;3>q;q++){h=this.keyTypes[q];var p=n.prevKey[h],s=n.nextKey[h];if(s.time<=this.currentTime){p=this.data.hierarchy[f].keys[0];
for(s=this.getNextKeyWith(h,f,1);s.time<this.currentTime&&s.index>p.index;)p=s,s=this.getNextKeyWith(h,f,s.index+1);n.prevKey[h]=p;n.nextKey[h]=s}l.matrixAutoUpdate=!0;l.matrixWorldNeedsUpdate=!0;var t=(this.currentTime-p.time)/(s.time-p.time),r=p[h],v=s[h];0>t&&(t=0);1<t&&(t=1);if("pos"===h)if(h=l.position,this.interpolationType===THREE.AnimationHandler.LINEAR)c.x=r[0]+(v[0]-r[0])*t,c.y=r[1]+(v[1]-r[1])*t,c.z=r[2]+(v[2]-r[2])*t,l instanceof THREE.Bone&&(p=this.weight/(this.weight+l.accumulatedPosWeight),
h.lerp(c,p),l.accumulatedPosWeight+=this.weight);else{if(this.interpolationType===THREE.AnimationHandler.CATMULLROM||this.interpolationType===THREE.AnimationHandler.CATMULLROM_FORWARD)a[0]=this.getPrevKeyWith("pos",f,p.index-1).pos,a[1]=r,a[2]=v,a[3]=this.getNextKeyWith("pos",f,s.index+1).pos,t=0.33*t+0.33,s=e(a,t),l instanceof THREE.Bone?(p=this.weight/(this.weight+l.accumulatedPosWeight),l.accumulatedPosWeight+=this.weight):p=1,h.x+=(s[0]-h.x)*p,h.y+=(s[1]-h.y)*p,h.z+=(s[2]-h.z)*p,this.interpolationType===
THREE.AnimationHandler.CATMULLROM_FORWARD&&(t=e(a,1.01*t),b.set(t[0],t[1],t[2]),b.sub(h),b.y=0,b.normalize(),h=Math.atan2(b.x,b.z),l.rotation.set(0,h,0))}else"rot"===h?(THREE.Quaternion.slerp(r,v,d,t),l instanceof THREE.Bone?0===l.accumulatedRotWeight?(l.quaternion.copy(d),l.accumulatedRotWeight=this.weight):(p=this.weight/(this.weight+l.accumulatedRotWeight),THREE.Quaternion.slerp(l.quaternion,d,l.quaternion,p),l.accumulatedRotWeight+=this.weight):l.quaternion.copy(d)):"scl"===h&&(h=l.scale,c.x=
r[0]+(v[0]-r[0])*t,c.y=r[1]+(v[1]-r[1])*t,c.z=r[2]+(v[2]-r[2])*t,l instanceof THREE.Bone&&(p=this.weight/(this.weight+l.accumulatedSclWeight),h.lerp(c,p),l.accumulatedSclWeight+=this.weight))}return!0}}}();
THREE.Animation.prototype.getNextKeyWith=function(a,b,c){var d=this.data.hierarchy[b].keys;for(c=this.interpolationType===THREE.AnimationHandler.CATMULLROM||this.interpolationType===THREE.AnimationHandler.CATMULLROM_FORWARD?c<d.length-1?c:d.length-1:c%d.length;c<d.length;c++)if(void 0!==d[c][a])return d[c];return this.data.hierarchy[b].keys[0]};
THREE.Animation.prototype.getPrevKeyWith=function(a,b,c){var d=this.data.hierarchy[b].keys;for(c=this.interpolationType===THREE.AnimationHandler.CATMULLROM||this.interpolationType===THREE.AnimationHandler.CATMULLROM_FORWARD?0<c?c:0:0<=c?c:c+d.length;0<=c;c--)if(void 0!==d[c][a])return d[c];return this.data.hierarchy[b].keys[d.length-1]};THREE.KeyFrameAnimation=function(a,b){this.root=a;this.data=THREE.AnimationHandler.get(b);this.hierarchy=THREE.AnimationHandler.parse(a);this.currentTime=0;this.timeScale=0.001;this.isPlaying=!1;this.loop=this.isPaused=!0;for(var c=0,d=this.hierarchy.length;c<d;c++){var e=this.data.hierarchy[c].sids,f=this.hierarchy[c];if(this.data.hierarchy[c].keys.length&&e){for(var g=0;g<e.length;g++){var h=e[g],k=this.getNextKeyWith(h,c,0);k&&k.apply(h)}f.matrixAutoUpdate=!1;this.data.hierarchy[c].node.updateMatrix();
f.matrixWorldNeedsUpdate=!0}}};
THREE.KeyFrameAnimation.prototype.play=function(a){this.currentTime=void 0!==a?a:0;if(!1===this.isPlaying){this.isPlaying=!0;var b=this.hierarchy.length,c,d;for(a=0;a<b;a++)c=this.hierarchy[a],d=this.data.hierarchy[a],void 0===d.animationCache&&(d.animationCache={},d.animationCache.prevKey=null,d.animationCache.nextKey=null,d.animationCache.originalMatrix=c instanceof THREE.Bone?c.skinMatrix:c.matrix),c=this.data.hierarchy[a].keys,c.length&&(d.animationCache.prevKey=c[0],d.animationCache.nextKey=
c[1],this.startTime=Math.min(c[0].time,this.startTime),this.endTime=Math.max(c[c.length-1].time,this.endTime));this.update(0)}this.isPaused=!1;THREE.AnimationHandler.addToUpdate(this)};THREE.KeyFrameAnimation.prototype.pause=function(){this.isPaused?THREE.AnimationHandler.addToUpdate(this):THREE.AnimationHandler.removeFromUpdate(this);this.isPaused=!this.isPaused};
THREE.KeyFrameAnimation.prototype.stop=function(){this.isPaused=this.isPlaying=!1;THREE.AnimationHandler.removeFromUpdate(this);for(var a=0;a<this.data.hierarchy.length;a++){var b=this.hierarchy[a],c=this.data.hierarchy[a];if(void 0!==c.animationCache){var d=c.animationCache.originalMatrix;b instanceof THREE.Bone?(d.copy(b.skinMatrix),b.skinMatrix=d):(d.copy(b.matrix),b.matrix=d);delete c.animationCache}}};
THREE.KeyFrameAnimation.prototype.update=function(a){if(!1!==this.isPlaying){this.currentTime+=a*this.timeScale;a=this.data.length;!0===this.loop&&this.currentTime>a&&(this.currentTime%=a);this.currentTime=Math.min(this.currentTime,a);a=0;for(var b=this.hierarchy.length;a<b;a++){var c=this.hierarchy[a],d=this.data.hierarchy[a],e=d.keys,d=d.animationCache;if(e.length){var f=d.prevKey,g=d.nextKey;if(g.time<=this.currentTime){for(;g.time<this.currentTime&&g.index>f.index;)f=g,g=e[f.index+1];d.prevKey=
f;d.nextKey=g}g.time>=this.currentTime?f.interpolate(g,this.currentTime):f.interpolate(g,g.time);this.data.hierarchy[a].node.updateMatrix();c.matrixWorldNeedsUpdate=!0}}}};THREE.KeyFrameAnimation.prototype.getNextKeyWith=function(a,b,c){b=this.data.hierarchy[b].keys;for(c%=b.length;c<b.length;c++)if(b[c].hasTarget(a))return b[c];return b[0]};
THREE.KeyFrameAnimation.prototype.getPrevKeyWith=function(a,b,c){b=this.data.hierarchy[b].keys;for(c=0<=c?c:c+b.length;0<=c;c--)if(b[c].hasTarget(a))return b[c];return b[b.length-1]};THREE.MorphAnimation=function(a){this.mesh=a;this.frames=a.morphTargetInfluences.length;this.currentTime=0;this.duration=1E3;this.loop=!0;this.isPlaying=!1};
THREE.MorphAnimation.prototype={play:function(){this.isPlaying=!0},pause:function(){this.isPlaying=!1},update:function(){var a=0,b=0;return function(c){if(!1!==this.isPlaying){this.currentTime+=c;!0===this.loop&&this.currentTime>this.duration&&(this.currentTime%=this.duration);this.currentTime=Math.min(this.currentTime,this.duration);c=this.duration/this.frames;var d=Math.floor(this.currentTime/c);d!=b&&(this.mesh.morphTargetInfluences[a]=0,this.mesh.morphTargetInfluences[b]=1,this.mesh.morphTargetInfluences[d]=
0,a=b,b=d);this.mesh.morphTargetInfluences[d]=this.currentTime%c/c;this.mesh.morphTargetInfluences[a]=1-this.mesh.morphTargetInfluences[d]}}}()};THREE.CubeCamera=function(a,b,c){THREE.Object3D.call(this);var d=new THREE.PerspectiveCamera(90,1,a,b);d.up.set(0,-1,0);d.lookAt(new THREE.Vector3(1,0,0));this.add(d);var e=new THREE.PerspectiveCamera(90,1,a,b);e.up.set(0,-1,0);e.lookAt(new THREE.Vector3(-1,0,0));this.add(e);var f=new THREE.PerspectiveCamera(90,1,a,b);f.up.set(0,0,1);f.lookAt(new THREE.Vector3(0,1,0));this.add(f);var g=new THREE.PerspectiveCamera(90,1,a,b);g.up.set(0,0,-1);g.lookAt(new THREE.Vector3(0,-1,0));this.add(g);var h=new THREE.PerspectiveCamera(90,
1,a,b);h.up.set(0,-1,0);h.lookAt(new THREE.Vector3(0,0,1));this.add(h);var k=new THREE.PerspectiveCamera(90,1,a,b);k.up.set(0,-1,0);k.lookAt(new THREE.Vector3(0,0,-1));this.add(k);this.renderTarget=new THREE.WebGLRenderTargetCube(c,c,{format:THREE.RGBFormat,magFilter:THREE.LinearFilter,minFilter:THREE.LinearFilter});this.updateCubeMap=function(a,b){var c=this.renderTarget,p=c.generateMipmaps;c.generateMipmaps=!1;c.activeCubeFace=0;a.render(b,d,c);c.activeCubeFace=1;a.render(b,e,c);c.activeCubeFace=
2;a.render(b,f,c);c.activeCubeFace=3;a.render(b,g,c);c.activeCubeFace=4;a.render(b,h,c);c.generateMipmaps=p;c.activeCubeFace=5;a.render(b,k,c)}};THREE.CubeCamera.prototype=Object.create(THREE.Object3D.prototype);THREE.CombinedCamera=function(a,b,c,d,e,f,g){THREE.Camera.call(this);this.fov=c;this.left=-a/2;this.right=a/2;this.top=b/2;this.bottom=-b/2;this.cameraO=new THREE.OrthographicCamera(a/-2,a/2,b/2,b/-2,f,g);this.cameraP=new THREE.PerspectiveCamera(c,a/b,d,e);this.zoom=1;this.toPerspective()};THREE.CombinedCamera.prototype=Object.create(THREE.Camera.prototype);
THREE.CombinedCamera.prototype.toPerspective=function(){this.near=this.cameraP.near;this.far=this.cameraP.far;this.cameraP.fov=this.fov/this.zoom;this.cameraP.updateProjectionMatrix();this.projectionMatrix=this.cameraP.projectionMatrix;this.inPerspectiveMode=!0;this.inOrthographicMode=!1};
THREE.CombinedCamera.prototype.toOrthographic=function(){var a=this.cameraP.aspect,b=(this.cameraP.near+this.cameraP.far)/2,b=Math.tan(this.fov/2)*b,a=2*b*a/2,b=b/this.zoom,a=a/this.zoom;this.cameraO.left=-a;this.cameraO.right=a;this.cameraO.top=b;this.cameraO.bottom=-b;this.cameraO.updateProjectionMatrix();this.near=this.cameraO.near;this.far=this.cameraO.far;this.projectionMatrix=this.cameraO.projectionMatrix;this.inPerspectiveMode=!1;this.inOrthographicMode=!0};
THREE.CombinedCamera.prototype.setSize=function(a,b){this.cameraP.aspect=a/b;this.left=-a/2;this.right=a/2;this.top=b/2;this.bottom=-b/2};THREE.CombinedCamera.prototype.setFov=function(a){this.fov=a;this.inPerspectiveMode?this.toPerspective():this.toOrthographic()};THREE.CombinedCamera.prototype.updateProjectionMatrix=function(){this.inPerspectiveMode?this.toPerspective():(this.toPerspective(),this.toOrthographic())};
THREE.CombinedCamera.prototype.setLens=function(a,b){void 0===b&&(b=24);var c=2*THREE.Math.radToDeg(Math.atan(b/(2*a)));this.setFov(c);return c};THREE.CombinedCamera.prototype.setZoom=function(a){this.zoom=a;this.inPerspectiveMode?this.toPerspective():this.toOrthographic()};THREE.CombinedCamera.prototype.toFrontView=function(){this.rotation.x=0;this.rotation.y=0;this.rotation.z=0;this.rotationAutoUpdate=!1};
THREE.CombinedCamera.prototype.toBackView=function(){this.rotation.x=0;this.rotation.y=Math.PI;this.rotation.z=0;this.rotationAutoUpdate=!1};THREE.CombinedCamera.prototype.toLeftView=function(){this.rotation.x=0;this.rotation.y=-Math.PI/2;this.rotation.z=0;this.rotationAutoUpdate=!1};THREE.CombinedCamera.prototype.toRightView=function(){this.rotation.x=0;this.rotation.y=Math.PI/2;this.rotation.z=0;this.rotationAutoUpdate=!1};
THREE.CombinedCamera.prototype.toTopView=function(){this.rotation.x=-Math.PI/2;this.rotation.y=0;this.rotation.z=0;this.rotationAutoUpdate=!1};THREE.CombinedCamera.prototype.toBottomView=function(){this.rotation.x=Math.PI/2;this.rotation.y=0;this.rotation.z=0;this.rotationAutoUpdate=!1};THREE.BoxGeometry=function(a,b,c,d,e,f){function g(a,b,c,d,e,f,g,r){var v,w=h.widthSegments,u=h.heightSegments,y=e/2,L=f/2,x=h.vertices.length;if("x"===a&&"y"===b||"y"===a&&"x"===b)v="z";else if("x"===a&&"z"===b||"z"===a&&"x"===b)v="y",u=h.depthSegments;else if("z"===a&&"y"===b||"y"===a&&"z"===b)v="x",w=h.depthSegments;var N=w+1,J=u+1,B=e/w,K=f/u,A=new THREE.Vector3;A[v]=0<g?1:-1;for(e=0;e<J;e++)for(f=0;f<N;f++){var G=new THREE.Vector3;G[a]=(f*B-y)*c;G[b]=(e*K-L)*d;G[v]=g;h.vertices.push(G)}for(e=
0;e<u;e++)for(f=0;f<w;f++)L=f+N*e,a=f+N*(e+1),b=f+1+N*(e+1),c=f+1+N*e,d=new THREE.Vector2(f/w,1-e/u),g=new THREE.Vector2(f/w,1-(e+1)/u),v=new THREE.Vector2((f+1)/w,1-(e+1)/u),y=new THREE.Vector2((f+1)/w,1-e/u),L=new THREE.Face3(L+x,a+x,c+x),L.normal.copy(A),L.vertexNormals.push(A.clone(),A.clone(),A.clone()),L.materialIndex=r,h.faces.push(L),h.faceVertexUvs[0].push([d,g,y]),L=new THREE.Face3(a+x,b+x,c+x),L.normal.copy(A),L.vertexNormals.push(A.clone(),A.clone(),A.clone()),L.materialIndex=r,h.faces.push(L),
h.faceVertexUvs[0].push([g.clone(),v,y.clone()])}THREE.Geometry.call(this);this.parameters={width:a,height:b,depth:c,widthSegments:d,heightSegments:e,depthSegments:f};this.widthSegments=d||1;this.heightSegments=e||1;this.depthSegments=f||1;var h=this;d=a/2;e=b/2;f=c/2;g("z","y",-1,-1,c,b,d,0);g("z","y",1,-1,c,b,-d,1);g("x","z",1,1,a,c,e,2);g("x","z",1,-1,a,c,-e,3);g("x","y",1,-1,a,b,f,4);g("x","y",-1,-1,a,b,-f,5);this.mergeVertices()};THREE.BoxGeometry.prototype=Object.create(THREE.Geometry.prototype);THREE.CircleGeometry=function(a,b,c,d){THREE.Geometry.call(this);this.parameters={radius:a,segments:b,thetaStart:c,thetaLength:d};a=a||50;b=void 0!==b?Math.max(3,b):8;c=void 0!==c?c:0;d=void 0!==d?d:2*Math.PI;var e,f=[];e=new THREE.Vector3;var g=new THREE.Vector2(0.5,0.5);this.vertices.push(e);f.push(g);for(e=0;e<=b;e++){var h=new THREE.Vector3,k=c+e/b*d;h.x=a*Math.cos(k);h.y=a*Math.sin(k);this.vertices.push(h);f.push(new THREE.Vector2((h.x/a+1)/2,(h.y/a+1)/2))}c=new THREE.Vector3(0,0,1);for(e=1;e<=
b;e++)this.faces.push(new THREE.Face3(e,e+1,0,[c.clone(),c.clone(),c.clone()])),this.faceVertexUvs[0].push([f[e].clone(),f[e+1].clone(),g.clone()]);this.computeFaceNormals();this.boundingSphere=new THREE.Sphere(new THREE.Vector3,a)};THREE.CircleGeometry.prototype=Object.create(THREE.Geometry.prototype);THREE.CubeGeometry=function(a,b,c,d,e,f){console.warn("DEPRECATED: THREE.CubeGeometry is deprecated. Use THREE.BoxGeometry instead.");return new THREE.BoxGeometry(a,b,c,d,e,f)};THREE.CylinderGeometry=function(a,b,c,d,e,f){THREE.Geometry.call(this);this.parameters={radiusTop:a,radiusBottom:b,height:c,radialSegments:d,heightSegments:e,openEnded:f};a=void 0!==a?a:20;b=void 0!==b?b:20;c=void 0!==c?c:100;d=d||8;e=e||1;f=void 0!==f?f:!1;var g=c/2,h,k,l=[],n=[];for(k=0;k<=e;k++){var q=[],p=[],s=k/e,t=s*(b-a)+a;for(h=0;h<=d;h++){var r=h/d,v=new THREE.Vector3;v.x=t*Math.sin(r*Math.PI*2);v.y=-s*c+g;v.z=t*Math.cos(r*Math.PI*2);this.vertices.push(v);q.push(this.vertices.length-1);p.push(new THREE.Vector2(r,
1-s))}l.push(q);n.push(p)}c=(b-a)/c;for(h=0;h<d;h++)for(0!==a?(q=this.vertices[l[0][h]].clone(),p=this.vertices[l[0][h+1]].clone()):(q=this.vertices[l[1][h]].clone(),p=this.vertices[l[1][h+1]].clone()),q.setY(Math.sqrt(q.x*q.x+q.z*q.z)*c).normalize(),p.setY(Math.sqrt(p.x*p.x+p.z*p.z)*c).normalize(),k=0;k<e;k++){var s=l[k][h],t=l[k+1][h],r=l[k+1][h+1],v=l[k][h+1],w=q.clone(),u=q.clone(),y=p.clone(),L=p.clone(),x=n[k][h].clone(),N=n[k+1][h].clone(),J=n[k+1][h+1].clone(),B=n[k][h+1].clone();this.faces.push(new THREE.Face3(s,
t,v,[w,u,L]));this.faceVertexUvs[0].push([x,N,B]);this.faces.push(new THREE.Face3(t,r,v,[u.clone(),y,L.clone()]));this.faceVertexUvs[0].push([N.clone(),J,B.clone()])}if(!1===f&&0<a)for(this.vertices.push(new THREE.Vector3(0,g,0)),h=0;h<d;h++)s=l[0][h],t=l[0][h+1],r=this.vertices.length-1,w=new THREE.Vector3(0,1,0),u=new THREE.Vector3(0,1,0),y=new THREE.Vector3(0,1,0),x=n[0][h].clone(),N=n[0][h+1].clone(),J=new THREE.Vector2(N.x,0),this.faces.push(new THREE.Face3(s,t,r,[w,u,y])),this.faceVertexUvs[0].push([x,
N,J]);if(!1===f&&0<b)for(this.vertices.push(new THREE.Vector3(0,-g,0)),h=0;h<d;h++)s=l[k][h+1],t=l[k][h],r=this.vertices.length-1,w=new THREE.Vector3(0,-1,0),u=new THREE.Vector3(0,-1,0),y=new THREE.Vector3(0,-1,0),x=n[k][h+1].clone(),N=n[k][h].clone(),J=new THREE.Vector2(N.x,1),this.faces.push(new THREE.Face3(s,t,r,[w,u,y])),this.faceVertexUvs[0].push([x,N,J]);this.computeFaceNormals()};THREE.CylinderGeometry.prototype=Object.create(THREE.Geometry.prototype);THREE.ExtrudeGeometry=function(a,b){"undefined"!==typeof a&&(THREE.Geometry.call(this),a=a instanceof Array?a:[a],this.shapebb=a[a.length-1].getBoundingBox(),this.addShapeList(a,b),this.computeFaceNormals())};THREE.ExtrudeGeometry.prototype=Object.create(THREE.Geometry.prototype);THREE.ExtrudeGeometry.prototype.addShapeList=function(a,b){for(var c=a.length,d=0;d<c;d++)this.addShape(a[d],b)};
THREE.ExtrudeGeometry.prototype.addShape=function(a,b){function c(a,b,c){b||console.log("die");return b.clone().multiplyScalar(c).add(a)}function d(a,b,c){var d=THREE.Math.sign,e=1,e=a.x-b.x,f=a.y-b.y,g=c.x-a.x,h=c.y-a.y,k=e*e+f*f;if(1E-10<Math.abs(e*h-f*g)){var l=Math.sqrt(k),d=Math.sqrt(g*g+h*h),k=b.x-f/l;b=b.y+e/l;g=((c.x-h/d-k)*h-(c.y+g/d-b)*g)/(e*h-f*g);c=k+e*g-a.x;a=b+f*g-a.y;e=c*c+a*a;if(2>=e)return new THREE.Vector2(c,a);e=Math.sqrt(e/2)}else a=!1,1E-10<e?1E-10<g&&(a=!0):-1E-10>e?-1E-10>g&&
(a=!0):d(f)==d(h)&&(a=!0),a?(c=-f,a=e,e=Math.sqrt(k)):(c=e,a=f,e=Math.sqrt(k/2));return new THREE.Vector2(c/e,a/e)}function e(c,d){var e,f;for(I=c.length;0<=--I;){e=I;f=I-1;0>f&&(f=c.length-1);for(var g=0,h=s+2*n,g=0;g<h;g++){var k=la*g,l=la*(g+1),p=d+e+k,k=d+f+k,q=d+f+l,l=d+e+l,r=c,t=g,w=h,v=e,A=f,p=p+D,k=k+D,q=q+D,l=l+D;G.faces.push(new THREE.Face3(p,k,l,null,null,u));G.faces.push(new THREE.Face3(k,q,l,null,null,u));p=y.generateSideWallUV(G,a,r,b,p,k,q,l,t,w,v,A);G.faceVertexUvs[0].push([p[0],p[1],
p[3]]);G.faceVertexUvs[0].push([p[1],p[2],p[3]])}}}function f(a,b,c){G.vertices.push(new THREE.Vector3(a,b,c))}function g(c,d,e,f){c+=D;d+=D;e+=D;G.faces.push(new THREE.Face3(c,d,e,null,null,w));c=f?y.generateBottomUV(G,a,b,c,d,e):y.generateTopUV(G,a,b,c,d,e);G.faceVertexUvs[0].push(c)}var h=void 0!==b.amount?b.amount:100,k=void 0!==b.bevelThickness?b.bevelThickness:6,l=void 0!==b.bevelSize?b.bevelSize:k-2,n=void 0!==b.bevelSegments?b.bevelSegments:3,q=void 0!==b.bevelEnabled?b.bevelEnabled:!0,p=
void 0!==b.curveSegments?b.curveSegments:12,s=void 0!==b.steps?b.steps:1,t=b.extrudePath,r,v=!1,w=b.material,u=b.extrudeMaterial,y=void 0!==b.UVGenerator?b.UVGenerator:THREE.ExtrudeGeometry.WorldUVGenerator,L,x,N,J;t&&(r=t.getSpacedPoints(s),v=!0,q=!1,L=void 0!==b.frames?b.frames:new THREE.TubeGeometry.FrenetFrames(t,s,!1),x=new THREE.Vector3,N=new THREE.Vector3,J=new THREE.Vector3);q||(l=k=n=0);var B,K,A,G=this,D=this.vertices.length,t=a.extractPoints(p),p=t.shape,C=t.holes;if(t=!THREE.Shape.Utils.isClockWise(p)){p=
p.reverse();K=0;for(A=C.length;K<A;K++)B=C[K],THREE.Shape.Utils.isClockWise(B)&&(C[K]=B.reverse());t=!1}var F=THREE.Shape.Utils.triangulateShape(p,C),z=p;K=0;for(A=C.length;K<A;K++)B=C[K],p=p.concat(B);var H,E,Q,Y,U,la=p.length,W,R=F.length,t=[],I=0;Q=z.length;H=Q-1;for(E=I+1;I<Q;I++,H++,E++)H===Q&&(H=0),E===Q&&(E=0),t[I]=d(z[I],z[H],z[E]);var da=[],V,X=t.concat();K=0;for(A=C.length;K<A;K++){B=C[K];V=[];I=0;Q=B.length;H=Q-1;for(E=I+1;I<Q;I++,H++,E++)H===Q&&(H=0),E===Q&&(E=0),V[I]=d(B[I],B[H],B[E]);
da.push(V);X=X.concat(V)}for(H=0;H<n;H++){Q=H/n;Y=k*(1-Q);E=l*Math.sin(Q*Math.PI/2);I=0;for(Q=z.length;I<Q;I++)U=c(z[I],t[I],E),f(U.x,U.y,-Y);K=0;for(A=C.length;K<A;K++)for(B=C[K],V=da[K],I=0,Q=B.length;I<Q;I++)U=c(B[I],V[I],E),f(U.x,U.y,-Y)}E=l;for(I=0;I<la;I++)U=q?c(p[I],X[I],E):p[I],v?(N.copy(L.normals[0]).multiplyScalar(U.x),x.copy(L.binormals[0]).multiplyScalar(U.y),J.copy(r[0]).add(N).add(x),f(J.x,J.y,J.z)):f(U.x,U.y,0);for(Q=1;Q<=s;Q++)for(I=0;I<la;I++)U=q?c(p[I],X[I],E):p[I],v?(N.copy(L.normals[Q]).multiplyScalar(U.x),
x.copy(L.binormals[Q]).multiplyScalar(U.y),J.copy(r[Q]).add(N).add(x),f(J.x,J.y,J.z)):f(U.x,U.y,h/s*Q);for(H=n-1;0<=H;H--){Q=H/n;Y=k*(1-Q);E=l*Math.sin(Q*Math.PI/2);I=0;for(Q=z.length;I<Q;I++)U=c(z[I],t[I],E),f(U.x,U.y,h+Y);K=0;for(A=C.length;K<A;K++)for(B=C[K],V=da[K],I=0,Q=B.length;I<Q;I++)U=c(B[I],V[I],E),v?f(U.x,U.y+r[s-1].y,r[s-1].x+Y):f(U.x,U.y,h+Y)}(function(){if(q){var a;a=0*la;for(I=0;I<R;I++)W=F[I],g(W[2]+a,W[1]+a,W[0]+a,!0);a=s+2*n;a*=la;for(I=0;I<R;I++)W=F[I],g(W[0]+a,W[1]+a,W[2]+a,!1)}else{for(I=
0;I<R;I++)W=F[I],g(W[2],W[1],W[0],!0);for(I=0;I<R;I++)W=F[I],g(W[0]+la*s,W[1]+la*s,W[2]+la*s,!1)}})();(function(){var a=0;e(z,a);a+=z.length;K=0;for(A=C.length;K<A;K++)B=C[K],e(B,a),a+=B.length})()};
THREE.ExtrudeGeometry.WorldUVGenerator={generateTopUV:function(a,b,c,d,e,f){b=a.vertices[e].x;e=a.vertices[e].y;c=a.vertices[f].x;f=a.vertices[f].y;return[new THREE.Vector2(a.vertices[d].x,a.vertices[d].y),new THREE.Vector2(b,e),new THREE.Vector2(c,f)]},generateBottomUV:function(a,b,c,d,e,f){return this.generateTopUV(a,b,c,d,e,f)},generateSideWallUV:function(a,b,c,d,e,f,g,h,k,l,n,q){b=a.vertices[e].x;c=a.vertices[e].y;e=a.vertices[e].z;d=a.vertices[f].x;k=a.vertices[f].y;f=a.vertices[f].z;l=a.vertices[g].x;
n=a.vertices[g].y;g=a.vertices[g].z;q=a.vertices[h].x;var p=a.vertices[h].y;a=a.vertices[h].z;return 0.01>Math.abs(c-k)?[new THREE.Vector2(b,1-e),new THREE.Vector2(d,1-f),new THREE.Vector2(l,1-g),new THREE.Vector2(q,1-a)]:[new THREE.Vector2(c,1-e),new THREE.Vector2(k,1-f),new THREE.Vector2(n,1-g),new THREE.Vector2(p,1-a)]}};THREE.ExtrudeGeometry.__v1=new THREE.Vector2;THREE.ExtrudeGeometry.__v2=new THREE.Vector2;THREE.ExtrudeGeometry.__v3=new THREE.Vector2;THREE.ExtrudeGeometry.__v4=new THREE.Vector2;
THREE.ExtrudeGeometry.__v5=new THREE.Vector2;THREE.ExtrudeGeometry.__v6=new THREE.Vector2;THREE.ShapeGeometry=function(a,b){THREE.Geometry.call(this);!1===a instanceof Array&&(a=[a]);this.shapebb=a[a.length-1].getBoundingBox();this.addShapeList(a,b);this.computeFaceNormals()};THREE.ShapeGeometry.prototype=Object.create(THREE.Geometry.prototype);THREE.ShapeGeometry.prototype.addShapeList=function(a,b){for(var c=0,d=a.length;c<d;c++)this.addShape(a[c],b);return this};
THREE.ShapeGeometry.prototype.addShape=function(a,b){void 0===b&&(b={});var c=b.material,d=void 0===b.UVGenerator?THREE.ExtrudeGeometry.WorldUVGenerator:b.UVGenerator,e,f,g,h=this.vertices.length;e=a.extractPoints(void 0!==b.curveSegments?b.curveSegments:12);var k=e.shape,l=e.holes;if(!THREE.Shape.Utils.isClockWise(k))for(k=k.reverse(),e=0,f=l.length;e<f;e++)g=l[e],THREE.Shape.Utils.isClockWise(g)&&(l[e]=g.reverse());var n=THREE.Shape.Utils.triangulateShape(k,l);e=0;for(f=l.length;e<f;e++)g=l[e],
k=k.concat(g);l=k.length;f=n.length;for(e=0;e<l;e++)g=k[e],this.vertices.push(new THREE.Vector3(g.x,g.y,0));for(e=0;e<f;e++)l=n[e],k=l[0]+h,g=l[1]+h,l=l[2]+h,this.faces.push(new THREE.Face3(k,g,l,null,null,c)),this.faceVertexUvs[0].push(d.generateBottomUV(this,a,b,k,g,l))};THREE.LatheGeometry=function(a,b,c,d){THREE.Geometry.call(this);b=b||12;c=c||0;d=d||2*Math.PI;for(var e=1/(a.length-1),f=1/b,g=0,h=b;g<=h;g++)for(var k=c+g*f*d,l=Math.cos(k),n=Math.sin(k),k=0,q=a.length;k<q;k++){var p=a[k],s=new THREE.Vector3;s.x=l*p.x-n*p.y;s.y=n*p.x+l*p.y;s.z=p.z;this.vertices.push(s)}c=a.length;g=0;for(h=b;g<h;g++)for(k=0,q=a.length-1;k<q;k++){b=n=k+c*g;d=n+c;var l=n+1+c,n=n+1,p=g*f,s=k*e,t=p+f,r=s+e;this.faces.push(new THREE.Face3(b,d,n));this.faceVertexUvs[0].push([new THREE.Vector2(p,
s),new THREE.Vector2(t,s),new THREE.Vector2(p,r)]);this.faces.push(new THREE.Face3(d,l,n));this.faceVertexUvs[0].push([new THREE.Vector2(t,s),new THREE.Vector2(t,r),new THREE.Vector2(p,r)])}this.mergeVertices();this.computeFaceNormals();this.computeVertexNormals()};THREE.LatheGeometry.prototype=Object.create(THREE.Geometry.prototype);THREE.PlaneGeometry=function(a,b,c,d){THREE.Geometry.call(this);this.parameters={width:a,height:b,widthSegments:c,heightSegments:d};var e=a/2,f=b/2;c=c||1;d=d||1;var g=c+1,h=d+1,k=a/c,l=b/d,n=new THREE.Vector3(0,0,1);for(a=0;a<h;a++){var q=a*l-f;for(b=0;b<g;b++)this.vertices.push(new THREE.Vector3(b*k-e,-q,0))}for(a=0;a<d;a++)for(b=0;b<c;b++){var p=b+g*a,e=b+g*(a+1),f=b+1+g*(a+1),h=b+1+g*a,k=new THREE.Vector2(b/c,1-a/d),l=new THREE.Vector2(b/c,1-(a+1)/d),q=new THREE.Vector2((b+1)/c,1-(a+1)/d),s=new THREE.Vector2((b+
1)/c,1-a/d),p=new THREE.Face3(p,e,h);p.normal.copy(n);p.vertexNormals.push(n.clone(),n.clone(),n.clone());this.faces.push(p);this.faceVertexUvs[0].push([k,l,s]);p=new THREE.Face3(e,f,h);p.normal.copy(n);p.vertexNormals.push(n.clone(),n.clone(),n.clone());this.faces.push(p);this.faceVertexUvs[0].push([l.clone(),q,s.clone()])}};THREE.PlaneGeometry.prototype=Object.create(THREE.Geometry.prototype);THREE.RingGeometry=function(a,b,c,d,e,f){THREE.Geometry.call(this);a=a||0;b=b||50;e=void 0!==e?e:0;f=void 0!==f?f:2*Math.PI;c=void 0!==c?Math.max(3,c):8;d=void 0!==d?Math.max(3,d):8;var g,h=[],k=a,l=(b-a)/d;for(a=0;a<=d;a++){for(g=0;g<=c;g++){var n=new THREE.Vector3,q=e+g/c*f;n.x=k*Math.cos(q);n.y=k*Math.sin(q);this.vertices.push(n);h.push(new THREE.Vector2((n.x/b+1)/2,(n.y/b+1)/2))}k+=l}b=new THREE.Vector3(0,0,1);for(a=0;a<d;a++)for(e=a*c,g=0;g<=c;g++)q=g+e,f=q+a,l=q+c+a,n=q+c+1+a,this.faces.push(new THREE.Face3(f,
l,n,[b.clone(),b.clone(),b.clone()])),this.faceVertexUvs[0].push([h[f].clone(),h[l].clone(),h[n].clone()]),f=q+a,l=q+c+1+a,n=q+1+a,this.faces.push(new THREE.Face3(f,l,n,[b.clone(),b.clone(),b.clone()])),this.faceVertexUvs[0].push([h[f].clone(),h[l].clone(),h[n].clone()]);this.computeFaceNormals();this.boundingSphere=new THREE.Sphere(new THREE.Vector3,k)};THREE.RingGeometry.prototype=Object.create(THREE.Geometry.prototype);THREE.SphereGeometry=function(a,b,c,d,e,f,g){THREE.Geometry.call(this);this.parameters={radius:a,widthSegments:b,heightSegments:c,phiStart:d,phiLength:e,thetaStart:f,thetaLength:g};a=a||50;b=Math.max(3,Math.floor(b)||8);c=Math.max(2,Math.floor(c)||6);d=void 0!==d?d:0;e=void 0!==e?e:2*Math.PI;f=void 0!==f?f:0;g=void 0!==g?g:Math.PI;var h,k,l=[],n=[];for(k=0;k<=c;k++){var q=[],p=[];for(h=0;h<=b;h++){var s=h/b,t=k/c,r=new THREE.Vector3;r.x=-a*Math.cos(d+s*e)*Math.sin(f+t*g);r.y=a*Math.cos(f+t*g);r.z=
a*Math.sin(d+s*e)*Math.sin(f+t*g);this.vertices.push(r);q.push(this.vertices.length-1);p.push(new THREE.Vector2(s,1-t))}l.push(q);n.push(p)}for(k=0;k<c;k++)for(h=0;h<b;h++){d=l[k][h+1];e=l[k][h];f=l[k+1][h];g=l[k+1][h+1];var q=this.vertices[d].clone().normalize(),p=this.vertices[e].clone().normalize(),s=this.vertices[f].clone().normalize(),t=this.vertices[g].clone().normalize(),r=n[k][h+1].clone(),v=n[k][h].clone(),w=n[k+1][h].clone(),u=n[k+1][h+1].clone();Math.abs(this.vertices[d].y)===a?(r.x=(r.x+
v.x)/2,this.faces.push(new THREE.Face3(d,f,g,[q,s,t])),this.faceVertexUvs[0].push([r,w,u])):Math.abs(this.vertices[f].y)===a?(w.x=(w.x+u.x)/2,this.faces.push(new THREE.Face3(d,e,f,[q,p,s])),this.faceVertexUvs[0].push([r,v,w])):(this.faces.push(new THREE.Face3(d,e,g,[q,p,t])),this.faceVertexUvs[0].push([r,v,u]),this.faces.push(new THREE.Face3(e,f,g,[p.clone(),s,t.clone()])),this.faceVertexUvs[0].push([v.clone(),w,u.clone()]))}this.computeFaceNormals();this.boundingSphere=new THREE.Sphere(new THREE.Vector3,
a)};THREE.SphereGeometry.prototype=Object.create(THREE.Geometry.prototype);THREE.TextGeometry=function(a,b){b=b||{};var c=THREE.FontUtils.generateShapes(a,b);b.amount=void 0!==b.height?b.height:50;void 0===b.bevelThickness&&(b.bevelThickness=10);void 0===b.bevelSize&&(b.bevelSize=8);void 0===b.bevelEnabled&&(b.bevelEnabled=!1);THREE.ExtrudeGeometry.call(this,c,b)};THREE.TextGeometry.prototype=Object.create(THREE.ExtrudeGeometry.prototype);THREE.TorusGeometry=function(a,b,c,d,e){THREE.Geometry.call(this);this.parameters={radius:a,tube:b,radialSegments:c,tubularSegments:d,arc:e};a=a||100;b=b||40;c=c||8;d=d||6;e=e||2*Math.PI;for(var f=new THREE.Vector3,g=[],h=[],k=0;k<=c;k++)for(var l=0;l<=d;l++){var n=l/d*e,q=k/c*Math.PI*2;f.x=a*Math.cos(n);f.y=a*Math.sin(n);var p=new THREE.Vector3;p.x=(a+b*Math.cos(q))*Math.cos(n);p.y=(a+b*Math.cos(q))*Math.sin(n);p.z=b*Math.sin(q);this.vertices.push(p);g.push(new THREE.Vector2(l/d,k/c));h.push(p.clone().sub(f).normalize())}for(k=
1;k<=c;k++)for(l=1;l<=d;l++)a=(d+1)*k+l-1,b=(d+1)*(k-1)+l-1,e=(d+1)*(k-1)+l,f=(d+1)*k+l,n=new THREE.Face3(a,b,f,[h[a].clone(),h[b].clone(),h[f].clone()]),this.faces.push(n),this.faceVertexUvs[0].push([g[a].clone(),g[b].clone(),g[f].clone()]),n=new THREE.Face3(b,e,f,[h[b].clone(),h[e].clone(),h[f].clone()]),this.faces.push(n),this.faceVertexUvs[0].push([g[b].clone(),g[e].clone(),g[f].clone()]);this.computeFaceNormals()};THREE.TorusGeometry.prototype=Object.create(THREE.Geometry.prototype);THREE.TorusKnotGeometry=function(a,b,c,d,e,f,g){function h(a,b,c,d,e){var f=Math.cos(a),g=Math.sin(a);a*=b/c;b=Math.cos(a);f*=d*(2+b)*0.5;g=d*(2+b)*g*0.5;d=e*d*Math.sin(a)*0.5;return new THREE.Vector3(f,g,d)}THREE.Geometry.call(this);this.parameters={radius:a,tube:b,radialSegments:c,tubularSegments:d,p:e,q:f,heightScale:g};a=a||100;b=b||40;c=c||64;d=d||8;e=e||2;f=f||3;g=g||1;for(var k=Array(c),l=new THREE.Vector3,n=new THREE.Vector3,q=new THREE.Vector3,p=0;p<c;++p){k[p]=Array(d);var s=p/c*2*e*Math.PI,
t=h(s,f,e,a,g),s=h(s+0.01,f,e,a,g);l.subVectors(s,t);n.addVectors(s,t);q.crossVectors(l,n);n.crossVectors(q,l);q.normalize();n.normalize();for(s=0;s<d;++s){var r=s/d*2*Math.PI,v=-b*Math.cos(r),r=b*Math.sin(r),w=new THREE.Vector3;w.x=t.x+v*n.x+r*q.x;w.y=t.y+v*n.y+r*q.y;w.z=t.z+v*n.z+r*q.z;k[p][s]=this.vertices.push(w)-1}}for(p=0;p<c;++p)for(s=0;s<d;++s)e=(p+1)%c,f=(s+1)%d,a=k[p][s],b=k[e][s],e=k[e][f],f=k[p][f],g=new THREE.Vector2(p/c,s/d),l=new THREE.Vector2((p+1)/c,s/d),n=new THREE.Vector2((p+1)/
c,(s+1)/d),q=new THREE.Vector2(p/c,(s+1)/d),this.faces.push(new THREE.Face3(a,b,f)),this.faceVertexUvs[0].push([g,l,q]),this.faces.push(new THREE.Face3(b,e,f)),this.faceVertexUvs[0].push([l.clone(),n,q.clone()]);this.computeFaceNormals();this.computeVertexNormals()};THREE.TorusKnotGeometry.prototype=Object.create(THREE.Geometry.prototype);THREE.TubeGeometry=function(a,b,c,d,e){THREE.Geometry.call(this);this.parameters={path:a,segments:b,radius:c,radialSegments:d,closed:e};b=b||64;c=c||1;d=d||8;e=e||!1;var f=[],g,h,k=b+1,l,n,q,p,s=new THREE.Vector3,t,r,v;t=new THREE.TubeGeometry.FrenetFrames(a,b,e);r=t.normals;v=t.binormals;this.tangents=t.tangents;this.normals=r;this.binormals=v;for(t=0;t<k;t++)for(f[t]=[],l=t/(k-1),p=a.getPointAt(l),g=r[t],h=v[t],l=0;l<d;l++)n=l/d*2*Math.PI,q=-c*Math.cos(n),n=c*Math.sin(n),s.copy(p),s.x+=q*g.x+n*
h.x,s.y+=q*g.y+n*h.y,s.z+=q*g.z+n*h.z,f[t][l]=this.vertices.push(new THREE.Vector3(s.x,s.y,s.z))-1;for(t=0;t<b;t++)for(l=0;l<d;l++)k=e?(t+1)%b:t+1,s=(l+1)%d,a=f[t][l],c=f[k][l],k=f[k][s],s=f[t][s],r=new THREE.Vector2(t/b,l/d),v=new THREE.Vector2((t+1)/b,l/d),g=new THREE.Vector2((t+1)/b,(l+1)/d),h=new THREE.Vector2(t/b,(l+1)/d),this.faces.push(new THREE.Face3(a,c,s)),this.faceVertexUvs[0].push([r,v,h]),this.faces.push(new THREE.Face3(c,k,s)),this.faceVertexUvs[0].push([v.clone(),g,h.clone()]);this.computeFaceNormals();
this.computeVertexNormals()};THREE.TubeGeometry.prototype=Object.create(THREE.Geometry.prototype);
THREE.TubeGeometry.FrenetFrames=function(a,b,c){new THREE.Vector3;var d=new THREE.Vector3;new THREE.Vector3;var e=[],f=[],g=[],h=new THREE.Vector3,k=new THREE.Matrix4;b+=1;var l,n,q;this.tangents=e;this.normals=f;this.binormals=g;for(l=0;l<b;l++)n=l/(b-1),e[l]=a.getTangentAt(n),e[l].normalize();f[0]=new THREE.Vector3;g[0]=new THREE.Vector3;a=Number.MAX_VALUE;l=Math.abs(e[0].x);n=Math.abs(e[0].y);q=Math.abs(e[0].z);l<=a&&(a=l,d.set(1,0,0));n<=a&&(a=n,d.set(0,1,0));q<=a&&d.set(0,0,1);h.crossVectors(e[0],
d).normalize();f[0].crossVectors(e[0],h);g[0].crossVectors(e[0],f[0]);for(l=1;l<b;l++)f[l]=f[l-1].clone(),g[l]=g[l-1].clone(),h.crossVectors(e[l-1],e[l]),1E-4<h.length()&&(h.normalize(),d=Math.acos(THREE.Math.clamp(e[l-1].dot(e[l]),-1,1)),f[l].applyMatrix4(k.makeRotationAxis(h,d))),g[l].crossVectors(e[l],f[l]);if(c)for(d=Math.acos(THREE.Math.clamp(f[0].dot(f[b-1]),-1,1)),d/=b-1,0<e[0].dot(h.crossVectors(f[0],f[b-1]))&&(d=-d),l=1;l<b;l++)f[l].applyMatrix4(k.makeRotationAxis(e[l],d*l)),g[l].crossVectors(e[l],
f[l])};THREE.PolyhedronGeometry=function(a,b,c,d){function e(a){var b=a.normalize().clone();b.index=k.vertices.push(b)-1;var c=Math.atan2(a.z,-a.x)/2/Math.PI+0.5;a=Math.atan2(-a.y,Math.sqrt(a.x*a.x+a.z*a.z))/Math.PI+0.5;b.uv=new THREE.Vector2(c,1-a);return b}function f(a,b,c){var d=new THREE.Face3(a.index,b.index,c.index,[a.clone(),b.clone(),c.clone()]);k.faces.push(d);v.copy(a).add(b).add(c).divideScalar(3);d=Math.atan2(v.z,-v.x);k.faceVertexUvs[0].push([h(a.uv,a,d),h(b.uv,b,d),h(c.uv,c,d)])}function g(a,
b){var c=Math.pow(2,b);Math.pow(4,b);for(var d=e(k.vertices[a.a]),g=e(k.vertices[a.b]),h=e(k.vertices[a.c]),l=[],n=0;n<=c;n++){l[n]=[];for(var p=e(d.clone().lerp(h,n/c)),q=e(g.clone().lerp(h,n/c)),r=c-n,s=0;s<=r;s++)l[n][s]=0==s&&n==c?p:e(p.clone().lerp(q,s/r))}for(n=0;n<c;n++)for(s=0;s<2*(c-n)-1;s++)d=Math.floor(s/2),0==s%2?f(l[n][d+1],l[n+1][d],l[n][d]):f(l[n][d+1],l[n+1][d+1],l[n+1][d])}function h(a,b,c){0>c&&1===a.x&&(a=new THREE.Vector2(a.x-1,a.y));0===b.x&&0===b.z&&(a=new THREE.Vector2(c/2/
Math.PI+0.5,a.y));return a.clone()}THREE.Geometry.call(this);c=c||1;d=d||0;for(var k=this,l=0,n=a.length;l<n;l+=3)e(new THREE.Vector3(a[l],a[l+1],a[l+2]));a=this.vertices;for(var q=[],p=l=0,n=b.length;l<n;l+=3,p++){var s=a[b[l]],t=a[b[l+1]],r=a[b[l+2]];q[p]=new THREE.Face3(s.index,t.index,r.index,[s.clone(),t.clone(),r.clone()])}for(var v=new THREE.Vector3,l=0,n=q.length;l<n;l++)g(q[l],d);l=0;for(n=this.faceVertexUvs[0].length;l<n;l++)b=this.faceVertexUvs[0][l],d=b[0].x,a=b[1].x,q=b[2].x,p=Math.max(d,
Math.max(a,q)),s=Math.min(d,Math.min(a,q)),0.9<p&&0.1>s&&(0.2>d&&(b[0].x+=1),0.2>a&&(b[1].x+=1),0.2>q&&(b[2].x+=1));l=0;for(n=this.vertices.length;l<n;l++)this.vertices[l].multiplyScalar(c);this.mergeVertices();this.computeFaceNormals();this.boundingSphere=new THREE.Sphere(new THREE.Vector3,c)};THREE.PolyhedronGeometry.prototype=Object.create(THREE.Geometry.prototype);THREE.IcosahedronGeometry=function(a,b){this.parameters={radius:a,detail:b};var c=(1+Math.sqrt(5))/2;THREE.PolyhedronGeometry.call(this,[-1,c,0,1,c,0,-1,-c,0,1,-c,0,0,-1,c,0,1,c,0,-1,-c,0,1,-c,c,0,-1,c,0,1,-c,0,-1,-c,0,1],[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1],a,b)};THREE.IcosahedronGeometry.prototype=Object.create(THREE.Geometry.prototype);THREE.OctahedronGeometry=function(a,b){this.parameters={radius:a,detail:b};THREE.PolyhedronGeometry.call(this,[1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1],[0,2,4,0,4,3,0,3,5,0,5,2,1,2,5,1,5,3,1,3,4,1,4,2],a,b)};THREE.OctahedronGeometry.prototype=Object.create(THREE.Geometry.prototype);THREE.TetrahedronGeometry=function(a,b){THREE.PolyhedronGeometry.call(this,[1,1,1,-1,-1,1,-1,1,-1,1,-1,-1],[2,1,0,0,3,2,1,3,0,2,3,1],a,b)};THREE.TetrahedronGeometry.prototype=Object.create(THREE.Geometry.prototype);THREE.ParametricGeometry=function(a,b,c){THREE.Geometry.call(this);var d=this.vertices,e=this.faces,f=this.faceVertexUvs[0],g,h,k,l,n=b+1;for(g=0;g<=c;g++)for(l=g/c,h=0;h<=b;h++)k=h/b,k=a(k,l),d.push(k);var q,p,s,t;for(g=0;g<c;g++)for(h=0;h<b;h++)a=g*n+h,d=g*n+h+1,l=(g+1)*n+h+1,k=(g+1)*n+h,q=new THREE.Vector2(h/b,g/c),p=new THREE.Vector2((h+1)/b,g/c),s=new THREE.Vector2((h+1)/b,(g+1)/c),t=new THREE.Vector2(h/b,(g+1)/c),e.push(new THREE.Face3(a,d,k)),f.push([q,p,t]),e.push(new THREE.Face3(d,l,k)),
f.push([p.clone(),s,t.clone()]);this.computeFaceNormals();this.computeVertexNormals()};THREE.ParametricGeometry.prototype=Object.create(THREE.Geometry.prototype);THREE.AxisHelper=function(a){a=a||1;var b=new THREE.Geometry;b.vertices.push(new THREE.Vector3,new THREE.Vector3(a,0,0),new THREE.Vector3,new THREE.Vector3(0,a,0),new THREE.Vector3,new THREE.Vector3(0,0,a));b.colors.push(new THREE.Color(16711680),new THREE.Color(16755200),new THREE.Color(65280),new THREE.Color(11206400),new THREE.Color(255),new THREE.Color(43775));a=new THREE.LineBasicMaterial({vertexColors:THREE.VertexColors});THREE.Line.call(this,b,a,THREE.LinePieces)};
THREE.AxisHelper.prototype=Object.create(THREE.Line.prototype);THREE.ArrowHelper=function(a,b,c,d,e,f){THREE.Object3D.call(this);void 0===d&&(d=16776960);void 0===c&&(c=1);void 0===e&&(e=0.2*c);void 0===f&&(f=0.2*e);this.position=b;b=new THREE.Geometry;b.vertices.push(new THREE.Vector3(0,0,0));b.vertices.push(new THREE.Vector3(0,1,0));this.line=new THREE.Line(b,new THREE.LineBasicMaterial({color:d}));this.line.matrixAutoUpdate=!1;this.add(this.line);b=new THREE.CylinderGeometry(0,0.5,1,5,1);b.applyMatrix((new THREE.Matrix4).makeTranslation(0,-0.5,0));this.cone=
new THREE.Mesh(b,new THREE.MeshBasicMaterial({color:d}));this.cone.matrixAutoUpdate=!1;this.add(this.cone);this.setDirection(a);this.setLength(c,e,f)};THREE.ArrowHelper.prototype=Object.create(THREE.Object3D.prototype);THREE.ArrowHelper.prototype.setDirection=function(){var a=new THREE.Vector3,b;return function(c){0.99999<c.y?this.quaternion.set(0,0,0,1):-0.99999>c.y?this.quaternion.set(1,0,0,0):(a.set(c.z,0,-c.x).normalize(),b=Math.acos(c.y),this.quaternion.setFromAxisAngle(a,b))}}();
THREE.ArrowHelper.prototype.setLength=function(a,b,c){void 0===b&&(b=0.2*a);void 0===c&&(c=0.2*b);this.line.scale.set(1,a,1);this.line.updateMatrix();this.cone.scale.set(c,b,c);this.cone.position.y=a;this.cone.updateMatrix()};THREE.ArrowHelper.prototype.setColor=function(a){this.line.material.color.set(a);this.cone.material.color.set(a)};THREE.BoxHelper=function(a){var b=[new THREE.Vector3(1,1,1),new THREE.Vector3(-1,1,1),new THREE.Vector3(-1,-1,1),new THREE.Vector3(1,-1,1),new THREE.Vector3(1,1,-1),new THREE.Vector3(-1,1,-1),new THREE.Vector3(-1,-1,-1),new THREE.Vector3(1,-1,-1)];this.vertices=b;var c=new THREE.Geometry;c.vertices.push(b[0],b[1],b[1],b[2],b[2],b[3],b[3],b[0],b[4],b[5],b[5],b[6],b[6],b[7],b[7],b[4],b[0],b[4],b[1],b[5],b[2],b[6],b[3],b[7]);THREE.Line.call(this,c,new THREE.LineBasicMaterial({color:16776960}),THREE.LinePieces);
void 0!==a&&this.update(a)};THREE.BoxHelper.prototype=Object.create(THREE.Line.prototype);
THREE.BoxHelper.prototype.update=function(a){var b=a.geometry;null===b.boundingBox&&b.computeBoundingBox();var c=b.boundingBox.min,b=b.boundingBox.max,d=this.vertices;d[0].set(b.x,b.y,b.z);d[1].set(c.x,b.y,b.z);d[2].set(c.x,c.y,b.z);d[3].set(b.x,c.y,b.z);d[4].set(b.x,b.y,c.z);d[5].set(c.x,b.y,c.z);d[6].set(c.x,c.y,c.z);d[7].set(b.x,c.y,c.z);this.geometry.computeBoundingSphere();this.geometry.verticesNeedUpdate=!0;this.matrixAutoUpdate=!1;this.matrixWorld=a.matrixWorld};THREE.BoundingBoxHelper=function(a,b){var c=void 0!==b?b:8947848;this.object=a;this.box=new THREE.Box3;THREE.Mesh.call(this,new THREE.BoxGeometry(1,1,1),new THREE.MeshBasicMaterial({color:c,wireframe:!0}))};THREE.BoundingBoxHelper.prototype=Object.create(THREE.Mesh.prototype);THREE.BoundingBoxHelper.prototype.update=function(){this.box.setFromObject(this.object);this.box.size(this.scale);this.box.center(this.position)};THREE.CameraHelper=function(a){function b(a,b,d){c(a,d);c(b,d)}function c(a,b){d.vertices.push(new THREE.Vector3);d.colors.push(new THREE.Color(b));void 0===f[a]&&(f[a]=[]);f[a].push(d.vertices.length-1)}var d=new THREE.Geometry,e=new THREE.LineBasicMaterial({color:16777215,vertexColors:THREE.FaceColors}),f={};b("n1","n2",16755200);b("n2","n4",16755200);b("n4","n3",16755200);b("n3","n1",16755200);b("f1","f2",16755200);b("f2","f4",16755200);b("f4","f3",16755200);b("f3","f1",16755200);b("n1","f1",16755200);
b("n2","f2",16755200);b("n3","f3",16755200);b("n4","f4",16755200);b("p","n1",16711680);b("p","n2",16711680);b("p","n3",16711680);b("p","n4",16711680);b("u1","u2",43775);b("u2","u3",43775);b("u3","u1",43775);b("c","t",16777215);b("p","c",3355443);b("cn1","cn2",3355443);b("cn3","cn4",3355443);b("cf1","cf2",3355443);b("cf3","cf4",3355443);THREE.Line.call(this,d,e,THREE.LinePieces);this.camera=a;this.matrixWorld=a.matrixWorld;this.matrixAutoUpdate=!1;this.pointMap=f;this.update()};
THREE.CameraHelper.prototype=Object.create(THREE.Line.prototype);
THREE.CameraHelper.prototype.update=function(){var a=new THREE.Vector3,b=new THREE.Camera,c=new THREE.Projector;return function(){function d(d,g,h,k){a.set(g,h,k);c.unprojectVector(a,b);d=e.pointMap[d];if(void 0!==d)for(g=0,h=d.length;g<h;g++)e.geometry.vertices[d[g]].copy(a)}var e=this;b.projectionMatrix.copy(this.camera.projectionMatrix);d("c",0,0,-1);d("t",0,0,1);d("n1",-1,-1,-1);d("n2",1,-1,-1);d("n3",-1,1,-1);d("n4",1,1,-1);d("f1",-1,-1,1);d("f2",1,-1,1);d("f3",-1,1,1);d("f4",1,1,1);d("u1",0.7,
1.1,-1);d("u2",-0.7,1.1,-1);d("u3",0,2,-1);d("cf1",-1,0,1);d("cf2",1,0,1);d("cf3",0,-1,1);d("cf4",0,1,1);d("cn1",-1,0,-1);d("cn2",1,0,-1);d("cn3",0,-1,-1);d("cn4",0,1,-1);this.geometry.verticesNeedUpdate=!0}}();THREE.DirectionalLightHelper=function(a,b){THREE.Object3D.call(this);this.light=a;this.light.updateMatrixWorld();this.matrixWorld=a.matrixWorld;this.matrixAutoUpdate=!1;b=b||1;var c=new THREE.Geometry;c.vertices.push(new THREE.Vector3(-b,b,0),new THREE.Vector3(b,b,0),new THREE.Vector3(b,-b,0),new THREE.Vector3(-b,-b,0),new THREE.Vector3(-b,b,0));var d=new THREE.LineBasicMaterial({fog:!1});d.color.copy(this.light.color).multiplyScalar(this.light.intensity);this.lightPlane=new THREE.Line(c,d);this.add(this.lightPlane);
c=new THREE.Geometry;c.vertices.push(new THREE.Vector3,new THREE.Vector3);d=new THREE.LineBasicMaterial({fog:!1});d.color.copy(this.light.color).multiplyScalar(this.light.intensity);this.targetLine=new THREE.Line(c,d);this.add(this.targetLine);this.update()};THREE.DirectionalLightHelper.prototype=Object.create(THREE.Object3D.prototype);
THREE.DirectionalLightHelper.prototype.dispose=function(){this.lightPlane.geometry.dispose();this.lightPlane.material.dispose();this.targetLine.geometry.dispose();this.targetLine.material.dispose()};
THREE.DirectionalLightHelper.prototype.update=function(){var a=new THREE.Vector3,b=new THREE.Vector3,c=new THREE.Vector3;return function(){a.setFromMatrixPosition(this.light.matrixWorld);b.setFromMatrixPosition(this.light.target.matrixWorld);c.subVectors(b,a);this.lightPlane.lookAt(c);this.lightPlane.material.color.copy(this.light.color).multiplyScalar(this.light.intensity);this.targetLine.geometry.vertices[1].copy(c);this.targetLine.geometry.verticesNeedUpdate=!0;this.targetLine.material.color.copy(this.lightPlane.material.color)}}();THREE.EdgesHelper=function(a,b){var c=void 0!==b?b:16777215,d=[0,0],e={},f=function(a,b){return a-b},g=["a","b","c"],h=new THREE.BufferGeometry,k=a.geometry.clone();k.mergeVertices();k.computeFaceNormals();for(var l=k.vertices,k=k.faces,n=0,q=0,p=k.length;q<p;q++)for(var s=k[q],t=0;3>t;t++){d[0]=s[g[t]];d[1]=s[g[(t+1)%3]];d.sort(f);var r=d.toString();void 0===e[r]?(e[r]={vert1:d[0],vert2:d[1],face1:q,face2:void 0},n++):e[r].face2=q}h.addAttribute("position",new THREE.Float32Attribute(2*n,3));d=h.attributes.position.array;
f=0;for(r in e)if(g=e[r],void 0===g.face2||0.9999>k[g.face1].normal.dot(k[g.face2].normal))n=l[g.vert1],d[f++]=n.x,d[f++]=n.y,d[f++]=n.z,n=l[g.vert2],d[f++]=n.x,d[f++]=n.y,d[f++]=n.z;THREE.Line.call(this,h,new THREE.LineBasicMaterial({color:c}),THREE.LinePieces);this.matrixAutoUpdate=!1;this.matrixWorld=a.matrixWorld};THREE.EdgesHelper.prototype=Object.create(THREE.Line.prototype);THREE.FaceNormalsHelper=function(a,b,c,d){this.object=a;this.size=void 0!==b?b:1;a=void 0!==c?c:16776960;d=void 0!==d?d:1;b=new THREE.Geometry;c=0;for(var e=this.object.geometry.faces.length;c<e;c++)b.vertices.push(new THREE.Vector3,new THREE.Vector3);THREE.Line.call(this,b,new THREE.LineBasicMaterial({color:a,linewidth:d}),THREE.LinePieces);this.matrixAutoUpdate=!1;this.normalMatrix=new THREE.Matrix3;this.update()};THREE.FaceNormalsHelper.prototype=Object.create(THREE.Line.prototype);
THREE.FaceNormalsHelper.prototype.update=function(){var a=this.geometry.vertices,b=this.object,c=b.geometry.vertices,d=b.geometry.faces,e=b.matrixWorld;b.updateMatrixWorld(!0);this.normalMatrix.getNormalMatrix(e);for(var f=b=0,g=d.length;b<g;b++,f+=2){var h=d[b];a[f].copy(c[h.a]).add(c[h.b]).add(c[h.c]).divideScalar(3).applyMatrix4(e);a[f+1].copy(h.normal).applyMatrix3(this.normalMatrix).normalize().multiplyScalar(this.size).add(a[f])}this.geometry.verticesNeedUpdate=!0;return this};THREE.GridHelper=function(a,b){var c=new THREE.Geometry,d=new THREE.LineBasicMaterial({vertexColors:THREE.VertexColors});this.color1=new THREE.Color(4473924);this.color2=new THREE.Color(8947848);for(var e=-a;e<=a;e+=b){c.vertices.push(new THREE.Vector3(-a,0,e),new THREE.Vector3(a,0,e),new THREE.Vector3(e,0,-a),new THREE.Vector3(e,0,a));var f=0===e?this.color1:this.color2;c.colors.push(f,f,f,f)}THREE.Line.call(this,c,d,THREE.LinePieces)};THREE.GridHelper.prototype=Object.create(THREE.Line.prototype);
THREE.GridHelper.prototype.setColors=function(a,b){this.color1.set(a);this.color2.set(b);this.geometry.colorsNeedUpdate=!0};THREE.HemisphereLightHelper=function(a,b,c,d){THREE.Object3D.call(this);this.light=a;this.light.updateMatrixWorld();this.matrixWorld=a.matrixWorld;this.matrixAutoUpdate=!1;this.colors=[new THREE.Color,new THREE.Color];a=new THREE.SphereGeometry(b,4,2);a.applyMatrix((new THREE.Matrix4).makeRotationX(-Math.PI/2));for(b=0;8>b;b++)a.faces[b].color=this.colors[4>b?0:1];b=new THREE.MeshBasicMaterial({vertexColors:THREE.FaceColors,wireframe:!0});this.lightSphere=new THREE.Mesh(a,b);this.add(this.lightSphere);
this.update()};THREE.HemisphereLightHelper.prototype=Object.create(THREE.Object3D.prototype);THREE.HemisphereLightHelper.prototype.dispose=function(){this.lightSphere.geometry.dispose();this.lightSphere.material.dispose()};
THREE.HemisphereLightHelper.prototype.update=function(){var a=new THREE.Vector3;return function(){this.colors[0].copy(this.light.color).multiplyScalar(this.light.intensity);this.colors[1].copy(this.light.groundColor).multiplyScalar(this.light.intensity);this.lightSphere.lookAt(a.setFromMatrixPosition(this.light.matrixWorld).negate());this.lightSphere.geometry.colorsNeedUpdate=!0}}();THREE.PointLightHelper=function(a,b){this.light=a;this.light.updateMatrixWorld();var c=new THREE.SphereGeometry(b,4,2),d=new THREE.MeshBasicMaterial({wireframe:!0,fog:!1});d.color.copy(this.light.color).multiplyScalar(this.light.intensity);THREE.Mesh.call(this,c,d);this.matrixWorld=this.light.matrixWorld;this.matrixAutoUpdate=!1};THREE.PointLightHelper.prototype=Object.create(THREE.Mesh.prototype);THREE.PointLightHelper.prototype.dispose=function(){this.geometry.dispose();this.material.dispose()};
THREE.PointLightHelper.prototype.update=function(){this.material.color.copy(this.light.color).multiplyScalar(this.light.intensity)};THREE.SkeletonHelper=function(a){for(var b=a.skeleton,c=new THREE.Geometry,d=0;d<b.bones.length;d++)b.bones[d].parent instanceof THREE.Bone&&(c.vertices.push(new THREE.Vector3),c.vertices.push(new THREE.Vector3),c.colors.push(new THREE.Color(0,0,1)),c.colors.push(new THREE.Color(0,1,0)));d=new THREE.LineBasicMaterial({vertexColors:!0,depthTest:!1,depthWrite:!1,transparent:!0});THREE.Line.call(this,c,d,THREE.LinePieces);this.skeleton=b;this.matrixWorld=a.matrixWorld;this.matrixAutoUpdate=!1;this.update()};
THREE.SkeletonHelper.prototype=Object.create(THREE.Line.prototype);THREE.SkeletonHelper.prototype.update=function(){for(var a=this.geometry,b=0,c=0;c<this.skeleton.bones.length;c++){var d=this.skeleton.bones[c];d.parent instanceof THREE.Bone&&(a.vertices[b].setFromMatrixPosition(d.skinMatrix),a.vertices[b+1].setFromMatrixPosition(d.parent.skinMatrix),b+=2)}a.verticesNeedUpdate=!0;a.computeBoundingSphere()};THREE.SpotLightHelper=function(a){THREE.Object3D.call(this);this.light=a;this.light.updateMatrixWorld();this.matrixWorld=a.matrixWorld;this.matrixAutoUpdate=!1;a=new THREE.CylinderGeometry(0,1,1,8,1,!0);a.applyMatrix((new THREE.Matrix4).makeTranslation(0,-0.5,0));a.applyMatrix((new THREE.Matrix4).makeRotationX(-Math.PI/2));var b=new THREE.MeshBasicMaterial({wireframe:!0,fog:!1});this.cone=new THREE.Mesh(a,b);this.add(this.cone);this.update()};THREE.SpotLightHelper.prototype=Object.create(THREE.Object3D.prototype);
THREE.SpotLightHelper.prototype.dispose=function(){this.cone.geometry.dispose();this.cone.material.dispose()};THREE.SpotLightHelper.prototype.update=function(){var a=new THREE.Vector3,b=new THREE.Vector3;return function(){var c=this.light.distance?this.light.distance:1E4,d=c*Math.tan(this.light.angle);this.cone.scale.set(d,d,c);a.setFromMatrixPosition(this.light.matrixWorld);b.setFromMatrixPosition(this.light.target.matrixWorld);this.cone.lookAt(b.sub(a));this.cone.material.color.copy(this.light.color).multiplyScalar(this.light.intensity)}}();THREE.VertexNormalsHelper=function(a,b,c,d){this.object=a;this.size=void 0!==b?b:1;b=void 0!==c?c:16711680;d=void 0!==d?d:1;c=new THREE.Geometry;a=a.geometry.faces;for(var e=0,f=a.length;e<f;e++)for(var g=0,h=a[e].vertexNormals.length;g<h;g++)c.vertices.push(new THREE.Vector3),c.vertices.push(new THREE.Vector3);THREE.Line.call(this,c,new THREE.LineBasicMaterial({color:b,linewidth:d}),THREE.LinePieces);this.matrixAutoUpdate=!1;this.normalMatrix=new THREE.Matrix3;this.update()};
THREE.VertexNormalsHelper.prototype=Object.create(THREE.Line.prototype);
THREE.VertexNormalsHelper.prototype.update=function(a){var b=new THREE.Vector3;return function(a){a=["a","b","c","d"];this.object.updateMatrixWorld(!0);this.normalMatrix.getNormalMatrix(this.object.matrixWorld);for(var d=this.geometry.vertices,e=this.object.geometry.vertices,f=this.object.geometry.faces,g=this.object.matrixWorld,h=0,k=0,l=f.length;k<l;k++)for(var n=f[k],q=0,p=n.vertexNormals.length;q<p;q++){var s=n.vertexNormals[q];d[h].copy(e[n[a[q]]]).applyMatrix4(g);b.copy(s).applyMatrix3(this.normalMatrix).normalize().multiplyScalar(this.size);
b.add(d[h]);h+=1;d[h].copy(b);h+=1}this.geometry.verticesNeedUpdate=!0;return this}}();THREE.VertexTangentsHelper=function(a,b,c,d){this.object=a;this.size=void 0!==b?b:1;b=void 0!==c?c:255;d=void 0!==d?d:1;c=new THREE.Geometry;a=a.geometry.faces;for(var e=0,f=a.length;e<f;e++)for(var g=0,h=a[e].vertexTangents.length;g<h;g++)c.vertices.push(new THREE.Vector3),c.vertices.push(new THREE.Vector3);THREE.Line.call(this,c,new THREE.LineBasicMaterial({color:b,linewidth:d}),THREE.LinePieces);this.matrixAutoUpdate=!1;this.update()};THREE.VertexTangentsHelper.prototype=Object.create(THREE.Line.prototype);
THREE.VertexTangentsHelper.prototype.update=function(a){var b=new THREE.Vector3;return function(a){a=["a","b","c","d"];this.object.updateMatrixWorld(!0);for(var d=this.geometry.vertices,e=this.object.geometry.vertices,f=this.object.geometry.faces,g=this.object.matrixWorld,h=0,k=0,l=f.length;k<l;k++)for(var n=f[k],q=0,p=n.vertexTangents.length;q<p;q++){var s=n.vertexTangents[q];d[h].copy(e[n[a[q]]]).applyMatrix4(g);b.copy(s).transformDirection(g).multiplyScalar(this.size);b.add(d[h]);h+=1;d[h].copy(b);
h+=1}this.geometry.verticesNeedUpdate=!0;return this}}();THREE.WireframeHelper=function(a,b){var c=void 0!==b?b:16777215,d=[0,0],e={},f=function(a,b){return a-b},g=["a","b","c"],h=new THREE.BufferGeometry;if(a.geometry instanceof THREE.Geometry){for(var k=a.geometry.vertices,l=a.geometry.faces,n=0,q=new Uint32Array(6*l.length),p=0,s=l.length;p<s;p++)for(var t=l[p],r=0;3>r;r++){d[0]=t[g[r]];d[1]=t[g[(r+1)%3]];d.sort(f);var v=d.toString();void 0===e[v]&&(q[2*n]=d[0],q[2*n+1]=d[1],e[v]=!0,n++)}h.addAttribute("position",new THREE.Float32Attribute(2*n,3));d=
h.attributes.position.array;p=0;for(s=n;p<s;p++)for(r=0;2>r;r++)n=k[q[2*p+r]],g=6*p+3*r,d[g+0]=n.x,d[g+1]=n.y,d[g+2]=n.z}else if(a.geometry instanceof THREE.BufferGeometry&&void 0!==a.geometry.attributes.index){for(var k=a.geometry.attributes.position.array,s=a.geometry.attributes.index.array,l=a.geometry.offsets,n=0,q=new Uint32Array(2*s.length),t=0,w=l.length;t<w;++t)for(var r=l[t].start,v=l[t].count,g=l[t].index,p=r,u=r+v;p<u;p+=3)for(r=0;3>r;r++)d[0]=g+s[p+r],d[1]=g+s[p+(r+1)%3],d.sort(f),v=d.toString(),
void 0===e[v]&&(q[2*n]=d[0],q[2*n+1]=d[1],e[v]=!0,n++);h.addAttribute("position",new THREE.Float32Attribute(2*n,3));d=h.attributes.position.array;p=0;for(s=n;p<s;p++)for(r=0;2>r;r++)g=6*p+3*r,n=3*q[2*p+r],d[g+0]=k[n],d[g+1]=k[n+1],d[g+2]=k[n+2]}else if(a.geometry instanceof THREE.BufferGeometry)for(k=a.geometry.attributes.position.array,n=k.length/3,q=n/3,h.addAttribute("position",new THREE.Float32Attribute(2*n,3)),d=h.attributes.position.array,p=0,s=q;p<s;p++)for(r=0;3>r;r++)g=18*p+6*r,q=9*p+3*r,
d[g+0]=k[q],d[g+1]=k[q+1],d[g+2]=k[q+2],n=9*p+(r+1)%3*3,d[g+3]=k[n],d[g+4]=k[n+1],d[g+5]=k[n+2];THREE.Line.call(this,h,new THREE.LineBasicMaterial({color:c}),THREE.LinePieces);this.matrixAutoUpdate=!1;this.matrixWorld=a.matrixWorld};THREE.WireframeHelper.prototype=Object.create(THREE.Line.prototype);THREE.ImmediateRenderObject=function(){THREE.Object3D.call(this);this.render=function(a){}};THREE.ImmediateRenderObject.prototype=Object.create(THREE.Object3D.prototype);THREE.LensFlare=function(a,b,c,d,e){THREE.Object3D.call(this);this.lensFlares=[];this.positionScreen=new THREE.Vector3;this.customUpdateCallback=void 0;void 0!==a&&this.add(a,b,c,d,e)};THREE.LensFlare.prototype=Object.create(THREE.Object3D.prototype);
THREE.LensFlare.prototype.add=function(a,b,c,d,e,f){void 0===b&&(b=-1);void 0===c&&(c=0);void 0===f&&(f=1);void 0===e&&(e=new THREE.Color(16777215));void 0===d&&(d=THREE.NormalBlending);c=Math.min(c,Math.max(0,c));this.lensFlares.push({texture:a,size:b,distance:c,x:0,y:0,z:0,scale:1,rotation:1,opacity:f,color:e,blending:d})};
THREE.LensFlare.prototype.updateLensFlares=function(){var a,b=this.lensFlares.length,c,d=2*-this.positionScreen.x,e=2*-this.positionScreen.y;for(a=0;a<b;a++)c=this.lensFlares[a],c.x=this.positionScreen.x+d*c.distance,c.y=this.positionScreen.y+e*c.distance,c.wantedRotation=c.x*Math.PI*0.25,c.rotation+=0.25*(c.wantedRotation-c.rotation)};THREE.MorphBlendMesh=function(a,b){THREE.Mesh.call(this,a,b);this.animationsMap={};this.animationsList=[];var c=this.geometry.morphTargets.length;this.createAnimation("__default",0,c-1,c/1);this.setAnimationWeight("__default",1)};THREE.MorphBlendMesh.prototype=Object.create(THREE.Mesh.prototype);
THREE.MorphBlendMesh.prototype.createAnimation=function(a,b,c,d){b={startFrame:b,endFrame:c,length:c-b+1,fps:d,duration:(c-b)/d,lastFrame:0,currentFrame:0,active:!1,time:0,direction:1,weight:1,directionBackwards:!1,mirroredLoop:!1};this.animationsMap[a]=b;this.animationsList.push(b)};
THREE.MorphBlendMesh.prototype.autoCreateAnimations=function(a){for(var b=/([a-z]+)(\d+)/,c,d={},e=this.geometry,f=0,g=e.morphTargets.length;f<g;f++){var h=e.morphTargets[f].name.match(b);if(h&&1<h.length){var k=h[1];d[k]||(d[k]={start:Infinity,end:-Infinity});h=d[k];f<h.start&&(h.start=f);f>h.end&&(h.end=f);c||(c=k)}}for(k in d)h=d[k],this.createAnimation(k,h.start,h.end,a);this.firstAnimation=c};
THREE.MorphBlendMesh.prototype.setAnimationDirectionForward=function(a){if(a=this.animationsMap[a])a.direction=1,a.directionBackwards=!1};THREE.MorphBlendMesh.prototype.setAnimationDirectionBackward=function(a){if(a=this.animationsMap[a])a.direction=-1,a.directionBackwards=!0};THREE.MorphBlendMesh.prototype.setAnimationFPS=function(a,b){var c=this.animationsMap[a];c&&(c.fps=b,c.duration=(c.end-c.start)/c.fps)};
THREE.MorphBlendMesh.prototype.setAnimationDuration=function(a,b){var c=this.animationsMap[a];c&&(c.duration=b,c.fps=(c.end-c.start)/c.duration)};THREE.MorphBlendMesh.prototype.setAnimationWeight=function(a,b){var c=this.animationsMap[a];c&&(c.weight=b)};THREE.MorphBlendMesh.prototype.setAnimationTime=function(a,b){var c=this.animationsMap[a];c&&(c.time=b)};THREE.MorphBlendMesh.prototype.getAnimationTime=function(a){var b=0;if(a=this.animationsMap[a])b=a.time;return b};
THREE.MorphBlendMesh.prototype.getAnimationDuration=function(a){var b=-1;if(a=this.animationsMap[a])b=a.duration;return b};THREE.MorphBlendMesh.prototype.playAnimation=function(a){var b=this.animationsMap[a];b?(b.time=0,b.active=!0):console.warn("animation["+a+"] undefined")};THREE.MorphBlendMesh.prototype.stopAnimation=function(a){if(a=this.animationsMap[a])a.active=!1};
THREE.MorphBlendMesh.prototype.update=function(a){for(var b=0,c=this.animationsList.length;b<c;b++){var d=this.animationsList[b];if(d.active){var e=d.duration/d.length;d.time+=d.direction*a;if(d.mirroredLoop){if(d.time>d.duration||0>d.time)d.direction*=-1,d.time>d.duration&&(d.time=d.duration,d.directionBackwards=!0),0>d.time&&(d.time=0,d.directionBackwards=!1)}else d.time%=d.duration,0>d.time&&(d.time+=d.duration);var f=d.startFrame+THREE.Math.clamp(Math.floor(d.time/e),0,d.length-1),g=d.weight;
f!==d.currentFrame&&(this.morphTargetInfluences[d.lastFrame]=0,this.morphTargetInfluences[d.currentFrame]=1*g,this.morphTargetInfluences[f]=0,d.lastFrame=d.currentFrame,d.currentFrame=f);e=d.time%e/e;d.directionBackwards&&(e=1-e);this.morphTargetInfluences[d.currentFrame]=e*g;this.morphTargetInfluences[d.lastFrame]=(1-e)*g}}};THREE.LensFlarePlugin=function(){function a(a,c){var d=b.createProgram(),e=b.createShader(b.FRAGMENT_SHADER),f=b.createShader(b.VERTEX_SHADER),g="precision "+c+" float;\n";b.shaderSource(e,g+a.fragmentShader);b.shaderSource(f,g+a.vertexShader);b.compileShader(e);b.compileShader(f);b.attachShader(d,e);b.attachShader(d,f);b.linkProgram(d);return d}var b,c,d,e,f,g,h,k,l,n,q,p,s;this.init=function(t){b=t.context;c=t;d=t.getPrecision();e=new Float32Array(16);f=new Uint16Array(6);t=0;e[t++]=-1;e[t++]=-1;
e[t++]=0;e[t++]=0;e[t++]=1;e[t++]=-1;e[t++]=1;e[t++]=0;e[t++]=1;e[t++]=1;e[t++]=1;e[t++]=1;e[t++]=-1;e[t++]=1;e[t++]=0;e[t++]=1;t=0;f[t++]=0;f[t++]=1;f[t++]=2;f[t++]=0;f[t++]=2;f[t++]=3;g=b.createBuffer();h=b.createBuffer();b.bindBuffer(b.ARRAY_BUFFER,g);b.bufferData(b.ARRAY_BUFFER,e,b.STATIC_DRAW);b.bindBuffer(b.ELEMENT_ARRAY_BUFFER,h);b.bufferData(b.ELEMENT_ARRAY_BUFFER,f,b.STATIC_DRAW);k=b.createTexture();l=b.createTexture();b.bindTexture(b.TEXTURE_2D,k);b.texImage2D(b.TEXTURE_2D,0,b.RGB,16,16,
0,b.RGB,b.UNSIGNED_BYTE,null);b.texParameteri(b.TEXTURE_2D,b.TEXTURE_WRAP_S,b.CLAMP_TO_EDGE);b.texParameteri(b.TEXTURE_2D,b.TEXTURE_WRAP_T,b.CLAMP_TO_EDGE);b.texParameteri(b.TEXTURE_2D,b.TEXTURE_MAG_FILTER,b.NEAREST);b.texParameteri(b.TEXTURE_2D,b.TEXTURE_MIN_FILTER,b.NEAREST);b.bindTexture(b.TEXTURE_2D,l);b.texImage2D(b.TEXTURE_2D,0,b.RGBA,16,16,0,b.RGBA,b.UNSIGNED_BYTE,null);b.texParameteri(b.TEXTURE_2D,b.TEXTURE_WRAP_S,b.CLAMP_TO_EDGE);b.texParameteri(b.TEXTURE_2D,b.TEXTURE_WRAP_T,b.CLAMP_TO_EDGE);
b.texParameteri(b.TEXTURE_2D,b.TEXTURE_MAG_FILTER,b.NEAREST);b.texParameteri(b.TEXTURE_2D,b.TEXTURE_MIN_FILTER,b.NEAREST);0>=b.getParameter(b.MAX_VERTEX_TEXTURE_IMAGE_UNITS)?(n=!1,q=a(THREE.ShaderFlares.lensFlare,d)):(n=!0,q=a(THREE.ShaderFlares.lensFlareVertexTexture,d));p={};s={};p.vertex=b.getAttribLocation(q,"position");p.uv=b.getAttribLocation(q,"uv");s.renderType=b.getUniformLocation(q,"renderType");s.map=b.getUniformLocation(q,"map");s.occlusionMap=b.getUniformLocation(q,"occlusionMap");s.opacity=
b.getUniformLocation(q,"opacity");s.color=b.getUniformLocation(q,"color");s.scale=b.getUniformLocation(q,"scale");s.rotation=b.getUniformLocation(q,"rotation");s.screenPosition=b.getUniformLocation(q,"screenPosition")};this.render=function(a,d,e,f){a=a.__webglFlares;var u=a.length;if(u){var y=new THREE.Vector3,L=f/e,x=0.5*e,N=0.5*f,J=16/f,B=new THREE.Vector2(J*L,J),K=new THREE.Vector3(1,1,0),A=new THREE.Vector2(1,1),G=s,J=p;b.useProgram(q);b.enableVertexAttribArray(p.vertex);b.enableVertexAttribArray(p.uv);
b.uniform1i(G.occlusionMap,0);b.uniform1i(G.map,1);b.bindBuffer(b.ARRAY_BUFFER,g);b.vertexAttribPointer(J.vertex,2,b.FLOAT,!1,16,0);b.vertexAttribPointer(J.uv,2,b.FLOAT,!1,16,8);b.bindBuffer(b.ELEMENT_ARRAY_BUFFER,h);b.disable(b.CULL_FACE);b.depthMask(!1);var D,C,F,z,H;for(D=0;D<u;D++)if(J=16/f,B.set(J*L,J),z=a[D],y.set(z.matrixWorld.elements[12],z.matrixWorld.elements[13],z.matrixWorld.elements[14]),y.applyMatrix4(d.matrixWorldInverse),y.applyProjection(d.projectionMatrix),K.copy(y),A.x=K.x*x+x,
A.y=K.y*N+N,n||0<A.x&&A.x<e&&0<A.y&&A.y<f)for(b.activeTexture(b.TEXTURE1),b.bindTexture(b.TEXTURE_2D,k),b.copyTexImage2D(b.TEXTURE_2D,0,b.RGB,A.x-8,A.y-8,16,16,0),b.uniform1i(G.renderType,0),b.uniform2f(G.scale,B.x,B.y),b.uniform3f(G.screenPosition,K.x,K.y,K.z),b.disable(b.BLEND),b.enable(b.DEPTH_TEST),b.drawElements(b.TRIANGLES,6,b.UNSIGNED_SHORT,0),b.activeTexture(b.TEXTURE0),b.bindTexture(b.TEXTURE_2D,l),b.copyTexImage2D(b.TEXTURE_2D,0,b.RGBA,A.x-8,A.y-8,16,16,0),b.uniform1i(G.renderType,1),b.disable(b.DEPTH_TEST),
b.activeTexture(b.TEXTURE1),b.bindTexture(b.TEXTURE_2D,k),b.drawElements(b.TRIANGLES,6,b.UNSIGNED_SHORT,0),z.positionScreen.copy(K),z.customUpdateCallback?z.customUpdateCallback(z):z.updateLensFlares(),b.uniform1i(G.renderType,2),b.enable(b.BLEND),C=0,F=z.lensFlares.length;C<F;C++)H=z.lensFlares[C],0.001<H.opacity&&0.001<H.scale&&(K.x=H.x,K.y=H.y,K.z=H.z,J=H.size*H.scale/f,B.x=J*L,B.y=J,b.uniform3f(G.screenPosition,K.x,K.y,K.z),b.uniform2f(G.scale,B.x,B.y),b.uniform1f(G.rotation,H.rotation),b.uniform1f(G.opacity,
H.opacity),b.uniform3f(G.color,H.color.r,H.color.g,H.color.b),c.setBlending(H.blending,H.blendEquation,H.blendSrc,H.blendDst),c.setTexture(H.texture,1),b.drawElements(b.TRIANGLES,6,b.UNSIGNED_SHORT,0));b.enable(b.CULL_FACE);b.enable(b.DEPTH_TEST);b.depthMask(!0)}}};THREE.ShadowMapPlugin=function(){var a,b,c,d,e,f,g=new THREE.Frustum,h=new THREE.Matrix4,k=new THREE.Vector3,l=new THREE.Vector3,n=new THREE.Vector3;this.init=function(g){a=g.context;b=g;g=THREE.ShaderLib.depthRGBA;var h=THREE.UniformsUtils.clone(g.uniforms);c=new THREE.ShaderMaterial({fragmentShader:g.fragmentShader,vertexShader:g.vertexShader,uniforms:h});d=new THREE.ShaderMaterial({fragmentShader:g.fragmentShader,vertexShader:g.vertexShader,uniforms:h,morphTargets:!0});e=new THREE.ShaderMaterial({fragmentShader:g.fragmentShader,
vertexShader:g.vertexShader,uniforms:h,skinning:!0});f=new THREE.ShaderMaterial({fragmentShader:g.fragmentShader,vertexShader:g.vertexShader,uniforms:h,morphTargets:!0,skinning:!0});c._shadowPass=!0;d._shadowPass=!0;e._shadowPass=!0;f._shadowPass=!0};this.render=function(a,c){b.shadowMapEnabled&&b.shadowMapAutoUpdate&&this.update(a,c)};this.update=function(q,p){var s,t,r,v,w,u,y,L,x,N=[];v=0;a.clearColor(1,1,1,1);a.disable(a.BLEND);a.enable(a.CULL_FACE);a.frontFace(a.CCW);b.shadowMapCullFace===THREE.CullFaceFront?
a.cullFace(a.FRONT):a.cullFace(a.BACK);b.setDepthTest(!0);s=0;for(t=q.__lights.length;s<t;s++)if(r=q.__lights[s],r.castShadow)if(r instanceof THREE.DirectionalLight&&r.shadowCascade)for(w=0;w<r.shadowCascadeCount;w++){var J;if(r.shadowCascadeArray[w])J=r.shadowCascadeArray[w];else{x=r;y=w;J=new THREE.DirectionalLight;J.isVirtual=!0;J.onlyShadow=!0;J.castShadow=!0;J.shadowCameraNear=x.shadowCameraNear;J.shadowCameraFar=x.shadowCameraFar;J.shadowCameraLeft=x.shadowCameraLeft;J.shadowCameraRight=x.shadowCameraRight;
J.shadowCameraBottom=x.shadowCameraBottom;J.shadowCameraTop=x.shadowCameraTop;J.shadowCameraVisible=x.shadowCameraVisible;J.shadowDarkness=x.shadowDarkness;J.shadowBias=x.shadowCascadeBias[y];J.shadowMapWidth=x.shadowCascadeWidth[y];J.shadowMapHeight=x.shadowCascadeHeight[y];J.pointsWorld=[];J.pointsFrustum=[];var B=J.pointsWorld;u=J.pointsFrustum;for(L=0;8>L;L++)B[L]=new THREE.Vector3,u[L]=new THREE.Vector3;B=x.shadowCascadeNearZ[y];x=x.shadowCascadeFarZ[y];u[0].set(-1,-1,B);u[1].set(1,-1,B);u[2].set(-1,
1,B);u[3].set(1,1,B);u[4].set(-1,-1,x);u[5].set(1,-1,x);u[6].set(-1,1,x);u[7].set(1,1,x);J.originalCamera=p;u=new THREE.Gyroscope;u.position.copy(r.shadowCascadeOffset);u.add(J);u.add(J.target);p.add(u);r.shadowCascadeArray[w]=J;console.log("Created virtualLight",J)}y=r;B=w;x=y.shadowCascadeArray[B];x.position.copy(y.position);x.target.position.copy(y.target.position);x.lookAt(x.target);x.shadowCameraVisible=y.shadowCameraVisible;x.shadowDarkness=y.shadowDarkness;x.shadowBias=y.shadowCascadeBias[B];
u=y.shadowCascadeNearZ[B];y=y.shadowCascadeFarZ[B];x=x.pointsFrustum;x[0].z=u;x[1].z=u;x[2].z=u;x[3].z=u;x[4].z=y;x[5].z=y;x[6].z=y;x[7].z=y;N[v]=J;v++}else N[v]=r,v++;s=0;for(t=N.length;s<t;s++){r=N[s];r.shadowMap||(w=THREE.LinearFilter,b.shadowMapType===THREE.PCFSoftShadowMap&&(w=THREE.NearestFilter),r.shadowMap=new THREE.WebGLRenderTarget(r.shadowMapWidth,r.shadowMapHeight,{minFilter:w,magFilter:w,format:THREE.RGBAFormat}),r.shadowMapSize=new THREE.Vector2(r.shadowMapWidth,r.shadowMapHeight),r.shadowMatrix=
new THREE.Matrix4);if(!r.shadowCamera){if(r instanceof THREE.SpotLight)r.shadowCamera=new THREE.PerspectiveCamera(r.shadowCameraFov,r.shadowMapWidth/r.shadowMapHeight,r.shadowCameraNear,r.shadowCameraFar);else if(r instanceof THREE.DirectionalLight)r.shadowCamera=new THREE.OrthographicCamera(r.shadowCameraLeft,r.shadowCameraRight,r.shadowCameraTop,r.shadowCameraBottom,r.shadowCameraNear,r.shadowCameraFar);else{console.error("Unsupported light type for shadow");continue}q.add(r.shadowCamera);!0===
q.autoUpdate&&q.updateMatrixWorld()}r.shadowCameraVisible&&!r.cameraHelper&&(r.cameraHelper=new THREE.CameraHelper(r.shadowCamera),r.shadowCamera.add(r.cameraHelper));if(r.isVirtual&&J.originalCamera==p){w=p;v=r.shadowCamera;u=r.pointsFrustum;x=r.pointsWorld;k.set(Infinity,Infinity,Infinity);l.set(-Infinity,-Infinity,-Infinity);for(y=0;8>y;y++)B=x[y],B.copy(u[y]),THREE.ShadowMapPlugin.__projector.unprojectVector(B,w),B.applyMatrix4(v.matrixWorldInverse),B.x<k.x&&(k.x=B.x),B.x>l.x&&(l.x=B.x),B.y<k.y&&
(k.y=B.y),B.y>l.y&&(l.y=B.y),B.z<k.z&&(k.z=B.z),B.z>l.z&&(l.z=B.z);v.left=k.x;v.right=l.x;v.top=l.y;v.bottom=k.y;v.updateProjectionMatrix()}v=r.shadowMap;u=r.shadowMatrix;w=r.shadowCamera;w.position.setFromMatrixPosition(r.matrixWorld);n.setFromMatrixPosition(r.target.matrixWorld);w.lookAt(n);w.updateMatrixWorld();w.matrixWorldInverse.getInverse(w.matrixWorld);r.cameraHelper&&(r.cameraHelper.visible=r.shadowCameraVisible);r.shadowCameraVisible&&r.cameraHelper.update();u.set(0.5,0,0,0.5,0,0.5,0,0.5,
0,0,0.5,0.5,0,0,0,1);u.multiply(w.projectionMatrix);u.multiply(w.matrixWorldInverse);h.multiplyMatrices(w.projectionMatrix,w.matrixWorldInverse);g.setFromMatrix(h);b.setRenderTarget(v);b.clear();x=q.__webglObjects;r=0;for(v=x.length;r<v;r++)y=x[r],u=y.object,y.render=!1,!u.visible||!u.castShadow||(u instanceof THREE.Mesh||u instanceof THREE.ParticleSystem)&&u.frustumCulled&&!g.intersectsObject(u)||(u._modelViewMatrix.multiplyMatrices(w.matrixWorldInverse,u.matrixWorld),y.render=!0);var K;r=0;for(v=
x.length;r<v;r++)y=x[r],y.render&&(u=y.object,y=y.buffer,B=u.material instanceof THREE.MeshFaceMaterial?u.material.materials[0]:u.material,L=void 0!==u.geometry.morphTargets&&0<u.geometry.morphTargets.length&&B.morphTargets,K=u instanceof THREE.SkinnedMesh&&B.skinning,L=u.customDepthMaterial?u.customDepthMaterial:K?L?f:e:L?d:c,b.setMaterialFaces(B),y instanceof THREE.BufferGeometry?b.renderBufferDirect(w,q.__lights,null,L,y,u):b.renderBuffer(w,q.__lights,null,L,y,u));x=q.__webglObjectsImmediate;r=
0;for(v=x.length;r<v;r++)y=x[r],u=y.object,u.visible&&u.castShadow&&(u._modelViewMatrix.multiplyMatrices(w.matrixWorldInverse,u.matrixWorld),b.renderImmediateObject(w,q.__lights,null,c,u))}s=b.getClearColor();t=b.getClearAlpha();a.clearColor(s.r,s.g,s.b,t);a.enable(a.BLEND);b.shadowMapCullFace===THREE.CullFaceFront&&a.cullFace(a.BACK)}};THREE.ShadowMapPlugin.__projector=new THREE.Projector;THREE.SpritePlugin=function(){var a,b,c,d,e,f,g,h,k,l,n,q,p,s,t,r,v;function w(a,b){return a.z!==b.z?b.z-a.z:b.id-a.id}var u,y,L,x,N,J,B,K;this.init=function(w){u=w.context;y=w;x=new Float32Array([-0.5,-0.5,0,0,0.5,-0.5,1,0,0.5,0.5,1,1,-0.5,0.5,0,1]);N=new Uint16Array([0,1,2,0,2,3]);J=u.createBuffer();B=u.createBuffer();u.bindBuffer(u.ARRAY_BUFFER,J);u.bufferData(u.ARRAY_BUFFER,x,u.STATIC_DRAW);u.bindBuffer(u.ELEMENT_ARRAY_BUFFER,B);u.bufferData(u.ELEMENT_ARRAY_BUFFER,N,u.STATIC_DRAW);w=u.createProgram();
var G=u.createShader(u.VERTEX_SHADER),D=u.createShader(u.FRAGMENT_SHADER);u.shaderSource(G,["precision "+y.getPrecision()+" float;","uniform mat4 modelViewMatrix;\nuniform mat4 projectionMatrix;\nuniform float rotation;\nuniform vec2 scale;\nuniform vec2 uvOffset;\nuniform vec2 uvScale;\nattribute vec2 position;\nattribute vec2 uv;\nvarying vec2 vUV;\nvoid main() {\nvUV = uvOffset + uv * uvScale;\nvec2 alignedPosition = position * scale;\nvec2 rotatedPosition;\nrotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;\nrotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;\nvec4 finalPosition;\nfinalPosition = modelViewMatrix * vec4( 0.0, 0.0, 0.0, 1.0 );\nfinalPosition.xy += rotatedPosition;\nfinalPosition = projectionMatrix * finalPosition;\ngl_Position = finalPosition;\n}"].join("\n"));
u.shaderSource(D,["precision "+y.getPrecision()+" float;","uniform vec3 color;\nuniform sampler2D map;\nuniform float opacity;\nuniform int fogType;\nuniform vec3 fogColor;\nuniform float fogDensity;\nuniform float fogNear;\nuniform float fogFar;\nuniform float alphaTest;\nvarying vec2 vUV;\nvoid main() {\nvec4 texture = texture2D( map, vUV );\nif ( texture.a < alphaTest ) discard;\ngl_FragColor = vec4( color * texture.xyz, texture.a * opacity );\nif ( fogType > 0 ) {\nfloat depth = gl_FragCoord.z / gl_FragCoord.w;\nfloat fogFactor = 0.0;\nif ( fogType == 1 ) {\nfogFactor = smoothstep( fogNear, fogFar, depth );\n} else {\nconst float LOG2 = 1.442695;\nfloat fogFactor = exp2( - fogDensity * fogDensity * depth * depth * LOG2 );\nfogFactor = 1.0 - clamp( fogFactor, 0.0, 1.0 );\n}\ngl_FragColor = mix( gl_FragColor, vec4( fogColor, gl_FragColor.w ), fogFactor );\n}\n}"].join("\n"));
u.compileShader(G);u.compileShader(D);u.attachShader(w,G);u.attachShader(w,D);u.linkProgram(w);K=w;r=u.getAttribLocation(K,"position");v=u.getAttribLocation(K,"uv");a=u.getUniformLocation(K,"uvOffset");b=u.getUniformLocation(K,"uvScale");c=u.getUniformLocation(K,"rotation");d=u.getUniformLocation(K,"scale");e=u.getUniformLocation(K,"color");f=u.getUniformLocation(K,"map");g=u.getUniformLocation(K,"opacity");h=u.getUniformLocation(K,"modelViewMatrix");k=u.getUniformLocation(K,"projectionMatrix");l=
u.getUniformLocation(K,"fogType");n=u.getUniformLocation(K,"fogDensity");q=u.getUniformLocation(K,"fogNear");p=u.getUniformLocation(K,"fogFar");s=u.getUniformLocation(K,"fogColor");t=u.getUniformLocation(K,"alphaTest");w=document.createElement("canvas");w.width=8;w.height=8;G=w.getContext("2d");G.fillStyle="#ffffff";G.fillRect(0,0,w.width,w.height);L=new THREE.Texture(w);L.needsUpdate=!0};this.render=function(A,x,D,C){D=A.__webglSprites;if(C=D.length){u.useProgram(K);u.enableVertexAttribArray(r);
u.enableVertexAttribArray(v);u.disable(u.CULL_FACE);u.enable(u.BLEND);u.bindBuffer(u.ARRAY_BUFFER,J);u.vertexAttribPointer(r,2,u.FLOAT,!1,16,0);u.vertexAttribPointer(v,2,u.FLOAT,!1,16,8);u.bindBuffer(u.ELEMENT_ARRAY_BUFFER,B);u.uniformMatrix4fv(k,!1,x.projectionMatrix.elements);u.activeTexture(u.TEXTURE0);u.uniform1i(f,0);var F=0,z=0,H=A.fog;H?(u.uniform3f(s,H.color.r,H.color.g,H.color.b),H instanceof THREE.Fog?(u.uniform1f(q,H.near),u.uniform1f(p,H.far),u.uniform1i(l,1),z=F=1):H instanceof THREE.FogExp2&&
(u.uniform1f(n,H.density),u.uniform1i(l,2),z=F=2)):(u.uniform1i(l,0),z=F=0);for(var E,N=[],H=0;H<C;H++)E=D[H],!1!==E.visible&&(E._modelViewMatrix.multiplyMatrices(x.matrixWorldInverse,E.matrixWorld),E.z=-E._modelViewMatrix.elements[14]);D.sort(w);for(H=0;H<C;H++)E=D[H],!1!==E.visible&&(x=E.material,u.uniform1f(t,x.alphaTest),u.uniformMatrix4fv(h,!1,E._modelViewMatrix.elements),N[0]=E.scale.x,N[1]=E.scale.y,E=A.fog&&x.fog?z:0,F!==E&&(u.uniform1i(l,E),F=E),null!==x.map?(u.uniform2f(a,x.map.offset.x,
x.map.offset.y),u.uniform2f(b,x.map.repeat.x,x.map.repeat.y)):(u.uniform2f(a,0,0),u.uniform2f(b,1,1)),u.uniform1f(g,x.opacity),u.uniform3f(e,x.color.r,x.color.g,x.color.b),u.uniform1f(c,x.rotation),u.uniform2fv(d,N),y.setBlending(x.blending,x.blendEquation,x.blendSrc,x.blendDst),y.setDepthTest(x.depthTest),y.setDepthWrite(x.depthWrite),x.map&&x.map.image&&x.map.image.width?y.setTexture(x.map,0):y.setTexture(L,0),u.drawElements(u.TRIANGLES,6,u.UNSIGNED_SHORT,0));u.enable(u.CULL_FACE)}}};THREE.DepthPassPlugin=function(){this.enabled=!1;this.renderTarget=null;var a,b,c,d,e,f,g=new THREE.Frustum,h=new THREE.Matrix4;this.init=function(g){a=g.context;b=g;g=THREE.ShaderLib.depthRGBA;var h=THREE.UniformsUtils.clone(g.uniforms);c=new THREE.ShaderMaterial({fragmentShader:g.fragmentShader,vertexShader:g.vertexShader,uniforms:h});d=new THREE.ShaderMaterial({fragmentShader:g.fragmentShader,vertexShader:g.vertexShader,uniforms:h,morphTargets:!0});e=new THREE.ShaderMaterial({fragmentShader:g.fragmentShader,
vertexShader:g.vertexShader,uniforms:h,skinning:!0});f=new THREE.ShaderMaterial({fragmentShader:g.fragmentShader,vertexShader:g.vertexShader,uniforms:h,morphTargets:!0,skinning:!0});c._shadowPass=!0;d._shadowPass=!0;e._shadowPass=!0;f._shadowPass=!0};this.render=function(a,b){this.enabled&&this.update(a,b)};this.update=function(k,l){var n,q,p,s,t,r;a.clearColor(1,1,1,1);a.disable(a.BLEND);b.setDepthTest(!0);!0===k.autoUpdate&&k.updateMatrixWorld();l.matrixWorldInverse.getInverse(l.matrixWorld);h.multiplyMatrices(l.projectionMatrix,
l.matrixWorldInverse);g.setFromMatrix(h);b.setRenderTarget(this.renderTarget);b.clear();r=k.__webglObjects;n=0;for(q=r.length;n<q;n++)p=r[n],t=p.object,p.render=!1,!t.visible||(t instanceof THREE.Mesh||t instanceof THREE.ParticleSystem)&&t.frustumCulled&&!g.intersectsObject(t)||(t._modelViewMatrix.multiplyMatrices(l.matrixWorldInverse,t.matrixWorld),p.render=!0);var v;n=0;for(q=r.length;n<q;n++)p=r[n],p.render&&(t=p.object,p=p.buffer,t instanceof THREE.ParticleSystem&&!t.customDepthMaterial||((v=
t.material instanceof THREE.MeshFaceMaterial?t.material.materials[0]:t.material)&&b.setMaterialFaces(t.material),s=void 0!==t.geometry.morphTargets&&0<t.geometry.morphTargets.length&&v.morphTargets,v=t instanceof THREE.SkinnedMesh&&v.skinning,s=t.customDepthMaterial?t.customDepthMaterial:v?s?f:e:s?d:c,p instanceof THREE.BufferGeometry?b.renderBufferDirect(l,k.__lights,null,s,p,t):b.renderBuffer(l,k.__lights,null,s,p,t)));r=k.__webglObjectsImmediate;n=0;for(q=r.length;n<q;n++)p=r[n],t=p.object,t.visible&&
(t._modelViewMatrix.multiplyMatrices(l.matrixWorldInverse,t.matrixWorld),b.renderImmediateObject(l,k.__lights,null,c,t));n=b.getClearColor();q=b.getClearAlpha();a.clearColor(n.r,n.g,n.b,q);a.enable(a.BLEND)}};THREE.ShaderFlares={lensFlareVertexTexture:{vertexShader:"uniform lowp int renderType;\nuniform vec3 screenPosition;\nuniform vec2 scale;\nuniform float rotation;\nuniform sampler2D occlusionMap;\nattribute vec2 position;\nattribute vec2 uv;\nvarying vec2 vUV;\nvarying float vVisibility;\nvoid main() {\nvUV = uv;\nvec2 pos = position;\nif( renderType == 2 ) {\nvec4 visibility = texture2D( occlusionMap, vec2( 0.1, 0.1 ) );\nvisibility += texture2D( occlusionMap, vec2( 0.5, 0.1 ) );\nvisibility += texture2D( occlusionMap, vec2( 0.9, 0.1 ) );\nvisibility += texture2D( occlusionMap, vec2( 0.9, 0.5 ) );\nvisibility += texture2D( occlusionMap, vec2( 0.9, 0.9 ) );\nvisibility += texture2D( occlusionMap, vec2( 0.5, 0.9 ) );\nvisibility += texture2D( occlusionMap, vec2( 0.1, 0.9 ) );\nvisibility += texture2D( occlusionMap, vec2( 0.1, 0.5 ) );\nvisibility += texture2D( occlusionMap, vec2( 0.5, 0.5 ) );\nvVisibility =        visibility.r / 9.0;\nvVisibility *= 1.0 - visibility.g / 9.0;\nvVisibility *=       visibility.b / 9.0;\nvVisibility *= 1.0 - visibility.a / 9.0;\npos.x = cos( rotation ) * position.x - sin( rotation ) * position.y;\npos.y = sin( rotation ) * position.x + cos( rotation ) * position.y;\n}\ngl_Position = vec4( ( pos * scale + screenPosition.xy ).xy, screenPosition.z, 1.0 );\n}",
fragmentShader:"uniform lowp int renderType;\nuniform sampler2D map;\nuniform float opacity;\nuniform vec3 color;\nvarying vec2 vUV;\nvarying float vVisibility;\nvoid main() {\nif( renderType == 0 ) {\ngl_FragColor = vec4( 1.0, 0.0, 1.0, 0.0 );\n} else if( renderType == 1 ) {\ngl_FragColor = texture2D( map, vUV );\n} else {\nvec4 texture = texture2D( map, vUV );\ntexture.a *= opacity * vVisibility;\ngl_FragColor = texture;\ngl_FragColor.rgb *= color;\n}\n}"},lensFlare:{vertexShader:"uniform lowp int renderType;\nuniform vec3 screenPosition;\nuniform vec2 scale;\nuniform float rotation;\nattribute vec2 position;\nattribute vec2 uv;\nvarying vec2 vUV;\nvoid main() {\nvUV = uv;\nvec2 pos = position;\nif( renderType == 2 ) {\npos.x = cos( rotation ) * position.x - sin( rotation ) * position.y;\npos.y = sin( rotation ) * position.x + cos( rotation ) * position.y;\n}\ngl_Position = vec4( ( pos * scale + screenPosition.xy ).xy, screenPosition.z, 1.0 );\n}",
fragmentShader:"precision mediump float;\nuniform lowp int renderType;\nuniform sampler2D map;\nuniform sampler2D occlusionMap;\nuniform float opacity;\nuniform vec3 color;\nvarying vec2 vUV;\nvoid main() {\nif( renderType == 0 ) {\ngl_FragColor = vec4( texture2D( map, vUV ).rgb, 0.0 );\n} else if( renderType == 1 ) {\ngl_FragColor = texture2D( map, vUV );\n} else {\nfloat visibility = texture2D( occlusionMap, vec2( 0.5, 0.1 ) ).a;\nvisibility += texture2D( occlusionMap, vec2( 0.9, 0.5 ) ).a;\nvisibility += texture2D( occlusionMap, vec2( 0.5, 0.9 ) ).a;\nvisibility += texture2D( occlusionMap, vec2( 0.1, 0.5 ) ).a;\nvisibility = ( 1.0 - visibility / 4.0 );\nvec4 texture = texture2D( map, vUV );\ntexture.a *= opacity * visibility;\ngl_FragColor = texture;\ngl_FragColor.rgb *= color;\n}\n}"}};

/**
 * @author Eberhard Graether / http://egraether.com/
 * @author Mark Lundin 	/ http://mark-lundin.com
 */

THREE.TrackballControls = function ( object, domElement ) {

	var _this = this;
	var STATE = { NONE: -1, ROTATE: 0, ZOOM: 1, PAN: 2, TOUCH_ROTATE: 3, TOUCH_ZOOM: 4, TOUCH_PAN: 5 };

	this.object = object;
	this.domElement = ( domElement !== undefined ) ? domElement : document;

	// API

	this.enabled = true;

	this.screen = { left: 0, top: 0, width: 0, height: 0 };

	this.rotateSpeed = 1.0;
	this.zoomSpeed = 1.2;
	this.panSpeed = 0.3;

	this.noRotate = false;
	this.noZoom = false;
	this.noPan = false;
	this.noRoll = false;

	this.staticMoving = false;
	this.dynamicDampingFactor = 0.2;

	this.minDistance = 1200;
	this.maxDistance = 5000; /* simple modification */

	this.keys = [ 65 /*A*/, 83 /*S*/, 68 /*D*/ ];

	// internals

	this.target = new THREE.Vector3();

	var EPS = 0.000001;

	var lastPosition = new THREE.Vector3();

	var _state = STATE.NONE,
	_prevState = STATE.NONE,

	_eye = new THREE.Vector3(),

	_rotateStart = new THREE.Vector3(),
	_rotateEnd = new THREE.Vector3(),

	_zoomStart = new THREE.Vector2(),
	_zoomEnd = new THREE.Vector2(),

	_touchZoomDistanceStart = 0,
	_touchZoomDistanceEnd = 0,

	_panStart = new THREE.Vector2(),
	_panEnd = new THREE.Vector2();

	// for reset

	this.target0 = this.target.clone();
	this.position0 = this.object.position.clone();
	this.up0 = this.object.up.clone();

	// events

	var changeEvent = { type: 'change' };
	var startEvent = { type: 'start'};
	var endEvent = { type: 'end'};


	// methods

	this.handleResize = function () {

		if ( this.domElement === document ) {

			this.screen.left = 0;
			this.screen.top = 0;
			this.screen.width = window.innerWidth;
			this.screen.height = window.innerHeight;

		} else {

			var box = this.domElement.getBoundingClientRect();
			// adjustments come from similar code in the jquery offset() function
			var d = this.domElement.ownerDocument.documentElement;
			this.screen.left = box.left + window.pageXOffset - d.clientLeft;
			this.screen.top = box.top + window.pageYOffset - d.clientTop;
			this.screen.width = box.width;
			this.screen.height = box.height;

		}

	};

	this.handleEvent = function ( event ) {

		if ( typeof this[ event.type ] == 'function' ) {

			this[ event.type ]( event );

		}

	};

	this.getMouseOnScreen = function ( pageX, pageY, vector ) {

		return vector.set(
			( pageX - _this.screen.left ) / _this.screen.width,
			( pageY - _this.screen.top ) / _this.screen.height
		);

	};

	this.getMouseProjectionOnBall = (function(){

		var objectUp = new THREE.Vector3(),
		    mouseOnBall = new THREE.Vector3();


		return function ( pageX, pageY, projection ) {

			mouseOnBall.set(
				( pageX - _this.screen.width * 0.5 - _this.screen.left ) / (_this.screen.width*.5),
				( _this.screen.height * 0.5 + _this.screen.top - pageY ) / (_this.screen.height*.5),
				0.0
			);

			var length = mouseOnBall.length();

			if ( _this.noRoll ) {

				if ( length < Math.SQRT1_2 ) {

					mouseOnBall.z = Math.sqrt( 1.0 - length*length );

				} else {

					mouseOnBall.z = .5 / length;
					
				}

			} else if ( length > 1.0 ) {

				mouseOnBall.normalize();

			} else {

				mouseOnBall.z = Math.sqrt( 1.0 - length * length );

			}

			_eye.copy( _this.object.position ).sub( _this.target );

			projection.copy( _this.object.up ).setLength( mouseOnBall.y )
			projection.add( objectUp.copy( _this.object.up ).cross( _eye ).setLength( mouseOnBall.x ) );
			projection.add( _eye.setLength( mouseOnBall.z ) );

			return projection;
		}

	}());

	this.rotateCamera = (function(){

		var axis = new THREE.Vector3(),
			quaternion = new THREE.Quaternion();


		return function () {

			var angle = Math.acos( _rotateStart.dot( _rotateEnd ) / _rotateStart.length() / _rotateEnd.length() );

			if ( angle ) {

				axis.crossVectors( _rotateStart, _rotateEnd ).normalize();

				angle *= _this.rotateSpeed;

				quaternion.setFromAxisAngle( axis, -angle );

				_eye.applyQuaternion( quaternion );
				_this.object.up.applyQuaternion( quaternion );

				_rotateEnd.applyQuaternion( quaternion );

				if ( _this.staticMoving ) {

					_rotateStart.copy( _rotateEnd );

				} else {

					quaternion.setFromAxisAngle( axis, angle * ( _this.dynamicDampingFactor - 1.0 ) );
					_rotateStart.applyQuaternion( quaternion );

				}

			}
		}

	}());

	this.zoomCamera = function () {

		if ( _state === STATE.TOUCH_ZOOM ) {

			var factor = _touchZoomDistanceStart / _touchZoomDistanceEnd;
			_touchZoomDistanceStart = _touchZoomDistanceEnd;
			_eye.multiplyScalar( factor );

		} else {

			var factor = 1.0 + ( _zoomEnd.y - _zoomStart.y ) * _this.zoomSpeed;

			if ( factor !== 1.0 && factor > 0.0 ) {

				_eye.multiplyScalar( factor );

				if ( _this.staticMoving ) {

					_zoomStart.copy( _zoomEnd );

				} else {

					_zoomStart.y += ( _zoomEnd.y - _zoomStart.y ) * this.dynamicDampingFactor;

				}

			}

		}

	};

	this.panCamera = (function(){

		var mouseChange = new THREE.Vector2(),
			objectUp = new THREE.Vector3(),
			pan = new THREE.Vector3();

		return function () {

			mouseChange.copy( _panEnd ).sub( _panStart );

			if ( mouseChange.lengthSq() ) {

				mouseChange.multiplyScalar( _eye.length() * _this.panSpeed );

				pan.copy( _eye ).cross( _this.object.up ).setLength( mouseChange.x );
				pan.add( objectUp.copy( _this.object.up ).setLength( mouseChange.y ) );

				_this.object.position.add( pan );
				_this.target.add( pan );

				if ( _this.staticMoving ) {

					_panStart.copy( _panEnd );

				} else {

					_panStart.add( mouseChange.subVectors( _panEnd, _panStart ).multiplyScalar( _this.dynamicDampingFactor ) );

				}

			}
		}

	}());

	this.checkDistances = function () {

		if ( !_this.noZoom || !_this.noPan ) {

			if ( _eye.lengthSq() > _this.maxDistance * _this.maxDistance ) {

				_this.object.position.addVectors( _this.target, _eye.setLength( _this.maxDistance ) );

			}

			if ( _eye.lengthSq() < _this.minDistance * _this.minDistance ) {

				_this.object.position.addVectors( _this.target, _eye.setLength( _this.minDistance ) );

			}

		}

	};

	this.update = function () {

		_eye.subVectors( _this.object.position, _this.target );

		if ( !_this.noRotate ) {

			_this.rotateCamera();

		}

		if ( !_this.noZoom ) {

			_this.zoomCamera();

		}

		if ( !_this.noPan ) {

			_this.panCamera();

		}

		_this.object.position.addVectors( _this.target, _eye );

		_this.checkDistances();

		_this.object.lookAt( _this.target );

		if ( lastPosition.distanceToSquared( _this.object.position ) > EPS ) {

			_this.dispatchEvent( changeEvent );

			lastPosition.copy( _this.object.position );

		}

	};

	this.reset = function () {

		_state = STATE.NONE;
		_prevState = STATE.NONE;

		_this.target.copy( _this.target0 );
		_this.object.position.copy( _this.position0 );
		_this.object.up.copy( _this.up0 );

		_eye.subVectors( _this.object.position, _this.target );

		_this.object.lookAt( _this.target );

		_this.dispatchEvent( changeEvent );

		lastPosition.copy( _this.object.position );

	};

	// listeners

	function keydown( event ) {

		if ( _this.enabled === false ) return;

		window.removeEventListener( 'keydown', keydown );

		_prevState = _state;

		if ( _state !== STATE.NONE ) {

			return;

		} else if ( event.keyCode === _this.keys[ STATE.ROTATE ] && !_this.noRotate ) {

			_state = STATE.ROTATE;

		} else if ( event.keyCode === _this.keys[ STATE.ZOOM ] && !_this.noZoom ) {

			_state = STATE.ZOOM;

		} else if ( event.keyCode === _this.keys[ STATE.PAN ] && !_this.noPan ) {

			_state = STATE.PAN;

		}

	}

	function keyup( event ) {

		if ( _this.enabled === false ) return;

		_state = _prevState;

		window.addEventListener( 'keydown', keydown, false );

	}

	function mousedown( event ) {

		if ( _this.enabled === false ) return;

		// event.preventDefault();
		// event.stopPropagation();

		if ( _state === STATE.NONE ) {

			_state = event.button;

		}

		if ( _state === STATE.ROTATE && !_this.noRotate ) {

			_this.getMouseProjectionOnBall( event.pageX, event.pageY, _rotateStart );
			_rotateEnd.copy(_rotateStart)

		} else if ( _state === STATE.ZOOM && !_this.noZoom ) {

			_this.getMouseOnScreen( event.pageX, event.pageY, _zoomStart );
			_zoomEnd.copy(_zoomStart);

		} else if ( _state === STATE.PAN && !_this.noPan ) {

			_this.getMouseOnScreen( event.pageX, event.pageY, _panStart );
			_panEnd.copy(_panStart)

		}

		document.addEventListener( 'mousemove', mousemove, false );
		document.addEventListener( 'mouseup', mouseup, false );
		_this.dispatchEvent( startEvent );


	}

	function mousemove( event ) {

		if ( _this.enabled === false ) return;

		// event.preventDefault();
		// event.stopPropagation();

		if ( _state === STATE.ROTATE && !_this.noRotate ) {

			_this.getMouseProjectionOnBall( event.pageX, event.pageY, _rotateEnd );

		} else if ( _state === STATE.ZOOM && !_this.noZoom ) {

			_this.getMouseOnScreen( event.pageX, event.pageY, _zoomEnd );

		} else if ( _state === STATE.PAN && !_this.noPan ) {

			_this.getMouseOnScreen( event.pageX, event.pageY, _panEnd );

		}

	}

	function mouseup( event ) {

		if ( _this.enabled === false ) return;

		// event.preventDefault();
		// event.stopPropagation();

		_state = STATE.NONE;

		document.removeEventListener( 'mousemove', mousemove );
		document.removeEventListener( 'mouseup', mouseup );
		_this.dispatchEvent( endEvent );

	}

	function mousewheel( event ) {

		if ( _this.enabled === false ) return;

		event.preventDefault();
		event.stopPropagation();

		var delta = 0;

		if ( event.wheelDelta ) { // WebKit / Opera / Explorer 9

			delta = event.wheelDelta / 40;

		} else if ( event.detail ) { // Firefox

			delta = - event.detail / 3;

		}

		_zoomStart.y += delta * 0.01;
		_this.dispatchEvent( startEvent );
		_this.dispatchEvent( endEvent );

	}

	function touchstart( event ) {

		if ( _this.enabled === false ) return;

		switch ( event.touches.length ) {

			case 1:
				_state = STATE.TOUCH_ROTATE;
				_rotateEnd.copy( _this.getMouseProjectionOnBall( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY, _rotateStart ));
				break;

			case 2:
				_state = STATE.TOUCH_ZOOM;
				var dx = event.touches[ 0 ].pageX - event.touches[ 1 ].pageX;
				var dy = event.touches[ 0 ].pageY - event.touches[ 1 ].pageY;
				_touchZoomDistanceEnd = _touchZoomDistanceStart = Math.sqrt( dx * dx + dy * dy );
				break;

			case 3:
				_state = STATE.TOUCH_PAN;
				_panEnd.copy( _this.getMouseOnScreen( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY, _panStart ));
				break;

			default:
				_state = STATE.NONE;

		}
		_this.dispatchEvent( startEvent );


	}

	function touchmove( event ) {

		if ( _this.enabled === false ) return;

		event.preventDefault();
		event.stopPropagation();

		switch ( event.touches.length ) {

			case 1:
				_this.getMouseProjectionOnBall( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY, _rotateEnd );
				break;

			case 2:
				var dx = event.touches[ 0 ].pageX - event.touches[ 1 ].pageX;
				var dy = event.touches[ 0 ].pageY - event.touches[ 1 ].pageY;
				_touchZoomDistanceEnd = Math.sqrt( dx * dx + dy * dy )
				break;

			case 3:
				_this.getMouseOnScreen( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY, _panEnd );
				break;

			default:
				_state = STATE.NONE;

		}

	}

	function touchend( event ) {

		if ( _this.enabled === false ) return;

		switch ( event.touches.length ) {

			case 1:
				_rotateStart.copy( _this.getMouseProjectionOnBall( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY, _rotateEnd ));
				break;

			case 2:
				_touchZoomDistanceStart = _touchZoomDistanceEnd = 0;
				break;

			case 3:
				_panStart.copy( _this.getMouseOnScreen( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY, _panEnd ));
				break;

		}

		_state = STATE.NONE;
		_this.dispatchEvent( endEvent );

	}

	this.domElement.addEventListener( 'contextmenu', function ( event ) { event.preventDefault(); }, false );

	this.domElement.addEventListener( 'mousedown', mousedown, false );

	this.domElement.addEventListener( 'mousewheel', mousewheel, false );
	this.domElement.addEventListener( 'DOMMouseScroll', mousewheel, false ); // firefox

	this.domElement.addEventListener( 'touchstart', touchstart, false );
	this.domElement.addEventListener( 'touchend', touchend, false );
	this.domElement.addEventListener( 'touchmove', touchmove, false );

	window.addEventListener( 'keydown', keydown, false );
	window.addEventListener( 'keyup', keyup, false );

	this.handleResize();

	// force an update at start
	this.update();

};

THREE.TrackballControls.prototype = Object.create( THREE.EventDispatcher.prototype );

/**
 * Based on http://www.emagix.net/academic/mscs-project/item/camera-sync-with-css3-and-webgl-threejs
 * @author mrdoob / http://mrdoob.com/
 */

THREE.CSS3DObject = function ( element ) {

	THREE.Object3D.call( this );

	this.element = element;
	this.element.style.position = 'absolute';

	this.addEventListener( 'removed', function ( event ) {

		if ( this.element.parentNode !== null ) {

			this.element.parentNode.removeChild( this.element );

			for ( var i = 0, l = this.children.length; i < l; i ++ ) {

				this.children[ i ].dispatchEvent( event );

			}

		}

	} );

};

THREE.CSS3DObject.prototype = Object.create( THREE.Object3D.prototype );

THREE.CSS3DSprite = function ( element ) {

	THREE.CSS3DObject.call( this, element );

};

THREE.CSS3DSprite.prototype = Object.create( THREE.CSS3DObject.prototype );

//

THREE.CSS3DRenderer = function () {

	console.log( 'THREE.CSS3DRenderer', THREE.REVISION );

	var _width, _height;
	var _widthHalf, _heightHalf;

	var matrix = new THREE.Matrix4();

	var domElement = document.createElement( 'div' );
	domElement.style.overflow = 'hidden';

	domElement.style.WebkitTransformStyle = 'preserve-3d';
	domElement.style.MozTransformStyle = 'preserve-3d';
	domElement.style.oTransformStyle = 'preserve-3d';
	domElement.style.transformStyle = 'preserve-3d';

	this.domElement = domElement;

	var cameraElement = document.createElement( 'div' );

	cameraElement.style.WebkitTransformStyle = 'preserve-3d';
	cameraElement.style.MozTransformStyle = 'preserve-3d';
	cameraElement.style.oTransformStyle = 'preserve-3d';
	cameraElement.style.transformStyle = 'preserve-3d';

	domElement.appendChild( cameraElement );

	this.setClearColor = function () {

	};

	this.setSize = function ( width, height ) {

		_width = width;
		_height = height;

		_widthHalf = _width / 2;
		_heightHalf = _height / 2;

		domElement.style.width = width + 'px';
		domElement.style.height = height + 'px';

		cameraElement.style.width = width + 'px';
		cameraElement.style.height = height + 'px';

	};

	var epsilon = function ( value ) {

		return Math.abs( value ) < 0.000001 ? 0 : value;

	};

	var getCameraCSSMatrix = function ( matrix ) {

		var elements = matrix.elements;

		return 'matrix3d(' +
			epsilon( elements[ 0 ] ) + ',' +
			epsilon( - elements[ 1 ] ) + ',' +
			epsilon( elements[ 2 ] ) + ',' +
			epsilon( elements[ 3 ] ) + ',' +
			epsilon( elements[ 4 ] ) + ',' +
			epsilon( - elements[ 5 ] ) + ',' +
			epsilon( elements[ 6 ] ) + ',' +
			epsilon( elements[ 7 ] ) + ',' +
			epsilon( elements[ 8 ] ) + ',' +
			epsilon( - elements[ 9 ] ) + ',' +
			epsilon( elements[ 10 ] ) + ',' +
			epsilon( elements[ 11 ] ) + ',' +
			epsilon( elements[ 12 ] ) + ',' +
			epsilon( - elements[ 13 ] ) + ',' +
			epsilon( elements[ 14 ] ) + ',' +
			epsilon( elements[ 15 ] ) +
		')';

	};

	var getObjectCSSMatrix = function ( matrix ) {

		var elements = matrix.elements;

		return 'translate3d(-50%,-50%,0) matrix3d(' +
			epsilon( elements[ 0 ] ) + ',' +
			epsilon( elements[ 1 ] ) + ',' +
			epsilon( elements[ 2 ] ) + ',' +
			epsilon( elements[ 3 ] ) + ',' +
			epsilon( - elements[ 4 ] ) + ',' +
			epsilon( - elements[ 5 ] ) + ',' +
			epsilon( - elements[ 6 ] ) + ',' +
			epsilon( - elements[ 7 ] ) + ',' +
			epsilon( elements[ 8 ] ) + ',' +
			epsilon( elements[ 9 ] ) + ',' +
			epsilon( elements[ 10 ] ) + ',' +
			epsilon( elements[ 11 ] ) + ',' +
			epsilon( elements[ 12 ] ) + ',' +
			epsilon( elements[ 13 ] ) + ',' +
			epsilon( elements[ 14 ] ) + ',' +
			epsilon( elements[ 15 ] ) +
		')';

	};

	var renderObject = function ( object, camera ) {

		if ( object instanceof THREE.CSS3DObject ) {

			var style;

			if ( object instanceof THREE.CSS3DSprite ) {

				// http://swiftcoder.wordpress.com/2008/11/25/constructing-a-billboard-matrix/

				matrix.copy( camera.matrixWorldInverse );
				matrix.transpose();
				matrix.copyPosition( object.matrixWorld );
				matrix.scale( object.scale );

				matrix.elements[ 3 ] = 0;
				matrix.elements[ 7 ] = 0;
				matrix.elements[ 11 ] = 0;
				matrix.elements[ 15 ] = 1;

				style = getObjectCSSMatrix( matrix );

			} else {

				style = getObjectCSSMatrix( object.matrixWorld );

			}

			var element = object.element;

			element.style.WebkitTransform = style;
			element.style.MozTransform = style;
			element.style.oTransform = style;
			element.style.transform = style;

			if ( element.parentNode !== cameraElement ) {

				cameraElement.appendChild( element );

			}

		}

		for ( var i = 0, l = object.children.length; i < l; i ++ ) {

			renderObject( object.children[ i ], camera );

		}

	};

	this.render = function ( scene, camera ) {

		var fov = 0.5 / Math.tan( THREE.Math.degToRad( camera.fov * 0.5 ) ) * _height;

		domElement.style.WebkitPerspective = fov + "px";
		domElement.style.MozPerspective = fov + "px";
		domElement.style.oPerspective = fov + "px";
		domElement.style.perspective = fov + "px";

		scene.updateMatrixWorld();

		if ( camera.parent === undefined ) camera.updateMatrixWorld();

		camera.matrixWorldInverse.getInverse( camera.matrixWorld );

		var style = "translate3d(0,0," + fov + "px)" + getCameraCSSMatrix( camera.matrixWorldInverse ) +
			" translate3d(" + _widthHalf + "px," + _heightHalf + "px, 0)";

		cameraElement.style.WebkitTransform = style;
		cameraElement.style.MozTransform = style;
		cameraElement.style.oTransform = style;
		cameraElement.style.transform = style;

		renderObject( scene, camera );

	};

};

THREE.PDBParser = function() { };


function Residue(name, residue) {
    this.atoms = [];
    this.name = name; // g a c u
    this.id = residue; // A1401
}

function BasePair(res1, res2, r, c) {
	this.residue1 = res1;
	this.residue2 = res2;
	this.rotation = r;
	this.center = c;
	this.atoms = []
	this.bp_type = ""
}

function PDBModel (id) {
	this.id = id;
	this.atoms = {};
	this.atommap = {};
	this.bonds = [];
	this.bhash = {};
	this.residues = [];
	this.residueObjs = [];
	this.sequence = {};
}

THREE.PDBParser.prototype = {
	constructor: THREE.OBJLoader,

	loadBonds: true,
	createBonds: false,
	
	colors: { "h":[255, 255, 192], "he":[217, 255, 255], "li":[204, 128, 255], "be":[194, 255, 0], "b":[255, 181, 181], "c":[80, 80, 80], "n":[130, 199, 222], "o":[255, 50, 50], "f":[144, 224, 80], "ne":[179, 227, 245], "na":[171, 92, 242], "mg":[138, 255, 0], "al":[191, 166, 166], "si":[240, 200, 160], "p":[255, 128, 0], "s":[255, 255, 48], "cl":[31, 240, 31], "ar":[128, 209, 227], "k":[143, 64, 212], "ca":[61, 255, 0], "sc":[230, 230, 230], "ti":[191, 194, 199], "v":[166, 166, 171], "cr":[138, 153, 199], "mn":[155, 122, 199], "fe":[224, 102, 51], "co":[240, 144, 160], "ni":[80, 208, 80], "cu":[200, 128, 51], "zn":[125, 128, 176], "ga":[194, 143, 143], "ge":[102, 143, 143], "as":[189, 128, 227], "se":[255, 161, 0], "br":[166, 41, 41], "kr":[92, 184, 209], "rb":[112, 46, 176], "sr":[0, 255, 0], "y":[148, 255, 255], "zr":[148, 224, 224], "nb":[115, 194, 201], "mo":[84, 181, 181], "tc":[59, 158, 158], "ru":[36, 143, 143], "rh":[10, 125, 140], "pd":[0, 105, 133], "ag":[192, 192, 192], "cd":[255, 217, 143], "in":[166, 117, 115], "sn":[102, 128, 128], "sb":[158, 99, 181], "te":[212, 122, 0], "i":[148, 0, 148], "xe":[66, 158, 176], "cs":[87, 23, 143], "ba":[0, 201, 0], "la":[112, 212, 255], "ce":[255, 255, 199], "pr":[217, 255, 199], "nd":[199, 255, 199], "pm":[163, 255, 199], "sm":[143, 255, 199], "eu":[97, 255, 199], "gd":[69, 255, 199], "tb":[48, 255, 199], "dy":[31, 255, 199], "ho":[0, 255, 156], "er":[0, 230, 117], "tm":[0, 212, 82], "yb":[0, 191, 56], "lu":[0, 171, 36], "hf":[77, 194, 255], "ta":[77, 166, 255], "w":[33, 148, 214], "re":[38, 125, 171], "os":[38, 102, 150], "ir":[23, 84, 135], "pt":[208, 208, 224], "au":[255, 209, 35], "hg":[184, 184, 208], "tl":[166, 84, 77], "pb":[87, 89, 97], "bi":[158, 79, 181], "po":[171, 92, 0], "at":[117, 79, 69], "rn":[66, 130, 150], "fr":[66, 0, 102], "ra":[0, 125, 0], "ac":[112, 171, 250], "th":[0, 186, 255], "pa":[0, 161, 255], "u":[0, 143, 255], "np":[0, 128, 255], "pu":[0, 107, 255], "am":[84, 92, 242], "cm":[120, 92, 227], "bk":[138, 79, 227], "cf":[161, 54, 212], "es":[179, 31, 212], "fm":[179, 31, 186], "md":[179, 13, 166], "no":[189, 13, 135], "lr":[199, 0, 102], "rf":[204, 0, 89], "db":[209, 0, 79], "sg":[217, 0, 69], "bh":[224, 0, 56], "hs":[230, 0, 46], "mt":[235, 0, 38], "ds":[235, 0, 38], "rg":[235, 0, 38]},
	rulesG: {"o5'" : ["c5'" ], "o4'" : ["c1'" ], "n1" : ["h1", "c6" ], "n2" : ["h21", "h22" ], "o2'" : ["h2'" ], "n9" : ["c4", "c8" ], "c2" : ["n2", "n1", "*n3" ], "p" : ["op1", "op2", "o5'", "op3" ], "op3" : ["ho5'"], "c4" : ["n3", "*c5" ], "c5" : ["n7" ], "c6" : ["c5", "*o6" ], "c5'" : ["c4'", "h5'", "h5''" ], "c8" : ["h8" ], "c3'" : ["o3'", "h3'" ], "c4'" : ["o4'", "c3'", "h4'" ], "c1'" : ["n9", "c2'", "h1'" ], "c2'" : ["c3'", "o2'", "h2''"], "n7" : ["*c8"]},
	rulesA: {"o5'" : ["c5'" ], "o4'" : ["c1'" ], "o2'" : ["h2'" ], "n6" : ["h61", "h62" ], "n9" : ["c4", "c8" ], "c2" : ["n1", "h2", "*n3" ], "p" : ["op1", "op2", "o5'" ], "c4" : ["n3", "*c5" ], "c5" : ["n7" ], "c6" : ["n6", "c5" ], "c5'" : ["c4'", "h5'", "h5''" ], "c8" : ["h8" ], "c3'" : ["o3'", "h3'" ], "c4'" : ["o4'", "c3'", "h4'" ], "c1'" : ["n9", "c2'", "h1'" ], "c2'" : ["c3'", "o2'", "h2''" ], "n1" : ["*c6"], "n7" : ["*c8"]},
	rulesC: {"ho3'" : ["o3'"], "o5'" : ["c5'" ], "o4'" : ["c1'" ], "n1" : ["c2", "c6" ], "o2'" : ["h2'" ], "n4" : ["h41", "h42" ], "c2" : ["n3", "*o2" ], "p" : ["op1", "op2", "o5'" ], "c4" : ["n4", "c5" ], "c5" : ["h5", "*c6" ], "c6" : ["h6" ], "c5'" : ["c4'", "h5'", "h5''" ], "c3'" : ["o3'", "h3'" ], "c4'" : ["o4'", "c3'", "h4'" ], "c1'" : ["n1", "c2'", "h1'" ], "c2'" : ["c3'", "o2'", "h2''" ], "n3" : ["*c4"]},
	rulesT: { "o5'" : ["c5'" ], "o4'" : ["c1'" ], "n1" : ["c2", "c6" ], "n3" : ["h3", "c4" ], "o2'" : ["h2'" ], "c2" : ["n3", "*o2" ], "p" : ["op1", "op2", "o5'" ], "c4" : ["c5", "*o4" ], "c5" : ["c5m", "*c6" ], "c6" : ["h6" ], "c5'" : ["c4'", "h5'", "h5''" ], "c3'" : ["o3'", "h3'" ], "c4'" : ["o4'", "c3'", "h4'" ], "c1'" : ["n1", "c2'", "h1'" ], "c2'" : ["c3'", "o2'", "h2''" ], "c5m" : ["h51", "h52", "h53" ]},
	rulesU: { "o5'" : ["c5'" ], "o4'" : ["c1'" ], "n1" : ["c2", "c6" ], "n3" : ["h3", "c4" ], "o2'" : ["h2'" ], "c2" : ["n3", "*o2" ], "p" : ["op1", "op2", "o5'" ], "c4" : ["c5", "*o4" ], "c5" : ["h5", "*c6" ], "c6" : ["h6" ], "c5'" : ["c4'", "h5'", "h5''" ], "c3'" : ["o3'", "h3'" ], "c4'" : ["o4'", "c3'", "h4'" ], "c1'" : ["n1", "c2'", "h1'" ], "c2'" : ["c3'", "o2'", "h2''" ]},

	loadFile: function(url, pdbCallback, datCallback, dssrCallback) {
		this.loadAjaxFile("/workbranch_vineet/frontend/jscripts/eterna3/" + url, pdbCallback, 1, this);
		this.loadAjaxFile("/workbranch_vineet/frontend/jscripts/eterna3/" + url.substring(0, url.lastIndexOf("/")) +"/ref_frames.dat", datCallback, 0, this);
		this.loadAjaxFile("/workbranch_vineet/frontend/jscripts/eterna3/" + url.substring(0, url.lastIndexOf(".pdb")) + "_dssr.out", dssrCallback, 2, this);
	},

	parseDSSR: function(context, text) {
		var lines = text.split("\n");
		var startIndex = -1;
		var endIndex = -1;
		for(var i = 0; i < lines.length; i++) {
			if(lines[i].match(/List of [0-9]+ base pairs/g)) startIndex = i;
			if(startIndex != -1 && lines[i].indexOf("*") >= 0) { endIndex = i; break; }
		}
		console.log(startIndex + " " + endIndex);
		var data = [];
		for(var i = startIndex+2; i < endIndex; i++) {
			var d = lines[i].trim().split(/\s+/);
			if(d[0].match(/[0-9]+/g) && d.length==8) {
				data.push([d[1], d[2], d[7]]);
			}
		}
		return data;
	},

	loadAjaxFile: function(url, callback, fileType, context) {
		var xhr = new XMLHttpRequest();
		var length = 0;

		xhr.onreadystatechange = function() {
			if(xhr.readyState === xhr.DONE) {
				if(xhr.status === 200 || xhr.status === 0) {
					if(xhr.responseText) {
						if(fileType == 1) context.createModel(context.parsePDB(context, xhr.responseText), callback);
						else if(fileType == 0) context.sendDAT(context.parseDAT(context, xhr.responseText), callback);
						else if(fileType == 2) callback(context.parseDSSR(context, xhr.responseText));
					} else console.warn("THREE.PDBParser: [" + url + "] is unreachable or empty");
				} else console.error("THREE.PDBParser: Couldn't load [" + url +"] [" + xhr.status +"]");
			} else if(xhr.readyState == xhr.HEADERS_RECIEVED) {
				length = xhr.getResponseHeader("Content-Length");
			}
		};

		xhr.open("GET", url, true);
		if(xhr.overrideMimeType) xhr.overrideMimeType("text/plain; charset=x-user-defined");
		xhr.setRequestHeader("Content-Type", "text/plain");
		xhr.send(null);
	},

	sendDAT: function(json, callback) {
		callback(json);
	},

	parseDAT: function(context, text) {

		var lines = text.split("\n"); lines.shift();
		var bps = [];
		for(var i = 0; i < lines.length; i+= 5) {
			if(lines[i].trim() === "") continue;
			var regex = lines[i].match(/(\w+)\:\.*(\d+)/g);
			var r1 = regex[0].replace(/\.|\:/g, '');
			var r2 = regex[1].replace(/\.|\:/g, '');
			var origin = lines[i+1].trim().split(/\s+/g);
			origin = [parseFloat(origin[0]), parseFloat(origin[1]), parseFloat(origin[2])];
			var rotation = [[],[],[]];
			for(var j = 2; j < 5; j++) {
				var line = lines[i+j];
				var ln = line.trim().split(/\s+/g);
				ln = [parseFloat(ln[0]), parseFloat(ln[1]), parseFloat(ln[2])];
				rotation[j-2] = ln;
			}
			bps.push(new BasePair(r1, r2, rotation, origin));
		}

		return bps;


/*		var c1, c2, r1 = [], r2 = [];

		var i1 = text.indexOf("...    ");
		var bp1 = text.substring(text.indexOf("\n", i1) + 1, text.indexOf("...    ", i1+1)).split("\n");
		var bp2 = text.substring(text.lastIndexOf("...    ")).split("\n");
		var c1_tmp = bp1[0].trim().split(/\s+/);
		var c2_tmp = bp2[1].trim().split(/\s+/);
		c1 = [parseFloat(c1_tmp[0]), parseFloat(c1_tmp[1]), parseFloat(c1_tmp[2])];
		c2 = [parseFloat(c2_tmp[0]), parseFloat(c2_tmp[1]), parseFloat(c2_tmp[2])];

		for(var i = 0; i < 3; i++) {
			var tmp = bp1[i+1].trim().split(/\s+/);
			r1.push([parseFloat(tmp[0]), parseFloat(tmp[1]), parseFloat(tmp[2])]);
		}
		for(var i = 0; i < 3; i++) {
			var tmp = bp2[i+2].trim().split(/\s+/);
			r2.push([parseFloat(tmp[0]), parseFloat(tmp[1]), parseFloat(tmp[2])]);
		}
		var data = {"c1":c1, "r1":r1, "c2":c2, "r2":r2};
		return {"ok":true,"data": data}; */
	},

	parsePDB: function(context, text) {

		function createBond(model, id1, id2, type) {
			if(id2 > 0) {
				var h = "s" + Math.min(id1, id2) + "e" + Math.max(id1, id2) + "t" + type;
				if(model.bhash[h] === undefined) {
					model.bonds.push([id1, id2, type]);
					model.bhash[h] = model.bonds.length - 1;
				}
			}
		}

		function distance(atom1, atom2) {
			var a = Math.pow(Math.pow(atom1[4] - atom2[4], 2) + Math.pow(atom1[5] - atom2[5], 2) + Math.pow(atom1[6] - atom2[6], 2), 0.5);
			return a;			
		}

  		function searchAllAtoms(atoms, residueName, atomName) {
  			for(var i in atoms) {
		      if(atoms[i][3] !== residueName) continue;
		      if(atoms[i][1] === atomName) return atoms[i];
		    }
		    return null;
		 }

		 function findAtomByCoords(atoms, x, y, z) {
		 	for(var i in atoms) {
		 		if(atoms[i][4] == x && atoms[i][5] == y && atoms[i][6] == z) return atoms[i];
		 	}
		 	return null;
		 }

		var models = {}; // array of PDBModel
		var lines = text.split("\n");

		for(var i = 0; i < lines.length; i++) {
			if(lines[i].substring(0, 5) == "MODEL") {
				var id = lines[i].substring(11, 14).replace(/\s+/g, '');
				models[id] = new PDBModel(id);
			}
		}

		var currentModel = null;
		var prevResidue = null;
		var count = 0;

		var modelsSize = 0;
		for(key in models) modelsSize++;

		if(modelsSize == 0) {
			models[1] = new PDBModel(1);
			currentModel = models[1];
		}

		for(var i = 0; i < lines.length; i++) {
			if(lines[i].substring(0, 5) == "MODEL") {
				var id = lines[i].substring(11, 14).replace(/\s+/g, '');
				currentModel = models[id];
				prevResidue = null;
				count = 0;
			} else if(lines[i].substring(0, 6) == "ENDMDL") {
				currentModel = null;
			} else if(lines[i].substring(0, 4) == "ATOM" || lines[i].substring(0, 6) == "HETATM") {
				var id = parseInt(lines[i].substring(7, 11).trim()); // 1, 2, 3, 4, 5...
				var type = lines[i].substring(12, 16).toLowerCase().trim(); // c4, h5', p, o3'...
				if(type == "ho2'") type = "h2''";
				var molID = lines[i].substring(16, 21).replace(/\s+/g, '').toLowerCase(); // g, u, a, c, t
				var residue = lines[i].substring(21, 26).replace(/\s+/g, ''); // A1401, A1402, A9, B10...
				var x = parseFloat(lines[i].substring(30, 38));
				var y = parseFloat(lines[i].substring(38, 46));
				var z = parseFloat(lines[i].substring(46, 54));

				// Assume all atoms of a certain residue are in the same part of the file
				if(prevResidue !== residue) {
					currentModel.residues.push([]);
					currentModel.residueObjs.push(new Residue(molID, residue));
				}
				currentModel.residues[currentModel.residues.length - 1].push(id);
				prevResidue = residue;

				var mol = lines[i].substr(76, 2).toLowerCase().trim(); // n, h, o, c, he...
				if(mol === "") mol = lines[i].substr(12, 2).toLowerCase().trim();
				mol = mol.substring(0, 1);

				currentModel.atoms[id] = [id, type, molID, residue, x, y, z, mol, context.colors[mol], count];
				currentModel.residueObjs[currentModel.residueObjs.length - 1].atoms.push([count, type, x, y, z]);
				count++;

				if(currentModel.atommap[type] === undefined) currentModel.atommap[type] = [];
				currentModel.atommap[type].push(id);				
			} else if(lines[i].substring(0, 6) == "CONECT" && context.loadBonds) {
				var id1 = parseInt(lines[i].substr(6, 5));
				for(var m in models) {
					createBond(models[m], id1, parseInt(lines[i].substr(11, 5)), 1);
					createBond(models[m], id1, parseInt(lines[i].substr(16, 5)), 1);
					createBond(models[m], id1, parseInt(lines[i].substr(21, 5)), 1);
					createBond(models[m], id1, parseInt(lines[i].substr(26, 5)), 1);	
				}			
			}
		}

		console.log("Done Reading File...");

		if(context.createBonds) {
			for(var m in models) {
				var currentModel = models[m];

				// Inside a residue
				for(var i in currentModel.atoms) {
					var rules = null;
					if(currentModel.atoms[i][2] == 'g') rules = context.rulesG;
					else if(currentModel.atoms[i][2] == 'u') rules = context.rulesU;
					else if(currentModel.atoms[i][2] == 't') rules = context.rulesT;
					else if(currentModel.atoms[i][2] == 'a') rules = context.rulesA;
					else if(currentModel.atoms[i][2] == 'c') rules = context.rulesC;
					else if(currentModel.atoms[i][2] == 'fmn') rules = null;

					if(rules !== null && rules[currentModel.atoms[i][1]] !== undefined) {
						var rule = rules[currentModel.atoms[i][1]];
						for(var j = 0; j < rule.length; j++) {
							var bondType = 1;
							var name = rule[j];
							if(rule[j].indexOf("*") == 0) {
								bondType = 2;
								name = name.substring(1);
							}
							var list = currentModel.atommap[name];
							if(list !== undefined) {
								for(var k = 0; k < list.length; k++) {
									if(currentModel.atoms[list[k]][3] == currentModel.atoms[i][3]) {
										createBond(currentModel, i, list[k], bondType);
										break;
									}
								}
							}
						}
					}
				}

				// Backbone = type -1
				for(var i in currentModel.atoms) {
					if(currentModel.atoms[i][2] !== 'fmn' && currentModel.atoms[i][1] == "p") {
						for(var j in currentModel.atoms) {
							if( i == j || 
								currentModel.atoms[j][2] == 'fmn' || 
								currentModel.atoms[j][1] !== "o3'" || 
								currentModel.atoms[j][3] !== currentModel.atoms[i][3]) continue;
								createBond(currentModel, i, j, -1);
						}
					}
				}

				// Between residue to residue
				currentModel.residues.sort(function(r1, r2) { return currentModel.atoms[r2[0]][3] - currentModel.atoms[r1[0]][3]; });
				for(var i = 0; i < currentModel.residues.length; i++) {
					var r = currentModel.residues[i];
					var d_1 = 1000, d_2 = 1000, id_1 = -1, id_2 = -1;
					var atom_1 = null, atom_2 = null, atom_3 = null, atom_4 = null;
					for(var l = 0; l < currentModel.residues.length; l++) {
						if(l == i) continue;

						var atom1 = findAtom(currentModel.residueObjs[i], "p");
						var atom2 = findAtom(currentModel.residueObjs[i], "o3'");
						var atom3 = findAtom(currentModel.residueObjs[l], "p");
						var atom4 = findAtom(currentModel.residueObjs[l], "o3'");

						// console.log(atom1 + " " + atom2 + " " + atom3 + " " + atom4);


						/*var atom1 = currentModel.atoms[r[0]];
						var atom2 = currentModel.atoms[r[8]];
						if(i == 0 && atom1[1] !== 'p') { 
							atom1 = currentModel.atoms[r[1]];
							atom2 = currentModel.atoms[r[9]];
						}

						var atom3 = currentModel.atoms[currentModel.residues[l][0]];
						var atom4 = currentModel.atoms[currentModel.residues[l][8]];
						if(l == 0 && atom3[1] !== 'p') {
							atom3 = currentModel.atoms[currentModel.residues[l][1]];
							atom4 = currentModel.atoms[currentModel.residues[l][9]];
						}*/

						var d1 = Math.sqrt(calcDistanceSquare(atom1, atom4));
						var d2 = Math.sqrt(calcDistanceSquare(atom2, atom3));
						// console.log(d1 + " " + d2 + " " + atom1);
						if(d1 < d_1) { d_1 = d1; id_1 = l; atom_1 = atom1; atom_4 = atom4; }
						if(d2 < d_2) { d_2 = d2; id_2 = l; atom_2 = atom2; atom_3 = atom3; }
					}
					if(id_1 != -1 && d_1 < 2) {
						var atom1 = findAtomByCoords(currentModel.atoms, atom_1[2], atom_1[3], atom_1[4]); // searchAllAtoms(currentModel.atoms, currentModel.atoms[currentModel.residues[i][0]][3], "p"); // findAtom(currentModel.residueObjs[i], "p");
						var atom2 = findAtomByCoords(currentModel.atoms, atom_4[2], atom_4[3], atom_4[4]); // searchAllAtoms(currentModel.atoms, currentModel.atoms[currentModel.residues[id_1][0]][3], "o3'"); // findAtom(currentModel.residueObjs[id_1], "o3'");

						createBond(currentModel, atom1[0], atom2[0], 1);
						createBond(currentModel, atom1[0], atom2[0], -1);
						if( parseInt(atom1[3].replace(/[^\d.]/g, "")) < parseInt(atom2[3].replace(/[^\d.]/g, ""))) currentModel.sequence[atom1[3]] = [atom1[0], atom2[0]];
						else currentModel.sequence[atom2[3]] = [atom2[0], atom1[0]];
					}

					if(id_2 != -1 && d_2 < 2) {

						var atom1 = findAtomByCoords(currentModel.atoms, atom_2[2], atom_2[3], atom_2[4]); // searchAllAtoms(currentModel.atoms, currentModel.atoms[currentModel.residues[i][0]][3], "o3'"); // findAtom(currentModel.residueObjs[i], "p");
						var atom2 = findAtomByCoords(currentModel.atoms, atom_3[2], atom_3[3], atom_3[4]);
						
						createBond(currentModel, atom1[0], atom2[0], 1);
						createBond(currentModel, atom1[0], atom2[0], -1);
						if( parseInt(atom1[3].replace(/[^\d.]/g, "")) < parseInt(atom2[3].replace(/[^\d.]/g, ""))) currentModel.sequence[atom1[3]] = [atom1[0], atom2[0]];
						else currentModel.sequence[atom2[3]] = [atom2[0], atom1[0]];
					}

					/*if(id_1 != -1 && d_1 < 2) {
						var atom1 = r[0];
						var atom2 = currentModel.residues[id_1][8];
						if(i == 0 && currentModel.atoms[atom1][1] !== 'p') atom1 = r[1];
						if(id_1 == 0 && currentModel.atoms[atom2][1] !== "o3'") atom2 = currentModel.residues[id_1][9];
						createBond(currentModel, atom1, atom2, 1);
						if(parseInt(currentModel.atoms[atom1][3].replace(/[^\d.]/g, "")) < parseInt(currentModel.atoms[atom2][3].replace(/[^\d.]/g, ""))) currentModel.sequence[currentModel.atoms[atom1][3]] = [atom1, atom2];
						else currentModel.sequence[currentModel.atoms[atom2][3]] = [atom2, atom1]; // first is current atom id, second is conn atom
						createBond(currentModel, atom1, atom2, -1);
					}
					if(id_2 != -1 && d_2 < 2) {
						// change all (3) id_2 in this if to id_1 for accidental double backbone
						var atom1 = r[8];
						var atom2 = currentModel.residues[id_2][0];
						if(i == 0 && currentModel.atoms[atom1][1] !== "o3'") atom1 = r[9];
						if(id_2 == 0 && currentModel.atoms[atom2][1] !== 'p') atom2 = currentModel.residues[id_2][1];
						createBond(currentModel, atom1, atom2, 1);
						if(parseInt(currentModel.atoms[atom1][3].replace(/[^\d.]/g, "")) < parseInt(currentModel.atoms[atom2][3].replace(/[^\d.]/g, ""))) currentModel.sequence[currentModel.atoms[atom1][3]] = [atom1, atom2];
						else currentModel.sequence[currentModel.atoms[atom2][3]] = [atom2, atom1]; // first is current atom id, second is conn atom
						createBond(currentModel, atom1, atom2, -1);
					}*/
				}

				var previousRes = null;
				var sequenceStr = "";

			//	console.log(currentModel.sequence);

				for(var key in currentModel.sequence) {
					if(currentModel.sequence.hasOwnProperty(key)) {
				  		var start = currentModel.atoms[currentModel.sequence[key][0]];
				  		var end = currentModel.atoms[currentModel.sequence[key][1]];		
			//			console.log("Connection between " + start[3] + " " + end[3]);
					}
				}

				for (var key in currentModel.sequence) {
				  if (currentModel.sequence.hasOwnProperty(key)) {
				  	var start = currentModel.atoms[currentModel.sequence[key][0]];
				  	var end = currentModel.atoms[currentModel.sequence[key][1]];
				  	if(start[3] !== previousRes) sequenceStr = sequenceStr.substring(0, sequenceStr.length-1) + "|" + start[3] + ",";
				  	sequenceStr += end[3] + ",";
				  	previousRes = end[3];
				  }
				}
				currentModel.sequence = sequenceStr.substring(1, sequenceStr.length-1);
			//	console.log(currentModel.sequence);
			}
		}
		return {"ok": true, "models":models};
	},

	createModel: function(json, callback) {
		var models = json.models;
		var geometryAtomsArray = [];
		var geometryBondsArray = [];
		var count = 0;
		//console.log(models);
		for(var m in models) {
			var model = models[m];
			geometryBondsArray[count] = new THREE.Geometry();
			geometryAtomsArray[count] = new THREE.Geometry();

			geometryBondsArray[count].sequence = model.sequence;

			geometryAtomsArray[count].elements = []; // h he o c n
			geometryAtomsArray[count].elementTypes = []; // o3', p, ...
			geometryAtomsArray[count].residues = []; // A1401, A1402, 
			geometryAtomsArray[count].types = []; // g u a c t

			geometryAtomsArray[count].residueObjs = model.residueObjs;

			geometryBondsArray[count].types = []; // single or double
			geometryBondsArray[count].residues = []; // g u a c t
			geometryBondsArray[count].resNames = []; // A1401, A1402

			for(var i in model.atoms) {
				var pos = new THREE.Vector3(model.atoms[i][4], model.atoms[i][5], model.atoms[i][6]);
				geometryAtomsArray[count].vertices.push(pos);
				var color = new THREE.Color();
				//console.log(model.atoms[i]);
				color.setRGB(model.atoms[i][8][0]/255, model.atoms[i][8][1]/255, model.atoms[i][8][2]/255);
				
				geometryAtomsArray[count].colors.push(color);
				geometryAtomsArray[count].elements.push(model.atoms[i][7]);
				geometryAtomsArray[count].elementTypes.push(model.atoms[i][1]);
				geometryAtomsArray[count].types.push(model.atoms[i][2]);
				geometryAtomsArray[count].residues.push(model.atoms[i][3]);
			}

			for(var i = 0; i < model.bonds.length; i++) {
				geometryBondsArray[count].types.push(model.bonds[i][2]);
				geometryBondsArray[count].types.push(model.bonds[i][2]);

				geometryBondsArray[count].resNames.push(model.atoms[model.bonds[i][0]][3]);
				geometryBondsArray[count].resNames.push(model.atoms[model.bonds[i][1]][3]);

				geometryBondsArray[count].residues.push(model.atoms[model.bonds[i][0]][2]);
				geometryBondsArray[count].residues.push(model.atoms[model.bonds[i][1]][2]);

				geometryBondsArray[count].vertices.push(geometryAtomsArray[count].vertices[model.atoms[model.bonds[i][0]][9]].clone());
				geometryBondsArray[count].vertices.push(geometryAtomsArray[count].vertices[model.atoms[model.bonds[i][1]][9]].clone());
			}

			count++;
		}
		callback(geometryAtomsArray, geometryBondsArray);

	}

}

document.getElementById("toggleRotate").onclick = function() {
  if(this.checked) {
    colorDisplay(1);
  } else {
    colorDisplay(0);
  }
}

document.getElementById("toggleBone").onclick = function() {
  if(this.checked) {
    toggleBackBone(1);
  } else {
    toggleBackBone(0);
  }
}

var s_a = document.getElementById("show_a");
var s_b = document.getElementById("show_b");
var s_c = document.getElementById("show_ab");
var s_d = document.getElementById("displayInfo1");

s_a.onclick = function() {
    s_d.innerHTML = "Display: Atoms";
    s_a.className = "toggleDisplayType active";
    s_b.className = "toggleDisplayType";
    s_c.className = "toggleDisplayType";
    toggleBondsAtoms(0);
}

s_b.onclick = function() {
    s_d.innerHTML = "Display: Bonds";
    s_b.className = "toggleDisplayType active";
    s_a.className = "toggleDisplayType";
    s_c.className = "toggleDisplayType";
    toggleBondsAtoms(1);
}

s_c.onclick = function() {
    s_d.innerHTML = "Display: All";
    s_c.className = "toggleDisplayType active";
    s_b.className = "toggleDisplayType";
    s_a.className = "toggleDisplayType";
    toggleBondsAtoms(2);
}

  function toggleBondsAtoms(type) {
    displayType = type;
    for(var i = 0; i < models.length; i++) {
      scene.remove(models[i].particles);
      for(var j = 0; j < models[i].bonds.length; j++) scene.remove(models[i].bonds[j]);
      if(displayType != 1) { scene.add(models[i].particles); }
      if(displayType != 0) {
        for(var j = 0; j < models[i].bonds.length; j++) scene.add(models[i].bonds[j]);
      }
    }
  }

// 0 = default = red,green,blue,yellow for GUAC
  // 1 = set to element color
  function colorDisplay(type) {
    colorType = type;
    if(type == 1) {
      for(var i = 0; i < models.length; i++) {
        for(var j = 0; j < models[i].colors.length; j++) {
          if(models[i].colors[j].r != 0.5 || models[i].colors[j].g != 1 || models[i].colors[j].b != 0.5)
            models[i].colors[j].setRGB(models[i].colorscopy[j].r, models[i].colorscopy[j].g, models[i].colorscopy[j].b);
        }
        for(var j = 0; j < models[i].bonds.length; j++) {
          if(models[i].bonds[j].material !== models[i].lineMaterial[5]) {
            scene.remove(models[i].bonds[j]);
            var rType = models[i].bonds[j].residueType;
            var rName = models[i].bonds[j].residueName;
            models[i].bonds[j] = new THREE.Line(models[i].lineGeometry[j], models[i].lineMaterial[0], THREE.LinePieces);
            models[i].bonds[j].residueType = rType;
            models[i].bonds[j].residueName = rName;
            if(displayType != 0) scene.add(models[i].bonds[j]);
          }
        }
      }
    } else {
      for(var i = 0; i < models.length; i++) {
        for(var j = 0; j < models[i].colors.length; j++) {
          if(models[i].colors[j].r == 0.5 && models[i].colors[j].g == 1 && models[i].colors[j].b == 0.5) continue;
          if(models[i].types[j] == 'g')         models[i].colors[j].setRGB(0.80, 0.15, 0.00);
          else if(models[i].types[j] == 'u')    models[i].colors[j].setRGB(0.00, 0.36, 0.72);
          else if(models[i].types[j] == 'a')    models[i].colors[j].setRGB(0.99, 0.95, 0.00);
          else if(models[i].types[j] == 'c')    models[i].colors[j].setRGB(0.00, 0.65, 0.00);
        }
        for(var j = 0; j < models[i].bonds.length; j++) {
          if(models[i].bonds[j].material !== models[i].lineMaterial[5]) {
            var mat = models[i].lineMaterial[0];
            var rType = models[i].bonds[j].residueType;
            var rName = models[i].bonds[j].residueName;
            if(rType == 'g') mat = models[i].lineMaterial[1];
            else if(rType == 'u') mat = models[i].lineMaterial[2];
            else if(rType == 'a') mat = models[i].lineMaterial[3];
            else if(rType == 'c') mat = models[i].lineMaterial[4];
            if(startingResidues.indexOf(rName) >= 0) mat = models[i].lineMaterial[8];
            scene.remove(models[i].bonds[j]);
            models[i].bonds[j] = new THREE.Line(models[i].lineGeometry[j], mat, THREE.LinePieces);
            models[i].bonds[j].residueType = rType;
            models[i].bonds[j].residueName = rName;
            if(displayType != 0) scene.add(models[i].bonds[j]);
          }
        }
      }
    }
    for(var i = 0; i < starting.length; i++) {
      var c = models[0].geometry.colors[starting[i]];
      c.setRGB(0.99, 0.99, 0.5);
    } 

    for(var i = 0; i < models.length; i++) {
      if(models[i].isHelix != 2) continue;
      for(var j = 0; j < models[i].geometry.colors.length; j++) {
        models[i].geometry.colors[j].setRGB(0.9, 0.9, 0.9);
      }
      for(var j = 0; j < models[i].bonds.length; j++) {
        models[i].bonds[j].material = models[i].lineMaterial[7];
      }
    }

  }

function holdit(btn, action, start) {
    var t;

    var repeat = function () {
        action();
        t = setTimeout(repeat, start);
    }

    btn.onmousedown = function() {
        repeat();
    }

    btn.onmouseup = function () {
        clearTimeout(t);
    }
};

holdit(document.getElementById("leftArrow"), function () { camera.position.x -=20; }, 5);
holdit(document.getElementById("rightArrow"), function () { camera.position.x +=20; }, 5);
holdit(document.getElementById("upArrow"), function () { camera.position.y -=20; }, 5);
holdit(document.getElementById("downArrow"), function () { camera.position.y +=20; }, 5);
holdit(document.getElementById("lessZoom"), function () { camera.translateZ(20) }, 5);
holdit(document.getElementById("moreZoom"), function () { camera.translateZ(-20) }, 5);

holdit(document.getElementById("scrollSequenceLeft"), function () { document.getElementById('fullsequence').scrollLeft -= 5; document.getElementById('fullsecondarystructure').scrollLeft -= 5; }, 25);
holdit(document.getElementById("scrollSequenceRight"), function () { document.getElementById('fullsequence').scrollLeft += 5; document.getElementById('fullsecondarystructure').scrollLeft += 5; }, 25);

var Detector = {
  overlay: document.createElement("div"),
  container: document.createElement("div"),
  title: document.createElement("div"),
  description: document.createElement("div"),
  button: document.createElement("div"),
  init: function() {
    this.overlay.className = "webgl overlay";
    this.container.className = "webgl container";
    this.title.innerHTML = "<b>Ruh-Roh!</b>";
    this.title.className = "webgl title";
    this.description.innerHTML = "Looks like your computer unfortunately does <b>not</b> have <span class='webgl red'>WebGL</span> enabled, or does not support it. Please use a more updated browser. For more information, visit <a href='http://get.webgl.org/' class='webgl blue'>get.webgl.org</a>.";
    this.description.className = "webgl description";
    this.button.innerHTML = "Visit Site";
    this.button.className = "webgl button";

    if(this.detect()) {
      this.title.innerHTML = "<b>Puzzle Goals</b>";
      this.description.innerHTML = "Use the various RNA structures on the sidebar to the left to form a stable structure. Test out the various RNA motifs and assemble them together to connect the two ends of the puzzle."
      // this.description.innerHTML = "Looks like <span class='webgl green'>WebGL</span> is properly supported on this device. Thanks for testing out the 3D Interface! We hope you enjoy helping us solve RNA puzzles using this new game style.";
      this.button.className += " bgGreen white";
      this.button.innerHTML = "Dismiss";
      this.button.context = this;

      this.button.onclick = function() {
        this.context.overlay.style.display = "none";
        this.context.container.style.display = "none";
      }     
    } else {
      var link = document.createElement("a");
      link.className = "webgl white";
      link.href = "http://get.webgl.org/";
      this.button.className += " bgRed";
      link.appendChild(this.button);
      this.button = link;     
    }

    document.body.appendChild(this.overlay);
    this.description.appendChild(this.button);
    this.container.appendChild(this.title);
    this.container.appendChild(this.description);
    document.body.appendChild(this.container);
  },

  detect: function() {

	try { 
		var canvas = document.createElement( 'canvas' ); 
		return !! window.WebGLRenderingContext && ( canvas.getContext( 'webgl' ) || canvas.getContext( 'experimental-webgl' ) ); 
	} catch( e ) { 
		return false; 
	} 
  }

/*
    var canvas = document.createElement("canvas");
    var gl, glExperimental = false;

    try { gl = canvas.getContext("webgl"); } 
    catch (x) { gl = null; }

    if(gl === null) {
      try { gl = canvas.getContext("experimental-webgl"); glExperimental = true; }
      catch (x) { gl = null; }
    }
    if(gl) return true;
    else if("WebGLRenderingContext" in window) return true;
    else return false;    
  } */
}

Detector.init();

  var elementsList = {"Ac":"Actinium","Ag":"Silver","Al":"Aluminum","Am":"Americium","Ar":"Argon","As":"Arsenic","At":"Astatine","Au":"Gold","B":"Boron","Ba":"Barium","Be":"Beryllium","Bh":"Bohrium","Bi":"Bismuth","Bk":"Berkelium","Br":"Bromine","C":"Carbon","Ca":"Calcium","Cd":"Cadmium","Ce":"Cerium","Cf":"Californium","Cl":"Chlorine","Cm":"Curium","Cn":"Copernicium","Co":"Cobalt","Cr":"Chromium","Cs":"Cesium","Cu":"Copper","Db":"Dubnium","Ds":"Darmstadtium","Dy":"Dysprosium","Er":"Erbium","Es":"Einsteinium","Eu":"Europium","F":"Fluorine","Fe":"Iron","Fl":"Flerovium","Fm":"Fermium","Fr":"Francium","Ga":"Gallium","Gd":"Gadolinium","Ge":"Germanium","H":"Hydrogen","He":"Helium","Hf":"Hafnium","Hg":"Mercury","Ho":"Holmium","Hs":"Hassium","I":"Iodine","In":"Indium","Ir":"Iridium","K":"Potassium","Kr":"Krypton","La":"Lanthanum","Li":"Lithium","Lr":"Lawrencium","Lu":"Lutetium","Lv":"Livermorium","Md":"Mendelevium","Mg":"Magnesium","Mn":"Manganese","Mo":"Molybdenum","Mt":"Meitnerium","N":"Nitrogen","Na":"Sodium","Nb":"Niobium","Nd":"Neodymium","Ne":"Neon","Ni":"Nickel","No":"Nobelium","Np":"Neptunium","O":"Oxygen","Os":"Osmium","P":"Phosphorus","Pa":"Protactinium","Pb":"Lead","Pd":"Palladium","Pm":"Promethium","Po":"Polonium","Pr":"Praseodymium","Pt":"Platinum","Pu":"Plutonium","Ra":"Radium","Rb":"Rubidium","Re":"Rhenium","Rf":"Rutherfordium","Rg":"Roentgenium","Rh":"Rhodium","Rn":"Radon","Ru":"Ruthenium","S":"Sulfur","Sb":"Antimony","Sc":"Scandium","Se":"Selenium","Sg":"Seaborgium","Si":"Silicon","Sm":"Samarium","Sn":"Tin","Sr":"Strontium","Ta":"Tantalum","Tb":"Terbium","Tc":"Technetium","Te":"Tellurium","Th":"Thorium","Ti":"Titanium","Tl":"Thallium","Tm":"Thulium","U":"Uranium","Uuo":"Ununoctium","Uup":"Ununpentium","Uus":"Ununseptium","Uut":"Ununtrium","V":"Vanadium","W":"Tungsten","Xe":"Xenon","Y":"Yttrium","Yb":"Ytterbium","Zn":"Zinc","Zr":"Zirconium"};


  function recalculateDimensions() {
    var w = window,
        d = document,
        e = d.documentElement,
        g = d.getElementsByTagName('body')[0],
        x = w.innerWidth || e.clientWidth || g.clientWidth,
        y = w.innerHeight|| e.clientHeight|| g.clientHeight;

    var mainWidth = x  - 530;
    var mainHeight = y - 175;
    document.getElementById("main").style.width = mainWidth + "px";
    document.getElementById("main").style.height = mainHeight + "px";
    return {"w":mainWidth, "h":mainHeight};
  }

  var WIDTH = recalculateDimensions();
  var HEIGHT = WIDTH.h;
  WIDTH = WIDTH.w;

  var container, controls;
  var camera, scene, renderer, sprite;

  var loader = new THREE.PDBParser();
  loader.loadBonds = true;
  loader.createBonds = true;

  var isMoving = false;
  var projector = new THREE.Projector();

  var models = [];
  var mainOffset = null;
  var firstMolecule = true;

  var displayType = 1; /* 0 for atoms, 1 for bonds, 2 for both */
  var colorType = 0; /* 0 for GUAC, 1 for norm */
  var backboneDisplay = 1; /* 0 for no, 1 for yes */

  var selectedAtom = {};
  var selectedMolecules = {};
  var factor = 75;

  var starting = [];

  var puzName = document.getElementById("puzname").innerHTML;

   var startingResidues = null;
   var targetResiduesIds = null;
   if(puzName == "Tetraloop Receptor Puzzle") {
     startingResidues = ["A221", "A252", "A141", "A162"];
     targetResiduesIds = ["A141","A162"];
   } else if(puzName == "FMN Puzzle") {
     startingResidues = ["A20", "A49", "A50", "A61"];
     targetResiduesIds = ["A50","A61"];
   } else if(puzName == "P4-P5 Tutorial") {
     startingResidues = ["A111", "A209", "A204", "A117"];
     targetResiduesIds = ["A111", "A209"];
   }
 

  var targetEnd = null;
  var targetEndIndex = null;

  var ghostMotifs = [];
  var ghostParticles = [];
  var ghostArrows = [];
  var ghostIndex = 1; // 0 = none, 1 is show 0th
  var ghostStartIndices = [];

  var motif_entries = [];
  var start_d = [0,0,0];
  var start_r = [[1,0,0],[0,1,0],[0,0,1]];
  var start_sug = [[-1.211,-4.735,-0.174],[-1.396,6.11,0.396]];

  function MotifEntry(name, index, r, d, sug, bead, bend_angle) {
    this.name = name;
    this.index = index;
    this.r = r;
    this.d = d;
    this.sug = sug;
    this.bead = bead;
    this.bend_angle = bend_angle;
  }

  function Model(id) {
      this.id = id;

      this.modelName = "";

      this.particles = null;
      this.geometry = new THREE.Geometry();
      this.colors = [];
      this.colorscopy = [];
      this.collisionSpheres = [];

      this.material = null; /* copy the materials over for independent opacitys */
      this.lineMaterial = []; /* white, G, U, A, C, selec */
      this.residues = [];

      this.types = [];
      this.elementcodes = [];
      
      this.bonds = [];
      this.lineGeometry = [];

      this.backboneBonds = null;
      this.backboneGeometry = null;

/*      this.c1 = null;
      this.r1 = null;
      this.c2 = null;
      this.r2 = null; */

      // Linkage
      this.chains = []; 
      this.ends = [];
      
      this.isHelix = 0;

      this.tf = [];
      this.residueObjs = [];
      this.residueCenters = [];
      this.basepairs = [];

      this.usedEnds = [null, null]; // 1st elem is the connection to previous model, 2nd is connection to next model

      this.dssr = []; // the parsed data from the dssr file
  }


  function updateSequenceGUI(valid) {
    if(valid) document.getElementById("sequenceContainer").style.display = "block";
    var seq = document.getElementById("fullsequence").innerHTML;
    var ss = document.getElementById("fullsecondarystructure").innerHTML;
    document.getElementById("fullsequence").innerHTML = "";

    for(var i = 0; i < seq.length; i++) {
      var color = "";
      switch(seq.substring(i, i+1)) {
        case 'c': color="#00A600"; break;
        case 'a': color="#FCF200"; break;
        case 'g': color="#CC2600"; break;
        case 'u': color="#005CBB"; break;
      }
      var span = document.createElement("span");
      span.style.color = color;
      span.innerHTML = seq.substring(i, i+1).toUpperCase();

      document.getElementById("fullsequence").appendChild(span);

    }
  }

  document.getElementById("undo").onclick = function() {
    if(models.length == 1) { alert("No more motifs left to undo."); return; }
    var m = models.pop();
    scene.remove(m.particles);
    scene.remove(m.backboneBonds);
    for(var i = 0; i < m.collisionSpheres.length; i++) scene.remove(m.collisionSpheres[i]);
    for(var i = 0; i < m.bonds.length; i++) scene.remove(m.bonds[i]);
    updateLengths();
    updateList( document.getElementById("scrollbar_container").style.display != "block"  );
    ghostStartIndices.pop();
    resetGhostMolecules(ghostStartIndices.pop());

    valid_solution = isvalidsolution(models[models.length-1]);

    // document.getElementById("fullsequence").innerHTML = seq;
    // document.getElementById("fullsecondarystructure").innerHTML = ss;
  }

  new HotKey('z', function(event) {
  	if(document.getElementById("search") === document.activeElement) return;
	document.getElementById("undo").onclick();
  }, {
	ctrlKey: false,
	shiftKey: true
  });

  new HotKey('h', function(event) {
  	if(document.getElementById("search") === document.activeElement) return;
  	tryloadMolecule("motifs/helix/helix.pdb");
  }, {
  	ctrlKey: false,
  	shiftKey: true
  });

  function removeAllMotifs() {
    while(models.length > 1) {
      var m = models.pop();
      scene.remove(m.particles);
      scene.remove(m.backboneBonds);
      for(var i = 0; i < m.collisionSpheres.length; i++) scene.remove(m.collisionSpheres[i]);
      for(var i = 0; i < m.bonds.length; i++) scene.remove(m.bonds[i]);
      updateLengths();
    }
  }

  document.getElementById("submit").onclick = function() {
  	if(puzName == "P4-P5 Tutorial") return;
    var length = updateLengths();
    if(length["l"] > 90 || length["h"] <= length["m"]) { 
      document.getElementById("submiterrorcontainer").style.display = "block"; 
      document.getElementById("submiterroroverlay").style.display = "block"; 
      return; 
    }
    document.getElementById("submitoverlay").style.display = "block";
    document.getElementById("submitcontainer").style.display = "block";
  }

  document.getElementById("submitbutton").onclick = function() {
    document.getElementById("submitoverlay").style.display = "none";
    document.getElementById("submitcontainer").style.display = "none"; 
    var name = document.getElementById("submitusername").value.trim();
    if(name == "") { alert("Empty username: cancelling submit."); return; }
    if(!isvalidsolution(models[models.length-1])) { alert("Invalid solution: cancelling submit."); return; }

    var seq = generateMergedMotif(valid_solution);
    var ss = seq["ss"]; seq = seq["seq"];
    var list = "";
    for(var i = 0; i < models.length; i++) list += models[i].modelName + ",";
    list = list.substring(0, list.length - 1);

    var formData = new FormData();
    formData.append("name", name);
    formData.append("seq", seq);
    formData.append("ss", ss);
    formData.append("list", list);
    formData.append("type", "post_3d");
    formData.append("puzname", document.getElementById("puzname").innerHTML);
    var xhr = new XMLHttpRequest();
    xhr.open("post", "/post/", true);
    xhr.onreadystatechange = function() {
      if(xhr.readyState == 4 && xhr.status == 200) {
        // alert(xhr.responseText);
      }
    }
    xhr.send(formData);

    // upload seq, ss, list, name to /post/ 
  }

  init();

  function init() {
    container = document.getElementById("main");
    camera = new THREE.PerspectiveCamera(70, WIDTH/HEIGHT, 1, 22500);
    camera.rotation.order = 'YXZ';

    scene = new THREE.Scene();
    sprite = THREE.ImageUtils.loadTexture("/workbranch_vineet/frontend/jscripts/eterna3/ball.png");

    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(WIDTH, HEIGHT);
    container.appendChild(renderer.domElement);

    controls = new THREE.TrackballControls(camera, renderer.domElement);
    controls.rotateSpeed = 0.5;
    controls.minDistance = 50;
    controls.maxDistance = 15000;
    controls.addEventListener("change", render);

    camera.position.z = -2417;
    camera.position.y = -1522;
    camera.position.x = -1261;

    if(puzName == "Tetraloop Receptor Puzzle") loadMolecule("motifs/tetraloop_receptor/tetraloop_receptor.pdb");
    else if(puzName == "FMN Puzzle") loadMolecule("motifs/fmn_puzzle/fmn_puzzle.pdb");
    else if(puzName == "P4-P5 Tutorial") loadMolecule("motifs/p4p5_puzzle/p4p5_puzzle.pdb");
    window.addEventListener('resize', onWindowResize, false);
    container.addEventListener('mouseup', onMouseUp, false);
    container.addEventListener('mousedown', onMouseDown, false);
    container.addEventListener('mousemove', onMouseMove, false);

 	var xhr = new XMLHttpRequest();

	xhr.onreadystatechange = function() {
		if(xhr.readyState === xhr.DONE) {
			if(xhr.status === 200 || xhr.status === 0) {
				if(xhr.responseText) {
					parseMotifGhostData(xhr.responseText);	
				} else console.warn("GAME: [" + url + "] is unreachable or empty");
			} else console.error("GAME: Couldn't load [" + url +"] [" + xhr.status +"]");
		}
	};

    xhr.open("GET", "/workbranch_vineet/frontend/jscripts/eterna3/" + "unique_motif_data.dat", false);
    xhr.overrideMimeType('text/plain');
    xhr.send(null);

	/*xhr.onreadystatechange = function() {
		// alert(xhr.readyState + " " + xhr.status + " " + xhr.DONE);
		if(xhr.readyState === xhr.DONE && (xhr.status === 200 || xhr.status === 0) && xhr.responseText) {
			parseMotifGhostData(xhr.responseText);
		}
	};*/

    render();
    animate();
  }

  document.getElementById("viewSelected").onclick = function() {
    if(document.getElementById("scrollbar_container").style.display == "block") {
      updateList(1);
    } else updateList(0);
  }

  function parseMotifGhostData(text) {
  	var fileContent = text;
    var lines = fileContent.split("\n");
  //  console.log(fileContent);
  //  console.log("REACHED");
    for(var i = 0; i < lines.length-1; i++) {
      var spl = lines[i].split(";");
      var name = spl[0];
      var index = parseInt(spl[1]);
      var r = [[],[],[]];
      var d = [];
      var sug = [[],[]];
      var bead = [[],[]];
      var bend_angle = parseFloat(spl[6]);

      var spl2 = spl[2].split(" ");
      var c = 0;
      for(var j = 0; j < spl2.length-1; j++) {
        if(j != 0 && j % 3 == 0) {
          c += 1;
        }
        r[c].push(parseFloat(spl2[j]));
   
      }

      spl2 = spl[3].split(" ");
      for(var j = 0; j < spl2.length; j++){
        d.push(parseFloat(spl2[j]));
      }
      
      spl2 = spl[4].split(" ");
      c = 0;
      for(var j = 0; j < spl2.length-1; j++) {
        if(j != 0 && j % 3 == 0) {
          c += 1;
        }
        sug[c].push(parseFloat(spl2[j]));
      }

      spl2 = spl[5].split(" ");
      c = 0;
      for(var j = 0; j < spl2.length; j++) {
        if(j != 0 && j % 3 == 0) {
          c += 1;
        }
        bead[c].push(parseFloat(spl2[j]));
      }


      motif_entries.push(new MotifEntry(name,index,r,d,sug,bead,bend_angle));
    }
  }

  function updateList(type) {
    if(type == 1) {
      document.getElementById("scrollbar_container").style.display = "none";
      var s = (models.length > 1) ? "" : "You haven't added any motifs yet!";
      for(var i = 1; i < models.length; i++) {
        var name = models[i].modelName; name = name.substring(name.lastIndexOf("/") + 1, name.indexOf(".pdb"));
        name = name.replace(/NWAY/g, 'N-Junction');
        name = name.replace(/helix/g, "Helix");
        name = name.replace(/HAIRPIN/g, "Hairpin");
        if(url.indexOf("tertiary_contacts") >= 0) name = name.replace(/TC\./g, "Tertiary Contact.");
        name = name.replace(/TWOWAY/g, "2-Junction");
        name = name.replace(/\./g, " ");
        s += i + ". " + name + "<br /><br />";
      }
      document.getElementById("usedMotifs").style.display = "block";
      document.getElementById("usedMotifsText").innerHTML = s;
      document.getElementById("viewSelected").style.border = "none";
      document.getElementById("viewSelected").style.backgroundColor = "rgba(0, 125, 125, 0.5)";
    } else {
      document.getElementById("scrollbar_container").style.display = "block";
      document.getElementById("usedMotifs").style.display = "none";
      document.getElementById("viewSelected").style.border = "1px solid rgba(0, 125, 125, 0.5)";
      document.getElementById("viewSelected").style.backgroundColor = "inherit";
    }
  }

  function updateLengths() {
    var totalLength = 0; var numTotal = models.length;
    var helixLength = 0; var numHelix = 0;
    var motifLength = 0; var numMotif = 0;
    for(var i = 0; i < models.length; i++) {

      if(models[i].isHelix == 2) numHelix++;
      else if(models[i].isHelix != 1) numMotif++;
      
      for(var j = 0; j < models[i].chains.length; j++) {
        totalLength += models[i].chains[j].length;
        if(models[i].isHelix == 2) helixLength += models[i].chains[j].length;
        else if(models[i].isHelix != 1) motifLength += models[i].chains[j].length;
      }
    }

  //  numTotal = numTotal < 1 ? 1 : numTotal;
  //  numHelix = numHelix < 1 ? 1 : numHelix;
  //  numMotif = numMotif < 1 ? 1 : numMotif;

    totalLength -= ((numTotal-1)*2);
    helixLength -= ((numHelix)*2);
    motifLength -= ((numMotif)*2);

    document.getElementById("RNALength").innerHTML = totalLength;
    document.getElementById("HelixLength").innerHTML = helixLength;
    document.getElementById("MotifLength").innerHTML = motifLength;

    if(totalLength > 90) { 
      document.getElementById("RNALength").style.color = "rgb(240, 50, 100)"; 
      document.getElementById("RequirementOne").style.color = "rgb(240, 50, 100)";
    } else {
      document.getElementById("RNALength").style.color = "rgb(50, 200, 70)"; 
      document.getElementById("RequirementOne").style.color = "rgb(50, 200, 70)";
    }

    if(motifLength >= helixLength) {
      document.getElementById("HelixLength").style.color = "rgb(240, 50, 100)"; 
      document.getElementById("MotifLength").style.color = "rgb(240, 50, 100)";      
      document.getElementById("RequirementTwo").style.color = "rgb(240, 50, 100)";      
    } else {
      document.getElementById("HelixLength").style.color = "rgb(50, 200, 70)"; 
      document.getElementById("MotifLength").style.color = "rgb(50, 200, 70)";      
      document.getElementById("RequirementTwo").style.color = "rgb(50, 200, 70)";
    }
    return {"l":totalLength, "h":helixLength, "m":motifLength};
  }

  var loadedPDB;
  var loadedDSSR;
  var doneLoading;

  function loadMolecule(path, direction) {

    selectedAtom = {};
    selectedMolecules = {};
    loadedPDB = false;
    loadedDSSR = false;
    doneLoading = false;

    models.push(new Model(models.length));
    if(path == "motifs/helix/helix.pdb") models[models.length-1].isHelix = 2;
    else if(path == "motifs/tetraloop_receptor/tetraloop_receptor.pdb" || path == "motifs/fmn_puzzle/fmn_puzzle.pdb" || path == "motifs/p4p5_puzzle/p4p5_puzzle.pdb") models[models.length-1].isHelix = 1;

    models[models.length-1].modelName = path;

    loader.loadFile(path, function(loadedGeometryArray, loadedBondsArray) {

        var loadedGeometry = loadedGeometryArray[0];
        var loadedBonds = loadedBondsArray[0];

        // Initialize materials

        var i = models.length-1;

        models[i].lineMaterial[0] = new THREE.LineBasicMaterial({linewidth: 1, opacity: 0.8, color: 0x746f6f, antialias: true }); // white
        models[i].lineMaterial[1] = new THREE.LineBasicMaterial({linewidth: 1, opacity: 0.8, color: 0xCC2600, antialias: true }); // (g) red
        models[i].lineMaterial[2] = new THREE.LineBasicMaterial({linewidth: 1, opacity: 0.8, color: 0x005CB8, antialias: true }); // (u) blue
        models[i].lineMaterial[3] = new THREE.LineBasicMaterial({linewidth: 1, opacity: 0.8, color: 0xFCF200, antialias: true }); // (a) yellow 
        models[i].lineMaterial[4] = new THREE.LineBasicMaterial({linewidth: 1, opacity: 0.8, color: 0x00A600, antialias: true }); // (c) green
        models[i].lineMaterial[5] = new THREE.LineBasicMaterial({linewidth: 1, opacity: 0.8, color: 0x80FF80, antialias: true }); // (s) hgreen
        models[i].lineMaterial[6] = new THREE.LineBasicMaterial({linewidth: 7, opacity: 0.8, color: 0xF8005F, antialias: true }); // (h) pink 0xC8C8FA
        models[i].lineMaterial[7] = new THREE.LineBasicMaterial({linewidth: 1, opacity: 0.8, color: 0xC8C8FA, antialias: true }); // (h) white
        models[i].lineMaterial[8] = new THREE.LineBasicMaterial({linewidth: 1, opacity: 0.8, color: "rgb(99%, 99%, 50%)", antialias: true }); // (h) flashing


        models[i].residueObjs = loadedGeometry.residueObjs;
        for(var j = 0; j < models[i].residueObjs.length; j++) {
          models[i].residueCenters.push(calculateCenter(models[i].residueObjs[j].atoms));
        }

        for(var j = 0; j < models[i].lineMaterial.length; j++) models[i].lineMaterial[j].transparent = true;
        
        models[i].material = new THREE.ParticleSystemMaterial( { size: 125, map: sprite, vertexColors: true, transparent: true } );
        models[i].material.alphaTest = 0.5;

        // Center loaded molecule

        if(mainOffset == null) {
            firstMolecule = true;
            var offset = THREE.GeometryUtils.center(loadedGeometry);
            loadedBonds.applyMatrix(new THREE.Matrix4().makeTranslation(offset.x, offset.y, offset.z));
            mainOffset = offset;
        } else firstMolecule = false;

        // Load bonds 1 by 1
        models[i].lineGeometry = [];
        models[i].backboneGeometry = new THREE.Geometry();

        models[i].chains = loadedBonds.sequence.split("|");
        for(var j = 0; j < models[i].chains.length; j++) {
          models[i].chains[j] = models[i].chains[j].split(",");
          var res1, res2 = null;
          for(var k = 0; k < models[i].residueObjs.length; k++) {
            if(models[i].chains[j][0] == models[i].residueObjs[k].id) res1 = models[i].residueObjs[k];
            if(models[i].chains[j][1] == models[i].residueObjs[k].id) res2 = models[i].residueObjs[k];
          }

          var o3_atom = findAtom(res1, "o3'");
          var p_atom = findAtom(res2, "p");
          if(Math.sqrt(calcDistanceSquare(o3_atom, p_atom)) > 2) {
            models[i].chains[j] = models[i].chains[j].reverse();
          }

        }

        updateLengths();

        var prevRes = null;
        var resCount = -1;

        for(var j = 0; j < loadedBonds.vertices.length; j+= 2) {

          var start = loadedBonds.vertices[j];
          var end = loadedBonds.vertices[j+1];
          start.multiplyScalar(factor);
          start.z -= 5;
          end.multiplyScalar(factor);
          end.z -= 5;

          if(loadedBonds.types[j] != -1) {
            if(loadedBonds.resNames[j] !== prevRes) {
              prevRes = loadedBonds.resNames[j];
              resCount++;
              models[i].lineGeometry.push(new THREE.Geometry());
            }
            
            models[i].lineGeometry[resCount].vertices.push(start);
            models[i].lineGeometry[resCount].vertices.push(end);
            models[i].lineGeometry[resCount].residueType = loadedBonds.residues[j];
            models[i].lineGeometry[resCount].residueName = loadedBonds.resNames[j];
          } else {
            models[i].backboneGeometry.vertices.push(start);
            models[i].backboneGeometry.vertices.push(end);
          }
        }

        // Now create overall bonds
        for(var j = 0; j < models[i].lineGeometry.length; j++) {

          models[i].bonds[j] = new THREE.Line(models[i].lineGeometry[j], models[i].lineMaterial[0], THREE.LinePieces);

          if(startingResidues.indexOf(models[i].lineGeometry[j].residueName) >= 0)
            models[i].bonds[j].material = models[i].lineMaterial[8];

          models[i].bonds[j].residueType = models[i].lineGeometry[j].residueType;
          models[i].bonds[j].residueName = models[i].lineGeometry[j].residueName;
          if(firstMolecule) scene.add(models[i].bonds[j]);
        }

        models[i].backboneBonds = new THREE.Line(models[i].backboneGeometry, models[i].lineMaterial[6], THREE.LinePieces);
        if(firstMolecule) scene.add(models[i].backboneBonds);

        // Load atoms 1 by 1
        for(var j = 0; j < loadedGeometry.vertices.length; j++) {
          loadedGeometry.vertices[j].multiplyScalar(factor);
          models[i].residues.push(loadedGeometry.residues[j]);
          models[i].types.push(loadedGeometry.types[j]);
          models[i].elementcodes.push(loadedGeometry.elements[j]);
          models[i].geometry.vertices.push(loadedGeometry.vertices[j]);
          models[i].colors[j] = new THREE.Color();
          models[i].colorscopy[j] = new THREE.Color();
          models[i].colors[j].setRGB(loadedGeometry.colors[j].r, loadedGeometry.colors[j].g, loadedGeometry.colors[j].b);
          models[i].colorscopy[j].setRGB(loadedGeometry.colors[j].r, loadedGeometry.colors[j].g, loadedGeometry.colors[j].b);

          if(startingResidues.indexOf(loadedGeometry.residues[j]) >= 0) {
            starting.push(j);
            models[i].colors[j].setRGB(0.99, 0.99, 0.5);
            models[i].colorscopy[j].setRGB(0.99, 0.99, 0.5);
          }              
        }

        // Now create the overall atoms and add to the scene
        models[i].geometry.colors = models[i].colors;
        models[i].geometry.residues = loadedGeometry.residues;
        models[i].particles = new THREE.ParticleSystem(models[i].geometry, models[i].material);
        models[i].particles.sortParticles = true;
        if(firstMolecule) scene.add(models[i].particles);

        loadedPDB = true;

      if(firstMolecule) {
        for(var j = 0; j < loadedGeometry.vertices.length; j++) {
            vector = new THREE.Vector3(loadedGeometry.vertices[j].x, loadedGeometry.vertices[j].y, loadedGeometry.vertices[j].z);
            var collisionSphere = new THREE.Mesh(new THREE.SphereGeometry(30, 6, 6), new THREE.MeshBasicMaterial({color:0xffffff}));
            collisionSphere.position = vector;

            collisionSphere.name = j;
            collisionSphere.visible = false; // troubleshoot with true
            models[i].collisionSpheres.push(collisionSphere);
            scene.add(collisionSphere);          
        }

        toggleBondsAtoms(displayType);
        colorDisplay(colorType); // show normal coloring
        toggleBackBone(backboneDisplay);
      }

    }, function(data) {
      handleData(data, direction);
    }, function(data) {
      loadedDSSR = true;
      // take the dssr data
      // data is an array with 3 pos: id1, id2, and the bp type
      models[models.length-1].dssr = data;

      // console.log(data);
    }

    );
  }

  function findAtom(residue, atomname) {
    for(var i = 0; i < residue.atoms.length; i++) {
      if(residue.atoms[i][1] == atomname) return residue.atoms[i];
    }
    return null;
  }

   function scoreP4P5(end, tf) {
     d_diff = calcDistance(calculateCenter(targetEnd.atoms),calculateCenter(end.atoms));
     console.log(d_diff);
     return d_diff;
   }

  function scoreEnd(end,tf) {
    d_diff = calcDistance(calculateCenter(targetEnd.atoms),calculateCenter(end.atoms));
    r_diff = 0;

    //update end frame
    var final_r = [[],[],[]];
    if(tf.length !== 0) {
      var pRotation = [[],[],[]];
      for(var i = 0; i < 3; i++) {
        for(var j = 0; j < 3; j++) {
          pRotation[i][j] = tf[i][j];
        }
      }
      final_r = multiplyMatrices(end.rotation, transpose(pRotation));
    }
    else { final_r = end.rotation; }

    for (var i = 0; i < 3; i++) {
      for (var j = 0; j < 3; j++) {
        r_diff += Math.abs(targetEnd.rotation[i][j] - final_r[i][j]);
      }
    }

    return d_diff + 2*r_diff;
  }

  function isvalidsolution(model) {

    document.getElementById("currentScore").style.color = "rgb(240, 50, 100)";
    var scoreAverage = 0;

    for (var i = 0; i < model.ends.length; i++) {
      if(puzName == "P4-P5 Tutorial") { score = scoreP4P5(model.ends[i], model.tf); document.getElementById("targetScore").innerHTML = "Target Score: 1.5"; }
      else score = scoreEnd(model.ends[i],model.tf);
      scoreAverage += score;
      if( (score < 7 && puzName !== "P4-P5 Tutorial" && models.length > 1) || (score < 1.5 && puzName == "P4-P5 Tutorial" && models.length > 1)) {      
        document.getElementById("currentScore").innerHTML = "Current Score: " + Math.round(score*100)/100;
        document.getElementById("currentScore").style.color = "rgb(50, 200, 70)"; 
        return 1;
      }
    }

    document.getElementById("currentScore").innerHTML = "Current Score: " + Math.round((scoreAverage/model.ends.length)*100)/100;
    return 0;
  }

  function projectPossibleSolutions(model,end_index) {
    var end = model.ends[end_index];
    console.log(model);
    console.log(end_index);
    console.log(end);
    var end_center = calculateCenter(end.atoms);
    var end_c1_atoms = [];

    centers = []

    for(var i = 0; i < end.atoms.length; i++) {
      var atom = end.atoms[i];
      if(end.atoms[i][1] == "c1'") end_c1_atoms.push([atom[2],atom[3],atom[4]]);
    }

    var final_r = [[],[],[]];
    if(model.tf.length !== 0) {
      var pRotation = [[],[],[]];
      for(var i = 0; i < 3; i++) {
        for(var j = 0; j < 3; j++) {
          pRotation[i][j] = model.tf[i][j];
        }
      }
      final_r = multiplyMatrices(end.rotation, transpose(pRotation));
    }
    else { final_r = end.rotation; }


    for(var i = 0; i < motif_entries.length; i++) {

      var r_trans = multiplyMatrices(transpose(final_r), start_r);
      var t_trans = start_d;

      t_trans[0] = -t_trans[0]; t_trans[1] = -t_trans[1]; t_trans[2] = -t_trans[2]; 

      var new_sugars_2 =  multiplyMatrices(start_sug, transpose(r_trans));

      for(var j = 0; j < 2; j++) {
        new_sugars_2[j][0] += t_trans[0] + end_center[0];
        new_sugars_2[j][1] += t_trans[1] + end_center[1];
        new_sugars_2[j][2] += t_trans[2] + end_center[2];
      }

      if( calcDistance(new_sugars_2[0], end_c1_atoms[0]) > calcDistance(new_sugars_2[0], end_c1_atoms[1])) {
        var temp = new_sugars_2[1];
        new_sugars_2[1] = new_sugars_2[0];
        new_sugars_2[0] = temp;
      }

      var sugar_diff_1 = [end_c1_atoms[0][0] - new_sugars_2[0][0], end_c1_atoms[0][1] - new_sugars_2[0][1], end_c1_atoms[0][2] - new_sugars_2[0][2]];
      var sugar_diff_2 = [end_c1_atoms[1][0] - new_sugars_2[1][0], end_c1_atoms[1][1] - new_sugars_2[1][1], end_c1_atoms[1][2] - new_sugars_2[1][2]];

      t_trans[0] += ((sugar_diff_1[0] + sugar_diff_2[0])/2);
      t_trans[1] += ((sugar_diff_1[1] + sugar_diff_2[1])/2);
      t_trans[2] += ((sugar_diff_1[2] + sugar_diff_2[2])/2);

      var new_bead_pos = multiplyMatrices(motif_entries[i].bead,transpose(r_trans));
      for(var j = 0; j < new_bead_pos.length; j++) {
        new_bead_pos[j][0] += t_trans[0] + end_center[0]; 
        new_bead_pos[j][1] += t_trans[1] + end_center[1]; 
        new_bead_pos[j][2] += t_trans[2] + end_center[2];
      }

      skip = 0;
      for(var j = 0; j < models.length; j++) {
        for(var k = 0; k < models[j].residueCenters.length; k++) {
          var dist1 = calcDistance(new_bead_pos[0],models[j].residueCenters[k]);
          var dist2 = calcDistance(new_bead_pos[1],models[j].residueCenters[k]);
          if(dist1 < 4.0 || dist2 < 4.0) { 
            //console.log("made it");
            skip = 1;
            break;
          }
        }
        if(skip) continue;
      }

      if(skip) continue;

      var new_origin = dotProduct(motif_entries[i].d,transpose(r_trans));
      new_origin[0] += t_trans[0] + end_center[0]; 
      new_origin[1] += t_trans[1] + end_center[1]; 
      new_origin[2] += t_trans[2] + end_center[2];
      var new_rotation = multiplyMatrices(motif_entries[i].r,transpose(r_trans));
      new_origin.push(motif_entries[i].name);
      new_origin.push(new_rotation);
      new_origin.push(motif_entries[i].bend_angle);
      centers.push(new_origin);
    }

    return centers;

  }

  function handleData(data, direction) {

    if(!loadedPDB || !loadedDSSR) {
      setTimeout(function() { handleData(data, direction);}, 100);
      return;
    } else {

      for(var i = 0; i < data.length; i++) {
        var r1 = data[i].residue1.trim();
        var r2 = data[i].residue2.trim();
        for(var j = 0; j < models[models.length-1].residueObjs.length; j++) {

          if(models[models.length-1].residueObjs[j].id.trim() == r1) data[i].residue1 = models[models.length-1].residueObjs[j];
          if(models[models.length-1].residueObjs[j].id.trim() == r2) data[i].residue2 = models[models.length-1].residueObjs[j];
        }
      }

      for(var i = 0; i < data.length; i++) {
        data[i].atoms = data[i].residue1.atoms.concat(data[i].residue2.atoms);
      }

      models[models.length-1].basepairs = data;

      var pairs = [];
      for(var i = 0; i < models[models.length-1].chains.length; i++) {
        var chain = models[models.length-1].chains[i];
        pairs.push(chain[0]);
        pairs.push(chain[chain.length - 1]);
      }

      for(var i = 0; i < pairs.length; i++) {
        for(var j = i+1; j < pairs.length; j++) {
          for(var k = 0; k < models[models.length-1].basepairs.length; k++) {
            var bp = models[models.length-1].basepairs[k];
            if( (bp.residue1.id == pairs[i] && bp.residue2.id == pairs[j]) || (bp.residue2.id == pairs[i] && bp.residue1.id == pairs[j])) {
              models[models.length-1].ends.push(bp);
            }
          }
        }
      }

      //add dssr bp types
      console.log("dssr length " + models[models.length-1].dssr.length)
      for(var i = 0; i < models[models.length-1].dssr.length; i++) {
        if(models[models.length-1].dssr[i][0] == null) continue;
        var dssr_id_1 = models[models.length-1].dssr[i][0];
        var dssr_id_2 = models[models.length-1].dssr[i][1];

        var resid1 = dssr_id_1.substring(0,1) +  dssr_id_1.substring(3);
        var resid2 = dssr_id_2.substring(0,1) +  dssr_id_2.substring(3);

        for (var j = 0; j < models[models.length-1].basepairs.length; j++) {
          var bp = models[models.length-1].basepairs[j];
          if((bp.residue1.id == resid1 && bp.residue2.id == resid2)  || (bp.residue2.id == resid1 && bp.residue1.id == resid2)) {
            bp.bp_type = models[models.length-1].dssr[i][2];
            if(bp.bp_type == null) bp.bp_type = "";
            break;
          } 
        }
      }

      if(firstMolecule) {
        if(puzName == "Tetraloop Receptor Puzzle") resetGhostMolecules(1);
        else if(puzName == "P4-P5 Tutorial") resetGhostMolecules(1);
        else if(puzName == "FMN Puzzle") resetGhostMolecules(0);
      }


      if(!firstMolecule) {
        // Make this so concat error is fixed, wait until load pdb as well
        // change so loops through all the ends

        var cmodel = models[models.length-1]
        var endsIndex = direction === undefined ? 1 : direction;
  
        var startsIndex = 0;
 
        if(puzName == "Tetraloop Receptor Puzzle") startsIndex = 1;
        else if(puzName == "FMN Puzzle") startsIndex = 0;
        else if(puzName == "P4-P5 Tutorial") startsIndex = 0; // fix
 

        // if(models.length == 2) endsIndex = 0;
        if(models.length == 2 && puzName == "Tetraloop Receptor Puzzle") startsIndex = 1;
        if(models.length == 2 && puzName == "P4-P5 Tutorial") startsIndex = 1;

        // if(models.length == 3) endsIndex = 1; // just for debugging
        var result = align3(models[models.length-2].ends[startsIndex], models[models.length-1], endsIndex, models[models.length-2].tf);

        //last_center = cmodel.ends[]

        while(clashExists(models[models.length-1].ends[endsIndex])) {

          var model = models[models.length-1];
          for(var i = 0; i < model.ends.length; i++) {
            for(var j = 0; j < model.ends[i].atoms.length; j++) {
              var atom = model.ends[i].atoms[j];
              atom[2] = result["oldcoords"][atom[0]][0];
              atom[3] = result["oldcoords"][atom[0]][1];
              atom[4] = result["oldcoords"][atom[0]][2];
            }
          }

          for(var i = 0; i < model.residueObjs.length; i++) {
            for(var j = 0; j < model.residueObjs[i].atoms.length; j++) {
              var atom = model.residueObjs[i].atoms[j];
              atom[2] = result["oldcoords"][atom[0]][0];
              atom[3] = result["oldcoords"][atom[0]][1];
              atom[4] = result["oldcoords"][atom[0]][2];
            }
          }

          endsIndex--;
          if(endsIndex < 0) break;
          result = align3(models[models.length-2].ends[startsIndex], models[models.length-1], endsIndex, models[models.length-2].tf);
        }

        if(endsIndex < 0) {
        	alert("Cannot add motif here because the structure will collide with part of the molecule.");
        	document.getElementById("undo").onclick();
      		doneLoading = true;
        	return;
        }

        models[models.length - 2].usedEnds[1] = startsIndex;
        models[models.length-1].usedEnds[0] = endsIndex;

        renderModel(models[models.length-1], result["coords"], result["oldcoords"]);

        models[models.length-1].tf = result["tf"];
        if(endsIndex > 0) resetGhostMolecules(0);
        else resetGhostMolecules(1);
      }

      //get target end for scoring 
      else {

        for(var i = 0; i < models[0].ends.length; i++){
          if(targetResiduesIds[0] == models[0].ends[i].residue1.id && targetResiduesIds[1] == models[0].ends[i].residue2.id ) {
            targetEnd = models[0].ends[i];
            targetEndIndex = i;
            break;
          }
          if(targetResiduesIds[1] == models[0].ends[i].residue1.id && targetResiduesIds[0] == models[0].ends[i].residue2.id ) {
            targetEnd = models[0].ends[i];
            targetEndIndex = i;
          }
        }
      }

      /*

      Vineet make a nice alert that this solution is good
      */
      //generateMergedMotif(0);


      valid_solution = isvalidsolution(models[models.length-1]);
      doneLoading = true;
      // alert(seq + " " + ss);
      if(valid_solution) {

      	if(puzName == "P4-P5 Tutorial") {
     		document.getElementById("puzzlecompletecontainer").style.display = "block";
            document.getElementById("puzzlecompleteoverlay").style.display = "block";
            document.getElementById("puzzlecompletedesc").innerHTML = "Congratulations, you completed the tutorial! Now that you know how to play the game, why don't you try submitting solutions for the Tetraloop Receptor and FMN puzzles."; 
      		return;
      	}

        var seq = generateMergedMotif(valid_solution);
        var ss = seq["ss"]; seq = seq["seq"];

        document.getElementById("fullsequence").innerHTML = seq;
        document.getElementById("fullsecondarystructure").innerHTML = ss;

        updateSequenceGUI(valid_solution);

        document.getElementById("puzzlecompletecontainer").style.display = "block";
        document.getElementById("puzzlecompleteoverlay").style.display = "block";
        document.getElementById("puzzlecompletedesc").style.fontSize = "12px";
        document.getElementById("puzzlecompletedesc").style.marginLeft = "10px";
        document.getElementById("puzzlecompletedesc").style.marginRight = "20px";
        document.getElementById("puzzlecompletedesc").style.overflowX = "scroll";
        document.getElementById("puzzlecompletedesc").style.textAlign = "left";
        document.getElementById("puzzlecompletedesc").innerHTML = "Final Solution:<br/>" + seq + "<br/>" + ss;

        //Some alert here!!!!, ask if the user wants to save the solution
        //document.alert("this solution works");
        //only join motifs if user asks to save the solution
      }

    }
  }


  function removeGhostMolecules() {
     while(ghostMotifs.length > 0) {
      var m = ghostMotifs.pop();
      while(m.length > 0) scene.remove(m.pop());
     }
     while(ghostParticles.length > 0) scene.remove(ghostParticles.pop());
     while(ghostArrows.length > 0) scene.remove(ghostArrows.pop());
  }

  new HotKey('0',function(event){ if(document.getElementById("search") === document.activeElement) return; hideGhostMolecules(0); },{ ctrlKey: false, shiftKey: false });    
  new HotKey('1',function(event){ if(document.getElementById("search") === document.activeElement) return; hideGhostMolecules(1); },{ ctrlKey: false, shiftKey: false });    
  new HotKey('2',function(event){ if(document.getElementById("search") === document.activeElement) return; hideGhostMolecules(2); },{ ctrlKey: false, shiftKey: false });    
  new HotKey('3',function(event){ if(document.getElementById("search") === document.activeElement) return; hideGhostMolecules(3); },{ ctrlKey: false, shiftKey: false });    
  new HotKey('4',function(event){ if(document.getElementById("search") === document.activeElement) return; hideGhostMolecules(4); },{ ctrlKey: false, shiftKey: false });    
  new HotKey('5',function(event){ if(document.getElementById("search") === document.activeElement) return; hideGhostMolecules(5); },{ ctrlKey: false, shiftKey: false }); 

  // index is 1-5 (numkeys)
  // if index == 0 then hide all
  function hideGhostMolecules(index) {
    ghostIndex = index;
    for(var i = 0; i < ghostParticles.length; i++) {
      if(ghostIndex-1 == i) {
        ghostParticles[i].visible = true;
        ghostArrows[i].visible = true;
      } else {
        ghostParticles[i].visible = false;
        ghostArrows[i].visible = false;
      }
    }
  }

  document.getElementById("incrementGhost").onclick = function() {
    if(ghostIndex+1 > 5) hideGhostMolecules(1);
    else hideGhostMolecules(ghostIndex + 1);
  }

  document.getElementById("hideAllGhost").onclick = function() {
    hideGhostMolecules(0);
  }

  // a = array, n = num arrays
  function splitArray(a, n) {
      var len = a.length,out = [], i = 0;
      while (i < len) {
          var size = Math.ceil((len - i) / n--);
          out.push(a.slice(i, i += size));
      }
      return out;
  }

  function resetGhostMolecules(startIndex) {
    removeGhostMolecules();
    addGhostMolecules(startIndex);
    hideGhostMolecules(ghostIndex);
    ghostStartIndices.push(startIndex);
  }  

  function addGhostMolecules(startIndex) {

      var projectedCenters = projectPossibleSolutions(models[models.length-1],startIndex);
      projectedCenters.sort(function(a,b){
          if(a[5] !== b[5]) return a[5] - b[5];
          else return a[3].localeCompare(b[3]);
      });
      projectedCenters = splitArray(projectedCenters, 5); // 5 chunks for numkeys 1-5

      for(var j = 0; j < projectedCenters.length; j++) {
        ghostMotifs.push([]);
        var ghostGeometry = new THREE.Geometry();
        var ghostArrowsGeometry = new THREE.Geometry();

        for(var i = 0; i < projectedCenters[j].length; i++) {
          var vector = new THREE.Vector3(projectedCenters[j][i][0]*factor + mainOffset.x*factor,
                                         projectedCenters[j][i][1]*factor + mainOffset.y*factor,
                                         projectedCenters[j][i][2]*factor + mainOffset.z*factor);

          var d1_x = projectedCenters[j][i][4][0][0]*factor; var d1_y = projectedCenters[j][i][4][1][0]*factor;
          var d2_x = projectedCenters[j][i][4][0][1]*factor; var d2_y = projectedCenters[j][i][4][1][1]*factor;
          var d3_x = projectedCenters[j][i][4][0][2]*factor; var d3_y = projectedCenters[j][i][4][1][2]*factor;
          var dtot_x = Math.sqrt((d1_x*d1_x)+(d2_x*d2_x)+(d3_x*d3_x)); var dtot_y = Math.sqrt((d1_y*d1_y)+(d2_y*d2_y)+(d3_y*d3_y));
          var dfact_x = 150/dtot_x; d1_x *= dfact_x; d2_x *= dfact_x; d3_x *= dfact_x;
          var dfact_y = 400/dtot_y; d1_y *= dfact_y; d2_y *= dfact_y; d3_y *= dfact_y;
          
          var vec1 = new THREE.Vector3(vector.x + d1_x + d1_y ,vector.y + d2_x + d2_y, vector.z + d3_x + d3_y);
          var vec2 = new THREE.Vector3(vector.x + d1_x - d1_y ,vector.y + d2_x - d2_y, vector.z + d3_x - d3_y);
          var vec3 = new THREE.Vector3(vector.x - d1_x + d1_y ,vector.y - d2_x + d2_y, vector.z - d3_x + d3_y);
          var vec4 = new THREE.Vector3(vector.x - d1_x - d1_y ,vector.y - d2_x - d2_y, vector.z - d3_x - d3_y);

          ghostGeometry.vertices.push(vector);
          var sphere = new THREE.Mesh(new THREE.SphereGeometry(80,12,12),new THREE.MeshBasicMaterial({color:0xffddee, visible:false}));
          ghostGeometry.colors.push(new THREE.Color(0.5, 0.7, 0.85)); // MAIN COLOR, IGNORE THE ONE IN THE MATERIAL GENERATION

         // ghostArrowsGeometry.vertices.push(vector); ghostArrowsGeometry.vertices.push(vec1);
          ghostArrowsGeometry.vertices.push(vec1); ghostArrowsGeometry.vertices.push(vec2);
          ghostArrowsGeometry.vertices.push(vec2); ghostArrowsGeometry.vertices.push(vec4);
          ghostArrowsGeometry.vertices.push(vec3); ghostArrowsGeometry.vertices.push(vec4);
          ghostArrowsGeometry.vertices.push(vec3); ghostArrowsGeometry.vertices.push(vec1);

        //  ghostArrowsGeometry.vertices.push(vec1); ghostArrowsGeometry.vertices.push(vec3);
          sphere.url = projectedCenters[j][i][3]; sphere.name = "ghost_" + i;
          ghostMotifs[j].push(sphere);
          sphere.position = vector;
          scene.add(sphere);
        }
        var ghostParticle = new THREE.ParticleSystem(ghostGeometry, new THREE.ParticleSystemMaterial( { size: 350, map: sprite, vertexColors: true, transparent: true, alphaTest: 0.5, color: 0xffddee} ));
        ghostParticle.sortParticles = true;
        ghostParticles.push(ghostParticle); scene.add(ghostParticle);

        var ghostArrow = new THREE.Line(ghostArrowsGeometry, new THREE.LineBasicMaterial({linewidth: 1, opacity: 0.8, color: 0xC8C8FA, antialias: true }), THREE.LinePieces);
        ghostArrows.push(ghostArrow); scene.add(ghostArrow);
      }
  }

  function generateMergedMotif(final_end_index) {

    var start = models[0];
    var current_chains = [];
    var allBasePairs = [];

    for(var i = 0; i < start.chains.length; i++) {
      var currentChain = [];
      for(var j = 0; j < start.chains[i].length; j++) {
        currentChain.push(start.chains[i][j]);
      }
      current_chains.push(convertChainToResidueArray(currentChain,start));
    }

    for(var i = 1; i < models.length; i++) {

      var bp1 = models[i-1].ends[models[i-1].usedEnds[1]];
      var bp2 = models[i].ends[models[i].usedEnds[0]];

      var chainInfo1 = []; 
      var chainInfo2 = [];

      chainInfo1.push(findResidueOnChains(bp1.residue1, current_chains));
      chainInfo1.push(findResidueOnChains(bp1.residue2, current_chains));

      //current_chains = current_chains.splice(chainInfo1[0][2], 1);
      //current_chains = current_chains.splice(chainInfo1[1][2], 1);

      var new_current_chains = []
      for (var j = 0; j < current_chains.length; j++) {
        if(j == chainInfo1[0][2] || j == chainInfo1[1][2]) continue;
        new_current_chains.push(current_chains[j])
      }
      current_chains = new_current_chains;

      model_chains = []
      for(var j = 0; j < models[i].chains.length; j++) {
        model_chains.push(convertChainToResidueArray(models[i].chains[j],models[i]))
      }

      chainInfo2.push(findResidueOnChains(bp2.residue1, model_chains));
      chainInfo2.push(findResidueOnChains(bp2.residue2, model_chains));

      if(chainInfo1[0][0] == 1) { chainInfo1 = chainInfo1.reverse(); }
      if(chainInfo2[0][0] == 1) { chainInfo2 = chainInfo2.reverse(); }

      var tmpChain1 = chainInfo2[1][1].reverse();
      tmpChain1.shift();
      var tmpChain2 = chainInfo2[0][1]; 
      tmpChain2.shift();

      chainInfo1[0][1] = (chainInfo1[0][1].reverse().concat(tmpChain1)).reverse();
      chainInfo1[1][1] = chainInfo1[1][1].concat(tmpChain2);

      current_chains.push(chainInfo1[0][1]);
      current_chains.push(chainInfo1[1][1]);

    }
    //super hacky
    hairpin_chain = current_chains[0];
    start_chain = null;
    end_chain = null;
    if(current_chains[1][0].id == "B7" || current_chains[1][0].id == "A5" || current_chains[1][0].id == "A4" || current_chains[1][0].id == "B8") { 
      start_chain = current_chains[2];
      end_chain = current_chains[1];
    }
    else {
      start_chain = current_chains[1];
      end_chain = current_chains[2];
    }

    var tmpChain1 = hairpin_chain;
    tmpChain1.shift();
    tmpChain1.pop();
    var tmpChain2 = end_chain; 
    //tmpChain2.shift();

    start_chain = start_chain.concat(tmpChain1);
    start_chain = start_chain.concat(tmpChain2);

    seq = ""

    for(var i = 0; i < start_chain.length; i++) {
      //console.log(start_chain[i].id);
      seq += start_chain[i].name;
    }
    //console.log(seq);

    // get basepairs for each residue in the finished chain order
    basepairs = [];

    for(var a = 0; a < start_chain.length; a++ ) {
      c_basepairs = [];
      c_center = calculateCenter(start_chain[a].atoms);
      for(var i = 0; i < models.length; i++) {
        for(var j = 0; j < models[i].basepairs.length; j++) {
          if(start_chain[a].id != models[i].basepairs[j].residue1.id && start_chain[a].id != models[i].basepairs[j].residue2.id) {
            continue;
          }
          var center_1 = calculateCenter(models[i].basepairs[j].residue1.atoms);
          var center_2 = calculateCenter(models[i].basepairs[j].residue2.atoms);

          var dist_1 = calcDistance(c_center,center_1);
          var dist_2 = calcDistance(c_center,center_2);

          if(dist_1 < 0.01 || dist_2 < 0.01) c_basepairs.push(models[i].basepairs[j]);

        }
      }
      basepairs.push(c_basepairs);
    }

    ss = getSecondaryStructure(start_chain,basepairs);
    console.log(ss + " " + seq);
    return {"seq":seq,"ss":ss};

    // Stich together the 2(n) chains at the end from 5' to 3'

    //console.log(allBasePairs);
    //console.log(chainInfo1[0][1]);
    //console.log(chainInfo2[1][1]);
    //console.log(start_chain);
  }

  function getSecondaryStructure(chain,basepairs) {
    var seen_bp = [];
    var count = 1;
    var sstructure = [];
    var sequence = [];
    var design_sequence = [];
    var seen_res = [];

    for(var i = 0; i < chain.length; i++) {
      var ss = "";
      var bps = basepairs[i];
      var is_bp = 0;
      var saved_bp = null;

      for(var j = 0; j < bps.length; j++) {
        partner_res = null;
        if(bps[j].residue1.id == chain[i].id) {
          partner_res = bps[j].residue2
        }
        else{
          partner_res = bps[j].residue1;
        }

        is_bp = 1;
        var passes = 0;

        if(is_bp_wc(bps[j]) && bps[j].bp_type == "cW-W") passes = 1;
        if(is_bp_gu(bps[j]) && bps[j].bp_type == "cW-W") passes = 1;

        if(passes) {
          saved_bp = bps[j];
          //have we seen this bp yet
          if(!has_seen_bp(bps[j],seen_bp) && !has_seen_res(chain[i],seen_res) && !has_seen_res(partner_res,seen_res))  {
            var center = calculateCenter(chain[i].atoms);
            seen_res.push([chain[i],center,1]);
            ss = "(";
          }
          else if(has_seen_res(partner_res,seen_res)) {
            var partner_res_count = has_seen_res(partner_res,seen_res);
            if(partner_res_count > 1) {
              ss = ".";
            }
            else {
              ss = ")"
              var center = calculateCenter(chain[i].atoms);
              seen_res.push([chain[i],center,1]);
              has_seen_res(partner_res,seen_res,1);
            }

          }

        }
        else {
          ss = ".";
        }
      }

      if(!is_bp) {
        ss = ".";
      }

      sstructure.push(ss);

    }

    var string = ""
    console.log(sstructure.length + " " + chain.length)
    for(var i = 0; i < sstructure.length; i++) {
      string += sstructure[i];
      //console.log(chain[i].id + " " + sstructure[i]);
    }
    return string;
  }

  function has_seen_bp(bp,seen_bp) {
    var center_1 = calculateCenter(bp.residue1.atoms);
    var center_2 = calculateCenter(bp.residue2.atoms);

    for(var k = 0; k < seen_bp.length; k++) {
      if(!((bp.residue1.id == seen_bp[k].residue1.id && bp.residue2.id == seen_bp[k].residue2.id) || bp.residue1.id == seen_bp[k].residue2.id && bp.residue2.id == seen_bp[k].residue1.id)) {
        continue;
      }

      var dist_1 = calcDistance(center_1,seen_bp[k][1]);
      var dist_2 = calcDistance(center_2,seen_bp[k][2]);

      if(dist_1 > 0.01 && dist_2 > 0.01) continue;

      dist_1 = calcDistance(center_2,seen_bp[k][1]);
      dist_2 = calcDistance(center_2,seen_bp[k][2]);

      if(dist_1 > 0.01 && dist_2 > 0.01) continue;

      return 1;

    }
    return 0;
  }

  function has_seen_res(res,seen_res,add) {
    var center = calculateCenter(res.atoms);
    for (var i = 0; i < seen_res.length; i++) {
      if(seen_res[i][0].id != res.id) continue;
      var dist = calcDistance(center,seen_res[i][1]);
      if(dist < 0.01) {

        if(add != null) {
          seen_res[i][2] += 1;
        }
        return seen_res[i][2]

      }
    }
    return 0;

  }


  function is_bp_wc(bp) {
    var bp_name = bp.residue1.name + bp.residue2.name;
    if(bp_name == "gc" || bp_name == "cg" || bp_name == "au" || bp_name == "ua") {
      return 1;
    }
    else {
      return 0;
    }
  }

  function is_bp_gu(bp) {
    var bp_name = bp.residue1.name + bp.residue2.name;
    if(bp_name == "gu" || bp_name == "ug") {
      return 1;
    }
    else {
      return 0;
    }
  }

  function convertChainToResidueArray(chain,model) {
    var residue_array = [];
    for(var i = 0; i < chain.length; i++) {
      residue = null;
      for(var j = 0; j < model.residueObjs.length; j++) {
        if(chain[i] == model.residueObjs[j].id) {
          residue = model.residueObjs[j];
          break;
        }
      }
      residue_array.push(residue);
    }
    return residue_array;
  }


  // position and chain
  function findResidueOnChains(residue, chains) {
    for(var i = 0; i < chains.length; i++) {
      //console.log(residue.id + " " + chains[i][0].id);
      if(residue.id == chains[i][0].id) {
        var chainscopy = [];
        for(var j = 0; j < chains[i].length; j++) chainscopy.push(chains[i][j]);
        return [0, chainscopy, i];
      }
      if(residue.id == chains[i][chains[i].length-1].id) {
        var chainscopy = [];
        for(var j = 0; j < chains[i].length; j++) chainscopy.push(chains[i][j]);
        return [1, chainscopy, i];
      }
    }
  }

  function toggleBackBone(type) {
    backboneDisplay = type;
    for(var i = 0; i < models.length; i++) {
      scene.remove(models[i].backboneBonds);
    }
    if(type == 1) {
      for(var i = 0; i < models.length; i++) {
        scene.add(models[i].backboneBonds);
      }
    }
  }

    function transpose(matrix) {
        return matrix[0].map(function(uselessValue, colIndex){
            return matrix.map(function(uselessRow, rowIndex){
                return matrix[rowIndex][colIndex];
            });
        });
    }

    function multiplyMatrices(m1, m2) {
        var result = [];
        for (var i = 0; i < m1.length; i++) {
            result[i] = [];
            for (var j = 0; j < m2[0].length; j++) {
                var sum = 0;
                for (var k = 0; k < m1[0].length; k++) {
                    sum += m1[i][k] * m2[k][j];
                }
                result[i][j] = sum;
            }
        }
        return result;
    }

    function dotProduct(m1, m2) {
        var a = (m1[0] * m2[0][0]) + (m1[1] * m2[1][0]) + (m1[2] * m2[2][0]);
        var b = (m1[0] * m2[0][1]) + (m1[1] * m2[1][1]) + (m1[2] * m2[2][1]);
        var c = (m1[0] * m2[0][2]) + (m1[1] * m2[1][2]) + (m1[2] * m2[2][2]);
        return [a, b, c];
    }

    function unitarize(matrix) {
      return matrix;
    }

    function subtractMatrices(m1, m2) {
      return [m1[0]-m2[0], m1[1]-m2[1], m1[2]-m2[2]];
    }

    function subtractMatrices2(m1, v1) {
      for(var i = 0; i < m1.length; i++) {
        m1[i][0] -= v1[0];
        m1[i][1] -= v1[1];
        m1[i][2] -= v1[2];
      }
      return m1;
    }

    function addMatrices2(m1, v1) {
      for(var i = 0; i < m1.length; i++) {
        m1[i][0] += v1[0];
        m1[i][1] += v1[1];
        m1[i][2] += v1[2];
      }
      return m1;
    }

    var animationInterval = 0;
    var animationTime = 0;


/*function Tf(arg1, arg2) {
  if(arg2 === undefined) {
    this.matrix = arg1;
    this.translation = [[arg1[0][3]],[arg1[1][3]],[arg1[2][3]]];
    this.rotation = [[arg1[0].splice(0,3)],[arg1[1].splice(0,3)],[arg1[2].splice(0,3)]];
  }
}*/

function calculateCenter(atoms) {
  var center = [0, 0, 0];
  for(var i = 0; i < atoms.length; i++) {
    center[0] += atoms[i][2]; center[1] += atoms[i][3]; center[2] += atoms[i][4];
  }
  center[0] /= atoms.length; center[1] /= atoms.length; center[2] /= atoms.length;
  return center;
}

function clashExists(end) {

  for(var i = 0; i < models[models.length-1].residueCenters.length; i++) {
    var resId = models[models.length-1].residueObjs[i].id;

    if(resId == end.residue1.id || resId == end.residue2.id) continue;

    for(var j = 0; j < models.length-1; j++) {
      for(var k = 0; k < models[j].residueCenters.length; k++) {
        //needs to be able to overlay with the target end
        if(j == 0) {
          if(models[j].residueObjs[k].id == targetResiduesIds[0] || models[j].residueObjs[k].id == targetResiduesIds[1]) {
            continue;
          }
        }

        if( calcDistance(models[j].residueCenters[k], models[models.length-1].residueCenters[i]) < 2) return true; 
      }
    }
  }
  return false;
}

function align3(ref_bp, model, end_pos, previous_transform) {
  var r1 = ref_bp.rotation;
  var r2 = model.ends[end_pos].rotation;
  var rotation = multiplyMatrices(transpose(r1), r2);

  var rotation_origin = calculateCenter(model.ends[end_pos].atoms);

  var coords = [];
  var oldcoords = [];
  for(var i = 0; i < model.geometry.vertices.length; i++) {
    var v = model.geometry.vertices[i];
    coords[i] = [v.x/factor, v.y/factor, v.z/factor];
    oldcoords[i] = [v.x/factor, v.y/factor, v.z/factor];
  }

  coords = subtractMatrices2(multiplyMatrices(coords, transpose(rotation)), rotation_origin);

  if(previous_transform.length !== 0) {
    var pTranslation = [previous_transform[0][3],previous_transform[1][3],previous_transform[2][3]];

    var pRotation = [[],[],[]];
    for(var i = 0; i < 3; i++) {
      for(var j = 0; j < 3; j++) {
        pRotation[i][j] = previous_transform[i][j];
      }
    }

   coords = multiplyMatrices(coords, transpose(pRotation));
  }

  var rotation_origin_2 = subtractMatrices(dotProduct(rotation_origin, transpose(rotation)), rotation_origin);
  var bp_pos_diff = subtractMatrices(calculateCenter(ref_bp.atoms), rotation_origin_2);

  for(var i = 0; i < coords.length; i++) {
    coords[i][0] += bp_pos_diff[0];
    coords[i][1] += bp_pos_diff[1];
    coords[i][2] += bp_pos_diff[2];
  }

  // Changing model.ends
  for(var i = 0; i < model.ends.length; i++) {
    for(var j = 0; j < model.ends[i].atoms.length; j++) {
      var atom = model.ends[i].atoms[j];
      atom[2] = coords[atom[0]][0];
      atom[3] = coords[atom[0]][1];
      atom[4] = coords[atom[0]][2];
    }
  }

  var ref_c1_atoms = [];
  var model_c1_atoms = [];

  for(var i = 0; i < ref_bp.atoms.length; i++) {
    if(ref_bp.atoms[i][1] == "c1'") ref_c1_atoms.push(ref_bp.atoms[i]);
  }

  for(var i = 0; i < model.ends[end_pos].atoms.length; i++) {
    if(model.ends[end_pos].atoms[i][1] == "c1'") model_c1_atoms.push(model.ends[end_pos].atoms[i]);
  }

  if( calcDistanceSquare(ref_c1_atoms[0], model_c1_atoms[0]) > calcDistanceSquare(ref_c1_atoms[0], model_c1_atoms[1])) {
    var temp = model_c1_atoms[1];
    model_c1_atoms[1] = model_c1_atoms[0];
    model_c1_atoms[0] = temp;
  }

  var sugar_diff_1 = [ref_c1_atoms[0][2] - model_c1_atoms[0][2], ref_c1_atoms[0][3] - model_c1_atoms[0][3], ref_c1_atoms[0][4] - model_c1_atoms[0][4]];
  var sugar_diff_2 = [ref_c1_atoms[1][2] - model_c1_atoms[1][2], ref_c1_atoms[1][3] - model_c1_atoms[1][3], ref_c1_atoms[1][4] - model_c1_atoms[1][4]];

  for(var i = 0; i < coords.length; i++) {
    coords[i][0] += ((sugar_diff_1[0] + sugar_diff_2[0])/2);
    coords[i][1] += ((sugar_diff_1[1] + sugar_diff_2[1])/2);
    coords[i][2] += ((sugar_diff_1[2] + sugar_diff_2[2])/2);
  }

  for(var i = 0; i < model.ends.length; i++) {
    for(var j = 0; j < model.ends[i].atoms.length; j++) {
      var atom = model.ends[i].atoms[j];
      atom[2] = coords[atom[0]][0];
      atom[3] = coords[atom[0]][1];
      atom[4] = coords[atom[0]][2];
    }
  }

  // Changing model.residueObjs
  for(var i = 0; i < model.residueObjs.length; i++) {
    for(var j = 0; j < model.residueObjs[i].atoms.length; j++) {
      var atom = model.residueObjs[i].atoms[j];
      atom[2] = coords[atom[0]][0];
      atom[3] = coords[atom[0]][1];
      atom[4] = coords[atom[0]][2];
    }
  }

  // Changing model.residueCenters
  model.residueCenters = [];
  for(var j = 0; j < model.residueObjs.length; j++) {
    //if 
    model.residueCenters.push(calculateCenter(model.residueObjs[j].atoms));
  }

  if(previous_transform.length == 0) {
    previous_transform = [rotation[0], rotation[1], rotation[2], [0,0,0,1]];
    previous_transform[0].push(-rotation_origin[0]);
    previous_transform[1].push(-rotation_origin[1]);
    previous_transform[2].push(-rotation_origin[2]);
  } else {
    var currentMatrix = [rotation[0], rotation[1], rotation[2], [0,0,0,1]];
    currentMatrix[0].push(-rotation_origin[0]);
    currentMatrix[1].push(-rotation_origin[1]);
    currentMatrix[2].push(-rotation_origin[2]);
    previous_transform = multiplyMatrices(previous_transform, currentMatrix);
  }

  return {"tf":previous_transform,"coords":coords, "oldcoords": oldcoords};
}

function renderModel(model, coords, oldcoords) {
  for(var i = 0; i < model.particles.geometry.vertices.length; i++) {
    var v = model.particles.geometry.vertices[i];
    v.x = coords[i][0] * factor;
    v.y = coords[i][1] * factor; 
    v.z = coords[i][2] * factor; 
  }

  scene.add(model.particles);
  model.particles.applyMatrix(new THREE.Matrix4().makeTranslation(mainOffset.x*factor, mainOffset.y*factor, mainOffset.z*factor));
  model.particles.material.opacity = 0;
  model.particles.material.transparent = true;
  fadeIn(model.particles);

  for(var k = 0; k < model.bonds.length; k++) {
    var lineGeometry = new THREE.Geometry();
    var lineMaterial = model.lineMaterial[0];

    for(var i = 0; i < model.bonds[k].geometry.vertices.length; i++) {
      var v = model.bonds[k].geometry.vertices[i];
      for(var j =0; j < oldcoords.length; j++) {
        if(v.x == (oldcoords[j][0]*factor) && v.y == (oldcoords[j][1]*factor) && v.z == (oldcoords[j][2]*factor)-5) {
          v.x = (coords[j][0] * factor) + (mainOffset.x * factor);
          v.y = (coords[j][1] * factor) + (mainOffset.y * factor);
          v.z = (coords[j][2] * factor) + (mainOffset.z * factor);
          lineGeometry.vertices.push(v);
          break;
        }
      }
    }
    
    var bond = new THREE.Line(lineGeometry, lineMaterial, THREE.LinePieces);
    bond.residueType = model.bonds[k].residueType;
    bond.residueName = model.bonds[k].residueName;

    if(startingResidues.indexOf(bond.residueName) >= 0)
      bond.material = model.lineMaterial[8];

    model.bonds[k] = bond;

    lineGeometry.residueType = model.lineGeometry[k].residueType;
    lineGeometry.residueName = model.lineGeometry[k].residueName;
    model.lineGeometry[k] = lineGeometry;

    scene.add(model.bonds[k]);
    // model.bonds[k].applyMatrix(new THREE.Matrix4().makeTranslation(mainOffset.x*factor, mainOffset.y*factor, mainOffset.z*factor));
    model.bonds[k].material.transparent = true;
    model.bonds[k].material.opacity = 0;
    fadeIn(model.bonds[k]);
  }

  var backboneGeometry = new THREE.Geometry();
  
  for(var i = 0; i < model.backboneGeometry.vertices.length; i++) {
    var v = model.backboneGeometry.vertices[i];
    for(var j = 0; j < oldcoords.length; j++) {
      if(v.x == (oldcoords[j][0]*factor) && v.y == (oldcoords[j][1]*factor) && v.z == (oldcoords[j][2]*factor)-5) {
        v.x = (coords[j][0]*factor) + (mainOffset.x * factor);
        v.y = (coords[j][1]*factor) + (mainOffset.y * factor);
        v.z = (coords[j][2]*factor) + (mainOffset.z * factor);
        backboneGeometry.vertices.push(v);
        break;
      }
    }
  }
  var backbone = new THREE.Line(backboneGeometry, model.lineMaterial[6], THREE.LinePieces);
  model.backboneGeometry = backboneGeometry;
  model.backboneBonds = backbone;
  scene.add(backbone);
  model.backboneBonds.material.transparent = true;
  model.backboneBonds.material.opacity = 0;
  fadeIn(model.backboneBonds);

  for(var j = 0; j < model.particles.geometry.vertices.length; j++) {
    vector = new THREE.Vector3(model.particles.geometry.vertices[j].x + (mainOffset.x*factor), model.particles.geometry.vertices[j].y + (mainOffset.y*factor), model.particles.geometry.vertices[j].z + (mainOffset.z*factor));
    
    var collisionSphere = new THREE.Mesh(new THREE.SphereGeometry(30, 6, 6), new THREE.MeshBasicMaterial({color:0xffffff}));
    collisionSphere.position = vector;

    collisionSphere.name = j;
    collisionSphere.visible = false; // troubleshoot with true
    model.collisionSpheres.push(collisionSphere);
    scene.add(collisionSphere);          
  }

  toggleBondsAtoms(displayType);
  colorDisplay(colorType);
  toggleBackBone(backboneDisplay);
}

function calcDistance(point1, point2) {
  return Math.pow(Math.pow(point1[0] - point2[0], 2) + Math.pow(point1[1] - point2[1], 2) + Math.pow(point1[2] - point2[2], 2), 0.5); 
}

function calcDistanceSquare(atom1, atom2) {
  return Math.pow(atom1[2] - atom2[2], 2) + Math.pow(atom1[3] - atom2[3], 2) + Math.pow(atom1[4] - atom2[4], 2);
}

// 1 second overall
function fadeIn(obj) {
  obj.material.opacity += 0.1;
  if(obj.material.opacity < 1) {
    setTimeout(function() { fadeIn(obj); }, 100);
  }
}


function onWindowResize() {
  w = recalculateDimensions();
  h = w.h; w = w.w;
  camera.aspect = w/h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h);
  render();
}

function onMouseMove() { isMoving = true; }
function onMouseDown() { isMoving = false; }

var timer = null;
var events;

function onMouseUp(e) {
  if(isMoving) return;
  var doubleClick = false;
  if(timer != null) { clearTimeout(timer); timer = null; doubleClick = true; } 
  else { events = e; }

  deselectColors();

  if(!doubleClick) {
    timer = setTimeout(function() {
      selectMolecule();
      timer = null;
      updateInfo();
    }, 150);
  } else {
    selectResidue();
    updateInfo();
  }
}

function updateInfo() {
  if(selectedMolecules["i"] === undefined && selectedAtom["modelnum"] === undefined) {
    document.getElementById("detailsPosition").innerHTML = "Make a Selection";
    document.getElementById("detailsType").innerHTML = "";
    document.getElementById("detailsMol").innerHTML = "";
  } else if(selectedMolecules["i"] !== undefined) {
    document.getElementById("detailsPosition").innerHTML = "";

    var c = "Error";
    for(var i = 0; i < models[selectedMolecules["i"]].types.length; i++) {
      if(models[selectedMolecules["i"]].residues[i] == selectedMolecules["m"])
        c = models[selectedMolecules["i"]].types[i];
    }
    switch(c) {
      case 'a' :
        c = "Adenine"; break;
      case 'g' :
        c = "Guanine"; break;
      case 'u' :
        c = "Uracil"; break;
      case 't' :
        c = "Thymine"; break;
      case 'c' : 
        c = "Cytosine"; break;
      default:
        c = "FMN"; break;
    }
    if(models[selectedMolecules["i"]].isHelix == 2) c = 'Nucleotide';

    document.getElementById("detailsType").innerHTML = "Residue " + selectedMolecules["m"] + ", " + c;
    document.getElementById("detailsMol").innerHTML = "";
  } else if(selectedAtom["modelnum"] !== undefined) {

    var model = models[selectedAtom["modelnum"]];
    var r = model.residues[selectedAtom["i"]];
    var c = model.types[selectedAtom["i"]];
    var nm = model.elementcodes[selectedAtom["i"]].toUpperCase();
    switch(c) {
      case 'a' :
        c = "Adenine"; break;
      case 'g' :
        c = "Guanine"; break;
      case 'u' :
        c = "Uracil"; break;
      case 't' :
        c = "Thymine"; break;
      case 'c' : 
        c = "Cytosine"; break;
      default:
        c = "FMN"; break;
    }
    if(models[selectedAtom["modelnum"]].isHelix == 2) c = 'Nucleotide';
    var sphere = null;
    sphere = model.collisionSpheres[selectedAtom["i"]]

    document.getElementById("detailsPosition").innerHTML = "(" + Math.round(sphere.position.x) + "," + Math.round(sphere.position.y) + "," + Math.round(sphere.position.z) + ")";
    document.getElementById("detailsType").innerHTML = "Residue " + r + ", " + c;
    document.getElementById("detailsMol").innerHTML = elementsList[nm] + " (" + nm + ")";    

  }
}

function selectResidue() {

  selectedAtom = {};
  var newSelectionResidue = -1;
  var newSelectionID = -1;

  var x = ((events.clientX - container.offsetLeft) / container.clientWidth) * 2 - 1;
  var y = -((events.clientY - container.offsetTop) / container.clientHeight) * 2 + 1;
  var vector = new THREE.Vector3(x, y, 0);
  projector.unprojectVector(vector, camera);
  var ray = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize(), 50, 5000);
  for(var i = 0; i < models.length; i++) {

    // Normal Collision
    var intersects = ray.intersectObjects(models[i].collisionSpheres);
    if(intersects.length > 0) {
      var resName = models[i].residues[intersects[0].object.name];
      newSelectionResidue = resName;
      newSelectionID = i;
      for(var j = 0; j < models[i].geometry.colors.length; j++) {
        if(models[i].residues[j] == resName && (selectedMolecules["i"] === undefined || selectedMolecules["i"] !== i || selectedMolecules["m"] !== resName)) {
          models[i].geometry.colors[j] = new THREE.Color();
          models[i].geometry.colors[j].setRGB(0.5, 1.0, 0.5);
        }
      }

      for(var j = 0; j < models[i].bonds.length; j++) {
        if(models[i].bonds[j].residueName == resName && (selectedMolecules["i"] === undefined || selectedMolecules["i"] !== i || selectedMolecules["m"] !== resName)) {
          scene.remove(models[i].bonds[j]);
          var rType = models[i].bonds[j].residueType;
          var rName = models[i].bonds[j].residueName;
          models[i].bonds[j] = new THREE.Line(models[i].lineGeometry[j], models[i].lineMaterial[5], THREE.LinePieces);
          models[i].bonds[j].residueType = rType;
          models[i].bonds[j].residueName = rName;
          if(displayType != 0) scene.add(models[i].bonds[j]);
        }
      }
    }
  }
  if(selectedMolecules["i"] !== undefined && selectedMolecules["i"] == newSelectionID && selectedMolecules["m"] == newSelectionResidue || newSelectionResidue == -1 || newSelectionID == -1) selectedMolecules = {};
  else selectedMolecules = {"m":newSelectionResidue, "i":newSelectionID};
}

function selectMolecule() {
  selectedMolecules = {};
  var x = ((events.clientX - container.offsetLeft) / container.clientWidth) * 2 - 1;
  var y = -((events.clientY - container.offsetTop) / container.clientHeight) * 2 + 1;
  var vector = new THREE.Vector3(x, y, 0);
  projector.unprojectVector(vector, camera);
  var ray = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize(), 50, 5000);
  var mId = -1; var nId = -1;
  for(var i = 0; i < models.length; i++) {
    // Normal Collision
    var n = checkIntersection(i, ray, models[i], models[i].collisionSpheres);
    if(n != -1) { mId = i; nId = n; }
  }

  if(ghostIndex != 0) {
    var intersects = ray.intersectObjects(ghostMotifs[ghostIndex-1]);
    if(intersects.length > 0) {
      var iname = intersects[0].object.name; 
      iname = parseInt(iname.substring(iname.indexOf("_") + 1));
      console.log(intersects[0].object.name + " " + ghostMotifs[ghostIndex-1][iname].url);
      tryloadMolecule("motifs/two_ways/" + ghostMotifs[ghostIndex-1][iname].url + "/" + ghostMotifs[ghostIndex-1][iname].url + ".pdb");
    }
  }

  if( (selectedAtom["modelnum"] !== undefined && selectedAtom["i"] == nId && selectedAtom["modeslnum"] == mId) || mId == -1 || nId == -1) selectedAtom = {};
  else selectedAtom = {"modelnum":mId, "i":nId};
}

function checkIntersection(count, ray, model, spheres) {
  var intersects = ray.intersectObjects(spheres);
  if(intersects.length > 0 && (selectedAtom["modelnum"] === undefined || intersects[0].object.name != selectedAtom["i"] || count != selectedAtom["modelnum"])) {
    model.geometry.colors[intersects[0].object.name] = new THREE.Color();
    model.geometry.colors[intersects[0].object.name].setRGB(0.5, 1.0, 0.5);
    return intersects[0].object.name;
  }
  return -1;
}


function deselectColors() {
  if(selectedMolecules["i"] !== undefined) {
    for(var i = 0; i < models.length; i++) {
        if(colorType == 0) {
          for(var j = 0; j < models[i].geometry.colors.length; j++) {
            if(models[i].residues[j] == selectedMolecules["m"]) {
                  if(models[i].types[j] == 'g')         models[i].colors[j].setRGB(0.80, 0.15, 0.00);
                  else if(models[i].types[j] == 'u')    models[i].colors[j].setRGB(0.00, 0.36, 0.72);
                  else if(models[i].types[j] == 'a')    models[i].colors[j].setRGB(0.99, 0.95, 0.00);
                  else if(models[i].types[j] == 'c')    models[i].colors[j].setRGB(0.00, 0.65, 0.00);
                  else if(models[i].types[j] == 'fmn')   models[i].colors[j] = models[i].colorscopy[j];
            }
          }
          for(var j = 0; j < models[i].bonds.length; j++) {
            if(models[i].bonds[j].residueName == selectedMolecules["m"]) {
              var mat = models[i].lineMaterial[0];
              var rType = models[i].bonds[j].residueType;
              var rName = models[i].bonds[j].residueName;
              if(rType == 'g') mat = models[i].lineMaterial[1];
              if(rType == 'u') mat = models[i].lineMaterial[2];
              if(rType == 'a') mat = models[i].lineMaterial[3];
              if(rType == 'c') mat = models[i].lineMaterial[4];
              if(startingResidues.indexOf(rName) >= 0) mat = models[i].lineMaterial[8];
              scene.remove(models[i].bonds[j]);
              models[i].bonds[j] = new THREE.Line(models[i].lineGeometry[j], mat, THREE.LinePieces);
              models[i].bonds[j].residueType = rType;
              models[i].bonds[j].residueName = rName;
              if(displayType != 0) scene.add(models[i].bonds[j]);
            }
          }
        } else {
          for(var j = 0; j < models[i].geometry.colors.length; j++) {
            if(models[i].residues[j] == selectedMolecules["m"])
              models[i].colors[j].setRGB(models[i].colorscopy[j].r, models[i].colorscopy[j].g, models[i].colorscopy[j].b);
          }
          for(var j = 0; j < models[i].bonds.length; j++) {
            if(models[i].bonds[j].residueName == selectedMolecules["m"]) {
              var mat = models[i].lineMaterial[0];
              var rType = models[i].bonds[j].residueType;
              var rName = models[i].bonds[j].residueName;
              scene.remove(models[i].bonds[j]);
              models[i].bonds[j] = new THREE.Line(models[i].lineGeometry[j], mat, THREE.LinePieces);
              models[i].bonds[j].residueType = rType;
              models[i].bonds[j].residueName = rName;
              if(displayType != 0) scene.add(models[i].bonds[j]);
            }
          }
        }
      }
    }

  if(selectedAtom["modelnum"] !== undefined) {
    var am = models[selectedAtom["modelnum"]].geometry.colors[selectedAtom["i"]];
    var cam = models[selectedAtom["modelnum"]].colorscopy[selectedAtom["i"]];
    var rType = models[selectedAtom["modelnum"]].types[selectedAtom["i"]];
    if(colorType == 0) {
      if(rType == 'g') am.setRGB(0.80, 0.15, 0.00);
      if(rType == 'u') am.setRGB(0.00, 0.36, 0.72);
      if(rType == 'a') am.setRGB(0.99, 0.95, 0.00);
      if(rType == 'c') am.setRGB(0.00, 0.65, 0.00);
      if(rType == 'fmn') { console.log("HI"); models[selectedAtom["modelnum"]].geometry.colors[selectedAtom["i"]] = models[selectedAtom["modelnum"]].colorscopy[selectedAtom["i"]]; }
    } else {
      am.setRGB(cam.r, cam.g, cam.b);
    }
  }

  for(var i = 0; i < starting.length; i++) {
    var c = models[0].geometry.colors[starting[i]];
    if(!c) continue;
    c.setRGB(0.99, 0.99, 0.5);
  }

  for(var i = 0; i < models.length; i++) {
    if(models[i].isHelix != 2) continue;
    for(var j = 0; j < models[i].geometry.colors.length; j++) {
      models[i].geometry.colors[j].setRGB(0.9, 0.9, 0.9);
    }
    for(var j = 0; j < models[i].bonds.length; j++) {
      models[i].bonds[j].material = models[i].lineMaterial[7];
    }
  }

}

  var direction = 0.1;
  function animate() {
    requestAnimationFrame( animate );
    controls.update();

    var d = Math.round(Math.pow(Math.pow(camera.position.x, 2) + Math.pow(camera.position.y, 2) + Math.pow(camera.position.z, 2), 0.5));
    var size = 0.5;
    if(d >= 2500) size = 0.5; else if(d >= 2000) size = 1; else if( d >= 1500) size = 1.5; else if(d >= 1000) size = 2; else size = 3;
    if(displayType == 1) size += 1.5;

    for(var i = 0; i < starting.length; i++) {
      var c = models[0].geometry.colors[starting[i]];
      c.setRGB(c.r + direction, c.g, c.b + direction);
     // console.log(c);
    }

    for(var i = 0; i < models.length; i++) {
      if(!models[i].lineMaterial[8]) continue;
      var c = models[i].lineMaterial[8].color;
      c.setRGB(c.r + direction, c.g, c.b + direction);
      // models[i].lineMaterial[8].color = "rgb(99%, 99%, 50%)";
    }

    if(models.length > 0 && starting.length > 0 && (models[0].geometry.colors[starting[0]].r >= 1 || models[0].geometry.colors[starting[0]].b <= 0))direction *= -1;
    
      for(var i = 0; i < models.length; i++) {
        for(var j = 0; j < models[i].lineMaterial.length; j++) {
          models[i].lineMaterial[j].linewidth = size;
        }
       // console.log(models[i].lineMaterial.length);
       if(models[i].lineMaterial.length < 3) continue;
        models[i].lineMaterial[models[i].lineMaterial.length-3].linewidth = size + 6;
      }

    var x = Math.round(controls.object.position.x);
    var y = Math.round(controls.object.position.y);
    var z = Math.round(controls.object.position.z);
    document.getElementById("detailsZoom").innerHTML = "Camera: (" + x + "," + y + "," + z +")";

    render();
  }

  function render() {
    renderer.render( scene, camera );
  }

// 1 ) Event when you hover over the links that have several menu items
// When you hover over, hide all other popups and show yours
var navElements = document.getElementsByClassName("link multi");

for(var i = 0; i < navElements.length; i++) {
  var obj = navElements[i];
  obj.setAttribute('id', i+"_navElem");
      
  obj.onmouseover = function() {
    var m = document.getElementsByClassName("popupmenu rounded10");
    
    for(var i = 0; i < m.length; i++) {
      m[i].style.display = "none";
    }
        
    m[this.id.substring(0, this.id.indexOf("_"))].style.display = "block";
  }
}

// 2 ) Event when you leave the popup menu item
// When you leave, check back in 50 ms to see if you actually left,
// due to faulty event firing.
navElements = document.getElementsByClassName("popupmenu rounded10");
    
var exitedNav = null;
    
for(var i = 0; i < navElements.length; i++) {

  navElements[i].onmouseover = function() {
    this.setAttribute('id', 1);
  }

  navElements[i].onmouseout = function() {
    this.setAttribute('id', 0);
    exitedNav = this;
    setTimeout(function() {
      if(exitedNav.id == 0) exitedNav.style.display = "none";
    }, 50);
  }
}


var motifContainers = [];

// 1 ) Event code for when the user is searching for something
// If the string is empty, show all motifs
// Otherwise, only show motifs that have the search string
// Then recalculate the scrollbar length
document.getElementById("search").onkeyup = function() {
  var key = this.value.toLowerCase().trim();
  for(var i = 0; i < motifContainers.length; i++) {
    if(key == "") motifContainers[i].style.display = "block";
    else if(motifContainers[i].childNodes[1].innerHTML.toLowerCase().indexOf(key) >= 0) motifContainers[i].style.display = "block";
    else motifContainers[i].style.display = "none";
  }
  scrollbar.recalculateLayout(); 
}

// 2 ) When we are dynamically creating motifs, they are out of order
// Because the requests are all sent at the same time, and the images
// load at different rates. This sorts the motifs based off of their
// motif number. It doesn't recalculate scrollbar because the number
// of motifs doesn't change.
function resortMotifs() {
  var toSort = document.getElementById('scrollbar_content').children;
  toSort = Array.prototype.slice.call(toSort, 0);

  toSort.sort(function(a, b) {
    var aord = a.childNodes[1].innerHTML;
    var bord = b.childNodes[1].innerHTML;
    // console.log(aord + " " + bord);
    if(aord == "Helix") return -1;
    if(bord == "Helix") return 1;
    
    if(aord > bord) return 1;
    else if(aord == bord) return 0;
    return -1;
    // return aord - bord;
  });

  var parent = document.getElementById('scrollbar_content');
  parent.innerHTML = "";

  for(var i = 0, l = toSort.length; i < l; i++) {
      parent.appendChild(toSort[i]);
  }
}

// 3) Create the actual scrollbar and set the number of motifss
var scrollbar = new Control.ScrollBar('scrollbar_content','scrollbar_track');  
var scrollContainer = document.getElementById("scrollbar_content");
var max = 733;

// 4 ) Dynamically create each of the motif containers - very messy
// First create the image, if it loads (if it is a valid motif), then
// create the motifcontainer, the motif description, the motif overlay,
// and the motif add button, then add all these to the overall scroll container.
// Then, recalculate the scroll container. Once we reach the very end of all the
// motifs, we resort, fade out the loading motif overlay, and after 0.5s remove
// it completely.

var motifurls = ["motifs/two_ways/TWOWAY.157D.0/TWOWAY.157D.0.pdb", "motifs/two_ways/TWOWAY.157D.1/TWOWAY.157D.1.pdb", "motifs/two_ways/TWOWAY.165D.0/TWOWAY.165D.0.pdb", "motifs/two_ways/TWOWAY.1A34.0/TWOWAY.1A34.0.pdb", "motifs/two_ways/TWOWAY.1CSL.0/TWOWAY.1CSL.0.pdb", "motifs/two_ways/TWOWAY.1D4R.0/TWOWAY.1D4R.0.pdb", "motifs/two_ways/TWOWAY.1D4R.1/TWOWAY.1D4R.1.pdb", "motifs/two_ways/TWOWAY.1D4R.2/TWOWAY.1D4R.2.pdb", "motifs/two_ways/TWOWAY.1DFU.0/TWOWAY.1DFU.0.pdb", "motifs/two_ways/TWOWAY.1DUQ.0/TWOWAY.1DUQ.0.pdb", "motifs/two_ways/TWOWAY.1DUQ.1/TWOWAY.1DUQ.1.pdb", "motifs/two_ways/TWOWAY.1DUQ.2/TWOWAY.1DUQ.2.pdb", "motifs/two_ways/TWOWAY.1DUQ.3/TWOWAY.1DUQ.3.pdb", "motifs/two_ways/TWOWAY.1DUQ.7/TWOWAY.1DUQ.7.pdb", "motifs/two_ways/TWOWAY.1FEU.0/TWOWAY.1FEU.0.pdb", "motifs/two_ways/TWOWAY.1FEU.1/TWOWAY.1FEU.1.pdb", "motifs/two_ways/TWOWAY.1FUF.0/TWOWAY.1FUF.0.pdb", "motifs/two_ways/TWOWAY.1FUF.1/TWOWAY.1FUF.1.pdb", "motifs/two_ways/TWOWAY.1GID.0/TWOWAY.1GID.0.pdb", "motifs/two_ways/TWOWAY.1GID.1/TWOWAY.1GID.1.pdb", "motifs/two_ways/TWOWAY.1GID.12/TWOWAY.1GID.12.pdb", "motifs/two_ways/TWOWAY.1GID.13/TWOWAY.1GID.13.pdb", "motifs/two_ways/TWOWAY.1GID.2/TWOWAY.1GID.2.pdb", "motifs/two_ways/TWOWAY.1GID.3/TWOWAY.1GID.3.pdb", "motifs/two_ways/TWOWAY.1GID.4/TWOWAY.1GID.4.pdb", "motifs/two_ways/TWOWAY.1GID.5/TWOWAY.1GID.5.pdb", "motifs/two_ways/TWOWAY.1GID.6/TWOWAY.1GID.6.pdb", "motifs/two_ways/TWOWAY.1GID.7/TWOWAY.1GID.7.pdb", "motifs/two_ways/TWOWAY.1GID.8/TWOWAY.1GID.8.pdb", "motifs/two_ways/TWOWAY.1GID.9/TWOWAY.1GID.9.pdb", "motifs/two_ways/TWOWAY.1I9X.0/TWOWAY.1I9X.0.pdb", "motifs/two_ways/TWOWAY.1J9H.0/TWOWAY.1J9H.0.pdb", "motifs/two_ways/TWOWAY.1J9H.1/TWOWAY.1J9H.1.pdb", "motifs/two_ways/TWOWAY.1J9H.2/TWOWAY.1J9H.2.pdb", "motifs/two_ways/TWOWAY.1J9H.3/TWOWAY.1J9H.3.pdb", "motifs/two_ways/TWOWAY.1JBR.0/TWOWAY.1JBR.0.pdb", "motifs/two_ways/TWOWAY.1JBR.1/TWOWAY.1JBR.1.pdb", "motifs/two_ways/TWOWAY.1JBS.0/TWOWAY.1JBS.0.pdb", "motifs/two_ways/TWOWAY.1JBS.1/TWOWAY.1JBS.1.pdb", "motifs/two_ways/TWOWAY.1JID.0/TWOWAY.1JID.0.pdb", "motifs/two_ways/TWOWAY.1JZV.0/TWOWAY.1JZV.0.pdb", "motifs/two_ways/TWOWAY.1JZV.1/TWOWAY.1JZV.1.pdb", "motifs/two_ways/TWOWAY.1KD5.0/TWOWAY.1KD5.0.pdb", "motifs/two_ways/TWOWAY.1LNG.0/TWOWAY.1LNG.0.pdb", "motifs/two_ways/TWOWAY.1LNG.1/TWOWAY.1LNG.1.pdb", "motifs/two_ways/TWOWAY.1LNG.2/TWOWAY.1LNG.2.pdb", "motifs/two_ways/TWOWAY.1LNG.3/TWOWAY.1LNG.3.pdb", "motifs/two_ways/TWOWAY.1LNT.0/TWOWAY.1LNT.0.pdb", "motifs/two_ways/TWOWAY.1M5O.0/TWOWAY.1M5O.0.pdb", "motifs/two_ways/TWOWAY.1M5O.1/TWOWAY.1M5O.1.pdb", "motifs/two_ways/TWOWAY.1M5O.2/TWOWAY.1M5O.2.pdb", "motifs/two_ways/TWOWAY.1MJI.0/TWOWAY.1MJI.0.pdb", "motifs/two_ways/TWOWAY.1MJI.1/TWOWAY.1MJI.1.pdb", "motifs/two_ways/TWOWAY.1MSW.0/TWOWAY.1MSW.0.pdb", "motifs/two_ways/TWOWAY.1MWL.0/TWOWAY.1MWL.0.pdb", "motifs/two_ways/TWOWAY.1MWL.3/TWOWAY.1MWL.3.pdb", "motifs/two_ways/TWOWAY.1NUV.0/TWOWAY.1NUV.0.pdb", "motifs/two_ways/TWOWAY.1NUV.1/TWOWAY.1NUV.1.pdb", "motifs/two_ways/TWOWAY.1NUV.3/TWOWAY.1NUV.3.pdb", "motifs/two_ways/TWOWAY.1O9M.0/TWOWAY.1O9M.0.pdb", "motifs/two_ways/TWOWAY.1O9M.1/TWOWAY.1O9M.1.pdb", "motifs/two_ways/TWOWAY.1O9M.2/TWOWAY.1O9M.2.pdb", "motifs/two_ways/TWOWAY.1O9M.3/TWOWAY.1O9M.3.pdb", "motifs/two_ways/TWOWAY.1OOA.0/TWOWAY.1OOA.0.pdb", "motifs/two_ways/TWOWAY.1OOA.1/TWOWAY.1OOA.1.pdb", "motifs/two_ways/TWOWAY.1OOA.2/TWOWAY.1OOA.2.pdb", "motifs/two_ways/TWOWAY.1Q96.0/TWOWAY.1Q96.0.pdb", "motifs/two_ways/TWOWAY.1Q96.1/TWOWAY.1Q96.1.pdb", "motifs/two_ways/TWOWAY.1Q96.2/TWOWAY.1Q96.2.pdb", "motifs/two_ways/TWOWAY.1QBP.0/TWOWAY.1QBP.0.pdb", "motifs/two_ways/TWOWAY.1QBP.1/TWOWAY.1QBP.1.pdb", "motifs/two_ways/TWOWAY.1QBP.2/TWOWAY.1QBP.2.pdb", "motifs/two_ways/TWOWAY.1QTQ.0/TWOWAY.1QTQ.0.pdb", "motifs/two_ways/TWOWAY.1R3E.0/TWOWAY.1R3E.0.pdb", "motifs/two_ways/TWOWAY.1R3E.1/TWOWAY.1R3E.1.pdb", "motifs/two_ways/TWOWAY.1RPU.0/TWOWAY.1RPU.0.pdb", "motifs/two_ways/TWOWAY.1S72.0/TWOWAY.1S72.0.pdb", "motifs/two_ways/TWOWAY.1S72.1/TWOWAY.1S72.1.pdb", "motifs/two_ways/TWOWAY.1S72.10/TWOWAY.1S72.10.pdb", "motifs/two_ways/TWOWAY.1S72.100/TWOWAY.1S72.100.pdb", "motifs/two_ways/TWOWAY.1S72.101/TWOWAY.1S72.101.pdb", "motifs/two_ways/TWOWAY.1S72.102/TWOWAY.1S72.102.pdb", "motifs/two_ways/TWOWAY.1S72.11/TWOWAY.1S72.11.pdb", "motifs/two_ways/TWOWAY.1S72.12/TWOWAY.1S72.12.pdb", "motifs/two_ways/TWOWAY.1S72.13/TWOWAY.1S72.13.pdb", "motifs/two_ways/TWOWAY.1S72.14/TWOWAY.1S72.14.pdb", "motifs/two_ways/TWOWAY.1S72.15/TWOWAY.1S72.15.pdb", "motifs/two_ways/TWOWAY.1S72.17/TWOWAY.1S72.17.pdb", "motifs/two_ways/TWOWAY.1S72.18/TWOWAY.1S72.18.pdb", "motifs/two_ways/TWOWAY.1S72.19/TWOWAY.1S72.19.pdb", "motifs/two_ways/TWOWAY.1S72.2/TWOWAY.1S72.2.pdb", "motifs/two_ways/TWOWAY.1S72.20/TWOWAY.1S72.20.pdb", "motifs/two_ways/TWOWAY.1S72.22/TWOWAY.1S72.22.pdb", "motifs/two_ways/TWOWAY.1S72.23/TWOWAY.1S72.23.pdb", "motifs/two_ways/TWOWAY.1S72.24/TWOWAY.1S72.24.pdb", "motifs/two_ways/TWOWAY.1S72.25/TWOWAY.1S72.25.pdb", "motifs/two_ways/TWOWAY.1S72.28/TWOWAY.1S72.28.pdb", "motifs/two_ways/TWOWAY.1S72.29/TWOWAY.1S72.29.pdb", "motifs/two_ways/TWOWAY.1S72.3/TWOWAY.1S72.3.pdb", "motifs/two_ways/TWOWAY.1S72.30/TWOWAY.1S72.30.pdb", "motifs/two_ways/TWOWAY.1S72.31/TWOWAY.1S72.31.pdb", "motifs/two_ways/TWOWAY.1S72.32/TWOWAY.1S72.32.pdb", "motifs/two_ways/TWOWAY.1S72.33/TWOWAY.1S72.33.pdb", "motifs/two_ways/TWOWAY.1S72.34/TWOWAY.1S72.34.pdb", "motifs/two_ways/TWOWAY.1S72.36/TWOWAY.1S72.36.pdb", "motifs/two_ways/TWOWAY.1S72.37/TWOWAY.1S72.37.pdb", "motifs/two_ways/TWOWAY.1S72.38/TWOWAY.1S72.38.pdb", "motifs/two_ways/TWOWAY.1S72.39/TWOWAY.1S72.39.pdb", "motifs/two_ways/TWOWAY.1S72.4/TWOWAY.1S72.4.pdb", "motifs/two_ways/TWOWAY.1S72.41/TWOWAY.1S72.41.pdb", "motifs/two_ways/TWOWAY.1S72.42/TWOWAY.1S72.42.pdb", "motifs/two_ways/TWOWAY.1S72.43/TWOWAY.1S72.43.pdb", "motifs/two_ways/TWOWAY.1S72.44/TWOWAY.1S72.44.pdb", "motifs/two_ways/TWOWAY.1S72.46/TWOWAY.1S72.46.pdb", "motifs/two_ways/TWOWAY.1S72.47/TWOWAY.1S72.47.pdb", "motifs/two_ways/TWOWAY.1S72.48/TWOWAY.1S72.48.pdb", "motifs/two_ways/TWOWAY.1S72.49/TWOWAY.1S72.49.pdb", "motifs/two_ways/TWOWAY.1S72.5/TWOWAY.1S72.5.pdb", "motifs/two_ways/TWOWAY.1S72.51/TWOWAY.1S72.51.pdb", "motifs/two_ways/TWOWAY.1S72.52/TWOWAY.1S72.52.pdb", "motifs/two_ways/TWOWAY.1S72.53/TWOWAY.1S72.53.pdb", "motifs/two_ways/TWOWAY.1S72.54/TWOWAY.1S72.54.pdb", "motifs/two_ways/TWOWAY.1S72.57/TWOWAY.1S72.57.pdb", "motifs/two_ways/TWOWAY.1S72.58/TWOWAY.1S72.58.pdb", "motifs/two_ways/TWOWAY.1S72.59/TWOWAY.1S72.59.pdb", "motifs/two_ways/TWOWAY.1S72.6/TWOWAY.1S72.6.pdb", "motifs/two_ways/TWOWAY.1S72.60/TWOWAY.1S72.60.pdb", "motifs/two_ways/TWOWAY.1S72.61/TWOWAY.1S72.61.pdb", "motifs/two_ways/TWOWAY.1S72.62/TWOWAY.1S72.62.pdb", "motifs/two_ways/TWOWAY.1S72.63/TWOWAY.1S72.63.pdb", "motifs/two_ways/TWOWAY.1S72.64/TWOWAY.1S72.64.pdb", "motifs/two_ways/TWOWAY.1S72.65/TWOWAY.1S72.65.pdb", "motifs/two_ways/TWOWAY.1S72.67/TWOWAY.1S72.67.pdb", "motifs/two_ways/TWOWAY.1S72.68/TWOWAY.1S72.68.pdb", "motifs/two_ways/TWOWAY.1S72.69/TWOWAY.1S72.69.pdb", "motifs/two_ways/TWOWAY.1S72.7/TWOWAY.1S72.7.pdb", "motifs/two_ways/TWOWAY.1S72.71/TWOWAY.1S72.71.pdb", "motifs/two_ways/TWOWAY.1S72.74/TWOWAY.1S72.74.pdb", "motifs/two_ways/TWOWAY.1S72.76/TWOWAY.1S72.76.pdb", "motifs/two_ways/TWOWAY.1S72.77/TWOWAY.1S72.77.pdb", "motifs/two_ways/TWOWAY.1S72.78/TWOWAY.1S72.78.pdb", "motifs/two_ways/TWOWAY.1S72.79/TWOWAY.1S72.79.pdb", "motifs/two_ways/TWOWAY.1S72.81/TWOWAY.1S72.81.pdb", "motifs/two_ways/TWOWAY.1S72.82/TWOWAY.1S72.82.pdb", "motifs/two_ways/TWOWAY.1S72.83/TWOWAY.1S72.83.pdb", "motifs/two_ways/TWOWAY.1S72.86/TWOWAY.1S72.86.pdb", "motifs/two_ways/TWOWAY.1S72.87/TWOWAY.1S72.87.pdb", "motifs/two_ways/TWOWAY.1S72.88/TWOWAY.1S72.88.pdb", "motifs/two_ways/TWOWAY.1S72.89/TWOWAY.1S72.89.pdb", "motifs/two_ways/TWOWAY.1S72.90/TWOWAY.1S72.90.pdb", "motifs/two_ways/TWOWAY.1S72.91/TWOWAY.1S72.91.pdb", "motifs/two_ways/TWOWAY.1S72.92/TWOWAY.1S72.92.pdb", "motifs/two_ways/TWOWAY.1S72.93/TWOWAY.1S72.93.pdb", "motifs/two_ways/TWOWAY.1S72.94/TWOWAY.1S72.94.pdb", "motifs/two_ways/TWOWAY.1S72.96/TWOWAY.1S72.96.pdb", "motifs/two_ways/TWOWAY.1S72.97/TWOWAY.1S72.97.pdb", "motifs/two_ways/TWOWAY.1S72.98/TWOWAY.1S72.98.pdb", "motifs/two_ways/TWOWAY.1T0D.1/TWOWAY.1T0D.1.pdb", "motifs/two_ways/TWOWAY.1T0D.3/TWOWAY.1T0D.3.pdb", "motifs/two_ways/TWOWAY.1T0E.1/TWOWAY.1T0E.1.pdb", "motifs/two_ways/TWOWAY.1TFW.0/TWOWAY.1TFW.0.pdb", "motifs/two_ways/TWOWAY.1YZ9.0/TWOWAY.1YZ9.0.pdb", "motifs/two_ways/TWOWAY.1YZ9.1/TWOWAY.1YZ9.1.pdb", "motifs/two_ways/TWOWAY.1Z7F.0/TWOWAY.1Z7F.0.pdb", "motifs/two_ways/TWOWAY.1Z7F.1/TWOWAY.1Z7F.1.pdb", "motifs/two_ways/TWOWAY.1ZH5.0/TWOWAY.1ZH5.0.pdb", "motifs/two_ways/TWOWAY.1ZX7.1/TWOWAY.1ZX7.1.pdb", "motifs/two_ways/TWOWAY.1ZX7.2/TWOWAY.1ZX7.2.pdb", "motifs/two_ways/TWOWAY.1ZX7.3/TWOWAY.1ZX7.3.pdb", "motifs/two_ways/TWOWAY.1ZX7.4/TWOWAY.1ZX7.4.pdb", "motifs/two_ways/TWOWAY.1ZX7.6/TWOWAY.1ZX7.6.pdb", "motifs/two_ways/TWOWAY.1ZX7.8/TWOWAY.1ZX7.8.pdb", "motifs/two_ways/TWOWAY.280D.0/TWOWAY.280D.0.pdb", "motifs/two_ways/TWOWAY.280D.1/TWOWAY.280D.1.pdb", "motifs/two_ways/TWOWAY.2FQN.0/TWOWAY.2FQN.0.pdb", "motifs/two_ways/TWOWAY.2FQN.1/TWOWAY.2FQN.1.pdb", "motifs/two_ways/TWOWAY.2FQN.2/TWOWAY.2FQN.2.pdb", "motifs/two_ways/TWOWAY.2FQN.3/TWOWAY.2FQN.3.pdb", "motifs/two_ways/TWOWAY.2GDI.1/TWOWAY.2GDI.1.pdb", "motifs/two_ways/TWOWAY.2GDI.3/TWOWAY.2GDI.3.pdb", "motifs/two_ways/TWOWAY.2GDI.4/TWOWAY.2GDI.4.pdb", "motifs/two_ways/TWOWAY.2GDI.5/TWOWAY.2GDI.5.pdb", "motifs/two_ways/TWOWAY.2GDI.6/TWOWAY.2GDI.6.pdb", "motifs/two_ways/TWOWAY.2GDI.7/TWOWAY.2GDI.7.pdb", "motifs/two_ways/TWOWAY.2HOJ.0/TWOWAY.2HOJ.0.pdb", "motifs/two_ways/TWOWAY.2HW8.0/TWOWAY.2HW8.0.pdb", "motifs/two_ways/TWOWAY.2NZ4.0/TWOWAY.2NZ4.0.pdb", "motifs/two_ways/TWOWAY.2NZ4.4/TWOWAY.2NZ4.4.pdb", "motifs/two_ways/TWOWAY.2NZ4.5/TWOWAY.2NZ4.5.pdb", "motifs/two_ways/TWOWAY.2NZ4.6/TWOWAY.2NZ4.6.pdb", "motifs/two_ways/TWOWAY.2NZ4.8/TWOWAY.2NZ4.8.pdb", "motifs/two_ways/TWOWAY.2OE5.0/TWOWAY.2OE5.0.pdb", "motifs/two_ways/TWOWAY.2OE5.1/TWOWAY.2OE5.1.pdb", "motifs/two_ways/TWOWAY.2PJP.0/TWOWAY.2PJP.0.pdb", "motifs/two_ways/TWOWAY.2PN4.0/TWOWAY.2PN4.0.pdb", "motifs/two_ways/TWOWAY.2PN4.1/TWOWAY.2PN4.1.pdb", "motifs/two_ways/TWOWAY.2PN4.2/TWOWAY.2PN4.2.pdb", "motifs/two_ways/TWOWAY.2PN4.3/TWOWAY.2PN4.3.pdb", "motifs/two_ways/TWOWAY.2PN4.4/TWOWAY.2PN4.4.pdb", "motifs/two_ways/TWOWAY.2PN4.5/TWOWAY.2PN4.5.pdb", "motifs/two_ways/TWOWAY.2PXV.0/TWOWAY.2PXV.0.pdb", "motifs/two_ways/TWOWAY.2PXV.1/TWOWAY.2PXV.1.pdb", "motifs/two_ways/TWOWAY.2PXV.2/TWOWAY.2PXV.2.pdb", "motifs/two_ways/TWOWAY.2QEK.0/TWOWAY.2QEK.0.pdb", "motifs/two_ways/TWOWAY.2QEK.1/TWOWAY.2QEK.1.pdb", "motifs/two_ways/TWOWAY.2QUX.0/TWOWAY.2QUX.0.pdb", "motifs/two_ways/TWOWAY.2QUX.1/TWOWAY.2QUX.1.pdb", "motifs/two_ways/TWOWAY.2QUX.2/TWOWAY.2QUX.2.pdb", "motifs/two_ways/TWOWAY.2QUX.4/TWOWAY.2QUX.4.pdb", "motifs/two_ways/TWOWAY.2QUX.5/TWOWAY.2QUX.5.pdb", "motifs/two_ways/TWOWAY.2R20.0/TWOWAY.2R20.0.pdb", "motifs/two_ways/TWOWAY.2R22.0/TWOWAY.2R22.0.pdb", "motifs/two_ways/TWOWAY.2UWM.0/TWOWAY.2UWM.0.pdb", "motifs/two_ways/TWOWAY.2UWM.1/TWOWAY.2UWM.1.pdb", "motifs/two_ways/TWOWAY.2UWM.2/TWOWAY.2UWM.2.pdb", "motifs/two_ways/TWOWAY.2VPL.0/TWOWAY.2VPL.0.pdb", "motifs/two_ways/TWOWAY.2VPL.1/TWOWAY.2VPL.1.pdb", "motifs/two_ways/TWOWAY.2VPL.2/TWOWAY.2VPL.2.pdb", "motifs/two_ways/TWOWAY.2VPL.3/TWOWAY.2VPL.3.pdb", "motifs/two_ways/TWOWAY.2VPL.4/TWOWAY.2VPL.4.pdb", "motifs/two_ways/TWOWAY.2VQE.0/TWOWAY.2VQE.0.pdb", "motifs/two_ways/TWOWAY.2VQE.1/TWOWAY.2VQE.1.pdb", "motifs/two_ways/TWOWAY.2VQE.10/TWOWAY.2VQE.10.pdb", "motifs/two_ways/TWOWAY.2VQE.11/TWOWAY.2VQE.11.pdb", "motifs/two_ways/TWOWAY.2VQE.12/TWOWAY.2VQE.12.pdb", "motifs/two_ways/TWOWAY.2VQE.13/TWOWAY.2VQE.13.pdb", "motifs/two_ways/TWOWAY.2VQE.14/TWOWAY.2VQE.14.pdb", "motifs/two_ways/TWOWAY.2VQE.15/TWOWAY.2VQE.15.pdb", "motifs/two_ways/TWOWAY.2VQE.16/TWOWAY.2VQE.16.pdb", "motifs/two_ways/TWOWAY.2VQE.18/TWOWAY.2VQE.18.pdb", "motifs/two_ways/TWOWAY.2VQE.19/TWOWAY.2VQE.19.pdb", "motifs/two_ways/TWOWAY.2VQE.2/TWOWAY.2VQE.2.pdb", "motifs/two_ways/TWOWAY.2VQE.24/TWOWAY.2VQE.24.pdb", "motifs/two_ways/TWOWAY.2VQE.25/TWOWAY.2VQE.25.pdb", "motifs/two_ways/TWOWAY.2VQE.26/TWOWAY.2VQE.26.pdb", "motifs/two_ways/TWOWAY.2VQE.27/TWOWAY.2VQE.27.pdb", "motifs/two_ways/TWOWAY.2VQE.28/TWOWAY.2VQE.28.pdb", "motifs/two_ways/TWOWAY.2VQE.29/TWOWAY.2VQE.29.pdb", "motifs/two_ways/TWOWAY.2VQE.3/TWOWAY.2VQE.3.pdb", "motifs/two_ways/TWOWAY.2VQE.30/TWOWAY.2VQE.30.pdb", "motifs/two_ways/TWOWAY.2VQE.31/TWOWAY.2VQE.31.pdb", "motifs/two_ways/TWOWAY.2VQE.32/TWOWAY.2VQE.32.pdb", "motifs/two_ways/TWOWAY.2VQE.33/TWOWAY.2VQE.33.pdb", "motifs/two_ways/TWOWAY.2VQE.34/TWOWAY.2VQE.34.pdb", "motifs/two_ways/TWOWAY.2VQE.35/TWOWAY.2VQE.35.pdb", "motifs/two_ways/TWOWAY.2VQE.36/TWOWAY.2VQE.36.pdb", "motifs/two_ways/TWOWAY.2VQE.39/TWOWAY.2VQE.39.pdb", "motifs/two_ways/TWOWAY.2VQE.40/TWOWAY.2VQE.40.pdb", "motifs/two_ways/TWOWAY.2VQE.41/TWOWAY.2VQE.41.pdb", "motifs/two_ways/TWOWAY.2VQE.42/TWOWAY.2VQE.42.pdb", "motifs/two_ways/TWOWAY.2VQE.43/TWOWAY.2VQE.43.pdb", "motifs/two_ways/TWOWAY.2VQE.45/TWOWAY.2VQE.45.pdb", "motifs/two_ways/TWOWAY.2VQE.46/TWOWAY.2VQE.46.pdb", "motifs/two_ways/TWOWAY.2VQE.47/TWOWAY.2VQE.47.pdb", "motifs/two_ways/TWOWAY.2VQE.49/TWOWAY.2VQE.49.pdb", "motifs/two_ways/TWOWAY.2VQE.50/TWOWAY.2VQE.50.pdb", "motifs/two_ways/TWOWAY.2VQE.51/TWOWAY.2VQE.51.pdb", "motifs/two_ways/TWOWAY.2VQE.56/TWOWAY.2VQE.56.pdb", "motifs/two_ways/TWOWAY.2VQE.57/TWOWAY.2VQE.57.pdb", "motifs/two_ways/TWOWAY.2VQE.59/TWOWAY.2VQE.59.pdb", "motifs/two_ways/TWOWAY.2VQE.6/TWOWAY.2VQE.6.pdb", "motifs/two_ways/TWOWAY.2VQE.7/TWOWAY.2VQE.7.pdb", "motifs/two_ways/TWOWAY.2VQE.8/TWOWAY.2VQE.8.pdb", "motifs/two_ways/TWOWAY.2VQE.9/TWOWAY.2VQE.9.pdb", /*"motifs/two_ways/TWOWAY.2Y9H.0/TWOWAY.2Y9H.0.pdb",*/ "motifs/two_ways/TWOWAY.2ZKO.0/TWOWAY.2ZKO.0.pdb", "motifs/two_ways/TWOWAY.2ZY6.0/TWOWAY.2ZY6.0.pdb", "motifs/two_ways/TWOWAY.2ZY6.1/TWOWAY.2ZY6.1.pdb", "motifs/two_ways/TWOWAY.353D.0/TWOWAY.353D.0.pdb", "motifs/two_ways/TWOWAY.354D.0/TWOWAY.354D.0.pdb", "motifs/two_ways/TWOWAY.397D.0/TWOWAY.397D.0.pdb", "motifs/two_ways/TWOWAY.3AM1.0/TWOWAY.3AM1.0.pdb", "motifs/two_ways/TWOWAY.3B31.0/TWOWAY.3B31.0.pdb", "motifs/two_ways/TWOWAY.3BNO.0/TWOWAY.3BNO.0.pdb", "motifs/two_ways/TWOWAY.3BNO.1/TWOWAY.3BNO.1.pdb", "motifs/two_ways/TWOWAY.3BNO.2/TWOWAY.3BNO.2.pdb", "motifs/two_ways/TWOWAY.3BNO.3/TWOWAY.3BNO.3.pdb", "motifs/two_ways/TWOWAY.3BNO.4/TWOWAY.3BNO.4.pdb", "motifs/two_ways/TWOWAY.3BNO.6/TWOWAY.3BNO.6.pdb", "motifs/two_ways/TWOWAY.3BNO.7/TWOWAY.3BNO.7.pdb", "motifs/two_ways/TWOWAY.3BNQ.0/TWOWAY.3BNQ.0.pdb", "motifs/two_ways/TWOWAY.3BNQ.1/TWOWAY.3BNQ.1.pdb", "motifs/two_ways/TWOWAY.3BNQ.2/TWOWAY.3BNQ.2.pdb", "motifs/two_ways/TWOWAY.3BNQ.3/TWOWAY.3BNQ.3.pdb", "motifs/two_ways/TWOWAY.3BNQ.4/TWOWAY.3BNQ.4.pdb", "motifs/two_ways/TWOWAY.3BNQ.5/TWOWAY.3BNQ.5.pdb", "motifs/two_ways/TWOWAY.3BNQ.6/TWOWAY.3BNQ.6.pdb", "motifs/two_ways/TWOWAY.3BNQ.7/TWOWAY.3BNQ.7.pdb", "motifs/two_ways/TWOWAY.3CGP.0/TWOWAY.3CGP.0.pdb", "motifs/two_ways/TWOWAY.3CGS.0/TWOWAY.3CGS.0.pdb", "motifs/two_ways/TWOWAY.3CJZ.0/TWOWAY.3CJZ.0.pdb", "motifs/two_ways/TWOWAY.3DIL.0/TWOWAY.3DIL.0.pdb", "motifs/two_ways/TWOWAY.3DIL.1/TWOWAY.3DIL.1.pdb", "motifs/two_ways/TWOWAY.3DIL.2/TWOWAY.3DIL.2.pdb", "motifs/two_ways/TWOWAY.3DIL.3/TWOWAY.3DIL.3.pdb", "motifs/two_ways/TWOWAY.3DIL.4/TWOWAY.3DIL.4.pdb", "motifs/two_ways/TWOWAY.3DIL.5/TWOWAY.3DIL.5.pdb", "motifs/two_ways/TWOWAY.3DVZ.0/TWOWAY.3DVZ.0.pdb", "motifs/two_ways/TWOWAY.3E5C.0/TWOWAY.3E5C.0.pdb", "motifs/two_ways/TWOWAY.3EGZ.0/TWOWAY.3EGZ.0.pdb", "motifs/two_ways/TWOWAY.3FO4.0/TWOWAY.3FO4.0.pdb", "motifs/two_ways/TWOWAY.3FOZ.0/TWOWAY.3FOZ.0.pdb", "motifs/two_ways/TWOWAY.3FOZ.1/TWOWAY.3FOZ.1.pdb", "motifs/two_ways/TWOWAY.3GLP.0/TWOWAY.3GLP.0.pdb", "motifs/two_ways/TWOWAY.3GLP.1/TWOWAY.3GLP.1.pdb", "motifs/two_ways/TWOWAY.3GLP.2/TWOWAY.3GLP.2.pdb", "motifs/two_ways/TWOWAY.3GLP.3/TWOWAY.3GLP.3.pdb", "motifs/two_ways/TWOWAY.3GX5.0/TWOWAY.3GX5.0.pdb", "motifs/two_ways/TWOWAY.3GX5.1/TWOWAY.3GX5.1.pdb", "motifs/two_ways/TWOWAY.3GX5.2/TWOWAY.3GX5.2.pdb", "motifs/two_ways/TWOWAY.3LA5.0/TWOWAY.3LA5.0.pdb", "motifs/two_ways/TWOWAY.3LOA.0/TWOWAY.3LOA.0.pdb", "motifs/two_ways/TWOWAY.3LOA.1/TWOWAY.3LOA.1.pdb", "motifs/two_ways/TWOWAY.3LRR.0/TWOWAY.3LRR.0.pdb", "motifs/two_ways/TWOWAY.3MEI.0/TWOWAY.3MEI.0.pdb", "motifs/two_ways/TWOWAY.3MEI.1/TWOWAY.3MEI.1.pdb", "motifs/two_ways/TWOWAY.3MEI.2/TWOWAY.3MEI.2.pdb", "motifs/two_ways/TWOWAY.3MXH.2/TWOWAY.3MXH.2.pdb", "motifs/two_ways/TWOWAY.3NJ7.0/TWOWAY.3NJ7.0.pdb", "motifs/two_ways/TWOWAY.3NJ7.1/TWOWAY.3NJ7.1.pdb", "motifs/two_ways/TWOWAY.3NJ7.2/TWOWAY.3NJ7.2.pdb", "motifs/two_ways/TWOWAY.3NJ7.3/TWOWAY.3NJ7.3.pdb", "motifs/two_ways/TWOWAY.3NJ7.4/TWOWAY.3NJ7.4.pdb", "motifs/two_ways/TWOWAY.3NJ7.5/TWOWAY.3NJ7.5.pdb", "motifs/two_ways/TWOWAY.3NKB.0/TWOWAY.3NKB.0.pdb", "motifs/two_ways/TWOWAY.3NPQ.0/TWOWAY.3NPQ.0.pdb", "motifs/two_ways/TWOWAY.3NPQ.1/TWOWAY.3NPQ.1.pdb", "motifs/two_ways/TWOWAY.3NPQ.2/TWOWAY.3NPQ.2.pdb", "motifs/two_ways/TWOWAY.3P59.1/TWOWAY.3P59.1.pdb", "motifs/two_ways/TWOWAY.3R1C.0/TWOWAY.3R1C.0.pdb", "motifs/two_ways/TWOWAY.3R1C.1/TWOWAY.3R1C.1.pdb", "motifs/two_ways/TWOWAY.3R1C.10/TWOWAY.3R1C.10.pdb", "motifs/two_ways/TWOWAY.3R1C.11/TWOWAY.3R1C.11.pdb", "motifs/two_ways/TWOWAY.3R1C.12/TWOWAY.3R1C.12.pdb", "motifs/two_ways/TWOWAY.3R1C.13/TWOWAY.3R1C.13.pdb", "motifs/two_ways/TWOWAY.3R1C.14/TWOWAY.3R1C.14.pdb", "motifs/two_ways/TWOWAY.3R1C.15/TWOWAY.3R1C.15.pdb", "motifs/two_ways/TWOWAY.3R1C.16/TWOWAY.3R1C.16.pdb", "motifs/two_ways/TWOWAY.3R1C.17/TWOWAY.3R1C.17.pdb", "motifs/two_ways/TWOWAY.3R1C.18/TWOWAY.3R1C.18.pdb", "motifs/two_ways/TWOWAY.3R1C.19/TWOWAY.3R1C.19.pdb", "motifs/two_ways/TWOWAY.3R1C.2/TWOWAY.3R1C.2.pdb", "motifs/two_ways/TWOWAY.3R1C.20/TWOWAY.3R1C.20.pdb", "motifs/two_ways/TWOWAY.3R1C.21/TWOWAY.3R1C.21.pdb", "motifs/two_ways/TWOWAY.3R1C.22/TWOWAY.3R1C.22.pdb", "motifs/two_ways/TWOWAY.3R1C.23/TWOWAY.3R1C.23.pdb", "motifs/two_ways/TWOWAY.3R1C.24/TWOWAY.3R1C.24.pdb", "motifs/two_ways/TWOWAY.3R1C.25/TWOWAY.3R1C.25.pdb", "motifs/two_ways/TWOWAY.3R1C.26/TWOWAY.3R1C.26.pdb", "motifs/two_ways/TWOWAY.3R1C.27/TWOWAY.3R1C.27.pdb", "motifs/two_ways/TWOWAY.3R1C.28/TWOWAY.3R1C.28.pdb", "motifs/two_ways/TWOWAY.3R1C.29/TWOWAY.3R1C.29.pdb", "motifs/two_ways/TWOWAY.3R1C.3/TWOWAY.3R1C.3.pdb", "motifs/two_ways/TWOWAY.3R1C.30/TWOWAY.3R1C.30.pdb", "motifs/two_ways/TWOWAY.3R1C.31/TWOWAY.3R1C.31.pdb", "motifs/two_ways/TWOWAY.3R1C.32/TWOWAY.3R1C.32.pdb", "motifs/two_ways/TWOWAY.3R1C.33/TWOWAY.3R1C.33.pdb", "motifs/two_ways/TWOWAY.3R1C.34/TWOWAY.3R1C.34.pdb", "motifs/two_ways/TWOWAY.3R1C.35/TWOWAY.3R1C.35.pdb", "motifs/two_ways/TWOWAY.3R1C.4/TWOWAY.3R1C.4.pdb", "motifs/two_ways/TWOWAY.3R1C.5/TWOWAY.3R1C.5.pdb", "motifs/two_ways/TWOWAY.3R1C.6/TWOWAY.3R1C.6.pdb", "motifs/two_ways/TWOWAY.3R1C.7/TWOWAY.3R1C.7.pdb", "motifs/two_ways/TWOWAY.3R1C.8/TWOWAY.3R1C.8.pdb", "motifs/two_ways/TWOWAY.3R1C.9/TWOWAY.3R1C.9.pdb", "motifs/two_ways/TWOWAY.3R1D.1/TWOWAY.3R1D.1.pdb", "motifs/two_ways/TWOWAY.3R1D.4/TWOWAY.3R1D.4.pdb", "motifs/two_ways/TWOWAY.3R2D.0/TWOWAY.3R2D.0.pdb", "motifs/two_ways/TWOWAY.3R2D.1/TWOWAY.3R2D.1.pdb", "motifs/two_ways/TWOWAY.3RW6.0/TWOWAY.3RW6.0.pdb", "motifs/two_ways/TWOWAY.3RW6.1/TWOWAY.3RW6.1.pdb", "motifs/two_ways/TWOWAY.3RW6.2/TWOWAY.3RW6.2.pdb", "motifs/two_ways/TWOWAY.3RW6.3/TWOWAY.3RW6.3.pdb", "motifs/two_ways/TWOWAY.3RW6.4/TWOWAY.3RW6.4.pdb", "motifs/two_ways/TWOWAY.3RW6.5/TWOWAY.3RW6.5.pdb", "motifs/two_ways/TWOWAY.3RW6.6/TWOWAY.3RW6.6.pdb", "motifs/two_ways/TWOWAY.3RW6.7/TWOWAY.3RW6.7.pdb", "motifs/two_ways/TWOWAY.3SJ2.0/TWOWAY.3SJ2.0.pdb", "motifs/two_ways/TWOWAY.3SJ2.1/TWOWAY.3SJ2.1.pdb", "motifs/two_ways/TWOWAY.3SJ2.2/TWOWAY.3SJ2.2.pdb", "motifs/two_ways/TWOWAY.3SYW.0/TWOWAY.3SYW.0.pdb", "motifs/two_ways/TWOWAY.3SYW.1/TWOWAY.3SYW.1.pdb", "motifs/two_ways/TWOWAY.3SYW.2/TWOWAY.3SYW.2.pdb", "motifs/two_ways/TWOWAY.3SZX.0/TWOWAY.3SZX.0.pdb", "motifs/two_ways/TWOWAY.3SZX.1/TWOWAY.3SZX.1.pdb", "motifs/two_ways/TWOWAY.3SZX.2/TWOWAY.3SZX.2.pdb", "motifs/two_ways/TWOWAY.3TD0.0/TWOWAY.3TD0.0.pdb", "motifs/two_ways/TWOWAY.3TD0.1/TWOWAY.3TD0.1.pdb", "motifs/two_ways/TWOWAY.3TD0.2/TWOWAY.3TD0.2.pdb", "motifs/two_ways/TWOWAY.3TD0.3/TWOWAY.3TD0.3.pdb", "motifs/two_ways/TWOWAY.3TD1.0/TWOWAY.3TD1.0.pdb", "motifs/two_ways/TWOWAY.3TD1.3/TWOWAY.3TD1.3.pdb", "motifs/two_ways/TWOWAY.3TZR.0/TWOWAY.3TZR.0.pdb", "motifs/two_ways/TWOWAY.3TZR.1/TWOWAY.3TZR.1.pdb", "motifs/two_ways/TWOWAY.3TZR.2/TWOWAY.3TZR.2.pdb", "motifs/two_ways/TWOWAY.3UMY.0/TWOWAY.3UMY.0.pdb", "motifs/two_ways/TWOWAY.3UMY.1/TWOWAY.3UMY.1.pdb", "motifs/two_ways/TWOWAY.3WBM.0/TWOWAY.3WBM.0.pdb", "motifs/two_ways/TWOWAY.3WBM.1/TWOWAY.3WBM.1.pdb", "motifs/two_ways/TWOWAY.3WBM.2/TWOWAY.3WBM.2.pdb", "motifs/two_ways/TWOWAY.3WBM.3/TWOWAY.3WBM.3.pdb", "motifs/two_ways/TWOWAY.3ZP8.0/TWOWAY.3ZP8.0.pdb", "motifs/two_ways/TWOWAY.402D.0/TWOWAY.402D.0.pdb", "motifs/two_ways/TWOWAY.405D.0/TWOWAY.405D.0.pdb", "motifs/two_ways/TWOWAY.405D.1/TWOWAY.405D.1.pdb", "motifs/two_ways/TWOWAY.409D.0/TWOWAY.409D.0.pdb", "motifs/two_ways/TWOWAY.409D.1/TWOWAY.409D.1.pdb", "motifs/two_ways/TWOWAY.409D.2/TWOWAY.409D.2.pdb", "motifs/two_ways/TWOWAY.420D.0/TWOWAY.420D.0.pdb", "motifs/two_ways/TWOWAY.420D.1/TWOWAY.420D.1.pdb", "motifs/two_ways/TWOWAY.439D.0/TWOWAY.439D.0.pdb", "motifs/two_ways/TWOWAY.4BW0.0/TWOWAY.4BW0.0.pdb", "motifs/two_ways/TWOWAY.4E48.0/TWOWAY.4E48.0.pdb", "motifs/two_ways/TWOWAY.4E48.1/TWOWAY.4E48.1.pdb", "motifs/two_ways/TWOWAY.4E48.2/TWOWAY.4E48.2.pdb", "motifs/two_ways/TWOWAY.4E48.3/TWOWAY.4E48.3.pdb", "motifs/two_ways/TWOWAY.4E48.4/TWOWAY.4E48.4.pdb", "motifs/two_ways/TWOWAY.4E48.5/TWOWAY.4E48.5.pdb", "motifs/two_ways/TWOWAY.4E59.0/TWOWAY.4E59.0.pdb", "motifs/two_ways/TWOWAY.4E5C.0/TWOWAY.4E5C.0.pdb", "motifs/two_ways/TWOWAY.4FNJ.0/TWOWAY.4FNJ.0.pdb", "motifs/two_ways/TWOWAY.4FNJ.1/TWOWAY.4FNJ.1.pdb", "motifs/two_ways/TWOWAY.4K27.0/TWOWAY.4K27.0.pdb", "motifs/two_ways/TWOWAY.4K27.1/TWOWAY.4K27.1.pdb", "motifs/two_ways/TWOWAY.4K27.2/TWOWAY.4K27.2.pdb", "motifs/two_ways/TWOWAY.4K27.3/TWOWAY.4K27.3.pdb", "motifs/two_ways/TWOWAY.4K31.0/TWOWAY.4K31.0.pdb", "motifs/two_ways/TWOWAY.4K31.1/TWOWAY.4K31.1.pdb", "motifs/two_ways/TWOWAY.4K31.2/TWOWAY.4K31.2.pdb", "motifs/two_ways/TWOWAY.4K31.3/TWOWAY.4K31.3.pdb", "motifs/two_ways/TWOWAY.4KQ0.0/TWOWAY.4KQ0.0.pdb", "motifs/two_ways/TWOWAY.4KQ0.1/TWOWAY.4KQ0.1.pdb", "motifs/two_ways/TWOWAY.4KQ0.2/TWOWAY.4KQ0.2.pdb", "motifs/two_ways/TWOWAY.4KQ0.3/TWOWAY.4KQ0.3.pdb", "motifs/two_ways/TWOWAY.4KQ0.4/TWOWAY.4KQ0.4.pdb", "motifs/two_ways/TWOWAY.4KTG.0/TWOWAY.4KTG.0.pdb", "motifs/two_ways/TWOWAY.4KTG.1/TWOWAY.4KTG.1.pdb", "motifs/two_ways/TWOWAY.4KTG.2/TWOWAY.4KTG.2.pdb", "motifs/two_ways/TWOWAY.4KTG.3/TWOWAY.4KTG.3.pdb", "motifs/two_ways/TWOWAY.4KTG.4/TWOWAY.4KTG.4.pdb", "motifs/two_ways/TWOWAY.4KYY.0/TWOWAY.4KYY.0.pdb", "motifs/two_ways/TWOWAY.4KYY.1/TWOWAY.4KYY.1.pdb", "motifs/two_ways/TWOWAY.4KYY.2/TWOWAY.4KYY.2.pdb", "motifs/two_ways/TWOWAY.4L8H.0/TWOWAY.4L8H.0.pdb", "motifs/two_ways/TWOWAY.4LGT.2/TWOWAY.4LGT.2.pdb", "motifs/two_ways/TWOWAY.4LGT.3/TWOWAY.4LGT.3.pdb", "motifs/two_ways/TWOWAY.4LVZ.0/TWOWAY.4LVZ.0.pdb", "motifs/two_ways/TWOWAY.4M4O.0/TWOWAY.4M4O.0.pdb", "motifs/two_ways/TWOWAY.4M4O.1/TWOWAY.4M4O.1.pdb", "motifs/two_ways/TWOWAY.4N0T.0/TWOWAY.4N0T.0.pdb", "motifs/two_ways/TWOWAY.4N0T.2/TWOWAY.4N0T.2.pdb", "motifs/two_ways/TWOWAY.4N0T.3/TWOWAY.4N0T.3.pdb", "motifs/two_ways/TWOWAY.4OO8.0/TWOWAY.4OO8.0.pdb", "motifs/two_ways/TWOWAY.4OO8.1/TWOWAY.4OO8.1.pdb", "motifs/two_ways/TWOWAY.4OO8.2/TWOWAY.4OO8.2.pdb", "motifs/two_ways/TWOWAY.4OO8.3/TWOWAY.4OO8.3.pdb", "motifs/two_ways/TWOWAY.4OO8.4/TWOWAY.4OO8.4.pdb", "motifs/two_ways/TWOWAY.4P95.0/TWOWAY.4P95.0.pdb", "motifs/two_ways/TWOWAY.4P95.1/TWOWAY.4P95.1.pdb", "motifs/two_ways/TWOWAY.4P95.2/TWOWAY.4P95.2.pdb"];
motifurls.push("motifs/helix/helix.pdb");
var motifnames = [];
var motifcount = 0;
// hairpins/HAIRPIN.1A9N.0/HAIRPIN.1A9N.0.pdb
// helix/helix.pdb : helix/ref_frames.dat, helix/thumb.png

for(var i = 0; i < motifurls.length; i++) {
  var url = motifurls[i];
  var name = url.substring(url.lastIndexOf("/") + 1, url.lastIndexOf(".pdb"));
  // console.log(url);
  var imgurl = "/workbranch_vineet/frontend/jscripts/eterna3/" + url.substring(0, url.lastIndexOf("/")) + "/thumb.png";
  name = name.replace(/NWAY/g, 'N-Junction');
  name = name.replace(/helix/g, "Helix");
  name = name.replace(/HAIRPIN/g, "Hairpin");
  if(url.indexOf("tertiary_contacts") >= 0) name = name.replace(/TC\./g, "Tertiary Contact.");
  name = name.replace(/TWOWAY/g, "2-Junction");
  name = name.replace(/\./g, " ");
  motifnames[i] = name;

  var img = document.createElement("img");
  img.setAttribute("id", "motifurls_" + i);
  img.onload = function() {
    if(this.naturalWidth !== "undefined" && this.naturalWidth !== 0) {
      motifcount++;

      var num = parseInt(this.id.substring(this.id.indexOf("_") + 1));

      var container = document.createElement("div");
      container.className = "motifContainer";
      container.appendChild(this);
      motifContainers.push(container);

      var txt = document.createElement("span");
      txt.style.marginLeft = "5px";
      txt.innerHTML = motifnames[num];
      container.appendChild(txt);

      var overlay = document.createElement("div");
      overlay.className = "motifOverlay";

      var btn = document.createElement("span");
      btn.className = "motifButton";
      btn.innerHTML = "+";
      btn.setAttribute('id', num + "_Mbtn");
      
      btn.onclick = function() {
        tryloadMolecule(motifurls[parseInt(this.id.substring(0, this.id.indexOf("_")))]);
      }
          
      overlay.appendChild(btn);
      container.appendChild(overlay);    
      scrollContainer.appendChild(container);
      scrollbar.recalculateLayout();

      if(motifcount == (motifurls.length)) {
        resortMotifs();
        document.getElementById("loadingMotif").style.opacity = 0;
        setTimeout(function() {
          document.getElementById("loadingMotif").style.display = "none";
        }, 500);
      }

    }
  }
  img.src = imgurl;
  img.className = "motifThumb";
}

function tryloadMolecule(url) {
  if(doneLoading) {
    loadMolecule(url);
  } else {
    setTimeout(function() { tryloadMolecule(url); }, 200);
  }
}
