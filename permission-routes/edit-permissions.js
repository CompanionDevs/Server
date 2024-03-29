const faunadb = require('faunadb');
const FaunaError = require('../errors/FaunaError.js');

const {Get, Ref, Collection, Update} = faunadb.query;

module.exports = {
  config: {
    isPrivate: true
  },
  schema: {
    params: {
      type: 'object',
      required: ['userId'],
      properties: {
        userId: {
          type: 'string',
          pattern: "[0-9]+"
        }
      }
    }
  },
  async handler (request, reply) {

    const userId = request.params.userId;

    const client = new faunadb.Client({
      secret: "fnAEk90-ygACUNbL0fnDacHFhUD7udD0KjbFifrI"
    });

    try {

        // Get the user document
        const result = await client.query(
            Update(
              Ref (
                Collection("permissions"), userId
              ),
                {
                  data: request.body,
                }
            )
        );

        // Return the document
        reply.send(result);

    } catch (error) {
        throw new FaunaError(error);
    }
  }
};