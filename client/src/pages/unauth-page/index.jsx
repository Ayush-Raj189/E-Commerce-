import React from 'react'
import { ShieldAlert } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'

const UnauthPage = () => {
  const navigate = useNavigate()

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="text-center space-y-6 max-w-md">
        <ShieldAlert className="h-16 w-16 text-red-600 mx-auto" />
        <div>
          <h1 className="text-3xl font-bold mb-2">Access Denied</h1>
          <p className="text-muted-foreground">
            You are not authorized to access this page
          </p>
        </div>
        <Button onClick={() => navigate('/')}>
          Return Home
        </Button>
      </div>
    </div>
  )
}

export default UnauthPage
