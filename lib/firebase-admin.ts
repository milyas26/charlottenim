import { initializeApp, getApps, cert, type ServiceAccount, type App } from "firebase-admin/app"
import { getAuth, type Auth } from "firebase-admin/auth"

let _adminApp: App | null = null
let _adminAuth: Auth | null = null

function getServiceAccount(): ServiceAccount {
  if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    return JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY) as ServiceAccount
  }
  return {
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  } as ServiceAccount
}

function getAdminApp(): App {
  if (!_adminApp) {
    _adminApp = getApps().length
      ? getApps()[0]
      : initializeApp({ credential: cert(getServiceAccount()) })
  }
  return _adminApp
}

function getAdminAuth(): Auth {
  if (!_adminAuth) {
    _adminAuth = getAuth(getAdminApp())
  }
  return _adminAuth
}

export { getAdminAuth }
