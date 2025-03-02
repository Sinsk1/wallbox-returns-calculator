
import React from 'react';
import ROICalculator from '@/components/ROICalculator';
import { Separator } from '@/components/ui/separator';
import { Zap, CarFront, BadgeEuro, Clock } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-goelektrik-soft/20">
      <div className="container px-4 py-12 mx-auto">
        <header className="text-center max-w-3xl mx-auto mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-semibold text-gray-900 mb-4 tracking-tight">
            Wallbox ROI-Rechner
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Berechnen Sie, wie viel Sie mit Ihrer eigenen Wallbox im Vergleich zum öffentlichen Laden sparen können.
          </p>
          <Separator className="max-w-md mx-auto" />
        </header>

        <div className="flex flex-col items-center">
          <div className="w-full max-w-4xl">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12 animate-fade-in-up">
              <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow border">
                <div className="flex items-start">
                  <div className="bg-goelektrik/10 text-goelektrik p-2 rounded-md mr-3">
                    <Zap size={20} />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Energiekosten reduzieren</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Laden Sie zu Hause günstiger als an öffentlichen Stationen.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow border">
                <div className="flex items-start">
                  <div className="bg-goelektrik/10 text-goelektrik p-2 rounded-md mr-3">
                    <CarFront size={20} />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Fahrverhalten optimieren</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Stets ein vollgeladenes Fahrzeug ohne Umwege zu Ladestationen.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow border">
                <div className="flex items-start">
                  <div className="bg-goelektrik/10 text-goelektrik p-2 rounded-md mr-3">
                    <BadgeEuro size={20} />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Investition analysieren</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Berechnen Sie genau, wann sich Ihre Wallbox amortisiert.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow border">
                <div className="flex items-start">
                  <div className="bg-goelektrik/10 text-goelektrik p-2 rounded-md mr-3">
                    <Clock size={20} />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Langfristig planen</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Sehen Sie Ihre Einsparungen über einen Zeitraum von 10 Jahren.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="animate-fade-in-up">
              <ROICalculator />
            </div>
            
            <div className="mt-12 text-center text-sm text-gray-500 animate-fade-in-up">
              <p>© {new Date().getFullYear()} GoElektrik | Wallbox ROI-Rechner | Alle Berechnungen sind Schätzungen basierend auf den eingegebenen Daten.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
