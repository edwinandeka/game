/**
 *
 * @class Titan Framework
 * @author edwinandeka@gmail.com.com (Edwin Ramiro Ospina Ruiz )
 * @date  2017-02-14 21:51:53
 * @version titan-framework
 *
 * @license Derechos Reservados de Autor (C) DOWESOFT (dowesoft.com)
 */
;(function(window, document, undefined) {
"use strict";

(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var defaultParams = {
  title: '',
  text: '',
  type: null,
  allowOutsideClick: false,
  showConfirmButton: true,
  showCancelButton: false,
  closeOnConfirm: true,
  closeOnCancel: true,
  confirmButtonText: 'OK',
  confirmButtonClass: 'btn-primary',
  cancelButtonText: 'Cancel',
  cancelButtonClass: 'btn-default',
  containerClass: '',
  titleClass: '',
  textClass: '',
  imageUrl: null,
  imageSize: null,
  timer: null,
  customClass: '',
  html: false,
  animation: true,
  allowEscapeKey: true,
  inputType: 'text',
  inputPlaceholder: '',
  inputValue: '',
  showLoaderOnConfirm: false
};

exports.default = defaultParams;

},{}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handleCancel = exports.handleConfirm = exports.handleButton = undefined;

var _handleSwalDom = require('./handle-swal-dom');

var _handleDom = require('./handle-dom');

/*
 * User clicked on "Confirm"/"OK" or "Cancel"
 */
var handleButton = function handleButton(event, params, modal) {
  var e = event || window.event;
  var target = e.target || e.srcElement;

  var targetedConfirm = target.className.indexOf('confirm') !== -1;
  var targetedOverlay = target.className.indexOf('sweet-overlay') !== -1;
  var modalIsVisible = (0, _handleDom.hasClass)(modal, 'visible');
  var doneFunctionExists = params.doneFunction && modal.getAttribute('data-has-done-function') === 'true';

  // Since the user can change the background-color of the confirm button programmatically,
  // we must calculate what the color should be on hover/active
  var normalColor, hoverColor, activeColor;
  if (targetedConfirm && params.confirmButtonColor) {
    normalColor = params.confirmButtonColor;
    hoverColor = colorLuminance(normalColor, -0.04);
    activeColor = colorLuminance(normalColor, -0.14);
  }

  function shouldSetConfirmButtonColor(color) {
    if (targetedConfirm && params.confirmButtonColor) {
      target.style.backgroundColor = color;
    }
  }

  switch (e.type) {
    case 'click':
      var clickedOnModal = modal === target;
      var clickedOnModalChild = (0, _handleDom.isDescendant)(modal, target);

      // Ignore click outside if allowOutsideClick is false
      if (!clickedOnModal && !clickedOnModalChild && modalIsVisible && !params.allowOutsideClick) {
        break;
      }

      if (targetedConfirm && doneFunctionExists && modalIsVisible) {
        handleConfirm(modal, params);
      } else if (doneFunctionExists && modalIsVisible || targetedOverlay) {
        handleCancel(modal, params);
      } else if ((0, _handleDom.isDescendant)(modal, target) && target.tagName === 'BUTTON') {
        sweetAlert.close();
      }
      break;
  }
};

/*
 *  User clicked on "Confirm"/"OK"
 */
var handleConfirm = function handleConfirm(modal, params) {
  var callbackValue = true;

  if ((0, _handleDom.hasClass)(modal, 'show-input')) {
    callbackValue = modal.querySelector('input').value;

    if (!callbackValue) {
      callbackValue = '';
    }
  }

  params.doneFunction(callbackValue);

  if (params.closeOnConfirm) {
    sweetAlert.close();
  }
  // Disable cancel and confirm button if the parameter is true
  if (params.showLoaderOnConfirm) {
    sweetAlert.disableButtons();
  }
};

/*
 *  User clicked on "Cancel"
 */
var handleCancel = function handleCancel(modal, params) {
  // Check if callback function expects a parameter (to track cancel actions)
  var functionAsStr = String(params.doneFunction).replace(/\s/g, '');
  var functionHandlesCancel = functionAsStr.substring(0, 9) === 'function(' && functionAsStr.substring(9, 10) !== ')';

  if (functionHandlesCancel) {
    params.doneFunction(false);
  }

  if (params.closeOnCancel) {
    sweetAlert.close();
  }
};

exports.handleButton = handleButton;
exports.handleConfirm = handleConfirm;
exports.handleCancel = handleCancel;

},{"./handle-dom":3,"./handle-swal-dom":5}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var hasClass = function hasClass(elem, className) {
  return new RegExp(' ' + className + ' ').test(' ' + elem.className + ' ');
};

var addClass = function addClass(elem, className) {
  if (!hasClass(elem, className)) {
    elem.className += ' ' + className;
  }
};

var removeClass = function removeClass(elem, className) {
  var newClass = ' ' + elem.className.replace(/[\t\r\n]/g, ' ') + ' ';
  if (hasClass(elem, className)) {
    while (newClass.indexOf(' ' + className + ' ') >= 0) {
      newClass = newClass.replace(' ' + className + ' ', ' ');
    }
    elem.className = newClass.replace(/^\s+|\s+$/g, '');
  }
};

var escapeHtml = function escapeHtml(str) {
  var div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
};

var _show = function _show(elem) {
  elem.style.opacity = '';
  elem.style.display = 'block';
};

var show = function show(elems) {
  if (elems && !elems.length) {
    return _show(elems);
  }
  for (var i = 0; i < elems.length; ++i) {
    _show(elems[i]);
  }
};

var _hide = function _hide(elem) {
  elem.style.opacity = '';
  elem.style.display = 'none';
};

var hide = function hide(elems) {
  if (elems && !elems.length) {
    return _hide(elems);
  }
  for (var i = 0; i < elems.length; ++i) {
    _hide(elems[i]);
  }
};

var isDescendant = function isDescendant(parent, child) {
  var node = child.parentNode;
  while (node !== null) {
    if (node === parent) {
      return true;
    }
    node = node.parentNode;
  }
  return false;
};

var getTopMargin = function getTopMargin(elem) {
  elem.style.left = '-9999px';
  elem.style.display = 'block';

  var height = elem.clientHeight,
      padding;
  if (typeof getComputedStyle !== "undefined") {
    // IE 8
    padding = parseInt(getComputedStyle(elem).getPropertyValue('padding-top'), 10);
  } else {
    padding = parseInt(elem.currentStyle.padding);
  }

  elem.style.left = '';
  elem.style.display = 'none';
  return '-' + parseInt((height + padding) / 2) + 'px';
};

var fadeIn = function fadeIn(elem, interval) {
  if (+elem.style.opacity < 1) {
    interval = interval || 16;
    elem.style.opacity = 0;
    elem.style.display = 'block';
    var last = +new Date();
    var tick = function tick() {
      elem.style.opacity = +elem.style.opacity + (new Date() - last) / 100;
      last = +new Date();

      if (+elem.style.opacity < 1) {
        setTimeout(tick, interval);
      }
    };
    tick();
  }
  elem.style.display = 'block'; //fallback IE8
};

var fadeOut = function fadeOut(elem, interval) {
  interval = interval || 16;
  elem.style.opacity = 1;
  var last = +new Date();
  var tick = function tick() {
    elem.style.opacity = +elem.style.opacity - (new Date() - last) / 100;
    last = +new Date();

    if (+elem.style.opacity > 0) {
      setTimeout(tick, interval);
    } else {
      elem.style.display = 'none';
    }
  };
  tick();
};

var fireClick = function fireClick(node) {
  // Taken from http://www.nonobtrusive.com/2011/11/29/programatically-fire-crossbrowser-click-event-with-javascript/
  // Then fixed for today's Chrome browser.
  if (typeof MouseEvent === 'function') {
    // Up-to-date approach
    var mevt = new MouseEvent('click', {
      view: window,
      bubbles: false,
      cancelable: true
    });
    node.dispatchEvent(mevt);
  } else if (document.createEvent) {
    // Fallback
    var evt = document.createEvent('MouseEvents');
    evt.initEvent('click', false, false);
    node.dispatchEvent(evt);
  } else if (document.createEventObject) {
    node.fireEvent('onclick');
  } else if (typeof node.onclick === 'function') {
    node.onclick();
  }
};

var stopEventPropagation = function stopEventPropagation(e) {
  // In particular, make sure the space bar doesn't scroll the main window.
  if (typeof e.stopPropagation === 'function') {
    e.stopPropagation();
    e.preventDefault();
  } else if (window.event && window.event.hasOwnProperty('cancelBubble')) {
    window.event.cancelBubble = true;
  }
};

exports.hasClass = hasClass;
exports.addClass = addClass;
exports.removeClass = removeClass;
exports.escapeHtml = escapeHtml;
exports._show = _show;
exports.show = show;
exports._hide = _hide;
exports.hide = hide;
exports.isDescendant = isDescendant;
exports.getTopMargin = getTopMargin;
exports.fadeIn = fadeIn;
exports.fadeOut = fadeOut;
exports.fireClick = fireClick;
exports.stopEventPropagation = stopEventPropagation;

},{}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _handleDom = require('./handle-dom');

