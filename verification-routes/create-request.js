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
     
      properties: {
        
        approved: { type: 'object'},
        attachments: {type: 'array'},
        best: {type: 'string'},
        clientType: {type: 'string'},
        comments: { type: 'object'},
        content: {type: 'string'},
        created: {type: 'string'},
        id: {type: 'string'},
        mark: { type: 'string'},
        markPrecise: {type: 'string'},
        points: {type: 'string'},
        settings: {type: 'object'},
        source: { type: 'string'},
        taskId: {type: 'string'},
        thanks: {type: 'string'},
        userBestRankId: {type: 'string'},
        userId: {type: 'string'},
        userRequester: {type: 'string'},
        answerDBid: {type: 'string'},
        content: {type: 'string'},
        qid: {type: 'string'},
        subject: {type: 'string'},
        user: {type: 'object'},
        requesterId: {type: 'string'}
        
      }
    }
  },
  async handler (request, reply) {

    const {approved, attachments, best, clientType, comments,content,created,id,mark,markPrecise,points,settings,source,taskId,thanks,userBestRankId,userId, userRequester, answerDBid, qid, subject, user, requesterId} = request.body;

    const client = new faunadb.Client({
      secret: "fnAEk90-ygACUNbL0fnDacHFhUD7udD0KjbFifrI"
    });

    try {

      // Create a new user document with credentials
      const result = await client.query(
        Create(
          Collection('verification_requests'),
          {
            data: {
              
              approved,
              attachments,
              best,
              clientType,
              comments,
              content,
              created,
              id,
              mark,
              markPrecise,
              points,
              settings,
              source,
              taskId,
              thanks,
              userBestRankId,
              userId,
              userRequester, 
              answerDBid, 
              qid, 
              subject, 
              user,
              requesterId
            }
            
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