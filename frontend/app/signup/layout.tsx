export default function SignupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col items-center bg-green w-screen h-screen justify-center gap-4">
      <div>{children}</div>
    </section>
  );
}
