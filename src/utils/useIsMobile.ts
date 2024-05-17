"use client"
import { useState, useEffect } from 'react';

export function useIsMobile() {
	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		const mediaQuery = window.matchMedia('(max-width: 768px)');
		function handleChange(e: MediaQueryListEvent | MediaQueryList) {
			setIsMobile(e.matches);
		}
		mediaQuery.addEventListener('change', handleChange);
		handleChange(mediaQuery);

		return () => mediaQuery.removeEventListener('change', handleChange);
	}, []);

	return isMobile;
}