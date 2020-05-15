/*
function notify(str){
console.log(str);
alert(str);
}
*/

function reportErr(error){
console.error('pollTags: Failed to insert content script into tab/page: ' + error.message);
}

function onError(item){
console.log("Error: " + error);
var notif=document.getElementsByClassName('notify')[0];

}

function doNothing(item, err){

}

//gets hostname from url
function hostFromURL(str){
var rtrn=str;
var proto=rtrn.match(/[a-z]+:\/\/+/g);
var rtrn=rtrn.substr(proto[0].length,rtrn.length);
var end=rtrn.search('/');
var rtrn=rtrn.substr(0,end);
return rtrn;
}

function startListen(){
  document.addEventListener("click", (e) => {
    switch(e.target.name){
      case 'disableMdl':
        //send message to content_scripts
        //const gettingActiveTab = browser.tabs.query({active: true, currentWindow: true});
        chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, {action: 'disableMdl'});
        });
      break;
      case 'addToIgnList':
        chrome.tabs.query({active: true, currentWindow: true},(tabs) => {
        var url=tabs[0].url;
        var host=hostFromURL(url);
          chrome.storage.local.get('custList',(custList) => {
          var newCL=custList.custList;
          newCL[host]=null;
            var notif=document.getElementsByClassName('notify')[0];
            notif.id=''; //resets the notification area animation
            chrome.storage.local.set({custList: newCL},()=>{
            console.log('butWhyMod: added host to custom List ' + host);
            notif.textContent='\'' + host + '\' added to white list.';
            notif.id='fadeOut';
            notif.addEventListener("animationend", ()=>{
            notif.id='';
            });
            })
          });
        });
        //browser.storage.local.set({mnl: !e.target.checked}).then(()=>{console.log('butWhyMod: \'manual\' set to ' + !e.target.checked)}, onError);
      break;
      case 'mnl':
      /*
        browser.storage.local.get('mnl').then((item) => {
          if(item.hasOwnProperty('mnl')){
            console.debug(e.target.checked);
            console.debug(item['mnl']);
          }
          else{
            console.log('item is undefined');
            browser.storage.local.set({mnl: e.target.checked});
          }
        }
        , onError);
      */
         chrome.storage.local.set({mnl: !e.target.checked},()=>{console.log('butWhyMod: \'manual\' set to ' + !e.target.checked)});
      break;
      case 'settings':
        chrome.runtime.openOptionsPage();
      break;
      case 'donate':
        chrome.tabs.create({url: 'https://patreon.com/WKLaume'});
      break;
      default:
      break;
    }
  });

}



  //set the checkbox from the config
  chrome.storage.local.get('mnl',(item) => {
    //set default
    if(!item.hasOwnProperty('mnl')){
    console.log('butWhyMod: manual setting doesn\'t exist. Setting default value.');
    item={mnl: false};
    chrome.storage.local.set({mnl: false});                         
    }
    //checked = mnl is false(auto), unchecked = mnl is true(manual)
   document.getElementsByName('mnl')[0].checked = !item['mnl'];
  });


chrome.tabs.executeScript({
file: "/content_scripts/pollTags.js"
}, startListen);

//alert(document.getElementsByName('auto').length);
//document.getElementsByName('mnl')[0].checked=true;

