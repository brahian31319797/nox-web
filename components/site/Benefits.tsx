import { CoinsIcon, ShieldIcon, TruckIcon } from "@/components/site/icons";

/**
 * Los tres diferenciales reales del manual de marca §4, escritos como los diría
 * Brahian. `money` marca el que habla de plata a favor del cliente: ese va en
 * verde, el color que le estamos enseñando a asociar con "esto me conviene".
 */
const BENEFITS = [
  {
    icon: TruckIcon,
    title: "Envío a todo el país",
    desc: "Lo coordinamos con vos y te decimos el plazo real antes de que pagues nada.",
    money: false,
  },
  {
    icon: CoinsIcon,
    title: "Pagás 50% y el resto al recibir",
    desc: "Reservás con la mitad. El saldo, cuando lo tenés en la mano y lo probaste.",
    money: true,
  },
  {
    icon: ShieldIcon,
    title: "Te atiende Brahian, no un bot",
    desc: "Le escribís y te contesta él. Si el modelo que elegiste no te sirve, te lo dice.",
    money: false,
  },
];

export function Benefits() {
  return (
    <section className="border-y border-[var(--line)] bg-[var(--surface)] px-5 py-14">
      <div className="mx-auto max-w-[1180px]">
        <span className="mb-3 block font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--ink-faint)]">
          Por qué comprarle a él
        </span>
        <h2 className="mb-8 text-[clamp(26px,3.6vw,40px)]">Comprá tranquilo</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {BENEFITS.map((b) => (
            <div
              key={b.title}
              className={`flex items-start gap-3.5 rounded-[16px] border bg-[var(--canvas)] p-5 ${
                b.money ? "border-[var(--money-line)]" : "border-[var(--line)]"
              }`}
            >
              <div
                className={`grid h-11 w-11 flex-none place-items-center rounded-xl ${
                  b.money
                    ? "bg-[var(--money-soft)] text-[var(--money)]"
                    : "bg-[var(--accent-soft)] text-[var(--accent-2)]"
                }`}
              >
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
