import "next-auth"
import "next-auth/jwt"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      subscription?: {
        id: string
        plan: string
        status: string
        applicationsUsed: number
        applicationsLimit: number
      } | null
    }
  }

  interface User {
    id: string
    subscription?: {
      id: string
      plan: string
      status: string
      applicationsUsed: number
      applicationsLimit: number
    } | null
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
  }
}
