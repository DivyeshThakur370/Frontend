import "./App.css";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Allroutes from "./routes/Allroutes";

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Allroutes />
      </main>
      <Footer />
    </div>
  );
}

export default App;
