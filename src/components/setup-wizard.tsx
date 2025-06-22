// src/app/setup-wizard/page.tsx
'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import confetti from 'canvas-confetti';

import { StepProgressBar } from '@/components/setup-wizard/StepProgressBar';
import { WelcomeStep } from '@/components/setup-wizard/welcome';
import { CountryCityStep, Step1Data } from '@/components/setup-wizard/countrycity';
import { BusinessInfoStep, Step2Data } from '@/components/setup-wizard/businessinfo';
import { UserInfoStep, StepUserData } from '@/components/setup-wizard/userinfo';
import { PopInfoStep, Step3Data } from '@/components/setup-wizard/popinfo';
import { IPInfoStep, Step4Data } from '@/components/setup-wizard/ipinfo';
import { NASInfoStep, Step5Data } from '@/components/setup-wizard/nasinfo';

export default function SetupWizardPage() {
  const router = useRouter();
  const totalSteps = 6;

  const [currentStep, setCurrentStep] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(false);
  const [showFinalScreen, setShowFinalScreen] = React.useState(false);

  const [step1Data, setStep1Data] = React.useState<Step1Data>();
  const [step2Data, setStep2Data] = React.useState<Step2Data>();
  const [stepUserData, setStepUserData] = React.useState<StepUserData>();
  const [step3Data, setStep3Data] = React.useState<Step3Data>();
  const [step4Data, setStep4Data] = React.useState<Step4Data>();
  const [step5Data, setStep5Data] = React.useState<Step5Data>();

  const stepLabels = [
    'Location',
    'Business Info',
    'Admin User',
    'PoP Info',
    'IP Info',
    'NAS Info',
  ];

  React.useEffect(() => {
    const complete = localStorage.getItem('setupComplete');
    const savedStep = localStorage.getItem('setupStep');
    if (!complete && savedStep !== null) setCurrentStep(Number(savedStep));
    else setCurrentStep(0);

    try {
      const s1 = localStorage.getItem('setupStep1');
      const s2 = localStorage.getItem('setupStep2');
      const su = localStorage.getItem('setupStepUser');
      const s3 = localStorage.getItem('setupStep3');
      const s4 = localStorage.getItem('setupStep4');
      const s5 = localStorage.getItem('setupStep5');
      if (s1) setStep1Data(JSON.parse(s1));
      if (s2) setStep2Data(JSON.parse(s2));
      if (su) setStepUserData(JSON.parse(su));
      if (s3) setStep3Data(JSON.parse(s3));
      if (s4) setStep4Data(JSON.parse(s4));
      if (s5) setStep5Data(JSON.parse(s5));
    } catch (err) {
      console.error('Failed to parse setup data:', err);
    }
  }, []);

  const delayedNext = () => {
    setIsLoading(true);
    setTimeout(() => {
      const newStep = Math.min(currentStep + 1, totalSteps);
      setCurrentStep(newStep);
      localStorage.setItem('setupStep', newStep.toString());
      setIsLoading(false);
    }, 500);
  };

  const delayedPrev = () => {
    setIsLoading(true);
    setTimeout(() => {
      const newStep = Math.max(currentStep - 1, 0);
      setCurrentStep(newStep);
      localStorage.setItem('setupStep', newStep.toString());
      setIsLoading(false);
    }, 300);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <WelcomeStep onNext={delayedNext} />;
      case 1:
        return (
          <CountryCityStep
            defaultValues={step1Data}
            onBack={delayedPrev}
            onNext={(data) => {
              setStep1Data(data);
              localStorage.setItem('setupStep1', JSON.stringify(data));
              delayedNext();
            }}
            tenantId="prolter"
          />
        );
      case 2:
        return (
          <BusinessInfoStep
            defaultValues={step2Data}
            onBack={delayedPrev}
            onNext={(data) => {
              setStep2Data(data);
              localStorage.setItem('setupStep2', JSON.stringify(data));
              delayedNext();
            }}
          />
        );
      case 3:
        return (
          <UserInfoStep
            defaultValues={stepUserData}
            onBack={delayedPrev}
            onNext={(data) => {
              setStepUserData(data);
              localStorage.setItem('setupStepUser', JSON.stringify(data));
              delayedNext();
            }}
            tenantId="prolter"
          />
        );
      case 4:
        return (
          <PopInfoStep
            defaultValues={step3Data}
            onBack={delayedPrev}
            onNext={(data) => {
              setStep3Data(data);
              localStorage.setItem('setupStep3', JSON.stringify(data));
              delayedNext();
            }}
          />
        );
      case 5:
        return (
          <IPInfoStep
            defaultValues={step4Data}
            onBack={delayedPrev}
            onNext={(data) => {
              setStep4Data(data);
              localStorage.setItem('setupStep4', JSON.stringify(data));
              delayedNext();
            }}
          />
        );
      case 6:
        return (
          <NASInfoStep
            defaultValues={step5Data}
            onBack={delayedPrev}
            onFinish={(data) => {
              setStep5Data(data);
              localStorage.setItem('setupStep5', JSON.stringify(data));
              localStorage.setItem('setupComplete', 'true');

              [
                'setupStep',
                'setupStep1',
                'setupStep2',
                'setupStepUser',
                'setupStep3',
                'setupStep4',
                'setupStep5',
              ].forEach((key) => localStorage.removeItem(key));

              confetti({ particleCount: 150, spread: 100, origin: { y: 0.6 } });
              setShowFinalScreen(true);
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-4 pt-8">
      <div className="w-full max-w-2xl border border-[#fca311] rounded-lg shadow-xl bg-card">
        <Card className="border-none shadow-none bg-transparent">
          {!showFinalScreen && currentStep > 0 && (
            <StepProgressBar currentStep={currentStep} labels={stepLabels} />
          )}

          <CardContent>
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div
                  key="loading"
                  className="flex justify-center items-center h-48"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Loader2 className="h-6 w-6 animate-spin text-yellow-500" />
                </motion.div>
              ) : showFinalScreen ? (
                <motion.div
                  key="final"
                  className="text-center py-16"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <h2 className="text-2xl font-bold text-yellow-500 mb-4">🎉 Setup Complete!</h2>
                  <p className="text-muted-foreground mb-6">Your Prolter system is ready to use.</p>
                  <button
                    onClick={() => router.push('/app')}
                    className="bg-yellow-500 text-black font-semibold py-2 px-6 rounded hover:bg-yellow-400 transition"
                  >
                    Go to Prolter
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.4 }}
                >
                  {renderStep()}
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
