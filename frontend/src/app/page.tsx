import Link from "next/link";

const features = [
  {
    title: "Feature 1",
    description:
      "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Distinctio pariatur magni ex aliquam?",
  },
  {
    title: "Feature 2",
    description:
      "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Distinctio pariatur magni ex aliquam?",
  },
  {
    title: "Feature 3",
    description:
      "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Distinctio pariatur magni ex aliquam?",
  },
  {
    title: "Feature 4",
    description:
      "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Distinctio pariatur magni ex aliquam?",
  },
];

const pricings = [
  {
    title: "Free",
    description:
      "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Distinctio pariatur magni ex aliquam?",
    price: "$0 USD",
    perks: ["Upload up to 1 PDF per day", "Generate up to 15 flashcars"],
  },
  {
    title: "Premium",
    description:
      "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Distinctio pariatur magni ex aliquam?",
    price: "$45 USD",
    perks: [
      "Upload up to 1 PDF per day",
      "Generate up to 15 flashcars",
      "Generate up to 15 flashcars",
      "Generate up to 15 flashcars",
    ],
  },
  {
    title: "Alpha",
    description:
      "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Distinctio pariatur magni ex aliquam?",
    price: "$60 USD",
    perks: [
      "Upload up to 1 PDF per day",
      "Upload up to 1 PDF per day",
      "Generate up to 15 flashcars",
      "Generate up to 15 flashcars",
      "Generate up to 15 flashcars",
      "Generate up to 15 flashcars",
    ],
  },
];

export default function Home() {
  return (
    <>
      <header className="sticky top-0 bg-bg/80 backdrop-blur border-b border-color">
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

      <main className="max-w-360 mx-auto bg-light space-y-4">
        {/* Hero */}
        <section className="bg-light max-w-4xl mx-auto py-20 md:py-28">
          <div className="flex flex-col items-center justify-center gap-5 text-text">
            <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-[4rem] leading-[1em] font-lato text-center font-bold">
              Transform your Learning Experience
            </h1>
            <p className="text-xs sm:text-sm md:text-base leading-[1.6em] font-lato text-center">
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
        <section className="bg-bg">
          <div className="py-16 px-4 sm:px-8 max-w-6xl mx-auto space-y-4 font-lato">
            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl md:text-4xl leading-[1em] text-center font-lato font-bold">
                Features
              </h2>

              <p className="text-xs sm:text-sm leading-[1.6em] text-balance text-muted-foreground text-center">
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Culpa,
                aut quibusdam? Ratione, dignissimos nesciunt saepe nihil
                asperiores facere deleniti consequatur fugiat, atque eum
                reprehenderit expedita magni suscipit facilis?
              </p>
            </div>

            <div className="px-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-light space-y-2 p-6 shadow border border-color font-lato rounded-lg hover:-translate-y-1 transition-transform"
                >
                  <h3 className="text-base sm:text-lg md:text-xl leading-[1.2em] font-bold text-center">
                    {feature.title}
                  </h3>
                  <p className="text-xs sm:text-sm leading-[1.6em] text-muted-foreground text-center">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PRICING */}
        <section className="bg-bg">
          <div className="py-16 px-4 sm:px-8 max-w-6xl mx-auto space-y-4 font-lato">
            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl md:text-4xl leading-[1em] text-center font-lato font-bold">
                Pricing
              </h2>

              <p className="text-xs sm:text-sm leading-[1.6em] text-balance text-muted-foreground text-center">
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Culpa,
                aut quibusdam? Ratione, dignissimos nesciunt saepe nihil
                asperiores facere deleniti consequatur fugiat, atque eum
                reprehenderit expedita magni suscipit facilis?
              </p>
            </div>

            <div className="px-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {pricings.map((pricing, index) => (
                <div
                  key={index}
                  className="bg-light space-y-4 p-6 shadow border border-color font-lato rounded-lg hover:-translate-y-1 transition-transform"
                >
                  <div className="space-y-2">
                    <h3 className="text-lg sm:text-xl md:text-2xl leading-[1.2em] font-bold">
                      {pricing.title}
                    </h3>

                    <h3 className="text-xl sm:text-2xl md:text-3xl leading-[1.2em] font-bold">
                      {pricing.price}
                    </h3>
                  </div>

                  <ul className="list-outside list-disc pl-4">
                    {pricing.perks.map((perk, idx) => (
                      <li
                        key={idx}
                        className="text-xs sm:text-sm leading-[1.6em] text-muted-foreground"
                      >
                        {perk}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer>Footer</footer>
      </main>
    </>
  );
}
