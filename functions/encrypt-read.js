/* Import faunaDB sdk */
const faunadb = require("faunadb");
const getId = require("./utils/getId");
const q = faunadb.query;

exports.handler = (event, context) => {
  /* configure faunaDB Client with our secret */
  const client = new faunadb.Client({
    secret: process.env.FAUNADB_SERVER_SECRET
  });
  const id = getId(event.path);
  console.log(`Function 'encrpyt-read' invoked. Read id: ${id}`);
  return client
    .query(q.Paginate(q.Match(q.Ref("indexes/all_passwords"))))
    .then((response) => {
      const todoRefs = response.data;
      console.log("Todo refs", todoRefs);
      console.log(`${todoRefs.length} todos found`);
      // create new query out of todo refs. http://bit.ly/2LG3MLg
      const getAllTodoDataQuery = todoRefs.map((ref) => {
        return q.Get(ref);
      });
      // then query the refs
      return client.query(getAllTodoDataQuery).then((ret) => {
        return {
          statusCode: 200,
          body: JSON.stringify(ret)
        };
      });
    })
    .catch((error) => {
      console.log("error", error);
      return {
        statusCode: 400,
        body: JSON.stringify(error)
      };
    });
};
