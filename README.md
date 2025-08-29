# React + Vite

This project is built using React and Vite, providing a fast and modern development environment. Below is a detailed overview of the project, including the tools and technologies used, as well as some insights into the development process.

## Project Overview

This application is a subscription management system that allows users to manage their subscriptions and monitor their expenses. It includes features such as user management, subscription tracking, and analytics.

## Key Features

- **User Management**: Add, edit, and delete users with admin privileges.
- **Subscription Tracking**: Manage subscriptions, including cost, billing cycle, and renewal dates.
- **Analytics**: View insights such as total users, total subscriptions, and monthly revenue.
- **Responsive Design**: Optimized for both desktop and mobile devices.

## Tools and Technologies Used

### Frontend
- **React**: For building the user interface.
- **Vite**: For fast development and build processes.
- **Tailwind CSS**: For styling and responsive design.
- **Framer Motion**: For animations and transitions.
- **Lucide React**: For icons.
- **Axios**: For API requests.

### Backend
- **FastAPI**: For building the RESTful API.
- **MongoDB**: For database management.
- **Pydantic**: For data validation.
- **Celery**: For background tasks.

### AI Tools Used
- **ChatGPT**: Assisted in generating code snippets, debugging, and providing development insights.
- **DeepSkeek**: Used for analyzing code quality and identifying potential improvements.
- **Claude AI**: Helped in brainstorming features and refining the project scope.
- **Cursor AI**: Assisted in navigating the codebase and understanding complex logic.
- **GitHub Copilot**: Provided real-time code suggestions and auto-completions.

## Development Insights

### Prompts and Logs
Here are some examples of prompts used during development, along with their outcomes:

1. **ChatGPT**:
   - *Prompt*: "How can I implement a modal in React for adding a user?"
     - *Outcome*: Provided a detailed example of using `useState` for modal state management and `Framer Motion` for animations.
   - *Prompt*: "What is the best way to handle API errors in React?"
     - *Outcome*: Suggested using `try-catch` blocks and displaying error messages in the UI.

2. **GitHub Copilot**:
   - *Prompt*: "Create a function to fetch all users and subscriptions."
     - *Outcome*: Generated the `fetchAll` function, which uses `Promise.all` to fetch data concurrently.
   - *Prompt*: "Suggest Tailwind CSS classes for a responsive card layout."
     - *Outcome*: Provided classes like `grid grid-cols-1 md:grid-cols-4 gap-6` for a responsive design.

3. **Claude AI**:
   - *Prompt*: "What are some best practices for managing state in a React application?"
     - *Outcome*: Recommended using `useReducer` for complex state management and `Context API` for global state.
   - *Prompt*: "How can I optimize the performance of a React application?"
     - *Outcome*: Suggested memoizing components with `React.memo` and using `useCallback` for event handlers.

4. **DeepSkeek**:
   - *Prompt*: "Analyze the `fetchAll` function for potential improvements."
     - *Outcome*: Identified redundant error handling and suggested centralizing it in a utility function.
   - *Prompt*: "Review the `handleCreateUser` function for best practices."
     - *Outcome*: Highlighted the need for form validation and provided recommendations for improving user feedback.

5. **Cursor AI**:
   - *Prompt*: "Trace the flow of data from the backend to the `AdminDashboard` component."
     - *Outcome*: Helped identify the API endpoints used and their corresponding frontend functions.
   - *Prompt*: "Locate all instances where the `handleDeleteUser` function is called."
     - *Outcome*: Provided a list of all occurrences, making it easier to debug issues.

## How to Run the Project

1. Clone the repository:
   ```bash
   git clone https://github.com/shaibinkb16/Servsys-backend.git
   ```

2. Navigate to the frontend directory:
   ```bash
   cd Servsys-Frontend
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Navigate to the backend directory:
   ```bash
   cd ../Servsys-backend
   ```

6. Set up the environment variables in a `.env` file.

7. Start the backend server:
   ```bash
   python start.py
   ```

## Future Enhancements

- **AI-Powered Insights**: Integrate AI tools like Groq for generating subscription insights.
- **Notification System**: Add email and browser notifications for subscription renewals.
- **Advanced Analytics**: Provide more detailed analytics and visualizations.
- **Role-Based Access Control**: Implement different user roles with varying levels of access.
- **Mobile App**: Develop a mobile version of the application for on-the-go access.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request with your changes. For major changes, please open an issue first to discuss what you would like to change.

## License

This project is licensed under the MIT License. See the LICENSE file for details.
