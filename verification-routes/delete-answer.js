const faunadb = require('faunadb');
const FaunaError = require('../errors/FaunaError.js');

const {Delete, Ref, Collection} = faunadb.query;

module.exports = {
  config: {
    isPrivate: false
  },
  async handler (request, reply) {

    const answerId = request.params.answerId;

    const client = new faunadb.Client({
      secret: "fnAEk90-ygACUNbL0fnDacHFhUD7udD0KjbFifrI"
    });

    try {

      // Delete the user document
      const resultDelete = await client.query(
        Delete(
          Ref(
            Collection('verification_requests'),
            answerId
          )
        )
      );

      // Return the deleted document
      reply.send(resultDelete);

    } catch (error) {
      throw new FaunaError(error);
    }
  }
};