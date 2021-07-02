/* Api methods to call /functions */

const readAll = () => {
  return fetch(
    "https://goofy-elion-2b3cba.netlify.app/.netlify/functions/encrypt-read-all"
  ).then((response) => {
    return response.json();
  });
};

const read = (id) => {
  return fetch(
    `https://goofy-elion-2b3cba.netlify.app/.netlify/functions/encrypt-read/${id}`
  ).then((response) => {
    return response.json();
  });
};

export default {
  readAll: readAll,
  read: read
};