var _handleSwalDom = require('./handle-swal-dom');

var handleKeyDown = function handleKeyDown(event, params, modal) {
  var e = event || window.event;
  var keyCode = e.keyCode || e.which;

  var $okButton = modal.querySelector('button.confirm');
  var $cancelButton = modal.querySelector('button.cancel');
  var $modalButtons = modal.querySelectorAll('button[tabindex]');

  if ([9, 13, 32, 27].indexOf(keyCode) === -1) {
    // Don't do work on keys we don't care about.
    return;
  }

  var $targetElement = e.target || e.srcElement;

  var btnIndex = -1; // Find the button - note, this is a nodelist, not an array.
  for (var i = 0; i < $modalButtons.length; i++) {
    if ($targetElement === $modalButtons[i]) {
      btnIndex = i;
      break;
    }
  }

  if (keyCode === 9) {
    // TAB
    if (btnIndex === -1) {
      // No button focused. Jump to the confirm button.
      $targetElement = $okButton;
    } else {
      // Cycle to the next button
      if (btnIndex === $modalButtons.length - 1) {
        $targetElement = $modalButtons[0];
      } else {
        $targetElement = $modalButtons[btnIndex + 1];
      }
    }

    (0, _handleDom.stopEventPropagation)(e);
    $targetElement.focus();

    if (params.confirmButtonColor) {
      (0, _handleSwalDom.setFocusStyle)($targetElement, params.confirmButtonColor);
    }
  } else {
    if (keyCode === 13) {
      if ($targetElement.tagName === 'INPUT') {
        $targetElement = $okButton;
        $okButton.focus();
      }

      if (btnIndex === -1) {
        // ENTER/SPACE clicked outside of a button.
        $targetElement = $okButton;
      } else {
        // Do nothing - let the browser handle it.
        $targetElement = undefined;
      }
    } else if (keyCode === 27 && params.allowEscapeKey === true) {
      $targetElement = $cancelButton;
      (0, _handleDom.fireClick)($targetElement, e);
    } else {
      // Fallback - let the browser handle it.
      $targetElement = undefined;
    }
  }
};

exports.default = handleKeyDown;

},{"./handle-dom":3,"./handle-swal-dom":5}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fixVerticalPosition = exports.resetInputError = exports.resetInput = exports.openModal = exports.getInput = exports.getOverlay = exports.getModal = exports.sweetAlertInitialize = undefined;

var _handleDom = require('./handle-dom');

var _defaultParams = require('./default-params');

var _defaultParams2 = _interopRequireDefault(_defaultParams);

var _injectedHtml = require('./injected-html');

var _injectedHtml2 = _interopRequireDefault(_injectedHtml);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var modalClass = '.sweet-alert';
var overlayClass = '.sweet-overlay';

/*
 * Add modal + overlay to DOM
 */


var sweetAlertInitialize = function sweetAlertInitialize() {
  var sweetWrap = document.createElement('div');
  sweetWrap.innerHTML = _injectedHtml2.default;

  // Append elements to body
  while (sweetWrap.firstChild) {
    document.body.appendChild(sweetWrap.firstChild);
  }
};

/*
 * Get DOM element of modal
 */
var getModal = function getModal() {
  var $modal = document.querySelector(modalClass);

  if (!$modal) {
    sweetAlertInitialize();
    $modal = getModal();
  }

  return $modal;
};

/*
 * Get DOM element of input (in modal)
 */
var getInput = function getInput() {
  var $modal = getModal();
  if ($modal) {
    return $modal.querySelector('input');
  }
};

/*
 * Get DOM element of overlay
 */
var getOverlay = function getOverlay() {
  return document.querySelector(overlayClass);
};

/*
 * Animation when opening modal
 */
var openModal = function openModal(callback) {
  var $modal = getModal();
  (0, _handleDom.fadeIn)(getOverlay(), 10);
  (0, _handleDom.show)($modal);
  (0, _handleDom.addClass)($modal, 'showSweetAlert');
  (0, _handleDom.removeClass)($modal, 'hideSweetAlert');

  window.previousActiveElement = document.activeElement;
  var $okButton = $modal.querySelector('button.confirm');
  $okButton.focus();

  setTimeout(function () {
    (0, _handleDom.addClass)($modal, 'visible');
  }, 500);

  var timer = $modal.getAttribute('data-timer');

  if (timer !== 'null' && timer !== '') {
    var timerCallback = callback;
    $modal.timeout = setTimeout(function () {
      var doneFunctionExists = (timerCallback || null) && $modal.getAttribute('data-has-done-function') === 'true';
      if (doneFunctionExists) {
        timerCallback(null);
      } else {
        sweetAlert.close();
      }
    }, timer);
  }
};

/*
 * Reset the styling of the input
 * (for example if errors have been shown)
 */
var resetInput = function resetInput() {
  var $modal = getModal();
  var $input = getInput();

  (0, _handleDom.removeClass)($modal, 'show-input');
  $input.value = _defaultParams2.default.inputValue;
  $input.setAttribute('type', _defaultParams2.default.inputType);
  $input.setAttribute('placeholder', _defaultParams2.default.inputPlaceholder);

  resetInputError();
};

var resetInputError = function resetInputError(event) {
  // If press enter => ignore
  if (event && event.keyCode === 13) {
    return false;
  }

  var $modal = getModal();

  var $errorIcon = $modal.querySelector('.sa-input-error');
  (0, _handleDom.removeClass)($errorIcon, 'show');

  var $errorContainer = $modal.querySelector('.form-group');
  (0, _handleDom.removeClass)($errorContainer, 'has-error');
};

/*
 * Set "margin-top"-property on modal based on its computed height
 */
var fixVerticalPosition = function fixVerticalPosition() {
  var $modal = getModal();
  $modal.style.marginTop = (0, _handleDom.getTopMargin)(getModal());
};

exports.sweetAlertInitialize = sweetAlertInitialize;
exports.getModal = getModal;
exports.getOverlay = getOverlay;
exports.getInput = getInput;
exports.openModal = openModal;
exports.resetInput = resetInput;
exports.resetInputError = resetInputError;
exports.fixVerticalPosition = fixVerticalPosition;

},{"./default-params":1,"./handle-dom":3,"./injected-html":6}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var injectedHTML =

// Dark overlay
"<div class=\"sweet-overlay\" tabIndex=\"-1\"></div>" +

// Modal
"<div class=\"sweet-alert\" tabIndex=\"-1\">" +

