import { useState, ChangeEvent, useEffect } from "react";
import { useQuery } from "react-query";
import { getDataFromQRCode } from "../../services/appointmentService";
import { AxiosResponse } from "axios";
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { User, UserDetails, UserRole } from '../../model/user';
import { getUser, getUserDetails } from '../../services/authorizationService';

export default function PickUpEquipment() {
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [qrData, setQRData] = useState<string | null>(null);
    const { getItem: getToken } = useLocalStorage('jwtToken');
    const [ user ] = useState<User>(getUser(getToken()));
    const [ userDetails, setUserDetails ] = useState<UserDetails>({id: 0, username: '', role: UserRole.UNAUTHENTICATED, email: '', password: '', firstName: '', lastName: '', addressId: 0, phoneNumber: '', profession: '', companyId: 0, penaltyPoints: 0});


    const getLoggedUser = useQuery(
        ['users',  user.id],
        () => getUserDetails(user.id),
        {
            onSuccess: (data: AxiosResponse<UserDetails>) => {
                setUserDetails(data.data);
            },
            enabled: user ? true : false
        }
    );

    const qrDataQuery = useQuery(['qrData', selectedImage],
        async () => {
            if (selectedImage) {
                const response = await getDataFromQRCode(selectedImage);
                return response;
            } else {
                // Ako selectedImage === null, možete implementirati odgovarajući tretman
                throw new Error("No selected image");
            }
        },
        {
            onSuccess: (data: AxiosResponse<string>) => {
                setQRData(data.data);
            },
        },
    );

    // useEffect(() => {
    //     if (qrDataQuery.isSuccess)
    //     setQRData(qrDataQuery.data.data);
    // }, [qrDataQuery.isSuccess]);

    useEffect(() => {
        // getLoggedUser.refetch();
    },[user, userDetails, getLoggedUser])

    const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files && event.target.files[0];

        if (file) {
            // You can save the file object or its data (e.g., base64) to the state
            setSelectedImage(file);
        }

        if (qrDataQuery.isSuccess)
        setQRData(qrDataQuery.data.data);
    };

    return (<div>
        <p>Pick up equipment</p>
        <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
        />
        {selectedImage && (
            <div>
                <p>Selected Image:</p>
                <img src={URL.createObjectURL(selectedImage)} alt="Selected" />
                <button>Do pick up</button>
            </div>
        )}
        {qrData && (
            <div>
                <p>QR Data:</p>
                <p>{qrData}</p>
            </div>
            )}
    </div>);
}