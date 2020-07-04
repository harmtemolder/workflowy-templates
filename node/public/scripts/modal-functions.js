// modal-functions.js

const cookieName = 'warning_modal_shown';

function getCookie(cname) {
  const name = `${cname}=`;
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return '';
}

function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  const expires = `expires=${d.toUTCString()}`;
  document.cookie = `${cname}=${cvalue};${expires};path=/`;
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
    const modalOverlay = document.getElementById('modal-overlay');
    const modalDarken = document.getElementById('modal-darken');
    const closeButton = document.getElementsByClassName('modal-close')[0];

    modalOverlay.style.display = 'flex';

    // When the user clicks on the X, close the modal
    closeButton.onclick = function clickedModalClose(event) {
      modalOverlay.style.display = 'none';
      setModalCookie(cookieName);
      pushCloseModalEvent('by clicking on the X');

      event.preventDefault();
    };

    window.onclick = function clickedModalButton(event) {
      if (event.target === modalDarken) {
        // When the user clicks anywhere outside of the modal, close it

        modalOverlay.style.display = 'none';
        setModalCookie(cookieName);
        pushCloseModalEvent('by clicking outside of the modal');

        event.preventDefault();
      } else if (event.target.classList.contains('modal-button')) {
        // When the user clicks on one of the buttons in the modal, close it

        modalOverlay.style.display = 'none';
        setModalCookie(cookieName);

        if (event.target.classList.contains('new-user')) {
          pushCloseModalEvent('by clicking the "new user" button');
        } else if (event.target.classList.contains('free-user')) {
          pushCloseModalEvent('by clicking the "free user" button');
        } else if (event.target.classList.contains('pro-user')) {
          pushCloseModalEvent('by clicking the "pro user" button');
        }

        event.preventDefault();
      }
    };
  });
}
