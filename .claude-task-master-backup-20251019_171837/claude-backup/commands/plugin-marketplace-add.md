# Add Plugin Marketplace

Add a plugin marketplace from a git repository or local path.

Arguments:
- marketplace: The marketplace source (GitHub repo, git URL, or local path)

Instructions:
1. If the marketplace is a GitHub repo (format: owner/repo), clone it to ~/.claude/marketplaces/
2. If it's a git URL, clone it to ~/.claude/marketplaces/
3. If it's a local path, verify .claude-plugin/marketplace.json exists
4. Validate the marketplace.json file using: `claude plugin validate <path>`
5. Add the marketplace to the user's settings
6. Confirm the marketplace was added successfully
