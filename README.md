# Device Status Dashboard

A clean, responsive, and real-time web utility that monitors device statuses from an external data source. This project was developed as a technical assessment, focusing on rapid prototyping, AI-collaboration, and modern frontend architecture.

## 🚀 Live Demo

**[https://qutep.github.io/device-status-dashboard/]**

## ✨ Key Features

* **Dynamic Data Fetching**: Consumes device status data from an external Google Sheets/CSV source using `PapaParse`.
* **Real-time Monitoring**: Implements auto-refresh logic to keep the dashboard up-to-date without manual intervention.
* **Interactive Data Table**:
* **Multi-column Sorting**: Click any header to toggle between ascending and descending order.
* **Status Indicators**: Immediate visual feedback with color-coded (Green/Red) status badges.


* **Configurable Source**: Includes a hidden settings panel to update the CSV source URL dynamically without code changes.
* **Clean & Responsive UI**: Built with Tailwind CSS v4, ensuring a mobile-friendly and professional aesthetic.

## 🛠️ Tech Stack

* **Framework**: [React](https://reactjs.org/) (via [Vite](https://vitejs.dev/))
* **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
* **Icons**: [Lucide React](https://lucide.dev/)
* **Data Parsing**: [PapaParse](https://www.papaparse.com/)
* **Deployment**: [GitHub Actions](https://github.com/features/actions)

## 📦 Getting Started

### Prerequisites

* Node.js (v18 or higher recommended)
* npm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/device-status-dashboard.git

```


2. Install dependencies:
```bash
npm install --legacy-peer-deps

```


*Note: `--legacy-peer-deps` is used to resolve versioning between the latest Vite and Tailwind v4 plugins.*
3. Run the development server:
```bash
npm run dev

```



## 🧠 Engineering Decisions

* **Vite 7 + Tailwind v4**: Opted for the latest stable build tools to demonstrate familiarity with the evolving frontend ecosystem.
* **State Management**: Utilized React Hooks (`useState`, `useEffect`) for lightweight and efficient state handling.
* **UX Design**: Implemented "Progressive Disclosure" by tucking the configuration settings inside a modal/dropdown to keep the main dashboard clutter-free.
