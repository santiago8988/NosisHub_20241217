import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

import { MongoDBAdapter } from '@next-auth/mongodb-adapter'
import clientPromise from '@/lib/mongo/client'
import { isUserAllowed,getAttributes } from '@/lib/mongo/allowedusers'

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          role:'',
          position:'',
          area:[],
          organization:'',
        }
      }
    })
  ],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }){
      const isAllowedToSignIn = await isUserAllowed(user.email);
      if (isAllowedToSignIn) {
        return true;
      } else {
        return false; // Usuario no permitido
      }
    },
    async jwt({ token, user, trigger, session }) {
      
      if (user) {
                // Si el usuario está permitido, obtén su rol desde allowedusers
                const atributos = await getAttributes(user.email);
                // Almacena el rol en la sesión del usuario
                user.id=atributos?.id
                user.role = atributos?.role;
                user.position=atributos?.position
                user.area=atributos?.area
                user.organization=atributos?.organization
        token.id=user.id
        token.role = user.role
        token.position = user.position
        token.area = user.area
        token.organization = user.organization
      }

      if (trigger === 'update' && session?.name) {
        token.name = session.name
      }

      return token
    },
    async session({ session, token }) {
      if(session?.user){
          session.user.id=token.id
          session.user.role = token.role
          session.user.position = token.position
          session.user.area = token.area
          session.user.organization = token.organization
      }
      return session
    }
  },
  pages: {
    signIn: '/signin'
  },
  adapter: MongoDBAdapter(clientPromise),
  session: {
    strategy: 'jwt'
  },
  secret: process.env.NEXTAUTH_SECRET
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
