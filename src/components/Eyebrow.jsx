export default function Eyebrow({ children }) {
  return (
    <div className="eyebrow">
      <span className="eyebrow__line eyebrow__line--l" />
      <span className="eyebrow__text">{children}</span>
      <span className="eyebrow__line eyebrow__line--r" />
    </div>
  );
}
