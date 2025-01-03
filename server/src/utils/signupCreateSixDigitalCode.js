import crypto from 'crypto';

export const signupCreateSixDigitalCode = (res) => {
  try {
    const buffer = crypto.randomBytes(3); // 3 bytes
    const sixDigitalCode = buffer.toString('hex');

    if (!sixDigitalCode) {
      return res.status(404).json({ msg: 'Six-digit code not generated' });
    }

    return sixDigitalCode;
  } catch (error) {
    console.log('Error generating six-digit code:', error);
    res.status(500).json({ msg: 'Internal server error' });
  }
};
