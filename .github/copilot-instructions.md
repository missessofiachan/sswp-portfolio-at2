create eslint config file and add rules for react and typescript
# This file is used to configure GitHub Copilot's behavior in your repository.
# You can customize the instructions to guide Copilot's suggestions and completions.
# For more information, visit: https://docs.github.com/en/copilot/getting-started-with-github-copilot/customizing-copilot-in-your-repository
# Example configuration:
# {
#   "suggestionMode": "aggressive", // Options: "aggressive", "
#   "languagePreferences": ["javascript", "typescript", "python"], // Preferred programming languages
#   "excludePaths": ["node_modules/", "dist/"], // Paths to exclude from suggestions
#   "customInstructions": "Focus on writing clean, efficient, and well-documented code." // Custom instructions for Copilot
# } collaboration.      
# Use feature branches for new features and bug fixes.
# Merge main into feature branches regularly to stay up-to-date.
# Use Git commit messages that are clear and descriptive.
# Follow semantic versioning for releases.
# Use Git tags for marking release points.
# Keep the main branch stable and deployable at all times.
# Use pull request templates for consistent PR descriptions.
# Use issue templates for consistent issue reporting.
# Use GitHub Projects or Issues to track tasks and bugs.
# Conduct code reviews to ensure quality and consistency.
# Use continuous integration (CI) to automate testing and deployment.
# Use GitHub Actions for automating workflows.
# Document code changes in the changelog.
# Use GitHub Wiki for project documentation.
# Keep dependencies up-to-date and secure.
# Use Dependabot to automate dependency updates.
# Regularly audit and remove unused dependencies.
# Use environment variables for configuration.
# Avoid committing sensitive information to the repository.
# Use .env files for local development configuration.
# Add .env files to .gitignore to prevent them from being committed.
# Use Docker for consistent development and production environments.
# Write clear and concise README files for projects.
# Include setup instructions, usage examples, and contribution guidelines in the README.
# Use badges in the README to indicate build status, coverage, and dependencies.
# Use GitHub Discussions for community engagement and support.
# Encourage contributions by providing clear contribution guidelines.
# Acknowledge and credit contributors.
# Use GitHub Sponsors to support open source contributors.
# Use GitHub Codespaces for cloud-based development environments.
# Use GitHub CLI for managing repositories and workflows from the command line.
# Use GitHub API for automating tasks and integrating with other services.
# Use GitHub Marketplace for finding and integrating third-party tools.
# Use GitHub Security features to protect your code and data.
# Regularly back up your repository and important data.
# Use GitHub Insights to analyze repository activity and contributions.
# Use GitHub Actions for automating workflows and CI/CD.
# Use GitHub Codespaces for cloud-based development environments.
# Use GitHub CLI for managing repositories and workflows from the command line.
# Use GitHub API for automating tasks and integrating with other services.
# Use GitHub Marketplace for finding and integrating third-party tools.
# Use GitHub Security features to protect your code and data.
# Regularly back up your repository and important data.
# Use GitHub Insights to analyze repository activity and contributions.
# setup commands
- install deps: `pnpm install`
- start dev server: `pnpm dev`
- start client: `pnpm start`
- build for production: `pnpm build`
- run tests: `pnpm test`
- format code: `pnpm format`
- lint code: `pnpm lint`
## code style
- Use TypeScript strict mode for type safety.
- Prefer `const` and `let` over `var`.
- Use explicit types for function parameters and return values.
- Avoid using `any`; prefer specific types or generics.
- Keep functions small and focused on a single task.
- Use descriptive variable and function names.
- Organize code into modules and folders by feature.
- Avoid magic numbers and strings; use constants or enums.
- Write comments for complex logic, but keep code self-explanatory.
- Use Prettier and ESLint to enforce consistent formatting and linting.
- Write unit tests for critical logic and components.
- Use async/await for asynchronous code; handle errors gracefully.
- Prefer immutable data patterns; avoid direct mutation.
- Document public APIs and components.
- Review code before merging; use pull requests for collaboration.
- Use feature branches for new features and bug fixes.
- Merge main into feature branches regularly to stay up-to-date.
- Use Git commit messages that are clear and descriptive.
- Follow semantic versioning for releases.
- Use Git tags for marking release points.
- Keep the main branch stable and deployable at all times.
- Use pull request templates for consistent PR descriptions.
- Use issue templates for consistent issue reporting.
- Use GitHub Projects or Issues to track tasks and bugs.
- Conduct code reviews to ensure quality and consistency.
- Use continuous integration (CI) to automate testing and deployment.
- Use GitHub Actions for automating workflows.
- Document code changes in the changelog.
- Use GitHub Wiki for project documentation.
- Keep dependencies up-to-date and secure.
- Use Dependabot to automate dependency updates.
- Regularly audit and remove unused dependencies.
- Use environment variables for configuration.
- Avoid committing sensitive information to the repository.
- Use .env files for local development configuration.
- Add .env files to .gitignore to prevent them from being committed.
- Use Docker for consistent development and production environments.
- Write clear and concise README files for projects.
- Include setup instructions, usage examples, and contribution guidelines in the README.
- Use badges in the README to indicate build status, coverage, and dependencies.
- Use GitHub Discussions for community engagement and support.
- Encourage contributions by providing clear contribution guidelines.
- Acknowledge and credit contributors.
