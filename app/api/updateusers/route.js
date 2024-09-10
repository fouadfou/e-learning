import { clerkClient } from "@clerk/nextjs";
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req) {
    try {
      const { user_id,username, password } = await req.json();
    
      let params;

      if (username && password) {
       

        params = { username:username , password: password};


      } else if (username) {
        
        params = { username:username};

      } else if (password) {
        
        params = { password: password};

      }
  
      await clerkClient.users.updateUser(user_id, params);
  
      return NextResponse.json({text:'user update'});
    } catch (error) {
      console.error('Failed to process user creation request:', error);
      return NextResponse.error(new Error('Failed to process user creation request'), { status: 400 });
    }
  }
  