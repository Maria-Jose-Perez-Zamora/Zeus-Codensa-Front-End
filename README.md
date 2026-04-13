
  # Mockup Zeus-Codensa

  This is a code bundle for Mockup Zeus-Codensa. The original project is available at https://www.figma.com/design/wZnY6r0oYU309jDTJmjvGY/Mockup-Zeus-Codensa.

  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.

  ## Deploy (GitHub Pages)

  This repository is configured to deploy automatically to GitHub Pages when you push to `main`.

  1. In GitHub, open `Settings` -> `Pages`.
  2. In `Build and deployment`, select `Source: GitHub Actions`.
  3. Push changes to `main` (or run the workflow manually from `Actions`).
  4. Your app will be published at:

  `https://<github-user>.github.io/<repository-name>/`

  Notes:

  - The workflow uses a base path automatically (`/<repository-name>/`) for Vite.
  - A `404.html` fallback is generated for SPA routing.
  