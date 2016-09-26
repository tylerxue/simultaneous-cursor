/*
* simultaneous-cursor 1.0.1 - jQuery plugin
* http://tryaosoft.com/demo/simultaneous-cursor/
*
* Copyright (c) 2016 Tyler (tryaosoft1222@hotmail.com)
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
    var panels = [];	// an array to store panels

    $.fn.simultaneousCursors = function (event, options) {

        //Fallback if there is no event but there are options 
        if (typeof (event) === 'string') {
            // handle functions like stop or resume simultaneousCursors
            event = event.toLowerCase();
            switch (event) {
                case 'off':
                case 'stop':
                    isInit && deactivate();
                    return;
                case 'on':
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
                case 'restart':
                    isInit && deactivate();
                    preparePanels(this);
                    activate();
                    isInit = true;
                    return;
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

        function preparePanels(that) {

            cursors = [];
            $('img').remove('.simultaneous-cursor');

            panels = $(that).each(function (i, o) {
                var c = cursor.clone();
                var ii = i + 1;
                $('body').append(c);
                var row = Math.ceil(ii / settings.matrix.rows);
                var col = (ii % settings.matrix.rows) || settings.matrix.cols;
                c.matrix = { row: row, col: col };
                cursors.push(c);
                o.matrix = c.matrix;
            });

            return;
        }
        preparePanels(this);

        function activate() {
            panels.mouseenter(function (e) {
                var that = this;
                cursors.forEach(function (c) {
                    try {
                        if (!(c.matrix.row == that.matrix.row && c.matrix.col == that.matrix.col))
                            c.css('display', 'block');
                    } catch (err) {
                        console.error(err);
                    }
                });

                this.eventMatrix = e.target.matrix;
            }).mouseleave(function () {
                cursors.forEach(function (c) {
                    c.css('display', 'none');
                });
            }).mousemove(function (e) {
                var that = this;
                cursors.forEach(function (c) {
                    try {
                        var xOffset = (c.matrix.col - that.matrix.col) * settings.horizontalOffset;
                        var yOffset = (c.matrix.row - that.matrix.row) * settings.verticalOffset;
                    } catch (err) {
                        console.error(err);
                    }
                    c.css('left', e.clientX + xOffset);
                    c.css('top', e.clientY + yOffset);
                });
            });
        }

        function deactivate() {
            panels.off();
        }

        isInit = true;
        if (toAutorun) {
            activate();
        }
    };

})(jQuery);
