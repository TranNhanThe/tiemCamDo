import { Routes, Route } from 'react-router-dom'
import logo from './logo.svg';
import './App.css';
import EnhancedTodo from './components/EnhancedTodo';
import EnhancedBike from './components/EnhancedBike';
import HomePage from './pages/Home'
import NewsPage from './pages/News'
import ContactPage from './pages/Contact'



function App() {
  return (
    // <div className="App">
    //   <header className="App-header">
    //     <img src={logo} className="App-logo" alt="logo" />
    //     <p>
    //       Edit <code>src/App.js</code> and save to reload.
    //     </p>
    //     <a
    //       className="App-link"
    //       href="https://reactjs.org"
    //       target="_blank"
    //       rel="noopener noreferrer"
    //     >
    //       Learn React
    //     </a>
    //   </header>
    // </div>
    <div className="app">
      <nav>
        <ul>
          <li>
            <a href="/">Home</a>
          </li>
          <li>
            <a href="/news">News</a>
          </li>
          <li>
            <a href="/contact">Contact</a>
          </li>
        </ul>
      </nav>
      {/* <EnhancedTodo/> 3 */}
      {/* <EnhancedBike/> */}
      {/* <PopupForm/> */}

    <Routes>
      <Route path="/" element={<HomePage/>}/>
      <Route path="/news" element={<NewsPage/>}/>   
      <Route path="/contact" element={<ContactPage/>}/>
    </Routes>
      
    </div>
  );
}

export default App;
