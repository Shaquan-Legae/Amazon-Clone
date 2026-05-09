const benefits = [
  {
    title: 'Free fast delivery',
    description: 'Get fast delivery on eligible items with no extra delivery fee.',
  },
  {
    title: 'Prime Video',
    description: 'Stream popular movies, series, and exclusive entertainment.',
  },
  {
    title: 'Prime Music',
    description: 'Enjoy playlists, albums, and podcasts for everyday listening.',
  },
  {
    title: 'Exclusive deals',
    description: 'Unlock member-only offers across shopping categories.',
  },
  {
    title: 'Early access sales',
    description: 'Shop selected deals before they open to everyone.',
  },
]

function Prime() {
  return (
    <main className="primePage">
      <section className="primeHero">
        <span className="primeHero__badge">Prime</span>
        <h1>Fast delivery, entertainment, and exclusive savings in one membership.</h1>
        <p>
          Explore a Prime-style membership experience with delivery benefits, streaming perks, music, and early access
          deals.
        </p>
        <button className="amazonButton" type="button">
          Start Free Trial
        </button>
      </section>

      <section className="primeBenefits" aria-label="Prime benefits">
        {benefits.map((benefit) => (
          <article className="primeBenefitCard" key={benefit.title}>
            <h2>{benefit.title}</h2>
            <p>{benefit.description}</p>
          </article>
        ))}
      </section>

      <section className="primePlans" aria-label="Prime plans">
        <article className="primePlanCard">
          <span>Monthly plan</span>
          <strong>R79 / month</strong>
          <p>Flexible membership with all Prime-style benefits.</p>
          <button className="amazonButton" type="button">
            Start Free Trial
          </button>
        </article>

        <article className="primePlanCard primePlanCard--featured">
          <span>Annual plan</span>
          <strong>R749 / year</strong>
          <p>Best value for year-round shopping and entertainment perks.</p>
          <button className="amazonButton" type="button">
            Start Free Trial
          </button>
        </article>
      </section>
    </main>
  )
}

export default Prime
