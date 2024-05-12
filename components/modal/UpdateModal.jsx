"use client"
import React ,{use, useEffect, useState} from 'react'
import {Modal,Select, SelectItem, Chip, Tabs, Tab, Card, CardBody, CardHeader ,ModalContent,Input, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure} from "@nextui-org/react";
import { GoPlus } from "react-icons/go";
import axios from 'axios';
import { useAuth } from '@clerk/nextjs';
import { getuserbyname, updateUser , getUsers} from '@/app/utils/userRequestes';
import { FaEye ,FaEyeSlash  } from "react-icons/fa";
import { FiEdit } from "react-icons/fi";
import {Checkbox} from "antd"

const roles = [
    { label: "Teacher", value: "Teacher" },
    { label: "Parent", value: "Parent" },
    { label: "Student", value: "Student" },
  ];


  


const UpdateModal = ({setUsers, user_id}) => {



  const { isOpen, onOpen, onOpenChange , onClose } = useDisclosure();
  const [selected, setSelected] = useState("username/password");
  const [resinfo , setRestinfo] = useState(['firstname','lastname','role'])
  const [username_password , setUsername_password] = useState(['username','password'])
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


  const handleSubmitUsernameAndPassword = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    
    try {
      if (username_password.includes('username') && username_password.includes('password')) {

        const response = await axios.post('/api/updateusers', {
          user_id: user_id,
          username: username,
          password: password
        });
        
        if (response.status === 200) {
            const token = await getToken({ template: "supabase" });
            await updateUser({user_id:user_id, username: username, token });
          }
      
        console.log('Username and password posted successfully:', response.data);
      } else if (username_password.includes('username')) {


        const response = await axios.post('/api/updateusers', {
          user_id: user_id,
          username: username
        });
        if (response.status === 200) {
            const token = await getToken({ template: "supabase" });
            await updateUser({user_id:user_id, username: username, token });
          }
        console.log('Username posted successfully:', response.data);
      } else if (username_password.includes('password')) {
        const response = await axios.post('/api/updateusers', {
          user_id: user_id,
          password: password
        });
        console.log('password posted successfully:', response.data);
      } 

      

      setTimeout(async() => {
        const token = await getToken({ template: "supabase" });
        const fetchedUsers = await getUsers({token }); 
        setUsers(fetchedUsers);
    }, 500);

    setUsername('');
    setPassword('');
    setIsVisible(false);

    } catch (error) {
      console.error('Error:', error);
    }
  };


