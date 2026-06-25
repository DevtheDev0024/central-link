export type ContactFormPayload = {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
};

type Web3FormsResponse = {
  success: boolean;
  message?: string;
};

const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit';

export async function submitContactForm(payload: ContactFormPayload): Promise<void> {
  const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY;

  if (!accessKey) {
    throw new Error('Contact form is not configured yet. Please try again later.');
  }

  const formData = new FormData();
  formData.append('access_key', accessKey);
  formData.append('name', payload.name);
  formData.append('email', payload.email);
  if (payload.phone?.trim()) {
    formData.append('phone', payload.phone.trim());
  }
  formData.append('subject', `[Central Link TMC] ${payload.subject}`);
  formData.append('message', payload.message);
  formData.append('from_name', 'Central Link Toastmasters Website');
  formData.append('botcheck', '');

  const response = await fetch(WEB3FORMS_ENDPOINT, {
    method: 'POST',
    body: formData,
  });

  const data = (await response.json()) as Web3FormsResponse;

  if (!response.ok || !data.success) {
    throw new Error(data.message ?? 'Unable to send your message. Please try again.');
  }
}
