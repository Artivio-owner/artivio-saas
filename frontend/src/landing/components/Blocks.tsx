/**
 * ============================================
 * ARTIVIO — LANDING BLOCKS
 * ============================================
 */

export function HeroBlock({ title, subtitle, cta }: any) {
  return (
    <section style={{ padding: 80, textAlign: 'center' }}>
      <h1>{title}</h1>
      <p>{subtitle}</p>
      {cta && (
        <a href={cta.href}>
          <button>{cta.label}</button>
        </a>
      )}
    </section>
  );
}

export function FeaturesBlock({ items }: any) {
  return (
    <section style={{ padding: 40 }}>
      <ul>
        {items.map((i: any, idx: number) => (
          <li key={idx}>
            <strong>{i.title}</strong>
            <p>{i.text}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function FooterBlock({ text }: any) {
  return (
    <footer style={{ padding: 40, textAlign: 'center', opacity: 0.6 }}>
      {text}
    </footer>
  );
}