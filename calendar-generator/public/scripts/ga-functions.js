// ga-functions.js

function pushDataLayerEvent(eventType, eventCategory, eventAction, eventLabel,
  eventNonInteraction, extraParameters) {
  if (window.dataLayer != null && eventType != null && eventCategory != null && eventAction != null) {
    const eventPayload = {};

    eventPayload.event = eventType;
    eventPayload.eventCategory = eventCategory;
    eventPayload.eventAction = eventAction;
    eventPayload.eventLabel = eventLabel || '';
    eventPayload.eventNonInteraction = eventNonInteraction || 'False';

    const parameters = extraParameters || {};
    Object.keys(parameters).forEach(function addParametersToPayload(key) {
      eventPayload[key] = parameters[key];
    });

    window.dataLayer.push(eventPayload);
  } else {
    console.warn('ga-functions.js: Failed to send the requested event because one of the required parameters was missing');
  }
}
