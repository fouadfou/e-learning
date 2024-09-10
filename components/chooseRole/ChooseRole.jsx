"use client"
import  { useEffect, useState } from 'react';
import { Autocomplete, AutocompleteItem, Button } from "@nextui-org/react";
import { useAuth, useSignUp, useClerk , useUser  , useSignIn, SignIn} from "@clerk/nextjs";
import { addUser } from '@/app/utils/userRequestes';
import { checkUserExist } from '@/app/utils/userRequestes';

export const roles = [
    { label: "Enseignant", value: "enseignant" },
    { label: "Parent", value: "parent" },
    { label: "ÉLÈVE", value: "eleve" },
];

const ChooseRole = () => {

    const { userId, getToken } = useAuth();
    const { isSignedIn, user } = useUser();


    const [userExist, setUserExist] = useState(true);
    const [selectedRole ,setSelectedRole] = useState();


    useEffect(() => {

        const checkuser = async () => {
          
            
            const token = await getToken({ template: "supabase" });
            
            const exist = await checkUserExist({ userId, token });
            setUserExist(exist);
            
          
        };
    
        user && checkuser()  
        
      }, [user]); 


    return (
        <>
        {
        
        (user && !userExist) && (
        <div className={`fixed  top-0 z-50 flex items-center  justify-center h-screen w-screen bg-black bg-opacity-40 backdrop-blur-sm`} >
            
            <div className=' w-[40%] h-auto flex flex-col  justify-center gap-2  bg-white rounded-xl p-6 '>
                <Autocomplete
                    allowsCustomValue
                    label="Choose your role please"
                    defaultItems={roles}
                    value={selectedRole}
                    onChange={(value) => setSelectedRole(value)}
                    className="w-full"
                    disableSelectorIconRotation
                >
                    {(item) => <AutocompleteItem key={item.value}>{item.label}</AutocompleteItem>}
                </Autocomplete>
                <Button className='bg-primaryColor w-full text-white mt-2'>Save</Button>
            </div>
        </div>
        )}
        </>
    );
}

export default ChooseRole;
