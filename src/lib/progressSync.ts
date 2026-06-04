import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './firebase';
import { UserProgress } from '../types';

export async function fetchUserProgress(uid: string): Promise<UserProgress | null> {
  const docRef = doc(db, 'users', uid);
  try {
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      // Extract UserProgress fields cleanly
      return {
        completedTopics: data.completedTopics || [],
        solvedProblems: data.solvedProblems || [],
        revisionStreak: data.revisionStreak ?? 0,
        lastActiveDate: data.lastActiveDate || new Date().toISOString(),
        weakAreas: data.weakAreas || [],
        revisionStatus: data.revisionStatus || {},
        solvedProblemDates: data.solvedProblemDates || {},
        leetcodeUsername: data.leetcodeUsername || '',
        leetcodeSolvedProblems: data.leetcodeSolvedProblems || {},
        maxAgeDays: data.maxAgeDays !== undefined ? data.maxAgeDays : undefined,
      };
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, `users/${uid}`);
    return null;
  }
}

export async function saveUserProgress(uid: string, email: string, progress: UserProgress): Promise<void> {
  const docRef = doc(db, 'users', uid);
  const payload = {
    uid,
    email,
    completedTopics: progress.completedTopics,
    solvedProblems: progress.solvedProblems,
    revisionStreak: progress.revisionStreak,
    lastActiveDate: progress.lastActiveDate,
    weakAreas: progress.weakAreas,
    revisionStatus: progress.revisionStatus,
    solvedProblemDates: progress.solvedProblemDates || {},
    leetcodeUsername: progress.leetcodeUsername || '',
    leetcodeSolvedProblems: progress.leetcodeSolvedProblems || {},
    maxAgeDays: progress.maxAgeDays !== undefined ? progress.maxAgeDays : null,
  };
  try {
    await setDoc(docRef, payload);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `users/${uid}`);
  }
}
