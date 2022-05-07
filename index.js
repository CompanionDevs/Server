
const fastify = require('fastify')({ logger: true });
const req = require('request-promise');
const _required = (variable) => {
    if (variable === "" || variable === undefined) {
        throw ("Param cant be blank");
    }
}


fastify.register(require('fastify-cors'), { 
   origin: true,
   credentials: true,
   
   allowedHeaders: ['Origin', 'X-Requested-With', 'Accept', 'Content-Type', 'Authorization','fauna-secret'],
   methods: ['GET', 'PUT', 'PATCH', 'POST', 'DELETE']
})
//home
fastify.get('/', require('./home.js'));
//user permissions
fastify.post('/users', require('./permission-routes/create-user.js'));
fastify.post('/login', require('./permission-routes/login.js'));
fastify.get('/users/:userId', require('./permission-routes/get-user.js'));
fastify.get('/all', require('./permission-routes/get-all.js'));
fastify.delete('/users/:userId', require('./permission-routes/delete-user.js'));
fastify.patch('/permissions/:userId', require('./permission-routes/edit-permissions.js'));

//verification queue
fastify.post('/request-verify-add', require('./verification-routes/create-request.js'));

fastify.delete('/answers/:answerId', require('./verification-routes/delete-answer.js'));
fastify.get('/get_answer_by_id/:answerId', require('./verification-routes/get_answer_by_id.js'));
fastify.get('/get_next_page/:pageNum', require('./verification-routes/get-next-page.js'));
fastify.get('/get_prev_page/:pageNum', require('./verification-routes/get-prev-page.js'));

fastify.addHook('onRequest', async (request, reply) => {

  // If the route is not private we ignore this hook
  if (!reply.context.config.isPrivate) return;

  const faunaSecret = request.headers['fauna-secret'];

  // If there is no header
  if (!faunaSecret) {
    reply.status(401).send();
    return;
  }

  // Add the secret to the request object
  request.faunaSecret = faunaSecret;
});

fastify.decorateRequest('faunaSecret', '');

async function start () {
  try {
    await fastify.listen(8080, "::");
    fastify.log.info(`server listening on ${fastify.server.address().port}`);
  } catch (err) {
    fastify.log.error(err)
    process.exit(1);
  }
};

start();


const clean = (data) => {
    let regex = /(<([^>]+)>)/ig;
    data = data.replace(/(<br?\s?\/>)/ig, ' \n');
    return data.replace(regex, '');
};