const handleSubmitRestInfo = async(e) =>{

    e.preventDefault();

    const token = await getToken({ template: "supabase" });


    const updateUserParams = {
        user_id: user_id,
        token: token
      };
      
      if (resinfo.includes('firstname')) {
        updateUserParams.firstname = firstname;
      }
      
      if (resinfo.includes('lastname')) {
        updateUserParams.lastname = lastname;
      }
      
      if (resinfo.includes('role')) {
        updateUserParams.role = role;
      }

      await updateUser(updateUserParams);

    setTimeout(async() => {
        const token = await getToken({ template: "supabase" });
        const fetchedUsers = await getUsers({token }); 
        setUsers(fetchedUsers);
    }, 500);

    setRole('');
    setFirstname('');
    setLastname('');

}



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
 
  return (
    <>
        
        <Button onPress={onOpen} isIconOnly className='bg-transparent'>
            <FiEdit  />
            </Button>
      <Modal 
        size='xl'
        backdrop="opaque" 
        isOpen={isOpen} 
        onOpenChange={onOpenChange}
      >
        <ModalContent>

            <ModalHeader className="flex flex-col gap-1">User informations</ModalHeader>
            <ModalBody>
            <Chip color="danger" variant="flat">The saving buttons are not the same</Chip>
            <p className='text-sm font-medium'>Please select the information you wish to update</p>

{/* 
            <div  className='flex bg-grayBg gap-2   rounded-xl p-1'>
                <Button size='sm' onClick={()=> setSelected('username/password')} className={`bg-transparent  flex-1 ${selected === 'username/password' && "bg-white border-[1px] shadow-sm"}`} >username/password</Button>
                <Button size='sm'onClick={()=> setSelected('restinfo')}  className={`bg-transparent  flex-1 ${selected === 'restinfo' && "bg-white border-[1px] shadow-sm"}`} >Rest informations</Button>
                
                
            </div>
 */}
           
        <Tabs
            fullWidth
            aria-label="Tabs form"
            selectedKey={selected}
            onSelectionChange={setSelected}
          >
            <Tab key="username/password"  title="username/password">
            <div className='w-full flex items-center justify-between p-2 pb-5 '>
                   <Checkbox defaultChecked 
                    onChange={(e) => {
                        if (e.target.checked) {
                            setUsername_password(prevState => [...prevState, 'username']);
                        } else {
                            setUsername_password(prevState => prevState.filter(item => item !== 'username'));
                        }
                      }}>Username</Checkbox>
                    <Checkbox defaultChecked  
                     onChange={(e) => {
                        if (e.target.checked) {
                            setUsername_password(prevState => [...prevState, 'password']);
                        } else {
                            setUsername_password(prevState => prevState.filter(item => item !== 'password'));
                        }
                      }}
                      >Password</Checkbox> 
                   
                </div>
              <form onSubmit={handleSubmitUsernameAndPassword} className="flex flex-col gap-4">
              { username_password.includes('username') && <Input  isRequired label="Username" value={username}  labelPlacement="inside"  type="text"   onChange={(e) => usernamecheck(e.target.value)} />}
              {username !== '' && (
                usernameTaken ? (
                  <p className="text-danger text-[12px] ml-2">Username is already taken. Please choose another one.</p>
                ) : (
                  <p className="text-success text-[12px] ml-2">Username is available</p>
                )
              )}
              { username_password.includes('password') && <Input
                  isRequired
                  value={password}
                  label="Password"
                  labelPlacement="inside"
                  onChange={(e) => setPassword(e.target.value)}
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
                
                <div className="flex gap-2 justify-end">
                <Button onSubmit={handleSubmitUsernameAndPassword} type='submit' fullWidth className='bg-primaryColor text-white'>
                    
                    {loading ? 'Processing...' : 'Save Username / Password'}
                  </Button>
                </div>
              </form>
            </Tab>
            <Tab key="restinformations" title="Rest informations">
            <div className='w-full flex items-center justify-between p-2 pb-5 '>
                    <Checkbox defaultChecked 
                    onChange={(e) => {
                        if (e.target.checked) {
                            setRestinfo(prevState => [...prevState, 'firstname']);
                        } else {
                            setRestinfo(prevState => prevState.filter(item => item !== 'firstname'));
                        }
                      }}>FirstName</Checkbox>
                    <Checkbox defaultChecked 
                     onChange={(e) => {
                        if (e.target.checked) {
                            setRestinfo(prevState => [...prevState, 'lastname']);
                        } else {
                            setRestinfo(prevState => prevState.filter(item => item !== 'lastname'));
                        }
                      }}>LastName</Checkbox>
                    <Checkbox defaultChecked    onChange={(e) => {
                        if (e.target.checked) {
                            setRestinfo(prevState => [...prevState, 'role']);
                        } else {
                            setRestinfo(prevState => prevState.filter(item => item !== 'role'));
                        }
                      }}>Role</Checkbox>
                </div> 
              <form onSubmit={handleSubmitRestInfo} className="flex flex-col gap-4 h-[300px]">
              { resinfo.includes('firstname') && <Input onChange={(e) => setFirstname(e.target.value)} isRequired label="FirstName"  type="text" />}
              { resinfo.includes('lastname') && <Input onChange={(e) => setLastname(e.target.value)} isRequired label="LastName"  type="text" />}
              { resinfo.includes('role') && <Select 
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
              </Select>}
                
                <div className="flex gap-2 justify-end">
                  <Button onSubmit={handleSubmitRestInfo} type='submit' fullWidth className='bg-primaryColor text-white'>
                    Save rest informations
                  </Button>
                </div>
              </form>
            </Tab> 
          </Tabs>
       
            </ModalBody>

        </ModalContent>
      </Modal>
    </>
  );
}

export default UpdateModal;
