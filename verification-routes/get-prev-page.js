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
     
     
        const findBefore = await client.query(
           Paginate(Match(Index('all_verification_requests')), { size: parseInt(num)*12})
        
         );
      
        if (num <= 1){
          reply.send(`{"end":"true"}`)
        } else if (findBefore.after){
          const result = await client.query(
               Map(Paginate(Match(Index('all_verification_requests')), { size: 12, after: findBefore.after}),Lambda(x => Get(x)))
            );
          const result2 = await client.query(
               Map(Paginate(Match(Index('all_verification_requests')), { size: 12, before: result.before}),Lambda(x => Get(x)))
            );
          const result3 = await client.query(
               Map(Paginate(Match(Index('all_verification_requests')), { size: 12, before: result2.before}),Lambda(x => Get(x)))
            );
           reply.send(result3.data)
        } else {
          const findBeforeMinus = await client.query(
           Paginate(Match(Index('all_verification_requests')), { size: (parseInt(num-2)*12)})
        
         );
           const result = await client.query(
               Map(Paginate(Match(Index('all_verification_requests')), { size: 12, after: findBeforeMinus.after}),Lambda(x => Get(x)))
            );
           reply.send(result.data)
        }
          
       

   
        
       
       
        
       
      
      
      
      // Return the document
     
   
    
      

    } catch (error) {
      throw new FaunaError(error);
    }
  }
  
};