// Error icon
"<div class=\"sa-icon sa-error\">\n      <span class=\"sa-x-mark\">\n        <span class=\"sa-line sa-left\"></span>\n        <span class=\"sa-line sa-right\"></span>\n      </span>\n    </div>" +

// Warning icon
"<div class=\"sa-icon sa-warning\">\n      <span class=\"sa-body\"></span>\n      <span class=\"sa-dot\"></span>\n    </div>" +

// Info icon
"<div class=\"sa-icon sa-info\"></div>" +

// Success icon
"<div class=\"sa-icon sa-success\">\n      <span class=\"sa-line sa-tip\"></span>\n      <span class=\"sa-line sa-long\"></span>\n\n      <div class=\"sa-placeholder\"></div>\n      <div class=\"sa-fix\"></div>\n    </div>" + "<div class=\"sa-icon sa-custom\"></div>" +

// Title, text and input
"<h2>Title</h2>\n    <p class=\"lead text-muted\">Text</p>\n    <div class=\"form-group\">\n      <input type=\"text\" class=\"form-control\" tabIndex=\"3\" />\n      <span class=\"sa-input-error help-block\">\n        <span class=\"glyphicon glyphicon-exclamation-sign\"></span> <span class=\"sa-help-text\">Not valid</span>\n      </span>\n    </div>" +

// Cancel and confirm buttons
"<div class=\"sa-button-container\">\n      <button class=\"cancel btn btn-lg\" tabIndex=\"2\">Cancel</button>\n      <div class=\"sa-confirm-button-container\">\n        <button class=\"confirm btn btn-lg\" tabIndex=\"1\">OK</button>" +

// Loading animation
"<div class=\"la-ball-fall\">\n          <div></div>\n          <div></div>\n          <div></div>\n        </div>\n      </div>\n    </div>" +

// End of modal
"</div>";

exports.default = injectedHTML;

},{}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _utils = require('./utils');

var _handleSwalDom = require('./handle-swal-dom');

var _handleDom = require('./handle-dom');

var alertTypes = ['error', 'warning', 'info', 'success', 'input', 'prompt'];

/*
 * Set type, text and actions on modal
 */
var setParameters = function setParameters(params) {
  var modal = (0, _handleSwalDom.getModal)();

  var $title = modal.querySelector('h2');
  var $text = modal.querySelector('p');
  var $cancelBtn = modal.querySelector('button.cancel');
  var $confirmBtn = modal.querySelector('button.confirm');

  /*
   * Title
   */
  $title.innerHTML = params.html ? params.title : (0, _handleDom.escapeHtml)(params.title).split('\n').join('<br>');

  /*
   * Text
   */
  $text.innerHTML = params.html ? params.text : (0, _handleDom.escapeHtml)(params.text || '').split('\n').join('<br>');
  if (params.text) (0, _handleDom.show)($text);

  /*
   * Custom class
   */
  if (params.customClass) {
    (0, _handleDom.addClass)(modal, params.customClass);
    modal.setAttribute('data-custom-class', params.customClass);
  } else {
    // Find previously set classes and remove them
    var customClass = modal.getAttribute('data-custom-class');
    (0, _handleDom.removeClass)(modal, customClass);
    modal.setAttribute('data-custom-class', '');
  }

  /*
   * Icon
   */
  (0, _handleDom.hide)(modal.querySelectorAll('.sa-icon'));

  if (params.type && !(0, _utils.isIE8)()) {
    var _ret = function () {

      var validType = false;

      for (var i = 0; i < alertTypes.length; i++) {
        if (params.type === alertTypes[i]) {
          validType = true;
          break;
        }
      }

      if (!validType) {
        logStr('Unknown alert type: ' + params.type);
        return {
          v: false
        };
      }

      var typesWithIcons = ['success', 'error', 'warning', 'info'];
      var $icon = void 0;

      if (typesWithIcons.indexOf(params.type) !== -1) {
        $icon = modal.querySelector('.sa-icon.' + 'sa-' + params.type);
        (0, _handleDom.show)($icon);
      }

      var $input = (0, _handleSwalDom.getInput)();

      // Animate icon
      switch (params.type) {

        case 'success':
          (0, _handleDom.addClass)($icon, 'animate');
          (0, _handleDom.addClass)($icon.querySelector('.sa-tip'), 'animateSuccessTip');
          (0, _handleDom.addClass)($icon.querySelector('.sa-long'), 'animateSuccessLong');
          break;

        case 'error':
          (0, _handleDom.addClass)($icon, 'animateErrorIcon');
          (0, _handleDom.addClass)($icon.querySelector('.sa-x-mark'), 'animateXMark');
          break;

        case 'warning':
          (0, _handleDom.addClass)($icon, 'pulseWarning');
          (0, _handleDom.addClass)($icon.querySelector('.sa-body'), 'pulseWarningIns');
          (0, _handleDom.addClass)($icon.querySelector('.sa-dot'), 'pulseWarningIns');
          break;

        case 'input':
        case 'prompt':
          $input.setAttribute('type', params.inputType);
          $input.value = params.inputValue;
          $input.setAttribute('placeholder', params.inputPlaceholder);
          (0, _handleDom.addClass)(modal, 'show-input');
          setTimeout(function () {
            $input.focus();
            $input.addEventListener('keyup', swal.resetInputError);
          }, 400);
          break;
      }
    }();

    if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
  }

  /*
   * Custom image
   */
  if (params.imageUrl) {
    var $customIcon = modal.querySelector('.sa-icon.sa-custom');

    $customIcon.style.backgroundImage = 'url(' + params.imageUrl + ')';
    (0, _handleDom.show)($customIcon);

    var _imgWidth = 80;
    var _imgHeight = 80;

    if (params.imageSize) {
      var dimensions = params.imageSize.toString().split('x');
      var imgWidth = dimensions[0];
      var imgHeight = dimensions[1];

      if (!imgWidth || !imgHeight) {
        logStr('Parameter imageSize expects value with format WIDTHxHEIGHT, got ' + params.imageSize);
      } else {
        _imgWidth = imgWidth;
        _imgHeight = imgHeight;
      }
    }

    $customIcon.setAttribute('style', $customIcon.getAttribute('style') + 'width:' + _imgWidth + 'px; height:' + _imgHeight + 'px');
  }

  /*
   * Show cancel button?
   */
  modal.setAttribute('data-has-cancel-button', params.showCancelButton);
  if (params.showCancelButton) {
    $cancelBtn.style.display = 'inline-block';
  } else {
    (0, _handleDom.hide)($cancelBtn);
  }

  /*
   * Show confirm button?
   */
  modal.setAttribute('data-has-confirm-button', params.showConfirmButton);
  if (params.showConfirmButton) {
    $confirmBtn.style.display = 'inline-block';
  } else {
    (0, _handleDom.hide)($confirmBtn);
  }

  /*
   * Custom text on cancel/confirm buttons
   */
  if (params.cancelButtonText) {
    $cancelBtn.innerHTML = (0, _handleDom.escapeHtml)(params.cancelButtonText);
  }
  if (params.confirmButtonText) {
    $confirmBtn.innerHTML = (0, _handleDom.escapeHtml)(params.confirmButtonText);
  }

  /*
   * Reset confirm buttons to default class (Ugly fix)
   */
  $confirmBtn.className = 'confirm btn btn-lg';

  /*
   * Attach selected class to the sweet alert modal
   */
  (0, _handleDom.addClass)(modal, params.containerClass);

  /*
   * Set confirm button to selected class
   */
  (0, _handleDom.addClass)($confirmBtn, params.confirmButtonClass);

  /*
   * Set cancel button to selected class
   */
  (0, _handleDom.addClass)($cancelBtn, params.cancelButtonClass);

  /*
   * Set title to selected class
   */
  (0, _handleDom.addClass)($title, params.titleClass);

  /*
   * Set text to selected class
   */
  (0, _handleDom.addClass)($text, params.textClass);

  /*
   * Allow outside click
   */
  modal.setAttribute('data-allow-outside-click', params.allowOutsideClick);

  /*
   * Callback function
   */
  var hasDoneFunction = params.doneFunction ? true : false;
  modal.setAttribute('data-has-done-function', hasDoneFunction);

  /*
   * Animation
   */
  if (!params.animation) {
    modal.setAttribute('data-animation', 'none');
  } else if (typeof params.animation === 'string') {
    modal.setAttribute('data-animation', params.animation); // Custom animation
  } else {
      modal.setAttribute('data-animation', 'pop');
    }

  /*
   * Timer
   */
  modal.setAttribute('data-timer', params.timer);
};

