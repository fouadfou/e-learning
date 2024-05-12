"use client"
import React, { useEffect } from "react";
import { Button } from "@nextui-org/react";
import { MdDelete } from "react-icons/md";
import axios from "axios";
import { deleteUser , getUserRole} from "@/app/utils/userRequestes";
import { useAuth } from "@clerk/nextjs";
import supabaseClient from "../../utils/supabaseClient"
import { getUsers } from "@/app/utils/userRequestes";

const ActionButton = ({ user_Id , content , setUsers}) => {

  const { userId, getToken } = useAuth();

  const deleteuserid = async (userId,user_Id) => {
    
    const token = await getToken({ template: "supabase" });
    deleteUser({ userId , token  ,user_Id })

    setTimeout(() => {
      
      fetchUsers();

    }, 500);
    
    }


    const fetchUsers = async () => {
      const token = await getToken({ template: "supabase" });
      const fetchedUsers = await getUsers({token }); // Fetch users data
      setUsers(fetchedUsers); // Update users state
      
  };


  const handleDeleteUser = async (user_Id) => {
    try {

      


      // Send DELETE request to your API endpoint
      const response = await axios.delete('/api', {
        data: { user_Id }, // Pass the user ID in the request body
      });


      if (response.status === 200) {
        console.log('User deleted successfully');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };


  const delete_from_clerk_and_supabase = (userId,user_Id)=> {
    deleteuserid(userId,user_Id); 
    handleDeleteUser(user_Id);

  }

  

  return (
    <Button onClick={()=> delete_from_clerk_and_supabase(userId,user_Id)} className="bg-transparent" isIconOnly>
      {content}
    </Button>
  );
};

export default ActionButton;
