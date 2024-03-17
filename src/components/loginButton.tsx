'use client'
import { Button } from '@/components/ui/button'

import { createClient } from '@/utils/supabase/client'

export default function LoginButton() {
	const supabase = createClient();

	const handleGoogleLogin = async () => {
		await supabase.auth.signInWithOAuth({
			provider: 'google',
			options: {
				redirectTo: `${location.origin}/auth/callback?next=/private`,
			},
		})
	}

	return (
		<Button onClick={handleGoogleLogin}>Login</Button>
	)
}