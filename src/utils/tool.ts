import { ElMessageBox, MessageBoxState } from 'element-plus'
import type { Action } from 'element-plus'
/**
 * 获取接口值
 * getInterfaceValue(result.error, "password")
 * @param obj 
 * @param key 
 * @returns 
 */
export function getInterfaceValue<T extends object, K extends keyof T>(obj: T, key: K){
    return obj[key];
}

/**
 * 解决元素隐式具有 “any” 类型，因为类型为 “string” 的表达式不能用于索引类型
 *  Object.keys(error).map(key => {
         if(isValidKey(key,error)){
            delete error[key];
         }
    })
 * @param key Map的键
 * @param object Map对象
 * @returns 
 */
export function isValidKey(key: string | number | symbol , object: object): key is keyof typeof object {
    return key in object;
}


 /**
 * 处理错误信息
 * @param errorInfo 错误信息
 * @param error reactive()对象
 * @param callback 关闭弹出框时执行回调
 */
export function processErrorInfo(errorInfo:Map<string,string> , error: any,callback: () => void): void {
   
    let htmlMessage:string = "";
    let count = 1;
    for (const [key, value] of Object.entries(errorInfo) as [string, string][]){

        if(key.indexOf("_") != -1){//例如userCustom_
           // error.userCustom.set(key ,value);
            error[key.split('_')[0]].set(key ,value);
            continue;
        }

        if(!Object.prototype.hasOwnProperty.call(error, key)){//如果属性不存在
            htmlMessage+= count+"、"+value+"<br/>";
            count ++;
        }else{
            Object.assign(error, {[key] : value});//将变量作为一个对象的key
        }
    }
    if(htmlMessage != ''){
        ElMessageBox.alert(htmlMessage, '错误', {
            type:'error',
            draggable: true,
            dangerouslyUseHTMLString: true,
            showConfirmButton: false,
            beforeClose: (action: Action,instance:MessageBoxState, done) => {
                done();//关闭弹出框
                callback();//执行回调
            },
        }).catch((error) => {
            console.log(error);
        });
    }
}


/**
 * 获取URL中的URI
 * @param url 例如 login?jumpPath=aW5kZXg 返回login
 * @returns 
 */
 export function getUri(url:string): string{
    if(url.indexOf("?") != -1){//如果存在问号
        return url.substring(0,url.indexOf("?"));
    }else{
        return url;
    }
}
/**
 * 获取URL参数
 * @param url 例如 login?jumpPath=aW5kZXg 返回aW5kZXg
 * @param name 参数名称
 * @returns
 */
 export function getUrlParam(url:string,name:string) : string | null{
	let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象

    if(url.indexOf("?") != -1){//如果存在问号
        let afterUrl = url.substring(url.indexOf("?")+1,url.length);

        let r = afterUrl.match(reg); //匹配目标参数
	    if (r != null) return r[2];
    }
	return null; //返回参数值
}
/**
 * 获取所有URL参数
 * @param url 例如 login?jumpPath=aW5kZXg&aa=2 返回[{jumpPath:aW5kZXg},{aa:2}]
 * @returns
 */
 export function getAllUrlParam(url:string) :Array<Object>{
    let arr = new Array<Object>();
    if(url.indexOf("?") != -1){//如果存在问号
        let afterUrl = url.substring(url.indexOf("?")+1,url.length);
        if(afterUrl!=""){
            let urlParamArr = afterUrl.split("&");
            for(let i=0;i<urlParamArr.length;i++){
                let paramArr:string[] = urlParamArr[i].split("=");
               arr.push({[paramArr[0]]:paramArr[1]});
            }
        }
    }
	return arr;
}


