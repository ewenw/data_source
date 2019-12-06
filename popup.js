'use strict';




let slides = [];
chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
  let url = stripUrl(tabs[0].url);
  if (url == 'newtab')
    makeNewTabSlides();
  else
    getInfo(url, makeSlides);
  
  
});

function makeNewTabSlides() {
  slides = slides.concat([
    ['Data centers globally account for 3% of electricity supply and 2% of greenhouse emissions.', 'coal_plant'],
    ['', 'data_distribution', 'rgba(0,0,0,0)'],
    ["By 2023, China's data centers will consume more power than Australia.", 'beijing_skyline'],
    ["China's data centers: 73% coal, 23% renewables, 4% nuclear.", 'beijing_skyline'],
    ["Transitioning renewable energy from 23% to 30% saves 16 million metric tons of CO2", 'beijing_skyline'], 
    ["That's equal to 10 million round-trip transatlantic flights", 'timelapse'],
    ["Current issues: slow adoption of consistent metrics, lack of transparency and awareness", 'coal_plant']
  ]);
  showSlides(slideIndex);
}

const hostInfo = {
  'amazon': {
    'a': ['Amazon Web Services (AWS) is the largest cloud service provider in the world.', 'aws_logo'],
    'b': ['It spans 114 points of presence in 56 cities and 24 countries', 'aws_map'],
    'c': ['Despite heavy investments in wind farms, it is still only 40% renewable.', 'windmill_under_construction'],
    'd': ['14 AWS facilities in Virginia are 97% powered by coal, nuclear, and natural gas.', 'coal_plant_virginia']
   },
  'google': {
    'a': ['Google is the first tech giant to go 100% renewable', 'google_finland'],
    'b': ['It collects rainwaters to cool its data centers', 'google_cooling'],
    'c': ['And develops centers in colder regions like Belgium...', 'google_belgium'],
    'd': ['Finland...', 'google_finland_2'],
    'e': ['And The Netherlands...', 'google_netherlands'],
    'f': ['Machine learning optimizations reduce its cooling energy by 40%.', 'google_ml'],
    'g': ['Data centers are becoming increasingly power efficient', 'google_pue']
  }
};
  
function makeHostSlide(host, nameOfWebsite) {
  const text = nameOfWebsite + " is hosted on " + host + ".";
  slides.push([text, 'data_center']);
  const hostKey = host.toLowerCase().replace(/\W+/g," ").split(" ")[0];
  if(hostKey in hostInfo){
    $.each(hostInfo[hostKey], function(k, v) {
      slides.push(v);
    });
  }
  showSlides(slideIndex);
}

// A slide is a [text, image]
function makeSlides(info, url) {
  const nameOfWebsite = url.replace('www.', '');
  if (info['hostName'] == "Unknown") 
    return makeNewTabSlides();
  if (info['hostName'])
    makeHostSlide(info['hostName'], nameOfWebsite);
  if (info['serviceCount'])
    slides.push([nameOfWebsite + " is powered by " + info['serviceCount'] + " external services.", 'microservices']);
  if (info['contentDeliverers'].length) 
    slides.push(["The content is delivered by " + readableList(info['contentDeliverers']) + ".", 'contentdelivery']);
  if (info['trackers'] && info['trackers'].length)
    slides.push(["It uses " + readableList(info['trackers']) + " to track your activity.", 'trackers']);

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
  
  return arr.slice(0, 2).join(", ") + " and " + arr.length + " others";
}