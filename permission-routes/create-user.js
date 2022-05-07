//only for the admin tools
const faunadb = require('faunadb');
const FaunaError = require('../errors/FaunaError.js');

// We do this so that our FQL code is cleaner
const {Create, Collection} = faunadb.query;

module.exports = {
  // Validation schema for the Fastify route
  schema: {
    body: {
      type: 'object',
      required: ['username', 'password', 'avatar', 'profile', 'permissions'],
      properties: {
        username: {type: 'string'},
        password: {
          type: 'string',
          minLength: 1
        },
        avatar: {type: 'string'},
        profile: {type: 'string'},
        permissions: {type: 'string'}
      }
    }
  },
  async handler (request, reply) {

    const {username, password, avatar, profile, permissions} = request.body;

    const client = new faunadb.Client({
      secret: "fnAEk90-ygACUNbL0fnDacHFhUD7udD0KjbFifrI"
    });

    try {

      // Create a new user document with credentials
      const result = await client.query(
        Create(
          Collection('permissions'),
          {
            data: {
              username,
              avatar,
              profile,
              permissions
            },
            credentials: {password}
          }
        )
      );

      // Return the created document
      reply.send(result);

    } catch (error) {
      throw new FaunaError(error);
    }
  }
};