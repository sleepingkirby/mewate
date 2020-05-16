

//loading external files and settings.
(function() {
  /**
   * Check and set a global guard variable.
   * If this content script is injected into the same page again,
   * it will do nothing next time.
   */


  if (window.hasRun) {
    return;
  }
  window.hasRun = true;
  window.hasModaled = false;

  

  
  /*--------------------------
  pre: none
  post: none
  new fangled wait function 
  https://stackoverflow.com/questions/951021/what-is-the-javascript-version-of-sleep
  ---------------------------*/
  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  /*-----------------------
  pre: pageDone()
  post: none
  runs pageDone after "secs" amount of time
  -----------------------*/
  async function delayRun(secs=6500) {

    console.log('butWhyMod: Setting time for delayed modal removal for ' + secs + " milliseconds");
    await sleep(secs);
    console.log('butWhyMod: Time\'s up. Running delayed modal removal.');
    pageDone();
  }

  /*--------------------
  pre: everything above here
  post: everything modified as a result of running functions above here
  the main logic for what to do when a message comes in from the popup menu
  ---------------------*/
  function runOnMsg(request, sender, sendResponse){
    switch(request.action){
      case 'pullPatt':
        chrome.storage.local.get(null, (item) => {
        console.log('mewate: pull results with pattern '+item.patt);
        var lns=grepHTML(item.patt);
          if(lns && lns!=''){
          lns=item.list+lns;
            chrome.storage.local.set({list:lns},() => { 
            console.log('mewate: results found.');
            
            sendResponse({'list':lns});
            });
          }
          else{
          console.log('mewate: no results found.');  
          }
        });
        sendResponse({'pullPatt':'set done?'});
      break;
      default:
      break;
    }
  }

  /*--------------------
  pre: everything. patt is a string of pattern
  post: modifies the setting
  greps the entire html of the page and returns what it finds to the settings
  ---------------------*/
  function grepHTML(patt){
    if(!patt){
    return false;
    }

    var html=document.documentElement.innerHTML;
    var regexPatt = new RegExp(patt, "ig");
    var strings=html.match(regexPatt);
    var lns='';
      for(let ln of strings){
      lns=lns+ln+'\n';
      }
  
  return lns;
  }


  chrome.runtime.onMessage.addListener(runOnMsg);
})();




