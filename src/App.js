import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SearchPage from './pages/SearchPage';
import CallbackPage from "./pages/CallbackPage";
import AlbumPage from './pages/AlbumPage';
import ErrorBoundary from "./components/ErrorBoundary";
import Layout from "./components/Layout";

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/callback" element={<CallbackPage />} />
            
            <Route path="/" element={
              <Layout><SearchPage /></Layout>
            } />
            <Route path="/album/:id" element={
              <Layout><AlbumPage /></Layout>
            } />
          </Routes>
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
