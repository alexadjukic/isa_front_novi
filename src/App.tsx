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
                    </Routes>
                </UserContext.Provider>
            </BrowserRouter>
        </>
    );
}

export default App;
