import { authMiddleware } from "@clerk/nextjs";
 
// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your Middleware
export default authMiddleware({
  
/*     publicRoutes:['/' ,'api/webhook/clerk','/shop','/about','/contact','/journal','/api/hello' ,'/api/users', '/libs', '/models','/cart','/ProductDetails','/paymentgateway','/product/(.*)'], */
    publicRoutes:['/','/api/webhooks(.*)','/api(.*)','/api/hello','/api/(.*)','/api/clerk(.*)','/api/routers(.*)','/utils(.*)' ,'api/webhook/clerk','/api/users','/Contact','/Shop','/cart','/product/(.*)','/profile/(.*)'], 
    ignoredRoutes:['/api/webhook/clerk']
});
 
export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};