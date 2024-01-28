import { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../../App';
import { UserRole } from '../../model/user';
import CompanyList from '../../components/CompanyList/CompanyList';

export default function Home() {
    const userContext = useContext(UserContext);

    useEffect(() => {
        console.log('OnInit');

        return () => {
            console.log('OnDestroy');
        };
    });

    if (userContext.user.role == UserRole.USER)
        return (
            <>
                <div>
                    <Link to={`/company-list`}>Company list</Link>
                    <br></br>
                    <Link to={`/scheduled-appointments`}>
                        Scheduled appointments
                    </Link>
                </div>
            </>
        );
    else return <CompanyList />;
}
