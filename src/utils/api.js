/* Api methods to call /functions */

const readAll = (user) => {
  console.log("readAll");
  const myPromise = new Promise((resolve, reject) => {
    fetch("https://esecret.netlify.app/.netlify/functions/encrypt-read-all")
      .then((response) => response.json())
      .then((data) => {
        //console.log(data);
        const arr = [];
        let i = 0;
        for (let item of data) arr[i++] = item.data;
        resolve(arr);
      })
      .catch(console.error);
  });
  return myPromise;

  /*console.log("readAll " + user.email);
  const myPromise = new Promise((resolve, reject) => {
    console.log("readAll resolve");
    setTimeout(() => {
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
  return myPromise;*/
};

const read = (id) => {
  /*return fetch(
    `https://esecret.netlify.app/.netlify/functions/encrypt-read/${id}`
  ).then((response) => {
    return response.json();
  });*/

  return [
    {
      ref: {
        "@ref": {
          id: "320058835581534795",
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
      ts: 1641490741658000,
      data: {
        user_id: "44753dc6-4e9a-4581-8d25-ffee04d61539",
        name: "twitter",
        login: "2122@test.com",
        password: "U2FsdGVkX1/ILkcmUOX6hQcS97/dpmRpKNw3c0jFUbw="
      }
    },
    {
      ref: {
        "@ref": {
          id: "320118198171075147",
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
      ts: 1641547353815000,
      data: {
        user_id: "44753dc6-4e9a-4581-8d25-ffee04d61539",
        name: "Facebook",
        login: "fb.test@test.com",
        password: "U2FsdGVkX1/ILkcmUOX6hQcS97/dpmRpKNw3c0jFUbw="
      }
    },
    {
      ref: {
        "@ref": {
          id: "320139285350056529",
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
      ts: 1641567464115000,
      data: {
        user_id: "44753dc6-4e9a-4581-8d25-ffee04d61539",
        name: "Facebook1",
        login: "1fb.test@test.com",
        password: "U2FsdGVkX1/ILkcmUOX6hQcS97/dpmRpKNw3c0jFUbw="
      }
    }
  ];
  /*const myPromise = new Promise((resolve, reject) => {
    //console.log(id);
    fetch(`https://esecret.netlify.app/.netlify/functions/encrypt-read/${id}`)
      .then((response) => {
        console.log(response.json());
        response.json();
      })
      .then((data) => {
        //console.log(data);
        const arr = [];
        let i = 0;
        for (let item of data) arr[i++] = item.data;
        resolve(arr);
      })
      .catch(console.error);
  });
  return myPromise;*/
};

const insert = (data) => {
  console.log("insert");
  const myPromise = new Promise((resolve, reject) => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: "44753dc6-4e9a-4581-8d25-ffee04d61539",
        name: "Facebook1",
        login: "1fb.test@test.com",
        password: "U2FsdGVkX1/ILkcmUOX6hQcS97/dpmRpKNw3c0jFUbw="
      })
    };
    console.log("insert-fetch");
    fetch(
      "https://esecret.netlify.app/.netlify/functions/encrypt-insert",
      requestOptions
    )
      .then((response) => {
        console.log(response.json());
        response.json();
      })
      .then((data) => console.log(data));
    console.log("insert-fetched");
  });
  return myPromise;
};

const update = (docId, data) => {
  return fetch(`/.netlify/functions/encrypt-update/${docId}`, {
    body: JSON.stringify(data),
    method: "POST"
  }).then((response) => {
    return response.json();
  });
};

export default {
  readAll: readAll,
  read: read,
  insert: insert
};