/**
 * 判断对象类型 getType(new Map()) // "map"
 * obj instanceof Map
 * @param obj 
 * @returns 
 */
 export function getType(obj:any) :string{
    let text = Object.prototype.toString.call(obj).match(/^\[object (.*)\]$/)
    if(text != null){
        let type = text[1].toLowerCase();
        if(type === 'string' && typeof obj === 'object') return 'object'; // Let "new String('')" return 'object'
        if (obj === null) return 'null'; // PhantomJS has type "DOMWindow" for null
        if (obj === undefined) return 'undefined'; // PhantomJS has type "DOMWindow" for undefined
        return type;
    }


    
    return '';
 }

/**
 * 生成随机数
 * @returns 
 */
export function generateRandom() :string{
    return Math.random().toString().slice(2);//随机数
}




/**
 * 精确计算
 */
 function getDigits(num:string) {
	var digits = 0,
		parts = num.toString().split(".");
	if (parts.length === 2) {
		digits = parts[1].length;
	}
	return digits;
}

function toFixed(num:number, digits:number) {
	if (typeof digits == 'undefined') {
		return num;
	}
	return Number(num).toFixed(digits);
}
/**
 * 加法函数
 * arg1：加数；arg2加数；digits要保留的小数位数（可以为空，为空则不处理小数位数）
 */
export function calc_add(arg1:string, arg2:string, digits:number) {
	arg1 = arg1.toString(), arg2 = arg2.toString();
	let maxLen = Math.max(getDigits(arg1), getDigits(arg2)),
		m = Math.pow(10, maxLen),
		result = Number(((parseFloat(arg1) * m + parseFloat(arg2) * m) / m).toFixed(maxLen));
	return toFixed(result, digits);
}
;
/**
 * 减法函数
 * arg1：减数；arg2：被减数；digits要保留的小数位数（可以为空，为空则不处理小数位数）
 */
 export function calc_sub(arg1:string, arg2:string, digits:number) {
	return calc_add(arg1, (Math.abs(parseFloat(arg2)) * -1).toString(), digits);

}
;
/**
 * 乘法函数
 * arg1：乘数；arg2乘数；digits要保留的小数位数（可以为空，为空则不处理小数位数）
 */
 export function calc_multiply(arg1:string, arg2:string, digits:number) {
	// 数字化
	let num1 = parseFloat(arg1).toString(),
		num2 = parseFloat(arg2).toString(),
		m = getDigits(num1) + getDigits(num2),
		result = parseFloat(num1.replace(".", "")) * parseFloat(num2.replace(".", "")) / Math.pow(10, m);
        
	return toFixed(result, digits);
}
;
/**
 * 除法函数
 * arg1：除数；arg2被除数；digits要保留的小数位数（可以为空，为空则不处理小数位数）
 */
 export function calc_div(arg1:string, arg2:string, digits:number) {
	// 数字化
	let num1 = parseFloat(arg1).toString(),
		num2 = parseFloat(arg2).toString(),
		t1 = getDigits(num1),
		t2 = getDigits(num2),
		result = parseFloat(num1.replace(".", "")) / parseFloat(num2.replace(".", "")) * Math.pow(10, t2 - t1)
	return toFixed(result, digits);
}


/**
 * 获取代码语言
 * @param languageCode
 */
 export function getLanguageClassName(languageCode:string) {
	let language_arr = new Array();
	language_arr.push("lang-xml_language-xml");
	language_arr.push("lang-css_language-css");
	language_arr.push("lang-html_language-html");
	language_arr.push("lang-js_language-javascript");
	language_arr.push("lang-java_language-java");
	language_arr.push("lang-pl_language-perl");
	language_arr.push("lang-py_language-python");
	language_arr.push("lang-rb_language-ruby");
	language_arr.push("lang-go_language-go");
	language_arr.push("lang-cpp_language-cpp");
	language_arr.push("lang-cs_language-cs");
	language_arr.push("lang-bsh_language-bash");
		
	for(let k=0; k<language_arr.length; k++){
		let language = language_arr[k];
		let class_arr = new Array();
		class_arr = language.split('_');
		if(languageCode == class_arr[0]){
			
			return class_arr[1];
		}
	}
	return "language-markup";
}


