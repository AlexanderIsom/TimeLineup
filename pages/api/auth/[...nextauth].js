import NextAuth from 'next-auth'
import DiscordProvider from 'next-auth/providers/discord'

export const authOptions = {
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
    }),
  ],
  pages: {
    signIn: '/auth/signin',
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      return baseUrl
    },
  },
}
export default NextAuth(authOptions)
