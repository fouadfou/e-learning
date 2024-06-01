/* import { Resend } from "resend";
import { NextResponse } from "next/server";

import Email from "@/components/email/email"

const resend  = new Resend(process.env.RESEND_API_KEY);

 export async function POST(req) {

    try {
        const {emails , absence} = await req.json()


        for (const email of emails) {

            console.log("email",email.parent_email)

            const data = await resend.emails.send({
                from: 'onboarding@resend.dev',
                to: email.parent_email,

                subject: 'Your child is absent',
               react: <Email absence={absence}/>
              });
        }

        return NextResponse.json({ status:"ok"})
    
    } catch (error) {
        return NextResponse.error(new Error('Failed to send mail'), { status: 400 });
          }

}  */

import nodemailer from 'nodemailer';
import { NextResponse } from "next/server";
import Email from '@/components/email/Email';

export async function POST(req) {
  const { emails, absence } = await req.json();

  console.log("emails", emails);

  // Create a Nodemailer transporter
  let transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'soheibtalhi0@gmail.com',
      pass: process.env.SMTP_PASSWORD, // Your Gmail password
    },
  });

  try {
    for (const email of emails) {
      // Send email
      let info = await transporter.sendMail({
        from: 'soheibtalhi0@gmail.com', // Your name and email address
        to: email.parent_email,  // Recipient's email address
        subject: "Absence", // Subject line
       /*  html: ` <div className='flex flex-col gap-3'>
        <h1 className='text-xl font-bold'>Votre enfant est absent</h1>
        <p>Votre enfant, <b>"${absence.eleve_nom} ${absence.eleve_prenom}"</b>, est absent lors du cours de <b>"${absence.matiere_name}"</b> enseigné par <b>"M. ${absence.ensg_nom} ${absence.ensg_prenom}"</b></p>
        <p><b>Date de l'absence : </b>${absence.date_abs}</p>
        </div>`, // Plain text body */
        html: ` <div className='flex flex-col gap-3'>
        <h1 className='text-xl font-bold'>Votre enfant est absent</h1>
        <p>${absence.description}</p>
        <p><b>Date de l'absence : </b>${absence.date_abs}</p>
        </div>`,
      });

      console.log('Message sent: %s', info.messageId);
    }

    return NextResponse.json({ success: "ok" });
  } catch (error) {
    console.error('Error sending email:', error);

    return NextResponse.json({ success: false, error: 'Failed to send email' });
  }
}