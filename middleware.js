// import { withAuth } from 'next-auth/middleware'

// export default withAuth({
//   callbacks: {
//     authorized: ({ req, token }) => {
//       if (req.nextUrl.pathname === '/admin') {
//         return token?.role === 'admin'
//       }

//       return Boolean(token)
//     }
//   }
// })

// export const config = { matcher: ['/admin', '/profile', '/protected/:path*'] }

export { default } from 'next-auth/middleware'

export const config = { matcher: ['/admin', '/profile', '/','/NewRecord/:path*','/RecordList/:path*','/inicio/:path*','/document/:path*','/entrie/:path*','/organization','/produccion/:path*'] }
