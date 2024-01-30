import { Link } from "react-router-dom";
import classes from "./CompanyAdminHomePage.module.css"
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../App";
import { UserDetails, UserRole } from "../../../model/user";
import { getUserDetailsById } from "../../../services/userService";
import { AxiosResponse } from "axios";
import { useQuery } from "react-query";

export default function CompanyAdminHomePage(){
    const userContext = useContext(UserContext);
    const [user, setUser] = useState<UserDetails>({
        id: 0,
        email: '',
        username: '',
        password: '',
        firstName: '',
        lastName: '',
        addressId: 0,
        phoneNumber: '',
        profession: '',
        role: UserRole.UNAUTHENTICATED,
        companyId: 0,
        penaltyPoints: 0
    });


    const userQuery = useQuery(
        ['users', userContext.user.id],
        () => getUserDetailsById(userContext.user.id),
        {
            onSuccess: (data: AxiosResponse<UserDetails>) => {
                setUser(data.data);
            },
            enabled: userContext.user.id !== 0,
            staleTime: Infinity,
        },
    );

    
    useEffect(() => {
        if(user.id === 0){
            userQuery.refetch()
        }
    }, [user]);

    return(
        <div style={{display: 'flex', }}>
            {/* <div className={`${classes.profileContainer}`}>
                <UserProfile />
            </div> */}
            <div className={`${classes.tabsContainer}`}>
                <Link to={`/pick-up-equipment`} className={`${classes.link}`} >Pickup Information</Link>
                <Link to={`/company-full-calendar`} className={`${classes.link}`} >Calendar</Link>
                <Link to={`/create-appointment`} className={`${classes.link}`} >Create Appointment</Link>
                <Link to={`/customer-list/${user.companyId}`} className={`${classes.link}`} >Customer List</Link>
                <Link to={`/profile`} className={`${classes.link}`} >My Profile</Link>
                <Link to={`/company/${user.companyId}`} className={`${classes.link}`} >My Company</Link>
            </div>
        </div>
        
    );
}