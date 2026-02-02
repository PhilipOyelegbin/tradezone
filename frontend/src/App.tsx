import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main className="min-h-[calc(100vh-8rem)]">
        <AppRoutes />
      </main>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
