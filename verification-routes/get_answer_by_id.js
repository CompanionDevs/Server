const faunadb = require('faunadb');
const FaunaError = require('../errors/FaunaError.js');

const {Paginate, Match, Index, Get, Ref, Collection} = faunadb.query;

module.exports = {
  
  schema: {
    params: {
      type: 'object',
      required: ['answerId'],
      properties: {
        userId: {
          type: 'string',
          pattern: "[0-9]+"
        }
      }
    }
  },
  async handler (request, reply) {

    const answerId = request.params.answerId;

    const client = new faunadb.Client({
      secret: "fnAEk90-ygACUNbL0fnDacHFhUD7udD0KjbFifrI"
    });

    try {

        // Get the user document
        const result = await client.query(
          Get(
              Match(
                Index("get_answer_by_id"),
                answerId
              )
            )
              
        );

        

        // Return the document
        reply.send(result);

    } catch (error) {
        throw new FaunaError(error);
    }
  }
};