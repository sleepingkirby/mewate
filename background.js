'use strict';

  function grepHTML(patt){
    if(!patt){
    return false;
    }

    var html=document.documentElement.innerHTML;
    var regexPatt = new RegExp(patt, "ig");
    var strings=html.match(regexPatt);
    //console.log("mewate: pattern fount matches");
    //console.log(strings);
      if( strings==null ||  !strings || strings.length<=0){
      return false;
      }
    var lns='';
      for(let ln of strings){
      lns=lns+ln+'\n';
      }

  return lns;
  }



//  chrome.webRequest.onBeforeRequest.addListener(callback, filter, opt_extraInfoSpec);  
      chrome.webRequest.onBeforeRequest.addListener(
        function(details) {
          chrome.storage.local.get( null ,(item) => {
            //check if should run
            if(item.hasOwnProperty('XHRChck') && item.XHRChck ){
              // check to make sure a pattern exists to grab
              if( !item.hasOwnProperty('XHRPatt') || !item.XHRPatt || item.XHRPatt == "" ){
              console.log("XHR grab turned on, but no pattern provided. Quitting...");
              return false;
              }
    
            //starting grab
            console.log("mewate: Grabbing XMLHttpRequests with pattern :"+item.XHRPatt);
            var regexPatt = new RegExp(item.XHRPatt, "ig");
            var strings=details.url.match(regexPatt);
              //end if no results.
              if( strings==null ||  !strings || strings.length<=0){
              return false;
              }
                
            //initializing result variable
            var lns=item.hasOwnProperty('list')?item.list:'';
              for(let ln of strings){
              lns=lns+ln+'\n';
              }
            //send results to storage.
            chrome.storage.local.set({'list': lns});
            }
          });
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

