jQuery.fn.selectText=function selectText(){if(document.body.createTextRange){const range=document.body.createTextRange();range.moveToElementText(this[0]);range.select();}else if(window.getSelection){const selection=window.getSelection();const range=document.createRange();range.selectNodeContents(this[0]);selection.removeAllRanges();selection.addRange(range);}};$(document).ready(function documentReadyFunction(){$('select').change(function submitOnChange(){$('input[name=generate]').val('false');$(this).closest('form').submit();});$('input[name^="level_for_"]').change(function updateOnLevelChange(){const changed=$(this).attr('name');let weeks=$('input[name="level_for_weeks"]').prop('checked');let months=$('input[name="level_for_months"]').prop('checked');if(!weeks&&!months){if(changed==='level_for_weeks'){$('input[name="level_for_months"]').prop('checked',true);months=true;}else{$('input[name="level_for_weeks"]').prop('checked',true);weeks=true;}}
if(!weeks){$('.checkbox:has(input[name="level_for_weeks"])').addClass('off');}else{$('.checkbox:has(input[name="level_for_weeks"])').removeClass('off');}
if(!months){$('.checkbox:has(input[name="level_for_months"])').addClass('off');}else{$('.checkbox:has(input[name="level_for_months"])').removeClass('off');}
$('input[name=generate]').val('false');$(this).closest('form').submit();});$('input[name$="_abbreviated"]').change(function updateOnAbbreviatedChange(){$('input[name=generate]').val('false');$(this).closest('form').submit();});$('#calendar_generator_form').submit(function onSubmitActions(){(function trackFormSubmitEvent(){if($('input[name=generate]').val()==='false'){pushDataLayerEvent('gtm.trackEvent','calendar generator form interactions','submitted without generating a new list',false,false,{context:$('#calendar_generator_form').serialize(),},);}else{pushDataLayerEvent('gtm.trackEvent','calendar generator form interactions','submitted with generating a new list',false,false,{context:$('#calendar_generator_form').serialize(),},);}}());$('*:disabled').removeAttr('disabled');});$('.select_link').on('click',function clickToSelect(e){e.preventDefault();const selector=$(this).data('selector');$(selector).selectText();if($('#copy_hint').length===0){const isMac=(navigator.platform.indexOf('Mac')>-1);$(this).after(`<span id='copy_hint'>(press ${isMac?'cmd ⌘':'Ctrl'}+C to copy)</span>`);}
pushDataLayerEvent('gtm.trackEvent','calendar generator form interactions','clicked select link',false,false,{context:$('#calendar_generator_form').serialize(),},);});$('[data-toggle="tooltip"]').tooltip();});function pushDataLayerEvent(eventType,eventCategory,eventAction,eventLabel,eventNonInteraction,extraParameters){if(window.dataLayer!=null&&eventType!=null&&eventCategory!=null&&eventAction!=null){const eventPayload={};eventPayload.event=eventType;eventPayload.eventCategory=eventCategory;eventPayload.eventAction=eventAction;eventPayload.eventLabel=eventLabel||'';eventPayload.eventNonInteraction=eventNonInteraction||'False';const parameters=extraParameters||{};Object.keys(parameters).forEach(function addParametersToPayload(key){eventPayload[key]=parameters[key];});window.dataLayer.push(eventPayload);}else{console.warn('ga-functions.js: Failed to send the requested event because one of the required parameters was missing');}}
const cookieName='warning_modal_shown';function getCookie(cname){const name=`${cname}=`;const decodedCookie=decodeURIComponent(document.cookie);const ca=decodedCookie.split(';');for(let i=0;i<ca.length;i++){let c=ca[i];while(c.charAt(0)===' '){c=c.substring(1);}
if(c.indexOf(name)===0){return c.substring(name.length,c.length);}}
return'';}
function setCookie(cname,cvalue,exdays){const d=new Date();d.setTime(d.getTime()+(exdays*24*60*60*1000));const expires=`expires=${d.toUTCString()}`;document.cookie=`${cname}=${cvalue};${expires};path=/`;
}

function setModalCookie(cname) {
  setCookie(cname, 'true', 365);
}

function pushCloseModalEvent(eventLabel) {
  pushDataLayerEvent(
    'gtm.trackEvent',
    'warning modal interactions',
    'modal closed',
    eventLabel,
  );
}

if (getCookie(cookieName) === '') {
  window.addEventListener('DOMContentLoaded', () => {
    const modalOverlay = document.getElementById('modal_overlay');
    const modalDarken = document.getElementById('modal_darken');
    const closeButton = document.getElementsByClassName('modal_close')[0];

    modalOverlay.style.display = 'flex';

    //When the user clicks on the X,close the modal
closeButton.onclick=function clickedModalClose(event){modalOverlay.style.display='none';setModalCookie(cookieName);pushCloseModalEvent('by clicking on the X');event.preventDefault();};window.onclick=function clickedModalButton(event){if(event.target===modalDarken){modalOverlay.style.display='none';setModalCookie(cookieName);pushCloseModalEvent('by clicking outside of the modal');event.preventDefault();}else if(event.target.classList.contains('modal_button')){modalOverlay.style.display='none';setModalCookie(cookieName);if(event.target.classList.contains('new_user')){pushCloseModalEvent('by clicking the "new user" button');}else if(event.target.classList.contains('free_user')){pushCloseModalEvent('by clicking the "free user" button');}else if(event.target.classList.contains('pro_user')){pushCloseModalEvent('by clicking the "pro user" button');}
event.preventDefault();}};});}