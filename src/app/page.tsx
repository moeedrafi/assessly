import Link from "next/link";

export default function Home() {
  return (
    <>
      <header className="sticky top-0 bg-bg backdrop-blur">
        <div className="max-w-6xl p-4 mx-auto flex items-center justify-between gap-2 font-lato">
          <Link href="/" className="text-xl font-extrabold text-text">
            Assessly
          </Link>

          <nav className="hidden sm:block space-x-5 text-text">
            <Link href="/">Home</Link>
            <Link href="/">Features</Link>
            <Link href="/">Pricing</Link>
            <Link href="/">Contact</Link>
          </nav>

          <div className="space-x-2">
            <Link href="/login">
              <button className="bg-primary px-3 py-1.5 hover:bg-secondary border border-primary text-white cursor-pointer transition-colors duration-100">
                Sign In
              </button>
            </Link>

            <Link href="/register">
              <button className="px-3 py-1.5 border border-primary text-primary cursor-pointer transition-colors duration-100">
                Sign Up
              </button>
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="max-w-4xl mx-auto py-20 md:py-28">
          <div className="flex flex-col items-center justify-center gap-5 text-text">
            <h1 className="text-[4rem] leading-[1em] font-lato text-center font-bold">
              Transform your Learning Experience
            </h1>
            <p className="text-[1rem] leading-[1.6em] font-lato text-center">
              Our platform helps students of all sizes build beautiful websites,
              increase conversions, and grow their online presence with powerful
              tools and intuitive design.
            </p>

            <button className="bg-primary text-white px-5 py-2 rounded-md">
              Start Now
            </button>
          </div>
        </section>

        {/* Features */}
        <section>Features section</section>

        {/* PRICING */}
        <section>Pricing section</section>

        {/* Footer */}
        <footer>Footer</footer>
      </main>
    </>
  );
}
