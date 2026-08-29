import { CoinsIcon, ShieldIcon, TruckIcon } from "@/components/site/icons";

const BENEFITS = [
  {
    icon: TruckIcon,
    title: "Envíos a todo el país",
    desc: "Coordinamos el envío a tu ciudad de forma rápida y segura.",
  },
  {
    icon: CoinsIcon,
    title: "Pagás 50% y el resto al recibir",
    desc: "Reservás con la mitad y abonás el saldo cuando lo tenés en la mano. Más tranquilidad.",
  },
  {
    icon: ShieldIcon,
    title: "Compra segura",
    desc: "Atención directa por WhatsApp y respaldo real en cada compra.",
  },
];

export function Benefits() {
  return (
    <section className="border-y border-[var(--line)] bg-[var(--surface)] px-5 py-14">
      <div className="mx-auto max-w-[1180px]">
        <span className="mb-3 block font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--ink-faint)]">
          Por qué comprar acá
        </span>
        <h2 className="mb-8 text-[clamp(26px,3.6vw,40px)]">Comprá tranquilo</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {BENEFITS.map((b) => (
            <div key={b.title} className="flex items-start gap-3.5 rounded-[16px] border border-[var(--line)] bg-[var(--canvas)] p-5">
              <div className="grid h-11 w-11 flex-none place-items-center rounded-xl bg-[var(--accent-soft)] text-[var(--accent-2)]">
                <b.icon className="h-[22px] w-[22px]" />
              </div>
              <div>
                <h4 className="mb-1 font-display text-base font-bold">{b.title}</h4>
                <p className="text-[13.5px] leading-relaxed text-[var(--ink-soft)]">{b.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
