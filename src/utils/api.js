/* Api methods to call /functions */

const readAll = () => {
  /*return fetch(
    "https://goofy-elion-2b3cba.netlify.app/.netlify/functions/encrypt-read-all"
  ).then((response) => {
    return response.json();
  });*/
  console.log("readAll");
  const myPromise = new Promise((resolve, reject) => {
    console.log("readAll resolve");
    setTimeout(() => {
      /*resolve([
        {
          ref: {
            "@ref": {
              id: "302632691385238030",
              collection: {
                "@ref": {
                  id: "passwords",
                  collection: {
                    "@ref": {
                      id: "collections"
                    }
                  }
                }
              }
            }
          },
          ts: 1625208725800000,
          data: {
            user_id: "1",
            login: "1@test.com",
            password: "U2FsdGVkX1/rymJnHJfAPgnqQ+ChfjctZ31l3xHuCh0="
          }
        },
        {
          ref: {
            "@ref": {
              id: "302970811339244043",
              collection: {
                "@ref": {
                  id: "passwords",
                  collection: {
                    "@ref": {
                      id: "collections"
                    }
                  }
                }
              }
            }
          },
          ts: 1625208732730000,
          data: {
            user_id: "2",
            login: "2@test.com",
            password: "U2FsdGVkX1/ILkcmUOX6hQcS97/dpmRpKNw3c0jFUbw="
          }
        }
      ]);*/
      resolve([
        {
          id: "302632691385238030",
          user_id: "1",
          name: "facebook",
          login: "1@test.com",
          password: "U2FsdGVkX1+an9owwnqLJI+wyj81Oy7S7O2lcTuLIDE="
        },
        {
          id: "302970811339244043",
          user_id: "2",
          name: "twitter",
          login: "2@test.com",
          password: "U2FsdGVkX1/ILkcmUOX6hQcS97/dpmRpKNw3c0jFUbw="
        }
      ]);
    }, 100);
  });
  return myPromise;
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
