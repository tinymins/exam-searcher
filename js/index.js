$(window).load(function(){
    $("#input_search").keyup(function(){
        StartSearch($("#input_search").val());
    });
    // 返回键
/*    document.addEventListener("backbutton", function() {
        $("#div_config").stop(true, false).fadeOut(300);
    }, false);*/
    // fastclick
    // FastClick.attach(document.body);
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
function LoadMore(kw, start, amount) {
    kw = kw || "";
    var matched_topics = []
    if( kw=="" ) {
        matched_topics = [{
            title : '请输入关键字。/w \\',
            ans : []
        }];
    } else {
        // data
        for (var i = 0; i < data.length; i++) {
            var topic = data[i];
            if(topic.title.indexOf(kw) >= 0) {
                matched_topics.push(topic);
            }
        };
        if ( matched_topics.length == 0 ) {
            matched_topics = [{
                title : '木有找到符合条件的结果。ˊ_>ˋ',
                ans : []
            }];
        }
    }
    
    start = start || 0;
    amount = amount || 15;
    amount = matched_topics.length - start > amount ? amount: matched_topics.length - start;
    // ui
    var html = "";
    for (var i = start; i < start + amount; i++) {
        var title   = EncodeHtml(matched_topics[i].title).replace(kw,"<span class='high-lighted'>"+kw+"</span>");
        var ans     = matched_topics[i].ans;
        
        html = html + '<li class="table-view-cell">'+title+'</li><li class="table-view-divider">';
        for (var j = 0; j < ans.length; j++) {
            html = html + EncodeHtml( '> ' + ans[j] );
            if( j < ans.length - 1 ) {
                html += '<br>';
            }
        };
        html = html + '</li>';
    };
    
    if ( matched_topics.length > start + amount ) {
        // load more
        html += '<button class="btn btn-block btn-outlined" onclick="javascript:$(this).remove();LoadMore(\''+kw+'\','+ (start+amount) +');">加载更多…</button>';
    } else {
        // ad
        html = html + '<h1 class="title">翟一鸣 @ ZhaiYiMing.CoM</h1>';
    }
    
    $(".topic-list").append(html);
}
function StartSearch(kw, start, amount){
    $(".topic-list").html("");
    LoadMore(kw, start, amount);
}