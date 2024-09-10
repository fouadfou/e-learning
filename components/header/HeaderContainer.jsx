"use client"
import React, { useRef }  from 'react'
import localFont from "next/font/local"
import {motion} from "framer-motion"
import { window ,phone ,phones ,purpleBg} from '@/public/images';
import { IoPlayCircle } from "react-icons/io5";
import {Button } from"@nextui-org/react"
import Image from 'next/image';
import Link from 'next/link'
import {child, children ,family , family1 ,parent , study , children1} from "@/public/images"


const myfont = localFont({src:"../../fonts/SKULL BONES Bold22-354c5e6b.otf"})



const HeaderContainer = () => {




  const bg = {
    backgroundImage: `url(${window.src})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center'
  };
  



    
  return (
/* 
    <div className='header-container flex flex-col justify-center items-center py-[1.2rem]'>
      <HeaderBottom /> */
    
    <div >

        <div className='logos relative header-container z-20  h-[calc(100vh-3.2rem)] overflow-hidden   w-full flex  flex-col items-center  justify-center   '>
          <div style={bg} className="logos absolute top-0 "></div>
          <div className=' text-primeColor  w-[60%]  md:mt-24  text-center  items-center  my-auto flex flex-col gap-2 overflow-hidden'>

            <motion.h1 initial={{x:-150 , opacity:0}} animate={{x:0, opacity:1}} transition={{duration:0.7 , ease:"backInOut"}}
            className='text-[30px] md:text-[36px] lg:text-[45px] font-bold  '>Making education better for everyone with 
            <motion.span  style={myfont.style} className='text-[#ececec] whitespace-nowrap text-[31px] md:text-[37px] lg:text-[39px] ml-2  text-center relative '>
              
              <span  initial={{scale:0 , opacity:0}} animate={{scale:1, opacity:1}} transition={{duration:0.7 , ease:"backInOut",delay:1}}
              
              className='text-primaryColor tracking-widest md:tracking-widest absolute top-5 text-[23px] md:text-[29px] lg:text-[31px]  left-2 '>Pickr</span>Pickr</motion.span></motion.h1>
            <motion.p initial={{scale:0 , opacity:0}} animate={{scale:1, opacity:1}} transition={{duration:0.7 , ease:"backInOut"}}
            className='md:text-lg my-2 '>Accédez aux devoirs, aux notes et aux événements importants de la vie scolaire de votre enfant. Une plateforme complète pour rester informé et engagé dans l'éducation de votre enfant</motion.p>

            <motion.div initial={{x:150 , opacity:0}} animate={{x:0, opacity:1}} transition={{duration:0.8 , ease:"backInOut"}}
            className='h-fit flex flex-col md:flex-row items-center justify-center gap-y-2 gap-x-6'>
          
              <Link  href="/parentSpace" >
                <Button className='bg-primaryColor text-white'>commencez maintenant</Button>
              </Link>

           

            </motion.div>
          </div>


          <motion.div initial={{y:20 , opacity:0}} animate={{y:0 , opacity:1}} transition={{delay:0.3,duration:0.8,type:"spring"}}
           className='absolute  h-fit  bottom-0 left-6 rounded-t-xl md:w-[170px] md:h-[170px]  lg:w-[200px] lg:h-[220px]'   style={{boxShadow:"rgba(50, 50, 93, 0.25) 0px 50px 100px 0px, rgba(0, 0, 0, 0.3) 0px 30px 60px 0px"}} >
          <Image  className='rounded-t-xl opacity-85' alt='img1'  fill  src={child.src} />
        </motion.div>

        <motion.div initial={{y:20 , opacity:0}} animate={{y:0 , opacity:1}} transition={{delay:0.4,duration:0.8,type:"spring"}}
         className='absolute h-fit bottom-0 md:left-[14rem] lg:left-[17rem] rounded-t-xl md:w-[170px] md:h-[120px] lg:w-[200px] lg:h-[150px]' style={{boxShadow:"rgba(50, 50, 93, 0.25) 0px 50px 100px 0px, rgba(0, 0, 0, 0.3) 0px 30px 60px 0px" }}>
          <Image className='rounded-t-xl opacity-90' alt='img2' fill src={study.src} />
        </motion.div>

        <motion.div initial={{y:20 , opacity:0}} animate={{y:0 , opacity:1}} transition={{delay:0.5,duration:0.8,type:"spring"}}
         className='absolute  h-fit bottom-0 md:right-[14rem]  lg:right-[17rem] rounded-t-xl md:w-[170px] md:h-[120px]  lg:w-[200px] lg:h-[150px]' style={{boxShadow:"rgba(50, 50, 93, 0.25) 0px 50px 100px 0px, rgba(0, 0, 0, 0.3) 0px 30px 60px 0px" }}>
          <Image className='rounded-t-xl opacity-90' alt='img2' fill src={parent.src} />
        </motion.div>

        <motion.div  initial={{y:20 , opacity:0}} animate={{y:0 , opacity:1}} transition={{delay:0.6,duration:0.8,type:"spring"}} 
        className='absolute   h-fit bottom-0 right-6 rounded-t-xl md:w-[170px] md:h-[170px] lg:w-[200px] lg:h-[220px]' style={{boxShadow:"rgba(50, 50, 93, 0.25) 0px 50px 100px 0px, rgba(0, 0, 0, 0.3) 0px 30px 60px 0px" }}>
          <Image className='rounded-t-xl opacity-90' alt='img2' fill src={children1.src} />
        </motion.div>

        

       

                  

         {/*  <div  className=' z-40 logos absolute bottom-0 translate-y-1/2 w-full px-[10%] overflow-hidden '>
          
          
            <Image width={0}
                height={0}
                sizes="100vw"
              style={{boxShadow:"rgba(100, 100, 111, 0.2) 0px 20px 15px 0px" , width: '100%', height: 'auto'}}  src={window.src}  alt="productImg"  />
          
          <motion.div initial={{x:-50 , opacity:0}} whileInView={{x:0,  opacity:1}} viewport={{ once: true }} transition={{duration:0.5 , ease:"backInOut" }} className=" absolute top-[10%] left-[3.8%] w-[14%]">
            <Image width={0}
                height={0}
                sizes="100vw" style={{ width: '100%', height: 'auto'}} src={phone.src} alt="" />

          </motion.div>

          <motion.div initial={{x:50 , opacity:0}} whileInView={{x:0 , opacity:1}} viewport={{ once: true }} transition={{duration:0.5 , ease:"backInOut" }} className=" absolute top-[20%] right-[1.5%] w-[20%]" >
          <Image width={0}
                height={0}
                sizes="100vw" style={{ width: '100%', height: 'auto'}} src={phones.src} alt="" />

          </motion.div>
          
          <motion.div initial={{scale:0 , rotate:0 ,opacity:0 }} whileInView={{scale:1 ,rotate:-90 , opacity:1}} viewport={{ once: true }} transition={{duration:0.8 , ease:"backInOut"}} className="  h-fit -top-[20%] absolute left-[36%]   w-[30%] -rotate-90">
          <Image width={0}
                height={0}
                sizes="100vw" style={{ width: '100%', height: 'auto'}}   src={phone.src} alt="" />

          </motion.div>

          </div>
 */}

        </div>

      

    </div> 

  )
}

export default HeaderContainer