$(window).load(function(){
    $(window).resize(function() {
        $("#input_search").width($(window).width() - $("#btn_search").width() - 48);
    }).resize();
    $("#btn_search").click(function(){
        StartSearch($("#input_search").val());
    });
});
function EncodeHtml(s){
    return (typeof s != "string") ? s :
      s.replace(this.REGX_HTML_ENCODE,
        function($0){
            var c = $0.charCodeAt(0), r = ["&#"];
            c = (c == 0x20) ? 0xA0 : c;
            r.push(c); r.push(";");
            return r.join("");
    });
};
function StartSearch(kw){
    kw = kw || "";
    if(kw=="") { alert('请输入关键字。\n/w \\'); return; }
    // data
    var matched_topics = []
    for (var i = data.length - 1; i >= 0; i--) {
        var topic = data[i];
        if(topic.title.indexOf(kw) >= 0) {
            matched_topics.push(topic);
        }
    };
    
    // ui
    var html = "";
    for (var i = matched_topics.length - 1; i >= 0; i--) {
        var title   = EncodeHtml(matched_topics[i].title).replace(kw,"<a class='high-lighted'>"+kw+"</a>");
        var ans     = matched_topics[i].ans;
        
        html = html + '<div class="topic-box"><div class="topic-title">'+title+'</div><div class="topic-answer">';
        for (var j = ans.length - 1; j >= 0; j--) {
            html = html + EncodeHtml( '> ' + ans[j] );
            if( j > 0 ) {
                html += '<br>';
            }
        };
        html = html + '</div></div>';
    };
    // ad
    html = html + '<div class="topic-box"><div class="topic-title" style="background-color:#999;">翟一鸣 @ ZhaiYiMing.CoM</div></div>';
    
    $("#main").html(html);
    $(window).resize();
}