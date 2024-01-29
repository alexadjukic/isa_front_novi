import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../../App';
import { UserRole } from '../../model/user';
import CompanyList from '../../components/CompanyList/CompanyList';
import CompanyAdminHomePage from '../CompanyAdminHomePage/CompanyAdminHomePage';

export default function Home() {
    const userContext = useContext(UserContext);

    if (userContext.user.role == UserRole.USER)
        return (
            <>
                <div>
                    <Link to={`/company-list`}>Company list</Link>
                    <br></br>
                    <Link to={`/scheduled-appointments`}>
                        Scheduled appointments
                    </Link>
                    <br></br>
                    <Link to={`/qr-codes`}>QR code confirmations</Link>
                    <br></br>
                    <Link to={`/profile`}>My profile</Link>
                </div>
            </>
        );
    else if(userContext.user.role == UserRole.COMPANY_ADMIN){
        return <CompanyAdminHomePage />;
    }
    else return <CompanyList />;
}
