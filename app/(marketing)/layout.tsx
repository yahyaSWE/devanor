import { auth } from "@/auth";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default async function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const user = session?.user
    ? { email: session.user.email ?? "", role: session.user.role }
    : null;

  return (
    <>
      <Navbar user={user} />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
