/**
 * Cookie que marca que el usuario ha pedido el correo de recuperar contraseña en este
 * navegador. Así /auth/callback sabe que la vuelta del enlace es para elegir una contraseña
 * nueva y no un login normal.
 */
export const RECOVERY_COOKIE = 'calixo_recovery';
