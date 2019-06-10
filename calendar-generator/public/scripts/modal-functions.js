// modal-functions.js

function pushDataLayerEvent(eventType, eventCategory, eventAction, eventLabel,
  eventNonInteraction) {
  if (window.dataLayer != null) {
    window.dataLayer.push({
      event: eventType,
      eventCategory,
      eventAction,
      eventLabel,
      eventNonInteraction,
    });
  }
}

function pushCloseModalEvent(eventLabel) {
  pushDataLayerEvent(
    'gtm.click',
    'click interaction',
    'warning modal closed',
    eventLabel,
  );
}

window.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('warning-modal');
  const closeButton = document.getElementsByClassName('modal-close')[0];

  // When the user clicks on the X, close the modal
  closeButton.onclick = function clickedModalClose() {
    modal.style.display = 'none';
    pushCloseModalEvent('by clicking on the X');
  };

  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function clickedOutsideModal(event) {
    if (event.target === modal) {
      modal.style.display = 'none';
      pushCloseModalEvent('by clicking outside of the modal');
    }
  };

  // When the user clicks on one of the buttons in the modal, close it
  window.onclick = function clickedModalButton(event) {
    if (event.target.classList.contains('modal-button')) {
      if (event.target.classList.contains('new-user')) {
        modal.style.display = 'none';
        pushCloseModalEvent('by clicking the "new user" button');
      } else if (event.target.classList.contains('free-user')) {
        modal.style.display = 'none';
        pushCloseModalEvent('by clicking the "free user" button');
      } else if (event.target.classList.contains('pro-user')) {
        modal.style.display = 'none';
        pushCloseModalEvent('by clicking the "pro user" button');
      }
    }
  };
});
