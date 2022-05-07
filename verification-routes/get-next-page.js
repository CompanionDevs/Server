const faunadb = require('faunadb');
const FaunaError = require('../errors/FaunaError.js');

const { Get, Collection, Lambda, Documents, Paginate, Map, Match, Index } = faunadb.query;

module.exports = {

  
  schema: {
    params: {
      type: 'object',
      required: ['pageNum'],
      properties: {
        pageNum: {
          type: 'string',
          pattern: "[0-9]+"
        }
      }
    }
  },
  async handler (request, reply) {

     const num = request.params.pageNum;

    
    const client = new faunadb.Client({
      secret: "fnAEk90-ygACUNbL0fnDacHFhUD7udD0KjbFifrI"
    });
    try {
     
      // Authenticate with Fauna
     
     
      const findAfter = await client.query(
           Paginate(Match(Index('all_verification_requests')), { size: parseInt(num)*12})
        
         );
      
        
        if (findAfter.after){
          const result = await client.query(
               Map(Paginate(Match(Index('all_verification_requests')), { size: 12, after: findAfter.after}),Lambda(x => Get(x)))
            );
           reply.send(result.data)
        } else if (num === '0'){
           const result = await client.query(
               Map(Paginate(Match(Index('all_verification_requests')), { size: 12, after: findAfter.before}),Lambda(x => Get(x)))
            );
          reply.send(result.data)
          
        } else {
          reply.send(`{"end":"true"}`)
        }
          
            
         
         /// reply.send(result.data)
       
        
       
      
      
      
      // Return the document
     
   
    
      

    } catch (error) {
      throw new FaunaError(error);
    }
  }
  
};