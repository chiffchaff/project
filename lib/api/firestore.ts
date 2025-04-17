import firestore from '@react-native-firebase/firestore';
import { User, UserWithPassword } from '@/store/auth';

export const firestoreService = {
  // Auth methods
  async createUser(userData: Omit<UserWithPassword, 'id'>) {
    const userRef = firestore().collection('users').doc();
    await userRef.set({
      ...userData,
      createdAt: firestore.FieldValue.serverTimestamp(),
    });
    return {
      id: userRef.id,
      ...userData,
    };
  },

  async getUserByEmail(email: string): Promise<UserWithPassword | null> {
    const snapshot = await firestore()
      .collection('users')
      .where('email', '==', email)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return null;
    }

    const doc = snapshot.docs[0];
    return {
      id: doc.id,
      ...doc.data(),
    } as UserWithPassword;
  },

  async updateUser(userId: string, data: Partial<UserWithPassword>) {
    await firestore()
      .collection('users')
      .doc(userId)
      .update({
        ...data,
        updatedAt: firestore.FieldValue.serverTimestamp(),
      });
  },

  // Properties methods
  async getProperties(ownerId: string) {
    const snapshot = await firestore()
      .collection('properties')
      .where('ownerId', '==', ownerId)
      .get();

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  },

  async addProperty(propertyData: any) {
    const propertyRef = firestore().collection('properties').doc();
    await propertyRef.set({
      ...propertyData,
      createdAt: firestore.FieldValue.serverTimestamp(),
    });
    return {
      id: propertyRef.id,
      ...propertyData,
    };
  },

  // Payments methods
  async getPayments(userId: string, role: 'owner' | 'tenant') {
    const field = role === 'owner' ? 'ownerId' : 'tenantId';
    const snapshot = await firestore()
      .collection('payments')
      .where(field, '==', userId)
      .orderBy('createdAt', 'desc')
      .get();

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  },

  async recordPayment(paymentData: any) {
    const paymentRef = firestore().collection('payments').doc();
    await paymentRef.set({
      ...paymentData,
      createdAt: firestore.FieldValue.serverTimestamp(),
      status: 'paid',
    });
    return {
      id: paymentRef.id,
      ...paymentData,
    };
  },
};