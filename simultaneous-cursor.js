/*
* simultaneous-cursor 1.0.0 - jQuery plugin
* http://tryaosoft.com/demo/simultaneous-cursor/
*
* Copyright (c) 2016 Tyler Xue
* Licensed under the MIT (MIT-LICENSE.txt)
*
*/

(function ($) {
	'use strict';

	var settings = {
		matrix: { rows: 3, cols: 3 },
		verticalOffset: 320,
		horizontalOffset: 320,
		cursorImage: 'simultaneous-cursor.png',
	};

	var isInit = false;
	var toAutorun = false;
	var cursor;			// jquery dom of cursor
	var cursors = [];	// an array to store doms of cursors
	var eMatrix = {};	// the matrix(row number and column number) of current event source
	var panels = [];	// an array to store panels

	$.fn.simultaneousCursors = function (event, options) {

		//Fallback if there is no event but there are options 
		if (typeof (event) === 'string' && !options) {
			// handle functions like stop or resume simultaneousCursors
			event = event.toLowerCase();
			switch (event) {
				case 'stop':
					isInit && deactivate();
					return;
				case 'resume':
				case 'restart':
				case 'start':
				case 'auto':
					if (isInit) {
						activate();
						return;
					}
					else {
						toAutorun = true
						break;
					}
			}
		}
		else if (typeof (event) === 'object' && options === void 0) {
			options = event;
		} 

		settings = $.extend(settings, options);

		cursor = $("<img>", {
			"class": "simultaneous-cursor",
			src: settings.cursorImage,
			click: function () { }
		})

		panels = $(this).each(function (i, o) {
			var c = cursor.clone();
			var ii = i + 1;
			c.appendTo(o);
			var row = Math.ceil(ii / settings.matrix.rows);
			var col = (ii % settings.matrix.rows) || 3;
			c.matrix = { row: row, col: col };
			cursors.push(c);
			o.matrix = c.matrix;
		});

		function activate() {
			panels.mouseenter(function (e) {
				cursors.forEach(function (c) {
					if (!(c.matrix.row == e.target.matrix.row && c.matrix.col == e.target.matrix.col))
						c.css('display', 'block');
				});

				eMatrix = e.target.matrix;
			}).mouseleave(function () {
				cursors.forEach(function (c) {
					c.css('display', 'none');
				});
			}).mousemove(function (e) {
				onMousemove(e);
			});
		}
		function deactivate() {
			panels.off();
		}
		function onMousemove(e) {
			cursors.forEach(function (c) {
				var xOffset = (c.matrix.col - eMatrix.col) * settings.horizontalOffset;
				var yOffset = (c.matrix.row - eMatrix.row) * settings.verticalOffset;

				c.css('left', e.clientX + xOffset);
				c.css('top', e.clientY + yOffset);
			});
		}

		isInit = true;
		toAutorun && activate();
	};

})(jQuery);
