import { useState } from 'react';
import { useUserStore } from '@/stores/userStore';
import { Navigate, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { Toaster } from '@/components/ui/sonner';
import { FileUp, User, Camera, CheckCircle } from 'lucide-react';
const steps = [
  { id: 1, title: 'Identity Document', icon: <User className="h-5 w-5" /> },
  { id: 2, title: 'Selfie Upload', icon: <Camera className="h-5 w-5" /> },
  { id: 3, title: 'Verification Complete', icon: <CheckCircle className="h-5 w-5" /> },
];
export function KycPage() {
  const user = useUserStore((s) => s.user);
  const updateKycStatus = useUserStore((s) => s.updateKycStatus);
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [idFile, setIdFile] = useState<File | null>(null);
  const [selfieFile, setSelfieFile] = useState<File | null>(null);
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  if (user.kycStatus === 'verified') {
    return <Navigate to="/profile" replace />;
  }
  const progress = ((currentStep - 1) / (steps.length - 1)) * 100;
  const handleNextStep = () => {
    if (currentStep === 1 && !idFile) {
      toast.error('Please select a file for your ID document.');
      return;
    }
    if (currentStep === 2 && !selfieFile) {
      toast.error('Please select a file for your selfie.');
      return;
    }
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };
  const handleVerification = () => {
    toast.info('Verification in progress...', {
      description: 'This will take a few seconds.',
    });
    setTimeout(() => {
      updateKycStatus('verified');
      toast.success('KYC Verification Successful!', {
        description: 'You can now trade on the marketplace.',
      });
      setTimeout(() => navigate('/profile'), 2000);
    }, 2500);
  };
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <>
            <CardHeader>
              <CardTitle>Upload Identity Document</CardTitle>
              <CardDescription>Please upload a clear image of your government-issued ID (e.g., Passport, Driver's License).</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Label htmlFor="id-document">ID Document</Label>
              <div className="flex items-center space-x-2">
                <Input id="id-document" type="file" onChange={(e) => setIdFile(e.target.files?.[0] || null)} />
                <FileUp className="h-5 w-5 text-muted-foreground" />
              </div>
              {idFile && <p className="text-sm text-muted-foreground">Selected: {idFile.name}</p>}
            </CardContent>
            <CardFooter>
              <Button onClick={handleNextStep}>Next</Button>
            </CardFooter>
          </>
        );
      case 2:
        return (
          <>
            <CardHeader>
              <CardTitle>Upload a Selfie</CardTitle>
              <CardDescription>Please upload a clear, recent selfie. Make sure your face is well-lit.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Label htmlFor="selfie">Selfie</Label>
              <div className="flex items-center space-x-2">
                <Input id="selfie" type="file" onChange={(e) => setSelfieFile(e.target.files?.[0] || null)} />
                <Camera className="h-5 w-5 text-muted-foreground" />
              </div>
              {selfieFile && <p className="text-sm text-muted-foreground">Selected: {selfieFile.name}</p>}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setCurrentStep(currentStep - 1)}>Back</Button>
              <Button onClick={handleVerification}>Submit for Verification</Button>
            </CardFooter>
          </>
        );
      case 3:
        return (
          <CardContent className="flex flex-col items-center justify-center text-center pt-12">
            <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
            <CardTitle className="text-2xl">Verification Submitted</CardTitle>
            <CardDescription className="mt-2 max-w-sm">Your documents have been submitted. You will be notified once the verification process is complete.</CardDescription>
          </CardContent>
        );
      default:
        return null;
    }
  };
  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-16 md:py-24 flex flex-col items-center">
          <header className="text-center mb-12">
            <h1 className="text-4xl font-bold font-display text-foreground">KYC Verification</h1>
            <p className="mt-2 text-lg text-muted-foreground">Secure your account to start trading.</p>
          </header>
          <div className="w-full max-w-2xl">
            <div className="mb-8">
              <Progress value={progress} className="w-full" />
              <div className="flex justify-between mt-2">
                {steps.map((step) => (
                  <div key={step.id} className={`flex items-center gap-2 text-sm ${currentStep >= step.id ? 'text-primary font-semibold' : 'text-muted-foreground'}`}>
                    {step.icon}
                    <span>{step.title}</span>
                  </div>
                ))}
              </div>
            </div>
            <Card>{renderStepContent()}</Card>
          </div>
        </div>
      </div>
      <Toaster richColors />
    </>
  );
}