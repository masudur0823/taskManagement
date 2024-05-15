import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Home from "./pages/Home";
function App() {
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={300}
        // hideProgressBar={false}
        // newestOnTop={false}
        // closeOnClick
        // rtl={false}
        // pauseOnFocusLoss
        // draggable
        // pauseOnHover
        // theme="light"
      />
      {/* Same as */}
      <ToastContainer />
      <Home />
    </>
  );
}

export default App;
