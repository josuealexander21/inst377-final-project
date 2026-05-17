
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
      import {
        getFirestore,
        collection,
        getDocs,
      } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";
const firebaseConfig = {
    apiKey: "AIzaSyCM63iWAvr2RX6sznW3ITGR-5xuEmqFsak",
    authDomain: "bandmate-ccc78.firebaseapp.com",
    projectId: "bandmate-ccc78",
    storageBucket: "bandmate-ccc78.firebasestorage.app",
    messagingSenderId: "950565367393",
    appId: "1:950565367393:web:07138ca8c00d987d804420",
  };

  // initialize Firebase
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  // gets a different colored avatar
  const avatarColors = [
    "av-red",
    "av-blue",
    "av-amber",
    "av-purple",
    "av-teal",
    "av-green",
  ];

  // buildCard(musician, index)
  // takes one Firestore document's data and returns a card element.

  function buildCard(m, index) {
    const card = document.createElement("div");
    card.className = "musician-card";

    // picks an avatar color based on position in the list
    const av = avatarColors[index % avatarColors.length];

    // first name initial for the avatar circle
    const initial = m.name ? m.name[0].toUpperCase() : "?";

    // build genre filters from the genres array
    const tagsHTML = (m.genres || [])
      .map((g) => `<span class="tag genre">${g}</span>`)
      .join("");

    // experience text - accomodates missing data and pluralization
    const expText = m.experience
      ? `${m.instrument} · ${m.experience} yr${
          m.experience == 1 ? "" : "s"
        } exp`
      : m.instrument || "Musician";

    card.innerHTML = `
    <div class="card-top">
      <div class="avatar ${av}">${initial}</div>
    </div>
    <div class="card-name">${m.name || "Unknown"}</div>
    <div class="card-role">${expText}</div>
    <div class="card-tags">${tagsHTML}</div>
    ${
      m.bio
        ? `<p style="font-size:12px;color:#555;margin-bottom:1rem;line-height:1.5;">${m.bio}</p>`
        : ""
    }
    <div class="card-meta">
      <div>
        <div class="card-location">${m.city || ""}${
      m.state ? ", " + m.state : ""
    }</div>
      
    </div>
  `;

    return card;
  }

  // clears the grid and fills it with the given array.
  // called on load and again when a filter chip is clicked.

  function renderGrid(data) {
    const grid = document.getElementById("musicians-grid");
    const status = document.getElementById("musicians-status");

    grid.innerHTML = "";

    if (data.length === 0) {
      status.textContent = "No musicians match that filter.";
      return;
    }

    status.textContent = "";
    data.forEach((m, i) => grid.appendChild(buildCard(m, i)));
  }

  // reads all unique instruments from the data and builds
  // filter chips dynamically from real submitted data.

  function buildFilterBar(allMusicians) {
    const bar = document.getElementById("filter-bar");
    bar.innerHTML = "";

    // collect unique instruments from the data
    const instruments = [
      "All",
      ...new Set(allMusicians.map((m) => m.instrument).filter(Boolean)),
    ];

    instruments.forEach((label, i) => {
      const btn = document.createElement("button");
      btn.className = "filter-chip" + (i === 0 ? " active" : "");
      btn.textContent = label;

      btn.addEventListener("click", () => {
        // update active chip
        document
          .querySelectorAll(".filter-chip")
          .forEach((c) => c.classList.remove("active"));
        btn.classList.add("active");

        // filter data
        const filtered =
          label === "All"
            ? allMusicians
            : allMusicians.filter((m) => m.instrument === label);

        renderGrid(filtered);
      });

      bar.appendChild(btn);
    });
  }

  
  // reads all documents from the "musicians" firestore collection and renders them as cards.
  
  async function loadMusicians() {
    const status = document.getElementById("musicians-status");
    const countLabel = document.getElementById("count-label");

    try {
      // fetch all documents from the "musicians" collection
      const snapshot = await getDocs(collection(db, "musicians"));

      if (snapshot.empty) {
        status.textContent = "No musicians yet — be the first to join!";
        countLabel.textContent = "0 members";
        return;
      }

      // convert firestore snapshot into a plain JS array
      const musicians = [];
      snapshot.forEach((doc) => musicians.push(doc.data()));

      // update the hero count
      countLabel.textContent = `${musicians.length} member${
        musicians.length === 1 ? "" : "s"
      }`;

      // build filter chips from real data, then render grid
      buildFilterBar(musicians);
      renderGrid(musicians);
    } catch (err) {
      status.textContent =
        "Could not load musicians. Check your Firebase config.";
      console.error("Firebase error:", err);
    }
  }

  // run on page load
  loadMusicians();