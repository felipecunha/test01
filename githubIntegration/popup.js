// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

var req = new XMLHttpRequest();

//var url = "http://api.flickr.com/services/rest/?" +
//            "method=flickr.photos.search&" +
//            "api_key=90485e931f687a9b9c2a66bf58a3861a&" +
//            "text=hello%20world&" +
//            "safe_search=1&" +  // 1 is "safe"
//            "content_type=1&" +  // 1 is "photos only"
//            "sort=relevance&" +  // another good one is "interestingness-desc"
//            "per_page=20";
    
//var url = "http://api.flickr.com/services/";

var url = "https://api.github.com/repos/felipecunha/test01/commits";
    
req.open(
    "GET",
    url,
    true);
req.onload = showPhotos;
req.send(null);

function showPhotos_old() {
  var photos = req.responseXML.getElementsByTagName("photo");

  for (var i = 0, photo; photo = photos[i]; i++) {
    var img = document.createElement("image");
    img.src = constructImageURL(photo);
    document.body.appendChild(img);
  }
}

function showPhotos() {
    var photos = req.responseText;

      var img = document.createElement("div");
      img.innerHTML = photos;
      document.body.appendChild(img);

      var resp = YAHOO.lang.JSON.parse(photos);
      console.log(resp);
      document.write(resp[0].commit.committer.date);

}


function handleJsonP(res){
    var img = document.createElement("div");
    img.innerHTML = res + "aaaaa";
    document.body.appendChild(img);
};

// See: http://www.flickr.com/services/api/misc.urls.html
function constructImageURL(photo) {
  return "http://farm" + photo.getAttribute("farm") +
      ".static.flickr.com/" + photo.getAttribute("server") +
      "/" + photo.getAttribute("id") +
      "_" + photo.getAttribute("secret") +
      "_s.jpg";
}