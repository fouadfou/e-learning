// pages/api/hello.js
import { clerkClient } from "@clerk/nextjs";
import { NextRequest, NextResponse } from 'next/server'

export  async function GET() {
  try {
    // Perform your logic here
    const count = await clerkClient.users.getCount()
    return NextResponse.json(count);
  } catch (error) {
    console.error("Failed to get admins:", error);
    return res.status(400).json({ error: "Failed to get admins" });
  }
}


export async function DELETE(req) {


  try {
    

    const { user_Id } = await req.json();

    console.log("request geted / user id is :"+ user_Id )

    
    await clerkClient.users.deleteUser(user_Id)
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete user:", error);
    return NextResponse.error(new Error("Failed to delete user"), { status: 400 });
  }
}


export async function POST(req) {


  try {
    

    const { username , password } = await req.json();


    await clerkClient.users.createUser({
      username: username,
      password: password,
    })

    const response = await clerkClient.users.getUserList({username})


    
    return NextResponse.json({response});
  } catch (error) {
    console.error("Failed to delete user:", error);
    return NextResponse.error(new Error("Failed to delete user"), { status: 400 });
  }
}