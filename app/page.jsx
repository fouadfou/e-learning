"use client"

import { useAuth ,useUser ,useSignUp } from "@clerk/nextjs";
import { clerkClient } from "@clerk/nextjs/server";
import { useState, useEffect } from "react";
import { getTodos, addTodo, deleteTodo } from "./utils/supabaseRequests";
import HeaderContainer from "@/components/header/HeaderContainer";
import { supabaseClient } from "./utils/supabaseClient";
import { userslist } from "./utils/userRequestes";

import { createClient } from '@supabase/supabase-js';




export default function Home() {
  const { userId, getToken } = useAuth();
  const { isSignedIn, user } = useUser();
  const { isLoaded, signUp } = useSignUp();

  


// Initialize Supabase client

/* 
const ggg = async () => {
  try {
    // Get token
    const token = await getToken({ template: "supabase" });


    const supabase = await supabaseClient(token);

    // Update data in the 'todos' table
    const { data, error } = await supabase
      .from('todos')
      .insert({ name: "rrr", user_id:"user_iiiiiiiiiii" })
      

    if (error) {
      throw error;
    }

    console.log("Updated data:", data);

    return data;
  } catch (error) {
    console.error('Error updating todos:', error.message);
    return null;
  }
}; */

  

  
  return (
    <main>
    {/*  <button onClick={ggg}>add</button> */}
     < HeaderContainer />
    </main>
  );
}
