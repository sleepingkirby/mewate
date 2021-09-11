'use strict';

chrome.browserAction.setBadgeBackgroundColor({ color: [255, 0, 0, 255] });

//listener for contentScript
chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
  if(msg.hasOwnProperty('bdgNm')) {
    chrome.browserAction.setBadgeText({text: msg.bdgNm});
  }
});


//  chrome.webRequest.onBeforeRequest.addListener(callback, filter, opt_extraInfoSpec);  
      chrome.webRequest.onBeforeRequest.addListener(
        function(details) {
          /*so... according to google, prior to their documentation revamp, chrome.storage.local is synchronous and
          therefore, we don't have to worry about race conditions. That's a big fat lie.
          The below code will run the chrome.storage.local.set() (at line 67) *asynchronously* to the chrome.storage.local.get()
          after this comment. This means that I'll have to figure/write my own task queue or task scheduler at some
          point. For now, it's fine. But, seriously, WTH?
          */
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

              /*if auto clear check is true, clear previous results
               this introduces a "bug" in that the results textbox and the badge are 
               not updated when this if statement runs but when the results are filled
               so it's possible to never show no results and no badge if there's always
               a xhr request that matches even though it's suppose to auto clear.
               This is preferred compared to the alternative of running another callback
               function to set the storage variable as they're a pain to maintain code-wise
               as well as expensive resource-wise (by definition of a recursive function)
              */
              if(item.hasOwnProperty('autoCChck') && item.autoCChck){
              lns='';
              }
              /*
              console.log("=============================>>");
              console.log(details.url);
              console.log(strings);
              console.log(item.list);
              */
              for(let ln of strings){
              lns=lns+ln+'\n';
              }
              //console.log("setting: "+lns);
            //send results to storage.
            chrome.storage.local.set({'list': lns},(e)=>{console.log(details.url+": "+lns);});
            chrome.browserAction.setBadgeText({text: lns.trim().split(/\r\n|\r|\n/).length.toString()});
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

