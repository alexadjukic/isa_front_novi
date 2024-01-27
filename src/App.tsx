import './App.css';
import ResponsiveAppBar from './components/ResponsiveAppBar/ResponsiveAppBar';
import LogInForm from './pages/LogInForm/LogInForm';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';

function App() {
    return (
        <>
            <BrowserRouter>
                <ResponsiveAppBar />
                <Routes>
                    <Route
                        path="/"
                        element={<Link to="/login">Home page</Link>}
                    />
                    <Route path="/login" element={<LogInForm />} />
                </Routes>
            </BrowserRouter>
        </>
    );
}

export default App;
