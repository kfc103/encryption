/* Api methods to call /functions */

const read = (userId) => {
  return fetch(
    `https://esecret.netlify.app/.netlify/functions/encrypt-read/${userId}`
  ).then((response) => {
    return response.json();
  });
};

const insert = (data) => {
  return fetch(
    "https://esecret.netlify.app/.netlify/functions/encrypt-insert",
    {
      body: JSON.stringify(data),
      method: "POST"
    }
  ).then((response) => {
    return response.json();
  });
};

const update = (docId, data) => {
  return fetch(`/.netlify/functions/encrypt-update/${docId}`, {
    body: JSON.stringify(data),
    method: "POST"
  }).then((response) => {
    return response.json();
  });
};

const remove = (docId) => {
  return fetch(`/.netlify/functions/encrypt-remove/${docId}`).then(
    (response) => {
      return response.json();
    }
  );
};

export default {
  read: read,
  insert: insert,
  update: update,
  remove: remove
};
