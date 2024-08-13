import { UserRole } from "@prisma/client"

declare global {
  namespace Express {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface User {
      id: string
      role: UserRole
    }
  }
}
