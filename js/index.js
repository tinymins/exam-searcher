$(window).load(function(){
    $("#input_search").keyup(function(){
        StartSearch($("#input_search").val());
    });
    // 返回键
    document.addEventListener("backbutton", function() {
        $("#div_config").stop(true, false).fadeOut(300);
    }, false);
    // fastclick
    FastClick.attach(document.body);
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
    var matched_topics = []
    if( kw=="" ) {
        matched_topics = [{
            title : '请输入关键字。\n/w \\',
            ans : []
        }];
    } else {
        // data
        for (var i = data.length - 1; i >= 0; i--) {
            var topic = data[i];
            if(topic.title.indexOf(kw) >= 0) {
                matched_topics.push(topic);
            }
        };
    }
    
    // ui
    var html = "";
    for (var i = matched_topics.length - 1; i >= 0; i--) {
        var title   = EncodeHtml(matched_topics[i].title).replace(kw,"<span class='high-lighted'>"+kw+"</span>");
        var ans     = matched_topics[i].ans;
        
        html = html + '<li class="table-view-cell">'+title+'</li><li class="table-view-divider">';
        for (var j = ans.length - 1; j >= 0; j--) {
            html = html + EncodeHtml( '> ' + ans[j] );
            if( j > 0 ) {
                html += '<br>';
            }
        };
        html = html + '</li>';
    };
    // ad
    html = html + '<li class="table-view-cell" style="background-color:#999;">翟一鸣 @ ZhaiYiMing.CoM</li>';
    
    $(".topic-list").html(html);
}