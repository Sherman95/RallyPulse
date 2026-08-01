import React from 'react';
import {
  MapPin,
  Construction,
  Smartphone,
  Clock,
  HardHat,
  Users,
  Sun,
  Car,
  Trash2,
  Eye,
  AlertOctagon,
  Ban,
  ShieldAlert,
  XOctagon,
  ParkingCircleOff,
  BeerOff,
  VolumeX,
  Plane,
  Siren,
  Ambulance,
  CheckCircle2,
  XCircle
} from 'lucide-react';

const recommendations = [
  { icon: MapPin, text: 'Ubícate únicamente en zonas autorizadas para espectadores.' },
  { icon: Construction, text: 'Respeta las cintas de seguridad y señalización. Si un área está delimitada, no ingreses.' },
  { icon: Smartphone, text: 'Consulta los mapas, horarios y comunicados oficiales antes de asistir.' },
  { icon: Clock, text: 'Llega con anticipación. Las vías se cierran antes del inicio de cada tramo.' },
  { icon: HardHat, text: 'Sigue las instrucciones de los oficiales, comisarios y personal de seguridad.' },
  { icon: Users, text: 'Mantén a los menores siempre bajo supervisión y en un lugar seguro.' },
  { icon: Sun, text: 'Lleva agua, gorra, protector solar y ropa adecuada.' },
  { icon: Car, text: 'Estaciona únicamente en lugares permitidos.' },
  { icon: Trash2, text: 'Conserva limpio el entorno y deposita los residuos en lugares adecuados.' },
  { icon: Eye, text: 'Mantén tu atención en la competencia y evita distracciones.' },
];

const warnings = [
  { icon: AlertOctagon, text: 'No cruces la pista mientras el tramo esté habilitado para competencia.' },
  { icon: AlertOctagon, text: 'No permanezcas en zonas marcadas como peligrosas ni sobre la cinta de seguridad.' },
  { icon: ShieldAlert, text: 'No retires, muevas o pases por encima de las cintas de seguridad.' },
  { icon: XOctagon, text: 'No ingreses a áreas restringidas o cerradas por la organización.' },
  { icon: ParkingCircleOff, text: 'No estaciones en curvas, escapatorias, accesos de emergencia o zonas de evacuación.' },
  { icon: BeerOff, text: 'Evita el consumo excesivo de bebidas alcohólicas.' },
  { icon: VolumeX, text: 'No utilices parlantes con volumen alto que impidan escuchar la aproximación de vehículos.' },
  { icon: Plane, text: 'No vueles drones sin autorización de la organización.' },
  { icon: Siren, text: 'No distraigas a los pilotos con luces, láseres, banderas u otros objetos.' },
  { icon: Ambulance, text: 'En caso de incidente, no invadas la pista y permite el acceso de los equipos de rescate.' },
];

export default function SafetyGuidelines() {
  return (
    <section className="w-full py-16 px-4 bg-rally-bg">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-rally-txt tracking-tight uppercase mb-4">
            Guía del Espectador
          </h2>
          <p className="text-rally-muted max-w-2xl mx-auto text-lg">
            Para disfrutar de la Vuelta a la República de manera segura, te pedimos seguir estrictamente las siguientes normativas de convivencia y seguridad.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Tarjeta de Recomendaciones */}
          <div className="bg-rally-surface border border-green-500/30 rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-green-500/10 transition-shadow">
            <h3 className="text-2xl font-bold text-green-600 dark:text-green-400 flex items-center gap-3 mb-6">
              <CheckCircle2 className="w-8 h-8 text-green-500" />
              Recomendaciones
            </h3>
            <ul className="space-y-4">
              {recommendations.map((item, idx) => {
                const IconComponent = item.icon;
                return (
                  <li key={idx} className="flex gap-4 items-start">
                    <IconComponent className="w-6 h-6 text-green-500 shrink-0 mt-0.5" />
                    <p className="text-rally-txt/90 text-sm md:text-base leading-relaxed">
                      {item.text}
                    </p>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Tarjeta de Advertencias */}
          <div className="bg-rally-surface border border-red-500/30 rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-red-500/10 transition-shadow">
            <h3 className="text-2xl font-bold text-red-600 dark:text-red-400 flex items-center gap-3 mb-6">
              <XCircle className="w-8 h-8 text-red-500" />
              Advertencias Prohibidas
            </h3>
            <ul className="space-y-4">
              {warnings.map((item, idx) => {
                const IconComponent = item.icon;
                return (
                  <li key={idx} className="flex gap-4 items-start">
                    <IconComponent className="w-6 h-6 text-red-500 shrink-0 mt-0.5" />
                    <p className="text-rally-txt/90 text-sm md:text-base leading-relaxed">
                      {item.text}
                    </p>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
