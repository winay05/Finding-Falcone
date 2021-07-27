import { Route, Switch } from "react-router-dom";
import "./App.css";
import Footer from "./components/common/Footer";
import Navigation from "./components/common/Header";
import Home from "./components/Home/Home";
import Success from "./components/Success";

function App() {
  return (
    <div className="App">
      <Navigation />
      <Switch>
        <Route path="/success/:location">
          <Success />
        </Route>
        <Route path="/">
          <Home />
        </Route>
      </Switch>
      <Footer />
    </div>
  );
}

export default App;
