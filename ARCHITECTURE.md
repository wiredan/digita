# Backend Architecture Overview
This document outlines the current persistence strategy for the DECENTRALIZED AGRIBUSINESS NETWORK (DAN) application and details the recommended architectural evolution.
## 1. Current Architecture: Single Durable Object
The application currently employs a unified persistence model built on a single Cloudflare Durable Object (DO) class, `GlobalDurableObject`.
### How It Works:
-   **Centralized State:** All application data—including user profiles, product listings, and orders—is stored within instances of this single DO class.
-   **Entity Abstraction:** To manage different data types, we use a TypeScript-based abstraction layer. Core business objects (`UserProfile`, `Product`, `Order`) are defined as `Entity` classes. Each entity instance maps to a unique key within a DO instance, effectively namespacing the data.
-   **Indexing:** A simple prefix-based indexing mechanism, also built on the DO, allows for listing all entities of a certain type (e.g., fetching all products for the marketplace).
-   **Simplicity:** This model was chosen for its rapid development capabilities, as it requires only a single service binding and simplifies the initial backend setup. It functions like a transactional key-value store.
### Limitations:
-   **Scalability:** While effective for prototypes and low-traffic applications, this model does not scale well for complex queries (e.g., filtering products by category and price) or large datasets.
-   **Relational Integrity:** It lacks the features of a true relational database, such as foreign key constraints, joins, and complex transactions.
-   **Storage Inefficiency:** It is not optimized for storing large binary data, such as images or documents, which would be required for a production-grade KYC system.
## 2. Proposed Architecture: D1, KV, and R2
As per client feedback, the recommended and industry-standard architecture for a production-grade application on Cloudflare involves a multi-service approach, leveraging the strengths of different storage products.
### Proposed Components:
1.  **Cloudflare D1 (Relational Database):**
    -   **Purpose:** To store all structured, relational data.
    -   **Data:** `Users`, `Products`, `Orders`, `Disputes`.
    -   **Benefits:** Provides ACID compliance, SQL query capabilities, and is built for scalable, low-latency database access at the edge. This would allow for powerful filtering, sorting, and aggregation of marketplace data.
2.  **Cloudflare KV (Key-Value Store):**
    -   **Purpose:** For high-availability, low-latency reads of non-critical, frequently accessed data.
    -   **Data:** User sessions, API rate limiting, feature flags, cached content from the Education Hub.
    -   **Benefits:** Extremely fast reads make it ideal for data that enhances user experience but doesn't require transactional consistency.
3.  **Cloudflare R2 (Object Storage):**
    -   **Purpose:** To store unstructured binary data (files).
    -   **Data:** Product images, user-uploaded KYC documents (ID cards, selfies), videos for the Education Hub.
    -   **Benefits:** Provides S3-compatible, zero-egress-fee object storage. It is the most cost-effective and performant solution for handling large files.
## 3. Implementation Status & Constraints
**Recommendation:** We strongly recommend migrating to the proposed D1/KV/R2 architecture for the production version of the application to ensure scalability, data integrity, and cost-efficiency.
**Current Constraint:** The project is currently developed within a standardized Cloudflare Pages template that **enforces a strict, locked-down configuration**. This includes a `wrangler.jsonc` file that cannot be modified. Adding the necessary service bindings for D1, KV, and R2 requires changes to this file.
**Conclusion:** Due to this platform-level constraint, **the architectural refactor is currently blocked**. The application will continue to use the Durable Object model until the development environment permits the addition of new service bindings. This document serves as a formal record of the architectural recommendation and the technical constraints preventing its immediate implementation.