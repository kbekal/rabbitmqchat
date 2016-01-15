function renderMessage(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
;var locals_for_with = (locals || {});(function (currenttime, message, username) {
buf.push("<li><div class=\"row\"><div class=\"col-lg-12\"><div class=\"media\"><a href=\"#\" class=\"pull-left\"><!--img.media-object.img-circle(src='http://lorempixel.com/30/30/people/1/', alt='')--></a><div class=\"media-body\"><h4 class=\"media-heading\">" + (jade.escape((jade_interp = username) == null ? '' : jade_interp)) + "<span class=\"small pull-right\">" + (jade.escape((jade_interp = currenttime) == null ? '' : jade_interp)) + "</span></h4><p>" + (jade.escape((jade_interp = message) == null ? '' : jade_interp)) + "</p></div></div></div></div></li><hr/>");}.call(this,"currenttime" in locals_for_with?locals_for_with.currenttime:typeof currenttime!=="undefined"?currenttime:undefined,"message" in locals_for_with?locals_for_with.message:typeof message!=="undefined"?message:undefined,"username" in locals_for_with?locals_for_with.username:typeof username!=="undefined"?username:undefined));;return buf.join("");
}