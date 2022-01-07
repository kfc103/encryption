/* Api methods to call /functions */

const readAll = (user) => {
  console.log("readAll");
  const myPromise = new Promise((resolve, reject) => {
    fetch(
      //"https://goofy-elion-2b3cba.netlify.app/.netlify/functions/encrypt-read-all"
      "https://esecret.netlify.app/.netlify/functions/encrypt-read-all"
    )
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
    //`https://goofy-elion-2b3cba.netlify.app/.netlify/functions/encrypt-read/${id}`
    `https://esecret.netlify.app/.netlify/functions/encrypt-read-all/${id}`
  ).then((response) => {
    return response.json();
  });*/

  const myPromise = new Promise((resolve, reject) => {
    fetch(
      `https://esecret.netlify.app/.netlify/functions/encrypt-read-all/${id}`
    )
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
};

export default {
  readAll: readAll,
  read: read
};
