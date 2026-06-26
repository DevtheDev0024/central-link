type AdminInDevelopmentPageProps = {
  title: string;
};

export default function AdminInDevelopmentPage({ title }: AdminInDevelopmentPageProps) {
  return (
    <section className="admin-in-dev">
      <h1>{title}</h1>
      <p>This section is currently under development.</p>
    </section>
  );
}
