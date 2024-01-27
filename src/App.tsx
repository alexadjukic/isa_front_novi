import './App.css';
import ResponsiveAppBar from './components/ResponsiveAppBar/ResponsiveAppBar';
import CompanyListFilter from './pages/CompanyListFilter/CompanyListFilter';
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
                        element={<CompanyListFilter />}
                    />
                    <Route path="/login" element={<LogInForm />} />
                </Routes>
            </BrowserRouter>
        </>
    );
}

export default App;
