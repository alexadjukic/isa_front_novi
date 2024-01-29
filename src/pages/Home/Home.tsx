import { useContext } from 'react';
import { UserContext } from '../../App';
import { UserRole } from '../../model/user';
import CompanyList from '../../components/CompanyList/CompanyList';
import CompanyAdminHomePage from './CompanyAdminHomePage/CompanyAdminHomePage';
import classes from './Home.module.css';
import { Link } from 'react-router-dom';

export default function Home() {
    const userContext = useContext(UserContext);

    if (userContext.user.role == UserRole.USER)
        return (
            <>
                <div>
                    <div className={`${classes.card}`}>
                        <Link to="/company-list" className={`${classes.link}`}>
                            Company list
                        </Link>
                    </div>
                    <div className={`${classes.card}`}>
                        <Link to="/pickup-history" className={`${classes.link}`}>
                            Pickup history
                        </Link>
                    </div>
                    <div className={`${classes.card}`}>
                        <Link to="/scheduled-appointments" className={`${classes.link}`}>
                            Scheduled appointments
                        </Link>
                    </div>
                    <div className={`${classes.card}`}>
                        <Link to="/qr-codes" className={`${classes.link}`}>
                            QR code confirmations
                        </Link>
                    </div>
                    <div className={`${classes.card}`}>
                        <Link to="/profile" className={`${classes.link}`}>
                            My profile
                        </Link>
                    </div>
                </div>
            </>
        );
    else if(userContext.user.role == UserRole.COMPANY_ADMIN){
        return <CompanyAdminHomePage />;
    }
    else return <CompanyList />;
}
