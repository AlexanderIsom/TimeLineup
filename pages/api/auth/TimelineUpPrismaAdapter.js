import { PrismaAdapter } from '@next-auth/prisma-adapter'

const TimeLineUpPrismaAdapter = (prisma) => {
  const originalAdapter = PrismaAdapter(prisma)

  return {
    ...originalAdapter,
    createUser: (newUser) => {
      const userToSave = {
        name: newUser.name,
        image: newUser.image,
        emailVerified: new Date(),
      }
      return originalAdapter.createUser(userToSave)
    },
  }
}

export default TimeLineUpPrismaAdapter
