export enum ErrorMessage {
  // User
  UserNotFound = 'User not found',
  UserAlreadyExists = 'User already exists',

  // Jwt
  InvalidPassword = 'Invalid password',
  InvalidPayload = 'Invalid Payload',
  InvalidCredentials = 'Invalid credentials',

  // Auth
  InvalidEmail = 'Invalid email',
  EmailAlreadyVerified = 'Email already verified',
  InvalidVerificationToken = 'InvalidVerificationToken',
  InvalidRefreshToken = 'InvalidRefreshToken',

  InvalidBrowserConnection = 'Invalid browser connection',

  // resume
  ResumeNotFound = 'Resume not found',
  ResumeIsPrivate = 'Resume is private',
}
