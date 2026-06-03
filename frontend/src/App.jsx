import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Layout from "./components/Layout.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import ProjectPage from "./pages/ProjectPage.jsx";
import RunReport from "./pages/RunReport.jsx";
import Settings from "./pages/Settings.jsx";

const App = () => {
  return (
    <BrowserRouter>
      <Toaster position="bottom-right" />
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/project/:id" element={<ProjectPage />} />
          <Route path="/run/:id" element={<RunReport />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
};

export default App;
