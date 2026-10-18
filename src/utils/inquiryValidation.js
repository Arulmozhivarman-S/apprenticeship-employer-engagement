export const AREAS_OF_INTEREST = [
  'Hosting student apprentices',
  'Program structure and requirements',
  'Cost and budget planning',
  'Mentoring and supervision',
  'Something else',
];

export const MESSAGE_MAX = 1000;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PERSONAL_DOMAINS = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com', 'aol.com', 'proton.me'];

export const EMPTY_INQUIRY = {
  name: '',
  email: '',
  organization: '',
  jobTitle: '',
  area: '',
  message: '',
};

/** Field order used to focus the first invalid field on submit. */
export const INQUIRY_FIELD_ORDER = ['name', 'email', 'organization', 'jobTitle', 'area', 'message'];

/** Returns { fieldName: message } for every invalid field. */
export function validateInquiry(values) {
  const errors = {};
  const name = values.name.trim();
  const email = values.email.trim();
  const organization = values.organization.trim();

  if (!name) errors.name = 'Enter your name.';
  else if (name.length > 100) errors.name = 'Use 100 characters or fewer.';

  if (!email) errors.email = 'Enter your work email.';
  else if (!EMAIL_PATTERN.test(email)) errors.email = 'Enter an email address like name@company.com.';

  if (!organization) errors.organization = 'Enter your organization’s name.';
  else if (organization.length > 150) errors.organization = 'Use 150 characters or fewer.';

  if (values.jobTitle.trim().length > 100) errors.jobTitle = 'Use 100 characters or fewer.';
  if (!AREAS_OF_INTEREST.includes(values.area)) errors.area = 'Choose the area you’d like to discuss.';
  if (values.message.length > MESSAGE_MAX) errors.message = `Use ${MESSAGE_MAX} characters or fewer.`;

  return errors;
}

/** Soft hint (not an error): personal addresses are allowed but flagged. */
export function isLikelyPersonalEmail(email) {
  const domain = email.trim().toLowerCase().split('@')[1];
  return Boolean(domain && PERSONAL_DOMAINS.includes(domain));
}
