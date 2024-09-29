import cors from "@elysiajs/cors";
import axios from "axios";
import { Elysia, t } from "elysia";
import { HttpStatusCode } from "elysia-http-status-code";
import { Logestic } from "logestic";

export const URL_PIPEFY = "https://api.pipefy.com/graphql"

const app = new Elysia()
  .use(cors())
  .use(Logestic.preset('fancy'))
  .use(HttpStatusCode())

  .get("/", () => "Arcoplus API!")
  
  .post("createCard", async ({ body, set, httpStatus, logestic }) => {

    // Request Pipefy API to create a new card
    const response = await axios({
      method: 'post',
      url: URL_PIPEFY,
      data: {
        query: `
          mutation{
            createCard(
              input:{
                pipe_id:${process.env.PIPE_ID},
                fields_attributes:[
                  {
                    field_id: "taskname",
                    field_value: "TesteContente3"
                  }
                ]
              }
            ) {
              clientMutationId
            }
          }
        `
      },
      headers: {
        'Authorization': `Bearer ${process.env.PERSONAL_TOKEN}`
      }
    });

    // Error/Status Handling
    if(response.status != 200){
      logestic.error("Request Failed!");
      set.status = response.status;
    }else if(response.data.errors?.length > 0){
      logestic.error("Failed to create new Card:");
      logestic.error(response.data.errors.map((error: any) => error.message));
      set.status = httpStatus.HTTP_500_INTERNAL_SERVER_ERROR;
    }else{
      set.status = httpStatus.HTTP_201_CREATED;
    }

    return response.data;
    
  })

  .listen(process.env.PORT || 3000);

console.log(
  `Arcoplus API is running at ${app.server?.hostname}:${app.server?.port}!`
);
