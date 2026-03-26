import { isAdminAuthenticated } from "@/lib/admin-auth"
import AdminGate from "@/components/admin/AdminGate"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const authenticated = await isAdminAuthenticated()

  if (!authenticated) {
    return <AdminGate>{children}</AdminGate>
  }

  return <>{children}</>
}
