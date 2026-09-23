import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { WhatsAppFab } from "@/components/site/WhatsAppFab";
import { NegocioJsonLd } from "@/components/site/DatosEstructurados";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <NegocioJsonLd />
      <Header />
      {children}
      <Footer />
      <WhatsAppFab />
    </>
  );
}
