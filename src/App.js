import { BrowserRouter, Route, Routes } from "react-router-dom";
import HOC from "./HOC/HOC";
import NSHomePage from "./Pages/NSHomePage";

function App() {
  return (
    <div className="App">
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<HOC Component={NSHomePage}></HOC>}></Route>
      </Routes>
    </BrowserRouter>
    </div>
  );
}

export default App;
