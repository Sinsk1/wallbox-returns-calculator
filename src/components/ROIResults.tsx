
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { 
  CalculatorResult, 
  formatCurrency,
  formatPercentage, 
  formatNumber 
} from '@/utils/calculationUtils';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { RefreshCcw, Zap, CheckCircle, InfoIcon, TrendingUp, Euro, Printer, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

interface ROIResultsProps {
  results: CalculatorResult;
  userInputs: {
    kmPerYear: number;
    electricityCost: number;
    wallboxCost: number;
  };
  onReset: () => void;
}

const ROIResults: React.FC<ROIResultsProps> = ({ results, userInputs, onReset }) => {
  const [activeTab, setActiveTab] = useState('chart');
  const [chartData, setChartData] = useState<any[]>([]);
  const [animateChart, setAnimateChart] = useState(false);

  useEffect(() => {
    const data = results.yearsData.map((year, index) => ({
      name: `Jahr ${year}`,
      'Heimladen (kumulativ)': results.homeCosts[index],
      'Öffentliches Laden (kumulativ)': results.publicCosts[index],
      'Ersparnis (kumulativ)': results.cumulativeSavings[index],
    }));
    
    setChartData(data);
    
    setTimeout(() => {
      setAnimateChart(true);
    }, 300);
  }, [results]);

  const handlePrint = () => {
    window.print();
    toast.success("Druckvorgang gestartet", {
      description: "Die Seite wird zum Drucken vorbereitet."
    });
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="tooltip-custom">
          <p className="font-medium">{label}</p>
          <div className="mt-2 space-y-1">
            {payload.map((entry: any, index: number) => (
              <p key={`item-${index}`} style={{ color: entry.color }}>
                {entry.name}: {formatCurrency(entry.value)}
              </p>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div id="results-section" className="space-y-8 animate-fade-in-up">
      <Card className="glass-card overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-goelektrik/5 to-goelektrik/10 border-b">
          <div className="flex items-center mb-2">
            <div className="bg-goelektrik text-white p-1.5 rounded-md mr-3">
              <TrendingUp size={20} />
            </div>
            <CardTitle className="text-2xl font-medium text-gray-800">
              Ihre persönliche Wirtschaftlichkeitsanalyse
            </CardTitle>
          </div>
          <CardDescription className="text-gray-600">
            Basierend auf Ihren Eingaben haben wir berechnet, wie viel Sie mit einer eigenen Wallbox sparen können.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pt-6 pb-4">
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            <div className="bg-goelektrik/5 p-4 rounded-lg border border-goelektrik/20">
              <div className="flex items-center">
                <div className="bg-goelektrik/10 text-goelektrik p-2 rounded-md mr-3">
                  <Euro size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Jährliche Ersparnis</p>
                  <p className="text-xl font-semibold text-gray-800">
                    {formatCurrency(results.savingsPerYear)}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-goelektrik/5 p-4 rounded-lg border border-goelektrik/20">
              <div className="flex items-center">
                <div className="bg-goelektrik/10 text-goelektrik p-2 rounded-md mr-3">
                  <Euro size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Monatliche Ersparnis</p>
                  <p className="text-xl font-semibold text-gray-800">
                    {formatCurrency(results.savingsPerMonth)}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-goelektrik/5 p-4 rounded-lg border border-goelektrik/20">
              <div className="flex items-center">
                <div className="bg-goelektrik/10 text-goelektrik p-2 rounded-md mr-3">
                  <Zap size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Amortisationszeit</p>
                  <p className="text-xl font-semibold text-gray-800">
                    {results.breakEvenYear.toFixed(1)} Jahre
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-goelektrik/5 p-4 rounded-lg border border-goelektrik/20">
              <div className="flex items-center">
                <div className="bg-goelektrik/10 text-goelektrik p-2 rounded-md mr-3">
                  <TrendingUp size={20} />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Einsparung in 10 Jahren</p>
                  <p className="text-xl font-semibold text-gray-800">
                    {formatCurrency(results.totalSavings)}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <Tabs defaultValue="chart" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 mb-6">
              <TabsTrigger value="chart">Grafische Darstellung</TabsTrigger>
              <TabsTrigger value="table">Detaillierte Tabelle</TabsTrigger>
            </TabsList>
            
            <TabsContent value="chart" className="space-y-4">
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={chartData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    className={`transition-opacity duration-700 ${animateChart ? 'opacity-100' : 'opacity-0'}`}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis 
                      tickFormatter={(value) => value.toLocaleString('de-DE') + ' €'}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <ReferenceLine 
                      y={0} 
                      stroke="#000" 
                      strokeDasharray="3 3" 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="Heimladen (kumulativ)" 
                      stackId="1" 
                      stroke="#0c585e" 
                      fill="#0c585e" 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="Öffentliches Laden (kumulativ)" 
                      stackId="2" 
                      stroke="#084245" 
                      fill="#084245" 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="Ersparnis (kumulativ)" 
                      stackId="3" 
                      stroke="#15989f" 
                      fill="#15989f" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              
              <div className="flex flex-col md:flex-row gap-4 pt-2">
                <div className="flex-1 bg-goelektrik-soft p-4 rounded-lg border border-goelektrik-light">
                  <h4 className="font-medium text-goelektrik-tertiary flex items-center">
                    <InfoIcon size={16} className="mr-2" />
                    Wichtige Erkenntnis
                  </h4>
                  <p className="text-sm text-goelektrik-secondary mt-1">
                    Nach {results.breakEvenYear.toFixed(1)} Jahren haben Sie die Kosten Ihrer Wallbox-Installation wieder eingespielt und sparen danach {formatCurrency(results.savingsPerYear)} jährlich ({formatCurrency(results.savingsPerMonth)} monatlich).
                  </p>
                </div>
                <div className="flex-1 bg-green-50 p-4 rounded-lg border border-green-100">
                  <h4 className="font-medium text-green-800 flex items-center">
                    <CheckCircle size={16} className="mr-2" />
                    Gesamtersparnis
                  </h4>
                  <p className="text-sm text-green-700 mt-1">
                    Nach 10 Jahren haben Sie insgesamt {formatCurrency(results.totalSavings)} gespart - das entspricht {formatPercentage(Math.abs(results.totalSavings / userInputs.wallboxCost))} Ihrer ursprünglichen Investition.
                  </p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="table">
              <div className="overflow-auto max-h-[350px] border rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Jahr
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Kosten Heimladen
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Kosten öffentliches Laden
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Jährliche Ersparnis
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Kumulative Ersparnis
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {results.yearsData.map((year, index) => (
                      <tr key={year} className={index % 2 === 0 ? 'bg-white' : 'bg-goelektrik-soft/30'}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          Jahr {year}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatCurrency(results.homeCosts[index] / year)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatCurrency(results.publicCosts[index] / year)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatCurrency(results.savingsPerYear)}
                        </td>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                          results.cumulativeSavings[index] < 0 ? 'text-red-600' : 'text-goelektrik-vivid'
                        }`}>
                          {formatCurrency(results.cumulativeSavings[index])}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="mt-4 text-sm text-gray-600">
                <p className="flex items-center">
                  <InfoIcon size={16} className="mr-2 text-goelektrik" />
                  Die Tabelle zeigt Ihre Einsparungen über 10 Jahre, wobei die anfänglichen Kosten der Wallbox-Installation berücksichtigt werden.
                </p>
              </div>
            </TabsContent>
          </Tabs>
          
          <Separator className="my-6" />
          
          <div className="bg-gray-50 p-4 rounded-lg border mb-4">
            <h3 className="font-medium text-gray-800 mb-2">Nicht verpassen: Sichern Sie sich diese Einsparungen</h3>
            <p className="text-sm text-gray-600 mb-4">
              Möchten Sie Ihre persönliche Analyse ausdrucken und mit nach Hause nehmen? Nutzen Sie die untenstehende Option:
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button 
                variant="outline" 
                className="flex items-center justify-center border-goelektrik text-goelektrik hover:bg-goelektrik hover:text-white"
                onClick={handlePrint}
              >
                <Printer className="mr-2" size={18} />
                Analyse drucken
              </Button>
              
              <Button 
                className="flex items-center justify-center bg-goelektrik text-white hover:bg-goelektrik-dark"
                onClick={() => window.open('https://www.goelektrik.de/?utm_source=rechner&utm_medium=website&utm_campaign=wallbox', '_blank')}
              >
                <ExternalLink className="mr-2" size={18} />
                Jetzt Wallbox installieren
              </Button>
            </div>
          </div>
          
          <div className="rounded-lg bg-gradient-to-r from-goelektrik-light/20 to-goelektrik/20 p-5 border border-goelektrik/20">
            <h3 className="font-medium text-gray-800 mb-2 flex items-center">
              <Zap className="mr-2 text-goelektrik" size={18} />
              Handlungsempfehlung
            </h3>
            <p className="text-sm text-gray-700">
              Basierend auf Ihrer Analyse empfehlen wir dringend die Installation einer Wallbox. 
              Sie sparen nicht nur {formatCurrency(results.savingsPerYear)} jährlich ({formatCurrency(results.savingsPerMonth)} monatlich), sondern profitieren auch von:
            </p>
            <ul className="mt-2 space-y-1 text-sm">
              <li className="flex items-start">
                <CheckCircle className="mr-2 mt-0.5 text-goelektrik" size={16} />
                <span>Bequemes Laden zu Hause ohne Suche nach öffentlichen Ladestationen</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="mr-2 mt-0.5 text-goelektrik" size={16} />
                <span>Schutz Ihres Fahrzeugs vor möglichen Beschädigungen an öffentlichen Ladesäulen</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="mr-2 mt-0.5 text-goelektrik" size={16} />
                <span>Staatliche Förderungen, die die Amortisationszeit weiter verkürzen können</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="mr-2 mt-0.5 text-goelektrik" size={16} />
                <span>Wertsteigerung Ihrer Immobilie durch zukunftsfähige Ladeinfrastruktur</span>
              </li>
            </ul>
          </div>
        </CardContent>
        
        <CardFooter className="flex flex-col sm:flex-row items-center justify-between bg-gradient-to-r from-goelektrik/5 to-goelektrik/10 border-t p-4">
          <Button 
            variant="outline" 
            size="sm" 
            className="mb-3 sm:mb-0 flex items-center text-gray-600 border-gray-300"
            onClick={onReset}
          >
            <RefreshCcw size={16} className="mr-2" />
            Neue Berechnung
          </Button>
          
          <HoverCard>
            <HoverCardTrigger asChild>
              <p className="text-xs text-gray-500 cursor-help flex items-center">
                <InfoIcon size={14} className="mr-1" />
                Berechnungsgrundlage
              </p>
            </HoverCardTrigger>
            <HoverCardContent className="w-80">
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Berechnungsmethodik</h4>
                <p className="text-xs text-gray-600">Die Berechnung basiert auf einem Vergleich zwischen Heimladen und öffentlichem Laden mit folgenden Annahmen:</p>
                <ul className="text-xs text-gray-600 list-disc pl-4 space-y-1">
                  <li>Verbrauch von 0,2 kWh/km (durchschnittlicher EV-Verbrauch)</li>
                  <li>Öffentliches Laden kostet 0,60 €/kWh</li>
                  <li>Lebensdauer der Wallbox: 10+ Jahre</li>
                  <li>Keine Berücksichtigung von Inflation oder Strompreissteigerungen</li>
                </ul>
              </div>
            </HoverCardContent>
          </HoverCard>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ROIResults;
