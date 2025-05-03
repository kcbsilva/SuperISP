// src/services/firestore/pops.ts
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  query,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import type { Pop, PopData } from '@/types/pops'; // Assuming types are defined here

const popsCollectionRef = collection(db, 'pops');

// Function to add a new PoP
export const addPop = async (popData: PopData): Promise<string> => {
  try {
    const docRef = await addDoc(popsCollectionRef, {
        ...popData,
        createdAt: Timestamp.now(), // Add a timestamp
        status: 'Active', // Default status
    });
    console.log("PoP added with ID: ", docRef.id);
    return docRef.id;
  } catch (e) {
    console.error("Error adding PoP: ", e);
    throw new Error('Failed to add PoP');
  }
};

// Function to get all PoPs
export const getPops = async (): Promise<Pop[]> => {
  try {
    const q = query(popsCollectionRef, orderBy('createdAt', 'desc')); // Order by creation time
    const querySnapshot = await getDocs(q);
    const pops: Pop[] = [];
    querySnapshot.forEach((doc) => {
      pops.push({ id: doc.id, ...doc.data() } as Pop);
    });
    console.log("Fetched PoPs: ", pops.length);
    return pops;
  } catch (e) {
    console.error("Error getting PoPs: ", e);
    throw new Error('Failed to fetch PoPs');
  }
};

// Function to delete a PoP
export const deletePop = async (id: string): Promise<void> => {
  try {
    const popDocRef = doc(db, 'pops', id);
    await deleteDoc(popDocRef);
    console.log("PoP deleted with ID: ", id);
  } catch (e) {
    console.error("Error deleting PoP: ", e);
    throw new Error('Failed to delete PoP');
  }
};

// Function to update a PoP (example structure)
export const updatePop = async (id: string, data: Partial<PopData>): Promise<void> => {
  try {
    const popDocRef = doc(db, 'pops', id);
    await updateDoc(popDocRef, {
        ...data,
        updatedAt: Timestamp.now(), // Add an update timestamp
    });
    console.log("PoP updated with ID: ", id);
  } catch (e) {
    console.error("Error updating PoP: ", e);
    throw new Error('Failed to update PoP');
  }
};
