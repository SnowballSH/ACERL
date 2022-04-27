import {initializeApp} from "firebase/app";
import {collection, getDoc, getDocs, getFirestore} from "@firebase/firestore";
import {getAuth} from "firebase/auth";
import firebase from "firebase/compat";
import Timestamp = firebase.firestore.Timestamp;

const firebaseConfig = {
    apiKey: "AIzaSyCPl0TVYFNzfR7lchUr550St9XFua3pihg",
    authDomain: "acerl-3a1b3.firebaseapp.com",
    projectId: "acerl-3a1b3",
    storageBucket: "acerl-3a1b3.appspot.com",
    messagingSenderId: "884397012708",
    appId: "1:884397012708:web:90152023822faa24b79ef1",
    measurementId: "G-CHELZ4X1BL"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export const db = getFirestore(app);

export interface Engine {
    name: string,
    rating: number,
    stable: boolean,
    games: number,
    author: string,
}

export interface Match {
    engine1: Engine,
    engine2: Engine,
    wins: number,
    draws: number,
    losses: number,
    total: number,
    tc: string,
    diff: number,
    date: number,
}

export async function getEngines(): Promise<Engine[]> {
    const col = collection(db, 'engines');
    const snapshot = await getDocs(col);
    return snapshot.docs.map(doc => doc.data() as Engine);
}

export async function getMatches(): Promise<Match[]> {
    const col = collection(db, 'matches');
    const snapshot = await getDocs(col);
    const matches: Match[] = [];
    for (const doc of snapshot.docs) {
        const dt = doc.data();
        if (dt.engine1 && dt.engine2) {
            const e1 = (await getDoc(dt.engine1)).data();
            const e2 = (await getDoc(dt.engine2)).data();
            console.log((dt.date as Timestamp).toDate());
            const match: Match = {
                engine1: e1 as Engine,
                engine2: e2 as Engine,
                wins: dt.wins as number,
                draws: dt.draws as number,
                losses: dt.losses as number,
                total: dt.total as number,
                tc: dt.tc as string,
                diff: dt.diff as number,
                date: (dt.date as Timestamp).seconds,
            };
            matches.push(match);
        }
    }

    return matches;
}
