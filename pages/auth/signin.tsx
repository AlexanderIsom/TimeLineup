import { signIn, getProviders } from 'next-auth/react'
import Image from 'next/image'

export default function singin({ providers }: any) {
  return (
    <div className='bg-black min-h-screen flex items-center justify-center px-16'>
      <div className=' relative w-full max-w-lg'>
        <div className='absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-normal filter blur-2xl opacity-50 animate-blob'></div>
        <div className='absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-normal filter blur-2xl opacity-50 animate-blob animation-delay-500'></div>
        <div className='absolute top-0 -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-normal filter blur-2xl opacity-50 animate-blob animation-delay-1000'></div>
        <div className='m-8 relative space-y-4 '>
          <div className='p-5 bg-white rounded-lg flex items-center justify-center space-x-8'>
            <div className='h-6 w-48 text-xl font-medium'>Sign in options</div>
          </div>

          {providers &&
            Object.values(providers).map((provider: any) => (
              <div
                key={provider.id}
                className='p-5 bg-white rounded-lg flex items-center justify-between space-x-8'
              >
                <div className='flex-1' onClick={() => signIn(provider.id)}>
                  <div className='h-6 w-48 bg-gray-300 rounded'>
                    Sign in with
                  </div>
                </div>
                <div>
                  <div className='w-24 h-6 rounded-lg bg-purple-300'>
                    {provider.name}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}

export async function getServerSideProps(context: any) {
  const providers = await getProviders()
  return {
    props: { providers },
  }
}