exports.default = setParameters;

},{"./handle-dom":3,"./handle-swal-dom":5,"./utils":8}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/*
 * Allow user to pass their own params
 */
var extend = function extend(a, b) {
  for (var key in b) {
    if (b.hasOwnProperty(key)) {
      a[key] = b[key];
    }
  }
  return a;
};

/*
 * Check if the user is using Internet Explorer 8 (for fallbacks)
 */
var isIE8 = function isIE8() {
  return window.attachEvent && !window.addEventListener;
};

/*
 * IE compatible logging for developers
 */
var logStr = function logStr(string) {
  if (window.console) {
    // IE...
    window.console.log('SweetAlert: ' + string);
  }
};

exports.extend = extend;
exports.isIE8 = isIE8;
exports.logStr = logStr;

},{}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; }; // SweetAlert
// 2014-2015 (c) - Tristan Edwards
// github.com/t4t5/sweetalert

/*
 * jQuery-like functions for manipulating the DOM
 */


/*
 * Handy utilities
 */


/*
 *  Handle sweetAlert's DOM elements
 */


// Handle button events and keyboard events


// Default values


var _handleDom = require('./modules/handle-dom');

var _utils = require('./modules/utils');

var _handleSwalDom = require('./modules/handle-swal-dom');

var _handleClick = require('./modules/handle-click');

var _handleKey = require('./modules/handle-key');

var _handleKey2 = _interopRequireDefault(_handleKey);

var _defaultParams = require('./modules/default-params');

var _defaultParams2 = _interopRequireDefault(_defaultParams);

var _setParams = require('./modules/set-params');

var _setParams2 = _interopRequireDefault(_setParams);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * Remember state in cases where opening and handling a modal will fiddle with it.
 * (We also use window.previousActiveElement as a global variable)
 */
var previousWindowKeyDown;
var lastFocusedButton;

/*
 * Global sweetAlert function
 * (this is what the user calls)
 */
var sweetAlert, _swal;

exports.default = sweetAlert = _swal = function swal() {
  var customizations = arguments[0];

  (0, _handleDom.addClass)(document.body, 'stop-scrolling');
  (0, _handleSwalDom.resetInput)();

  /*
   * Use argument if defined or default value from params object otherwise.
   * Supports the case where a default value is boolean true and should be
   * overridden by a corresponding explicit argument which is boolean false.
   */
  function argumentOrDefault(key) {
    var args = customizations;
    return args[key] === undefined ? _defaultParams2.default[key] : args[key];
  }

  if (customizations === undefined) {
    (0, _utils.logStr)('SweetAlert expects at least 1 attribute!');
    return false;
  }

  var params = (0, _utils.extend)({}, _defaultParams2.default);

  switch (typeof customizations === 'undefined' ? 'undefined' : _typeof(customizations)) {

    // Ex: swal("Hello", "Just testing", "info");
    case 'string':
      params.title = customizations;
      params.text = arguments[1] || '';
      params.type = arguments[2] || '';
      break;

    // Ex: swal({ title:"Hello", text: "Just testing", type: "info" });
    case 'object':
      if (customizations.title === undefined) {
        (0, _utils.logStr)('Missing "title" argument!');
        return false;
      }

      params.title = customizations.title;

      for (var customName in _defaultParams2.default) {
        params[customName] = argumentOrDefault(customName);
      }

      // Show "Confirm" instead of "OK" if cancel button is visible
      params.confirmButtonText = params.showCancelButton ? 'Confirm' : _defaultParams2.default.confirmButtonText;
      params.confirmButtonText = argumentOrDefault('confirmButtonText');

      // Callback function when clicking on "OK"/"Cancel"
      params.doneFunction = arguments[1] || null;

      break;

    default:
      (0, _utils.logStr)('Unexpected type of argument! Expected "string" or "object", got ' + (typeof customizations === 'undefined' ? 'undefined' : _typeof(customizations)));
      return false;

  }

  (0, _setParams2.default)(params);
  (0, _handleSwalDom.fixVerticalPosition)();
  (0, _handleSwalDom.openModal)(arguments[1]);

  // Modal interactions
  var modal = (0, _handleSwalDom.getModal)();

  /*
   * Make sure all modal buttons respond to all events
   */
  var $buttons = modal.querySelectorAll('button');
  var buttonEvents = ['onclick'];
  var onButtonEvent = function onButtonEvent(e) {
    return (0, _handleClick.handleButton)(e, params, modal);
  };

  for (var btnIndex = 0; btnIndex < $buttons.length; btnIndex++) {
    for (var evtIndex = 0; evtIndex < buttonEvents.length; evtIndex++) {
      var btnEvt = buttonEvents[evtIndex];
      $buttons[btnIndex][btnEvt] = onButtonEvent;
    }
  }

  // Clicking outside the modal dismisses it (if allowed by user)
  (0, _handleSwalDom.getOverlay)().onclick = onButtonEvent;

  previousWindowKeyDown = window.onkeydown;

  var onKeyEvent = function onKeyEvent(e) {
    return (0, _handleKey2.default)(e, params, modal);
  };
  window.onkeydown = onKeyEvent;

  window.onfocus = function () {
    // When the user has focused away and focused back from the whole window.
    setTimeout(function () {
      // Put in a timeout to jump out of the event sequence.
      // Calling focus() in the event sequence confuses things.
      if (lastFocusedButton !== undefined) {
        lastFocusedButton.focus();
        lastFocusedButton = undefined;
      }
    }, 0);
  };

  // Show alert with enabled buttons always
  _swal.enableButtons();
};

/*
 * Set default params for each popup
 * @param {Object} userParams
 */


sweetAlert.setDefaults = _swal.setDefaults = function (userParams) {
  if (!userParams) {
    throw new Error('userParams is required');
  }
  if ((typeof userParams === 'undefined' ? 'undefined' : _typeof(userParams)) !== 'object') {
    throw new Error('userParams has to be a object');
  }

  (0, _utils.extend)(_defaultParams2.default, userParams);
};

/*
 * Animation when closing modal
 */
