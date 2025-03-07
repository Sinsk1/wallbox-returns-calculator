
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { CalculatorInput, DEFAULT_PARAMS, calculateROI, formatCurrency, formatNumber } from '@/utils/calculationUtils';
import ROIResults from './ROIResults';
import { ArrowRight, Zap, CarFront, Euro, Wrench } from 'lucide-react';
import { toast } from 'sonner';

// Define the form schema
const formSchema = z.object({
  kmPerYear: z.number()
    .min(1000, {
      message: "Mindestens 1.000 km pro Jahr.",
    })
    .max(100000, {
      message: "Maximal 100.000 km pro Jahr.",
    }),
  electricityCost: z.number()
    .min(0.1, {
      message: "Mindestens 0,10 € pro kWh.",
    })
    .max(1, {
      message: "Maximal 1,00 € pro kWh.",
    }),
  wallboxCost: z.number()
    .min(500, {
      message: "Mindestens 500 € für die Installation.",
    })
    .max(5000, {
      message: "Maximal 5.000 € für die Installation.",
    }),
  wallboxInstallationCost: z.number()
    .min(500, {
      message: "Mindestens 500 € für die Installation.",
    })
    .max(5000, {
      message: "Maximal 5.000 € für die Installation.",
    }),
});

const ROICalculator: React.FC = () => {
  const [results, setResults] = useState<ReturnType<typeof calculateROI> | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Create form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      kmPerYear: DEFAULT_PARAMS.kmPerYear,
      electricityCost: DEFAULT_PARAMS.electricityCost,
      wallboxCost: DEFAULT_PARAMS.wallboxCost / 2, // Split the cost in half between device and installation
      wallboxInstallationCost: DEFAULT_PARAMS.wallboxCost / 2,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Calculate ROI
      const calculatorInput: CalculatorInput = {
        kmPerYear: values.kmPerYear,
        electricityCost: values.electricityCost,
        wallboxCost: values.wallboxCost + values.wallboxInstallationCost, // Add both costs
      };
      
      const calculationResults = calculateROI(calculatorInput);
      setResults(calculationResults);
      setShowResults(true);
      
      // Show success toast
      toast.success("Berechnung erfolgreich", {
        description: "Ihre persönliche ROI-Analyse ist jetzt verfügbar."
      });
      
      // Scroll to results
      setTimeout(() => {
        document.getElementById('results-section')?.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }, 100);
    } catch (error) {
      console.error("Calculation error:", error);
      toast.error("Fehler bei der Berechnung", {
        description: "Bitte versuchen Sie es erneut."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      <div className="space-y-8">
        {!showResults ? (
          <Card className="glass-card overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-goelektrik/5 to-goelektrik/10 border-b">
              <div className="flex items-center mb-2">
                <div className="bg-goelektrik text-white p-1.5 rounded-md mr-3">
                  <Zap size={20} />
                </div>
                <CardTitle className="text-2xl font-medium text-gray-800">
                  Wallbox ROI-Rechner
                </CardTitle>
              </div>
              <CardDescription className="text-gray-600">
                Berechnen Sie, wie viel Sie mit Ihrer eigenen Wallbox sparen können im Vergleich zum öffentlichen Laden.
              </CardDescription>
            </CardHeader>
            
            <CardContent className="pt-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {/* KM per year */}
                  <FormField
                    control={form.control}
                    name="kmPerYear"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex justify-between items-center">
                          <FormLabel className="text-gray-700 flex items-center">
                            <CarFront className="mr-2" size={18} />
                            Kilometer pro Jahr
                          </FormLabel>
                          <span className="text-sm font-medium">
                            {formatNumber(field.value)} km
                          </span>
                        </div>
                        <FormControl>
                          <Slider
                            defaultValue={[field.value]}
                            max={100000}
                            min={1000}
                            step={1000}
                            onValueChange={(vals) => {
                              field.onChange(vals[0]);
                            }}
                            className="py-4"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Electricity cost */}
                  <FormField
                    control={form.control}
                    name="electricityCost"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex justify-between items-center">
                          <FormLabel className="text-gray-700 flex items-center">
                            <Zap className="mr-2" size={18} />
                            Stromkosten zu Hause
                          </FormLabel>
                          <span className="text-sm font-medium">
                            {field.value.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}/kWh
                          </span>
                        </div>
                        <FormControl>
                          <Slider
                            defaultValue={[field.value]}
                            max={1}
                            min={0.1}
                            step={0.01}
                            onValueChange={(vals) => {
                              field.onChange(vals[0]);
                            }}
                            className="py-4"
                          />
                        </FormControl>
                        <FormDescription className="text-xs">
                          Öffentliches Laden kostet durchschnittlich 0,60 €/kWh.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Wallbox cost */}
                  <FormField
                    control={form.control}
                    name="wallboxCost"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex justify-between items-center">
                          <FormLabel className="text-gray-700 flex items-center">
                            <Euro className="mr-2" size={18} />
                            Kosten der Wallbox
                          </FormLabel>
                          <span className="text-sm font-medium">
                            {field.value.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}
                          </span>
                        </div>
                        <FormControl>
                          <Slider
                            defaultValue={[field.value]}
                            max={3000}
                            min={500}
                            step={100}
                            onValueChange={(vals) => {
                              field.onChange(vals[0]);
                            }}
                            className="py-4"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Wallbox Installation cost */}
                  <FormField
                    control={form.control}
                    name="wallboxInstallationCost"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex justify-between items-center">
                          <FormLabel className="text-gray-700 flex items-center">
                            <Wrench className="mr-2" size={18} />
                            Kosten der Installation
                          </FormLabel>
                          <span className="text-sm font-medium">
                            {field.value.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}
                          </span>
                        </div>
                        <FormControl>
                          <Slider
                            defaultValue={[field.value]}
                            max={3000}
                            min={500}
                            step={100}
                            onValueChange={(vals) => {
                              field.onChange(vals[0]);
                            }}
                            className="py-4"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="mt-8">
                    <Button 
                      type="submit" 
                      className="w-full py-6 bg-goelektrik hover:bg-goelektrik-dark text-white font-medium shadow-lg transition-all duration-300 ease-in-out transform hover:scale-[1.01] hover:shadow-xl"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        "Berechne Ihre Ersparnisse..."
                      ) : (
                        <span className="flex items-center">
                          Jetzt Ihre Ersparnisse berechnen
                          <ArrowRight className="ml-2" />
                        </span>
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
            
            <CardFooter className="bg-gradient-to-r from-goelektrik/5 to-goelektrik/10 border-t py-4">
              <div className="grid grid-cols-3 gap-4 w-full text-center">
                <div>
                  <p className="text-sm font-medium text-gray-800">500+</p>
                  <p className="text-xs text-gray-600">zufriedene Kunden</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">3.5 Mio €</p>
                  <p className="text-xs text-gray-600">Einsparungen</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">4.9/5</p>
                  <p className="text-xs text-gray-600">Kundenbewertung</p>
                </div>
              </div>
            </CardFooter>
          </Card>
        ) : (
          <ROIResults 
            results={results!} 
            userInputs={{
              kmPerYear: form.getValues("kmPerYear"),
              electricityCost: form.getValues("electricityCost"),
              wallboxCost: form.getValues("wallboxCost") + form.getValues("wallboxInstallationCost"),
            }}
            onReset={() => {
              setShowResults(false);
              setResults(null);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default ROICalculator;
