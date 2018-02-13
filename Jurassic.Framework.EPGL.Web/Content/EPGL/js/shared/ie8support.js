// Production steps of ECMA-262, Edition 5, 15.4.4.19
// Reference: http://es5.github.com/#x15.4.4.19
if (!Array.prototype.map)
{
    Array.prototype.map = function (callback, thisArg)
    {
        
        var T,
        A,
        k;
        
        if (this == null)
        {
            throw new TypeError(" this is null or not defined");
        }
        
        // 1. Let O be the result of calling ToObject passing the |this| value as the argument.
        var O = Object(this);
        
        // 2. Let lenValue be the result of calling the Get internal method of O with the argument "length".
        // 3. Let len be ToUint32(lenValue).
        var len = O.length >>> 0;
        
        // 4. If IsCallable(callback) is false, throw a TypeError exception.
        // See: http://es5.github.com/#x9.11
        if (typeof callback !== "function")
        {
            throw new TypeError(callback + " is not a function");
        }
        
        // 5. If thisArg was supplied, let T be thisArg; else let T be undefined.
        if (thisArg)
        {
            T = thisArg;
        }
        
        // 6. Let A be a new array created as if by the expression new Array(len) where Array is
        // the standard built-in constructor with that name and len is the value of len.
        A = new Array(len);
        
        // 7. Let k be 0
        k = 0;
        
        // 8. Repeat, while k < len
        while (k < len)
        {
            
            var kValue,
            mappedValue;
            
            // a. Let Pk be ToString(k).
            //   This is implicit for LHS operands of the in operator
            // b. Let kPresent be the result of calling the HasProperty internal method of O with argument Pk.
            //   This step can be combined with c
            // c. If kPresent is true, then
            if (k in O)
            {
                
                // i. Let kValue be the result of calling the Get internal method of O with argument Pk.
                kValue = O[k];
                
                // ii. Let mappedValue be the result of calling the Call internal method of callback
                // with T as the this value and argument list containing kValue, k, and O.
                mappedValue = callback.call(T, kValue, k, O);
                
                // iii. Call the DefineOwnProperty internal method of A with arguments
                // Pk, Property Descriptor {Value: mappedValue, : true, Enumerable: true, Configurable: true},
                // and false.
                
                // In browsers that support Object.defineProperty, use the following:
                // Object.defineProperty(A, Pk, { value: mappedValue, writable: true, enumerable: true, configurable: true });
                
                // For best browser support, use the following:
                A[k] = mappedValue;
            }
            // d. Increase k by 1.
            k++;
        }
        
        // 9. return A
        return A;
    };
}

// ============   isArray  ===============//
// isArray
function isArray(value)
{
    return Object.prototype.toString.call(value) == "[object Array]";
}
var arr = [1, 2, 3, 4, 5];
console.log(isArray(arr)); // IE8 及以下不支持

// ============   filter 等  ===============//
// 数组的一些方法  every(), filter(), forEach(), map(), some()
// IE8 及以下不支持
// 解决办法，以filter为例，自己写一个filter
if (!Array.prototype.filter)
{
    Array.prototype.filter = function (fun /*, thisp*/
    )
    {
        var len = this.length;
        if (typeof fun != "function")
        {
            throw new TypeError();
        }
        var res = new Array();
        var thisp = arguments[1];
        for (var i = 0; i < len; i++)
        {
            if (i in this)
            {
                var val = this[i]; // in case fun mutates this
                if (fun.call(thisp, val, i, this))
                {
                    res.push(val);
                }
            }
        }
        return res;
    };
}

//test
var numbers = [1, 2, 3, 4, 5, 6];
var filterResult = numbers.filter(function (item, inde, array)
    {
        return (item > 2);
    }
    );
console.log(filterResult); // 3,4,5,6


// ============   Date.now()  ===============//
// Date.now(); IE8及以下不支持，只能自己写一个解决
if (!Date.now)
{
    Date.now = function ()
    {
        return new Date().valueOf();
    }
}
console.log(Date.now());

// ============   trim()  ===============//
// 在IE8 及以下版本无效，需要自己写
String.prototype.trim = function ()
{
    return this.replace(/(^\s*)(\s*$)/g, "");
};

var stringValue2 = "   hello world  ";
console.log(stringValue2.trim());

