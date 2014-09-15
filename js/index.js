$(window).load(function(){
    $("#input_search").keyup(function(){
        StartSearch($("#input_search").val());
    });
    $(".btn-close-setting").live('mousedown touchstart', function() {
        StartSearch($("#input_search").val());
    });
    // 返回键
    var eventBackButton;
    eventBackButton = function() {
        if ( $("#settingsModal").hasClass('active') ) {
            $("#settingsModal").removeClass('active');
        } else {
            document.removeEventListener("backbutton", eventBackButton, false); //注销返回键
            // 3秒后重新注册
            window.setTimeout(function() {
                document.addEventListener("backbutton", eventBackButton, false); //返回键
            }, 3000);
        }
    };
    document.addEventListener("backbutton", eventBackButton, false);
    // 菜单键
    document.addEventListener("menubutton", function() {
        $("#settingsModal").toggleClass('active');
    }, false);
    // 加载题库数据
    var loadTopicData = function() {
        var mask = parseInt( Math.random() * 10000000 );
        window.data = [];
        window.dataMask = mask;
        db.list(function(l) {
            for (var i = 0; i < l.length; i++) {
                if( l[i].enabled == 1 ) {
                    db.select(l[i].id, function(data) {
                        var topics = $.parseJSON(data);
                        for (var i = 0; i < topics.length; i++) {
                            if(window.dataMask == mask)
                                window.data.push( topics[i] );
                        };
                    });
                }
            };
        });
    }
    loadTopicData();
    // 初始化设置面板
    db.list(function(l) {
        var getTopic = function(id) {
            for (var i = l.length - 1; i >= 0; i--) {
                if ( l[i].id == id ) {
                    return l[i];
                }
            };
        }
        // 本地题库
        var html = '';
        for (var i = 0; i < l.length; i++) {
            html += '<li class="table-view-cell" id="local_topic_' + l[i].id + '">' + EncodeHtml(l[i].name)
                    + '<div class="toggle'+(l[i].enabled==1?' active':'')+'" data-id="' + l[i].id + '"><div class="toggle-handle"></div></div></li>';
        };
        $('.local-topic').html(html);
        // 在线题库
        $.getJSON("http://exam_searcher.jd-app.com/data.php", function(r) {
            var html = "";
            for (var i = 0; i < r.length; i++) {
                var topic = getTopic(r[i].id);
                var method, title, classname
                if ( topic ) {
                    if ( topic.version < r[i].version ) {
                        title     = '更新';
                        classname = 'btn-primary topic-update';
                    } else {
                        title     = '删除';
                        classname = 'btn-negative topic-delete';
                    }
                } else {
                    title     = '下载';
                    classname = 'btn-positive topic-insert';
                }
                html += '<li class="table-view-cell">' + r[i].name +'<button class="btn topic-idu '+classname+'" data-id="' + r[i].id + '" data-id="' + r[i].id + '">'+title+'</button></li>';
            };
            $(".online-topic").html(html);
            // 绑定按钮事件
            $(".topic-idu").unbind().click(function() {
                var me = this;
                var id = $(me).data('id');
                if ( $(me).hasClass('topic-insert') ) { // insert
                    $(me).text('下载中').removeClass('btn-positive topic-insert');
                    $.ajax({
                        url : "http://exam_searcher.jd-app.com/data.php?id="+id,
                        dataType : 'json',
                        success : function(r) {
                            db.insert(r.id, r.name, r.version, r.data);
                            $('.local-topic').append('<li class="table-view-cell" id="local_topic_' + r.id + '">' + EncodeHtml(r.name) + '<div class="toggle active" data-id="' + r.id + '"><div class="toggle-handle"></div></div></li>');
                            $(me).text('删除').addClass('btn-negative topic-delete');
                        },
                        error : function() {
                            $(me).text('下载').addClass('btn-positive topic-insert');
                        }
                    });
                } else if ( $(me).hasClass('topic-update') ) {
                    $(me).text('下载中').removeClass('btn-primary topic-update');
                    $.ajax({
                        url : "http://exam_searcher.jd-app.com/data.php?id="+id,
                        dataType : 'json',
                        success : function(r) {
                            db.insert(r.id, r.name, r.version, r.data);
                            $(me).text('删除').addClass('btn-negative topic-delete');
                        },
                        error : function() {
                            $(me).text('更新').addClass('btn-primary topic-update');
                        }
                    });
                } else if ( $(me).hasClass('topic-delete') ) {
                    db.delete(id);
                    $('#local_topic_'+id).remove();
                    $(me).text('下载').removeClass('btn-negative topic-delete').addClass('btn-positive topic-insert');
                }
            });
        });
    });
    $('.local-topic')[0].addEventListener('toggle', function (e) {
        var id = $(e.target).data('id');
        if ( e.detail.isActive ) {
            db.enable(id);
        } else {
            db.disable(id);
        }
        loadTopicData();
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