import NodeLoader from "@/components/NodeLoader";

export default function HomeInterim() {
  return (
    <section className="relative flex flex-1 items-center justify-center overflow-hidden px-6 py-20">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-16 h-64 w-64 -translate-x-1/2 rounded-full bg-indigo-500/15 blur-3xl" />
        <div className="absolute bottom-10 left-20 h-44 w-44 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute bottom-10 right-20 h-44 w-44 rounded-full bg-cyan-500/10 blur-3xl" />
      </div>

      <div className="relative">
        <NodeLoader />
      </div>
    </section>
  );
}
