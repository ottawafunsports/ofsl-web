export const POSITION_OPTIONS = [
  { value: '', label: 'Select Position' },
  { value: 'Setter', label: 'Setter' },
  { value: 'Outside Hitter', label: 'Outside Hitter' },
  { value: 'Middle Blocker', label: 'Middle Blocker' },
  { value: 'Opposite Hitter', label: 'Opposite Hitter' },
  { value: 'Libero', label: 'Libero' },
  { value: 'Defensive Specialist', label: 'Defensive Specialist' },
  { value: 'No Preference', label: 'No Preference' }
];

export const INITIAL_PROFILE = {
  name: '',
  phone: '',
  email: '',
  preferred_position: '',
  user_sports_skills: []
};

export const INITIAL_NOTIFICATIONS = {
  emailNotifications: true,
  gameReminders: true,
  leagueUpdates: false,
  paymentReminders: true
};

export const INITIAL_PASSWORD_FORM = {
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
};

export const INITIAL_PASSWORD_VALIDATION = {
  passwordError: null,
  currentPasswordError: null,
  newPasswordError: null,
  confirmPasswordError: null,
  confirmPasswordSuccess: false,
  validatingPassword: false,
  changingPassword: false
};