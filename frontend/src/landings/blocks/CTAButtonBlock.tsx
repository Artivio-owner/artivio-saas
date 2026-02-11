export default function CTAButtonBlock({
  text,
  url,
}: {
  text: string;
  url: string;
}) {
  return (
    <section>
      <a href={url}>
        <button>{text}</button>
      </a>
    </section>
  );
}