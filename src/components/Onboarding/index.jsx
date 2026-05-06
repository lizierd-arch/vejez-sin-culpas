import { useState } from 'react';
import { Step1Profile } from './Step1Profile';
import { Step2Protocol } from './Step2Protocol';
import { Step3Reminder } from './Step3Reminder';

const STEP_COUNT = 3;

function ProgressDots({ step }) {
  return (
    <div className="flex justify-center gap-2 pt-6 pb-2">
      {Array.from({ length: STEP_COUNT }, (_, i) => (
        <div
          key={i}
          className={`rounded-full transition-all duration-300 ${
            i + 1 === step ? 'w-6 h-2 bg-terracotta' : i + 1 < step ? 'w-2 h-2 bg-terracotta-light' : 'w-2 h-2 bg-border'
          }`}
        />
      ))}
    </div>
  );
}

export function Onboarding({ onComplete }) {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState(null);

  function handleProfile(data) {
    setProfile(data);
    setStep(2);
  }

  function handleProtocol() {
    setStep(3);
  }

  function handleFinish(reminderTime, notifEnabled) {
    const data = { ...profile, reminderTime, notifEnabled, onboardingDone: true };
    localStorage.setItem('vsc_profile', JSON.stringify(data));
    onComplete(data);
  }

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <ProgressDots step={step} />
      <div className="flex-1 px-5 pb-8 flex flex-col max-w-sm mx-auto w-full">
        {step === 1 && <Step1Profile onNext={handleProfile} />}
        {step === 2 && <Step2Protocol petName={profile?.name || 'tu mascota'} onNext={handleProtocol} />}
        {step === 3 && <Step3Reminder petName={profile?.name || 'tu mascota'} onFinish={handleFinish} />}
      </div>
    </div>
  );
}