sweetAlert.close = _swal.close = function () {
  var modal = (0, _handleSwalDom.getModal)();

  (0, _handleDom.fadeOut)((0, _handleSwalDom.getOverlay)(), 5);
  (0, _handleDom.fadeOut)(modal, 5);
  (0, _handleDom.removeClass)(modal, 'showSweetAlert');
  (0, _handleDom.addClass)(modal, 'hideSweetAlert');
  (0, _handleDom.removeClass)(modal, 'visible');

  /*
   * Reset icon animations
   */
  var $successIcon = modal.querySelector('.sa-icon.sa-success');
  (0, _handleDom.removeClass)($successIcon, 'animate');
  (0, _handleDom.removeClass)($successIcon.querySelector('.sa-tip'), 'animateSuccessTip');
  (0, _handleDom.removeClass)($successIcon.querySelector('.sa-long'), 'animateSuccessLong');

  var $errorIcon = modal.querySelector('.sa-icon.sa-error');
  (0, _handleDom.removeClass)($errorIcon, 'animateErrorIcon');
  (0, _handleDom.removeClass)($errorIcon.querySelector('.sa-x-mark'), 'animateXMark');

  var $warningIcon = modal.querySelector('.sa-icon.sa-warning');
  (0, _handleDom.removeClass)($warningIcon, 'pulseWarning');
  (0, _handleDom.removeClass)($warningIcon.querySelector('.sa-body'), 'pulseWarningIns');
  (0, _handleDom.removeClass)($warningIcon.querySelector('.sa-dot'), 'pulseWarningIns');

  // Reset custom class (delay so that UI changes aren't visible)
  setTimeout(function () {
    var customClass = modal.getAttribute('data-custom-class');
    (0, _handleDom.removeClass)(modal, customClass);
  }, 300);

  // Make page scrollable again
  (0, _handleDom.removeClass)(document.body, 'stop-scrolling');

  // Reset the page to its previous state
  window.onkeydown = previousWindowKeyDown;
  if (window.previousActiveElement) {
    window.previousActiveElement.focus();
  }
  lastFocusedButton = undefined;
  clearTimeout(modal.timeout);

  return true;
};

/*
 * Validation of the input field is done by user
 * If something is wrong => call showInputError with errorMessage
 */
sweetAlert.showInputError = _swal.showInputError = function (errorMessage) {
  var modal = (0, _handleSwalDom.getModal)();

  var $errorIcon = modal.querySelector('.sa-input-error');
  (0, _handleDom.addClass)($errorIcon, 'show');

  var $errorContainer = modal.querySelector('.form-group');
  (0, _handleDom.addClass)($errorContainer, 'has-error');

  $errorContainer.querySelector('.sa-help-text').innerHTML = errorMessage;

  setTimeout(function () {
    sweetAlert.enableButtons();
  }, 1);

  modal.querySelector('input').focus();
};

/*
 * Reset input error DOM elements
 */
sweetAlert.resetInputError = _swal.resetInputError = function (event) {
  // If press enter => ignore
  if (event && event.keyCode === 13) {
    return false;
  }

  var $modal = (0, _handleSwalDom.getModal)();

  var $errorIcon = $modal.querySelector('.sa-input-error');
  (0, _handleDom.removeClass)($errorIcon, 'show');

  var $errorContainer = $modal.querySelector('.form-group');
  (0, _handleDom.removeClass)($errorContainer, 'has-error');
};

/*
 * Disable confirm and cancel buttons
 */
sweetAlert.disableButtons = _swal.disableButtons = function (event) {
  var modal = (0, _handleSwalDom.getModal)();
  var $confirmButton = modal.querySelector('button.confirm');
  var $cancelButton = modal.querySelector('button.cancel');
  $confirmButton.disabled = true;
  $cancelButton.disabled = true;
};

/*
 * Enable confirm and cancel buttons
 */
sweetAlert.enableButtons = _swal.enableButtons = function (event) {
  var modal = (0, _handleSwalDom.getModal)();
  var $confirmButton = modal.querySelector('button.confirm');
  var $cancelButton = modal.querySelector('button.cancel');
  $confirmButton.disabled = false;
  $cancelButton.disabled = false;
};

if (typeof window !== 'undefined') {
  // The 'handle-click' module requires
  // that 'sweetAlert' was set as global.
  window.sweetAlert = window.swal = sweetAlert;
} else {
  (0, _utils.logStr)('SweetAlert is a frontend module!');
}

},{"./modules/default-params":1,"./modules/handle-click":2,"./modules/handle-dom":3,"./modules/handle-key":4,"./modules/handle-swal-dom":5,"./modules/set-params":7,"./modules/utils":8}]},{},[9]);

/*
 * Use SweetAlert with RequireJS
 */

if (typeof define === 'function' && define.amd) {
  define(function () {
    return sweetAlert;
  });
} else if (typeof module !== 'undefined' && module.exports) {
  module.exports = sweetAlert;
}

})(window, document);
/*=======================================================================================*/
/**
 *
 * @class Titan
 * @author edwinandeka@gmail.com.com (Edwin Ramiro Ospina Ruiz )
 * @date 08-jun-2015
 * @version 1.0
 *
 * @license Derechos Reservados de Autor (C) DOWESOFT (dowesoft.com)
 */

var Titan = {};
Titan.modules = {};
Titan.app = {};
Titan.global = {};

