
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
        browser.tabs.query({active: true, currentWindow: true}, (tabs) => {
          browser.tabs.sendMessage(tabs[0].id, {action: 'pullPatt'});
        });
      break;
      default:
      break;
    }
  });

}


  //variable checks
  browser.storage.local.get().then((item) => {
    //set default
      if(!item.hasOwnProperty('patt')){
      console.log('mewate: HTML pattern doesn\'t exist. Setting one of nothing.');
      browser.storage.local.set({'patt': 'https?://.+\.(m3u8|mp4)'});
      item.patt="https?://.+\.(m3u8|mp4)";
      }

      if(!item.hasOwnProperty('XHRPatt')){
      console.log('mewate: XHR pattern doesn\'t exist. Setting one of nothing.');
      browser.storage.local.set({'XHRPatt': 'https?://.+\.(m3u8|mp4)'});
      item.XHRPatt="https?://.+\.(m3u8|mp4)";
      }

      if(!item.hasOwnProperty('autoChck')){
      console.log('mewate: auto check checkbox . Setting to false.');
      browser.storage.local.set({'autoChck': false});
      item.autoChck=false; 
      }

      if(!item.hasOwnProperty('autoCChck')){
      console.log('mewate: auto clear checkbox . Setting to false.');
      browser.storage.local.set({'autoCChck': false});
      item.autoCChck=false; 
      }

      if(!item.hasOwnProperty('autoPgChck')){
      console.log('mewate: auto clear checkbox . Setting to false.');
      browser.storage.local.set({'autoPgChck': false});
      item.autoCChck=false; 
      }

      if(!item.hasOwnProperty('XHRChck')){
      console.log('mewate: XHR on checkbox . Setting to false.');
      browser.storage.local.set({'XHRChck': false});
      item.XHRChck=false; 
      }


      if(!item.hasOwnProperty('list')){
      browser.storage.local.set({'list': ''});
      item['list']='';
      }
     
    document.getElementById('autoChck').checked=item.autoChck;
    document.getElementById('autoCChck').checked=item.autoCChck;
    document.getElementById('autoPgChck').checked=item.autoPgChck;
    document.getElementById('XHRChck').checked=item.XHRChck;
    document.getElementById('pattInput').value=item.patt;
    document.getElementById('XHRPattInput').value=item.XHRPatt;
    document.getElementById('listTxtAr').value=item.list;
  });

  //saving auto pull checkbox everytime it's checked
  document.getElementById('autoChck').onclick=function(){
  var chck=this.checked;
    browser.storage.local.set({'autoChck':chck}).then(function(){
    notifyMsg("auto pull is set to: "+chck);
    });
  }

  //saving auto pull checkbox everytime it's checked
  document.getElementById('autoCChck').onclick=function(){
  var chck=this.checked;
    browser.storage.local.set({'autoCChck':chck}).then(function(){
    notifyMsg("auto purge list is set to: "+chck);
    });
  }

  //saving auto pull checkbox everytime it's checked
  document.getElementById('autoPgChck').onclick=function(){
  var chck=this.checked;
    browser.storage.local.set({'autoPgChck':chck}).then(function(){
    notifyMsg("auto pull on page load is set to: "+chck);
    });
  }

  //saving auto pull checkbox everytime it's checked
  document.getElementById('XHRChck').onclick=function(){
  var chck=this.checked;
    browser.storage.local.set({'XHRChck':chck}).then(function(){
    notifyMsg("Grab from XHR is set to: "+chck);
    });
  }

  //setting listener so that patt and XHRPatt changes will highlight the save button
  document.getElementById('pattInput').oninput=function(){
  document.getElementById('pattSaveBtn').classList.add("btnHL");
  }

  //setting listener so that patt and XHRPatt changes will highlight the save button
  document.getElementById('XHRPattInput').oninput=function(){
  document.getElementById('XHRPattSaveBtn').classList.add("btnHL");
  }

  //event to save save pattInput as well as remove the highlight from the button
  document.getElementById('pattSaveBtn').onclick=function(){
  var inp = document.getElementById('pattInput').value;
    if(inp=='' || !inp){
    notifyMsg("Pattern not saved. No pattern to save.");
    return 0;
    }

    browser.storage.local.set({'patt': inp}).then(()=>{
    notifyMsg("Pattern '"+inp+"' saved.");
    this.classList.remove("btnHL");
    });
  }

  //event to save save XHRPattInput as well as remove the highlight from the button
  document.getElementById('XHRPattSaveBtn').onclick=function(){
  var inp = document.getElementById('XHRPattInput').value;
    if(inp=='' || !inp){
    notifyMsg("XHR Pattern not saved. No pattern to save.");
    return 0;
    }

    
    browser.storage.local.set({'XHRPatt': inp}).then(()=>{
   
    notifyMsg("XHR Pattern '"+inp+"' saved.");
    this.classList.remove("btnHL");
    });
  }

  //copy the textarea to the clipboard
  document.getElementById('cpyBtn').onclick=function(){
  var ta=document.getElementById('listTxtAr');
  ta.focus();
  ta.select();
  notifyMsg('Copied to clipboard. '+document.execCommand('copy'));
  }

  //opens about page
  document.getElementsByClassName("about")[0].onclick=function(){
    browser.tabs.create({url: 'https://b3spage.sourceforge.io/index.html?mewate'});
  }

  //clears the results list
  document.getElementById('clearBtn').onclick=function(){
    browser.storage.local.set({'list': ''}).then(()=>{
    //document.getElementById('listTxtAr').value='';
    browser.runtime.sendMessage({bdgNm: ''});
    notifyMsg('Results list cleared');
    });
  }

  //saves the results list when manually modified
  document.getElementById('saveLBtn').onclick=function(){
    var inp = document.getElementById('listTxtAr').value;
      if(inp=='' || !inp){
      notifyMsg("List not saved. Not list to save.");
      return 0;
      }
      browser.storage.local.set({'list': inp}).then(()=>{
      browser.runtime.sendMessage({bdgNm: inp.trim().split(/\r\n|\r|\n/).length.toString()});
      notifyMsg("List saved.");
      this.classList.remove("btnHL");
      });
  }

  //makes the save button for the text area get higlighted if the list is manually changed.
  document.getElementById('listTxtAr').oninput=function(){
  document.getElementById('saveLBtn').classList.add("btnHL");
  }




  //because apparently storage is async and the messaging method doesn't stay open long enough to pass something back nor does respond late enough to get the update from storage
  //this makes the text area update when there's a new value
  browser.storage.onChanged.addListener(function(changes,namespace){
    if(changes.hasOwnProperty('list') && changes.list.hasOwnProperty('newValue')){
    document.getElementById('listTxtAr').value=changes.list.newValue;
    }
  });

//rn on popup (menu) page load.
  document.addEventListener('DOMContentLoaded', function () {
    browser.storage.local.get().then((item) => {
      if(item.hasOwnProperty('autoPgChck') && !item.autoPgChck){
        if(item.hasOwnProperty('autoCChck') && item.autoCChck){
          browser.storage.local.set({'list':''}).then(() => {
          browser.runtime.sendMessage({bdgNm: ''});
          notifyMsg("auto clear executed");
          });
        }

        if(item.hasOwnProperty('autoChck') && item.autoChck){
          browser.tabs.query({active: true, currentWindow: true}, (tabs) => {
            browser.tabs.sendMessage(tabs[0].id, {action: 'pullPatt'}, function(){
            notifyMsg("auto pull executed");
            });
          });
        }
      }
    });
  }); 


browser.tabs.query({active: true, currentWindow: true},(tabs) => {
  if(tabs[0].url.substr(0,6)!="chrome"){
  browser.tabs.executeScript({file: "/content_scripts/mewate.js"}, startListen);
  }
});
