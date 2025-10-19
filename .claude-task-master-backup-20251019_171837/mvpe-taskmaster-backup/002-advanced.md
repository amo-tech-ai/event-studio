Advanced Configuration
Taskmaster uses two primary methods for configuration:
.taskmaster/config.json File (Recommended - New Structure)
This JSON file stores most configuration settings, including AI model selections, parameters, logging levels, and project defaults.
Location: This file is created in the .taskmaster/ directory when you run the task-master models --setup interactive setup or initialize a new project with task-master init.
Migration: Existing projects with .taskmasterconfig in the root will continue to work, but should be migrated to the new structure using task-master migrate.
Management: Use the task-master models --setup command (or models MCP tool) to interactively create and manage this file. You can also set specific models directly using task-master models --set-<role>=<model_id>, adding --ollama or --openrouter flags for custom models. Manual editing is possible but not recommended unless you understand the structure.
Example Structure:

Copy

Ask AI
{
  "models": {
    "main": {
      "provider": "anthropic",
      "modelId": "claude-3-7-sonnet-20250219",
      "maxTokens": 64000,
      "temperature": 0.2,
      "baseURL": "https://api.anthropic.com/v1"
    },
    "research": {
      "provider": "perplexity",
      "modelId": "sonar-pro",
      "maxTokens": 8700,
      "temperature": 0.1,
      "baseURL": "https://api.perplexity.ai/v1"
    },
    "fallback": {
      "provider": "anthropic",
      "modelId": "claude-3-5-sonnet",
      "maxTokens": 64000,
      "temperature": 0.2
    }
  },
  "global": {
    "logLevel": "info",
    "debug": false,
    "defaultSubtasks": 5,
    "defaultPriority": "medium",
    "defaultTag": "master",
    "projectName": "Your Project Name",
    "ollamaBaseURL": "http://localhost:11434/api",
    "azureBaseURL": "https://your-endpoint.azure.com/openai/deployments",
    "vertexProjectId": "your-gcp-project-id",
    "vertexLocation": "us-central1"
  }
}
Legacy .taskmasterconfig File (Backward Compatibility)
For projects that haven’t migrated to the new structure yet.
Location: Project root directory.
Migration: Use task-master migrate to move this to .taskmaster/config.json.
Deprecation: While still supported, you’ll see warnings encouraging migration to the new structure.
​
Environment Variables (.env file or MCP env block - For API Keys Only)
Used exclusively for sensitive API keys and specific endpoint URLs.
Location:
For CLI usage: Create a .env file in your project root.
For MCP/Cursor usage: Configure keys in the env section of your .cursor/mcp.json file.
Required API Keys (Depending on configured providers):
ANTHROPIC_API_KEY: Your Anthropic API key.
PERPLEXITY_API_KEY: Your Perplexity API key.
OPENAI_API_KEY: Your OpenAI API key.
GOOGLE_API_KEY: Your Google API key (also used for Vertex AI provider).
MISTRAL_API_KEY: Your Mistral API key.
AZURE_OPENAI_API_KEY: Your Azure OpenAI API key (also requires AZURE_OPENAI_ENDPOINT).
OPENROUTER_API_KEY: Your OpenRouter API key.
XAI_API_KEY: Your X-AI API key.
Optional Endpoint Overrides:
Per-role baseURL in .taskmasterconfig: You can add a baseURL property to any model role (main, research, fallback) to override the default API endpoint for that provider. If omitted, the provider’s standard endpoint is used.
Environment Variable Overrides (<PROVIDER>_BASE_URL): For greater flexibility, especially with third-party services, you can set an environment variable like OPENAI_BASE_URL or MISTRAL_BASE_URL. This will override any baseURL set in the configuration file for that provider. This is the recommended way to connect to OpenAI-compatible APIs.
AZURE_OPENAI_ENDPOINT: Required if using Azure OpenAI key (can also be set as baseURL for the Azure model role).
OLLAMA_BASE_URL: Override the default Ollama API URL (Default: http://localhost:11434/api).
VERTEX_PROJECT_ID: Your Google Cloud project ID for Vertex AI. Required when using the ‘vertex’ provider.
VERTEX_LOCATION: Google Cloud region for Vertex AI (e.g., ‘us-central1’). Default is ‘us-central1’.
GOOGLE_APPLICATION_CREDENTIALS: Path to service account credentials JSON file for Google Cloud auth (alternative to API key for Vertex AI).
Optional Auto-Update Control:
TASKMASTER_SKIP_AUTO_UPDATE: Set to ‘1’ to disable automatic updates. Also automatically disabled in CI environments (when CI environment variable is set).
Important: Settings like model ID selections (main, research, fallback), maxTokens, temperature, logLevel, defaultSubtasks, defaultPriority, and projectName are managed in .taskmaster/config.json (or .taskmasterconfig for unmigrated projects), not environment variables.
​
Tagged Task Lists Configuration (v0.17+)
Taskmaster includes a tagged task lists system for multi-context task management.
​
Global Tag Settings

Copy

Ask AI
"global": {
  "defaultTag": "master"
}
defaultTag (string): Default tag context for new operations (default: “master”)
​
Git Integration
Task Master provides manual git integration through the --from-branch option:
Manual Tag Creation: Use task-master add-tag --from-branch to create a tag based on your current git branch name
User Control: No automatic tag switching - you control when and how tags are created
Flexible Workflow: Supports any git workflow without imposing rigid branch-tag mappings
​
State Management File
Taskmaster uses .taskmaster/state.json to track tagged system runtime information:

Copy

Ask AI
{
  "currentTag": "master",
  "lastSwitched": "2025-06-11T20:26:12.598Z",
  "migrationNoticeShown": true
}
currentTag: Currently active tag context
lastSwitched: Timestamp of last tag switch
migrationNoticeShown: Whether migration notice has been displayed
This file is automatically created during tagged system migration and should not be manually edited.
​
Example .env File (for API Keys)

Copy

Ask AI
# Required API keys for providers configured in .taskmaster/config.json
ANTHROPIC_API_KEY=sk-ant-api03-your-key-here
PERPLEXITY_API_KEY=pplx-your-key-here
# OPENAI_API_KEY=sk-your-key-here
# GOOGLE_API_KEY=AIzaSy...
# AZURE_OPENAI_API_KEY=your-azure-openai-api-key-here
# etc.

# Optional Endpoint Overrides
# Use a specific provider's base URL, e.g., for an OpenAI-compatible API
# OPENAI_BASE_URL=https://api.third-party.com/v1
#
# Azure OpenAI Configuration
# AZURE_OPENAI_ENDPOINT=https://your-resource-name.openai.azure.com/ or https://your-endpoint-name.cognitiveservices.azure.com/openai/deployments
# OLLAMA_BASE_URL=http://custom-ollama-host:11434/api

# Google Vertex AI Configuration (Required if using 'vertex' provider)
# VERTEX_PROJECT_ID=your-gcp-project-id
​
Troubleshooting
​
Configuration Errors
If Task Master reports errors about missing configuration or cannot find the config file, run task-master models --setup in your project root to create or repair the file.
For new projects, config will be created at .taskmaster/config.json. For legacy projects, you may want to use task-master migrate to move to the new structure.
Ensure API keys are correctly placed in your .env file (for CLI) or .cursor/mcp.json (for MCP) and are valid for the providers selected in your config file.
​
If task-master init doesn’t respond:
Try running it with Node directly:

Copy

Ask AI
node node_modules/claude-task-master/scripts/init.js
Or clone the repository and run:

Copy

Ask AI
git clone https://github.com/eyaltoledano/claude-task-master.git
cd claude-task-master
node scripts/init.js
​
Provider-Specific Configuration
​
Google Vertex AI Configuration
Google Vertex AI is Google Cloud’s enterprise AI platform and requires specific configuration:
Prerequisites:
A Google Cloud account with Vertex AI API enabled
Either a Google API key with Vertex AI permissions OR a service account with appropriate roles
A Google Cloud project ID
Authentication Options:
API Key: Set the GOOGLE_API_KEY environment variable
Service Account: Set GOOGLE_APPLICATION_CREDENTIALS to point to your service account JSON file
Required Configuration:
Set VERTEX_PROJECT_ID to your Google Cloud project ID
Set VERTEX_LOCATION to your preferred Google Cloud region (default: us-central1)
Example Setup:

Copy

Ask AI
# In .env file
GOOGLE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXX
VERTEX_PROJECT_ID=my-gcp-project-123
VERTEX_LOCATION=us-central1
Or using service account:

Copy

Ask AI
# In .env file
GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account.json
VERTEX_PROJECT_ID=my-gcp-project-123
VERTEX_LOCATION=us-central1
In .taskmaster/config.json:

Copy

Ask AI
"global": {
  "vertexProjectId": "my-gcp-project-123",
  "vertexLocation": "us-central1"
}
​
Azure OpenAI Configuration
Azure OpenAI provides enterprise-grade OpenAI models through Microsoft’s Azure cloud platform and requires specific configuration:
Prerequisites:
An Azure account with an active subscription
Azure OpenAI service resource created in the Azure portal
Azure OpenAI API key and endpoint URL
Deployed models (e.g., gpt-4o, gpt-4o-mini, gpt-4.1, etc) in your Azure OpenAI resource
Authentication:
Set the AZURE_OPENAI_API_KEY environment variable with your Azure OpenAI API key
Configure the endpoint URL using one of the methods below
Configuration Options: Option 1: Using Global Azure Base URL (affects all Azure models)

Copy

Ask AI
// In .taskmaster/config.json
{
  "models": {
    "main": {
      "provider": "azure",
      "modelId": "gpt-4o",
      "maxTokens": 16000,
      "temperature": 0.7
    },
    "fallback": {
      "provider": "azure", 
      "modelId": "gpt-4o-mini",
      "maxTokens": 10000,
      "temperature": 0.7
    }
  },
  "global": {
    "azureBaseURL": "https://your-resource-name.azure.com/openai/deployments"
  }
}
Option 2: Using Per-Model Base URLs (recommended for flexibility)

Copy

Ask AI
// In .taskmaster/config.json
{
  "models": {
    "main": {
      "provider": "azure",
      "modelId": "gpt-4o", 
      "maxTokens": 16000,
      "temperature": 0.7,
      "baseURL": "https://your-resource-name.azure.com/openai/deployments"
    },
    "research": {
      "provider": "perplexity",
      "modelId": "sonar-pro",
      "maxTokens": 8700,
      "temperature": 0.1
    },
    "fallback": {
      "provider": "azure",
      "modelId": "gpt-4o-mini",
      "maxTokens": 10000, 
      "temperature": 0.7,
      "baseURL": "https://your-resource-name.azure.com/openai/deployments"
    }
  }
}
Environment Variables:

Copy

Ask AI
# In .env file
AZURE_OPENAI_API_KEY=your-azure-openai-api-key-here

# Optional: Override endpoint for all Azure models
AZURE_OPENAI_ENDPOINT=https://your-resource-name.azure.com/openai/deployments
Important Notes:
Model Deployment Names: The modelId in your configuration should match the deployment name you created in Azure OpenAI Studio, not the underlying model name
Base URL Priority: Per-model baseURL settings override the global azureBaseURL setting
Endpoint Format: When using per-model baseURL, use the full path including /openai/deployments
Troubleshooting: “Resource not found” errors:
Ensure your baseURL includes the full path: https://your-resource-name.openai.azure.com/openai/deployments
Verify that your deployment name in modelId exactly matches what’s configured in Azure OpenAI Studio
Check that your Azure OpenAI resource is in the correct region and properly deployed
Authentication errors:
Verify your AZURE_OPENAI_API_KEY is correct and has not expired
Ensure your Azure OpenAI resource has the necessary permissions
Check that your subscription has not been suspended or reached quota limits
Model availability errors:
Confirm the model is deployed in your Azure OpenAI resource
Verify the deployment name matches your configuration exactly (case-sensitive)
Ensure the model deployment is in a “Succeeded” state in Azure OpenAI Studio
Ensure youre not getting rate limited by maxTokens maintain appropriate Tokens per Minute Rate Limit (TPM) in your deployment.
Was this page helpful?


Yes

Advanced Tasks
​
AI-Driven Development Workflow
The Cursor agent is pre-configured (via the rules file) to follow this workflow:
​
1. Task Discovery and Selection
Ask the agent to list available tasks:

Copy

Ask AI
What tasks are available to work on next?

Copy

Ask AI
Can you show me tasks 1, 3, and 5 to understand their current status?
The agent will:
Run task-master list to see all tasks
Run task-master next to determine the next task to work on
Run task-master show 1,3,5 to display multiple tasks with interactive options
Analyze dependencies to determine which tasks are ready to be worked on
Prioritize tasks based on priority level and ID order
Suggest the next task(s) to implement
​
2. Task Implementation
When implementing a task, the agent will:
Reference the task’s details section for implementation specifics
Consider dependencies on previous tasks
Follow the project’s coding standards
Create appropriate tests based on the task’s testStrategy
You can ask:

Copy

Ask AI
Let's implement task 3. What does it involve?
​
2.1. Viewing Multiple Tasks
For efficient context gathering and batch operations:

Copy

Ask AI
Show me tasks 5, 7, and 9 so I can plan my implementation approach.
The agent will:
Run task-master show 5,7,9 to display a compact summary table
Show task status, priority, and progress indicators
Provide an interactive action menu with batch operations
Allow you to perform group actions like marking multiple tasks as in-progress
​
3. Task Verification
Before marking a task as complete, verify it according to:
The task’s specified testStrategy
Any automated tests in the codebase
Manual verification if required
​
4. Task Completion
When a task is completed, tell the agent:

Copy

Ask AI
Task 3 is now complete. Please update its status.
The agent will execute:

Copy

Ask AI
task-master set-status --id=3 --status=done
​
5. Handling Implementation Drift
If during implementation, you discover that:
The current approach differs significantly from what was planned
Future tasks need to be modified due to current implementation choices
New dependencies or requirements have emerged
Tell the agent:

Copy

Ask AI
We've decided to use MongoDB instead of PostgreSQL. Can you update all future tasks (from ID 4) to reflect this change?
The agent will execute:

Copy

Ask AI
task-master update --from=4 --prompt="Now we are using MongoDB instead of PostgreSQL."

# OR, if research is needed to find best practices for MongoDB:
task-master update --from=4 --prompt="Update to use MongoDB, researching best practices" --research
This will rewrite or re-scope subsequent tasks in tasks.json while preserving completed work.
​
6. Reorganizing Tasks
If you need to reorganize your task structure:

Copy

Ask AI
I think subtask 5.2 would fit better as part of task 7 instead. Can you move it there?
The agent will execute:

Copy

Ask AI
task-master move --from=5.2 --to=7.3
You can reorganize tasks in various ways:
Moving a standalone task to become a subtask: --from=5 --to=7
Moving a subtask to become a standalone task: --from=5.2 --to=7
Moving a subtask to a different parent: --from=5.2 --to=7.3
Reordering subtasks within the same parent: --from=5.2 --to=5.4
Moving a task to a new ID position: --from=5 --to=25 (even if task 25 doesn’t exist yet)
Moving multiple tasks at once: --from=10,11,12 --to=16,17,18 (must have same number of IDs, Taskmaster will look through each position)
When moving tasks to new IDs:
The system automatically creates placeholder tasks for non-existent destination IDs
This prevents accidental data loss during reorganization
Any tasks that depend on moved tasks will have their dependencies updated
When moving a parent task, all its subtasks are automatically moved with it and renumbered
This is particularly useful as your project understanding evolves and you need to refine your task structure.
​
7. Resolving Merge Conflicts with Tasks
When working with a team, you might encounter merge conflicts in your tasks.json file if multiple team members create tasks on different branches. The move command makes resolving these conflicts straightforward:

Copy

Ask AI
I just merged the main branch and there's a conflict with tasks.json. My teammates created tasks 10-15 while I created tasks 10-12 on my branch. Can you help me resolve this?
The agent will help you:
Keep your teammates’ tasks (10-15)
Move your tasks to new positions to avoid conflicts:

Copy

Ask AI
# Move your tasks to new positions (e.g., 16-18)
task-master move --from=10 --to=16
task-master move --from=11 --to=17
task-master move --from=12 --to=18
This approach preserves everyone’s work while maintaining a clean task structure, making it much easier to handle task conflicts than trying to manually merge JSON files.
​
8. Breaking Down Complex Tasks
For complex tasks that need more granularity:

Copy

Ask AI
Task 5 seems complex. Can you break it down into subtasks?
The agent will execute:

Copy

Ask AI
task-master expand --id=5 --num=3
You can provide additional context:

Copy

Ask AI
Please break down task 5 with a focus on security considerations.
The agent will execute:

Copy

Ask AI
task-master expand --id=5 --prompt="Focus on security aspects"
You can also expand all pending tasks:

Copy

Ask AI
Please break down all pending tasks into subtasks.
The agent will execute:

Copy

Ask AI
task-master expand --all
For research-backed subtask generation using the configured research model:

Copy

Ask AI
Please break down task 5 using research-backed generation.
The agent will execute:

Copy

Ask AI
task-master expand --id=5 --research