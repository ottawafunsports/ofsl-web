
export const INITIAL_PROFILE = {
  name: '',
  phone: '',
  email: '',
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