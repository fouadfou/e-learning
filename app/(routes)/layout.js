
import { IoMdArrowDropleft } from "react-icons/io";
import Link from 'next/link'

const AuthLayout = ({children}) => {
    return ( 
      <div className="relative flex items-center justify-center sm:p-10 p-16">
        <Link href="/" className="flex items-center absolute rounded-full text-[13px] bg-primaryColor p-[6px] pr-4 text-white top-4 left-4">
          <IoMdArrowDropleft className='mr-1' />
          <p>
          Accueil

          </p>
        </Link>
       
        {children}
      </div>
     );
  }
   
  export default AuthLayout;