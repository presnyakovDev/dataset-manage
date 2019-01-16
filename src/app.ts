import * as express from 'express';
import * as  graphqlHTTP from 'express-graphql';
import  { buildSchema } from 'graphql';
const app = express();

// Construct a schema, using GraphQL schema language
const schema = buildSchema(`
  type Query {
    getDataset(_id:String): Dataset
    getDatasets:[Dataset]
  }

  type Dataset {
    decription: String
    date: String
    _id: String
    examples:[Example]
  }

  type Example {
    _id: String
    datasetId: String
    averagePrice: Int,
    changePercent: Int,
    upOrDown: Int,
    howFar:Int,
    forWeek: Int,
    forMonth: Int,
    for3Month: Int,
    for6Month: Int,
    forYear: Int
  }

  input ExampleInput {
    averagePrice: Int,
    changePercent: Int,
    upOrDown: Int,
    howFar:Int,
    forWeek: Int,
    forMonth: Int,
    for3Month: Int,
    for6Month: Int,
    forYear: Int
  }

  type Mutation {
    createDataset(description:String, examples:[ExampleInput]):Dataset
  }

  type schema {
    query: Query
    mutation: Mutation
  }
`);

// The root provides a resolver function for each API endpoint
const root = {
  getDataset: () => {
    return 'Empty!';
  },
  getDatasets:() => {
    return [];
  }
};


app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));
app.listen(4000);
console.log('Running a GraphQL API server at localhost:4000/graphql');