if (typeof APP_NAME != 'undefined') {
	Titan.host = '//'+location.host+'/' + APP_NAME;
}else {
	var APP_NAME = location.pathname.replace(/\//gmi, '');
	Titan.host = '//'+location.host + location.pathname;

	console.info('Por favor define "APP_NAME" el nombre de la app en el archivo main.js ');
}

/*=======================================================================================*/
/**
 *
 * @class Titan.modules
 * @author edwinandeka@gmail.com.com (Edwin Ramiro Ospina Ruiz )
 * @date 08-jun-2015
 * @version 1.0
 *
 * @license Derechos Reservados de Autor (C) DOWESOFT (dowesoft.com)
 */

Titan.modules.create = function (obj) {
	
	if ( 'name' in obj)
		Titan.modules[obj.name.capitalize()] = obj;
	else
		Titan.Message.error('No se resgistró un nombre "name" en el modulo');
	
};

Titan.loadSelect = function (select, data, column, column2) {
  
  for (var i = 0; i < data.length; i++) {
    var val = data[i];
    var name = val.name;

    if (column ) {
      name = val[column];
    }

    if (column && column2 ) {
      name = val[column] + ' ' +  val[column2] ;
    } 

    select.append('<option value="'+ val.id +'">' +name+'</option>');
  }

  var isMultiple = select.attr('click-select');

    if (isMultiple) {
      var height = select.find('option').length * ($(select.find('option')[0]).height() + 12);
      select.height(height)
    }

  select.find('option').mousedown(function(e) {
    e.preventDefault();
    if (!isMultiple) {
      select.find('option').prop('selected', false);
    }
    $(this).prop('selected', !$(this).prop('selected'));

    select.trigger('select');
    select.trigger('change');

    return false;
  });
  
};

/*=======================================================================================*/
/**
 *
 * @class Titan.lang
 * @author edwinandeka@gmail.com.com (Edwin Ramiro Ospina Ruiz )
 * @date 08-jun-2015
 * @version 1.0
 *
 * @license Derechos Reservados de Autor (C) DOWESOFT (dowesoft.com)
 */

Titan.lang = function () {
    
	var idiomaNavegador = new String;
	if (navigator.language){
		idiomaNavegador = navigator.language;
        // En este caso, el idioma devuelto puede contener el 
        // subcódigo de idioma (p.ej. "es-ES").
    } else {
  	     idiomaNavegador = navigator.browserLanguage;
        // En este caso, el idioma devuelto solo conteniene el 
        // código de idioma (p.ej. "es")
    }
  
    if (idiomaNavegador.contains('es'))
  	     return 'es';
    if (idiomaNavegador.contains('en'))
  	     return 'en';
    
    return idiomaNavegador;
};
/*=======================================================================================*/
/**
 *
 * @class Titan events
 * @author edwinandeka@gmail.com.com (Edwin Ramiro Ospina Ruiz )
 * @date 08-jun-2015
 * @version 1.0
 *
 * @license Derechos Reservados de Autor (C) DOWESOFT (dowesoft.com)
 */

Titan.click =  function ( obj, func, contex) {
	if (contex[obj]) {
		contex[obj].unbind('click').on('click', contex[func].bind(contex));
	}
};

Titan.keyup =  function ( obj, func, contex) {
	if (contex[obj]) {
		contex[obj].unbind('keyup').on('keyup', contex[func].bind(contex));
	}
};

Titan.keypress =  function ( obj, func, contex) {
	if (contex[obj]) {
		contex[obj].unbind('keypress').on('keypress', contex[func].bind(contex));
	}
};

Titan.change =  function ( obj, func, contex) {
	if (contex[obj]) {
		contex[obj].unbind('change').on('change', contex[func].bind(contex));
	}
};
/*=======================================================================================*/
/**
 * @author edwin.ospina@iptotal.com (Edwin Ramiro Ospina Ruiz )
 * @date 29-may-2014
 * @version 1.0
 *
 * @license Derechos Reservados de Autor (C) DOWESOFT (dowesoft.com)
 */
 Array.prototype.contains = function (element) {
 "use strict";
    return this.indexOf(element) > -1;
 };
/**
 *
 * @author edwin.ospina@iptotal.com (Edwin Ramiro Ospina Ruiz )
 * @date 29-may-2014
 * @version 1.0
 *
 * @license Derechos Reservados de Autor (C) DOWESOFT (dowesoft.com)
 */
 function create( obj ) {
 	return $.extend( {}, obj );;
 }
 String.prototype.contains = function(it) { return this.indexOf(it) != -1; };
 String.prototype.capitalize =  function() {
 	return this.charAt(0).toUpperCase() + this.slice(1).toLowerCase();
 }
 String.prototype.toName =  function() {
 	var arr = this.toLowerCase().split(' ');
 	var tem = '';
 	for(var i in arr) {
 		if (arr[i].capitalize) 
 		tem += arr[i].capitalize() + ' ';
 	}
 	return tem;
 }

 var ID = function () {
  // Math.random should be unique because of its seeding algorithm.
  // Convert it to base 36 (numbers + letters), and grab the first 9 characters
  // after the decimal.
  return '_' + Math.random().toString(36).substr(2, 9);
};


/*=======================================================================================*/
/**
 *
 * @class view
 * @author edwinandeka@gmail.com.com (Edwin Ramiro Ospina Ruiz )
 * @date 17-oct-2014
 * @version 1.0
 *
 * @license Derechos Reservados de Autor (C) doweSoft 
 * @name view
 * @description Inicializa los eventos que cargan el módulo
 * @param {string} module, nombre del módulo
 * @param {string} view, nombre de la vista a  cargar
 * @param {JQuery Object} containerId, objeto sobre el cual se cargará el modulo
 * @return {void} 
 */
 Titan.view = function(module, view, containerId, params) {


   var identifier = ID()

	/**
	 *
	 * @class Render
	 * @author edwinandeka@gmail.com.com (Edwin Ramiro Ospina Ruiz )
	 * @date 17-oct-2014
	 * @version 1.0
	 *
	 * @license Derechos Reservados de Autor (C) DOWESOFT (dowesoft.com)
	 */
	 var Render = {
		//servidor del cúal se cargará el módulo
		//host : 'http://localhost/frontend_directorio',
		host : Titan.host,
		//contenedor en el cúal se cargará el módulo
		container: null,
		//nombre del módulo
		module: '',
		/**
		 * @name view
		 * @description Inicializa los eventos que cargan el módulo
		 * @param {string} module, nombre del módulo
		 * @param {string} view, nombre de la vista a  cargar
		 * @param {JQuery Object} containerId, objeto sobre el cual se cargará el modulo
		 * @return {void} 
		 */
		 view: function  (module, view, containerId, params) {
		 	this.module = module;
		 	this.view = view;
		 	this.params = params || {};

      this.params.identifier = identifier

		 	if(containerId instanceof $){
		 		this.container = containerId;
		 	} else {

			 	if (typeof(containerId) == 'undefined') 
			 		this.container = $('#render');
			 	else
			 		this.container = $('#'+containerId);
			 }
		 	var d = new Date();
		 	this.time = d.getTime();
		 	this.loadhtml();	
		 },
		/**
		 * @name loadhtml
		 * @description Inicia la carga del html  del módulo
		 * @return {void} 
		 */
		 loadhtml: function  () {
		 	var a = $.get(this.host + '/modules/' + this.module + '/'+ this.view + '/' + this.view + '.html?'+ this.time, function(data) {
		 		this.container.html(data);
		 		var content = $('<div></div>');

		 		this.idContainerHtml = '' + this.module + '_' + this.view +'_module_container' + identifier;
		 		content.attr('id', this.idContainerHtml);
		 		content.addClass('module-container');

		 		for(var key in this.params)
		 			if(key != 'contains'){
		 				var exp = new RegExp('{{' + key + '}}', "gmi");
		 				data = data.replace(exp , this.params[key] );
		 			}


		 			content.append(data);
		 			this.container.html(content);
		 			this.container = content;
		 			//console.log("load html module: " + this.module);
		 		}.bind(this));
		 	a.fail(function(response) {
		 		console.log("error >>> ocurrió un error mientras se cargaba el html para el modulo " + this.module );
		 	});
		 	a.done(function(response) {
		 		this.loadcss();
		 	}.bind(this));
		 },
		/**
		 * @name loadcss
		 * @description Inicia la carga del css del módulo
		 * @return {void} 
		 */
		 loadcss: function  () {
		 	var url = this.host + '/modules/' + this.module + '/'+ this.view + '/' + this.view  + '.css?' + this.time;
		 	
		 	$.ajax({
		 		url: url,
		 		type:'get',
		 		success: function(cssContent) {
		 			var reg =  /[\.#\w\*][\.#\w\s-~:\n,_>\*\+\]\["\/=\^\$\(\)]*\{[\n\s\w-:#;%\d\(,\.\)"\*\/]*}/gmi;
		 			
		 			var cssArray = cssContent.match(reg);
		 			if (cssArray)
		 				for (var i = cssArray.length - 1; i >= 0; i--) {
		 					cssContent = cssContent.replace(cssArray[i], '#'+this.idContainerHtml + ' ' + cssArray[i]); 
		 				}

            $('#style-' + this.module + '-'+ this.view).remove()

		 				var s = document.createElement('style');
            s.setAttribute('type', 'text/css');
		 				s.setAttribute('id', 'style-' + this.module + '-'+ this.view );
		 				s.innerHTML = cssContent;
		 				document.getElementsByTagName("head")[0].appendChild(s);

		 			}.bind(this)
		 		});
		 	
		 	
		 	this.loadjs();
		 },
		/**
		 * @name loadjs
		 * @description Inicia la carga del js del módulo
		 * @return {void} 
		 */
		 loadjs: function  () {
		 	var url = this.host + '/modules/' + this.module + '/'+ this.view + '/' + this.view  + '.js?' + this.time;
		 	/*if (Titan.modules[this.view.capitalize()]) {

		 		Titan.modules[this.view.capitalize()].ready(this.params||{});
		 	};*/
		 	$.ajax({
		 		url: url,
		 		type:'HEAD',
		 		error: function() {
		 			/* Act on the event */
		 		},
		 		success: function() {
		 			var a = $.getScript(url);
		 			//console.log("load js : " + url);
		 			a.done(function(){
		 				function getFuntion(selector) {

		 					var component = this.main_container.find('' + selector);
		 					component.context = this;
		 					return component;
		 				}

		 				function getContainer() {
		 					return this.main_container;
		 				}
		 				
		 				var obj = Titan.modules[this.view.capitalize()];
		 				obj.main_container = this.container;
		 				obj.getContainer = getContainer;
		 				obj.main_container.css('height', '100%').css('width', '100%');
		 				obj.get = getFuntion;
		 				obj.params = this.params;
            obj.identifier = identifier
		 				

		 				if(!Titan.app[this.module])
		 					Titan.app[this.module] = {};
		 				if (this.view == 'crud') {
		 					Titan.app[this.module][this.view+'_'+this.params.id] = obj;
		 				}else{
		 					Titan.app[this.module][this.view] = obj;
		 				}


		 				if ( 'ready' in obj) {
		 					obj.params = this.params||{};

              /* enlazamos las variables desde el html con el atributo var */
              Titan.addEvents(obj.main_container, obj)
              
              obj.ready();

		 					if ( 'initEvents' in obj){
		 						obj.initEvents();	
		 					}
		 				} else {
		 					Titan.Message.error('No se resgistró un constructor "ready" en el modulo');
		 				}

		 				//localStorage.app = JSON.stringify(Titan.app);
				//delete this;
			}.bind(this));
		 		}.bind(this)
		 	});

		 },
		};
		var loadBots = [];
		var loadBot = create(Render);
		loadBot.view(module, view, containerId, params);
		loadBots.push(loadBot);
	};

 Titan.loadView = function(options){

    Titan.view(options.module, options.view, options.container, options.params)

 }
/**
 * linked the events to html whit the controller methods
 * @param  {jquery} container container of html
 * @param  {controller} obj       parent of jquery object
 * @return {void}           
 */
Titan.addEvents = (container, obj)=>{
  
 /* enlazamos las variables desde el html con el atributo var */
  var loadVars = container.find('[var]');

   $.each(loadVars, function(index, val) {
    var val = $(val);
    var data = val.attr('var');
    val.removeAttr('var')
    val.attr('id', data);
    obj[data] = val;
    val.data('parentController', obj)

  });


  /* enlazamos los eventos */
  var events = container.find('[on-change]');

   $.each(events, function(index, val) {
    var val = $(val);
    val.on('keyup', ()=> val.trigger('change'))
    var data = val.attr('on-change');
     val.on('change', function (event) {
      obj[data](val, val.val(), event);
    });
    val.data('parentController', obj)

  });


     /* enlazamos los eventos */
  var events = container.find('[on-select]');

   $.each(events, function(index, val) {
    var val = $(val);
    var data = val.attr('on-select');
     val.on('select', function (event) {
      obj[data](val, val.val(), event);
    });
    val.data('parentController', obj)

  });


  /* enlazamos los eventos */
  var events = container.find('[on-click]');
  
   $.each(events, function(index, val) {
    var val = $(val);

    var data = val.attr('on-click');
    val.on('click', function (event) {
      obj[data](val, event, parseInt(val.attr('data-index')));
    });
    val.data('parentController', obj)

  });
               

}

jQuery.fn.appendTitan = function (htmlTitan) {
  var $container = $(htmlTitan);
  $(this).append($container);
  Titan.addEvents($container, $(this).data().parentController)
};






/*=======================================================================================*/
/**
 * @class WebService
 * @author edwin.ospina@iptotal.com (Edwin Ramiro Ospina Ruiz )
 * @date 29-may-2014
 * @version 1.0
 *
 * @license Derechos Reservados de Autor (C) DOWESOFT (dowesoft.com)
 */
 var WebService = {
	//servidor hacia el que van dirigidas las peticiones
	host: '//'+location.host+ '/'+ APP_NAME +'/back/index.php',
	/**
	 * @name post
	 * @description Inicializa los eventos inicia reconstructMap que grafíca el mapa
	 * @param {String} webService , nombre del servicio web a consultar
	 * @param {object} params , data que se enviará al servidor ej: {id: 'EKA-1', username: 'edwin_eka'}
	 * @return {$Deferred}  
	 */
	 post: function  (params) {
	 	params.database_name = _database_name;

	 	if (Titan.token) {

			return 	$.ajax({
		 		url: this.host ,
		 		type: 'POST',
		 		beforeSend: function(request) {
				    request.setRequestHeader("token", Titan.token);
				    request.setRequestHeader("signature", Titan.signature);
				},
		 		dataType: 'json',
		 		data: params,
		 		
		 	}).always(function(data, status, request ){
		 		if (status == 'parsererror') {
		 			Titan.message.warning("Por favor contacte al Administrador", ('<pre>' + data.responseText+ '</pre>'));
		 			
		 		}else if (data.print_var) {
		 			Titan.message.warning("print_var",('<pre>' + data.print_var + '</pre>'));

		 		};
		 	});

	 	} else {
	 		// if (_database_name) {
 			// 	Titan.view('security', 'lock');
 			// }

	 		return 	$.ajax({
		 		url: this.host ,
		 		type: 'POST',
		 		success: function(data, textStatus, request){

		 			Titan.token = request.getResponseHeader('token');
		 			Titan.signature = request.getResponseHeader('signature');


			   	},

		 		dataType: 'json',
		 		data: params,
		 		
		 	}).always(function(data, status, request ){

		 		if (status == 'parsererror') {
		 			Titan.message.warning("Por favor contacte al Administrador", ('<pre>' + data.responseText+ '</pre>'));
		 			
		 		}else if (data.print_var) {
		 			Titan.message.warning("print_var",('<pre>' + data.print_var + '</pre>'));

		 		};
		 	});
	 	}

	 	
	 },
	 /**
	 * @name get
	 * @description 
	 * @param {String} webService , nombre del servicio web a consultar
	 * @param {String} type , tipo de respuesta que se espera del servidor 'default: Intelligent Guess (Other values: xml, json, script, or html)'
	 * @return {$Deferred}  
	 */
	 get: function  (webService, type) {
	 	return 	$.ajax({
	 		url: this.host + '/' + webService,
	 		type: 'GET',
	 		dataType: type,
	 		data: params,
	 	});
	 },

	 cmd: function  (params) {
	 	return 	$.ajax({
	 		url: this.host ,
	 		type: 'POST',
	 		dataType: 'text',
	 		data: params,
	 	});
	 },
	};
/*=======================================================================================*/
/**
 *
 * @class Titan.message
 * @author edwinandeka@gmail.com.com (Edwin Ramiro Ospina Ruiz )
 * @date 08-jun-2015
 * @version 1.0
 *
 * @license Derechos Reservados de Autor (C) DOWESOFT (dowesoft.com)
 */

Titan.message = {

	/**
	 * crea un dialogo modal de bootstrap tipo info 
	 * @param  {string} title titulo del dialogo
	 * @param  {string} body  mensaje del dialogo
	 * @return {void}       
	 */
	info: function (title, body) {
		// swal(title, body, "info");
		Titan.Dialog.create('info', title, body);
		
		
	},

	/**
	 * crea un dialogo modal de bootstrap tipo info 
	 * @param  {string} title titulo del dialogo
	 * @param  {string} body  mensaje del dialogo
	 * @return {void}       
	 */
	warning: function (title, body) {
		// swal(title, body, "warning");
		Titan.Dialog.create('warning', title, body);


	},

	/**
	 * crea un dialogo modal de bootstrap tipo info 
	 * @param  {string} title titulo del dialogo
	 * @param  {string} body  mensaje del dialogo
	 * @return {void}       
	 */
	error: function (title, body) {
		// swal(title, body, "error");
		Titan.Dialog.create('error', title, body);

	},

	/**
	 * crea un dialogo modal de bootstrap tipo info 
	 * @param  {string} title titulo del dialogo
	 * @param  {string} body  mensaje del dialogo
	 * @return {void}       
	 */
	success: function (title, body) {
		Titan.Dialog.create('success', title, body);
		// swal(title, body, "success");
	},

	/**
	 * crea un dialogo modal de bootstrap tipo info 
	 * @param  {string} title titulo del dialogo
	 * @param  {string} body  mensaje del dialogo
	 * @return {void}       
	 */
	primary: function (title, body) {
		Titan.Dialog.create('primary', title, body);
	},

	/**
	 * crea un mensaje de confirmacion
	 * @param  {string} title titulo del dialogo
	 * @param  {string} body  mensaje del dialogo
	 * @param  {Function} callback funcion que se ejecutará en caso de aceptar
	 * @param  {object}   context  contexto de la funcion callback
	 * @param  {string}   btnYes   texto del boton ok
	 * @param  {string}   btnNO    texto del boton cancel
	 * @return {void}            
	 */
	confirmation: function (title, body, callback, context,btnYes, btnNO) {
		Titan.Dialog.create('primary', title, body, callback,context,btnYes, btnNO);
		// swal({
		//   title: title,
		//   text: body,
		//   type: "info",
		//   showCancelButton: true,
		//   confirmButtonClass: "btn-primary",
		//   confirmButtonText: btnYes,
  // 		  cancelButtonText: btnNO,
		//   closeOnConfirm: false,
  // 		  showLoaderOnConfirm: true
		// }, callback.bind(context));
	},

	confirmationModal: function (title, body, callback, context,btnYes, btnNO) {
		Titan.Dialog.create('primary', title, body, callback,context,btnYes, btnNO);
		
	},
}; 


/**
 *
 * @class Titan.Dialog
 * @author edwinandeka@gmail.com.com (Edwin Ramiro Ospina Ruiz )
 * @date 08-jun-2015
 * @version 1.0
 *
 * @license Derechos Reservados de Autor (C) DOWESOFT (dowesoft.com)
 */

Titan.Dialog = {

	/**
	 * crea un mensaje generico con los parámetros pasados a la funcion create
	 * @param  {string} title titulo del dialogo
	 * @param  {string} body  mensaje del dialogo
	 * @param  {Function} callback funcion que se ejecutará en caso de aceptar
	 * @param  {object}   context  contexto de la funcion callback
	 * @param  {string}   btnYes   texto del boton ok
	 * @param  {string}   btnNO    texto del boton cancel
	 * @return {void}            
	 */
	create : function (classCss, title, body, callback, context,btnYes, btnNO) {
		
		var html =	'<div  class="modal fade" id="titan-message-modal-id" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" data-backdrop="static">'+
		'<div class="modal-dialog">'+
		'<div class="modal-content">'+
		'<div class="modal-header ' + ((classCss)? classCss: '') + '">'+
		'<button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>'+
		'<h4 class="modal-title">' + ((title)? title: '' ) + '</h4>'+
		'</div>'+
		'<div class="modal-body">'+
		((body)? body: '' ) +
		'</div>'+
		'<div class="modal-footer">'+
		((callback)? '<button type="button" class="btn btn-default" data-dismiss="modal">' + ((btnNO)? btnNO : 'Cancelar' ) + ' </button>': '' ) +
		'<button type="button" id="titan-message-modal-ok" data-dismiss="modal" class="btn btn-default" >' + ((btnYes)? btnYes : 'Aceptar' ) + '</button>'+
		'</div>'+
		'</div><!-- /.modal-content -->'+
		'</div><!-- /.modal-dialog -->'+
		'</div><!-- /.modal -->';

		/*
			valida si se ha creado antes el contenedor de mensajes, de no ser asi lo crea
		 */
		var container = $('div#titan-message');
		if (container.length > 0) {
			container.html(html);
			$('#titan-message-modal-id').modal('show');
		} else{
			var container = $('<div id="titan-message"></div>');
			$('body').append(container);
			var container = $('div#titan-message');
			container.html(html);
			$('#titan-message-modal-id').modal('show');
		}

		//enciende el evento en caso de existir
		if (callback) {
			$('#titan-message-modal-ok').off('click').on('click', (context)? callback.bind(context) : callback );
		};
	}
};
/*=======================================================================================*/
Titan.popup = {
	success: function ( body, time) {
		Titan.PopupC.create('success', 'success', body, 'ok', time);
	},
	info: function ( body, time) {
		Titan.PopupC.create('info', 'info', body, 'info-sign', time);
	},
	warning: function (body, time) {
		Titan.PopupC.create('warning', 'warning', body, 'warning-sign', time);
	},
	danger: function ( body, time) {
		Titan.PopupC.create('danger', 'danger', body, 'fire', time);
	},
	error: function ( body, time) {
		Titan.PopupC.create('danger', 'danger', body, 'fire', time);
	},
}; 
Titan.PopupC = {
	create : function (classCss, title, body, icon, time ) {
		var html =	'<div class=" alert alert-' + classCss + ' alert-dismissible" role="alert">'+
		'<button type="button" class="close" data-dismiss="alert"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>'+
		'<strong>' +((icon)? '<span class="glyphicon glyphicon-' + icon + '"></span> ':' ') + title + '</strong> ' + body +
		'</div></br>';
		time = time || 4000;
		var container = $('div#titan-popup');
		if (container.length > 0) {
			var alert = $(html);
			container.append(alert);
			alert.effect('slide');
			if (time)
				setTimeout(function(){alert.effect('fold', function () {
					alert.remove();
					container.find('.ui-effects-wrapper').remove();
			});}, time);
		} else{
			var container = $('<div id="titan-popup"></div>');
			container.show();
			$('body').append(container);
			var container = $('div#titan-popup');
			var alert = $(html);
			container.append(alert);
			alert.effect('slide');
			if (time)
				setTimeout(function(){alert.effect('fold', function () {
					alert.remove();

					container.find('.ui-effects-wrapper').remove();
				});}, time);
		}
	}
};
/*=======================================================================================*/
/**
 *
 * @class Titan Validate
 * @author edwinandeka@gmail.com.com (Edwin Ramiro Ospina Ruiz )
 * @date 08-jun-2015
 * @version 1.0
 *
 * @license Derechos Reservados de Autor (C) DOWESOFT (dowesoft.com)
 */

Titan.validate = {

 	number: {
		expression  : /^\d+$/, /*solo numeros,*/
		message     : 'El valor debe ser un número.'
	},
	decimal: {
		expression: /^(\d+\.?\d*|\.\d+)$/,
		message: 'El valor debe ser decimal.'
	},
	email: {
		expression  : /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/, 
		message     : 'El valor debe ser un email "ejemplo@gmail.com"'
	},
	letter: {
		expression  : /^([a-z])*$/, /*solo letras a - z en minuscula*/
		message     : 'solo letras en minúscula.'
	},
	letter_upper: {
		expression  : /^([A-Z])*$/,  /*solo letras A -Z en mayuscula,*/
		message     : 'solo letras en mayúscula.'
	},
	url: {
		expression  : /^(ht|f)tp(s?)\:\/\/[0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*(:(0-9)*)*(\/?)( [a-zA-Z0-9\-\.\?\,\'\/\\\+&%\$#_]*)?$/,
		message     : 'ejemplo: http://www.iptotal.com'
	},
	date: {
		expression  : /^\d{1,2}\/\d{1,2}\/\d{2,4}$/,/*año/mes/dia*/
		message     : 'año/mes/día'
	},
	time: {
		expression  : /^(0[1-9]|1\d|2[0-3]):([0-5]\d):([0-5]\d)$/,/*hora/minutos/segundos*/
		message     : 'hora/minutos/segundos'
	},
	phone : {
		expression  : /^[0-9]{2,3}-? ?[0-9]{6,7}$/,
		message     : 'El valor debe contener 10 dígitos.'
	},
	ip : {
		expression  : /\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b/,
		message     : 'No cumple con el formato 0.0.0.0'
	},
	mac: {
		expression: /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/,
		message: 'No cumple con el formato FF:FF:FF:FF:FF:FF'
	},
	empty : {
		expression  : /^[a-z_ ]+$/img,/*validación campos vacios*/
		message     : 'El valor debe ser Alfabetico.'
	},
	password : {
		expression  : '',/*validación campos vacios*/
		message     : 'El valor no debe ser vacío.'
	},
	spaces : {
		expression  :  /^[a-zA-Z0-9]+$/,/*validación para los espacios en blanco.*/
		message     : 'El valor no debe contener espacios en blanco.'
	},
	text : {
		expression  :  /^[\n\r]|.$/,/*validación de texto alfanumerico.*/
		message     : 'El valor solo debe contener datos Alfanuméricos.'
	}
};
