
export const makePhoneCall = (phoneNumber: string) => {
  if (!phoneNumber) {
    console.warn('No phone number provided');
    return;
  }
  
  // Clean the phone number (remove spaces, dashes, etc.)
  const cleanNumber = phoneNumber.replace(/\D/g, '');
  
  // Create the tel: URL
  const telUrl = `tel:${cleanNumber}`;
  
  // Try to initiate the call
  window.location.href = telUrl;
};
