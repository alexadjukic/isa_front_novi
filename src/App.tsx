import './App.css';
import ResponsiveAppBar from './components/ResponsiveAppBar/ResponsiveAppBar';
import CompanyListFilter from './pages/CompanyListFilter/CompanyListFilter';
import CompanyView from './pages/CompanyView/CompanyView';
import LogInForm from './pages/LogInForm/LogInForm';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

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
                    <Route path="/company/:id" element={<CompanyView/>} />
                </Routes>
            </BrowserRouter>
        </>
    );
}

export default App;
