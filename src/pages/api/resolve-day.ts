import { NextApiRequest, NextApiResponse } from 'next';
import { db, auth } from '@/lib/firebaseAdmin';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authorization header missing or malformed' });
    }

    const idToken = authHeader.split(' ')[1];
    const decodedToken = await auth.verifyIdToken(idToken);
    const userId = decodedToken.uid;

    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const goalsRef = db.collection(`users/${userId}/goals`).doc(today);
    const goalsDoc = await goalsRef.get();

    if (!goalsDoc.exists) {
      return res.status(404).json({ message: 'No goals found for today' });
    }

    const goalsData = goalsDoc.data() as { goals: { completed: boolean }[] };
    if (!goalsData.goals || goalsData.goals.length === 0) {
        return res.status(400).json({ message: 'Cannot finish day with no goals set.' });
    }

    const totalGoals = goalsData.goals.length;
    const completedGoals = goalsData.goals.filter(goal => goal.completed).length;
    const missedGoals = totalGoals - completedGoals;

    // Calculate XP
    const userXPIncrease = completedGoals * 10;
    const demonXPIncrease = missedGoals * 5;

    // Fetch current user data
    const userRef = db.collection('users').doc(userId);
    const userDoc = await userRef.get();
    
    const userData = userDoc.exists ? userDoc.data() as { userXP?: number; demonXP?: number; currentStreak?: number; currentForm?: string } : {};

    // Update user data
    const updatedUserXP = (userData.userXP || 0) + userXPIncrease;
    const updatedDemonXP = (userData.demonXP || 0) + demonXPIncrease;
    const updatedStreak = completedGoals > 0 ? (userData.currentStreak || 0) + 1 : 0;

    // Determine demon form
    let currentForm = userData.currentForm || 'basic';
    if (updatedDemonXP >= 200) {
      currentForm = 'greater';
    } else if (updatedDemonXP >= 100) {
      currentForm = 'evolved';
    }

    await userRef.set({
      userXP: updatedUserXP,
      demonXP: updatedDemonXP,
      currentStreak: updatedStreak,
      currentForm: currentForm,
    }, { merge: true });

    // Generate message
    let message = '';
    if (completedGoals === totalGoals && totalGoals > 0) {
      message = "You've crushed your goals today! Your Procrastinemon is pleased.";
    } else if (missedGoals === totalGoals) {
      message = "All goals missed. Your demon has grown stronger from your procrastination.";
    } else if (completedGoals > missedGoals) {
        message = `Well done! You completed ${completedGoals} goals. Your demon is a little weaker today.`;
    } else {
        message = `You completed ${completedGoals} goals but missed ${missedGoals}. Your demon is gaining power...`;
    }


    res.status(200).json({
      stats: {
        userXP: updatedUserXP,
        demonXP: updatedDemonXP,
        currentStreak: updatedStreak,
        currentForm: currentForm,
      },
      message: message,
    });

  } catch (error) {
    console.error('Error resolving day:', error);
    const err = error as {code?: string};
    if (err.code === 'auth/id-token-expired') {
        res.status(401).json({ message: 'ID token expired. Please reauthenticate.' });
    } else if (err.code === 'auth/argument-error') {
        res.status(401).json({ message: 'Invalid ID token.' });
    }
     else {
        res.status(500).json({ message: 'Internal Server Error' });
    }
  }
}
