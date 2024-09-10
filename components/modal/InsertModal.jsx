"use client"
import React ,{useState} from 'react'
import {Modal,Select, SelectItem, ModalContent,Input, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure} from "@nextui-org/react";
import { GoPlus } from "react-icons/go";
import axios from 'axios';
import { useAuth } from '@clerk/nextjs';
import { addUser, getuserbyname ,getUsers } from '@/app/utils/userRequestes';
import { FaEye ,FaEyeSlash  } from "react-icons/fa";


const roles = [
  { label: "enseignante", value: "Teacher" },
  { label: "Parent", value: "Parent" },
  { label: "Élève", value: "Student" },
  
];



const niveaux = [
  { label: "Niveau 1", value: "niveau 1" },
  { label: "Niveau 2", value: "niveau 2" },
  { label: "Niveau 3", value: "niveau 3" },
  { label: "Niveau 4", value: "niveau 4" },
  { label: "Niveau 5", value: "niveau 5" },


];


const InsertModal = ({setUsers}) => {


  const { isOpen, onOpen, onOpenChange , onClose } = useDisclosure();
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [role, setRole] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [usernameTaken, setUsernameTaken] = useState(false);
  const [isVisible, setIsVisible] = React.useState(false);


  const { getToken } = useAuth();


  const toggleVisibility = () => setIsVisible(!isVisible);


  const usernamecheck = async (value) => {
    setUsername(value);
    if (value !== '') {
      try {
        const token = await getToken({ template: "supabase" });
        const user = await getuserbyname({ username: value, token });
        setUsernameTaken(!!user);
      } catch (error) {
        console.error('Error checking username:', error);
      }
    }
  };

  function generateUserId() {
    const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const idLength = 32;
    let userId = 'user_';

    for (let i = 0; i < idLength; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        userId += characters.charAt(randomIndex);
    }

    return userId;
}


const generateStudentNumber = () => {
  const min = 1000000000; // Minimum 10-digit number
  const max = 9999999999; // Maximum 10-digit number
  return Math.floor(Math.random() * (max - min + 1)) + min;
};



const resetStates =()=> {
    setRole('');
    setFirstname('');
    setLastname('');
    setUsername('');
    setPassword('');
    setIsVisible(false);
    setLoading(false);
}




  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      if(role !== "Student") {
        const response = await axios.post('/api', { username, password });
        if (response.status === 200) {
          const user_id = response.data.response[0].id;
          const token = await getToken({ template: "supabase" });
          await addUser({ user_id, token, firstname, lastname, role, username });
        } }
      else {
        const token = await getToken({ template: "supabase" });
        const user_id = generateUserId();
        const num_student = generateStudentNumber();
        await addUser({ user_id, token, firstname, lastname, role ,num_student});
      }

        setTimeout(async() => {
            const token = await getToken({ template: "supabase" });
            const fetchedUsers = await getUsers({token }); 
            setUsers(fetchedUsers);
        }, 500);
      
        

    } catch (error) {
      setError(error.message || 'An error occurred');
      console.error('Error creating user:', error);
    } finally {
      resetStates();
    }
  };

 
  return (
    <>
      <Button  onPress={onOpen} className='bg-primaryColor text-white' endContent={<GoPlus />}>
          Ajouter un utilisateur
      </Button>
      <Modal 
        onClose ={()=>setRole("")}
        size='xl'
        backdrop="opaque" 
        isOpen={isOpen} 
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          <form onSubmit={handleSubmit}>
            <ModalHeader className="flex flex-col gap-1">Informations de l'utilisateur</ModalHeader>
            <ModalBody>
              <div className='flex gap-3'>
              <Input
                  key="nom"
                  type="text"
                  label="Nom"
                  labelPlacement="inside"
                  value={lastname}
                  onChange={(e) => setLastname(e.target.value)}
                isRequired

                />
                <Input
                  key="prenom"
                  type="text"
                  label="Prenom"
                  labelPlacement="inside"
                  value={firstname}
                  onChange={(e) => setFirstname(e.target.value)}
                isRequired

                />
               
              </div>
              <Select 
                label="Select a role" 
                className="w-full" 
                isRequired
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                {roles.map((role) => (
                  <SelectItem key={role.value} value={role.value}>
                    {role.label}
                  </SelectItem>
                ))}
              </Select>
              {role !== "Student" && <Input
                key="username"
                type="text"
                label="Username"
                labelPlacement="inside"
                value={username}
                onChange={(e) => usernamecheck(e.target.value)}
                isRequired
              />}
              {username !== '' && (
                usernameTaken ? (
                  <p className="text-danger text-[12px] ml-2">Nom d'utilisateur déjà pris. Veuillez en choisir un autre.</p>
                ) : (
                  <p className="text-success text-[12px] ml-2">Nom d'utilisateur disponible</p>
                )
              )}
              {role !== "Student" && <Input
                key="mot de passe"
                label="mot de passe"
                labelPlacement="inside"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                isRequired
                endContent={
                  <button className="focus:outline-none" type="button" onClick={toggleVisibility}>
                    {isVisible ? (
                      <FaEye className="text-2xl text-default-400 pointer-events-none" />
                    ) : (
                      <FaEyeSlash  className="text-2xl text-default-400 pointer-events-none" />
                    )}
                  </button>
                }
                type={isVisible ? "text" : "password"}

              />}
        {/* { role ==="Student" && <Select 
                          label="Select a Level" 
                          className="w-full" 
                          isRequired
                          value={niveau}
                          onChange={(e) => setNiveau(e.target.value)}
                        >
          {niveaux.map((niveau) => (
                            <SelectItem key={niveau.value} value={niveau.value}>
                              {niveau.label}
                            </SelectItem>
              ))} 
              </Select>}*/}

         { role ==="Student" && 
         
             <Input isReadOnly type="text" placeholder='Student Number generted automaticly'  />
              } 
              
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Close
              </Button>
              <Button onSubmit={handleSubmit} className='bg-primaryColor text-white' type="submit">
                {loading ? 'Processing...' : 'Add User'}
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
}

export default InsertModal;
