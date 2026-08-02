import dotenv from "dotenv";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { registerTools } from "./tools";

dotenv.config({ path: "dev.env" });
dotenv.config({ quiet: true });

async function main(): Promise<void> {
    const server = new McpServer({ name: "appointment-scheduler-api", version: "1.0.0" });
    registerTools(server);

    const transport = new StdioServerTransport();
    await server.connect(transport);
}

main().catch((error) => {
    console.error("MCP server failed to start:", error);
    process.exit(1);
});
