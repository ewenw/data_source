'use strict';




let slides = [];
chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
  let url = stripUrl(tabs[0].url);
  getInfo(url, makeSlides);
});

let images = [
  'data_center.jpg',
  'coal_plant.jpg',
  'data_center.jpg'
];

// A slide is a [text, image]
function makeSlides(info, url) {
  if (info['hostName'])
    slides.push([url + " is hosted on " + info['hostName'] + ".", images[0]]);
  if (info['serviceCount'])
    slides.push(["It is powered by " + info['serviceCount'] + " external services.", images[1]]);
  if (info['contentDeliverers'].length) 
    slides.push(["The content is delivered by " + readableList(info['contentDeliverers']) + ".", images[2]]);
  if (info['trackers'] && info['trackers'].length)
    slides.push(["It uses: " + readableList(info['trackers']) + " to track your activity.", images[2]]);

  for(let i=0; i<slides.length; i++)
    $('.dot-dot-dot').append('<span class="dot"></span>');

  showSlides(slideIndex);
}

function getInfo(url, cb) {
  let info = [];
  get("https://builtwith.com/" + url, (page) => {
    let serviceCount = $(page).find(".row .mb-2 .mt-2").length;
    
    let contentDeliverers = [];
    $(page).find("h6:contains('Content Delivery Network')").parent().parent().parent().find(".text-dark").each(function() {
      if($(this).text() != "Content Delivery Network")
        contentDeliverers.push($(this).text());
    });
    
    let trackers = [];
    $(page).find("h6:contains('Analytics and Tracking')").parent().parent().parent().find(".text-dark").each(function() {
      trackers.push($(this).text());
    });

    info['serviceCount'] = serviceCount;
    info['contentDeliverers'] = contentDeliverers;
    info['trackers'] = trackers;

    get("https://check-host.net/check-info?host=" + url, (page) => {
      let hostName = $(page).find(".ipinfo-item").find(".hostinfo").find("tbody").children().eq(3).children().eq(1).html() || "Unknown";
      info['hostName'] = hostName;


      cb(info, url);
    });
  });
}


function getISPInfo(url) {
  let xhr = createCORSRequest("https://check-host.net/check-info?host=" + url, true);
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4) {
      let el = $('<div></div>').append($.parseHTML(xhr.responseText));
      
    }
  }
  xhr.send();
}








// Helpers
function get(url, cb) {
  let xhr = createCORSRequest(url, true);
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4) {
      cb($('<div></div>').append($.parseHTML(xhr.responseText)));
    }
  }
  xhr.send();
}

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

function stripUrl(url) {
  return url_domain(url).replace(/(^\w+:|^)\/\//, '');
}

function url_domain(data) {
  var a = document.createElement('a');
  a.href = data;
  return a.hostname;
}

function readableList(arr) {
  if (arr.length <= 3)
    return arr.join(", ")
  
  return arr.slice(0, 2) + " and " + arr.length + " others";
}