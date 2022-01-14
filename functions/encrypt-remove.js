const faunadb = require("faunadb");
const getId = require("./utils/getId");
const q = faunadb.query;

exports.handler = (event, context) => {
  /* configure faunaDB Client with our secret */
  const client = new faunadb.Client({
    secret: process.env.FAUNADB_SERVER_SECRET
  });
  const id = getId(event.path);
  console.log(`Function 'encrypt-remove' invoked. remove doc-id: ${id}`);
  return client
    .query(q.Delete(q.Ref(q.Collection("passwords"), id)))
    .then((response) => {
      console.log("success", response);
      return {
        statusCode: 200,
        body: JSON.stringify(response)
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
