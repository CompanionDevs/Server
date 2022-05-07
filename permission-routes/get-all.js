const faunadb = require('faunadb');
const FaunaError = require('../errors/FaunaError.js');

const { Get, Collection, Lambda, Documents, Paginate, Map } = faunadb.query;

module.exports = {

  config: {
    isPrivate: false
  },
  async handler (request, reply) {

    

    
    const client = new faunadb.Client({
      secret: "fnAEk90-ygACUNbL0fnDacHFhUD7udD0KjbFifrI"
    });
    try {
      
      // Authenticate with Fauna
       const result = await client.query(
        Map(
          Paginate(Documents(Collection('permissions'))),
          Lambda(x => Get(x))
        )
      );
      // Return the document
      reply.send(result.data);
    
     
      //reply.send({
      //  secret: result.secret
      //});

    } catch (error) {
      throw new FaunaError(error);
    }
  }
};