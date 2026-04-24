import Fastify from "fastify"


const app = Fastify({
    logger:true
})


app.get("/", async (request, reply) =>{
    return reply.send({message: "API funcionando"})
})


export default app;