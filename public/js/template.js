function renderMessage(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
;var locals_for_with = (locals || {});(function (currenttime, message, namecolor, username) {
buf.push("<h4" + (jade.attr("style", 'color:' + (namecolor) + ';', true, false)) + " class=\"media-heading\">" + (jade.escape((jade_interp = username) == null ? '' : jade_interp)) + "<span class=\"small pull-right\">" + (jade.escape((jade_interp = currenttime) == null ? '' : jade_interp)) + "</span></h4><p style=\"font-size:125%;padding:0;margin:0;\">" + (jade.escape((jade_interp = message) == null ? '' : jade_interp)) + "</p><hr/>");}.call(this,"currenttime" in locals_for_with?locals_for_with.currenttime:typeof currenttime!=="undefined"?currenttime:undefined,"message" in locals_for_with?locals_for_with.message:typeof message!=="undefined"?message:undefined,"namecolor" in locals_for_with?locals_for_with.namecolor:typeof namecolor!=="undefined"?namecolor:undefined,"username" in locals_for_with?locals_for_with.username:typeof username!=="undefined"?username:undefined));;return buf.join("");
}