//reduce方法在IE低版本（6/7/8）中是不支持的，可以使用如下Polyfill来兼容，或者使用Underscore and Lo-Dash库.
//http://www.zuojj.com/archives/917.html
if (!Array.prototype.reduce)
{
    Array.prototype.reduce = Array.prototype.reduce || function (callback, opt_initialValue)
    {
        'use strict';
        if (null === this || 'undefined' === typeof this)
        {
            // At the moment all modern browsers, that support strict mode, have
            // native implementation of Array.prototype.reduce. For instance, IE8
            // does not support strict mode, so this check is actually useless.
            throw new TypeError(
                'Array.prototype.reduce called on null or undefined');
        }
        if ('function' !== typeof callback)
        {
            throw new TypeError(callback + ' is not a function');
        }
        var index,
        value,
        length = this.length >>> 0,
        isValueSet = false;
        if (1 < arguments.length)
        {
            value = opt_initialValue;
            isValueSet = true;
        }
        for (index = 0; length > index; ++index)
        {
            if (this.hasOwnProperty(index))
            {
                if (isValueSet)
                {
                    value = callback(value, this[index], index, this);
                }
                else
                {
                    value = this[index];
                    isValueSet = true;
                }
            }
        }
        if (!isValueSet)
        {
            throw new TypeError('Reduce of empty array with no initial value');
        }
        return value;
    };
}

//Object.keys 方法在IE低版本（6/7/8）中是不支持
//https://www.cnblogs.com/tinyTea/p/6069374.html
if (!Object.keys)
{
    var DONT_ENUM = "propertyIsEnumerable,isPrototypeOf,hasOwnProperty,toLocaleString,toString,valueOf,constructor".split(","),
    hasOwn = ({}
    
    ).hasOwnProperty;
    for (var i in
    {
        toString : 1
    }
    )
    {
        DONT_ENUM = false;
    }
    
    Object.keys = Object.keys || function (obj)
    { //ecma262v5 15.2.3.14
        var result = [];
        for (var key in obj)
            if (hasOwn.call(obj, key))
            {
                result.push(key);
            }
        if (DONT_ENUM && obj)
        {
            for (var i = 0; key = DONT_ENUM[i++]; )
            {
                if (hasOwn.call(obj, key))
                {
                    result.push(key);
                }
            }
        }
        return result;
    };
}

//官网查询的兼容代码段
// Production steps of ECMA-262, Edition 5, 15.4.4.18
// Reference: http://es5.github.io/#x15.4.4.18
if (!Array.prototype.forEach)
{
    
    Array.prototype.forEach = function (callback /*, thisArg*/
    )
    {
        
        var T,
        k;
        
        if (this == null)
        {
            throw new TypeError('this is null or not defined');
        }
        
        // 1. Let O be the result of calling toObject() passing the
        // |this| value as the argument.
        var O = Object(this);
        
        // 2. Let lenValue be the result of calling the Get() internal
        // method of O with the argument "length".
        // 3. Let len be toUint32(lenValue).
        var len = O.length >>> 0;
        
        // 4. If isCallable(callback) is false, throw a TypeError exception.
        // See: http://es5.github.com/#x9.11
        if (typeof callback !== 'function')
        {
            throw new TypeError(callback + ' is not a function');
        }
        
        // 5. If thisArg was supplied, let T be thisArg; else let
        // T be undefined.
        if (arguments.length > 1)
        {
            T = arguments[1];
        }
        
        // 6. Let k be 0.
        k = 0;
        
        // 7. Repeat while k < len.
        while (k < len)
        {
            
            var kValue;
            
            // a. Let Pk be ToString(k).
            //    This is implicit for LHS operands of the in operator.
            // b. Let kPresent be the result of calling the HasProperty
            //    internal method of O with argument Pk.
            //    This step can be combined with c.
            // c. If kPresent is true, then
            if (k in O)
            {
                
                // i. Let kValue be the result of calling the Get internal
                // method of O with argument Pk.
                kValue = O[k];
                
                // ii. Call the Call internal method of callback with T as
                // the this value and argument list containing kValue, k, and O.
                callback.call(T, kValue, k, O);
            }
            // d. Increase k by 1.
            k++;
        }
        // 8. return undefined.
    };
}