importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging.js');

const firebaseConfig = {
    apiKey: "AIzaSyBChm9rimvWhOyp8eTVWjrS0OEoynAU29M",
    authDomain: "curignite-33bbc.firebaseapp.com",
    projectId: "curignite-33bbc",
    storageBucket: "curignite-33bbc.appspot.com",
    messagingSenderId: "229415722426",
    appId: "1:229415722426:web:b6018752da9041366cd183",
    measurementId: "G-VM822B0ETV"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    console.log('Received background message ', payload);
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});
