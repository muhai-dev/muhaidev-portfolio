import Message from '../models/Message.js';

export const submitContact = async (req, res) => {
  try {
    const { name, email, message } = req.validatedContact;

    const newMessage = new Message({ name, email, message });
    await newMessage.save();

    res.status(201).json({
      success: true,
      message: 'Message sent successfully. I will get back to you soon.',
    });
  } catch (error) {
    console.error('Contact submission error:', error);
    res.status(500).json({
      error: 'Failed to save message. Please try again later.',
    });
  }
};
