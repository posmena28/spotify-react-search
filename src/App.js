import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SearchPage from './pages/SearchPage';
import CallbackPage from "./pages/CallbackPage";
import AlbumPage from './pages/AlbumPage';
import ErrorBoundary from "./components/ErrorBoundary";

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<SearchPage />} />
            <Route path="/callback" element={<CallbackPage />} />
            <Route path="/album/:id" element={<AlbumPage />} />
          </Routes>
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
