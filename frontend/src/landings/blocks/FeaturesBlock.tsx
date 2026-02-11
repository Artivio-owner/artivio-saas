export default function FeaturesBlock({ items }: { items: string[] }) {
  return (
    <section>
      <ul>
        {items.map((f, i) => (
          <li key={i}>{f}</li>
        ))}
      </ul>
    </section>
  );
}