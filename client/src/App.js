import './App.css';

import ChatRoom from './pages/ChatRoom'
import ClearChat from './pages/ClearChat'

import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";


function App() {
  return (
    <Router>
      <div className="App" style={{justifyContent:'center', display: 'flex'}}>

        <Routes>

          <Route exact path="/" component={ChatRoom} />
          <Route exact path="/clearChat" component={ClearChat} />


        </Routes>
        
      </div>
    </Router>
  );
}

export default App;