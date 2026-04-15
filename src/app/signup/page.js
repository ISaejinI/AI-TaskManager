import SignupForm from "../../components/SignupForm";

export default function SignupPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-surface px-4 py-10 sm:px-6">
      <section className="w-full max-w-md">
        <h1 className="mb-4 text-title-lg font-semibold text-on-surface">Inscription</h1>
        <SignupForm />
      </section>
    </main>
  );
}
