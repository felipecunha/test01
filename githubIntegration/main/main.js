var GH = {};

Platform = (function(){
    var self = {},
        newElement,
        jsonpCount = 0;
    
    newElement = function(spec){
        var elSelf = {},
            dom;
        
        (function(){
            dom = document.createElement("div");
            dom.className = spec.className;
            document.body.appendChild(dom);
        }());
        
        
        elSelf.setText = function(text){
            dom.innerHTML = text;
        };
        
        elSelf.dom = function(){
            return dom;
        };
        
        return elSelf;
    };
    
    self.createElement = function(spec){
        return newElement(spec);
    };

    self.makeJsonpCall = function(url, callback){
        var makeJsonPRequest,
            makeJsonRequest;

        makeJsonPRequest = function(){
            var callBackMethod,
                callBackMethodName,
                script,
                scripts;

            callBackMethod = function(obj){
                var resp;
                if( obj && obj.data && obj.meta && obj.meta.status === 200){
                    resp = obj.data;
                    console.log(resp);
                    callback(resp);
                }
            }
            jsonpCount += 1;
            callBackMethodName = "handleJsonpCall_" + jsonpCount;

            self[callBackMethodName] = callBackMethod;

            script = document.createElement('script'),
            scripts  = document.getElementsByTagName('script')[0];
            script.type = 'text/javascript';
            script.src = url + "?callback=Platform." + callBackMethodName;
            scripts.parentNode.insertBefore(script, scripts);
        };
        
        makeJsonRequest = function(){
            var callBackMethod,
                req = new XMLHttpRequest();

            callBackMethod = function(){
                var resp;
                resp = req.responseText;
                resp = YAHOO.lang.JSON.parse(resp);
                console.log(resp);
                callback(resp);
            }
            req.open("GET", url, true);
            req.onload = callBackMethod;
            req.onerror = makeJsonPRequest;
            req.send(null);
        };
        
        //Try a normal json request
        try {
            makeJsonRequest();
        } catch (e){
            makeJsonPRequest();
        }
    };
    
    return self;
}());

GH.config = {
    user : "felipecunha",
    repository : "test01"
};

GH.commits = (function(){
    var rawCommits,
        self = {};
    
    self.all = function(callBack){
        Platform.makeJsonpCall("https://api.github.com/repos/" + GH.config.user + "/" + GH.config.repository + "/commits", callBack);
    };
    
    return self;
}());

GH.UI = (function(){
    var self = {},
        displayCommits,
        container = Platform.createElement({
            className: "container"
        });

    displayCommits = function(commits){
        var commit,
            commitHtml,
            i,
            lastDate,
            curDate,
            objDate;
        
        commitHtml = '<div class="commitsContainer">';
        
        for( i = 0; i < commits.length; i += 1){
            commit = commits[i].commit;
            curDate = commit.committer.date.substr(0,10);
            objDate = new Date(commit.committer.date);
            
            if( curDate !== lastDate ){
                commitHtml += '<h2 class="dateHeader">' + curDate + '</h2>'
                + '<div class="rowDivider"></div>'
            }

            commitHtml += ''
                    + '<div class="revisionItem">'
                        + '<h3>'
                            + 'Sha <a href="#">' + commits[i].sha + '</a>'
                            + '<p class="notes">(by ' + commit.author.email + ' at ' + objDate.getHours() + ':' + ( objDate.getMinutes() < 10 ? "0" + objDate.getMinutes() : objDate.getMinutes() ) + ')</a>'
                        + '</h3>'
                        + '<div class="comment">' + commit.message + '</div>'
                    + '</div>';
            lastDate = curDate;
        }
        
        commitHtml += "</div>";

        container.setText(commitHtml);
    };

    container.setText("Loading");
    
    GH.commits.all(function(commits){
        if( commits && commits.length ){
            displayCommits(commits);
        } else {
            container.setText("No history found");
        }
    });
    
    return self;
}());