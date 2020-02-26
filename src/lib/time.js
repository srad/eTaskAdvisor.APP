/**
 * @param {String} dateTime Iso String
 * @returns {string}
 */
function formatDateTime(dateTime) {
  const dateAndTime = dateTime.split("T");
  const date = dateAndTime[0].split("-");
  const time = dateAndTime[1].split(":");

  return `${date[2]}.${date[1]}.${date[0]} at ${time[0]}:${time[1]}`;
}

export {formatDateTime};