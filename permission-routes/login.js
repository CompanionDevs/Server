const faunadb = require('faunadb');
const FaunaError = require('../errors/FaunaError.js');

const {Login, Match, Index} = faunadb.query;

module.exports = {
  schema: {
    body: {
      type: 'object',
      required: ['username', 'password'],
      properties: {
        username: {type: 'string'},
        password: {type: 'string'}
      }
    }
  },
  async handler (request, reply) {

    const {username, password} = request.body;

    const client = new faunadb.Client({
      secret: "fnAEk90-ygACUNbL0fnDacHFhUD7udD0KjbFifrI"
    });

    try {

      // Authenticate with Fauna
      const result = await client.query(
        Login(
          Match(Index('users_by_username'), username),
          {password}
          )
        );
      

      // If the authentication was successful
      // return the secret to the client
      reply.send({secret: result})
      //reply.send({
      //  secret: result.secret
      //});

    } catch (error) {
      throw new FaunaError(error);
    }
  }
};