import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import React, { useState } from "react";
import { auth } from 'firebaseui';
import { getAuth } from 'firebase/auth';


function AuthSetUp() {
    // Your web app's Firebase configuration
    const firebaseConfig = {
        apiKey: "AIzaSyBntxTC0UhgKZ_8BvG6bEpIqzMKyP_e8cA",
        authDomain: "rank-db-a0fb9.firebaseapp.com",
        projectId: "rank-db-a0fb9",
        storageBucket: "rank-db-a0fb9.appspot.com",
        messagingSenderId: "700667428854",
        appId: "1:700667428854:web:c2900ac750c02c5e6a51d7"
    };

    firebase.initializeApp(firebaseConfig);
    return <></>
}

export default AuthSetUp;
