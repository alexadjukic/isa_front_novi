import { useContext } from 'react';
import { UserContext } from '../../App';
import { UserRole } from '../../model/user';
import CompanyList from '../../components/CompanyList/CompanyList';
import classes from './Home.module.css';

export default function Home() {
    const userContext = useContext(UserContext);

    if (userContext.user.role == UserRole.USER)
        return (
            <>
                <div>
                    <div className={`${classes.card}`}>
                        <a href="/company-list" className={`${classes.link}`}>
                            Company list
                        </a>
                    </div>
                    <div className={`${classes.card}`}>
                        <a href="/scheduled-appointments" className={`${classes.link}`}>
                            Scheduled appointments
                        </a>
                    </div>
                    <div className={`${classes.card}`}>
                        <a href="/qr-codes" className={`${classes.link}`}>
                            QR code confirmations
                        </a>
                    </div>
                    <div className={`${classes.card}`}>
                        <a href="/profile" className={`${classes.link}`}>
                            My profile
                        </a>
                    </div>
                </div>
            </>
        );
    else return <CompanyList />;
}
