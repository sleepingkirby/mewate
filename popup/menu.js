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
        //document.getElementById('listTxtAr').value='';
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


  //get values to set defaults
  chrome.storage.local.get( null,(item) => {
    //set default
      if(!item.hasOwnProperty('patt')){
      console.log('mewate: pattern doesn\'t exist. Setting one of nothing.');
      chrome.storage.local.set({'patt': ''});
      item.patt="https?://[a-zA-Z0-9._/\-]+?.m3u8";
      }

      if(!item.hasOwnProperty('autoChck')){
      console.log('mewate: auto check checkbox . Setting to false.');
      chrome.storage.local.set({'autoChck': false});
      item.autoChck=false; 
      }

 
      if(!item.hasOwnProperty('list')){
      item['list']='';
      }
     
    document.getElementById('autoChck').checked=item.autoChck;
    document.getElementById('pattInput').value=item.patt;
    document.getElementById('listTxtAr').value=item.list;
  });

  //saving checkbox everytime it's checked
  document.getElementById('autoChck').onclick=function(){
  var chck=this.checked;
    chrome.storage.local.set({'autoChck':chck}, function(){
    notifyMsg("auto purge list and auto pull is set to: "+chck);
    });
  }


  //because apparently storage is async and the messaging method doesn't stay open long enough to pass something back nor does respond late enough to get the update from storage
  //this makes the text area update when there's a new value
  chrome.storage.onChanged.addListener(function(changes,namespace){
  console.log(changes);
    if(changes.hasOwnProperty('list') && changes.list.hasOwnProperty('newValue')){
    document.getElementById('listTxtAr').value=changes.list.newValue;
    }
  });


  document.addEventListener('DOMContentLoaded', function () {
    chrome.storage.local.get( 'autoChck' ,(item) => {
      if(item.hasOwnProperty('autoChck') && item.autoChck){
        chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
          chrome.tabs.sendMessage(tabs[0].id, {action: 'pullPatt'}, function(){
          notifyMsg("auto purge list and auto pull executed");
          });
        });
      }
    });
  });

chrome.tabs.executeScript({
file: "/content_scripts/mewate.js"
}, startListen);

//alert(document.getElementsByName('auto').length);
//document.getElementsByName('mnl')[0].checked=true;

