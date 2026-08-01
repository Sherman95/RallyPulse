import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { CategoryBadge } from '@/components/ui/CategoryBadge';

interface Inscrito {
  ordenSalida: string;
  numero: string;
  categoria: string;
  marca: string;
  modelo: string;
  piloto: string;
  ciudadPiloto: string;
  pilotoAlternante: string;
  ciudadPilotoAlternante: string;
  copiloto: string;
  ciudadCopiloto: string;
  copilotoAlternante: string;
  ciudadCopilotoAlternante: string;
  horaSalida: string;
}

export default async function InscritosPage() {
  // Leer CSV en el servidor
  const csvPath = path.join(process.cwd(), 'data', 'Vuelta_al_Ecuador_2026_Lista_Completa.csv');
  const csvText = fs.readFileSync(csvPath, 'utf8');

  const { data } = Papa.parse<any>(csvText, {
    header: true,
    skipEmptyLines: true,
  });

  // Mapear, omitir si falta info vital, y ordenar por número (o categoría)
  let inscritos = data
    .map((row) => ({
      ordenSalida: row.Orden_Salida?.trim() || '',
      numero: row.Numero?.trim() || '',
      categoria: row.Categoria?.trim() || '',
      marca: row.Marca?.trim() || '',
      modelo: row.Modelo?.trim() || '',
      piloto: row.Piloto?.trim() || '',
      ciudadPiloto: row.Ciudad_Piloto?.trim() || '',
      pilotoAlternante: row.Piloto_Alternante?.trim() || '',
      ciudadPilotoAlternante: row.Ciudad_Piloto_Alternante?.trim() || '',
      copiloto: row.Copiloto?.trim() || '',
      ciudadCopiloto: row.Ciudad_Copiloto?.trim() || '',
      copilotoAlternante: row.Copiloto_Alternante?.trim() || '',
      ciudadCopilotoAlternante: row.Ciudad_Copiloto_Alternante?.trim() || '',
      horaSalida: row.Hora_Salida?.trim() || '',
    }))
    .filter((row) => row.numero !== '');

  // Ordenar por número
  inscritos.sort((a, b) => {
    const numA = parseInt(a.numero, 10);
    const numB = parseInt(b.numero, 10);
    return numA - numB;
  });

  return (
    <div className="flex min-h-screen flex-col font-sans antialiased selection:bg-rally-accent/20">
      <Header />
      
      <main className="flex-1 flex flex-col items-center p-4 sm:p-8 bg-rally-bg">
        <div className="w-full max-w-5xl">
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-rally-txt tracking-tight uppercase">
              Lista de Inscritos
            </h1>
            <p className="text-rally-muted mt-2">
              Pilotos y navegantes oficiales para la Vuelta a la República.
            </p>
          </div>

          <div className="bg-rally-surface border border-rally-border rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-black/5 dark:bg-white/5 text-[11px] uppercase tracking-wider text-rally-muted border-b border-rally-border">
                    <th className="px-4 py-3 font-semibold text-center w-16">N°</th>
                    <th className="px-4 py-3 font-semibold">Equipo</th>
                    <th className="px-4 py-3 font-semibold">Categoría</th>
                    <th className="px-4 py-3 font-semibold">Vehículo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-rally-border">
                  {inscritos.map((inscrito, idx) => (
                    <tr key={idx} className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors">
                      <td className="px-4 py-4 text-center">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded bg-rally-accent/10 text-rally-accent font-bold font-mono text-sm border border-rally-accent/20">
                          {inscrito.numero}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex flex-col gap-2">
                          <div className="flex flex-col gap-0.5">
                            <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2">
                              <span className="text-sm font-bold text-rally-txt leading-none">{inscrito.piloto}</span>
                              {inscrito.ciudadPiloto && (
                                <span className="text-[10px] text-rally-muted uppercase bg-rally-txt/5 px-1.5 py-0.5 rounded-sm w-max">
                                  {inscrito.ciudadPiloto}
                                </span>
                              )}
                            </div>
                            {inscrito.pilotoAlternante && (
                              <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2">
                                <span className="text-xs text-rally-muted leading-none">Alt: {inscrito.pilotoAlternante}</span>
                                {inscrito.ciudadPilotoAlternante && (
                                  <span className="text-[10px] text-rally-muted/70 uppercase w-max">({inscrito.ciudadPilotoAlternante})</span>
                                )}
                              </div>
                            )}
                          </div>

                          <div className="flex flex-col gap-0.5">
                            {inscrito.copiloto && (
                              <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2">
                                <span className="text-xs text-rally-muted leading-none">Cop: {inscrito.copiloto}</span>
                                {inscrito.ciudadCopiloto && (
                                  <span className="text-[10px] text-rally-muted/70 uppercase w-max">
                                    ({inscrito.ciudadCopiloto})
                                  </span>
                                )}
                              </div>
                            )}
                            {inscrito.copilotoAlternante && (
                              <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2">
                                <span className="text-xs text-rally-muted leading-none">Alt: {inscrito.copilotoAlternante}</span>
                                {inscrito.ciudadCopilotoAlternante && (
                                  <span className="text-[10px] text-rally-muted/70 uppercase w-max">({inscrito.ciudadCopilotoAlternante})</span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <CategoryBadge cat={inscrito.categoria} />
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-sm font-medium text-rally-txt">
                          {inscrito.marca} {inscrito.modelo}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {inscritos.length === 0 && (
              <div className="p-12 text-center text-rally-muted">
                No hay inscritos disponibles en este momento.
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
