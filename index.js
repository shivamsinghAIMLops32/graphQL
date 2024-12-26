const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const BodyParser = require('body-parser');
const cors = require('cors');

async function startServer() {
    const app = express();

    // Define the GraphQL schema (typeDefs)
    const typeDefs = `
        type Todo {
            id: ID!
            title: String!
            completed: Boolean!
        }

        type Query {
            getTodos: [Todo]
        }

        type Mutation {
            addTodo(title: String!): Todo
            updateTodo(id: ID!, completed: Boolean!): Todo
        }
    `;

    // Define resolvers
    const resolvers = {
        Query: {
            getTodos: () => {
                // Sample data, replace this with actual database queries
                return [
                    { id: "1", title: "Buy groceries", completed: false },
                    { id: "2", title: "Clean the house", completed: true }
                ];
            }
        },
        Mutation: {
            addTodo: (parent, { title }) => {
                const newTodo = { id: String(Math.random()), title, completed: false };
                return newTodo;
            },
            updateTodo: (parent, { id, completed }) => {
                // Sample data for simplicity, you'd want to update a database here
                return { id, title: "Some Todo", completed };  // Example return, adjust as necessary
            }
        }
    };

    // Initialize the Apollo Server
    const server = new ApolloServer({
        typeDefs,
        resolvers
    });

    app.use(cors());
    app.use(BodyParser.json());

    // Start the Apollo Server
    await server.start();
    app.use("/graphql", expressMiddleware(server));

    // Start the Express app
    app.listen(4000, () => {
        console.log("Server started at http://localhost:4000/graphql");
    });
}

startServer();
