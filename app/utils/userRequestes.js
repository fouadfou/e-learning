
import { getAuth} from "@clerk/nextjs/server";
import { supabaseClient } from "./supabaseClient";
import clerkClient from '@clerk/clerk-sdk-node'; 

export const getuserbyname = async ({ username, token }) => {
  
    const supabase = await supabaseClient(token);
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .match({ 'username': username })
      .single();
  
    return !!data;
  
};



export const isAdmin = async ({ userId, token }) => {
    try {
      const supabase = await supabaseClient(token);
      const  {data } = await supabase
        .from('users')
        .select('role')
        .eq('user_id', userId)
        .single();

        if (data) {
         
            return data.role === 'Admin';
        }

  }catch (error) {
        console.error('Error checking user role:', error);
        throw(error)
    }
};;



export const updateUser = async ({ user_id, token, firstname, lastname, role, username }) => {

  const userDataToUpdate = {};
  if (firstname) userDataToUpdate.prenom = firstname;
  if (lastname) userDataToUpdate.nom = lastname;
  if (role) userDataToUpdate.role = role;
  if (username) userDataToUpdate.username = username;


  try {
    const supabase = await supabaseClient(token);
    const { data, error } = await supabase
      .from('users')
      .update(userDataToUpdate)
      .eq("user_id", user_id)

    if (error) {
      console.error('Error updating user:', error.message);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Failed to update user:', error.message);
    return null;
  }
};


export const addUser = async ({user_id,token, firstname, lastname , role , username,num_student}) => {

  const userDataToInsert = {};
  if(user_id) userDataToInsert.user_id=user_id;
  if (username) userDataToInsert.prenom = username;
  if (firstname) userDataToInsert.prenom = firstname;
  if (lastname) userDataToInsert.nom = lastname;
  if (role) userDataToInsert.role = role;
  if (username) userDataToInsert.username = username;


    const supabase = await supabaseClient(token);
    const {data,error} = await supabase.from("users").insert(userDataToInsert);

    console.log("role",role)

    if(role === "Student"){
   /*    const { data:niveaux_id, error } = await supabase
      .from('niveaux')
      .select('id')
      .eq('niveau', niveau); */

      
        const {error:errorinsertion} = await supabase.from("eleve").insert({user_id:user_id , num_eleve:num_student });

    } else if (role === "Teacher"){

      const {error:errorinsertion} = await supabase.from("ensg").insert({user_id:user_id});
  
    } else if (role === "Parent"){
      const {error:errorinsertion} = await supabase.from("parent").insert({user_id:user_id });

    }

    if(error) {
        console.log("error")
        return;
    }

    return data;
}



export const getUserRole = async ({ userId, token }) => {
  try {
    const supabase = await supabaseClient(token);
    const { data: role, error } = await supabase
      .from("users")
      .select("role")
      .eq("user_id", userId)
      .single()

    if (error) {
      throw new Error(error.message);
    }

    return role;
  } catch (error) {
    console.error("Error fetching todos:", error);
    throw error; 
  }
};






export const deleteUser = async ({ userId,token ,user_Id}) => {


  try {

    const auth_user_role = await getUserRole({userId,token})
    
    if(auth_user_role.role === "Admin") {

      const supabase = await supabaseClient(token);
      const { data, error } = await supabase
        .from('users')
        .delete()
        .eq('user_id',user_Id);
    }

    return { success: true };
  } catch (error) {
    console.error('Error deleting user:', error.message);
    return { success: false, error: error.message };
  }
};



export const getUsers = async ({token}) => {
  try {
    const supabase = await supabaseClient(token);
    const { data } = await supabase
      .from('users')
      .select('*');

      
  
    return data;

  } catch (error) {
    console.error('Error deleting todo:', error.message);
    return { success: false, error: error.message };
  }
};

export const checkUserExist = async ({ token, userId }) => {
  try {
    const supabase = await supabaseClient(token); // Initialize Supabase client using the provided token
    const { data, error } = await supabase
      .from('users')
      .select('user_id')
      .eq('user_id', userId)


    if (data.length<1 ) {
      return false;
    } else {
      return true;
    }

  } catch (error) {
    console.error('Error checking user existence:', error.message);
    return false;
  }
};


export const userslist = async () => {
  try {
    // Call getClientList() method to retrieve the user list
    const {userId} = getAuth();
    const user = await clerkClient.users.getUserList();

    // Log the user list to the console
    console.log(user);
    
    // You can return the userList if you want to use it further
    return user;
  } catch (error) {
    // Handle any errors that might occur during the operation
    console.error('Error fetching user list:', error);
    // Optionally, you can rethrow the error to propagate it further
    throw error;
  }
};

