import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
      import {
        getFirestore,
        collection,
        addDoc,
      } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

      const firebaseConfig = {
        apiKey: "AIzaSyCM63iWAvr2RX6sznW3ITGR-5xuEmqFsak",
        authDomain: "bandmate-ccc78.firebaseapp.com",
        projectId: "bandmate-ccc78",
        storageBucket: "bandmate-ccc78.firebasestorage.app",
        messagingSenderId: "950565367393",
        appId: "1:950565367393:web:07138ca8c00d987d804420",
      };

      const app = initializeApp(firebaseConfig);
      const db = getFirestore(app);

      
      // validates the form, saves to Firestore, shows success.
     
      window.submitProfile = async function () {
        const btn = document.getElementById("submit-btn");
        const errorEl = document.getElementById("form-error");
        const successEl = document.getElementById("form-success");

        const name = document.getElementById("name").value.trim();
        const instrument = document.getElementById("instrument").value;
        const experience = document.getElementById("experience").value;
        const genresRaw = document.getElementById("genres").value;
        const city = document.getElementById("city").value.trim();
        const state = document.getElementById("state").value.trim();
        const bio = document.getElementById("bio").value.trim();

        // validate required fields
        errorEl.style.display = "none";
        if (!name) {
          showError("Please enter your name.");
          return;
        }
        if (!instrument) {
          showError("Please select your primary instrument.");
          return;
        }
        if (!city) {
          showError("Please enter your city.");
          return;
        }

        // prepares data 
        // split "Indie Rock, Jazz" → ["Indie Rock", "Jazz"]
        const genres = genresRaw
          .split(",")
          .map((g) => g.trim())
          .filter(Boolean);

        // disable button so user can't double-submit
        btn.disabled = true;
        btn.textContent = "Saving...";

        try {
          // save a new document to the "musicians" collection in my Firestore database.
          // addDoc auto-generates a unique ID for each submission.
          await addDoc(collection(db, "musicians"), {
            name,
            instrument,
            experience: experience ? Number(experience) : null,
            genres,
            city,
            state,
            bio,
            createdAt: new Date().toISOString(),
          });

          // show success, hide button
          successEl.style.display = "block";
          btn.style.display = "none";

          // clear the form after submission
          [
            "name",
            "instrument",
            "experience",
            "genres",
            "city",
            "state",
            "bio",
          ].forEach((id) => (document.getElementById(id).value = ""));
        } catch (err) {
          // re-enable button so they can try again
          btn.disabled = false;
          btn.textContent = "Create My Profile";
          showError(
            "Something went wrong. Check your Firebase config in the code."
          );
          console.error("Firebase error:", err);
        }
      };

      function showError(msg) {
        const el = document.getElementById("form-error");
        el.textContent = msg;
        el.style.display = "block";
      }