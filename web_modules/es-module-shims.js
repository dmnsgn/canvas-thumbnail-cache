import { o as objectCreate, b as stringMultibyte, c as objectGetPrototypeOf, d as anInstance, r as redefineAll, e as setToStringTag, g as arraySliceSimple, h as aConstructor, j as getIteratorMethod, k as isArrayIteratorMethod, l as getIterator, f as functionBindContext, m as isConstructor, n as arraySort, s as speciesConstructor, a as asyncIteratorIteration, i as iterate } from './common/async-iterator-iteration-4ea6b040.js';
import { a as anObject, c as global_1, j as fails, S as shared, d as functionUncurryThis, f as functionCall, J as toString_1, G as internalState, _ as _export, w as wellKnownSymbol, B as redefine, E as createNonEnumerableProperty, z as toObject, k as isCallable, T as classofRaw, K as requireObjectCoercible, h as getMethod, U as toLength, L as toIntegerOrInfinity, I as functionApply, V as uid, D as objectSetPrototypeOf, i as classof, r as descriptors, A as hasOwnProperty_1, R as isObject, u as objectDefineProperty, o as objectIsPrototypeOf, t as tryToString, l as lengthOfArrayLike, Q as toAbsoluteIndex, W as objectGetOwnPropertyNames, F as functionName, M as indexedObject, g as getBuiltIn, X as createCommonjsModule, Y as inheritIfRequired, P as toPropertyKey, Z as isSymbol, C as createPropertyDescriptor, $ as objectGetOwnPropertyDescriptor, a0 as engineUserAgent, b as aCallable, a1 as engineV8Version, a2 as commonjsGlobal } from './common/es.error.cause-cb773bc2.js';

// `RegExp.prototype.flags` getter implementation
// https://tc39.es/ecma262/#sec-get-regexp.prototype.flags
var regexpFlags = function () {
  var that = anObject(this);
  var result = '';
  if (that.global) result += 'g';
  if (that.ignoreCase) result += 'i';
  if (that.multiline) result += 'm';
  if (that.dotAll) result += 's';
  if (that.unicode) result += 'u';
  if (that.sticky) result += 'y';
  return result;
};

// babel-minify and Closure Compiler transpiles RegExp('a', 'y') -> /a/y and it causes SyntaxError
var $RegExp = global_1.RegExp;

var UNSUPPORTED_Y = fails(function () {
  var re = $RegExp('a', 'y');
  re.lastIndex = 2;
  return re.exec('abcd') != null;
});

// UC Browser bug
// https://github.com/zloirock/core-js/issues/1008
var MISSED_STICKY = UNSUPPORTED_Y || fails(function () {
  return !$RegExp('a', 'y').sticky;
});

var BROKEN_CARET = UNSUPPORTED_Y || fails(function () {
  // https://bugzilla.mozilla.org/show_bug.cgi?id=773687
  var re = $RegExp('^r', 'gy');
  re.lastIndex = 2;
  return re.exec('str') != null;
});

var regexpStickyHelpers = {
  BROKEN_CARET: BROKEN_CARET,
  MISSED_STICKY: MISSED_STICKY,
  UNSUPPORTED_Y: UNSUPPORTED_Y
};

// babel-minify and Closure Compiler transpiles RegExp('.', 's') -> /./s and it causes SyntaxError
var $RegExp$1 = global_1.RegExp;

var regexpUnsupportedDotAll = fails(function () {
  var re = $RegExp$1('.', 's');
  return !(re.dotAll && re.exec('\n') && re.flags === 's');
});

// babel-minify and Closure Compiler transpiles RegExp('(?<a>b)', 'g') -> /(?<a>b)/g and it causes SyntaxError
var $RegExp$2 = global_1.RegExp;

var regexpUnsupportedNcg = fails(function () {
  var re = $RegExp$2('(?<a>b)', 'g');
  return re.exec('b').groups.a !== 'b' ||
    'b'.replace(re, '$<a>c') !== 'bc';
});

/* eslint-disable regexp/no-empty-capturing-group, regexp/no-empty-group, regexp/no-lazy-ends -- testing */
/* eslint-disable regexp/no-useless-quantifier -- testing */







var getInternalState = internalState.get;



var nativeReplace = shared('native-string-replace', String.prototype.replace);
var nativeExec = RegExp.prototype.exec;
var patchedExec = nativeExec;
var charAt = functionUncurryThis(''.charAt);
var indexOf = functionUncurryThis(''.indexOf);
var replace = functionUncurryThis(''.replace);
var stringSlice = functionUncurryThis(''.slice);

var UPDATES_LAST_INDEX_WRONG = (function () {
  var re1 = /a/;
  var re2 = /b*/g;
  functionCall(nativeExec, re1, 'a');
  functionCall(nativeExec, re2, 'a');
  return re1.lastIndex !== 0 || re2.lastIndex !== 0;
})();

var UNSUPPORTED_Y$1 = regexpStickyHelpers.BROKEN_CARET;

// nonparticipating capturing group, copied from es5-shim's String#split patch.
var NPCG_INCLUDED = /()??/.exec('')[1] !== undefined;

var PATCH = UPDATES_LAST_INDEX_WRONG || NPCG_INCLUDED || UNSUPPORTED_Y$1 || regexpUnsupportedDotAll || regexpUnsupportedNcg;

if (PATCH) {
  patchedExec = function exec(string) {
    var re = this;
    var state = getInternalState(re);
    var str = toString_1(string);
    var raw = state.raw;
    var result, reCopy, lastIndex, match, i, object, group;

    if (raw) {
      raw.lastIndex = re.lastIndex;
      result = functionCall(patchedExec, raw, str);
      re.lastIndex = raw.lastIndex;
      return result;
    }

    var groups = state.groups;
    var sticky = UNSUPPORTED_Y$1 && re.sticky;
    var flags = functionCall(regexpFlags, re);
    var source = re.source;
    var charsAdded = 0;
    var strCopy = str;

    if (sticky) {
      flags = replace(flags, 'y', '');
      if (indexOf(flags, 'g') === -1) {
        flags += 'g';
      }

      strCopy = stringSlice(str, re.lastIndex);
      // Support anchored sticky behavior.
      if (re.lastIndex > 0 && (!re.multiline || re.multiline && charAt(str, re.lastIndex - 1) !== '\n')) {
        source = '(?: ' + source + ')';
        strCopy = ' ' + strCopy;
        charsAdded++;
      }
      // ^(? + rx + ) is needed, in combination with some str slicing, to
      // simulate the 'y' flag.
      reCopy = new RegExp('^(?:' + source + ')', flags);
    }

    if (NPCG_INCLUDED) {
      reCopy = new RegExp('^' + source + '$(?!\\s)', flags);
    }
    if (UPDATES_LAST_INDEX_WRONG) lastIndex = re.lastIndex;

    match = functionCall(nativeExec, sticky ? reCopy : re, strCopy);

    if (sticky) {
      if (match) {
        match.input = stringSlice(match.input, charsAdded);
        match[0] = stringSlice(match[0], charsAdded);
        match.index = re.lastIndex;
        re.lastIndex += match[0].length;
      } else re.lastIndex = 0;
    } else if (UPDATES_LAST_INDEX_WRONG && match) {
      re.lastIndex = re.global ? match.index + match[0].length : lastIndex;
    }
    if (NPCG_INCLUDED && match && match.length > 1) {
      // Fix browsers whose `exec` methods don't consistently return `undefined`
      // for NPCG, like IE8. NOTE: This doesn' work for /(.?)?/
      functionCall(nativeReplace, match[0], reCopy, function () {
        for (i = 1; i < arguments.length - 2; i++) {
          if (arguments[i] === undefined) match[i] = undefined;
        }
      });
    }

    if (match && groups) {
      match.groups = object = objectCreate(null);
      for (i = 0; i < groups.length; i++) {
        group = groups[i];
        object[group[0]] = match[group[1]];
      }
    }

    return match;
  };
}

var regexpExec = patchedExec;

// `RegExp.prototype.exec` method
// https://tc39.es/ecma262/#sec-regexp.prototype.exec
_export({ target: 'RegExp', proto: true, forced: /./.exec !== regexpExec }, {
  exec: regexpExec
});

// TODO: Remove from `core-js@4` since it's moved to entry points








var SPECIES = wellKnownSymbol('species');
var RegExpPrototype = RegExp.prototype;

var fixRegexpWellKnownSymbolLogic = function (KEY, exec, FORCED, SHAM) {
  var SYMBOL = wellKnownSymbol(KEY);

  var DELEGATES_TO_SYMBOL = !fails(function () {
    // String methods call symbol-named RegEp methods
    var O = {};
    O[SYMBOL] = function () { return 7; };
    return ''[KEY](O) != 7;
  });

  var DELEGATES_TO_EXEC = DELEGATES_TO_SYMBOL && !fails(function () {
    // Symbol-named RegExp methods call .exec
    var execCalled = false;
    var re = /a/;

    if (KEY === 'split') {
      // We can't use real regex here since it causes deoptimization
      // and serious performance degradation in V8
      // https://github.com/zloirock/core-js/issues/306
      re = {};
      // RegExp[@@split] doesn't call the regex's exec method, but first creates
      // a new one. We need to return the patched regex when creating the new one.
      re.constructor = {};
      re.constructor[SPECIES] = function () { return re; };
      re.flags = '';
      re[SYMBOL] = /./[SYMBOL];
    }

    re.exec = function () { execCalled = true; return null; };

    re[SYMBOL]('');
    return !execCalled;
  });

  if (
    !DELEGATES_TO_SYMBOL ||
    !DELEGATES_TO_EXEC ||
    FORCED
  ) {
    var uncurriedNativeRegExpMethod = functionUncurryThis(/./[SYMBOL]);
    var methods = exec(SYMBOL, ''[KEY], function (nativeMethod, regexp, str, arg2, forceStringMethod) {
      var uncurriedNativeMethod = functionUncurryThis(nativeMethod);
      var $exec = regexp.exec;
      if ($exec === regexpExec || $exec === RegExpPrototype.exec) {
        if (DELEGATES_TO_SYMBOL && !forceStringMethod) {
          // The native String method already delegates to @@method (this
          // polyfilled function), leasing to infinite recursion.
          // We avoid it by directly calling the native @@method method.
          return { done: true, value: uncurriedNativeRegExpMethod(regexp, str, arg2) };
        }
        return { done: true, value: uncurriedNativeMethod(str, regexp, arg2) };
      }
      return { done: false };
    });

    redefine(String.prototype, KEY, methods[0]);
    redefine(RegExpPrototype, SYMBOL, methods[1]);
  }

  if (SHAM) createNonEnumerableProperty(RegExpPrototype[SYMBOL], 'sham', true);
};

var charAt$1 = stringMultibyte.charAt;

// `AdvanceStringIndex` abstract operation
// https://tc39.es/ecma262/#sec-advancestringindex
var advanceStringIndex = function (S, index, unicode) {
  return index + (unicode ? charAt$1(S, index).length : 1);
};

