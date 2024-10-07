# OSData.space 🔬

### A tool for visualizing and querying biological space experiment data from NASA's Open Science Data Repository. 🚀🧑‍🚀

## Overview 🌱

**OSData.space** is a web application designed to enhance the understanding of biological experiments performed in space. The platform allows users to input a study link from NASA’s [Open Science Data Repository](https://osdr.nasa.gov), which is then scraped and processed using an automated system. The data is ingested into a Neo4j graph database, where entities and relationships are extracted to enable semantic queries and graph-based exploration.

## Features 🐭

- **Data Crawling**: Automatically scrapes biological study data from NASA's repository using [firecrawl.dev](https://firecrawl.dev).
- **Graph Database**: Ingests data into a Neo4j graph database, making relationships between entities easily queryable.
- **Semantic Querying**: Allows users to ask natural language questions about space experiments and retrieve meaningful insights from the graph.
- **Data Visualization**: Visualize the graph structure of study data, showing how different entities and concepts are related.

## Demo/Usage 🦠

1. **Input a Study**: Go to [OSData.space](https://osdata.space) and input a study link from NASA's Open Science Data Repository, for example, [OSD-379](https://osdr.nasa.gov/bio/repo/data/studies/OSD-379).
2. **Wait for Processing**: The system will crawl and process the data, which takes approximately 5-10 minutes, *currently there's no feedback on this process*.
3. **Explore the Graph**: After processing, you can query the graph using natural language questions (e.g., "What's OSD-379?") or browse the nodes and relationships to explore the extracted entities and metadata.
4. **Visualize Data**: The platform provides an intuitive graphical representation of the study's entities and relations, making it easier to understand the structure of complex space biological experiments.

So far only the OSD-379 was loaded into the system

## Technologies Used 🧑‍💻

- **Frontend**: Nuxt 3 with TailwindCSS and shadcn-vue for a smooth and responsive user interface.
- **Backend**: H3 Nitro API (Nuxt 3 backend) for handling study ingestion and queries.
- **Data Processing**: [firecrawl.dev](https://firecrawl.dev) for scraping and preparing data for processing.
- **Database**: Neo4j, a graph database used to store and visualize the relationships between entities in each biological experiment.
- **AI**: LLM-powered entity extraction and processing for a better semantic understanding of the study data, we are using gpt-4o-mini and openai embeddings.

## Installation (Local Development) 💪

To run OSData.space locally, follow these steps:

1. **Clone the repository**:
    ```bash
    git clone https://github.com/data-diego/osdata
    cd osdata
    ```

2. **Install dependencies** (make sure you have [pnpm](https://pnpm.io/) installed):
    ```bash
    pnpm i
    ```

3. **Run the development server**:
    ```bash
    pnpm run dev
    ```

4. Open your browser and navigate to `http://localhost:3000` to access the app.

## Contributing 🥸

Contributions are welcome! Please follow these steps to contribute:

1. Fork the repository.
2. Create a new branch: `git checkout -b feature-branch-name`.
3. Commit your changes: `git commit -m 'Add some feature'`.
4. Push to the branch: `git push origin feature-branch-name`.
5. Submit a pull request.
