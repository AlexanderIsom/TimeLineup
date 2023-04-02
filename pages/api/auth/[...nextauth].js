import NextAuth from 'next-auth'
import DiscordProvider from 'next-auth/providers/discord'
import { prisma } from "../../../lib/db";
import TimeLineUpPrismaAdapter from './TimelineUpPrismaAdapter'

export default NextAuth({
  adapter: TimeLineUpPrismaAdapter(prisma),
  secret: process.env.SECRET,
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
      authorization: 'https://discord.com/api/oauth2/authorize?scope=identify',
      profile(profile) {
        if (profile.avatar === null) {
          const defaultAvatarNumber = parseInt(profile.discriminator) % 5
          profile.image_url = `https://cdn.discordapp.com/embed/avatars/${defaultAvatarNumber}.png`
        } else {
          const format = profile.avatar.startsWith('a_') ? 'gif' : 'png'
          profile.image_url = `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.${format}`
        }
        return {
          id: profile.id,
          name: profile.username,
          image: profile.image_url,
        }
      },
    }),
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
})
