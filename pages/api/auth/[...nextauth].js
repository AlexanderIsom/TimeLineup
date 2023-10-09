import NextAuth from 'next-auth'
import CredentialsProvider from "next-auth/providers/credentials";
import clientPromise from "lib/mongodb";

export const authOptions = {
  secret: process.env.SECRET,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      async authorize() {
        const user = { id: "64752cd2ba8f24274a5c1c3e", name: "Demo", image: "https://cdn.discordapp.com/avatars/710766639095742485/c16cd63cec8537ba2d47683f71f5ae3a.webp?size=4096" }
        return user;
      }
    }),
    Demo({
      name: "Demo User",
      credentials: {},
      authorize: async (credentials) => {
        const client = await clientPromise
        const db = client.db("TimeLineupDemo")
        const demoUser = await db.collection("User").findOne({})

        if (user) {
          return Promise.resolve(user);
        } else {
          return Promise.reject(null)
        }
      }
    })
  ],
  pages: {
    signIn: '/auth/signin',
  },
  callbacks: {
    async session({ session, token, user }) {
      session.user = user
      return session
    },

    async redirect({ url, baseUrl }) {
      return baseUrl
    },
  },
}

export default NextAuth(authOptions)
