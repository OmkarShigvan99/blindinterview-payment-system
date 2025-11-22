import { motion } from 'framer-motion';
import { Step } from '@/types/business/purchase';

interface StepIndicatorProps {
    currentStep: Step;
}

const steps: { key: Step; label: string; number: number }[] = [
    { key: 'selection', label: 'Selection', number: 1 },
    { key: 'summary', label: 'Summary', number: 2 },
    { key: 'payment', label: 'Payment', number: 3 },
];

export function StepIndicator({ currentStep }: StepIndicatorProps) {
    const currentStepIndex = steps.findIndex((step) => step.key === currentStep);

    return (
        <div className="flex items-center justify-center mb-8">
            <div className="flex items-center space-x-4">
                {steps.map((step, index) => (
                    <div key={step.key} className="flex items-center">
                        <motion.div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                                currentStep === step.key
                                    ? 'bg-primary text-primary-foreground'
                                    : index < currentStepIndex
                                    ? 'bg-primary/20 text-primary'
                                    : 'bg-muted text-muted-foreground'
                            }`}
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.2 }}
                        >
                            {step.number}
                        </motion.div>
                        {index < steps.length - 1 && (
                            <div
                                className={`w-8 h-0.5 mx-2 transition-colors ${
                                    index < currentStepIndex ? 'bg-primary' : 'bg-muted'
                                }`}
                            />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
