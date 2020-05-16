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

function notifyMsg(msg){
        var notif=document.getElementsByClassName('notify')[0];
          notif.id=''; //resets the notification area animation
          console.log('mewate: ' + msg);
          notif.textContent=msg;
          notif.id='fadeOut';
          notif.addEventListener("animationend", ()=>{notif.id='';});
}

function startListen(){
  document.addEventListener("click", (e) => {
    switch(e.target.name){
      case 'pullBtn':
        //send message to content_scripts
        //const gettingActiveTab = browser.tabs.query({active: true, currentWindow: true});
        chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, {action: 'pullPatt'});
        });
      break;
      case 'saveBtn':
        var inp = document.getElementById('pattInput').value;
          if(inp=='' || !inp){
          notifyMsg("Pattern not saved. No pattern to save.");
          break;
          }

          chrome.storage.local.set({'patt': inp},()=>{
          notifyMsg("Pattern '"+inp+"' saved."); 
          });
      break;
      case 'clearBtn':
        chrome.storage.local.set({'list': ''}, ()=>{
        document.getElementById('listTxtAr').value='';
        notifyMsg('Found list cleared'); 
        });
      break;
      case 'saveLBtn':
        var inp = document.getElementById('listTxtAr').value;
          if(inp=='' || !inp){
          notifyMsg("List not saved. Not list to save.");
          break;
          }

          chrome.storage.local.set({'list': inp},()=>{
          notifyMsg("List saved."); 
          });
      break;
      default:
      break;
    }
  });

}


  //set the checkbox from the config
  chrome.storage.local.get( null,(item) => {
    //set default
    if(!item.hasOwnProperty('patt')){
    console.log('mewate: default pattern doesn\'t exist. Setting one of nothing.');
    chrome.storage.local.set({'patt': ''});                         
    }
  
    document.getElementById('listTxtAr').textContent=item.list;
  });

chrome.tabs.executeScript({
file: "/content_scripts/mewate.js"
}, startListen);

//alert(document.getElementsByName('auto').length);
//document.getElementsByName('mnl')[0].checked=true;

