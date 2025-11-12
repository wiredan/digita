# DECENTRALIZED AGRIBUSINESS NETWORK (DAN)
DECENTRALIZED AGRIBUSINESS NETWORK (DAN) is a comprehensive, full-stack agribusiness marketplace designed to connect farmers, buyers, and logistics providers in a secure and efficient ecosystem. The platform facilitates the buying and selling of crops and agricultural products, with all transactions gated by a mandatory KYC verification process. It features a robust order tracking system, integrated payment solutions supporting both traditional banking (via Paystack) and cryptocurrency (Sidrachain tokens), and an automated dispute resolution mechanism overseen by administrators. Additionally, DAN includes an Education Hub with regularly updated content, and an AI-powered assistant to guide users and provide market insights. The entire platform is built on a modern, scalable serverless architecture using Cloudflare Workers, ensuring high performance and reliability.
[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/wiredan/digita)
## ✨ Key Features
*   **Marketplace:** A comprehensive platform for buying and selling crops and farm products.
*   **Secure Transactions:** All trading is restricted to KYC-verified users, ensuring a trusted environment.
*   **Order Tracking:** End-to-end tracking for buyers, sellers, and logistics partners.
*   **Integrated Payments:** Supports both traditional bank cards (Paystack) and Sidrachain crypto tokens (SDA/DAN).
*   **Automated Payments:** Features split payments and automatic subaccount creation for vendors.
*   **KYC Verification:** A streamlined, AI-powered verification process for user identity.
*   **Education Hub:** A content portal with articles, videos, and tutorials on agribusiness.
*   **DAN AI Assistant:** An integrated AI assistant for marketplace guidance and market insights.
*   **Admin Panel:** A secure dashboard for team management, dispute resolution, and platform oversight.
## 🛠️ Technology Stack
*   **Frontend:** React, Vite, React Router, Tailwind CSS
*   **UI Components:** shadcn/ui, Lucide React
*   **State Management:** Zustand
*   **Forms:** React Hook Form with Zod for validation
*   **Animations:** Framer Motion
*   **Backend:** Hono on Cloudflare Workers
*   **Storage:** Cloudflare Durable Objects, D1, R2, KV
*   **Runtime:** Bun
## 🚀 Getting Started
Follow these instructions to get a local copy of the project up and running for development and testing purposes.
### Prerequisites
*   [Bun](https://bun.sh/) installed on your machine.
*   A [Cloudflare account](https://dash.cloudflare.com/sign-up).
*   [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/) installed and authenticated.
### Installation
1.  **Clone the repository:**
    ```sh
    git clone <repository-url>
    cd decentralized-agribusiness-network
    ```
2.  **Install dependencies:**
    ```sh
    bun install
    ```
3.  **Local Environment Variables:**
    For local development, Wrangler uses a `.dev.vars` file. Create one in the root directory:
    ```sh
    touch .dev.vars
    ```
    This project does not require any specific environment variables for the basic local development server to run, but you would add secrets like payment gateway keys here for local testing.
## 💻 Development
To start the local development server, which includes both the Vite frontend and the Hono backend worker, run:
```sh
bun run dev
```
This will start the application, typically available at `http://localhost:3000`. The frontend will hot-reload on changes, and the worker will restart automatically.
## ☁️ Deployment
This project is configured for seamless deployment to Cloudflare Pages.
1.  **Build the project:**
    First, build the application for production. This command bundles the frontend and the worker function.
    ```sh
    bun run build
    ```
2.  **Deploy to Cloudflare:**
    Run the deploy command using the Wrangler CLI. This will deploy your application to your Cloudflare account.
    ```sh
    bun run deploy
    ```
    Make sure to configure any required secrets (e.g., `PAYSTACK_SECRET_KEY`) in your Cloudflare Pages project settings under **Settings > Environment variables**.
Alternatively, you can connect your GitHub repository to Cloudflare Pages for automated CI/CD deployments.
### Note on Configuration
This project is pre-configured to deploy correctly on Cloudflare Pages. The necessary build commands and output directories are managed by the platform based on standard Vite project structures and the `wrangler.jsonc` file. You do not need a separate `.page.toml` file in the repository for a successful deployment.
[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/wiredan/digita)