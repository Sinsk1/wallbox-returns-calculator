
import React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Send } from 'lucide-react';
import { toast } from 'sonner';

const formSchema = z.object({
  email: z.string().email({
    message: "Bitte geben Sie eine gültige E-Mail-Adresse ein.",
  }),
});

interface EmailFormProps {
  onSubmit: (email: string) => void;
  isSending: boolean;
}

const EmailForm: React.FC<EmailFormProps> = ({ onSubmit, isSending }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    onSubmit(values.email);
  };

  return (
    <Card className="glass-card w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-xl font-medium flex items-center">
          <Mail className="mr-2" size={20} />
          Erhalten Sie Ihre Analyse
        </CardTitle>
        <CardDescription>
          Geben Sie Ihre E-Mail-Adresse an, um Ihre persönliche ROI-Analyse zu erhalten.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-Mail</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="ihre.email@beispiel.de" 
                      type="email" 
                      {...field} 
                      className="input-transition focus:border-wallbox" 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button 
              type="submit" 
              className="w-full bg-wallbox hover:bg-wallbox-dark"
              disabled={isSending}
            >
              {isSending ? (
                "Wird gesendet..."
              ) : (
                <span className="flex items-center justify-center">
                  PDF senden
                  <Send className="ml-2" size={16} />
                </span>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-center pt-0">
        <p className="text-xs text-gray-500 text-center">
          Wir respektieren Ihre Privatsphäre und verwenden Ihre E-Mail nur zum Versand der angeforderten Informationen.
        </p>
      </CardFooter>
    </Card>
  );
};

export default EmailForm;
