# Massive

## Project Description

**Massive** is a web application developed using the Next.js framework and TypeScript. The application uses the [Lucia Auth](https://github.com/pilcrowOnPaper/lucia-auth) library to manage user authentication, providing a simple and flexible way to handle users and sessions. The project also includes an Admin Panel.

## Technologies and Libraries Used

- **Next.js** — A React framework that supports server-side rendering and static site generation.
- **TypeScript** — A programming language that adds static typing to JavaScript.
- **Lucia Auth** — An authentication library that abstracts user and session management from the application and database.
- **Tailwind CSS** — A utility-first CSS framework for rapid UI styling.
- **ESLint** — A code analysis tool that helps maintain code quality and consistency.
- **PostCSS** — A tool for transforming CSS using plugins.
- **Motion (Framer Motion)** — A library for creating animations in React.
- **MUI (Material-UI)** — A UI component library for fast interface development.
- **Markdown** — Used for text formatting, including documentation and dynamically generated content.

## Main Features

- **User Registration** — Allows users to create an account using email and password.
- **User Login** — Enables authentication of existing users with credential validation.
- **Session Management** — Handles user sessions to maintain authentication state.
- **Admin Panel** — Accessible to administrators for application management, user control, and settings adjustments.

## Project Structure

- **/public** — Contains public assets such as images and other static files.
- **/src** — The main source code of the application, including components, pages, and utilities.
- **.gitignore** — Specifies files and directories to be ignored by Git.
- **package.json** — Contains project information and dependencies.
- **tsconfig.json** — Configuration file for TypeScript.
- **tailwind.config.ts** — Configuration file for Tailwind CSS.
- **postcss.config.mjs** — Configuration file for PostCSS.
- **eslint.config.mjs** — Configuration file for ESLint.

## Setup and Running the Project

1. **Install dependencies**
   ```sh
   pnpm install
   ```
2. **Run in development mode**
   ```sh
   pnpm dev
   ```
3. **Build for production**
   ```sh
   pnpm build
   ```
4. **Run the production build**
   ```sh
   pnpm start
   ```

## Notes

- Ensure that Node.js and pnpm are installed on your system.
- Configure necessary environment variables according to project requirements.

This project showcases the integration of Lucia Auth with Next.js for user authentication, the use of modern UI libraries (MUI, Tailwind CSS), and the implementation of smooth animations (Framer Motion).
