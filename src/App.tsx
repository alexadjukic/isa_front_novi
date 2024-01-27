import './App.css';
import ResponsiveAppBar from './components/ResponsiveAppBar/ResponsiveAppBar';
import CompanyListFilter from './pages/CompanyListFilter/CompanyListFilter';
import Home from './pages/Home/Home';
import LogInForm from './pages/LogInForm/LogInForm';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ScheduledAppointments from './pages/ScheduledAppointments/ScheduledAppointments';

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
                    <Route path="/home" element={<Home />} />
                    <Route path="/scheduled-appointments" element={<ScheduledAppointments />} />
                </Routes>
            </BrowserRouter>
        </>
    );
}

export default App;
