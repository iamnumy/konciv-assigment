# **Konciv Assignment - Data Visualization Dashboard** 📊  

[![Live Demo](https://img.shields.io/badge/Live%20Demo-%F0%9F%9A%80-blue)](https://konciv-case.web.app/)  
[![Repo](https://img.shields.io/badge/GitHub-Repository-black?logo=github)](https://github.com/iamnumy/konciv-assigment)  

A **React-based data visualization dashboard** built with **Vite, Material-UI, and Chart.js**. This project provides interactive data insights, AI-powered chat support, and exportable reports.

---

## **🚀 Features**
✅ **Fast & Modern Development**: Built with **React 19 + Vite** for **blazing-fast performance** ⚡  
✅ **Beautiful, Responsive UI**: Powered by **Material-UI & Emotion** 🎨  
✅ **Data Visualization**: Uses **Chart.js + React-ChartJS-2** for **interactive charts** 📊  
✅ **API Integration**: Fetches real-time data using **Axios** 🌍  
✅ **AI Chatbot**: Integrated **OpenAI API** for smart assistant features 🤖  
✅ **PDF & Image Export**: Export dashboards using **html2canvas + jsPDF** 📄  
✅ **Client-side Routing**: Implemented with **React Router DOM** 🔀  
✅ **Code Quality & Linting**: ESLint ensures **best coding practices** 🧹  

---

## **🔧 Tech Stack**
| **Category**       | **Technology** |
|--------------------|---------------|
| Frontend Framework | [React 19](https://react.dev/) |
| Build Tool        | [Vite](https://vitejs.dev/) |
| UI Components     | [Material-UI](https://mui.com/) |
| Styling           | [Emotion](https://emotion.sh/docs/introduction) |
| Charts & Graphs   | [Chart.js](https://www.chartjs.org/) + [React-ChartJS-2](https://react-chartjs-2.js.org/) |
| AI Chatbot        | [OpenAI API](https://platform.openai.com/) |
| API Requests      | [Axios](https://axios-http.com/) |
| PDF Exporting     | [html2canvas](https://html2canvas.hertzen.com/) + [jsPDF](https://parall.ax/products/jspdf) |
| Linting           | [ESLint](https://eslint.org/) |


## 📊 Features in Detail

### 1️⃣ Interactive Data Visualization
- Displays **real-time employment & population trends**.
- Supports multiple chart types:
  - 📈 **Line Charts** – Track trends over time.
  - 📊 **Bar Charts** – Compare data effectively.
  - 🥧 **Pie Charts** – Show proportions visually.
- Built using **Chart.js** for smooth animations and interactions.

### 2️⃣ AI-Powered Chatbot 🤖
- Uses **Hugging Face API** to assist users with **data-driven insights**.
- Provides **context-aware** answers to user queries.
- Helps in analyzing employment and population trends.

### 3️⃣ Export Dashboard as PDF 📄
- Users can download reports that include:
  - **Visualized Charts**
  - **Summarized Data Insights**
- Utilizes **html2canvas + jsPDF** to generate **high-quality PDFs**.
- Supports **customized exports** (select specific charts, add notes).

### 4️⃣ Advanced Filtering System 🎯
- Users can **filter data dynamically** by:
  - **Age Groups** (18-25, 26-40, 41-60, etc.)
  - **Regions** (muncipality)
  - **Gender**
- Uses **React Context API** for efficient state management.
- Ensures a **seamless user experience** with instant updates.

---


## **Installation & Setup**
### 1. Clone the repository  
```bash
git clone https://github.com/iamnumy/konciv-assigment.git
cd konciv-assigment
npm install
npm run dev
npm run build


## 📌 Environment Variables

To run the project, create a `.env` file in the root directory and add:

```env
REACT_APP_HUGGINGFACE_API_KEY=your-api-key