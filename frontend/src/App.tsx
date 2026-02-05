import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout';
import { HomePage, AddRiskPage } from './pages';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/add-risk" element={<AddRiskPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
