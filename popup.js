// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

function createCORSRequest(url) {
  let method = "GET";
  let xhr = new XMLHttpRequest();
  if ("withCredentials" in xhr) {
    // XHR for Chrome/Firefox/Opera/Safari.
    xhr.open(method, url, true);
  } else if (typeof XDomainRequest != "undefined") {
    // XDomainRequest for IE.
    xhr = new XDomainRequest();
    xhr.open(method, url);
  } else {
    // CORS not supported.
    xhr = null;
  }
  return xhr;
}

chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
  let url = stripUrl(tabs[0].url);
  let hostName = getISPInfo(url);
  let services = getServicesInfo(url);
});

function stripUrl(url) {
  return url_domain(url).replace(/(^\w+:|^)\/\//, '');
}
/*
function getServicesInfo(url) {
  let xhr = createCORSRequest("https://w3techs.com/sites/info/stackoverflow.com", true);
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4) {
      let el = $('<div></div>').append($.parseHTML(xhr.responseText));
      let serviceCount = $(el).find("col-md-8").children().length;
      $("#services").html(serviceCount + " services");
      
    }
  }
  xhr.send();
}*/

function url_domain(data) {
  var    a      = document.createElement('a');
         a.href = data;
  return a.hostname;
}

function getServicesInfo(url) {
  let xhr = createCORSRequest("https://builtwith.com/" + url, true);
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4) {
      let el = $('<div></div>').append($.parseHTML(xhr.responseText));

      let serviceCount = $(el).find(".row .mb-2 .mt-2").length;
      $("#services").html(serviceCount + " services");
      
      let contentDeliverers = [];
      $(el).find("h6:contains('Content Delivery Network')").parent().parent().parent().find(".text-dark").each(function() {
        if($(this).text() != "Content Delivery Network")
          contentDeliverers.push($(this).text());
      });
      if (contentDeliverers.length) 
        $("#contentDeliverers").html("Content deliverers: " + contentDeliverers.join(", "));

      let trackers = [];
      $(el).find("h6:contains('Analytics and Tracking')").parent().parent().parent().find(".text-dark").each(function() {
        trackers.push($(this).text());
      });
      if (trackers.length) 
        $("#trackers").html("Trackers found: " + trackers.join(", "));
    }
  }
  xhr.send();
}

function getISPInfo(url) {
  let xhr = createCORSRequest("https://check-host.net/check-info?host=" + url, true);
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4) {
      let el = $('<div></div>').append($.parseHTML(xhr.responseText));
      let hostName = $(el).find(".ipinfo-item").find(".hostinfo").find("tbody").children().eq(3).children().eq(1).html() || "Unknown";
      $("#host").html(hostName);
    }
  }
  xhr.send();
}