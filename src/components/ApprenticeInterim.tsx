import NodeLoader from "@/components/NodeLoader";

export default function ApprenticeInterim() {
  return (
    <section className="relative flex min-h-[70vh] items-center justify-center overflow-hidden px-6 pt-14 pb-20">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-12 h-72 w-72 -translate-x-1/2 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="absolute left-12 top-1/3 h-44 w-44 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute right-12 bottom-14 h-52 w-52 rounded-full bg-blue-500/10 blur-3xl" />
      </div>

      <div className="relative">
        <NodeLoader />
      </div>
    </section>
  );
}
