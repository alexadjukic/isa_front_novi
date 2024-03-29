import './App.css';
import ResponsiveAppBar from './components/ResponsiveAppBar/ResponsiveAppBar';
import Home from './pages/Home/Home';
import LogInForm from './pages/LogInForm/LogInForm';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import UserProfile from './pages/UserProfile/UserProfile';
import { User } from './model/user';
import { Dispatch, createContext, useReducer } from 'react';
import { getUser } from './services/authorizationService';
import ScheduledAppointments from './pages/ScheduledAppointments/ScheduledAppointments';
import CompanyList from './components/CompanyList/CompanyList';
import CompanyView from './pages/CompanyView/CompanyView';
import EquipmentForm from './pages/EquipmentForm/EquipmentForm';
import QRCodes from './pages/QRCodes/QRCodes';
import PickUpEquipment from './pages/PickUpEquipment/PickUpEquipment';
import CompanyAdminHomePage from './pages/Home/CompanyAdminHomePage/CompanyAdminHomePage';
import AppointmentForm from './pages/AppointmentForm/AppointmentForm';
import CustomerList from './pages/CustomerList/CustomerList';
import PickupHistory from './pages/PickupHistory/PickupHistory';
import CreateEmergencyAppointment from './pages/CreateEmergencyAppointment/CreateEmergencyAppointment';
import CompanyFullCalendar from './pages/CompanyFullCalendar/CompanyFullCalendar';

type UserContextType = {
    user: User,
    dispatch: Dispatch<{ type: string }>
}

const initialUser: UserContextType = {
    user: getUser(window.localStorage.getItem('jwtToken') ?? ''),
    dispatch: () => null,
};

const reducer = (state: UserContextType, action: { type: string }) => {
    switch (action.type) {
        case 'LogIn':
            return { ...state, user: getUser(window.localStorage.getItem('jwtToken') ?? '') };
        case 'LogOut':
            return { ...state, user: getUser('') };
        default:
            return state;
    }
};

export const UserContext = createContext<UserContextType>(initialUser);

function App() {
    const [user, userDispatch] = useReducer(reducer, initialUser);

    return (
        <>
            <BrowserRouter>
                <UserContext.Provider value={{ ...user, dispatch: userDispatch }}>
                    <ResponsiveAppBar />
                    <Routes>
                        <Route
                            path="/"
                            element={<Home />}
                        />
                        <Route path="/login" element={<LogInForm />} />
                        <Route path="/profile" element={<UserProfile />} />
                        <Route path="/company-list" element={<CompanyList />} />
                        <Route path="/scheduled-appointments" element={<ScheduledAppointments />} />
                        <Route path="/company/:id" element={<CompanyView/>} />
                        <Route path="/edit-equipment/:id" element={<EquipmentForm/>} />
                        <Route path="/qr-codes" element={<QRCodes/>} />
                        <Route path="/pick-up-equipment" element={<PickUpEquipment />} />
                        <Route path="/company-admin-home-page" element={<CompanyAdminHomePage/>} />
                        <Route path="/create-appointment" element={<AppointmentForm/>} />
                        <Route path="/customer-list/:companyId" element={<CustomerList/>} />
                        <Route path="/pickup-history" element={<PickupHistory/>} />
                        <Route path="/company/:companyId/emergencyAppointment" element={<CreateEmergencyAppointment/>} />
                        <Route path="/company-full-calendar" element={<CompanyFullCalendar />} />
                    </Routes>
                </UserContext.Provider>
            </BrowserRouter>
        </>
    );
}

export default App;
