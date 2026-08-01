import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ItineraryCarousel from '@/components/itinerario/ItineraryCarousel';

const flyers = [
  { src: '/itinerario/principal.png', alt: 'Flyer Principal', label: 'Mapa General', desc: 'Ruta completa de la competencia' },
  { src: '/itinerario/sp.png', alt: 'Flyer Super Prime', label: 'Súper Especial (Clasificación)', desc: 'Tramo cronometrado inicial' },
  { src: '/itinerario/etapa1.png', alt: 'Flyer Etapa 1', label: 'Etapa 1', desc: 'Primer día de competencia oficial' },
  { src: '/itinerario/etapa2.png', alt: 'Flyer Etapa 2', label: 'Etapa 2', desc: 'Segundo día de rutas de montaña' },
  { src: '/itinerario/etapa3.png', alt: 'Flyer Etapa 3', label: 'Etapa 3', desc: 'Tercer día de competencia' },
  { src: '/itinerario/etapa4.png', alt: 'Flyer Etapa 4', label: 'Etapa 4', desc: 'Cuarto día, tramos técnicos' },
  { src: '/itinerario/etapa5.png', alt: 'Flyer Etapa 5', label: 'Etapa 5', desc: 'Cierre de la vuelta y premiación' }
];

export default function ItinerarioPage() {
  return (
    <div className="flex min-h-screen flex-col font-sans antialiased selection:bg-rally-accent/20">
      <Header />

      <main className="flex-1 flex flex-col items-center p-4 sm:p-8 bg-rally-bg">
        <div className="w-full max-w-4xl">
          <div className="mb-8 text-center sm:text-left">
            <h1 className="text-3xl font-extrabold text-rally-txt tracking-tight uppercase">
              Itinerario Oficial
            </h1>
            <p className="text-rally-muted mt-2">
              Cronograma detallado y mapas de las etapas de la Vuelta a la República.
            </p>
          </div>

          <div className="w-full pb-10">
            <ItineraryCarousel flyers={flyers} />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
