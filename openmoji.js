/*jslint indent: 2, browser: true, bitwise: true, plusplus: true */
var openmoji = (function (
  /*! Copyright Twitter Inc. and other contributors. Licensed under MIT *//*
    https://github.com/twitter/twemoji/blob/gh-pages/LICENSE
  */

  // WARNING:   this file is generated automatically via
  //            `node twemoji-generator.js`
  //            please update its `createTwemoji` function
  //            at the bottom of the same file instead.

) {
  'use strict';

  /*jshint maxparams:4 */

  var
    // the exported module object
    openmoji = {


    /////////////////////////
    //      properties     //
    /////////////////////////

      // default assets url, by default will be the OpenMoji GitHub repository served under Statically CDN
      base: 'https://cdn.statically.io/gh/hfg-gmuend/openmoji/master/color/',

      // default assets file extensions, by default '.png'
      ext: '.png',

      // default assets/folder size, by default "72x72"
      // available via original repo: 72 and 618
      size: '72x72',

      // default class name, by default 'emoji'
      className: 'emoji',

      // basic utilities / helpers to convert code points
      // to JavaScript surrogates and vice versa
      convert: {

        /**
         * Given an HEX codepoint, returns UTF16 surrogate pairs.
         *
         * @param   string  generic codepoint, i.e. '1F4A9'
         * @return  string  codepoint transformed into utf16 surrogates pair,
         *          i.e. \uD83D\uDCA9
         *
         * @example
         *  openmoji.convert.fromCodePoint('1f1e8');
         *  // "\ud83c\udde8"
         *
         *  '1f1e8-1f1f3'.split('-').map(openmoji.convert.fromCodePoint).join('')
         *  // "\ud83c\udde8\ud83c\uddf3"
         */
        fromCodePoint: fromCodePoint,

        /**
         * Given UTF16 surrogate pairs, returns the equivalent HEX codepoint.
         *
         * @param   string  generic utf16 surrogates pair, i.e. \uD83D\uDCA9
         * @param   string  optional separator for double code points, default='-'
         * @return  string  utf16 transformed into codepoint, i.e. '1F4A9'
         *
         * @example
         *  openmoji.convert.toCodePoint('\ud83c\udde8\ud83c\uddf3');
         *  // "1f1e8-1f1f3"
         *
         *  openmoji.convert.toCodePoint('\ud83c\udde8\ud83c\uddf3', '~');
         *  // "1f1e8~1f1f3"
         */
        toCodePoint: toCodePoint
      },


    /////////////////////////
    //       methods       //
    /////////////////////////

      /**
       * User first: used to remove missing images
       * preserving the original text intent when
       * a fallback for network problems is desired.
       * Automatically added to Image nodes via DOM
       * It could be recycled for string operations via:
       *  $('img.emoji').on('error', openmoji.onerror)
       */
      onerror: function onerror() {
        if (this.parentNode) {
          this.parentNode.replaceChild(createText(this.alt), this);
        }
      },

      /**
       * Main method/logic to generate either <img> tags or HTMLImage nodes.
       *  "emojify" a generic text or DOM Element.
       *
       * @overloads
       *
       * String replacement for `innerHTML` or server side operations
       *  openmoji.parse(string);
       *  openmoji.parse(string, Function);
       *  openmoji.parse(string, Object);
       *
       * HTMLElement tree parsing for safer operations over existing DOM
       *  openmoji.parse(HTMLElement);
       *  openmoji.parse(HTMLElement, Function);
       *  openmoji.parse(HTMLElement, Object);
       *
       * @param   string|HTMLElement  the source to parse and enrich with emoji.
       *
       *          string              replace emoji matches with <img> tags.
       *                              Mainly used to inject emoji via `innerHTML`
       *                              It does **not** parse the string or validate it,
       *                              it simply replaces found emoji with a tag.
       *                              NOTE: be sure this won't affect security.
       *
       *          HTMLElement         walk through the DOM tree and find emoji
       *                              that are inside **text node only** (nodeType === 3)
       *                              Mainly used to put emoji in already generated DOM
       *                              without compromising surrounding nodes and
       *                              **avoiding** the usage of `innerHTML`.
       *                              NOTE: Using DOM elements instead of strings should
       *                              improve security without compromising too much
       *                              performance compared with a less safe `innerHTML`.
       *
       * @param   Function|Object  [optional]
       *                              either the callback that will be invoked or an object
       *                              with all properties to use per each found emoji.
       *
       *          Function            if specified, this will be invoked per each emoji
       *                              that has been found through the RegExp except
       *                              those follwed by the invariant \uFE0E ("as text").
       *                              Once invoked, parameters will be:
       *
       *                                iconId:string     the lower case HEX code point
       *                                                  i.e. "1f4a9"
       *
       *                                options:Object    all info for this parsing operation
       *
       *                                variant:char      the optional \uFE0F ("as image")
       *                                                  variant, in case this info
       *                                                  is anyhow meaningful.
       *                                                  By default this is ignored.
       *
       *                              If such callback will return a falsy value instead
       *                              of a valid `src` to use for the image, nothing will
       *                              actually change for that specific emoji.
       *
       *
       *          Object              if specified, an object containing the following properties
       *
       *            callback   Function  the callback to invoke per each found emoji.
       *            base       string    the base url, by default openmoji.base
       *            ext        string    the image extension, by default openmoji.ext
       *            size       string    the assets size, by default openmoji.size
       *
       * @example
       *
       *  openmoji.parse("I \u2764\uFE0F emoji!");
       *  // I <img class="emoji" draggable="false" alt="??????" src="/assets/2764.gif"> emoji!
       *
       *
       *  openmoji.parse("I \u2764\uFE0F emoji!", function(iconId, options) {
       *    return '/assets/' + iconId + '.gif';
       *  });
       *  // I <img class="emoji" draggable="false" alt="??????" src="/assets/2764.gif"> emoji!
       *
       *
       * openmoji.parse("I \u2764\uFE0F emoji!", {
       *   size: 72,
       *   callback: function(iconId, options) {
       *     return '/assets/' + options.size + '/' + iconId + options.ext;
       *   }
       * });
       *  // I <img class="emoji" draggable="false" alt="??????" src="/assets/72x72/2764.png"> emoji!
       *
       */
      parse: parse,

      /**
       * Given a string, invokes the callback argument
       *  per each emoji found in such string.
       * This is the most raw version used by
       *  the .parse(string) method itself.
       *
       * @param   string    generic string to parse
       * @param   Function  a generic callback that will be
       *                    invoked to replace the content.
       *                    This calback wil receive standard
       *                    String.prototype.replace(str, callback)
       *                    arguments such:
       *  callback(
       *    rawText,  // the emoji match
       *  );
       *
       *                    and others commonly received via replace.
       */
      replace: replace,

      /**
       * Simplify string tests against emoji.
       *
       * @param   string  some text that might contain emoji
       * @return  boolean true if any emoji was found, false otherwise.
       *
       * @example
       *
       *  if (openmoji.test(someContent)) {
       *    console.log("emoji All The Things!");
       *  }
       */
      test: test
    },

    // used to escape HTML special chars in attributes
    escaper = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    },

    // RegExp based on emoji's official Unicode standards
    // http://www.unicode.org/Public/UNIDATA/EmojiSources.txt
    re = /(?:[\u0039\u0038\u0037\u0036\u0035\u0034\u0033\u0032\u0031\u0030\u0023])\ufe0f?\u20e3|\ud83c\udde8\ud83c\uddf3|\ud83c\udde9\ud83c\uddea|\ud83c\uddea\ud83c\uddf8|\ud83c\uddeb\ud83c\uddf7|\ud83c\uddec\ud83c\udde7|\ud83c\uddee\ud83c\uddf9|\ud83c\uddef\ud83c\uddf5|\ud83c\uddf0\ud83c\uddf7|\ud83c\uddf7\ud83c\uddfa|\ud83c\uddfa\ud83c\uddf8|\ud83d[\udc00-\udc3e\udc40\udc42-\udcf7\udcf9-\udcfc\udd00-\udd3d\udd50-\udd67\uddfb-\ude42\ude45-\ude4f\ude80-\udec5]|\ud83c[\udccf\udd8e\udd91-\udd9a\udde6-\uddff\ude01\ude32-\ude36\ude38-\ude3a\ude50\ude51\udf00-\udf20\udf30-\udf35\udf37-\udf7c\udf80-\udf93\udfa0-\udfc4\udfc6-\udfca\udfe0-\udff0]|[\ue50a\u27bf\u27b0\u2797\u2796\u2795\u2755\u2754\u2753\u274e\u274c\u2728\u270b\u270a\u2705\u26ce\u23f3\u23f0\u23ec\u23eb\u23ea\u23e9]|(?:\ud83c[\udc04\udd70\udd71\udd7e\udd7f\ude02\ude1a\ude2f\ude37]|[\u3299\u3297\u303d\u3030\u2b55\u2b50\u2b1c\u2b1b\u2b07\u2b06\u2b05\u2935\u2934\u27a1\u2764\u2757\u2747\u2744\u2734\u2733\u2716\u2714\u2712\u270f\u270c\u2709\u2708\u2702\u26fd\u26fa\u26f5\u26f3\u26f2\u26ea\u26d4\u26c5\u26c4\u26be\u26bd\u26ab\u26aa\u26a1\u26a0\u2693\u267f\u267b\u2668\u2666\u2665\u2663\u2660\u2653\u2652\u2651\u2650\u264f\u264e\u264d\u264c\u264b\u264a\u2649\u2648\u263a\u261d\u2615\u2614\u2611\u260e\u2601\u2600\u25fe\u25fd\u25fc\u25fb\u25c0\u25b6\u25ab\u25aa\u24c2\u231b\u231a\u21aa\u21a9\u2199\u2198\u2197\u2196\u2195\u2194\u2139\u2122\u2049\u203c\u00ae\u00a9])(?:\ufe0f|(?!\ufe0e))/g,

    // avoid runtime RegExp creation for not so smart,
    // not JIT based, and old browsers / engines
    UFE0Fg = /\uFE0F/g,

    // avoid using a string literal like '\u200D' here because minifiers expand it inline
    U200D = String.fromCharCode(0x200D),

    // used to find HTML special chars in attributes
    rescaper = /[&<>'"]/g,

    // nodes with type 1 which should **not** be parsed (including lower case svg)
    shouldntBeParsed = /IFRAME|NOFRAMES|NOSCRIPT|SCRIPT|SELECT|STYLE|TEXTAREA|[a-z]/,

    // just a private shortcut
    fromCharCode = String.fromCharCode;

  return openmoji;


  /////////////////////////
  //  private functions  //
  //     declaration     //
  /////////////////////////

  /**
   * Shortcut to create text nodes
   * @param   string  text used to create DOM text node
   * @return  Node  a DOM node with that text
   */
  function createText(text) {
    return document.createTextNode(text);
  }

  /**
   * Utility function to escape html attribute text
   * @param   string  text use in HTML attribute
   * @return  string  text encoded to use in HTML attribute
   */
  function escapeHTML(s) {
    return s.replace(rescaper, replacer);
  }

  /**
   * Default callback used to generate emoji src
   *  based on Twitter CDN
   * @param   string    the emoji codepoint string
   * @param   string    the default size to use, i.e. "36x36"
   * @return  string    the image source to use
   */
  function defaultImageSrcGenerator(icon, options) {
    return ''.concat(options.base, options.size, '/', icon, options.ext);
  }

  /**
   * Given a generic DOM nodeType 1, walk through all children
   * and store every nodeType 3 (#text) found in the tree.
   * @param   Element a DOM Element with probably some text in it
   * @param   Array the list of previously discovered text nodes
   * @return  Array same list with new discovered nodes, if any
   */
  function grabAllTextNodes(node, allText) {
    var
      childNodes = node.childNodes,
      length = childNodes.length,
      subnode,
      nodeType;
    while (length--) {
      subnode = childNodes[length];
      nodeType = subnode.nodeType;
      // parse emoji only in text nodes
      if (nodeType === 3) {
        // collect them to process emoji later
        allText.push(subnode);
      }
      // ignore all nodes that are not type 1 or that
      // should not be parsed as script, style, and others
      else if (nodeType === 1 && !shouldntBeParsed.test(subnode.nodeName)) {
        grabAllTextNodes(subnode, allText);
      }
    }
    return allText;
  }

  /**
   * Used to both remove the possible variant
   *  and to convert utf16 into code points.
   *  If there is a zero-width-joiner (U+200D), leave the variants in.
   * @param   string    the raw text of the emoji match
   */
  function grabTheRightIcon(rawText) {
    // if variant is present as \uFE0F
    return toCodePoint(rawText.indexOf(U200D) < 0 ?
      rawText.replace(UFE0Fg, '') :
      rawText
    );
  }

  /**
   * DOM version of the same logic / parser:
   *  emojify all found sub-text nodes placing images node instead.
   * @param   Element   generic DOM node with some text in some child node
   * @param   Object    options  containing info about how to parse
    *
    *            .callback   Function  the callback to invoke per each found emoji.
    *            .base       string    the base url, by default openmoji.base
    *            .ext        string    the image extension, by default openmoji.ext
    *            .size       string    the assets size, by default openmoji.size
    *
   * @return  Element same generic node with emoji in place, if any.
   */
  function parseNode(node, options) {
    var
      allText = grabAllTextNodes(node, []),
      length = allText.length,
      attrib,
      attrname,
      modified,
      fragment,
      subnode,
      text,
      match,
      i,
      index,
      img,
      rawText,
      iconId,
      src;
    while (length--) {
      modified = false;
      fragment = document.createDocumentFragment();
      subnode = allText[length];
      text = subnode.nodeValue;
      i = 0;
      while ((match = re.exec(text))) {
        index = match.index;
        if (index !== i) {
          fragment.appendChild(
            createText(text.slice(i, index))
          );
        }
        rawText = match[0];
        iconId = grabTheRightIcon(rawText);
        i = index + rawText.length;
        src = options.callback(iconId, options);
        if (src) {
          img = new Image();
          img.onerror = options.onerror;
          img.setAttribute('draggable', 'false');
          attrib = options.attributes(rawText, iconId);
          for (attrname in attrib) {
            if (
              attrib.hasOwnProperty(attrname) &&
              // don't allow any handlers to be set + don't allow overrides
              attrname.indexOf('on') !== 0 &&
              !img.hasAttribute(attrname)
            ) {
              img.setAttribute(attrname, attrib[attrname]);
            }
          }
          img.className = options.className;
          img.alt = rawText;
          img.src = src;
          modified = true;
          fragment.appendChild(img);
        }
        if (!img) fragment.appendChild(createText(rawText));
        img = null;
      }
      // is there actually anything to replace in here ?
      if (modified) {
        // any text left to be added ?
        if (i < text.length) {
          fragment.appendChild(
            createText(text.slice(i))
          );
        }
        // replace the text node only, leave intact
        // anything else surrounding such text
        subnode.parentNode.replaceChild(fragment, subnode);
      }
    }
    return node;
  }

  /**
   * String/HTML version of the same logic / parser:
   *  emojify a generic text placing images tags instead of surrogates pair.
   * @param   string    generic string with possibly some emoji in it
   * @param   Object    options  containing info about how to parse
   *
   *            .callback   Function  the callback to invoke per each found emoji.
   *            .base       string    the base url, by default openmoji.base
   *            .ext        string    the image extension, by default openmoji.ext
   *            .size       string    the assets size, by default openmoji.size
   *
   * @return  the string with <img tags> replacing all found and parsed emoji
   */
  function parseString(str, options) {
    return replace(str, function (rawText) {
      var
        ret = rawText,
        iconId = grabTheRightIcon(rawText),
        src = options.callback(iconId, options),
        attrib,
        attrname;
      if (src) {
        // recycle the match string replacing the emoji
        // with its image counter part
        ret = '<img '.concat(
          'class="', options.className, '" ',
          'draggable="false" ',
          // needs to preserve user original intent
          // when variants should be copied and pasted too
          'alt="',
          rawText,
          '"',
          ' src="',
          src,
          '"'
        );
        attrib = options.attributes(rawText, iconId);
        for (attrname in attrib) {
          if (
            attrib.hasOwnProperty(attrname) &&
            // don't allow any handlers to be set + don't allow overrides
            attrname.indexOf('on') !== 0 &&
            ret.indexOf(' ' + attrname + '=') === -1
          ) {
            ret = ret.concat(' ', attrname, '="', escapeHTML(attrib[attrname]), '"');
          }
        }
        ret = ret.concat('>');
      }
      return ret;
    });
  }

  /**
   * Function used to actually replace HTML special chars
   * @param   string  HTML special char
   * @return  string  encoded HTML special char
   */
  function replacer(m) {
    return escaper[m];
  }

  /**
   * Default options.attribute callback
   * @return  null
   */
  function returnNull() {
    return null;
  }

  /**
   * Given a generic value, creates its squared counterpart if it's a number.
   *  As example, number 36 will return '36x36'.
   * @param   any     a generic value.
   * @return  any     a string representing asset size, i.e. "36x36"
   *                  only in case the value was a number.
   *                  Returns initial value otherwise.
   */
  function toSizeSquaredAsset(value) {
    return typeof value === 'number' ?
      value + 'x' + value :
      value;
  }


  /////////////////////////
  //  exported functions //
  //     declaration     //
  /////////////////////////

  function fromCodePoint(codepoint) {
    var code = typeof codepoint === 'string' ?
          parseInt(codepoint, 16) : codepoint;
    if (code < 0x10000) {
      return fromCharCode(code);
    }
    code -= 0x10000;
    return fromCharCode(
      0xD800 + (code >> 10),
      0xDC00 + (code & 0x3FF)
    );
  }

  function parse(what, how) {
    if (!how || typeof how === 'function') {
      how = {callback: how};
    }
    // if first argument is string, inject html <img> tags
    // otherwise use the DOM tree and parse text nodes only
    return (typeof what === 'string' ? parseString : parseNode)(what, {
      callback:   how.callback || defaultImageSrcGenerator,
      attributes: typeof how.attributes === 'function' ? how.attributes : returnNull,
      base:       typeof how.base === 'string' ? how.base : openmoji.base,
      ext:        how.ext || openmoji.ext,
      size:       how.folder || toSizeSquaredAsset(how.size || openmoji.size),
      className:  how.className || openmoji.className,
      onerror:    how.onerror || openmoji.onerror
    });
  }

  function replace(text, callback) {
    return String(text).replace(re, callback);
  }

  function test(text) {
    // IE6 needs a reset before too
    re.lastIndex = 0;
    var result = re.test(text);
    re.lastIndex = 0;
    return result;
  }

  function toCodePoint(unicodeSurrogates, sep) {
    var
      r = [],
      c = 0,
      p = 0,
      i = 0;
    while (i < unicodeSurrogates.length) {
      c = unicodeSurrogates.charCodeAt(i++);
      if (p) {
        r.push((0x10000 + ((p - 0xD800) << 10) + (c - 0xDC00)).toString(16));
        p = 0;
      } else if (0xD800 <= c && c <= 0xDBFF) {
        p = c;
      } else {
        r.push(c.toString(16));
      }
    }
    return r.join(sep || '-').toUpperCase();
  }

}());
