var GH = {};

Platform = (function(){
    var self = {},
        newElement,
        jsonpCount = 0;
    
    newElement = function(spec){
        var self = {},
            dom;
        
        (function(){
            dom = document.createElement("div");
            dom.className = spec.className;
            document.body.appendChild(dom);
        }());
        
        
        self.setText = function(text){
            dom.innerHTML = text;
        };
        
        return self;
    };
    
    self.createElement = function(spec){
        return newElement(spec);
    };

    self.makeJsonpCall = function(url, callback){
        var callBackMethod,
            script,
            scripts;

        jsonpCount += 1;
        callBackMethod = "handleJsonpCall_" + jsonpCount;

        self[callBackMethod] = function(resp){
            callback(resp);
        };

        script = document.createElement('script'),
        scripts  = document.getElementsByTagName('script')[0];
        script.type = 'text/javascript';
        script.src = url + "?callback=Platform." + callBackMethod;
        scripts.parentNode.insertBefore(script, scripts);

    };
    
    return self;
}());

GH.commits = (function(){
    var rawCommits,
        self = {};
    
    self.all = function(callBack){
        var handleResponse = function(obj){
            if( obj.data && obj.meta && obj.meta.status === 200){
                rawCommits = obj.data;
            } else {
                rawCommits = null;
            }
            callBack(rawCommits)
        };
        Platform.makeJsonpCall("https://api.github.com/repos/felipecunha/test01/commits", handleResponse);
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
            txt = "",
            i;
        for( i = 0; i < commits.length; i += 1){
            txt += commits[i].commit.author.email + " - " + commits[i].commit.author.date + "<br />";
        }
        container.setText(txt);
    
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