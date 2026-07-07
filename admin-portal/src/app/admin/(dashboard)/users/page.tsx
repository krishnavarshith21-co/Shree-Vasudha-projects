import UserManager from "@/components/admin/UserManager";
import { getUsers } from "@/app/admin/actions/users";

export default async function UsersPage() {
  const { users, error } = await getUsers();

  if (error) {
    return (
      <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-xl">
        <h3 className="text-red-400 font-semibold mb-2">Error loading users</h3>
        <p className="text-red-400/80 text-sm">{error}</p>
      </div>
    );
  }

  return <UserManager initialUsers={users || []} />;
}
