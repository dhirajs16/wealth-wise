# WealthWise – Full‑Stack Personal Finance Dashboard

WealthWise is a modern personal finance application designed to help you take control of your money. It features a sleek, responsive dashboard, comprehensive transaction management, budgeting tools, and insightful reports.

## Tech Stack
- **Frontend**: Angular 18, Bootstrap 5, ngx-charts
- **Backend**: ASP.NET Core 8 Web API
- **Database**: SQLite (Entity Framework Core)
- **Auth**: JWT (JSON Web Tokens)

## Features
- **Public Marketing Site**: Home, About, and Contact pages.
- **Secure Authentication**: Login and registration with password strength indicators.
- **Member Dashboard**: High-level overview of net worth, income, and expenses.
- **Transaction Tracking**: Detailed log of all income and expenses with filtering.
- **Budgeting**: Monthly spending limits by category with visual alerts.
- **Financial Goals**: Progress tracking for long-term targets.
- **Interactive Reports**: Pie charts, bar charts, and trend lines for data-driven decisions.
- **CSV Import**: Bulk transaction upload capabilities.

## Setup Instructions

### Backend Setup
1. Navigate to the `backend` folder.
2. Ensure you have the .NET 8 SDK installed.
3. Run `dotnet restore` to install dependencies.
4. Run `dotnet ef database update` to create the database (requires `dotnet-ef` tool).
5. Run `dotnet run` to start the API.
   - The API will be available at `https://localhost:5001`.
   - Swagger documentation is available at `https://localhost:5001/swagger`.

### Frontend Setup
1. Navigate to the `frontend` folder.
2. Run `npm install` to install dependencies.
3. Run `npm start` or `ng serve` to start the development server.
4. Open `http://localhost:4200` in your browser.

## Default Credentials
- **Email**: admin@wealthwise.com
- **Password**: Admin123

## CSV Import Format
The CSV should follow this header structure:
`Date,Amount,Description,CategoryId,AccountId`
Example: `2024-03-20,-45.50,Grocery shopping,1,1`
