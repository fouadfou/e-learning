"use client"
import {useRef , useEffect  ,useState} from 'react'
import {useMediaQuery} from "react-responsive"
import {AnimatePresence ,motion} from "framer-motion"
import { IoClose } from "react-icons/io5";


const Sidebar = ({show, setShow , title ,Content}) => {

    const sidebarRef = useRef(null);

    const [isDesktop, setIsDesktop] = useState(false);
  const desktop = useMediaQuery({ query: "(min-width: 768px)" });

  useEffect(() => {
    setIsDesktop(desktop);
  }, [desktop]);

    // Close the sidebar when clicking outside of it
    const handleClickOutside = (event) => {
        if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
            setShow(false);
        }
    };

    useEffect(() => {
        // Add event listener when the sidebar is shown
        if (show) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            // Remove event listener when the sidebar is hidden
            document.removeEventListener("mousedown", handleClickOutside);
        }
        // Clean up the event listener
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [show]);

    


    return (
         <>
         <AnimatePresence>
        {show && (
            
        <div  className={`${show ===true ? "" : ""} fixed z-50  top-0 left-0 h-screen w-screen`}>

            < motion.div   
             ref={sidebarRef}
            style={{boxShadow:"rgba(17, 12, 46, 0.15) 0px 48px 100px 0px"}}
            initial={{ width: 0, opacity: 0 }} 
        animate={{ width: isDesktop ? 300 : 250, opacity: 1 }} 
        transition={{ duration:0.3  }} 
        exit={{ width: 0, opacity: 0 }}
        className='bg-white h-full border-default-100 border-r-[1.5px] p-4  flex flex-col gap-6 '>


            <div 
             initial={{opacity: 0 }}
             animate={{ opacity: 1 }} 
             transition={{ duration:0.3 , delay:0.2}} 
             exit={{opacity: 0 }}
             >

            <div  className='flex items-center justify-between'>
                <h1 className='font-medium'> {title}</h1>
                <IoClose onClick={() => setShow(!show)} className='bg-grayBg w-[1.3rem] h-[1.3rem] rounded p-1 cursor-pointer text-[#565656]'/>

            </div>

            </div>


            <Content setShow={setShow} />
            </motion.div>

        </div>
        
        )}
        </AnimatePresence>

</>
  )
}

export default Sidebar