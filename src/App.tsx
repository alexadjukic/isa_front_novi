import './App.css';
import ResponsiveAppBar from './components/ResponsiveAppBar/ResponsiveAppBar';
import CompanyListFilter from './pages/CompanyListFilter/CompanyListFilter';
import LogInForm from './pages/LogInForm/LogInForm';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import UserProfile from './pages/UserProfile/UserProfile';
import { User, UserRole } from './model/user';
import { Dispatch, createContext, useReducer } from 'react';
import { getUser } from './services/authorizationService';

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
                            element={<CompanyListFilter />}
                        />
                        <Route path="/login" element={<LogInForm />} />
                        <Route path="/profile" element={<UserProfile />} />
                    </Routes>
                </UserContext.Provider>
            </BrowserRouter>
        </>
    );
}

export default App;
