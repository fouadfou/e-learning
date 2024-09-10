import { Resend } from "resend";
import { NextResponse } from "next/server";


const resend  = new Resend(process.env.RESEND_API_KEY);

 export async function POST(req) {

    try {
        const { nom, prenom,email, message } = await req.json();


            const data = await resend.emails.send({
                from: 'onboarding@resend.dev',
                to: 'fou33fou@gmail.com',
                subject: "Message reçu de l'application E-learning",
               react:  <div className="p-4 flex flex-col gap-4 bg-green-100 text-green-700 rounded-md">
                <div className="flex gap-4">
                        <p className="font-semibold"><b>Nom : </b>{nom}</p>
                        <p className="font-semibold"><b>Prénom : </b>{prenom}</p>
               </div>
               <p><b>Email : </b>{email}</p>
               <p><b>Message : </b>{message}</p>
           </div>
              });
        

        return NextResponse.json({ status:"ok"})
    
    } catch (error) {
        return NextResponse.error(new Error('Failed to send mail'), { status: 400 });
          }

}  