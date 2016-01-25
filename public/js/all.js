function chatmessage(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
;var locals_for_with = (locals || {});(function (message, namecolor, username) {
buf.push("<div" + (jade.attr("style", 'color:' + (namecolor) + ';font-size=150%;', true, false)) + ">" + (jade.escape((jade_interp = username) == null ? '' : jade_interp)) + "</div><div class=\"chat-box\"><div class=\"messages\">" + (jade.escape((jade_interp = message) == null ? '' : jade_interp)) + "</div></div><hr/>");}.call(this,"message" in locals_for_with?locals_for_with.message:typeof message!=="undefined"?message:undefined,"namecolor" in locals_for_with?locals_for_with.namecolor:typeof namecolor!=="undefined"?namecolor:undefined,"username" in locals_for_with?locals_for_with.username:typeof username!=="undefined"?username:undefined));;return buf.join("");
}
function placeslist(locals) {
var buf = [];
var jade_mixins = {};
var jade_interp;
;var locals_for_with = (locals || {});(function (searchstring) {
buf.push("<a" + (jade.attr("href", 'https://www.google.com/#q=tripadvisor+' + (searchstring) + '', true, false)) + " target=\"_blank\">" + (jade.escape((jade_interp = searchstring) == null ? '' : jade_interp)) + "</a>");}.call(this,"searchstring" in locals_for_with?locals_for_with.searchstring:typeof searchstring!=="undefined"?searchstring:undefined));;return buf.join("");
}