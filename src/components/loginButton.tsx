'use client'
import { Button } from '@/components/ui/button'

import { createClient } from '@/utils/supabase/client'
import { Provider } from '@supabase/supabase-js';
import { ReactNode } from 'react';

interface Props {
	provider: Provider,
	children: ReactNode
}

export default function LoginButton({ provider, children }: Props) {
	const supabase = createClient();

	const handleGoogleLogin = async () => {
		await supabase.auth.signInWithOAuth({
			provider: provider,
			options: {
				redirectTo: `${location.origin}/auth/callback?next=/events`,
			},
		})
	}

	return (
		<Button onClick={handleGoogleLogin}>{children}</Button>
	)
}