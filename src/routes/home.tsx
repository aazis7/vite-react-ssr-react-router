import { useLoaderData } from "react-router";

interface LoaderData {
  title: string;
  subtitle: string;
  features: Array<{
    id: string;
    title: string;
    description: string;
  }>;
}

export async function loader(): Promise<LoaderData> {
  return {
    title: "Welcome!",
    subtitle:
      "Build your apps with Vite React + SSR + React Router for scalable web apps.",
    features: [
      {
        id: "1",
        title: "TypeScript",
        description:
          "Built with TypeScript for better developer experience and type safety.",
      },
      {
        id: "2",
        title: "Tailwind",
        description: "Rapid UI development with utility-first CSS framework.",
      },
      {
        id: "3",
        title: "Components",
        description:
          "Modular and reusable shadcn's components for scalable applications.",
      },
    ],
  };
}

export default function Home() {
  const { title, subtitle, features } = useLoaderData<typeof loader>();

  return (
    <div className="flex flex-col items-center gap-6 p-4">
      <div className="flex flex-col items-center gap-3">
        <h1 className="text-4xl scroll-m-20 tracking-tight font-bold">
          {title}
        </h1>
        <p className="tracking-tight text-sm text-center">{subtitle}</p>
      </div>
      <div className="flex flex-col items-center gap-3 mt-8">
        <p className="tracking-tight text-foreground/95 text-center">
          Edit{" "}
          <code className="bg-muted relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
            src/routes/home.tsx
          </code>{" "}
          to get started
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
        {features.map((feature) => (
          <div
            key={feature.id}
            className="w-full flex flex-col gap-3 p-6 rounded-lg border bg-transparent text-card-foreground shadow-md"
          >
            <h3 className="text-xl font-semibold tracking-tight scroll-m-20">
              {feature.title}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
