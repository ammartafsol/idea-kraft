/**
 * Public demo access for the admin panel. This is a TEST site, so the owner wants anyone to be able to open it.
 *
 * When `true`, the login page shows a one-click "Enter dashboard" button that signs
 * the visitor in as `demoUsername` without a password. The real password is never
 * exposed. Set to `false` to require the normal username + password again.
 */
export const PUBLIC_DEMO_LOGIN = true;

/** The admin account the one-click button signs into (must exist: npm run admin:create). */
export const DEMO_USERNAME = "admin";
