﻿; (function($) {
    if (!dateFormat || typeof (dateFormat) != "function") {
        var dateFormat = function(format) {
            var o = {
                "M+": this.getMonth() + 1,
                "d+": this.getDate(),
                "h+": this.getHours(),
                "H+": this.getHours(),
                "m+": this.getMinutes(),
                "s+": this.getSeconds(),
                "q+": Math.floor((this.getMonth() + 3) / 3),
                "w": "0123456".indexOf(this.getDay()),
                "S": this.getMilliseconds()
            };
            if (/(y+)/.test(format)) {
                format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
            }
            for (var k in o) {
                if (new RegExp("(" + k + ")").test(format))
                    format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
            }
            return format;
        };
    }
    if (!DateAdd || typeof (DateDiff) != "function") {
        var DateAdd = function(interval, number, idate) {
            number = parseInt(number);
            var date;
            if (typeof (idate) == "string") {
                date = idate.split(/\D/);
                eval("var date = new Date(" + date.join(",") + ")");
            }
            if (typeof (idate) == "object") {
                date = new Date(idate.toString());
            }
            switch (interval) {
                case "y": date.setFullYear(date.getFullYear() + number); break;
                case "m": date.setMonth(date.getMonth() + number); break;
                case "d": date.setDate(date.getDate() + number); break;
                case "w": date.setDate(date.getDate() + 7 * number); break;
                case "h": date.setHours(date.getHours() + number); break;
                case "n": date.setMinutes(date.getMinutes() + number); break;
                case "s": date.setSeconds(date.getSeconds() + number); break;
                case "l": date.setMilliseconds(date.getMilliseconds() + number); break;
            }
            return date;
        }
    }
    if (!DateDiff || typeof (DateDiff) != "function") {
        var DateDiff = function(interval, d1, d2) {
            switch (interval) {
                case "d": //date
                case "w":
                    d1 = new Date(d1.getFullYear(), d1.getMonth(), d1.getDate());
                    d2 = new Date(d2.getFullYear(), d2.getMonth(), d2.getDate());
                    break;  //w
                case "h":
                    d1 = new Date(d1.getFullYear(), d1.getMonth(), d1.getDate(), d1.getHours());
                    d2 = new Date(d2.getFullYear(), d2.getMonth(), d2.getDate(), d2.getHours());
                    break; //h
                case "n":
                    d1 = new Date(d1.getFullYear(), d1.getMonth(), d1.getDate(), d1.getHours(), d1.getMinutes());
                    d2 = new Date(d2.getFullYear(), d2.getMonth(), d2.getDate(), d2.getHours(), d2.getMinutes());
                    break;
                case "s":
                    d1 = new Date(d1.getFullYear(), d1.getMonth(), d1.getDate(), d1.getHours(), d1.getMinutes(), d1.getSeconds());
                    d2 = new Date(d2.getFullYear(), d2.getMonth(), d2.getDate(), d2.getHours(), d2.getMinutes(), d2.getSeconds());
                    break;
            }
            var t1 = d1.getTime(), t2 = d2.getTime();
            var diff = NaN;
            switch (interval) {
                case "y": diff = d2.getFullYear() - d1.getFullYear(); break; //y
                case "m": diff = (d2.getFullYear() - d1.getFullYear()) * 12 + d2.getMonth() - d1.getMonth(); break;    //m
                case "d": diff = Math.floor(t2 / 86400000) - Math.floor(t1 / 86400000); break;
                case "w": diff = Math.floor((t2 + 345600000) / (604800000)) - Math.floor((t1 + 345600000) / (604800000)); break; //w
                case "h": diff = Math.floor(t2 / 3600000) - Math.floor(t1 / 3600000); break; //h
                case "n": diff = Math.floor(t2 / 60000) - Math.floor(t1 / 60000); break; //
                case "s": diff = Math.floor(t2 / 1000) - Math.floor(t1 / 1000); break; //s
                case "l": diff = t2 - t1; break;
            }
            return diff;

        }
    }

    var userAgent = window.navigator.userAgent.toLowerCase();
    //不再支持ie6\7\8
    // $.browser.msie8 = false;
    // $.browser.msie7 = false;
    // $.browser.msie6 = false;
    if ($.fn.noSelect == undefined) {
        $.fn.noSelect = function(p) { //no select plugin by me :-)
            if (p == null)
                prevent = true;
            else
                prevent = p;
            if (prevent) {
                return this.each(function() {
                    if ($.browser.msie || $.browser.safari) $(this).bind('selectstart', function() { return false; });
                    else if ($.browser.mozilla) {
                        $(this).css('MozUserSelect', 'none');
                        $('body').trigger('focus');
                    }
                    else if ($.browser.opera) $(this).bind('mousedown', function() { return false; });
                    else $(this).attr('unselectable', 'on');
                });

            } else {
                return this.each(function() {
                    if ($.browser.msie || $.browser.safari) $(this).unbind('selectstart');
                    else if ($.browser.mozilla) $(this).css('MozUserSelect', 'inherit');
                    else if ($.browser.opera) $(this).unbind('mousedown');
                    else $(this).removeAttr('unselectable', 'on');
                });

            }
        }; //end noSelect
    };
    $.fn.datepicker = function(o) {
        var def = {
            weekStart: 0,
            weekName: [i18n.datepicker.dateformat.sun, i18n.datepicker.dateformat.mon, i18n.datepicker.dateformat.tue, i18n.datepicker.dateformat.wed, i18n.datepicker.dateformat.thu, i18n.datepicker.dateformat.fri, i18n.datepicker.dateformat.sat], //week language support
            monthName: [i18n.datepicker.dateformat.jan, i18n.datepicker.dateformat.feb, i18n.datepicker.dateformat.mar, i18n.datepicker.dateformat.apr, i18n.datepicker.dateformat.may, i18n.datepicker.dateformat.jun, i18n.datepicker.dateformat.jul, i18n.datepicker.dateformat.aug, i18n.datepicker.dateformat.sep, i18n.datepicker.dateformat.oct, i18n.datepicker.dateformat.nov, i18n.datepicker.dateformat.dec],
            monthp: i18n.datepicker.dateformat.postfix,
            Year: new Date().getFullYear(), //default year
            Month: new Date().getMonth() + 1, //default month
            Day: new Date().getDate(), //default date
            today: new Date(),
            btnOk: i18n.datepicker.ok,
            btnCancel: i18n.datepicker.cancel,
            btnToday: i18n.datepicker.today,
            inputDate: null,
            onReturn: false,
            version: "1.1",
            applyrule: false, //function(){};return rule={startdate,endate};
            showtarget: null,
            picker: ""
        };
        $.extend(def, o);
        var cp = $("#BBIT_DP_CONTAINER");
        if (cp.length == 0) {
            var cpHA = [];
            cpHA.push("<div id='BBIT_DP_CONTAINER' class='bbit-dp' style='width:175px;z-index:999;'>");
            if ($.browser.msie6) {
                cpHA.push('<iframe style="position:absolute;z-index:-1;width:100%;height:205px;top:0;left:0;scrolling:no;" frameborder="0" src="about:blank"></iframe>');
            }
            cpHA.push("<table class='dp-maintable' cellspacing='0' cellpadding='0' style='width:175px;'><tbody><tr><td>");
            //caption bar goes here
            cpHA.push("<table class='bbit-dp-top' cellspacing='0'><tr><td class='bbit-dp-top-left'> <a id='BBIT_DP_LEFTBTN' href='javascript:void(0);' title='", i18n.datepicker.prev_month_title, "'>&nbsp;</a></td><td class='bbit-dp-top-center' align='center'><em><button id='BBIT_DP_YMBTN'></button></em></td><td class='bbit-dp-top-right'><a id='BBIT_DP_RIGHTBTN' href='javascript:void(0);' title='", i18n.datepicker.next_month_title, "'>&nbsp;</a></td></tr></table>");
            cpHA.push("</td></tr>");
            cpHA.push("<tr><td>");
            //week 
            cpHA.push("<table id='BBIT_DP_INNER' class='bbit-dp-inner' cellspacing='0'><thead><tr>");
            //calculat for week
            for (var i = def.weekStart, j = 0; j < 7; j++) {
                cpHA.push("<th><span>", def.weekName[i], "</span></th>");
                if (i == 6) { i = 0; } else { i++; }
            }
            cpHA.push("</tr></thead>");
            //to generat tBody, everything need to rebuilt
            cpHA.push("<tbody></tbody></table>");
            //end tbody
            cpHA.push("</td></tr>");
            cpHA.push("<tr><td class='bbit-dp-bottom' align='center'><button id='BBIT-DP-TODAY'>", def.btnToday, "</button></td></tr>");
            cpHA.push("</tbody></table>");
            //for drop down to select year & month
            cpHA.push("<div id='BBIT-DP-MP' class='bbit-dp-mp'  style='z-index:auto;'><table id='BBIT-DP-T' style='width: 175px; height: 193px' border='0' cellspacing='0'><tbody>");
            cpHA.push("<tr>");
            //tow buttons for Jan & Jul
            cpHA.push("<td class='bbit-dp-mp-month' xmonth='0'><a href='javascript:void(0);'>", def.monthName[0], "</a></td><td class='bbit-dp-mp-month bbit-dp-mp-sep' xmonth='6'><a href='javascript:void(0);'>", def.monthName[6], "</a></td><td class='bbit-dp-mp-ybtn' align='middle'><a id='BBIT-DP-MP-PREV' class='bbit-dp-mp-prev'></a></td><td class='bbit-dp-mp-ybtn' align='middle'><a id='BBIT-DP-MP-NEXT' class='bbit-dp-mp-next'></a></td>");
            cpHA.push("</tr>");
            cpHA.push("<tr>");
            cpHA.push("<td class='bbit-dp-mp-month' xmonth='1'><a href='javascript:void(0);'>", def.monthName[1], "</a></td><td class='bbit-dp-mp-month bbit-dp-mp-sep' xmonth='7'><a href='javascript:void(0);'>", def.monthName[7], "</a></td><td class='bbit-dp-mp-year'><a href='javascript:void(0);'></a></td><td class='bbit-dp-mp-year'><a href='javascript:void(0);'></a></td>");
            cpHA.push("</tr>");
            cpHA.push("<tr>");
            cpHA.push("<td class='bbit-dp-mp-month' xmonth='2'><a href='javascript:void(0);'>", def.monthName[2], "</a></td><td class='bbit-dp-mp-month bbit-dp-mp-sep' xmonth='8'><a href='javascript:void(0);'>", def.monthName[8], "</a></td><td class='bbit-dp-mp-year'><a href='javascript:void(0);'></a></td><td class='bbit-dp-mp-year'><a href='javascript:void(0);'></a></td>");
            cpHA.push("</tr>");
            cpHA.push("<tr>");
            cpHA.push("<td class='bbit-dp-mp-month' xmonth='3'><a href='javascript:void(0);'>", def.monthName[3], "</a></td><td class='bbit-dp-mp-month bbit-dp-mp-sep' xmonth='9'><a href='javascript:void(0);'>", def.monthName[9], "</a></td><td class='bbit-dp-mp-year'><a href='javascript:void(0);'></a></td><td class='bbit-dp-mp-year'><a href='javascript:void(0);'></a></td>");
            cpHA.push("</tr>");

            cpHA.push("<tr>");
            cpHA.push("<td class='bbit-dp-mp-month' xmonth='4'><a href='javascript:void(0);'>", def.monthName[4], "</a></td><td class='bbit-dp-mp-month bbit-dp-mp-sep' xmonth='10'><a href='javascript:void(0);'>", def.monthName[10], "</a></td><td class='bbit-dp-mp-year'><a href='javascript:void(0);'></a></td><td class='bbit-dp-mp-year'><a href='javascript:void(0);'></a></td>");
            cpHA.push("</tr>");

            cpHA.push("<tr>");
            cpHA.push("<td class='bbit-dp-mp-month' xmonth='5'><a href='javascript:void(0);'>", def.monthName[5], "</a></td><td class='bbit-dp-mp-month bbit-dp-mp-sep' xmonth='11'><a href='javascript:void(0);'>", def.monthName[11], "</a></td><td class='bbit-dp-mp-year'><a href='javascript:void(0);'></a></td><td class='bbit-dp-mp-year'><a href='javascript:void(0);'></a></td>");
            cpHA.push("</tr>");
            cpHA.push("<tr class='bbit-dp-mp-btns'>");
            cpHA.push("<td colspan='4'><button id='BBIT-DP-MP-OKBTN' class='bbit-dp-mp-ok'>", def.btnOk, "</button><button id='BBIT-DP-MP-CANCELBTN' class='bbit-dp-mp-cancel'>", def.btnCancel, "</button></td>");
            cpHA.push("</tr>");

            cpHA.push("</tbody></table>");
            cpHA.push("</div>");
            cpHA.push("</div>");

            var s = cpHA.join("");
            $(document.body).append(s);
            cp = $("#BBIT_DP_CONTAINER");

            initevents();
        }
        function initevents() {
            //1 today btn;
            $("#BBIT-DP-TODAY").click(returntoday);
            cp.click(returnfalse);
            $("#BBIT_DP_INNER tbody").click(tbhandler);
            $("#BBIT_DP_LEFTBTN").click(prevm);
            $("#BBIT_DP_RIGHTBTN").click(nextm);
            $("#BBIT_DP_YMBTN").click(showym);
            $("#BBIT-DP-MP").click(mpclick).dblclick(mpdblclick);

            $("#BBIT-DP-MP-PREV").click(mpprevy);
            $("#BBIT-DP-MP-NEXT").click(mpnexty);
            $("#BBIT-DP-MP-OKBTN").click(mpok);
            $("#BBIT-DP-MP-CANCELBTN").click(mpcancel);
        }
        function mpcancel() {
            $("#BBIT-DP-MP").animate({ top: -193 }, { duration: 200, complete: function() { $("#BBIT-DP-MP").hide(); } });
            return false;
        }
        function mpok() {
            def.Year = def.cy;
            def.Month = def.cm + 1;
            def.Day = 1;
            $("#BBIT-DP-MP").animate({ top: -193 }, { duration: 200, complete: function() { $("#BBIT-DP-MP").hide(); } });
            writecb();
            return false;
        }
        function mpprevy() {
            var y = def.ty - 10
            def.ty = y;
            rryear(y);
            return false;
        }
        function mpnexty() {
            var y = def.ty + 10
            def.ty = y;
            rryear(y);
            return false;
        }
        function rryear(y) {
            var s = y - 4;
            var ar = [];
            for (var i = 0; i < 5; i++) {
                ar.push(s + i);
                ar.push(s + i + 5);
            }
            $("#BBIT-DP-MP td.bbit-dp-mp-year").each(function(i) {
                if (def.Year == ar[i]) {
                    $(this).addClass("bbit-dp-mp-sel");
                }
                else {
                    $(this).removeClass("bbit-dp-mp-sel");
                }
                $(this).html("<a href='javascript:void(0);'>" + ar[i] + "</a>").attr("xyear", ar[i]);
            });
        }
        function mpdblclick(e) {
            var et = e.target || e.srcElement;
            var td = getTd(et);
            if (td == null) {
                return false;
            }
            if ($(td).hasClass("bbit-dp-mp-month") || $(td).hasClass("bbit-dp-mp-year")) {
                mpok(e);
            }
            return false;
        }
        function mpclick(e) {
            var panel = $(this);
            var et = e.target || e.srcElement;
            var td = getTd(et);
            if (td == null) {
                return false;
            }
            if ($(td).hasClass("bbit-dp-mp-month")) {
                if (!$(td).hasClass("bbit-dp-mp-sel")) {
                    var ctd = panel.find("td.bbit-dp-mp-month.bbit-dp-mp-sel");
                    if (ctd.length > 0) {
                        ctd.removeClass("bbit-dp-mp-sel");
                    }
                    $(td).addClass("bbit-dp-mp-sel")
                    def.cm = parseInt($(td).attr("xmonth"));
                }
            }
            if ($(td).hasClass("bbit-dp-mp-year")) {
                if (!$(td).hasClass("bbit-dp-mp-sel")) {
                    var ctd = panel.find("td.bbit-dp-mp-year.bbit-dp-mp-sel");
                    if (ctd.length > 0) {
                        ctd.removeClass("bbit-dp-mp-sel");
                    }
                    $(td).addClass("bbit-dp-mp-sel")
                    def.cy = parseInt($(td).attr("xyear"));
                }
            }
            return false;
        }
        function showym() {
            var mp = $("#BBIT-DP-MP");
            var y = def.Year;
            def.cy = def.ty = y;
            var m = def.Month - 1;
            def.cm = m;
            var ms = $("#BBIT-DP-MP td.bbit-dp-mp-month");
            for (var i = ms.length - 1; i >= 0; i--) {
                var ch = $(ms[i]).attr("xmonth");
                if (ch == m) {
                    $(ms[i]).addClass("bbit-dp-mp-sel");
                }
                else {
                    $(ms[i]).removeClass("bbit-dp-mp-sel");
                }
            }
            rryear(y);
            mp.css("top", -193).show().animate({ top: 0 }, { duration: 200 });
        }
        function getTd(elm) {
            if (elm.tagName.toUpperCase() == "TD") {
                return elm;
            }
            else if (elm.tagName.toUpperCase() == "BODY") {
                return null;
            }
            else {
                var p = $(elm).parent();
                if (p.length > 0) {
                    if (p[0].tagName.toUpperCase() != "TD") {
                        return getTd(p[0]);
                    }
                    else {
                        return p[0];
                    }
                }
            }
            return null;
        }
        function tbhandler(e) {
            var et = e.target || e.srcElement;
            var td = getTd(et);
            if (td == null) {
                return false;
            }
            var $td = $(td);
            if (!$(td).hasClass("bbit-dp-disabled")) {
                var s = $td.attr("xdate");              
                cp.data("indata",stringtodate(s));
                returndate();
            }
            return false;
        }
        function returnfalse() {
            return false;
        }

        function stringtodate(datestr) {
            try
            {
                var arrs = datestr.split(i18n.datepicker.dateformat.separator);
                var year = parseInt(arrs[i18n.datepicker.dateformat.year_index]);
                var month = parseInt(arrs[i18n.datepicker.dateformat.month_index]) - 1;
                var day = parseInt(arrs[i18n.datepicker.dateformat.day_index]);
                return new Date(year, month, day);
            }
            catch(e)
            {
             return null;
            }
        }
        function prevm() {
            if (def.Month == 1) {
                def.Year--;
                def.Month = 12;
            }
            else {
                def.Month--
            }
            writecb();
            return false;
        }
        function nextm() {
            if (def.Month == 12) {
                def.Year++;
                def.Month = 1;
            }
            else {
                def.Month++
            }
            writecb();
            return false;
        }
        function returntoday() {
            cp.data("indata", new Date());
            returndate();
        }
        function returndate() {
            var ct = cp.data("ctarget");
            var ck = cp.data("cpk");
            var re = cp.data("onReturn");
            var ndate = cp.data("indata")
            var ads = cp.data("ads");
            var ade = cp.data("ade");
            var dis = false;
            if (ads && ndate < ads) {
                dis = true;
            }
            if (ade && ndate > ade) {
                dis = true;
            }
            if (dis) {
                return;
            }
            if (re && jQuery.isFunction(re)) {
                re.call(ct[0], cp.data("indata"));
            }
            else {
                ct.val(dateFormat.call(cp.data("indata"), i18n.datepicker.dateformat.fulldayvalue));
            }
            ck.attr("isshow", "0");
            cp.removeData("ctarget").removeData("cpk").removeData("indata").removeData("onReturn")
            .removeData("ads").removeData("ade");
            cp.css("visibility", "hidden");
            ct = ck = null;
        }
        function writecb() {
            var tb = $("#BBIT_DP_INNER tbody");
            $("#BBIT_DP_YMBTN").html(def.monthName[def.Month - 1] + def.monthp + " " + def.Year);
            var firstdate = new Date(def.Year, def.Month - 1, 1);

            var diffday = def.weekStart - firstdate.getDay();
            var showmonth = def.Month - 1;
            if (diffday > 0) {
                diffday -= 7;
            }
            var startdate = DateAdd("d", diffday, firstdate);
            var enddate = DateAdd("d", 42, startdate);
            var ads = cp.data("ads");
            var ade = cp.data("ade");
            var bhm = [];
            var tds = dateFormat.call(def.today, i18n.datepicker.dateformat.fulldayvalue);
            var indata = cp.data("indata");
            var ins = indata != null ? dateFormat.call(indata, i18n.datepicker.dateformat.fulldayvalue) : "";
            for (var i = 1; i <= 42; i++) {
                if (i % 7 == 1) {
                    bhm.push("<tr>");
                }
                var ndate = DateAdd("d", i - 1, startdate);
                var tdc = [];
                var dis = false;
                if (ads && ndate < ads) {
                    dis = true;
                }
                if (ade && ndate > ade) {
                    dis = true;
                }
                if (ndate.getMonth() < showmonth) {
                    tdc.push("bbit-dp-prevday");
                }
                else if (ndate.getMonth() > showmonth) {
                    tdc.push("bbit-dp-nextday");
                }

                if (dis) {
                    tdc.push("bbit-dp-disabled");
                }
                else {
                    tdc.push("bbit-dp-active");
                }

                var s = dateFormat.call(ndate, i18n.datepicker.dateformat.fulldayvalue);
                if (s == tds) {
                    tdc.push("bbit-dp-today");
                }
                if (s == ins) {
                    tdc.push("bbit-dp-selected");
                }

                bhm.push("<td class='", tdc.join(" "), "' title='", dateFormat.call(ndate, i18n.datepicker.dateformat.fulldayvalue), "' xdate='", dateFormat.call(ndate, i18n.datepicker.dateformat.fulldayvalue), "'><a href='javascript:void(0);'><em><span>", ndate.getDate(), "</span></em></a></td>");
                if (i % 7 == 0) {
                    bhm.push("</tr>");
                }
            }
            tb.html(bhm.join(""));
        }
       
        return $(this).each(function() {

            var obj = $(this).addClass("bbit-dp-input");
            var picker = $(def.picker);
            def.showtarget == null && obj.after(picker);
            picker.click(function(e) {
                var isshow = $(this).attr("isshow");
                //hide it initially
                var me = $(this);

                if (cp.css("visibility") == "visible") {
                    cp.css(" visibility", "hidden");
                }
                if (isshow == "1") {
                    me.attr("isshow", "0");
                    cp.removeData("ctarget").removeData("cpk").removeData("indata").removeData("onReturn");
                    return false;
                }
                var v = obj.val();
                if (v != "") {
                    v = stringtodate(v);
                }
                if (v == null || v == "") {
                    def.Year = new Date().getFullYear();
                    def.Month = new Date().getMonth() + 1;
                    def.Day = new Date().getDate();
                    def.inputDate = null
                }
                else {
                    def.Year = v.getFullYear();
                    def.Month =v.getMonth() + 1;
                    def.Day = v.getDate();
                    def.inputDate = v;
                }
                cp.data("ctarget", obj).data("cpk", me).data("indata", def.inputDate).data("onReturn", def.onReturn);
                if (def.applyrule && $.isFunction(def.applyrule)) {
                    var rule = def.applyrule.call(obj, obj[0].id);
                    if (rule) {
                        if (rule.startdate) {
                            cp.data("ads", rule.startdate);
                        }
                        else {
                            cp.removeData("ads");
                        }
                        if (rule.enddate) {
                            cp.data("ade", rule.enddate);
                        }
                        else {
                            cp.removeData("ade");
                        }
                    }
                }
                else {
                    cp.removeData("ads").removeData("ade")
                }
                writecb();


                $("#BBIT-DP-T").height(cp.height());
                var t = def.showtarget || obj;
                var pos = t.offset();


                var height = t.outerHeight();
                var newpos = { left: pos.left, top: pos.top + height };
                var w = cp.width();
                var h = cp.height();
                var bw = document.documentElement.clientWidth;
                var bh = document.documentElement.clientHeight;
                if ((newpos.left + w) >= bw) {
                    newpos.left = bw - w - 2;
                }
                if ((newpos.top + h) >= bh) {
                    newpos.top = pos.top - h - 2;
                }
                if (newpos.left < 0) {
                    newpos.left = 10;
                }
                if (newpos.top < 0) {
                    newpos.top = 10;
                }
                $("#BBIT-DP-MP").hide();
                newpos.visibility = "visible";
                cp.css(newpos);



                //cp.show();
                $(this).attr("isshow", "1");

                $(document).one("click", function(e) {
                    me.attr("isshow", "0");
                    cp.removeData("ctarget").removeData("cpk").removeData("indata");
                    cp.css("visibility", "hidden");
                });

                return false;
            });
        });
    };
})(jQuery);