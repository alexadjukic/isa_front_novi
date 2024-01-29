import { useState, ChangeEvent, useEffect, useContext } from "react";
import { QueryClient, useMutation, useQuery, useQueryClient } from "react-query";
import { finishPickUpAppointment, getDataFromQRCode, getDataFromQRCodeSecond } from "../../services/appointmentService";
import { AxiosResponse } from "axios";
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { User, UserDetails, UserRole } from '../../model/user';
import { getUser, getUserDetails } from '../../services/authorizationService';
import jsQR from 'jsqr';
import { UserContext } from "../../App";

export default function PickUpEquipment() {
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [qrData, setQRData] = useState<string | null>(null);
    const { getItem: getToken } = useLocalStorage('jwtToken');
    const [ user ] = useState<User>(getUser(getToken()));
    const queryClient = useQueryClient();
    const userContext = useContext(UserContext);
    const [ userDetails, setUserDetails ] = useState<UserDetails>({id: 0, username: '', role: UserRole.UNAUTHENTICATED, email: '', password: '', firstName: '', lastName: '', addressId: 0, phoneNumber: '', profession: '', companyId: 0, penaltyPoints: 0});

    const qrDataQuery = useQuery(['qrData', selectedImage],
        async () => {
            if (selectedImage) {
                const response = await getDataFromQRCode(selectedImage);
                return response;
            } else {
                throw new Error("No selected image");
            }
        },
        {
            onSuccess: (data: AxiosResponse<string>) => {
                setQRData(data.data);
            },
        },
    );

    useEffect(() => {
        if (qrDataQuery.isSuccess) {
            setQRData(qrDataQuery.data.data);
        }
    }, [qrDataQuery.isSuccess]);

    const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files !== null) {
            const file = event.target.files[0];
            console.log(file);
    
            if (file) {
                setSelectedImage(file);

                const reader = new FileReader();

                reader.onload = async (e) => {
                    try {
                        const img = new Image();
                        img.src = URL.createObjectURL(file);

                        img.onload = () => {
                            const width = img.width;
                            const height = img.height;

                            const binaryData = e.target?.result as ArrayBuffer;
            
                            const code = jsQR(new Uint8ClampedArray(binaryData), width, height);
            
                            if (code) {
                              setQRData(code.data);
                              console.log('Decoded QR Code:', code.data);
                            } else {
                              console.log('QR Code not detected or could not be decoded.');
                            }
                        };
                    } catch (error) {
                        console.error('Error decoding QR code:', error);
                    }
                };

                reader.readAsArrayBuffer(file);
            }
        }
    };

    const pickUpMutation = useMutation(finishPickUpAppointment,
    {
        onSuccess: () => {
            setQRData('');
            setSelectedImage(null);
            queryClient.invalidateQueries(['qrData', userContext.user.id]);
        }
    })

    const pickUpClick = (qr: File | null) => {
        if (qr) {
            pickUpMutation.mutate(qr);
        } else {
            throw new Error("No selected image");
        }
    };

    return (
        <div>
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
                    {qrData !== 'penalized' && qrData !== '' && <button onClick={() => pickUpClick(selectedImage)}>Pick up done</button>}
                </div>
            )}
            {qrData && (
                <div>
                    <p>QR Data:</p>
                    <p>{qrData}</p>
                </div>
            )}
        </div>
    );
}