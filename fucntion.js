// Sélectionner l'élément input
const file = document.getElementById('csvfile');

// Attacher un événement de changement
file.addEventListener("change", prend_fichier);
let rows = [];

// Fonction pour lire le fichier CSV
function prend_fichier(event) {
    const fichier = event.target.files[0]; // Récupérer le fichier sélectionné
    if (fichier) {
        const lire = new FileReader();
        lire.onload = function (e) {
            const content = e.target.result;
            affichage_colonnes(content); // Appeler affichage avec le contenu du fichier
        };
        lire.readAsText(fichier);
    } else {
        console.error("Aucun fichier sélectionné");
    }
}

// Fonction pour afficher le contenu sous forme de tableau
function affichage_colonnes(contenu) {
    const lines = contenu.split("\n"); //Divise en lignes
    if (lines.length === 0) return;
    rows = [];

    for (let i = 0; i < lines.length; i++) {
        let lignes_i = lines[i].split(","); // Séparer les colonnes par ","
        rows.push(lignes_i);
    }


    // Appel de la fonction pour retirer les lignes vides
    retirerLignesVides();

    let checkboxes = `<fieldset><legend>List colonnes</legend><div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 10px;">`;

    for (let j = 0; j < rows[0].length; j++) {
        // Ajout de chaque input et label avec mise en page par div
        checkboxes += `<div>
            <input type="checkbox" class="colSelect" id="${j}" value="${j}">
            <label for="${j}">${rows[0][j]}</label>
        </div>`;
    }

checkboxes += `</div></fieldset>`;
    document.getElementById("table").innerHTML = checkboxes;
    document.getElementById("table").innerHTML += `<button onclick="afficherTableau()">Afficher</button>`;
    document.getElementById("table").innerHTML += `<button onclick="Similarity()">Similarity</button>`;
}

function afficherTableau() {
    let selectedCols = Array.from(document.querySelectorAll('input.colSelect:checked')).map(input => parseInt(input.value));
    console.log(selectedCols);

    if (selectedCols.length === 0) {
        alert("Veuillez sélectionner au moins une colonne !");
        return;
    }

    // Stocker les colonnes et les lignes dans localStorage
    localStorage.setItem('selectedColumns', JSON.stringify(selectedCols));
    localStorage.setItem('rows', JSON.stringify(rows));

    // Ouvrir une nouvelle fenêtre pour afficher le tableau
    window.open('affichage.html', '_blank');
}

function retirerLignesVides() {
    if (rows.length === 0) {
        console.error("Aucune donnée disponible pour traitement.");
        return;
    }

    // Filtrer les lignes où toutes les colonnes sont vides
    const filteredRows = rows.filter(row => {
        // Vérifier si au moins une des colonnes dans une ligne n'est pas vide
        return row.some(value => value.trim() !== "");
    });

    // Mettre à jour les lignes globales `rows`
    rows = filteredRows;

    console.log("Lignes vides retirées. Voici les données mises à jour :");
    console.log(rows);
}

function Similarity() {
    let selectedCols = Array.from(document.querySelectorAll('input.colSelect:checked')).map(input => parseInt(input.value));
    console.log(selectedCols);

    if (selectedCols.length === 0) {
        alert("Veuillez sélectionner au moins une colonne !");
        return;
    }

    // Stocker les colonnes et les lignes dans localStorage
    localStorage.setItem('selectedColumns', JSON.stringify(selectedCols));
    localStorage.setItem('rows', JSON.stringify(rows));

    // Ouvrir la nouvelle page
    window.open("similarity.html", "_blank");
}
