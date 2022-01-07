/* Import faunaDB sdk */
const faunadb = require("faunadb");
const q = faunadb.query;

exports.handler = async (event, context) => {
  // Only allow POST
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  // When the method is POST, the name will no longer be in the event’s
  // queryStringParameters – it’ll be in the event body encoded as a query string

  console.log(event.body);
  console.log(JSON.parse(event.body));
  const params = JSON.parse(event.body);

  /* configure faunaDB Client with our secret */
  const client = new faunadb.Client({
    secret: process.env.FAUNADB_SERVER_SECRET
  });
  console.log(`Function 'encrpyt-insert' invoked.`);
  return client
    .query(
      q.Create(q.Collection("passwords"), {
        data: {
          user_id: "44753dc6-4e9a-4581-8d25-ffee04d61539",
          name: "Facebook1",
          login: "1fb.test@test.com",
          password: "U2FsdGVkX1/ILkcmUOX6hQcS97/dpmRpKNw3c0jFUbw="
        }
      })
    )
    .then((ret) => {
      return {
        statusCode: 200,
        body: JSON.stringify(ret)
      };
    })
    .catch((error) => {
      console.log("error", error);
      return {
        statusCode: 400,
        body: JSON.stringify(error)
      };
    });
};
