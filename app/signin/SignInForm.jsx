'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { Button } from '../../components/ui/button'
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import GoogleSignInButton from '@/components/GoogleSignInButton'

export default function SignInForm() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/inicio'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await signIn('email', {
        email,
        callbackUrl,
      })
      if (result?.error) {
        // Handle error
        console.error(result.error)
      }
    } catch (error) {
      // Handle error
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className='space-y-2'>
        <Label htmlFor="email">Sign in with your email</Label>
        <Input
          id='email'
          name='email'
          type='email'
          placeholder='hello@me.com'
          autoComplete='email'
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <Button
        type='submit'
        variant='outline'
        className='mt-3 w-full'
        disabled={isLoading}
      >
        {isLoading ? 'Signing in...' : 'Continue with email'}
      </Button>
      <div className='mx-auto my-10 flex w-full items-center justify-evenly before:mr-4 before:block before:h-px before:flex-grow before:bg-stone-400 after:ml-4 after:block after:h-px after:flex-grow after:bg-stone-400'>
        or
      </div>
      <GoogleSignInButton />
    </form>
  )
}

