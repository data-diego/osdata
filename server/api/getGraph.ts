import 'neo4j-driver';
import { Neo4jGraph } from '@langchain/community/graphs/neo4j_graph';

export default defineEventHandler(async (event: any) => {
  try {
    // Extract environment variables
    const url = process.env.NEO4J_URI ?? '';
    const username = process.env.NEO4J_USERNAME ?? '';
    const password = process.env.NEO4J_PASSWORD ?? '';

    // Initialize Neo4jGraph
    const graph = await Neo4jGraph.initialize({ url, username, password });

    // Your Cypher query
    const query = 'MATCH (s)-[r:MENTIONS]->(t) RETURN s, r, t LIMIT 25';

    // Run the query
    const result = await graph.query(query);

    // Structure the result into nodes and relationships
    const nodes: any[] = [];
    const relationships: any[] = [];

    // Loop through the result directly (no "records" property)
    result.forEach((record: Record<string, any>) => {
      const node1 = record.s;  // Access the 's' key directly
      const node2 = record.t;  // Access the 't' key directly
      const relationship = record.r;  // Access the 'r' key directly

      // Add nodes and relationships
      nodes.push({
        id: node1.identity.toString(),
        label: node1.labels[0],
        properties: node1.properties,
      });

      nodes.push({
        id: node2.identity.toString(),
        label: node2.labels[0],
        properties: node2.properties,
      });

      relationships.push({
        from: node1.identity.toString(),
        to: node2.identity.toString(),
        type: relationship.type,
      });
    });

    // Return the nodes and relationships as JSON
    return {
      nodes,
      relationships,
    };
  } catch (error) {
    console.error('Error fetching data from Neo4j:', error);
    return {
      statusCode: 500,
      message: 'Failed to fetch data',
    };
  }
});
