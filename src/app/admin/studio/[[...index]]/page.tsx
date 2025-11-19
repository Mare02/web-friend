'use client'

import { NextStudio } from 'next-sanity/studio'
import config from '../../../../../sanity.config'
import { useEffect, useState } from 'react'
import { useAuth, useUser } from '@clerk/nextjs'
import { checkAdminRole } from '@/lib/actions/admin'
import { Loader2 } from 'lucide-react'

export default function StudioPage() {
  const { isLoaded, userId } = useAuth()
  const { user } = useUser()
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    async function checkAdminAccess() {
      if (!isLoaded || !userId || !user?.primaryEmailAddress?.emailAddress) {
        setIsChecking(false);
        return;
      }

      try {
        const isAdmin = await checkAdminRole(user.primaryEmailAddress.emailAddress);
        setIsAuthorized(isAdmin);

        if (isAdmin) {
          // Hide header and footer when studio loads
          const header = document.querySelector('[class*="sticky top-0 z-40"]') as HTMLElement;
          const footer = document.querySelector('footer') as HTMLElement;

          if (header) header.style.display = 'none';
          if (footer) footer.style.display = 'none';
        }
      } catch (error) {
        console.error('Error checking admin access:', error);
        setIsAuthorized(false);
      } finally {
        setIsChecking(false);
      }
    }

    checkAdminAccess();
  }, [isLoaded, userId, user])

  useEffect(() => {
    // Cleanup when component unmounts
    return () => {
      const header = document.querySelector('[class*="sticky top-0 z-40"]') as HTMLElement;
      const footer = document.querySelector('footer') as HTMLElement;

      if (header) header.style.display = '';
      if (footer) footer.style.display = '';
    }
  }, [])

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Checking permissions...</span>
        </div>
      </div>
    )
  }

  if (!userId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
          <p>Please sign in to access the admin panel.</p>
        </div>
      </div>
    )
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
          <p>You do not have permission to access the admin panel.</p>
        </div>
      </div>
    )
  }

  return <NextStudio config={config} />
}
