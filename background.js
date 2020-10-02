'use strict';

//  chrome.webRequest.onBeforeRequest.addListener(callback, filter, opt_extraInfoSpec);  
      chrome.webRequest.onBeforeRequest.addListener(
        function(details) {
          //console.log(details);
        },
        {urls: ["<all_urls>"]});

chrome.runtime.onInstalled.addListener(function() {

  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([{
      conditions: [new chrome.declarativeContent.PageStateMatcher({
        pageUrl: {urlMatches: '(http|https|file):/+[a-z]*'},
      })],
      actions: [new chrome.declarativeContent.ShowPageAction()]
    }]);
  });
});

