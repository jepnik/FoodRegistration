// File: src/components/PasswordStrengthMeter.tsx

import React from 'react';
import zxcvbn from 'zxcvbn';
import { ProgressBar, Form } from 'react-bootstrap';

interface PasswordStrengthMeterProps {
  password: string;
}

const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({ password }) => {
  const testResult = zxcvbn(password);
  const num = (testResult.score * 100) / 4;

  const createPassLabel = () => {
    switch (testResult.score) {
      case 0:
        return 'Very Weak';
      case 1:
        return 'Weak';
      case 2:
        return 'Fair';
      case 3:
        return 'Good';
      case 4:
        return 'Strong';
      default:
        return '';
    }
  };

  const progressColor = () => {
    switch (testResult.score) {
      case 0:
        return 'danger';
      case 1:
        return 'danger';
      case 2:
        return 'warning';
      case 3:
        return 'info';
      case 4:
        return 'success';
      default:
        return 'danger';
    }
  };

  return (
    <div className="password-strength-meter mt-2">
      <ProgressBar
        now={password ? num : 0}
        variant={password ? progressColor() : 'secondary'}
        animated={password && testResult.score > 0}
        striped={password && testResult.score > 0}
      />
      <Form.Text className="text-muted text-center">
        {password ? createPassLabel() : 'Enter password to see strength'}
      </Form.Text>
    </div>
  );
};

export default PasswordStrengthMeter;