var floor = Math.floor;
var charAt$2 = functionUncurryThis(''.charAt);
var replace$1 = functionUncurryThis(''.replace);
var stringSlice$1 = functionUncurryThis(''.slice);
var SUBSTITUTION_SYMBOLS = /\$([$&'`]|\d{1,2}|<[^>]*>)/g;
var SUBSTITUTION_SYMBOLS_NO_NAMED = /\$([$&'`]|\d{1,2})/g;

// `GetSubstitution` abstract operation
// https://tc39.es/ecma262/#sec-getsubstitution
var getSubstitution = function (matched, str, position, captures, namedCaptures, replacement) {
  var tailPos = position + matched.length;
  var m = captures.length;
  var symbols = SUBSTITUTION_SYMBOLS_NO_NAMED;
  if (namedCaptures !== undefined) {
    namedCaptures = toObject(namedCaptures);
    symbols = SUBSTITUTION_SYMBOLS;
  }
  return replace$1(replacement, symbols, function (match, ch) {
    var capture;
    switch (charAt$2(ch, 0)) {
      case '$': return '$';
      case '&': return matched;
      case '`': return stringSlice$1(str, 0, position);
      case "'": return stringSlice$1(str, tailPos);
      case '<':
        capture = namedCaptures[stringSlice$1(ch, 1, -1)];
        break;
      default: // \d\d?
        var n = +ch;
        if (n === 0) return match;
        if (n > m) {
          var f = floor(n / 10);
          if (f === 0) return match;
          if (f <= m) return captures[f - 1] === undefined ? charAt$2(ch, 1) : captures[f - 1] + charAt$2(ch, 1);
          return match;
        }
        capture = captures[n - 1];
    }
    return capture === undefined ? '' : capture;
  });
};

var TypeError = global_1.TypeError;

// `RegExpExec` abstract operation
// https://tc39.es/ecma262/#sec-regexpexec
var regexpExecAbstract = function (R, S) {
  var exec = R.exec;
  if (isCallable(exec)) {
    var result = functionCall(exec, R, S);
    if (result !== null) anObject(result);
    return result;
  }
  if (classofRaw(R) === 'RegExp') return functionCall(regexpExec, R, S);
  throw TypeError('RegExp#exec called on incompatible receiver');
};

var REPLACE = wellKnownSymbol('replace');
var max = Math.max;
var min = Math.min;
var concat = functionUncurryThis([].concat);
var push = functionUncurryThis([].push);
var stringIndexOf = functionUncurryThis(''.indexOf);
var stringSlice$2 = functionUncurryThis(''.slice);

var maybeToString = function (it) {
  return it === undefined ? it : String(it);
};

// IE <= 11 replaces $0 with the whole match, as if it was $&
// https://stackoverflow.com/questions/6024666/getting-ie-to-replace-a-regex-with-the-literal-string-0
var REPLACE_KEEPS_$0 = (function () {
  // eslint-disable-next-line regexp/prefer-escape-replacement-dollar-char -- required for testing
  return 'a'.replace(/./, '$0') === '$0';
})();

// Safari <= 13.0.3(?) substitutes nth capture where n>m with an empty string
var REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE = (function () {
  if (/./[REPLACE]) {
    return /./[REPLACE]('a', '$0') === '';
  }
  return false;
})();

var REPLACE_SUPPORTS_NAMED_GROUPS = !fails(function () {
  var re = /./;
  re.exec = function () {
    var result = [];
    result.groups = { a: '7' };
    return result;
  };
  // eslint-disable-next-line regexp/no-useless-dollar-replacements -- false positive
  return ''.replace(re, '$<a>') !== '7';
});

// @@replace logic
fixRegexpWellKnownSymbolLogic('replace', function (_, nativeReplace, maybeCallNative) {
  var UNSAFE_SUBSTITUTE = REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE ? '$' : '$0';

  return [
    // `String.prototype.replace` method
    // https://tc39.es/ecma262/#sec-string.prototype.replace
    function replace(searchValue, replaceValue) {
      var O = requireObjectCoercible(this);
      var replacer = searchValue == undefined ? undefined : getMethod(searchValue, REPLACE);
      return replacer
        ? functionCall(replacer, searchValue, O, replaceValue)
        : functionCall(nativeReplace, toString_1(O), searchValue, replaceValue);
    },
    // `RegExp.prototype[@@replace]` method
    // https://tc39.es/ecma262/#sec-regexp.prototype-@@replace
    function (string, replaceValue) {
      var rx = anObject(this);
      var S = toString_1(string);

      if (
        typeof replaceValue == 'string' &&
        stringIndexOf(replaceValue, UNSAFE_SUBSTITUTE) === -1 &&
        stringIndexOf(replaceValue, '$<') === -1
      ) {
        var res = maybeCallNative(nativeReplace, rx, S, replaceValue);
        if (res.done) return res.value;
      }

      var functionalReplace = isCallable(replaceValue);
      if (!functionalReplace) replaceValue = toString_1(replaceValue);

      var global = rx.global;
      if (global) {
        var fullUnicode = rx.unicode;
        rx.lastIndex = 0;
      }
      var results = [];
      while (true) {
        var result = regexpExecAbstract(rx, S);
        if (result === null) break;

        push(results, result);
        if (!global) break;

        var matchStr = toString_1(result[0]);
        if (matchStr === '') rx.lastIndex = advanceStringIndex(S, toLength(rx.lastIndex), fullUnicode);
      }

      var accumulatedResult = '';
      var nextSourcePosition = 0;
      for (var i = 0; i < results.length; i++) {
        result = results[i];

        var matched = toString_1(result[0]);
        var position = max(min(toIntegerOrInfinity(result.index), S.length), 0);
        var captures = [];
        // NOTE: This is equivalent to
        //   captures = result.slice(1).map(maybeToString)
        // but for some reason `nativeSlice.call(result, 1, result.length)` (called in
        // the slice polyfill when slicing native arrays) "doesn't work" in safari 9 and
        // causes a crash (https://pastebin.com/N21QzeQA) when trying to debug it.
        for (var j = 1; j < result.length; j++) push(captures, maybeToString(result[j]));
        var namedCaptures = result.groups;
        if (functionalReplace) {
          var replacerArgs = concat([matched], captures, position, S);
          if (namedCaptures !== undefined) push(replacerArgs, namedCaptures);
          var replacement = toString_1(functionApply(replaceValue, undefined, replacerArgs));
        } else {
          replacement = getSubstitution(matched, S, position, captures, namedCaptures, replaceValue);
        }
        if (position >= nextSourcePosition) {
          accumulatedResult += stringSlice$2(S, nextSourcePosition, position) + replacement;
          nextSourcePosition = position + matched.length;
        }
      }
      return accumulatedResult + stringSlice$2(S, nextSourcePosition);
    }
  ];
}, !REPLACE_SUPPORTS_NAMED_GROUPS || !REPLACE_KEEPS_$0 || REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE);

var ITERATOR = wellKnownSymbol('iterator');
var SAFE_CLOSING = false;

try {
  var called = 0;
  var iteratorWithReturn = {
    next: function () {
      return { done: !!called++ };
    },
    'return': function () {
      SAFE_CLOSING = true;
    }
  };
  iteratorWithReturn[ITERATOR] = function () {
    return this;
  };
  // eslint-disable-next-line es/no-array-from, no-throw-literal -- required for testing
  Array.from(iteratorWithReturn, function () { throw 2; });
} catch (error) { /* empty */ }

var checkCorrectnessOfIteration = function (exec, SKIP_CLOSING) {
  if (!SKIP_CLOSING && !SAFE_CLOSING) return false;
  var ITERATION_SUPPORT = false;
  try {
    var object = {};
    object[ITERATOR] = function () {
      return {
        next: function () {
          return { done: ITERATION_SUPPORT = true };
        }
      };
    };
    exec(object);
  } catch (error) { /* empty */ }
  return ITERATION_SUPPORT;
};

// eslint-disable-next-line es/no-typed-arrays -- safe
var arrayBufferNative = typeof ArrayBuffer != 'undefined' && typeof DataView != 'undefined';

var defineProperty = objectDefineProperty.f;






var Int8Array = global_1.Int8Array;
var Int8ArrayPrototype = Int8Array && Int8Array.prototype;
var Uint8ClampedArray$1 = global_1.Uint8ClampedArray;
var Uint8ClampedArrayPrototype = Uint8ClampedArray$1 && Uint8ClampedArray$1.prototype;
var TypedArray = Int8Array && objectGetPrototypeOf(Int8Array);
var TypedArrayPrototype = Int8ArrayPrototype && objectGetPrototypeOf(Int8ArrayPrototype);
var ObjectPrototype = Object.prototype;
var TypeError$1 = global_1.TypeError;

var TO_STRING_TAG = wellKnownSymbol('toStringTag');
var TYPED_ARRAY_TAG = uid('TYPED_ARRAY_TAG');
var TYPED_ARRAY_CONSTRUCTOR = uid('TYPED_ARRAY_CONSTRUCTOR');
// Fixing native typed arrays in Opera Presto crashes the browser, see #595
var NATIVE_ARRAY_BUFFER_VIEWS = arrayBufferNative && !!objectSetPrototypeOf && classof(global_1.opera) !== 'Opera';
var TYPED_ARRAY_TAG_REQUIRED = false;
var NAME, Constructor, Prototype;

var TypedArrayConstructorsList = {
  Int8Array: 1,
  Uint8Array: 1,
  Uint8ClampedArray: 1,
  Int16Array: 2,
  Uint16Array: 2,
  Int32Array: 4,
  Uint32Array: 4,
  Float32Array: 4,
  Float64Array: 8
};

var BigIntArrayConstructorsList = {
  BigInt64Array: 8,
  BigUint64Array: 8
};

var isView = function isView(it) {
  if (!isObject(it)) return false;
  var klass = classof(it);
  return klass === 'DataView'
    || hasOwnProperty_1(TypedArrayConstructorsList, klass)
    || hasOwnProperty_1(BigIntArrayConstructorsList, klass);
};

var isTypedArray = function (it) {
  if (!isObject(it)) return false;
  var klass = classof(it);
  return hasOwnProperty_1(TypedArrayConstructorsList, klass)
    || hasOwnProperty_1(BigIntArrayConstructorsList, klass);
};

var aTypedArray = function (it) {
  if (isTypedArray(it)) return it;
  throw TypeError$1('Target is not a typed array');
};

var aTypedArrayConstructor = function (C) {
  if (isCallable(C) && (!objectSetPrototypeOf || objectIsPrototypeOf(TypedArray, C))) return C;
  throw TypeError$1(tryToString(C) + ' is not a typed array constructor');
};

var exportTypedArrayMethod = function (KEY, property, forced, options) {
  if (!descriptors) return;
  if (forced) for (var ARRAY in TypedArrayConstructorsList) {
    var TypedArrayConstructor = global_1[ARRAY];
    if (TypedArrayConstructor && hasOwnProperty_1(TypedArrayConstructor.prototype, KEY)) try {
      delete TypedArrayConstructor.prototype[KEY];
    } catch (error) {
      // old WebKit bug - some methods are non-configurable
      try {
        TypedArrayConstructor.prototype[KEY] = property;
      } catch (error2) { /* empty */ }
    }
  }
  if (!TypedArrayPrototype[KEY] || forced) {
    redefine(TypedArrayPrototype, KEY, forced ? property
      : NATIVE_ARRAY_BUFFER_VIEWS && Int8ArrayPrototype[KEY] || property, options);
  }
};

var exportTypedArrayStaticMethod = function (KEY, property, forced) {
  var ARRAY, TypedArrayConstructor;
  if (!descriptors) return;
  if (objectSetPrototypeOf) {
    if (forced) for (ARRAY in TypedArrayConstructorsList) {
      TypedArrayConstructor = global_1[ARRAY];
      if (TypedArrayConstructor && hasOwnProperty_1(TypedArrayConstructor, KEY)) try {
        delete TypedArrayConstructor[KEY];
      } catch (error) { /* empty */ }
    }
    if (!TypedArray[KEY] || forced) {
      // V8 ~ Chrome 49-50 `%TypedArray%` methods are non-writable non-configurable
      try {
        return redefine(TypedArray, KEY, forced ? property : NATIVE_ARRAY_BUFFER_VIEWS && TypedArray[KEY] || property);
      } catch (error) { /* empty */ }
    } else return;
  }
  for (ARRAY in TypedArrayConstructorsList) {
    TypedArrayConstructor = global_1[ARRAY];
    if (TypedArrayConstructor && (!TypedArrayConstructor[KEY] || forced)) {
      redefine(TypedArrayConstructor, KEY, property);
    }
  }
};

for (NAME in TypedArrayConstructorsList) {
  Constructor = global_1[NAME];
  Prototype = Constructor && Constructor.prototype;
  if (Prototype) createNonEnumerableProperty(Prototype, TYPED_ARRAY_CONSTRUCTOR, Constructor);
  else NATIVE_ARRAY_BUFFER_VIEWS = false;
}

for (NAME in BigIntArrayConstructorsList) {
  Constructor = global_1[NAME];
  Prototype = Constructor && Constructor.prototype;
  if (Prototype) createNonEnumerableProperty(Prototype, TYPED_ARRAY_CONSTRUCTOR, Constructor);
}

// WebKit bug - typed arrays constructors prototype is Object.prototype
if (!NATIVE_ARRAY_BUFFER_VIEWS || !isCallable(TypedArray) || TypedArray === Function.prototype) {
  // eslint-disable-next-line no-shadow -- safe
  TypedArray = function TypedArray() {
    throw TypeError$1('Incorrect invocation');
  };
  if (NATIVE_ARRAY_BUFFER_VIEWS) for (NAME in TypedArrayConstructorsList) {
    if (global_1[NAME]) objectSetPrototypeOf(global_1[NAME], TypedArray);
  }
}

if (!NATIVE_ARRAY_BUFFER_VIEWS || !TypedArrayPrototype || TypedArrayPrototype === ObjectPrototype) {
  TypedArrayPrototype = TypedArray.prototype;
  if (NATIVE_ARRAY_BUFFER_VIEWS) for (NAME in TypedArrayConstructorsList) {
    if (global_1[NAME]) objectSetPrototypeOf(global_1[NAME].prototype, TypedArrayPrototype);
  }
}

// WebKit bug - one more object in Uint8ClampedArray prototype chain
if (NATIVE_ARRAY_BUFFER_VIEWS && objectGetPrototypeOf(Uint8ClampedArrayPrototype) !== TypedArrayPrototype) {
  objectSetPrototypeOf(Uint8ClampedArrayPrototype, TypedArrayPrototype);
}

if (descriptors && !hasOwnProperty_1(TypedArrayPrototype, TO_STRING_TAG)) {
  TYPED_ARRAY_TAG_REQUIRED = true;
  defineProperty(TypedArrayPrototype, TO_STRING_TAG, { get: function () {
    return isObject(this) ? this[TYPED_ARRAY_TAG] : undefined;
  } });
  for (NAME in TypedArrayConstructorsList) if (global_1[NAME]) {
    createNonEnumerableProperty(global_1[NAME], TYPED_ARRAY_TAG, NAME);
  }
}

var arrayBufferViewCore = {
  NATIVE_ARRAY_BUFFER_VIEWS: NATIVE_ARRAY_BUFFER_VIEWS,
  TYPED_ARRAY_CONSTRUCTOR: TYPED_ARRAY_CONSTRUCTOR,
  TYPED_ARRAY_TAG: TYPED_ARRAY_TAG_REQUIRED && TYPED_ARRAY_TAG,
  aTypedArray: aTypedArray,
  aTypedArrayConstructor: aTypedArrayConstructor,
  exportTypedArrayMethod: exportTypedArrayMethod,
  exportTypedArrayStaticMethod: exportTypedArrayStaticMethod,
  isView: isView,
  isTypedArray: isTypedArray,
  TypedArray: TypedArray,
  TypedArrayPrototype: TypedArrayPrototype
};

/* eslint-disable no-new -- required for testing */



var NATIVE_ARRAY_BUFFER_VIEWS$1 = arrayBufferViewCore.NATIVE_ARRAY_BUFFER_VIEWS;

var ArrayBuffer$1 = global_1.ArrayBuffer;
var Int8Array$1 = global_1.Int8Array;

var typedArrayConstructorsRequireWrappers = !NATIVE_ARRAY_BUFFER_VIEWS$1 || !fails(function () {
  Int8Array$1(1);
}) || !fails(function () {
  new Int8Array$1(-1);
}) || !checkCorrectnessOfIteration(function (iterable) {
  new Int8Array$1();
  new Int8Array$1(null);
  new Int8Array$1(1.5);
  new Int8Array$1(iterable);
}, true) || fails(function () {
  // Safari (11+) bug - a reason why even Safari 13 should load a typed array polyfill
  return new Int8Array$1(new ArrayBuffer$1(2), 1, undefined).length !== 1;
});

var RangeError = global_1.RangeError;

// `ToIndex` abstract operation
// https://tc39.es/ecma262/#sec-toindex
var toIndex = function (it) {
  if (it === undefined) return 0;
  var number = toIntegerOrInfinity(it);
  var length = toLength(number);
  if (number !== length) throw RangeError('Wrong length or index');
  return length;
};

// IEEE754 conversions based on https://github.com/feross/ieee754


var Array$1 = global_1.Array;
var abs = Math.abs;
var pow = Math.pow;
var floor$1 = Math.floor;
var log = Math.log;
var LN2 = Math.LN2;

var pack = function (number, mantissaLength, bytes) {
  var buffer = Array$1(bytes);
  var exponentLength = bytes * 8 - mantissaLength - 1;
  var eMax = (1 << exponentLength) - 1;
  var eBias = eMax >> 1;
  var rt = mantissaLength === 23 ? pow(2, -24) - pow(2, -77) : 0;
  var sign = number < 0 || number === 0 && 1 / number < 0 ? 1 : 0;
  var index = 0;
  var exponent, mantissa, c;
  number = abs(number);
  // eslint-disable-next-line no-self-compare -- NaN check
  if (number != number || number === Infinity) {
    // eslint-disable-next-line no-self-compare -- NaN check
    mantissa = number != number ? 1 : 0;
    exponent = eMax;
  } else {
    exponent = floor$1(log(number) / LN2);
    c = pow(2, -exponent);
    if (number * c < 1) {
      exponent--;
      c *= 2;
    }
    if (exponent + eBias >= 1) {
      number += rt / c;
    } else {
      number += rt * pow(2, 1 - eBias);
    }
    if (number * c >= 2) {
      exponent++;
      c /= 2;
    }
    if (exponent + eBias >= eMax) {
      mantissa = 0;
      exponent = eMax;
    } else if (exponent + eBias >= 1) {
      mantissa = (number * c - 1) * pow(2, mantissaLength);
      exponent = exponent + eBias;
    } else {
      mantissa = number * pow(2, eBias - 1) * pow(2, mantissaLength);
      exponent = 0;
    }
  }
  while (mantissaLength >= 8) {
    buffer[index++] = mantissa & 255;
    mantissa /= 256;
    mantissaLength -= 8;
  }
  exponent = exponent << mantissaLength | mantissa;
  exponentLength += mantissaLength;
  while (exponentLength > 0) {
    buffer[index++] = exponent & 255;
    exponent /= 256;
    exponentLength -= 8;
  }
  buffer[--index] |= sign * 128;
  return buffer;
};

var unpack = function (buffer, mantissaLength) {
  var bytes = buffer.length;
  var exponentLength = bytes * 8 - mantissaLength - 1;
  var eMax = (1 << exponentLength) - 1;
  var eBias = eMax >> 1;
  var nBits = exponentLength - 7;
  var index = bytes - 1;
  var sign = buffer[index--];
  var exponent = sign & 127;
  var mantissa;
  sign >>= 7;
  while (nBits > 0) {
    exponent = exponent * 256 + buffer[index--];
    nBits -= 8;
  }
  mantissa = exponent & (1 << -nBits) - 1;
  exponent >>= -nBits;
  nBits += mantissaLength;
  while (nBits > 0) {
    mantissa = mantissa * 256 + buffer[index--];
    nBits -= 8;
  }
  if (exponent === 0) {
    exponent = 1 - eBias;
  } else if (exponent === eMax) {
    return mantissa ? NaN : sign ? -Infinity : Infinity;
  } else {
    mantissa = mantissa + pow(2, mantissaLength);
    exponent = exponent - eBias;
  } return (sign ? -1 : 1) * mantissa * pow(2, exponent - mantissaLength);
};

var ieee754 = {
  pack: pack,
  unpack: unpack
};

// `Array.prototype.fill` method implementation
// https://tc39.es/ecma262/#sec-array.prototype.fill
var arrayFill = function fill(value /* , start = 0, end = @length */) {
  var O = toObject(this);
  var length = lengthOfArrayLike(O);
  var argumentsLength = arguments.length;
  var index = toAbsoluteIndex(argumentsLength > 1 ? arguments[1] : undefined, length);
  var end = argumentsLength > 2 ? arguments[2] : undefined;
  var endPos = end === undefined ? length : toAbsoluteIndex(end, length);
  while (endPos > index) O[index++] = value;
  return O;
};

var getOwnPropertyNames = objectGetOwnPropertyNames.f;
var defineProperty$1 = objectDefineProperty.f;





var PROPER_FUNCTION_NAME = functionName.PROPER;
var CONFIGURABLE_FUNCTION_NAME = functionName.CONFIGURABLE;
var getInternalState$1 = internalState.get;
var setInternalState = internalState.set;
var ARRAY_BUFFER = 'ArrayBuffer';
var DATA_VIEW = 'DataView';
var PROTOTYPE = 'prototype';
var WRONG_LENGTH = 'Wrong length';
var WRONG_INDEX = 'Wrong index';
var NativeArrayBuffer = global_1[ARRAY_BUFFER];
var $ArrayBuffer = NativeArrayBuffer;
var ArrayBufferPrototype = $ArrayBuffer && $ArrayBuffer[PROTOTYPE];
var $DataView = global_1[DATA_VIEW];
var DataViewPrototype = $DataView && $DataView[PROTOTYPE];
var ObjectPrototype$1 = Object.prototype;
var Array$2 = global_1.Array;
var RangeError$1 = global_1.RangeError;
var fill = functionUncurryThis(arrayFill);
var reverse = functionUncurryThis([].reverse);

var packIEEE754 = ieee754.pack;
var unpackIEEE754 = ieee754.unpack;

var packInt8 = function (number) {
  return [number & 0xFF];
};

var packInt16 = function (number) {
  return [number & 0xFF, number >> 8 & 0xFF];
};

var packInt32 = function (number) {
  return [number & 0xFF, number >> 8 & 0xFF, number >> 16 & 0xFF, number >> 24 & 0xFF];
};

var unpackInt32 = function (buffer) {
  return buffer[3] << 24 | buffer[2] << 16 | buffer[1] << 8 | buffer[0];
};

var packFloat32 = function (number) {
  return packIEEE754(number, 23, 4);
};

var packFloat64 = function (number) {
  return packIEEE754(number, 52, 8);
};

var addGetter = function (Constructor, key) {
  defineProperty$1(Constructor[PROTOTYPE], key, { get: function () { return getInternalState$1(this)[key]; } });
};

var get = function (view, count, index, isLittleEndian) {
  var intIndex = toIndex(index);
  var store = getInternalState$1(view);
  if (intIndex + count > store.byteLength) throw RangeError$1(WRONG_INDEX);
  var bytes = getInternalState$1(store.buffer).bytes;
  var start = intIndex + store.byteOffset;
  var pack = arraySliceSimple(bytes, start, start + count);
  return isLittleEndian ? pack : reverse(pack);
};

var set = function (view, count, index, conversion, value, isLittleEndian) {
  var intIndex = toIndex(index);
  var store = getInternalState$1(view);
  if (intIndex + count > store.byteLength) throw RangeError$1(WRONG_INDEX);
  var bytes = getInternalState$1(store.buffer).bytes;
  var start = intIndex + store.byteOffset;
  var pack = conversion(+value);
  for (var i = 0; i < count; i++) bytes[start + i] = pack[isLittleEndian ? i : count - i - 1];
};

if (!arrayBufferNative) {
  $ArrayBuffer = function ArrayBuffer(length) {
    anInstance(this, ArrayBufferPrototype);
    var byteLength = toIndex(length);
    setInternalState(this, {
      bytes: fill(Array$2(byteLength), 0),
      byteLength: byteLength
    });
    if (!descriptors) this.byteLength = byteLength;
  };

  ArrayBufferPrototype = $ArrayBuffer[PROTOTYPE];

  $DataView = function DataView(buffer, byteOffset, byteLength) {
    anInstance(this, DataViewPrototype);
    anInstance(buffer, ArrayBufferPrototype);
    var bufferLength = getInternalState$1(buffer).byteLength;
    var offset = toIntegerOrInfinity(byteOffset);
    if (offset < 0 || offset > bufferLength) throw RangeError$1('Wrong offset');
    byteLength = byteLength === undefined ? bufferLength - offset : toLength(byteLength);
    if (offset + byteLength > bufferLength) throw RangeError$1(WRONG_LENGTH);
    setInternalState(this, {
      buffer: buffer,
      byteLength: byteLength,
      byteOffset: offset
    });
    if (!descriptors) {
      this.buffer = buffer;
      this.byteLength = byteLength;
      this.byteOffset = offset;
    }
  };

  DataViewPrototype = $DataView[PROTOTYPE];

  if (descriptors) {
    addGetter($ArrayBuffer, 'byteLength');
    addGetter($DataView, 'buffer');
    addGetter($DataView, 'byteLength');
    addGetter($DataView, 'byteOffset');
  }

  redefineAll(DataViewPrototype, {
    getInt8: function getInt8(byteOffset) {
      return get(this, 1, byteOffset)[0] << 24 >> 24;
    },
    getUint8: function getUint8(byteOffset) {
      return get(this, 1, byteOffset)[0];
    },
    getInt16: function getInt16(byteOffset /* , littleEndian */) {
      var bytes = get(this, 2, byteOffset, arguments.length > 1 ? arguments[1] : undefined);
      return (bytes[1] << 8 | bytes[0]) << 16 >> 16;
    },
    getUint16: function getUint16(byteOffset /* , littleEndian */) {
      var bytes = get(this, 2, byteOffset, arguments.length > 1 ? arguments[1] : undefined);
      return bytes[1] << 8 | bytes[0];
    },
    getInt32: function getInt32(byteOffset /* , littleEndian */) {
      return unpackInt32(get(this, 4, byteOffset, arguments.length > 1 ? arguments[1] : undefined));
    },
    getUint32: function getUint32(byteOffset /* , littleEndian */) {
      return unpackInt32(get(this, 4, byteOffset, arguments.length > 1 ? arguments[1] : undefined)) >>> 0;
    },
    getFloat32: function getFloat32(byteOffset /* , littleEndian */) {
      return unpackIEEE754(get(this, 4, byteOffset, arguments.length > 1 ? arguments[1] : undefined), 23);
    },
    getFloat64: function getFloat64(byteOffset /* , littleEndian */) {
      return unpackIEEE754(get(this, 8, byteOffset, arguments.length > 1 ? arguments[1] : undefined), 52);
    },
    setInt8: function setInt8(byteOffset, value) {
      set(this, 1, byteOffset, packInt8, value);
    },
    setUint8: function setUint8(byteOffset, value) {
      set(this, 1, byteOffset, packInt8, value);
    },
    setInt16: function setInt16(byteOffset, value /* , littleEndian */) {
      set(this, 2, byteOffset, packInt16, value, arguments.length > 2 ? arguments[2] : undefined);
    },
    setUint16: function setUint16(byteOffset, value /* , littleEndian */) {
      set(this, 2, byteOffset, packInt16, value, arguments.length > 2 ? arguments[2] : undefined);
    },
    setInt32: function setInt32(byteOffset, value /* , littleEndian */) {
      set(this, 4, byteOffset, packInt32, value, arguments.length > 2 ? arguments[2] : undefined);
    },
    setUint32: function setUint32(byteOffset, value /* , littleEndian */) {
      set(this, 4, byteOffset, packInt32, value, arguments.length > 2 ? arguments[2] : undefined);
    },
    setFloat32: function setFloat32(byteOffset, value /* , littleEndian */) {
      set(this, 4, byteOffset, packFloat32, value, arguments.length > 2 ? arguments[2] : undefined);
    },
    setFloat64: function setFloat64(byteOffset, value /* , littleEndian */) {
      set(this, 8, byteOffset, packFloat64, value, arguments.length > 2 ? arguments[2] : undefined);
    }
  });
} else {
  var INCORRECT_ARRAY_BUFFER_NAME = PROPER_FUNCTION_NAME && NativeArrayBuffer.name !== ARRAY_BUFFER;
  /* eslint-disable no-new -- required for testing */
  if (!fails(function () {
    NativeArrayBuffer(1);
  }) || !fails(function () {
    new NativeArrayBuffer(-1);
  }) || fails(function () {
    new NativeArrayBuffer();
    new NativeArrayBuffer(1.5);
    new NativeArrayBuffer(NaN);
    return INCORRECT_ARRAY_BUFFER_NAME && !CONFIGURABLE_FUNCTION_NAME;
  })) {
  /* eslint-enable no-new -- required for testing */
    $ArrayBuffer = function ArrayBuffer(length) {
      anInstance(this, ArrayBufferPrototype);
      return new NativeArrayBuffer(toIndex(length));
    };

    $ArrayBuffer[PROTOTYPE] = ArrayBufferPrototype;

    for (var keys = getOwnPropertyNames(NativeArrayBuffer), j = 0, key; keys.length > j;) {
      if (!((key = keys[j++]) in $ArrayBuffer)) {
        createNonEnumerableProperty($ArrayBuffer, key, NativeArrayBuffer[key]);
      }
    }

    ArrayBufferPrototype.constructor = $ArrayBuffer;
  } else if (INCORRECT_ARRAY_BUFFER_NAME && CONFIGURABLE_FUNCTION_NAME) {
    createNonEnumerableProperty(NativeArrayBuffer, 'name', ARRAY_BUFFER);
  }

  // WebKit bug - the same parent prototype for typed arrays and data view
  if (objectSetPrototypeOf && objectGetPrototypeOf(DataViewPrototype) !== ObjectPrototype$1) {
    objectSetPrototypeOf(DataViewPrototype, ObjectPrototype$1);
  }

  // iOS Safari 7.x bug
  var testView = new $DataView(new $ArrayBuffer(2));
  var $setInt8 = functionUncurryThis(DataViewPrototype.setInt8);
  testView.setInt8(0, 2147483648);
  testView.setInt8(1, 2147483649);
  if (testView.getInt8(0) || !testView.getInt8(1)) redefineAll(DataViewPrototype, {
    setInt8: function setInt8(byteOffset, value) {
      $setInt8(this, byteOffset, value << 24 >> 24);
    },
    setUint8: function setUint8(byteOffset, value) {
      $setInt8(this, byteOffset, value << 24 >> 24);
    }
  }, { unsafe: true });
}

setToStringTag($ArrayBuffer, ARRAY_BUFFER);
setToStringTag($DataView, DATA_VIEW);

var arrayBuffer = {
  ArrayBuffer: $ArrayBuffer,
  DataView: $DataView
};

var floor$2 = Math.floor;

// `IsIntegralNumber` abstract operation
// https://tc39.es/ecma262/#sec-isintegralnumber
// eslint-disable-next-line es/no-number-isinteger -- safe
var isIntegralNumber = Number.isInteger || function isInteger(it) {
  return !isObject(it) && isFinite(it) && floor$2(it) === it;
};

var RangeError$2 = global_1.RangeError;

var toPositiveInteger = function (it) {
  var result = toIntegerOrInfinity(it);
  if (result < 0) throw RangeError$2("The argument can't be less than 0");
  return result;
};

var RangeError$3 = global_1.RangeError;

var toOffset = function (it, BYTES) {
  var offset = toPositiveInteger(it);
  if (offset % BYTES) throw RangeError$3('Wrong offset');
  return offset;
};

var aTypedArrayConstructor$1 = arrayBufferViewCore.aTypedArrayConstructor;

var typedArrayFrom = function from(source /* , mapfn, thisArg */) {
  var C = aConstructor(this);
  var O = toObject(source);
  var argumentsLength = arguments.length;
  var mapfn = argumentsLength > 1 ? arguments[1] : undefined;
  var mapping = mapfn !== undefined;
  var iteratorMethod = getIteratorMethod(O);
  var i, length, result, step, iterator, next;
  if (iteratorMethod && !isArrayIteratorMethod(iteratorMethod)) {
    iterator = getIterator(O, iteratorMethod);
    next = iterator.next;
    O = [];
    while (!(step = functionCall(next, iterator)).done) {
      O.push(step.value);
    }
  }
  if (mapping && argumentsLength > 2) {
    mapfn = functionBindContext(mapfn, arguments[2]);
  }
  length = lengthOfArrayLike(O);
  result = new (aTypedArrayConstructor$1(C))(length);
  for (i = 0; length > i; i++) {
    result[i] = mapping ? mapfn(O[i], i) : O[i];
  }
  return result;
};

// `IsArray` abstract operation
// https://tc39.es/ecma262/#sec-isarray
// eslint-disable-next-line es/no-array-isarray -- safe
var isArray = Array.isArray || function isArray(argument) {
  return classofRaw(argument) == 'Array';
};

var SPECIES$1 = wellKnownSymbol('species');
var Array$3 = global_1.Array;

// a part of `ArraySpeciesCreate` abstract operation
// https://tc39.es/ecma262/#sec-arrayspeciescreate
var arraySpeciesConstructor = function (originalArray) {
  var C;
  if (isArray(originalArray)) {
    C = originalArray.constructor;
    // cross-realm fallback
    if (isConstructor(C) && (C === Array$3 || isArray(C.prototype))) C = undefined;
    else if (isObject(C)) {
      C = C[SPECIES$1];
      if (C === null) C = undefined;
    }
  } return C === undefined ? Array$3 : C;
};

// `ArraySpeciesCreate` abstract operation
// https://tc39.es/ecma262/#sec-arrayspeciescreate
var arraySpeciesCreate = function (originalArray, length) {
  return new (arraySpeciesConstructor(originalArray))(length === 0 ? 0 : length);
};

var push$1 = functionUncurryThis([].push);

// `Array.prototype.{ forEach, map, filter, some, every, find, findIndex, filterReject }` methods implementation
var createMethod = function (TYPE) {
  var IS_MAP = TYPE == 1;
  var IS_FILTER = TYPE == 2;
  var IS_SOME = TYPE == 3;
  var IS_EVERY = TYPE == 4;
  var IS_FIND_INDEX = TYPE == 6;
  var IS_FILTER_REJECT = TYPE == 7;
  var NO_HOLES = TYPE == 5 || IS_FIND_INDEX;
  return function ($this, callbackfn, that, specificCreate) {
    var O = toObject($this);
    var self = indexedObject(O);
    var boundFunction = functionBindContext(callbackfn, that);
    var length = lengthOfArrayLike(self);
    var index = 0;
    var create = specificCreate || arraySpeciesCreate;
    var target = IS_MAP ? create($this, length) : IS_FILTER || IS_FILTER_REJECT ? create($this, 0) : undefined;
    var value, result;
    for (;length > index; index++) if (NO_HOLES || index in self) {
      value = self[index];
      result = boundFunction(value, index, O);
      if (TYPE) {
        if (IS_MAP) target[index] = result; // map
        else if (result) switch (TYPE) {
          case 3: return true;              // some
          case 5: return value;             // find
          case 6: return index;             // findIndex
          case 2: push$1(target, value);      // filter
        } else switch (TYPE) {
          case 4: return false;             // every
          case 7: push$1(target, value);      // filterReject
        }
      }
    }
    return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : target;
  };
};

var arrayIteration = {
  // `Array.prototype.forEach` method
  // https://tc39.es/ecma262/#sec-array.prototype.foreach
  forEach: createMethod(0),
  // `Array.prototype.map` method
  // https://tc39.es/ecma262/#sec-array.prototype.map
  map: createMethod(1),
  // `Array.prototype.filter` method
  // https://tc39.es/ecma262/#sec-array.prototype.filter
  filter: createMethod(2),
  // `Array.prototype.some` method
  // https://tc39.es/ecma262/#sec-array.prototype.some
  some: createMethod(3),
  // `Array.prototype.every` method
  // https://tc39.es/ecma262/#sec-array.prototype.every
  every: createMethod(4),
  // `Array.prototype.find` method
  // https://tc39.es/ecma262/#sec-array.prototype.find
  find: createMethod(5),
  // `Array.prototype.findIndex` method
  // https://tc39.es/ecma262/#sec-array.prototype.findIndex
  findIndex: createMethod(6),
  // `Array.prototype.filterReject` method
  // https://github.com/tc39/proposal-array-filtering
  filterReject: createMethod(7)
};

var SPECIES$2 = wellKnownSymbol('species');

var setSpecies = function (CONSTRUCTOR_NAME) {
  var Constructor = getBuiltIn(CONSTRUCTOR_NAME);
  var defineProperty = objectDefineProperty.f;

  if (descriptors && Constructor && !Constructor[SPECIES$2]) {
    defineProperty(Constructor, SPECIES$2, {
      configurable: true,
      get: function () { return this; }
    });
  }
};

var typedArrayConstructor = createCommonjsModule(function (module) {






















var getOwnPropertyNames = objectGetOwnPropertyNames.f;

var forEach = arrayIteration.forEach;






var getInternalState = internalState.get;
var setInternalState = internalState.set;
var nativeDefineProperty = objectDefineProperty.f;
var nativeGetOwnPropertyDescriptor = objectGetOwnPropertyDescriptor.f;
var round = Math.round;
var RangeError = global_1.RangeError;
var ArrayBuffer = arrayBuffer.ArrayBuffer;
var ArrayBufferPrototype = ArrayBuffer.prototype;
var DataView = arrayBuffer.DataView;
var NATIVE_ARRAY_BUFFER_VIEWS = arrayBufferViewCore.NATIVE_ARRAY_BUFFER_VIEWS;
var TYPED_ARRAY_CONSTRUCTOR = arrayBufferViewCore.TYPED_ARRAY_CONSTRUCTOR;
var TYPED_ARRAY_TAG = arrayBufferViewCore.TYPED_ARRAY_TAG;
var TypedArray = arrayBufferViewCore.TypedArray;
var TypedArrayPrototype = arrayBufferViewCore.TypedArrayPrototype;
var aTypedArrayConstructor = arrayBufferViewCore.aTypedArrayConstructor;
var isTypedArray = arrayBufferViewCore.isTypedArray;
var BYTES_PER_ELEMENT = 'BYTES_PER_ELEMENT';
var WRONG_LENGTH = 'Wrong length';

var fromList = function (C, list) {
  aTypedArrayConstructor(C);
  var index = 0;
  var length = list.length;
  var result = new C(length);
  while (length > index) result[index] = list[index++];
  return result;
};

var addGetter = function (it, key) {
  nativeDefineProperty(it, key, { get: function () {
    return getInternalState(this)[key];
  } });
};

var isArrayBuffer = function (it) {
  var klass;
  return objectIsPrototypeOf(ArrayBufferPrototype, it) || (klass = classof(it)) == 'ArrayBuffer' || klass == 'SharedArrayBuffer';
};

var isTypedArrayIndex = function (target, key) {
  return isTypedArray(target)
    && !isSymbol(key)
    && key in target
    && isIntegralNumber(+key)
    && key >= 0;
};

var wrappedGetOwnPropertyDescriptor = function getOwnPropertyDescriptor(target, key) {
  key = toPropertyKey(key);
  return isTypedArrayIndex(target, key)
    ? createPropertyDescriptor(2, target[key])
    : nativeGetOwnPropertyDescriptor(target, key);
};

var wrappedDefineProperty = function defineProperty(target, key, descriptor) {
  key = toPropertyKey(key);
  if (isTypedArrayIndex(target, key)
    && isObject(descriptor)
    && hasOwnProperty_1(descriptor, 'value')
    && !hasOwnProperty_1(descriptor, 'get')
    && !hasOwnProperty_1(descriptor, 'set')
    // TODO: add validation descriptor w/o calling accessors
    && !descriptor.configurable
    && (!hasOwnProperty_1(descriptor, 'writable') || descriptor.writable)
    && (!hasOwnProperty_1(descriptor, 'enumerable') || descriptor.enumerable)
  ) {
    target[key] = descriptor.value;
    return target;
  } return nativeDefineProperty(target, key, descriptor);
};

if (descriptors) {
  if (!NATIVE_ARRAY_BUFFER_VIEWS) {
    objectGetOwnPropertyDescriptor.f = wrappedGetOwnPropertyDescriptor;
    objectDefineProperty.f = wrappedDefineProperty;
    addGetter(TypedArrayPrototype, 'buffer');
    addGetter(TypedArrayPrototype, 'byteOffset');
    addGetter(TypedArrayPrototype, 'byteLength');
    addGetter(TypedArrayPrototype, 'length');
  }

  _export({ target: 'Object', stat: true, forced: !NATIVE_ARRAY_BUFFER_VIEWS }, {
    getOwnPropertyDescriptor: wrappedGetOwnPropertyDescriptor,
    defineProperty: wrappedDefineProperty
  });

  module.exports = function (TYPE, wrapper, CLAMPED) {
    var BYTES = TYPE.match(/\d+$/)[0] / 8;
    var CONSTRUCTOR_NAME = TYPE + (CLAMPED ? 'Clamped' : '') + 'Array';
    var GETTER = 'get' + TYPE;
    var SETTER = 'set' + TYPE;
    var NativeTypedArrayConstructor = global_1[CONSTRUCTOR_NAME];
    var TypedArrayConstructor = NativeTypedArrayConstructor;
    var TypedArrayConstructorPrototype = TypedArrayConstructor && TypedArrayConstructor.prototype;
    var exported = {};

    var getter = function (that, index) {
      var data = getInternalState(that);
      return data.view[GETTER](index * BYTES + data.byteOffset, true);
    };

    var setter = function (that, index, value) {
      var data = getInternalState(that);
      if (CLAMPED) value = (value = round(value)) < 0 ? 0 : value > 0xFF ? 0xFF : value & 0xFF;
      data.view[SETTER](index * BYTES + data.byteOffset, value, true);
    };

    var addElement = function (that, index) {
      nativeDefineProperty(that, index, {
        get: function () {
          return getter(this, index);
        },
        set: function (value) {
          return setter(this, index, value);
        },
        enumerable: true
      });
    };

    if (!NATIVE_ARRAY_BUFFER_VIEWS) {
      TypedArrayConstructor = wrapper(function (that, data, offset, $length) {
        anInstance(that, TypedArrayConstructorPrototype);
        var index = 0;
        var byteOffset = 0;
        var buffer, byteLength, length;
        if (!isObject(data)) {
          length = toIndex(data);
          byteLength = length * BYTES;
          buffer = new ArrayBuffer(byteLength);
        } else if (isArrayBuffer(data)) {
          buffer = data;
          byteOffset = toOffset(offset, BYTES);
          var $len = data.byteLength;
          if ($length === undefined) {
            if ($len % BYTES) throw RangeError(WRONG_LENGTH);
            byteLength = $len - byteOffset;
            if (byteLength < 0) throw RangeError(WRONG_LENGTH);
          } else {
            byteLength = toLength($length) * BYTES;
            if (byteLength + byteOffset > $len) throw RangeError(WRONG_LENGTH);
          }
          length = byteLength / BYTES;
        } else if (isTypedArray(data)) {
          return fromList(TypedArrayConstructor, data);
        } else {
          return functionCall(typedArrayFrom, TypedArrayConstructor, data);
        }
        setInternalState(that, {
          buffer: buffer,
          byteOffset: byteOffset,
          byteLength: byteLength,
          length: length,
          view: new DataView(buffer)
        });
        while (index < length) addElement(that, index++);
      });

      if (objectSetPrototypeOf) objectSetPrototypeOf(TypedArrayConstructor, TypedArray);
      TypedArrayConstructorPrototype = TypedArrayConstructor.prototype = objectCreate(TypedArrayPrototype);
    } else if (typedArrayConstructorsRequireWrappers) {
      TypedArrayConstructor = wrapper(function (dummy, data, typedArrayOffset, $length) {
        anInstance(dummy, TypedArrayConstructorPrototype);
        return inheritIfRequired(function () {
          if (!isObject(data)) return new NativeTypedArrayConstructor(toIndex(data));
          if (isArrayBuffer(data)) return $length !== undefined
            ? new NativeTypedArrayConstructor(data, toOffset(typedArrayOffset, BYTES), $length)
            : typedArrayOffset !== undefined
              ? new NativeTypedArrayConstructor(data, toOffset(typedArrayOffset, BYTES))
              : new NativeTypedArrayConstructor(data);
          if (isTypedArray(data)) return fromList(TypedArrayConstructor, data);
          return functionCall(typedArrayFrom, TypedArrayConstructor, data);
        }(), dummy, TypedArrayConstructor);
      });

      if (objectSetPrototypeOf) objectSetPrototypeOf(TypedArrayConstructor, TypedArray);
      forEach(getOwnPropertyNames(NativeTypedArrayConstructor), function (key) {
        if (!(key in TypedArrayConstructor)) {
          createNonEnumerableProperty(TypedArrayConstructor, key, NativeTypedArrayConstructor[key]);
        }
      });
      TypedArrayConstructor.prototype = TypedArrayConstructorPrototype;
    }

    if (TypedArrayConstructorPrototype.constructor !== TypedArrayConstructor) {
      createNonEnumerableProperty(TypedArrayConstructorPrototype, 'constructor', TypedArrayConstructor);
    }

    createNonEnumerableProperty(TypedArrayConstructorPrototype, TYPED_ARRAY_CONSTRUCTOR, TypedArrayConstructor);

    if (TYPED_ARRAY_TAG) {
      createNonEnumerableProperty(TypedArrayConstructorPrototype, TYPED_ARRAY_TAG, CONSTRUCTOR_NAME);
    }

    exported[CONSTRUCTOR_NAME] = TypedArrayConstructor;

    _export({
      global: true, forced: TypedArrayConstructor != NativeTypedArrayConstructor, sham: !NATIVE_ARRAY_BUFFER_VIEWS
    }, exported);

    if (!(BYTES_PER_ELEMENT in TypedArrayConstructor)) {
      createNonEnumerableProperty(TypedArrayConstructor, BYTES_PER_ELEMENT, BYTES);
    }

    if (!(BYTES_PER_ELEMENT in TypedArrayConstructorPrototype)) {
      createNonEnumerableProperty(TypedArrayConstructorPrototype, BYTES_PER_ELEMENT, BYTES);
    }

    setSpecies(CONSTRUCTOR_NAME);
  };
} else module.exports = function () { /* empty */ };
});

// `Uint8Array` constructor
// https://tc39.es/ecma262/#sec-typedarray-objects
typedArrayConstructor('Uint8', function (init) {
  return function Uint8Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});

var aTypedArray$1 = arrayBufferViewCore.aTypedArray;
var exportTypedArrayMethod$1 = arrayBufferViewCore.exportTypedArrayMethod;

// `%TypedArray%.prototype.at` method
// https://github.com/tc39/proposal-relative-indexing-method
exportTypedArrayMethod$1('at', function at(index) {
  var O = aTypedArray$1(this);
  var len = lengthOfArrayLike(O);
  var relativeIndex = toIntegerOrInfinity(index);
  var k = relativeIndex >= 0 ? relativeIndex : len + relativeIndex;
  return (k < 0 || k >= len) ? undefined : O[k];
});

var RangeError$4 = global_1.RangeError;
var Int8Array$2 = global_1.Int8Array;
var Int8ArrayPrototype$1 = Int8Array$2 && Int8Array$2.prototype;
var $set = Int8ArrayPrototype$1 && Int8ArrayPrototype$1.set;
var aTypedArray$2 = arrayBufferViewCore.aTypedArray;
var exportTypedArrayMethod$2 = arrayBufferViewCore.exportTypedArrayMethod;

var WORKS_WITH_OBJECTS_AND_GEERIC_ON_TYPED_ARRAYS = !fails(function () {
  // eslint-disable-next-line es/no-typed-arrays -- required for testing
  var array = new Uint8ClampedArray(2);
  functionCall($set, array, { length: 1, 0: 3 }, 1);
  return array[1] !== 3;
});

// https://bugs.chromium.org/p/v8/issues/detail?id=11294 and other
var TO_OBJECT_BUG = WORKS_WITH_OBJECTS_AND_GEERIC_ON_TYPED_ARRAYS && arrayBufferViewCore.NATIVE_ARRAY_BUFFER_VIEWS && fails(function () {
  var array = new Int8Array$2(2);
  array.set(1);
  array.set('2', 1);
  return array[0] !== 0 || array[1] !== 2;
});

// `%TypedArray%.prototype.set` method
// https://tc39.es/ecma262/#sec-%typedarray%.prototype.set
exportTypedArrayMethod$2('set', function set(arrayLike /* , offset */) {
  aTypedArray$2(this);
  var offset = toOffset(arguments.length > 1 ? arguments[1] : undefined, 1);
  var src = toObject(arrayLike);
  if (WORKS_WITH_OBJECTS_AND_GEERIC_ON_TYPED_ARRAYS) return functionCall($set, this, src, offset);
  var length = this.length;
  var len = lengthOfArrayLike(src);
  var index = 0;
  if (len + offset > length) throw RangeError$4('Wrong length');
  while (index < len) this[offset + index] = src[index++];
}, !WORKS_WITH_OBJECTS_AND_GEERIC_ON_TYPED_ARRAYS || TO_OBJECT_BUG);

var firefox = engineUserAgent.match(/firefox\/(\d+)/i);

var engineFfVersion = !!firefox && +firefox[1];

var engineIsIeOrEdge = /MSIE|Trident/.test(engineUserAgent);

var webkit = engineUserAgent.match(/AppleWebKit\/(\d+)\./);

var engineWebkitVersion = !!webkit && +webkit[1];

var Array$4 = global_1.Array;
var aTypedArray$3 = arrayBufferViewCore.aTypedArray;
var exportTypedArrayMethod$3 = arrayBufferViewCore.exportTypedArrayMethod;
var Uint16Array$1 = global_1.Uint16Array;
var un$Sort = Uint16Array$1 && functionUncurryThis(Uint16Array$1.prototype.sort);

// WebKit
var ACCEPT_INCORRECT_ARGUMENTS = !!un$Sort && !(fails(function () {
  un$Sort(new Uint16Array$1(2), null);
}) && fails(function () {
  un$Sort(new Uint16Array$1(2), {});
}));

var STABLE_SORT = !!un$Sort && !fails(function () {
  // feature detection can be too slow, so check engines versions
  if (engineV8Version) return engineV8Version < 74;
  if (engineFfVersion) return engineFfVersion < 67;
  if (engineIsIeOrEdge) return true;
  if (engineWebkitVersion) return engineWebkitVersion < 602;

  var array = new Uint16Array$1(516);
  var expected = Array$4(516);
  var index, mod;

  for (index = 0; index < 516; index++) {
    mod = index % 4;
    array[index] = 515 - index;
    expected[index] = index - 2 * mod + 3;
  }

  un$Sort(array, function (a, b) {
    return (a / 4 | 0) - (b / 4 | 0);
  });

  for (index = 0; index < 516; index++) {
    if (array[index] !== expected[index]) return true;
  }
});

var getSortCompare = function (comparefn) {
  return function (x, y) {
    if (comparefn !== undefined) return +comparefn(x, y) || 0;
    // eslint-disable-next-line no-self-compare -- NaN check
    if (y !== y) return -1;
    // eslint-disable-next-line no-self-compare -- NaN check
    if (x !== x) return 1;
    if (x === 0 && y === 0) return 1 / x > 0 && 1 / y < 0 ? 1 : -1;
    return x > y;
  };
};

// `%TypedArray%.prototype.sort` method
// https://tc39.es/ecma262/#sec-%typedarray%.prototype.sort
exportTypedArrayMethod$3('sort', function sort(comparefn) {
  if (comparefn !== undefined) aCallable(comparefn);
  if (STABLE_SORT) return un$Sort(this, comparefn);

  return arraySort(aTypedArray$3(this), getSortCompare(comparefn));
}, !STABLE_SORT || ACCEPT_INCORRECT_ARGUMENTS);

var arrayFromConstructorAndList = function (Constructor, list) {
  var index = 0;
  var length = lengthOfArrayLike(list);
  var result = new Constructor(length);
  while (length > index) result[index] = list[index++];
  return result;
};

var TYPED_ARRAY_CONSTRUCTOR$1 = arrayBufferViewCore.TYPED_ARRAY_CONSTRUCTOR;
var aTypedArrayConstructor$2 = arrayBufferViewCore.aTypedArrayConstructor;

// a part of `TypedArraySpeciesCreate` abstract operation
// https://tc39.es/ecma262/#typedarray-species-create
var typedArraySpeciesConstructor = function (originalArray) {
  return aTypedArrayConstructor$2(speciesConstructor(originalArray, originalArray[TYPED_ARRAY_CONSTRUCTOR$1]));
};

var typedArrayFromSpeciesAndList = function (instance, list) {
  return arrayFromConstructorAndList(typedArraySpeciesConstructor(instance), list);
};

var $filterReject = arrayIteration.filterReject;


var aTypedArray$4 = arrayBufferViewCore.aTypedArray;
var exportTypedArrayMethod$4 = arrayBufferViewCore.exportTypedArrayMethod;

// `%TypedArray%.prototype.filterReject` method
// https://github.com/tc39/proposal-array-filtering
exportTypedArrayMethod$4('filterReject', function filterReject(callbackfn /* , thisArg */) {
  var list = $filterReject(aTypedArray$4(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  return typedArrayFromSpeciesAndList(this, list);
}, true);

// `Array.prototype.{ findLast, findLastIndex }` methods implementation
var createMethod$1 = function (TYPE) {
  var IS_FIND_LAST_INDEX = TYPE == 1;
  return function ($this, callbackfn, that) {
    var O = toObject($this);
    var self = indexedObject(O);
    var boundFunction = functionBindContext(callbackfn, that);
    var index = lengthOfArrayLike(self);
    var value, result;
    while (index-- > 0) {
      value = self[index];
      result = boundFunction(value, index, O);
      if (result) switch (TYPE) {
        case 0: return value; // findLast
        case 1: return index; // findLastIndex
      }
    }
    return IS_FIND_LAST_INDEX ? -1 : undefined;
  };
};

var arrayIterationFromLast = {
  // `Array.prototype.findLast` method
  // https://github.com/tc39/proposal-array-find-from-last
  findLast: createMethod$1(0),
  // `Array.prototype.findLastIndex` method
  // https://github.com/tc39/proposal-array-find-from-last
  findLastIndex: createMethod$1(1)
};

var $findLast = arrayIterationFromLast.findLast;

var aTypedArray$5 = arrayBufferViewCore.aTypedArray;
var exportTypedArrayMethod$5 = arrayBufferViewCore.exportTypedArrayMethod;

// `%TypedArray%.prototype.findLast` method
// https://github.com/tc39/proposal-array-find-from-last
exportTypedArrayMethod$5('findLast', function findLast(predicate /* , thisArg */) {
  return $findLast(aTypedArray$5(this), predicate, arguments.length > 1 ? arguments[1] : undefined);
});

var $findLastIndex = arrayIterationFromLast.findLastIndex;

var aTypedArray$6 = arrayBufferViewCore.aTypedArray;
var exportTypedArrayMethod$6 = arrayBufferViewCore.exportTypedArrayMethod;

// `%TypedArray%.prototype.findLastIndex` method
// https://github.com/tc39/proposal-array-find-from-last
exportTypedArrayMethod$6('findLastIndex', function findLastIndex(predicate /* , thisArg */) {
  return $findLastIndex(aTypedArray$6(this), predicate, arguments.length > 1 ? arguments[1] : undefined);
});

var Array$5 = global_1.Array;
var push$2 = functionUncurryThis([].push);

var arrayGroupBy = function ($this, callbackfn, that, specificConstructor) {
  var O = toObject($this);
  var self = indexedObject(O);
  var boundFunction = functionBindContext(callbackfn, that);
  var target = objectCreate(null);
  var length = lengthOfArrayLike(self);
  var index = 0;
  var Constructor, key, value;
  for (;length > index; index++) {
    value = self[index];
    key = toPropertyKey(boundFunction(value, index, O));
    // in some IE10 builds, `hasOwnProperty` returns incorrect result on integer keys
    // but since it's a `null` prototype object, we can safely use `in`
    if (key in target) push$2(target[key], value);
    else target[key] = [value];
  }
  // TODO: Remove this block from `core-js@4`
  if (specificConstructor) {
    Constructor = specificConstructor(O);
    if (Constructor !== Array$5) {
      for (key in target) target[key] = arrayFromConstructorAndList(Constructor, target[key]);
    }
  } return target;
};

// TODO: Remove from `core-js@4`




var aTypedArray$7 = arrayBufferViewCore.aTypedArray;
var exportTypedArrayMethod$7 = arrayBufferViewCore.exportTypedArrayMethod;

// `%TypedArray%.prototype.groupBy` method
// https://github.com/tc39/proposal-array-grouping
exportTypedArrayMethod$7('groupBy', function groupBy(callbackfn /* , thisArg */) {
  var thisArg = arguments.length > 1 ? arguments[1] : undefined;
  return arrayGroupBy(aTypedArray$7(this), callbackfn, thisArg, typedArraySpeciesConstructor);
}, true);

// https://tc39.es/proposal-change-array-by-copy/#sec-array.prototype.toReversed
// https://tc39.es/proposal-change-array-by-copy/#sec-%typedarray%.prototype.toReversed
var arrayToReversed = function (O, C) {
  var len = lengthOfArrayLike(O);
  var A = new C(len);
  var k = 0;
  for (; k < len; k++) A[k] = O[len - k - 1];
  return A;
};

var aTypedArray$8 = arrayBufferViewCore.aTypedArray;
var exportTypedArrayMethod$8 = arrayBufferViewCore.exportTypedArrayMethod;
var TYPED_ARRAY_CONSTRUCTOR$2 = arrayBufferViewCore.TYPED_ARRAY_CONSTRUCTOR;

// `%TypedArray%.prototype.toReversed` method
// https://tc39.es/proposal-change-array-by-copy/#sec-%typedarray%.prototype.toReversed
exportTypedArrayMethod$8('toReversed', function toReversed() {
  return arrayToReversed(aTypedArray$8(this), this[TYPED_ARRAY_CONSTRUCTOR$2]);
}, true);

var aTypedArray$9 = arrayBufferViewCore.aTypedArray;
var exportTypedArrayMethod$9 = arrayBufferViewCore.exportTypedArrayMethod;
var TYPED_ARRAY_CONSTRUCTOR$3 = arrayBufferViewCore.TYPED_ARRAY_CONSTRUCTOR;
var sort = functionUncurryThis(arrayBufferViewCore.TypedArrayPrototype.sort);

// `%TypedArray%.prototype.toSorted` method
// https://tc39.es/proposal-change-array-by-copy/#sec-%typedarray%.prototype.toSorted
exportTypedArrayMethod$9('toSorted', function toSorted(compareFn) {
  if (compareFn !== undefined) aCallable(compareFn);
  var O = aTypedArray$9(this);
  var A = arrayFromConstructorAndList(O[TYPED_ARRAY_CONSTRUCTOR$3], O);
  return sort(A, compareFn);
}, true);

var arraySlice = functionUncurryThis([].slice);

var max$1 = Math.max;
var min$1 = Math.min;

// https://tc39.es/proposal-change-array-by-copy/#sec-array.prototype.toSpliced
// https://tc39.es/proposal-change-array-by-copy/#sec-%typedarray%.prototype.toSpliced
var arrayToSpliced = function (O, C, args) {
  var start = args[0];
  var deleteCount = args[1];
  var len = lengthOfArrayLike(O);
  var actualStart = toAbsoluteIndex(start, len);
  var argumentsLength = args.length;
  var k = 0;
  var insertCount, actualDeleteCount, newLen, A;
  if (argumentsLength === 0) {
    insertCount = actualDeleteCount = 0;
  } else if (argumentsLength === 1) {
    insertCount = 0;
    actualDeleteCount = len - actualStart;
  } else {
    insertCount = argumentsLength - 2;
    actualDeleteCount = min$1(max$1(toIntegerOrInfinity(deleteCount), 0), len - actualStart);
  }
  newLen = len + insertCount - actualDeleteCount;
  A = new C(newLen);

  for (; k < actualStart; k++) A[k] = O[k];
  for (; k < actualStart + insertCount; k++) A[k] = args[k - actualStart + 2];
  for (; k < newLen; k++) A[k] = O[k + actualDeleteCount - insertCount];

  return A;
};

var aTypedArray$a = arrayBufferViewCore.aTypedArray;
var exportTypedArrayMethod$a = arrayBufferViewCore.exportTypedArrayMethod;
var TYPED_ARRAY_CONSTRUCTOR$4 = arrayBufferViewCore.TYPED_ARRAY_CONSTRUCTOR;

// `%TypedArray%.prototype.toSpliced` method
// https://tc39.es/proposal-change-array-by-copy/#sec-%typedarray%.prototype.toSpliced
// eslint-disable-next-line no-unused-vars -- required for .length
exportTypedArrayMethod$a('toSpliced', function toSpliced(start, deleteCount /* , ...items */) {
  return arrayToSpliced(aTypedArray$a(this), this[TYPED_ARRAY_CONSTRUCTOR$4], arraySlice(arguments));
}, true);

var Map = getBuiltIn('Map');
var MapPrototype = Map.prototype;
var mapForEach = functionUncurryThis(MapPrototype.forEach);
var mapHas = functionUncurryThis(MapPrototype.has);
var mapSet = functionUncurryThis(MapPrototype.set);
var push$3 = functionUncurryThis([].push);

// `Array.prototype.uniqueBy` method
// https://github.com/tc39/proposal-array-unique
var arrayUniqueBy = function uniqueBy(resolver) {
  var that = toObject(this);
  var length = lengthOfArrayLike(that);
  var result = arraySpeciesCreate(that, 0);
  var map = new Map();
  var resolverFunction = resolver != null ? aCallable(resolver) : function (value) {
    return value;
  };
  var index, item, key;
  for (index = 0; index < length; index++) {
    item = that[index];
    key = resolverFunction(item);
    if (!mapHas(map, key)) mapSet(map, key, item);
  }
  mapForEach(map, function (value) {
    push$3(result, value);
  });
  return result;
};

var aTypedArray$b = arrayBufferViewCore.aTypedArray;
var exportTypedArrayMethod$b = arrayBufferViewCore.exportTypedArrayMethod;
var arrayUniqueBy$1 = functionUncurryThis(arrayUniqueBy);

// `%TypedArray%.prototype.uniqueBy` method
// https://github.com/tc39/proposal-array-unique
exportTypedArrayMethod$b('uniqueBy', function uniqueBy(resolver) {
  return typedArrayFromSpeciesAndList(this, arrayUniqueBy$1(aTypedArray$b(this), resolver));
}, true);

var RangeError$5 = global_1.RangeError;

// https://tc39.es/proposal-change-array-by-copy/#sec-array.prototype.with
// https://tc39.es/proposal-change-array-by-copy/#sec-%typedarray%.prototype.with
var arrayWith = function (O, C, index, value) {
  var len = lengthOfArrayLike(O);
  var relativeIndex = toIntegerOrInfinity(index);
  var actualIndex = relativeIndex < 0 ? len + relativeIndex : relativeIndex;
  if (actualIndex >= len || actualIndex < 0) throw RangeError$5('Incorrect index');
  var A = new C(len);
  var k = 0;
  for (; k < len; k++) A[k] = k === actualIndex ? value : O[k];
  return A;
};

var aTypedArray$c = arrayBufferViewCore.aTypedArray;
var exportTypedArrayMethod$c = arrayBufferViewCore.exportTypedArrayMethod;
var TYPED_ARRAY_CONSTRUCTOR$5 = arrayBufferViewCore.TYPED_ARRAY_CONSTRUCTOR;

// `%TypedArray%.prototype.with` method
// https://tc39.es/proposal-change-array-by-copy/#sec-%typedarray%.prototype.with
exportTypedArrayMethod$c('with', { 'with': function (index, value) {
  return arrayWith(aTypedArray$c(this), this[TYPED_ARRAY_CONSTRUCTOR$5], index, value);
} }['with'], true);

// `Uint16Array` constructor
// https://tc39.es/ecma262/#sec-typedarray-objects
typedArrayConstructor('Uint16', function (init) {
  return function Uint16Array(data, byteOffset, length) {
    return init(this, data, byteOffset, length);
  };
});

// https://github.com/tc39/proposal-iterator-helpers

var $some = asyncIteratorIteration.some;

_export({ target: 'AsyncIterator', proto: true, real: true, forced: true }, {
  some: function some(fn) {
    return $some(this, fn);
  }
});

// https://github.com/tc39/proposal-iterator-helpers





_export({ target: 'Iterator', proto: true, real: true, forced: true }, {
  some: function some(fn) {
    anObject(this);
    aCallable(fn);
    return iterate(this, function (value, stop) {
      if (fn(value)) return stop();
    }, { IS_ITERATOR: true, INTERRUPTED: true }).stopped;
  }
});

/* ES Module Shims 1.5.2 */

(function () {
  const noop = () => {};

  const optionsScript = document.querySelector('script[type=esms-options]');
  const esmsInitOptions = optionsScript ? JSON.parse(optionsScript.innerHTML) : {};
  Object.assign(esmsInitOptions, self.esmsInitOptions || {});
  let shimMode = !!esmsInitOptions.shimMode;
  const importHook = globalHook(shimMode && esmsInitOptions.onimport);
  const resolveHook = globalHook(shimMode && esmsInitOptions.resolve);
  let fetchHook = esmsInitOptions.fetch ? globalHook(esmsInitOptions.fetch) : fetch;
  const metaHook = esmsInitOptions.meta ? globalHook(shimModule && esmsInitOptions.meta) : noop;
  const skip = esmsInitOptions.skip ? new RegExp(esmsInitOptions.skip) : null;
  let nonce = esmsInitOptions.nonce;
  const mapOverrides = esmsInitOptions.mapOverrides;

  if (!nonce) {
    const nonceElement = document.querySelector('script[nonce]');
    if (nonceElement) nonce = nonceElement.nonce || nonceElement.getAttribute('nonce');
  }

  const onerror = globalHook(esmsInitOptions.onerror || noop);
  const onpolyfill = esmsInitOptions.onpolyfill ? globalHook(esmsInitOptions.onpolyfill) : () => console.log('%c^^ Module TypeError above is polyfilled and can be ignored ^^', 'font-weight:900;color:#391');
  const {
    revokeBlobURLs,
    noLoadEventRetriggers,
    enforceIntegrity
  } = esmsInitOptions;

  function globalHook(name) {
    return typeof name === 'string' ? self[name] : name;
  }

  const enable = Array.isArray(esmsInitOptions.polyfillEnable) ? esmsInitOptions.polyfillEnable : [];
  const cssModulesEnabled = enable.includes('css-modules');
  const jsonModulesEnabled = enable.includes('json-modules');

  function setShimMode() {
    shimMode = true;
  }

  const edge = !!navigator.userAgent.match(/Edge\/\d+\.\d+/);
  const baseUrl = document.baseURI;

  function createBlob(source, type = 'text/javascript') {
    return URL.createObjectURL(new Blob([source], {
      type
    }));
  }

  const eoop = err => setTimeout(() => {
    throw err;
  });

  const throwError = err => {
    (window.reportError || window.safari && console.error || eoop)(err), void onerror(err);
  };

  function fromParent(parent) {
    return parent ? ` imported from ${parent}` : '';
  }

  const backslashRegEx = /\\/g;

  function isURL(url) {
    if (url.indexOf(':') === -1) return false;

    try {
      new URL(url);
      return true;
    } catch (_) {
      return false;
    }
  }
  /*
   * Import maps implementation
   *
   * To make lookups fast we pre-resolve the entire import map
   * and then match based on backtracked hash lookups
   *
   */


  function resolveUrl(relUrl, parentUrl) {
    return resolveIfNotPlainOrUrl(relUrl, parentUrl) || (isURL(relUrl) ? relUrl : resolveIfNotPlainOrUrl('./' + relUrl, parentUrl));
  }

  function resolveIfNotPlainOrUrl(relUrl, parentUrl) {
    // strip off any trailing query params or hashes
    const queryHashIndex = parentUrl.indexOf('?', parentUrl.indexOf('#') === -1 ? parentUrl.indexOf('#') : parentUrl.length);
    if (queryHashIndex !== -1) parentUrl = parentUrl.slice(0, queryHashIndex);
    if (relUrl.indexOf('\\') !== -1) relUrl = relUrl.replace(backslashRegEx, '/'); // protocol-relative

    if (relUrl[0] === '/' && relUrl[1] === '/') {
      return parentUrl.slice(0, parentUrl.indexOf(':') + 1) + relUrl;
    } // relative-url
    else if (relUrl[0] === '.' && (relUrl[1] === '/' || relUrl[1] === '.' && (relUrl[2] === '/' || relUrl.length === 2 && (relUrl += '/')) || relUrl.length === 1 && (relUrl += '/')) || relUrl[0] === '/') {
      const parentProtocol = parentUrl.slice(0, parentUrl.indexOf(':') + 1); // Disabled, but these cases will give inconsistent results for deep backtracking
      //if (parentUrl[parentProtocol.length] !== '/')
      //  throw new Error('Cannot resolve');
      // read pathname from parent URL
      // pathname taken to be part after leading "/"

      let pathname;

      if (parentUrl[parentProtocol.length + 1] === '/') {
        // resolving to a :// so we need to read out the auth and host
        if (parentProtocol !== 'file:') {
          pathname = parentUrl.slice(parentProtocol.length + 2);
          pathname = pathname.slice(pathname.indexOf('/') + 1);
        } else {
          pathname = parentUrl.slice(8);
        }
      } else {
        // resolving to :/ so pathname is the /... part
        pathname = parentUrl.slice(parentProtocol.length + (parentUrl[parentProtocol.length] === '/'));
      }

      if (relUrl[0] === '/') return parentUrl.slice(0, parentUrl.length - pathname.length - 1) + relUrl; // join together and split for removal of .. and . segments
      // looping the string instead of anything fancy for perf reasons
      // '../../../../../z' resolved to 'x/y' is just 'z'

      const segmented = pathname.slice(0, pathname.lastIndexOf('/') + 1) + relUrl;
      const output = [];
      let segmentIndex = -1;

      for (let i = 0; i < segmented.length; i++) {
        // busy reading a segment - only terminate on '/'
        if (segmentIndex !== -1) {
          if (segmented[i] === '/') {
            output.push(segmented.slice(segmentIndex, i + 1));
            segmentIndex = -1;
          }

          continue;
        } // new segment - check if it is relative
        else if (segmented[i] === '.') {
          // ../ segment
          if (segmented[i + 1] === '.' && (segmented[i + 2] === '/' || i + 2 === segmented.length)) {
            output.pop();
            i += 2;
            continue;
          } // ./ segment
          else if (segmented[i + 1] === '/' || i + 1 === segmented.length) {
            i += 1;
            continue;
          }
        } // it is the start of a new segment


        while (segmented[i] === '/') i++;

        segmentIndex = i;
      } // finish reading out the last segment


      if (segmentIndex !== -1) output.push(segmented.slice(segmentIndex));
      return parentUrl.slice(0, parentUrl.length - pathname.length) + output.join('');
    }
  }

  function resolveAndComposeImportMap(json, baseUrl, parentMap) {
    const outMap = {
      imports: Object.assign({}, parentMap.imports),
      scopes: Object.assign({}, parentMap.scopes)
    };
    if (json.imports) resolveAndComposePackages(json.imports, outMap.imports, baseUrl, parentMap);
    if (json.scopes) for (let s in json.scopes) {
      const resolvedScope = resolveUrl(s, baseUrl);
      resolveAndComposePackages(json.scopes[s], outMap.scopes[resolvedScope] || (outMap.scopes[resolvedScope] = {}), baseUrl, parentMap);
    }
    return outMap;
  }

  function getMatch(path, matchObj) {
    if (matchObj[path]) return path;
    let sepIndex = path.length;

    do {
      const segment = path.slice(0, sepIndex + 1);
      if (segment in matchObj) return segment;
    } while ((sepIndex = path.lastIndexOf('/', sepIndex - 1)) !== -1);
  }

  function applyPackages(id, packages) {
    const pkgName = getMatch(id, packages);

    if (pkgName) {
      const pkg = packages[pkgName];
      if (pkg === null) return;
      return pkg + id.slice(pkgName.length);
    }
  }

  function resolveImportMap(importMap, resolvedOrPlain, parentUrl) {
    let scopeUrl = parentUrl && getMatch(parentUrl, importMap.scopes);

    while (scopeUrl) {
      const packageResolution = applyPackages(resolvedOrPlain, importMap.scopes[scopeUrl]);
      if (packageResolution) return packageResolution;
      scopeUrl = getMatch(scopeUrl.slice(0, scopeUrl.lastIndexOf('/')), importMap.scopes);
    }

    return applyPackages(resolvedOrPlain, importMap.imports) || resolvedOrPlain.indexOf(':') !== -1 && resolvedOrPlain;
  }

  function resolveAndComposePackages(packages, outPackages, baseUrl, parentMap) {
    for (let p in packages) {
      const resolvedLhs = resolveIfNotPlainOrUrl(p, baseUrl) || p;

      if ((!shimMode || !mapOverrides) && outPackages[resolvedLhs] && outPackages[resolvedLhs] !== packages[resolvedLhs]) {
        throw Error(`Rejected map override "${resolvedLhs}" from ${outPackages[resolvedLhs]} to ${packages[resolvedLhs]}.`);
      }

      let target = packages[p];
      if (typeof target !== 'string') continue;
      const mapped = resolveImportMap(parentMap, resolveIfNotPlainOrUrl(target, baseUrl) || target, baseUrl);

      if (mapped) {
        outPackages[resolvedLhs] = mapped;
        continue;
      }

      console.warn(`Mapping "${p}" -> "${packages[p]}" does not resolve`);
    }
  }

  let err;
  window.addEventListener('error', _err => err = _err);

  function dynamicImportScript(url, {
    errUrl = url
  } = {}) {
    err = undefined;
    const src = createBlob(`import*as m from'${url}';self._esmsi=m`);
    const s = Object.assign(document.createElement('script'), {
      type: 'module',
      src
    });
    s.setAttribute('nonce', nonce);
    s.setAttribute('noshim', '');
    const p = new Promise((resolve, reject) => {
      // Safari is unique in supporting module script error events
      s.addEventListener('error', cb);
      s.addEventListener('load', cb);

      function cb(_err) {
        document.head.removeChild(s);

        if (self._esmsi) {
          resolve(self._esmsi, baseUrl);
          self._esmsi = undefined;
        } else {
          reject(!(_err instanceof Event) && _err || err && err.error || new Error(`Error loading or executing the graph of ${errUrl} (check the console for ${src}).`));
          err = undefined;
        }
      }
    });
    document.head.appendChild(s);
    return p;
  }

  let dynamicImport = dynamicImportScript;
  const supportsDynamicImportCheck = dynamicImportScript(createBlob('export default u=>import(u)')).then(_dynamicImport => {
    if (_dynamicImport) dynamicImport = _dynamicImport.default;
    return !!_dynamicImport;
  }, noop); // support browsers without dynamic import support (eg Firefox 6x)

  let supportsJsonAssertions = false;
  let supportsCssAssertions = false;
  let supportsImportMeta = false;
  let supportsImportMaps = false;
  let supportsDynamicImport = false;
  const featureDetectionPromise = Promise.resolve(supportsDynamicImportCheck).then(_supportsDynamicImport => {
    if (!_supportsDynamicImport) return;
    supportsDynamicImport = true;
    return Promise.all([dynamicImport(createBlob('import.meta')).then(() => supportsImportMeta = true, noop), cssModulesEnabled && dynamicImport(createBlob('import"data:text/css,{}"assert{type:"css"}')).then(() => supportsCssAssertions = true, noop), jsonModulesEnabled && dynamicImport(createBlob('import"data:text/json,{}"assert{type:"json"}')).then(() => supportsJsonAssertions = true, noop), new Promise(resolve => {
      self._$s = v => {
        document.head.removeChild(iframe);
        if (v) supportsImportMaps = true;
        delete self._$s;
        resolve();
      };

      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.srcdoc = `<script type=importmap nonce="${nonce}">{"imports":{"x":"data:text/javascript,"}}<${''}/script><script nonce="${nonce}">import('x').then(()=>1,()=>0).then(v=>parent._$s(v))<${''}/script>`;
      document.head.appendChild(iframe);
    })]);
  });
  /* es-module-lexer 0.10.4 */

  let e,
      a,
      r,
      s = 2 << 18;
  const i = 1 === new Uint8Array(new Uint16Array([1]).buffer)[0] ? function (e, a) {
    const r = e.length;
    let s = 0;

    for (; s < r;) a[s] = e.charCodeAt(s++);
  } : function (e, a) {
    const r = e.length;
    let s = 0;

    for (; s < r;) {
      const r = e.charCodeAt(s);
      a[s++] = (255 & r) << 8 | r >>> 8;
    }
  },
        t = "xportmportlassetafromssertvoyiedeleinstantyreturdebuggeawaithrwhileforifcatcfinallels";
  let c$1, f, n;

  function parse(k, l = "@") {
    c$1 = k, f = l;
    const u = 2 * c$1.length + (2 << 18);

    if (u > s || !e) {
      for (; u > s;) s *= 2;

      a = new ArrayBuffer(s), i(t, new Uint16Array(a, 16, 85)), e = function (e, a, r) {
        "use asm";

        var s = new e.Int8Array(r),
            i = new e.Int16Array(r),
            t = new e.Int32Array(r),
            c = new e.Uint8Array(r),
            f = new e.Uint16Array(r),
            n = 992;

        function b(e) {
          e = e | 0;
          var a = 0,
              r = 0,
              c = 0,
              b = 0,
              u = 0,
              w = 0,
              v = 0;
          v = n;
          n = n + 11520 | 0;
          u = v + 2048 | 0;
          s[763] = 1;
          i[377] = 0;
          i[378] = 0;
          i[379] = 0;
          i[380] = -1;
          t[57] = t[2];
          s[764] = 0;
          t[56] = 0;
          s[762] = 0;
          t[58] = v + 10496;
          t[59] = v + 2304;
          t[60] = v;
          s[765] = 0;
          e = (t[3] | 0) + -2 | 0;
          t[61] = e;
          a = e + (t[54] << 1) | 0;
          t[62] = a;

          e: while (1) {
            r = e + 2 | 0;
            t[61] = r;

            if (e >>> 0 >= a >>> 0) {
              b = 18;
              break;
            }

            a: do {
              switch (i[r >> 1] | 0) {
                case 9:
                case 10:
                case 11:
                case 12:
                case 13:
                case 32:
                  break;

                case 101:
                  {
                    if ((((i[379] | 0) == 0 ? D(r) | 0 : 0) ? (m(e + 4 | 0, 16, 10) | 0) == 0 : 0) ? (k(), (s[763] | 0) == 0) : 0) {
                      b = 9;
                      break e;
                    } else b = 17;

                    break;
                  }

                case 105:
                  {
                    if (D(r) | 0 ? (m(e + 4 | 0, 26, 10) | 0) == 0 : 0) {
                      l();
                      b = 17;
                    } else b = 17;

                    break;
                  }

                case 59:
                  {
                    b = 17;
                    break;
                  }

                case 47:
                  switch (i[e + 4 >> 1] | 0) {
                    case 47:
                      {
                        j();
                        break a;
                      }

                    case 42:
                      {
                        y(1);
                        break a;
                      }

                    default:
                      {
                        b = 16;
                        break e;
                      }
                  }

                default:
                  {
                    b = 16;
                    break e;
                  }
              }
            } while (0);

            if ((b | 0) == 17) {
              b = 0;
              t[57] = t[61];
            }

            e = t[61] | 0;
            a = t[62] | 0;
          }

          if ((b | 0) == 9) {
            e = t[61] | 0;
            t[57] = e;
            b = 19;
          } else if ((b | 0) == 16) {
            s[763] = 0;
            t[61] = e;
            b = 19;
          } else if ((b | 0) == 18) if (!(s[762] | 0)) {
            e = r;
            b = 19;
          } else e = 0;

          do {
            if ((b | 0) == 19) {
              e: while (1) {
                a = e + 2 | 0;
                t[61] = a;
                c = a;

                if (e >>> 0 >= (t[62] | 0) >>> 0) {
                  b = 75;
                  break;
                }

                a: do {
                  switch (i[a >> 1] | 0) {
                    case 9:
                    case 10:
                    case 11:
                    case 12:
                    case 13:
                    case 32:
                      break;

                    case 101:
                      {
                        if (((i[379] | 0) == 0 ? D(a) | 0 : 0) ? (m(e + 4 | 0, 16, 10) | 0) == 0 : 0) {
                          k();
                          b = 74;
                        } else b = 74;

                        break;
                      }

                    case 105:
                      {
                        if (D(a) | 0 ? (m(e + 4 | 0, 26, 10) | 0) == 0 : 0) {
                          l();
                          b = 74;
                        } else b = 74;

                        break;
                      }

                    case 99:
                      {
                        if ((D(a) | 0 ? (m(e + 4 | 0, 36, 8) | 0) == 0 : 0) ? M(i[e + 12 >> 1] | 0) | 0 : 0) {
                          s[765] = 1;
                          b = 74;
                        } else b = 74;

                        break;
                      }

                    case 40:
                      {
                        r = t[57] | 0;
                        c = t[59] | 0;
                        b = i[379] | 0;
                        i[379] = b + 1 << 16 >> 16;
                        t[c + ((b & 65535) << 2) >> 2] = r;
                        b = 74;
                        break;
                      }

                    case 41:
                      {
                        a = i[379] | 0;

                        if (!(a << 16 >> 16)) {
                          b = 36;
                          break e;
                        }

                        a = a + -1 << 16 >> 16;
                        i[379] = a;
                        r = i[378] | 0;

                        if (r << 16 >> 16 != 0 ? (w = t[(t[60] | 0) + ((r & 65535) + -1 << 2) >> 2] | 0, (t[w + 20 >> 2] | 0) == (t[(t[59] | 0) + ((a & 65535) << 2) >> 2] | 0)) : 0) {
                          a = w + 4 | 0;
                          if (!(t[a >> 2] | 0)) t[a >> 2] = c;
                          t[w + 12 >> 2] = e + 4;
                          i[378] = r + -1 << 16 >> 16;
                          b = 74;
                        } else b = 74;

                        break;
                      }

                    case 123:
                      {
                        b = t[57] | 0;
                        c = t[51] | 0;
                        e = b;

                        do {
                          if ((i[b >> 1] | 0) == 41 & (c | 0) != 0 ? (t[c + 4 >> 2] | 0) == (b | 0) : 0) {
                            a = t[52] | 0;
                            t[51] = a;

                            if (!a) {
                              t[47] = 0;
                              break;
                            } else {
                              t[a + 28 >> 2] = 0;
                              break;
                            }
                          }
                        } while (0);

                        r = i[379] | 0;
                        b = r & 65535;
                        s[u + b >> 0] = s[765] | 0;
                        s[765] = 0;
                        c = t[59] | 0;
                        i[379] = r + 1 << 16 >> 16;
                        t[c + (b << 2) >> 2] = e;
                        b = 74;
                        break;
                      }

                    case 125:
                      {
                        e = i[379] | 0;

                        if (!(e << 16 >> 16)) {
                          b = 49;
                          break e;
                        }

                        r = e + -1 << 16 >> 16;
                        i[379] = r;
                        a = i[380] | 0;
                        if (e << 16 >> 16 != a << 16 >> 16) {
                          if (a << 16 >> 16 != -1 & (r & 65535) < (a & 65535)) {
                            b = 53;
                            break e;
                          } else {
                            b = 74;
                            break a;
                          }
                        } else {
                          c = t[58] | 0;
                          b = (i[377] | 0) + -1 << 16 >> 16;
                          i[377] = b;
                          i[380] = i[c + ((b & 65535) << 1) >> 1] | 0;
                          h();
                          b = 74;
                          break a;
                        }
                      }

                    case 39:
                      {
                        d(39);
                        b = 74;
                        break;
                      }

                    case 34:
                      {
                        d(34);
                        b = 74;
                        break;
                      }

                    case 47:
                      switch (i[e + 4 >> 1] | 0) {
                        case 47:
                          {
                            j();
                            break a;
                          }

                        case 42:
                          {
                            y(1);
                            break a;
                          }

                        default:
                          {
                            a = t[57] | 0;
                            r = i[a >> 1] | 0;

                            r: do {
                              if (!(U(r) | 0)) {
                                switch (r << 16 >> 16) {
                                  case 41:
                                    if (q(t[(t[59] | 0) + (f[379] << 2) >> 2] | 0) | 0) {
                                      b = 71;
                                      break r;
                                    } else {
                                      b = 68;
                                      break r;
                                    }

                                  case 125:
                                    break;

                                  default:
                                    {
                                      b = 68;
                                      break r;
                                    }
                                }

                                e = f[379] | 0;
                                if (!(p(t[(t[59] | 0) + (e << 2) >> 2] | 0) | 0) ? (s[u + e >> 0] | 0) == 0 : 0) b = 68;else b = 71;
                              } else switch (r << 16 >> 16) {
                                case 46:
                                  if (((i[a + -2 >> 1] | 0) + -48 & 65535) < 10) {
                                    b = 68;
                                    break r;
                                  } else {
                                    b = 71;
                                    break r;
                                  }

                                case 43:
                                  if ((i[a + -2 >> 1] | 0) == 43) {
                                    b = 68;
                                    break r;
                                  } else {
                                    b = 71;
                                    break r;
                                  }

                                case 45:
                                  if ((i[a + -2 >> 1] | 0) == 45) {
                                    b = 68;
                                    break r;
                                  } else {
                                    b = 71;
                                    break r;
                                  }

                                default:
                                  {
                                    b = 71;
                                    break r;
                                  }
                              }
                            } while (0);

                            r: do {
                              if ((b | 0) == 68) {
                                b = 0;

                                if (!(o(a) | 0)) {
                                  switch (r << 16 >> 16) {
                                    case 0:
                                      {
                                        b = 71;
                                        break r;
                                      }

                                    case 47:
                                      break;

                                    default:
                                      {
                                        e = 1;
                                        break r;
                                      }
                                  }

                                  if (!(s[764] | 0)) e = 1;else b = 71;
                                } else b = 71;
                              }
                            } while (0);

                            if ((b | 0) == 71) {
                              g();
                              e = 0;
                            }

                            s[764] = e;
                            b = 74;
                            break a;
                          }
                      }

                    case 96:
                      {
                        h();
                        b = 74;
                        break;
                      }

                    default:
                      b = 74;
                  }
                } while (0);

                if ((b | 0) == 74) {
                  b = 0;
                  t[57] = t[61];
                }

                e = t[61] | 0;
              }

              if ((b | 0) == 36) {
                L();
                e = 0;
                break;
              } else if ((b | 0) == 49) {
                L();
                e = 0;
                break;
              } else if ((b | 0) == 53) {
                L();
                e = 0;
                break;
              } else if ((b | 0) == 75) {
                e = (i[380] | 0) == -1 & (i[379] | 0) == 0 & (s[762] | 0) == 0 & (i[378] | 0) == 0;
                break;
              }
            }
          } while (0);

          n = v;
          return e | 0;
        }

        function k() {
          var e = 0,
              a = 0,
              r = 0,
              c = 0,
              f = 0,
              n = 0;
          f = t[61] | 0;
          n = f + 12 | 0;
          t[61] = n;
          a = w(1) | 0;
          e = t[61] | 0;
          if (!((e | 0) == (n | 0) ? !(I(a) | 0) : 0)) c = 3;

          e: do {
            if ((c | 0) == 3) {
              a: do {
                switch (a << 16 >> 16) {
                  case 100:
                    {
                      B(e, e + 14 | 0);
                      break e;
                    }

                  case 97:
                    {
                      t[61] = e + 10;
                      w(1) | 0;
                      e = t[61] | 0;
                      c = 6;
                      break;
                    }

                  case 102:
                    {
                      c = 6;
                      break;
                    }

                  case 99:
                    {
                      if ((m(e + 2 | 0, 36, 8) | 0) == 0 ? (r = e + 10 | 0, $(i[r >> 1] | 0) | 0) : 0) {
                        t[61] = r;
                        f = w(1) | 0;
                        n = t[61] | 0;
                        E(f) | 0;
                        B(n, t[61] | 0);
                        t[61] = (t[61] | 0) + -2;
                        break e;
                      }

                      e = e + 4 | 0;
                      t[61] = e;
                      c = 13;
                      break;
                    }

                  case 108:
                  case 118:
                    {
                      c = 13;
                      break;
                    }

                  case 123:
                    {
                      t[61] = e + 2;
                      e = w(1) | 0;
                      r = t[61] | 0;

                      while (1) {
                        if (N(e) | 0) {
                          d(e);
                          e = (t[61] | 0) + 2 | 0;
                          t[61] = e;
                        } else {
                          E(e) | 0;
                          e = t[61] | 0;
                        }

                        w(1) | 0;
                        e = C(r, e) | 0;

                        if (e << 16 >> 16 == 44) {
                          t[61] = (t[61] | 0) + 2;
                          e = w(1) | 0;
                        }

                        a = r;
                        r = t[61] | 0;

                        if (e << 16 >> 16 == 125) {
                          c = 32;
                          break;
                        }

                        if ((r | 0) == (a | 0)) {
                          c = 29;
                          break;
                        }

                        if (r >>> 0 > (t[62] | 0) >>> 0) {
                          c = 31;
                          break;
                        }
                      }

                      if ((c | 0) == 29) {
                        L();
                        break e;
                      } else if ((c | 0) == 31) {
                        L();
                        break e;
                      } else if ((c | 0) == 32) {
                        t[61] = r + 2;
                        c = 34;
                        break a;
                      }

                      break;
                    }

                  case 42:
                    {
                      t[61] = e + 2;
                      w(1) | 0;
                      c = t[61] | 0;
                      C(c, c) | 0;
                      c = 34;
                      break;
                    }

                  default:
                    {}
                }
              } while (0);

              if ((c | 0) == 6) {
                t[61] = e + 16;
                e = w(1) | 0;

                if (e << 16 >> 16 == 42) {
                  t[61] = (t[61] | 0) + 2;
                  e = w(1) | 0;
                }

                n = t[61] | 0;
                E(e) | 0;
                B(n, t[61] | 0);
                t[61] = (t[61] | 0) + -2;
                break;
              } else if ((c | 0) == 13) {
                e = e + 4 | 0;
                t[61] = e;
                s[763] = 0;

                a: while (1) {
                  t[61] = e + 2;
                  n = w(1) | 0;
                  e = t[61] | 0;

                  switch ((E(n) | 0) << 16 >> 16) {
                    case 91:
                    case 123:
                      {
                        c = 15;
                        break a;
                      }

                    default:
                      {}
                  }

                  a = t[61] | 0;
                  if ((a | 0) == (e | 0)) break e;
                  B(e, a);

                  switch ((w(1) | 0) << 16 >> 16) {
                    case 61:
                      {
                        c = 19;
                        break a;
                      }

                    case 44:
                      break;

                    default:
                      {
                        c = 20;
                        break a;
                      }
                  }

                  e = t[61] | 0;
                }

                if ((c | 0) == 15) {
                  t[61] = (t[61] | 0) + -2;
                  break;
                } else if ((c | 0) == 19) {
                  t[61] = (t[61] | 0) + -2;
                  break;
                } else if ((c | 0) == 20) {
                  t[61] = (t[61] | 0) + -2;
                  break;
                }
              } else if ((c | 0) == 34) a = w(1) | 0;

              e = t[61] | 0;

              if (a << 16 >> 16 == 102 ? (m(e + 2 | 0, 52, 6) | 0) == 0 : 0) {
                t[61] = e + 8;
                u(f, w(1) | 0);
                break;
              }

              t[61] = e + -2;
            }
          } while (0);

          return;
        }

        function l() {
          var e = 0,
              a = 0,
              r = 0,
              c = 0,
              f = 0;
          f = t[61] | 0;
          a = f + 12 | 0;
          t[61] = a;

          e: do {
            switch ((w(1) | 0) << 16 >> 16) {
              case 40:
                {
                  e = t[61] | 0;
                  a = t[59] | 0;
                  r = i[379] | 0;
                  i[379] = r + 1 << 16 >> 16;
                  t[a + ((r & 65535) << 2) >> 2] = e;

                  if ((i[t[57] >> 1] | 0) != 46) {
                    e = t[61] | 0;
                    t[61] = e + 2;
                    r = w(1) | 0;
                    v(f, t[61] | 0, 0, e);
                    e = t[51] | 0;
                    a = t[60] | 0;
                    f = i[378] | 0;
                    i[378] = f + 1 << 16 >> 16;
                    t[a + ((f & 65535) << 2) >> 2] = e;

                    switch (r << 16 >> 16) {
                      case 39:
                        {
                          d(39);
                          break;
                        }

                      case 34:
                        {
                          d(34);
                          break;
                        }

                      default:
                        {
                          t[61] = (t[61] | 0) + -2;
                          break e;
                        }
                    }

                    e = (t[61] | 0) + 2 | 0;
                    t[61] = e;

                    switch ((w(1) | 0) << 16 >> 16) {
                      case 44:
                        {
                          t[61] = (t[61] | 0) + 2;
                          w(1) | 0;
                          r = t[51] | 0;
                          t[r + 4 >> 2] = e;
                          f = t[61] | 0;
                          t[r + 16 >> 2] = f;
                          s[r + 24 >> 0] = 1;
                          t[61] = f + -2;
                          break e;
                        }

                      case 41:
                        {
                          i[379] = (i[379] | 0) + -1 << 16 >> 16;
                          f = t[51] | 0;
                          t[f + 4 >> 2] = e;
                          t[f + 12 >> 2] = (t[61] | 0) + 2;
                          s[f + 24 >> 0] = 1;
                          i[378] = (i[378] | 0) + -1 << 16 >> 16;
                          break e;
                        }

                      default:
                        {
                          t[61] = (t[61] | 0) + -2;
                          break e;
                        }
                    }
                  }

                  break;
                }

              case 46:
                {
                  t[61] = (t[61] | 0) + 2;
                  if (((w(1) | 0) << 16 >> 16 == 109 ? (e = t[61] | 0, (m(e + 2 | 0, 44, 6) | 0) == 0) : 0) ? (i[t[57] >> 1] | 0) != 46 : 0) v(f, f, e + 8 | 0, 2);
                  break;
                }

              case 42:
              case 39:
              case 34:
                {
                  c = 16;
                  break;
                }

              case 123:
                {
                  e = t[61] | 0;

                  if (i[379] | 0) {
                    t[61] = e + -2;
                    break e;
                  }

                  while (1) {
                    if (e >>> 0 >= (t[62] | 0) >>> 0) break;
                    e = w(1) | 0;

                    if (!(N(e) | 0)) {
                      if (e << 16 >> 16 == 125) {
                        c = 31;
                        break;
                      }
                    } else d(e);

                    e = (t[61] | 0) + 2 | 0;
                    t[61] = e;
                  }

                  if ((c | 0) == 31) t[61] = (t[61] | 0) + 2;
                  w(1) | 0;
                  e = t[61] | 0;

                  if (m(e, 50, 8) | 0) {
                    L();
                    break e;
                  }

                  t[61] = e + 8;
                  e = w(1) | 0;

                  if (N(e) | 0) {
                    u(f, e);
                    break e;
                  } else {
                    L();
                    break e;
                  }
                }

              default:
                if ((t[61] | 0) != (a | 0)) c = 16;
            }
          } while (0);

          do {
            if ((c | 0) == 16) {
              if (i[379] | 0) {
                t[61] = (t[61] | 0) + -2;
                break;
              }

              e = t[62] | 0;
              a = t[61] | 0;

              while (1) {
                if (a >>> 0 >= e >>> 0) {
                  c = 23;
                  break;
                }

                r = i[a >> 1] | 0;

                if (N(r) | 0) {
                  c = 21;
                  break;
                }

                c = a + 2 | 0;
                t[61] = c;
                a = c;
              }

              if ((c | 0) == 21) {
                u(f, r);
                break;
              } else if ((c | 0) == 23) {
                L();
                break;
              }
            }
          } while (0);

          return;
        }

        function u(e, a) {
          e = e | 0;
          a = a | 0;
          var r = 0,
              s = 0;
          r = (t[61] | 0) + 2 | 0;

          switch (a << 16 >> 16) {
            case 39:
              {
                d(39);
                s = 5;
                break;
              }

            case 34:
              {
                d(34);
                s = 5;
                break;
              }

            default:
              L();
          }

          do {
            if ((s | 0) == 5) {
              v(e, r, t[61] | 0, 1);
              t[61] = (t[61] | 0) + 2;
              s = (w(0) | 0) << 16 >> 16 == 97;
              a = t[61] | 0;

              if (s ? (m(a + 2 | 0, 58, 10) | 0) == 0 : 0) {
                t[61] = a + 12;

                if ((w(1) | 0) << 16 >> 16 != 123) {
                  t[61] = a;
                  break;
                }

                e = t[61] | 0;
                r = e;

                e: while (1) {
                  t[61] = r + 2;
                  r = w(1) | 0;

                  switch (r << 16 >> 16) {
                    case 39:
                      {
                        d(39);
                        t[61] = (t[61] | 0) + 2;
                        r = w(1) | 0;
                        break;
                      }

                    case 34:
                      {
                        d(34);
                        t[61] = (t[61] | 0) + 2;
                        r = w(1) | 0;
                        break;
                      }

                    default:
                      r = E(r) | 0;
                  }

                  if (r << 16 >> 16 != 58) {
                    s = 16;
                    break;
                  }

                  t[61] = (t[61] | 0) + 2;

                  switch ((w(1) | 0) << 16 >> 16) {
                    case 39:
                      {
                        d(39);
                        break;
                      }

                    case 34:
                      {
                        d(34);
                        break;
                      }

                    default:
                      {
                        s = 20;
                        break e;
                      }
                  }

                  t[61] = (t[61] | 0) + 2;

                  switch ((w(1) | 0) << 16 >> 16) {
                    case 125:
                      {
                        s = 25;
                        break e;
                      }

                    case 44:
                      break;

                    default:
                      {
                        s = 24;
                        break e;
                      }
                  }

                  t[61] = (t[61] | 0) + 2;

                  if ((w(1) | 0) << 16 >> 16 == 125) {
                    s = 25;
                    break;
                  }

                  r = t[61] | 0;
                }

                if ((s | 0) == 16) {
                  t[61] = a;
                  break;
                } else if ((s | 0) == 20) {
                  t[61] = a;
                  break;
                } else if ((s | 0) == 24) {
                  t[61] = a;
                  break;
                } else if ((s | 0) == 25) {
                  s = t[51] | 0;
                  t[s + 16 >> 2] = e;
                  t[s + 12 >> 2] = (t[61] | 0) + 2;
                  break;
                }
              }

              t[61] = a + -2;
            }
          } while (0);

          return;
        }

        function o(e) {
          e = e | 0;

          e: do {
            switch (i[e >> 1] | 0) {
              case 100:
                switch (i[e + -2 >> 1] | 0) {
                  case 105:
                    {
                      e = S(e + -4 | 0, 68, 2) | 0;
                      break e;
                    }

                  case 108:
                    {
                      e = S(e + -4 | 0, 72, 3) | 0;
                      break e;
                    }

                  default:
                    {
                      e = 0;
                      break e;
                    }
                }

              case 101:
                {
                  switch (i[e + -2 >> 1] | 0) {
                    case 115:
                      break;

                    case 116:
                      {
                        e = S(e + -4 | 0, 78, 4) | 0;
                        break e;
                      }

                    default:
                      {
                        e = 0;
                        break e;
                      }
                  }

                  switch (i[e + -4 >> 1] | 0) {
                    case 108:
                      {
                        e = O(e + -6 | 0, 101) | 0;
                        break e;
                      }

                    case 97:
                      {
                        e = O(e + -6 | 0, 99) | 0;
                        break e;
                      }

                    default:
                      {
                        e = 0;
                        break e;
                      }
                  }
                }

              case 102:
                {
                  if ((i[e + -2 >> 1] | 0) == 111 ? (i[e + -4 >> 1] | 0) == 101 : 0) switch (i[e + -6 >> 1] | 0) {
                    case 99:
                      {
                        e = S(e + -8 | 0, 86, 6) | 0;
                        break e;
                      }

                    case 112:
                      {
                        e = S(e + -8 | 0, 98, 2) | 0;
                        break e;
                      }

                    default:
                      {
                        e = 0;
                        break e;
                      }
                  } else e = 0;
                  break;
                }

              case 110:
                {
                  e = e + -2 | 0;
                  if (O(e, 105) | 0) e = 1;else e = S(e, 102, 5) | 0;
                  break;
                }

              case 111:
                {
                  e = O(e + -2 | 0, 100) | 0;
                  break;
                }

              case 114:
                {
                  e = S(e + -2 | 0, 112, 7) | 0;
                  break;
                }

              case 116:
                {
                  e = S(e + -2 | 0, 126, 4) | 0;
                  break;
                }

              case 119:
                switch (i[e + -2 >> 1] | 0) {
                  case 101:
                    {
                      e = O(e + -4 | 0, 110) | 0;
                      break e;
                    }

                  case 111:
                    {
                      e = S(e + -4 | 0, 134, 3) | 0;
                      break e;
                    }

                  default:
                    {
                      e = 0;
                      break e;
                    }
                }

              default:
                e = 0;
            }
          } while (0);

          return e | 0;
        }

        function h() {
          var e = 0,
              a = 0,
              r = 0;
          a = t[62] | 0;
          r = t[61] | 0;

          e: while (1) {
            e = r + 2 | 0;

            if (r >>> 0 >= a >>> 0) {
              a = 8;
              break;
            }

            switch (i[e >> 1] | 0) {
              case 96:
                {
                  a = 9;
                  break e;
                }

              case 36:
                {
                  if ((i[r + 4 >> 1] | 0) == 123) {
                    a = 6;
                    break e;
                  }

                  break;
                }

              case 92:
                {
                  e = r + 4 | 0;
                  break;
                }

              default:
                {}
            }

            r = e;
          }

          if ((a | 0) == 6) {
            t[61] = r + 4;
            e = i[380] | 0;
            a = t[58] | 0;
            r = i[377] | 0;
            i[377] = r + 1 << 16 >> 16;
            i[a + ((r & 65535) << 1) >> 1] = e;
            r = (i[379] | 0) + 1 << 16 >> 16;
            i[379] = r;
            i[380] = r;
          } else if ((a | 0) == 8) {
            t[61] = e;
            L();
          } else if ((a | 0) == 9) t[61] = e;

          return;
        }

        function w(e) {
          e = e | 0;
          var a = 0,
              r = 0,
              s = 0;
          r = t[61] | 0;

          e: do {
            a = i[r >> 1] | 0;

            a: do {
              if (a << 16 >> 16 != 47) {
                if (e) {
                  if (M(a) | 0) break;else break e;
                } else if (z(a) | 0) break;else break e;
              } else switch (i[r + 2 >> 1] | 0) {
                case 47:
                  {
                    j();
                    break a;
                  }

                case 42:
                  {
                    y(e);
                    break a;
                  }

                default:
                  {
                    a = 47;
                    break e;
                  }
              }
            } while (0);

            s = t[61] | 0;
            r = s + 2 | 0;
            t[61] = r;
          } while (s >>> 0 < (t[62] | 0) >>> 0);

          return a | 0;
        }

        function d(e) {
          e = e | 0;
          var a = 0,
              r = 0,
              s = 0,
              c = 0;
          c = t[62] | 0;
          a = t[61] | 0;

          while (1) {
            s = a + 2 | 0;

            if (a >>> 0 >= c >>> 0) {
              a = 9;
              break;
            }

            r = i[s >> 1] | 0;

            if (r << 16 >> 16 == e << 16 >> 16) {
              a = 10;
              break;
            }

            if (r << 16 >> 16 == 92) {
              r = a + 4 | 0;

              if ((i[r >> 1] | 0) == 13) {
                a = a + 6 | 0;
                a = (i[a >> 1] | 0) == 10 ? a : r;
              } else a = r;
            } else if (T(r) | 0) {
              a = 9;
              break;
            } else a = s;
          }

          if ((a | 0) == 9) {
            t[61] = s;
            L();
          } else if ((a | 0) == 10) t[61] = s;

          return;
        }

        function v(e, a, r, i) {
          e = e | 0;
          a = a | 0;
          r = r | 0;
          i = i | 0;
          var c = 0,
              f = 0;
          c = t[55] | 0;
          t[55] = c + 32;
          f = t[51] | 0;
          t[((f | 0) == 0 ? 188 : f + 28 | 0) >> 2] = c;
          t[52] = f;
          t[51] = c;
          t[c + 8 >> 2] = e;
          if (2 == (i | 0)) e = r;else e = 1 == (i | 0) ? r + 2 | 0 : 0;
          t[c + 12 >> 2] = e;
          t[c >> 2] = a;
          t[c + 4 >> 2] = r;
          t[c + 16 >> 2] = 0;
          t[c + 20 >> 2] = i;
          s[c + 24 >> 0] = 1 == (i | 0) & 1;
          t[c + 28 >> 2] = 0;
          return;
        }

        function A() {
          var e = 0,
              a = 0,
              r = 0;
          r = t[62] | 0;
          a = t[61] | 0;

          e: while (1) {
            e = a + 2 | 0;

            if (a >>> 0 >= r >>> 0) {
              a = 6;
              break;
            }

            switch (i[e >> 1] | 0) {
              case 13:
              case 10:
                {
                  a = 6;
                  break e;
                }

              case 93:
                {
                  a = 7;
                  break e;
                }

              case 92:
                {
                  e = a + 4 | 0;
                  break;
                }

              default:
                {}
            }

            a = e;
          }

          if ((a | 0) == 6) {
            t[61] = e;
            L();
            e = 0;
          } else if ((a | 0) == 7) {
            t[61] = e;
            e = 93;
          }

          return e | 0;
        }

        function C(e, a) {
          e = e | 0;
          a = a | 0;
          var r = 0,
              s = 0;
          r = t[61] | 0;
          s = i[r >> 1] | 0;

          if (s << 16 >> 16 == 97) {
            t[61] = r + 4;
            r = w(1) | 0;
            e = t[61] | 0;

            if (N(r) | 0) {
              d(r);
              a = (t[61] | 0) + 2 | 0;
              t[61] = a;
            } else {
              E(r) | 0;
              a = t[61] | 0;
            }

            s = w(1) | 0;
            r = t[61] | 0;
          }

          if ((r | 0) != (e | 0)) B(e, a);
          return s | 0;
        }

        function g() {
          var e = 0,
              a = 0,
              r = 0;

          e: while (1) {
            e = t[61] | 0;
            a = e + 2 | 0;
            t[61] = a;

            if (e >>> 0 >= (t[62] | 0) >>> 0) {
              r = 7;
              break;
            }

            switch (i[a >> 1] | 0) {
              case 13:
              case 10:
                {
                  r = 7;
                  break e;
                }

              case 47:
                break e;

              case 91:
                {
                  A() | 0;
                  break;
                }

              case 92:
                {
                  t[61] = e + 4;
                  break;
                }

              default:
                {}
            }
          }

          if ((r | 0) == 7) L();
          return;
        }

        function p(e) {
          e = e | 0;

          switch (i[e >> 1] | 0) {
            case 62:
              {
                e = (i[e + -2 >> 1] | 0) == 61;
                break;
              }

            case 41:
            case 59:
              {
                e = 1;
                break;
              }

            case 104:
              {
                e = S(e + -2 | 0, 160, 4) | 0;
                break;
              }

            case 121:
              {
                e = S(e + -2 | 0, 168, 6) | 0;
                break;
              }

            case 101:
              {
                e = S(e + -2 | 0, 180, 3) | 0;
                break;
              }

            default:
              e = 0;
          }

          return e | 0;
        }

        function y(e) {
          e = e | 0;
          var a = 0,
              r = 0,
              s = 0,
              c = 0,
              f = 0;
          c = (t[61] | 0) + 2 | 0;
          t[61] = c;
          r = t[62] | 0;

          while (1) {
            a = c + 2 | 0;
            if (c >>> 0 >= r >>> 0) break;
            s = i[a >> 1] | 0;
            if (!e ? T(s) | 0 : 0) break;

            if (s << 16 >> 16 == 42 ? (i[c + 4 >> 1] | 0) == 47 : 0) {
              f = 8;
              break;
            }

            c = a;
          }

          if ((f | 0) == 8) {
            t[61] = a;
            a = c + 4 | 0;
          }

          t[61] = a;
          return;
        }

        function m(e, a, r) {
          e = e | 0;
          a = a | 0;
          r = r | 0;
          var i = 0,
              t = 0;

          e: do {
            if (!r) e = 0;else {
              while (1) {
                i = s[e >> 0] | 0;
                t = s[a >> 0] | 0;
                if (i << 24 >> 24 != t << 24 >> 24) break;
                r = r + -1 | 0;

                if (!r) {
                  e = 0;
                  break e;
                } else {
                  e = e + 1 | 0;
                  a = a + 1 | 0;
                }
              }

              e = (i & 255) - (t & 255) | 0;
            }
          } while (0);

          return e | 0;
        }

        function I(e) {
          e = e | 0;

          e: do {
            switch (e << 16 >> 16) {
              case 38:
              case 37:
              case 33:
                {
                  e = 1;
                  break;
                }

              default:
                if ((e & -8) << 16 >> 16 == 40 | (e + -58 & 65535) < 6) e = 1;else {
                  switch (e << 16 >> 16) {
                    case 91:
                    case 93:
                    case 94:
                      {
                        e = 1;
                        break e;
                      }

                    default:
                      {}
                  }

                  e = (e + -123 & 65535) < 4;
                }
            }
          } while (0);

          return e | 0;
        }

        function U(e) {
          e = e | 0;

          e: do {
            switch (e << 16 >> 16) {
              case 38:
              case 37:
              case 33:
                break;

              default:
                if (!((e + -58 & 65535) < 6 | (e + -40 & 65535) < 7 & e << 16 >> 16 != 41)) {
                  switch (e << 16 >> 16) {
                    case 91:
                    case 94:
                      break e;

                    default:
                      {}
                  }

                  return e << 16 >> 16 != 125 & (e + -123 & 65535) < 4 | 0;
                }

            }
          } while (0);

          return 1;
        }

        function x(e) {
          e = e | 0;
          var a = 0,
              r = 0,
              s = 0,
              c = 0;
          r = n;
          n = n + 16 | 0;
          s = r;
          t[s >> 2] = 0;
          t[54] = e;
          a = t[3] | 0;
          c = a + (e << 1) | 0;
          e = c + 2 | 0;
          i[c >> 1] = 0;
          t[s >> 2] = e;
          t[55] = e;
          t[47] = 0;
          t[51] = 0;
          t[49] = 0;
          t[48] = 0;
          t[53] = 0;
          t[50] = 0;
          n = r;
          return a | 0;
        }

        function S(e, a, r) {
          e = e | 0;
          a = a | 0;
          r = r | 0;
          var s = 0,
              c = 0;
          s = e + (0 - r << 1) | 0;
          c = s + 2 | 0;
          e = t[3] | 0;
          if (c >>> 0 >= e >>> 0 ? (m(c, a, r << 1) | 0) == 0 : 0) {
            if ((c | 0) == (e | 0)) e = 1;else e = $(i[s >> 1] | 0) | 0;
          } else e = 0;
          return e | 0;
        }

        function O(e, a) {
          e = e | 0;
          a = a | 0;
          var r = 0;
          r = t[3] | 0;
          if (r >>> 0 <= e >>> 0 ? (i[e >> 1] | 0) == a << 16 >> 16 : 0) {
            if ((r | 0) == (e | 0)) r = 1;else r = $(i[e + -2 >> 1] | 0) | 0;
          } else r = 0;
          return r | 0;
        }

        function $(e) {
          e = e | 0;

          e: do {
            if ((e + -9 & 65535) < 5) e = 1;else {
              switch (e << 16 >> 16) {
                case 32:
                case 160:
                  {
                    e = 1;
                    break e;
                  }

                default:
                  {}
              }

              e = e << 16 >> 16 != 46 & (I(e) | 0);
            }
          } while (0);

          return e | 0;
        }

        function j() {
          var e = 0,
              a = 0,
              r = 0;
          e = t[62] | 0;
          r = t[61] | 0;

          e: while (1) {
            a = r + 2 | 0;
            if (r >>> 0 >= e >>> 0) break;

            switch (i[a >> 1] | 0) {
              case 13:
              case 10:
                break e;

              default:
                r = a;
            }
          }

          t[61] = a;
          return;
        }

        function B(e, a) {
          e = e | 0;
          a = a | 0;
          var r = 0,
              s = 0;
          r = t[55] | 0;
          t[55] = r + 12;
          s = t[53] | 0;
          t[((s | 0) == 0 ? 192 : s + 8 | 0) >> 2] = r;
          t[53] = r;
          t[r >> 2] = e;
          t[r + 4 >> 2] = a;
          t[r + 8 >> 2] = 0;
          return;
        }

        function E(e) {
          e = e | 0;

          while (1) {
            if (M(e) | 0) break;
            if (I(e) | 0) break;
            e = (t[61] | 0) + 2 | 0;
            t[61] = e;
            e = i[e >> 1] | 0;

            if (!(e << 16 >> 16)) {
              e = 0;
              break;
            }
          }

          return e | 0;
        }

        function P() {
          var e = 0;
          e = t[(t[49] | 0) + 20 >> 2] | 0;

          switch (e | 0) {
            case 1:
              {
                e = -1;
                break;
              }

            case 2:
              {
                e = -2;
                break;
              }

            default:
              e = e - (t[3] | 0) >> 1;
          }

          return e | 0;
        }

        function q(e) {
          e = e | 0;
          if (!(S(e, 140, 5) | 0) ? !(S(e, 150, 3) | 0) : 0) e = S(e, 156, 2) | 0;else e = 1;
          return e | 0;
        }

        function z(e) {
          e = e | 0;

          switch (e << 16 >> 16) {
            case 160:
            case 32:
            case 12:
            case 11:
            case 9:
              {
                e = 1;
                break;
              }

            default:
              e = 0;
          }

          return e | 0;
        }

        function D(e) {
          e = e | 0;
          if ((t[3] | 0) == (e | 0)) e = 1;else e = $(i[e + -2 >> 1] | 0) | 0;
          return e | 0;
        }

        function F() {
          var e = 0;
          e = t[(t[49] | 0) + 12 >> 2] | 0;
          if (!e) e = -1;else e = e - (t[3] | 0) >> 1;
          return e | 0;
        }

        function G() {
          var e = 0;
          e = t[(t[49] | 0) + 16 >> 2] | 0;
          if (!e) e = -1;else e = e - (t[3] | 0) >> 1;
          return e | 0;
        }

        function H() {
          var e = 0;
          e = t[(t[49] | 0) + 4 >> 2] | 0;
          if (!e) e = -1;else e = e - (t[3] | 0) >> 1;
          return e | 0;
        }

        function J() {
          var e = 0;
          e = t[49] | 0;
          e = t[((e | 0) == 0 ? 188 : e + 28 | 0) >> 2] | 0;
          t[49] = e;
          return (e | 0) != 0 | 0;
        }

        function K() {
          var e = 0;
          e = t[50] | 0;
          e = t[((e | 0) == 0 ? 192 : e + 8 | 0) >> 2] | 0;
          t[50] = e;
          return (e | 0) != 0 | 0;
        }

        function L() {
          s[762] = 1;
          t[56] = (t[61] | 0) - (t[3] | 0) >> 1;
          t[61] = (t[62] | 0) + 2;
          return;
        }

        function M(e) {
          e = e | 0;
          return (e | 128) << 16 >> 16 == 160 | (e + -9 & 65535) < 5 | 0;
        }

        function N(e) {
          e = e | 0;
          return e << 16 >> 16 == 39 | e << 16 >> 16 == 34 | 0;
        }

        function Q() {
          return (t[(t[49] | 0) + 8 >> 2] | 0) - (t[3] | 0) >> 1 | 0;
        }

        function R() {
          return (t[(t[50] | 0) + 4 >> 2] | 0) - (t[3] | 0) >> 1 | 0;
        }

        function T(e) {
          e = e | 0;
          return e << 16 >> 16 == 13 | e << 16 >> 16 == 10 | 0;
        }

        function V() {
          return (t[t[49] >> 2] | 0) - (t[3] | 0) >> 1 | 0;
        }

        function W() {
          return (t[t[50] >> 2] | 0) - (t[3] | 0) >> 1 | 0;
        }

        function X() {
          return c[(t[49] | 0) + 24 >> 0] | 0 | 0;
        }

        function Y(e) {
          e = e | 0;
          t[3] = e;
          return;
        }

        function Z() {
          return (s[763] | 0) != 0 | 0;
        }

        function _() {
          return t[56] | 0;
        }

        function ee(e) {
          e = e | 0;
          n = e + 992 + 15 & -16;
          return 992;
        }

        return {
          su: ee,
          ai: G,
          e: _,
          ee: R,
          es: W,
          f: Z,
          id: P,
          ie: H,
          ip: X,
          is: V,
          p: b,
          re: K,
          ri: J,
          sa: x,
          se: F,
          ses: Y,
          ss: Q
        };
      }("undefined" != typeof self ? self : commonjsGlobal, {}, a), r = e.su(2 * c$1.length + (2 << 17));
    }

    const h = c$1.length + 1;
    e.ses(r), e.sa(h - 1), i(c$1, new Uint16Array(a, r, h)), e.p() || (n = e.e(), o());
    const w = [],
          d = [];

    for (; e.ri();) {
      const a = e.is(),
            r = e.ie(),
            s = e.ai(),
            i = e.id(),
            t = e.ss(),
            f = e.se();
      let n;
      e.ip() && (n = b(-1 === i ? a : a + 1, c$1.charCodeAt(-1 === i ? a - 1 : a))), w.push({
        n: n,
        s: a,
        e: r,
        ss: t,
        se: f,
        d: i,
        a: s
      });
    }

    for (; e.re();) {
      const a = e.es(),
            r = c$1.charCodeAt(a);
      d.push(34 === r || 39 === r ? b(a + 1, r) : c$1.slice(e.es(), e.ee()));
    }

    return [w, d, !!e.f()];
  }

  function b(e, a) {
    n = e;
    let r = "",
        s = n;

    for (;;) {
      n >= c$1.length && o();
      const e = c$1.charCodeAt(n);
      if (e === a) break;
      92 === e ? (r += c$1.slice(s, n), r += k(), s = n) : (8232 === e || 8233 === e || u(e) && o(), ++n);
    }

    return r += c$1.slice(s, n++), r;
  }

  function k() {
    let e = c$1.charCodeAt(++n);

    switch (++n, e) {
      case 110:
        return "\n";

      case 114:
        return "\r";

      case 120:
        return String.fromCharCode(l(2));

      case 117:
        return function () {
          let e;
          123 === c$1.charCodeAt(n) ? (++n, e = l(c$1.indexOf("}", n) - n), ++n, e > 1114111 && o()) : e = l(4);
          return e <= 65535 ? String.fromCharCode(e) : (e -= 65536, String.fromCharCode(55296 + (e >> 10), 56320 + (1023 & e)));
        }();

      case 116:
        return "\t";

      case 98:
        return "\b";

      case 118:
        return "\v";

      case 102:
        return "\f";

      case 13:
        10 === c$1.charCodeAt(n) && ++n;

      case 10:
        return "";

      case 56:
      case 57:
        o();

      default:
        if (e >= 48 && e <= 55) {
          let a = c$1.substr(n - 1, 3).match(/^[0-7]+/)[0],
              r = parseInt(a, 8);
          return r > 255 && (a = a.slice(0, -1), r = parseInt(a, 8)), n += a.length - 1, e = c$1.charCodeAt(n), "0" === a && 56 !== e && 57 !== e || o(), String.fromCharCode(r);
        }

        return u(e) ? "" : String.fromCharCode(e);
    }
  }

  function l(e) {
    const a = n;
    let r = 0,
        s = 0;

    for (let a = 0; a < e; ++a, ++n) {
      let e,
          i = c$1.charCodeAt(n);

      if (95 !== i) {
        if (i >= 97) e = i - 97 + 10;else if (i >= 65) e = i - 65 + 10;else {
          if (!(i >= 48 && i <= 57)) break;
          e = i - 48;
        }
        if (e >= 16) break;
        s = i, r = 16 * r + e;
      } else 95 !== s && 0 !== a || o(), s = i;
    }

    return 95 !== s && n - a === e || o(), r;
  }

  function u(e) {
    return 13 === e || 10 === e;
  }

  function o() {
    throw Object.assign(Error(`Parse error ${f}:${c$1.slice(0, n).split("\n").length}:${n - c$1.lastIndexOf("\n", n - 1)}`), {
      idx: n
    });
  }

  async function _resolve(id, parentUrl) {
    const urlResolved = resolveIfNotPlainOrUrl(id, parentUrl);
    return {
      r: resolveImportMap(importMap, urlResolved || id, parentUrl) || throwUnresolved(id, parentUrl),
      // b = bare specifier
      b: !urlResolved && !isURL(id)
    };
  }

  const resolve = resolveHook ? async (id, parentUrl) => {
    let result = resolveHook(id, parentUrl, defaultResolve); // will be deprecated in next major

    if (result && result.then) result = await result;
    return result ? {
      r: result,
      b: !resolveIfNotPlainOrUrl(id, parentUrl) && !isURL(id)
    } : _resolve(id, parentUrl);
  } : _resolve; // importShim('mod');
  // importShim('mod', { opts });
  // importShim('mod', { opts }, parentUrl);
  // importShim('mod', parentUrl);

  async function importShim(id, ...args) {
    // parentUrl if present will be the last argument
    let parentUrl = args[args.length - 1];
    if (typeof parentUrl !== 'string') parentUrl = baseUrl; // needed for shim check

    await initPromise;
    if (importHook) await importHook(id, typeof args[1] !== 'string' ? args[1] : {}, parentUrl);

    if (acceptingImportMaps || shimMode || !baselinePassthrough) {
      processImportMaps();
      if (!shimMode) acceptingImportMaps = false;
    }

    await importMapPromise;
    return topLevelLoad((await resolve(id, parentUrl)).r, {
      credentials: 'same-origin'
    });
  }

  self.importShim = importShim;

  function defaultResolve(id, parentUrl) {
    return resolveImportMap(importMap, resolveIfNotPlainOrUrl(id, parentUrl) || id, parentUrl) || throwUnresolved(id, parentUrl);
  }

  function throwUnresolved(id, parentUrl) {
    throw Error(`Unable to resolve specifier '${id}'${fromParent(parentUrl)}`);
  }

  const resolveSync = (id, parentUrl = baseUrl) => {
    parentUrl = `${parentUrl}`;
    const result = resolveHook && resolveHook(id, parentUrl, defaultResolve);
    return result && !result.then ? result : defaultResolve(id, parentUrl);
  };

  function metaResolve(id, parentUrl = this.url) {
    return resolveSync(id, parentUrl);
  }

  importShim.resolve = resolveSync;

  importShim.getImportMap = () => JSON.parse(JSON.stringify(importMap));

  const registry = importShim._r = {};

  async function loadAll(load, seen) {
    if (load.b || seen[load.u]) return;
    seen[load.u] = 1;
    await load.L;
    await Promise.all(load.d.map(dep => loadAll(dep, seen)));
    if (!load.n) load.n = load.d.some(dep => dep.n);
  }

  let importMap = {
    imports: {},
    scopes: {}
  };
  let importMapSrcOrLazy = false;
  let baselinePassthrough;
  const initPromise = featureDetectionPromise.then(() => {
    // shim mode is determined on initialization, no late shim mode
    if (!shimMode) {
      if (document.querySelectorAll('script[type=module-shim],script[type=importmap-shim],link[rel=modulepreload-shim]').length) {
        setShimMode();
      } else {
        let seenScript = false;

        for (const script of document.querySelectorAll('script[type=module],script[type=importmap]')) {
          if (!seenScript) {
            if (script.type === 'module') seenScript = true;
          } else if (script.type === 'importmap') {
            importMapSrcOrLazy = true;
            break;
          }
        }
      }
    }

    baselinePassthrough = esmsInitOptions.polyfillEnable !== true && supportsDynamicImport && supportsImportMeta && supportsImportMaps && (!jsonModulesEnabled || supportsJsonAssertions) && (!cssModulesEnabled || supportsCssAssertions) && !importMapSrcOrLazy && !false;

    if (shimMode || !baselinePassthrough) {
      new MutationObserver(mutations => {
        for (const mutation of mutations) {
          if (mutation.type !== 'childList') continue;

          for (const node of mutation.addedNodes) {
            if (node.tagName === 'SCRIPT') {
              if (node.type === (shimMode ? 'module-shim' : 'module')) processScript(node);
              if (node.type === (shimMode ? 'importmap-shim' : 'importmap')) processImportMap(node);
            } else if (node.tagName === 'LINK' && node.rel === (shimMode ? 'modulepreload-shim' : 'modulepreload')) processPreload(node);
          }
        }
      }).observe(document, {
        childList: true,
        subtree: true
      });
      processImportMaps();
      processScriptsAndPreloads();
      return undefined;
    }
  });
  let importMapPromise = initPromise;
  let firstPolyfillLoad = true;
  let acceptingImportMaps = true;

  async function topLevelLoad(url, fetchOpts, source, nativelyLoaded, lastStaticLoadPromise) {
    if (!shimMode) acceptingImportMaps = false;
    await importMapPromise;
    if (importHook) await importHook(id, typeof args[1] !== 'string' ? args[1] : {}, parentUrl); // early analysis opt-out - no need to even fetch if we have feature support

    if (!shimMode && baselinePassthrough) {
      // for polyfill case, only dynamic import needs a return value here, and dynamic import will never pass nativelyLoaded
      if (nativelyLoaded) return null;
      await lastStaticLoadPromise;
      return dynamicImport(source ? createBlob(source) : url, {
        errUrl: url || source
      });
    }

    const load = getOrCreateLoad(url, fetchOpts, null, source);
    const seen = {};
    await loadAll(load, seen);
    lastLoad = undefined;
    resolveDeps(load, seen);
    await lastStaticLoadPromise;

    if (source && !shimMode && !load.n && !false) {
      const module = await dynamicImport(createBlob(source), {
        errUrl: source
      });
      if (revokeBlobURLs) revokeObjectURLs(Object.keys(seen));
      return module;
    }

    if (firstPolyfillLoad && !shimMode && load.n && nativelyLoaded) {
      onpolyfill();
      firstPolyfillLoad = false;
    }

    const module = await dynamicImport(!shimMode && !load.n && nativelyLoaded ? load.u : load.b, {
      errUrl: load.u
    }); // if the top-level load is a shell, run its update function

    if (load.s) (await dynamicImport(load.s)).u$_(module);
    if (revokeBlobURLs) revokeObjectURLs(Object.keys(seen)); // when tla is supported, this should return the tla promise as an actual handle
    // so readystate can still correspond to the sync subgraph exec completions

    return module;
  }

  function revokeObjectURLs(registryKeys) {
    let batch = 0;
    const keysLength = registryKeys.length;
    const schedule = self.requestIdleCallback ? self.requestIdleCallback : self.requestAnimationFrame;
    schedule(cleanup);

    function cleanup() {
      const batchStartIndex = batch * 100;
      if (batchStartIndex > keysLength) return;

      for (const key of registryKeys.slice(batchStartIndex, batchStartIndex + 100)) {
        const load = registry[key];
        if (load) URL.revokeObjectURL(load.b);
      }

      batch++;
      schedule(cleanup);
    }
  }

  function urlJsString(url) {
    return `'${url.replace(/'/g, "\\'")}'`;
  }

  let lastLoad;

  function resolveDeps(load, seen) {
    if (load.b || !seen[load.u]) return;
    seen[load.u] = 0;

    for (const dep of load.d) resolveDeps(dep, seen);

    const [imports] = load.a; // "execution"

    const source = load.S; // edge doesnt execute sibling in order, so we fix this up by ensuring all previous executions are explicit dependencies

    let resolvedSource = edge && lastLoad ? `import '${lastLoad}';` : '';

    if (!imports.length) {
      resolvedSource += source;
    } else {
      // once all deps have loaded we can inline the dependency resolution blobs
      // and define this blob
      let lastIndex = 0,
          depIndex = 0,
          dynamicImportEndStack = [];

      function pushStringTo(originalIndex) {
        while (dynamicImportEndStack[dynamicImportEndStack.length - 1] < originalIndex) {
          const dynamicImportEnd = dynamicImportEndStack.pop();
          resolvedSource += `${source.slice(lastIndex, dynamicImportEnd)}, ${urlJsString(load.r)}`;
          lastIndex = dynamicImportEnd;
        }

        resolvedSource += source.slice(lastIndex, originalIndex);
        lastIndex = originalIndex;
      }

      for (const {
        s: start,
        ss: statementStart,
        se: statementEnd,
        d: dynamicImportIndex
      } of imports) {
        // dependency source replacements
        if (dynamicImportIndex === -1) {
          let depLoad = load.d[depIndex++],
              blobUrl = depLoad.b,
              cycleShell = !blobUrl;

          if (cycleShell) {
            // circular shell creation
            if (!(blobUrl = depLoad.s)) {
              blobUrl = depLoad.s = createBlob(`export function u$_(m){${depLoad.a[1].map(name => name === 'default' ? `d$_=m.default` : `${name}=m.${name}`).join(',')}}${depLoad.a[1].map(name => name === 'default' ? `let d$_;export{d$_ as default}` : `export let ${name}`).join(';')}\n//# sourceURL=${depLoad.r}?cycle`);
            }
          }

          pushStringTo(start - 1);
          resolvedSource += `/*${source.slice(start - 1, statementEnd)}*/${urlJsString(blobUrl)}`; // circular shell execution

          if (!cycleShell && depLoad.s) {
            resolvedSource += `;import*as m$_${depIndex} from'${depLoad.b}';import{u$_ as u$_${depIndex}}from'${depLoad.s}';u$_${depIndex}(m$_${depIndex})`;
            depLoad.s = undefined;
          }

          lastIndex = statementEnd;
        } // import.meta
        else if (dynamicImportIndex === -2) {
          load.m = {
            url: load.r,
            resolve: metaResolve
          };
          metaHook(load.m, load.u);
          pushStringTo(start);
          resolvedSource += `importShim._r[${urlJsString(load.u)}].m`;
          lastIndex = statementEnd;
        } // dynamic import
        else {
          pushStringTo(statementStart + 6);
          resolvedSource += `Shim(`;
          dynamicImportEndStack.push(statementEnd - 1);
          lastIndex = start;
        }
      }

      pushStringTo(source.length);
    }

    let hasSourceURL = false;
    resolvedSource = resolvedSource.replace(sourceMapURLRegEx, (match, isMapping, url) => (hasSourceURL = !isMapping, match.replace(url, () => new URL(url, load.r))));
    if (!hasSourceURL) resolvedSource += '\n//# sourceURL=' + load.r;
    load.b = lastLoad = createBlob(resolvedSource);
    load.S = undefined;
  } // ; and // trailer support added for Ruby on Rails 7 source maps compatibility
  // https://github.com/guybedford/es-module-shims/issues/228


  const sourceMapURLRegEx = /\n\/\/# source(Mapping)?URL=([^\n]+)\s*((;|\/\/[^#][^\n]*)\s*)*$/;
  const jsContentType = /^(text|application)\/(x-)?javascript(;|$)/;
  const jsonContentType = /^(text|application)\/json(;|$)/;
  const cssContentType = /^(text|application)\/css(;|$)/;
  const cssUrlRegEx = /url\(\s*(?:(["'])((?:\\.|[^\n\\"'])+)\1|((?:\\.|[^\s,"'()\\])+))\s*\)/g; // restrict in-flight fetches to a pool of 100

  let p = [];
  let c = 0;

  function pushFetchPool() {
    if (++c > 100) return new Promise(r => p.push(r));
  }

  function popFetchPool() {
    c--;
    if (p.length) p.shift()();
  }

  async function doFetch(url, fetchOpts, parent) {
    if (enforceIntegrity && !fetchOpts.integrity) throw Error(`No integrity for ${url}${fromParent(parent)}.`);
    const poolQueue = pushFetchPool();
    if (poolQueue) await poolQueue;

    try {
      var res = await fetchHook(url, fetchOpts);
    } catch (e) {
      e.message = `Unable to fetch ${url}${fromParent(parent)} - see network log for details.\n` + e.message;
      throw e;
    } finally {
      popFetchPool();
    }

    if (!res.ok) throw Error(`${res.status} ${res.statusText} ${res.url}${fromParent(parent)}`);
    return res;
  }

  async function fetchModule(url, fetchOpts, parent) {
    const res = await doFetch(url, fetchOpts, parent);
    const contentType = res.headers.get('content-type');
    if (jsContentType.test(contentType)) return {
      r: res.url,
      s: await res.text(),
      t: 'js'
    };else if (jsonContentType.test(contentType)) return {
      r: res.url,
      s: `export default ${await res.text()}`,
      t: 'json'
    };else if (cssContentType.test(contentType)) {
      return {
        r: res.url,
        s: `var s=new CSSStyleSheet();s.replaceSync(${JSON.stringify((await res.text()).replace(cssUrlRegEx, (_match, quotes = '', relUrl1, relUrl2) => `url(${quotes}${resolveUrl(relUrl1 || relUrl2, url)}${quotes})`))});export default s;`,
        t: 'css'
      };
    } else throw Error(`Unsupported Content-Type "${contentType}" loading ${url}${fromParent(parent)}. Modules must be served with a valid MIME type like application/javascript.`);
  }

  function getOrCreateLoad(url, fetchOpts, parent, source) {
    let load = registry[url];
    if (load && !source) return load;
    load = {
      // url
      u: url,
      // response url
      r: source ? url : undefined,
      // fetchPromise
      f: undefined,
      // source
      S: undefined,
      // linkPromise
      L: undefined,
      // analysis
      a: undefined,
      // deps
      d: undefined,
      // blobUrl
      b: undefined,
      // shellUrl
      s: undefined,
      // needsShim
      n: false,
      // type
      t: null,
      // meta
      m: null
    };

    if (registry[url]) {
      let i = 0;

      while (registry[load.u + ++i]);

      load.u += i;
    }

    registry[load.u] = load;

    load.f = (async () => {
      if (!source) {
        // preload fetch options override fetch options (race)
        let t;
        ({
          r: load.r,
          s: source,
          t
        } = await (fetchCache[url] || fetchModule(url, fetchOpts, parent)));

        if (t && !shimMode) {
          if (t === 'css' && !cssModulesEnabled || t === 'json' && !jsonModulesEnabled) throw Error(`${t}-modules require <script type="esms-options">{ "polyfillEnable": ["${t}-modules"] }<${''}/script>`);
          if (t === 'css' && !supportsCssAssertions || t === 'json' && !supportsJsonAssertions) load.n = true;
        }
      }

      try {
        load.a = parse(source, load.u);
      } catch (e) {
        throwError(e);
        load.a = [[], [], false];
      }

      load.S = source;
      return load;
    })();

    load.L = load.f.then(async () => {
      let childFetchOpts = fetchOpts;
      load.d = (await Promise.all(load.a[0].map(async ({
        n,
        d
      }) => {
        if (d >= 0 && !supportsDynamicImport || d === 2 && !supportsImportMeta) load.n = true;
        if (!n) return;
        const {
          r,
          b
        } = await resolve(n, load.r || load.u);
        if (b && (!supportsImportMaps || importMapSrcOrLazy)) load.n = true;
        if (d !== -1) return;
        if (skip && skip.test(r)) return {
          b: r
        };
        if (childFetchOpts.integrity) childFetchOpts = Object.assign({}, childFetchOpts, {
          integrity: undefined
        });
        return getOrCreateLoad(r, childFetchOpts, load.r).f;
      }))).filter(l => l);
    });
    return load;
  }

  function processScriptsAndPreloads() {
    for (const script of document.querySelectorAll(shimMode ? 'script[type=module-shim]' : 'script[type=module]')) processScript(script);

    for (const link of document.querySelectorAll(shimMode ? 'link[rel=modulepreload-shim]' : 'link[rel=modulepreload]')) processPreload(link);
  }

  function processImportMaps() {
    for (const script of document.querySelectorAll(shimMode ? 'script[type="importmap-shim"]' : 'script[type="importmap"]')) processImportMap(script);
  }

  function getFetchOpts(script) {
    const fetchOpts = {};
    if (script.integrity) fetchOpts.integrity = script.integrity;
    if (script.referrerpolicy) fetchOpts.referrerPolicy = script.referrerpolicy;
    if (script.crossorigin === 'use-credentials') fetchOpts.credentials = 'include';else if (script.crossorigin === 'anonymous') fetchOpts.credentials = 'omit';else fetchOpts.credentials = 'same-origin';
    return fetchOpts;
  }

  let lastStaticLoadPromise = Promise.resolve();
  let domContentLoadedCnt = 1;

  function domContentLoadedCheck() {
    if (--domContentLoadedCnt === 0 && !noLoadEventRetriggers) document.dispatchEvent(new Event('DOMContentLoaded'));
  } // this should always trigger because we assume es-module-shims is itself a domcontentloaded requirement


  document.addEventListener('DOMContentLoaded', async () => {
    await initPromise;
    domContentLoadedCheck();

    if (shimMode || !baselinePassthrough) {
      processImportMaps();
      processScriptsAndPreloads();
    }
  });
  let readyStateCompleteCnt = 1;

  if (document.readyState === 'complete') {
    readyStateCompleteCheck();
  } else {
    document.addEventListener('readystatechange', async () => {
      processImportMaps();
      await initPromise;
      readyStateCompleteCheck();
    });
  }

  function readyStateCompleteCheck() {
    if (--readyStateCompleteCnt === 0 && !noLoadEventRetriggers) document.dispatchEvent(new Event('readystatechange'));
  }

  function processImportMap(script) {
    if (script.ep) // ep marker = script processed
      return; // empty inline scripts sometimes show before domready

    if (!script.src && !script.innerHTML) return;
    script.ep = true; // we dont currently support multiple, external or dynamic imports maps in polyfill mode to match native

    if (script.src) {
      if (!shimMode) return;
      importMapSrcOrLazy = true;
    }

    if (acceptingImportMaps) {
      importMapPromise = importMapPromise.then(async () => {
        importMap = resolveAndComposeImportMap(script.src ? await (await doFetch(script.src, getFetchOpts(script))).json() : JSON.parse(script.innerHTML), script.src || baseUrl, importMap);
      }).catch(throwError);
      if (!shimMode) acceptingImportMaps = false;
    }
  }

  function processScript(script) {
    if (script.ep) // ep marker = script processed
      return;
    if (script.getAttribute('noshim') !== null) return; // empty inline scripts sometimes show before domready

    if (!script.src && !script.innerHTML) return;
    script.ep = true; // does this load block readystate complete

    const isReadyScript = readyStateCompleteCnt > 0; // does this load block DOMContentLoaded

    const isDomContentLoadedScript = domContentLoadedCnt > 0;
    if (isReadyScript) readyStateCompleteCnt++;
    if (isDomContentLoadedScript) domContentLoadedCnt++;
    const blocks = script.getAttribute('async') === null && isReadyScript;
    const loadPromise = topLevelLoad(script.src || baseUrl, getFetchOpts(script), !script.src && script.innerHTML, !shimMode, blocks && lastStaticLoadPromise).catch(throwError);
    if (blocks) lastStaticLoadPromise = loadPromise.then(readyStateCompleteCheck);
    if (isDomContentLoadedScript) loadPromise.then(domContentLoadedCheck);
  }

  const fetchCache = {};

  function processPreload(link) {
    if (link.ep) // ep marker = processed
      return;
    link.ep = true;
    if (fetchCache[link.href]) return;
    fetchCache[link.href] = fetchModule(link.href, getFetchOpts(link));
  }
})();

var esModuleShims = {};

export default esModuleShims;
